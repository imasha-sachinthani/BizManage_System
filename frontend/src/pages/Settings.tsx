import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { 
  Building2, 
  Users, 
  Bell, 
  Shield,
  Palette,
  Save,
  Cloud,
  Server,
  Headphones,
  Award,
  FileText,
  Settings,
  Mail,
  LayoutDashboard,
  Printer,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export function Settings() {
    // 2FA state
    const [twoFAEnabled, setTwoFAEnabled] = useState(() => {
      const saved = localStorage.getItem('twoFAEnabled');
      return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
      localStorage.setItem('twoFAEnabled', JSON.stringify(twoFAEnabled));
    }, [twoFAEnabled]);

    const handleToggle2FA = () => {
      setTwoFAEnabled((prev) => {
        const next = !prev;
        toast.success(next ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled');
        return next;
      });
    };
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isConfigureRoleOpen, setIsConfigureRoleOpen] = useState(false);
  const [isFiscalYearExpanded, setIsFiscalYearExpanded] = useState(false);
  const [isDocumentPrintingExpanded, setIsDocumentPrintingExpanded] = useState(false);
  const [isEmailTemplateExpanded, setIsEmailTemplateExpanded] = useState(false);
  const [isDashboardCustomizationExpanded, setIsDashboardCustomizationExpanded] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Staff' });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [allRolePermissions, setAllRolePermissions] = useState(() => {
    const saved = localStorage.getItem('rolePermissions');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      Admin: { invoices: true, clients: true, reports: true, purchases: true, payments: true, settings: true, users: true, tenders: true },
      Accountant: { invoices: true, clients: true, reports: true, purchases: true, payments: true, settings: false, users: false, tenders: false },
      Manager: { invoices: true, clients: true, reports: true, purchases: true, payments: false, settings: false, users: false, tenders: true },
      Staff: { invoices: false, clients: true, reports: false, purchases: false, payments: false, settings: false, users: false, tenders: false },
    };
  });
  const [currentPermissions, setCurrentPermissions] = useState({
    invoices: true,
    clients: true,
    reports: true,
    purchases: true,
    payments: true,
    settings: true,
    users: true,
    tenders: true,
  });
  const [notificationPreferences, setNotificationPreferences] = useState(() => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      invoicePayment: true,
      invoiceOverdue: true,
      vatReminders: true,
      newPurchase: false,
      weeklyReports: false,
    };
  });
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('teamMembers');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: '1', name: 'Ravindu Perera', email: 'ravindu@company.lk', role: 'Admin', avatar: 'RP' },
      { id: '2', name: 'Samantha Silva', email: 'samantha@company.lk', role: 'Accountant', avatar: 'SS' },
      { id: '3', name: 'Kasun Fernando', email: 'kasun@company.lk', role: 'Manager', avatar: 'KF' },
      { id: '4', name: 'Nisha Wickramasinghe', email: 'nisha@company.lk', role: 'Staff', avatar: 'NW' },
    ];
  });

  // Save to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(users));
  }, [users]);

  // Save role permissions to localStorage
  useEffect(() => {
    localStorage.setItem('rolePermissions', JSON.stringify(allRolePermissions));
  }, [allRolePermissions]);

  // Save notification preferences to localStorage
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  const handleSaveCompanyInfo = () => {
    toast.success('Company information saved successfully');
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(notificationPreferences));
    toast.success('Notification preferences saved successfully');
  };

  const handleNotificationToggle = (key: string, value: boolean) => {
    setNotificationPreferences({
      ...notificationPreferences,
      [key]: value,
    });
  };

  // Security password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  const handleSaveSecuritySettings = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSecurityLoading(true);
    setTimeout(() => {
      setSecurityLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setConfirmTouched(false);
      toast.success('Password changed successfully');
    }, 1200);
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully');
  };

  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };

  const handleSubmitUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    const initials = newUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const user = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: initials,
    };
    setUsers([...users, user]);
    localStorage.setItem('teamMembers', JSON.stringify([...users, user]));
    toast.success(`User ${newUser.name} added successfully`);
    setNewUser({ name: '', email: '', role: 'Staff' });
    setIsAddUserOpen(false);
  };

  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser.name || !selectedUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    const updatedUsers = users.map(u => u.id === selectedUser.id ? selectedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedUsers));
    toast.success(`User ${selectedUser.name} updated successfully`);
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleConfigureRole = (role: string) => {
    setSelectedRole(role);
    setCurrentPermissions(allRolePermissions[role] || {
      invoices: true,
      clients: true,
      reports: true,
      purchases: true,
      payments: true,
      settings: true,
      users: true,
      tenders: true,
    });
    setIsConfigureRoleOpen(true);
  };

  const handleSavePermissions = () => {
    setAllRolePermissions({
      ...allRolePermissions,
      [selectedRole]: currentPermissions,
    });
    toast.success(`${selectedRole} permissions updated successfully`);
    setIsConfigureRoleOpen(false);
    setSelectedRole(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Settings</h2>
        <p className="text-slate-600 text-base mt-2">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 lg:w-auto">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden lg:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden lg:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden lg:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden lg:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden lg:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="cloud" className="gap-2">
            <Cloud className="h-4 w-4" />
            <span className="hidden lg:inline">Cloud</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="gap-2">
            <Headphones className="h-4 w-4" />
            <span className="hidden lg:inline">Support</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden lg:inline">Backup & Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="BizManage Solutions Pvt Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat-number">VAT Registration Number</Label>
                  <Input id="vat-number" defaultValue="VAT-123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Company Email</Label>
                  <Input id="company-email" type="email" defaultValue="info@bizmanage.lk" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone Number</Label>
                  <Input id="company-phone" defaultValue="+94 11 234 5678" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Galle Road, Colombo 03, Sri Lanka" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Colombo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input id="postal-code" defaultValue="00300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select defaultValue="lk">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lk">Sri Lanka</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
                  onClick={handleSaveCompanyInfo}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Button 
                className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
                onClick={handleAddUser}
              >
                <Users className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-[#D4AF37]">
                        <AvatarFallback className="bg-gradient-to-br from-[#D4AF37] to-[#F4E5B0] text-[#1A2B4A]">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {user.role}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUserClick(user)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add User Dialog */}
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input
                    id="user-name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-[#1A2B4A] hover:bg-[#0F1729]"
                    onClick={handleSubmitUser}
                  >
                    Add User
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsAddUserOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-name">Full Name</Label>
                    <Input
                      id="edit-user-name"
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-email">Email</Label>
                    <Input
                      id="edit-user-email"
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-role">Role</Label>
                    <Select value={selectedUser.role} onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Accountant">Accountant</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 bg-[#1A2B4A] hover:bg-[#0F1729]"
                      onClick={handleUpdateUser}
                    >
                      Update User
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsEditUserOpen(false);
                        setSelectedUser(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { role: 'Admin', permissions: 'Full access to all features' },
                  { role: 'Accountant', permissions: 'Manage invoices, reports, and VAT' },
                  { role: 'Manager', permissions: 'View reports and approve purchases' },
                  { role: 'Staff', permissions: 'Limited access to assigned tasks' },
                ].map((roleItem, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                      <p>{roleItem.role}</p>
                      <p className="text-sm text-slate-500 mt-1">{roleItem.permissions}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleConfigureRole(roleItem.role)}
                    >
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configure Role Permissions Dialog */}
          <Dialog open={isConfigureRoleOpen} onOpenChange={setIsConfigureRoleOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configure {selectedRole} Permissions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {[
                  { key: 'invoices', label: 'Invoices', description: 'Create, edit, and manage invoices' },
                  { key: 'clients', label: 'Clients', description: 'Manage client information' },
                  { key: 'reports', label: 'Reports', description: 'View and generate reports' },
                  { key: 'purchases', label: 'Purchases', description: 'Manage purchase orders' },
                  { key: 'payments', label: 'Payments', description: 'Process and track payments' },
                  { key: 'settings', label: 'Settings', description: 'Access system settings' },
                  { key: 'users', label: 'Users', description: 'Manage user accounts' },
                  { key: 'tenders', label: 'Tenders', description: 'Manage tender documents' },
                ].map((permission) => (
                  <div key={permission.key} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="font-medium">{permission.label}</p>
                      <p className="text-sm text-slate-500">{permission.description}</p>
                    </div>
                    <Switch
                      checked={currentPermissions[permission.key as keyof typeof currentPermissions]}
                      onCheckedChange={(checked) =>
                        setCurrentPermissions({ ...currentPermissions, [permission.key]: checked })
                      }
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-[#1A2B4A] hover:bg-[#0F1729]"
                    onClick={handleSavePermissions}
                  >
                    Save Permissions
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsConfigureRoleOpen(false);
                      setSelectedRole(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {[
                { key: 'invoicePayment', label: 'Invoice payment received', description: 'Get notified when a client pays an invoice', color: 'from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100' },
                { key: 'invoiceOverdue', label: 'Invoice overdue', description: 'Receive alerts for overdue invoices', color: 'from-red-50 to-rose-50 border-red-200 hover:from-red-100 hover:to-rose-100' },
                { key: 'vatReminders', label: 'VAT filing reminders', description: 'Reminders before VAT submission deadlines', color: 'from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100' },
                { key: 'newPurchase', label: 'New purchase order', description: 'Notifications for new purchase orders', color: 'from-purple-50 to-violet-50 border-purple-200 hover:from-purple-100 hover:to-violet-100' },
                { key: 'weeklyReports', label: 'Weekly reports', description: 'Receive weekly summary reports', color: 'from-orange-50 to-amber-50 border-orange-200 hover:from-orange-100 hover:to-amber-100' },
              ].map((notification) => (
                <div key={notification.key} className={`flex items-center justify-between p-5 bg-gradient-to-r ${notification.color} rounded-xl transition-all duration-200 border-2 shadow-sm`}>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-base">{notification.label}</p>
                    <p className="text-sm text-slate-600 mt-1.5">{notification.description}</p>
                  </div>
                  <Switch 
                    checked={notificationPreferences[notification.key as keyof typeof notificationPreferences]}
                    onCheckedChange={(checked) => handleNotificationToggle(notification.key, checked)}
                  />
                </div>
              ))}

              <Separator />

              <div className="flex justify-end">
                <Button 
                  className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
                  onClick={handleSaveNotifications}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="mt-2"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="mt-2"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="mt-2"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onFocus={() => setConfirmTouched(true)}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4">Two-Factor Authentication</h4>
                <div className={`flex items-center justify-between p-4 rounded-lg border ${twoFAEnabled ? 'border-green-400' : 'border-slate-200'} bg-[#1A2B4A] text-white`}>
                  <div>
                    <p className="font-semibold">{twoFAEnabled ? '2FA is enabled' : 'Enable 2FA for extra security'}</p>
                    <p className="text-sm text-white/80 mt-1">
                      {twoFAEnabled
                        ? 'Your account is protected with an additional verification step.'
                        : 'Protect your account with an additional verification step'}
                    </p>
                  </div>
                  <Switch checked={twoFAEnabled} onCheckedChange={handleToggle2FA} />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4">Active Sessions</h4>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'Colombo, Sri Lanka', time: 'Current session' },
                    { device: 'Safari on iPhone', location: 'Colombo, Sri Lanka', time: '2 hours ago' },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p>{session.device}</p>
                        <p className="text-sm text-slate-500 mt-1">{session.location} · {session.time}</p>
                      </div>
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => toast.success(`Session revoked for ${session.device}`)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button
                  className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
                  onClick={handleSaveSecuritySettings}
                  disabled={securityLoading || !currentPassword || !newPassword || !confirmPassword || !confirmTouched}
                >
                  {securityLoading ? (
                    <span className="animate-spin mr-2">🔄</span>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="si">Sinhala</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="asia-colombo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-colombo">Asia/Colombo (GMT+5:30)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="lkr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lkr">LKR (Rs)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-base font-semibold">Display Options</h4>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)' }}>
                  <div>
                    <p className="font-medium text-sm">Compact View</p>
                    <p className="text-xs text-slate-600 mt-1">Show more data in tables</p>
                  </div>
                  <Switch className="scale-90" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #c7d2fe)' }}>
                  <div>
                    <p className="font-medium text-sm">Dark Mode</p>
                    <p className="text-xs text-slate-600 mt-1">Use dark theme across the app</p>
                  </div>
                  <Switch className="scale-90" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #fef3c7, #fde68a)' }}>
                  <div>
                    <p className="font-medium text-sm">Animations</p>
                    <p className="text-xs text-slate-600 mt-1">Enable smooth transitions and effects</p>
                  </div>
                  <Switch defaultChecked className="scale-90" />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
                  onClick={handleSavePreferences}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fiscal Year & Tax Settings */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader 
              className="bg-gradient-to-r from-emerald-50 to-green-50 cursor-pointer hover:from-emerald-100 hover:to-green-100 transition-all"
              onClick={() => setIsFiscalYearExpanded(!isFiscalYearExpanded)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Fiscal Year & Tax Settings
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-emerald-600 transition-transform ${isFiscalYearExpanded ? 'rotate-180' : ''}`}
                />
              </CardTitle>
            </CardHeader>
            {isFiscalYearExpanded && (
            <CardContent className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fiscal-start">Fiscal Year Start</Label>
                  <Select defaultValue="april">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January 1st</SelectItem>
                      <SelectItem value="april">April 1st (Sri Lankan Standard)</SelectItem>
                      <SelectItem value="july">July 1st</SelectItem>
                      <SelectItem value="october">October 1st</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">Fiscal year for financial reporting</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-vat">Default VAT Rate (%)</Label>
                  <Input type="number" defaultValue="15" placeholder="15" />
                  <p className="text-xs text-slate-500">Standard VAT rate for Sri Lanka</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vat-number">Company VAT/TIN Number</Label>
                  <Input placeholder="134-XXXXXXX-XXX" />
                  <p className="text-xs text-slate-500">Appears on invoices and tax documents</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-reg">Business Registration Number</Label>
                  <Input placeholder="PV 00XXXXX" />
                  <p className="text-xs text-slate-500">Company registration number</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Additional Tax Rates</h4>
                <p className="text-sm text-slate-600">Configure multiple tax rates for different product categories</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Zero-rated Products</Label>
                    <Input type="number" defaultValue="0" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Reduced Rate</Label>
                    <Input type="number" defaultValue="8" placeholder="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Luxury Goods</Label>
                    <Input type="number" defaultValue="25" placeholder="25" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div>
                  <p className="font-medium text-emerald-900">Display Tax Details on Invoices</p>
                  <p className="text-sm text-emerald-700 mt-1">Show VAT breakdown and registration numbers</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300"
                  onClick={() => {
                    toast.success('Fiscal year & tax settings saved successfully');
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Tax Settings
                </Button>
              </div>
            </CardContent>
            )}
          </Card>

          {/* Document & Printing Preferences */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader 
              className="bg-gradient-to-r from-blue-50 to-cyan-50 cursor-pointer hover:from-blue-100 hover:to-cyan-100 transition-all"
              onClick={() => setIsDocumentPrintingExpanded(!isDocumentPrintingExpanded)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="h-5 w-5 text-blue-600" />
                  Document & Printing Preferences
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-blue-600 transition-transform ${isDocumentPrintingExpanded ? 'rotate-180' : ''}`}
                />
              </CardTitle>
            </CardHeader>
            {isDocumentPrintingExpanded && (
            <CardContent className="space-y-6 mt-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Document Numbering</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Invoice Prefix</Label>
                    <Input defaultValue="INV" placeholder="INV" />
                  </div>
                  <div className="space-y-2">
                    <Label>Quotation Prefix</Label>
                    <Input defaultValue="QT" placeholder="QT" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Prefix</Label>
                    <Input defaultValue="PAY" placeholder="PAY" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tender Prefix</Label>
                    <Input defaultValue="TDR" placeholder="TDR" />
                  </div>
                  <div className="space-y-2">
                    <Label>Return Prefix</Label>
                    <Input defaultValue="RET" placeholder="RET" />
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Number</Label>
                    <Input type="number" defaultValue="1" placeholder="1" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Print Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Default Paper Size</Label>
                    <Select defaultValue="a4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                        <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                        <SelectItem value="legal">Legal (8.5 × 14 in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Default Orientation</Label>
                    <Select defaultValue="portrait">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Document Footer</h4>
                <div className="space-y-2">
                  <Label>Custom Footer Text</Label>
                  <textarea 
                    className="w-full min-h-[80px] px-3 py-2 border border-slate-300 rounded-md text-sm"
                    placeholder="Payment Terms: Net 30 days | Bank: Commercial Bank, Account: 8012345678"
                    defaultValue="Payment Terms: Net 30 days | Bank: Commercial Bank | Account: 8012345678 | Branch: Colombo"
                  />
                  <p className="text-xs text-slate-500">Appears at the bottom of all printed documents</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-blue-900">Include Watermark</p>
                  <p className="text-sm text-blue-700 mt-1">Add "PAID" or "DRAFT" watermark to documents</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                  onClick={() => {
                    toast.success('Document & printing preferences saved successfully');
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Document Settings
                </Button>
              </div>
            </CardContent>
            )}
          </Card>

          {/* Email Templates & Communication */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader 
              className="bg-gradient-to-r from-orange-50 to-amber-50 cursor-pointer hover:from-orange-100 hover:to-amber-100 transition-all"
              onClick={() => setIsEmailTemplateExpanded(!isEmailTemplateExpanded)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-orange-600" />
                  Email Templates & Communication
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-orange-600 transition-transform ${isEmailTemplateExpanded ? 'rotate-180' : ''}`}
                />
              </CardTitle>
            </CardHeader>
            {isEmailTemplateExpanded && (
            <CardContent className="space-y-6 mt-6">
              <div className="space-y-4">
                <h4 className="text-base font-semibold">Email Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #fed7aa, #fdba74)' }}>
                    <div>
                      <p className="font-medium text-sm">Auto-send Invoices</p>
                      <p className="text-xs text-slate-700 mt-1">Email invoices immediately when created</p>
                    </div>
                    <Switch className="scale-90" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #86efac, #4ade80)' }}>
                    <div>
                      <p className="font-medium text-sm">Send Payment Confirmations</p>
                      <p className="text-xs text-slate-700 mt-1">Automatically notify clients of received payments</p>
                    </div>
                    <Switch defaultChecked className="scale-90" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #a5f3fc, #67e8f9)' }}>
                    <div>
                      <p className="font-medium text-sm">Enable SMS Notifications</p>
                      <p className="text-xs text-slate-700 mt-1">Send SMS for critical alerts (overdue payments)</p>
                    </div>
                    <Switch className="scale-90" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Email Templates</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Invoice Email Subject</Label>
                    <Input defaultValue="Invoice {number} from {company}" placeholder="Invoice {number} from {company}" />
                    <p className="text-xs text-slate-500">Use {'{number}'}, {'{company}'}, {'{client}'} as variables</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Invoice Email Body</Label>
                    <textarea 
                      className="w-full min-h-[100px] px-3 py-2 border border-slate-300 rounded-md text-sm"
                      defaultValue="Dear {client},&#10;&#10;Please find attached invoice {number} for Rs {amount}.&#10;&#10;Payment is due by {due_date}.&#10;&#10;Best regards,&#10;{company}"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Company Email Signature</h4>
                <div className="space-y-2">
                  <Label>Email Signature</Label>
                  <textarea 
                    className="w-full min-h-[100px] px-3 py-2 border border-slate-300 rounded-md text-sm"
                    placeholder="Best regards,&#10;Your Name&#10;Company Name&#10;+94 11 234 5678&#10;info@company.lk"
                    defaultValue="Best regards,&#10;BizManage Solutions Pvt Ltd&#10;+94 11 234 5678&#10;info@bizmanage.lk"
                  />
                  <p className="text-xs text-slate-500">Automatically appended to all outgoing emails</p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300"
                  onClick={() => {
                    toast.success('Email templates & communication settings saved successfully');
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
            )}
          </Card>

          {/* Dashboard Customization */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader 
              className="bg-gradient-to-r from-indigo-50 to-purple-50 cursor-pointer hover:from-indigo-100 hover:to-purple-100 transition-all"
              onClick={() => setIsDashboardCustomizationExpanded(!isDashboardCustomizationExpanded)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                  Dashboard Customization
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-indigo-600 transition-transform ${isDashboardCustomizationExpanded ? 'rotate-180' : ''}`}
                />
              </CardTitle>
            </CardHeader>
            {isDashboardCustomizationExpanded && (
            <CardContent className="space-y-6 mt-6">
              <div className="space-y-4">
                <h4 className="text-base font-semibold">Dashboard Widgets</h4>
                <p className="text-xs text-slate-600">Choose which widgets to display on your dashboard</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)' }}>
                    <span className="text-base font-medium">Revenue & Expenses Chart</span>
                    <Switch defaultChecked className="scale-100" />
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #a5f3fc, #67e8f9)' }}>
                    <span className="text-base font-medium">Invoice Status Distribution</span>
                    <Switch defaultChecked className="scale-100" />
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #86efac, #4ade80)' }}>
                    <span className="text-base font-medium">Recent Invoices</span>
                    <Switch defaultChecked className="scale-100" />
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #fde68a, #fbbf24)' }}>
                    <span className="text-base font-medium">Recent Clients</span>
                    <Switch defaultChecked className="scale-100" />
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #fed7aa, #fdba74)' }}>
                    <span className="text-base font-medium">Expense Management</span>
                    <Switch defaultChecked className="scale-100" />
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #c7d2fe, #a5b4fc)' }}>
                    <span className="text-base font-medium">Asset & Inventory</span>
                    <Switch defaultChecked className="scale-100" />
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #fbcfe8, #f9a8d4)' }}>
                    <span className="text-base font-medium">Product Costing</span>
                    <Switch defaultChecked className="scale-100" />
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #d9f99d, #bef264)' }}>
                    <span className="text-base font-medium">KPI Cards</span>
                    <Switch defaultChecked className="scale-100" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Dashboard Behavior</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Default Landing Page</Label>
                    <Select defaultValue="dashboard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="invoices">Invoices</SelectItem>
                        <SelectItem value="clients">Clients</SelectItem>
                        <SelectItem value="payments">Payments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Auto-refresh Data Every</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="1">1 Minute</SelectItem>
                        <SelectItem value="5">5 Minutes</SelectItem>
                        <SelectItem value="15">15 Minutes</SelectItem>
                        <SelectItem value="30">30 Minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Quick Actions</h4>
                <p className="text-sm text-slate-600">Customize quick action buttons on dashboard</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-8 p-3 border rounded">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">New Invoice</span>
                  </div>
                  <div className="flex items-center gap-8 p-3 border rounded">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">New Client</span>
                  </div>
                  <div className="flex items-center gap-8 p-3 border rounded">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Record Payment</span>
                  </div>
                  <div className="flex items-center gap-8 p-3 border rounded">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">New Tender</span>
                  </div>
                  <div className="flex items-center gap-8 p-3 border rounded">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Add Expense</span>
                  </div>
                  <div className="flex items-center gap-8 p-3 border rounded">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Add Asset</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300"
                  onClick={() => {
                    toast.success('Dashboard customization settings saved successfully');
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Dashboard Settings
                </Button>
              </div>
            </CardContent>
            )}
          </Card>

          <div className="flex justify-end">
            <Button 
              className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
              onClick={handleSavePreferences}
            >
              <Save className="h-4 w-4 mr-2" />
              Save All Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Cloud & Infrastructure */}
        <TabsContent value="cloud" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-6 w-6 text-blue-600" />
                Cloud Access & Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-6">
              {/* System Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-green-900">System Status</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">🟢 Online</p>
                  <p className="text-xs text-green-600 mt-1">Uptime: 99.98%</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">Deployment</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">Docker</p>
                  <p className="text-xs text-blue-600 mt-1">Multi-container</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-900">Version</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">v1.0.0</p>
                  <p className="text-xs text-purple-600 mt-1">Production Ready</p>
                </div>
              </div>

              <Separator />

              {/* Server Requirements */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4 flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Server Requirements & Reliability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-700">Minimum Specifications</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">CPU:</span>
                        <span className="font-semibold">4 cores (8 recommended)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">RAM:</span>
                        <span className="font-semibold">16GB (32GB recommended)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Storage:</span>
                        <span className="font-semibold">100GB SSD minimum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Network:</span>
                        <span className="font-semibold">1Gbps connection</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-700">Reliability Guarantees</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Uptime SLA:</span>
                        <span className="font-semibold text-green-600">99.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Backup:</span>
                        <span className="font-semibold">Daily + Hourly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">RTO:</span>
                        <span className="font-semibold">&lt; 1 hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">RPO:</span>
                        <span className="font-semibold">&lt; 15 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cloud Deployment Options */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4">Cloud Deployment Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
                    <h4 className="font-semibold mb-2">Public Cloud</h4>
                    <ul className="text-sm space-y-1 text-slate-600">
                      <li>✅ AWS</li>
                      <li>✅ Microsoft Azure</li>
                      <li>✅ Google Cloud</li>
                      <li>✅ DigitalOcean</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
                    <h4 className="font-semibold mb-2">Private Cloud</h4>
                    <ul className="text-sm space-y-1 text-slate-600">
                      <li>✅ On-premises</li>
                      <li>✅ VPC</li>
                      <li>✅ Hybrid setup</li>
                      <li>✅ Custom infrastructure</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
                    <h4 className="font-semibold mb-2">Multi-Region</h4>
                    <ul className="text-sm space-y-1 text-slate-600">
                      <li>✅ Global access</li>
                      <li>✅ Auto-failover</li>
                      <li>✅ Load balancing</li>
                      <li>✅ CDN integration</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cloud Hosting Pricing */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4">Cloud Hosting Solutions & Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dedicated Server */}
                  <div className="p-6 border-2 border-blue-500 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-shadow relative">
                    <div className="absolute -top-3 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      RECOMMENDED
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Server className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Dedicated Server</h4>
                        <p className="text-sm text-blue-600">Exclusive Resources</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-900">Rs. 125,000</span>
                        <span className="text-slate-600">/year</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">One-time annual payment</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold">100% Dedicated Resources</p>
                          <p className="text-xs text-slate-600">Server exclusively for your business</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold">Guaranteed Performance</p>
                          <p className="text-xs text-slate-600">No resource sharing with others</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold">Full Control & Customization</p>
                          <p className="text-xs text-slate-600">Custom configurations available</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold">Enhanced Security</p>
                          <p className="text-xs text-slate-600">Isolated environment</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold">Scalable Capacity</p>
                          <p className="text-xs text-slate-600">Upgrade CPU, RAM, storage as needed</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded border border-blue-200">
                      <p className="text-xs font-semibold text-slate-700 mb-2">Default Configuration:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-slate-600">CPU:</span> <span className="font-semibold">8 cores</span></div>
                        <div><span className="text-slate-600">RAM:</span> <span className="font-semibold">32GB</span></div>
                        <div><span className="text-slate-600">Storage:</span> <span className="font-semibold">500GB SSD</span></div>
                        <div><span className="text-slate-600">Bandwidth:</span> <span className="font-semibold">Unlimited</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Shared Server */}
                  <div className="p-6 border-2 border-slate-300 rounded-lg bg-gradient-to-br from-slate-50 to-gray-50 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-slate-600 rounded-lg flex items-center justify-center">
                        <Cloud className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Shared Server</h4>
                        <p className="text-sm text-slate-600">Cost-Effective Option</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">Rs. 45,000</span>
                        <span className="text-slate-600">/year</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">One-time annual payment</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold">Affordable Solution</p>
                          <p className="text-xs text-slate-600">64% cost savings</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold">Shared Resources</p>
                          <p className="text-xs text-slate-600">Server shared with other users</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold">Suitable for Small-Medium Business</p>
                          <p className="text-xs text-slate-600">Good for moderate traffic</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">⚠</span>
                        <div>
                          <p className="font-semibold">Limited Customization</p>
                          <p className="text-xs text-slate-600">Standard configurations only</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">⚠</span>
                        <div>
                          <p className="font-semibold">Performance May Vary</p>
                          <p className="text-xs text-slate-600">Depends on other users' activity</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded border border-slate-300">
                      <p className="text-xs font-semibold text-slate-700 mb-2">Shared Configuration:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-slate-600">CPU:</span> <span className="font-semibold">4 cores*</span></div>
                        <div><span className="text-slate-600">RAM:</span> <span className="font-semibold">16GB*</span></div>
                        <div><span className="text-slate-600">Storage:</span> <span className="font-semibold">200GB SSD</span></div>
                        <div><span className="text-slate-600">Bandwidth:</span> <span className="font-semibold">500GB/mo</span></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">* Shared with other users</p>
                    </div>
                  </div>
                </div>

                {/* Capacity Upgrades */}
                <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Custom Capacity Options Available
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-4 rounded border border-purple-100">
                      <p className="font-semibold text-purple-900 mb-2">CPU Upgrade</p>
                      <ul className="space-y-1 text-slate-700">
                        <li>• 12 cores: +Rs. 15,000/year</li>
                        <li>• 16 cores: +Rs. 25,000/year</li>
                        <li>• 24+ cores: Custom quote</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded border border-purple-100">
                      <p className="font-semibold text-purple-900 mb-2">RAM Upgrade</p>
                      <ul className="space-y-1 text-slate-700">
                        <li>• 48GB: +Rs. 10,000/year</li>
                        <li>• 64GB: +Rs. 18,000/year</li>
                        <li>• 128GB+: Custom quote</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded border border-purple-100">
                      <p className="font-semibold text-purple-900 mb-2">Storage Upgrade</p>
                      <ul className="space-y-1 text-slate-700">
                        <li>• 1TB SSD: +Rs. 12,000/year</li>
                        <li>• 2TB SSD: +Rs. 22,000/year</li>
                        <li>• 5TB+ SSD: Custom quote</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommendation Note */}
                <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="font-semibold text-amber-900">Our Recommendation</p>
                      <p className="text-sm text-amber-800 mt-1">
                        <strong>Dedicated Server</strong> is highly recommended for businesses requiring reliable performance, data security, and scalability. 
                        The <strong>Shared Server</strong> option is suitable for startups or businesses with limited traffic, but may experience slower performance during peak times.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* System Capabilities & Scalability */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  System Capabilities & Scalability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Integration */}
                  <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💳</span>
                      </div>
                      <h4 className="font-bold text-lg text-green-900">Online Payment Integration</h4>
                    </div>
                    <p className="text-sm text-green-800 mb-4">
                      System supports integration with major online payment platforms to enable seamless digital transactions.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">Payment Gateway Integration</p>
                          <p className="text-xs text-green-700">PayPal, Stripe, Square, PayHere (LK)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">Local Payment Options</p>
                          <p className="text-xs text-green-700">Bank transfers, iPay, Genie, eZ Cash</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">International Payments</p>
                          <p className="text-xs text-green-700">Multi-currency support (USD, EUR, GBP, LKR)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">Secure Transactions</p>
                          <p className="text-xs text-green-700">PCI DSS compliant payment processing</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">Automated Reconciliation</p>
                          <p className="text-xs text-green-700">Auto-match payments with invoices</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded border border-green-300">
                      <p className="text-xs font-semibold text-green-900">Integration Cost:</p>
                      <p className="text-sm text-green-800">One-time setup: Rs. 25,000 - 50,000 per gateway</p>
                      <p className="text-xs text-green-700 mt-1">Includes API integration, testing & documentation</p>
                    </div>
                  </div>

                  {/* Inventory Management */}
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h4 className="font-bold text-lg text-blue-900">Large-Scale Inventory Management</h4>
                    </div>
                    <p className="text-sm text-blue-800 mb-4">
                      System designed to handle massive inventory volumes with optimized database performance.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">Unlimited Stock Items</p>
                          <p className="text-xs text-blue-700">Supports millions of SKUs without slowdown</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">Multi-Warehouse Support</p>
                          <p className="text-xs text-blue-700">Track inventory across multiple locations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">Real-Time Stock Updates</p>
                          <p className="text-xs text-blue-700">Instant sync across all sales channels</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">Batch & Serial Number Tracking</p>
                          <p className="text-xs text-blue-700">Complete traceability for compliance</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">Low Stock Alerts</p>
                          <p className="text-xs text-blue-700">Automated notifications & reorder points</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded border border-blue-300">
                      <p className="text-xs font-semibold text-blue-900">Performance Guarantee:</p>
                      <p className="text-sm text-blue-800">&lt; 100ms query time for up to 10M+ items</p>
                      <p className="text-xs text-blue-700 mt-1">Optimized indexing & caching enabled</p>
                    </div>
                  </div>
                </div>

                {/* Additional Capabilities */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <span>🔌</span>
                      API Integration
                    </h5>
                    <ul className="text-sm space-y-1 text-purple-800">
                      <li>• RESTful API available</li>
                      <li>• Third-party app integration</li>
                      <li>• Custom webhooks support</li>
                      <li>• Real-time data sync</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h5 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <span>📊</span>
                      Advanced Analytics
                    </h5>
                    <ul className="text-sm space-y-1 text-amber-800">
                      <li>• Sales trend analysis</li>
                      <li>• Inventory forecasting</li>
                      <li>• Customer behavior insights</li>
                      <li>• Custom report builder</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <h5 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
                      <span>📱</span>
                      Mobile Access
                    </h5>
                    <ul className="text-sm space-y-1 text-teal-800">
                      <li>• Responsive web design</li>
                      <li>• iOS & Android compatible</li>
                      <li>• Offline mode capability</li>
                      <li>• Mobile app available (future)</li>
                    </ul>
                  </div>
                </div>

                {/* Dashboard Customization - Free Service */}
                <div className="mt-6 p-6 bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-300 rounded-lg shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-emerald-900 mb-2">Free Dashboard Customization</h4>
                      <p className="text-base text-emerald-800 mb-4">
                        Complimentary dashboard modifications included with your subscription
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold text-lg">✓</span>
                          <div>
                            <p className="font-semibold text-emerald-900">Add/Remove Features</p>
                            <p className="text-sm text-emerald-700">Customize dashboard options anytime within 6 months</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold text-lg">✓</span>
                          <div>
                            <p className="font-semibold text-emerald-900">No Additional Charges</p>
                            <p className="text-sm text-emerald-700">Free modifications for the first 6 months</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold text-lg">✓</span>
                          <div>
                            <p className="font-semibold text-emerald-900">Layout Adjustments</p>
                            <p className="text-sm text-emerald-700">Rearrange widgets and KPI cards as needed</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold text-lg">✓</span>
                          <div>
                            <p className="font-semibold text-emerald-900">Priority Support</p>
                            <p className="text-sm text-emerald-700">24-48 hour turnaround for customization requests</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-white rounded-lg border-2 border-emerald-400">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🎁</span>
                          <p className="font-bold text-emerald-900">6-Month Free Customization Period</p>
                        </div>
                        <p className="text-sm text-emerald-800">
                          Make unlimited dashboard changes at no extra cost during your first 6 months. Add expense categories, 
                          modify KPI displays, customize reports, or request new dashboard widgets - all included in your subscription.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                            Unlimited Changes
                          </span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                            No Hidden Fees
                          </span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                            Fast Implementation
                          </span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                            Professional Support
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customization Note */}
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 rounded">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🛠️</span>
                    <div>
                      <p className="font-semibold text-indigo-900">Custom Development Available</p>
                      <p className="text-sm text-indigo-800 mt-1">
                        Need specific features? We offer custom development services for payment gateway integrations, 
                        specialized inventory modules, custom reporting, and third-party system integrations. 
                        <strong> Contact us for a detailed quote.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Backup & Data Management */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4 flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Automated Backup & Data Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Google Drive Backup */}
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">☁️</span>
                      </div>
                      <h4 className="font-bold text-lg text-blue-900">Google Drive Integration</h4>
                    </div>
                    <p className="text-sm text-blue-800 mb-4">
                      Automatic cloud backups to Google Drive ensure your business data is always safe and accessible.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">Daily Automated Backups</p>
                          <p className="text-xs text-blue-700">Complete database backup every 24 hours at 2:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">Monthly Archive Backups</p>
                          <p className="text-xs text-blue-700">Full system snapshot on 1st of every month</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">Incremental Backups</p>
                          <p className="text-xs text-blue-700">Changes backed up every 6 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">Encrypted Storage</p>
                          <p className="text-xs text-blue-700">AES-256 encryption for all backup files</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-blue-900">90-Day Retention</p>
                          <p className="text-xs text-blue-700">Automatic cleanup of old backups</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded border border-blue-300">
                      <p className="text-xs font-semibold text-blue-900">Backup Schedule:</p>
                      <p className="text-sm text-blue-800">Daily: 2:00 AM • Incremental: Every 6 hrs • Monthly: 1st of month</p>
                    </div>
                  </div>

                  {/* Historical Data Entry */}
                  <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📅</span>
                      </div>
                      <h4 className="font-bold text-lg text-green-900">Historical Data Import</h4>
                    </div>
                    <p className="text-sm text-green-800 mb-4">
                      Import and manage your complete business history since company incorporation.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">Full History Support</p>
                          <p className="text-xs text-green-700">Enter data from 2021 (incorporation) onwards</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">Bulk Import Tools</p>
                          <p className="text-xs text-green-700">Excel/CSV import for invoices, payments, purchases</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">Data Validation</p>
                          <p className="text-xs text-green-700">Automatic checks for accuracy and completeness</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">Backdated Entries</p>
                          <p className="text-xs text-green-700">Enter historical transactions with correct dates</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold text-green-900">Migration Assistance</p>
                          <p className="text-xs text-green-700">Professional support for data migration</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded border border-green-300">
                      <p className="text-xs font-semibold text-green-900">Supported Data:</p>
                      <p className="text-sm text-green-800">Invoices • Payments • Purchases • CUSDEC • Returns • Tenders • Clients</p>
                    </div>
                  </div>
                </div>

                {/* Backup Features */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <span>🔄</span>
                      One-Click Restore
                    </h5>
                    <ul className="text-sm space-y-1 text-purple-800">
                      <li>• Restore from any backup point</li>
                      <li>• Selective data restoration</li>
                      <li>• Test restore functionality</li>
                      <li>• Disaster recovery ready</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h5 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <span>📊</span>
                      Backup Reports
                    </h5>
                    <ul className="text-sm space-y-1 text-amber-800">
                      <li>• Backup success notifications</li>
                      <li>• Storage usage monitoring</li>
                      <li>• Backup verification logs</li>
                      <li>• Email alerts on failures</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <h5 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
                      <span>💾</span>
                      Storage Options
                    </h5>
                    <ul className="text-sm space-y-1 text-teal-800">
                      <li>• Google Drive (15GB free)</li>
                      <li>• Custom cloud storage</li>
                      <li>• Local server backups</li>
                      <li>• Multi-location redundancy</li>
                    </ul>
                  </div>
                </div>

                {/* Data Migration Note */}
                <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 rounded">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📥</span>
                    <div>
                      <p className="font-semibold text-cyan-900">Historical Data Migration Service</p>
                      <p className="text-sm text-cyan-800 mt-1">
                        We provide <strong>free data migration assistance</strong> to help you import all your business records since 2021. 
                        Our team will guide you through the process, validate data accuracy, and ensure seamless integration into the system. 
                        <strong> Typical migration takes 2-5 business days</strong> depending on data volume.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Security & Compliance */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Compliance
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-center">
                    <p className="font-semibold text-green-900">TLS 1.3</p>
                    <p className="text-xs text-green-600">Encryption</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-center">
                    <p className="font-semibold text-blue-900">AES-256</p>
                    <p className="text-xs text-blue-600">Data at Rest</p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded text-center">
                    <p className="font-semibold text-purple-900">GDPR</p>
                    <p className="text-xs text-purple-600">Compliant</p>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-center">
                    <p className="font-semibold text-amber-900">ISO 27001</p>
                    <p className="text-xs text-amber-600">Guidelines</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-blue-900">Complete Documentation Available</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Detailed cloud deployment guide, security guidelines, and infrastructure recommendations are available in the project documentation.
                    </p>
                    <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
                      View CLOUD_DEPLOYMENT_GUIDE.md →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support & Service */}
        <TabsContent value="support" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-6 w-6 text-green-600" />
                24/7 Support & After-Sale Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-6">
              {/* Support Tiers */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4">Support Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Standard */}
                  <div className="p-6 border-2 border-slate-200 rounded-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📧</span>
                      </div>
                      <div>
                        <h4 className="font-bold">Standard</h4>
                        <p className="text-xs text-slate-500">Included</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Email support</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>24-hour response</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Bug fixes & patches</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Documentation access</span>
                      </div>
                    </div>
                  </div>

                  {/* Premium */}
                  <div className="p-6 border-2 border-blue-500 rounded-lg bg-blue-50 hover:shadow-xl transition-shadow relative">
                    <div className="absolute -top-3 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      POPULAR
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-xl">⭐</span>
                      </div>
                      <div>
                        <h4 className="font-bold">Premium</h4>
                        <p className="text-xs text-blue-600">$1,500/month</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="font-semibold">24/7 support hotline</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>1-hour response time</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Dedicated engineer</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Monthly optimization</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>5 hours development/month</span>
                      </div>
                    </div>
                  </div>

                  {/* Enterprise */}
                  <div className="p-6 border-2 border-purple-500 rounded-lg bg-purple-50 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-xl">👑</span>
                      </div>
                      <div>
                        <h4 className="font-bold">Enterprise</h4>
                        <p className="text-xs text-purple-600">Custom pricing</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="font-semibold">Dedicated account manager</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>15-minute critical response</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>On-site support available</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Unlimited development</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>White-glove service</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4">Emergency Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <h4 className="font-semibold text-red-900 mb-2">Critical Issues (System Down)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">📞</span>
                        <span className="font-mono">+94 11 XXX XXXX</span>
                        <span className="text-xs text-red-600">(24/7)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">✉️</span>
                        <span>emergency@bizmanage.lk</span>
                      </div>
                      <div className="mt-2 text-xs">
                        <p className="font-semibold">Response: 15 minutes</p>
                        <p className="font-semibold">Resolution: 1 hour target</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                    <h4 className="font-semibold text-amber-900 mb-2">High Priority Issues</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600">📞</span>
                        <span className="font-mono">+94 11 YYY YYYY</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600">✉️</span>
                        <span>support@bizmanage.lk</span>
                      </div>
                      <div className="mt-2 text-xs">
                        <p className="font-semibold">Response: 1-2 hours</p>
                        <p className="font-semibold">Resolution: 4 hours target</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* SLA Table */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4">Service Level Agreement (SLA)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-3 text-left">Priority</th>
                        <th className="border border-slate-300 p-3 text-left">Response Time</th>
                        <th className="border border-slate-300 p-3 text-left">Resolution Time</th>
                        <th className="border border-slate-300 p-3 text-left">Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-3 font-semibold text-red-700">Critical</td>
                        <td className="border border-slate-300 p-3">15 minutes</td>
                        <td className="border border-slate-300 p-3">1 hour</td>
                        <td className="border border-slate-300 p-3">24/7</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 p-3 font-semibold text-orange-700">High</td>
                        <td className="border border-slate-300 p-3">1 hour</td>
                        <td className="border border-slate-300 p-3">4 hours</td>
                        <td className="border border-slate-300 p-3">24/7</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-3 font-semibold text-yellow-700">Medium</td>
                        <td className="border border-slate-300 p-3">4 hours</td>
                        <td className="border border-slate-300 p-3">8 hours</td>
                        <td className="border border-slate-300 p-3">Business hours</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 p-3 font-semibold text-green-700">Low</td>
                        <td className="border border-slate-300 p-3">24 hours</td>
                        <td className="border border-slate-300 p-3">72 hours</td>
                        <td className="border border-slate-300 p-3">Business hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              {/* Developer Guarantees */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2B4A] mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Developer Guarantees
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-3">Performance Guarantees</h4>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>✅ Page load time: &lt; 2 seconds</li>
                      <li>✅ API response: &lt; 500ms</li>
                      <li>✅ Support 1000+ concurrent users</li>
                      <li>✅ 90%+ test coverage</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">Deployment Assistance</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>✅ Cloud infrastructure setup</li>
                      <li>✅ Database migration support</li>
                      <li>✅ SSL certificate configuration</li>
                      <li>✅ Complete documentation</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Headphones className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Documentation
                </Button>
                <Button variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Upgrade Support Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Data Management */}
        <TabsContent value="backup" className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Quick Backup Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 h-20"
                  onClick={() => {
                    toast.success("Backup initiated! This may take a few minutes.");
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Award className="h-6 w-6" />
                    <span>Backup Now</span>
                  </div>
                </Button>
                <Button 
                  variant="outline"
                  className="h-20 border-2"
                  onClick={() => {
                    toast.info("Opening restore wizard...");
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Restore Data</span>
                  </div>
                </Button>
                <Button 
                  variant="outline"
                  className="h-20 border-2"
                  onClick={() => {
                    toast.info("Downloading backup history report...");
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span>View History</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup Schedule Configuration */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Automated Backup Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Daily Backup</h4>
                      <p className="text-sm text-gray-600">Full system backup at 2:00 AM</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Monthly Archive</h4>
                      <p className="text-sm text-gray-600">Complete backup on 1st of month</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Incremental Backup</h4>
                      <p className="text-sm text-gray-600">Every 6 hours (changes only)</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Real-time Sync</h4>
                      <p className="text-sm text-gray-600">Critical data sync every hour</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label>Backup Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days (Recommended)</SelectItem>
                    <SelectItem value="180">180 Days</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Backup Time (Daily)</Label>
                <Select defaultValue="2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">12:00 AM</SelectItem>
                    <SelectItem value="1">1:00 AM</SelectItem>
                    <SelectItem value="2">2:00 AM (Recommended)</SelectItem>
                    <SelectItem value="3">3:00 AM</SelectItem>
                    <SelectItem value="4">4:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Google Drive Integration */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Cloud Storage Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Primary Storage</Label>
                  <Select defaultValue="gdrive">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gdrive">Google Drive</SelectItem>
                      <SelectItem value="onedrive">Microsoft OneDrive</SelectItem>
                      <SelectItem value="dropbox">Dropbox</SelectItem>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="local">Local Storage Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Backup Folder Path</Label>
                  <Input defaultValue="/BizManage/Backups" />
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-green-900">Google Drive Connected</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Account: bizmanage@company.com
                    </p>
                    <p className="text-sm text-green-700">
                      Storage Used: 45.2 GB / 100 GB
                    </p>
                    <Button variant="link" className="text-green-700 p-0 h-auto mt-2">
                      Manage Connection
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Encryption</Label>
                  <span className="text-sm text-green-600 font-medium">AES-256 Enabled</span>
                </div>
                <Input 
                  type="password" 
                  placeholder="Encryption Key" 
                  defaultValue="••••••••••••••••"
                />
                <p className="text-xs text-gray-500">
                  All backups are encrypted with AES-256 before upload
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Backups */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Recent Backups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "2024-01-15 02:00 AM", type: "Daily Full Backup", size: "1.2 GB", status: "Success" },
                  { date: "2024-01-14 08:00 PM", type: "Incremental", size: "45 MB", status: "Success" },
                  { date: "2024-01-14 02:00 PM", type: "Incremental", size: "32 MB", status: "Success" },
                  { date: "2024-01-14 08:00 AM", type: "Incremental", size: "28 MB", status: "Success" },
                  { date: "2024-01-14 02:00 AM", type: "Daily Full Backup", size: "1.18 GB", status: "Success" },
                  { date: "2024-01-01 02:00 AM", type: "Monthly Archive", size: "1.5 GB", status: "Success" },
                ].map((backup, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{backup.type}</p>
                        <p className="text-sm text-gray-600">{backup.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{backup.size}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {backup.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast.info(`Restore from ${backup.date}?`);
                        }}
                      >
                        Restore
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast.info(`Downloading backup from ${backup.date}...`);
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Import/Export */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Data Import & Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Import Historical Data</h3>
                  <p className="text-sm text-gray-600">
                    Import data from previous systems or Excel files dating back to company incorporation (2021)
                  </p>
                  <div className="space-y-2">
                    <Label>Data Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoices">Invoices</SelectItem>
                        <SelectItem value="payments">Payments</SelectItem>
                        <SelectItem value="clients">Clients</SelectItem>
                        <SelectItem value="purchases">Purchase Orders</SelectItem>
                        <SelectItem value="cusdec">CUSDEC Records</SelectItem>
                        <SelectItem value="all">All Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" defaultValue="2021-01-01" />
                      <Input type="date" defaultValue="2024-01-15" />
                    </div>
                  </div>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Import from Excel/CSV
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Export Data</h3>
                  <p className="text-sm text-gray-600">
                    Export your data to Excel, CSV, or PDF format for external use or archiving
                  </p>
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="excel">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="json">JSON (API)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Selection</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Data</SelectItem>
                        <SelectItem value="year">Current Year</SelectItem>
                        <SelectItem value="month">Current Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Award className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Free Data Migration Service</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Our team can help you migrate data from your existing systems. We support:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>• Excel spreadsheets and CSV files</li>
                  <li>• QuickBooks, Tally, and other accounting software</li>
                  <li>• Custom database exports</li>
                  <li>• Historical records dating back to 2021</li>
                </ul>
                <Button variant="outline" className="mt-3 border-blue-300 text-blue-700">
                  Request Migration Assistance
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup Statistics */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Backup Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Backups</p>
                  <p className="text-2xl font-bold text-blue-900">342</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-green-900">99.7%</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Storage</p>
                  <p className="text-2xl font-bold text-purple-900">45.2 GB</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Last Backup</p>
                  <p className="text-2xl font-bold text-orange-900">2h ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              onClick={() => {
                toast.success("Backup settings saved successfully!");
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                toast.info("Opening advanced backup configuration...");
              }}
            >
              Advanced Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
