"use client";

import { useState } from "react";
import { Recording } from "@/lib/assessment-data";
import { StarRating } from "./StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AudioPlayer } from "./AudioPlayer";
import { ArrowRight } from "lucide-react";

interface AssessmentFormProps {
  recording: Recording;
  onComplete: (data: { rating: number; feedback: string }) => void;
}

export function AssessmentForm({ recording, onComplete }: AssessmentFormProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const isSubmittable = rating > 0 && feedback.trim().length > 5;

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-headline text-primary">Listen and Evaluate</h2>
          <p className="text-muted-foreground">Focus on the nuances of the voice and response patterns.</p>
        </div>
        <AudioPlayer src={recording.audioUrl} title={recording.title} />
      </section>

      <div className="h-px bg-border w-full" />

      <section className="space-y-8">
        <div className="space-y-4">
          <Label className="text-lg font-headline block">
            1. Overall how effectively do you think this bot sounds human?
          </Label>
          <div className="bg-white p-8 rounded-xl border shadow-sm w-full">
            <div className="flex justify-center md:justify-start">
              <StarRating value={rating} onChange={setRating} />
            </div>
            <p className="mt-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-t pt-4">
              {rating === 0 ? "Select a rating" : `${rating} out of 5 Stars - ${["Needs Improvement", "Poor", "Average", "Good", "Excellent"][rating - 1]}`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-headline block">
            2. In your own words, what made the conversation feel more like a real human (or more like a bot)?
          </Label>
          <Textarea
            placeholder="Describe your experience with the bot's tone, pacing, and vocabulary..."
            className="min-h-[150px] bg-white text-base focus-visible:ring-accent border-muted shadow-sm"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <Button
          onClick={() => onComplete({ rating, feedback })}
          disabled={!isSubmittable}
          className="w-full sm:w-auto px-12 h-14 text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/20 rounded-full"
        >
          Submit Evaluation
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  );
}