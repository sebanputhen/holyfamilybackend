import mongoose, { Document } from 'mongoose';
export type GalleryCategory = 'Parish Feast' | 'Holy Mass' | 'Events' | 'Koottayma' | 'Sunday School' | 'Youth' | 'Parish Activities' | 'Historical Photos' | 'Other';
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
export declare const GalleryAlbum: mongoose.Model<IGalleryAlbum, {}, {}, {}, mongoose.Document<unknown, {}, IGalleryAlbum, {}, {}> & IGalleryAlbum & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
