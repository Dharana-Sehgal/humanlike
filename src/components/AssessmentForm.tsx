
"use client";

import { useState } from "react";
import { Recording } from "@/lib/assessment-data";
import { StarRating } from "./StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AudioPlayer } from "./AudioPlayer";
import { ArrowRight } from "lucide-react";
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
    <div className="w-full py-6 space-y-12">
      {/* Audio Playback Section */}
      <section className="space-y-4 text-left">
        <AudioPlayer 
          src={recording.audioUrl} 
          title={recording.title} 
          onEnded={() => setIsFinished(true)}
        />
      </section>

      {/* Assessment Section */}
      <div className={cn(
        "transition-all duration-700",
        !isFinished ? "opacity-20 pointer-events-none grayscale" : "opacity-100"
      )}>
        <section className="space-y-12 text-left">
          {/* Question 1: Rating */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                Metric 01: Human Authenticity
              </Label>
              <p className="text-xl text-slate-800 font-medium leading-relaxed">
                How human-like does this voice interaction sound?
              </p>
            </div>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Question 2: Feedback */}
          <div className="space-y-6">
            <div className="space-y-2">
               <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                Metric 02: Qualitative Nuance
              </Label>
              <p className="text-xl text-slate-800 font-medium leading-relaxed">
                What specific characteristics influenced your rating?
              </p>
            </div>
            <Textarea
              placeholder="Provide objective observations on cadence, emotion, and clarity..."
              className="min-h-[160px] w-full bg-white text-base focus-visible:ring-primary border-slate-200 rounded-xl resize-none p-6 shadow-sm"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submission Bar */}
          <div className="flex items-center justify-end pt-10 border-t border-slate-200 w-full">
            <Button
              onClick={() => onComplete({ rating, feedback })}
              disabled={!isSubmittable}
              className="px-20 h-14 text-sm font-bold text-white transition-all rounded-full group bg-primary hover:bg-primary/90 shadow-lg"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
