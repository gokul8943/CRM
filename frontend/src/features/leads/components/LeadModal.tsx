import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { LeadForm } from './LeadForm';
import type { Lead, CreateLeadRequest } from '../types/lead.types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  initialContactId?: string;
  onSubmit: (data: CreateLeadRequest) => Promise<void>;
  loading?: boolean;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  initialContactId,
  onSubmit,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? 'Edit Lead' : 'Create New Lead'}
      description={
        lead
          ? 'Update sales opportunity details and estimated value.'
          : 'Capture a new sales opportunity linked to a contact.'
      }
      maxWidth="lg"
    >
      <LeadForm
        key={lead?._id || initialContactId || 'new'}
        initialData={lead}
        initialContactId={initialContactId}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};
