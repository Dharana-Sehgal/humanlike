"use client";

import { useState } from "react";
import { Recording } from "@/lib/assessment-data";
import { StarRating } from "./StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AudioPlayer } from "./AudioPlayer";
import { ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentFormProps {
  recording: Recording;
  onComplete: (data: { rating: number; feedback: string }) => void;
}

export function AssessmentForm({ recording, onComplete }: AssessmentFormProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const isSubmittable = isFinished && rating > 0 && feedback.trim().length > 5;

  // Use the primary purple from the sidebar for matching text
  const primaryColorClass = "text-[#4c2a85]";
  const primaryBgClass = "bg-[#4c2a85]";
  const primaryHoverClass = "hover:bg-[#3a2065]";

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-6 w-1 rounded-full", primaryBgClass)} />
          <h2 className={cn("text-base font-headline font-bold tracking-tight", primaryColorClass)}>
            Listen to Recording
          </h2>
        </div>
        
        <AudioPlayer 
          src={recording.audioUrl} 
          title={recording.title} 
          onEnded={() => setIsFinished(true)}
        />
      </section>

      <div className={!isFinished ? "opacity-30 pointer-events-none grayscale" : "animate-in fade-in duration-500"}>
        <section className="space-y-8">
          <div className="space-y-4">
            <Label className={cn("text-xs font-bold uppercase tracking-widest block leading-relaxed", primaryColorClass)}>
              Assessment: {recording.title}
            </Label>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">How human-like does this voice sample sound?</p>
              <div className="max-w-[200px]">
                <StarRating value={rating} onChange={setRating} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <Label className="text-xs font-medium block leading-relaxed text-foreground/80">
              What specific qualities of the speech influenced your rating?
            </Label>
            <Textarea
              placeholder="Pacing, emotion, clarity..."
              className="min-h-[120px] bg-white text-sm focus-visible:ring-[#4c2a85] border-slate-200 shadow-sm p-4 rounded-xl resize-none"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={() => onComplete({ rating, feedback })}
              disabled={!isSubmittable}
              className={cn("w-full sm:w-auto px-8 h-11 text-xs font-bold text-white transition-all shadow-md rounded-full", primaryBgClass, primaryHoverClass)}
            >
              {!isFinished && <Lock className="mr-2 h-3.5 w-3.5" />}
              {isFinished ? "Submit Evaluation" : "Finish Listening"}
              {isFinished && <ArrowRight className="ml-2 h-3.5 w-3.5" />}
            </Button>
            {!isFinished && (
              <p className="text-[10px] text-muted-foreground italic font-medium">
                Please listen to the recording fully to unlock the form.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
