import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const registerSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export const authController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const { user, token } = await authService.login(email, password);
    const { passwordHash, ...safe } = (user as any).toObject ? (user as any).toObject() : user;
    res.json({ success: true, data: { user: safe, token } });
  },
  register: async (req: Request, res: Response) => {
    const { email, password } = registerSchema.parse(req.body);
    const user = await authService.register(email, password, 'customer');
    const { passwordHash, ...safe } = (user as any).toObject ? (user as any).toObject() : user;
    res.status(201).json({ success: true, data: safe });
  },
};
