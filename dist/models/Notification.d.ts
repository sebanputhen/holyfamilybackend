import mongoose, { Document } from 'mongoose';
export type NotificationCategory = 'Announcement' | 'Event' | 'Mass' | 'Koottayma' | 'PrayerMeeting' | 'Emergency';
export interface INotification extends Document {
    title: string;
    message: string;
    category: NotificationCategory;
    targetAudience: string;
    targetKoottaymaId?: mongoose.Types.ObjectId;
    targetUserId?: mongoose.Types.ObjectId;
    sentBy?: mongoose.Types.ObjectId;
    scheduledTime?: Date;
    sentAt?: Date;
    status: 'Pending' | 'Sent' | 'Failed';
    readBy: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
