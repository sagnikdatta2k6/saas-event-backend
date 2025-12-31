import { Router } from 'express';
import { bookTicket } from '../controllers/ticket.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Only logged-in users can buy tickets
router.post('/book', authenticate, bookTicket);

export default router;