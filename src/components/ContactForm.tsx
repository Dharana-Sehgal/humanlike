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
      <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center space-y-4 animate-in fade-in zoom-in duration-500 py-16">
        <div className="h-16 w-16 bg-accent/20 rounded-full flex items-center justify-center mb-1">
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>
        <h2 className="text-xl font-headline text-primary font-bold">All Done!</h2>
        <p className="text-muted-foreground text-sm">
          Thank you, <span className="font-bold text-primary">{name}</span>. Your evaluations have been recorded successfully.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full h-9 px-5 text-[11px] font-bold"
        >
          Return to Start
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto py-10">
      <Card className="border-none shadow-lg bg-white overflow-hidden rounded-2xl">
        <div className="h-1 bg-accent w-full" />
        <CardHeader className="pt-6 pb-2 text-center">
          <CardTitle className="text-lg font-headline text-primary font-bold">Final Step</CardTitle>
          <CardDescription className="text-xs pt-1">
            Complete the study by providing your details.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-9 h-9 bg-gray-50/50 border-muted focus-visible:ring-accent text-xs"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-9 h-9 bg-gray-50/50 border-muted focus-visible:ring-accent text-xs"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-9 text-[11px] font-bold bg-primary hover:bg-primary/90 shadow-md rounded-full transition-all group"
              >
                Continue
                <Send className="ml-2 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
