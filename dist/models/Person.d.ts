import mongoose, { Document } from 'mongoose';
export type RelationshipType = 'Head' | 'Spouse' | 'Son' | 'Daughter' | 'Father' | 'Mother' | 'Brother' | 'Sister' | 'Grandfather' | 'Grandmother' | 'Other';
export interface IPerson extends Document {
    name: string;
    baptismName?: string;
    gender: 'Male' | 'Female' | 'Other';
    dateOfBirth?: Date;
    phone?: string;
    email?: string;
    education?: string;
    occupation?: string;
    relationship: RelationshipType;
    familyId: mongoose.Types.ObjectId;
    familyName: string;
    koottaymaId: mongoose.Types.ObjectId;
    parish: string;
    status: 'Active' | 'Inactive' | 'Deceased' | 'Transferred';
    photoUrl?: string;
    privacy: {
        isPhoneVisible: boolean;
        isEmailVisible: boolean;
        isDobVisible: boolean;
        isOccupationVisible: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const Person: mongoose.Model<IPerson, {}, {}, {}, mongoose.Document<unknown, {}, IPerson, {}, {}> & IPerson & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
