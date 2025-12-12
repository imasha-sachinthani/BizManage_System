import { KPICard } from '../components/KPICard';
import { DashboardChart } from '../components/DashboardChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatusBadge } from '../components/StatusBadge';
import { revenueData, statusDistribution, mockInvoices } from '../lib/mockData';
import { ArrowRight, TrendingUp, FileText, Plus, Wallet, DollarSign, Users, Settings, Trash2, Edit, X, Package, Building, Smartphone, Laptop, Car, Wrench, Download, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useState } from 'react';

export function Dashboard() {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);

  // Expense Categories State
  const [expenseCategories, setExpenseCategories] = useState([
    { id: 1, name: 'Petty Cash', icon: 'Wallet', color: 'blue' },
    { id: 2, name: 'Salaries (Payroll)', icon: 'Users', color: 'green' },
    { id: 3, name: 'Installation Cost', icon: 'Settings', color: 'orange' },
    { id: 4, name: 'Third-party Material Purchase', icon: 'DollarSign', color: 'purple' },
    { id: 5, name: 'Company Expenses', icon: 'FileText', color: 'red' },
  ]);

  // Expenses State
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Petty Cash', amount: 25000, description: 'Office supplies', date: '2024-12-10', status: 'paid' },
    { id: 2, category: 'Salaries (Payroll)', amount: 850000, description: 'Monthly salaries - December', date: '2024-12-01', status: 'paid' },
    { id: 3, category: 'Installation Cost', amount: 120000, description: 'Client site installation', date: '2024-12-08', status: 'pending' },
    { id: 4, category: 'Third-party Material Purchase', amount: 180000, description: 'Hardware components', date: '2024-12-09', status: 'paid' },
    { id: 5, category: 'Company Expenses', amount: 45000, description: 'Utilities and rent', date: '2024-12-05', status: 'paid' },
  ]);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  });
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'DollarSign', color: 'blue' });

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.description) {
      toast.error('Please fill all required fields');
      return;
    }
    setExpenses([...expenses, { 
      id: expenses.length + 1, 
      ...newExpense, 
      amount: parseFloat(newExpense.amount) 
    }]);
    setNewExpense({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0], status: 'pending' });
    setIsAddExpenseOpen(false);
    toast.success('Expense added successfully!');
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error('Please enter category name');
      return;
    }
    setExpenseCategories([...expenseCategories, { 
      id: expenseCategories.length + 1, 
      ...newCategory 
    }]);
    setNewCategory({ name: '', icon: 'DollarSign', color: 'blue' });
    setIsAddCategoryOpen(false);
    toast.success('Category added successfully!');
  };

  const handleDeleteCategory = (id: number) => {
    setExpenseCategories(expenseCategories.filter(cat => cat.id !== id));
    toast.success('Category deleted');
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
    toast.success('Expense deleted');
  };

  const getTotalByCategory = (categoryName: string) => {
    return expenses
      .filter(exp => exp.category === categoryName && exp.status === 'paid')
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const totalExpensesPaid = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const totalExpensesPending = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  // Asset & Inventory State
  const [assetCategories, setAssetCategories] = useState([
    { id: 1, name: 'Buildings', icon: 'Building', color: 'indigo' },
    { id: 2, name: 'Electronics (Phones)', icon: 'Smartphone', color: 'blue' },
    { id: 3, name: 'Computers (Laptops)', icon: 'Laptop', color: 'purple' },
    { id: 4, name: 'Vehicles', icon: 'Car', color: 'orange' },
    { id: 5, name: 'Equipment & Tools', icon: 'Wrench', color: 'green' },
  ]);

  const [assets, setAssets] = useState([
    { id: 1, category: 'Buildings', name: 'Main Office Building', value: 15000000, quantity: 1, purchaseDate: '2021-03-15', status: 'active' },
    { id: 2, category: 'Electronics (Phones)', name: 'iPhone 14 Pro', value: 180000, quantity: 15, purchaseDate: '2024-06-10', status: 'active' },
    { id: 3, category: 'Computers (Laptops)', name: 'Dell XPS 15', value: 320000, quantity: 25, purchaseDate: '2024-08-20', status: 'active' },
    { id: 4, category: 'Vehicles', name: 'Toyota HiAce Van', value: 4500000, quantity: 3, purchaseDate: '2023-11-05', status: 'active' },
    { id: 5, category: 'Equipment & Tools', name: 'Industrial Printer', value: 450000, quantity: 2, purchaseDate: '2024-01-12', status: 'active' },
  ]);

  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isAddAssetCategoryOpen, setIsAddAssetCategoryOpen] = useState(false);
  const [isViewAllCostingsOpen, setIsViewAllCostingsOpen] = useState(false);
  const [isLinkQuotationsOpen, setIsLinkQuotationsOpen] = useState(false);
  const [isViewAllExpensesOpen, setIsViewAllExpensesOpen] = useState(false);
  const [isViewAllAssetsOpen, setIsViewAllAssetsOpen] = useState(false);
  const [isViewAllInvoicesOpen, setIsViewAllInvoicesOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    category: '',
    name: '',
    value: '',
    quantity: '1',
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });
  const [newAssetCategory, setNewAssetCategory] = useState({ name: '', icon: 'Package', color: 'blue' });

  const handleAddAsset = () => {
    if (!newAsset.category || !newAsset.name || !newAsset.value) {
      toast.error('Please fill all required fields');
      return;
    }
    setAssets([...assets, { 
      id: assets.length + 1, 
      ...newAsset, 
      value: parseFloat(newAsset.value),
      quantity: parseInt(newAsset.quantity) 
    }]);
    setNewAsset({ category: '', name: '', value: '', quantity: '1', purchaseDate: new Date().toISOString().split('T')[0], status: 'active' });
    setIsAddAssetOpen(false);
    toast.success('Asset added successfully!');
  };

  const handleAddAssetCategory = () => {
    if (!newAssetCategory.name) {
      toast.error('Please enter category name');
      return;
    }
    setAssetCategories([...assetCategories, { 
      id: assetCategories.length + 1, 
      ...newAssetCategory 
    }]);
    setNewAssetCategory({ name: '', icon: 'Package', color: 'blue' });
    setIsAddAssetCategoryOpen(false);
    toast.success('Asset category added successfully!');
  };

  const handleDeleteAssetCategory = (id: number) => {
    setAssetCategories(assetCategories.filter(cat => cat.id !== id));
    toast.success('Asset category deleted');
  };

  const handleDeleteAsset = (id: number) => {
    setAssets(assets.filter(asset => asset.id !== id));
    toast.success('Asset deleted');
  };

  const getTotalAssetsByCategory = (categoryName: string) => {
    return assets
      .filter(asset => asset.category === categoryName)
      .reduce((sum, asset) => sum + (asset.value * asset.quantity), 0);
  };

  const totalAssetsValue = assets.reduce((sum, asset) => sum + (asset.value * asset.quantity), 0);
  const totalAssetsCount = assets.reduce((sum, asset) => sum + asset.quantity, 0);

  // Company Logo Management State
  const [companyName, setCompanyName] = useState('BizManage Solutions Pvt Ltd');
  const [tempCompanyName, setTempCompanyName] = useState('BizManage Solutions Pvt Ltd');
  const [companyLogo, setCompanyLogo] = useState('🏢');
  const [companyColor] = useState('#1A2B4A');
  const [isLogoEditorOpen, setIsLogoEditorOpen] = useState(false);
  const [tempLogo, setTempLogo] = useState('🏢');
  const [logoType, setLogoType] = useState<'emoji' | 'image'>('emoji');
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState('');

  const handleLogoChange = () => {
    let updated = false;
    if (uploadedLogoUrl) {
      setCompanyLogo(uploadedLogoUrl);
      updated = true;
    }
    if (tempCompanyName && tempCompanyName !== companyName) {
      setCompanyName(tempCompanyName);
      updated = true;
    }
    if (updated) {
      setIsLogoEditorOpen(false);
      toast.success('Company information updated successfully!');
    } else {
      toast.error('Please make changes before saving');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedLogoUrl(dataUrl);
        setTempLogo(dataUrl);
        toast.success('Logo uploaded! Click "Save Logo" to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const popularEmojis = ['🏢', '🏛️', '🏭', '🏪', '🏬', '💼', '📊', '📈', '⚡', '🚀', '💡', '🌟', '🔷', '🔶', '🎯', '🌍'];

  // Product & Actual Costing State
  const [costings, setCostings] = useState([
    { id: 1, productName: 'Industrial Printer Model X5', estimatedCost: 85000, actualCost: 92000, variance: -7000, status: 'over-budget', linkedQuotation: 'QT-2024-001' },
    { id: 2, productName: 'Network Switch 48-Port', estimatedCost: 120000, actualCost: 115000, variance: 5000, status: 'under-budget', linkedQuotation: 'QT-2024-005' },
    { id: 3, productName: 'Custom Software License', estimatedCost: 250000, actualCost: 250000, variance: 0, status: 'on-budget', linkedQuotation: 'QT-2024-012' },
    { id: 4, productName: 'LED Display System', estimatedCost: 450000, actualCost: 480000, variance: -30000, status: 'over-budget', linkedQuotation: 'QT-2024-018' },
    { id: 5, productName: 'Security Camera System', estimatedCost: 180000, actualCost: 170000, variance: 10000, status: 'under-budget', linkedQuotation: 'QT-2024-023' },
  ]);

  const [isAddCostingOpen, setIsAddCostingOpen] = useState(false);
  const [isCostingImportOpen, setIsCostingImportOpen] = useState(false);
  const [newCosting, setNewCosting] = useState({
    productName: '',
    estimatedCost: '',
    actualCost: '',
    linkedQuotation: ''
  });

  const handleAddCosting = () => {
    if (!newCosting.productName || !newCosting.estimatedCost) {
      toast.error('Please fill product name and estimated cost');
      return;
    }
    const estimated = parseFloat(newCosting.estimatedCost);
    const actual = newCosting.actualCost ? parseFloat(newCosting.actualCost) : 0;
    const variance = actual ? actual - estimated : 0;
    let status = 'pending';
    if (actual) {
      if (variance > 0) status = 'over-budget';
      else if (variance < 0) status = 'under-budget';
      else status = 'on-budget';
    }
    setCostings([...costings, { 
      id: costings.length + 1, 
      productName: newCosting.productName,
      estimatedCost: estimated,
      actualCost: actual,
      variance: variance,
      status: status,
      linkedQuotation: newCosting.linkedQuotation
    }]);
    setNewCosting({ productName: '', estimatedCost: '', actualCost: '', linkedQuotation: '' });
    setIsAddCostingOpen(false);
    toast.success('Costing record added successfully!');
  };

  const handleDeleteCosting = (id: number) => {
    setCostings(costings.filter(cost => cost.id !== id));
    toast.success('Costing record deleted');
  };

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
        toast.error('Please upload Excel or CSV file');
        return;
      }
      toast.success(`File "${file.name}" uploaded! Processing costing data...`);
      setTimeout(() => {
        toast.success('Costing data imported successfully!');
        setIsCostingImportOpen(false);
      }, 1500);
    }
  };

  const totalEstimatedCost = costings.reduce((sum, c) => sum + c.estimatedCost, 0);
  const totalActualCost = costings.reduce((sum, c) => sum + c.actualCost, 0);
  const totalVariance = totalActualCost - totalEstimatedCost;
  const costingsWithActual = costings.filter(c => c.actualCost > 0).length;

  // PDF Generation Functions
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const logoHtml = companyLogo.startsWith('data:') || companyLogo.startsWith('http') 
      ? `<img src="${companyLogo}" alt="Logo" style="width: 60px; height: 60px; object-fit: contain; margin-right: 15px;">` 
      : `<div style="width: 60px; height: 60px; font-size: 40px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">${companyLogo}</div>`;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dashboard Report - ${companyName}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 3px solid ${companyColor}; padding-bottom: 20px; margin-bottom: 20px; display: flex; align-items: center; }
            .header-content { flex: 1; }
            .company-name { font-size: 28px; font-weight: bold; color: ${companyColor}; margin-bottom: 5px; }
            .subtitle { color: #666; font-size: 14px; }
            .title { font-size: 22px; font-weight: bold; margin: 20px 0; color: #1A2B4A; }
            .section { margin: 30px 0; }
            .section-title { font-size: 18px; font-weight: bold; color: #1A2B4A; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #1A2B4A; }
            .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
            .kpi-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
            .kpi-title { font-size: 12px; color: #666; margin-bottom: 8px; }
            .kpi-value { font-size: 20px; font-weight: bold; color: #1A2B4A; }
            .expense-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .expense-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
            .expense-category { font-size: 14px; font-weight: 600; color: #1A2B4A; margin-bottom: 5px; }
            .expense-amount { font-size: 18px; font-weight: bold; color: #059669; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoHtml}
            <div class="header-content">
              <div class="company-name">${companyName}</div>
              <div class="subtitle">Dashboard Report • Generated on ${currentDate}</div>
            </div>
          </div>
          
          <div class="title">DASHBOARD OVERVIEW</div>
          
          <div class="section">
            <div class="section-title">Key Performance Indicators</div>
            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-title">Total Revenue</div>
                <div class="kpi-value">LKR ${totalRevenue.toLocaleString()}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-title">Total Expenses</div>
                <div class="kpi-value">LKR ${totalExpenses.toLocaleString()}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-title">Net Profit</div>
                <div class="kpi-value">LKR ${(totalRevenue - totalExpenses).toLocaleString()}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-title">Active Clients</div>
                <div class="kpi-value">24</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Invoice Summary</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">248</div>
                <div class="stat-label">Total Invoices</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">186</div>
                <div class="stat-label">Paid Invoices</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">62</div>
                <div class="stat-label">Pending Invoices</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Expense Summary by Category</div>
            <div class="expense-grid">
              ${expenseCategories.map(cat => `
                <div class="expense-card">
                  <div class="expense-category">${cat.name}</div>
                  <div class="expense-amount">LKR ${getTotalByCategory(cat.name).toLocaleString()}</div>
                </div>
              `).join('')}
            </div>
            <div class="stats-grid" style="margin-top: 20px;">
              <div class="stat-card">
                <div class="stat-value">LKR ${totalExpensesPaid.toLocaleString()}</div>
                <div class="stat-label">Total Paid</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">LKR ${totalExpensesPending.toLocaleString()}</div>
                <div class="stat-label">Total Pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${expenses.length}</div>
                <div class="stat-label">Total Expenses</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Asset Overview</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${assets.length}</div>
                <div class="stat-label">Total Assets</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">LKR ${assets.reduce((sum, a) => sum + a.value, 0).toLocaleString()}</div>
                <div class="stat-label">Total Value</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${assets.filter(a => a.status === 'active').length}</div>
                <div class="stat-label">Active Assets</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Dashboard Report • ${companyName}</p>
            <p>Generated on ${currentDate}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    toast.success('Dashboard PDF opened in new window');
  };

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print PDF');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const logoHtml = companyLogo.startsWith('data:') || companyLogo.startsWith('http') 
      ? `<img src="${companyLogo}" alt="Logo" style="width: 60px; height: 60px; object-fit: contain; margin-right: 15px;">` 
      : `<div style="width: 60px; height: 60px; font-size: 40px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">${companyLogo}</div>`;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dashboard Report - ${companyName}</title>
          <style>
            @page { margin: 20mm; }
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 3px solid ${companyColor}; padding-bottom: 20px; margin-bottom: 20px; display: flex; align-items: center; }
            .header-content { flex: 1; }
            .company-name { font-size: 28px; font-weight: bold; color: ${companyColor}; margin-bottom: 5px; }
            .subtitle { color: #666; font-size: 14px; }
            .title { font-size: 22px; font-weight: bold; margin: 20px 0; color: #1A2B4A; }
            .section { margin: 30px 0; }
            .section-title { font-size: 18px; font-weight: bold; color: #1A2B4A; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #1A2B4A; }
            .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
            .kpi-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
            .kpi-title { font-size: 12px; color: #666; margin-bottom: 8px; }
            .kpi-value { font-size: 20px; font-weight: bold; color: #1A2B4A; }
            .expense-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .expense-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
            .expense-category { font-size: 14px; font-weight: 600; color: #1A2B4A; margin-bottom: 5px; }
            .expense-amount { font-size: 18px; font-weight: bold; color: #059669; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoHtml}
            <div class="header-content">
              <div class="company-name">${companyName}</div>
              <div class="subtitle">Dashboard Report • Generated on ${currentDate}</div>
            </div>
          </div>
          
          <div class="title">DASHBOARD OVERVIEW</div>
          
          <div class="section">
            <div class="section-title">Key Performance Indicators</div>
            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-title">Total Revenue</div>
                <div class="kpi-value">LKR ${totalRevenue.toLocaleString()}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-title">Total Expenses</div>
                <div class="kpi-value">LKR ${totalExpenses.toLocaleString()}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-title">Net Profit</div>
                <div class="kpi-value">LKR ${(totalRevenue - totalExpenses).toLocaleString()}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-title">Active Clients</div>
                <div class="kpi-value">24</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Invoice Summary</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">248</div>
                <div class="stat-label">Total Invoices</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">186</div>
                <div class="stat-label">Paid Invoices</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">62</div>
                <div class="stat-label">Pending Invoices</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Expense Summary by Category</div>
            <div class="expense-grid">
              ${expenseCategories.map(cat => `
                <div class="expense-card">
                  <div class="expense-category">${cat.name}</div>
                  <div class="expense-amount">LKR ${getTotalByCategory(cat.name).toLocaleString()}</div>
                </div>
              `).join('')}
            </div>
            <div class="stats-grid" style="margin-top: 20px;">
              <div class="stat-card">
                <div class="stat-value">LKR ${totalExpensesPaid.toLocaleString()}</div>
                <div class="stat-label">Total Paid</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">LKR ${totalExpensesPending.toLocaleString()}</div>
                <div class="stat-label">Total Pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${expenses.length}</div>
                <div class="stat-label">Total Expenses</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Asset Overview</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${assets.length}</div>
                <div class="stat-label">Total Assets</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">LKR ${assets.reduce((sum, a) => sum + a.value, 0).toLocaleString()}</div>
                <div class="stat-label">Total Value</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${assets.filter(a => a.status === 'active').length}</div>
                <div class="stat-label">Active Assets</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Dashboard Report • ${companyName}</p>
            <p>Generated on ${currentDate}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 500);
    }, 250);
    
    toast.success('Print dialog opened');
  };  
  
  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card className="shadow-lg border-slate-200 relative" style={{ borderTop: `4px solid ${companyColor}` }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="h-16 w-16 rounded-xl flex items-center justify-center shadow-md overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${companyColor}, ${companyColor}dd)` }}
              >
                {companyLogo.startsWith('data:') || companyLogo.startsWith('http') ? (
                  <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{companyLogo}</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: companyColor }}>
                  {companyName}
                </h1>
                <p className="text-sm text-slate-600 mt-1">Dashboard Overview • Last updated: Just now</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
          <button
            onClick={() => {
              setTempCompanyName(companyName);
              setIsLogoEditorOpen(true);
            }}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm"
          >
            <Edit className="h-4 w-4 text-slate-600" />
          </button>
        </CardContent>
      </Card>

      {/* Logo Editor Dialog */}
      <Dialog open={isLogoEditorOpen} onOpenChange={setIsLogoEditorOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Company Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Company Name Field */}
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={tempCompanyName}
                onChange={(e) => setTempCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            {/* Upload Image Button */}
            <div className="w-full">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
                id="logo-upload-main"
              />
              <label htmlFor="logo-upload-main" className="cursor-pointer block">
                <div 
                  className="w-full text-white font-semibold py-4 px-6 rounded-xl text-center transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)' }}
                >
                  📤 Upload Image
                </div>
              </label>
            </div>

            {/* Uploaded Image Preview */}
            {uploadedLogoUrl && (
              <div className="space-y-2">
                <Label>Uploaded Logo</Label>
                <div className="flex justify-center">
                  <div className="p-2 border-2 border-slate-200 rounded-lg">
                    <img 
                      src={uploadedLogoUrl} 
                      alt="Preview" 
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {uploadedLogoUrl && (
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="mb-3 block">Preview</Label>
                <div className="flex items-center gap-4 bg-white p-4 rounded-lg">
                  <div 
                    className="h-16 w-16 rounded-xl flex items-center justify-center shadow-md overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${companyColor}, ${companyColor}dd)` }}
                  >
                    <img src={uploadedLogoUrl} alt="Preview Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: companyColor }}>
                      {companyName}
                    </h2>
                    <p className="text-sm text-slate-600">Dashboard Overview</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleLogoChange}
                className="flex-1 text-white font-semibold"
                style={{ background: 'linear-gradient(to bottom right, #10b981, #059669)' }}
                disabled={!uploadedLogoUrl && tempCompanyName === companyName}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsLogoEditorOpen(false);
                  setUploadedLogoUrl('');
                  setTempLogo(companyLogo);
                  setTempCompanyName(companyName);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Invoice Management Section */}
      <Card className="shadow-lg border-slate-200 border-l-4 border-l-blue-600">
        <CardHeader>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Invoice Management</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Create, manage and track all your invoice</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <h4 className="text-lg font-semibold text-[#1A2B4A]">248</h4>
              <p className="text-sm text-slate-600">Total Invoices</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
              <h4 className="text-lg font-semibold text-emerald-700">186</h4>
              <p className="text-sm text-slate-600">Paid Invoices</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
              <h4 className="text-lg font-semibold text-amber-700">62</h4>
              <p className="text-sm text-slate-600">Pending Invoices</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              className="border-[#1A2B4A] text-[#1A2B4A] hover:bg-[#1A2B4A] hover:text-white"
              onClick={() => setIsViewAllInvoicesOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              View All Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expense Management Section */}
      <Card className="shadow-lg border-slate-200 border-l-4 border-l-slate-600">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">Expense Management</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Track all company expenses by custom categories</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-slate-600 text-slate-700 hover:bg-slate-50">
                  <Plus className="h-4 w-4 mr-2" />
                  New Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Expense Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input 
                      placeholder="e.g., Marketing Expenses"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select value={newCategory.color} onValueChange={(value) => setNewCategory({...newCategory, color: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="pink">Pink</SelectItem>
                        <SelectItem value="indigo">Indigo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddCategory} className="w-full bg-purple-600 hover:bg-purple-700">
                    Create Category
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (Rs)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input 
                      placeholder="Expense description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={newExpense.status} onValueChange={(value) => setNewExpense({...newExpense, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddExpense} className="w-full bg-slate-700 hover:bg-slate-800">
                    Add Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Expense Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)' }}>
              <h4 className="text-lg font-semibold" style={{ color: '#15803d' }}>Rs {(totalExpensesPaid / 1000).toFixed(0)}K</h4>
              <p className="text-sm text-slate-600">Total Paid</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #fffbeb, #fef3c7)' }}>
              <h4 className="text-lg font-semibold" style={{ color: '#b45309' }}>Rs {(totalExpensesPending / 1000).toFixed(0)}K</h4>
              <p className="text-sm text-slate-600">Pending Payment</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #eff6ff, #dbeafe)' }}>
              <h4 className="text-lg font-semibold" style={{ color: '#1d4ed8' }}>{expenseCategories.length}</h4>
              <p className="text-sm text-slate-600">Active Categories</p>
            </div>
          </div>

          {/* Expense Categories Grid */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Expense Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {expenseCategories.map((category) => {
                const total = getTotalByCategory(category.name);
                const colorStyles = {
                  blue: { background: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)' },
                  green: { background: 'linear-gradient(to bottom right, #16a34a, #15803d)' },
                  orange: { background: 'linear-gradient(to bottom right, #ea580c, #c2410c)' },
                  purple: { background: 'linear-gradient(to bottom right, #9333ea, #7e22ce)' },
                  red: { background: 'linear-gradient(to bottom right, #dc2626, #b91c1c)' },
                  pink: { background: 'linear-gradient(to bottom right, #ec4899, #db2777)' },
                  indigo: { background: 'linear-gradient(to bottom right, #6366f1, #4f46e5)' },
                };
                
                return (
                  <div 
                    key={category.id} 
                    className="relative p-4 rounded-lg text-white group"
                    style={colorStyles[category.color as keyof typeof colorStyles]}
                  >
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 rounded p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      {category.icon === 'Wallet' && <Wallet className="h-4 w-4" />}
                      {category.icon === 'Users' && <Users className="h-4 w-4" />}
                      {category.icon === 'Settings' && <Settings className="h-4 w-4" />}
                      {category.icon === 'DollarSign' && <DollarSign className="h-4 w-4" />}
                      {category.icon === 'FileText' && <FileText className="h-4 w-4" />}
                    </div>
                    <div className="text-2xl font-bold">Rs {(total / 1000).toFixed(0)}K</div>
                    <div className="text-xs mt-1 opacity-90">{category.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Expenses */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Expenses</h3>
            <div className="space-y-2">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{expense.description}</p>
                    <p className="text-xs text-slate-500">{expense.category} • {expense.date}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-medium text-sm">Rs {(expense.amount / 1000).toFixed(1)}K</p>
                    <Badge variant={expense.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                      {expense.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              className="border-slate-600 text-slate-700 hover:bg-slate-50"
              onClick={() => setIsViewAllExpensesOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              View All Expenses
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Asset & Inventory Management Section */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-[#1A2B4A]">Asset & Inventory Management</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Track company assets, stock balance, and inventory</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddAssetCategoryOpen} onOpenChange={setIsAddAssetCategoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  <Plus className="h-4 w-4 mr-2" />
                  New Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Asset Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input 
                      placeholder="e.g., Furniture, Software Licenses"
                      value={newAssetCategory.name}
                      onChange={(e) => setNewAssetCategory({...newAssetCategory, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select value={newAssetCategory.color} onValueChange={(value) => setNewAssetCategory({...newAssetCategory, color: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="pink">Pink</SelectItem>
                        <SelectItem value="indigo">Indigo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddAssetCategory} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Create Category
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Asset</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newAsset.category} onValueChange={(value) => setNewAsset({...newAsset, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Asset Name</Label>
                    <Input 
                      placeholder="e.g., MacBook Pro M2"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unit Value (Rs)</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        value={newAsset.value}
                        onChange={(e) => setNewAsset({...newAsset, value: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input 
                        type="number" 
                        placeholder="1"
                        value={newAsset.quantity}
                        onChange={(e) => setNewAsset({...newAsset, quantity: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Date</Label>
                    <Input 
                      type="date"
                      value={newAsset.purchaseDate}
                      onChange={(e) => setNewAsset({...newAsset, purchaseDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={newAsset.status} onValueChange={(value) => setNewAsset({...newAsset, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddAsset} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Add Asset
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Asset Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #eef2ff, #e0e7ff)' }}>
              <h4 className="text-lg font-semibold" style={{ color: '#4338ca' }}>Rs {(totalAssetsValue / 1000000).toFixed(1)}M</h4>
              <p className="text-sm text-slate-600">Total Asset Value</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #eff6ff, #dbeafe)' }}>
              <h4 className="text-lg font-semibold" style={{ color: '#1d4ed8' }}>{totalAssetsCount}</h4>
              <p className="text-sm text-slate-600">Total Items</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)' }}>
              <h4 className="text-lg font-semibold" style={{ color: '#15803d' }}>{assetCategories.length}</h4>
              <p className="text-sm text-slate-600">Asset Categories</p>
            </div>
          </div>

          {/* Asset Categories Grid */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Asset Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {assetCategories.map((category) => {
                const total = getTotalAssetsByCategory(category.name);
                const colorStyles = {
                  blue: { background: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)' },
                  green: { background: 'linear-gradient(to bottom right, #16a34a, #15803d)' },
                  orange: { background: 'linear-gradient(to bottom right, #ea580c, #c2410c)' },
                  purple: { background: 'linear-gradient(to bottom right, #9333ea, #7e22ce)' },
                  red: { background: 'linear-gradient(to bottom right, #dc2626, #b91c1c)' },
                  pink: { background: 'linear-gradient(to bottom right, #ec4899, #db2777)' },
                  indigo: { background: 'linear-gradient(to bottom right, #6366f1, #4f46e5)' },
                };
                
                return (
                  <div 
                    key={category.id} 
                    className="relative p-4 rounded-lg text-white group"
                    style={colorStyles[category.color as keyof typeof colorStyles]}
                  >
                    <button
                      onClick={() => handleDeleteAssetCategory(category.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 rounded p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      {category.icon === 'Building' && <Building className="h-4 w-4" />}
                      {category.icon === 'Smartphone' && <Smartphone className="h-4 w-4" />}
                      {category.icon === 'Laptop' && <Laptop className="h-4 w-4" />}
                      {category.icon === 'Car' && <Car className="h-4 w-4" />}
                      {category.icon === 'Wrench' && <Wrench className="h-4 w-4" />}
                      {category.icon === 'Package' && <Package className="h-4 w-4" />}
                    </div>
                    <div className="text-2xl font-bold">Rs {(total / 1000000).toFixed(1)}M</div>
                    <div className="text-xs mt-1 opacity-90">{category.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Assets */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Assets</h3>
            <div className="space-y-2">
              {assets.slice(0, 5).map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-slate-500">{asset.category} • Qty: {asset.quantity}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-medium text-sm">Rs {((asset.value * asset.quantity) / 1000).toFixed(0)}K</p>
                    <Badge variant={asset.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {asset.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteAsset(asset.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              onClick={() => setIsViewAllAssetsOpen(true)}
            >
              <Package className="h-4 w-4 mr-2" />
              View All Assets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product & Actual Costing Section */}
      <Card className="shadow-lg border-slate-200 border-l-4 border-l-slate-600">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">Product & Actual Costing</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Track estimated vs actual costs, link to quotations</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCostingImportOpen} onOpenChange={setIsCostingImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <FileText className="h-4 w-4 mr-2" />
                  Import Excel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Costing Data from Excel</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 Excel Format Required:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Column A: Product Name</li>
                      <li>• Column B: Estimated Cost (Rs)</li>
                      <li>• Column C: Actual Cost (Rs)</li>
                      <li>• Column D: Linked Quotation Number</li>
                    </ul>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-500 transition-colors">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleExcelImport}
                      className="hidden"
                      id="costing-upload"
                    />
                    <label htmlFor="costing-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="text-4xl">📊</div>
                        <p className="text-sm font-semibold text-slate-700">Click to upload Excel file</p>
                        <p className="text-xs text-slate-500">XLSX, XLS, CSV formats supported</p>
                      </div>
                    </label>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      toast.info('Downloading template...');
                      setTimeout(() => toast.success('Template downloaded!'), 1000);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Excel Template
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddCostingOpen} onOpenChange={setIsAddCostingOpen}>
              <DialogTrigger asChild>
                <Button className="bg-slate-700 hover:bg-slate-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Costing
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Product Costing</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input 
                      placeholder="e.g., Industrial Printer Model X5"
                      value={newCosting.productName}
                      onChange={(e) => setNewCosting({...newCosting, productName: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estimated Cost (Rs)</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        value={newCosting.estimatedCost}
                        onChange={(e) => setNewCosting({...newCosting, estimatedCost: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Actual Cost (Rs)</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00 (optional)"
                        value={newCosting.actualCost}
                        onChange={(e) => setNewCosting({...newCosting, actualCost: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Linked Quotation</Label>
                    <Input 
                      placeholder="e.g., QT-2024-001"
                      value={newCosting.linkedQuotation}
                      onChange={(e) => setNewCosting({...newCosting, linkedQuotation: e.target.value})}
                    />
                    <p className="text-xs text-slate-500">Link this costing to a tender/quotation</p>
                  </div>
                  <Button onClick={handleAddCosting} className="w-full bg-slate-700 hover:bg-slate-800">
                    Add Costing Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Costing Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)' }}>
              <h4 className="text-lg font-semibold text-emerald-700">Rs {(totalEstimatedCost / 1000).toFixed(0)}K</h4>
              <p className="text-sm text-slate-700">Total Estimated</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)' }}>
              <h4 className="text-lg font-semibold text-blue-700">Rs {(totalActualCost / 1000).toFixed(0)}K</h4>
              <p className="text-sm text-slate-700">Total Actual</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #fed7aa, #fdba74)' }}>
              <h4 className={`text-lg font-semibold ${
                totalVariance > 0 ? 'text-red-700' : totalVariance < 0 ? 'text-green-700' : 'text-orange-700'
              }`}>
                Rs {Math.abs(totalVariance / 1000).toFixed(0)}K {totalVariance > 0 ? '↑' : totalVariance < 0 ? '↓' : ''}
              </h4>
              <p className="text-sm text-slate-700">Variance</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #e9d5ff, #d8b4fe)' }}>
              <h4 className="text-lg font-semibold text-purple-700">{costingsWithActual}/{costings.length}</h4>
              <p className="text-sm text-slate-700">Completed</p>
            </div>
          </div>

          {/* Costing Records */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Costing Records</h3>
            <div className="space-y-2">
              {costings.slice(0, 5).map((costing) => {
                const variancePercent = costing.actualCost > 0 
                  ? ((costing.variance / costing.estimatedCost) * 100).toFixed(1)
                  : 0;
                return (
                  <div key={costing.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{costing.productName}</p>
                      <p className="text-xs text-slate-500">
                        {costing.linkedQuotation && `${costing.linkedQuotation} • `}
                        Est: Rs {(costing.estimatedCost / 1000).toFixed(0)}K | Act: Rs {(costing.actualCost / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className={`font-medium text-sm ${
                        costing.variance > 0 ? 'text-red-600' : costing.variance < 0 ? 'text-green-600' : 'text-slate-600'
                      }`}>
                        {costing.variance > 0 ? '+' : ''}{(costing.variance / 1000).toFixed(0)}K
                      </p>
                      <Badge 
                        variant={costing.status === 'on-budget' ? 'default' : 'secondary'} 
                        className={`text-xs ${
                          costing.status === 'over-budget' ? 'bg-red-100 text-red-700' :
                          costing.status === 'under-budget' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {costing.status === 'over-budget' && `Over ${Math.abs(Number(variancePercent))}%`}
                        {costing.status === 'under-budget' && `Under ${Math.abs(Number(variancePercent))}%`}
                        {costing.status === 'on-budget' && 'On Budget'}
                        {costing.status === 'pending' && 'Pending'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteCosting(costing.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-3">
            <Button 
              variant="outline" 
              className="border-slate-600 text-slate-700 hover:bg-slate-50"
              onClick={() => setIsViewAllCostingsOpen(true)}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              View All Costings
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => setIsLinkQuotationsOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Link to Quotations
            </Button>
          </div>
        </CardContent>
      </Card>

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

      {/* View All Costings Dialog */}
      <Dialog open={isViewAllCostingsOpen} onOpenChange={setIsViewAllCostingsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">All Product & Actual Costing Records</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <p className="text-sm text-slate-600">Total Estimated</p>
                <p className="text-2xl font-bold text-emerald-700">Rs {totalEstimatedCost.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <p className="text-sm text-slate-600">Total Actual</p>
                <p className="text-2xl font-bold text-blue-700">Rs {totalActualCost.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                <p className="text-sm text-slate-600">Total Variance</p>
                <p className={`text-2xl font-bold ${totalVariance > 0 ? 'text-red-600' : totalVariance < 0 ? 'text-green-600' : 'text-slate-700'}`}>
                  {totalVariance > 0 ? '+' : ''}Rs {totalVariance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {costings.map((costing) => {
                const variancePercent = costing.estimatedCost ? ((costing.variance / costing.estimatedCost) * 100).toFixed(1) : '0';
                const isOverBudget = costing.variance > 0;
                const isUnderBudget = costing.variance < 0;
                
                return (
                  <div key={costing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg text-slate-800">{costing.productName}</h4>
                        {costing.linkedQuotation && (
                          <p className="text-sm text-blue-600">
                            <FileText className="h-3 w-3 inline mr-1" />
                            {costing.linkedQuotation}
                          </p>
                        )}
                      </div>
                      {costing.actualCost > 0 && (
                        <Badge variant={isOverBudget ? "destructive" : isUnderBudget ? "default" : "secondary"}>
                          {isOverBudget ? `Over ${variancePercent}%` : isUnderBudget ? `Under ${Math.abs(parseFloat(variancePercent))}%` : 'On Budget'}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Estimated Cost</p>
                        <p className="font-semibold">Rs {costing.estimatedCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Actual Cost</p>
                        <p className="font-semibold text-blue-700">
                          Rs {costing.actualCost > 0 ? costing.actualCost.toLocaleString() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Variance</p>
                        <p className={`font-semibold ${isOverBudget ? 'text-red-600' : isUnderBudget ? 'text-green-600' : 'text-slate-700'}`}>
                          {costing.actualCost > 0 ? `${costing.variance > 0 ? '+' : ''}Rs ${costing.variance.toLocaleString()}` : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link to Quotations Dialog */}
      <Dialog open={isLinkQuotationsOpen} onOpenChange={setIsLinkQuotationsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">Link Costing Records to Quotations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Select a costing record and link it to an existing quotation for better tracking and cost management.
            </p>
            
            <div className="space-y-3">
              {costings.map((costing) => (
                <div key={costing.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-slate-800">{costing.productName}</h4>
                    <p className="text-sm text-slate-500">
                      Est: Rs {costing.estimatedCost.toLocaleString()} | 
                      Act: Rs {costing.actualCost > 0 ? costing.actualCost.toLocaleString() : '-'}
                    </p>
                    {costing.linkedQuotation && (
                      <p className="text-sm text-blue-600 mt-1">
                        <FileText className="h-3 w-3 inline mr-1" />
                        Linked to: {costing.linkedQuotation}
                      </p>
                    )}
                  </div>
                  <Select defaultValue={costing.linkedQuotation || "none"}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select quotation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Quotation</SelectItem>
                      <SelectItem value="QT-2024-001">QT-2024-001</SelectItem>
                      <SelectItem value="QT-2024-005">QT-2024-005</SelectItem>
                      <SelectItem value="QT-2024-012">QT-2024-012</SelectItem>
                      <SelectItem value="QT-2024-018">QT-2024-018</SelectItem>
                      <SelectItem value="QT-2024-023">QT-2024-023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsLinkQuotationsOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  toast.success('Quotation links updated successfully');
                  setIsLinkQuotationsOpen(false);
                }}
              >
                Save Links
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View All Invoices Dialog */}
      <Dialog open={isViewAllInvoicesOpen} onOpenChange={setIsViewAllInvoicesOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1A2B4A]">All Invoice Records</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <p className="text-sm text-slate-600">Total Invoices</p>
                <p className="text-2xl font-bold text-[#1A2B4A]">248</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <p className="text-sm text-slate-600">Paid</p>
                <p className="text-2xl font-bold text-emerald-700">186</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-amber-700">62</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                <p className="text-sm text-slate-600">Total Value</p>
                <p className="text-2xl font-bold text-slate-700">Rs 520M</p>
              </div>
            </div>

            <div className="space-y-3">
              {mockInvoices.slice(0, 10).map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg text-slate-800">{invoice.invoiceNumber}</h4>
                      <p className="text-sm text-slate-600">{invoice.clientName}</p>
                    </div>
                    <Badge 
                      variant={
                        invoice.status === 'paid' ? 'default' : 
                        invoice.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                      className={
                        invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        invoice.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-red-100 text-red-800 border-red-300'
                      }
                    >
                      {invoice.status === 'paid' ? 'Paid' : 
                       invoice.status === 'pending' ? 'Pending' : 
                       'Overdue'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Amount</p>
                      <p className="font-semibold text-[#1A2B4A]">Rs {invoice.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Date</p>
                      <p className="font-semibold">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Due Date</p>
                      <p className="font-semibold">{invoice.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-slate-500 mt-4">
              Showing 10 of 248 invoices
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View All Expenses Dialog */}
      <Dialog open={isViewAllExpensesOpen} onOpenChange={setIsViewAllExpensesOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">All Expense Records</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                <p className="text-sm text-slate-600">Total Expenses</p>
                <p className="text-2xl font-bold text-slate-700">
                  Rs {expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <p className="text-sm text-slate-600">Paid Expenses</p>
                <p className="text-2xl font-bold text-emerald-700">
                  Rs {expenses.filter(e => e.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {expenseCategories.map((category) => {
                const categoryExpenses = expenses.filter(exp => exp.category === category.name);
                const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                
                if (categoryExpenses.length === 0) return null;
                
                return (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-lg text-slate-800">{category.name}</h4>
                      <Badge variant="outline" className="text-sm">
                        Total: Rs {categoryTotal.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {categoryExpenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">{expense.description}</p>
                            <p className="text-xs text-slate-500">{expense.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-700">Rs {expense.amount.toLocaleString()}</p>
                            <Badge variant={expense.status === 'paid' ? 'default' : 'secondary'} className="text-xs mt-1">
                              {expense.status === 'paid' ? 'Paid' : 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View All Assets Dialog */}
      <Dialog open={isViewAllAssetsOpen} onOpenChange={setIsViewAllAssetsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-800">All Asset & Inventory Records</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                <p className="text-sm text-slate-600">Total Asset Value</p>
                <p className="text-2xl font-bold text-indigo-700">
                  Rs {assets.reduce((sum, asset) => sum + (asset.value * asset.quantity), 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <p className="text-sm text-slate-600">Total Assets</p>
                <p className="text-2xl font-bold text-emerald-700">{assets.length}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <p className="text-sm text-slate-600">Active Assets</p>
                <p className="text-2xl font-bold text-blue-700">
                  {assets.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {assetCategories.map((category) => {
                const categoryAssets = assets.filter(asset => asset.category === category.name);
                const categoryTotal = categoryAssets.reduce((sum, asset) => sum + (asset.value * asset.quantity), 0);
                
                if (categoryAssets.length === 0) return null;
                
                return (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-lg text-indigo-800">{category.name}</h4>
                      <Badge variant="outline" className="text-sm">
                        Total Value: Rs {categoryTotal.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {categoryAssets.map((asset) => (
                        <div key={asset.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">{asset.name}</p>
                            <p className="text-xs text-slate-500">
                              Purchased: {asset.purchaseDate} | Qty: {asset.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-indigo-700">
                              Rs {(asset.value * asset.quantity).toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">
                              Unit: Rs {asset.value.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
