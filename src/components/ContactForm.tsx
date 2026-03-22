"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, User, Mail, Send } from "lucide-react";

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string }) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-700 py-16">
        <div className="h-20 w-20 bg-accent/10 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="h-10 w-10 text-accent" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Assessment Complete</h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Thank you, <span className="font-bold text-slate-900">{name}</span>. Your granular evaluations have been securely recorded.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-6 border-slate-200 text-slate-900 hover:bg-slate-50 rounded-full h-12 px-10 text-xs font-bold transition-all"
        >
          Return to Start
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden rounded-2xl">
        <div className="h-1.5 bg-accent w-full" />
        <CardHeader className="pt-10 pb-6 text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Final Step</CardTitle>
          <CardDescription className="text-slate-500 text-sm font-medium">
            Complete the assessment by providing your details.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-10 pt-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-11 h-12 bg-slate-50 border-slate-200 focus-visible:ring-accent rounded-xl text-sm transition-focus"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-11 h-12 bg-slate-50 border-slate-200 focus-visible:ring-accent rounded-xl text-sm transition-focus"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-xs font-bold bg-[#0F172A] hover:bg-[#0F172A]/90 shadow-xl rounded-full transition-all group"
              >
                Complete Submission
                <Send className="ml-2 h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}