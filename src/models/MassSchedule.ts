import mongoose, { Schema, Document } from 'mongoose';

export type ServiceType =
  | 'Holy Mass'
  | 'Confession'
  | 'Adoration'
  | 'Novena'
  | 'Rosary'
  | 'Stations of the Cross'
  | 'Benediction'
  | 'Special prayers'
  | 'Other';

export interface IMassSchedule extends Document {
  serviceType: ServiceType;
  dayOfWeek: string; // Sunday, Monday, etc. or 'Daily'
  time: string;
  language: string;
  celebrant: string;
  churchVenue: string;
  specialIntention?: string;
  feastInformation?: string;
  isRecurring: boolean;
  specificDate?: Date;
  status: 'Active' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const MassScheduleSchema = new Schema<IMassSchedule>(
  {
    serviceType: {
      type: String,
      required: true,
      enum: [
        'Holy Mass',
        'Confession',
        'Adoration',
        'Novena',
        'Rosary',
        'Stations of the Cross',
        'Benediction',
        'Special prayers',
        'Other',
      ],
      default: 'Holy Mass',
    },
    dayOfWeek: { type: String, required: true },
    time: { type: String, required: true },
    language: { type: String, default: 'Malayalam' },
    celebrant: { type: String, default: 'Parish Priest' },
    churchVenue: { type: String, default: 'Main Church' },
    specialIntention: { type: String, default: '' },
    feastInformation: { type: String, default: '' },
    isRecurring: { type: Boolean, default: true },
    specificDate: { type: Date, default: null },
    status: { type: String, enum: ['Active', 'Cancelled'], default: 'Active' },
  },
  { timestamps: true }
);

export const MassSchedule = mongoose.model<IMassSchedule>('MassSchedule', MassScheduleSchema);
