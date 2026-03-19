"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Job {
    _id: string;
    title: string;
    slug: string;
    location: string;
    type: string;
    companyId: {
        name: string;
    };
    description: string;
    createdAt: string;
}

export default function JobSearchPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [jobType, setJobType] = useState("");

    const fetchJobs = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTitle) params.append("title", searchTitle);
        if (searchLocation) params.append("location", searchLocation);
        if (jobType) params.append("type", jobType);

        try {
            const res = await fetch(`/api/jobs?${params.toString()}`);
            const data = await res.json();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Header / Hero */}
            <header className="py-16 px-6 relative overflow-hidden bg-linear-to-b from-indigo-900/20 to-transparent">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-cyan-400">
                        Find Your Next Career Move
                    </h1>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Browse thousands of job opportunities from top companies and startups.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                        <div className="flex-1 flex items-center px-4 py-3 gap-3">
                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Job title or keywords"
                                className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                            />
                        </div>
                        <div className="hidden md:block w-px bg-white/10 h-10 self-center"></div>
                        <div className="flex-1 flex items-center px-4 py-3 gap-3">
                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Location"
                                className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                            Search
                        </button>
                    </form>
                </div>
                
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl z-0"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl z-0"></div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Job Type</h3>
                        <div className="space-y-3">
                            {["full-time", "part-time", "remote", "contract"].map((type) => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            name="jobType"
                                            className="sr-only"
                                            checked={jobType === type}
                                            onChange={() => setJobType(type === jobType ? "" : type)}
                                            onClick={() => setJobType(type === jobType ? "" : type)}
                                        />
                                        <div className={`w-5 h-5 rounded border transition-all ${jobType === type ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-800 border-slate-700 group-hover:border-slate-500'}`}></div>
                                        {jobType === type && (
                                            <svg className="absolute top-0.5 left-0.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`capitalize text-sm transition-colors ${jobType === type ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                        {type.replace("-", " ")}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => { setJobType(""); setSearchTitle(""); setSearchLocation(""); fetchJobs(); }}
                        className="text-indigo-400 text-sm hover:text-indigo-300 font-medium transition-colors"
                    >
                        Clear all filters
                    </button>
                </aside>

                {/* Job List */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">
                            {loading ? "Searching..." : `${jobs.length} Jobs Found`}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/5"></div>
                            ))}
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="grid gap-4">
                            {jobs.map((job) => (
                                <Link
                                    key={job._id}
                                    href={`/jobs/${job.slug}`}
                                    className="group block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">
                                                {job.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm flex items-center gap-1">
                                                <span className="text-indigo-400">{job.companyId?.name}</span>
                                                <span className="text-slate-600">•</span>
                                                <span>{job.location}</span>
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                                            {job.type.replace("-", " ")}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                                        {job.description}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1 group-hover:text-indigo-400 font-medium transition-colors">
                                            View Details
                                            <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <div className="mb-4 inline-block p-4 bg-indigo-500/10 rounded-full">
                                <svg className="h-10 w-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No jobs matched your search</h3>
                            <p className="text-slate-400 max-w-xs mx-auto">Try adjusting your filters or search terms to find more opportunities.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
