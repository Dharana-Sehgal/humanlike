"use client";

import { useState, useMemo, useEffect } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, DocumentData, doc, setDoc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadCSV } from "@/lib/export-utils";
import { verifyAdmin } from "./actions";
import { generateInDepthAnalysis, ConsolidatedAnalysis } from "./analysis-actions";
import { 
  Lock, Download, LogOut, Loader2, Database, Eye, User, 
  TrendingUp, Sparkles, ThumbsUp, ThumbsDown, AlertCircle, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { FLAT_RECORDINGS, ASSESSMENT_MODULES } from "@/lib/assessment-data";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const db = useFirestore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<DocumentData | null>(null);
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cachedAnalyses, setCachedAnalyses] = useState<Record<string, ConsolidatedAnalysis>>({});

  const submissionsQuery = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
  const { data: submissions, loading } = useCollection<DocumentData>(isLoggedIn ? submissionsQuery : null);

  const moduleStats = useMemo(() => {
    if (!submissions) return null;

    const module = ASSESSMENT_MODULES[0];
    if (!module) return null;

    const totalModuleCompletions = submissions.filter(s => 
      (s.moduleQuestionnaires || []).some((q: any) => q.moduleId === module.id)
    ).length;

    const recordingMetrics = module.recordings.map(recording => {
      const relevantAssessments = submissions.flatMap(s => 
        (s.assessments || []).filter((a: any) => a.recordingId === recording.id)
      );
      
      const totalRatings = relevantAssessments.reduce((acc: number, curr: any) => acc + curr.rating, 0);
      const avgRating = relevantAssessments.length > 0 ? totalRatings / relevantAssessments.length : 0;

      const selections = submissions.filter(s => 
        (s.moduleQuestionnaires || []).some((q: any) => q.moduleId === module.id && q.betterBotId === recording.id)
      ).length;

      const selectionPct = totalModuleCompletions > 0 ? (selections / totalModuleCompletions) * 100 : 0;

      const feedbackTexts = [
        ...relevantAssessments.map((a: any) => a.feedback).filter(Boolean),
        ...submissions
          .flatMap(s => (s.moduleQuestionnaires || []))
          .filter((q: any) => q.moduleId === module.id && q.betterBotId === recording.id && q.preferenceFeedback)
          .map((q: any) => q.preferenceFeedback)
      ];

      return {
        id: recording.id,
        title: recording.title,
        averageRating: avgRating,
        selectionPercentage: selectionPct,
        feedbackTexts
      };
    });

    const totalContributors = new Set(submissions.map(s => s.user?.email || s.id)).size;

    return {
      moduleId: module.id,
      moduleTitle: module.title,
      totalContributors,
      recordings: recordingMetrics
    };
  }, [submissions]);

  const handleGenerateAllAnalysis = async () => {
    if (!moduleStats) return;
    setIsAnalyzing(true);
    
    try {
      const results: Record<string, ConsolidatedAnalysis> = { ...cachedAnalyses };

      for (const rec of moduleStats.recordings) {
        if (rec.feedbackTexts.length > 0) {
          const analysis = await generateInDepthAnalysis(rec.feedbackTexts);
          const analysisRef = doc(db, "recording_analyses", rec.id);
          await setDoc(analysisRef, analysis);
          results[rec.id] = analysis;
        }
      }
      
      setCachedAnalyses(results);
    } catch (err) {
      console.error("Module analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    async function fetchCache() {
      if (isLoggedIn && db) {
        const results: Record<string, ConsolidatedAnalysis> = {};
        try {
          for (const rec of FLAT_RECORDINGS) {
            const docRef = doc(db, "recording_analyses", rec.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              results[rec.id] = docSnap.data() as ConsolidatedAnalysis;
            }
          }
          setCachedAnalyses(results);
        } catch (err) {
          console.error("Failed to load cached analyses:", err);
        }
      }
    }
    fetchCache();
  }, [isLoggedIn, db]);

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
    const exportData = submissions.map(s => ({
        id: s.id,
        name: s.user?.name,
        email: s.user?.email,
        submittedAt: s.submittedAt,
        ... (s.assessments || []).reduce((acc: any, curr: any) => {
          acc[`Rating_${curr.recordingId}`] = curr.rating;
          acc[`Feedback_${curr.recordingId}`] = curr.feedback;
          return acc;
        }, {}),
        ... (s.moduleQuestionnaires || []).reduce((acc: any, curr: any) => {
          acc[`BetterBot_${curr.moduleId}`] = curr.betterBotId;
          acc[`Preference_${curr.moduleId}`] = curr.preferenceFeedback;
          return acc;
        }, {})
    }));
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
                <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4" placeholder="admin" required />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4" placeholder="••••••••" required />
              </div>
              {error && <p className="text-xs font-bold text-destructive text-center">{error}</p>}
              <Button type="submit" disabled={isVerifying} className="w-full h-12 rounded-full font-bold bg-[#0F172A] shadow-xl">
                {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                Authorize Access
              </Button>
            </form>
          </CardContent>
        </Card>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-accent">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0F172A] text-white rounded-lg shadow-lg"><Database className="h-4 w-4" /></div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">Laboratory Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest px-6">
            <LogOut className="mr-2 h-3.5 w-3.5" /> Exit
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-12">
        <Tabs defaultValue="submissions" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
               <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Data & Insights</h2>
                <p className="text-slate-500 text-sm font-medium">Synthesizing evaluations from {submissions?.length || 0} participants.</p>
              </div>
              <TabsList className="bg-slate-100 p-1 rounded-full h-12">
                <TabsTrigger value="submissions" className="rounded-full px-8 font-bold text-[10px] uppercase tracking-widest">Submissions</TabsTrigger>
                <TabsTrigger value="insights" className="rounded-full px-8 font-bold text-[10px] uppercase tracking-widest">Insights</TabsTrigger>
              </TabsList>
            </div>
            <Button onClick={handleExport} disabled={!submissions || submissions.length === 0} className="rounded-full h-12 px-8 font-bold bg-[#0F172A] shadow-xl">
              <Download className="mr-2 h-4 w-4" /> Export Full Dataset
            </Button>
          </div>

          <TabsContent value="submissions">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Synchronizing records...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {submissions?.map((s, idx) => (
                  <Card key={idx} className="group border-slate-200/60 shadow-md hover:shadow-xl transition-all rounded-2xl cursor-pointer" onClick={() => setSelectedSubmission(s)}>
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:px-8">
                      <div className="flex items-center gap-6">
                        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-accent/10 transition-colors">
                          <User className="h-5 w-5 text-slate-400 group-hover:text-accent" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-900 text-lg">{s.user?.name}</h4>
                          <p className="text-slate-400 text-xs font-medium">{s.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="text-right space-y-0.5">
                          <p className="text-slate-900 font-bold text-sm">{new Date(s.submittedAt).toLocaleDateString()}</p>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{new Date(s.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <Eye className="h-5 w-5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-12">
            {moduleStats && (
              <div className="space-y-12 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Card className="bg-[#0F172A] text-white border-none shadow-xl rounded-3xl p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/10 rounded-lg"><User className="h-4 w-4 text-accent" /></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Contributors</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight">{moduleStats.totalContributors}</div>
                  </Card>

                  {moduleStats.recordings.map((rec) => (
                    <Card key={rec.id} className="bg-white border-slate-200/60 shadow-xl rounded-3xl p-8">
                      <div className="flex flex-col h-full justify-between">
                        <div className="space-y-1">
                          <Badge className="bg-accent/10 text-accent border-none font-bold uppercase tracking-widest text-[9px] px-2 py-0.5 mb-2">{rec.id}</Badge>
                          <h4 className="text-xl font-bold text-slate-900">{rec.title}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg Rating</p>
                            <div className="text-2xl font-bold text-slate-900">{rec.averageRating.toFixed(1)}</div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Selection %</p>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-slate-900">{Math.round(rec.selectionPercentage)}%</span>
                              <TrendingUp className="h-3.5 w-3.5 text-accent" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-8 py-4">
                   {!isAnalyzing ? (
                    <Button 
                      onClick={handleGenerateAllAnalysis}
                      disabled={moduleStats.recordings.every(r => r.feedbackTexts.length === 0)}
                      className="h-16 px-12 rounded-2xl font-bold bg-[#0F172A] shadow-2xl hover:scale-[1.02] transition-all"
                    >
                      <Sparkles className="mr-3 h-5 w-5 text-accent" />
                      Generate In-depth Analysis
                    </Button>
                   ) : (
                    <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-3xl p-12 flex flex-col items-center text-center space-y-6 animate-pulse shadow-xl">
                      <div className="p-4 bg-slate-50 rounded-full"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">Generating in-depth analysis...</h4>
                        <p className="text-slate-400 text-sm font-medium">Synthesizing participant feedback across both recordings</p>
                      </div>
                    </div>
                   )}
                </div>

                {!isAnalyzing && Object.keys(cachedAnalyses).length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-6 duration-700">
                    {moduleStats.recordings.map((rec) => {
                      const analysis = cachedAnalyses[rec.id];
                      if (!analysis) return null;
                      
                      const totalResponses = rec.feedbackTexts.length;

                      return (
                        <Card key={rec.id} className="border-slate-200/60 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white flex flex-col h-full">
                          <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div className="space-y-1">
                              <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{rec.title}</h4>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{rec.id} Insights</p>
                            </div>
                            <div className="text-right">
                               <div className="text-sm font-bold text-slate-900">{rec.averageRating.toFixed(1)} / 5.0</div>
                               <div className="text-[10px] font-bold text-accent uppercase tracking-widest">{Math.round(rec.selectionPercentage)}% Selection</div>
                            </div>
                          </div>
                          
                          <div className="p-10 space-y-12 flex-1">
                            <div className="space-y-6">
                              <div className="flex items-center gap-2.5 text-emerald-600">
                                <div className="p-1.5 bg-emerald-50 rounded-lg"><ThumbsUp className="h-3.5 w-3.5" /></div>
                                <span className="text-xs font-bold uppercase tracking-widest">Top Strengths</span>
                              </div>
                              <div className="space-y-5">
                                {analysis.pros.map((p, i) => {
                                  const percentage = totalResponses > 0 ? Math.round((p.count / totalResponses) * 100) : 0;
                                  return (
                                    <div key={i} className="space-y-2">
                                      <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-slate-700 capitalize">{p.theme}</span>
                                        <span className="text-emerald-600">{percentage}%</span>
                                      </div>
                                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                                      </div>
                                    </div>
                                  );
                                })}
                                {analysis.pros.length === 0 && (
                                  <div className="flex flex-col items-center justify-center py-6 text-slate-300">
                                    <AlertCircle className="h-5 w-5 mb-2 opacity-20" />
                                    <p className="text-xs italic">No recurring strengths identified.</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="flex items-center gap-2.5 text-rose-600">
                                <div className="p-1.5 bg-rose-50 rounded-lg"><ThumbsDown className="h-3.5 w-3.5" /></div>
                                <span className="text-xs font-bold uppercase tracking-widest">Top Improvement Areas</span>
                              </div>
                              <div className="space-y-5">
                                {analysis.cons.map((c, i) => {
                                  const percentage = totalResponses > 0 ? Math.round((c.count / totalResponses) * 100) : 0;
                                  return (
                                    <div key={i} className="space-y-2">
                                      <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-slate-700 capitalize">{c.theme}</span>
                                        <span className="text-rose-600">{percentage}%</span>
                                      </div>
                                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-400 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                                      </div>
                                    </div>
                                  );
                                })}
                                {analysis.cons.length === 0 && (
                                  <div className="flex flex-col items-center justify-center py-6 text-slate-300">
                                    <AlertCircle className="h-5 w-5 mb-2 opacity-20" />
                                    <p className="text-xs italic">No recurring improvement areas identified.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Based on {totalResponses} qualitative responses</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden rounded-3xl">
          <div className="h-2 bg-accent w-full" />
          <DialogHeader className="p-10 border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold">Participant Report</DialogTitle>
                <DialogDescription>Individual metrics and observations.</DialogDescription>
              </div>
              <div className="text-right p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="text-sm font-bold">{selectedSubmission?.user?.name}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedSubmission?.user?.email}</div>
              </div>
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="p-10 space-y-8">
              {selectedSubmission?.assessments?.map((a: any, i: number) => (
                <Card key={i} className="p-6 border-slate-100 shadow-sm rounded-2xl">
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center justify-center h-16 w-16 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-slate-400">Score</span>
                      <span className="text-xl font-bold">{a.rating}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{a.recordingId}</p>
                      <p className="text-slate-700 italic font-medium">"{a.feedback || 'No comments provided.'}"</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
