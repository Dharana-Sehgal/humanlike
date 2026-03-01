"use client";

import { AssessmentModule } from "@/lib/assessment-data";
import { CheckCircle2, Folder, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AssessmentSidebarProps {
  modules: AssessmentModule[];
  activeRecordingId: string | null;
  completedRecordingIds: Set<string>;
  onSelectModule: (moduleId: string) => void;
  onShowFinalStep: () => void;
}

export function AssessmentSidebar({
  modules,
  activeRecordingId,
  completedRecordingIds,
  onSelectModule,
  onShowFinalStep,
}: AssessmentSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stars = Array.from({ length: 30 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: `${3 + Math.random() * 5}s`,
    delay: `${Math.random() * 5}s`,
    floatDur: `${15 + Math.random() * 20}s`,
    size: Math.random() > 0.8 ? "1.5px" : "0.5px",
  }));

  const activeModuleId = modules.find(m => 
    m.recordings.some(r => r.id === activeRecordingId)
  )?.id;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#3a2065] via-[#2d1b4e] to-[#1a0b3b] text-primary-foreground p-6 flex flex-col overflow-hidden">
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

      <div className="relative z-10 mb-10">
        <h1 className="font-headline text-xl mb-1 leading-tight font-bold tracking-tight">Assessment Lab</h1>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Voice Study v1.0</p>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto space-y-8 custom-scrollbar pr-2">
        {modules.map((module) => {
          const isActive = activeModuleId === module.id;
          const moduleCompletedCount = module.recordings.filter(r => completedRecordingIds.has(r.id)).length;
          const isModuleFullyCompleted = moduleCompletedCount === module.recordings.length;

          return (
            <div key={module.id} className="space-y-4">
              <button 
                onClick={() => onSelectModule(module.id)}
                className={cn(
                  "w-full text-left px-2 flex items-center gap-2.5 transition-all duration-300 group",
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-md transition-colors",
                  isActive ? "bg-accent/20" : "bg-white/5"
                )}>
                  <Folder className={cn("h-4 w-4", isActive ? "text-accent" : "text-white/60")} />
                </div>
                <span className={cn(
                  "text-[11px] font-bold uppercase tracking-widest",
                  isActive ? "text-white" : "text-white/70"
                )}>
                  {module.title}
                </span>
                {isModuleFullyCompleted && <CheckCircle2 className="h-3 w-3 text-accent ml-auto" />}
              </button>

              <div className="space-y-2 ml-4 pl-4 border-l border-white/10">
                {module.recordings.map((rec) => {
                  const isCompleted = completedRecordingIds.has(rec.id);
                  const isRecActive = activeRecordingId === rec.id;
                  
                  return (
                    <div
                      key={rec.id}
                      className={cn(
                        "flex items-center gap-3 py-1 transition-opacity",
                        isRecActive ? "opacity-100" : "opacity-40"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-2.5 w-2.5 text-accent" />
                      ) : isRecActive ? (
                        <div className="h-1 w-1 rounded-full bg-accent animate-pulse" />
                      ) : (
                        <div className="h-1 w-1 rounded-full bg-white/20" />
                      )}
                      <p className="text-[10px] font-medium tracking-tight truncate text-white/80">
                        {rec.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="pt-4 mt-8 border-t border-white/10">
          <button
            onClick={onShowFinalStep}
            className={cn(
              "w-full text-left flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300",
              activeRecordingId === null 
                ? "bg-white/10 shadow-sm backdrop-blur-md border border-white/5" 
                : "opacity-40 hover:opacity-100"
            )}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <p className="text-[12px] font-semibold uppercase tracking-wider text-white">Final Submission</p>
          </button>
        </div>
      </div>
    </div>
  );
}
