import { useStaffStore } from '@/lib/staff-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Activity,
  LogOut,
  KeyRound,
  CheckSquare,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

export function StaffSidebar() {
  const staff = useStaffStore((state) => state.staff);
  const logout = useStaffStore((state) => state.logout);
  const [location] = useLocation();

  if (!staff) return null;

  const getInitials = (nameOrEmail: string) => {
    const base = nameOrEmail || '';
    const parts = base.includes(' ') ? base.split(' ') : [base.split('@')[0]];
    return parts.map((n)=>n[0]||'').join('').toUpperCase().slice(0,2);
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrateur',
      staff: 'Staff',
      customer: 'Client',
      caissier: 'Caissier',
      preparateur: 'Préparateur',
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-primary text-primary-foreground',
      staff: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      customer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      caissier: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      preparateur: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[role as keyof typeof colors] || '';
  };

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/staff/dashboard', testId: 'nav-dashboard' },
    { icon: Users, label: 'Gestion Staff', path: '/staff/manage', testId: 'nav-staff' },
    { icon: Package, label: 'Produits', path: '/staff/products', testId: 'nav-products' },
    { icon: CheckSquare, label: 'Catégories', path: '/staff/categories', testId: 'nav-categories' },
    { icon: Activity, label: 'Stock', path: '/staff/stock', testId: 'nav-stock' },
    { icon: ShoppingCart, label: 'Commandes', path: '/staff/orders', testId: 'nav-orders' },
    { icon: Activity, label: 'Activité', path: '/staff/activity', testId: 'nav-activity' },
  ];

  const caissierNavItems = [
    { icon: ShoppingCart, label: 'Commandes', path: '/staff/orders', testId: 'nav-orders' },
    { icon: KeyRound, label: 'Validation Codes', path: '/staff/validate', testId: 'nav-validate' },
  ];

  const preparateurNavItems = [
    { icon: Package, label: 'Préparation', path: '/staff/preparation', testId: 'nav-preparation' },
    { icon: CheckSquare, label: 'Mes Commandes', path: '/staff/my-orders', testId: 'nav-my-orders' },
  ];

  const navItems =
    staff.role === 'admin'
      ? adminNavItems
      : staff.role === 'caissier'
      ? caissierNavItems
      : preparateurNavItems;

  return (
    <div className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-base">Super-U</h1>
            <p className="text-xs text-muted-foreground">Staff Dashboard</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-accent text-accent-foreground font-medium">
              {getInitials(staff.name || staff.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" data-testid="text-staff-name">
              {staff.name || staff.email}
            </p>
            <Badge
              className={`text-xs mt-1 ${getRoleColor(staff.role)}`}
              data-testid="badge-staff-role"
            >
              {getRoleLabel(staff.role)}
            </Badge>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 hover-elevate ${
                  isActive ? 'bg-accent' : ''
                }`}
                data-testid={item.testId}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
          onClick={logout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
}
