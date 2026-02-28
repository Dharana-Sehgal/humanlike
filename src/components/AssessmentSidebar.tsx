
"use client";

import { Recording } from "@/lib/assessment-data";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="w-full h-full bg-primary text-primary-foreground p-8 flex flex-col">
      <div className="mb-12">
        <h1 className="font-headline text-3xl mb-2">Voice Assessment</h1>
        <p className="text-primary-foreground/60 text-sm">Human-Likeness Laboratory</p>
      </div>

      <div className="flex-1 space-y-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/40 mb-6">Assessment Flow</h2>
        
        {recordings.map((rec, idx) => {
          const isCompleted = completedSteps.has(idx);
          const isCurrent = currentStep === idx;
          const isLocked = idx > currentStep && !isCompleted;

          return (
            <div
              key={rec.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                isCurrent ? "bg-white/10 shadow-lg" : "opacity-70"
              )}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                ) : isLocked ? (
                  <Lock className="h-5 w-5 text-white/30" />
                ) : (
                  <div className={cn(
                    "h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                    isCurrent ? "border-accent text-accent" : "border-white/30 text-white/30"
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
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-40">
                  {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Queued"}
                </p>
              </div>
            </div>
          );
        })}

        {/* Final Form Step */}
        <div
          className={cn(
            "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
            currentStep === recordings.length ? "bg-white/10 shadow-lg" : "opacity-70"
          )}
        >
          <div className="flex-shrink-0">
            {completedSteps.has(recordings.length) ? (
              <CheckCircle2 className="h-6 w-6 text-accent" />
            ) : currentStep < recordings.length ? (
              <Lock className="h-5 w-5 text-white/30" />
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-accent flex items-center justify-center text-xs font-bold text-accent">
                {recordings.length + 1}
              </div>
            )}
          </div>
          <div>
            <p className={cn(
              "text-sm font-medium",
              currentStep === recordings.length ? "text-white" : "text-white/60"
            )}>
              Contact Information
            </p>
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-40">Final Step</p>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
            VA
          </div>
          <div>
            <p className="text-xs font-bold">Local Session</p>
            <p className="text-[10px] text-accent flex items-center gap-1">
              Offline Mode Enabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
