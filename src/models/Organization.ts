import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  logoUrl?: string;
  description: string;
  leader: string;
  leaderPhone?: string;
  secretary?: string;
  secretaryPhone?: string;
  meetingSchedule: string;
  activities: string[];
  membersCount: number;
  contactEmail?: string;
  galleryUrls: string[];
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    logoUrl: { type: String, default: '' },
    description: { type: String, required: true },
    leader: { type: String, required: true },
    leaderPhone: { type: String, default: '' },
    secretary: { type: String, default: '' },
    secretaryPhone: { type: String, default: '' },
    meetingSchedule: { type: String, default: 'Weekly' },
    activities: [{ type: String }],
    membersCount: { type: Number, default: 0 },
    contactEmail: { type: String, default: '' },
    galleryUrls: [{ type: String }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
