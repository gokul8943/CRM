import { Request, Response } from 'express';

import { LeadService } from './lead.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/Auth';

export class LeadController {
  private leadService: LeadService;

  constructor() {
    this.leadService = new LeadService();
  }

  createLead = asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const lead =
        await this.leadService.createLead(
          req.body,
          req.user!.id
        );

      res.status(201).json({
        success: true,
        message: "Lead created successfully",
        data: lead,
      });
    }
  );

  getLeads = asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const leads =
        await this.leadService.getLeads(
          req.user!.id,
          req.user!.role!
        );

      res.status(200).json({
        success: true,
        message: "Leads fetched successfully",
        data: leads,
      });
    }
  );

  getLeadById = asyncHandler(
    async (req: Request, res: Response) => {
      const id = String(req.params.id);

      const lead =
        await this.leadService.getLeadById(id);

      res.status(200).json({
        success: true,
        data: lead,
      });
    }
  );

  getLeadsByContact = asyncHandler(
    async (req: Request, res: Response) => {
      const contactId =
        String(req.params.contactId);

      const leads =
        await this.leadService.getLeadsByContact(
          contactId
        );

      res.status(200).json({
        success: true,
        data: leads,
      });
    }
  );

  updateLead = asyncHandler(
    async (req: Request, res: Response) => {
      const id = String(req.params.id);

      const lead =
        await this.leadService.updateLead(
          id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        data: lead,
      });
    }
  );

  deleteLead = asyncHandler(
    async (req: Request, res: Response) => {
      const id = String(req.params.id);

      await this.leadService.deleteLead(id);

      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully',
      });
    }
  );
}