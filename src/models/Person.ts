import mongoose, { Schema, Document } from 'mongoose';

export type RelationshipType =
  | 'Head'
  | 'Spouse'
  | 'Son'
  | 'Daughter'
  | 'Father'
  | 'Mother'
  | 'Brother'
  | 'Sister'
  | 'Grandfather'
  | 'Grandmother'
  | 'Other';

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

const PersonSchema = new Schema<IPerson>(
  {
    name: { type: String, required: true, trim: true },
    baptismName: { type: String, default: '', trim: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    education: { type: String, default: '' },
    occupation: { type: String, default: '' },
    relationship: {
      type: String,
      required: true,
      enum: [
        'Head',
        'Spouse',
        'Son',
        'Daughter',
        'Father',
        'Mother',
        'Brother',
        'Sister',
        'Grandfather',
        'Grandmother',
        'Other',
      ],
      default: 'Head',
    },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', required: true },
    familyName: { type: String, required: true },
    koottaymaId: { type: Schema.Types.ObjectId, ref: 'Koottayma', required: true },
    parish: { type: String, default: "St. Mary's Forane Church" },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Deceased', 'Transferred'],
      default: 'Active',
    },
    photoUrl: { type: String, default: '' },
    privacy: {
      isPhoneVisible: { type: Boolean, default: true },
      isEmailVisible: { type: Boolean, default: false },
      isDobVisible: { type: Boolean, default: false },
      isOccupationVisible: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

PersonSchema.index({ name: 'text', baptismName: 'text', phone: 'text' });

export const Person = mongoose.model<IPerson>('Person', PersonSchema);
