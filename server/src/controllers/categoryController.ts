import { Request, Response } from 'express';
import { z } from 'zod';
import { categoryService } from '../services/categoryService';
import { logActivity } from '../services/activity';

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  imageUrl: z.string().url().min(1, "L'image est obligatoire"),
  description: z.string().optional(),
});

export const categoryController = {
  list: async (req: Request, res: Response) => {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '20', 10);
    const data = await categoryService.list({ page, limit });
    res.json({ success: true, data });
  },
  get: async (req: Request, res: Response) => {
    const item = await categoryService.get(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: item });
  },
  create: async (req: Request, res: Response) => {
    const payload = categorySchema.parse(req.body);
    const item = await categoryService.create(payload);
    try { await logActivity({ staffId: (req as any).user?.id, staffName: (req as any).user?.email, staffRole: (req as any).user?.role, action: 'created_category', entityType: 'category', entityId: (item as any)?._id?.toString?.() || (item as any)?.id, details: `slug=${payload.slug} name=${payload.name}` }); } catch {}
    res.status(201).json({ success: true, data: item });
  },
  update: async (req: Request, res: Response) => {
    const payload = categorySchema.partial().parse(req.body);
    const item = await categoryService.update(req.params.id, payload);
    try { await logActivity({ staffId: (req as any).user?.id, staffName: (req as any).user?.email, staffRole: (req as any).user?.role, action: 'updated_category', entityType: 'category', entityId: req.params.id, details: `fields=${Object.keys(payload).join(',')}` }); } catch {}
    res.json({ success: true, data: item });
  },
  remove: async (req: Request, res: Response) => {
    await categoryService.remove(req.params.id);
    try { await logActivity({ staffId: (req as any).user?.id, staffName: (req as any).user?.email, staffRole: (req as any).user?.role, action: 'deleted_category', entityType: 'category', entityId: req.params.id }); } catch {}
    res.status(204).end();
  },
};
