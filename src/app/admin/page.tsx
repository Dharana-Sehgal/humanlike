"use client";

import { useState, useEffect } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, DocumentData } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { downloadCSV } from "@/lib/export-utils";
import { verifyAdmin } from "./actions";
import { Lock, Download, LogOut, Loader2, Database, Eye, User, Mail, Calendar, Star, FileText, BarChart3, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const db = useFirestore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<DocumentData | null>(null);

  const submissionsQuery = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
  const { data: submissions, loading } = useCollection<DocumentData>(isLoggedIn ? submissionsQuery : null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");
    
    const isValid = await verifyAdmin(username, password);
    if (isValid) {
      setIsLoggedIn(true);
    } else {
      setError("Invalid credentials. Please try again.");
    }
    setIsVerifying(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setError("");
  };

  const handleExport = () => {
    if (!submissions) return;
    
    const exportData = submissions.map(s => {
      const base = {
        id: s.id,
        name: s.user?.name,
        email: s.user?.email,
        submittedAt: s.submittedAt,
      };

      const assessments = (s.assessments || []).reduce((acc: any, curr: any) => {
        acc[`Rating_${curr.recordingId}`] = curr.rating;
        acc[`Feedback_${curr.recordingId}`] = curr.feedback;
        return acc;
      }, {});

      const questionnaires = (s.moduleQuestionnaires || []).reduce((acc: any, curr: any) => {
        acc[`BetterBot_${curr.moduleId}`] = curr.betterBotId;
        acc[`Preference_${curr.moduleId}`] = curr.preferenceFeedback;
        return acc;
      }, {});

      return { ...base, ...assessments, ...questionnaires };
    });

    downloadCSV(exportData, `humalike-full-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-8">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-2xl overflow-hidden">
          <div className="h-1.5 bg-[#0F172A] w-full" />
          <CardHeader className="space-y-1 text-center pt-10">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Admin Access</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Secure access to laboratory reports.</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Username</Label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4 transition-focus"
                  placeholder="admin"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</Label>
                <Input 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4 transition-focus"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-xs font-bold text-destructive text-center">{error}</p>}
              <Button type="submit" disabled={isVerifying} className="w-full h-12 rounded-full font-bold bg-[#0F172A] shadow-xl transition-all hover:scale-[1.02]">
                {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                Authorize Access
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0F172A] text-white rounded-lg shadow-lg">
            <Database className="h-4 w-4" />
          </div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">Laboratory Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="rounded-full text-slate-500 hover:text-accent transition-colors font-bold text-[10px] uppercase tracking-widest">
            <Link href="/">
              <ArrowLeft className="mr-2 h-3.5 w-3.5" />
              Main Site
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout} 
            className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0F172A] hover:border-[#0F172A] transition-all font-bold text-[10px] uppercase tracking-widest px-6"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Exit
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Assessment Submissions</h2>
            <p className="text-slate-500 text-sm font-medium">Reviewing {submissions?.length || 0} participants.</p>
          </div>
          <Button onClick={handleExport} disabled={!submissions || submissions.length === 0} className="rounded-full h-12 px-8 font-bold bg-[#0F172A] shadow-xl transition-all hover:scale-[1.02]">
            <Download className="mr-2 h-4 w-4" />
            Export Comprehensive CSV
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Synchronizing records...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions?.map((s, idx) => (
              <Card 
                key={idx} 
                className="group border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedSubmission(s)}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:px-8">
                  <div className="flex items-center gap-6 mb-4 sm:mb-0">
                    <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-accent/10 transition-colors">
                      <User className="h-5 w-5 text-slate-400 group-hover:text-accent" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">{s.user?.name}</h4>
                      <p className="text-slate-400 text-xs font-medium">{s.user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="hidden lg:flex items-center gap-3">
                       <Badge variant="secondary" className="bg-slate-50 border-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                          {s.assessments?.length || 0} Ratings
                        </Badge>
                        <Badge variant="outline" className="border-slate-200 text-slate-400 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                          {s.moduleQuestionnaires?.length || 0} Comps
                        </Badge>
                    </div>
                    
                    <div className="text-right space-y-0.5">
                      <p className="text-slate-900 font-bold text-sm">
                        {new Date(s.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        {new Date(s.submittedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-accent group-hover:text-white transition-all">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {submissions?.length === 0 && (
              <div className="py-24 text-center space-y-3">
                <Database className="h-12 w-12 text-slate-100 mx-auto" />
                <p className="text-slate-400 text-sm font-medium">No laboratory records discovered.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden border-none shadow-3xl rounded-3xl">
          <div className="h-2 bg-accent w-full shrink-0" />
          
          <DialogHeader className="p-10 pb-8 border-b bg-slate-50/50 shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <DialogTitle className="text-3xl font-bold text-slate-900 tracking-tight">Participant Report</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">Detailed laboratory evaluation metrics.</DialogDescription>
              </div>
              <div className="text-left md:text-right space-y-1.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center md:justify-end text-sm font-bold text-slate-900 gap-2">
                  <User className="h-4 w-4 text-accent" /> {selectedSubmission?.user?.name}
                </div>
                <div className="flex items-center md:justify-end text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2">
                  <Mail className="h-3 w-3" /> {selectedSubmission?.user?.email}
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 w-full">
            <div className="p-10 space-y-12">
              <section className="space-y-8">
                <div className="flex items-center gap-3 text-accent border-b border-slate-100 pb-4">
                  <BarChart3 className="h-4 w-4" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em]">Recording Assessments</h3>
                </div>
                <div className="grid gap-6">
                  {selectedSubmission?.assessments?.map((a: any, i: number) => (
                    <Card key={i} className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-36 bg-slate-50 p-6 flex flex-col items-center justify-center border-r border-slate-100">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Rating</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-3xl font-bold text-[#0F172A]">{a.rating}</span>
                            <Star className="h-5 w-5 fill-accent text-accent mb-1" />
                          </div>
                        </div>
                        <div className="flex-1 p-8 space-y-3">
                          <div className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{a.recordingId}</div>
                          <p className="text-slate-700 text-base leading-relaxed italic font-medium">
                            "{a.feedback || 'No qualitative analysis provided.'}"
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {selectedSubmission?.moduleQuestionnaires && selectedSubmission.moduleQuestionnaires.length > 0 && (
                <section className="space-y-8">
                  <div className="flex items-center gap-3 text-slate-400 border-b border-slate-100 pb-4">
                    <FileText className="h-4 w-4" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em]">Comparison Analysis</h3>
                  </div>
                  <div className="grid gap-6">
                    {selectedSubmission.moduleQuestionnaires.map((q: any, i: number) => (
                      <Card key={i} className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                         <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{q.moduleId}</span>
                              <Badge className="bg-accent/10 text-accent border-none px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                                Preferred: {q.betterBotId}
                              </Badge>
                            </div>
                            <div className="space-y-3">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Qualitative Logic</span>
                              <p className="text-slate-700 text-base leading-relaxed font-medium">
                                {q.preferenceFeedback || 'No logical insights provided.'}
                              </p>
                            </div>
                         </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
              
              <div className="h-10" />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}