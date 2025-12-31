import { Router } from 'express';
import { createEvent, getEvents } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware'; // Import the guard

const router = Router();

// PUBLIC ROUTE: Anyone can see events
router.get('/', authenticate, getEvents);

// PROTECTED ROUTE: Only logged-in users can create events
// We put 'authenticate' before 'createEvent' to block unauthorized users
router.post('/', authenticate, createEvent);

export default router;