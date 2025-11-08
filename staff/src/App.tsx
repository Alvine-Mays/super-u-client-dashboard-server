import { Switch, Route, Redirect } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useStaffStore } from '@/lib/staff-store';
import { StaffLoginPage } from '@/components/staff/login-page';
import { AdminDashboard } from '@/pages/staff/admin-dashboard';
import { StaffManagementPage } from '@/pages/staff/staff-management';
import { ActivityLogsPage } from '@/pages/staff/activity-logs';
import { OrdersListPage } from '@/pages/staff/orders-list';
import { CashierValidatePage } from '@/pages/staff/cashier-validate';
import { PreparerDashboard } from '@/pages/staff/preparer-dashboard';
import ProductsPage from '@/pages/staff/products';
import CategoriesPage from '@/pages/staff/categories';
import StockPage from '@/pages/staff/stock';
import NotFound from '@/pages/not-found';

function ProtectedRoute({ component: Component, allowedRoles }: { component: any; allowedRoles?: string[] }) {
  const staff = useStaffStore((state) => state.staff);

  if (!staff) {
    return <Redirect to="/staff/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(staff.role)) {
    return <Redirect to={getDefaultRoute(staff.role)} />;
  }

  return <Component />;
}

function getDefaultRoute(role: string) {
  switch (role) {
    case 'admin':
      return '/staff/dashboard';
    case 'caissier':
      return '/staff/orders';
    case 'preparateur':
      return '/staff/preparation';
    default:
      return '/staff/login';
  }
}

function Router() {
  const staff = useStaffStore((state) => state.staff);

  return (
    <Switch>
      <Route path="/staff/login">
        {staff ? <Redirect to={getDefaultRoute(staff.role)} /> : <StaffLoginPage />}
      </Route>

      <Route path="/staff/dashboard">
        <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />
      </Route>

      <Route path="/staff/manage">
        <ProtectedRoute component={StaffManagementPage} allowedRoles={['admin']} />
      </Route>

      <Route path="/staff/products">
        <ProtectedRoute component={ProductsPage} allowedRoles={['admin']} />
      </Route>

      <Route path="/staff/categories">
        <ProtectedRoute component={CategoriesPage} allowedRoles={['admin']} />
      </Route>

      <Route path="/staff/stock">
        <ProtectedRoute component={StockPage} allowedRoles={['admin','preparateur']} />
      </Route>

      <Route path="/staff/activity">
        <ProtectedRoute component={ActivityLogsPage} allowedRoles={['admin']} />
      </Route>

      <Route path="/staff/orders">
        <ProtectedRoute component={OrdersListPage} allowedRoles={['caissier','admin']} />
      </Route>

      <Route path="/staff/validate">
        <ProtectedRoute component={CashierValidatePage} allowedRoles={['caissier']} />
      </Route>

      <Route path="/staff/preparation">
        <ProtectedRoute component={PreparerDashboard} allowedRoles={['preparateur']} />
      </Route>

      <Route path="/staff/my-orders">
        <ProtectedRoute component={PreparerDashboard} allowedRoles={['preparateur']} />
      </Route>

      <Route path="/">
        {staff ? <Redirect to={getDefaultRoute(staff.role)} /> : <Redirect to="/staff/login" />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
