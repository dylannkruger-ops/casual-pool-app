/**
 * Lucen AI — Domain Types
 *
 * These shapes mirror the Postgres schema in /docs/SCHEMA.md.
 * Keep them in sync when wiring Supabase or Prisma.
 */

export type Role = 'worker' | 'business' | 'admin';

export type ID = string;

export type GeoPoint = { lat: number; lng: number };

export type Location = {
  suburb: string;
  postcode: string;
  state: string;
  country: string;
  coordinates?: GeoPoint;
};

export type Availability = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  preferredStart?: string; // 'HH:mm'
  preferredEnd?: string;
};

export type Document = {
  id: ID;
  type: 'rsa' | 'rsg' | 'whitecard' | 'forklift' | 'food_safety' | 'first_aid' | 'driver_licence' | 'police_check' | 'other';
  label: string;
  fileUrl?: string;
  expiresOn?: string; // ISO
  verified: boolean;
};

export type Profession =
  | 'hospitality_floor'
  | 'barista'
  | 'bartender'
  | 'chef_de_partie'
  | 'kitchen_hand'
  | 'event_staff'
  | 'warehouse'
  | 'forklift_operator'
  | 'construction_labourer'
  | 'cleaner'
  | 'retail_assistant'
  | 'admin_office'
  | 'driver'
  | 'security'
  | 'other';

export interface WorkerProfile {
  id: ID;
  userId: ID;
  fullName: string;
  photoUrl?: string;
  professions: Profession[];
  hourlyRate: number; // AUD
  location: Location;
  workRadiusKm: number;
  licences: string[];
  qualifications: string[];
  availability: Availability;
  bio: string;
  experienceYears: number;
  documents: Document[];
  rating: number; // 0–5
  reviewsCount: number;
  shiftsCompleted: number;
  repeatEmployers: number;
  verified: boolean;
  createdAt: string;
}

export interface BusinessProfile {
  id: ID;
  userId: ID;
  companyName: string;
  abn: string;
  abnVerified: boolean;
  contactPerson: string;
  industry: string;
  location: Location;
  logoUrl?: string;
  paymentSetup: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export type ShiftStatus =
  | 'open'
  | 'shortlisting'
  | 'hired'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Shift {
  id: ID;
  businessId: ID;
  title: string;
  profession: Profession;
  description: string;
  location: Location;
  startsAt: string; // ISO
  endsAt: string;
  hourlyRate: number;
  hoursEstimate: number;
  requiredLicences: string[];
  requiredQualifications: string[];
  status: ShiftStatus;
  hiredWorkerId?: ID;
  applicantIds: ID[];
  shortlistIds: ID[];
  platformFeeBusiness: number; // 4.99
  platformFeeWorker: number;   // 4.99
  createdAt: string;
}

export interface Application {
  id: ID;
  shiftId: ID;
  workerId: ID;
  message?: string;
  status: 'applied' | 'shortlisted' | 'hired' | 'declined' | 'withdrawn';
  appliedAt: string;
}

export interface Message {
  id: ID;
  threadId: ID;
  senderId: ID;
  body: string;
  sentAt: string;
  read: boolean;
}

export interface Thread {
  id: ID;
  workerId: ID;
  businessId: ID;
  shiftId?: ID;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Review {
  id: ID;
  fromId: ID;
  toId: ID;
  shiftId: ID;
  rating: number;
  body?: string;
  createdAt: string;
}

export interface Notification {
  id: ID;
  userId: ID;
  type:
    | 'shift_application'
    | 'shortlisted'
    | 'hired'
    | 'message'
    | 'review'
    | 'shift_reminder'
    | 'payment'
    | 'system';
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}
