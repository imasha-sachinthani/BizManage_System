import { Tender } from '../types';

interface TenderPrintProps {
  tender: Tender;
}

export function TenderPrint({ tender }: TenderPrintProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount: number) => {
    return `${tender.currency || 'Rs'} ${amount.toLocaleString()}`;
  };

  return (
    <div className="print-content bg-white p-8 max-w-4xl mx-auto">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print-content {
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="border-b-4 border-[#1A2B4A] pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#1A2B4A] mb-2">
              {tender.type === 'tender' ? 'TENDER' : 
               tender.type === 'quotation' ? 'QUOTATION' : 
               tender.type === 'rfq' ? 'REQUEST FOR QUOTATION' : 'BID'} DOCUMENT
            </h1>
            <p className="text-lg font-semibold text-slate-700">{tender.tenderNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600">Date Printed</div>
            <div className="font-semibold">{formatDate(new Date().toISOString())}</div>
          </div>
        </div>
      </div>

      {/* Tender Information */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1A2B4A] mb-4 border-b-2 border-slate-300 pb-2">
          TENDER INFORMATION
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-3">
              <span className="text-sm font-semibold text-slate-600">Title:</span>
              <p className="font-semibold text-lg">{tender.title}</p>
            </div>
            <div className="mb-3">
              <span className="text-sm font-semibold text-slate-600">Client/Organization:</span>
              <p className="font-semibold">{tender.client}</p>
            </div>
            <div className="mb-3">
              <span className="text-sm font-semibold text-slate-600">Estimated Value:</span>
              <p className="font-bold text-xl text-[#1A2B4A]">{formatCurrency(tender.value)}</p>
            </div>
            <div className="mb-3">
              <span className="text-sm font-semibold text-slate-600">Status:</span>
              <p className="font-semibold uppercase">{tender.status}</p>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <span className="text-sm font-semibold text-slate-600">Publish Date:</span>
              <p className="font-semibold">{formatDate(tender.publishDate)}</p>
            </div>
            <div className="mb-3">
              <span className="text-sm font-semibold text-slate-600">Submission Deadline:</span>
              <p className="font-bold text-lg text-red-700">{formatDate(tender.deadline)}</p>
            </div>
            {tender.submissionDate && (
              <div className="mb-3">
                <span className="text-sm font-semibold text-slate-600">Submission Date:</span>
                <p className="font-semibold">{formatDate(tender.submissionDate)}</p>
              </div>
            )}
            {tender.location && (
              <div className="mb-3">
                <span className="text-sm font-semibold text-slate-600">Location:</span>
                <p className="font-semibold">{tender.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {tender.description && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1A2B4A] mb-3 border-b-2 border-slate-300 pb-2">
            DESCRIPTION
          </h2>
          <p className="text-slate-700 whitespace-pre-wrap">{tender.description}</p>
        </div>
      )}

      {/* Bid Security Information */}
      {tender.bidSecurityRequired && (
        <div className="mb-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            🔒 BID SECURITY REQUIREMENTS
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-blue-800">Amount:</span>
                <p className="font-bold text-lg">{formatCurrency(tender.bidSecurityAmount || 0)}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-blue-800">Type:</span>
                <p className="font-semibold uppercase">{tender.bidSecurityType?.replace('_', ' ')}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-blue-800">Bank Name:</span>
                <p className="font-semibold">{tender.bidSecurityBankName || 'N/A'}</p>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-blue-800">Reference No:</span>
                <p className="font-semibold">{tender.bidSecurityReferenceNumber || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-blue-800">Issue Date:</span>
                <p className="font-semibold">{tender.bidSecurityIssueDate ? formatDate(tender.bidSecurityIssueDate) : 'N/A'}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-blue-800">Expiry Date:</span>
                <p className="font-bold text-red-700">{tender.bidSecurityExpiryDate ? formatDate(tender.bidSecurityExpiryDate) : 'N/A'}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-blue-800">Status:</span>
                <p className="font-semibold uppercase">{tender.bidSecurityStatus || 'PENDING'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Security Information */}
      {tender.performanceSecurityRequired && (
        <div className="mb-6 bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            ✅ PERFORMANCE SECURITY REQUIREMENTS
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-green-800">Amount:</span>
                <p className="font-bold text-lg">{formatCurrency(tender.performanceSecurityAmount || 0)}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-green-800">Type:</span>
                <p className="font-semibold uppercase">{tender.performanceSecurityType?.replace('_', ' ')}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-green-800">Bank Name:</span>
                <p className="font-semibold">{tender.performanceSecurityBankName || 'N/A'}</p>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-green-800">Reference No:</span>
                <p className="font-semibold">{tender.performanceSecurityReferenceNumber || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-green-800">Issue Date:</span>
                <p className="font-semibold">{tender.performanceSecurityIssueDate ? formatDate(tender.performanceSecurityIssueDate) : 'N/A'}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-green-800">Expiry Date:</span>
                <p className="font-bold text-red-700">{tender.performanceSecurityExpiryDate ? formatDate(tender.performanceSecurityExpiryDate) : 'N/A'}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-green-800">Status:</span>
                <p className="font-semibold uppercase">{tender.performanceSecurityStatus || 'PENDING'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PCA1 Information */}
      {tender.pca1Required && (
        <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
          <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            📄 PCA1 CERTIFICATE REQUIREMENTS
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-semibold text-amber-800">Submission Date:</span>
              <p className="font-semibold">{tender.pca1SubmissionDate ? formatDate(tender.pca1SubmissionDate) : 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-amber-800">Expiry Date:</span>
              <p className="font-bold text-red-700">{tender.pca1ExpiryDate ? formatDate(tender.pca1ExpiryDate) : 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-amber-800">Status:</span>
              <p className="font-semibold uppercase">{tender.pca1Status || 'PENDING'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Required Documents */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1A2B4A] mb-4 border-b-2 border-slate-300 pb-2">
          REQUIRED DOCUMENTS
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {tender.technicalDocumentsRequired.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-700 mb-2">Technical Documents:</h3>
              <ul className="list-disc list-inside space-y-1">
                {tender.technicalDocumentsRequired.map((doc, index) => (
                  <li key={index} className="text-sm text-slate-600">{doc}</li>
                ))}
              </ul>
            </div>
          )}
          {tender.financialDocumentsRequired.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-700 mb-2">Financial Documents:</h3>
              <ul className="list-disc list-inside space-y-1">
                {tender.financialDocumentsRequired.map((doc, index) => (
                  <li key={index} className="text-sm text-slate-600">{doc}</li>
                ))}
              </ul>
            </div>
          )}
          {tender.otherDocumentsRequired.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-700 mb-2">Other Documents:</h3>
              <ul className="list-disc list-inside space-y-1">
                {tender.otherDocumentsRequired.map((doc, index) => (
                  <li key={index} className="text-sm text-slate-600">{doc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      {(tender.contactPerson || tender.contactEmail || tender.contactPhone) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1A2B4A] mb-3 border-b-2 border-slate-300 pb-2">
            CONTACT INFORMATION
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {tender.contactPerson && (
              <div>
                <span className="text-sm font-semibold text-slate-600">Contact Person:</span>
                <p className="font-semibold">{tender.contactPerson}</p>
              </div>
            )}
            {tender.contactEmail && (
              <div>
                <span className="text-sm font-semibold text-slate-600">Email:</span>
                <p className="font-semibold">{tender.contactEmail}</p>
              </div>
            )}
            {tender.contactPhone && (
              <div>
                <span className="text-sm font-semibold text-slate-600">Phone:</span>
                <p className="font-semibold">{tender.contactPhone}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {tender.notes && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1A2B4A] mb-3 border-b-2 border-slate-300 pb-2">
            NOTES
          </h2>
          <p className="text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded">{tender.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t-2 border-slate-300">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="border-t-2 border-slate-400 pt-2 mt-12">
              <p className="text-sm font-semibold text-center">Prepared By</p>
              <p className="text-xs text-slate-500 text-center mt-1">Name & Signature</p>
            </div>
          </div>
          <div>
            <div className="border-t-2 border-slate-400 pt-2 mt-12">
              <p className="text-sm font-semibold text-center">Authorized By</p>
              <p className="text-xs text-slate-500 text-center mt-1">Name & Signature</p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Footer */}
      <div className="mt-8 text-center text-xs text-slate-500 border-t pt-4">
        <p>This is a computer-generated document for tender reference purposes.</p>
        <p className="mt-1">All information is confidential and proprietary.</p>
      </div>
    </div>
  );
}
