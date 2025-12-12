interface FinancialReportPrintProps {
  reportType: string;
  period: string;
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
}

export function FinancialReportPrint({ reportType, period, data }: FinancialReportPrintProps) {
  const getReportTitle = () => {
    switch (reportType) {
      case 'income':
        return 'Income Statement';
      case 'balance':
        return 'Balance Sheet';
      case 'cashflow':
        return 'Cash Flow Statement';
      case 'comprehensive':
        return 'Comprehensive Financial Report';
      default:
        return 'Financial Report';
    }
  };

  return (
    <div className="p-8 bg-white text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">BizManage Pro Edition</h1>
        <h2 className="text-2xl font-semibold mb-1">{getReportTitle()}</h2>
        <p className="text-lg text-gray-600">{period}</p>
        <p className="text-sm text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <hr className="border-2 border-gray-800 mb-6" />

      {/* Income Statement */}
      {(reportType === 'income' || reportType === 'comprehensive') && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 bg-gray-800 text-white p-2">Income Statement</h3>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold">Revenue</td>
                <td className="py-2 text-right font-semibold">Rs {data.revenue.toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Less: Cost of Sales</td>
                <td className="py-2 text-right text-red-600">(Rs {(data.expenses * 0.6).toLocaleString()})</td>
              </tr>
              <tr className="border-b bg-blue-50">
                <td className="py-2 font-semibold">Gross Profit</td>
                <td className="py-2 text-right font-semibold">Rs {(data.revenue - data.expenses * 0.6).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Less: Operating Expenses</td>
                <td className="py-2 text-right text-red-600">(Rs {(data.expenses * 0.4).toLocaleString()})</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Depreciation & Amortization</td>
                <td className="py-2 text-right text-red-600">(Rs {(data.expenses * 0.1).toLocaleString()})</td>
              </tr>
              <tr className="border-b bg-blue-50">
                <td className="py-2 font-semibold">EBITDA</td>
                <td className="py-2 text-right font-semibold">Rs {(data.netProfit * 1.25).toLocaleString()}</td>
              </tr>
              <tr className="bg-gray-800 text-white">
                <td className="py-3 font-bold">Net Profit / (Loss)</td>
                <td className="py-3 text-right text-xl font-bold">Rs {data.netProfit.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Balance Sheet */}
      {(reportType === 'balance' || reportType === 'comprehensive') && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 bg-gray-800 text-white p-2">Balance Sheet</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-3 border-b-2 border-gray-400 pb-1">ASSETS</h4>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Current Assets</td>
                    <td className="py-2 text-right"></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pl-4 text-sm">Cash & Bank</td>
                    <td className="py-2 text-right">Rs {data.cashFlow.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pl-4 text-sm">Accounts Receivable</td>
                    <td className="py-2 text-right">Rs {data.accountsReceivable.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pl-4 text-sm">Inventory</td>
                    <td className="py-2 text-right">Rs {data.inventory.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b bg-blue-50">
                    <td className="py-2 font-semibold">Total Current Assets</td>
                    <td className="py-2 text-right font-semibold">Rs {(data.cashFlow + data.accountsReceivable + data.inventory).toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Fixed Assets (Net)</td>
                    <td className="py-2 text-right">Rs {(data.assets - data.cashFlow - data.accountsReceivable - data.inventory).toLocaleString()}</td>
                  </tr>
                  <tr className="bg-gray-800 text-white">
                    <td className="py-3 font-bold">TOTAL ASSETS</td>
                    <td className="py-3 text-right font-bold">Rs {data.assets.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3 border-b-2 border-gray-400 pb-1">LIABILITIES & EQUITY</h4>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Current Liabilities</td>
                    <td className="py-2 text-right"></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pl-4 text-sm">Accounts Payable</td>
                    <td className="py-2 text-right">Rs {data.accountsPayable.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pl-4 text-sm">Short-term Debt</td>
                    <td className="py-2 text-right">Rs {(data.liabilities * 0.3).toLocaleString()}</td>
                  </tr>
                  <tr className="border-b bg-blue-50">
                    <td className="py-2 font-semibold">Total Current Liabilities</td>
                    <td className="py-2 text-right font-semibold">Rs {(data.accountsPayable + data.liabilities * 0.3).toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Long-term Debt</td>
                    <td className="py-2 text-right">Rs {(data.liabilities * 0.7).toLocaleString()}</td>
                  </tr>
                  <tr className="border-b bg-blue-50">
                    <td className="py-2 font-semibold">Total Liabilities</td>
                    <td className="py-2 text-right font-semibold">Rs {data.liabilities.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Shareholder's Equity</td>
                    <td className="py-2 text-right font-semibold">Rs {data.equity.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-gray-800 text-white">
                    <td className="py-3 font-bold">TOTAL LIABILITIES & EQUITY</td>
                    <td className="py-3 text-right font-bold">Rs {data.assets.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow Statement */}
      {(reportType === 'cashflow' || reportType === 'comprehensive') && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 bg-gray-800 text-white p-2">Cash Flow Statement</h3>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold">Operating Activities</td>
                <td className="py-2 text-right"></td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Net Profit</td>
                <td className="py-2 text-right">Rs {data.netProfit.toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Depreciation & Amortization</td>
                <td className="py-2 text-right">Rs {(data.expenses * 0.1).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Working Capital Changes</td>
                <td className="py-2 text-right">Rs {(data.cashFlow * 0.1).toLocaleString()}</td>
              </tr>
              <tr className="border-b bg-blue-50">
                <td className="py-2 font-semibold">Net Cash from Operations</td>
                <td className="py-2 text-right font-semibold">Rs {data.cashFlow.toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Investing Activities</td>
                <td className="py-2 text-right text-red-600">(Rs {(data.cashFlow * 0.3).toLocaleString()})</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Financing Activities</td>
                <td className="py-2 text-right text-red-600">(Rs {(data.cashFlow * 0.2).toLocaleString()})</td>
              </tr>
              <tr className="bg-gray-800 text-white">
                <td className="py-3 font-bold">Net Change in Cash</td>
                <td className="py-3 text-right font-bold">Rs {(data.cashFlow * 0.5).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Financial Ratios */}
      {reportType === 'comprehensive' && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 bg-gray-800 text-white p-2">Key Financial Ratios</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="border p-3">
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-lg font-bold">{((data.netProfit / data.revenue) * 100).toFixed(2)}%</p>
            </div>
            <div className="border p-3">
              <p className="text-sm text-gray-600">Current Ratio</p>
              <p className="text-lg font-bold">{((data.cashFlow + data.accountsReceivable + data.inventory) / (data.accountsPayable + data.liabilities * 0.3)).toFixed(2)}</p>
            </div>
            <div className="border p-3">
              <p className="text-sm text-gray-600">Debt to Equity</p>
              <p className="text-lg font-bold">{(data.liabilities / data.equity).toFixed(2)}</p>
            </div>
            <div className="border p-3">
              <p className="text-sm text-gray-600">ROA (Return on Assets)</p>
              <p className="text-lg font-bold">{((data.netProfit / data.assets) * 100).toFixed(2)}%</p>
            </div>
            <div className="border p-3">
              <p className="text-sm text-gray-600">ROE (Return on Equity)</p>
              <p className="text-lg font-bold">{((data.netProfit / data.equity) * 100).toFixed(2)}%</p>
            </div>
            <div className="border p-3">
              <p className="text-sm text-gray-600">Asset Turnover</p>
              <p className="text-lg font-bold">{(data.revenue / data.assets).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t-2 border-gray-800">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Prepared by:</p>
            <p>BizManage Accounting Department</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Approved by:</p>
            <p>____________________</p>
            <p className="text-xs text-gray-500 mt-1">Chief Financial Officer</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          This report is computer-generated and confidential. For internal use only.
        </p>
      </div>
    </div>
  );
}
