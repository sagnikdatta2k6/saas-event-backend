import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if the body matches the rules
    schema.parse(req.body);
    next();
  } catch (error: any) {
    // If invalid, return 400 with the error details
    res.status(400).json({ 
      message: 'Validation Error', 
      errors: error.errors 
    });
  }
};