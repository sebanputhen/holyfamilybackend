import mongoose, { Document } from 'mongoose';
export interface IKoottayma extends Document {
    name: string;
    number: number | string;
    unitCode?: string;
    patronSaint: string;
    leader: string;
    leaderPhone: string;
    assistantLeader?: string;
    assistantLeaderPhone?: string;
    meetingLocation: string;
    meetingDay: string;
    meetingTime: string;
    description?: string;
    assignedLeaderUserId?: mongoose.Types.ObjectId;
    status: 'Active' | 'Inactive';
    createdAt: Date;
    updatedAt: Date;
}
export declare const Koottayma: mongoose.Model<IKoottayma, {}, {}, {}, mongoose.Document<unknown, {}, IKoottayma, {}, {}> & IKoottayma & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
