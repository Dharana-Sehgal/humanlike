"use client";

import { useState } from "react";
import { Recording } from "@/lib/assessment-data";
import { StarRating } from "./StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AudioPlayer } from "./AudioPlayer";
import { ArrowRight, Lock } from "lucide-react";

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
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 bg-primary rounded-full" />
          <h2 className="text-lg font-headline text-primary font-bold">Listen to Recording</h2>
        </div>
        
        <AudioPlayer 
          src={recording.audioUrl} 
          title={recording.title} 
          onEnded={() => setIsFinished(true)}
        />
      </section>

      <div className={!isFinished ? "opacity-30 pointer-events-none grayscale" : "animate-in fade-in duration-500"}>
        <section className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-medium block leading-relaxed text-foreground/80">
              How human-like does this specific voice sample sound to you?
            </Label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-medium block leading-relaxed text-foreground/80">
              What specific qualities of the speech influenced your rating?
            </Label>
            <Textarea
              placeholder="Pacing, emotion, clarity..."
              className="min-h-[80px] bg-transparent text-xs focus-visible:ring-accent border-muted shadow-none p-3 rounded-xl"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={() => onComplete({ rating, feedback })}
              disabled={!isSubmittable}
              className="w-full sm:w-auto px-6 h-9 text-[10px] font-bold bg-primary hover:bg-primary/90 transition-all shadow-md rounded-full"
            >
              {!isFinished && <Lock className="mr-2 h-3 w-3" />}
              {isFinished ? "Submit Sample" : "Finish Listening"}
              {isFinished && <ArrowRight className="ml-2 h-3 w-3" />}
            </Button>
            {!isFinished && (
              <p className="text-[9px] text-muted-foreground italic font-medium">
                Please listen to the recording fully to unlock the form.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
