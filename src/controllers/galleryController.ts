import { Request, Response } from 'express';
import { GalleryAlbum } from '../models/Gallery';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getAlbums(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.query;
    const query: any = { isPublic: true };
    if (category) query.category = category;

    const albums = await GalleryAlbum.find(query).sort({ order: 1, eventDate: -1, createdAt: -1 });
    sendSuccess(res, albums, 'Gallery albums retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_ALBUMS_FAILED', 500);
  }
}

export async function getAlbumById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const album = await GalleryAlbum.findById(id);
    if (!album) {
      sendError(res, 'Gallery album not found', 'NOT_FOUND', 404);
      return;
    }
    sendSuccess(res, album, 'Gallery album details retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_ALBUM_FAILED', 500);
  }
}

export async function createAlbum(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { title, category, coverImageUrl } = req.body;
    if (!title || !category || !coverImageUrl) {
      sendError(res, 'Title, category, and cover image are required', 'BAD_REQUEST', 400);
      return;
    }

    const album = await GalleryAlbum.create(req.body);

    await logAudit(
      req,
      'Created Gallery Album',
      'GalleryAlbum',
      album._id.toString(),
      `Title: ${album.title}`
    );

    sendSuccess(res, album, 'Gallery album created', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_ALBUM_FAILED', 500);
  }
}

export async function addItemToAlbum(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, url, mediaType, caption } = req.body;

    const album = await GalleryAlbum.findById(id);
    if (!album) {
      sendError(res, 'Album not found', 'NOT_FOUND', 404);
      return;
    }

    album.items.push({
      title: title || 'Parish Photo',
      url,
      mediaType: mediaType || 'image',
      caption: caption || '',
      uploadedAt: new Date(),
    });

    await album.save();

    await logAudit(
      req,
      'Added Item to Gallery Album',
      'GalleryAlbum',
      album._id.toString(),
      `Item: ${title}`
    );

    sendSuccess(res, album, 'Media item added to album');
  } catch (err: any) {
    sendError(res, err.message, 'ADD_GALLERY_ITEM_FAILED', 500);
  }
}

export async function deleteAlbum(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const album = await GalleryAlbum.findById(id);
    if (!album) {
      sendError(res, 'Album not found', 'NOT_FOUND', 404);
      return;
    }

    await GalleryAlbum.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Gallery Album',
      'GalleryAlbum',
      id,
      `Title: ${album.title}`
    );

    sendSuccess(res, null, 'Gallery album deleted');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_ALBUM_FAILED', 500);
  }
}
