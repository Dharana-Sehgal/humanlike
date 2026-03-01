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

  // Primary tone matching the sidebar gradient
  const primaryColorClass = "text-[#3a2065]";
  const primaryBgClass = "bg-[#3a2065]";
  const primaryHoverClass = "hover:bg-[#2d1b4e]";

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-4">
      <section className="space-y-2">
        <div className="flex items-center gap-3">
          <div className={cn("h-4 w-1 rounded-full", primaryBgClass)} />
          <h2 className={cn("text-xs font-headline font-bold uppercase tracking-tight", primaryColorClass)}>
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
        <section className="space-y-4">
          <div className="space-y-4 bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="space-y-2">
              <Label className={cn("text-[10px] font-bold uppercase tracking-widest block leading-relaxed", primaryColorClass)}>
                Rating: {recording.title}
              </Label>
              <div className="flex items-center gap-6">
                <p className="text-[11px] text-muted-foreground font-medium flex-1">How human-like does this voice sample sound?</p>
                <div className="w-40">
                  <StarRating value={rating} onChange={setRating} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] font-bold uppercase tracking-widest block leading-relaxed text-foreground/60">
                Detailed Feedback
              </Label>
              <Textarea
                placeholder="Pacing, emotion, clarity..."
                className="min-h-[60px] bg-white text-xs focus-visible:ring-[#3a2065] border-slate-200 shadow-sm p-3 rounded-xl resize-none"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                {!isFinished && (
                  <p className="text-[9px] text-muted-foreground italic font-medium">
                    Listen fully to unlock evaluation.
                  </p>
                )}
              </div>
              <Button
                onClick={() => onComplete({ rating, feedback })}
                disabled={!isSubmittable}
                className={cn("px-8 h-9 text-[10px] font-bold text-white transition-all shadow-md rounded-full", primaryBgClass, primaryHoverClass)}
              >
                {!isFinished && <Lock className="mr-2 h-3 w-3" />}
                {isFinished ? "Submit Evaluation" : "Finish Listening"}
                {isFinished && <ArrowRight className="ml-2 h-3 w-3" />}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
