import { ContactRepository } from './contact.repository';

export class ContactService {
  private contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  async createContact(data: any) {
    const existingContact =
      await this.contactRepository.findByEmail(data.email);

    if (existingContact) {
      throw new Error(
        'Contact with this email already exists'
      );
    }

    return this.contactRepository.create(data);
  }

  async getContacts() {
    return this.contactRepository.findAll();
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