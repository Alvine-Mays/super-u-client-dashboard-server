import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepo } from '../repositories/userRepo';
import { env } from '../config/env';

export const authService = {
  async register(email: string, password: string, role: 'customer' | 'staff' | 'admin' = 'customer') {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error('Email already in use');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepo.create({ email, passwordHash, role, status: 'active' });
    return user;
  },
  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    if (user.status !== 'active') throw new Error('Account disabled');
    const ok = await bcrypt.compare(password, (user as any).passwordHash);
    if (!ok) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: (user as any)._id.toString(), email: user.email, role: (user as any).role }, env.jwtSecret, { expiresIn: '1d' });
    return { user, token };
  },
};
