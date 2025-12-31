import { Router } from 'express';
import { registerTeam } from '../controllers/team.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Create a team
router.post('/register', authenticate, registerTeam);

export default router;