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
  onSelectQuestionnaire: (moduleId: string) => void;
}

const StarField = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 1.5 + 0.5}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 6}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div className="absolute inset-0 animate-drift">
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
            }}
          />
        ))}
      </div>
    </div>
  );
};

export function AssessmentSidebar({
  modules,
  activeStep,
  completedRecordingIds,
  completedQuestionnaireIds,
  onSelectModule,
  onSelectQuestionnaire,
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
      
      <div className="relative z-10 mb-14">
        <h1 className="font-headline text-lg mb-1.5 leading-tight font-bold tracking-tight uppercase">BotSpeak Insights</h1>
        <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.25em]">Laboratory Assessment</p>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto space-y-14 custom-scrollbar pr-2">
        {modules.map((module) => {
          const isActive = activeModuleId === module.id;
          
          return (
            <div key={module.id} className="space-y-7">
              <button 
                onClick={() => onSelectModule(module.id)}
                className={cn(
                  "w-full text-left flex items-center gap-3 transition-all duration-300 group",
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
              >
                <span className={cn(
                  "text-[14px] font-bold uppercase tracking-[0.12em]",
                  isActive ? "text-white" : "text-white/90"
                )}>
                  {module.title}
                </span>
              </button>

              <div className="space-y-6 ml-1 pl-5 border-l border-white/10">
                {module.recordings.map((rec) => {
                  const isCompleted = completedRecordingIds.has(rec.id);
                  const isRecActive = activeStep.type === 'recording' && activeStep.id === rec.id;
                  
                  return (
                    <div
                      key={rec.id}
                      className={cn(
                        "flex items-center justify-between py-1 transition-all duration-300",
                        isRecActive ? "opacity-100 font-bold scale-[1.02] origin-left" : "opacity-30"
                      )}
                    >
                      <p className="text-[13px] font-medium tracking-wide truncate">
                        {rec.title}
                      </p>
                      {isCompleted && <Check className="h-3 w-3 text-accent" />}
                    </div>
                  );
                })}
                
                <button
                  onClick={() => onSelectQuestionnaire(module.id)}
                  className={cn(
                    "w-full text-left flex items-center justify-between py-1 transition-all duration-300",
                    activeStep.type === 'questionnaire' && activeStep.moduleId === module.id 
                      ? "opacity-100 font-bold scale-[1.02] origin-left" 
                      : "opacity-30"
                  )}
                >
                  <p className="text-[13px] font-medium tracking-wide truncate">
                    Comparison
                  </p>
                  {completedQuestionnaireIds.has(module.id) && <Check className="h-3 w-3 text-accent" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 mt-auto pt-8 text-white/10 text-[8px] font-bold tracking-[0.3em] uppercase">
        Study v1.0.4 • Phase Alpha
      </div>
    </div>
  );
}
