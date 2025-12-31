import { Router } from 'express';
import { createAnnouncement } from '../controllers/announcement.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Only logged-in users (Admins) can post announcements
router.post('/', authenticate, createAnnouncement);

export default router;