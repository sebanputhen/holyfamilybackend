import mongoose, { Document } from 'mongoose';
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
export declare const Organization: mongoose.Model<IOrganization, {}, {}, {}, mongoose.Document<unknown, {}, IOrganization, {}, {}> & IOrganization & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
