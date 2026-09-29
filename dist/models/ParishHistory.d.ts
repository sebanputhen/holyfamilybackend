import mongoose, { Document } from 'mongoose';
export interface IParishHistory extends Document {
    year: number;
    event: string;
    description: string;
    photos: string[];
    category: 'Establishment' | 'Milestone' | 'Development' | 'Historical Event' | 'Personality';
    importantPersonalities?: string[];
    documents?: Array<{
        title: string;
        url: string;
    }>;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ParishHistory: mongoose.Model<IParishHistory, {}, {}, {}, mongoose.Document<unknown, {}, IParishHistory, {}, {}> & IParishHistory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
