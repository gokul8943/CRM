import mongoose from 'mongoose';

import {
    DealRepository,
} from './deal.repository';

import {
    DealStage,
} from '../../models/deal.model';

import {
    Contact,
} from '../../models/contactModel';

import {
    Lead,
} from '../../models/lead.model';

export class DealService {

    private dealRepository:
        DealRepository;

    constructor() {
        this.dealRepository =
            new DealRepository();
    }

    /**
     * Create Deal
     */
    async createDeal(
        data: any
    ) {

        // Check contact
        const contact =
            await Contact.findById(
                data.contact
            );

        if (!contact) {
            throw new Error(
                'Contact not found'
            );
        }

        // Check lead if provided
        if (data.lead) {

            const lead =
                await Lead.findById(
                    data.lead
                );

            if (!lead) {
                throw new Error(
                    'Lead not found'
                );
            }
        }

        const initialStage =
            data.stage ??
            DealStage.PROSPECTING;

        const deal =
            await this.dealRepository.create({
                ...data,

                stage: initialStage,

                stageHistory: [
                    {
                        stage: initialStage,
                        changedAt: new Date(),
                    },
                ],
            });

        return deal;
    }

    /**
     * Get all deals
     */
    async getDeals() {
        return this.dealRepository
            .findAll();
    }

    /**
     * Get deal by ID
     */
    async getDealById(
        id: string
    ) {

        this.validateId(id);

        const deal =
            await this.dealRepository
                .findById(id);

        if (!deal) {
            throw new Error(
                'Deal not found'
            );
        }

        return deal;
    }

    /**
     * Get deals by contact
     */
    async getDealsByContact(
        contactId: string
    ) {

        this.validateId(contactId);

        return this.dealRepository
            .findByContact(contactId);
    }

    /**
     * Update Deal
     */
    async updateDeal(
        id: string,
        data: any
    ) {

        this.validateId(id);

        const existingDeal =
            await this.dealRepository
                .findById(id);

        if (!existingDeal) {
            throw new Error(
                'Deal not found'
            );
        }

        // Validate contact
        if (data.contact) {

            const contact =
                await Contact.findById(
                    data.contact
                );

            if (!contact) {
                throw new Error(
                    'Contact not found'
                );
            }
        }

        // Validate lead
        if (data.lead) {

            const lead =
                await Lead.findById(
                    data.lead
                );

            if (!lead) {
                throw new Error(
                    'Lead not found'
                );
            }
        }

        // Do not allow stage changes
        // through generic update endpoint.
        if (
            data.stage &&
            data.stage !== existingDeal.stage
        ) {
            throw new Error(
                'Use the stage endpoint to update deal stage'
            );
        }

        return this.dealRepository.update(
            id,
            data
        );
    }

    /**
     * Update Deal Stage
     */
    async updateDealStage(
        id: string,
        stage: DealStage
    ) {
        this.validateId(id);

        const deal =
            await this.dealRepository
                .findById(id);

        if (!deal) {
            throw new Error(
                'Deal not found'
            );
        }

        if (deal.stage === stage) {
            return deal;
        }

        return this.dealRepository
            .updateStage(id, stage);
    }

    /**
     * Delete Deal
     */
    async deleteDeal(
        id: string
    ) {

        this.validateId(id);

        const deal =
            await this.dealRepository
                .delete(id);

        if (!deal) {
            throw new Error(
                'Deal not found'
            );
        }

        return deal;
    }

    /**
     * Validate MongoDB ID
     */
    private validateId(
        id: string
    ) {

        if (
            !mongoose.Types.ObjectId
                .isValid(id)
        ) {
            throw new Error(
                'Invalid deal ID'
            );
        }
    }
}