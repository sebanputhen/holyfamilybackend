import mongoose, { Document } from 'mongoose';
export interface IReligiousSister extends Document {
    name: string;
    baptismName?: string;
    photographUrl?: string;
    religiousCongregation: string;
    professionDate?: Date;
    currentMinistry: string;
    dioceseOrCongregation: string;
    biography?: string;
    phone?: string;
    homeFamilyName?: string;
    homeFamilyId?: mongoose.Types.ObjectId;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ReligiousSister: mongoose.Model<IReligiousSister, {}, {}, {}, mongoose.Document<unknown, {}, IReligiousSister, {}, {}> & IReligiousSister & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
