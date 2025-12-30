export type UserRole = 'applicant' | 'consultant';

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'documents_requested'
  | 'sent_to_embassy'
  | 'approved'
  | 'rejected';

export type VisaType = 
  | 'tourist'
  | 'business'
  | 'student'
  | 'work'
  | 'transit'
  | 'medical';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  visaTypes: VisaType[];
  processingTime: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  feedback?: string;
}

export interface VisaApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  country: Country;
  visaType: VisaType;
  status: ApplicationStatus;
  submittedAt: Date;
  updatedAt: Date;
  documents: Document[];
  travelDate: Date;
  returnDate?: Date;
  purpose: string;
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  inReview: number;
}
