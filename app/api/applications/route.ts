import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";

// POST — submit an application
export async function POST(req: Request) {
    const session = await auth();
    if (!session || (session.user as any).role !== "user") {
        return NextResponse.json({ error: "Unauthorized. Please log in as a candidate." }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { jobId, resumeUrl, coverLetter } = body;

    if (!jobId || !resumeUrl) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if already applied
    const existing = await Application.findOne({ jobId, userId: (session.user as any).id });
    if (existing) {
        return NextResponse.json({ error: "You have already applied for this job" }, { status: 400 });
    }

    const application = await Application.create({
        jobId,
        userId: (session.user as any).id,
        resumeUrl,
        coverLetter,
        status: "pending",
    });

    return NextResponse.json(application, { status: 201 });
}

// GET — list applications for current user or company
export async function GET(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    let query: any = {};
    if (role === "user") {
        query.userId = userId;
    } else if (role === "company") {
        const jobId = searchParams.get("jobId");
        if (!jobId) return NextResponse.json({ error: "jobId is required for companies" }, { status: 400 });
        
        // Ensure the job belongs to this company
        const job = await Job.findOne({ _id: jobId, companyId: userId });
        if (!job) return NextResponse.json({ error: "Job not found or unauthorized" }, { status: 403 });
        
        query.jobId = jobId;
    }

    const applications = await Application.find(query)
        .populate("jobId", "title slug companyId")
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

    return NextResponse.json(applications);
}
