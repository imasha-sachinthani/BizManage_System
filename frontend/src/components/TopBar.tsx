import { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Separator } from './ui/separator';

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
  showBreadcrumb?: boolean;
}

export function TopBar({ title, onMenuClick, showBreadcrumb = true }: TopBarProps) {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Invoice Payment Received',
      message: 'ABC Corporation Ltd paid invoice INV-2024-001',
      time: '5 minutes ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'Invoice Overdue',
      message: 'Invoice INV-2024-003 is now overdue',
      time: '2 hours ago',
      type: 'warning'
    },
    {
      id: 3,
      title: 'New Tender Available',
      message: 'Government Digital Transformation Project',
      time: '1 day ago',
      type: 'info'
    },
  ]);

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Breadcrumb or Menu */}
        <div className="flex items-center gap-4 flex-1">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {showBreadcrumb && (
            <div className="hidden md:block">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="text-slate-500">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
          
          <h1 className="md:hidden">{title}</h1>
        </div>

        {/* Center - Search */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search invoices, clients, reports..."
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {notifications.length}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-xs text-slate-500 mt-1">{notifications.length} unread messages</p>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.type === 'success' ? 'bg-emerald-500' :
                          notification.type === 'warning' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{notification.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t bg-slate-50">
                <Button variant="ghost" className="w-full text-sm">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
