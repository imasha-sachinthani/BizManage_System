import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Payment } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Printer,
  Search,
  Filter,
  Bell,
  XCircle,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Download,
  Mail,
  Phone,
  FileText,
  Eye,
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
import { toast } from 'sonner';

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewDetailsPayment, setViewDetailsPayment] = useState<Payment | null>(null);
  const [showViewReport, setShowViewReport] = useState(false);
  const [alerts, setAlerts] = useState<Array<{ type: string; message: string; count: number }>>([]);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [recordPaymentDialog, setRecordPaymentDialog] = useState<Payment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentReference, setPaymentReference] = useState('');

  // Calculate days difference
  const getDaysOverdue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getDaysToDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Mock payments data
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      paymentNumber: 'PAY-2024-001',
      invoiceNumber: 'INV-2024-001',
      client: 'ABC Corporation Ltd',
      amount: 2450000,
      paidAmount: 2450000,
      balanceAmount: 0,
      status: 'completed',
      dueDate: '2024-10-15',
      paymentDate: '2024-10-14',
      method: 'bank_transfer',
      reference: 'TRF/2024/10/001',
      notes: 'Payment received in full via bank transfer',
    },
    {
      id: '2',
      paymentNumber: 'PAY-2024-002',
      invoiceNumber: 'INV-2024-002',
      client: 'XYZ Enterprises',
      amount: 1875000,
      status: 'pending',
      dueDate: '2024-12-15',
      method: 'cheque',
    },
    {
      id: '3',
      paymentNumber: 'PAY-2024-003',
      invoiceNumber: 'INV-2024-003',
      client: 'Global Trading Co',
      amount: 3250000,
      status: 'overdue',
      dueDate: '2024-09-05',
      daysOverdue: getDaysOverdue('2024-09-05'),
    },
    {
      id: '4',
      paymentNumber: 'PAY-2024-004',
      invoiceNumber: 'INV-2024-005',
      client: 'Retail Mart Ltd',
      amount: 4200000,
      paidAmount: 4200000,
      balanceAmount: 0,
      status: 'completed',
      dueDate: '2024-10-25',
      paymentDate: '2024-10-20',
      method: 'online',
      reference: 'ONL-20241020-4567',
    },
    {
      id: '5',
      paymentNumber: 'PAY-2024-005',
      invoiceNumber: 'INV-2024-008',
      client: 'Tech Solutions Inc',
      amount: 2800000,
      paidAmount: 1500000,
      balanceAmount: 1300000,
      status: 'partial',
      dueDate: '2024-11-30',
      paymentDate: '2024-11-15',
      method: 'bank_transfer',
      reference: 'TRF/2024/11/089',
      notes: 'Partial payment received. Balance due by end of month.',
    },
    {
      id: '6',
      paymentNumber: 'PAY-2024-006',
      invoiceNumber: 'INV-2024-009',
      client: 'Smart Systems Ltd',
      amount: 1650000,
      status: 'overdue',
      dueDate: '2024-11-10',
      daysOverdue: getDaysOverdue('2024-11-10'),
    },
    {
      id: '7',
      paymentNumber: 'PAY-2024-007',
      invoiceNumber: 'INV-2024-010',
      client: 'Metro Enterprises',
      amount: 890000,
      status: 'pending',
      dueDate: '2024-12-20',
    },
    {
      id: '8',
      paymentNumber: 'PAY-2024-008',
      invoiceNumber: 'INV-2024-011',
      client: 'Future Tech Corp',
      amount: 5400000,
      status: 'overdue',
      dueDate: '2024-10-30',
      daysOverdue: getDaysOverdue('2024-10-30'),
      notes: 'Multiple reminders sent. Legal action pending.',
    },
  ]);

  useEffect(() => {
    checkForAlerts();
  }, [payments]);

  const checkForAlerts = () => {
    const newAlerts = [];
    
    const overduePayments = payments.filter(p => p.status === 'overdue');
    if (overduePayments.length > 0) {
      const totalOverdue = overduePayments.reduce((sum, p) => sum + (p.balanceAmount || p.amount), 0);
      newAlerts.push({
        type: 'error',
        message: `${overduePayments.length} overdue payment(s) totaling Rs ${totalOverdue.toLocaleString()}`,
        count: overduePayments.length,
      });
    }

    const dueSoon = payments.filter(p => {
      if (p.status !== 'pending' && p.status !== 'partial') return false;
      const daysToDue = getDaysToDue(p.dueDate);
      return daysToDue >= 0 && daysToDue <= 7;
    });
    if (dueSoon.length > 0) {
      newAlerts.push({
        type: 'warning',
        message: `${dueSoon.length} payment(s) due within 7 days`,
        count: dueSoon.length,
      });
    }

    const partialPayments = payments.filter(p => p.status === 'partial');
    if (partialPayments.length > 0) {
      const totalBalance = partialPayments.reduce((sum, p) => sum + (p.balanceAmount || 0), 0);
      newAlerts.push({
        type: 'info',
        message: `${partialPayments.length} partial payment(s) with Rs ${totalBalance.toLocaleString()} balance`,
        count: partialPayments.length,
      });
    }

    const highValueOverdue = payments.filter(p => 
      p.status === 'overdue' && (p.balanceAmount || p.amount) > 2000000
    );
    if (highValueOverdue.length > 0) {
      newAlerts.push({
        type: 'critical',
        message: `${highValueOverdue.length} high-value overdue payment(s) (>Rs 2M)`,
        count: highValueOverdue.length,
      });
    }

    setAlerts(newAlerts);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (payment: Payment) => {
    setViewDetailsPayment(payment);
  };

  const handleDownloadPDF = () => {
    if (!viewDetailsPayment) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Details - ${viewDetailsPayment.paymentNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; margin: 0; }
            h1 { color: #1A2B4A; text-align: center; margin-bottom: 10px; }
            h2 { color: #333; text-align: center; margin-bottom: 30px; font-size: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1A2B4A; padding-bottom: 20px; }
            .info { font-size: 14px; color: #666; }
            .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .section-title { font-size: 18px; font-weight: bold; color: #1A2B4A; margin-bottom: 15px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .field { padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .field-label { font-size: 12px; color: #666; margin-bottom: 3px; }
            .field-value { font-size: 16px; font-weight: bold; color: #1A2B4A; }
            .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .status-completed { background: #10b981; color: white; }
            .status-pending { background: #f59e0b; color: white; }
            .status-overdue { background: #ef4444; color: white; }
            .status-partial { background: #3b82f6; color: white; }
            .amount { font-size: 32px; font-weight: bold; text-align: center; margin: 20px 0; }
            .amount-completed { color: #10b981; }
            .amount-pending { color: #f59e0b; }
            .amount-overdue { color: #ef4444; }
            .amount-partial { color: #3b82f6; }
            .notes { padding: 15px; background: #f0f9ff; border-left: 4px solid #3b82f6; margin-top: 20px; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BizManage Pro Edition</h1>
            <h2>Payment Details</h2>
            <p class="info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Payment Information</div>
            <div style="text-align: center; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #1A2B4A;">${viewDetailsPayment.paymentNumber}</h3>
              <span class="status status-${viewDetailsPayment.status}">${viewDetailsPayment.status.toUpperCase()}</span>
            </div>
            <div class="amount amount-${viewDetailsPayment.status}">
              Rs ${(viewDetailsPayment.balanceAmount || viewDetailsPayment.amount).toLocaleString()}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Payment Details</div>
            <div class="grid">
              <div class="field">
                <div class="field-label">Invoice Number</div>
                <div class="field-value">${viewDetailsPayment.invoiceNumber}</div>
              </div>
              <div class="field">
                <div class="field-label">Client</div>
                <div class="field-value">${viewDetailsPayment.client}</div>
              </div>
              <div class="field">
                <div class="field-label">Due Date</div>
                <div class="field-value">${viewDetailsPayment.dueDate}</div>
              </div>
              <div class="field">
                <div class="field-label">Payment Method</div>
                <div class="field-value">${viewDetailsPayment.method?.replace('_', ' ').toUpperCase() || 'N/A'}</div>
              </div>
              ${viewDetailsPayment.reference ? `
                <div class="field">
                  <div class="field-label">Reference</div>
                  <div class="field-value">${viewDetailsPayment.reference}</div>
                </div>
              ` : ''}
              ${viewDetailsPayment.paymentDate ? `
                <div class="field">
                  <div class="field-label">Payment Date</div>
                  <div class="field-value">${viewDetailsPayment.paymentDate}</div>
                </div>
              ` : ''}
            </div>
          </div>

          ${viewDetailsPayment.status === 'partial' ? `
            <div class="section" style="background: #eff6ff;">
              <div class="section-title">Payment Breakdown</div>
              <div class="grid">
                <div class="field">
                  <div class="field-label">Total Amount</div>
                  <div class="field-value">Rs ${viewDetailsPayment.amount.toLocaleString()}</div>
                </div>
                <div class="field" style="background: #dcfce7;">
                  <div class="field-label">Paid Amount</div>
                  <div class="field-value" style="color: #10b981;">Rs ${viewDetailsPayment.paidAmount?.toLocaleString()}</div>
                </div>
                <div class="field" style="background: #fef3c7;">
                  <div class="field-label">Balance Due</div>
                  <div class="field-value" style="color: #f59e0b;">Rs ${viewDetailsPayment.balanceAmount?.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ` : ''}

          ${viewDetailsPayment.notes ? `
            <div class="notes">
              <strong>Notes:</strong> ${viewDetailsPayment.notes}
            </div>
          ` : ''}
          
          <div class="footer">
            <p>This is a computer-generated payment document.</p>
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

  const handleSendReminder = (payment: Payment) => {
    // Simulate sending reminder
    const daysOverdue = payment.status === 'overdue' ? (payment.daysOverdue || getDaysOverdue(payment.dueDate)) : 0;
    const daysToDue = getDaysToDue(payment.dueDate);
    
    let message = `Payment reminder sent to ${payment.client}`;
    let description = '';
    
    if (payment.status === 'overdue') {
      description = `Urgent reminder sent for ${payment.paymentNumber} (${daysOverdue} days overdue)`;
    } else if (payment.status === 'partial') {
      description = `Reminder sent for ${payment.paymentNumber} - Balance: Rs ${payment.balanceAmount?.toLocaleString()}`;
    } else {
      description = `Reminder sent for ${payment.paymentNumber} - Due in ${daysToDue} days`;
    }
    
    toast.success(message, {
      description: description,
      duration: 4000,
    });
  };

  const handleRecordPayment = () => {
    if (!recordPaymentDialog || !paymentAmount) {
      toast.error('Please enter payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const updatedPayments = payments.map(p => {
      if (p.id === recordPaymentDialog.id) {
        const newPaidAmount = (p.paidAmount || 0) + amount;
        const newBalance = p.amount - newPaidAmount;
        
        return {
          ...p,
          paidAmount: newPaidAmount,
          balanceAmount: newBalance,
          status: newBalance <= 0 ? 'completed' as const : 'partial' as const,
          paymentDate: new Date().toISOString().split('T')[0],
          method: paymentMethod as any,
          reference: paymentReference,
        };
      }
      return p;
    });

    setPayments(updatedPayments);
    setRecordPaymentDialog(null);
    setPaymentAmount('');
    setPaymentReference('');
    toast.success('Payment recorded successfully', {
      description: `Rs ${amount.toLocaleString()} recorded for ${recordPaymentDialog.client}`,
    });
  };

  const handleMarkAsPaid = (payment: Payment) => {
    const updatedPayments = payments.map(p => {
      if (p.id === payment.id) {
        return {
          ...p,
          paidAmount: p.amount,
          balanceAmount: 0,
          status: 'completed' as const,
          paymentDate: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    });

    setPayments(updatedPayments);
    toast.success(`Payment ${payment.paymentNumber} marked as paid`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'overdue':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border-green-300',
      overdue: 'bg-red-100 text-red-700 border-red-300',
      partial: 'bg-blue-100 text-blue-700 border-blue-300',
      pending: 'bg-amber-100 text-amber-700 border-amber-300',
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getDueBadge = (payment: Payment) => {
    if (payment.status === 'completed') return null;
    
    const daysToDue = getDaysToDue(payment.dueDate);
    
    if (payment.status === 'overdue') {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded animate-pulse">
          ⚠️ Overdue {payment.daysOverdue || getDaysOverdue(payment.dueDate)} days
        </span>
      );
    }
    
    if (daysToDue <= 7) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded">
          ⏰ Due in {daysToDue} day{daysToDue !== 1 ? 's' : ''}
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded">
        Due in {daysToDue} days
      </span>
    );
  };

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    overdue: payments.filter(p => p.status === 'overdue').length,
    partial: payments.filter(p => p.status === 'partial').length,
    totalReceived: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    totalPending: payments.filter(p => p.status !== 'completed').reduce((sum, p) => sum + (p.balanceAmount || p.amount), 0),
  };

  const handleExportReport = () => {
    // Create CSV header
    const headers = [
      'Status',
      'Total Payments',
      'Completed',
      'Pending',
      'Overdue',
      'Partial',
      'Total Received (Rs)',
      'Total Pending (Rs)'
    ];

    // Create CSV row with report data
    const row = [
      'Summary',
      stats.total,
      stats.completed,
      stats.pending,
      stats.overdue,
      stats.partial,
      stats.totalReceived,
      stats.totalPending
    ];

    // Combine headers and row
    const csvContent = [
      headers.join(','),
      row.join(','),
      '',
      'Payment Details',
      'Payment Number,Invoice Number,Client,Amount,Status,Due Date,Payment Method,Reference'
    ].join('\\n');

    // Add individual payment details
    const paymentRows = filteredPayments.map(payment => [
      payment.paymentNumber,
      payment.invoiceNumber,
      payment.client,
      payment.balanceAmount || payment.amount,
      payment.status.toUpperCase(),
      payment.dueDate,
      payment.method?.replace('_', ' ').toUpperCase() || 'N/A',
      payment.reference || '-'
    ].map(cell => `"${cell}"`).join(','));

    const fullCsvContent = csvContent + '\\n' + paymentRows.join('\\n');

    // Create blob and download
    const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Payment_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Payment report exported successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A2B4A]">Payment Tracking</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor payment status and manage collections</p>
        </div>
        <Button 
          onClick={() => setShowViewReport(true)}
          className="bg-[#1A2B4A] hover:bg-[#0F1729]"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Report
        </Button>
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
              onClick={() => {
                const status = alert.type === 'error' || alert.type === 'critical' ? 'overdue' : 
                               alert.type === 'info' ? 'partial' : 'pending';
                setStatusFilter(status);
              }}
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
        {/* Total Payments */}
        <Card 
          className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 text-blue-50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => setStatusFilter('all')}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-blue-900/30 rounded-lg backdrop-blur-sm">
                <DollarSign className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Total</span>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.total}</p>
            <p className="text-blue-100 text-xs">All Payments</p>
          </CardContent>
        </Card>

        {/* Completed Payments */}
        <Card 
          className="bg-gradient-to-br from-emerald-500 via-green-600 to-green-700 text-emerald-50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => setStatusFilter('completed')}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-green-900/30 rounded-lg backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Completed</span>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.completed}</p>
            <p className="text-emerald-100 text-xs">Paid in Full</p>
          </CardContent>
        </Card>

        {/* Pending Payments */}
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
            <p className="text-amber-100 text-xs">Awaiting Payment</p>
          </CardContent>
        </Card>

        {/* Overdue Payments */}
        <Card 
          className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-pulse"
          style={{ background: 'linear-gradient(to bottom right, #fca5a5, #f87171)', color: '#7f1d1d' }}
          onClick={() => setStatusFilter('overdue')}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(127, 29, 29, 0.2)' }}>
                <XCircle className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Overdue</span>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.overdue}</p>
            <p className="text-xs" style={{ color: 'rgba(127, 29, 29, 0.8)' }}>Past Due Date</p>
          </CardContent>
        </Card>

        {/* Partial Payments */}
        <Card 
          className="bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 text-indigo-50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => setStatusFilter('partial')}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-purple-900/30 rounded-lg backdrop-blur-sm">
                <AlertCircle className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Partial</span>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.partial}</p>
            <p className="text-indigo-100 text-xs">Partially Paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        {/* Total Received */}
        <Card className="text-white transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]" style={{ background: 'linear-gradient(to bottom right, #10b981, #059669)' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wide">Total Received</span>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.2)' }}>
                {stats.completed} Payments
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">Rs {(stats.totalReceived / 1000000).toFixed(1)}M</p>
            <p className="text-white/80 text-xs">💵 Successfully collected amount</p>
          </CardContent>
        </Card>

        {/* Total Outstanding */}
        <Card className="text-white transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]" style={{ background: 'linear-gradient(to bottom right, #8b5cf6, #6d28d9)' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wide">Total Outstanding</span>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.2)' }}>
                {stats.pending + stats.overdue + stats.partial} Pending
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">Rs {(stats.totalPending / 1000000).toFixed(1)}M</p>
            <p className="text-white/80 text-xs">💰 Awaiting collection</p>
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
                placeholder="Search by payment number, invoice, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-[#1A2B4A]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px] transition-all duration-300 hover:border-[#1A2B4A]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <DollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-500 text-lg">No payments found</p>
              <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search term</p>
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment) => (
            <Card 
              key={payment.id} 
              className="hover:shadow-2xl transition-all duration-300 border-l-4 cursor-pointer"
              style={{
                borderLeftColor: 
                  payment.status === 'completed' ? '#10b981' :
                  payment.status === 'overdue' ? '#ef4444' :
                  payment.status === 'partial' ? '#3b82f6' : '#f59e0b'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200">
                      {getStatusIcon(payment.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-[#1A2B4A] hover:text-[#0F1729] transition-colors">
                          {payment.paymentNumber}
                        </h3>
                        {getStatusBadge(payment.status)}
                        {getDueBadge(payment)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div className="hover:bg-slate-50 p-2 rounded transition-colors">
                          <p className="text-slate-500 text-xs">Invoice No</p>
                          <p className="font-semibold text-[#1A2B4A]">{payment.invoiceNumber}</p>
                        </div>
                        <div className="hover:bg-slate-50 p-2 rounded transition-colors">
                          <p className="text-slate-500 text-xs">Client</p>
                          <p className="font-semibold">{payment.client}</p>
                        </div>
                        <div className="hover:bg-slate-50 p-2 rounded transition-colors">
                          <p className="text-slate-500 text-xs">Due Date</p>
                          <p className="font-semibold">{payment.dueDate}</p>
                        </div>
                        <div className="hover:bg-slate-50 p-2 rounded transition-colors">
                          <p className="text-slate-500 text-xs">Method</p>
                          <p className="font-semibold">{payment.method?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
                        </div>
                      </div>

                      {payment.status === 'partial' && (
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r mb-3 hover:bg-blue-100 transition-colors">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">✅ Paid: <span className="font-bold text-blue-700">Rs {payment.paidAmount?.toLocaleString()}</span></span>
                            <span className="text-slate-600">⏳ Balance: <span className="font-bold text-blue-700">Rs {payment.balanceAmount?.toLocaleString()}</span></span>
                          </div>
                        </div>
                      )}

                      {payment.status === 'overdue' && (
                        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r mb-3 hover:bg-red-100 transition-colors animate-pulse">
                          <p className="text-sm text-red-700 font-semibold">
                            ⚠️ OVERDUE by {payment.daysOverdue} days - Immediate action required!
                          </p>
                        </div>
                      )}

                      {expandedPayment === payment.id && payment.notes && (
                        <div className="p-3 bg-slate-50 border-l-4 border-slate-400 rounded-r mb-3 animate-in slide-in-from-top duration-300">
                          <p className="text-sm text-slate-700"><span className="font-semibold">Notes:</span> {payment.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        {payment.reference && (
                          <span className="text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition-colors">
                            📄 Ref: <span className="font-semibold text-slate-700">{payment.reference}</span>
                          </span>
                        )}
                        {payment.paymentDate && (
                          <span className="text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition-colors">
                            ✅ Paid: <span className="font-semibold text-slate-700">{payment.paymentDate}</span>
                          </span>
                        )}
                        {payment.notes && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedPayment(expandedPayment === payment.id ? null : payment.id)}
                            className="text-xs"
                          >
                            {expandedPayment === payment.id ? (
                              <><ChevronUp className="h-3 w-3 mr-1" /> Hide Notes</>
                            ) : (
                              <><ChevronDown className="h-3 w-3 mr-1" /> Show Notes</>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-slate-500 mb-1">
                        {payment.status === 'partial' ? 'Balance Due' : 'Amount'}
                      </p>
                      <p className={`text-2xl font-bold transition-all duration-300 hover:scale-110 ${
                        payment.status === 'completed' ? 'text-green-600' :
                        payment.status === 'overdue' ? 'text-red-600' :
                        payment.status === 'partial' ? 'text-blue-600' :
                        'text-amber-600'
                      }`}>
                        Rs {(payment.balanceAmount || payment.amount).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                      {(payment.status === 'pending' || payment.status === 'overdue' || payment.status === 'partial') && (
                        <>
                          <Dialog open={recordPaymentDialog?.id === payment.id} onOpenChange={(open) => !open && setRecordPaymentDialog(null)}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => {
                                  setRecordPaymentDialog(payment);
                                  setPaymentAmount((payment.balanceAmount || payment.amount).toString());
                                }}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Record
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Record Payment</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Payment Amount (Rs)</Label>
                                  <Input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Enter amount"
                                  />
                                </div>
                                <div>
                                  <Label>Payment Method</Label>
                                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                      <SelectItem value="cheque">Cheque</SelectItem>
                                      <SelectItem value="cash">Cash</SelectItem>
                                      <SelectItem value="online">Online</SelectItem>
                                      <SelectItem value="credit_card">Credit Card</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Reference Number</Label>
                                  <Input
                                    value={paymentReference}
                                    onChange={(e) => setPaymentReference(e.target.value)}
                                    placeholder="Transaction reference"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleRecordPayment} className="bg-green-600 hover:bg-green-700">
                                  Record Payment
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            onClick={() => handleSendReminder(payment)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-amber-50 hover:border-amber-500"
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            Remind
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => handleViewDetails(payment)}
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 hover:border-blue-500"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!viewDetailsPayment} onOpenChange={(open) => !open && setViewDetailsPayment(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Payment Details - {viewDetailsPayment?.paymentNumber}</span>
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
          
          {viewDetailsPayment && (
            <div className="space-y-6 mt-4">
              {/* Status and Amount */}
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="mb-4">
                  {viewDetailsPayment.status === 'completed' && (
                    <span className="inline-block px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold">
                      COMPLETED
                    </span>
                  )}
                  {viewDetailsPayment.status === 'pending' && (
                    <span className="inline-block px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-semibold">
                      PENDING
                    </span>
                  )}
                  {viewDetailsPayment.status === 'overdue' && (
                    <span className="inline-block px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold">
                      OVERDUE
                    </span>
                  )}
                  {viewDetailsPayment.status === 'partial' && (
                    <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                      PARTIAL
                    </span>
                  )}
                </div>
                <p className={`text-4xl font-bold ${
                  viewDetailsPayment.status === 'completed' ? 'text-green-600' :
                  viewDetailsPayment.status === 'overdue' ? 'text-red-600' :
                  viewDetailsPayment.status === 'partial' ? 'text-blue-600' :
                  'text-amber-600'
                }`}>
                  Rs {(viewDetailsPayment.balanceAmount || viewDetailsPayment.amount).toLocaleString()}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  {viewDetailsPayment.status === 'partial' ? 'Balance Due' : 'Amount'}
                </p>
              </div>

              {/* Payment Information */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-[#1A2B4A]">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-slate-500 mb-1">Invoice Number</p>
                    <p className="font-semibold text-[#1A2B4A]">{viewDetailsPayment.invoiceNumber}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-slate-500 mb-1">Client</p>
                    <p className="font-semibold">{viewDetailsPayment.client}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-slate-500 mb-1">Due Date</p>
                    <p className="font-semibold">{viewDetailsPayment.dueDate}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                    <p className="font-semibold">{viewDetailsPayment.method?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
                  </div>
                  {viewDetailsPayment.reference && (
                    <div className="p-3 bg-slate-50 rounded">
                      <p className="text-xs text-slate-500 mb-1">Reference</p>
                      <p className="font-semibold">{viewDetailsPayment.reference}</p>
                    </div>
                  )}
                  {viewDetailsPayment.paymentDate && (
                    <div className="p-3 bg-slate-50 rounded">
                      <p className="text-xs text-slate-500 mb-1">Payment Date</p>
                      <p className="font-semibold">{viewDetailsPayment.paymentDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Breakdown for Partial Payments */}
              {viewDetailsPayment.status === 'partial' && (
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg mb-4 text-[#1A2B4A]">Payment Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="text-sm font-medium">Total Amount</span>
                      <span className="text-lg font-bold text-[#1A2B4A]">Rs {viewDetailsPayment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-sm font-medium">Paid Amount</span>
                      <span className="text-lg font-bold text-green-700">Rs {viewDetailsPayment.paidAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded">
                      <span className="text-sm font-medium">Balance Due</span>
                      <span className="text-lg font-bold text-amber-700">Rs {viewDetailsPayment.balanceAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewDetailsPayment.notes && (
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
                  <p className="text-sm"><span className="font-semibold text-[#1A2B4A]">Notes:</span></p>
                  <p className="text-sm text-slate-700 mt-2">{viewDetailsPayment.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={showViewReport} onOpenChange={setShowViewReport}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Payment Report Summary</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReport}
                className="bg-[#1A2B4A] text-white hover:bg-[#0F1729] hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r">
                <p className="text-xs text-slate-600 mb-1">Total Payments</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded-r">
                <p className="text-xs text-slate-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
              </div>
              <div className="p-4 bg-amber-50 border-l-4 border-amber-600 rounded-r">
                <p className="text-xs text-slate-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
              </div>
              <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r">
                <p className="text-xs text-slate-600 mb-1">Overdue</p>
                <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
              </div>
              <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded-r">
                <p className="text-xs text-slate-600 mb-1">Partial</p>
                <p className="text-2xl font-bold text-purple-700">{stats.partial}</p>
              </div>
              <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r col-span-2 md:col-span-1">
                <p className="text-xs text-slate-600 mb-1">Total Received</p>
                <p className="text-xl font-bold text-emerald-700">Rs {stats.totalReceived.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded-r col-span-2 md:col-span-2">
                <p className="text-xs text-slate-600 mb-1">Total Pending</p>
                <p className="text-xl font-bold text-orange-700">Rs {stats.totalPending.toLocaleString()}</p>
              </div>
            </div>

            {/* Payment List Summary */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-[#1A2B4A]">Payment Details</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-[#1A2B4A]">{payment.paymentNumber}</p>
                        {payment.status === 'completed' && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                            COMPLETED
                          </span>
                        )}
                        {payment.status === 'pending' && (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">
                            PENDING
                          </span>
                        )}
                        {payment.status === 'overdue' && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">
                            OVERDUE
                          </span>
                        )}
                        {payment.status === 'partial' && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            PARTIAL
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{payment.client} • {payment.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${
                        payment.status === 'completed' ? 'text-green-600' :
                        payment.status === 'overdue' ? 'text-red-600' :
                        payment.status === 'partial' ? 'text-blue-600' :
                        'text-amber-600'
                      }`}>
                        Rs {(payment.balanceAmount || payment.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">{payment.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Note */}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Report Generated:</span> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                This report includes {filteredPayments.length} payment(s) based on current filters.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
