/**
 * Moved to `@edgecoms/mail/smtp` so the auth package can send mail as well.
 *
 * Re-exported here so the Edge Cart playbook email and its tests keep importing
 * from the path they always have. That flow is deliberately untouched by the
 * move.
 */
// biome-ignore lint/performance/noBarrelFile: a compatibility shim for one moved module, not a barrel.
export {
	buildMimeMessage,
	envelopeAddress,
	type InlineImage,
	type SmtpMessage,
	sendViaSmtp,
} from "@edgecoms/mail/smtp";
