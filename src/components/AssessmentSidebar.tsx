"use client";

import { AssessmentModule } from "@/lib/assessment-data";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

type ActiveStep = 
  | { type: 'recording'; id: string } 
  | { type: 'questionnaire'; moduleId: string } 
  | { type: 'final' };

interface AssessmentSidebarProps {
  modules: AssessmentModule[];
  activeStep: ActiveStep;
  completedRecordingIds: Set<string>;
  completedQuestionnaireIds: Set<string>;
  onSelectModule: (moduleId: string) => void;
  onShowFinalStep: () => void;
}

const StarField = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; delay: string; duration: string; driftDuration: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 1.5 + 0.5}px`, // Smaller, more refined stars
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 6}s`,
      driftDuration: `${15 + Math.random() * 20}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <style jsx>{`
        @keyframes floatDrift {
          0% { transform: translate(0, 0); }
          33% { transform: translate(15px, -15px); }
          66% { transform: translate(-10px, -25px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)',
            animationName: 'floatDrift, pulse',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear, ease-in-out',
            animationDuration: `${star.driftDuration}, ${star.duration}`,
          }}
        />
      ))}
    </div>
  );
};

export function AssessmentSidebar({
  modules,
  activeStep,
  completedRecordingIds,
  completedQuestionnaireIds,
  onSelectModule,
}: AssessmentSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeModuleId = 
    activeStep.type === 'recording' 
      ? modules.find(m => m.recordings.some(r => r.id === activeStep.id))?.id 
      : activeStep.type === 'questionnaire' 
        ? activeStep.moduleId 
        : null;

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#0f172a] via-[#2d1b4d] to-[#1e1b4b] text-white p-8 flex flex-col overflow-hidden border-r border-white/5 shadow-2xl">
      <StarField />
      
      <div className="relative z-10 mb-12">
        <h1 className="font-headline text-lg mb-1.5 leading-tight font-bold tracking-tight uppercase">BotSpeak Insights</h1>
        <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.25em]">Laboratory Assessment</p>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto space-y-10 custom-scrollbar pr-2">
        {modules.map((module) => {
          const isActive = activeModuleId === module.id;
          const isQActive = activeStep.type === 'questionnaire' && activeStep.moduleId === module.id;
          const isQCompleted = completedQuestionnaireIds.has(module.id);
          
          return (
            <div key={module.id} className="space-y-5">
              <button 
                onClick={() => onSelectModule(module.id)}
                className={cn(
                  "w-full text-left flex items-center gap-3 transition-all duration-300 group",
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
              >
                <span className={cn(
                  "text-[13px] font-bold uppercase tracking-[0.12em]",
                  isActive ? "text-white" : "text-white/90"
                )}>
                  {module.title}
                </span>
                {isQCompleted && <Check className="h-3 w-3 text-accent ml-auto" />}
              </button>

              <div className="space-y-4 ml-1 pl-5 border-l border-white/10">
                {module.recordings.map((rec) => {
                  const isCompleted = completedRecordingIds.has(rec.id);
                  const isRecActive = activeStep.type === 'recording' && activeStep.id === rec.id;
                  
                  return (
                    <div
                      key={rec.id}
                      className={cn(
                        "flex items-center justify-between py-0.5 transition-all duration-300",
                        isRecActive ? "opacity-100 font-bold scale-[1.02] origin-left" : "opacity-30"
                      )}
                    >
                      <p className="text-[12px] font-medium tracking-wide truncate">
                        {rec.title}
                      </p>
                      {isCompleted && <Check className="h-3 w-3 text-accent" />}
                    </div>
                  );
                })}

                <div
                  className={cn(
                    "flex items-center justify-between py-0.5 transition-all duration-300",
                    isQActive ? "opacity-100 font-bold scale-[1.02] origin-left" : "opacity-30"
                  )}
                >
                  <p className="text-[12px] font-medium tracking-wide truncate">
                    Module Synthesis
                  </p>
                  {isQCompleted && <Check className="h-3 w-3 text-accent" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 mt-auto pt-6 text-white/10 text-[8px] font-bold tracking-[0.3em] uppercase">
        Study v1.0.4 • Phase Alpha
      </div>
    </div>
  );
}
