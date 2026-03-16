import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    trustHost: true,
    pages: {
        signIn: "/auth/login",
    },
    providers: [],  // real providers live in lib/auth.ts (Node.js only)
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const role = (auth?.user as any)?.role;
            const isOnCompany = nextUrl.pathname.startsWith("/company");
            const isOnAuth = nextUrl.pathname.startsWith("/auth");

            if (isOnCompany) {
                if (!isLoggedIn) return false; // redirect to signIn page
                if (role !== "company") {
                    // logged in but wrong role
                    return Response.redirect(new URL("/auth/login?error=unauthorized", nextUrl));
                }
                return true;
            }

            if (isOnAuth && isLoggedIn) {
                // already logged-in users shouldn't see auth pages
                if (role === "company") {
                    return Response.redirect(new URL("/company/dashboard", nextUrl));
                }
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = (user as any).id;
            }
            return token;
        },
        session({ session, token }) {
            (session.user as any).role = token.role;
            (session.user as any).id = token.id ?? token.sub;
            return session;
        },
    },
    session: { strategy: "jwt" },
} satisfies NextAuthConfig;
