// Export utilities for reports

export const exportToExcel = (data: any[], filename: string) => {
  // Create CSV content
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportVATToExcel = (period: string, data: any) => {
  const vatData = [
    { Section: 'PART A - OUTPUT VAT', Description: 'Standard Rated Supplies @ 15%', 'Taxable Value': data.totalSales, 'VAT Amount': data.vatCollected },
    { Section: 'PART A - OUTPUT VAT', Description: 'Zero Rated Supplies', 'Taxable Value': 0, 'VAT Amount': 0 },
    { Section: 'PART A - OUTPUT VAT', Description: 'Total Output VAT', 'Taxable Value': data.totalSales, 'VAT Amount': data.vatCollected },
    { Section: '', Description: '', 'Taxable Value': '', 'VAT Amount': '' },
    { Section: 'PART B - INPUT VAT', Description: 'Local Purchases with VAT', 'Purchase Value': data.totalPurchases, 'VAT Amount': data.vatPaid },
    { Section: 'PART B - INPUT VAT', Description: 'Imports with VAT', 'Purchase Value': 0, 'VAT Amount': 0 },
    { Section: 'PART B - INPUT VAT', Description: 'Total Input VAT', 'Purchase Value': data.totalPurchases, 'VAT Amount': data.vatPaid },
    { Section: '', Description: '', 'Taxable Value': '', 'VAT Amount': '' },
    { Section: 'PART C - NET VAT', Description: 'Output VAT', 'Amount': data.vatCollected, 'VAT Amount': '' },
    { Section: 'PART C - NET VAT', Description: 'Less: Input VAT', 'Amount': -data.vatPaid, 'VAT Amount': '' },
    { Section: 'PART C - NET VAT', Description: 'VAT PAYABLE', 'Amount': data.vatPayable, 'VAT Amount': '' },
  ];

  exportToExcel(vatData, `VAT_Report_${period}`);
};

export const exportAuditToExcel = (year: string, data: any) => {
  const auditData = [
    { Category: 'ASSETS', Item: 'Cash and Cash Equivalents', Amount: data.cashFlow },
    { Category: 'ASSETS', Item: 'Trade Receivables', Amount: data.accountsReceivable },
    { Category: 'ASSETS', Item: 'Inventory', Amount: data.inventory },
    { Category: 'ASSETS', Item: 'TOTAL ASSETS', Amount: data.assets },
    { Category: '', Item: '', Amount: '' },
    { Category: 'LIABILITIES', Item: 'Trade Payables', Amount: data.accountsPayable },
    { Category: 'LIABILITIES', Item: 'Other Liabilities', Amount: data.liabilities - data.accountsPayable },
    { Category: 'LIABILITIES', Item: 'TOTAL LIABILITIES', Amount: data.liabilities },
    { Category: '', Item: '', Amount: '' },
    { Category: 'EQUITY', Item: 'Share Capital', Amount: data.equity * 0.6 },
    { Category: 'EQUITY', Item: 'Retained Earnings', Amount: data.equity * 0.4 },
    { Category: 'EQUITY', Item: 'TOTAL EQUITY', Amount: data.equity },
    { Category: '', Item: '', Amount: '' },
    { Category: 'INCOME STATEMENT', Item: 'Revenue', Amount: data.revenue },
    { Category: 'INCOME STATEMENT', Item: 'Less: Expenses', Amount: -data.expenses },
    { Category: 'INCOME STATEMENT', Item: 'NET PROFIT', Amount: data.netProfit },
  ];

  exportToExcel(auditData, `Audit_Report_${year}`);
};

export const exportFinancialReportToExcel = (period: string, data: any) => {
  const financialData = [
    { Metric: 'Total Revenue', Amount: data.revenue, Percentage: '100%' },
    { Metric: 'Total Expenses', Amount: data.expenses, Percentage: ((data.expenses / data.revenue) * 100).toFixed(2) + '%' },
    { Metric: 'Gross Profit', Amount: data.revenue - data.expenses, Percentage: (((data.revenue - data.expenses) / data.revenue) * 100).toFixed(2) + '%' },
    { Metric: 'Net Profit', Amount: data.netProfit, Percentage: ((data.netProfit / data.revenue) * 100).toFixed(2) + '%' },
    { Metric: '', Amount: '', Percentage: '' },
    { Metric: 'Total Assets', Amount: data.assets, Percentage: '' },
    { Metric: 'Total Liabilities', Amount: data.liabilities, Percentage: '' },
    { Metric: 'Total Equity', Amount: data.equity, Percentage: '' },
    { Metric: '', Amount: '', Percentage: '' },
    { Metric: 'Cash Flow', Amount: data.cashFlow, Percentage: '' },
    { Metric: 'Accounts Receivable', Amount: data.accountsReceivable, Percentage: '' },
    { Metric: 'Accounts Payable', Amount: data.accountsPayable, Percentage: '' },
  ];

  exportToExcel(financialData, `Financial_Report_${period}`);
};

export const exportToPDF = () => {
  // Trigger browser print dialog which can save as PDF
  window.print();
};
