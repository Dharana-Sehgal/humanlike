"use client";

import { AssessmentModule } from "@/lib/assessment-data";
import { CheckCircle2, Music } from "lucide-react";
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

  const stars = Array.from({ length: 80 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: `${3 + Math.random() * 5}s`,
    delay: `${Math.random() * 5}s`,
    floatDur: `${20 + Math.random() * 30}s`,
    size: Math.random() > 0.8 ? "1px" : "0.5px",
  }));

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#4c2a85] via-[#2d1b4e] to-[#1a0b3b] text-primary-foreground p-6 flex flex-col overflow-hidden">
      {mounted && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
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
        {modules.map((module) => (
          <div key={module.id} className="space-y-4">
            <div className="px-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">{module.title}</span>
            </div>
            <div className="space-y-1 ml-2 pl-2">
              {module.recordings.map((rec) => {
                const isCompleted = completedRecordingIds.has(rec.id);
                const isActive = activeRecordingId === rec.id;
                
                return (
                  <div
                    key={rec.id}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300",
                      isActive 
                        ? "bg-white/15 shadow-sm backdrop-blur-md border border-white/10" 
                        : "opacity-40 hover:opacity-70"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      ) : isActive ? (
                        <Music className="h-3.5 w-3.5 text-accent animate-pulse" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                      )}
                    </div>
                    <p className={cn(
                      "text-[12px] font-medium tracking-tight truncate",
                      isActive ? "text-white font-semibold" : "text-white/80"
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
