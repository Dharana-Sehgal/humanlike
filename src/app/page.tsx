
"use client";

import { useState, useEffect } from "react";
import { ASSESSMENT_MODULES, FLAT_RECORDINGS } from "@/lib/assessment-data";
import { AssessmentSidebar } from "@/components/AssessmentSidebar";
import { AssessmentForm } from "@/components/AssessmentForm";
import { ModuleQuestionnaire } from "@/components/ModuleQuestionnaire";
import { ContactForm } from "@/components/ContactForm";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

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

    // Determine next step
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

    // Find first recording of next module
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
    const assessmentsArray = Object.entries(assessmentData).map(([id, data]) => ({
      recordingId: id,
      ...data
    }));

    const questionnairesArray = Object.entries(questionnaireData).map(([id, data]) => ({
      moduleId: id,
      ...data
    }));

    const finalSubmission = {
      assessments: assessmentsArray,
      moduleQuestionnaires: questionnairesArray,
      user: contact,
      submittedAt: new Date().toISOString(),
    };
    
    console.log("Assessment Final Submission:", finalSubmission);
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-headline animate-pulse">Initializing Laboratory...</p>
      </div>
    );
  }

  // UI calculations
  const totalSteps = FLAT_RECORDINGS.length + ASSESSMENT_MODULES.length;
  const completedStepsCount = completedRecordings.size + completedQuestionnaires.size;
  const progressPercentage = (completedStepsCount / totalSteps) * 100;

  const activeRecording = activeStep.type === 'recording' ? FLAT_RECORDINGS.find(r => r.id === activeStep.id) : null;
  const activeModule = activeStep.type === 'questionnaire' ? ASSESSMENT_MODULES.find(m => m.id === activeStep.moduleId) : null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <div className="hidden md:block w-64 fixed inset-y-0 left-0 border-r border-black/5">
        <AssessmentSidebar
          modules={ASSESSMENT_MODULES}
          activeStep={activeStep}
          completedRecordingIds={completedRecordings}
          completedQuestionnaireIds={completedQuestionnaires}
          onSelectModule={handleModuleSelect}
          onShowFinalStep={() => setActiveStep({ type: 'final' })}
        />
      </div>

      <main className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden bg-[#3a2065] p-6 text-white">
          <h1 className="font-headline text-lg">Voice Assessment</h1>
          <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/60">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1 bg-white/20 mt-2" />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex sticky top-0 z-10 bg-slate-100/95 backdrop-blur-sm border-b px-8 py-5 items-center justify-between">
          <div className="flex flex-col min-w-0 mr-8 flex-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Evaluation Phase</span>
            <span className="font-headline text-slate-500 font-bold text-sm tracking-tight truncate uppercase">
              {activeRecording ? activeRecording.moduleTitle : activeModule ? activeModule.title : "Final Submission"}
            </span>
          </div>
          <div className="w-48 space-y-1.5 flex-shrink-0">
             <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5 bg-slate-200" />
          </div>
        </div>

        <div className="container px-6 md:px-12 pb-20">
          {activeStep.type === 'recording' && activeRecording ? (
            <AssessmentForm
              key={activeRecording.id}
              recording={activeRecording}
              onComplete={handleAssessmentComplete}
            />
          ) : activeStep.type === 'questionnaire' && activeModule ? (
            <ModuleQuestionnaire
              key={`q-${activeModule.id}`}
              module={activeModule}
              onComplete={handleQuestionnaireComplete}
            />
          ) : (
            <ContactForm onSubmit={handleContactSubmit} />
          )}
        </div>
      </main>
    </div>
  );
}
