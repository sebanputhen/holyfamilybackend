"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlbums = getAlbums;
exports.getAlbumById = getAlbumById;
exports.createAlbum = createAlbum;
exports.addItemToAlbum = addItemToAlbum;
exports.deleteAlbum = deleteAlbum;
const Gallery_1 = require("../models/Gallery");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getAlbums(req, res) {
    try {
        const { category } = req.query;
        const query = { isPublic: true };
        if (category)
            query.category = category;
        const albums = await Gallery_1.GalleryAlbum.find(query).sort({ order: 1, eventDate: -1, createdAt: -1 });
        (0, response_1.sendSuccess)(res, albums, 'Gallery albums retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_ALBUMS_FAILED', 500);
    }
}
async function getAlbumById(req, res) {
    try {
        const { id } = req.params;
        const album = await Gallery_1.GalleryAlbum.findById(id);
        if (!album) {
            (0, response_1.sendError)(res, 'Gallery album not found', 'NOT_FOUND', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, album, 'Gallery album details retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_ALBUM_FAILED', 500);
    }
}
async function createAlbum(req, res) {
    try {
        const { title, category, coverImageUrl } = req.body;
        if (!title || !category || !coverImageUrl) {
            (0, response_1.sendError)(res, 'Title, category, and cover image are required', 'BAD_REQUEST', 400);
            return;
        }
        const album = await Gallery_1.GalleryAlbum.create(req.body);
        await (0, auditService_1.logAudit)(req, 'Created Gallery Album', 'GalleryAlbum', album._id.toString(), `Title: ${album.title}`);
        (0, response_1.sendSuccess)(res, album, 'Gallery album created', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_ALBUM_FAILED', 500);
    }
}
async function addItemToAlbum(req, res) {
    try {
        const { id } = req.params;
        const { title, url, mediaType, caption } = req.body;
        const album = await Gallery_1.GalleryAlbum.findById(id);
        if (!album) {
            (0, response_1.sendError)(res, 'Album not found', 'NOT_FOUND', 404);
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
        await (0, auditService_1.logAudit)(req, 'Added Item to Gallery Album', 'GalleryAlbum', album._id.toString(), `Item: ${title}`);
        (0, response_1.sendSuccess)(res, album, 'Media item added to album');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'ADD_GALLERY_ITEM_FAILED', 500);
    }
}
async function deleteAlbum(req, res) {
    try {
        const { id } = req.params;
        const album = await Gallery_1.GalleryAlbum.findById(id);
        if (!album) {
            (0, response_1.sendError)(res, 'Album not found', 'NOT_FOUND', 404);
            return;
        }
        await Gallery_1.GalleryAlbum.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Gallery Album', 'GalleryAlbum', id, `Title: ${album.title}`);
        (0, response_1.sendSuccess)(res, null, 'Gallery album deleted');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_ALBUM_FAILED', 500);
    }
}
