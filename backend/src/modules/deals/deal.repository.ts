import {
    Deal,
    IDeal,
} from '../../models/deal.model';

export class DealRepository {

    async create(
        data: Partial<IDeal>
    ) {
        return Deal.create(data);
    }

    async findAll() {
        return Deal.find()
            .populate(
                'contact',
                'firstName lastName email phone company'
            )
            .populate(
                'lead',
                'title status source value'
            )
            .populate(
                'assignedTo',
                'firstName lastName email'
            )
            .sort({
                createdAt: -1,
            });
    }

    async findByCreatedBy(userId: string) {
        return Deal.find({
            createdBy: userId,
        })
            .populate(
                "contact",
                "firstName lastName email phone company"
            )
            .populate(
                "lead",
                "title status source value"
            )
            .populate(
                "assignedTo",
                "firstName lastName email"
            )
            .sort({
                createdAt: -1,
            });
    }

    async findById(
        id: string
    ) {
        return Deal.findById(id)
            .populate(
                'contact',
                'firstName lastName email phone company'
            )
            .populate(
                'lead',
                'title status source value'
            )
            .populate(
                'assignedTo',
                'firstName lastName email'
            );
    }

    async findByContact(
        contactId: string
    ) {
        return Deal.find({
            contact: contactId,
        })
            .populate(
                'contact',
                'firstName lastName email phone company'
            )
            .populate(
                'lead',
                'title status source value'
            )
            .populate(
                'assignedTo',
                'firstName lastName email'
            )
            .sort({
                createdAt: -1,
            });
    }

    async update(
        id: string,
        data: Partial<IDeal>
    ) {
        return Deal.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate(
                'contact',
                'firstName lastName email phone company'
            )
            .populate(
                'lead',
                'title status source value'
            )
            .populate(
                'assignedTo',
                'firstName lastName email'
            );
    }

    async delete(
        id: string
    ) {
        return Deal.findByIdAndDelete(id);
    }

    async updateStage(
        id: string,
        stage: string
    ) {
        return Deal.findByIdAndUpdate(
            id,
            {
                $set: {
                    stage,
                },

                $push: {
                    stageHistory: {
                        stage,
                        changedAt: new Date(),
                    },
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate(
                'contact',
                'firstName lastName email phone company'
            )
            .populate(
                'lead',
                'title status source value'
            )
            .populate(
                'assignedTo',
                'firstName lastName email'
            );
    }
}