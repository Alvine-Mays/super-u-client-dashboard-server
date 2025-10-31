import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffSidebar } from '@/components/staff/staff-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, CheckCircle2, XCircle, Phone, User, Package } from 'lucide-react';
import type { Order } from '@/types';

export function CashierValidatePage() {
  const [temporaryCode, setTemporaryCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingOrders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/staff/orders/pending'],
  });

  const validateMutation = useMutation({
    mutationFn: async (data: { orderId: string; temporaryCode: string }) => {
      return await apiRequest('POST', '/api/staff/validate-code', data);
    },
    onSuccess: (data) => {
      toast({
        title: 'Code validé',
        description: `Code final généré: ${data.finalCode}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/staff/orders/pending'] });
      setTemporaryCode('');
      setSelectedOrder(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Code invalide',
        variant: 'destructive',
      });
    },
  });

  const handleValidate = () => {
    if (!selectedOrder || !temporaryCode || temporaryCode.length !== 6) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une commande et saisir un code à 6 chiffres',
        variant: 'destructive',
      });
      return;
    }

    validateMutation.mutate({
      orderId: selectedOrder.id,
      temporaryCode,
    });
  };

  const items = selectedOrder ? JSON.parse(selectedOrder.items || '[]') : [];

  return (
    <div className="flex min-h-screen bg-background">
      <StaffSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Validation des Codes</h1>
            <p className="text-muted-foreground">
              Vérifiez et validez les codes temporaires des clients
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commandes en Attente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 bg-accent rounded-lg animate-pulse h-24" />
                    ))}
                  </div>
                ) : pendingOrders && pendingOrders.length > 0 ? (
                  pendingOrders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all hover-elevate ${
                        selectedOrder?.id === order.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                      data-testid={`button-select-order-${order.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono font-semibold text-sm">
                          #{order.id.slice(0, 8)}
                        </span>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          En attente
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-3 opacity-50" />
                    <p>Aucune commande en attente</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <KeyRound className="w-5 h-5" />
                  Validation du Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedOrder ? (
                  <>
                    <Alert>
                      <AlertDescription>
                        Commande sélectionnée: <strong>#{selectedOrder.id.slice(0, 8)}</strong>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{selectedOrder.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{selectedOrder.customerPhone}</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Package className="w-4 h-4" />
                          <span>Articles ({items.length})</span>
                        </div>
                        <ul className="text-xs space-y-1 pl-6">
                          {items.map((item: any, idx: number) => (
                            <li key={idx} className="text-muted-foreground">
                              {item.quantity}x {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-lg font-bold">
                          {selectedOrder.totalAmount.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-sm font-medium">
                        Code Temporaire (6 chiffres)
                      </Label>
                      <Input
                        id="code"
                        type="text"
                        maxLength={6}
                        value={temporaryCode}
                        onChange={(e) => setTemporaryCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="text-center text-2xl font-mono tracking-wider"
                        data-testid="input-temporary-code"
                      />
                      <p className="text-xs text-muted-foreground">
                        Demandez au client de vous communiquer le code reçu par SMS
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleValidate}
                      disabled={temporaryCode.length !== 6 || validateMutation.isPending}
                      data-testid="button-validate-code"
                    >
                      {validateMutation.isPending ? (
                        'Validation...'
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Valider et Générer Code Final
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <KeyRound className="w-16 h-16 mx-auto mb-3 opacity-50" />
                    <p>Sélectionnez une commande pour valider le code</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
