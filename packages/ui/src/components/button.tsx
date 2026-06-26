import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@edgecoms/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const buttonBaseStyles =
	"group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg bg-clip-padding font-medium text-[13px] tracking-[-0.01em] outline-none will-change-transform transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-[var(--ease-out)] focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] active:duration-100 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";

const buttonVariants = cva(buttonBaseStyles, {
	variants: {
		variant: {
			primary:
				"bg-primary text-inverted-primary-foreground active:bg-primary-hover [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary-hover",
			secondary:
				"cft-border-shadow hover:cft-border-shadow-hover bg-secondary text-primary-foreground active:bg-secondary-hover [@media(hover:hover)_and_(pointer:fine)]:hover:bg-secondary-hover",
			tertiary:
				"text-secondary-foreground hover:text-primary-foreground active:bg-tertiary-hover [@media(hover:hover)_and_(pointer:fine)]:hover:bg-tertiary-hover",
		},
		size: {
			lg: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			sm: "h-6 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			md: "h-7 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)] px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
			xl: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
			icon: "size-8",
			"icon-xs":
				"size-6 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
			"icon-sm":
				"size-7 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)]",
			"icon-lg": "size-9",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

function Button({
	className,
	variant = "primary",
	size = "lg",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			className={cn(buttonVariants({ variant, size, className }))}
			data-slot="button"
			{...props}
		/>
	);
}

interface SharedLinkProps extends VariantProps<typeof buttonVariants> {
	children: ReactNode;
	className?: string;
}

export type ButtonLinkProps = Omit<
	ComponentPropsWithoutRef<typeof Link>,
	"className"
> &
	SharedLinkProps;

function ButtonLink({
	children,
	className,
	variant = "primary",
	size = "lg",
	...props
}: ButtonLinkProps) {
	return (
		<Link
			className={cn(buttonVariants({ variant, size }), className)}
			data-slot="button-link"
			{...props}
		>
			{children}
		</Link>
	);
}

export { Button, ButtonLink, buttonVariants };
