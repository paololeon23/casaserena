import { useState } from "react";
import { cn } from "../lib/ui";

type PhotoProps = {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  mark?: string;
};

export function Photo({ src, alt, className, priority = false, mark }: PhotoProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn("relative h-full w-full bg-[#E7EEE3] text-ink", className)}>
        <div className="pointer-events-none absolute inset-3 border border-ink/20" />
        <div className="absolute inset-x-6 bottom-6">
          <p className="font-display text-5xl italic leading-none tracking-[-0.04em]">{mark ?? "—"}</p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.18em]">Fotografía por llegar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full bg-ink/5", className)}>
      {!loaded ? <div className="absolute inset-0 animate-pulse bg-ink/10" /> : null}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
