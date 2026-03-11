import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    const { name, email, password, role } = await req.json();
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: role || "user" });

    return NextResponse.json({ message: "User created", userId: user._id }, { status: 201 });
}
