import mongoose, { Document } from 'mongoose';
export interface ISetting extends Document {
    key: string;
    general: {
        parishName: string;
        defaultLanguage: 'en' | 'ml';
        timeZone: string;
        contactEmail: string;
        contactPhone: string;
    };
    privacy: {
        directoryOptOutAllowed: boolean;
        defaultPhoneVisible: boolean;
        defaultEmailVisible: boolean;
        defaultAddressVisible: boolean;
        defaultDobVisible: boolean;
    };
    notifications: {
        pushNotificationsEnabled: boolean;
        eventRemindersEnabled: boolean;
        massRemindersEnabled: boolean;
        prayerMeetingRemindersEnabled: boolean;
    };
    security: {
        sessionTimeoutMinutes: number;
        maxLoginAttempts: number;
        passwordMinLength: number;
        requireOtp: boolean;
    };
    application: {
        maintenanceMode: boolean;
        maintenanceMessage?: string;
        appVersion: string;
        minSupportedVersion: string;
    };
    updatedAt: Date;
}
export declare const Setting: mongoose.Model<ISetting, {}, {}, {}, mongoose.Document<unknown, {}, ISetting, {}, {}> & ISetting & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
