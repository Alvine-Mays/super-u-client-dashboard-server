import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/image-upload';
import { useState } from 'react';

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ 
    name: '', 
    slug: '', 
    description: '',
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = useQuery<{ success: boolean; data: { items: any[] } }>({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('GET', '/api/categories?limit=100')
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.name || !form.slug) {
        throw new Error('Nom et slug sont requis');
      }
      if (!form.imageUrl) {
        throw new Error("L'image est requise");
      }
      if (editingId) {
        return apiRequest('PUT', `/api/categories/${editingId}`, form);
      }
      return apiRequest('POST', '/api/categories', form);
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['/api/categories'] }); 
      setForm({ name: '', slug: '', description: '', imageUrl: '' }); 
      setEditingId(null); 
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/categories'] })
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Catégories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 border p-4 rounded-lg">
          <Label>Nom *</Label>
          <Input value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} />
          
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={e=>setForm(f=>({...f, slug: e.target.value}))} />
          
          <Label>Description</Label>
          <Input value={form.description} onChange={e=>setForm(f=>({...f, description: e.target.value}))} />
          
          <ImageUpload
            value={form.imageUrl ? [form.imageUrl] : []}
            onChange={(urls) => setForm(f => ({ ...f, imageUrl: urls[0] || '' }))}
            maxFiles={1}
            label="Image de la catégorie"
            required
            folder="categories"
          />

          <Button 
            onClick={()=>saveMutation.mutate()} 
            disabled={saveMutation.isPending || !form.imageUrl}
            className="w-full"
          >
            {editingId ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>

        <div className="border p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Image</th>
                <th className="pb-2">Nom</th>
                <th className="pb-2">Slug</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {categories.data?.data.items.map(c => (
                <tr key={c._id} className="border-b">
                  <td className="py-2">
                    {c.imageUrl && (
                      <img src={c.imageUrl} alt={c.name} className="w-12 h-12 object-cover rounded" />
                    )}
                  </td>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={()=>{ 
                        setEditingId(c._id); 
                        setForm({ 
                          name: c.name, 
                          slug: c.slug, 
                          description: c.description || '',
                          imageUrl: c.imageUrl || '',
                        }); 
                      }}
                    >
                      Éditer
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={()=>deleteMutation.mutate(c._id)}
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
