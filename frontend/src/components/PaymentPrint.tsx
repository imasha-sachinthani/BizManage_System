import { Payment } from '../types';

interface PaymentPrintProps {
  payment: Payment;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyBankDetails?: string;
}

export function PaymentPrint({ 
  payment,
  companyName = "BizManage ERP Solutions (Pvt) Ltd",
  companyAddress = "No. 123, Galle Road, Colombo 03, Sri Lanka",
  companyPhone = "+94 11 234 5678",
  companyEmail = "info@bizmanage.lk",
  companyBankDetails = "Bank of Ceylon | Account: 123456789 | Branch: Colombo"
}: PaymentPrintProps) {
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
            <div className={`${
              payment.status === 'completed' ? 'bg-green-100 border-green-500' : 
              payment.status === 'partial' ? 'bg-blue-100 border-blue-500' :
              payment.status === 'overdue' ? 'bg-red-100 border-red-500' :
              'bg-amber-100 border-amber-500'
            } border-2 px-4 py-2 rounded-lg inline-block`}>
              <h2 className={`text-2xl font-bold ${
                payment.status === 'completed' ? 'text-green-700' : 
                payment.status === 'partial' ? 'text-blue-700' :
                payment.status === 'overdue' ? 'text-red-700' :
                'text-amber-700'
              }`}>
                {payment.status === 'completed' ? 'PAYMENT RECEIPT' :
                 payment.status === 'partial' ? 'PARTIAL PAYMENT' :
                 payment.status === 'overdue' ? 'OVERDUE NOTICE' :
                 'PAYMENT PENDING'}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase border-b border-slate-300 pb-1">
            Payment Information
          </h3>
          <div className="space-y-2">
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Payment No:</span>
              <span className="text-sm font-bold text-[#1A2B4A]">{payment.paymentNumber}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Invoice No:</span>
              <span className="text-sm font-bold text-[#1A2B4A]">{payment.invoiceNumber}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Due Date:</span>
              <span className="text-sm text-slate-700">{payment.dueDate}</span>
            </div>
            {payment.paymentDate && (
              <div className="flex">
                <span className="text-sm font-medium text-slate-600 w-32">Payment Date:</span>
                <span className="text-sm text-slate-700">{payment.paymentDate}</span>
              </div>
            )}
            <div className="flex">
              <span className="text-sm font-medium text-slate-600 w-32">Status:</span>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded inline-block ${
                payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                payment.status === 'partial' ? 'bg-blue-100 text-blue-700' :
                payment.status === 'overdue' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {payment.status.toUpperCase()}
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
              <span className="text-sm font-bold text-[#1A2B4A]">{payment.client}</span>
            </div>
            {payment.method && (
              <div className="flex">
                <span className="text-sm font-medium text-slate-600 w-32">Payment Method:</span>
                <span className="text-sm text-slate-700">{payment.method.replace('_', ' ').toUpperCase()}</span>
              </div>
            )}
            {payment.reference && (
              <div className="flex">
                <span className="text-sm font-medium text-slate-600 w-32">Reference:</span>
                <span className="text-sm text-slate-700">{payment.reference}</span>
              </div>
            )}
            {payment.daysOverdue && payment.daysOverdue > 0 && (
              <div className="flex">
                <span className="text-sm font-medium text-slate-600 w-32">Days Overdue:</span>
                <span className="text-sm font-bold text-red-700">{payment.daysOverdue} days</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overdue Alert */}
      {payment.status === 'overdue' && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
            <span>⚠️ OVERDUE PAYMENT NOTICE</span>
          </h3>
          <p className="text-sm text-red-700">
            This payment is overdue by {payment.daysOverdue} days. Please settle this amount immediately to avoid additional charges and legal action.
          </p>
        </div>
      )}

      {/* Payment Amount Details */}
      <div className="mb-6 bg-slate-50 p-6 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase">
          Payment Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white rounded border border-slate-200">
            <span className="text-sm font-medium text-slate-600">Invoice Amount:</span>
            <span className="text-lg font-bold text-slate-900">
              Rs {payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {payment.paidAmount && payment.paidAmount > 0 && (
            <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
              <span className="text-sm font-medium text-green-700">Amount Paid:</span>
              <span className="text-lg font-bold text-green-700">
                Rs {payment.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {payment.balanceAmount && payment.balanceAmount > 0 && (
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded border border-amber-200">
              <span className="text-sm font-medium text-amber-700">Balance Due:</span>
              <span className="text-lg font-bold text-amber-700">
                Rs {payment.balanceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {payment.status === 'completed' && (
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg">
              <span className="font-bold">Payment Status:</span>
              <span className="text-xl font-bold">PAID IN FULL</span>
            </div>
          )}

          {payment.status === 'pending' && (
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg">
              <span className="font-bold">Amount Due:</span>
              <span className="text-xl font-bold">
                Rs {payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {payment.status === 'overdue' && (
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg">
              <span className="font-bold">Overdue Amount:</span>
              <span className="text-xl font-bold">
                Rs {(payment.balanceAmount || payment.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bank Details */}
      {(payment.status === 'pending' || payment.status === 'overdue' || payment.status === 'partial') && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Payment Instructions:</h3>
          <p className="text-sm text-slate-700 mb-2">{companyBankDetails}</p>
          <p className="text-xs text-slate-600">Please include the invoice number ({payment.invoiceNumber}) as reference when making payment.</p>
        </div>
      )}

      {/* Notes */}
      {payment.notes && (
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Notes:</h3>
          <p className="text-sm text-slate-600">{payment.notes}</p>
        </div>
      )}

      {/* Payment Terms */}
      <div className="mb-8 p-4 bg-slate-50 border-l-4 border-slate-400 rounded-r-lg">
        <h3 className="text-xs font-semibold text-slate-700 mb-2 uppercase">Payment Terms & Conditions:</h3>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>Payment is due within the specified due date</li>
          <li>Late payment charges of 2% per month will be applied to overdue amounts</li>
          <li>All payments must be made in Sri Lankan Rupees (LKR)</li>
          <li>Please retain this document for your records</li>
          <li>For payment queries, contact our accounts department</li>
        </ul>
      </div>

      {/* Signatures - Only for completed payments */}
      {payment.status === 'completed' && (
        <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-300">
          <div className="text-center">
            <div className="border-t-2 border-slate-400 pt-2 mt-16">
              <p className="text-sm font-semibold text-slate-700">Received By</p>
              <p className="text-xs text-slate-500 mt-1">Authorized Signature</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-slate-400 pt-2 mt-16">
              <p className="text-sm font-semibold text-slate-700">Customer Signature</p>
              <p className="text-xs text-slate-500 mt-1">{payment.client}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-300 text-center">
        <p className="text-xs text-slate-500">
          {payment.status === 'completed' 
            ? 'Thank you for your payment. This is a computer-generated receipt.'
            : 'This is a computer-generated payment notice. Please make payment by the due date.'}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Generated on: {currentDate} | Document Reference: {payment.paymentNumber}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          {companyName} - Payment Management System
        </p>
      </div>
    </div>
  );
}
