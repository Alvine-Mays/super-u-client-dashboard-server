import type { Express, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getCollections } from '../legacy/db';

export async function mountDevRoutes(app: Express) {
  if (process.env.NODE_ENV === 'production') return;
  app.post('/api/dev/bootstrap', async (_req: Request, res: Response) => {
    try {
      const { categories, products, pickupSlots, staff } = await getCollections();
      const now = new Date().toISOString();
      const passwordHash = await bcrypt.hash('admin123', 10);
      // Ensure one category
      let cat = await categories.findOne({ slug: 'boissons' });
      if (!cat) {
        await categories.insertOne({ name: 'Boissons', slug: 'boissons', productCount: 0 });
        cat = await categories.findOne({ slug: 'boissons' });
      }
      // Ensure products
      const pcount = await products.countDocuments({});
      if (pcount === 0) {
        await products.insertMany([
          { name: 'Eau minérale', sku: 'SKU-001', price: 1.5, images: [], stock: 20, categoryId: cat!._id.toString(), isActive: true, createdAt: now },
          { name: 'Chips', sku: 'SKU-002', price: 2.0, images: [], stock: 15, categoryId: cat!._id.toString(), isActive: true, createdAt: now },
        ] as any[]);
      }
      // Ensure pickup slot (today)
      const dateStr = new Date().toISOString().split('T')[0];
      const slot = await pickupSlots.findOne({ date: dateStr }) || await (async ()=>{ await pickupSlots.insertOne({ date: dateStr, timeFrom: '09:00', timeTo: '11:00', capacity: 50, remaining: 50, isActive: true }); return pickupSlots.findOne({ date: dateStr }); })();
      // Ensure staff admin
      const st = await staff.findOne({ email: 'admin@example.com' }) || await (async ()=>{ await staff.insertOne({ name: 'Admin', email: 'admin@example.com', password: passwordHash, role: 'admin', isActive: true, createdAt: now }); return staff.findOne({ email: 'admin@example.com' }); })();
      const outProducts = await products.find({}).limit(5).toArray();
      res.json({ ok: true, slot, staff: { ...st, password: undefined }, products: outProducts.map(p=>({ id: p._id.toString(), name: p.name, price: p.price, stock: p.stock })) });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'bootstrap failed' });
    }
  });
}
