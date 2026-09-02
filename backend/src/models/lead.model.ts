import mongoose, { Document, Schema } from 'mongoose';

export enum LeadStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    QUALIFIED = 'QUALIFIED',
    LOST = 'LOST',
}

export interface ILead extends Document {
    contact: mongoose.Types.ObjectId;
    title: string;
    status: LeadStatus;
    source?: string;
    value?: number;
    description?: string;
    assignedTo?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
    {
        contact: {
            type: Schema.Types.ObjectId,
            ref: 'Contact',
            required: [true, 'Contact is required'],
        },

        title: {
            type: String,
            required: [true, 'Lead title is required'],
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(LeadStatus),
            default: LeadStatus.NEW,
        },

        source: {
            type: String,
            trim: true,
        },

        value: {
            type: Number,
            min: [0, 'Lead value cannot be negative'],
        },

        description: {
            type: String,
            trim: true,
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

export const Lead = mongoose.model<ILead>(
    'Lead',
    leadSchema
);