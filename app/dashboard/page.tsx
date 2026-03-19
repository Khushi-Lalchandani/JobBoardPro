"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Application {
    _id: string;
    jobId: {
        title: string;
        slug: string;
        companyId: string;

    };
    status: string;
    createdAt: string;
}

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=/dashboard");
            return;
        }

        if (status === "authenticated") {
            const role = (session?.user as any)?.role;
            if (role === "company") {
                router.push("/company/dashboard");
                return;
            }
            if (role === "admin") {
                router.push("/admin");
                return;
            }
        }

        const fetchApplications = async () => {
            try {
                const res = await fetch("/api/applications");
                const data = await res.json();
                if (res.ok) setApplications(data);
            } catch (error) {
                console.error("Failed to fetch applications:", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchApplications();
        }
    }, [status, router]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
            {/* Header */}
            <header className="bg-slate-900/50 border-b border-white/5 py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-white mb-2">My Applications</h1>
                    <p className="text-slate-400">Track the status of your job submissions.</p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {applications.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <div className="mb-4 inline-block p-4 bg-indigo-500/10 rounded-full">
                            <svg className="h-10 w-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mb-8">You haven't applied to any jobs yet. Start your journey by browsing available roles.</p>
                        <Link href="/jobs" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/10 transition-all duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                        <Link href={`/jobs/${app.jobId.slug}`} className="hover:text-indigo-400">
                                            {app.jobId.title}
                                        </Link>
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Status</span>
                                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                app.status === 'shortlisted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/jobs/${app.jobId.slug}`}
                                        className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
