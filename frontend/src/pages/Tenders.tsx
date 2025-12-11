import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TenderPrint } from '../components/TenderPrint';
import { Tender } from '../types';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Plus,
  Shield,
  Award,
  DollarSign,
  TrendingUp,
  FileCheck,
  Building,
  ChevronDown,
  ChevronUp,
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';

export function Tenders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [printTender, setPrintTender] = useState<Tender | null>(null);
  const [expandedTender, setExpandedTender] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Array<{ type: string; message: string; count: number }>>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Calculate days to deadline
  const getDaysToDeadline = (deadline: string): number => {
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysToExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Mock tenders data
  const [tenders, setTenders] = useState<Tender[]>([
    {
      id: '1',
      tenderNumber: 'TDR-2024-001',
      title: 'Supply of Office Equipment',
      client: 'Ministry of Education',
      description: 'Supply and installation of computer equipment for regional offices',
      value: 15000000,
      currency: 'Rs',
      status: 'pending',
      type: 'tender',
      publishDate: '2024-11-01',
      deadline: '2024-12-20',
      location: 'Colombo, Sri Lanka',
      bidSecurityRequired: true,
      bidSecurityAmount: 750000,
      bidSecurityType: 'bank_guarantee',
      bidSecurityBankName: 'Commercial Bank',
      bidSecurityReferenceNumber: 'BG/2024/10015',
      bidSecurityIssueDate: '2024-11-05',
      bidSecurityExpiryDate: '2025-01-20',
      bidSecurityStatus: 'submitted',
      performanceSecurityRequired: true,
      performanceSecurityAmount: 1500000,
      performanceSecurityType: 'bank_guarantee',
      pca1Required: true,
      pca1ExpiryDate: '2025-06-30',
      pca1Status: 'approved',
      technicalDocumentsRequired: ['Technical Specifications', 'Product Catalog', 'Installation Plan'],
      financialDocumentsRequired: ['Audited Accounts', 'Bank Statements', 'Tax Clearance'],
      otherDocumentsRequired: ['Company Registration', 'VAT Registration'],
      contactPerson: 'Mr. Perera',
      contactEmail: 'procurement@education.gov.lk',
      contactPhone: '+94 11 234 5678',
      priority: 'high',
    },
    {
      id: '2',
      tenderNumber: 'QTN-2024-089',
      title: 'Construction Materials Supply',
      client: 'ABC Construction Ltd',
      value: 8500000,
      currency: 'Rs',
      status: 'submitted',
      type: 'quotation',
      publishDate: '2024-11-15',
      deadline: '2024-12-15',
      submissionDate: '2024-12-10',
      location: 'Kandy',
      bidSecurityRequired: false,
      performanceSecurityRequired: true,
      performanceSecurityAmount: 850000,
      performanceSecurityType: 'bank_guarantee',
      performanceSecurityExpiryDate: '2025-06-15',
      performanceSecurityStatus: 'pending',
      pca1Required: false,
      technicalDocumentsRequired: ['Material Certificates', 'Quality Assurance Documents'],
      financialDocumentsRequired: ['Price Breakdown'],
      otherDocumentsRequired: [],
      contactPerson: 'Ms. Silva',
      contactEmail: 'procurement@abccons.lk',
      contactPhone: '+94 81 223 4567',
      priority: 'medium',
    },
    {
      id: '3',
      tenderNumber: 'TDR-2024-002',
      title: 'IT Infrastructure Upgrade',
      client: 'Central Bank',
      description: 'Network infrastructure upgrade for main branch and 25 regional branches',
      value: 45000000,
      currency: 'Rs',
      status: 'pending',
      type: 'tender',
      publishDate: '2024-10-20',
      deadline: '2024-12-12',
      location: 'Colombo',
      bidSecurityRequired: true,
      bidSecurityAmount: 2250000,
      bidSecurityType: 'bank_guarantee',
      bidSecurityBankName: 'Bank of Ceylon',
      bidSecurityReferenceNumber: 'BG/2024/20045',
      bidSecurityIssueDate: '2024-10-25',
      bidSecurityExpiryDate: '2025-01-15',
      bidSecurityStatus: 'submitted',
      performanceSecurityRequired: true,
      performanceSecurityAmount: 4500000,
      performanceSecurityType: 'bank_guarantee',
      performanceSecurityExpiryDate: '2026-01-15',
      pca1Required: true,
      pca1ExpiryDate: '2025-12-31',
      pca1Status: 'approved',
      technicalDocumentsRequired: ['System Architecture', 'Security Protocols', 'Implementation Plan'],
      financialDocumentsRequired: ['Financial Statements', 'Credit Rating', 'Bank References'],
      otherDocumentsRequired: ['ISO Certification', 'Previous Project References'],
      contactPerson: 'Mr. Fernando',
      contactEmail: 'it.procurement@centralbank.lk',
      contactPhone: '+94 11 247 8900',
      notes: 'Urgent requirement. Fast-track evaluation process.',
      priority: 'urgent',
      alertDays: 7,
    },
    {
      id: '4',
      tenderNumber: 'RFQ-2024-034',
      title: 'Vehicle Fleet Maintenance',
      client: 'Transport Board',
      value: 3200000,
      currency: 'Rs',
      status: 'won',
      type: 'rfq',
      publishDate: '2024-10-01',
      deadline: '2024-11-10',
      submissionDate: '2024-11-08',
      resultDate: '2024-11-20',
      location: 'Galle',
      bidSecurityRequired: false,
      performanceSecurityRequired: true,
      performanceSecurityAmount: 320000,
      performanceSecurityType: 'bank_guarantee',
      performanceSecurityBankName: 'People\'s Bank',
      performanceSecurityReferenceNumber: 'BG/2024/30012',
      performanceSecurityIssueDate: '2024-11-25',
      performanceSecurityExpiryDate: '2025-05-30',
      performanceSecurityStatus: 'submitted',
      pca1Required: false,
      technicalDocumentsRequired: ['Service Capacity Certificate'],
      financialDocumentsRequired: ['Price Schedule'],
      otherDocumentsRequired: ['Trade License'],
      contactPerson: 'Mr. Jayawardena',
      priority: 'low',
    },
    {
      id: '5',
      tenderNumber: 'TDR-2024-003',
      title: 'Medical Equipment Supply',
      client: 'Ministry of Health',
      description: 'Supply of medical diagnostic equipment for 15 district hospitals',
      value: 125000000,
      currency: 'Rs',
      status: 'pending',
      type: 'tender',
      publishDate: '2024-11-10',
      deadline: '2025-01-05',
      location: 'Nationwide',
      bidSecurityRequired: true,
      bidSecurityAmount: 6250000,
      bidSecurityType: 'bank_guarantee',
      bidSecurityBankName: 'Sampath Bank',
      bidSecurityReferenceNumber: 'BG/2024/40078',
      bidSecurityIssueDate: '2024-11-15',
      bidSecurityExpiryDate: '2025-02-05',
      bidSecurityStatus: 'submitted',
      performanceSecurityRequired: true,
      performanceSecurityAmount: 12500000,
      performanceSecurityType: 'bank_guarantee',
      pca1Required: true,
      pca1ExpiryDate: '2025-08-31',
      pca1Status: 'pending',
      technicalDocumentsRequired: ['Equipment Specifications', 'CE Certification', 'Installation Manual', 'Training Plan'],
      financialDocumentsRequired: ['Company Financials', 'Bank Guarantee', 'Tax Returns'],
      otherDocumentsRequired: ['FDA Approval', 'Warranty Certificate', 'After-sales Service Agreement'],
      contactPerson: 'Dr. Wijesinghe',
      contactEmail: 'medical.procurement@health.gov.lk',
      contactPhone: '+94 11 269 1234',
      priority: 'urgent',
      alertDays: 14,
    },
    {
      id: '6',
      tenderNumber: 'BID-2024-015',
      title: 'Road Development Project',
      client: 'Road Development Authority',
      value: 280000000,
      currency: 'Rs',
      status: 'lost',
      type: 'bid',
      publishDate: '2024-08-15',
      deadline: '2024-10-30',
      submissionDate: '2024-10-28',
      resultDate: '2024-11-25',
      location: 'Matara District',
      bidSecurityRequired: true,
      bidSecurityAmount: 14000000,
      bidSecurityType: 'bank_guarantee',
      bidSecurityStatus: 'returned',
      performanceSecurityRequired: true,
      pca1Required: true,
      pca1Status: 'approved',
      technicalDocumentsRequired: ['Engineering Designs', 'Environmental Impact Assessment'],
      financialDocumentsRequired: ['Project Financing Plan', 'Audited Accounts'],
      otherDocumentsRequired: ['CIDA Registration', 'ICTAD Grading'],
      priority: 'medium',
    },
  ]);

  useEffect(() => {
    checkForAlerts();
  }, [tenders]);

  const checkForAlerts = () => {
    const newAlerts = [];
    
    // Deadline approaching
    const dueSoon = tenders.filter(t => {
      if (t.status !== 'pending') return false;
      const daysTo = getDaysToDeadline(t.deadline);
      return daysTo >= 0 && daysTo <= 7;
    });
    if (dueSoon.length > 0) {
      newAlerts.push({
        type: 'warning',
        message: `${dueSoon.length} tender deadline(s) approaching within 7 days`,
        count: dueSoon.length,
      });
    }

    // Overdue deadlines
    const overdue = tenders.filter(t => {
      if (t.status !== 'pending') return false;
      return getDaysToDeadline(t.deadline) < 0;
    });
    if (overdue.length > 0) {
      newAlerts.push({
        type: 'error',
        message: `${overdue.length} tender(s) past submission deadline`,
        count: overdue.length,
      });
    }

    // Bid security expiring
    const bidSecExpiring = tenders.filter(t => {
      if (!t.bidSecurityRequired || !t.bidSecurityExpiryDate) return false;
      if (t.bidSecurityStatus === 'expired' || t.bidSecurityStatus === 'returned') return false;
      const daysTo = getDaysToExpiry(t.bidSecurityExpiryDate);
      return daysTo >= 0 && daysTo <= 30;
    });
    if (bidSecExpiring.length > 0) {
      newAlerts.push({
        type: 'warning',
        message: `${bidSecExpiring.length} bid security guarantee(s) expiring within 30 days`,
        count: bidSecExpiring.length,
      });
    }

    // Performance security expiring
    const perfSecExpiring = tenders.filter(t => {
      if (!t.performanceSecurityRequired || !t.performanceSecurityExpiryDate) return false;
      if (t.performanceSecurityStatus === 'expired' || t.performanceSecurityStatus === 'returned') return false;
      const daysTo = getDaysToExpiry(t.performanceSecurityExpiryDate);
      return daysTo >= 0 && daysTo <= 30;
    });
    if (perfSecExpiring.length > 0) {
      newAlerts.push({
        type: 'info',
        message: `${perfSecExpiring.length} performance security guarantee(s) expiring within 30 days`,
        count: perfSecExpiring.length,
      });
    }

    // PCA1 expiring
    const pca1Expiring = tenders.filter(t => {
      if (!t.pca1Required || !t.pca1ExpiryDate) return false;
      if (t.pca1Status === 'expired' || t.pca1Status === 'rejected') return false;
      const daysTo = getDaysToExpiry(t.pca1ExpiryDate);
      return daysTo >= 0 && daysTo <= 60;
    });
    if (pca1Expiring.length > 0) {
      newAlerts.push({
        type: 'info',
        message: `${pca1Expiring.length} PCA1 certificate(s) expiring within 60 days`,
        count: pca1Expiring.length,
      });
    }

    // High value pending tenders
    const highValue = tenders.filter(t => t.status === 'pending' && t.value > 50000000);
    if (highValue.length > 0) {
      newAlerts.push({
        type: 'critical',
        message: `${highValue.length} high-value tender(s) (>Rs 50M) pending submission`,
        count: highValue.length,
      });
    }

    setAlerts(newAlerts);
  };

  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = 
      tender.tenderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tender.status === statusFilter;
    const matchesType = typeFilter === 'all' || tender.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handlePrint = (tender: Tender) => {
    setPrintTender(tender);
    setTimeout(() => {
      window.print();
      setPrintTender(null);
    }, 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'lost':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'submitted':
        return <FileCheck className="h-5 w-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 border-amber-300',
      submitted: 'bg-blue-100 text-blue-700 border-blue-300',
      won: 'bg-green-100 text-green-700 border-green-300',
      lost: 'bg-red-100 text-red-700 border-red-300',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-300',
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getDeadlineBadge = (tender: Tender) => {
    if (tender.status !== 'pending') return null;
    
    const daysTo = getDaysToDeadline(tender.deadline);
    
    if (daysTo < 0) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded animate-pulse">
          ⚠️ OVERDUE by {Math.abs(daysTo)} days
        </span>
      );
    }
    
    if (daysTo <= 3) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded animate-pulse">
          🔥 {daysTo} day{daysTo !== 1 ? 's' : ''} left
        </span>
      );
    }
    
    if (daysTo <= 7) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded">
          ⏰ {daysTo} days left
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded">
        📅 {daysTo} days left
      </span>
    );
  };

  const stats = {
    total: tenders.length,
    pending: tenders.filter(t => t.status === 'pending').length,
    submitted: tenders.filter(t => t.status === 'submitted').length,
    won: tenders.filter(t => t.status === 'won').length,
    lost: tenders.filter(t => t.status === 'lost').length,
    totalValue: tenders.reduce((sum, t) => sum + t.value, 0),
    wonValue: tenders.filter(t => t.status === 'won').reduce((sum, t) => sum + t.value, 0),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A2B4A]">Tenders & Quotations</h2>
          <p className="text-slate-500 text-sm mt-1">Manage tenders, quotations, and bid securities</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Tender
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-3 animate-in slide-in-from-top duration-500">
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
                alert.type === 'error' || alert.type === 'critical'
                  ? 'border-red-500 bg-red-50 hover:bg-red-100'
                  : alert.type === 'warning'
                  ? 'border-amber-500 bg-amber-50 hover:bg-amber-100'
                  : 'border-blue-500 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <AlertTriangle className={`h-4 w-4 ${
                alert.type === 'error' || alert.type === 'critical'
                  ? 'text-red-600'
                  : alert.type === 'warning'
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`} />
              <AlertTitle className="font-semibold">
                {alert.type === 'error' || alert.type === 'critical' ? '🚨 Urgent Action Required' : 
                 alert.type === 'warning' ? '⚠️ Attention Needed' : 'ℹ️ Information'}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card 
          className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 text-blue-50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => setStatusFilter('all')}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-blue-900/30 rounded-lg backdrop-blur-sm">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Total</span>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.total}</p>
            <p className="text-blue-100 text-xs">All Tenders</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 text-amber-50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => setStatusFilter('pending')}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-orange-900/30 rounded-lg backdrop-blur-sm">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Pending</span>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.pending}</p>
            <p className="text-amber-100 text-xs">To Submit</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 text-indigo-50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => setStatusFilter('submitted')}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-purple-900/30 rounded-lg backdrop-blur-sm">
                <FileCheck className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Submitted</span>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.submitted}</p>
            <p className="text-indigo-100 text-xs">Under Review</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-emerald-500 via-green-600 to-green-700 text-emerald-50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => setStatusFilter('won')}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-green-900/30 rounded-lg backdrop-blur-sm">
                <Award className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Won</span>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.won}</p>
            <p className="text-emerald-100 text-xs">Successful</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{ background: 'linear-gradient(to bottom right, #fca5a5, #f87171)', color: '#7f1d1d' }}
          onClick={() => setStatusFilter('lost')}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(127, 29, 29, 0.2)' }}>
                <XCircle className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Lost</span>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.lost}</p>
            <p className="text-xs" style={{ color: 'rgba(127, 29, 29, 0.8)' }}>Unsuccessful</p>
          </CardContent>
        </Card>
      </div>

      {/* Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="text-white transform transition-all duration-300 hover:shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <DollarSign className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wide">Total Portfolio Value</span>
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">Rs {(stats.totalValue / 1000000).toFixed(1)}M</p>
            <p className="text-white/80 text-xs">💼 All tenders combined</p>
          </CardContent>
        </Card>

        <Card className="text-white transform transition-all duration-300 hover:shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #8b5cf6, #6d28d9)' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wide">Won Contracts Value</span>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.2)' }}>
                {stats.won} Projects
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">Rs {(stats.wonValue / 1000000).toFixed(1)}M</p>
            <p className="text-white/80 text-xs">🏆 Successful bids</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by number, title, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <FileText className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tender">Tender</SelectItem>
                <SelectItem value="quotation">Quotation</SelectItem>
                <SelectItem value="rfq">RFQ</SelectItem>
                <SelectItem value="bid">Bid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenders List */}
      <div className="space-y-4">
        {filteredTenders.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No tenders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredTenders.map((tender) => (
            <Card 
              key={tender.id} 
              className="hover:shadow-2xl transition-all duration-300 border-l-4"
              style={{
                borderLeftColor: 
                  tender.status === 'won' ? '#10b981' :
                  tender.status === 'lost' ? '#ef4444' :
                  tender.status === 'submitted' ? '#3b82f6' :
                  tender.status === 'cancelled' ? '#6b7280' : '#f59e0b'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      {getStatusIcon(tender.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-[#1A2B4A]">
                          {tender.tenderNumber}
                        </h3>
                        {getStatusBadge(tender.status)}
                        <span className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded uppercase">
                          {tender.type}
                        </span>
                        {getDeadlineBadge(tender)}
                        {tender.priority === 'urgent' && (
                          <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded animate-pulse">
                            🔥 URGENT
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-xl font-bold mb-2">{tender.title}</h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-slate-500 text-xs">Client</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {tender.client}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">Value</p>
                          <p className="font-bold text-lg text-[#1A2B4A]">{tender.currency} {(tender.value / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">Deadline</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(tender.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">Location</p>
                          <p className="font-semibold">{tender.location || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Securities Summary */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tender.bidSecurityRequired && (
                          <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                            <span className="font-semibold text-blue-900">🔒 Bid Security: </span>
                            <span className="text-blue-700">Rs {(tender.bidSecurityAmount! / 1000).toFixed(0)}K</span>
                            {tender.bidSecurityExpiryDate && (
                              <span className="text-blue-600 ml-2">
                                (Exp: {new Date(tender.bidSecurityExpiryDate).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                        )}
                        {tender.performanceSecurityRequired && (
                          <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs">
                            <span className="font-semibold text-green-900">✅ Performance Security: </span>
                            <span className="text-green-700">Rs {(tender.performanceSecurityAmount! / 1000).toFixed(0)}K</span>
                            {tender.performanceSecurityExpiryDate && (
                              <span className="text-green-600 ml-2">
                                (Exp: {new Date(tender.performanceSecurityExpiryDate).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                        )}
                        {tender.pca1Required && (
                          <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                            <span className="font-semibold text-amber-900">📄 PCA1: </span>
                            <span className="text-amber-700 uppercase">{tender.pca1Status || 'Required'}</span>
                            {tender.pca1ExpiryDate && (
                              <span className="text-amber-600 ml-2">
                                (Exp: {new Date(tender.pca1ExpiryDate).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {expandedTender === tender.id && (
                        <div className="mt-4 space-y-3 animate-in slide-in-from-top duration-300">
                          {tender.description && (
                            <div className="p-3 bg-slate-50 rounded">
                              <p className="text-sm font-semibold mb-1">Description:</p>
                              <p className="text-sm text-slate-700">{tender.description}</p>
                            </div>
                          )}
                          
                          {tender.technicalDocumentsRequired.length > 0 && (
                            <div className="p-3 bg-blue-50 rounded">
                              <p className="text-sm font-semibold mb-2">📋 Technical Documents Required:</p>
                              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                {tender.technicalDocumentsRequired.map((doc, i) => (
                                  <li key={i}>{doc}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {tender.notes && (
                            <div className="p-3 bg-amber-50 rounded">
                              <p className="text-sm font-semibold mb-1">📝 Notes:</p>
                              <p className="text-sm text-slate-700">{tender.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => handlePrint(tender)}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                    <Button
                      onClick={() => setExpandedTender(expandedTender === tender.id ? null : tender.id)}
                      variant="outline"
                      size="sm"
                    >
                      {expandedTender === tender.id ? (
                        <><ChevronUp className="h-4 w-4 mr-1" /> Less</>
                      ) : (
                        <><ChevronDown className="h-4 w-4 mr-1" /> More</>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Hidden Print Component */}
      {printTender && (
        <div className="hidden print:block">
          <TenderPrint tender={printTender} />
        </div>
      )}
    </div>
  );
}
