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

  const stars = [
    { top: "10%", left: "15%", duration: "3s", delay: "0s", floatDur: "12s" },
    { top: "25%", left: "80%", duration: "4s", delay: "1s", floatDur: "15s" },
    { top: "45%", left: "30%", duration: "2.5s", delay: "0.5s", floatDur: "10s" },
    { top: "60%", left: "70%", duration: "5s", delay: "2s", floatDur: "18s" },
    { top: "80%", left: "20%", duration: "3.5s", delay: "1.2s", floatDur: "14s" },
    { top: "15%", left: "50%", duration: "4.5s", delay: "0.8s", floatDur: "16s" },
    { top: "70%", left: "90%", duration: "3s", delay: "1.5s", floatDur: "11s" },
    { top: "35%", left: "10%", duration: "4s", delay: "2.5s", floatDur: "13s" },
    { top: "55%", left: "40%", duration: "3.2s", delay: "0.2s", floatDur: "17s" },
    { top: "90%", left: "60%", duration: "4.8s", delay: "1.8s", floatDur: "19s" },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#120422] via-[#311b92] to-[#7c4dff] text-primary-foreground p-8 flex flex-col overflow-hidden">
      {/* Blinking & Floating Stars Background - Now Smaller */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none opacity-60">
          {stars.map((star, idx) => (
            <div
              key={idx}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle animate-float shadow-[0_0_4px_white]"
              style={{
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
        <h1 className="font-headline text-xl mb-1 leading-tight">Human-Like Assessment</h1>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Laboratory Session</p>
      </div>

      <div className="relative z-10 flex-1 space-y-1">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-6">Assessment Flow</h2>
        
        {recordings.map((rec, idx) => {
          const isCompleted = completedSteps.has(idx);
          const isCurrent = currentStep === idx;
          const isLocked = idx > currentStep && !isCompleted;

          return (
            <div
              key={rec.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl transition-all duration-300",
                isCurrent ? "bg-white/10 shadow-lg backdrop-blur-md" : "opacity-40"
              )}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                ) : isLocked ? (
                  <Lock className="h-3 w-3 text-white/20" />
                ) : (
                  <div className={cn(
                    "h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-bold",
                    isCurrent ? "border-accent text-accent" : "border-white/20 text-white/20"
                  )}>
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className={cn(
                  "text-xs font-medium truncate",
                  isCurrent ? "text-white" : "text-white/60"
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
