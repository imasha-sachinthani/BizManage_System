import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { DashboardChart } from '../components/DashboardChart';
import { VATReportPrint } from '../components/VATReportPrint';
import { AuditReportPrint } from '../components/AuditReportPrint';
import { mockVATReport, revenueData } from '../lib/mockData';
import { Download, FileText, Calendar, TrendingUp, Printer, FileSpreadsheet, FilePlus, DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { exportVATToExcel, exportAuditToExcel, exportFinancialReportToExcel, exportToPDF } from '../utils/exportUtils';

export function Reports() {
  const [period, setPeriod] = useState('q3-2024');
  const [viewType, setViewType] = useState('summary');
  const [activeTab, setActiveTab] = useState('vat');
  const [printMode, setPrintMode] = useState<'vat' | 'audit' | 'financial' | null>(null);

  const auditData = {
    revenue: 45000000,
    expenses: 32000000,
    netProfit: 13000000,
    assets: 75000000,
    liabilities: 35000000,
    equity: 40000000,
    cashFlow: 15000000,
    accountsReceivable: 12000000,
    accountsPayable: 8000000,
    inventory: 18000000,
  };

  const handlePrintVAT = () => {
    setPrintMode('vat');
    setTimeout(() => {
      window.print();
      setPrintMode(null);
    }, 100);
  };

  const handlePrintAudit = () => {
    setPrintMode('audit');
    setTimeout(() => {
      window.print();
      setPrintMode(null);
    }, 100);
  };

  const handlePrintFinancial = () => {
    setPrintMode('financial');
    setTimeout(() => {
      window.print();
      setPrintMode(null);
    }, 100);
  };

  const handleExportVATExcel = () => {
    exportVATToExcel(period, mockVATReport);
    toast.success('VAT Report exported to Excel successfully');
  };

  const handleExportAuditExcel = () => {
    exportAuditToExcel('2024', auditData);
    toast.success('Audit Report exported to Excel successfully');
  };

  const handleExportFinancialExcel = () => {
    exportFinancialReportToExcel(period, auditData);
    toast.success('Financial Report exported to Excel successfully');
  };

  const handleDownloadDocument = (docName: string) => {
    toast.success(`${docName} downloaded successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports & Documents</h2>
          <p className="text-slate-500 text-sm mt-1">Generate VAT returns, audit reports, and financial statements</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => {
            if (activeTab === 'vat') handleExportVATExcel();
            else if (activeTab === 'audit') handleExportAuditExcel();
            else handleExportFinancialExcel();
          }}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button 
            className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
            onClick={() => {
              if (activeTab === 'vat') handlePrintVAT();
              else if (activeTab === 'audit') handlePrintAudit();
              else handlePrintFinancial();
            }}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vat">Quarterly VAT</TabsTrigger>
          <TabsTrigger value="audit">Annual Audit</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>

        {/* VAT Report Tab */}
        <TabsContent value="vat" className="space-y-6 mt-6">

      {/* Period Selector */}
      <Card className="shadow-lg border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="text-sm">Reporting Period:</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1-2024">Q1 2024 (Jan - Mar)</SelectItem>
                <SelectItem value="q2-2024">Q2 2024 (Apr - Jun)</SelectItem>
                <SelectItem value="q3-2024">Q3 2024 (Jul - Sep)</SelectItem>
                <SelectItem value="q4-2024">Q4 2024 (Oct - Dec)</SelectItem>
                <SelectItem value="annual-2024">Annual 2024</SelectItem>
              </SelectContent>
            </Select>
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary View</SelectItem>
                <SelectItem value="detailed">Detailed View</SelectItem>
                <SelectItem value="itemized">Itemized View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* VAT Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Total Sales</p>
            <p className="text-2xl mt-1">Rs {(mockVATReport.totalSales / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Total Purchases</p>
            <p className="text-2xl mt-1">Rs {(mockVATReport.totalPurchases / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">VAT Collected</p>
            <p className="text-2xl mt-1">Rs {(mockVATReport.vatCollected / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">VAT Paid</p>
            <p className="text-2xl mt-1">Rs {(mockVATReport.vatPaid / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>

        <Card className="luxury-gradient text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">VAT Payable</p>
            <p className="text-2xl mt-1">Rs {(mockVATReport.vatPayable / 1000000).toFixed(2)}M</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="vat">VAT Report</TabsTrigger>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="vat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle>VAT Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-600">Output VAT (Sales)</p>
                      <p className="text-xl mt-1 text-[#1A2B4A]">Rs {mockVATReport.vatCollected.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-600">Input VAT (Purchases)</p>
                      <p className="text-xl mt-1 text-[#1A2B4A]">Rs {mockVATReport.vatPaid.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#1A2B4A] to-[#0F1729] text-white rounded-lg">
                    <div>
                      <p className="text-sm text-white/80">Net VAT Payable</p>
                      <p className="text-2xl mt-1">Rs {mockVATReport.vatPayable.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">Q2 2024 VAT Return</p>
                        <p className="text-xs text-slate-600 mt-1">Filed: Jul 15, 2024</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">Paid</span>
                    </div>
                    <p className="text-xl mt-2 text-emerald-700">Rs 1,245,000</p>
                  </div>

                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">Q3 2024 VAT Return</p>
                        <p className="text-xs text-slate-600 mt-1">Due: Oct 20, 2024</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Current</span>
                    </div>
                    <p className="text-xl mt-2 text-blue-700">Rs 1,675,500</p>
                  </div>

                  <div className="p-4 border-l-4 border-slate-300 bg-slate-50 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">Q4 2024 VAT Return</p>
                        <p className="text-xs text-slate-600 mt-1">Due: Jan 20, 2025</p>
                      </div>
                      <span className="px-2 py-1 bg-slate-400 text-white text-xs rounded-full">Upcoming</span>
                    </div>
                    <p className="text-xl mt-2 text-slate-700">Estimated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DashboardChart
            type="bar"
            title="Monthly VAT Analysis"
            data={revenueData.map(item => ({
              month: item.month,
              'VAT Collected': item.revenue * 0.15,
              'VAT Paid': item.expenses * 0.15,
            }))}
            dataKeys={['VAT Collected', 'VAT Paid']}
            colors={['#1A2B4A', '#D4AF37']}
          />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <DashboardChart
            type="line"
            title="Sales Trends"
            data={revenueData}
            dataKeys={['revenue']}
            colors={['#1A2B4A']}
          />
          
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <p className="text-sm text-slate-600">Total Sales</p>
                  <p className="text-3xl mt-2 text-blue-700">Rs 12.8M</p>
                </div>
                <div className="text-center p-6 bg-emerald-50 rounded-xl">
                  <p className="text-sm text-slate-600">Average Order Value</p>
                  <p className="text-3xl mt-2 text-emerald-700">Rs 2.1M</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <p className="text-sm text-slate-600">Number of Invoices</p>
                  <p className="text-3xl mt-2 text-purple-700">248</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <DashboardChart
            type="bar"
            title="Purchase Analysis"
            data={revenueData}
            dataKeys={['expenses']}
            colors={['#D4AF37']}
          />
          
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Top Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Office Supplies Lanka', 'Tech Hardware Pvt Ltd', 'Cloud Services International', 'Marketing Solutions'].map((supplier, index) => (
                  <div key={supplier} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1A2B4A] to-[#4C1D95] rounded-lg flex items-center justify-center text-white">
                        {index + 1}
                      </div>
                      <span>{supplier}</span>
                    </div>
                    <span className="text-[#1A2B4A]">Rs {(Math.random() * 2000000).toFixed(0)} K</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { item: 'VAT Registration Current', status: true },
                    { item: 'Q3 2024 Return Filed', status: true },
                    { item: 'Payment Made On Time', status: true },
                    { item: 'All Invoices Recorded', status: true },
                    { item: 'Q4 2024 Return Prepared', status: false },
                  ].map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm">{check.item}</span>
                      {check.status ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">✓ Complete</span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">⚠ Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'VAT Return Form (Q3 2024)',
                    'Sales Invoice Register',
                    'Purchase Invoice Register',
                    'CUSDEC Documentation',
                    'Credit/Debit Note Register',
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[#1A2B4A]" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadDocument(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
        </TabsContent>

        {/* Annual Audit Report Tab */}
        <TabsContent value="audit" className="space-y-6 mt-6">
          {/* Audit Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-white/80 text-sm">Total Revenue</p>
                <p className="text-2xl mt-1">Rs {(auditData.revenue / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-white/80 text-sm">Total Expenses</p>
                <p className="text-2xl mt-1">Rs {(auditData.expenses / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-white/80 text-sm">Net Profit</p>
                <p className="text-2xl mt-1">Rs {(auditData.netProfit / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>

            <Card className="luxury-gradient text-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-white/80 text-sm">Total Assets</p>
                <p className="text-2xl mt-1">Rs {(auditData.assets / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Position Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle>Statement of Financial Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-600">Total Assets</p>
                      <p className="text-xl mt-1 text-[#1A2B4A]">Rs {auditData.assets.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-600">Total Liabilities</p>
                      <p className="text-xl mt-1 text-[#1A2B4A]">Rs {auditData.liabilities.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#1A2B4A] to-[#0F1729] text-white rounded-lg">
                    <div>
                      <p className="text-sm text-white/80">Total Equity</p>
                      <p className="text-2xl mt-1">Rs {auditData.equity.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle>Key Financial Ratios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-lg">
                    <p className="text-sm text-slate-600">Profit Margin</p>
                    <p className="text-2xl mt-1 text-emerald-700">{((auditData.netProfit / auditData.revenue) * 100).toFixed(1)}%</p>
                  </div>

                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    <p className="text-sm text-slate-600">Current Ratio</p>
                    <p className="text-2xl mt-1 text-blue-700">2.5:1</p>
                  </div>

                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                    <p className="text-sm text-slate-600">Return on Equity</p>
                    <p className="text-2xl mt-1 text-purple-700">{((auditData.netProfit / auditData.equity) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Reports Tab */}
        <TabsContent value="financial" className="space-y-6 mt-6">
          {/* Financial Period Selector */}
          <Card className="shadow-lg border-slate-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="text-sm font-medium">Report Type:</label>
                <Select defaultValue="income">
                  <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income Statement</SelectItem>
                    <SelectItem value="balance">Balance Sheet</SelectItem>
                    <SelectItem value="cashflow">Cash Flow Statement</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="annual-2024">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1-2024">Q1 2024</SelectItem>
                    <SelectItem value="q2-2024">Q2 2024</SelectItem>
                    <SelectItem value="q3-2024">Q3 2024</SelectItem>
                    <SelectItem value="q4-2024">Q4 2024</SelectItem>
                    <SelectItem value="annual-2024">Annual 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Financial KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-white/80 text-sm">Total Revenue</p>
                <p className="text-2xl mt-1">Rs {(auditData.revenue / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-white/80 text-sm">Net Profit</p>
                <p className="text-2xl mt-1">Rs {(auditData.netProfit / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-white/80 text-sm">Operating Cash Flow</p>
                <p className="text-2xl mt-1">Rs {(auditData.cashFlow / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>

            <Card className="luxury-gradient text-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-white/80 text-sm">EBITDA</p>
                <p className="text-2xl mt-1">Rs {((auditData.netProfit * 1.25) / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>
          </div>

          {/* Income Statement Overview */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Income Statement - Annual 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">Revenue</span>
                  <span className="text-sm font-bold text-[#1A2B4A]">Rs {auditData.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">Cost of Sales</span>
                  <span className="text-sm font-bold text-red-600">Rs {(auditData.expenses * 0.6).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <span className="text-sm font-medium">Gross Profit</span>
                  <span className="text-sm font-bold text-blue-700">Rs {(auditData.revenue - auditData.expenses * 0.6).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">Operating Expenses</span>
                  <span className="text-sm font-bold text-red-600">Rs {(auditData.expenses * 0.4).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#1A2B4A] to-[#0F1729] text-white rounded-lg">
                  <span className="font-medium">Net Profit</span>
                  <span className="text-xl font-bold">Rs {auditData.netProfit.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden Print Components */}
      {printMode === 'vat' && (
        <div className="hidden print:block">
          <VATReportPrint 
            period={period}
            totalSales={mockVATReport.totalSales}
            totalPurchases={mockVATReport.totalPurchases}
            vatCollected={mockVATReport.vatCollected}
            vatPaid={mockVATReport.vatPaid}
            vatPayable={mockVATReport.vatPayable}
          />
        </div>
      )}

      {printMode === 'audit' && (
        <div className="hidden print:block">
          <AuditReportPrint 
            year="2024"
            companyName="BizManage ERP Solutions"
            data={auditData}
          />
        </div>
      )}
    </div>
  );
}
