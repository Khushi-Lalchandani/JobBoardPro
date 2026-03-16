"use client";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: form.get("title"),
                description: form.get("description"),
                location: form.get("location"),
                type: form.get("type"),
            }),
        });
        router.push("/company/dashboard");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
            {/* Navbar */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-md px-6 py-4">
                <div className="mx-auto max-w-2xl flex items-center gap-3">
                    <a href="/company/dashboard" className="text-indigo-400 hover:text-white transition-colors text-sm">
                        ← Dashboard
                    </a>
                    <span className="text-white/20">/</span>
                    <span className="text-sm text-white/60">Post a New Job</span>
                </div>
            </header>

            {/* Form Card */}
            <main className="mx-auto max-w-2xl px-6 py-12">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold mb-1">Post a New Job</h1>
                    <p className="text-indigo-400 text-sm mb-8">Fill in the details to attract the right candidates.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-indigo-200">Job Title</label>
                            <input
                                name="title"
                                placeholder="e.g. Senior Frontend Engineer"
                                required
                                className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-indigo-200">Job Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe responsibilities, requirements, and benefits…"
                                required
                                rows={5}
                                className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-indigo-200">Location</label>
                                <input
                                    name="location"
                                    placeholder="e.g. New York, NY"
                                    className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-indigo-200">Job Type</label>
                                <select
                                    name="type"
                                    className="w-full rounded-lg bg-slate-800 border border-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                >
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="remote">Remote</option>
                                    <option value="contract">Contract</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => router.push("/company/dashboard")}
                                className="flex-1 rounded-lg border border-white/10 text-indigo-300 hover:bg-white/10 font-semibold py-2.5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-2.5 transition-colors duration-200 shadow-md shadow-indigo-900/40"
                            >
                                Post Job
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
