"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Container, Section } from "@/components/ui";
import { COURSE_FAQ } from "@/lib/content";

/** One open at a time — a page of expanded answers is a wall, not a list. */
export function Faq() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<Section id="faq" tone="paper">
			<Container narrow>
				<h2 className="text-balance text-center font-bold text-section">
					Frequently asked questions
				</h2>

				<div className="mt-10 divide-y divide-ink/10 border-ink/10 border-t border-b">
					{COURSE_FAQ.map((item, index) => {
						const isOpen = openIndex === index;

						return (
							<div key={item.question}>
								<button
									aria-expanded={isOpen}
									className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-base text-ink transition-colors hover:text-ink/60"
									onClick={() => setOpenIndex(isOpen ? null : index)}
									type="button"
								>
									<span>{item.question}</span>
									<span className="flex size-6 shrink-0 items-center justify-center">
										{isOpen ? (
											<Minus aria-hidden="true" className="size-4" />
										) : (
											<Plus aria-hidden="true" className="size-4" />
										)}
									</span>
								</button>
								{isOpen ? (
									<p className="text-pretty pb-5 text-ink/60 leading-relaxed">
										{item.answer}
									</p>
								) : null}
							</div>
						);
					})}
				</div>
			</Container>
		</Section>
	);
}
