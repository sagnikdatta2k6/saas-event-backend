import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';

const router = Router();

// LINE 8: "validate(registerSchema)" MUST be here
router.post('/register', validate(registerSchema), register);

// LINE 11: "validate(loginSchema)" MUST be here
router.post('/login', validate(loginSchema), login);

export default router;