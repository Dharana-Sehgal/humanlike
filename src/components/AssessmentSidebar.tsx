"use client";

import { AssessmentModule } from "@/lib/assessment-data";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Check, Settings } from "lucide-react";
import Link from "next/link";

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
    <div className="relative w-full h-full bg-[#0a0f1c] text-white p-10 flex flex-col overflow-x-hidden border-r border-white/5 shadow-2xl">
      {/* Subtle Starfield Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute inset-0 animate-drift">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: '1px',
                height: '1px',
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Logo Title */}
      <div className="relative z-10 mb-20">
        <h1 className="font-body text-xl font-semibold tracking-tight text-white whitespace-nowrap">
          Humalike Assessment
        </h1>
      </div>

      {/* Assessment Specimen List */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden space-y-16 custom-scrollbar pr-2 pb-10">
        {modules.map((module) => {
          const isActive = activeModuleId === module.id;
          
          return (
            <div key={module.id} className="space-y-10">
              <button 
                onClick={() => onSelectModule(module.id)}
                className={cn(
                  "w-full text-left flex items-center gap-3 transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-60"
                )}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.25em]">
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
                        isRecActive ? "opacity-100 font-medium translate-x-1" : "opacity-30"
                      )}
                    >
                      <p className="text-[13px] tracking-wide truncate pr-4">
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
                      ? "opacity-100 font-medium translate-x-1" 
                      : "opacity-30"
                  )}
                >
                  <p className="text-[13px] tracking-wide truncate pr-4">
                    Comparison
                  </p>
                  {completedQuestionnaireIds.has(module.id) && <Check className="h-3 w-3 text-accent shrink-0" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Access Footer Link */}
      <div className="relative z-10 pt-8 mt-auto border-t border-white/5">
        <Link 
          href="/admin"
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
          Admin Portal
        </Link>
      </div>
    </div>
  );
}
