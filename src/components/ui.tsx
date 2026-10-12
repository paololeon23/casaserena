import type { ReactNode } from "react";
import { cn } from "../lib/ui";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/60">
        <span className="h-px w-8 bg-ink" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl">{title}</h2>
      {text ? <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">{text}</p> : null}
    </div>
  );
}

export function PendingNote({ children }: { children: ReactNode }) {
  return <p className="border-l border-ink/25 pl-4 text-sm leading-relaxed text-ink/75">{children}</p>;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm font-medium text-ink">
      {message}
    </p>
  );
}
