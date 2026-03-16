import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import User from "@/models/User";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
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
});
