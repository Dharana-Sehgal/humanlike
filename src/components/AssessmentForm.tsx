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
    <div className="max-w-3xl py-12 space-y-16">
      {/* Audio Playback Section */}
      <section className="space-y-6 text-left">
        <div className="space-y-1">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3a2065]">
            Acoustic Analysis
          </h2>
          <p className="text-slate-500 text-xs">Listen to the full recording to unlock the assessment metrics.</p>
        </div>
        
        <AudioPlayer 
          src={recording.audioUrl} 
          title={recording.title} 
          onEnded={() => setIsFinished(true)}
        />
      </section>

      {/* Assessment Section - Unlocked after listening */}
      <div className={cn(
        "transition-all duration-700",
        !isFinished ? "opacity-20 pointer-events-none grayscale" : "opacity-100"
      )}>
        <section className="space-y-14 text-left">
          {/* Question 1: Rating */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3a2065]/60">
                Metric 01: Human Authenticity
              </Label>
              <p className="text-base text-slate-800 font-medium leading-relaxed max-w-2xl">
                How human-like does this voice interaction sound?
              </p>
            </div>
            <div className="max-w-2xl px-2">
              <StarRating value={rating} onChange={setRating} />
            </div>
          </div>

          {/* Question 2: Feedback */}
          <div className="space-y-6">
            <div className="space-y-3">
               <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3a2065]/60">
                Metric 02: Qualitative Nuance
              </Label>
              <p className="text-base text-slate-800 font-medium leading-relaxed max-w-2xl">
                What specific characteristics influenced your rating?
              </p>
            </div>
            <Textarea
              placeholder="Provide objective observations on cadence, emotion, and clarity..."
              className="min-h-[160px] max-w-2xl bg-white text-sm focus-visible:ring-[#3a2065] border-slate-200 rounded-xl resize-none p-5 shadow-sm"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submission Bar */}
          <div className="flex items-center justify-between gap-4 pt-10 border-t border-slate-200 max-w-2xl">
            <div className="flex items-center gap-3">
              {!isFinished ? (
                <div className="flex items-center gap-2 text-[9px] text-slate-400 uppercase font-bold tracking-[0.15em]">
                  <Lock className="h-3 w-3" />
                  <span>Playback Required to Unlock Analysis</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[9px] text-accent font-bold uppercase tracking-[0.15em]">
                  <span>Analysis Ready for Submission</span>
                </div>
              )}
            </div>
            <Button
              onClick={() => onComplete({ rating, feedback })}
              disabled={!isSubmittable}
              className="px-12 h-11 text-[11px] font-bold text-white transition-all rounded-full group bg-[#3a2065] hover:bg-[#3a2065]/90 shadow-lg"
            >
              Commit & Continue
              <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
