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
    <div className="flex gap-6 items-center py-2">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= (hovered ?? value);
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
                "h-10 w-10 transition-all duration-300", 
                isActive 
                  ? "fill-[#3a2065] text-[#3a2065] scale-110 drop-shadow-[0_0_10px_rgba(58,32,101,0.3)]" 
                  : "text-slate-200 fill-none group-hover:text-slate-300 group-hover:scale-105"
              )}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
