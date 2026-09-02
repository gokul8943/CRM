import { Router } from 'express';

import { DealController } from './deal.controller';

import {
    createDealSchema,
    updateDealSchema,
    updateDealStageSchema,
} from './deal.validation';

import { validate } from '../../middleware/validation.middleware';

const router = Router();

const dealController = new DealController();

/**
 * @swagger
 * tags:
 *   name: Deals
 *   description: Deal management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Deal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665c9f2e8b12345678901234"
 *
 *         contact:
 *           type: string
 *           example: "665c9e1a8b12345678901234"
 *
 *         lead:
 *           type: string
 *           nullable: true
 *           example: "665c9e5b8b12345678901234"
 *
 *         title:
 *           type: string
 *           example: "Enterprise CRM Subscription"
 *
 *         value:
 *           type: number
 *           example: 50000
 *
 *         stage:
 *           type: string
 *           enum:
 *             - PROSPECTING
 *             - QUALIFICATION
 *             - PROPOSAL
 *             - NEGOTIATION
 *             - CLOSED_WON
 *             - CLOSED_LOST
 *           example: PROPOSAL
 *
 *         assignedTo:
 *           type: string
 *           nullable: true
 *           example: "665c9d8a8b12345678901234"
 *
 *         expectedCloseDate:
 *           type: string
 *           format: date
 *           example: "2026-12-31"
 *
 *         description:
 *           type: string
 *           example: "Enterprise CRM implementation deal"
 *
 *         stageHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               stage:
 *                 type: string
 *                 enum:
 *                   - PROSPECTING
 *                   - QUALIFICATION
 *                   - PROPOSAL
 *                   - NEGOTIATION
 *                   - CLOSED_WON
 *                   - CLOSED_LOST
 *               changedAt:
 *                 type: string
 *                 format: date-time
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateDeal:
 *       type: object
 *       required:
 *         - contact
 *         - title
 *         - value
 *       properties:
 *         contact:
 *           type: string
 *           example: "665c9e1a8b12345678901234"
 *
 *         lead:
 *           type: string
 *           example: "665c9e5b8b12345678901234"
 *
 *         title:
 *           type: string
 *           example: "Enterprise CRM Subscription"
 *
 *         value:
 *           type: number
 *           minimum: 0
 *           example: 50000
 *
 *         stage:
 *           type: string
 *           enum:
 *             - PROSPECTING
 *             - QUALIFICATION
 *             - PROPOSAL
 *             - NEGOTIATION
 *             - CLOSED_WON
 *             - CLOSED_LOST
 *           example: PROSPECTING
 *
 *         assignedTo:
 *           type: string
 *           example: "665c9d8a8b12345678901234"
 *
 *         expectedCloseDate:
 *           type: string
 *           format: date
 *           example: "2026-12-31"
 *
 *         description:
 *           type: string
 *           example: "Enterprise CRM implementation deal"
 *
 *     UpdateDeal:
 *       type: object
 *       properties:
 *         contact:
 *           type: string
 *           example: "665c9e1a8b12345678901234"
 *
 *         lead:
 *           type: string
 *           example: "665c9e5b8b12345678901234"
 *
 *         title:
 *           type: string
 *           example: "Updated Enterprise CRM Deal"
 *
 *         value:
 *           type: number
 *           minimum: 0
 *           example: 75000
 *
 *         assignedTo:
 *           type: string
 *           example: "665c9d8a8b12345678901234"
 *
 *         expectedCloseDate:
 *           type: string
 *           format: date
 *           example: "2027-01-15"
 *
 *         description:
 *           type: string
 *           example: "Updated deal description"
 *
 *     UpdateDealStage:
 *       type: object
 *       required:
 *         - stage
 *       properties:
 *         stage:
 *           type: string
 *           enum:
 *             - PROSPECTING
 *             - QUALIFICATION
 *             - PROPOSAL
 *             - NEGOTIATION
 *             - CLOSED_WON
 *             - CLOSED_LOST
 *           example: NEGOTIATION
 */


/**
 * @swagger
 * /deals:
 *   post:
 *     summary: Create a new deal
 *     description: Creates a new deal associated with a contact and optionally a lead.
 *     tags:
 *       - Deals
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeal'
 *     responses:
 *       201:
 *         description: Deal created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Deal created successfully"
 *               data:
 *                 _id: "665c9f2e8b12345678901234"
 *                 title: "Enterprise CRM Subscription"
 *                 value: 50000
 *                 stage: "PROSPECTING"
 *
 *       400:
 *         description: Validation error
 *
 *       500:
 *         description: Internal server error
 */
router.post(
    '/',
    validate(createDealSchema),
    dealController.createDeal
);


/**
 * @swagger
 * /deals:
 *   get:
 *     summary: Get all deals
 *     description: Returns all deals with contact, lead and assigned user information.
 *     tags:
 *       - Deals
 *     responses:
 *       200:
 *         description: Deals fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Deals fetched successfully"
 *               data:
 *                 - _id: "665c9f2e8b12345678901234"
 *                   title: "Enterprise CRM Subscription"
 *                   value: 50000
 *                   stage: "PROPOSAL"
 *
 *       500:
 *         description: Internal server error
 */
router.get(
    '/',
    dealController.getDeals
);


/**
 * @swagger
 * /deals/contact/{contactId}:
 *   get:
 *     summary: Get deals by contact
 *     description: Returns all deals associated with a specific contact.
 *     tags:
 *       - Deals
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665c9e1a8b12345678901234"
 *     responses:
 *       200:
 *         description: Deals fetched successfully
 *
 *       400:
 *         description: Invalid contact ID
 *
 *       500:
 *         description: Internal server error
 */
router.get(
    '/contact/:contactId',
    dealController.getDealsByContact
);


/**
 * @swagger
 * /deals/{id}:
 *   get:
 *     summary: Get deal by ID
 *     description: Returns a single deal by its ID.
 *     tags:
 *       - Deals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665c9f2e8b12345678901234"
 *     responses:
 *       200:
 *         description: Deal fetched successfully
 *
 *       400:
 *         description: Invalid deal ID
 *
 *       404:
 *         description: Deal not found
 *
 *       500:
 *         description: Internal server error
 */
router.get(
    '/:id',
    dealController.getDealById
);


/**
 * @swagger
 * /deals/{id}/stage:
 *   patch:
 *     summary: Update deal stage
 *     description: Updates the stage of a deal and adds the new stage to stage history.
 *     tags:
 *       - Deals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665c9f2e8b12345678901234"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDealStage'
 *
 *     responses:
 *       200:
 *         description: Deal stage updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Deal stage updated successfully"
 *               data:
 *                 _id: "665c9f2e8b12345678901234"
 *                 title: "Enterprise CRM Subscription"
 *                 stage: "NEGOTIATION"
 *
 *       400:
 *         description: Invalid stage or deal ID
 *
 *       404:
 *         description: Deal not found
 *
 *       500:
 *         description: Internal server error
 */
router.patch(
    '/:id/stage',
    validate(updateDealStageSchema),
    dealController.updateDealStage
);


/**
 * @swagger
 * /deals/{id}:
 *   patch:
 *     summary: Update deal
 *     description: Updates deal information. Use the stage endpoint to update the deal stage.
 *     tags:
 *       - Deals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665c9f2e8b12345678901234"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDeal'
 *
 *     responses:
 *       200:
 *         description: Deal updated successfully
 *
 *       400:
 *         description: Validation error
 *
 *       404:
 *         description: Deal not found
 *
 *       500:
 *         description: Internal server error
 */
router.patch(
    '/:id',
    validate(updateDealSchema),
    dealController.updateDeal
);


/**
 * @swagger
 * /deals/{id}:
 *   delete:
 *     summary: Delete deal
 *     description: Deletes a deal by ID.
 *     tags:
 *       - Deals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665c9f2e8b12345678901234"
 *
 *     responses:
 *       200:
 *         description: Deal deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Deal deleted successfully"
 *
 *       400:
 *         description: Invalid deal ID
 *
 *       404:
 *         description: Deal not found
 *
 *       500:
 *         description: Internal server error
 */
router.delete(
    '/:id',
    dealController.deleteDeal
);

export default router;