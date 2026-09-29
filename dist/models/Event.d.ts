import mongoose, { Document } from 'mongoose';
export type EventCategory = 'Parish' | 'Forane' | 'Sunday School' | 'Youth' | "Women's Association" | "Men's Association" | 'Koottayma' | 'Choir' | 'Ministry' | 'Feast' | 'Retreat' | 'Seminar' | 'Competition' | 'Meeting' | 'Other';
export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    startTime: string;
    endTime: string;
    venue: string;
    organizer: string;
    category: EventCategory;
    posterUrl?: string;
    contactInformation?: string;
    registrationInformation?: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Postponed' | 'Cancelled';
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Event: mongoose.Model<IEvent, {}, {}, {}, mongoose.Document<unknown, {}, IEvent, {}, {}> & IEvent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
