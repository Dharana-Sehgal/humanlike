"use client";

import { useState } from "react";
import { AssessmentGroup } from "@/lib/assessment-data";
import { StarRating } from "./StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AudioPlayer } from "./AudioPlayer";
import { ArrowRight, Lock } from "lucide-react";

interface AssessmentFormProps {
  group: AssessmentGroup;
  onComplete: (data: { rating: number; feedback: string }) => void;
}

export function AssessmentForm({ group, onComplete }: AssessmentFormProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [finishedRecordings, setFinishedRecordings] = useState<Set<string>>(new Set());

  const allAudioFinished = finishedRecordings.size === group.recordings.length;
  const isSubmittable = allAudioFinished && rating > 0 && feedback.trim().length > 5;

  const handleAudioEnded = (recordingId: string) => {
    setFinishedRecordings(prev => new Set(prev).add(recordingId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-primary rounded-full" />
          <h2 className="text-xl font-headline text-primary font-bold">{group.title}</h2>
        </div>
        
        <div className="grid gap-4">
          {group.recordings.map((rec) => (
            <AudioPlayer 
              key={rec.id}
              src={rec.audioUrl} 
              title={rec.title} 
              onEnded={() => handleAudioEnded(rec.id)}
            />
          ))}
        </div>
      </section>

      <div className={!allAudioFinished ? "opacity-30 pointer-events-none grayscale" : "animate-in fade-in duration-500"}>
        <section className="space-y-8">
          <div className="space-y-4">
            <Label className="text-sm font-medium block leading-relaxed text-foreground/80">
              1. Overall how effectively do you think these samples sound human?
            </Label>
            <div className="w-full">
              <StarRating value={rating} onChange={setRating} />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium block leading-relaxed text-foreground/80">
              2. In your own words, what made this conversation feel more like a real human (or more like a bot)?
            </Label>
            <Textarea
              placeholder="Describe your experience with the tone, pacing, and vocabulary..."
              className="min-h-[100px] bg-transparent text-sm focus-visible:ring-accent border-muted shadow-none p-3 rounded-xl"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={() => onComplete({ rating, feedback })}
              disabled={!isSubmittable}
              className="w-full sm:w-auto px-8 h-10 text-[11px] font-bold bg-primary hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/20 rounded-full"
            >
              {!allAudioFinished && <Lock className="mr-2 h-3.5 w-3.5" />}
              {allAudioFinished ? "Submit Evaluation" : `Listen to all samples (${finishedRecordings.size}/${group.recordings.length})`}
              {allAudioFinished && <ArrowRight className="ml-2 h-3.5 w-3.5" />}
            </Button>
            {!allAudioFinished && (
              <p className="text-[10px] text-muted-foreground italic font-medium">
                Please listen to all recordings in full to unlock the form.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
