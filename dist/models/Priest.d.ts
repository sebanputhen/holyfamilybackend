import mongoose, { Document } from 'mongoose';
export type PriestCategory = 'Current' | 'Previously Served' | 'From Our Parish';
export interface IPriest extends Document {
    category: PriestCategory;
    name: string;
    baptismName?: string;
    designation: string;
    photographUrl?: string;
    biography?: string;
    ordinationDate?: Date;
    diocese?: string;
    currentMinistry?: string;
    servicePeriod?: string;
    serviceStartDate?: Date;
    serviceEndDate?: Date;
    importantContributions?: string;
    phone?: string;
    email?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Priest: mongoose.Model<IPriest, {}, {}, {}, mongoose.Document<unknown, {}, IPriest, {}, {}> & IPriest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
