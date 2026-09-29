import mongoose, { Schema, Document } from 'mongoose';

export type EventCategory =
  | 'Parish'
  | 'Forane'
  | 'Sunday School'
  | 'Youth'
  | "Women's Association"
  | "Men's Association"
  | 'Koottayma'
  | 'Choir'
  | 'Ministry'
  | 'Feast'
  | 'Retreat'
  | 'Seminar'
  | 'Competition'
  | 'Meeting'
  | 'Other';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  venue: string;
  organizer: string;
  category: EventCategory;
  posterUrl?: string;
  contactInformation?: string;
  registrationInformation?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Postponed' | 'Cancelled';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, required: true },
    organizer: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Parish',
        'Forane',
        'Sunday School',
        'Youth',
        "Women's Association",
        "Men's Association",
        'Koottayma',
        'Choir',
        'Ministry',
        'Feast',
        'Retreat',
        'Seminar',
        'Competition',
        'Meeting',
        'Other',
      ],
      default: 'Parish',
    },
    posterUrl: { type: String, default: '' },
    contactInformation: { type: String, default: '' },
    registrationInformation: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Postponed', 'Cancelled'],
      default: 'Upcoming',
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EventSchema.index({ title: 'text', description: 'text', venue: 'text' });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
