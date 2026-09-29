import mongoose, { Document } from 'mongoose';
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
export declare const PrayerMeeting: mongoose.Model<IPrayerMeeting, {}, {}, {}, mongoose.Document<unknown, {}, IPrayerMeeting, {}, {}> & IPrayerMeeting & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
