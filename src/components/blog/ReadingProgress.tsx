import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  target?: string;
  className?: string;
}

export function ReadingProgress({ target = "article", className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const targetElement = document.querySelector(target);

      if (!targetElement) return;

      const { top, height } = targetElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const scrollTop = Math.max(0, viewportHeight - top);
      const total = height + viewportHeight;

      const percentage = Math.min(Math.max(scrollTop / total, 0), 1);

      setProgress(Math.round(percentage * 100));
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [target]);

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-1 bg-timber-100/40",
        className,
      )}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-timber-500 via-timber-400 to-timber-300 transition-transform"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
