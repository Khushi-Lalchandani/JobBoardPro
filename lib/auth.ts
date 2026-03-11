import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({ email: credentials.email });
                if (!user) return null;
                const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
                if (!valid) return null;
                return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.role = (user as any).role;
            return token;
        },
        session({ session, token }) {
            (session.user as any).role = token.role;
            return session;
        },
    },
    session: { strategy: "jwt" },
});
