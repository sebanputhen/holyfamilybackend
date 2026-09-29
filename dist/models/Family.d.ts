import mongoose, { Document } from 'mongoose';
export type FamilyStatus = 'Active' | 'Inactive' | 'Transferred' | 'Deceased / Historical' | 'Other';
export interface IFamily extends Document {
    familyId: string;
    houseName: string;
    familyName: string;
    headOfFamily: string;
    headPersonId?: mongoose.Types.ObjectId;
    address: string;
    area: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    phone1: string;
    phone2?: string;
    email?: string;
    koottaymaId: mongoose.Types.ObjectId;
    koottaymaName: string;
    parish: string;
    status: FamilyStatus;
    notes?: string;
    privacy: {
        isPhone1Visible: boolean;
        isPhone2Visible: boolean;
        isEmailVisible: boolean;
        isAddressVisible: boolean;
        optOutOfDirectory: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const Family: mongoose.Model<IFamily, {}, {}, {}, mongoose.Document<unknown, {}, IFamily, {}, {}> & IFamily & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
