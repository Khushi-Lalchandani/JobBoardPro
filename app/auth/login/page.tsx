"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isUnauthorized = searchParams.get("error") === "unauthorized";
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setError("");
        
        try {
            const res = await signIn("credentials", {
                email: form.get("email"),
                password: form.get("password"),
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials");
                return;
            }

            // After login, we need to fetch the session to know the role
            // but signIn doesn't return the full user object in NextAuth v5 easily 
            // without a full page reload or using useSession.
            // However, we can just redirect to a neutral /dashboard and let it handle the role redirect,
            // or better, respect the callbackUrl.
            
            const callbackUrl = searchParams.get("callbackUrl");
            if (callbackUrl) {
                router.push(callbackUrl);
                return;
            }

            // Neutral redirect: go to the root /dashboard which I previously configured to handle role-based redirects
            router.push("/dashboard");

        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                    <p className="mt-2 text-sm text-indigo-300">Sign in to your account to continue</p>
                </div>

                {isUnauthorized && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-400">
                        <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Access Denied: You do not have the required permissions for that area.
                    </div>
                )}
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
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-2.5 transition-colors duration-200 shadow-md shadow-indigo-900/40"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-indigo-400">
                    Don&apos;t have an account?{" "}
                    <a href="/auth/register" className="font-semibold text-indigo-300 hover:text-white transition-colors">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}
