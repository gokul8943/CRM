import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { ContactForm } from './ContactForm';
import type { Contact, CreateContactRequest } from '../types/contact.types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact | null;
  onSubmit: (data: CreateContactRequest) => Promise<void>;
  loading?: boolean;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contact,
  onSubmit,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contact ? 'Edit Contact' : 'Create New Contact'}
      description={
        contact
          ? 'Update existing contact information and notes.'
          : 'Add a new client, prospect, or partner to your CRM database.'
      }
      maxWidth="lg"
    >
      <ContactForm
        key={contact?._id || 'new'}
        initialData={contact}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};
