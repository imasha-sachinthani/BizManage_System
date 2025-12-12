import { useState } from 'react';
import { Plus, Search, Filter, FileText, Download, Upload, Printer, Edit, Trash2, Eye, Ship, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { Cusdec, CusdecItem, CusdecDocument } from '@/types';
import { toast } from 'sonner';

const Cusdecs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedCusdec, setSelectedCusdec] = useState<Cusdec | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<CusdecDocument[]>([]);

  // Sample CUSDEC data
  const [cusdecs, setCusdecs] = useState<Cusdec[]>([
    {
      id: '1',
      cusdecNumber: 'CUSDEC/2024/001234',
      purchaseOrderNumber: 'PO-2024-0156',
      importDate: '2024-11-15',
      clearanceDate: '2024-11-20',
      supplier: 'Global Electronics Ltd',
      supplierCountry: 'China',
      portOfEntry: 'Colombo Port',
      status: 'released',
      items: [
        {
          id: '1',
          description: 'LED Televisions 55"',
          hsCode: '8528.72.00',
          quantity: 50,
          unit: 'Units',
          unitPrice: 35000,
          totalValue: 1750000,
          dutyRate: 15,
          dutyAmount: 262500,
          vatRate: 18,
          vatAmount: 362250,
          palRate: 7.5,
          palAmount: 150937.50,
          nbtRate: 2,
          nbtAmount: 40250,
          totalTax: 815937.50
        },
        {
          id: '2',
          description: 'Laptop Computers',
          hsCode: '8471.30.00',
          quantity: 30,
          unit: 'Units',
          unitPrice: 75000,
          totalValue: 2250000,
          dutyRate: 0,
          dutyAmount: 0,
          vatRate: 18,
          vatAmount: 405000,
          palRate: 7.5,
          palAmount: 168750,
          nbtRate: 0,
          nbtAmount: 0,
          totalTax: 573750
        }
      ],
      totalCIF: 4150000,
      totalDuty: 262500,
      totalVAT: 767250,
      totalPAL: 319687.50,
      totalNBT: 40250,
      otherCharges: 25000,
      totalAmount: 5564687.50,
      customsAgent: 'Lanka Clearing Services',
      agentContact: '011-2345678',
      invoiceValue: 4000000,
      freightCharges: 100000,
      insuranceCharges: 50000,
      remarks: 'Priority clearance completed',
      documents: [
        { id: '1', name: 'Commercial Invoice.pdf', type: 'pdf', fileUrl: '/uploads/cusdec-001234-invoice.pdf', uploadDate: '2024-11-15', fileSize: '245 KB' },
        { id: '2', name: 'Packing List.xlsx', type: 'excel', fileUrl: '/uploads/cusdec-001234-packing.xlsx', uploadDate: '2024-11-15', fileSize: '128 KB' },
        { id: '3', name: 'Customs Declaration.pdf', type: 'pdf', fileUrl: '/uploads/cusdec-001234-declaration.pdf', uploadDate: '2024-11-20', fileSize: '512 KB' },
        { id: '4', name: 'Payment Receipt.jpg', type: 'image', fileUrl: '/uploads/cusdec-001234-receipt.jpg', uploadDate: '2024-11-20', fileSize: '856 KB' }
      ],
      createdDate: '2024-11-15',
      lastUpdated: '2024-11-20'
    },
    {
      id: '2',
      cusdecNumber: 'CUSDEC/2024/001189',
      purchaseOrderNumber: 'PO-2024-0142',
      importDate: '2024-11-10',
      clearanceDate: '2024-11-13',
      supplier: 'Fashion Exports Inc',
      supplierCountry: 'India',
      portOfEntry: 'Colombo Port',
      status: 'released',
      items: [
        {
          id: '1',
          description: 'Cotton Fabric Rolls',
          hsCode: '5208.31.00',
          quantity: 500,
          unit: 'Meters',
          unitPrice: 450,
          totalValue: 225000,
          dutyRate: 5,
          dutyAmount: 11250,
          vatRate: 18,
          vatAmount: 42525,
          palRate: 0,
          palAmount: 0,
          nbtRate: 2,
          nbtAmount: 4725,
          totalTax: 58500
        }
      ],
      totalCIF: 250000,
      totalDuty: 11250,
      totalVAT: 42525,
      totalPAL: 0,
      totalNBT: 4725,
      otherCharges: 8500,
      totalAmount: 317000,
      customsAgent: 'Quick Customs Agency',
      agentContact: '011-3456789',
      invoiceValue: 225000,
      freightCharges: 15000,
      insuranceCharges: 10000,
      documents: [
        { id: '1', name: 'Invoice.pdf', type: 'pdf', fileUrl: '/uploads/cusdec-001189-invoice.pdf', uploadDate: '2024-11-10', fileSize: '189 KB' },
        { id: '2', name: 'BOL.pdf', type: 'pdf', fileUrl: '/uploads/cusdec-001189-bol.pdf', uploadDate: '2024-11-10', fileSize: '312 KB' }
      ],
      createdDate: '2024-11-10',
      lastUpdated: '2024-11-13'
    },
    {
      id: '3',
      cusdecNumber: 'CUSDEC/2024/001256',
      importDate: '2024-11-25',
      supplier: 'Medical Supplies Global',
      supplierCountry: 'Germany',
      portOfEntry: 'Colombo Port',
      status: 'under_inspection',
      items: [
        {
          id: '1',
          description: 'Medical Equipment - X-Ray Machine',
          hsCode: '9022.14.00',
          quantity: 2,
          unit: 'Units',
          unitPrice: 1500000,
          totalValue: 3000000,
          dutyRate: 0,
          dutyAmount: 0,
          vatRate: 0,
          vatAmount: 0,
          palRate: 0,
          palAmount: 0,
          nbtRate: 0,
          nbtAmount: 0,
          totalTax: 0
        }
      ],
      totalCIF: 3200000,
      totalDuty: 0,
      totalVAT: 0,
      totalPAL: 0,
      totalNBT: 0,
      otherCharges: 35000,
      totalAmount: 3235000,
      customsAgent: 'Express Clearing',
      agentContact: '011-4567890',
      invoiceValue: 3000000,
      freightCharges: 150000,
      insuranceCharges: 50000,
      remarks: 'Awaiting FDA approval',
      documents: [
        { id: '1', name: 'Pro-forma Invoice.pdf', type: 'pdf', fileUrl: '/uploads/cusdec-001256-proforma.pdf', uploadDate: '2024-11-25', fileSize: '423 KB' },
        { id: '2', name: 'Certificate.pdf', type: 'pdf', fileUrl: '/uploads/cusdec-001256-cert.pdf', uploadDate: '2024-11-25', fileSize: '678 KB' }
      ],
      createdDate: '2024-11-25',
      lastUpdated: '2024-11-26'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-800 border-green-200';
      case 'cleared': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_inspection': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'held': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'image': return '🖼️';
      default: return '📎';
    }
  };

  const handleDownloadDocument = (doc: CusdecDocument) => {
    try {
      // For mock data, generate a dummy file content
      let content = '';
      let mimeType = '';
      
      if (doc.type === 'pdf') {
        // Generate a simple text file as PDF placeholder
        content = `CUSDEC Document\n\nFile Name: ${doc.name}\nType: PDF Document\nSize: ${doc.fileSize}\nUpload Date: ${doc.uploadDate}\n\nThis is a demo file for ${selectedCusdec?.cusdecNumber || 'CUSDEC'}.\n\nIn production, this would be the actual PDF document.`;
        mimeType = 'application/pdf';
      } else if (doc.type === 'excel') {
        content = `CUSDEC Document\n\nFile Name: ${doc.name}\nType: Excel Spreadsheet\nSize: ${doc.fileSize}\nUpload Date: ${doc.uploadDate}\n\nThis is a demo file.`;
        mimeType = 'application/vnd.ms-excel';
      } else if (doc.type === 'image') {
        content = `CUSDEC Document\n\nFile Name: ${doc.name}\nType: Image File\nSize: ${doc.fileSize}\nUpload Date: ${doc.uploadDate}\n\nThis is a demo file.`;
        mimeType = 'image/jpeg';
      } else {
        content = `CUSDEC Document\n\nFile Name: ${doc.name}\nSize: ${doc.fileSize}\nUpload Date: ${doc.uploadDate}`;
        mimeType = 'text/plain';
      }
      
      // Create blob and download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloading ${doc.name}`);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedCusdec) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CUSDEC - ${selectedCusdec.cusdecNumber}</title>
          <style>
            @page { margin: 20mm; }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 3px solid #1A2B4A; padding-bottom: 20px; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #1A2B4A; }
            .title { font-size: 22px; font-weight: bold; margin: 20px 0; color: #1A2B4A; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
            .detail-item { margin-bottom: 10px; }
            .label { font-size: 11px; color: #666; margin-bottom: 4px; text-transform: uppercase; }
            .value { font-size: 14px; font-weight: 600; color: #1A2B4A; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .status-released { background: #dcfce7; color: #16a34a; }
            .status-pending { background: #fef3c7; color: #d97706; }
            .status-inspection { background: #dbeafe; color: #2563eb; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #1A2B4A; color: white; padding: 12px; text-align: left; font-size: 12px; }
            .items-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            .items-table tr:last-child td { border-bottom: 2px solid #1A2B4A; }
            .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            .summary-section { background: #f8fafc; padding: 15px; border-radius: 8px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; }
            .summary-label { font-size: 13px; color: #666; }
            .summary-value { font-size: 14px; font-weight: 600; color: #1A2B4A; }
            .total-row { border-top: 2px solid #1A2B4A; padding-top: 10px; margin-top: 10px; }
            .total-value { font-size: 18px; font-weight: bold; color: #dc2626; }
            .documents { margin: 20px 0; }
            .doc-item { display: inline-block; margin: 5px 10px 5px 0; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; font-size: 12px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Your Company Name</div>
            <div style="color: #666; font-size: 14px;">123 Business Street, Colombo</div>
            <div style="color: #666; font-size: 14px;">Phone: +94 11 234 5678 | Email: info@yourcompany.com</div>
          </div>
          
          <div class="title">CUSTOMS DECLARATION (CUSDEC)</div>
          
          <div class="details-grid">
            <div class="detail-item">
              <div class="label">CUSDEC Number</div>
              <div class="value">${selectedCusdec.cusdecNumber}</div>
            </div>
            <div class="detail-item">
              <div class="label">PO Number</div>
              <div class="value">${selectedCusdec.purchaseOrderNumber}</div>
            </div>
            <div class="detail-item">
              <div class="label">Status</div>
              <div><span class="status status-${selectedCusdec.status}">${selectedCusdec.status.replace('_', ' ').toUpperCase()}</span></div>
            </div>
            <div class="detail-item">
              <div class="label">Supplier</div>
              <div class="value">${selectedCusdec.supplier}</div>
              <div style="font-size: 12px; color: #666;">${selectedCusdec.supplierCountry}</div>
            </div>
            <div class="detail-item">
              <div class="label">Import Date</div>
              <div class="value">${new Date(selectedCusdec.importDate).toLocaleDateString()}</div>
            </div>
            <div class="detail-item">
              <div class="label">Clearance Date</div>
              <div class="value">${selectedCusdec.clearanceDate ? new Date(selectedCusdec.clearanceDate).toLocaleDateString() : 'Pending'}</div>
            </div>
            <div class="detail-item">
              <div class="label">Port of Entry</div>
              <div class="value">${selectedCusdec.portOfEntry}</div>
            </div>
            <div class="detail-item">
              <div class="label">Customs Agent</div>
              <div class="value">${selectedCusdec.customsAgent}</div>
              <div style="font-size: 12px; color: #666;">${selectedCusdec.agentContact}</div>
            </div>
          </div>
          
          <h3 style="margin-top: 30px; color: #1A2B4A;">Import Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>HS Code</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Value</th>
                <th>Duty</th>
                <th>VAT</th>
                <th>Total Tax</th>
              </tr>
            </thead>
            <tbody>
              ${selectedCusdec.items.map(item => `
                <tr>
                  <td><strong>${item.description}</strong></td>
                  <td>${item.hsCode}</td>
                  <td>${item.quantity} ${item.unit}</td>
                  <td>Rs ${item.unitPrice.toLocaleString()}</td>
                  <td>Rs ${item.totalValue.toLocaleString()}</td>
                  <td>Rs ${item.dutyAmount.toLocaleString()}</td>
                  <td>Rs ${item.vatAmount.toLocaleString()}</td>
                  <td><strong>Rs ${item.totalTax.toLocaleString()}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <div class="summary-section">
              <h4 style="margin-top: 0; color: #1A2B4A;">Value Breakdown</h4>
              <div class="summary-row">
                <span class="summary-label">Invoice Value:</span>
                <span class="summary-value">Rs ${selectedCusdec.invoiceValue.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Freight Charges:</span>
                <span class="summary-value">Rs ${selectedCusdec.freightCharges.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Insurance:</span>
                <span class="summary-value">Rs ${selectedCusdec.insuranceCharges.toLocaleString()}</span>
              </div>
              <div class="summary-row total-row">
                <span class="summary-label"><strong>Total CIF Value:</strong></span>
                <span class="summary-value">Rs ${selectedCusdec.totalCIF.toLocaleString()}</span>
              </div>
            </div>
            
            <div class="summary-section">
              <h4 style="margin-top: 0; color: #1A2B4A;">Tax Summary</h4>
              <div class="summary-row">
                <span class="summary-label">Customs Duty:</span>
                <span class="summary-value">Rs ${selectedCusdec.totalDuty.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">VAT:</span>
                <span class="summary-value">Rs ${selectedCusdec.totalVAT.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">PAL:</span>
                <span class="summary-value">Rs ${selectedCusdec.totalPAL.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">NBT:</span>
                <span class="summary-value">Rs ${selectedCusdec.totalNBT.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Other Charges:</span>
                <span class="summary-value">Rs ${selectedCusdec.otherCharges.toLocaleString()}</span>
              </div>
              <div class="summary-row total-row">
                <span class="summary-label"><strong>Grand Total:</strong></span>
                <span class="total-value">Rs ${selectedCusdec.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          ${selectedCusdec.remarks ? `
            <div style="margin: 20px 0; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
              <strong style="color: #92400e;">Remarks:</strong>
              <p style="margin: 5px 0 0 0; color: #78350f;">${selectedCusdec.remarks}</p>
            </div>
          ` : ''}
          
          <div class="documents">
            <h4 style="color: #1A2B4A;">Attached Documents</h4>
            ${selectedCusdec.documents.map(doc => `
              <span class="doc-item">📄 ${doc.name} (${doc.fileSize})</span>
            `).join('')}
          </div>
          
          <div class="footer">
            <p>This is a computer-generated CUSDEC document.</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => printWindow.close(), 500);
      toast.success('PDF download initiated');
    }, 250);
  };

  const handlePrintDetails = () => {
    if (!selectedCusdec) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CUSDEC - ${selectedCusdec.cusdecNumber}</title>
          <style>
            @page { margin: 20mm; }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 3px solid #1A2B4A; padding-bottom: 20px; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #1A2B4A; }
            .title { font-size: 22px; font-weight: bold; margin: 20px 0; color: #1A2B4A; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
            .detail-item { margin-bottom: 10px; }
            .label { font-size: 11px; color: #666; margin-bottom: 4px; text-transform: uppercase; }
            .value { font-size: 14px; font-weight: 600; color: #1A2B4A; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .status-released { background: #dcfce7; color: #16a34a; }
            .status-pending { background: #fef3c7; color: #d97706; }
            .status-inspection { background: #dbeafe; color: #2563eb; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #1A2B4A; color: white; padding: 12px; text-align: left; font-size: 12px; }
            .items-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            .items-table tr:last-child td { border-bottom: 2px solid #1A2B4A; }
            .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            .summary-section { background: #f8fafc; padding: 15px; border-radius: 8px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; }
            .summary-label { font-size: 13px; color: #666; }
            .summary-value { font-size: 14px; font-weight: 600; color: #1A2B4A; }
            .total-row { border-top: 2px solid #1A2B4A; padding-top: 10px; margin-top: 10px; }
            .total-value { font-size: 18px; font-weight: bold; color: #dc2626; }
            .documents { margin: 20px 0; }
            .doc-item { display: inline-block; margin: 5px 10px 5px 0; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; font-size: 12px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Your Company Name</div>
            <div style="color: #666; font-size: 14px;">123 Business Street, Colombo</div>
            <div style="color: #666; font-size: 14px;">Phone: +94 11 234 5678 | Email: info@yourcompany.com</div>
          </div>
          
          <div class="title">CUSTOMS DECLARATION (CUSDEC)</div>
          
          <div class="details-grid">
            <div class="detail-item">
              <div class="label">CUSDEC Number</div>
              <div class="value">${selectedCusdec.cusdecNumber}</div>
            </div>
            <div class="detail-item">
              <div class="label">PO Number</div>
              <div class="value">${selectedCusdec.purchaseOrderNumber}</div>
            </div>
            <div class="detail-item">
              <div class="label">Status</div>
              <div><span class="status status-${selectedCusdec.status}">${selectedCusdec.status.replace('_', ' ').toUpperCase()}</span></div>
            </div>
            <div class="detail-item">
              <div class="label">Supplier</div>
              <div class="value">${selectedCusdec.supplier}</div>
              <div style="font-size: 12px; color: #666;">${selectedCusdec.supplierCountry}</div>
            </div>
            <div class="detail-item">
              <div class="label">Import Date</div>
              <div class="value">${new Date(selectedCusdec.importDate).toLocaleDateString()}</div>
            </div>
            <div class="detail-item">
              <div class="label">Clearance Date</div>
              <div class="value">${selectedCusdec.clearanceDate ? new Date(selectedCusdec.clearanceDate).toLocaleDateString() : 'Pending'}</div>
            </div>
            <div class="detail-item">
              <div class="label">Port of Entry</div>
              <div class="value">${selectedCusdec.portOfEntry}</div>
            </div>
            <div class="detail-item">
              <div class="label">Customs Agent</div>
              <div class="value">${selectedCusdec.customsAgent}</div>
              <div style="font-size: 12px; color: #666;">${selectedCusdec.agentContact}</div>
            </div>
          </div>
          
          <h3 style="margin-top: 30px; color: #1A2B4A;">Import Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>HS Code</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Value</th>
                <th>Duty</th>
                <th>VAT</th>
                <th>Total Tax</th>
              </tr>
            </thead>
            <tbody>
              ${selectedCusdec.items.map(item => `
                <tr>
                  <td><strong>${item.description}</strong></td>
                  <td>${item.hsCode}</td>
                  <td>${item.quantity} ${item.unit}</td>
                  <td>Rs ${item.unitPrice.toLocaleString()}</td>
                  <td>Rs ${item.totalValue.toLocaleString()}</td>
                  <td>Rs ${item.dutyAmount.toLocaleString()}</td>
                  <td>Rs ${item.vatAmount.toLocaleString()}</td>
                  <td><strong>Rs ${item.totalTax.toLocaleString()}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <div class="summary-section">
              <h4 style="margin-top: 0; color: #1A2B4A;">Value Breakdown</h4>
              <div class="summary-row">
                <span class="summary-label">Invoice Value:</span>
                <span class="summary-value">Rs ${selectedCusdec.invoiceValue.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Freight Charges:</span>
                <span class="summary-value">Rs ${selectedCusdec.freightCharges.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Insurance:</span>
                <span class="summary-value">Rs ${selectedCusdec.insuranceCharges.toLocaleString()}</span>
              </div>
              <div class="summary-row total-row">
                <span class="summary-label"><strong>Total CIF Value:</strong></span>
                <span class="summary-value">Rs ${selectedCusdec.totalCIF.toLocaleString()}</span>
              </div>
            </div>
            
            <div class="summary-section">
              <h4 style="margin-top: 0; color: #1A2B4A;">Tax Summary</h4>
              <div class="summary-row">
                <span class="summary-label">Customs Duty:</span>
                <span class="summary-value">Rs ${selectedCusdec.totalDuty.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">VAT:</span>
                <span class="summary-value">Rs ${selectedCusdec.totalVAT.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">PAL:</span>
                <span class="summary-value">Rs ${selectedCusdec.totalPAL.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">NBT:</span>
                <span class="summary-value">Rs ${selectedCusdec.totalNBT.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Other Charges:</span>
                <span class="summary-value">Rs ${selectedCusdec.otherCharges.toLocaleString()}</span>
              </div>
              <div class="summary-row total-row">
                <span class="summary-label"><strong>Grand Total:</strong></span>
                <span class="total-value">Rs ${selectedCusdec.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          ${selectedCusdec.remarks ? `
            <div style="margin: 20px 0; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
              <strong style="color: #92400e;">Remarks:</strong>
              <p style="margin: 5px 0 0 0; color: #78350f;">${selectedCusdec.remarks}</p>
            </div>
          ` : ''}
          
          <div class="documents">
            <h4 style="color: #1A2B4A;">Attached Documents</h4>
            ${selectedCusdec.documents.map(doc => `
              <span class="doc-item">📄 ${doc.name} (${doc.fileSize})</span>
            `).join('')}
          </div>
          
          <div class="footer">
            <p>This is a computer-generated CUSDEC document.</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      toast.success('Print dialog opened');
    }, 250);
  };

  const filteredCusdecs = cusdecs.filter(cusdec => {
    const matchesSearch = 
      cusdec.cusdecNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cusdec.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cusdec.items.some(item => 
        item.hsCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || cusdec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Declarations', value: cusdecs.length, color: 'from-blue-500 to-blue-700', textColor: 'text-white', icon: FileText, filterStatus: 'all' },
    { label: 'Released', value: cusdecs.filter(c => c.status === 'released').length, color: 'from-emerald-500 to-emerald-700', textColor: 'text-white', icon: Package, filterStatus: 'released' },
    { label: 'Under Inspection', value: cusdecs.filter(c => c.status === 'under_inspection').length, color: 'from-amber-500 to-amber-700', textColor: 'text-white', icon: Search, filterStatus: 'under_inspection' },
    { label: 'Total Value (CIF)', value: `Rs. ${(cusdecs.reduce((sum, c) => sum + c.totalCIF, 0) / 1000000).toFixed(2)}M`, color: 'from-purple-500 to-purple-700', textColor: 'text-white', icon: Ship, filterStatus: 'all' },
    { label: 'Total Duty Paid', value: `Rs. ${(cusdecs.reduce((sum, c) => sum + c.totalDuty, 0) / 1000).toFixed(0)}K`, color: 'from-red-500 to-red-700', textColor: 'text-white', icon: FileText, filterStatus: 'all' },
    { label: 'Total VAT Paid', value: `Rs. ${(cusdecs.reduce((sum, c) => sum + c.totalVAT, 0) / 1000).toFixed(0)}K`, color: 'from-orange-200 to-orange-300', textColor: 'text-gray-900', icon: FileText, filterStatus: 'all' }
  ];

  const handleStatCardClick = (filterStatus: string, label: string) => {
    setStatusFilter(filterStatus);
    if (filterStatus === 'all') {
      toast.info(`Showing all ${label.toLowerCase()}`);
    } else {
      toast.info(`Filtered to show ${label.toLowerCase()} declarations`);
    }
  };

  const handlePrint = (cusdec: Cusdec) => {
    setSelectedCusdec(cusdec);
    setTimeout(() => window.print(), 100);
  };

  const handleViewDetails = (cusdec: Cusdec) => {
    setSelectedCusdec(cusdec);
    setShowDetailsDialog(true);
  };

  const handleExport = () => {
    // Create CSV header
    const headers = [
      'CUSDEC Number',
      'PO Number',
      'Supplier',
      'Country',
      'Import Date',
      'Port of Entry',
      'Status',
      'CIF Value',
      'Total Duty',
      'Total VAT',
      'Total PAL',
      'Total NBT',
      'Total Amount',
      'Items Count'
    ];

    // Create CSV rows from filtered cusdecs
    const rows = filteredCusdecs.map(cusdec => [
      cusdec.cusdecNumber,
      cusdec.purchaseOrderNumber || '-',
      cusdec.supplier,
      cusdec.supplierCountry,
      new Date(cusdec.importDate).toLocaleDateString(),
      cusdec.portOfEntry,
      getStatusLabel(cusdec.status),
      cusdec.totalCIF,
      cusdec.totalDuty,
      cusdec.totalVAT,
      cusdec.totalPAL,
      cusdec.totalNBT,
      cusdec.totalAmount,
      cusdec.items.length
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `CUSDEC_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CUSDEC data exported successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1A2B4A]">CUSDEC Management</h1>
          <p className="text-slate-600 mt-1">Customs Declaration & Import Documentation</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A2B4A] hover:bg-[#0F1729]">
              <Plus className="h-4 w-4 mr-2" />
              New CUSDEC
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customs Declaration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CUSDEC Number *</Label>
                  <Input placeholder="CUSDEC/2024/XXXXXX" />
                </div>
                <div>
                  <Label>Purchase Order Number</Label>
                  <Input placeholder="PO-2024-XXXX" />
                </div>
                <div>
                  <Label>Import Date *</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Port of Entry *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select port" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="colombo">Colombo Port</SelectItem>
                      <SelectItem value="hambantota">Hambantota Port</SelectItem>
                      <SelectItem value="bia">BIA - Air Cargo</SelectItem>
                      <SelectItem value="katunayake">Katunayake</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Supplier Name *</Label>
                  <Input placeholder="Enter supplier name" />
                </div>
                <div>
                  <Label>Supplier Country *</Label>
                  <Input placeholder="Enter country" />
                </div>
                <div>
                  <Label>Customs Agent</Label>
                  <Input placeholder="Agent name" />
                </div>
                <div>
                  <Label>Agent Contact</Label>
                  <Input placeholder="Contact number" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Invoice Value (FOB) *</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label>Freight Charges</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label>Insurance Charges</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>

              <div>
                <Label>Remarks</Label>
                <Textarea placeholder="Additional notes or remarks" rows={3} />
              </div>

              <Separator />

              <div>
                <Label className="text-lg font-semibold">Upload Documents</Label>
                <p className="text-xs text-slate-500 mb-3">Upload CUSDEC, invoices, packing lists, and related documents</p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-slate-500">Supports: PDF, Excel, Images (JPG, PNG)</p>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const newDocs: CusdecDocument[] = Array.from(files).map((file, index) => ({
                          id: `${Date.now()}-${index}`,
                          name: file.name,
                          type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'excel',
                          fileUrl: URL.createObjectURL(file),
                          uploadDate: new Date().toISOString().split('T')[0],
                          fileSize: `${(file.size / 1024).toFixed(0)} KB`
                        }));
                        setUploadedDocuments([...uploadedDocuments, ...newDocs]);
                        toast.success(`${files.length} file(s) uploaded successfully`);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                </div>
                {uploadedDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-semibold">Uploaded Files ({uploadedDocuments.length})</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {uploadedDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-slate-500">{doc.fileSize} • {doc.uploadDate}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedDocuments(uploadedDocuments.filter(d => d.id !== doc.id));
                              toast.success('File removed');
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button className="bg-[#1A2B4A] hover:bg-[#0F1729]" onClick={() => {
                  toast.success('CUSDEC entry created successfully!');
                  setShowAddDialog(false);
                }}>
                  Save CUSDEC
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isLastCard = index === stats.length - 1;
          return (
            <Card 
              key={index} 
              className={`bg-gradient-to-br ${stat.color} border-0 shadow-lg hover:scale-105 transition-transform cursor-pointer`}
              onClick={() => handleStatCardClick(stat.filterStatus, stat.label)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${stat.textColor} opacity-80`} />
                </div>
                <p className={`text-2xl font-bold mb-1 ${stat.textColor}`}>{stat.value}</p>
                <p className={`text-xs ${stat.textColor} opacity-90`}>{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search by CUSDEC number, supplier, HS code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cleared">Cleared</SelectItem>
                <SelectItem value="under_inspection">Under Inspection</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="held">Held</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CUSDEC List */}
      <div className="space-y-4">
        {filteredCusdecs.map((cusdec) => (
          <Card key={cusdec.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#1A2B4A]">{cusdec.cusdecNumber}</h3>
                    <Badge className={getStatusColor(cusdec.status)}>
                      {getStatusLabel(cusdec.status)}
                    </Badge>
                    {cusdec.purchaseOrderNumber && (
                      <span className="text-sm text-slate-500">PO: {cusdec.purchaseOrderNumber}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Supplier:</span>
                      <p className="font-semibold">{cusdec.supplier}</p>
                      <p className="text-xs text-slate-500">{cusdec.supplierCountry}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Import Date:</span>
                      <p className="font-semibold">{new Date(cusdec.importDate).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500">{cusdec.portOfEntry}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">CIF Value:</span>
                      <p className="font-semibold">Rs. {cusdec.totalCIF.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{cusdec.items.length} item(s)</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Total Tax & Duty:</span>
                      <p className="font-semibold text-red-600">Rs. {(cusdec.totalDuty + cusdec.totalVAT + cusdec.totalPAL + cusdec.totalNBT).toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Total: Rs. {cusdec.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(cusdec)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Documents */}
              {cusdec.documents.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Attached Documents ({cusdec.documents.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {cusdec.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm hover:bg-slate-100 cursor-pointer"
                        onClick={() => handleDownloadDocument(doc)}
                      >
                        <span>{getFileIcon(doc.type)}</span>
                        <span className="font-medium">{doc.name}</span>
                        <span className="text-xs text-slate-500">({doc.fileSize})</span>
                        <Download className="h-3 w-3 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>CUSDEC Details - {selectedCusdec?.cusdecNumber}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="bg-[#1A2B4A] text-white hover:bg-[#0F1729] hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintDetails}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print PDF
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedCusdec && (
            <div className="space-y-6 mt-4">
              {/* Header Info */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded">
                <div>
                  <p className="text-xs text-slate-500">Supplier</p>
                  <p className="font-semibold">{selectedCusdec.supplier}</p>
                  <p className="text-sm text-slate-600">{selectedCusdec.supplierCountry}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Import Date</p>
                  <p className="font-semibold">{new Date(selectedCusdec.importDate).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-600">{selectedCusdec.portOfEntry}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <Badge className={getStatusColor(selectedCusdec.status)}>
                    {getStatusLabel(selectedCusdec.status)}
                  </Badge>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Imported Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3 text-left">HS Code</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Value</th>
                        <th className="p-3 text-right">Duty</th>
                        <th className="p-3 text-right">VAT</th>
                        <th className="p-3 text-right">Total Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCusdec.items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3 font-mono text-xs">{item.hsCode}</td>
                          <td className="p-3">{item.description}</td>
                          <td className="p-3 text-right">{item.quantity} {item.unit}</td>
                          <td className="p-3 text-right">Rs. {item.unitPrice.toLocaleString()}</td>
                          <td className="p-3 text-right font-semibold">Rs. {item.totalValue.toLocaleString()}</td>
                          <td className="p-3 text-right">Rs. {item.dutyAmount.toLocaleString()}</td>
                          <td className="p-3 text-right">Rs. {item.vatAmount.toLocaleString()}</td>
                          <td className="p-3 text-right font-semibold text-red-600">Rs. {item.totalTax.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax Summary */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold mb-3">Invoice Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>FOB Value:</span>
                      <span className="font-semibold">Rs. {selectedCusdec.invoiceValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Freight:</span>
                      <span className="font-semibold">Rs. {selectedCusdec.freightCharges.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance:</span>
                      <span className="font-semibold">Rs. {selectedCusdec.insuranceCharges.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>CIF Value:</span>
                      <span>Rs. {selectedCusdec.totalCIF.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold mb-3">Tax & Duty Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Customs Duty:</span>
                      <span className="font-semibold">Rs. {selectedCusdec.totalDuty.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (18%):</span>
                      <span className="font-semibold">Rs. {selectedCusdec.totalVAT.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PAL (7.5%):</span>
                      <span className="font-semibold">Rs. {selectedCusdec.totalPAL.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NBT (2%):</span>
                      <span className="font-semibold">Rs. {selectedCusdec.totalNBT.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Charges:</span>
                      <span className="font-semibold">Rs. {selectedCusdec.otherCharges.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg text-red-700">
                      <span>Total Amount:</span>
                      <span>Rs. {selectedCusdec.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="font-semibold mb-3">Attached Documents</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedCusdec.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getFileIcon(doc.type)}</span>
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.fileSize} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadDocument(doc)}
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cusdecs;
