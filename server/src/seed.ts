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
    const { getCollections } = await import('./legacy/db');

    await connectMongo();

    const adminEmail = 'admin@example.com';
    const passwordHash = await bcrypt.hash('admin123', 10);
    await UserModel.deleteMany({ email: adminEmail });
    await UserModel.create({ email: adminEmail, passwordHash, role: 'admin', status: 'active' });



    // Legacy collections for staff and pickup slots
    const { pickupSlots } = await getCollections();
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
