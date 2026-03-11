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
                role: form.get("role"),   // "user" or "company"
            }),
        });
        if (!res.ok) { setError((await res.json()).error); return; }
        router.push("/auth/login");
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input name="name" placeholder="Full Name" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <select name="role">
                <option value="user">Job Seeker</option>
                <option value="company">Company</option>
            </select>
            <button type="submit">Register</button>
        </form>
    );
}
