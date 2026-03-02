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

  const primaryColorClass = "text-[#3a2065]";
  const primaryBgClass = "bg-[#3a2065]";
  const primaryHoverClass = "hover:bg-[#2d1b4e]";

  return (
    <div className="max-w-4xl py-10 space-y-12">
      {/* Audio Playback Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={cn("h-4 w-0.5 rounded-full", primaryBgClass)} />
          <h2 className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", primaryColorClass)}>
            Recording Analysis
          </h2>
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
        <section className="space-y-12 text-left">
          {/* Question 1: Rating */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className={cn("text-[10px] font-bold uppercase tracking-[0.15em] opacity-60", primaryColorClass)}>
                Metric 01: Human-Likeness
              </Label>
              <p className="text-lg text-slate-800 font-medium leading-relaxed">
                How human-like does this voice interaction sound?
              </p>
            </div>
            <div className="flex justify-start">
              <StarRating value={rating} onChange={setRating} />
            </div>
          </div>

          {/* Question 2: Feedback */}
          <div className="space-y-6">
            <div className="space-y-2">
               <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                Metric 02: Qualitative Evaluation
              </Label>
              <p className="text-lg text-slate-800 font-medium leading-relaxed">
                What specific characteristics influenced your rating?
              </p>
            </div>
            <Textarea
              placeholder="Share your thoughts on pacing, clarity, or emotion..."
              className="min-h-[140px] bg-slate-50/50 text-sm focus-visible:ring-[#3a2065] border-slate-200 rounded-xl resize-none p-4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submission Bar */}
          <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              {!isFinished && (
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Playback Required to Unlock</span>
                </div>
              )}
            </div>
            <Button
              onClick={() => onComplete({ rating, feedback })}
              disabled={!isSubmittable}
              className={cn(
                "px-10 h-11 text-[11px] font-bold text-white transition-all rounded-full group", 
                primaryBgClass, 
                primaryHoverClass
              )}
            >
              Continue to Next Step
              <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
