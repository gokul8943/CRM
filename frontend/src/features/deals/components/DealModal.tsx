import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { DealForm } from './DealForm';
import type { Deal, CreateDealRequest } from '../types/deal.types';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: Deal | null;
  initialContactId?: string;
  initialLeadId?: string;
  initialTitle?: string;
  initialValue?: number;
  onSubmit: (data: CreateDealRequest) => Promise<void>;
  loading?: boolean;
}

export const DealModal: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  deal,
  initialContactId,
  initialLeadId,
  initialTitle,
  initialValue,
  onSubmit,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? 'Edit Deal' : 'Create New Deal'}
      description={
        deal
          ? 'Update deal contract parameters and details.'
          : 'Create a deal opportunity to track through your sales pipeline.'
      }
      maxWidth="lg"
    >
      <DealForm
        key={deal?._id || initialContactId || initialLeadId || 'new'}
        initialData={deal}
        initialContactId={initialContactId}
        initialLeadId={initialLeadId}
        initialTitle={initialTitle}
        initialValue={initialValue}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};
