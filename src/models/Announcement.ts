import mongoose, { Schema, Document } from 'mongoose';

export type AnnouncementPriority = 'Normal' | 'Important' | 'Urgent';
export type TargetAudience =
  | 'All'
  | 'Parishioners'
  | 'Koottayma'
  | 'Ministry'
  | 'Admins'
  | 'Koottayma Leaders';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  attachmentUrl?: string;
  category: string;
  publishedDate: Date;
  expiryDate?: Date;
  priority: AnnouncementPriority;
  targetAudience: TargetAudience;
  targetKoottaymaId?: mongoose.Types.ObjectId;
  targetMinistryName?: string;
  isActive: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    attachmentUrl: { type: String, default: '' },
    category: { type: String, default: 'General' },
    publishedDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, default: null },
    priority: {
      type: String,
      enum: ['Normal', 'Important', 'Urgent'],
      default: 'Normal',
    },
    targetAudience: {
      type: String,
      enum: ['All', 'Parishioners', 'Koottayma', 'Ministry', 'Admins', 'Koottayma Leaders'],
      default: 'All',
    },
    targetKoottaymaId: { type: Schema.Types.ObjectId, ref: 'Koottayma', default: null },
    targetMinistryName: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AnnouncementSchema.index({ title: 'text', content: 'text' });

export const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
