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

  // Static positions to avoid hydration mismatch while still looking random
  const stars = [
    { top: "10%", left: "15%", duration: "3s", delay: "0s" },
    { top: "25%", left: "80%", duration: "4s", delay: "1s" },
    { top: "45%", left: "30%", duration: "2.5s", delay: "0.5s" },
    { top: "60%", left: "70%", duration: "5s", delay: "2s" },
    { top: "80%", left: "20%", duration: "3.5s", delay: "1.2s" },
    { top: "15%", left: "50%", duration: "4.5s", delay: "0.8s" },
    { top: "70%", left: "90%", duration: "3s", delay: "1.5s" },
    { top: "35%", left: "10%", duration: "4s", delay: "2.5s" },
    { top: "55%", left: "40%", duration: "3.2s", delay: "0.2s" },
    { top: "90%", left: "60%", duration: "4.8s", delay: "1.8s" },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#120422] via-[#311b92] to-[#7c4dff] text-primary-foreground p-8 flex flex-col overflow-hidden">
      {/* Blinking Stars Background */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {stars.map((star, idx) => (
            <div
              key={idx}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle shadow-[0_0_8px_white]"
              style={{
                top: star.top,
                left: star.left,
                "--twinkle-duration": star.duration,
                animationDelay: star.delay,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mb-12">
        <h1 className="font-headline text-2xl mb-2 leading-tight">Human-Like Voice Assessment</h1>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Laboratory Session</p>
      </div>

      <div className="relative z-10 flex-1 space-y-1">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-6">Assessment Flow</h2>
        
        {recordings.map((rec, idx) => {
          const isCompleted = completedSteps.has(idx);
          const isCurrent = currentStep === idx;
          const isLocked = idx > currentStep && !isCompleted;

          return (
            <div
              key={rec.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                isCurrent ? "bg-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md" : "opacity-60"
              )}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-[#30E8E8]" />
                ) : isLocked ? (
                  <Lock className="h-4 w-4 text-white/20" />
                ) : (
                  <div className={cn(
                    "h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                    isCurrent ? "border-[#30E8E8] text-[#30E8E8]" : "border-white/20 text-white/20"
                  )}>
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  isCurrent ? "text-white" : "text-white/60"
                )}>
                  {rec.title}
                </p>
                <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">
                  {isCompleted ? "Verified" : isCurrent ? "Active" : "Queued"}
                </p>
              </div>
            </div>
          );
        })}

        {/* Final Form Step */}
        <div
          className={cn(
            "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
            currentStep === recordings.length ? "bg-white/20 shadow-lg backdrop-blur-md" : "opacity-60"
          )}
        >
          <div className="flex-shrink-0">
            {completedSteps.has(recordings.length) ? (
              <CheckCircle2 className="h-5 w-5 text-[#30E8E8]" />
            ) : currentStep < recordings.length ? (
              <Lock className="h-4 w-4 text-white/20" />
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-[#30E8E8] flex items-center justify-center text-[10px] font-bold text-[#30E8E8]">
                {recordings.length + 1}
              </div>
            )}
          </div>
          <div>
            <p className={cn(
              "text-sm font-medium",
              currentStep === recordings.length ? "text-white" : "text-white/60"
            )}>
              Contact Details
            </p>
            <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">Final Analysis</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-8 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#30E8E8]/20 border border-[#30E8E8]/30 flex items-center justify-center text-[#30E8E8] font-bold text-xs">
            VA
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Local Engine</p>
            <p className="text-[9px] text-[#30E8E8] flex items-center gap-1 font-medium">
              Ready for Input
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}