import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = useQuery<{ success: boolean; data: { items: any[] } }>({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('GET', '/api/categories?limit=100')
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) return apiRequest('PUT', `/api/categories/${editingId}`, form);
      return apiRequest('POST', '/api/categories', form);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/categories'] }); setForm({ name: '', slug: '', description: '' }); setEditingId(null); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/categories'] })
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Catégories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Nom</Label>
          <Input value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} />
          <Label>Slug</Label>
          <Input value={form.slug} onChange={e=>setForm(f=>({...f, slug: e.target.value}))} />
          <Label>Description</Label>
          <Input value={form.description} onChange={e=>setForm(f=>({...f, description: e.target.value}))} />
          <Button onClick={()=>saveMutation.mutate()}>{editingId ? 'Mettre à jour' : 'Créer'}</Button>
        </div>

        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left"><th>Nom</th><th>Slug</th><th></th></tr>
            </thead>
            <tbody>
              {categories.data?.data.items.map(c => (
                <tr key={c._id} className="border-t">
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td className="space-x-2">
                    <Button variant="outline" size="sm" onClick={()=>{ setEditingId(c._id); setForm({ name: c.name, slug: c.slug, description: c.description || '' }); }}>Éditer</Button>
                    <Button variant="destructive" size="sm" onClick={()=>deleteMutation.mutate(c._id)}>Supprimer</Button>
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
