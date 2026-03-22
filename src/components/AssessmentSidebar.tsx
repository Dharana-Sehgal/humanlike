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
    <div className="relative w-full h-full bg-[#0F172A] text-white p-10 flex flex-col overflow-hidden border-r border-white/5 shadow-2xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 animate-drift">
          {Array.from({ length: 40 }).map((_, i) => (
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
      
      <div className="relative z-10 mb-20">
        <h1 className="font-body text-lg font-bold tracking-tight text-white/90">
          Humalike Assessment
        </h1>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto space-y-12 custom-scrollbar pr-2 pb-10">
        {modules.map((module) => {
          const isCurrentModule = activeModuleId === module.id;
          
          return (
            <div key={module.id} className="space-y-6">
              <button 
                onClick={() => onSelectModule(module.id)}
                className={cn(
                  "w-full text-left flex items-center gap-3 transition-all duration-300",
                  isCurrentModule ? "opacity-100" : "opacity-40 hover:opacity-60"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  {module.title}
                </span>
              </button>

              <div className="space-y-4 ml-0.5">
                {module.recordings.map((rec) => {
                  const isCompleted = completedRecordingIds.has(rec.id);
                  const isRecActive = activeStep.type === 'recording' && activeStep.id === rec.id;
                  
                  return (
                    <button
                      key={rec.id}
                      onClick={() => onSelectModule(module.id)}
                      className={cn(
                        "group relative w-full flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-200",
                        isRecActive 
                          ? "bg-white/5 text-white" 
                          : "text-white/40 hover:text-white/70 hover:bg-white/5"
                      )}
                    >
                      {isRecActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-full" />
                      )}
                      <p className="text-[13px] font-medium tracking-wide truncate">
                        {rec.title}
                      </p>
                      {isCompleted && <Check className="h-3.5 w-3.5 text-accent shrink-0" />}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => onSelectQuestionnaire(module.id)}
                  className={cn(
                    "group relative w-full flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-200",
                    activeStep.type === 'questionnaire' && activeStep.moduleId === module.id 
                      ? "bg-white/5 text-white" 
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  )}
                >
                  {activeStep.type === 'questionnaire' && activeStep.moduleId === module.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-full" />
                  )}
                  <p className="text-[13px] font-medium tracking-wide">
                    Comparison Analysis
                  </p>
                  {completedQuestionnaireIds.has(module.id) && <Check className="h-3.5 w-3.5 text-accent shrink-0" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 pt-8 border-t border-white/5">
        <Link 
          href="/admin"
          className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-accent transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
          Admin Portal
        </Link>
      </div>
    </div>
  );
}