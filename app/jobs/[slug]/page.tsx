import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { notFound } from "next/navigation";
import Link from "next/link";

interface JobDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    await connectDB();
    const { slug } = await params;
    console.log(slug)
    const job = await Job.findOne({ slug }).populate("companyId", "name email").lean();

    if (!job) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
            {/* Nav */}
            <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/jobs" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Jobs
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{job.type.replace("-", " ")}</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 mt-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Content */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                                {job.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                                        {(job.companyId as any)?.name.charAt(0)}
                                    </div>
                                    <span className="text-white font-medium">{(job.companyId as any)?.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-linear-to-r from-indigo-500/30 to-transparent mb-10"></div>

                        <section className="prose prose-invert prose-indigo max-w-none">
                            <h2 className="text-2xl font-bold text-white mb-6">About this role</h2>
                            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                                {job.description}
                            </div>
                        </section>

                        {job.tags && job.tags.length > 0 && (
                            <section className="mt-12">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="md:w-80">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-32">
                            <div className="mb-6">
                                <p className="text-slate-400 text-sm mb-2">Salary range</p>
                                <p className="text-2xl font-bold text-white">
                                    {job.salary && job.salary.min && job.salary.max 
                                        ? `${job.salary.min.toLocaleString()} — ${job.salary.max.toLocaleString()} ${job.salary.currency}` 
                                        : "Competitive"}
                                </p>
                            </div>

                            <Link
                                href={`/jobs/${job.slug}/apply`}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] text-lg mb-4"
                            >
                                Apply for this job
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>

                            <p className="text-slate-500 text-center text-sm px-4">
                                Take the first step towards your next career milestone.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
