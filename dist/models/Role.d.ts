import mongoose, { Document } from 'mongoose';
export declare enum UserRole {
    PARISHIONER = "Parishioner",
    KOOTTAYMA_LEADER = "Koottayma Leader",
    ADMIN = "Admin",
    SUPER_ADMIN = "Super Admin"
}
export interface IRole extends Document {
    name: UserRole;
    description: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Role: mongoose.Model<IRole, {}, {}, {}, mongoose.Document<unknown, {}, IRole, {}, {}> & IRole & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
