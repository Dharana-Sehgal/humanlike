"use client";

import { useState, useEffect } from "react";
import { ASSESSMENT_MODULES, FLAT_RECORDINGS } from "@/lib/assessment-data";
import { AssessmentSidebar } from "@/components/AssessmentSidebar";
import { AssessmentForm } from "@/components/AssessmentForm";
import { ContactForm } from "@/components/ContactForm";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function AssessmentPage() {
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(FLAT_RECORDINGS[0].id);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [allData, setAllData] = useState<Record<string, { rating: number; feedback: string }>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAssessmentComplete = (data: { rating: number; feedback: string }) => {
    if (!activeRecordingId) return;

    setAllData((prev) => ({ ...prev, [activeRecordingId]: data }));
    setCompletedSteps((prev) => new Set(prev).add(activeRecordingId));

    // Automatically move to the next recording in the flat list
    const currentIndex = FLAT_RECORDINGS.findIndex(r => r.id === activeRecordingId);
    if (currentIndex < FLAT_RECORDINGS.length - 1) {
      setActiveRecordingId(FLAT_RECORDINGS[currentIndex + 1].id);
    } else {
      setActiveRecordingId(null); // Show contact form
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModuleSelect = (moduleId: string) => {
    const module = ASSESSMENT_MODULES.find(m => m.id === moduleId);
    if (module && module.recordings.length > 0) {
      setActiveRecordingId(module.recordings[0].id);
    }
  };

  const handleContactSubmit = (contact: { name: string; email: string }) => {
    const assessmentsArray = Object.entries(allData).map(([id, data]) => ({
      recordingId: id,
      ...data
    }));

    const finalSubmission = {
      assessments: assessmentsArray,
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

  const activeRecording = FLAT_RECORDINGS.find(r => r.id === activeRecordingId);
  const progressPercentage = (completedSteps.size / FLAT_RECORDINGS.length) * 100;
  const isFinished = activeRecordingId === null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Sidebar - Width set to 64 */}
      <div className="hidden md:block w-64 fixed inset-y-0 left-0 border-r border-black/5">
        <AssessmentSidebar
          modules={ASSESSMENT_MODULES}
          activeRecordingId={activeRecordingId}
          completedRecordingIds={completedSteps}
          onSelectModule={handleModuleSelect}
          onShowFinalStep={() => setActiveRecordingId(null)}
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

        {/* Desktop Header - Simplified Grey bar */}
        <div className="hidden md:flex sticky top-0 z-10 bg-slate-100/95 backdrop-blur-sm border-b px-8 py-5 items-center justify-between">
          <div className="flex flex-col min-w-0 mr-8 flex-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Evaluation Phase</span>
            <span className="font-headline text-slate-500 font-bold text-sm tracking-tight truncate uppercase">
              {activeRecording ? activeRecording.moduleTitle : "Final Submission"}
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
          {!isFinished && activeRecording ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <AssessmentForm
                key={activeRecording.id}
                recording={activeRecording}
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
