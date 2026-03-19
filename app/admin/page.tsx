"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Job {
    _id: string;
    title: string;
    description: string;
    location: string;
    type: string;
    status: string;
    companyId: {
        name: string;
        email: string;
    };
    createdAt: string;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=/admin");
            return;
        }

        if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
            router.push("/jobs");
            return;
        }

        const fetchPendingJobs = async () => {
            try {
                const res = await fetch("/api/jobs"); // This now returns pending jobs if no approved ones exist
                const data = await res.json();
                // Filter specifically for pending jobs for the admin view
                setJobs(data.filter((j: Job) => j.status === "pending"));
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === "authenticated" && (session?.user as any)?.role === "admin") {
            fetchPendingJobs();
        }
    }, [status, session, router]);

    const handleAction = async (jobId: string, newStatus: "approved" | "rejected") => {
        setActioning(jobId);
        try {
            const res = await fetch(`/api/jobs/${jobId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setJobs(jobs.filter(j => j._id !== jobId));
            } else {
                alert("Failed to update job status");
            }
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setActioning(null);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
            <header className="bg-slate-900/50 border-b border-white/5 py-12 px-6">
                <div className="max-w-5xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white mb-2">Admin Moderation</h1>
                        <p className="text-slate-400">Review and approve job listings before they go live.</p>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                        {jobs.length} Pending Requests
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {jobs.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <div className="mb-4 inline-block p-4 bg-emerald-500/10 rounded-full">
                            <svg className="h-10 w-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Queue Clear!</h3>
                        <p className="text-slate-400 max-w-xs mx-auto">No pending job listings to moderate at this time.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                                            <span className="px-3 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium uppercase tracking-wider border border-slate-700">
                                                {job.type.replace("-", " ")}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400 mb-6">
                                            <span className="flex items-center gap-1.5">
                                                <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {job.companyId?.name}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {job.location}
                                            </span>
                                        </div>
                                        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 text-slate-300 text-sm line-clamp-3 mb-2 italic">
                                            &quot;{job.description}&quot;
                                        </div>
                                    </div>
                                    
                                    <div className="flex md:flex-col items-center justify-center gap-3 md:w-48">
                                        <button 
                                            onClick={() => handleAction(job._id, "approved")}
                                            disabled={actioning === job._id}
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            {actioning === job._id ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div> : "Approve"}
                                        </button>
                                        <button 
                                            onClick={() => handleAction(job._id, "rejected")}
                                            disabled={actioning === job._id}
                                            className="w-full bg-white/5 border border-white/10 hover:border-red-500/50 text-slate-400 hover:text-red-400 font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
