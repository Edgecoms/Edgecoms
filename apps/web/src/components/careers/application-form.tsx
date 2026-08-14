"use client";

import { type FormEvent, useId, useState } from "react";

/**
 * The job application form.
 *
 * There is no applications backend and no file storage on this site yet, so
 * rather than accept a submission we cannot deliver, this composes the filled
 * form into an email to careers@edgecoms.com and hands it to the candidate's
 * mail client. Nothing is silently dropped: either the mail client opens or the
 * candidate is shown the address to write to directly.
 *
 * For the same reason the resume is asked for as a **link** rather than an
 * upload. When an endpoint and blob storage exist, swap `handleSubmit` for the
 * POST and restore the file field.
 */

const INPUT_CLASS =
	"w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 text-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900";

const LABEL_CLASS = "font-medium text-neutral-700 text-xs";

const CAREERS_EMAIL = "careers@edgecoms.com";

function Required() {
	return <span className="text-red-500">*</span>;
}

export function ApplicationForm({
	portfolioLabel,
	roleTitle,
}: {
	portfolioLabel: string;
	roleTitle: string;
}) {
	const nameId = useId();
	const emailId = useId();
	const locationId = useId();
	const resumeId = useId();
	const whyId = useId();
	const linkedinId = useId();
	const portfolioId = useId();
	const xId = useId();

	const [sent, setSent] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const value = (field: string) => String(data.get(field) ?? "").trim();

		const body = [
			`Role: ${roleTitle}`,
			"",
			`Name: ${value("name")}`,
			`Email: ${value("email")}`,
			`Location: ${value("location")}`,
			`Resume: ${value("resume")}`,
			`LinkedIn: ${value("linkedin")}`,
			`${portfolioLabel}: ${value("portfolio") || "n/a"}`,
			`X: ${value("x") || "n/a"}`,
			"",
			"Why Edgecoms:",
			value("why"),
		].join("\n");

		const href = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
			`Application: ${roleTitle}`
		)}&body=${encodeURIComponent(body)}`;

		window.location.href = href;
		setSent(true);
	}

	if (sent) {
		return (
			<div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-8 text-center">
				<h3 className="font-semibold text-base text-neutral-900 sm:text-lg">
					Your email is ready to send
				</h3>
				<p className="mx-auto mt-2 max-w-md text-neutral-500 text-xs leading-relaxed sm:text-sm">
					We opened a draft in your mail client with your answers attached to
					it. Hit send and we will get back to you within a week. If nothing
					opened, write to us at{" "}
					<a
						className="font-medium text-neutral-900 underline underline-offset-4"
						href={`mailto:${CAREERS_EMAIL}`}
					>
						{CAREERS_EMAIL}
					</a>{" "}
					instead.
				</p>
				<button
					className="mt-6 cursor-pointer font-medium text-neutral-600 text-xs underline underline-offset-4 transition-colors hover:text-neutral-900"
					onClick={() => setSent(false)}
					type="button"
				>
					Back to the form
				</button>
			</div>
		);
	}

	return (
		<form
			className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-1.5">
				<label className={LABEL_CLASS} htmlFor={nameId}>
					Full name <Required />
				</label>
				<input
					autoComplete="name"
					className={INPUT_CLASS}
					id={nameId}
					name="name"
					placeholder="Jordan Rivera"
					required
					type="text"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className={LABEL_CLASS} htmlFor={emailId}>
					Email address <Required />
				</label>
				<input
					autoComplete="email"
					className={INPUT_CLASS}
					id={emailId}
					name="email"
					placeholder="you@example.com"
					required
					type="email"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className={LABEL_CLASS} htmlFor={locationId}>
					Location <Required />
				</label>
				<input
					className={INPUT_CLASS}
					id={locationId}
					name="location"
					placeholder="Bengaluru, India"
					required
					type="text"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className={LABEL_CLASS} htmlFor={resumeId}>
					Resume link <Required />
				</label>
				<input
					className={INPUT_CLASS}
					id={resumeId}
					name="resume"
					placeholder="https://drive.google.com/..."
					required
					type="url"
				/>
				<p className="text-neutral-400 text-xs">
					A public link to your resume, such as Google Drive, Dropbox, or your
					own site.
				</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className={LABEL_CLASS} htmlFor={whyId}>
					Why do you want to join Edgecoms? <Required />
				</label>
				<textarea
					className={`${INPUT_CLASS} resize-y`}
					id={whyId}
					maxLength={1200}
					name="why"
					placeholder="Show your personality, and tell us what excites you about this role and what you would bring to the team."
					required
					rows={6}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className={LABEL_CLASS} htmlFor={linkedinId}>
					LinkedIn <Required />
				</label>
				<input
					className={INPUT_CLASS}
					id={linkedinId}
					name="linkedin"
					placeholder="https://linkedin.com/in/example"
					required
					type="url"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className={LABEL_CLASS} htmlFor={portfolioId}>
					{portfolioLabel}
				</label>
				<input
					className={INPUT_CLASS}
					id={portfolioId}
					name="portfolio"
					placeholder="https://example.com"
					type="url"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className={LABEL_CLASS} htmlFor={xId}>
					X (formerly Twitter)
				</label>
				<input
					className={INPUT_CLASS}
					id={xId}
					name="x"
					placeholder="https://x.com/example"
					type="url"
				/>
			</div>

			<button
				className="mt-2 w-fit cursor-pointer rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800 active:scale-[0.99]"
				type="submit"
			>
				Submit application
			</button>
		</form>
	);
}
