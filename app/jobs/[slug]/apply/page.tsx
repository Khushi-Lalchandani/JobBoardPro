"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ApplyPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [resumeUrl, setResumeUrl] = useState("");
    const [coverLetter, setCoverLetter] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/auth/login?callbackUrl=/jobs/${slug}/apply`);
            return;
        }

        const fetchJob = async () => {
            try {
                // We don't have a public GET /api/jobs/[slug] yet, 
                // but we can fetch all jobs and find it (inefficient) 
                // or just fetch it from the API if we update it.
                // For now, let's just fetch it from a hypothetical 
                // public API or use a title from the slug.
                const res = await fetch(`/api/jobs`);
                const jobs = await res.json();
                const foundJob = jobs.find((j: any) => j.slug === slug);
                if (foundJob) setJob(foundJob);
                else setError("Job not found");
            } catch (err) {
                setError("Failed to fetch job details");
            } finally {
                setLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchJob();
        }
    }, [status, slug, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId: job._id,
                    resumeUrl,
                    coverLetter,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Submission failed");

            setSuccess(true);
            setTimeout(() => router.push("/dashboard"), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
                    <div className="mb-6 inline-block p-4 bg-emerald-500/10 rounded-full">
                        <svg className="h-12 w-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Application Sent!</h2>
                    <p className="text-slate-400 mb-8">Your application for <span className="text-indigo-400 font-semibold">{job?.title}</span> has been submitted successfully.</p>
                    <p className="text-sm text-slate-500 italic">Redirecting to your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-20 px-6">
            <div className="max-w-2xl mx-auto">
                <Link href={`/jobs/${slug}`} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Job Details
                </Link>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Header */}
                    <div className="mb-10 text-center relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-2">Submit Your Application</h1>
                        <p className="text-slate-400">Applying for <span className="text-indigo-400 font-semibold">{job?.title}</span> at <span className="text-indigo-400">{job?.companyId?.name}</span></p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Resume Link (Google Drive, Dropbox, etc.)</label>
                            <input
                                type="url"
                                required
                                placeholder="https://..."
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Cover Letter / Note</label>
                            <textarea
                                rows={6}
                                placeholder="Tell us why you're a great fit..."
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-3 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Submitting Application...
                                </>
                            ) : (
                                "Send Application"
                            )}
                        </button>
                    </form>

                    {/* Gradient Mesh */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl z-0"></div>
                </div>
            </div>
        </div>
    );
}
