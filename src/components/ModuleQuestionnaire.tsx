
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
    <div className="max-w-4xl py-10 space-y-12 text-left">
      <div className="space-y-2">
        <p className="text-2xl text-slate-900 font-bold tracking-tight">
          Comparison Assessment
        </p>
      </div>

      <div className="space-y-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Metric 03: Preference Analysis
            </Label>
            <p className="text-lg text-slate-800 font-medium leading-relaxed">
              Based on the recordings in this section, which bot was better?
            </p>
          </div>
          
          <RadioGroup 
            value={betterBotId} 
            onValueChange={setBetterBotId}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl"
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
                    "flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl cursor-pointer transition-all duration-200",
                    betterBotId === rec.id 
                      ? "border-primary bg-slate-50 ring-1 ring-primary/20 shadow-sm" 
                      : "hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "h-4 w-4 rounded-full border transition-colors",
                    betterBotId === rec.id ? "bg-primary border-primary" : "border-slate-300"
                  )} />
                  <span className="text-sm font-medium text-slate-800">{rec.title}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
             <Label className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Metric 04: Qualitative Insight
            </Label>
            <p className="text-lg text-slate-800 font-medium leading-relaxed">
              Which bot would you prefer to talk to and why?
            </p>
          </div>
          <Textarea
            placeholder="Help us understand your preference with specific details..."
            className="min-h-[160px] max-w-2xl bg-white text-base focus-visible:ring-primary border-slate-200 rounded-xl resize-none p-5 shadow-sm"
            value={preferenceFeedback}
            onChange={(e) => setPreferenceFeedback(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end pt-10 border-t border-slate-100 max-w-2xl">
          <Button
            onClick={() => onComplete({ betterBotId, preferenceFeedback })}
            disabled={!isSubmittable}
            className="px-12 h-12 text-xs font-bold text-white transition-all rounded-full group bg-primary hover:bg-primary/90 shadow-md"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
