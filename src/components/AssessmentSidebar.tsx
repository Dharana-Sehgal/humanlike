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
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
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
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
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
    <div className="relative w-full h-full bg-gradient-to-br from-[#0f172a] via-[#3a2065] to-[#1e1b4b] text-white p-8 flex flex-col overflow-hidden border-r border-white/10 shadow-xl">
      <StarField />
      
      <div className="relative z-10 mb-12">
        <h1 className="font-headline text-lg mb-1 leading-tight font-bold tracking-tight uppercase">BotSpeak Insights</h1>
        <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.25em]">Laboratory Assessment</p>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto space-y-10 custom-scrollbar pr-2">
        {modules.map((module) => {
          const isActive = activeModuleId === module.id;
          const isQActive = activeStep.type === 'questionnaire' && activeStep.moduleId === module.id;
          const isQCompleted = completedQuestionnaireIds.has(module.id);
          
          return (
            <div key={module.id} className="space-y-4">
              <button 
                onClick={() => onSelectModule(module.id)}
                className={cn(
                  "w-full text-left flex items-center gap-3 transition-all duration-300 group",
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                )}
              >
                <span className={cn(
                  "text-[12px] font-bold uppercase tracking-widest",
                  isActive ? "text-white" : "text-white/80"
                )}>
                  {module.title}
                </span>
                {isQCompleted && <Check className="h-3 w-3 text-[#30E8E8] ml-auto" />}
              </button>

              <div className="space-y-4 ml-1 pl-4 border-l border-white/15">
                {module.recordings.map((rec) => {
                  const isCompleted = completedRecordingIds.has(rec.id);
                  const isRecActive = activeStep.type === 'recording' && activeStep.id === rec.id;
                  
                  return (
                    <div
                      key={rec.id}
                      className={cn(
                        "flex items-center justify-between py-0.5 transition-all duration-300",
                        isRecActive ? "opacity-100 font-bold" : "opacity-40"
                      )}
                    >
                      <p className="text-[11px] font-medium tracking-wide truncate">
                        {rec.title}
                      </p>
                      {isCompleted && <Check className="h-3 w-3 text-[#30E8E8]" />}
                    </div>
                  );
                })}

                <div
                  className={cn(
                    "flex items-center justify-between py-0.5 transition-all duration-300",
                    isQActive ? "opacity-100 font-bold" : "opacity-40"
                  )}
                >
                  <p className="text-[11px] font-medium tracking-wide truncate">
                    Module Synthesis
                  </p>
                  {isQCompleted && <Check className="h-3 w-3 text-[#30E8E8]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 mt-auto pt-6 text-white/20 text-[8px] font-bold tracking-[0.2em] uppercase">
        Study v1.0.4 • Confidential
      </div>
    </div>
  );
}
