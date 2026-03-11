"use client";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: form.get("title"),
                description: form.get("description"),
                location: form.get("location"),
                type: form.get("type"),
            }),
        });
        router.push("/company/dashboard");
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Post a New Job</h1>
            <input name="title" placeholder="Job Title" required />
            <textarea name="description" placeholder="Job Description" required />
            <input name="location" placeholder="Location" />
            <select name="type">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="remote">Remote</option>
                <option value="contract">Contract</option>
            </select>
            <button type="submit">Post Job</button>
        </form>
    );
}
