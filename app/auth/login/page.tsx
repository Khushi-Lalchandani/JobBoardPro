"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const res = await signIn("credentials", {
            email: form.get("email"),
            password: form.get("password"),
            redirect: false,
        });
        if (res?.error) setError("Invalid credentials");
        else router.push("/company/dashboard");
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
            <a href="/auth/register">Don't have an account? Register</a>
        </form>
    );
}
