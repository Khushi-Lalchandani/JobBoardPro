import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

export default async function CompanyDashboard() {
    const session = await auth();
    if (!session || (session.user as any).role !== "company") redirect("/auth/login");

    await connectDB();
    const jobs = await Job.find({ companyId: (session.user as any).id }).lean();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
            {/* Navbar */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-md px-6 py-4">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                    <span className="text-xl font-bold tracking-tight text-indigo-300">JobBoard <span className="text-white">Pro</span></span>
                    <div className="flex items-center gap-4">
                        <a
                            href="/company/jobs/new"
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 transition-colors"
                        >
                            <span className="text-lg leading-none">+</span> Post a New Job
                        </a>
                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                            }}
                        >
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-2 transition-colors"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-5xl px-6 py-10">
                <h1 className="text-3xl font-bold mb-2">Your Job Listings</h1>
                <p className="text-indigo-400 text-sm mb-8">Manage all your posted positions below.</p>

                {jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-20 text-center">
                        <svg className="h-12 w-12 text-indigo-400 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.182 2.247H5.932a2.25 2.25 0 01-2.182-2.247V14.15M12 12.75V3m0 9.75l-3.375-3.375M12 12.75l3.375-3.375" />
                        </svg>
                        <p className="text-indigo-300 text-lg font-medium">No jobs posted yet</p>
                        <p className="text-indigo-400/70 text-sm mt-1">Click &quot;Post a New Job&quot; to get started.</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {jobs.map((job: any) => (
                            <li
                                key={job._id.toString()}
                                className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-6 py-4 hover:bg-white/10 transition-colors"
                            >
                                <div>
                                    <p className="font-semibold text-white text-lg">{job.title}</p>
                                    <span
                                        className={`mt-1 inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${job.status === "open"
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : "bg-slate-500/20 text-slate-400"
                                            }`}
                                    >
                                        {job.status}
                                    </span>
                                </div>
                                <a
                                    href={`/company/jobs/${job._id}/edit`}
                                    className="rounded-lg border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 px-4 py-2 text-sm font-medium transition-colors"
                                >
                                    Edit
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}
