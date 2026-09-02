import { Router } from 'express';

import { LeadController } from './lead.controller';

import {
    createLeadSchema,
    updateLeadSchema,
} from './lead.validation';

import { validate } from '../../middleware/validation.middleware';

const router = Router();

const leadController = new LeadController();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68b123456789abcdef123456"
 *         contact:
 *           type: string
 *           description: MongoDB ObjectId of the contact
 *           example: "68b123456789abcdef123456"
 *         title:
 *           type: string
 *           example: "CRM Software Opportunity"
 *         status:
 *           type: string
 *           enum:
 *             - NEW
 *             - CONTACTED
 *             - QUALIFIED
 *             - LOST
 *           example: NEW
 *         source:
 *           type: string
 *           example: "LinkedIn"
 *         value:
 *           type: number
 *           example: 50000
 *         description:
 *           type: string
 *           example: "Interested in CRM solution"
 *         assignedTo:
 *           type: string
 *           description: MongoDB ObjectId of the assigned user
 *           example: "68b987654321abcdef654321"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lead'
 *           example:
 *             contact: "68b123456789abcdef123456"
 *             title: "CRM Software Opportunity"
 *             status: "NEW"
 *             source: "LinkedIn"
 *             value: 50000
 *             description: "Interested in CRM solution"
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Lead created successfully"
 *               data:
 *                 _id: "68b123456789abcdef123456"
 *                 contact: "68b123456789abcdef123456"
 *                 title: "CRM Software Opportunity"
 *                 status: "NEW"
 *                 source: "LinkedIn"
 *                 value: 50000
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
router.post(
    '/',
    validate(createLeadSchema),
    leadController.createLead
);

/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Get all leads
 *     tags: [Leads]
 *     responses:
 *       200:
 *         description: Leads fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Leads fetched successfully"
 *               data:
 *                 - _id: "68b123456789abcdef123456"
 *                   title: "CRM Software Opportunity"
 *                   status: "NEW"
 *                   source: "LinkedIn"
 *                   value: 50000
 *                   contact:
 *                     _id: "68b123456789abcdef123456"
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     email: "john@example.com"
 *                     company: "ABC Technologies"
 *       500:
 *         description: Internal server error
 */
router.get(
    '/',
    leadController.getLeads
);

/**
 * @swagger
 * /leads/contact/{contactId}:
 *   get:
 *     summary: Get all leads for a contact
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the contact
 *         example: "68b123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Leads fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "68b123456789abcdef123456"
 *                   title: "CRM Software Opportunity"
 *                   status: "QUALIFIED"
 *                   value: 50000
 *                   contact:
 *                     _id: "68b123456789abcdef123456"
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     email: "john@example.com"
 *       400:
 *         description: Invalid contact ID
 *       500:
 *         description: Internal server error
 */
router.get(
    '/contact/:contactId',
    leadController.getLeadsByContact
);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Get a lead by ID
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lead
 *         example: "68b123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Lead fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "68b123456789abcdef123456"
 *                 title: "CRM Software Opportunity"
 *                 status: "NEW"
 *                 source: "LinkedIn"
 *                 value: 50000
 *                 description: "Interested in CRM solution"
 *       400:
 *         description: Invalid lead ID
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */
router.get(
    '/:id',
    leadController.getLeadById
);

/**
 * @swagger
 * /leads/{id}:
 *   patch:
 *     summary: Update a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lead
 *         example: "68b123456789abcdef123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lead'
 *           example:
 *             title: "Enterprise CRM Opportunity"
 *             status: "QUALIFIED"
 *             source: "LinkedIn"
 *             value: 75000
 *             description: "Customer is ready for a product demo"
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Lead updated successfully"
 *               data:
 *                 _id: "68b123456789abcdef123456"
 *                 title: "Enterprise CRM Opportunity"
 *                 status: "QUALIFIED"
 *                 value: 75000
 *       400:
 *         description: Validation failed or invalid lead ID
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    '/:id',
    validate(updateLeadSchema),
    leadController.updateLead
);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Delete a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lead
 *         example: "68b123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Lead deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Lead deleted successfully"
 *       400:
 *         description: Invalid lead ID
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    '/:id',
    leadController.deleteLead
);

export default router;