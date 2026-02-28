
"use client";

import { useState, useEffect, useMemo } from "react";
import { Recording } from "@/lib/assessment-data";
import { AssessmentSidebar } from "@/components/AssessmentSidebar";
import { AssessmentForm } from "@/components/AssessmentForm";
import { ContactForm } from "@/components/ContactForm";
import { Progress } from "@/components/ui/progress";
import { collection, addDoc, query, orderBy } from "firebase/firestore";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Loader2 } from "lucide-react";

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [allData, setAllData] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const db = useFirestore();

  // Memoize the query for recordings sorted by 'order'
  const recordingsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'recordings'), orderBy('order', 'asc'));
  }, [db]);

  const { data: recordings, loading: recordingsLoading } = useCollection<Recording>(recordingsQuery);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAssessmentComplete = (data: { rating: number; feedback: string }) => {
    if (!recordings) return;
    
    setAllData((prev) => [...prev, { recordingId: recordings[currentStep].id, ...data }]);
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
    
    if (db) {
      const submissionsRef = collection(db, 'submissions');
      addDoc(submissionsRef, finalSubmission)
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: submissionsRef.path,
            operation: 'create',
            requestResourceData: finalSubmission,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }

    setCompletedSteps((prev) => new Set(prev).add(recordings?.length || 0));
  };

  if (!isMounted || recordingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-headline animate-pulse">Initializing Laboratory...</p>
      </div>
    );
  }

  if (!recordings || recordings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
        <h2 className="text-2xl font-headline text-primary mb-2">No Recordings Available</h2>
        <p className="text-muted-foreground">The assessment laboratory is currently offline or has no data.</p>
      </div>
    );
  }

  const progressPercentage = ((currentStep) / (recordings.length + 1)) * 100;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Progress Sidebar - Desktop Only */}
      <div className="hidden md:block w-80 fixed inset-y-0 left-0">
        <AssessmentSidebar
          recordings={recordings}
          currentStep={currentStep}
          completedSteps={completedSteps}
          totalSteps={recordings.length + 1}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-80">
        {/* Mobile Header */}
        <div className="md:hidden bg-primary p-6 text-white">
          <h1 className="font-headline text-2xl">Voice Assessment</h1>
          <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/60">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1 bg-white/20 mt-2" />
        </div>

        {/* Header - Desktop Top Bar */}
        <div className="hidden md:flex sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b px-8 py-4 items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Session</span>
            <span className="font-headline text-primary font-bold">
              {currentStep < recordings.length ? `Evaluation ${currentStep + 1} of ${recordings.length}` : "Final Submission"}
            </span>
          </div>
          <div className="w-64 space-y-2">
             <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-secondary" />
          </div>
        </div>

        <div className="container px-6 md:px-12 pb-20">
          {currentStep < recordings.length ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AssessmentForm
                recording={recordings[currentStep]}
                onComplete={handleAssessmentComplete}
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ContactForm onSubmit={handleContactSubmit} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
