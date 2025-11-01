import { useState, useEffect } from 'react';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileNav } from './components/MobileNav';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { Purchases } from './pages/Purchases';
import { Reports } from './pages/Reports';
import { Payments } from './pages/Payments';
import { Tenders } from './pages/Tenders';
import { Clients } from './pages/Clients';
import { Companies } from './pages/Companies';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'invoices':
        return 'Invoices';
      case 'purchases':
        return 'Purchase Orders';
      case 'reports':
        return 'VAT Reports';
      case 'payments':
        return 'Payments';
      case 'tenders':
        return 'Tenders';
      case 'clients':
        return 'Client Management';
      case 'companies':
        return 'Company Management';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <Invoices />;
      case 'purchases':
        return <Purchases />;
      case 'reports':
        return <Reports />;
      case 'payments':
        return <Payments />;
      case 'tenders':
        return <Tenders />;
      case 'clients':
        return <Clients />;
      case 'companies':
        return <Companies />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <DesktopSidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content */}
      <div className={`${!isMobile ? 'ml-72' : ''} min-h-screen flex flex-col`}>
        {/* Top Bar */}
        <TopBar title={getPageTitle()} />

        {/* Page Content */}
        <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'pb-24' : ''}`}>
          {renderPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
