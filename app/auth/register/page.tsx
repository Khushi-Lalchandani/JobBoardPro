"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.get("name"),
                email: form.get("email"),
                password: form.get("password"),
                role: form.get("role"),
            }),
        });
        if (!res.ok) { setError((await res.json()).error); return; }
        router.push("/auth/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create an account</h1>
                    <p className="mt-2 text-sm text-indigo-300">Join JobBoard Pro today</p>
                </div>

                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                        <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-indigo-200">Full Name</label>
                        <input
                            name="name"
                            placeholder="John Doe"
                            required
                            className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-indigo-200">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-indigo-200">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-indigo-400/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-indigo-200">I am a…</label>
                        <select
                            name="role"
                            className="w-full rounded-lg bg-slate-800 border border-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        >
                            <option value="user">Job Seeker</option>
                            <option value="company">Company</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-2.5 transition-colors duration-200 shadow-md shadow-indigo-900/40"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-indigo-400">
                    Already have an account?{" "}
                    <a href="/auth/login" className="font-semibold text-indigo-300 hover:text-white transition-colors">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
