import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function StockPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ productId: '', quantity: 1, reason: '' });
  const canSubmit = Boolean(form.productId && form.quantity > 0 && form.reason.trim().length > 0);
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

  if (products.isLoading || movements.isLoading) {
    return <div className="p-6">Chargement...</div>;
  }
  if (products.isError || movements.isError) {
    return <div className="p-6">Erreur de chargement des données</div>;
  }
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion de Stock</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Produit</Label>
          <Select value={form.productId} onValueChange={(v)=>setForm(f=>({...f, productId: v}))}>
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="-- Choisir --" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-neutral-800">
              {(
                (Array.isArray((products.data as any))
                  ? (products.data as any)
                  : (((products.data as any)?.data?.items) ?? ((products.data as any)?.items) ?? ((products.data as any)?.results) ?? [])) as any[]
              ).map((p: any)=> (
                <SelectItem key={(p._id || p.id)} value={(p._id || p.id) as string}>
                  {p.name} (Stock: {p.stockQuantity ?? p.stock ?? 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label>Quantité</Label>
          <Input type="number" min={1} value={form.quantity} onChange={e=>setForm(f=>({...f, quantity: Number(e.target.value)}))} />
          <Label>Raison</Label>
          <Input placeholder="Raison (obligatoire)" value={form.reason} onChange={e=>setForm(f=>({...f, reason: e.target.value}))} />
          <div className="flex gap-2">
            <Button disabled={!canSubmit || moveMutation.isPending} onClick={()=>{ setType('in'); moveMutation.mutate(); }}>Entrée</Button>
            <Button disabled={!canSubmit || moveMutation.isPending} variant="secondary" onClick={()=>{ setType('out'); moveMutation.mutate(); }}>Sortie</Button>
            <Button disabled={!canSubmit || moveMutation.isPending} variant="outline" onClick={()=>{ setType('adjust'); moveMutation.mutate(); }}>Ajuster</Button>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Mouvements récents</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left"><th>Date</th><th>Produit</th><th>Type</th><th>Qté</th><th>Raison</th></tr>
            </thead>
            <tbody>
              {(
                (Array.isArray((movements.data as any))
                  ? (movements.data as any)
                  : (((movements.data as any)?.data?.items) ?? ((movements.data as any)?.items) ?? ((movements.data as any)?.results) ?? [])) as any[]
              ).map((m: any) => (
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
