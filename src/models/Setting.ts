import mongoose, { Schema, Document } from 'mongoose';

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

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, default: 'global_settings' },
    general: {
      parishName: { type: String, default: "St. Mary's Forane Church" },
      defaultLanguage: { type: String, enum: ['en', 'ml'], default: 'en' },
      timeZone: { type: String, default: 'Asia/Kolkata' },
      contactEmail: { type: String, default: 'office@stmarysforane.org' },
      contactPhone: { type: String, default: '+91 484 2200112' },
    },
    privacy: {
      directoryOptOutAllowed: { type: Boolean, default: true },
      defaultPhoneVisible: { type: Boolean, default: true },
      defaultEmailVisible: { type: Boolean, default: false },
      defaultAddressVisible: { type: Boolean, default: true },
      defaultDobVisible: { type: Boolean, default: false },
    },
    notifications: {
      pushNotificationsEnabled: { type: Boolean, default: true },
      eventRemindersEnabled: { type: Boolean, default: true },
      massRemindersEnabled: { type: Boolean, default: true },
      prayerMeetingRemindersEnabled: { type: Boolean, default: true },
    },
    security: {
      sessionTimeoutMinutes: { type: Number, default: 60 },
      maxLoginAttempts: { type: Number, default: 5 },
      passwordMinLength: { type: Number, default: 6 },
      requireOtp: { type: Boolean, default: false },
    },
    application: {
      maintenanceMode: { type: Boolean, default: false },
      maintenanceMessage: { type: String, default: 'System is temporarily under scheduled maintenance.' },
      appVersion: { type: String, default: '1.0.0' },
      minSupportedVersion: { type: String, default: '1.0.0' },
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema);
