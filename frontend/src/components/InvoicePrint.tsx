import { Invoice } from '../types';

interface InvoicePrintProps {
  invoice: Invoice;
  company?: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxId?: string;
  };
}

export function InvoicePrint({ invoice, company }: InvoicePrintProps) {
  return (
    <div className="print-invoice">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-invoice,
          .print-invoice * {
            visibility: visible;
          }
          .print-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
        {/* Header with Company Info */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-[#1A2B4A]">
          <div className="flex-1">
            {company?.logo ? (
              <img src={company.logo} alt={company.name} className="h-16 mb-4" />
            ) : (
              <h1 className="text-3xl font-bold text-[#1A2B4A] mb-2">{company?.name || 'Your Company'}</h1>
            )}
            {company?.address && <p className="text-sm text-gray-600">{company.address}</p>}
            {company?.phone && <p className="text-sm text-gray-600">Tel: {company.phone}</p>}
            {company?.email && <p className="text-sm text-gray-600">Email: {company.email}</p>}
            {company?.taxId && <p className="text-sm text-gray-600">Tax ID: {company.taxId}</p>}
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-[#1A2B4A] mb-2">INVOICE</h2>
            <p className="text-lg font-semibold text-gray-700">{invoice.invoiceNumber}</p>
          </div>
        </div>

        {/* Client and Invoice Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To:</h3>
            <p className="text-lg font-semibold text-gray-900">{invoice.client}</p>
            {invoice.clientDetails?.address && (
              <p className="text-sm text-gray-600 mt-1">{invoice.clientDetails.address}</p>
            )}
            {invoice.clientDetails?.phone && (
              <p className="text-sm text-gray-600">Tel: {invoice.clientDetails.phone}</p>
            )}
            {invoice.clientDetails?.email && (
              <p className="text-sm text-gray-600">Email: {invoice.clientDetails.email}</p>
            )}
          </div>
          <div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-500 uppercase">Invoice Date:</span>
                <span className="text-sm text-gray-900">{invoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-500 uppercase">Due Date:</span>
                <span className="text-sm text-gray-900">{invoice.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-500 uppercase">Status:</span>
                <span className={`text-sm font-semibold px-2 py-1 rounded ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Qty</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Unit Price</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">VAT</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-900">{item.description}</td>
                  <td className="text-center py-3 px-4 text-sm text-gray-900">{item.quantity}</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-900">
                    Rs {item.unitPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-right py-3 px-4 text-sm text-gray-900">{item.vatRate}%</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-900">
                    Rs {item.total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-3 px-4 text-center text-sm text-gray-500">
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="space-y-2">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">
                  Rs {(invoice.amount / 1.15).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">VAT (15%):</span>
                <span className="text-gray-900">
                  Rs {(invoice.amount - invoice.amount / 1.15).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-300 text-lg font-bold">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-[#1A2B4A]">
                  Rs {invoice.amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8 p-4 bg-gray-50 rounded">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h4>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-2">This is a computer-generated invoice and is valid without signature.</p>
        </div>
      </div>
    </div>
  );
}
