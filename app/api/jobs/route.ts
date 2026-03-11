import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

// GET — list jobs for logged-in company
export async function GET(req: Request) {
    const session = await auth();
    await connectDB();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const jobs = await Job.find(companyId ? { companyId } : {});
    return NextResponse.json(jobs);
}

// POST — create a new job (company only)
export async function POST(req: Request) {
    const session = await auth();
    if (!session || (session.user as any).role !== "company")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const slug = `${body.title}-${Date.now()}`.toLowerCase().replace(/\s+/g, "-");
    const job = await Job.create({ ...body, companyId: (session.user as any).id, slug });
    return NextResponse.json(job, { status: 201 });
}
