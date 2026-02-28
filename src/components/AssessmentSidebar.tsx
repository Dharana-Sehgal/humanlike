"use client";

import { Recording } from "@/lib/assessment-data";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AssessmentSidebarProps {
  recordings: Recording[];
  currentStep: number;
  completedSteps: Set<number>;
  totalSteps: number;
}

export function AssessmentSidebar({
  recordings,
  currentStep,
  completedSteps,
}: AssessmentSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Increased density of even smaller stars
  const stars = Array.from({ length: 60 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
    floatDur: `${15 + Math.random() * 20}s`,
    size: Math.random() > 0.8 ? "1px" : "0.5px",
  }));

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#120422] via-[#311b92] to-[#7c4dff] text-primary-foreground p-8 flex flex-col overflow-hidden">
      {/* Blinking & Floating Stars Background */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {stars.map((star, idx) => (
            <div
              key={idx}
              className="absolute bg-white rounded-full animate-twinkle animate-float shadow-[0_0_2px_white]"
              style={{
                width: star.size,
                height: star.size,
                top: star.top,
                left: star.left,
                "--twinkle-duration": star.duration,
                "--float-duration": star.floatDur,
                animationDelay: star.delay,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mb-12">
        <h1 className="font-headline text-2xl mb-1 leading-tight">Assessment</h1>
        <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Laboratory Session</p>
      </div>

      <div className="relative z-10 flex-1 space-y-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-6 border-b border-white/10 pb-2">Assessment Flow</h2>
        
        {recordings.map((rec, idx) => {
          const isCompleted = completedSteps.has(idx);
          const isCurrent = currentStep === idx;
          const isLocked = idx > currentStep && !isCompleted;

          return (
            <div
              key={rec.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl transition-all duration-300",
                isCurrent ? "bg-white/15 shadow-lg backdrop-blur-md border border-white/10 scale-105" : "opacity-40"
              )}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : isLocked ? (
                  <Lock className="h-4 w-4 text-white/20" />
                ) : (
                  <div className={cn(
                    "h-6 w-6 rounded-full border flex items-center justify-center text-xs font-bold",
                    isCurrent ? "border-accent text-accent" : "border-white/30 text-white/30"
                  )}>
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className={cn(
                  "text-base font-medium truncate",
                  isCurrent ? "text-white" : "text-white/70"
                )}>
                  {rec.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
