import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyReading extends Document {
  date: string; // ISO date string YYYY-MM-DD for easy lookup
  feastOfTheDay: { en: string; ml: string };
  saintOfTheDay: { en: string; ml: string };
  firstReading: {
    reference: string;
    text: { en: string; ml: string };
  };
  psalm: {
    reference: string;
    text: { en: string; ml: string };
    response: { en: string; ml: string };
  };
  secondReading?: {
    reference: string;
    text: { en: string; ml: string };
  };
  gospel: {
    reference: string;
    text: { en: string; ml: string };
  };
  prayerOfTheDay: { en: string; ml: string };
  parishPrayer: { en: string; ml: string };
  specialPrayers?: Array<{
    title: { en: string; ml: string };
    text: { en: string; ml: string };
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const DailyReadingSchema = new Schema<IDailyReading>(
  {
    date: { type: String, required: true, unique: true, index: true },
    feastOfTheDay: {
      en: { type: String, default: '' },
      ml: { type: String, default: '' },
    },
    saintOfTheDay: {
      en: { type: String, default: '' },
      ml: { type: String, default: '' },
    },
    firstReading: {
      reference: { type: String, required: true },
      text: {
        en: { type: String, required: true },
        ml: { type: String, required: true },
      },
    },
    psalm: {
      reference: { type: String, required: true },
      text: {
        en: { type: String, required: true },
        ml: { type: String, required: true },
      },
      response: {
        en: { type: String, required: true },
        ml: { type: String, required: true },
      },
    },
    secondReading: {
      reference: { type: String, default: '' },
      text: {
        en: { type: String, default: '' },
        ml: { type: String, default: '' },
      },
    },
    gospel: {
      reference: { type: String, required: true },
      text: {
        en: { type: String, required: true },
        ml: { type: String, required: true },
      },
    },
    prayerOfTheDay: {
      en: { type: String, default: '' },
      ml: { type: String, default: '' },
    },
    parishPrayer: {
      en: { type: String, default: '' },
      ml: { type: String, default: '' },
    },
    specialPrayers: [
      {
        title: { en: String, ml: String },
        text: { en: String, ml: String },
      },
    ],
  },
  { timestamps: true }
);

export const DailyReading = mongoose.model<IDailyReading>('DailyReading', DailyReadingSchema);
