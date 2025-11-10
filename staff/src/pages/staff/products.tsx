import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/image-upload';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function ProductsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ 
    name: '', 
    sku: '', 
    price: 0, 
    categoryId: '', 
    description: '',
    images: [] as string[],
    stock: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const products = useQuery<{ success: boolean; data: { items: any[] } }>({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('GET', '/api/products?limit=100')
  });

  const categories = useQuery<{ success: boolean; data: { items: any[] } }>({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('GET', '/api/categories?limit=100'),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.name || !form.sku || !form.categoryId) {
        throw new Error('Tous les champs sont requis');
      }
      if (form.images.length === 0) {
        throw new Error('Au moins une image est requise');
      }
      // Adapter le payload au schéma backend (stockQuantity attendu en base)
      const payload: any = { ...form, price: Number(form.price), stockQuantity: Number(form.stock) };
      delete payload.stock;
      if (editingId) {
        return apiRequest('PUT', `/api/products/${editingId}`, payload);
      }
      return apiRequest('POST', '/api/products', payload);
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['/api/products'] }); 
      setForm({ name: '', sku: '', price: 0, categoryId: '', description: '', images: [], stock: 0 }); 
      setEditingId(null); 
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/products'] })
  });

  if (products.isLoading || categories.isLoading) {
    return <div className="p-6">Chargement...</div>;
  }
  if (products.isError || categories.isError) {
    return <div className="p-6">Erreur de chargement des données</div>;
  }
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Produits</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 border p-4 rounded-lg">
          <Label>Nom *</Label>
          <Input 
            value={form.name} 
            onChange={e=>setForm(f=>({...f, name: e.target.value}))} 
          />
          
          <Label>SKU *</Label>
          <Input 
            value={form.sku} 
            onChange={e=>setForm(f=>({...f, sku: e.target.value}))} 
          />
          
          <Label>Prix *</Label>
          <Input 
            type="number" 
            step="0.01" 
            value={form.price} 
            onChange={e=>setForm(f=>({...f, price: parseFloat(e.target.value)}))} 
          />

          <Label>Stock</Label>
          <Input 
            type="number" 
            value={form.stock} 
            onChange={e=>setForm(f=>({...f, stock: parseInt(e.target.value)}))} 
          />
          
          <Label>Catégorie *</Label>
          <Select value={form.categoryId} onValueChange={(v)=>setForm(f=>({...f, categoryId: v}))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Choisir --" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-neutral-800">
              {(
                (Array.isArray((categories.data as any))
                  ? (categories.data as any)
                  : (((categories.data as any)?.data?.items) ?? ((categories.data as any)?.items) ?? [])) as any[]
              ).map((c: any) => (
                <SelectItem key={c._id || c.id} value={(c._id || c.id) as string}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Description</Label>
          <Input 
            value={form.description} 
            onChange={e=>setForm(f=>({...f, description: e.target.value}))} 
          />

          <ImageUpload
            value={form.images}
            onChange={(images) => setForm(f => ({ ...f, images }))}
            maxFiles={10}
            label="Images du produit"
            required
            folder="products"
          />
          
          <Button 
            onClick={()=>saveMutation.mutate()} 
            disabled={saveMutation.isPending || form.images.length === 0}
            className="w-full"
          >
            {editingId ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>

        <div className="border p-4 rounded-lg overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Image</th>
                <th className="pb-2">Nom</th>
                <th className="pb-2">SKU</th>
                <th className="pb-2">Prix</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {(
                (Array.isArray((products.data as any))
                  ? (products.data as any)
                  : (((products.data as any)?.data?.items) ?? ((products.data as any)?.items) ?? ((products.data as any)?.results) ?? [])) as any[]
              ).map((p: any) => (
                <tr key={(p._id || p.id)} className="border-b">
                  <td className="py-2">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.price} FCFA</td>
                  <td className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={()=>{ 
                        setEditingId(p._id || p.id); 
                        setForm({ 
                          name: p.name, 
                          sku: p.sku, 
                          price: p.price, 
                          categoryId: p.categoryId,
                          description: p.description || '',
                          images: p.images || [],
                          stock: (p.stockQuantity ?? p.stock ?? 0),
                        }); 
                      }}
                    >
                      Éditer
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={()=>deleteMutation.mutate(p._id || p.id)}
                    >
                      Supprimer
                    </Button>
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
