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
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-accent/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-accent" />
        </div>
        <h2 className="text-4xl font-headline text-primary">All Done!</h2>
        <p className="text-muted-foreground text-lg">
          Thank you, <span className="font-bold text-primary">{name}</span>. Your evaluations have been securely recorded in our database.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-8 border-primary text-primary hover:bg-primary hover:text-white"
        >
          Return to Start
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-20">
      <Card className="border-none shadow-xl bg-white overflow-hidden">
        <div className="h-2 bg-accent w-full" />
        <CardHeader className="pt-8 pb-4 text-center">
          <CardTitle className="text-3xl font-headline text-primary">Final Step</CardTitle>
          <CardDescription className="text-base pt-2">
            Great job completing all assessments. Please provide your contact details to save your results.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-10 h-12 bg-gray-50/50 border-border focus-visible:ring-accent"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10 h-12 bg-gray-50/50 border-border focus-visible:ring-accent"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group"
            >
              Finish Assessment
              <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
