import mongoose, {
    Document,
    Schema,
    Types,
} from "mongoose";

export interface IContact extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    status: "ACTIVE" | "INACTIVE";
    source?: string;
    notes?: string;

    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        company: {
            type: String,
            trim: true,
        },

        jobTitle: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },

        source: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },

        // User who created the contact
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Created by is required"],
        },

        // User who last updated the contact
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Updated by is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const Contact = mongoose.model<IContact>(
    "Contact",
    contactSchema
);