import mongoose, { Schema, Document } from 'mongoose';

export interface IReligiousSister extends Document {
  name: string;
  baptismName?: string;
  photographUrl?: string;
  religiousCongregation: string; // e.g. CMC, FCC, CSN, MSJ, SABS
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

const ReligiousSisterSchema = new Schema<IReligiousSister>(
  {
    name: { type: String, required: true, trim: true },
    baptismName: { type: String, default: '' },
    photographUrl: { type: String, default: '' },
    religiousCongregation: { type: String, required: true },
    professionDate: { type: Date },
    currentMinistry: { type: String, required: true },
    dioceseOrCongregation: { type: String, default: '' },
    biography: { type: String, default: '' },
    phone: { type: String, default: '' },
    homeFamilyName: { type: String, default: '' },
    homeFamilyId: { type: Schema.Types.ObjectId, ref: 'Family', default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ReligiousSister = mongoose.model<IReligiousSister>(
  'ReligiousSister',
  ReligiousSisterSchema
);
