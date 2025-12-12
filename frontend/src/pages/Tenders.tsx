import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
  Eye,
  Download,
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
  const [viewDetailsTender, setViewDetailsTender] = useState<Tender | null>(null);
  const [expandedTender, setExpandedTender] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Array<{ type: string; message: string; count: number; id: string }>>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Handle alert click to filter tenders
  const handleAlertClick = (alertId: string) => {
    const tenderList = document.getElementById('tender-list');
    
    switch (alertId) {
      case 'overdue':
        setStatusFilter('pending');
        toast.info('Showing overdue tenders');
        break;
      case 'due-soon':
        setStatusFilter('pending');
        toast.info('Showing tenders with approaching deadlines');
        break;
      case 'bid-security-expiring':
        setStatusFilter('all');
        toast.info('Showing tenders with expiring bid securities');
        break;
      case 'performance-security-expiring':
        setStatusFilter('all');
        toast.info('Showing tenders with expiring performance securities');
        break;
      case 'pcai-expiring':
        setStatusFilter('all');
        toast.info('Showing tenders with expiring PCAI certificates');
        break;
      case 'high-value':
        setStatusFilter('pending');
        toast.info('Showing high-value pending tenders');
        break;
    }
    
    // Scroll to tender list
    setTimeout(() => {
      tenderList?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

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
        id: 'due-soon',
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
        id: 'overdue',
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
        id: 'bid-security-expiring',
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
        id: 'performance-security-expiring',
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
        id: 'pcai-expiring',
      });
    }

    // High value pending tenders
    const highValue = tenders.filter(t => t.status === 'pending' && t.value > 50000000);
    if (highValue.length > 0) {
      newAlerts.push({
        type: 'critical',
        message: `${highValue.length} high-value tender(s) (>Rs 50M) pending submission`,
        count: highValue.length,
        id: 'high-value',
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

  const handleViewDetails = (tender: Tender) => {
    setViewDetailsTender(tender);
  };

  const handleDownloadPDF = () => {
    if (!viewDetailsTender) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tender Details - ${viewDetailsTender.tenderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; margin: 0; }
            h1 { color: #1A2B4A; text-align: center; margin-bottom: 10px; }
            h2 { color: #333; text-align: center; margin-bottom: 30px; font-size: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1A2B4A; padding-bottom: 20px; }
            .info { font-size: 14px; color: #666; }
            .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; page-break-inside: avoid; }
            .section-title { font-size: 18px; font-weight: bold; color: #1A2B4A; margin-bottom: 15px; background: #f5f5f5; padding: 10px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
            .field { padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .field-label { font-size: 12px; color: #666; margin-bottom: 3px; }
            .field-value { font-size: 14px; font-weight: bold; color: #1A2B4A; }
            .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .status-awarded { background: #10b981; color: white; }
            .status-pending { background: #f59e0b; color: white; }
            .status-submitted { background: #3b82f6; color: white; }
            .status-quotation { background: #8b5cf6; color: white; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px; }
            .description { padding: 15px; background: #f9f9f9; border-left: 4px solid #1A2B4A; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BizManage Pro Edition</h1>
            <h2>Tender Details</h2>
            <p class="info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="section">
            <div style="text-align: center; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #1A2B4A; font-size: 24px;">${viewDetailsTender.tenderNumber}</h3>
              <h4 style="margin: 0 0 15px 0; color: #333;">${viewDetailsTender.title}</h4>
              <span class="status status-${viewDetailsTender.status}">${viewDetailsTender.status.toUpperCase()}</span>
            </div>
            <div style="text-align: center; font-size: 28px; font-weight: bold; color: #1A2B4A; margin: 20px 0;">
              ${viewDetailsTender.currency} ${viewDetailsTender.value.toLocaleString()}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Basic Information</div>
            <div class="grid">
              <div class="field">
                <div class="field-label">Client</div>
                <div class="field-value">${viewDetailsTender.client}</div>
              </div>
              <div class="field">
                <div class="field-label">Type</div>
                <div class="field-value">${viewDetailsTender.type.toUpperCase()}</div>
              </div>
              <div class="field">
                <div class="field-label">Location</div>
                <div class="field-value">${viewDetailsTender.location}</div>
              </div>
              <div class="field">
                <div class="field-label">Publish Date</div>
                <div class="field-value">${viewDetailsTender.publishDate}</div>
              </div>
              <div class="field">
                <div class="field-label">Deadline</div>
                <div class="field-value">${viewDetailsTender.deadline}</div>
              </div>
              ${viewDetailsTender.awardDate ? `
                <div class="field">
                  <div class="field-label">Award Date</div>
                  <div class="field-value">${viewDetailsTender.awardDate}</div>
                </div>
              ` : ''}
            </div>
            ${viewDetailsTender.description ? `
              <div class="description">
                <strong>Description:</strong><br/>
                ${viewDetailsTender.description}
              </div>
            ` : ''}
          </div>

          ${viewDetailsTender.bidSecurityRequired ? `
            <div class="section">
              <div class="section-title">Bid Security Details</div>
              <div class="grid">
                <div class="field">
                  <div class="field-label">Amount</div>
                  <div class="field-value">${viewDetailsTender.currency} ${viewDetailsTender.bidSecurityAmount?.toLocaleString()}</div>
                </div>
                <div class="field">
                  <div class="field-label">Type</div>
                  <div class="field-value">${viewDetailsTender.bidSecurityType?.replace('_', ' ').toUpperCase()}</div>
                </div>
                <div class="field">
                  <div class="field-label">Bank Name</div>
                  <div class="field-value">${viewDetailsTender.bidSecurityBankName || 'N/A'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Reference Number</div>
                  <div class="field-value">${viewDetailsTender.bidSecurityReferenceNumber || 'N/A'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Issue Date</div>
                  <div class="field-value">${viewDetailsTender.bidSecurityIssueDate || 'N/A'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Expiry Date</div>
                  <div class="field-value">${viewDetailsTender.bidSecurityExpiryDate || 'N/A'}</div>
                </div>
              </div>
            </div>
          ` : ''}

          ${viewDetailsTender.performanceSecurityRequired ? `
            <div class="section">
              <div class="section-title">Performance Security Details</div>
              <div class="grid">
                <div class="field">
                  <div class="field-label">Amount</div>
                  <div class="field-value">${viewDetailsTender.currency} ${viewDetailsTender.performanceSecurityAmount?.toLocaleString()}</div>
                </div>
                <div class="field">
                  <div class="field-label">Status</div>
                  <div class="field-value">${viewDetailsTender.performanceSecurityStatus?.replace('_', ' ').toUpperCase() || 'PENDING'}</div>
                </div>
                ${viewDetailsTender.performanceSecurityExpiryDate ? `
                  <div class="field">
                    <div class="field-label">Expiry Date</div>
                    <div class="field-value">${viewDetailsTender.performanceSecurityExpiryDate}</div>
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}

          ${viewDetailsTender.pcaiRequired ? `
            <div class="section">
              <div class="section-title">PCAI Details</div>
              <div class="grid">
                <div class="field">
                  <div class="field-label">Status</div>
                  <div class="field-value">${viewDetailsTender.pcaiStatus?.toUpperCase() || 'PENDING'}</div>
                </div>
                ${viewDetailsTender.pcaiExpiryDate ? `
                  <div class="field">
                    <div class="field-label">Expiry Date</div>
                    <div class="field-value">${viewDetailsTender.pcaiExpiryDate}</div>
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>This is a computer-generated tender document.</p>
            <p>BizManage ERP System - Confidential</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      toast.success('Print dialog opened');
    }, 250);
  };

  const handlePrintPDF = () => {
    handleDownloadPDF();
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
              onClick={() => handleAlertClick(alert.id)}
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
      <div id="tender-list" className="space-y-4">
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
                      onClick={() => handleViewDetails(tender)}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      More Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!viewDetailsTender} onOpenChange={(open) => !open && setViewDetailsTender(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Tender Details - {viewDetailsTender?.tenderNumber}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="bg-[#1A2B4A] text-white hover:bg-[#0F1729] hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintPDF}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print PDF
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {viewDetailsTender && (
            <div className="space-y-6 mt-4">
              {/* Title and Status */}
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <h3 className="text-2xl font-bold text-[#1A2B4A] mb-2">{viewDetailsTender.title}</h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  {viewDetailsTender.status === 'awarded' && (
                    <span className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold">
                      AWARDED
                    </span>
                  )}
                  {viewDetailsTender.status === 'pending' && (
                    <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-semibold">
                      PENDING
                    </span>
                  )}
                  {viewDetailsTender.status === 'submitted' && (
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                      SUBMITTED
                    </span>
                  )}
                  {viewDetailsTender.status === 'quotation' && (
                    <span className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold">
                      QUOTATION
                    </span>
                  )}
                  <span className="text-sm px-3 py-1 bg-slate-200 text-slate-700 rounded-full font-semibold">
                    {viewDetailsTender.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-4xl font-bold text-[#1A2B4A]">
                  {viewDetailsTender.currency} {viewDetailsTender.value.toLocaleString()}
                </p>
              </div>

              {/* Basic Information */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-[#1A2B4A]">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-slate-500 mb-1">Client</p>
                    <p className="font-semibold text-[#1A2B4A]">{viewDetailsTender.client}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-slate-500 mb-1">Location</p>
                    <p className="font-semibold">{viewDetailsTender.location}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-slate-500 mb-1">Publish Date</p>
                    <p className="font-semibold">{viewDetailsTender.publishDate}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-slate-500 mb-1">Deadline</p>
                    <p className="font-semibold">{viewDetailsTender.deadline}</p>
                  </div>
                  {viewDetailsTender.awardDate && (
                    <div className="p-3 bg-green-50 rounded col-span-2">
                      <p className="text-xs text-slate-500 mb-1">Award Date</p>
                      <p className="font-semibold text-green-700">{viewDetailsTender.awardDate}</p>
                    </div>
                  )}
                </div>
                {viewDetailsTender.description && (
                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
                    <p className="text-sm"><span className="font-semibold text-[#1A2B4A]">Description:</span></p>
                    <p className="text-sm text-slate-700 mt-2">{viewDetailsTender.description}</p>
                  </div>
                )}
              </div>

              {/* Bid Security Details */}
              {viewDetailsTender.bidSecurityRequired && (
                <div className="p-4 border rounded-lg bg-amber-50">
                  <h3 className="font-semibold text-lg mb-4 text-[#1A2B4A]">Bid Security Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-slate-500 mb-1">Amount</p>
                      <p className="font-semibold text-amber-700">{viewDetailsTender.currency} {viewDetailsTender.bidSecurityAmount?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-slate-500 mb-1">Type</p>
                      <p className="font-semibold">{viewDetailsTender.bidSecurityType?.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-slate-500 mb-1">Bank Name</p>
                      <p className="font-semibold">{viewDetailsTender.bidSecurityBankName || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-slate-500 mb-1">Reference Number</p>
                      <p className="font-semibold">{viewDetailsTender.bidSecurityReferenceNumber || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-slate-500 mb-1">Issue Date</p>
                      <p className="font-semibold">{viewDetailsTender.bidSecurityIssueDate || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-slate-500 mb-1">Expiry Date</p>
                      <p className="font-semibold">{viewDetailsTender.bidSecurityExpiryDate || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Security Details */}
              {viewDetailsTender.performanceSecurityRequired && (
                <div className="p-4 border rounded-lg bg-green-50">
                  <h3 className="font-semibold text-lg mb-4 text-[#1A2B4A]">Performance Security Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-slate-500 mb-1">Amount</p>
                      <p className="font-semibold text-green-700">{viewDetailsTender.currency} {viewDetailsTender.performanceSecurityAmount?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <p className="font-semibold">{viewDetailsTender.performanceSecurityStatus?.replace('_', ' ').toUpperCase() || 'PENDING'}</p>
                    </div>
                    {viewDetailsTender.performanceSecurityExpiryDate && (
                      <div className="p-3 bg-white rounded col-span-2">
                        <p className="text-xs text-slate-500 mb-1">Expiry Date</p>
                        <p className="font-semibold">{viewDetailsTender.performanceSecurityExpiryDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PCAI Details */}
              {viewDetailsTender.pcaiRequired && (
                <div className="p-4 border rounded-lg bg-purple-50">
                  <h3 className="font-semibold text-lg mb-4 text-[#1A2B4A]">PCAI Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <p className="font-semibold text-purple-700">{viewDetailsTender.pcaiStatus?.toUpperCase() || 'PENDING'}</p>
                    </div>
                    {viewDetailsTender.pcaiExpiryDate && (
                      <div className="p-3 bg-white rounded">
                        <p className="text-xs text-slate-500 mb-1">Expiry Date</p>
                        <p className="font-semibold">{viewDetailsTender.pcaiExpiryDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
