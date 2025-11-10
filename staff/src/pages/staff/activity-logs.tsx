import { useQuery } from '@tanstack/react-query';
import { StaffSidebar } from '@/components/staff/staff-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity, Search } from 'lucide-react';
import type { ActivityLog } from '@/types';

export function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: activities, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['/api/staff/activity/all'],
  });

  // Initiales robustes même si le nom est manquant
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

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      created_staff: 'a créé un membre du staff',
      updated_staff: 'a modifié un membre du staff',
      deleted_staff: 'a supprimé un membre du staff',
      validated_code: 'a validé un code temporaire',
      updated_order: 'a mis à jour une commande',
      completed_order: 'a terminé une commande',
      assigned_order: 'a assigné une commande',
      started_preparation: 'a commencé la préparation',
      marked_ready: 'a marqué une commande comme prête',
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      created_staff: 'bg-green-500/20 text-green-400 border-green-500/30',
      deleted_staff: 'bg-red-500/20 text-red-400 border-red-500/30',
      validated_code: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed_order: 'bg-green-500/20 text-green-400 border-green-500/30',
      updated_order: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return colors[action] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const filteredActivities = activities?.filter(
    (activity) =>
      (activity.staffName ?? 'System').toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedByDate = filteredActivities?.reduce((acc, activity) => {
    const date = format(new Date(activity.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, ActivityLog[]>);

  return (
    <div className="flex min-h-screen bg-background">
      <StaffSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Journal d'Activité</h1>
            <p className="text-muted-foreground">
              Suivez toutes les actions effectuées par le staff
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rechercher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-activity"
                />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-accent rounded w-3/4" />
                          <div className="h-3 bg-accent rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : groupedByDate && Object.keys(groupedByDate).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedByDate)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([date, logs]) => (
                  <Card key={date}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {logs.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                            data-testid={`activity-${activity.id}`}
                          >
                            <Avatar className="h-10 w-10 mt-1">
                              <AvatarFallback className="bg-accent text-xs">
                                {getInitials(activity.staffName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-medium text-sm">
                                  {activity.staffName ?? 'System'}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {activity.staffRole}
                                </Badge>
                                <Badge className={`text-xs ${getActionColor(activity.action)}`}>
                                  {activity.action}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {getActionLabel(activity.action)}
                              </p>
                              {activity.details && (
                                <div className="text-xs bg-accent/30 rounded p-2 mb-2">
                                  {activity.details}
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(activity.timestamp), {
                                  addSuffix: true,
                                  locale: fr,
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Activity className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p>Aucune activité trouvée</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
