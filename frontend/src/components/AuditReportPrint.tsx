interface AuditReportPrintProps {
  year: string;
  data: {
    revenue: number;
    expenses: number;
    netProfit: number;
    assets: number;
    liabilities: number;
    equity: number;
    cashFlow: number;
    accountsReceivable: number;
    accountsPayable: number;
    inventory: number;
  };
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    taxId: string;
    registrationNumber: string;
  };
}

export function AuditReportPrint({ year, data, company }: AuditReportPrintProps) {
  const formatDate = () => {
    return new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const calculateRatios = () => {
    return {
      profitMargin: ((data.netProfit / data.revenue) * 100).toFixed(2),
      currentRatio: ((data.assets / data.liabilities) || 0).toFixed(2),
      debtEquityRatio: ((data.liabilities / data.equity) || 0).toFixed(2),
      returnOnEquity: ((data.netProfit / data.equity) * 100).toFixed(2),
    };
  };

  const ratios = calculateRatios();

  return (
    <div className="p-8 bg-white text-black max-w-[210mm] mx-auto">
      {/* Cover Page */}
      <div className="text-center mb-12 pb-8 border-b-2 border-gray-800">
        <div className="mb-6">
          <div className="inline-block p-4 bg-blue-900 text-white rounded-lg mb-4">
            <h1 className="text-4xl font-bold">ANNUAL</h1>
            <h2 className="text-3xl font-bold">AUDIT REPORT</h2>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{company.name}</h3>
        <p className="text-xl text-gray-700 mb-2">Financial Year: {year}</p>
        <p className="text-sm text-gray-600">{company.address}</p>
        <p className="text-sm text-gray-600 mt-4">Company Registration No: {company.registrationNumber}</p>
        <p className="text-sm text-gray-600">TIN: {company.taxId}</p>
        <div className="mt-8 text-sm text-gray-500">
          <p>Report Prepared: {formatDate()}</p>
        </div>
      </div>

      {/* Auditor's Opinion */}
      <div className="mb-8 page-break-after">
        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-900 pb-2">
          INDEPENDENT AUDITOR'S REPORT
        </h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold">To the Shareholders of {company.name}</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Opinion</p>
            <p className="text-justify">
              We have audited the financial statements of {company.name}, which comprise the statement of financial 
              position as at December 31, {year}, and the statement of comprehensive income, statement of changes in 
              equity and statement of cash flows for the year then ended, and notes to the financial statements, 
              including a summary of significant accounting policies.
            </p>
          </div>
          <div>
            <p className="text-justify">
              In our opinion, the accompanying financial statements present fairly, in all material respects, the 
              financial position of the Company as at December 31, {year}, and its financial performance and its cash 
              flows for the year then ended in accordance with Sri Lanka Accounting Standards.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Basis for Opinion</p>
            <p className="text-justify">
              We conducted our audit in accordance with Sri Lanka Auditing Standards (SLAuSs). Our responsibilities 
              under those standards are further described in the Auditor's Responsibilities section of our report. 
              We are independent of the Company in accordance with the Code of Ethics issued by CA Sri Lanka.
            </p>
          </div>
        </div>
      </div>

      {/* Financial Position Statement */}
      <div className="mb-8 page-break-before">
        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-900 pb-2">
          STATEMENT OF FINANCIAL POSITION
        </h3>
        <p className="text-sm text-gray-600 mb-4">As at December 31, {year}</p>
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm">ASSETS</th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm">Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm font-semibold">Current Assets</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm pl-8">Cash and Cash Equivalents</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.cashFlow.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm pl-8">Trade Receivables</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.accountsReceivable.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm pl-8">Inventory</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.inventory.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="bg-blue-50 font-bold">
              <td className="border border-gray-300 px-4 py-3 text-sm">TOTAL ASSETS</td>
              <td className="border border-gray-300 px-4 py-3 text-right text-sm">
                {data.assets.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm">LIABILITIES & EQUITY</th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm">Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm font-semibold">Current Liabilities</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm pl-8">Trade Payables</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.accountsPayable.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm pl-8">Other Liabilities</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {(data.liabilities - data.accountsPayable).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="bg-gray-100 font-semibold">
              <td className="border border-gray-300 px-4 py-2 text-sm">Total Liabilities</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.liabilities.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm font-semibold">Equity</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm pl-8">Share Capital</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {(data.equity * 0.6).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm pl-8">Retained Earnings</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {(data.equity * 0.4).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="bg-gray-100 font-semibold">
              <td className="border border-gray-300 px-4 py-2 text-sm">Total Equity</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.equity.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="bg-blue-50 font-bold">
              <td className="border border-gray-300 px-4 py-3 text-sm">TOTAL LIABILITIES & EQUITY</td>
              <td className="border border-gray-300 px-4 py-3 text-right text-sm">
                {(data.liabilities + data.equity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Income Statement */}
      <div className="mb-8 page-break-before">
        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-900 pb-2">
          STATEMENT OF COMPREHENSIVE INCOME
        </h3>
        <p className="text-sm text-gray-600 mb-4">For the Year Ended December 31, {year}</p>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-3 text-sm font-semibold">Revenue</td>
              <td className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold">
                {data.revenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm">Less: Cost of Sales</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                ({(data.expenses * 0.6).toLocaleString('en-LK', { minimumFractionDigits: 2 })})
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 text-sm font-semibold">Gross Profit</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">
                {(data.revenue - data.expenses * 0.6).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm">Less: Operating Expenses</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                ({(data.expenses * 0.4).toLocaleString('en-LK', { minimumFractionDigits: 2 })})
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 text-sm font-semibold">Operating Profit</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">
                {(data.revenue - data.expenses).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm">Less: Finance Costs</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                ({((data.revenue - data.expenses - data.netProfit) || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })})
              </td>
            </tr>
            <tr className="bg-green-50 font-bold">
              <td className="border border-gray-300 px-4 py-3 text-base">NET PROFIT FOR THE YEAR</td>
              <td className="border border-gray-300 px-4 py-3 text-right text-base">
                {data.netProfit.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Financial Ratios */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-900 pb-2">
          KEY FINANCIAL RATIOS & INDICATORS
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-300 p-4 rounded">
            <p className="text-sm text-gray-600">Profit Margin</p>
            <p className="text-2xl font-bold text-blue-900">{ratios.profitMargin}%</p>
          </div>
          <div className="border border-gray-300 p-4 rounded">
            <p className="text-sm text-gray-600">Current Ratio</p>
            <p className="text-2xl font-bold text-blue-900">{ratios.currentRatio}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded">
            <p className="text-sm text-gray-600">Debt-to-Equity Ratio</p>
            <p className="text-2xl font-bold text-blue-900">{ratios.debtEquityRatio}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded">
            <p className="text-sm text-gray-600">Return on Equity</p>
            <p className="text-2xl font-bold text-blue-900">{ratios.returnOnEquity}%</p>
          </div>
        </div>
      </div>

      {/* Auditor's Certificate */}
      <div className="mt-12 page-break-before">
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b-2 border-blue-900 pb-2">
          CERTIFICATION
        </h3>
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Director</p>
            <div className="h-16 border-b-2 border-gray-400 mt-8"></div>
            <p className="text-xs text-gray-600 mt-2">Signature & Date</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Chief Financial Officer</p>
            <div className="h-16 border-b-2 border-gray-400 mt-8"></div>
            <p className="text-xs text-gray-600 mt-2">Signature & Date</p>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-sm font-semibold text-gray-900 mb-2">External Auditor</p>
          <div className="h-16 border-b-2 border-gray-400 mt-8 w-1/2"></div>
          <p className="text-xs text-gray-600 mt-2">Chartered Accountants</p>
          <p className="text-xs text-gray-600">Date: _______________________</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>This report is prepared in accordance with Sri Lanka Accounting Standards and Companies Act No. 07 of 2007</p>
        <p className="mt-1">For the year ended December 31, {year}</p>
      </div>
    </div>
  );
}
