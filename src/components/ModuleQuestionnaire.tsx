"use client";

import { useState } from "react";
import { AssessmentModule } from "@/lib/assessment-data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

interface ModuleQuestionnaireProps {
  module: AssessmentModule;
  onComplete: (data: { betterBotId: string; preferenceFeedback: string }) => void;
}

export function ModuleQuestionnaire({ module, onComplete }: ModuleQuestionnaireProps) {
  const [betterBotId, setBetterBotId] = useState("");
  const [preferenceFeedback, setPreferenceFeedback] = useState("");

  const isSubmittable = betterBotId !== "" && preferenceFeedback.trim().length > 5;

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Module Comparison</span>
        <h2 className="text-3xl text-slate-900 font-bold tracking-tight">Comparative Analysis</h2>
      </div>

      <div className="space-y-10">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Metric 03: Performance Preference
            </Label>
            <p className="text-xl text-slate-900 font-semibold tracking-tight">
              Based on the recordings in this section, which bot was superior?
            </p>
          </div>
          
          <RadioGroup 
            value={betterBotId} 
            onValueChange={setBetterBotId}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {module.recordings.map((rec) => (
              <div key={rec.id} className="relative">
                <RadioGroupItem
                  value={rec.id}
                  id={rec.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={rec.id}
                  className={cn(
                    "flex flex-col items-center justify-center h-[120px] p-6 bg-white border border-slate-200 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:border-slate-300",
                    betterBotId === rec.id 
                      ? "border-accent bg-accent/[0.03] ring-1 ring-accent/20 shadow-lg shadow-accent/5" 
                      : ""
                  )}
                >
                  <div className={cn(
                    "h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-200 mb-2.5",
                    betterBotId === rec.id 
                      ? "bg-accent border-accent text-white" 
                      : "border-slate-300 bg-slate-50"
                  )}>
                    {betterBotId === rec.id && <Check className="h-3 w-3" />}
                  </div>
                  <span className="text-base font-bold text-slate-900 tracking-tight">{rec.title}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Card className="p-8 space-y-8 border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-2xl">
          <div className="space-y-6">
            <div className="space-y-1.5">
               <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Metric 04: Qualitative Insight
              </Label>
              <p className="text-xl text-slate-900 font-semibold tracking-tight">
                Explain your preference with specific observations.
              </p>
            </div>
            <Textarea
              placeholder="Help us understand your preference..."
              className="min-h-[160px] w-full bg-slate-50/50 text-base focus-visible:ring-accent border-slate-200/60 rounded-xl resize-none p-6 shadow-inner transition-focus"
              value={preferenceFeedback}
              onChange={(e) => setPreferenceFeedback(e.target.value)}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end pt-4 w-full">
          <Button
            onClick={() => onComplete({ betterBotId, preferenceFeedback })}
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
