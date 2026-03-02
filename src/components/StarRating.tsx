"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex w-full justify-between items-center py-2 max-w-lg">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isHovering = hovered !== null;
        const isStarHovered = isHovering && starValue <= hovered;
        const isStarSelected = !isHovering && starValue <= value;

        return (
          <button
            key={i}
            type="button"
            className="group outline-none transition-all active:scale-90"
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(starValue)}
          >
            <Star
              className={cn(
                "h-10 w-10 transition-all duration-200", 
                isStarHovered 
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" 
                  : isStarSelected
                    ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(58,32,101,0.2)]"
                    : "text-slate-200 fill-none"
              )}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
