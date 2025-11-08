import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, Phone, User, Package } from 'lucide-react';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  onAction?: (order: Order) => void;
  actionLabel?: string;
  showAssignment?: boolean;
}

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  confirmed: { label: 'Confirmé', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  in_preparation: { label: 'En préparation', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  ready: { label: 'Prêt', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  completed: { label: 'Terminé', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  cancelled: { label: 'Annulé', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export function OrderCard({ order, onAction, actionLabel, showAssignment }: OrderCardProps) {
  const items = JSON.parse(order.items || '[]');
  const status = statusConfig[order.status as keyof typeof statusConfig];

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid={`card-order-${order.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-mono truncate" data-testid="text-order-id">
              #{order.id.slice(0, 8)}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </div>
          </div>
          <Badge className={status.color} data-testid="badge-order-status">
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium" data-testid="text-customer-name">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span data-testid="text-customer-phone">{order.customerPhone}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Package className="w-4 h-4" />
            <span>Articles ({items.length})</span>
          </div>
          <ul className="text-xs space-y-1 pl-6">
            {items.slice(0, 3).map((item: any, idx: number) => (
              <li key={idx} className="text-muted-foreground">
                {item.quantity}x {item.name}
              </li>
            ))}
            {items.length > 3 && (
              <li className="text-muted-foreground italic">
                +{items.length - 3} autre(s)...
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-bold" data-testid="text-order-total">
            {order.totalAmount.toLocaleString()} FCFA
          </span>
          {onAction && actionLabel && (
            <Button
              size="sm"
              onClick={() => onAction(order)}
              data-testid="button-order-action"
            >
              {actionLabel}
            </Button>
          )}
        </div>

        {showAssignment && order.assignedTo && (
          <div className="text-xs text-muted-foreground border-t border-border pt-2">
            Assigné à: <span className="font-medium">{order.assignedTo}</span>
          </div>
        )}

        {order.notes && (
          <div className="text-xs bg-accent/50 rounded p-2 border border-accent">
            <span className="font-medium">Note:</span> {order.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
