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
import { Card } from "./ui/card";

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
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AudioPlayer 
        src={recording.audioUrl} 
        title={recording.title} 
        onEnded={() => setIsFinished(true)}
      />

      <div className={cn(
        "space-y-8 transition-all duration-700",
        !isFinished ? "opacity-20 pointer-events-none grayscale blur-[1px]" : "opacity-100"
      )}>
        <Card className="p-8 space-y-8 border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Metric 01: Human Authenticity
              </Label>
              <p className="text-xl text-slate-900 font-semibold tracking-tight">
                How human-like does this voice interaction sound?
              </p>
            </div>
            <div className="flex items-center gap-6">
              <StarRating value={rating} onChange={setRating} />
              {rating > 0 && (
                <span className="text-sm font-bold text-slate-400 transition-all animate-in fade-in slide-in-from-left-2">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-8 border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
               <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Metric 02: Qualitative Nuance
              </Label>
              <p className="text-xl text-slate-900 font-semibold tracking-tight">
                What specific characteristics influenced your rating?
              </p>
            </div>
            <Textarea
              placeholder="Observation on cadence, emotion, clarity..."
              className="min-h-[160px] w-full bg-slate-50/50 text-base focus-visible:ring-accent border-slate-200/60 rounded-xl resize-none p-6 shadow-inner transition-focus"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end pt-8 w-full">
          <Button
            onClick={() => onComplete({ rating, feedback })}
            disabled={!isSubmittable}
            className="px-10 h-14 text-sm font-bold text-white transition-all rounded-full group bg-[#0F172A] hover:bg-[#0F172A]/90 shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
          >
            Continue Assessment
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}