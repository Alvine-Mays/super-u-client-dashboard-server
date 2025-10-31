import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StaffSidebar } from '@/components/staff/staff-sidebar';
import { OrderCard } from '@/components/staff/order-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart } from 'lucide-react';
import type { Order } from '@/types';

export function OrdersListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data: allOrders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/staff/orders/all'],
  });

  const filterOrders = (orders: Order[] | undefined, status?: string) => {
    if (!orders) return [];
    let filtered = orders;
    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerPhone.includes(searchQuery)
      );
    }
    return filtered;
  };

  const pendingOrders = filterOrders(allOrders, 'pending');
  const confirmedOrders = filterOrders(allOrders, 'confirmed');
  const inPreparationOrders = filterOrders(allOrders, 'in_preparation');
  const readyOrders = filterOrders(allOrders, 'ready');
  const completedOrders = filterOrders(allOrders, 'completed');
  const filteredAllOrders = filterOrders(allOrders);

  return (
    <div className="flex min-h-screen bg-background">
      <StaffSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Toutes les Commandes</h1>
            <p className="text-muted-foreground">
              Consultez et gérez l'ensemble des commandes
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rechercher une commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ID, nom ou téléphone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-orders"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 gap-2">
              <TabsTrigger value="all" data-testid="tab-all">
                Toutes
                <Badge variant="outline" className="ml-2">
                  {filteredAllOrders.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">
                Attente
                <Badge variant="outline" className="ml-2">
                  {pendingOrders.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="confirmed" data-testid="tab-confirmed">
                Confirmées
                <Badge variant="outline" className="ml-2">
                  {confirmedOrders.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="in_preparation" data-testid="tab-preparation">
                Préparation
                <Badge variant="outline" className="ml-2">
                  {inPreparationOrders.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="ready" data-testid="tab-ready">
                Prêtes
                <Badge variant="outline" className="ml-2">
                  {readyOrders.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" data-testid="tab-completed">
                Terminées
                <Badge variant="outline" className="ml-2">
                  {completedOrders.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6 h-64" />
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="all" className="mt-6">
                  {renderOrderGrid(filteredAllOrders)}
                </TabsContent>
                <TabsContent value="pending" className="mt-6">
                  {renderOrderGrid(pendingOrders)}
                </TabsContent>
                <TabsContent value="confirmed" className="mt-6">
                  {renderOrderGrid(confirmedOrders)}
                </TabsContent>
                <TabsContent value="in_preparation" className="mt-6">
                  {renderOrderGrid(inPreparationOrders)}
                </TabsContent>
                <TabsContent value="ready" className="mt-6">
                  {renderOrderGrid(readyOrders)}
                </TabsContent>
                <TabsContent value="completed" className="mt-6">
                  {renderOrderGrid(completedOrders)}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );

  function renderOrderGrid(orders: Order[]) {
    if (orders.length === 0) {
      return (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Aucune commande trouvée</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} showAssignment />
        ))}
      </div>
    );
  }
}
