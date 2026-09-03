import { UserRole } from '../../middleware/Auth';
import { ContactRepository } from './contact.repository';

export class ContactService {
  private contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  async createContact(
    data: any,
    userId: string
  ) {
    const existingContact =
      await this.contactRepository.findByEmail(
        data.email
      );

    if (existingContact) {
      throw new Error(
        "Contact with this email already exists"
      );
    }

    return this.contactRepository.create({
      ...data,

      createdBy: userId,
      updatedBy: userId,
    });
  }

  async getContacts(
    userId: string,
    role: UserRole
  ) {
    if (role === "admin") {
      return this.contactRepository.findAll();
    }

    return this.contactRepository.findByCreatedBy(
      userId
    );
  }

  async getContactById(id: string) {
    const contact =
      await this.contactRepository.findById(id);

    if (!contact) {
      throw new Error('Contact not found');
    }

    return contact;
  }

  async updateContact(
    id: string,
    data: any
  ) {
    const contact =
      await this.contactRepository.update(id, data);

    if (!contact) {
      throw new Error('Contact not found');
    }

    return contact;
  }

  async deleteContact(id: string) {
    const contact =
      await this.contactRepository.delete(id);

    if (!contact) {
      throw new Error('Contact not found');
    }

    return contact;
  }
}