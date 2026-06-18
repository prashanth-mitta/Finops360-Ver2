import React, { useState } from 'react';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { TenantProvider, useTenant }    from './context/TenantContext';
import Login          from './pages/Login';
import Sidebar        from './components/layout/Sidebar';
import Header         from './components/layout/Header';
import AdminDashboard from './pages/admin/AdminDashboard';
import { SalesDashboard, HRDashboard, AssociateDashboard, ClientDashboard } from './pages/Dashboards';
import ClientsModule      from './pages/clients/index';
import TicketsModule      from './pages/tickets/index';
import HRModule           from './pages/hr/index';
import ReportsModule      from './pages/reports/ReportsModule';
import ClientPortal       from './pages/client/index';
import SettingsModule     from './pages/settings/SettingsModule';
import DocumentsModule    from './pages/documents/index';
import InvoicesModule     from './pages/invoices/index';
import TasksModule        from './pages/tasks/index';
import NotificationsModule from './pages/notifications/index';
import ComplianceModule   from './pages/compliance/index';
import PartnersModule     from './pages/partners/index';
import PartnerAppShell    from './pages/partners/PartnerAppShell';

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
  [ROLES.MASTER_ADMIN]: AdminDashboard,
  [ROLES.SALES]:        SalesDashboard,
  [ROLES.HR]:           HRDashboard,
  [ROLES.ASSOCIATE]:    AssociateDashboard,
  [ROLES.CLIENT]:       ClientDashboard,
};

function AppShell() {
  const { currentUser }                       = useAuth();
  const [activePage, setActivePage]           = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [launchedPartner, setLaunchedPartner] = useState(null);

  if (!currentUser) return <Login />;

  // ── Partner portal launched — render full isolated app ───────────────────
  if (launchedPartner) {
    return (
      <PartnerAppShell
        partner={launchedPartner}
        onExit={() => setLaunchedPartner(null)}
      />
    );
  }

  const DashboardComponent = DASHBOARDS[currentUser.role];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':         return <DashboardComponent setActivePage={setActivePage} />;
      case 'clients':
      case 'onboard-client':    return <ClientsModule />;
      case 'tickets':           return <TicketsModule />;
      case 'associates':
      case 'hr-team':
      case 'sales-team':
      case 'onboard-associate': return <HRModule />;
      case 'reports':
      case 'performance':       return <ReportsModule />;
      case 'documents':
        return currentUser.role === ROLES.CLIENT
          ? <ClientPortal page="documents" />
          : <DocumentsModule userRole={currentUser.role} />;
      case 'invoices':          return <InvoicesModule userRole={currentUser.role} />;
      case 'tasks':
      case 'work':
      case 'my-tasks':          return <TasksModule userRole={currentUser.role} />;
      case 'notifications':     return <NotificationsModule userRole={currentUser.role} setActivePage={setActivePage} />;
      case 'compliance':        return <ComplianceModule userRole={currentUser.role} />;
      case 'partners':          return <PartnersModule onLaunchPartner={p => setLaunchedPartner(p)} />;
      case 'messages':          return <ClientPortal page="messages" />;
      case 'history':           return <ClientPortal page="history" />;
      case 'settings':          return <SettingsModule />;
      default:                  return <ComingSoon page={activePage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activePage={activePage}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </TenantProvider>
  );
}
