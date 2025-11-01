import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Building2, 
  Menu
} from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'settings', label: 'Menu', icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[60px] ${
                isActive 
                  ? 'text-[#1A2B4A]' 
                  : 'text-slate-400'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-[#D4AF37] rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
