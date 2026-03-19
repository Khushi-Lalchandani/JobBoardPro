import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { revalidatePath } from "next/cache";

// GET — fetch a single job by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    const job = await Job.findById(id);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json(job);
}

// PATCH — update a job
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || (session.user as any).role !== "company") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // Check if job exists and belongs to the company (or is an admin)
    const job = await Job.findById(id);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const isOwner = job.companyId.toString() === (session.user as any).id;
    const isAdmin = (session.user as any).role === "admin";

    if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: "Forbidden. You can only edit your own jobs." }, { status: 403 });
    }

    // Update fields
    const updatedJob = await Job.findByIdAndUpdate(id, body, { new: true });

    // Revalidate paths to show fresh data
    revalidatePath("/company/dashboard");
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${updatedJob.slug}`);

    return NextResponse.json(updatedJob);
}

// DELETE — delete a job
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || (session.user as any).role !== "company") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const job = await Job.findById(id);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    if (job.companyId.toString() !== (session.user as any).id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Job.findByIdAndDelete(id);

    // Revalidate paths
    revalidatePath("/company/dashboard");
    revalidatePath("/jobs");

    return NextResponse.json({ message: "Job deleted successfully" });
}
