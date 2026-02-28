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
    <div className="flex w-full justify-between items-center py-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= (hovered ?? value);
        return (
          <button
            key={i}
            type="button"
            className="group outline-none transition-transform active:scale-90 flex-1 flex justify-center"
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(starValue)}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-all duration-300", 
                isActive 
                  ? "fill-accent text-accent scale-110 drop-shadow-[0_0_3px_rgba(var(--accent),0.3)]" 
                  : "text-muted-foreground fill-none opacity-20 group-hover:opacity-40"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
