import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DashboardChart } from '../components/DashboardChart';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner@2.0.3';

export function Payments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleSendReminder = (payment: any) => {
    toast.success(`Payment reminder sent to ${payment.client}`);
  };

  const handleExport = () => {
    toast.success('Payment report exported successfully');
  };

  const payments = [
    { 
      id: '1', 
      invoice: 'INV-2024-001', 
      client: 'ABC Corporation Ltd', 
      amount: 2450000, 
      date: '2024-10-15',
      status: 'completed',
      method: 'Bank Transfer'
    },
    { 
      id: '2', 
      invoice: 'INV-2024-002', 
      client: 'XYZ Enterprises', 
      amount: 1875000, 
      date: '2024-10-20',
      status: 'pending',
      method: 'Cheque'
    },
    { 
      id: '3', 
      invoice: 'INV-2024-003', 
      client: 'Global Trading Co', 
      amount: 3250000, 
      date: '2024-09-05',
      status: 'overdue',
      method: 'Bank Transfer'
    },
    { 
      id: '4', 
      invoice: 'INV-2024-005', 
      client: 'Retail Mart Ltd', 
      amount: 4200000, 
      date: '2024-10-25',
      status: 'completed',
      method: 'Online Payment'
    },
  ];

  const paymentData = [
    { month: 'Jun', received: 3200000, outstanding: 800000 },
    { month: 'Jul', received: 4100000, outstanding: 950000 },
    { month: 'Aug', received: 3800000, outstanding: 1200000 },
    { month: 'Sep', received: 4500000, outstanding: 900000 },
    { month: 'Oct', received: 5200000, outstanding: 650000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl">Payment Tracking</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor payment status and collection performance</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => toast.info('Period selector opened')}>
            <Calendar className="h-4 w-4 mr-2" />
            This Month
          </Button>
          <Button 
            className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg border-0 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Collected This Month</p>
            <p className="text-3xl mt-2">Rs 5.2M</p>
            <p className="text-white/80 text-xs mt-1">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg border-0 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Pending Payments</p>
            <p className="text-3xl mt-2">Rs 1.9M</p>
            <p className="text-white/80 text-xs mt-1">12 invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg border-0 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Overdue Amount</p>
            <p className="text-3xl mt-2">Rs 650K</p>
            <p className="text-white/80 text-xs mt-1">5 invoices</p>
          </CardContent>
        </Card>

        <Card className="luxury-gradient text-white shadow-lg border-0 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Collection Rate</p>
            <p className="text-3xl mt-2">89.2%</p>
            <p className="text-white/80 text-xs mt-1">Above target (85%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Trend Chart */}
      <DashboardChart
        type="bar"
        title="Payment Collection Trends"
        data={paymentData}
        dataKeys={['received', 'outstanding']}
        colors={['#047857', '#F59E0B']}
      />

      {/* Filters */}
      <Card className="shadow-lg border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by invoice, client..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-methods">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-methods">All Methods</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Timeline */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle>Recent Payment Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment, index) => {
              const statusConfig = {
                completed: { 
                  color: 'border-emerald-500 bg-emerald-50', 
                  badge: 'bg-emerald-100 text-emerald-700',
                  icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                },
                pending: { 
                  color: 'border-amber-500 bg-amber-50', 
                  badge: 'bg-amber-100 text-amber-700',
                  icon: <Clock className="h-5 w-5 text-amber-600" />
                },
                overdue: { 
                  color: 'border-red-500 bg-red-50', 
                  badge: 'bg-red-100 text-red-700',
                  icon: <AlertCircle className="h-5 w-5 text-red-600" />
                },
              };
              
              const config = statusConfig[payment.status as keyof typeof statusConfig];

              return (
                <div key={payment.id} className="relative">
                  {/* Timeline Line */}
                  {index < payments.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />
                  )}
                  
                  <div className={`p-4 border-l-4 ${config.color} rounded-r-xl`}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {config.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <p className="text-sm">{payment.invoice}</p>
                            <p className="text-xs text-slate-600 mt-1">{payment.client}</p>
                          </div>
                          <Badge className={`${config.badge} rounded-full px-3`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="text-[#1A2B4A]">Rs {payment.amount.toLocaleString()}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-600">{payment.method}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-600">{payment.date}</span>
                        </div>
                      </div>

                      {payment.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300 flex-shrink-0"
                          onClick={() => handleSendReminder(payment)}
                        >
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle>Payment Methods Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { method: 'Bank Transfer', count: 142, amount: 28500000, percentage: 65 },
                { method: 'Online Payment', count: 86, amount: 12400000, percentage: 28 },
                { method: 'Cheque', count: 20, amount: 3100000, percentage: 7 },
              ].map((method) => (
                <div key={method.method} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{method.method}</span>
                    <span className="text-sm">Rs {(method.amount / 1000000).toFixed(1)}M ({method.count} txns)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1A2B4A] to-[#D4AF37]" 
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle>Upcoming Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: 'Nov 5', client: 'Tech Solutions Inc', amount: 985000 },
                { date: 'Nov 10', client: 'XYZ Enterprises', amount: 1875000 },
                { date: 'Nov 15', client: 'Startup Ventures', amount: 550000 },
                { date: 'Nov 20', client: 'Retail Giants Ltd', amount: 2100000 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-blue-600">{item.date.split(' ')[0]}</span>
                      <span className="text-sm text-blue-700">{item.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <p className="text-sm">{item.client}</p>
                      <p className="text-xs text-slate-500">Expected payment</p>
                    </div>
                  </div>
                  <span className="text-[#1A2B4A]">Rs {(item.amount / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
