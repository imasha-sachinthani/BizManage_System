import { Return } from '../types';

interface ReturnPrintProps {
  returnData: Return;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

export function ReturnPrint({ 
  returnData,
  companyName = "BizManage ERP Solutions (Pvt) Ltd",
  companyAddress = "No. 123, Galle Road, Colombo 03, Sri Lanka",
  companyPhone = "+94 11 234 5678",
  companyEmail = "info@bizmanage.lk"
}: ReturnPrintProps) {
  const currentDate = new Date().toLocaleDateString('en-GB');

  return (
    <div className="print-document bg-white p-8 max-w-[210mm] mx-auto">
      {/* Header */}
      <div className="border-b-4 border-[#1A2B4A] pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#1A2B4A] mb-2">{companyName}</h1>
            <p className="text-sm text-slate-600">{companyAddress}</p>
            <p className="text-sm text-slate-600">Tel: {companyPhone} | Email: {companyEmail}</p>
          </div>
          <div className="text-right">
            <div className="bg-red-100 border-2 border-red-500 px-4 py-2 rounded-lg inline-block">
              <h2 className="text-2xl font-bold text-red-700">RETURN NOTE</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Return Details */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase border-b border-slate-300 pb-1">
            Return Information
          </h3>
          <div className="space-y-2">
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Return No:</span>
              <span className="text-sm font-bold text-[#1A2B4A]">{returnData.returnNumber}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Invoice No:</span>
              <span className="text-sm font-bold text-[#1A2B4A]">{returnData.invoiceNumber}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Return Date:</span>
              <span className="text-sm text-slate-700">{returnData.date}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Status:</span>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded inline-block ${
                returnData.status === 'approved' ? 'bg-green-100 text-green-700' :
                returnData.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                returnData.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {returnData.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase border-b border-slate-300 pb-1">
            Customer Information
          </h3>
          <div className="space-y-2">
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Client Name:</span>
              <span className="text-sm font-bold text-[#1A2B4A]">{returnData.client}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Refund Method:</span>
              <span className="text-sm text-slate-700">{returnData.refundMethod?.replace('_', ' ').toUpperCase() || 'N/A'}</span>
            </div>
            {returnData.approvedBy && (
              <div className="flex">
                <span className="text-sm font-medium text-slate-600 w-32">Approved By:</span>
                <span className="text-sm text-slate-700">{returnData.approvedBy}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return Reason */}
      <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Return Reason:</h3>
        <p className="text-sm text-slate-700">{returnData.reason}</p>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase border-b border-slate-300 pb-1">
          Returned Items
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1A2B4A] text-white">
              <th className="text-left p-3 text-xs font-semibold uppercase">#</th>
              <th className="text-left p-3 text-xs font-semibold uppercase">Description</th>
              <th className="text-left p-3 text-xs font-semibold uppercase">Reason</th>
              <th className="text-right p-3 text-xs font-semibold uppercase">Qty</th>
              <th className="text-right p-3 text-xs font-semibold uppercase">Unit Price</th>
              <th className="text-right p-3 text-xs font-semibold uppercase">VAT %</th>
              <th className="text-right p-3 text-xs font-semibold uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {returnData.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                <td className="p-3 text-sm text-slate-700 border-b border-slate-200">{index + 1}</td>
                <td className="p-3 text-sm text-slate-700 border-b border-slate-200">{item.description}</td>
                <td className="p-3 text-sm text-slate-600 border-b border-slate-200">{item.reason}</td>
                <td className="p-3 text-sm text-slate-700 border-b border-slate-200 text-right">{item.quantity}</td>
                <td className="p-3 text-sm text-slate-700 border-b border-slate-200 text-right">
                  Rs {item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-sm text-slate-700 border-b border-slate-200 text-right">{item.vatRate}%</td>
                <td className="p-3 text-sm font-semibold text-slate-900 border-b border-slate-200 text-right">
                  Rs {item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between p-3 bg-slate-50 rounded">
              <span className="text-sm font-medium text-slate-600">Subtotal:</span>
              <span className="text-sm font-semibold text-slate-900">
                Rs {returnData.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded">
              <span className="text-sm font-medium text-slate-600">VAT Amount:</span>
              <span className="text-sm font-semibold text-slate-900">
                Rs {returnData.vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg">
              <span className="font-bold">Total Refund Amount:</span>
              <span className="text-lg font-bold">
                Rs {returnData.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {returnData.notes && (
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Additional Notes:</h3>
          <p className="text-sm text-slate-600">{returnData.notes}</p>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="mb-8 p-4 bg-slate-50 border-l-4 border-slate-400 rounded-r-lg">
        <h3 className="text-xs font-semibold text-slate-700 mb-2 uppercase">Terms & Conditions:</h3>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>All returned items must be in original condition and packaging</li>
          <li>Returns must be accompanied by the original invoice</li>
          <li>Refunds will be processed within 7-14 business days</li>
          <li>Credit notes are valid for 6 months from the date of issue</li>
          <li>Items marked for replacement will be delivered within 5 business days</li>
        </ul>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-8 pt-8 border-t-2 border-slate-300">
        <div className="text-center">
          <div className="border-t-2 border-slate-400 pt-2 mt-16">
            <p className="text-sm font-semibold text-slate-700">Customer Signature</p>
            <p className="text-xs text-slate-500 mt-1">{returnData.client}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-slate-400 pt-2 mt-16">
            <p className="text-sm font-semibold text-slate-700">Received By</p>
            <p className="text-xs text-slate-500 mt-1">Company Representative</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-slate-400 pt-2 mt-16">
            <p className="text-sm font-semibold text-slate-700">Authorized By</p>
            <p className="text-xs text-slate-500 mt-1">{returnData.approvedBy || 'Management'}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-300 text-center">
        <p className="text-xs text-slate-500">
          This is a computer-generated document. No signature is required.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Generated on: {currentDate} | Document Reference: {returnData.returnNumber}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          {companyName} - Customer Returns Management System
        </p>
      </div>
    </div>
  );
}
