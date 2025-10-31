import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function ProductsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', sku: '', price: 0, categoryId: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const products = useQuery<{ success: boolean; data: { items: any[]; total: number } }>({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('GET', '/api/products?limit=100')
  });

  const categories = useQuery<{ success: boolean; data: { items: any[] } }>({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('GET', '/api/categories?limit=100')
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) return apiRequest('PUT', `/api/products/${editingId}`, { ...form, price: Number(form.price) });
      return apiRequest('POST', '/api/products', { ...form, price: Number(form.price) });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/products'] }); setForm({ name: '', sku: '', price: 0, categoryId: '' }); setEditingId(null); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/products'] })
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Produits</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Nom</Label>
          <Input value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} />
          <Label>SKU</Label>
          <Input value={form.sku} onChange={e=>setForm(f=>({...f, sku: e.target.value}))} />
          <Label>Prix</Label>
          <Input type="number" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f, price: Number(e.target.value)}))} />
          <Label>Catégorie</Label>
          <select className="border rounded p-2" value={form.categoryId} onChange={e=>setForm(f=>({...f, categoryId: e.target.value}))}>
            <option value="">-- Choisir --</option>
            {categories.data?.data.items.map(c=> (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
          <Button onClick={()=>saveMutation.mutate()}>{editingId ? 'Mettre à jour' : 'Créer'}</Button>
        </div>

        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left"><th>Nom</th><th>SKU</th><th>Prix</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {products.data?.data.items.map(p => (
                <tr key={p._id} className="border-t">
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.price}</td>
                  <td>
  {p.stockQuantity}
  {p.stockQuantity < 5 && (
    <Badge variant="destructive" className="ml-2">Stock faible</Badge>
  )}
</td>
                  <td className="space-x-2">
                    <Button variant="outline" size="sm" onClick={()=>{ setEditingId(p._id); setForm({ name: p.name, sku: p.sku, price: p.price, categoryId: p.categoryId }); }}>Éditer</Button>
                    <Button variant="destructive" size="sm" onClick={()=>deleteMutation.mutate(p._id)}>Supprimer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
