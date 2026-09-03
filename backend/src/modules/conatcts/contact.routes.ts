import { Router } from 'express';

import { ContactController } from './contact.controller';
import {
    createContactSchema,
    updateContactSchema,
} from './contact.validation';

import { validate } from '../../middleware/validation.middleware';
import { authenticateToken } from '../../middleware/Auth';

const router = Router();

const contactController =
    new ContactController();


/**
* @swagger
* /contacts:
*   post:
*     summary: Create a new contact
*     tags:
*       - Contacts
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - firstName
*               - lastName
*               - email
*             properties:
*               firstName:
*                 type: string
*                 example: John
*               lastName:
*                 type: string
*                 example: Doe
*               email:
*                 type: string
*                 format: email
*                 example: john@example.com
*               phone:
*                 type: string
*                 example: "9876543210"
*     responses:
*       201:
*         description: Contact created successfully
*       400:
*         description: Validation error
*/
router.post(
    "/",
    authenticateToken,
    validate(createContactSchema),
    contactController.createContact
);


/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: Contacts fetched successfully
 */
router.get(
    '/',
    authenticateToken,
    contactController.getContacts
);


/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact fetched successfully
 *       404:
 *         description: Contact not found
 */
router.get(
    '/:id',
    contactController.getContactById
);


/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Update contact
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 */
router.patch(
    '/:id',
    validate(updateContactSchema),
    contactController.updateContact
);


/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete contact
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
router.delete(
    '/:id',
    contactController.deleteContact
);

export default router;