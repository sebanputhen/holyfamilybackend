import mongoose, { Schema, Document } from 'mongoose';

export interface IKoottayma extends Document {
  name: string;
  number: number | string;
  unitCode?: string;
  patronSaint: string;
  leader: string;
  leaderPhone: string;
  assistantLeader?: string;
  assistantLeaderPhone?: string;
  meetingLocation: string;
  meetingDay: string;
  meetingTime: string;
  description?: string;
  nameMl?: string;
  feastDate?: string;
  location?: string;
  zone?: string;
  totalHouses?: number;
  assignedLeaderUserId?: mongoose.Types.ObjectId;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const KoottaymaSchema = new Schema<IKoottayma>(
  {
    name: { type: String, required: true, trim: true },
    nameMl: { type: String, default: '' },
    number: { type: Schema.Types.Mixed, required: true, unique: true },
    unitCode: { type: String, default: '' },
    patronSaint: { type: String, required: true },
    feastDate: { type: String, default: '' },
    location: { type: String, default: '' },
    zone: { type: String, default: '' },
    totalHouses: { type: Number, default: 0 },
    leader: { type: String, required: true },
    leaderPhone: { type: String, required: true },
    assistantLeader: { type: String, default: '' },
    assistantLeaderPhone: { type: String, default: '' },
    meetingLocation: { type: String, default: 'Rotating Family Residences' },
    meetingDay: { type: String, default: 'Sunday' },
    meetingTime: { type: String, default: '05:00 PM' },
    description: { type: String, default: '' },
    assignedLeaderUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Koottayma = mongoose.model<IKoottayma>('Koottayma', KoottaymaSchema);
