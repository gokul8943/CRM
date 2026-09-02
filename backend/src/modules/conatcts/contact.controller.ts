import { Request, Response } from 'express';

import { ContactService } from './contact.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class ContactController {
    private contactService: ContactService;

    constructor() {
        this.contactService = new ContactService();
    }

    createContact = asyncHandler(
        async (req: Request, res: Response) => {
            const contact = await this.contactService.createContact(req.body);

            res.status(201).json({
                success: true,
                message: 'Contact created successfully',
                data: contact,
            });
        }
    );

    getContacts = asyncHandler(
        async (_req: Request, res: Response) => {
            const contacts = await this.contactService.getContacts();

            res.status(200).json({
                success: true,
                message: 'Contacts fetched successfully',
                data: contacts,
            });
        }
    );

    getContactById = asyncHandler(
        async (req: Request, res: Response) => {
            const id = String(req.params.id);

            const contact = await this.contactService.getContactById(id);

            res.status(200).json({
                success: true,
                data: contact,
            });
        }
    );

    updateContact = asyncHandler(
        async (req: Request, res: Response) => {
            const id = String(req.params.id);

            const contact = await this.contactService.updateContact(
                id,
                req.body
            );

            res.status(200).json({
                success: true,
                message: 'Contact updated successfully',
                data: contact,
            });
        }
    );

    deleteContact = asyncHandler(
        async (req: Request, res: Response) => {
            const id = String(req.params.id);

            await this.contactService.deleteContact(id);

            res.status(200).json({
                success: true,
                message: 'Contact deleted successfully',
            });
        }
    );
}