import { Router } from 'express';
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  addItemToAlbum,
  deleteAlbum,
} from '../controllers/galleryController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', getAlbums);
router.get('/:id', getAlbumById);

router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), createAlbum);
router.post('/:id/items', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), addItemToAlbum);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), deleteAlbum);

export default router;
