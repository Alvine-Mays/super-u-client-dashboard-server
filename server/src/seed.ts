import 'dotenv/config';
import bcrypt from 'bcryptjs';

async function run() {
  let mem: any = null;
  try {
    if (!process.env.MONGO_URI) {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mem = await MongoMemoryServer.create();
      process.env.MONGO_URI = mem.getUri();
      console.log(`[seed] Using in-memory MongoDB at ${process.env.MONGO_URI}`);
    }

    const { connectMongo } = await import('./config/mongo');
    const { UserModel } = await import('./models/User');
    const { CategoryModel } = await import('./models/Category');
    const { ProductModel } = await import('./models/Product');
    const { getCollections } = await import('./legacy/db');

    await connectMongo();

    const adminEmail = 'admin@example.com';
    const passwordHash = await bcrypt.hash('admin123', 10);
    await UserModel.deleteMany({ email: adminEmail });
    await UserModel.create({ email: adminEmail, passwordHash, role: 'admin', status: 'active' });

    await CategoryModel.deleteMany({});
    const cat1 = await CategoryModel.create({ name: 'Boissons', slug: 'boissons', description: 'Boissons et rafraîchissements' });
    const cat2 = await CategoryModel.create({ name: 'Snacks', slug: 'snacks', description: 'Snacks et gourmandises' });

    await ProductModel.deleteMany({});
    await ProductModel.create({ name: 'Eau minérale', sku: 'SKU-001', price: 1.5, categoryId: (cat1 as any)._id, stockQuantity: 20, images: [], status: 'active' });
    await ProductModel.create({ name: 'Chips', sku: 'SKU-002', price: 2.0, categoryId: (cat2 as any)._id, stockQuantity: 15, images: [], status: 'active' });

    // Legacy collections for staff and pickup slots
    const { staff, pickupSlots } = await getCollections();
    await staff.deleteMany({ email: adminEmail });
    await staff.insertOne({ name: 'Admin', email: adminEmail, password: passwordHash, role: 'admin', isActive: true, createdAt: new Date().toISOString() });

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    await pickupSlots.deleteMany({ date: dateStr });
    await pickupSlots.insertOne({ date: dateStr, timeFrom: '09:00', timeTo: '11:00', capacity: 50, remaining: 50, isActive: true });

    console.log('Seed completed. Admin: admin@example.com / admin123');
  } finally {
    if (mem) {
      await mem.stop();
      console.log('[seed] In-memory MongoDB stopped');
    }
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
