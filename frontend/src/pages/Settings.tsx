import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { 
  Building2, 
  Users, 
  Bell, 
  Shield,
  Palette,
  Save
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export function Settings() {
  const handleSaveCompanyInfo = () => {
    toast.success('Company information saved successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved successfully');
  };

  const handleSaveSecuritySettings = () => {
    toast.success('Security settings updated successfully');
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully');
  };

  const handleAddUser = () => {
    toast.info('Add user dialog opened');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 lg:w-auto">
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
                {[
                  { name: 'Ravindu Perera', email: 'ravindu@company.lk', role: 'Admin', avatar: 'RP' },
                  { name: 'Samantha Silva', email: 'samantha@company.lk', role: 'Accountant', avatar: 'SS' },
                  { name: 'Kasun Fernando', email: 'kasun@company.lk', role: 'Manager', avatar: 'KF' },
                  { name: 'Nisha Wickramasinghe', email: 'nisha@company.lk', role: 'Staff', avatar: 'NW' },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
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
                        onClick={() => toast.info(`Editing user ${user.name}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                      onClick={() => toast.info(`Configuring ${roleItem.role} permissions`)}
                    >
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: 'Invoice payment received', description: 'Get notified when a client pays an invoice' },
                { label: 'Invoice overdue', description: 'Receive alerts for overdue invoices' },
                { label: 'VAT filing reminders', description: 'Reminders before VAT submission deadlines' },
                { label: 'New purchase order', description: 'Notifications for new purchase orders' },
                { label: 'Weekly reports', description: 'Receive weekly summary reports' },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p>{notification.label}</p>
                    <p className="text-sm text-slate-500 mt-1">{notification.description}</p>
                  </div>
                  <Switch defaultChecked={index < 3} />
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
                  <Input id="current-password" type="password" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="mt-2" />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p>Enable 2FA for extra security</p>
                    <p className="text-sm text-slate-500 mt-1">Protect your account with an additional verification step</p>
                  </div>
                  <Switch />
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
                >
                  <Save className="h-4 w-4 mr-2" />
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
                <h4>Display Options</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p>Compact View</p>
                    <p className="text-sm text-slate-500 mt-1">Show more data in tables</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>Dark Mode</p>
                    <p className="text-sm text-slate-500 mt-1">Use dark theme across the app</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>Animations</p>
                    <p className="text-sm text-slate-500 mt-1">Enable smooth transitions and effects</p>
                  </div>
                  <Switch defaultChecked />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
