import {
    Router,
} from 'express';

import {
    DealController,
} from './deal.controller';

import {
    createDealSchema,
    updateDealSchema,
    updateDealStageSchema,
} from './deal.validation';

import {
    validate,
} from '../../middleware/validation.middleware';

const router = Router();

const dealController =
    new DealController();

/**
 * Create Deal
 */
router.post(
    '/',
    validate(createDealSchema),
    dealController.createDeal
);

/**
 * Get All Deals
 */
router.get(
    '/',
    dealController.getDeals
);

/**
 * Get Deals By Contact
 *
 * IMPORTANT:
 * This must come before /:id
 */
router.get(
    '/contact/:contactId',
    dealController.getDealsByContact
);

/**
 * Get Deal By ID
 */
router.get(
    '/:id',
    dealController.getDealById
);

/**
 * Update Deal Stage
 *
 * Must come before generic PATCH /:id
 */
router.patch(
    '/:id/stage',
    validate(updateDealStageSchema),
    dealController.updateDealStage
);

/**
 * Update Deal
 */
router.patch(
    '/:id',
    validate(updateDealSchema),
    dealController.updateDeal
);

/**
 * Delete Deal
 */
router.delete(
    '/:id',
    dealController.deleteDeal
);

export default router;