"use client";

import { useState } from "react";
import { AssessmentModule } from "@/lib/assessment-data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, ClipboardList } from "lucide-react";
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
    <div className="max-w-2xl mx-auto space-y-12 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className={cn("p-3 rounded-2xl bg-slate-50 border border-slate-100", primaryColorClass)}>
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>
        <h2 className={cn("text-xs font-headline font-bold uppercase tracking-[0.2em]", primaryColorClass)}>
          Module Synthesis
        </h2>
        <p className="text-2xl text-slate-900 font-bold tracking-tight">
          Comparison Questionnaire
        </p>
      </div>

      <div className="space-y-12">
        {/* Question 1: Bot Choice */}
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] block leading-relaxed text-slate-500">
              Preference Metric
            </Label>
            <p className="text-lg text-slate-800 font-bold">
              Based on the recordings in this section, which bot was better?
            </p>
          </div>
          
          <RadioGroup 
            value={betterBotId} 
            onValueChange={setBetterBotId}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto"
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
                    "flex flex-col items-center justify-center p-6 bg-white border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-50",
                    betterBotId === rec.id 
                      ? "border-[#3a2065] bg-slate-50 ring-2 ring-[#3a2065]/10" 
                      : "border-slate-100"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Choice</span>
                  <span className="text-base font-bold text-slate-800">{rec.title}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Question 2: Qualitative preference */}
        <div className="space-y-4">
          <div className="space-y-2 text-center">
             <Label className="text-[10px] font-bold uppercase tracking-[0.2em] block leading-relaxed text-slate-500">
              Deep Insights
            </Label>
            <p className="text-lg text-slate-800 font-bold">
              Which bot would you prefer to talk to and why?
            </p>
          </div>
          <Textarea
            placeholder="Help us understand your preference..."
            className="min-h-[120px] bg-white text-base focus-visible:ring-[#3a2065] border-slate-200 shadow-sm p-6 rounded-2xl resize-none"
            value={preferenceFeedback}
            onChange={(e) => setPreferenceFeedback(e.target.value)}
          />
        </div>

        {/* Submission Bar */}
        <div className="flex items-center justify-end pt-6 border-t border-slate-100">
          <Button
            onClick={() => onComplete({ betterBotId, preferenceFeedback })}
            disabled={!isSubmittable}
            className={cn(
              "px-12 h-12 text-[11px] font-bold text-white transition-all shadow-lg rounded-full active:scale-95 group", 
              primaryBgClass, 
              primaryHoverClass
            )}
          >
            Continue to Next Phase
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
