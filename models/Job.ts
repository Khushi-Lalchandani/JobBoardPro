import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    location: { type: String },
    type: { type: String, enum: ["full-time", "part-time", "remote", "contract"] },
    salary: { min: Number, max: Number, currency: { type: String, default: "USD" } },
    tags: [String],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
