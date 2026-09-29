import mongoose, { Document } from 'mongoose';
export type AnnouncementPriority = 'Normal' | 'Important' | 'Urgent';
export type TargetAudience = 'All' | 'Parishioners' | 'Koottayma' | 'Ministry' | 'Admins' | 'Koottayma Leaders';
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
export declare const Announcement: mongoose.Model<IAnnouncement, {}, {}, {}, mongoose.Document<unknown, {}, IAnnouncement, {}, {}> & IAnnouncement & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
