import { useState, useEffect } from 'react';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileNav } from './components/MobileNav';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { Purchases } from './pages/Purchases';
import { Returns } from './pages/Returns';
import { Reports } from './pages/Reports';
import { Payments } from './pages/Payments';
import { Tenders } from './pages/Tenders';
import { LoginSessions } from './pages/LoginSessions';
import Cusdecs from './pages/Cusdec';
import { Clients } from './pages/Clients';
import { Companies } from './pages/Companies';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Toaster } from './components/ui/sonner';
import { authService } from './services/auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          if (user) {
            setIsAuthenticated(true);
          } else {
            authService.logout();
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
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
      case 'returns':
        return 'Returns Management';
      case 'reports':
        return 'VAT Reports';
      case 'payments':
        return 'Payments';
      case 'tenders':
        return 'Tenders';
      case 'login-sessions':
        return 'Login Sessions';
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
      case 'returns':
        return <Returns />;
      case 'reports':
        return <Reports />;
      case 'payments':
        return <Payments />;
      case 'tenders':
        return <Tenders />;
      case 'login-sessions':
        return <LoginSessions />;      case 'cusdec':
        return <Cusdecs />;      case 'clients':
        return <Clients />;
      case 'companies':
        return <Companies />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F4E5B0] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <svg className="h-6 w-6 text-[#1A2B4A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9L12 2L21 9V20A2 2 0 0 1 19 22H5A2 2 0 0 1 3 20Z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </div>
          <p className="text-slate-600">Loading BizManage...</p>
        </div>
      </div>
    );
  }

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
