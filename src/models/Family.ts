import mongoose, { Schema, Document } from 'mongoose';

export type FamilyStatus = 'Active' | 'Inactive' | 'Transferred' | 'Deceased / Historical' | 'Other';

export interface IFamily extends Document {
  familyId: string;
  houseName: string;
  familyName: string;
  headOfFamily: string;
  headPersonId?: mongoose.Types.ObjectId;
  address: string;
  area: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  phone1: string;
  phone2?: string;
  email?: string;
  koottaymaId: mongoose.Types.ObjectId;
  koottaymaName: string;
  parish: string;
  status: FamilyStatus;
  notes?: string;
  privacy: {
    isPhone1Visible: boolean;
    isPhone2Visible: boolean;
    isEmailVisible: boolean;
    isAddressVisible: boolean;
    optOutOfDirectory: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FamilySchema = new Schema<IFamily>(
  {
    familyId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    houseName: { type: String, required: true, trim: true },
    familyName: { type: String, required: true, trim: true },
    headOfFamily: { type: String, required: true, trim: true },
    headPersonId: { type: Schema.Types.ObjectId, ref: 'Person', default: null },
    address: { type: String, required: true },
    area: { type: String, default: '' },
    city: { type: String, default: 'Kochi' },
    district: { type: String, default: 'Ernakulam' },
    state: { type: String, default: 'Kerala' },
    pincode: { type: String, default: '682020' },
    phone1: { type: String, required: true, trim: true },
    phone2: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    koottaymaId: { type: Schema.Types.ObjectId, ref: 'Koottayma', required: true },
    koottaymaName: { type: String, required: true },
    parish: { type: String, default: "St. Mary's Forane Church" },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Transferred', 'Deceased / Historical', 'Other'],
      default: 'Active',
    },
    notes: { type: String, default: '' },
    privacy: {
      isPhone1Visible: { type: Boolean, default: true },
      isPhone2Visible: { type: Boolean, default: true },
      isEmailVisible: { type: Boolean, default: false },
      isAddressVisible: { type: Boolean, default: true },
      optOutOfDirectory: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

FamilySchema.index({ houseName: 'text', headOfFamily: 'text', familyName: 'text', phone1: 'text' });

export const Family = mongoose.model<IFamily>('Family', FamilySchema);
