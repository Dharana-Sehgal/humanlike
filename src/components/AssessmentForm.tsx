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
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <section className="space-y-6">
        <h2 className="text-2xl font-headline text-primary font-bold">Listen and Evaluate</h2>
        <AudioPlayer src={recording.audioUrl} title={recording.title} />
      </section>

      <section className="space-y-10">
        <div className="space-y-4">
          <Label className="text-lg font-headline block font-medium leading-relaxed">
            1. Overall how effectively do you think this bot sounds human?
          </Label>
          <div className="w-full">
            <StarRating value={rating} onChange={setRating} />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-headline block font-medium leading-relaxed">
            2. In your own words, what made the conversation feel more like a real human (or more like a bot)?
          </Label>
          <Textarea
            placeholder="Describe your experience with the bot's tone, pacing, and vocabulary..."
            className="min-h-[160px] bg-white text-base focus-visible:ring-accent border-muted shadow-sm p-4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="pt-4">
          <Button
            onClick={() => onComplete({ rating, feedback })}
            disabled={!isSubmittable}
            className="w-full sm:w-auto px-10 h-12 text-base font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 rounded-full"
          >
            Submit Evaluation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
