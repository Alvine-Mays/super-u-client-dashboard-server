import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function StockPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ productId: '', quantity: 1, reason: '' });
  const [type, setType] = useState<'in'|'out'|'adjust'>('in');

  const products = useQuery<{ success: boolean; data: { items: any[] } }>({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('GET', '/api/products?limit=100')
  });

  const movements = useQuery<{ success: boolean; data: { items: any[] } }>({
    queryKey: ['/api/stock/movements'],
    queryFn: () => apiRequest('GET', '/api/stock/movements?limit=50')
  });

  const moveMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/stock/${type}`, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/stock/movements'] }); qc.invalidateQueries({ queryKey: ['/api/products'] }); setForm({ productId: '', quantity: 1, reason: '' }); }
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion de Stock</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Produit</Label>
          <select className="border rounded p-2" value={form.productId} onChange={e=>setForm(f=>({...f, productId: e.target.value}))}>
            <option value="">-- Choisir --</option>
            {products.data?.data.items.map(p=> (<option key={p._id} value={p._id}>{p.name} (Stock: {p.stockQuantity})</option>))}
          </select>
          <Label>Quantité</Label>
          <Input type="number" min={1} value={form.quantity} onChange={e=>setForm(f=>({...f, quantity: Number(e.target.value)}))} />
          <Label>Raison</Label>
          <Input value={form.reason} onChange={e=>setForm(f=>({...f, reason: e.target.value}))} />
          <div className="flex gap-2">
            <Button onClick={()=>{ setType('in'); moveMutation.mutate(); }}>Entrée</Button>
            <Button variant="secondary" onClick={()=>{ setType('out'); moveMutation.mutate(); }}>Sortie</Button>
            <Button variant="outline" onClick={()=>{ setType('adjust'); moveMutation.mutate(); }}>Ajuster</Button>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Mouvements récents</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left"><th>Date</th><th>Produit</th><th>Type</th><th>Qté</th><th>Raison</th></tr>
            </thead>
            <tbody>
              {movements.data?.data.items.map(m => (
                <tr key={m._id} className="border-t">
                  <td>{new Date(m.createdAt).toLocaleString()}</td>
                  <td>{m.productId}</td>
                  <td>{m.type}</td>
                  <td>{m.quantity}</td>
                  <td>{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
