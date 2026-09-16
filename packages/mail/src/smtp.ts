import { Buffer } from "node:buffer";
import { createConnection, type Socket } from "node:net";

/**
 * A MINIMAL SMTP CLIENT, FOR LOCAL MAIL CATCHERS ONLY.
 *
 * Production mail goes through Resend, which is an HTTPS API. MailHog and
 * Mailpit only speak SMTP, so there is no configuration of Resend that can
 * point at them: testing the real email locally needs a second transport, and
 * this is it.
 *
 * Deliberately hand-rolled rather than pulling in a mail library. The job is
 * one conversation with a catcher running on localhost with no authentication
 * and no TLS, which is about sixty lines; a general-purpose SMTP client that
 * handles STARTTLS, SASL and delivery retries is a large dependency to carry
 * for something that must never run in production anyway.
 *
 * **It refuses to run in production.** See `sendViaSmtp`. A stray environment
 * variable on a deployed instance must not be able to silently divert real
 * merchant email to a socket nobody is reading.
 */

const SMTP_TIMEOUT_MS = 5000;
/** RFC 2045 caps base64 body lines at 76 characters. */
const BASE64_LINE_LENGTH = 76;
/**
 * The end of an SMTP reply: a status code followed by a SPACE. A code followed
 * by a hyphen (`250-PIPELINING`) is a continuation line and more is coming.
 */
const REPLY_TERMINATOR = /^\d{3} [^\n]*\n/m;
/** Pulls `a@b.com` out of `Display Name <a@b.com>`. */
const ANGLE_ADDRESS = /<([^>]+)>/;

/**
 * The bare address for an SMTP envelope.
 *
 * `From:` is a header and may carry a display name; `MAIL FROM:` is the
 * envelope and may not. Passing `Anurag <anurag@edgecoms.com>` straight through
 * produces `MAIL FROM:<Anurag <anurag@edgecoms.com>>`, which is malformed and
 * which a real catcher or MTA will refuse.
 */
export function envelopeAddress(value: string): string {
	return ANGLE_ADDRESS.exec(value)?.[1]?.trim() ?? value.trim();
}

/** An image carried inside the message and referenced from the HTML by `cid:`. */
export interface InlineImage {
	base64: string;
	cid: string;
	filename: string;
}

export interface SmtpMessage {
	from: string;
	html: string;
	/** Optional. Without it the message is a plain multipart/alternative. */
	inlineImage?: InlineImage;
	subject: string;
	text: string;
	to: string;
}

/** Wraps already-encoded base64 to the line limit. */
function wrapBase64Raw(encoded: string): string {
	const lines: string[] = [];
	for (let i = 0; i < encoded.length; i += BASE64_LINE_LENGTH) {
		lines.push(encoded.slice(i, i + BASE64_LINE_LENGTH));
	}
	return lines.join("\r\n");
}

function wrapBase64(value: string): string {
	const encoded = Buffer.from(value, "utf8").toString("base64");
	return wrapBase64Raw(encoded);
}

/**
 * The RFC 5322 message: headers, then a multipart/alternative body carrying the
 * plain-text and HTML renderings.
 *
 * Both parts are base64 encoded. That is not about size: it sidesteps line
 * length limits and, more usefully here, dot-stuffing. A body line consisting
 * of a single "." terminates the DATA command, and the base64 alphabet cannot
 * produce one, so the encoded body is safe to write straight to the socket.
 *
 * Exported so the message can be asserted against without a server running.
 */
export function buildMimeMessage(
	message: SmtpMessage,
	boundary: string,
	date: Date
): string {
	const alternative = [
		`--${boundary}alt`,
		'Content-Type: text/plain; charset="utf-8"',
		"Content-Transfer-Encoding: base64",
		"",
		wrapBase64(message.text),
		`--${boundary}alt`,
		'Content-Type: text/html; charset="utf-8"',
		"Content-Transfer-Encoding: base64",
		"",
		wrapBase64(message.html),
		`--${boundary}alt--`,
	];

	const headers = [
		`From: ${message.from}`,
		`To: ${message.to}`,
		`Subject: ${message.subject}`,
		`Date: ${date.toUTCString()}`,
		"MIME-Version: 1.0",
	];

	/* No image: the message IS the alternative, and nothing needs wrapping. */
	if (!message.inlineImage) {
		return [
			...headers,
			`Content-Type: multipart/alternative; boundary="${boundary}alt"`,
			"",
			...alternative,
			"",
		].join("\r\n");
	}

	/**
	 * With an image, the structure is multipart/RELATED wrapping the
	 * alternative. `related` is what tells a client the image is part of the
	 * HTML rather than a file to offer as a download, and it is what makes the
	 * `cid:` in the markup resolve.
	 */
	const image = message.inlineImage;
	return [
		...headers,
		`Content-Type: multipart/related; boundary="${boundary}rel"`,
		"",
		`--${boundary}rel`,
		`Content-Type: multipart/alternative; boundary="${boundary}alt"`,
		"",
		...alternative,
		`--${boundary}rel`,
		`Content-Type: image/png; name="${image.filename}"`,
		"Content-Transfer-Encoding: base64",
		`Content-ID: <${image.cid}>`,
		`Content-Disposition: inline; filename="${image.filename}"`,
		"",
		wrapBase64Raw(image.base64),
		`--${boundary}rel--`,
		"",
	].join("\r\n");
}

/** Reads one SMTP reply, which may span several `250-` continuation lines. */
function createReplyReader(socket: Socket) {
	let buffer = "";
	let resolveReply: ((reply: string) => void) | null = null;
	let rejectReply: ((error: Error) => void) | null = null;

	const flush = () => {
		if (!resolveReply) {
			return;
		}
		/* A reply ends at the first line whose code is followed by a space
		   rather than a hyphen. Anything before that is a continuation. */
		const match = REPLY_TERMINATOR.exec(buffer);
		if (!match) {
			return;
		}
		const end = match.index + match[0].length;
		const reply = buffer.slice(0, end);
		buffer = buffer.slice(end);
		const settle = resolveReply;
		resolveReply = null;
		rejectReply = null;
		settle(reply);
	};

	socket.on("data", (chunk) => {
		buffer += chunk.toString("utf8");
		flush();
	});
	socket.on("error", (error) => rejectReply?.(error));

	return () =>
		new Promise<string>((resolve, reject) => {
			resolveReply = resolve;
			rejectReply = reject;
			flush();
		});
}

function expect(reply: string, code: string, step: string): void {
	if (!reply.startsWith(code)) {
		throw new Error(`SMTP ${step} expected ${code}, got: ${reply.trim()}`);
	}
}

/**
 * Deliver one message to a local catcher.
 *
 * `url` is an `smtp://host:port`. No authentication and no TLS, because the
 * only thing this is allowed to talk to is a mail catcher on the developer's
 * own machine.
 */
export async function sendViaSmtp(
	url: string,
	message: SmtpMessage,
	now: Date = new Date()
): Promise<void> {
	if (process.env.NODE_ENV === "production") {
		throw new Error(
			"The SMTP transport is a local development tool and must not run in production."
		);
	}

	const parsed = new URL(url);
	const socket = createConnection({
		host: parsed.hostname,
		port: Number(parsed.port || "1025"),
	});
	socket.setTimeout(SMTP_TIMEOUT_MS);
	socket.setEncoding("utf8");

	const readReply = createReplyReader(socket);

	try {
		await new Promise<void>((resolve, reject) => {
			socket.once("connect", () => resolve());
			socket.once("error", reject);
			socket.once("timeout", () =>
				reject(new Error(`SMTP connection to ${url} timed out`))
			);
		});

		const say = async (line: string, code: string, step: string) => {
			socket.write(`${line}\r\n`);
			expect(await readReply(), code, step);
		};

		expect(await readReply(), "220", "greeting");
		await say("EHLO localhost", "250", "EHLO");
		await say(
			`MAIL FROM:<${envelopeAddress(message.from)}>`,
			"250",
			"MAIL FROM"
		);
		await say(`RCPT TO:<${envelopeAddress(message.to)}>`, "250", "RCPT TO");
		await say("DATA", "354", "DATA");

		const boundary = `edgecoms-${now.getTime().toString(36)}`;
		socket.write(buildMimeMessage(message, boundary, now));
		await say(".", "250", "message body");
		socket.write("QUIT\r\n");
	} finally {
		socket.destroy();
	}
}
