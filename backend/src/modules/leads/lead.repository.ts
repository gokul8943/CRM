import { Lead, ILead } from '../../models/lead.model';

export class LeadRepository {
  async create(data: Partial<ILead>) {
    return Lead.create(data);
  }

  async findByCreatedBy(userId: string) {
    return Lead.find({
      createdBy: userId,
    })
      .populate(
        "contact",
        "firstName lastName email phone company"
      )
      .populate(
        "assignedTo",
        "firstName lastName email"
      )
      .sort({
        createdAt: -1,
      });
  }


  async findAll() {
    return Lead.find()
      .populate(
        'contact',
        'firstName lastName email phone company'
      )
      .populate(
        'assignedTo',
        'firstName lastName email'
      )
      .sort({ createdAt: -1 });
  }


  async findById(id: string) {
    return Lead.findById(id)
      .populate(
        'contact',
        'firstName lastName email phone company'
      )
      .populate(
        'assignedTo',
        'firstName lastName email'
      );
  }

  async findByContact(contactId: string) {
    return Lead.find({
      contact: contactId,
    })
      .populate(
        'contact',
        'firstName lastName email phone company'
      )
      .sort({ createdAt: -1 });
  }

  async update(
    id: string,
    data: Partial<ILead>
  ) {
    return Lead.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        'contact',
        'firstName lastName email phone company'
      )
      .populate(
        'assignedTo',
        'firstName lastName email'
      );
  }

  async delete(id: string) {
    return Lead.findByIdAndDelete(id);
  }
}