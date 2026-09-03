import mongoose from 'mongoose';

import { LeadRepository } from './lead.repository';
import { Contact } from '../../models/contactModel';
import { UserRole } from '../../middleware/Auth';

export class LeadService {
  private leadRepository: LeadRepository;

  constructor() {
    this.leadRepository = new LeadRepository();
  }

  async createLead(
    data: any,
    userId: string
  ) {
    const contactExists =
      await Contact.findById(data.contact);

    if (!contactExists) {
      throw new Error(
        "Contact not found"
      );
    }

    return this.leadRepository.create({
      ...data,

      createdBy: userId,
      updatedBy: userId,
    });
  }

  async getLeads(
    userId: string,
    role: UserRole
  ) {
    if (role === "admin") {
      return this.leadRepository.findAll();
    }

    return this.leadRepository.findByCreatedBy(
      userId
    );
  }

  async getLeadById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid lead ID');
    }

    const lead =
      await this.leadRepository.findById(id);

    if (!lead) {
      throw new Error('Lead not found');
    }

    return lead;
  }

  async getLeadsByContact(contactId: string) {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new Error('Invalid contact ID');
    }

    return this.leadRepository.findByContact(
      contactId
    );
  }

  async updateLead(
    id: string,
    data: any
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid lead ID');
    }

    if (data.contact) {
      const contactExists =
        await Contact.findById(data.contact);

      if (!contactExists) {
        throw new Error('Contact not found');
      }
    }

    const lead =
      await this.leadRepository.update(id, data);

    if (!lead) {
      throw new Error('Lead not found');
    }

    return lead;
  }

  async deleteLead(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid lead ID');
    }

    const lead =
      await this.leadRepository.delete(id);

    if (!lead) {
      throw new Error('Lead not found');
    }

    return lead;
  }
}