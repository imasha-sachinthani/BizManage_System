import { KPICard } from '../components/KPICard';
import { DashboardChart } from '../components/DashboardChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatusBadge } from '../components/StatusBadge';
import { revenueData, statusDistribution, mockInvoices } from '../lib/mockData';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Dashboard() {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={`Rs ${(totalRevenue / 1000000).toFixed(1)}M`}
          change={12.5}
          trend="up"
          icon="revenue"
          gradient="luxury-gradient"
        />
        <KPICard
          title="Total Invoices"
          value="248"
          change={8.2}
          trend="up"
          icon="invoices"
          gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
        />
        <KPICard
          title="Pending Payments"
          value={`Rs ${(5625000 / 1000000).toFixed(1)}M`}
          change={3.1}
          trend="down"
          icon="pending"
          gradient="bg-gradient-to-br from-amber-500 to-amber-700"
        />
        <KPICard
          title="Total Expenses"
          value={`Rs ${(totalExpenses / 1000000).toFixed(1)}M`}
          change={5.4}
          trend="up"
          icon="expenses"
          gradient="bg-gradient-to-br from-purple-600 to-purple-800"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart
            type="line"
            title="Revenue & Expenses Overview"
            data={revenueData}
            dataKeys={['revenue', 'expenses']}
            colors={['#1A2B4A', '#D4AF37']}
          />
        </div>
        <div>
          <DashboardChart
            type="pie"
            title="Invoice Status Distribution"
            data={statusDistribution}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button variant="ghost" size="sm" className="text-[#1A2B4A]">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInvoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-slate-500">{invoice.client}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-medium text-sm">Rs {(invoice.amount / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-slate-500">{invoice.date}</p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div>
                  <p className="text-sm text-slate-600">Average Invoice Value</p>
                  <p className="text-2xl mt-1 text-[#1A2B4A]">Rs 2.1M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <div>
                  <p className="text-sm text-slate-600">Collection Rate</p>
                  <p className="text-2xl mt-1 text-emerald-700">87.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                <div>
                  <p className="text-sm text-slate-600">Outstanding Amount</p>
                  <p className="text-2xl mt-1 text-amber-700">Rs 5.6M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div>
                  <p className="text-sm text-slate-600">Active Clients</p>
                  <p className="text-2xl mt-1 text-purple-700">142</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
