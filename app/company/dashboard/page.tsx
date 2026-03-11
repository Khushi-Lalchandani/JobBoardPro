import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

export default async function CompanyDashboard() {
    const session = await auth();
    if (!session || (session.user as any).role !== "company") redirect("/auth/login");

    await connectDB();
    const jobs = await Job.find({ companyId: (session.user as any).id }).lean();

    return (
        <div>
            <h1>Your Job Listings</h1>
            <a href="/company/jobs/new">+ Post a New Job</a>
            <ul>
                {jobs.map((job: any) => (
                    <li key={job._id.toString()}>
                        <strong>{job.title}</strong> — {job.status}
                        <a href={`/company/jobs/${job._id}/edit`}> Edit</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
