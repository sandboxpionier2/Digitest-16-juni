import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "hero" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-kampen-blue to-kampen-teal hover:from-kampen-blue-dark hover:to-kampen-teal-dark text-white shadow-lg shadow-blue-200/60",
  secondary:
    "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
  hero:
    "bg-white text-kampen-blue hover:bg-blue-50 shadow-xl shadow-black/30 ring-2 ring-white/50 hover:shadow-2xl hover:ring-white/70",
  ghost: "text-slate-500 hover:text-slate-700 bg-transparent",
};

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkButtonProps = BaseProps & {
  href: string;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  className = "",
  icon,
  href,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </Link>
  );
}
