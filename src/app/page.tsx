"use client";

import { useState, useEffect } from "react";
import { ASSESSMENT_MODULES, FLAT_RECORDINGS } from "@/lib/assessment-data";
import { AssessmentSidebar } from "@/components/AssessmentSidebar";
import { AssessmentForm } from "@/components/AssessmentForm";
import { ContactForm } from "@/components/ContactForm";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0); // Index in FLAT_RECORDINGS
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set()); // IDs of completed recordings
  const [allData, setAllData] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAssessmentComplete = (data: { rating: number; feedback: string }) => {
    const recording = FLAT_RECORDINGS[currentStep];
    setAllData((prev) => [...prev, { recordingId: recording.id, ...data }]);
    setCompletedSteps((prev) => new Set(prev).add(recording.id));
    setCurrentStep((prev) => prev + 1);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (contact: { name: string; email: string }) => {
    const finalSubmission = {
      assessments: allData,
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

  const progressPercentage = (currentStep / (FLAT_RECORDINGS.length + 1)) * 100;
  const isFinished = currentStep >= FLAT_RECORDINGS.length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:block w-64 fixed inset-y-0 left-0 border-r border-white/5">
        <AssessmentSidebar
          modules={ASSESSMENT_MODULES}
          activeRecordingId={!isFinished ? FLAT_RECORDINGS[currentStep].id : null}
          completedRecordingIds={completedSteps}
        />
      </div>

      <main className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden bg-[#2d1b4e] p-6 text-white">
          <h1 className="font-headline text-lg">Voice Assessment</h1>
          <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/60">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1 bg-white/20 mt-2" />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md border-b px-8 py-4 items-center justify-between">
          <div className="flex flex-col min-w-0 mr-8 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">Evaluation Phase</span>
            <span className="font-headline text-primary font-semibold text-base truncate">
              {!isFinished 
                ? `${FLAT_RECORDINGS[currentStep].moduleTitle} — ${FLAT_RECORDINGS[currentStep].title}` 
                : "Final Submission"}
            </span>
          </div>
          <div className="w-40 space-y-1 flex-shrink-0">
             <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5 bg-secondary" />
          </div>
        </div>

        <div className="container px-6 md:px-12 pb-20">
          {!isFinished ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <AssessmentForm
                key={FLAT_RECORDINGS[currentStep].id}
                recording={FLAT_RECORDINGS[currentStep]}
                onComplete={handleAssessmentComplete}
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <ContactForm onSubmit={handleContactSubmit} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
