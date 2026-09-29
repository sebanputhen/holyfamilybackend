import mongoose, { Schema, Document } from 'mongoose';

export type PriestCategory = 'Current' | 'Previously Served' | 'From Our Parish';

export interface IPriest extends Document {
  category: PriestCategory;
  name: string;
  baptismName?: string;
  designation: string;
  photographUrl?: string;
  biography?: string;
  ordinationDate?: Date;
  diocese?: string;
  currentMinistry?: string;
  servicePeriod?: string;
  serviceStartDate?: Date;
  serviceEndDate?: Date;
  importantContributions?: string;
  phone?: string;
  email?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PriestSchema = new Schema<IPriest>(
  {
    category: {
      type: String,
      required: true,
      enum: ['Current', 'Previously Served', 'From Our Parish'],
      default: 'Current',
    },
    name: { type: String, required: true, trim: true },
    baptismName: { type: String, default: '' },
    designation: { type: String, required: true },
    photographUrl: { type: String, default: '' },
    biography: { type: String, default: '' },
    ordinationDate: { type: Date },
    diocese: { type: String, default: 'Archdiocese of Ernakulam-Angamaly' },
    currentMinistry: { type: String, default: '' },
    servicePeriod: { type: String, default: '' },
    serviceStartDate: { type: Date },
    serviceEndDate: { type: Date },
    importantContributions: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PriestSchema.index({ category: 1, order: 1 });

export const Priest = mongoose.model<IPriest>('Priest', PriestSchema);
