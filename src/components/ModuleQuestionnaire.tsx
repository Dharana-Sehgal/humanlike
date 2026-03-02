
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

  const primaryColorClass = "text-[#3a2065]";
  const primaryBgClass = "bg-[#3a2065]";
  const primaryHoverClass = "hover:bg-[#2d1b4e]";

  return (
    <div className="max-w-3xl py-6 space-y-10">
      <div className="space-y-1">
        <h2 className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", primaryColorClass)}>
          Module Synthesis
        </h2>
        <p className="text-xl text-slate-900 font-bold tracking-tight">
          Comparison Questionnaire
        </p>
      </div>

      <div className="space-y-10">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Preference Analysis
            </Label>
            <p className="text-base text-slate-800 font-medium">
              Based on the recordings in this section, which bot was better?
            </p>
          </div>
          
          <RadioGroup 
            value={betterBotId} 
            onValueChange={setBetterBotId}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
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
                    "flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer transition-all duration-200",
                    betterBotId === rec.id 
                      ? "border-[#3a2065] bg-slate-50 ring-1 ring-[#3a2065]/20" 
                      : "hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "h-3 w-3 rounded-full border transition-colors",
                    betterBotId === rec.id ? "bg-[#3a2065] border-[#3a2065]" : "border-slate-300"
                  )} />
                  <span className="text-sm font-medium text-slate-800">{rec.title}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
             <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Qualitative Insight
            </Label>
            <p className="text-base text-slate-800 font-medium">
              Which bot would you prefer to talk to and why?
            </p>
          </div>
          <Textarea
            placeholder="Help us understand your preference..."
            className="min-h-[100px] bg-slate-50/50 text-sm focus-visible:ring-[#3a2065] border-slate-200 rounded-xl resize-none"
            value={preferenceFeedback}
            onChange={(e) => setPreferenceFeedback(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end pt-6 border-t border-slate-100">
          <Button
            onClick={() => onComplete({ betterBotId, preferenceFeedback })}
            disabled={!isSubmittable}
            className={cn(
              "px-8 h-10 text-[10px] font-bold text-white transition-all rounded-full group", 
              primaryBgClass, 
              primaryHoverClass
            )}
          >
            Continue to Next Phase
            <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
