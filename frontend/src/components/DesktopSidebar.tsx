import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingCart, 
  BarChart3, 
  Wallet,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Users,
  Building2
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  active?: boolean;
}

interface DesktopSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function DesktopSidebar({ currentPage, onNavigate, onLogout }: DesktopSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
    { id: 'reports', label: 'VAT Reports', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: Wallet },
    { id: 'tenders', label: 'Tenders', icon: Briefcase },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className={`${collapsed ? 'w-20' : 'w-72'} h-screen bg-gradient-to-b from-[#1A2B4A] to-[#0F1729] text-white fixed left-0 top-0 transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-50`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#F4E5B0] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-[#1A2B4A]">BM</span>
            </div>
            <div>
              <h2 className="text-sm">BizManage</h2>
              <p className="text-xs text-white/60">Pro Edition</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-white/10"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <Separator className="bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] text-[#1A2B4A] shadow-lg' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <Separator className="bg-white/10" />

      {/* User Profile */}
      <div className="p-4 space-y-2">
        <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <Avatar className="h-10 w-10 border-2 border-[#D4AF37]">
            <AvatarFallback className="bg-gradient-to-br from-[#D4AF37] to-[#F4E5B0] text-[#1A2B4A]">
              RP
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">Ravindu Perera</p>
              <p className="text-xs text-white/60 truncate">Admin</p>
            </div>
          )}
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        )}
      </div>
    </div>
  );
}
