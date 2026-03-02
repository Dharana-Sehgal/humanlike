
"use client";

import { AssessmentModule } from "@/lib/assessment-data";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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

export function AssessmentSidebar({
  modules,
  activeStep,
  completedRecordingIds,
  completedQuestionnaireIds,
  onSelectModule,
  onShowFinalStep,
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

  return (
    <div className="relative w-full h-full bg-[#1a0b3b] text-primary-foreground p-6 flex flex-col overflow-hidden border-r border-white/5">
      <div className="relative z-10 mb-10">
        <h1 className="font-headline text-lg mb-0.5 leading-tight font-bold tracking-tight">Assessment Lab</h1>
        <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em]">Voice Study v1.0</p>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
        {modules.map((module) => {
          const isActive = activeModuleId === module.id;
          const isQActive = activeStep.type === 'questionnaire' && activeStep.moduleId === module.id;
          const isQCompleted = completedQuestionnaireIds.has(module.id);
          
          return (
            <div key={module.id} className="space-y-3">
              <button 
                onClick={() => onSelectModule(module.id)}
                className={cn(
                  "w-full text-left flex items-center gap-2 transition-all duration-300 group",
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
              >
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  isActive ? "bg-white" : "bg-white/20"
                )} />
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  isActive ? "text-white" : "text-white/70"
                )}>
                  {module.title}
                </span>
                {isQCompleted && <span className="text-[9px] text-white/40 ml-auto font-mono">DONE</span>}
              </button>

              <div className="space-y-2 ml-1.5 pl-3 border-l border-white/10">
                {module.recordings.map((rec) => {
                  const isCompleted = completedRecordingIds.has(rec.id);
                  const isRecActive = activeStep.type === 'recording' && activeStep.id === rec.id;
                  
                  return (
                    <div
                      key={rec.id}
                      className={cn(
                        "flex items-center justify-between py-0.5 transition-all duration-300",
                        isRecActive ? "opacity-100" : "opacity-30"
                      )}
                    >
                      <p className="text-[9px] font-medium tracking-tight truncate text-white/80">
                        {rec.title}
                      </p>
                      {isCompleted && <span className="text-[8px] text-white/60">✓</span>}
                    </div>
                  );
                })}

                <div
                  className={cn(
                    "flex items-center justify-between py-0.5 transition-all duration-300",
                    isQActive ? "opacity-100" : "opacity-30"
                  )}
                >
                  <p className="text-[9px] font-medium tracking-tight truncate text-white/80">
                    Synthesis
                  </p>
                  {isQCompleted && <span className="text-[8px] text-white/60">✓</span>}
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-white/5">
          <button
            onClick={onShowFinalStep}
            className={cn(
              "w-full text-left flex items-center gap-2 transition-all duration-300",
              activeStep.type === 'final' ? "opacity-100" : "opacity-30 hover:opacity-70"
            )}
          >
            <div className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              activeStep.type === 'final' ? "bg-white" : "bg-white/20"
            )} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white">Final Submission</p>
          </button>
        </div>
      </div>
    </div>
  );
}
