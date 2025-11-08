import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffSidebar } from '@/components/staff/staff-sidebar';
import { OrderCard } from '@/components/staff/order-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Package, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Order } from '@/types';

export function PreparerDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notes, setNotes] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [action, setAction] = useState<'start' | 'complete' | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: confirmedOrders, isLoading: confirmedLoading } = useQuery<Order[]>({
    queryKey: ['/api/staff/orders/confirmed'],
  });

  const { data: myOrders, isLoading: myOrdersLoading } = useQuery<Order[]>({
    queryKey: ['/api/staff/orders/my-orders'],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { orderId: string; status: string; notes?: string }) => {
      return await apiRequest('POST', '/api/staff/orders/update-status', data);
    },
    onSuccess: (_, variables) => {
      const statusLabels: Record<string, string> = {
        in_preparation: 'en préparation',
        ready: 'prête pour retrait',
      };
      toast({
        title: 'Commande mise à jour',
        description: `La commande est maintenant ${statusLabels[variables.status]}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/staff/orders/confirmed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/staff/orders/my-orders'] });
      setShowDialog(false);
      setSelectedOrder(null);
      setNotes('');
      setAction(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour la commande',
        variant: 'destructive',
      });
    },
  });

  const handleAction = (order: Order, actionType: 'start' | 'complete') => {
    setSelectedOrder(order);
    setAction(actionType);
    setNotes('');
    setShowDialog(true);
  };

  const handleConfirm = () => {
    if (!selectedOrder || !action) return;

    const status = action === 'start' ? 'in_preparation' : 'ready';
    updateMutation.mutate({
      orderId: selectedOrder.id,
      status,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <StaffSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Préparation des Commandes</h1>
            <p className="text-muted-foreground">
              Gérez vos commandes assignées et suivez leur préparation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Nouvelles Commandes</CardTitle>
                    <Badge variant="outline" data-testid="badge-confirmed-count">
                      {confirmedOrders?.length || 0} disponibles
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {confirmedLoading ? (
                    <div className="space-y-4">
                      {[...Array(2)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6 h-48" />
                        </Card>
                      ))}
                    </div>
                  ) : confirmedOrders && confirmedOrders.length > 0 ? (
                    confirmedOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onAction={(o) => handleAction(o, 'start')}
                        actionLabel="Commencer"
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p>Aucune nouvelle commande</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Mes Commandes en Cours</CardTitle>
                    <Badge variant="outline" className="bg-purple-500/10" data-testid="badge-my-orders-count">
                      {myOrders?.length || 0} en cours
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myOrdersLoading ? (
                    <div className="space-y-4">
                      {[...Array(2)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6 h-48" />
                        </Card>
                      ))}
                    </div>
                  ) : myOrders && myOrders.length > 0 ? (
                    myOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onAction={(o) => handleAction(o, 'complete')}
                        actionLabel="Marquer Prête"
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle2 className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p>Aucune commande en cours</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {action === 'start' ? 'Commencer la Préparation' : 'Marquer comme Prête'}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 bg-accent/30 rounded-lg space-y-2">
                <p className="font-mono font-semibold">#{selectedOrder.id.slice(0, 8)}</p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Client:</span>{' '}
                  {selectedOrder.customerName}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Articles:</span>{' '}
                  {JSON.parse(selectedOrder.items || '[]').length}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm">
                  Notes (optionnel)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajoutez des notes sur la préparation..."
                  rows={3}
                  data-testid="textarea-notes"
                />
              </div>

              {action === 'complete' && (
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Assurez-vous que tous les articles sont préparés avant de marquer
                    cette commande comme prête.
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              data-testid="button-cancel"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={updateMutation.isPending}
              data-testid="button-confirm-action"
            >
              {updateMutation.isPending ? 'Traitement...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
