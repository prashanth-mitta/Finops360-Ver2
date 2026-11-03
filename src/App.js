import React, { useState, Suspense, lazy, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider, useAuth, ROLES, roleLabel } from './context/AuthContext';
import { TenantProvider, useTenant } from './context/TenantContext';
import { canManagePartners } from './lib/tenant';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AdminDashboard from './pages/admin/AdminDashboard';
import { SalesDashboard, HRDashboard, AssociateDashboard, ClientDashboard } from './pages/Dashboards';
import { isSupabaseConfigured } from './lib/supabaseClient';

const ClientsModule = lazy(() => import('./pages/clients/index'));
const TicketsModule = lazy(() => import('./pages/tickets/index'));
const HRModule = lazy(() => import('./pages/hr/index'));
const ReportsModule = lazy(() => import('./pages/reports/ReportsModule'));
const ClientPortal = lazy(() => import('./pages/client/index'));
const SettingsModule = lazy(() => import('./pages/settings/SettingsModule'));
const DocumentsModule = lazy(() => import('./pages/documents/index'));
const InvoicesModule = lazy(() => import('./pages/invoices/index'));
const TasksModule = lazy(() => import('./pages/tasks/index'));
const NotificationsModule = lazy(() => import('./pages/notifications/index'));
const ComplianceModule = lazy(() => import('./pages/compliance/index'));
const PartnersModule = lazy(() => import('./pages/partners/index'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-sm text-slate-400">Loading module…</div>
    </div>
  );
}

function ComingSoon({ page }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center p-6">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 capitalize">{page.replace(/-/g, ' ')}</h2>
      <p className="text-gray-400 text-sm mt-2 max-w-xs">This module is being built. It will be ready soon.</p>
    </div>
  );
}

const DASHBOARDS = {
  [ROLES.SUPER_ADMIN]: AdminDashboard,
  [ROLES.MASTER_ADMIN]: AdminDashboard,
  [ROLES.SALES]: SalesDashboard,
  [ROLES.HR]: HRDashboard,
  [ROLES.ASSOCIATE]: AssociateDashboard,
  [ROLES.CLIENT]: ClientDashboard,
};

function AppShell() {
  const { currentUser, loading, passwordRecovery } = useAuth();
  const { activeTenant } = useTenant();
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showPartners = canManagePartners(currentUser, activeTenant);

  useEffect(() => {
    if (activePage === 'partners' && !showPartners) {
      setActivePage('dashboard');
    }
  }, [activePage, showPartners]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-sm text-slate-400">Loading FinOps 360…</div>
      </div>
    );
  }

  if (passwordRecovery) return <ResetPassword />;
  if (!currentUser) return <Login />;

  const DashboardComponent = DASHBOARDS[currentUser.role] || AdminDashboard;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardComponent setActivePage={setActivePage} />;
      case 'clients':
      case 'onboard-client':
        return <ClientsModule />;
      case 'tickets':
        return <TicketsModule />;
      case 'associates':
      case 'hr-team':
      case 'sales-team':
      case 'onboard-associate':
        return <HRModule />;
      case 'reports':
      case 'performance':
        return <ReportsModule />;
      case 'documents':
        return currentUser.role === ROLES.CLIENT
          ? <ClientPortal page="documents" />
          : <DocumentsModule userRole={roleLabel(currentUser.role)} />;
      case 'invoices':
        return <InvoicesModule userRole={roleLabel(currentUser.role)} />;
      case 'tasks':
      case 'work':
      case 'my-tasks':
        return <TasksModule userRole={currentUser.role} />;
      case 'notifications':
        return <NotificationsModule userRole={currentUser.role} setActivePage={setActivePage} />;
      case 'compliance':
        return <ComplianceModule userRole={currentUser.role} />;
      case 'partners':
        if (!showPartners) return <ComingSoon page="dashboard" />;
        return <PartnersModule />;
      case 'messages':
        return <ClientPortal page="messages" />;
      case 'history':
        return <ClientPortal page="history" />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <ComingSoon page={activePage} />;
    }
  };

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <Header
          activePage={activePage}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />
        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800">
            Database connection is not configured. Sign-in is unavailable until environment settings are applied.
          </div>
        )}
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <AppShell />
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
