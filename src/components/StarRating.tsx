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
    <div className="flex gap-2 items-center py-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isHovering = hovered !== null;
        const isStarHovered = isHovering && starValue <= hovered;
        const isStarSelected = !isHovering && starValue <= value;

        return (
          <button
            key={i}
            type="button"
            className="group outline-none transition-all duration-200 active:scale-90"
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(starValue)}
          >
            <Star
              className={cn(
                "h-8 w-8 transition-all duration-200", 
                isStarHovered 
                  ? "fill-accent text-accent drop-shadow-[0_0_12px_rgba(45,212,191,0.3)] scale-110" 
                  : isStarSelected
                    ? "fill-accent text-accent"
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