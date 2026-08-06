"use client";

import { motion, useReducedMotion } from "motion/react";

/* What running six point solutions actually feels like.
   `shift` stays a class because it is breakpoint-dependent and an inline
   transform cannot be; `rotate` is a number because motion animates it. They
   live on different elements for the same reason — motion writes the whole
   `transform` property, so a Tailwind translate on the same node would be
   overwritten the moment the animation starts. */
const FRICTIONS: readonly {
	label: string;
	note?: string;
	rotate: number;
	shift: string;
}[] = [
	{
		label: "Theme update broke the cart drawer",
		note: "Unresolved",
		rotate: -2,
		shift: "sm:-translate-x-5",
	},
	{
		label: "5 invoices, 5 renewal dates",
		rotate: 1,
		shift: "sm:translate-x-6",
	},
	{
		label: "Which vendor owns this bug?",
		rotate: -1,
		shift: "sm:-translate-x-2",
	},
	{
		label: "Six app scripts on every page load",
		rotate: 2,
		shift: "sm:translate-x-4",
	},
	{
		label: "Review widget doesn't match the brand",
		rotate: -1,
		shift: "sm:-translate-x-6",
	},
	{
		label: "4 support inboxes, 4 different SLAs",
		note: "Waiting",
		rotate: 2,
		shift: "sm:translate-x-3",
	},
];

const CARD_CLASS =
	"rounded-xl border border-border bg-page px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.04)]";

/* A spring, not an ease — this is the one place on the page where the movement
   is supposed to be physical. Damping well under critical is what produces the
   two or three swings before it settles; `transformOrigin: top center` is what
   makes those swings read as a pin at the top rather than a spin about the
   middle. Mass keeps the period slow enough to see. */
const SWING = {
	damping: 7.5,
	delayPerCard: 0.09,
	mass: 0.7,
	stiffness: 110,
} as const;

function CardBody({ label, note }: { label: string; note?: string }) {
	return (
		<div className="flex items-start gap-2">
			<span
				aria-hidden="true"
				className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
			/>
			<div className="flex flex-col gap-0.5">
				<span className="text-caption text-primary-foreground leading-snug">
					{label}
				</span>
				{note ? (
					<span className="font-medium text-[10px] text-secondary-foreground uppercase tracking-[0.1em]">
						{note}
					</span>
				) : null}
			</div>
		</div>
	);
}

/**
 * The pile of grievances on the "before" side, hung rather than stacked: each
 * card drops in and swings on its own pin until it settles at its final angle.
 *
 * The swing is the argument. A tidy grid of the same six lines says "here is a
 * list"; six cards still rocking says "this is what your admin feels like".
 */
export function FrictionStack() {
	const reduced = useReducedMotion();

	return (
		<ul className="relative flex w-full max-w-sm flex-col gap-2">
			{FRICTIONS.map((friction, index) => (
				<li className={friction.shift} key={friction.label}>
					{reduced ? (
						<div
							className={CARD_CLASS}
							style={{ rotate: `${friction.rotate}deg` }}
						>
							<CardBody label={friction.label} note={friction.note} />
						</div>
					) : (
						<motion.div
							className={CARD_CLASS}
							initial={{ opacity: 0, rotate: 0, y: -14 }}
							style={{ transformOrigin: "top center" }}
							transition={{
								damping: SWING.damping,
								delay: index * SWING.delayPerCard,
								mass: SWING.mass,
								stiffness: SWING.stiffness,
								type: "spring",
							}}
							viewport={{ amount: 0.4, once: true }}
							whileHover={{
								rotate: friction.rotate + 2,
								transition: { damping: 10, stiffness: 180, type: "spring" },
							}}
							whileInView={{ opacity: 1, rotate: friction.rotate, y: 0 }}
						>
							<CardBody label={friction.label} note={friction.note} />
						</motion.div>
					)}
				</li>
			))}
		</ul>
	);
}
