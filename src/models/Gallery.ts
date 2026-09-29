import mongoose, { Schema, Document } from 'mongoose';

export type GalleryCategory =
  | 'Parish Feast'
  | 'Holy Mass'
  | 'Events'
  | 'Koottayma'
  | 'Sunday School'
  | 'Youth'
  | 'Parish Activities'
  | 'Historical Photos'
  | 'Other';

export interface IGalleryItem {
  _id?: mongoose.Types.ObjectId;
  title: string;
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  uploadedAt: Date;
}

export interface IGalleryAlbum extends Document {
  title: string;
  description?: string;
  category: GalleryCategory;
  coverImageUrl: string;
  eventDate?: Date;
  items: IGalleryItem[];
  isPublic: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>({
  title: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  caption: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now },
});

const GalleryAlbumSchema = new Schema<IGalleryAlbum>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: [
        'Parish Feast',
        'Holy Mass',
        'Events',
        'Koottayma',
        'Sunday School',
        'Youth',
        'Parish Activities',
        'Historical Photos',
        'Other',
      ],
      default: 'Parish Activities',
    },
    coverImageUrl: { type: String, required: true },
    eventDate: { type: Date, default: Date.now },
    items: [GalleryItemSchema],
    isPublic: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GalleryAlbumSchema.index({ category: 1, order: 1 });

export const GalleryAlbum = mongoose.model<IGalleryAlbum>('GalleryAlbum', GalleryAlbumSchema);
