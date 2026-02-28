"use client";

import { useState, useEffect } from "react";
import { ASSESSMENT_GROUPS } from "@/lib/assessment-data";
import { AssessmentSidebar } from "@/components/AssessmentSidebar";
import { AssessmentForm } from "@/components/AssessmentForm";
import { ContactForm } from "@/components/ContactForm";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [allData, setAllData] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAssessmentComplete = (data: { rating: number; feedback: string }) => {
    setAllData((prev) => [...prev, { groupId: ASSESSMENT_GROUPS[currentStep].id, ...data }]);
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => prev + 1);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (contact: { name: string; email: string }) => {
    const finalSubmission = {
      assessments: allData,
      user: contact,
      submittedAt: new Date().toISOString(),
    };
    
    console.log("Local Submission Recorded:", finalSubmission);
    setCompletedSteps((prev) => new Set(prev).add(ASSESSMENT_GROUPS.length));
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-headline animate-pulse">Initializing Laboratory...</p>
      </div>
    );
  }

  const progressPercentage = ((currentStep) / (ASSESSMENT_GROUPS.length + 1)) * 100;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <div className="hidden md:block w-64 fixed inset-y-0 left-0">
        <AssessmentSidebar
          groups={ASSESSMENT_GROUPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      <main className="flex-1 md:ml-64">
        <div className="md:hidden bg-primary p-6 text-white">
          <h1 className="font-headline text-xl">Voice Assessment</h1>
          <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/60">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1 bg-white/20 mt-2" />
        </div>

        <div className="hidden md:flex sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b px-8 py-4 items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Session</span>
            <span className="font-headline text-primary font-bold text-sm">
              {currentStep < ASSESSMENT_GROUPS.length ? `Module ${currentStep + 1} of ${ASSESSMENT_GROUPS.length}` : "Final Submission"}
            </span>
          </div>
          <div className="w-48 space-y-1">
             <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5 bg-secondary" />
          </div>
        </div>

        <div className="container px-6 md:px-12 pb-20">
          {currentStep < ASSESSMENT_GROUPS.length ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <AssessmentForm
                key={ASSESSMENT_GROUPS[currentStep].id}
                group={ASSESSMENT_GROUPS[currentStep]}
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
