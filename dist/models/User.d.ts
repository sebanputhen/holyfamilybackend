import mongoose, { Document } from 'mongoose';
import { UserRole } from './Role';
export interface IUser extends Document {
    name: string;
    phone: string;
    email?: string;
    password: string;
    role: UserRole;
    assignedKoottayma?: mongoose.Types.ObjectId;
    familyId?: mongoose.Types.ObjectId;
    personId?: mongoose.Types.ObjectId;
    isActive: boolean;
    refreshTokens: string[];
    fcmTokens: string[];
    lastLogin?: Date;
    comparePassword(candidate: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
