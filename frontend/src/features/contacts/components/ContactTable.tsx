import React from 'react';
import type { Contact } from '../types/contact.types';
import { Badge } from '../../../components/common/Badge';
import { Mail, Phone, Building, Edit2, Trash2, Eye, UserX } from 'lucide-react';

interface ContactTableProps {
  contacts: Contact[];
  onView: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  onView,
  onEdit,
  onDelete,
}) => {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <UserX className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-900 mb-1">No contacts found</h4>
        <p className="text-sm text-slate-500 max-w-sm">
          No contacts match your current filter or search criteria. Try adjusting your query or create a new contact.
        </p>
      </div>
    );
  }

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-6">Name</th>
              <th className="py-3.5 px-6">Company</th>
              <th className="py-3.5 px-6">Contact Info</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Source</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {contacts.map((contact) => (
              <tr
                key={contact._id}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => onView(contact)}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-semibold flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {getInitials(contact.firstName, contact.lastName)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {contact.firstName} {contact.lastName}
                      </div>
                      {contact.jobTitle && (
                        <div className="text-xs text-slate-500">
                          {contact.jobTitle}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6">
                  {contact.company ? (
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {contact.company}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-xs">—</span>
                  )}
                </td>

                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="hover:underline">{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-4 px-6">
                  <Badge
                    variant={contact.status === 'ACTIVE' ? 'emerald' : 'slate'}
                  >
                    {contact.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </Badge>
                </td>

                <td className="py-4 px-6">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {contact.source || 'Website'}
                  </span>
                </td>

                <td
                  className="py-4 px-6 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(contact)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(contact)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Contact"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(contact)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
