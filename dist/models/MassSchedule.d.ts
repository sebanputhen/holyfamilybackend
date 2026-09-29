import mongoose, { Document } from 'mongoose';
export type ServiceType = 'Holy Mass' | 'Confession' | 'Adoration' | 'Novena' | 'Rosary' | 'Stations of the Cross' | 'Benediction' | 'Special prayers' | 'Other';
export interface IMassSchedule extends Document {
    serviceType: ServiceType;
    dayOfWeek: string;
    time: string;
    language: string;
    celebrant: string;
    churchVenue: string;
    specialIntention?: string;
    feastInformation?: string;
    isRecurring: boolean;
    specificDate?: Date;
    status: 'Active' | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
}
export declare const MassSchedule: mongoose.Model<IMassSchedule, {}, {}, {}, mongoose.Document<unknown, {}, IMassSchedule, {}, {}> & IMassSchedule & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
