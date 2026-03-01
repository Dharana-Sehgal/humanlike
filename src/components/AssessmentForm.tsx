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
    <div className="max-w-2xl mx-auto space-y-10 py-6">
      {/* Audio Playback Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-5 w-1 rounded-full", primaryBgClass)} />
          <h2 className={cn("text-sm font-headline font-bold uppercase tracking-[0.15em]", primaryColorClass)}>
            Listen to Recording
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
        "transition-all duration-500",
        !isFinished ? "opacity-30 pointer-events-none grayscale" : "opacity-100 animate-in fade-in slide-in-from-top-4"
      )}>
        <section className="space-y-12">
          {/* Question 1: Rating */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-[0.2em] block leading-relaxed opacity-70", primaryColorClass)}>
                Metric: Human-Likeness
              </Label>
              <p className="text-lg md:text-xl text-slate-800 font-semibold leading-snug">
                On a scale of 1 to 5, how human-like does this voice interaction sound?
              </p>
            </div>
            <div className="w-fit">
              <StarRating value={rating} onChange={setRating} />
            </div>
          </div>

          {/* Question 2: Feedback */}
          <div className="space-y-4">
            <div className="space-y-2">
               <Label className="text-xs font-bold uppercase tracking-[0.2em] block leading-relaxed text-slate-500">
                Qualitative Insights
              </Label>
              <p className="text-lg text-slate-800 font-semibold">
                What specific characteristics (pacing, clarity, emotion) influenced your rating?
              </p>
            </div>
            <Textarea
              placeholder="Share your thoughts on the recording's quality..."
              className="min-h-[120px] bg-white text-base focus-visible:ring-[#3a2065] border-slate-200 shadow-sm p-5 rounded-2xl resize-none"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submission Bar */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {!isFinished ? (
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                  <Lock className="h-3 w-3" />
                  <span>Playback Required</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[9px] text-emerald-600 uppercase font-bold tracking-widest">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Analysis Ready
                </div>
              )}
            </div>
            <Button
              onClick={() => onComplete({ rating, feedback })}
              disabled={!isSubmittable}
              className={cn(
                "px-10 h-11 text-[11px] font-bold text-white transition-all shadow-lg rounded-full active:scale-95 group", 
                primaryBgClass, 
                primaryHoverClass
              )}
            >
              Submit Evaluation
              <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
