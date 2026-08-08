import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-extrabold tracking-tight transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand-pink-deep text-white shadow-glow-pink hover:-translate-y-0.5 hover:shadow-lg",
  secondary: "bg-brand-teal text-brand-navy shadow-glow-teal hover:-translate-y-0.5",
  outline: "bg-transparent text-text-primary border-2 border-border-strong hover:border-brand-navy dark:hover:border-white",
  ghost: "bg-bg-sunken text-text-primary hover:bg-border-subtle",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px] rounded-sm",
  md: "px-[22px] py-3 text-[14.5px]",
  lg: "px-[30px] py-4 text-[16px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: string;
  };

export function Button({ variant = "primary", size = "md", className, children, href, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

export type { Variant as ButtonVariant, Size as ButtonSize };
