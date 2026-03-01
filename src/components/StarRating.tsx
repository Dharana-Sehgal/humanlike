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
    <div className="flex gap-4 items-center py-2">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= (hovered ?? value);
        return (
          <button
            key={i}
            type="button"
            className="group outline-none transition-transform active:scale-90"
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(starValue)}
          >
            <Star
              className={cn(
                "h-8 w-8 transition-all duration-300", 
                isActive 
                  ? "fill-accent text-accent scale-110 drop-shadow-[0_0_8px_rgba(var(--accent),0.5)]" 
                  : "text-muted-foreground fill-none opacity-20 group-hover:opacity-40"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
