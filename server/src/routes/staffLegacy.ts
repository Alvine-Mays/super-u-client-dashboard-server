import type { Express, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { randomBytes } from 'crypto';
import { getCollections } from '../legacy/db';
import { authJWT, requireRole } from '../middlewares/authJWT';

export async function mountStaffRoutes(app: Express) {
  const { staff, orders, activityLogs } = await getCollections();

  app.post('/api/staff/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Données invalides' });
      const st = await staff.findOne({ email });
      if (!st) return res.status(401).json({ message: 'Email ou mot de passe invalide' });
      if (st.isActive === false) return res.status(401).json({ message: 'Compte désactivé' });
      const ok = await bcrypt.compare(password, st.password);
      if (!ok) return res.status(401).json({ message: 'Email ou mot de passe invalide' });
      const { password: _pw, ...safe } = st as any;
      await activityLogs.insertOne({ staffId: (st as any).id ?? st._id.toString(), staffName: (st as any).name, staffRole: (st as any).role, action: 'logged_in', entityType: 'auth', entityId: ((st as any).id ?? st._id.toString()), timestamp: new Date().toISOString() });
      res.json({ staff: { ...safe, id: st._id.toString() } });
    } catch (e) { res.status(500).json({ message: 'Erreur serveur' }); }
  });

  // Step 1: preparateur/admin validate temporary code and generate final code
  app.post('/api/staff/validate-code', authJWT, requireRole('preparateur','admin'), async (req: Request, res: Response) => {
    try {
      const { orderId, temporaryCode } = req.body;
      if (!orderId || !temporaryCode) return res.status(400).json({ message: 'Données invalides' });
      let oid: ObjectId; try { oid = new ObjectId(orderId); } catch { return res.status(400).json({ message: 'Identifiant commande invalide' }); }
      const order = await orders.findOne({ _id: oid });
      if (!order) return res.status(404).json({ message: 'Commande introuvable' });
      if (order.tempPickupCode !== temporaryCode) return res.status(400).json({ message: 'Code temporaire invalide' });
      const finalCode = randomBytes(4).toString('hex').toUpperCase();
      await orders.updateOne({ _id: order._id }, { $set: { status: 'confirmed', finalPickupCode: finalCode, codeValidatedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
      await activityLogs.insertOne({ staffId: 'system', action: 'validated_code', entityType: 'order', entityId: orderId, timestamp: new Date().toISOString(), details: `Code final: ${finalCode}` });
      const { notifyFinalCode } = await import('../services/notify');
      await notifyFinalCode((order as any).customerEmail, (order as any).customerPhone, finalCode, (order as any).orderNumber);
      res.json({ finalCode });
    } catch (e:any) { console.error('validate-code error', e); res.status(500).json({ message: 'Erreur serveur' }); }
  });

  // Step 2: caissier/admin verify final code to complete pickup
  app.post('/api/staff/verify-final-code', authJWT, requireRole('caissier','admin'), async (req: Request, res: Response) => {
    try {
      const { orderId, finalCode } = req.body;
      if (!orderId || !finalCode) return res.status(400).json({ message: 'Données invalides' });
      let oid: ObjectId; try { oid = new ObjectId(orderId); } catch { return res.status(400).json({ message: 'Identifiant commande invalide' }); }
      const order = await orders.findOne({ _id: oid });
      if (!order) return res.status(404).json({ message: 'Commande introuvable' });
      if (order.finalPickupCode !== finalCode) return res.status(400).json({ message: 'Code final invalide' });
      await orders.updateOne({ _id: oid }, { $set: { status: 'completed', pickedUpAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
      await activityLogs.insertOne({ staffId: 'system', action: 'completed_order', entityType: 'order', entityId: orderId, timestamp: new Date().toISOString(), details: `Retrait validé` });
      res.json({ message: 'Pickup completed' });
    } catch (e:any) { console.error('verify-final-code error', e); res.status(500).json({ message: 'Erreur serveur' }); }
  });
}
