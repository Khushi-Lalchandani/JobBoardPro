import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: "user" | "company" | "admin";
    savedJobs: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "company", "admin"], default: "user" },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    createdAt: { type: Date, default: Date.now },
});

export default (mongoose.models.User as mongoose.Model<IUser>) ||
    mongoose.model<IUser>("User", UserSchema);
