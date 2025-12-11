import { PurchaseOrder } from '../types';

interface PurchasePrintProps {
  purchase: PurchaseOrder;
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    taxId: string;
  };
}

export function PurchasePrint({ purchase, company }: PurchasePrintProps) {
  const calculateSubtotal = () => {
    return purchase.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;
  };

  const calculateTotal = () => {
    return purchase.amount || calculateSubtotal();
  };

  return (
    <div className="p-8 bg-white text-black max-w-[210mm] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{company.address}</p>
            <p>Phone: {company.phone}</p>
            <p>Email: {company.email}</p>
            <p>Tax ID: {company.taxId}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PURCHASE ORDER</h2>
          <div className="text-sm space-y-1">
            <p><span className="font-semibold">PO Number:</span> {purchase.poNumber}</p>
            <p><span className="font-semibold">Date:</span> {new Date(purchase.date).toLocaleDateString()}</p>
            <p><span className="font-semibold">Status:</span> <span className="uppercase font-medium">{purchase.status}</span></p>
          </div>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">SUPPLIER INFORMATION</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="font-semibold text-gray-900 mb-2">{purchase.supplier}</p>
          {purchase.supplierCountry && (
            <p className="text-sm text-gray-600">Country: {purchase.supplierCountry}</p>
          )}
          {purchase.supplierEmail && (
            <p className="text-sm text-gray-600">Email: {purchase.supplierEmail}</p>
          )}
          {purchase.supplierPhone && (
            <p className="text-sm text-gray-600">Phone: {purchase.supplierPhone}</p>
          )}
        </div>
      </div>

      {/* Delivery Information */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2">DELIVERY ADDRESS</h3>
          <div className="text-sm text-gray-600">
            <p>{company.name}</p>
            <p>{company.address}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2">DELIVERY DETAILS</h3>
          <div className="text-sm text-gray-600">
            <p><span className="font-semibold">Expected:</span> {new Date(purchase.deliveryDate).toLocaleDateString()}</p>
            {purchase.currency && purchase.currency !== 'LKR' && (
              <>
                <p><span className="font-semibold">Currency:</span> {purchase.currency}</p>
                {purchase.exchangeRate && (
                  <p><span className="font-semibold">Exchange Rate:</span> {purchase.exchangeRate}</p>
                )}
              </>
            )}
            {purchase.incoterms && (
              <p><span className="font-semibold">Incoterms:</span> {purchase.incoterms}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">ITEMS</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">Quantity</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">Unit Price</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchase.items && purchase.items.length > 0 ? (
              purchase.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{item.description}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-sm">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                    {purchase.currency || 'LKR'} {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                    {purchase.currency || 'LKR'} {(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-500">
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Subtotal:</span>
              <span>{purchase.currency || 'LKR'} {calculateSubtotal().toFixed(2)}</span>
            </div>
            {purchase.taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Tax:</span>
                <span>{purchase.currency || 'LKR'} {purchase.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
              <span>TOTAL:</span>
              <span>{purchase.currency || 'LKR'} {calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Notes */}
      {(purchase.terms || purchase.notes) && (
        <div className="mb-8 space-y-4">
          {purchase.terms && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">TERMS & CONDITIONS</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{purchase.terms}</p>
            </div>
          )}
          {purchase.notes && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">NOTES</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{purchase.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-300">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Authorized Signature</p>
            <div className="h-16 border-b border-gray-400 mt-8"></div>
            <p className="text-xs text-gray-600 mt-2">Signature & Date</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Supplier Acknowledgment</p>
            <div className="h-16 border-b border-gray-400 mt-8"></div>
            <p className="text-xs text-gray-600 mt-2">Signature & Date</p>
          </div>
        </div>
      </div>

      {/* Print-specific note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-xs text-gray-600 text-center">
          This is a computer-generated purchase order and is valid without signature. 
          {purchase.currency && purchase.currency !== 'LKR' && (
            <> For customs clearance, please refer to the attached commercial invoice.</>
          )}
        </p>
      </div>
    </div>
  );
}
