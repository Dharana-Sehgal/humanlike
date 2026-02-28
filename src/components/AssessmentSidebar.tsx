"use client";

import { AssessmentModule } from "@/lib/assessment-data";
import { CheckCircle2, Lock, Music, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AssessmentSidebarProps {
  modules: AssessmentModule[];
  activeRecordingId: string | null;
  completedRecordingIds: Set<string>;
}

export function AssessmentSidebar({
  modules,
  activeRecordingId,
  completedRecordingIds,
}: AssessmentSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Increase star count as requested
  const stars = Array.from({ length: 120 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
    floatDur: `${15 + Math.random() * 20}s`,
    size: Math.random() > 0.8 ? "1.2px" : "0.6px", // Smaller stars
  }));

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#120422] via-[#311b92] to-[#7c4dff] text-primary-foreground p-6 flex flex-col overflow-hidden">
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
        <h1 className="font-headline text-xl mb-1 leading-tight font-bold">Assessment Lab</h1>
        <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Voice Interaction Study</p>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
        {modules.map((module) => (
          <div key={module.id} className="space-y-2">
            <div className="flex items-center gap-2 px-2 py-1 opacity-60">
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{module.title}</span>
            </div>
            <div className="space-y-1 ml-3 border-l border-white/10 pl-3">
              {module.recordings.map((rec) => {
                const isCompleted = completedRecordingIds.has(rec.id);
                const isActive = activeRecordingId === rec.id;
                
                return (
                  <div
                    key={rec.id}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300",
                      isActive 
                        ? "bg-white/15 shadow-md backdrop-blur-md border border-white/10" 
                        : "opacity-40"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      ) : isActive ? (
                        <Music className="h-3.5 w-3.5 text-accent animate-pulse" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-white/30" />
                      )}
                    </div>
                    <p className={cn(
                      "text-xs font-medium tracking-tight truncate",
                      isActive ? "text-white" : "text-white/70"
                    )}>
                      {rec.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
