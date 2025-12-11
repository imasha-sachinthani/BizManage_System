interface VATReportPrintProps {
  period: string;
  data: {
    totalSales: number;
    totalPurchases: number;
    vatCollected: number;
    vatPaid: number;
    vatPayable: number;
    transactions?: Array<{
      date: string;
      description: string;
      amount: number;
      vat: number;
      type: 'sale' | 'purchase';
    }>;
  };
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    taxId: string;
    vatRegNumber: string;
  };
}

export function VATReportPrint({ period, data, company }: VATReportPrintProps) {
  const formatDate = () => {
    return new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="p-8 bg-white text-black max-w-[210mm] mx-auto">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">VALUE ADDED TAX (VAT) RETURN</h1>
        <h2 className="text-xl text-gray-700 mb-4">{period}</h2>
        <div className="text-sm text-gray-600">
          <p className="font-semibold text-lg">{company.name}</p>
          <p>{company.address}</p>
          <p>VAT Registration Number: {company.vatRegNumber}</p>
          <p>TIN: {company.taxId}</p>
        </div>
      </div>

      {/* Declaration */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-gray-700">
          <strong>Declaration:</strong> I declare that the information given in this return is true and correct to the best of my knowledge and belief.
        </p>
        <p className="text-xs text-gray-600 mt-2">Report Generated: {formatDate()}</p>
      </div>

      {/* Part A - Output VAT (Sales) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3">PART A - OUTPUT VAT (Sales)</h3>
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm">Taxable Value (Rs)</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm">VAT Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm">Standard Rated Supplies @ 15%</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.totalSales.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">
                {data.vatCollected.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm">Zero Rated Supplies</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">0.00</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">0.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm">Exempt Supplies</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">0.00</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">0.00</td>
            </tr>
            <tr className="bg-blue-50 font-bold">
              <td className="border border-gray-300 px-4 py-2 text-sm">Total Output VAT (A)</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.totalSales.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.vatCollected.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Part B - Input VAT (Purchases) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3">PART B - INPUT VAT (Purchases)</h3>
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm">Purchase Value (Rs)</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm">VAT Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm">Local Purchases with VAT</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.totalPurchases.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">
                {data.vatPaid.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm">Imports with VAT</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">0.00</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">0.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm">Services from Abroad</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">0.00</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">0.00</td>
            </tr>
            <tr className="bg-blue-50 font-bold">
              <td className="border border-gray-300 px-4 py-2 text-sm">Total Input VAT (B)</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.totalPurchases.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                {data.vatPaid.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Part C - VAT Payable/Refundable */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3">PART C - NET VAT POSITION</h3>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-3 text-sm font-semibold">Output VAT (A)</td>
              <td className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold">
                {data.vatCollected.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-3 text-sm font-semibold">Less: Input VAT (B)</td>
              <td className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold">
                ({data.vatPaid.toLocaleString('en-LK', { minimumFractionDigits: 2 })})
              </td>
            </tr>
            <tr className={`${data.vatPayable >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <td className="border border-gray-300 px-4 py-4 text-base font-bold">
                {data.vatPayable >= 0 ? 'VAT PAYABLE TO IRD (A-B)' : 'VAT REFUNDABLE FROM IRD (B-A)'}
              </td>
              <td className="border border-gray-300 px-4 py-4 text-right text-lg font-bold">
                Rs {Math.abs(data.vatPayable).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Information */}
      {data.vatPayable > 0 && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <h4 className="font-bold text-gray-900 mb-2">Payment Instructions:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Payment must be made before the 20th day of the month following the taxable period</li>
            <li>Use payment voucher (Form PV) for payment at any state bank</li>
            <li>Keep payment receipt for your records</li>
            <li>Late payment attracts penalty and interest charges</li>
          </ul>
        </div>
      )}

      {/* Signature Section */}
      <div className="mt-12 grid grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Prepared By:</p>
          <div className="h-16 border-b-2 border-gray-400 mt-8"></div>
          <div className="mt-2">
            <p className="text-xs text-gray-600">Name: _______________________</p>
            <p className="text-xs text-gray-600">Designation: _________________</p>
            <p className="text-xs text-gray-600">Date: _______________________</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Authorized Signature:</p>
          <div className="h-16 border-b-2 border-gray-400 mt-8"></div>
          <div className="mt-2">
            <p className="text-xs text-gray-600">Name: _______________________</p>
            <p className="text-xs text-gray-600">Designation: _________________</p>
            <p className="text-xs text-gray-600">Date: _______________________</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>This is a computer-generated document. For official submission, please sign and stamp.</p>
        <p className="mt-1">Inland Revenue Department, Sri Lanka | VAT Act No. 14 of 2002 (as amended)</p>
      </div>
    </div>
  );
}
