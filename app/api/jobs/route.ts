import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

// GET — list jobs with optional filtering
export async function GET(req: Request) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const title = searchParams.get("title");
    const location = searchParams.get("location");
    const type = searchParams.get("type");

    const status = searchParams.get("status");

    let query: any = {};

    // If companyId is provided, it's likely for a specific company's dashboard
    if (companyId) {
        query.companyId = companyId;
    } else if (status) {
        // Explicit status filter (e.g., from Admin Panel)
        query.status = status;
    } else {
        // Public search: check for approved jobs first
        const approvedCount = await Job.countDocuments({ status: "approved" });
        if (approvedCount > 0 || process.env.NODE_ENV === "production") {
            query.status = "approved";
        } else {
            // Development/Fallback: show pending jobs if no approved jobs exist
            query.status = "pending";
        }
    }

    if (title) query.title = { $regex: title, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (type) query.type = type;

    const jobs = await Job.find(query)
        .populate("companyId", "name email") // Include company info
        .sort({ createdAt: -1 });

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
