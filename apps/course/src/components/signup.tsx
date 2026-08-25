"use client";

import { Check, Loader2 } from "lucide-react";
import { useActionState, useEffect, useId, useRef } from "react";
import { submitLead } from "@/app/actions";
import { Container, CtaButton, cx, PriceTag, Section } from "@/components/ui";
import {
	COURSE_INCLUSIONS,
	CURRENT_PRICE,
	LIST_PRICE,
	PRIVACY_NOTICE,
	SHOW_STRUCK_PRICE,
} from "@/lib/content";
import type { LeadState } from "@/lib/lead-schema";

const INITIAL: LeadState = { status: "idle" };

const FIELD_CLASS =
	"h-12 w-full rounded-[10px] border bg-white/5 px-4 text-paper text-base placeholder:text-muted-dark focus-visible:outline-none";

/** One field, with its label, error, and the wiring between them. */
function Field({
	autoComplete,
	defaultValue,
	error,
	label,
	name,
	placeholder,
	type = "text",
}: {
	autoComplete: string;
	defaultValue?: string;
	error?: string;
	label: string;
	name: string;
	placeholder: string;
	type?: string;
}) {
	const id = useId();
	const errorId = `${id}-error`;

	return (
		<div className="flex flex-col gap-1.5">
			<label className="font-medium text-paper/80 text-sm" htmlFor={id}>
				{label}
			</label>
			<input
				aria-describedby={error ? errorId : undefined}
				aria-invalid={error ? true : undefined}
				autoComplete={autoComplete}
				className={cx(
					FIELD_CLASS,
					error
						? "border-red-400 focus-visible:border-red-400"
						: "border-ink-border focus-visible:border-accent"
				)}
				// React 19 resets an uncontrolled form on every submit, whatever the
				// outcome. Without this the visitor's answers vanish the moment one
				// field is rejected. The value comes back from the action.
				defaultValue={defaultValue}
				id={id}
				name={name}
				placeholder={placeholder}
				required
				type={type}
			/>
			{error ? (
				/* `role="alert"` because nothing else announces this. The message is
				   produced by a server round trip, focus is on the submit button (and
				   is dropped entirely when that button disables), and
				   `aria-describedby` is only read when focus reaches the input — so
				   without a live region a screen reader user is told nothing at all
				   and assumes the form went through. */
				<p className="text-red-400 text-sm" id={errorId} role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

/**
 * THE OFFER AND THE FORM.
 *
 * The success state replaces the form rather than sitting under it, so nobody
 * fills it in twice wondering whether the first one worked. Errors are reported
 * honestly — see `submitLead`, which only reports success once a row is
 * actually committed.
 */
export function Signup() {
	const [state, formAction, pending] = useActionState(submitLead, INITIAL);
	const formRef = useRef<HTMLFormElement>(null);
	const successRef = useRef<HTMLHeadingElement>(null);

	const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;
	const values = state.status === "error" ? state.values : undefined;

	/*
	 * Focus has to be put somewhere deliberately after every submission.
	 *
	 * The submit button is disabled while pending, which makes the browser blur
	 * it, so focus falls to <body> on BOTH outcomes. On success the whole form
	 * then unmounts. Left alone, a keyboard or screen reader user is silently
	 * returned to the top of a very long page with no idea what happened.
	 */
	useEffect(() => {
		if (state.status === "success") {
			successRef.current?.focus();
			return;
		}

		if (state.status === "error") {
			const firstInvalid =
				formRef.current?.querySelector<HTMLInputElement>("[aria-invalid]");
			firstInvalid?.focus();
		}
	}, [state]);

	return (
		<Section id="get-access">
			<Container>
				{/*
				 * A live region that exists on first paint and is written into later.
				 * Announcing reliably requires the region to already be in the
				 * accessibility tree before its contents change — inserting the node
				 * and its text in one commit, which is what the success block used to
				 * do, is silent on several screen reader and browser pairs.
				 */}
				<div aria-live="polite" className="sr-only" role="status">
					{state.status === "success" ? state.message : ""}
				</div>

				<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
					{/* ── The offer ───────────────────────────────────────────────── */}
					<div className="flex flex-col gap-6">
						<p className="font-semibold text-accent text-xs uppercase tracking-[0.18em]">
							Get access
						</p>

						<h2 className="text-balance font-bold text-section">
							{SHOW_STRUCK_PRICE ? (
								<>
									It was {LIST_PRICE}.{" "}
									<span className="text-accent">Now it's free.</span>
								</>
							) : (
								<>
									Free <span className="text-accent">while it's in beta.</span>
								</>
							)}
						</h2>

						<PriceTag
							currentClassName="font-bold text-5xl text-accent sm:text-6xl"
							listClassName="font-bold text-4xl text-muted-dark line-through decoration-2"
						/>

						<p className="text-pretty text-muted leading-relaxed sm:text-lg">
							Tell us where to send it and the whole course is yours — every
							module, every template, every future update. No card, no trial,
							nothing to cancel.
						</p>

						<ul className="flex flex-col gap-2.5">
							{COURSE_INCLUSIONS.map((item) => (
								<li
									className="flex items-start gap-3 text-paper/90 text-sm"
									key={item.title}
								>
									<Check
										aria-hidden="true"
										className="mt-0.5 size-4 shrink-0 text-accent"
									/>
									{item.title}
								</li>
							))}
						</ul>
					</div>

					{/* ── The form ────────────────────────────────────────────────── */}
					<div className="rounded-2xl border border-ink-border bg-ink-raised p-6 sm:p-8">
						{state.status === "success" ? (
							<div className="flex flex-col items-center gap-4 py-8 text-center">
								<span className="flex size-12 items-center justify-center rounded-full bg-accent/15">
									<Check aria-hidden="true" className="size-6 text-accent" />
								</span>
								{/* Focused on arrival, so the confirmation is where the
								    reader lands rather than the top of the page. */}
								<h3
									className="font-bold text-2xl text-paper"
									ref={successRef}
									tabIndex={-1}
								>
									You're in
								</h3>
								<p className="text-pretty text-muted leading-relaxed">
									{state.message}
								</p>
							</div>
						) : (
							<form
								action={formAction}
								className="flex flex-col gap-4"
								ref={formRef}
							>
								<div className="flex flex-col gap-1">
									<h3 className="font-bold text-paper text-xl">
										Send me the course
									</h3>
									<p className="text-muted text-sm">
										Three fields. We'll email your access link.
									</p>
								</div>

								<Field
									autoComplete="name"
									defaultValue={values?.name}
									error={fieldErrors?.name}
									label="Your name"
									name="name"
									placeholder="Alex Mercer"
								/>
								<Field
									autoComplete="email"
									defaultValue={values?.email}
									error={fieldErrors?.email}
									label="Email address"
									name="email"
									placeholder="alex@yourstore.com"
									type="email"
								/>
								<Field
									autoComplete="tel"
									defaultValue={values?.phone}
									error={fieldErrors?.phone}
									label="Phone number"
									name="phone"
									placeholder="+1 555 000 1234"
									type="tel"
								/>

								{/* Honeypot. Hidden from people and from assistive tech; a bot
								    that fills it gets a success response and is quietly
								    dropped, because telling it that it failed only makes it
								    try again. */}
								<div aria-hidden="true" className="hidden">
									<label htmlFor="website">Website</label>
									<input
										autoComplete="off"
										id="website"
										name="website"
										tabIndex={-1}
										type="text"
									/>
								</div>

								{state.status === "error" && !fieldErrors ? (
									<p
										className="rounded-[10px] border border-red-400/40 bg-red-400/10 px-4 py-3 text-red-300 text-sm leading-relaxed"
										role="alert"
									>
										{state.message}
									</p>
								) : null}

								<CtaButton disabled={pending} type="submit">
									{pending ? (
										<>
											<Loader2
												aria-hidden="true"
												className="size-4 animate-spin"
											/>
											Sending…
										</>
									) : (
										`Send me the course — ${CURRENT_PRICE.toLowerCase()}`
									)}
								</CtaButton>

								<p className="text-muted-dark text-xs leading-relaxed">
									{PRIVACY_NOTICE}
								</p>
							</form>
						)}
					</div>
				</div>
			</Container>
		</Section>
	);
}
