import { z } from 'zod';

// Schema for Registering (User + Org)
export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  orgName: z.string().min(2, { message: "Organization name is required" })
});

// Schema for Login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});