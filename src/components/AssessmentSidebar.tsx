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
    <div className="relative w-full h-full bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#2d1b4d] text-white p-10 flex flex-col overflow-x-hidden overflow-y-hidden border-r border-white/5 shadow-2xl">
      {/* Dynamic Starfield via CSS animation defined in globals.css */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 animate-drift">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 1.5 + 0.5}px`,
                height: `${Math.random() * 1.5 + 0.5}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 10}s`,
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.4)',
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Logo Title - Formal but Relaxed */}
      <div className="relative z-10 mb-20">
        <h1 className="font-logo text-2xl font-medium tracking-tight text-white/95 whitespace-nowrap italic">
          Humalike Assessment
        </h1>
      </div>

      {/* Assessment Specimen List */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden space-y-20 custom-scrollbar pr-2 pb-10">
        {modules.map((module) => {
          const isActive = activeModuleId === module.id;
          
          return (
            <div key={module.id} className="space-y-10">
              <button 
                onClick={() => onSelectModule(module.id)}
                className={cn(
                  "w-full text-left flex items-center gap-3 transition-all duration-300 group",
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
              >
                <span className={cn(
                  "text-[14px] font-bold uppercase tracking-[0.15em]",
                  isActive ? "text-white" : "text-white/90"
                )}>
                  {module.title}
                </span>
              </button>

              <div className="space-y-8 ml-1 pl-6 border-l border-white/10">
                {module.recordings.map((rec) => {
                  const isCompleted = completedRecordingIds.has(rec.id);
                  const isRecActive = activeStep.type === 'recording' && activeStep.id === rec.id;
                  
                  return (
                    <div
                      key={rec.id}
                      className={cn(
                        "flex items-center justify-between py-1 transition-all duration-300",
                        isRecActive ? "opacity-100 font-semibold scale-[1.05] origin-left" : "opacity-30"
                      )}
                    >
                      <p className="text-[13px] tracking-wide truncate pr-2">
                        {rec.title}
                      </p>
                      {isCompleted && <Check className="h-3 w-3 text-accent shrink-0" />}
                    </div>
                  );
                })}
                
                <button
                  onClick={() => onSelectQuestionnaire(module.id)}
                  className={cn(
                    "w-full text-left flex items-center justify-between py-1 transition-all duration-300",
                    activeStep.type === 'questionnaire' && activeStep.moduleId === module.id 
                      ? "opacity-100 font-semibold scale-[1.05] origin-left" 
                      : "opacity-30"
                  )}
                >
                  <p className="text-[13px] tracking-wide truncate pr-2">
                    Comparison
                  </p>
                  {completedQuestionnaireIds.has(module.id) && <Check className="h-3 w-3 text-accent shrink-0" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
