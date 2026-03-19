import { signOut } from "@/lib/auth";

export default function CompanyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-md px-6 py-4">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                    <a href="/company/dashboard" className="text-xl font-bold tracking-tight text-indigo-300 hover:text-indigo-200 transition-colors">
                        JobBoard <span className="text-white">Pro</span>
                    </a>
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
                                await signOut({ redirectTo: "/auth/login" });
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
            {children}
        </div>
    );
}
