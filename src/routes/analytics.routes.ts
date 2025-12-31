import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Only logged-in users can see their company stats
router.get('/', authenticate, getAnalytics);

export default router;