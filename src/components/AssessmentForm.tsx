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
  const [hasFinishedAudio, setHasFinishedAudio] = useState(false);

  const isSubmittable = hasFinishedAudio && rating > 0 && feedback.trim().length > 5;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <section className="space-y-4">
        <h2 className="text-lg font-headline text-primary font-bold">Listen and Evaluate</h2>
        <AudioPlayer 
          src={recording.audioUrl} 
          title={recording.title} 
          onEnded={() => setHasFinishedAudio(true)}
        />
      </section>

      <div className={!hasFinishedAudio ? "opacity-40 pointer-events-none grayscale-[0.5]" : ""}>
        <section className="space-y-8">
          <div className="space-y-4">
            <Label className="text-sm font-headline block font-medium leading-relaxed">
              1. Overall how effectively do you think this bot sounds human?
            </Label>
            <div className="w-full">
              <StarRating value={rating} onChange={setRating} />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-headline block font-medium leading-relaxed">
              2. In your own words, what made the conversation feel more like a real human (or more like a bot)?
            </Label>
            <Textarea
              placeholder="Describe your experience with the bot's tone, pacing, and vocabulary..."
              className="min-h-[120px] bg-white text-xs focus-visible:ring-accent border-muted shadow-sm p-3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={() => onComplete({ rating, feedback })}
              disabled={!isSubmittable}
              className="w-full sm:w-auto px-5 h-9 text-[11px] font-bold bg-primary hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/10 rounded-full"
            >
              {!hasFinishedAudio && <Lock className="mr-2 h-3.5 w-3.5" />}
              {hasFinishedAudio ? "Submit Evaluation" : "Listen to Finish"}
              {hasFinishedAudio && <ArrowRight className="ml-2 h-3.5 w-3.5" />}
            </Button>
            {!hasFinishedAudio && (
              <p className="mt-3 text-[10px] text-muted-foreground italic">
                Please listen to the recording in full to unlock the evaluation form.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
