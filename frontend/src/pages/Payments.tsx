import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { PaymentPrint } from '../components/PaymentPrint';
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
  const [printPayment, setPrintPayment] = useState<Payment | null>(null);
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

  const handlePrint = (payment: Payment) => {
    setPrintPayment(payment);
    setTimeout(() => {
      window.print();
      setPrintPayment(null);
    }, 100);
  };

  const handleSendReminder = (payment: Payment) => {
    toast.success(`Payment reminder sent to ${payment.client}`, {
      description: `Email sent for ${payment.paymentNumber}`,
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A2B4A]">Payment Tracking</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor payment status and manage collections</p>
        </div>
        <Button 
          onClick={() => toast.info('Export functionality coming soon')}
          className="bg-[#1A2B4A] hover:bg-[#0F1729]"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
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
                        onClick={() => handlePrint(payment)}
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 hover:border-blue-500"
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Hidden Print Component */}
      {printPayment && (
        <div className="hidden print:block">
          <PaymentPrint payment={printPayment} />
        </div>
      )}
    </div>
  );
}
