import mongoose, { Document } from 'mongoose';
export interface IDailyReading extends Document {
    date: string;
    feastOfTheDay: {
        en: string;
        ml: string;
    };
    saintOfTheDay: {
        en: string;
        ml: string;
    };
    firstReading: {
        reference: string;
        text: {
            en: string;
            ml: string;
        };
    };
    psalm: {
        reference: string;
        text: {
            en: string;
            ml: string;
        };
        response: {
            en: string;
            ml: string;
        };
    };
    secondReading?: {
        reference: string;
        text: {
            en: string;
            ml: string;
        };
    };
    gospel: {
        reference: string;
        text: {
            en: string;
            ml: string;
        };
    };
    prayerOfTheDay: {
        en: string;
        ml: string;
    };
    parishPrayer: {
        en: string;
        ml: string;
    };
    specialPrayers?: Array<{
        title: {
            en: string;
            ml: string;
        };
        text: {
            en: string;
            ml: string;
        };
    }>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DailyReading: mongoose.Model<IDailyReading, {}, {}, {}, mongoose.Document<unknown, {}, IDailyReading, {}, {}> & IDailyReading & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
