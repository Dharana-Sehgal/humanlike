"use client";

import { useState, useEffect } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, DocumentData } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { downloadCSV } from "@/lib/export-utils";
import { verifyAdmin } from "./actions";
import { Lock, Download, LogOut, Loader2, Database, Eye, User, Mail, Calendar, Star, FileText, BarChart3, ArrowLeft } from "lucide-react";
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

  const handleExport = () => {
    if (!submissions) return;
    
    const exportData = submissions.map(s => {
      const base = {
        id: s.id,
        name: s.user?.name,
        email: s.user?.email,
        submittedAt: s.submittedAt,
      };

      // Flatten assessments
      const assessments = (s.assessments || []).reduce((acc: any, curr: any) => {
        acc[`Rating_${curr.recordingId}`] = curr.rating;
        acc[`Feedback_${curr.recordingId}`] = curr.feedback;
        return acc;
      }, {});

      // Flatten questionnaires
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
          <div className="h-1.5 bg-primary w-full" />
          <CardHeader className="space-y-1 text-center pt-8">
            <CardTitle className="text-2xl font-body font-bold tracking-tight">Admin Access</CardTitle>
            <CardDescription>Enter your credentials to manage laboratory reports.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Username</Label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-11"
                  placeholder="admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                <Input 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-11"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-xs font-medium text-destructive">{error}</p>}
              <Button type="submit" disabled={isVerifying} className="w-full h-11 rounded-full font-bold">
                {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                Authorize
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body">
      <header className="sticky top-0 z-10 bg-white/95 border-b px-8 py-5 flex items-center justify-between shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-white rounded-lg">
            <Database className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Laboratory Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="rounded-full text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
            <Link href="/">
              <ArrowLeft className="mr-2 h-3.5 w-3.5" />
              Main Site
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsLoggedIn(false)} 
            className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary hover:border-primary transition-all"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Exit
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Submissions</h2>
            <p className="text-slate-500 text-sm">Reviewing {submissions?.length || 0} evaluation records.</p>
          </div>
          <Button onClick={handleExport} disabled={!submissions || submissions.length === 0} className="rounded-full h-12 px-8 font-bold shadow-lg">
            <Download className="mr-2 h-4 w-4" />
            Export Comprehensive CSV
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
            <p className="text-slate-400 text-sm font-medium">Fetching secure records...</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-transparent border-slate-200">
                  <TableHead className="font-bold text-slate-900 py-6 px-6">Participant</TableHead>
                  <TableHead className="font-bold text-slate-900 py-6 px-6">Email Address</TableHead>
                  <TableHead className="font-bold text-slate-900 py-6 px-6">Timestamp</TableHead>
                  <TableHead className="font-bold text-slate-900 py-6 px-6 text-center">Data points</TableHead>
                  <TableHead className="font-bold text-slate-900 py-6 px-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions?.map((s, idx) => (
                  <TableRow key={idx} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900 py-5 px-6">{s.user?.name}</TableCell>
                    <TableCell className="text-slate-500 py-5 px-6">{s.user?.email}</TableCell>
                    <TableCell className="text-slate-500 py-5 px-6">
                      {new Date(s.submittedAt).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </TableCell>
                    <TableCell className="text-center py-5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="secondary" className="font-medium">
                          {s.assessments?.length || 0} Ratings
                        </Badge>
                        <Badge variant="outline" className="font-medium">
                          {s.moduleQuestionnaires?.length || 0} Comps
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-5 px-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedSubmission(s)}
                        className="rounded-full hover:bg-primary hover:text-white transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {submissions?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium">
                      No laboratory records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Submission Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <div className="h-1.5 bg-accent w-full shrink-0" />
          
          <DialogHeader className="p-8 pb-6 border-b bg-slate-50/50 shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold text-slate-900">Participant Report</DialogTitle>
                <DialogDescription className="text-slate-500">Detailed evaluation metrics for this laboratory session.</DialogDescription>
              </div>
              <div className="text-left md:text-right space-y-1">
                <div className="flex items-center md:justify-end text-sm font-bold text-slate-700 gap-2">
                  <User className="h-4 w-4" /> {selectedSubmission?.user?.name}
                </div>
                <div className="flex items-center md:justify-end text-xs text-slate-500 gap-2">
                  <Mail className="h-3 w-3" /> {selectedSubmission?.user?.email}
                </div>
                <div className="flex items-center md:justify-end text-xs text-slate-500 gap-2">
                  <Calendar className="h-3 w-3" /> {selectedSubmission ? new Date(selectedSubmission.submittedAt).toLocaleString() : ''}
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 w-full">
            <div className="p-8 space-y-10">
              {/* Individual Assessments */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-primary border-b border-slate-100 pb-3">
                  <BarChart3 className="h-4 w-4" />
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-70">Recording Assessments</h3>
                </div>
                <div className="grid gap-6">
                  {selectedSubmission?.assessments?.map((a: any, i: number) => (
                    <Card key={i} className="bg-white border-slate-100 shadow-sm overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-40 bg-slate-50 p-6 flex flex-col items-center justify-center border-r border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Authenticity</span>
                          <div className="flex items-center gap-1">
                            <span className="text-3xl font-bold text-primary">{a.rating}</span>
                            <Star className="h-4 w-4 fill-primary text-primary mb-1" />
                          </div>
                        </div>
                        <div className="flex-1 p-6 space-y-2">
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recording ID: {a.recordingId}</div>
                          <p className="text-slate-700 text-sm leading-relaxed italic">
                            "{a.feedback || 'No qualitative feedback provided.'}"
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {(!selectedSubmission?.assessments || selectedSubmission.assessments.length === 0) && (
                    <div className="py-8 text-center text-slate-400 text-sm italic">
                      No recording assessments recorded.
                    </div>
                  )}
                </div>
              </section>

              {/* Module Questionnaires */}
              {selectedSubmission?.moduleQuestionnaires && selectedSubmission.moduleQuestionnaires.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-accent border-b border-slate-100 pb-3">
                    <FileText className="h-4 w-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-70">Comparison Analysis</h3>
                  </div>
                  <div className="grid gap-6">
                    {selectedSubmission.moduleQuestionnaires.map((q: any, i: number) => (
                      <Card key={i} className="bg-white border-slate-100 shadow-sm overflow-hidden">
                         <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Module ID: {q.moduleId}</span>
                              <Badge className="bg-accent text-white border-none px-3 py-1">
                                Preferred: {q.betterBotId}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Participant Logic</span>
                              <p className="text-slate-700 text-sm leading-relaxed">
                                {q.preferenceFeedback || 'No additional insights provided.'}
                              </p>
                            </div>
                         </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Extra Padding for Scroll Bottom Visibility */}
              <div className="h-10" />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}