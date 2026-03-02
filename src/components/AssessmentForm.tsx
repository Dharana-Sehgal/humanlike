
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

  return (
    <div className="max-w-4xl py-10 space-y-12">
      {/* Audio Playback Section */}
      <section className="space-y-4 text-left">
        <AudioPlayer 
          src={recording.audioUrl} 
          title={recording.title} 
          onEnded={() => setIsFinished(true)}
        />
        <p className="text-slate-500 text-xs px-1">Listen to the full recording to unlock the assessment metrics.</p>
      </section>

      {/* Assessment Section - Unlocked after listening */}
      <div className={cn(
        "transition-all duration-700",
        !isFinished ? "opacity-20 pointer-events-none grayscale" : "opacity-100"
      )}>
        <section className="space-y-12 text-left">
          {/* Question 1: Rating */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary/70">
                Metric 01: Human Authenticity
              </Label>
              <p className="text-lg text-slate-800 font-medium leading-relaxed max-w-2xl">
                How human-like does this voice interaction sound?
              </p>
            </div>
            <div className="max-w-xs flex justify-start px-0">
              <StarRating value={rating} onChange={setRating} />
            </div>
          </div>

          {/* Question 2: Feedback */}
          <div className="space-y-5">
            <div className="space-y-1.5">
               <Label className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary/70">
                Metric 02: Qualitative Nuance
              </Label>
              <p className="text-lg text-slate-800 font-medium leading-relaxed max-w-2xl">
                What specific characteristics influenced your rating?
              </p>
            </div>
            <Textarea
              placeholder="Provide objective observations on cadence, emotion, and clarity..."
              className="min-h-[140px] max-w-2xl bg-white text-base focus-visible:ring-primary border-slate-200 rounded-xl resize-none p-5 shadow-sm"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submission Bar */}
          <div className="flex items-center justify-end gap-4 pt-10 border-t border-slate-200 max-w-2xl">
            <div className="flex items-center gap-3">
              {!isFinished && (
                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-[0.15em]">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Playback Required</span>
                </div>
              )}
            </div>
            <Button
              onClick={() => onComplete({ rating, feedback })}
              disabled={!isSubmittable}
              className="px-12 h-11 text-xs font-bold text-white transition-all rounded-full group bg-primary hover:bg-primary/90 shadow-lg"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
