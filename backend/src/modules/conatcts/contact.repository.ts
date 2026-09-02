import { Contact, IContact } from '../../models/contactModel';

export class ContactRepository {
    async create(data: Partial<IContact>) {
        return Contact.create(data);
    }

    async findAll() {
        return Contact.find()
            .sort({ createdAt: -1 });
    }

    async findById(id: string) {
        return Contact.findById(id);
    }

    async findByEmail(email: string) {
        return Contact.findOne({ email });
    }

    async update(
        id: string,
        data: Partial<IContact>
    ) {
        return Contact.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(id: string) {
        return Contact.findByIdAndDelete(id);
    }
}