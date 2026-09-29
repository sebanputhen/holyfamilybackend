import mongoose, { Schema, Document } from 'mongoose';

export type PrayerMeetingStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';

export interface IPrayerMeeting extends Document {
  koottaymaId: mongoose.Types.ObjectId;
  koottaymaName: string;
  date: Date;
  time: string;
  venue: string;
  hostFamily: string;
  hostFamilyId?: mongoose.Types.ObjectId;
  leader: string;
  theme: string;
  bibleReading?: string;
  prayerIntention?: string;
  notes?: string;
  attendanceCount: number;
  attendeeNames: string[];
  status: PrayerMeetingStatus;
  submittedBy?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PrayerMeetingSchema = new Schema<IPrayerMeeting>(
  {
    koottaymaId: { type: Schema.Types.ObjectId, ref: 'Koottayma', required: true },
    koottaymaName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    hostFamily: { type: String, required: true },
    hostFamilyId: { type: Schema.Types.ObjectId, ref: 'Family', default: null },
    leader: { type: String, required: true },
    theme: { type: String, default: 'Living in Christ & Family Unity' },
    bibleReading: { type: String, default: 'Psalm 128: 1-6' },
    prayerIntention: { type: String, default: 'For parish unity and all suffering sick members' },
    notes: { type: String, default: '' },
    attendanceCount: { type: Number, default: 0 },
    attendeeNames: [{ type: String }],
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
    },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export const PrayerMeeting = mongoose.model<IPrayerMeeting>('PrayerMeeting', PrayerMeetingSchema);
