import { useQuery } from '@tanstack/react-query';
import { StaffSidebar } from '@/components/staff/staff-sidebar';
import { KPICard } from '@/components/staff/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  Users,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DashboardKPIs, ActivityLog } from '@/types';

export function AdminDashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery<DashboardKPIs>({
    queryKey: ['/api/staff/dashboard/kpis'],
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery<ActivityLog[]>({
    queryKey: ['/api/staff/activity/recent'],
  });

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      created_staff: 'a créé un membre du staff',
      updated_staff: 'a modifié un membre du staff',
      deleted_staff: 'a supprimé un membre du staff',
      validated_code: 'a validé un code temporaire',
      updated_order: 'a mis à jour une commande',
      completed_order: 'a terminé une commande',
      assigned_order: 'a assigné une commande',
    };
    return labels[action] || action;
  };

  // Récupère des initiales robustes même si le nom est manquant
  const getInitials = (name?: string) => {
    const safe = (name ?? 'System').toString().trim();
    if (!safe) return 'S';
    return safe
      .split(' ')
      .map((n) => n?.[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'S';
  };

  return (
    <div className="flex min-h-screen bg-background">
      <StaffSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble des performances et activités
            </p>
          </div>

          {kpisLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 h-32" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                icon={ShoppingCart}
                title="Total Commandes"
                value={kpis?.totalOrders || 0}
                trend={{ value: 12, isPositive: true }}
                testId="kpi-total-orders"
              />
              <KPICard
                icon={Clock}
                title="En Attente"
                value={kpis?.pendingOrders || 0}
                testId="kpi-pending-orders"
              />
              <KPICard
                icon={TrendingUp}
                title="En Préparation"
                value={kpis?.inPreparationOrders || 0}
                testId="kpi-in-preparation"
              />
              <KPICard
                icon={CheckCircle2}
                title="Terminées"
                value={kpis?.completedOrders || 0}
                trend={{ value: 8, isPositive: true }}
                testId="kpi-completed-orders"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Activité Récente</CardTitle>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 animate-pulse"
                      >
                        <div className="w-10 h-10 bg-accent rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-accent rounded w-3/4" />
                          <div className="h-3 bg-accent rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity && recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                          data-testid={`activity-${activity.id}`}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-accent text-xs">
                              {getInitials(activity.staffName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">
                                {activity.staffName ?? 'System'}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                {activity.staffRole}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getActionLabel(activity.action)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(activity.timestamp), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Aucune activité récente</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Staff Actif</CardTitle>
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {kpisLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-8 h-8 bg-accent rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-accent rounded w-3/4" />
                          <div className="h-2 bg-accent rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                      <div>
                        <p className="text-2xl font-bold" data-testid="text-active-staff">
                          {kpis?.activeStaff || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Membres actifs</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold" data-testid="text-total-staff">
                          {kpis?.totalStaff || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>
                    {kpis?.staffActivity && kpis.staffActivity.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Top Contributeurs</p>
                        {kpis.staffActivity.slice(0, 5).map((staff) => (
                          <div
                            key={staff.staffId}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-accent">
                                  {getInitials(staff.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{staff.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {staff.role}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {staff.actionsCount} actions
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
