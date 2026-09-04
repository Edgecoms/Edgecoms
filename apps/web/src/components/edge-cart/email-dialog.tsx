"use client";

import {
	Dialog,
	DialogBackdrop,
	DialogPopup,
	DialogPortal,
	DialogTitle,
} from "@edgecoms/ui/components/dialog";
import { cn } from "@edgecoms/ui/lib/utils";
import { X } from "lucide-react";
import {
	createContext,
	type FormEvent,
	type ReactNode,
	type RefObject,
	useCallback,
	useContext,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	EDGE_CART_APP_STORE_URL,
	HONEYPOT_FIELD,
	type LeadSource,
	leadSchema,
} from "@/lib/edge-cart-lead";
import { trackGa4Event } from "@/lib/ga4";
import { trackStandard } from "@/lib/meta-pixel";

/**
 * THE "SEND IT TO ME" DIALOG.
 *
 * One instance for the whole page, opened from three places. A dialog per
 * button would mean three copies of the form, three success states and three
 * chances for the conversion tracking to be wired to only two of them, so the
 * button carries a `source` and the dialog is mounted once at the page root.
 *
 * Focus: Base UI's `Dialog` owns the trap, the Escape key, the scroll lock and
 * the backdrop dismiss. The two things it cannot infer are supplied here —
 * `initialFocus` to put the caret in the email field, and `finalFocus` to send
 * focus back to whichever of the three buttons was pressed, which the provider
 * remembers because there is no `DialogTrigger` to derive it from.
 */

type OpenDialog = (source: LeadSource, trigger: HTMLElement | null) => void;

const EmailDialogContext = createContext<OpenDialog | null>(null);

function useOpenEmailDialog(): OpenDialog {
	const open = useContext(EmailDialogContext);
	if (!open) {
		throw new Error("SendItToMeButton must be used inside EmailDialogProvider");
	}
	return open;
}

type Status = "editing" | "sending" | "sent";

/** Mirrors the page's primary/secondary buttons so the trigger is not a third style. */
type ButtonTone = "primary" | "secondary" | "dark-outline";

const TONE_CLASS: Record<ButtonTone, string> = {
	"dark-outline":
		"border border-white/25 bg-transparent text-white hover:bg-white/10",
	primary: "bg-black text-white shadow-xs hover:bg-neutral-800",
	secondary:
		"border border-neutral-200 bg-white text-neutral-900 shadow-2xs hover:bg-neutral-50",
};

/**
 * A "Send it to me" button. Every one of them opens the same dialog and hands
 * it a different `source`.
 */
export function SendItToMeButton({
	className,
	source,
	tone = "primary",
}: {
	className?: string;
	source: LeadSource;
	tone?: ButtonTone;
}) {
	const open = useOpenEmailDialog();

	return (
		<button
			className={cn(
				"inline-flex h-11 items-center justify-center rounded-lg px-5 font-semibold text-sm transition-colors",
				TONE_CLASS[tone],
				className
			)}
			onClick={(event) => open(source, event.currentTarget)}
			type="button"
		>
			Send it to me
		</button>
	);
}

function SuccessState({ onClose }: { onClose: () => void }) {
	return (
		<div>
			<DialogTitle className="font-bold font-satoshi text-2xl text-neutral-900 tracking-tight">
				Check your inbox.
			</DialogTitle>
			<p className="mt-3 text-neutral-500 text-sm leading-relaxed">
				It should land within a minute. If it does not, look in Promotions.
			</p>
			<a
				className="mt-6 inline-flex font-semibold text-blue-700 text-sm underline underline-offset-4 hover:text-blue-800"
				href={EDGE_CART_APP_STORE_URL}
				onClick={onClose}
				rel="noopener noreferrer"
				target="_blank"
			>
				Install Edge Cart free
			</a>
		</div>
	);
}

function LeadForm({
	emailRef,
	onSent,
	source,
}: {
	emailRef: RefObject<HTMLInputElement | null>;
	onSent: () => void;
	source: LeadSource;
}) {
	const emailId = useId();
	const storeUrlId = useId();
	const storeUrlHelpId = useId();
	const errorId = useId();

	const [email, setEmail] = useState("");
	const [storeUrl, setStoreUrl] = useState("");
	const [honeypot, setHoneypot] = useState("");
	const [status, setStatus] = useState<Status>("editing");
	const [error, setError] = useState<string | null>(null);

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (status === "sending") {
			return;
		}

		const payload = {
			[HONEYPOT_FIELD]: honeypot,
			email: email.trim(),
			source,
			storeUrl: storeUrl.trim() || undefined,
		};

		const parsed = leadSchema.safeParse(payload);
		if (!parsed.success) {
			setError(
				parsed.error.issues[0]?.message ?? "Check the details and try again."
			);
			return;
		}

		setError(null);
		setStatus("sending");

		try {
			const response = await fetch("/api/edge-cart/send-guide", {
				body: JSON.stringify(parsed.data),
				headers: { "content-type": "application/json" },
				method: "POST",
			});

			if (!response.ok) {
				const body = (await response.json().catch(() => null)) as {
					error?: string;
				} | null;
				setError(
					body?.error ?? "That did not go through. Try again in a moment."
				);
				setStatus("editing");
				return;
			}

			/**
			 * On a confirmed submit only, never on open. A dialog opening is not a
			 * lead, and counting it as one is how a campaign optimises toward
			 * people who look at forms.
			 */
			trackStandard("Lead", {
				content_name: "Edge Cart setup playbook",
				source,
			});
			trackGa4Event("generate_lead", {
				content_name: "Edge Cart setup playbook",
				source,
			});

			setStatus("sent");
			onSent();
		} catch {
			setError("That did not go through. Try again in a moment.");
			setStatus("editing");
		}
	};

	if (status === "sent") {
		return null;
	}

	return (
		<form className="mt-6" noValidate onSubmit={submit}>
			<label
				className="block font-medium text-neutral-900 text-sm"
				htmlFor={emailId}
			>
				Work email
			</label>
			<input
				aria-describedby={error ? errorId : undefined}
				aria-invalid={error ? "true" : undefined}
				autoComplete="email"
				className={cn(
					"mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-neutral-900 text-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30",
					error ? "border-rose-400" : "border-neutral-200"
				)}
				id={emailId}
				name="email"
				onChange={(event) => setEmail(event.target.value)}
				placeholder="you@yourstore.com"
				ref={emailRef}
				required
				type="email"
				value={email}
			/>

			{error ? (
				<p className="mt-2 text-rose-600 text-xs" id={errorId} role="alert">
					{error}
				</p>
			) : null}

			<label
				className="mt-5 block font-medium text-neutral-900 text-sm"
				htmlFor={storeUrlId}
			>
				Store URL{" "}
				<span className="font-normal text-neutral-400">(optional)</span>
			</label>
			<input
				aria-describedby={storeUrlHelpId}
				autoComplete="url"
				className="mt-1.5 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-neutral-900 text-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
				id={storeUrlId}
				name="storeUrl"
				onChange={(event) => setStoreUrl(event.target.value)}
				placeholder="yourstore.com"
				type="text"
				value={storeUrl}
			/>
			<p className="mt-1.5 text-neutral-500 text-xs" id={storeUrlHelpId}>
				Add it and we will include a short teardown of your current cart.
			</p>

			{/* The honeypot. Hidden from sight and from the accessibility tree, and
			    out of the tab order, so only a form-filler ever reaches it. */}
			<div aria-hidden="true" className="hidden">
				<label htmlFor={HONEYPOT_FIELD}>Company</label>
				<input
					autoComplete="off"
					id={HONEYPOT_FIELD}
					name={HONEYPOT_FIELD}
					onChange={(event) => setHoneypot(event.target.value)}
					tabIndex={-1}
					type="text"
					value={honeypot}
				/>
			</div>

			<button
				className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-black px-5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800 disabled:opacity-60"
				disabled={status === "sending"}
				type="submit"
			>
				{status === "sending" ? "Sending" : "Send it"}
			</button>
			<p className="mt-3 text-center text-neutral-500 text-xs">
				One email. Unsubscribe any time.
			</p>
		</form>
	);
}

/**
 * Mounts the single dialog and hands `SendItToMeButton` the opener.
 */
export function EmailDialogProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [source, setSource] = useState<LeadSource>("hero");
	const [sent, setSent] = useState(false);
	const emailInputRef = useRef<HTMLInputElement>(null);
	const triggerRef = useRef<HTMLElement | null>(null);

	const openDialog = useCallback<OpenDialog>((nextSource, trigger) => {
		triggerRef.current = trigger;
		setSource(nextSource);
		setSent(false);
		setOpen(true);
	}, []);

	const value = useMemo(() => openDialog, [openDialog]);

	return (
		<EmailDialogContext.Provider value={value}>
			{children}

			<Dialog onOpenChange={setOpen} open={open}>
				<DialogPortal>
					<DialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
					<DialogPopup
						className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl transition-all duration-200 data-[ending-style]:scale-[0.97] data-[starting-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 sm:p-7"
						finalFocus={triggerRef}
						initialFocus={emailInputRef}
					>
						<button
							aria-label="Close"
							className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
							onClick={() => setOpen(false)}
							type="button"
						>
							<X className="size-4" />
						</button>

						{sent ? (
							<SuccessState onClose={() => setOpen(false)} />
						) : (
							<div>
								<DialogTitle className="pr-8 font-bold font-satoshi text-2xl text-neutral-900 tracking-tight">
									Where should we send it?
								</DialogTitle>
								<p className="mt-3 text-neutral-500 text-sm leading-relaxed">
									We will email you the Edge Cart setup playbook. The four
									levers, the threshold math, and the four upsell rules worth
									writing first. Your install link is in there too.
								</p>
								<LeadForm
									emailRef={emailInputRef}
									onSent={() => setSent(true)}
									source={source}
								/>
							</div>
						)}
					</DialogPopup>
				</DialogPortal>
			</Dialog>
		</EmailDialogContext.Provider>
	);
}
