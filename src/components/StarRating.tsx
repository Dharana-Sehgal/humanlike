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
    <div className="flex w-full justify-between items-center py-4">
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
                "h-12 w-12 transition-all duration-300",
                isActive 
                  ? "fill-accent text-accent scale-110 drop-shadow-[0_0_8px_rgba(var(--accent),0.5)]" 
                  : "text-muted-foreground fill-none opacity-40 group-hover:opacity-80"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}