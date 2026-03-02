"use client";

import { useState } from "react";
import { AssessmentModule } from "@/lib/assessment-data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleQuestionnaireProps {
  module: AssessmentModule;
  onComplete: (data: { betterBotId: string; preferenceFeedback: string }) => void;
}

export function ModuleQuestionnaire({ module, onComplete }: ModuleQuestionnaireProps) {
  const [betterBotId, setBetterBotId] = useState("");
  const [preferenceFeedback, setPreferenceFeedback] = useState("");

  const isSubmittable = betterBotId !== "" && preferenceFeedback.trim().length > 5;

  return (
    <div className="w-full max-w-2xl py-6 space-y-12 text-left">
      <div className="space-y-2">
        <p className="text-3xl text-slate-900 font-bold tracking-tight">
          Comparison Assessment
        </p>
      </div>

      <div className="space-y-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
              Metric 03: Preference Analysis
            </Label>
            <p className="text-xl text-slate-800 font-medium leading-relaxed">
              Based on the recordings in this section, which bot was better?
            </p>
          </div>
          
          <RadioGroup 
            value={betterBotId} 
            onValueChange={setBetterBotId}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {module.recordings.map((rec) => (
              <div key={rec.id}>
                <RadioGroupItem
                  value={rec.id}
                  id={rec.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={rec.id}
                  className={cn(
                    "flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-xl cursor-pointer transition-all duration-200",
                    betterBotId === rec.id 
                      ? "border-primary bg-slate-50 ring-1 ring-primary/20 shadow-sm" 
                      : "hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "h-5 w-5 rounded-full border transition-colors",
                    betterBotId === rec.id ? "bg-primary border-primary" : "border-slate-300"
                  )} />
                  <span className="text-lg font-medium text-slate-800">{rec.title}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
             <Label className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
              Metric 04: Qualitative Insight
            </Label>
            <p className="text-xl text-slate-800 font-medium leading-relaxed">
              Which bot would you prefer to talk to and why?
            </p>
          </div>
          <Textarea
            placeholder="Help us understand your preference with specific details..."
            className="min-h-[180px] w-full bg-white text-lg focus-visible:ring-primary border-slate-200 rounded-xl resize-none p-6 shadow-sm"
            value={preferenceFeedback}
            onChange={(e) => setPreferenceFeedback(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end pt-10 border-t border-slate-100 w-full">
          <Button
            onClick={() => onComplete({ betterBotId, preferenceFeedback })}
            disabled={!isSubmittable}
            className="px-20 h-14 text-sm font-bold text-white transition-all rounded-full group bg-primary hover:bg-primary/90 shadow-lg"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}