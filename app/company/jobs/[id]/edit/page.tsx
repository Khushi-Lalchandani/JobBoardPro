"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditJobPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        type: "full-time",
        salaryMin: "",
        salaryMax: "",
        currency: "USD",
        tags: ""
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setFormData({
                        title: data.title || "",
                        description: data.description || "",
                        location: data.location || "",
                        type: data.type || "full-time",
                        salaryMin: data.salary?.min?.toString() || "",
                        salaryMax: data.salary?.max?.toString() || "",
                        currency: data.salary?.currency || "USD",
                        tags: data.tags?.join(", ") || ""
                    });
                } else {
                    setError(data.error || "Failed to fetch job data");
                }
            } catch (err) {
                setError("An error occurred while fetching job data");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchJob();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    location: formData.location,
                    type: formData.type,
                    salary: {
                        min: Number(formData.salaryMin),
                        max: Number(formData.salaryMax),
                        currency: formData.currency
                    },
                    tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update job");

            setSuccess(true);
            setTimeout(() => router.push("/company/dashboard"), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this job listing? This action cannot be undone.")) return;
        
        try {
            const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/company/dashboard");
            } else {
                const data = await res.json();
                setError(data.error || "Failed to delete job");
            }
        } catch (err) {
            setError("Failed to delete job");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-2xl px-6 py-12 pb-24">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                <div className="mb-8 relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-1 text-white">Edit Job</h1>
                        <p className="text-indigo-400 text-sm">Update your listing details or remove the post.</p>
                    </div>
                    <button 
                        onClick={handleDelete}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete Job"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                        Job updated successfully! Redirecting...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-indigo-200">Job Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-indigo-200">Job Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={8}
                            className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-indigo-200">Location</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-indigo-200">Job Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-800 border border-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="remote">Remote</option>
                                <option value="contract">Contract</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-indigo-200">Min Salary</label>
                            <input
                                name="salaryMin"
                                type="number"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-indigo-200">Max Salary</label>
                            <input
                                name="salaryMax"
                                type="number"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-indigo-200">Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-800 border border-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="INR">INR</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-indigo-200">Tags (comma separated)</label>
                        <input
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="e.g. React, Node.js, TypeScript"
                            className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div className="flex gap-3 pt-6 relative z-10">
                        <Link
                            href="/company/dashboard"
                            className="flex-1 rounded-lg border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white font-semibold py-3 text-center transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold py-3 transition-all duration-200 shadow-lg shadow-indigo-900/40 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : "Save Changes"}
                        </button>
                    </div>
                </form>

                {/* Decorative mesh */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl z-0"></div>
            </div>
        </main>
    );
}