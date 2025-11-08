import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  testId?: string;
}

export function KPICard({ icon: Icon, title, value, trend, testId }: KPICardProps) {
  return (
    <Card className="hover-elevate transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <p className="text-3xl font-bold" data-testid={testId}>
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={`text-xs font-medium ${
                    trend.isPositive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs dernier mois</span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
