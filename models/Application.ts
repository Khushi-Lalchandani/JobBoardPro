import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    jobId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    resumeUrl: string;
    coverLetter: string;
    status: "pending" | "reviewed" | "shortlisted" | "rejected" | "withdrawn";
    createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    status: {
        type: String,
        enum: ["pending", "reviewed", "shortlisted", "rejected", "withdrawn"],
        default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
});

export default (mongoose.models.Application as mongoose.Model<IApplication>) ||
    mongoose.model<IApplication>("Application", ApplicationSchema);
