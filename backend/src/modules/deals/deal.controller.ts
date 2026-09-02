import {
    Request,
    Response,
} from 'express';

import {
    DealService,
} from './deal.service';

import {
    asyncHandler,
} from '../../utils/asyncHandler';

export class DealController {

    private dealService:
        DealService;

    constructor() {
        this.dealService =
            new DealService();
    }

    /**
     * Create Deal
     */
    createDeal = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const deal =
                await this.dealService
                    .createDeal(req.body);

            res.status(201).json({
                success: true,
                message:
                    'Deal created successfully',
                data: deal,
            });
        }
    );

    /**
     * Get All Deals
     */
    getDeals = asyncHandler(
        async (
            _req: Request,
            res: Response
        ) => {

            const deals =
                await this.dealService
                    .getDeals();

            res.status(200).json({
                success: true,
                message:
                    'Deals fetched successfully',
                data: deals,
            });
        }
    );

    /**
     * Get Deal By ID
     */
    getDealById = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const id =
                String(req.params.id);

            const deal =
                await this.dealService
                    .getDealById(id);

            res.status(200).json({
                success: true,
                data: deal,
            });
        }
    );

    /**
     * Get Deals By Contact
     */
    getDealsByContact =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const contactId =
                    String(
                        req.params.contactId
                    );

                const deals =
                    await this.dealService
                        .getDealsByContact(
                            contactId
                        );

                res.status(200).json({
                    success: true,
                    data: deals,
                });
            }
        );

    /**
     * Update Deal
     */
    updateDeal = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const id =
                String(req.params.id);

            const deal =
                await this.dealService
                    .updateDeal(
                        id,
                        req.body
                    );

            res.status(200).json({
                success: true,
                message:
                    'Deal updated successfully',
                data: deal,
            });
        }
    );

    /**
     * Update Deal Stage
     */
    updateDealStage =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const id =
                    String(req.params.id);

                const {
                    stage,
                } = req.body;

                const deal =
                    await this.dealService
                        .updateDealStage(
                            id,
                            stage
                        );

                res.status(200).json({
                    success: true,
                    message:
                        'Deal stage updated successfully',
                    data: deal,
                });
            }
        );

    /**
     * Delete Deal
     */
    deleteDeal = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const id =
                String(req.params.id);

            await this.dealService
                .deleteDeal(id);

            res.status(200).json({
                success: true,
                message:
                    'Deal deleted successfully',
            });
        }
    );
}