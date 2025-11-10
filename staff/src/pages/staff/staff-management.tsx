import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffSidebar } from '@/components/staff/staff-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Edit, Trash2, Search, Mail, Phone, User, Shield } from 'lucide-react';
import type { Staff } from '@/types';

const createStaffSchema = z.object({
  name: z.string().min(2, 'Nom requis (min 2 caractères)'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  role: z.enum(['caissier', 'preparateur'], {
    required_error: 'Rôle requis',
  }),
  password: z.string().min(6, 'Mot de passe min 6 caractères'),
});

type CreateStaffFormData = z.infer<typeof createStaffSchema>;

export function StaffManagementPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'caissier',
      password: '',
    },
  });

  const { data: staffList, isLoading } = useQuery<Staff[]>({
    queryKey: ['/api/staff/list'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateStaffFormData) => {
      return await apiRequest('POST', '/api/staff/create', data);
    },
    onSuccess: () => {
      toast({
        title: 'Staff créé',
        description: 'Le membre du staff a été créé avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/staff/list'] });
      setShowCreateDialog(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de créer le staff',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (staffId: string) => {
      return await apiRequest('DELETE', `/api/staff/${staffId}`, {});
    },
    onSuccess: () => {
      toast({
        title: 'Staff supprimé',
        description: 'Le membre du staff a été supprimé',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/staff/list'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer le staff',
        variant: 'destructive',
      });
    },
  });

  const filteredStaff = staffList?.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name?: string) => {
    const safe = (name ?? 'S').toString().trim();
    if (!safe) return 'S';
    return safe
      .split(' ')
      .map((n) => n?.[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'S';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrateur',
      caissier: 'Caissier',
      preparateur: 'Préparateur',
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-primary text-primary-foreground',
      caissier: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      preparateur: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[role as keyof typeof colors] || '';
  };

  const handleSubmit = (data: CreateStaffFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <StaffSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestion du Staff</h1>
              <p className="text-muted-foreground">
                Créez et gérez les membres de votre équipe
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-staff">
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter Staff
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rechercher Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-staff"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Membres du Staff</CardTitle>
                <Badge variant="outline" data-testid="badge-staff-count">
                  {filteredStaff?.length || 0} membres
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg animate-pulse">
                      <div className="w-12 h-12 bg-accent rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-accent rounded w-1/3" />
                        <div className="h-3 bg-accent rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredStaff && filteredStaff.length > 0 ? (
                <div className="space-y-3">
                  {filteredStaff.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover-elevate transition-all"
                      data-testid={`staff-item-${staff.id}`}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-accent text-lg">
                          {getInitials(staff.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{staff.name}</h3>
                          <Badge className={getRoleColor(staff.role)}>
                            {getRoleLabel(staff.role)}
                          </Badge>
                          {!staff.isActive && (
                            <Badge variant="outline" className="text-red-500">
                              Inactif
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{staff.email}</span>
                          </div>
                          {staff.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {staff.role !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Êtes-vous sûr de vouloir supprimer ce membre?')) {
                                deleteMutation.mutate(staff.id);
                              }
                            }}
                            data-testid={`button-delete-${staff.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p>Aucun membre trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un Nouveau Staff</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom Complet</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Jean Dupont"
                  className="pl-10"
                  data-testid="input-staff-name"
                  {...form.register('name')}
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jean.dupont@super-u.cg"
                  className="pl-10"
                  data-testid="input-staff-email"
                  {...form.register('email')}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone (optionnel)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+242 06 123 45 67"
                  className="pl-10"
                  data-testid="input-staff-phone"
                  {...form.register('phone')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={form.watch('role')}
                onValueChange={(value) => form.setValue('role', value as 'caissier' | 'preparateur')}
              >
                <SelectTrigger data-testid="select-staff-role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caissier">Caissier</SelectItem>
                  <SelectItem value="preparateur">Préparateur</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-xs text-destructive">{form.formState.errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de Passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                data-testid="input-staff-password"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                data-testid="button-submit-staff"
              >
                {createMutation.isPending ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
