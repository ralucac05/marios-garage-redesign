import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * primary  – safety yellow, the one action that matters on a screen (calling the garage)
 * light    – solid paper button for dark surfaces
 * outline  – secondary action on dark surfaces
 * ink      – solid navy for light surfaces
 * quiet    – bordered secondary action on light surfaces
 */
type Variant = "primary" | "light" | "outline" | "ink" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-md font-sans font-semibold whitespace-nowrap transition-colors duration-200 disabled:opacity-50 [&_svg]:size-[1.15em] [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-signal text-ink-deep hover:bg-signal-strong",
  light: "bg-paper text-graphite hover:bg-white",
  outline: "border border-on-ink/30 text-on-ink hover:border-on-ink/70 hover:bg-white/5",
  ink: "bg-ink text-on-ink hover:bg-ink-raised",
  quiet: "border border-graphite/25 text-graphite hover:border-graphite/60 hover:bg-white/60",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-[0.95rem]",
  lg: "h-13 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string | undefined;
  children: ReactNode;
}

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"a">) {
  return (
    <a className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}

export function ButtonRouterLink({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
