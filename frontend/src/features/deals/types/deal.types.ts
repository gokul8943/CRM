import type { Contact } from '../../contacts/types/contact.types';
import type { Lead } from '../../leads/types/lead.types';

export type DealStage =
  | 'PROSPECTING'
  | 'QUALIFICATION'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export type DealStageCategory = 'New' | 'In Progress' | 'Won' | 'Lost';

export interface StageHistoryItem {
  stage: DealStage;
  changedAt: string;
}

export interface Deal {
  _id: string;
  contact: string | Contact;
  lead?: string | Lead;
  title: string;
  value: number;
  stage: DealStage;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | string;
  expectedCloseDate?: string;
  description?: string;
  stageHistory: StageHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealRequest {
  contact: string;
  lead?: string;
  title: string;
  value: number;
  stage?: DealStage;
  assignedTo?: string;
  expectedCloseDate?: string;
  description?: string;
}

export interface UpdateDealRequest {
  contact?: string;
  lead?: string;
  title?: string;
  value?: number;
  assignedTo?: string;
  expectedCloseDate?: string;
  description?: string;
}

export interface UpdateDealStageRequest {
  stage: DealStage;
}

export const DEAL_STAGES: {
  id: DealStage;
  label: string;
  category: DealStageCategory;
  color: string;
  description: string;
}[] = [
  {
    id: 'PROSPECTING',
    label: 'Prospecting',
    category: 'New',
    color: 'amber',
    description: 'Initial opportunity identified',
  },
  {
    id: 'QUALIFICATION',
    label: 'Qualification',
    category: 'In Progress',
    color: 'blue',
    description: 'Validating budget, authority & need',
  },
  {
    id: 'PROPOSAL',
    label: 'Proposal',
    category: 'In Progress',
    color: 'indigo',
    description: 'Formal quote or proposal submitted',
  },
  {
    id: 'NEGOTIATION',
    label: 'Negotiation',
    category: 'In Progress',
    color: 'purple',
    description: 'Reviewing terms and final pricing',
  },
  {
    id: 'CLOSED_WON',
    label: 'Closed Won',
    category: 'Won',
    color: 'emerald',
    description: 'Deal won & contracts finalized',
  },
  {
    id: 'CLOSED_LOST',
    label: 'Closed Lost',
    category: 'Lost',
    color: 'rose',
    description: 'Opportunity lost or canceled',
  },
];

export const getStageCategory = (stage: DealStage): DealStageCategory => {
  switch (stage) {
    case 'PROSPECTING':
      return 'New';
    case 'QUALIFICATION':
    case 'PROPOSAL':
    case 'NEGOTIATION':
      return 'In Progress';
    case 'CLOSED_WON':
      return 'Won';
    case 'CLOSED_LOST':
      return 'Lost';
    default:
      return 'New';
  }
};
