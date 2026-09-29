import mongoose, { Document } from 'mongoose';
export interface IParish extends Document {
    name: string;
    logoUrl?: string;
    patronSaint: string;
    diocese: string;
    forane: string;
    address: string;
    establishedYear: number;
    parishFeast: string;
    currentParishPriest: {
        name: string;
        phone?: string;
        photoUrl?: string;
        serviceStartDate?: Date;
    };
    assistantPriests: Array<{
        name: string;
        phone?: string;
        photoUrl?: string;
        serviceStartDate?: Date;
    }>;
    totalFamiliesCount: number;
    totalParishionersCount: number;
    totalKoottaymasCount: number;
    institutions: Array<{
        name: string;
        type: string;
        description?: string;
    }>;
    officeInfo: {
        phone: string;
        email: string;
        officeHours: string;
        address: string;
        mapLocation: {
            latitude: number;
            longitude: number;
            googleMapsUrl?: string;
        };
        website?: string;
        socialMedia?: {
            facebook?: string;
            youtube?: string;
            instagram?: string;
            whatsapp?: string;
        };
    };
    welcomeMessage?: {
        en: string;
        ml: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const Parish: mongoose.Model<IParish, {}, {}, {}, mongoose.Document<unknown, {}, IParish, {}, {}> & IParish & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
