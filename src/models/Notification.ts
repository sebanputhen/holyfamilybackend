import mongoose, { Schema, Document } from 'mongoose';

export type NotificationCategory =
  | 'Announcement'
  | 'Event'
  | 'Mass'
  | 'Koottayma'
  | 'PrayerMeeting'
  | 'Emergency';

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

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Announcement', 'Event', 'Mass', 'Koottayma', 'PrayerMeeting', 'Emergency'],
      default: 'Announcement',
    },
    targetAudience: { type: String, default: 'All' },
    targetKoottaymaId: { type: Schema.Types.ObjectId, ref: 'Koottayma', default: null },
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    sentBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    scheduledTime: { type: Date, default: null },
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Sent' },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
