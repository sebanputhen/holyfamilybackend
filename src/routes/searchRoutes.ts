import { Router } from 'express';
import { globalSearch } from '../controllers/searchController';
import { optionalAuthenticate } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuthenticate, globalSearch);

export default router;
