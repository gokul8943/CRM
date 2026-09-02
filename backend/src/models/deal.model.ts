import mongoose, {
    Document,
    Schema,
} from 'mongoose';

export enum DealStage {
    PROSPECTING = 'PROSPECTING',
    QUALIFICATION = 'QUALIFICATION',
    PROPOSAL = 'PROPOSAL',
    NEGOTIATION = 'NEGOTIATION',
    CLOSED_WON = 'CLOSED_WON',
    CLOSED_LOST = 'CLOSED_LOST',
}

export interface IStageHistory {
    stage: DealStage;
    changedAt: Date;
}

export interface IDeal extends Document {
    contact: mongoose.Types.ObjectId;

    lead?: mongoose.Types.ObjectId;

    title: string;

    value: number;

    stage: DealStage;

    assignedTo?: mongoose.Types.ObjectId;

    expectedCloseDate?: Date;

    description?: string;

    stageHistory: IStageHistory[];

    createdAt: Date;

    updatedAt: Date;
}

const stageHistorySchema =
    new Schema<IStageHistory>(
        {
            stage: {
                type: String,
                enum: Object.values(DealStage),
                required: true,
            },

            changedAt: {
                type: Date,
                default: Date.now,
            },
        },
        {
            _id: false,
        }
    );

const dealSchema = new Schema<IDeal>(
    {
        contact: {
            type: Schema.Types.ObjectId,
            ref: 'Contact',
            required: [
                true,
                'Contact is required',
            ],
        },

        lead: {
            type: Schema.Types.ObjectId,
            ref: 'Lead',
        },

        title: {
            type: String,
            required: [
                true,
                'Deal title is required',
            ],
            trim: true,
        },

        value: {
            type: Number,
            required: [
                true,
                'Deal value is required',
            ],
            min: [
                0,
                'Deal value cannot be negative',
            ],
        },

        stage: {
            type: String,
            enum: Object.values(DealStage),
            default: DealStage.PROSPECTING,
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        expectedCloseDate: {
            type: Date,
        },

        description: {
            type: String,
            trim: true,
        },

        stageHistory: {
            type: [stageHistorySchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

dealSchema.index({
    contact: 1,
});

dealSchema.index({
    lead: 1,
});

dealSchema.index({
    stage: 1,
});

dealSchema.index({
    assignedTo: 1,
});

export const Deal =
    mongoose.model<IDeal>(
        'Deal',
        dealSchema
    );