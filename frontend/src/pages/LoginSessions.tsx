import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LoginSession, LoginAlert } from '../types';
import {
  Shield,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Globe,
  User,
  Key,
  Activity,
  LogOut,
  Lock,
  Unlock,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { authService } from '../services/auth';

export function LoginSessions() {
  const userHasAccess = authService.hasPermission('users', 'read');

  if (!userHasAccess) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have permission to view login sessions.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<LoginAlert[]>([]);

  // Load sessions from localStorage or use default mock data
  const getInitialSessions = (): LoginSession[] => {
    const savedSessions = localStorage.getItem('loginSessions');
    if (savedSessions) {
      return JSON.parse(savedSessions);
    }
    return [
    {
      id: '1',
      userId: 'U001',
      userName: 'Mr. Rajapaksha',
      userEmail: 'director@bizmanage.lk',
      userRole: 'director',
      loginTime: '2024-12-11T08:15:30',
      ipAddress: '192.168.1.105',
      location: 'Colombo, Sri Lanka',
      device: 'Windows 11 Desktop',
      browser: 'Chrome 120',
      isActive: true,
      otpVerified: true,
      otpMethod: 'email',
      sessionDuration: 245,
      activities: [
        { id: 'a1', action: 'Viewed', module: 'Dashboard', timestamp: '2024-12-11T08:16:00', details: 'Accessed main dashboard' },
        { id: 'a2', action: 'Generated', module: 'Reports', timestamp: '2024-12-11T08:25:00', details: 'Financial report Q4' },
        { id: 'a3', action: 'Approved', module: 'Tenders', timestamp: '2024-12-11T11:30:00', details: 'Tender TDR-2024-001' },
      ],
    },
    {
      id: '2',
      userId: 'U002',
      userName: 'Ms. Perera',
      userEmail: 'audit@bizmanage.lk',
      userRole: 'audit',
      loginTime: '2024-12-11T09:00:15',
      ipAddress: '192.168.1.112',
      location: 'Colombo, Sri Lanka',
      device: 'MacBook Pro',
      browser: 'Safari 17',
      isActive: true,
      otpVerified: true,
      otpMethod: 'app',
      sessionDuration: 185,
      activities: [
        { id: 'a4', action: 'Reviewed', module: 'Invoices', timestamp: '2024-12-11T09:15:00', details: 'Invoice audit check' },
        { id: 'a5', action: 'Exported', module: 'Reports', timestamp: '2024-12-11T10:30:00', details: 'VAT report export' },
      ],
    },
    {
      id: '3',
      userId: 'U003',
      userName: 'Mr. Fernando',
      userEmail: 'accounts@bizmanage.lk',
      userRole: 'accounts',
      loginTime: '2024-12-11T08:30:00',
      logoutTime: '2024-12-11T12:00:00',
      ipAddress: '192.168.1.118',
      location: 'Colombo, Sri Lanka',
      device: 'Windows 10 Laptop',
      browser: 'Edge 120',
      isActive: false,
      otpVerified: true,
      otpMethod: 'sms',
      sessionDuration: 210,
      activities: [
        { id: 'a6', action: 'Created', module: 'Invoices', timestamp: '2024-12-11T08:45:00', details: 'Invoice INV-2024-125' },
        { id: 'a7', action: 'Updated', module: 'Payments', timestamp: '2024-12-11T10:15:00', details: 'Payment PAY-2024-089' },
        { id: 'a8', action: 'Reconciled', module: 'Payments', timestamp: '2024-12-11T11:30:00', details: 'Bank reconciliation' },
      ],
    },
    {
      id: '4',
      userId: 'U004',
      userName: 'Ms. Silva',
      userEmail: 'executive@bizmanage.lk',
      userRole: 'executive',
      loginTime: '2024-12-11T10:15:00',
      ipAddress: '10.20.5.45',
      location: 'Kandy, Sri Lanka',
      device: 'iPad Pro',
      browser: 'Safari Mobile',
      isActive: true,
      otpVerified: true,
      otpMethod: 'email',
      sessionDuration: 105,
      activities: [
        { id: 'a9', action: 'Viewed', module: 'Clients', timestamp: '2024-12-11T10:20:00', details: 'Client list review' },
        { id: 'a10', action: 'Updated', module: 'Clients', timestamp: '2024-12-11T11:00:00', details: 'Client contact update' },
      ],
    },
    {
      id: '5',
      userId: 'U005',
      userName: 'Mr. Jayawardena',
      userEmail: 'coordinator@bizmanage.lk',
      userRole: 'coordinator',
      loginTime: '2024-12-11T09:30:00',
      ipAddress: '203.115.45.120',
      location: 'Galle, Sri Lanka',
      device: 'Android Phone',
      browser: 'Chrome Mobile',
      isActive: true,
      otpVerified: true,
      otpMethod: 'sms',
      sessionDuration: 150,
      activities: [
        { id: 'a11', action: 'Created', module: 'Tenders', timestamp: '2024-12-11T09:45:00', details: 'New quotation entry' },
        { id: 'a12', action: 'Uploaded', module: 'Tenders', timestamp: '2024-12-11T10:30:00', details: 'Tender documents' },
      ],
    },
    {
      id: '6',
      userId: 'U003',
      userName: 'Mr. Fernando',
      userEmail: 'accounts@bizmanage.lk',
      userRole: 'accounts',
      loginTime: '2024-12-11T07:00:00',
      ipAddress: '45.78.120.55',
      location: 'Mumbai, India',
      device: 'Unknown Device',
      browser: 'Chrome 115',
      isActive: false,
      otpVerified: false,
      sessionDuration: 0,
      activities: [],
    },
    {
      id: '7',
      userId: 'U006',
      userName: 'Dr. Wijesinghe',
      userEmail: 'manager@bizmanage.lk',
      userRole: 'manager',
      loginTime: '2024-12-11T08:45:00',
      logoutTime: '2024-12-11T11:15:00',
      ipAddress: '192.168.1.125',
      location: 'Colombo, Sri Lanka',
      device: 'Windows 11 Desktop',
      browser: 'Firefox 121',
      isActive: false,
      otpVerified: true,
      otpMethod: 'app',
      sessionDuration: 150,
      activities: [
        { id: 'a13', action: 'Reviewed', module: 'Returns', timestamp: '2024-12-11T09:00:00', details: 'Return approvals' },
        { id: 'a14', action: 'Approved', module: 'Returns', timestamp: '2024-12-11T10:00:00', details: 'Return RET-2024-015' },
      ],
    },
  ];
  };

  const [sessions, setSessions] = useState<LoginSession[]>(getInitialSessions());

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('loginSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Mock login alerts
  useEffect(() => {
    const mockAlerts: LoginAlert[] = [
      {
        id: 'LA001',
        userId: 'U003',
        userName: 'Mr. Fernando',
        userRole: 'accounts',
        loginTime: '2024-12-11T07:00:00',
        location: 'Mumbai, India',
        ipAddress: '45.78.120.55',
        device: 'Unknown Device',
        isUnusualLocation: true,
        isMultipleSession: false,
        otpRequired: true,
        status: 'blocked',
        alertSent: true,
        alertType: 'email',
      },
      {
        id: 'LA002',
        userId: 'U004',
        userName: 'Ms. Silva',
        userRole: 'executive',
        loginTime: '2024-12-11T10:15:00',
        location: 'Kandy, Sri Lanka',
        ipAddress: '10.20.5.45',
        device: 'iPad Pro',
        isUnusualLocation: false,
        isMultipleSession: false,
        otpRequired: true,
        status: 'success',
        alertSent: true,
        alertType: 'sms',
      },
      {
        id: 'LA003',
        userId: 'U001',
        userName: 'Mr. Rajapaksha',
        userRole: 'director',
        loginTime: '2024-12-11T08:15:30',
        location: 'Colombo, Sri Lanka',
        ipAddress: '192.168.1.105',
        device: 'Windows 11 Desktop',
        isUnusualLocation: false,
        isMultipleSession: false,
        otpRequired: true,
        status: 'success',
        alertSent: true,
        alertType: 'email',
      },
    ];
    setAlerts(mockAlerts);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.ipAddress.includes(searchTerm) ||
      session.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || session.userRole === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && session.isActive) ||
                         (statusFilter === 'inactive' && !session.isActive) ||
                         (statusFilter === 'otp' && session.otpVerified);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleTerminateSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Update session to inactive status
    setSessions(prevSessions =>
      prevSessions.map(s =>
        s.id === sessionId
          ? { ...s, isActive: false, logoutTime: new Date().toISOString() }
          : s
      )
    );

    toast.success(`Session terminated for ${session.userName}`);
  };

  const handleBlockUser = (userId: string) => {
    const userSessions = sessions.filter(s => s.userId === userId);
    
    // Terminate all sessions for this user
    setSessions(prevSessions =>
      prevSessions.map(s =>
        s.userId === userId
          ? { ...s, isActive: false, logoutTime: new Date().toISOString() }
          : s
      )
    );

    toast.warning(`All sessions blocked for user ${userSessions[0]?.userName || userId}`);
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      director: 'bg-purple-100 text-purple-800 border-purple-300',
      audit: 'bg-blue-100 text-blue-800 border-blue-300',
      accounts: 'bg-green-100 text-green-800 border-green-300',
      executive: 'bg-amber-100 text-amber-800 border-amber-300',
      coordinator: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      manager: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      staff: 'bg-slate-100 text-slate-800 border-slate-300',
      admin: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <Badge variant="outline" className={`${styles[role as keyof typeof styles]} font-semibold`}>
        {role.toUpperCase()}
      </Badge>
    );
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('phone') || device.toLowerCase().includes('android') || device.toLowerCase().includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (device.toLowerCase().includes('ipad') || device.toLowerCase().includes('tablet')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const stats = {
    totalSessions: sessions.length,
    activeSessions: sessions.filter(s => s.isActive).length,
    totalUsers: new Set(sessions.map(s => s.userId)).size,
    unusualLogins: alerts.filter(a => a.isUnusualLocation).length,
    blockedAttempts: alerts.filter(a => a.status === 'blocked').length,
    otpVerified: sessions.filter(s => s.otpVerified).length,
  };

  // Handle KPI card clicks to filter sessions
  const handleStatCardClick = (filterType: string, label: string) => {
    switch (filterType) {
      case 'all':
        setStatusFilter('all');
        setRoleFilter('all');
        toast.info(`Showing all ${stats.totalSessions} sessions`);
        break;
      case 'active':
        setStatusFilter('active');
        setRoleFilter('all');
        toast.success(`Showing ${stats.activeSessions} active sessions`);
        break;
      case 'inactive':
        setStatusFilter('inactive');
        setRoleFilter('all');
        toast.info(`Showing inactive sessions`);
        break;
      case 'otp':
        setStatusFilter('otp');
        setRoleFilter('all');
        toast.success(`Showing ${stats.otpVerified} OTP verified sessions`);
        break;
      case 'unusual':
        toast.warning(`${stats.unusualLogins} unusual location(s) detected - Check security alerts above`);
        break;
      case 'blocked':
        toast.error(`${stats.blockedAttempts} blocked attempt(s) - Check security alerts above`);
        break;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A2B4A]">Login Sessions & Activity</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor user authentication and system access</p>
        </div>
      </div>

      {/* Security Alerts */}
      {alerts.filter(a => a.isUnusualLocation || a.status === 'blocked').length > 0 && (
        <div className="space-y-3">
          {alerts.filter(a => a.isUnusualLocation || a.status === 'blocked').map((alert) => (
            <Alert
              key={alert.id}
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
                alert.status === 'blocked'
                  ? 'border-red-500 bg-red-50 hover:bg-red-100'
                  : 'border-amber-500 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className={`h-4 w-4 ${
                alert.status === 'blocked' ? 'text-red-600' : 'text-amber-600'
              }`} />
              <AlertTitle className="font-semibold">
                {alert.status === 'blocked' ? '🚨 Blocked Login Attempt' : '⚠️ Unusual Login Location'}
              </AlertTitle>
              <AlertDescription>
                <span className="font-semibold">{alert.userName}</span> ({alert.userRole}) attempted login from{' '}
                <span className="font-semibold">{alert.location}</span> at{' '}
                {new Date(alert.loginTime).toLocaleString()}
                {alert.alertSent && (
                  <span className="ml-2 text-xs">
                    • Alert sent via {alert.alertType}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card 
          className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 text-blue-50 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleStatCardClick('all', 'Total Sessions')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-900/30 rounded-lg backdrop-blur-sm">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Total</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalSessions}</p>
            <p className="text-blue-100 text-xs">Sessions</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-emerald-500 via-green-600 to-green-700 text-emerald-50 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleStatCardClick('active', 'Active Sessions')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-900/30 rounded-lg backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Active</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.activeSessions}</p>
            <p className="text-emerald-100 text-xs">Online Now</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 text-indigo-50 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleStatCardClick('all', 'Unique Users')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-900/30 rounded-lg backdrop-blur-sm">
                <User className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Users</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalUsers}</p>
            <p className="text-indigo-100 text-xs">Unique</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-teal-500 via-cyan-600 to-teal-700 text-teal-50 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleStatCardClick('otp', 'OTP Verified')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-teal-900/30 rounded-lg backdrop-blur-sm">
                <Key className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">OTP</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.otpVerified}</p>
            <p className="text-teal-100 text-xs">Verified</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 text-amber-50 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleStatCardClick('unusual', 'Unusual Locations')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-900/30 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Unusual</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.unusualLogins}</p>
            <p className="text-amber-100 text-xs">Locations</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-red-500 via-rose-600 to-red-700 text-red-50 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleStatCardClick('blocked', 'Blocked Attempts')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-900/30 rounded-lg backdrop-blur-sm">
                <XCircle className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Blocked</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.blockedAttempts}</p>
            <p className="text-red-100 text-xs">Attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, IP, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Shield className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
                <SelectItem value="accounts">Accounts</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="coordinator">Coordinator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card 
            key={session.id} 
            className={`hover:shadow-2xl transition-all duration-300 border-l-4 ${
              session.isActive ? 'border-l-green-500' : 'border-l-slate-400'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    session.isActive ? 'bg-green-100' : 'bg-slate-100'
                  }`}>
                    {session.isActive ? (
                      <Unlock className="h-5 w-5 text-green-600" />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-[#1A2B4A]">
                        {session.userName}
                      </h3>
                      {getRoleBadge(session.userRole)}
                      {session.isActive && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          🟢 ACTIVE
                        </Badge>
                      )}
                      {session.otpVerified && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          🔐 OTP Verified
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{session.userEmail}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Login Time
                        </p>
                        <p className="font-semibold">{new Date(session.loginTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Location
                        </p>
                        <p className="font-semibold">{session.location}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          <Globe className="h-3 w-3" /> IP Address
                        </p>
                        <p className="font-semibold font-mono text-xs">{session.ipAddress}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          {getDeviceIcon(session.device)} Device
                        </p>
                        <p className="font-semibold text-xs">{session.device}</p>
                      </div>
                    </div>

                    {session.otpMethod && (
                      <div className="mt-3 p-2 bg-blue-50 rounded flex items-center gap-2 text-sm">
                        {session.otpMethod === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                        {session.otpMethod === 'sms' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                        {session.otpMethod === 'app' && <Smartphone className="h-4 w-4 text-blue-600" />}
                        <span className="text-blue-800">
                          OTP verified via {session.otpMethod.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {expandedSession === session.id && session.activities && session.activities.length > 0 && (
                      <div className="mt-4 p-4 bg-slate-50 rounded animate-in slide-in-from-top duration-300">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Session Activities ({session.activities.length})
                        </h4>
                        <div className="space-y-2">
                          {session.activities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 text-sm border-l-2 border-blue-400 pl-3 py-1">
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {activity.action} - {activity.module}
                                </p>
                                <p className="text-slate-600 text-xs">{activity.details}</p>
                              </div>
                              <span className="text-xs text-slate-500">
                                {new Date(activity.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {session.isActive && (
                    <Button
                      onClick={() => handleTerminateSession(session.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Terminate
                    </Button>
                  )}
                  {session.activities && session.activities.length > 0 && (
                    <Button
                      onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                      variant="outline"
                      size="sm"
                    >
                      {expandedSession === session.id ? (
                        <><ChevronUp className="h-4 w-4 mr-1" /> Hide</>
                      ) : (
                        <><ChevronDown className="h-4 w-4 mr-1" /> Activities</>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {session.sessionDuration !== undefined && (
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Session Duration: <span className="font-semibold">{session.sessionDuration} minutes</span>
                  </span>
                  {session.logoutTime && (
                    <span className="text-slate-600">
                      Logged out: <span className="font-semibold">{new Date(session.logoutTime).toLocaleString()}</span>
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
