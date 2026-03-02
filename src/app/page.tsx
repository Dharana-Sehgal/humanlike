"use client";

import { useState, useEffect } from "react";
import { ASSESSMENT_MODULES, FLAT_RECORDINGS } from "@/lib/assessment-data";
import { AssessmentSidebar } from "@/components/AssessmentSidebar";
import { AssessmentForm } from "@/components/AssessmentForm";
import { ModuleQuestionnaire } from "@/components/ModuleQuestionnaire";
import { ContactForm } from "@/components/ContactForm";
import { Progress } from "@/components/ui/progress";

type ActiveStep = 
  | { type: 'recording'; id: string } 
  | { type: 'questionnaire'; moduleId: string } 
  | { type: 'final' };

export default function AssessmentPage() {
  const [activeStep, setActiveStep] = useState<ActiveStep>({ type: 'recording', id: FLAT_RECORDINGS[0].id });
  const [completedRecordings, setCompletedRecordings] = useState<Set<string>>(new Set());
  const [completedQuestionnaires, setCompletedQuestionnaires] = useState<Set<string>>(new Set());
  
  const [assessmentData, setAssessmentData] = useState<Record<string, { rating: number; feedback: string }>>({});
  const [questionnaireData, setQuestionnaireData] = useState<Record<string, { betterBotId: string; preferenceFeedback: string }>>({});
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAssessmentComplete = (data: { rating: number; feedback: string }) => {
    if (activeStep.type !== 'recording') return;
    const currentId = activeStep.id;

    setAssessmentData((prev) => ({ ...prev, [currentId]: data }));
    setCompletedRecordings((prev) => new Set(prev).add(currentId));

    const currentIndex = FLAT_RECORDINGS.findIndex(r => r.id === currentId);
    const currentRecording = FLAT_RECORDINGS[currentIndex];
    const module = ASSESSMENT_MODULES.find(m => m.id === currentRecording.moduleId);
    
    const isLastInModule = module?.recordings[module.recordings.length - 1].id === currentId;

    if (isLastInModule) {
      setActiveStep({ type: 'questionnaire', moduleId: currentRecording.moduleId });
    } else {
      setActiveStep({ type: 'recording', id: FLAT_RECORDINGS[currentIndex + 1].id });
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionnaireComplete = (data: { betterBotId: string; preferenceFeedback: string }) => {
    if (activeStep.type !== 'questionnaire') return;
    const moduleId = activeStep.moduleId;

    setQuestionnaireData((prev) => ({ ...prev, [moduleId]: data }));
    setCompletedQuestionnaires((prev) => new Set(prev).add(moduleId));

    const currentModuleIndex = ASSESSMENT_MODULES.findIndex(m => m.id === moduleId);
    if (currentModuleIndex < ASSESSMENT_MODULES.length - 1) {
      const nextModule = ASSESSMENT_MODULES[currentModuleIndex + 1];
      setActiveStep({ type: 'recording', id: nextModule.recordings[0].id });
    } else {
      setActiveStep({ type: 'final' });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModuleSelect = (moduleId: string) => {
    const module = ASSESSMENT_MODULES.find(m => m.id === moduleId);
    if (module && module.recordings.length > 0) {
      setActiveStep({ type: 'recording', id: module.recordings[0].id });
    }
  };

  const handleContactSubmit = (contact: { name: string; email: string }) => {
    const finalSubmission = {
      assessments: Object.entries(assessmentData).map(([id, data]) => ({ recordingId: id, ...data })),
      moduleQuestionnaires: Object.entries(questionnaireData).map(([id, data]) => ({ moduleId: id, ...data })),
      user: contact,
      submittedAt: new Date().toISOString(),
    };
    console.log("Assessment Final Submission:", finalSubmission);
  };

  if (!isMounted) return null;

  const totalSteps = FLAT_RECORDINGS.length + ASSESSMENT_MODULES.length;
  const completedStepsCount = completedRecordings.size + completedQuestionnaires.size;
  const progressPercentage = (completedStepsCount / totalSteps) * 100;

  const activeRecording = activeStep.type === 'recording' ? FLAT_RECORDINGS.find(r => r.id === activeStep.id) : null;
  const activeModule = activeStep.type === 'questionnaire' ? ASSESSMENT_MODULES.find(m => m.id === activeStep.moduleId) : null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div className="hidden md:block w-64 fixed inset-y-0 left-0">
        <AssessmentSidebar
          modules={ASSESSMENT_MODULES}
          activeStep={activeStep}
          completedRecordingIds={completedRecordings}
          completedQuestionnaireIds={completedQuestionnaires}
          onSelectModule={handleModuleSelect}
          onShowFinalStep={() => setActiveStep({ type: 'final' })}
        />
      </div>

      <main className="flex-1 md:ml-64 bg-slate-50/30">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b px-8 py-5 flex items-center justify-between shadow-sm">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mb-0.5">Assessment Focus</span>
            <span className="font-headline text-slate-800 font-bold text-base tracking-tight uppercase">
              {activeRecording ? activeRecording.moduleTitle : activeModule ? activeModule.title : "Conclusion"}
            </span>
          </div>
          <div className="w-56 flex flex-col items-end gap-2">
             <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5 bg-slate-100" />
          </div>
        </div>

        <div className="container px-8 md:px-12">
          {activeStep.type === 'recording' && activeRecording ? (
            <AssessmentForm key={activeRecording.id} recording={activeRecording} onComplete={handleAssessmentComplete} />
          ) : activeStep.type === 'questionnaire' && activeModule ? (
            <ModuleQuestionnaire key={`q-${activeModule.id}`} module={activeModule} onComplete={handleQuestionnaireComplete} />
          ) : (
            <ContactForm onSubmit={handleContactSubmit} />
          )}
        </div>
      </main>
    </div>
  );
}
