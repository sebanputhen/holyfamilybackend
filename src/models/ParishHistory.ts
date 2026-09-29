import mongoose, { Schema, Document } from 'mongoose';

export interface IParishHistory extends Document {
  year: number;
  event: string;
  description: string;
  photos: string[];
  category: 'Establishment' | 'Milestone' | 'Development' | 'Historical Event' | 'Personality';
  importantPersonalities?: string[];
  documents?: Array<{ title: string; url: string }>;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ParishHistorySchema = new Schema<IParishHistory>(
  {
    year: { type: Number, required: true },
    event: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    photos: [{ type: String }],
    category: {
      type: String,
      enum: ['Establishment', 'Milestone', 'Development', 'Historical Event', 'Personality'],
      default: 'Milestone',
    },
    importantPersonalities: [{ type: String }],
    documents: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ParishHistorySchema.index({ year: 1, order: 1 });

export const ParishHistory = mongoose.model<IParishHistory>('ParishHistory', ParishHistorySchema);
