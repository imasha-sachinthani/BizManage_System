import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Client } from '../types';
import { Mail, Phone, MapPin, FileText, TrendingUp, Calendar, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';

interface ClientDetailProps {
  client: Client;
}

export function ClientDetail({ client }: ClientDetailProps) {
  // Mock data for client statistics
  const stats = {
    totalInvoices: 24,
    paidInvoices: 20,
    pendingInvoices: 4,
    totalRevenue: 2450000,
    outstandingAmount: 125000,
    averagePaymentDays: 28,
  };

  const recentInvoices = [
    { id: '1', number: 'INV-2024-001', date: '2024-01-15', amount: 125000, status: 'paid' },
    { id: '2', number: 'INV-2024-002', date: '2024-02-10', amount: 87500, status: 'pending' },
    { id: '3', number: 'INV-2024-003', date: '2024-02-28', amount: 156000, status: 'paid' },
  ];

  const interactions = [
    { id: '1', type: 'CALL', subject: 'Follow-up call', date: '2024-03-01', notes: 'Discussed upcoming project requirements' },
    { id: '2', type: 'EMAIL', subject: 'Sent proposal', date: '2024-02-28', notes: 'Proposal for Q2 services' },
    { id: '3', type: 'MEETING', subject: 'Quarterly review', date: '2024-02-15', notes: 'Reviewed performance and discussed expansion' },
  ];

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Client Details - ${client.name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 3px solid #1A2B4A; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #1A2B4A; margin-bottom: 5px; }
            .title { font-size: 24px; font-weight: bold; margin: 20px 0; color: #1A2B4A; }
            .client-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; }
            .client-info { flex: 1; }
            .client-name { font-size: 22px; font-weight: bold; color: #1A2B4A; margin-bottom: 5px; }
            .client-code { color: #64748b; font-size: 14px; }
            .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; background: #10b981; color: white; }
            .status-inactive { background: #6b7280; }
            .section { margin: 30px 0; }
            .section-title { font-size: 18px; font-weight: 600; color: #1A2B4A; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .info-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8fafc; border-radius: 6px; }
            .info-icon { color: #64748b; }
            .info-text { font-size: 14px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 20px 0; }
            .stat-card { padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; }
            .stat-value { font-size: 24px; font-weight: bold; color: #1A2B4A; margin: 10px 0; }
            .stat-label { font-size: 13px; color: #64748b; }
            .stat-sub { font-size: 11px; color: #94a3b8; margin-top: 5px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .detail-item { padding: 12px; background: #f8fafc; border-radius: 6px; }
            .detail-label { font-size: 12px; color: #64748b; margin-bottom: 5px; }
            .detail-value { font-size: 15px; font-weight: 600; color: #1A2B4A; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; background: #e0e7ff; color: #3730a3; }
            .notes-section { padding: 15px; background: #f8fafc; border-radius: 8px; margin-top: 15px; }
            .notes-text { font-size: 13px; color: #475569; line-height: 1.6; }
            .invoices-list { margin-top: 15px; }
            .invoice-item { display: flex; justify-content: space-between; padding: 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e5e7eb; }
            .invoice-left { flex: 1; }
            .invoice-number { font-size: 14px; font-weight: 600; color: #1A2B4A; }
            .invoice-date { font-size: 12px; color: #64748b; }
            .invoice-right { text-align: right; }
            .invoice-amount { font-size: 14px; font-weight: 600; color: #1A2B4A; }
            .invoice-status { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; margin-top: 3px; }
            .status-paid { background: #dcfce7; color: #16a34a; }
            .status-pending { background: #fef3c7; color: #d97706; }
            .interactions-list { margin-top: 15px; }
            .interaction-item { padding: 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e5e7eb; }
            .interaction-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .interaction-type { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #e0e7ff; color: #3730a3; }
            .interaction-date { font-size: 11px; color: #64748b; }
            .interaction-subject { font-size: 13px; font-weight: 600; color: #1A2B4A; margin-bottom: 5px; }
            .interaction-notes { font-size: 12px; color: #64748b; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">BizManage Pro Edition</div>
            <div style="color: #666; font-size: 14px;">Professional Business Management System</div>
          </div>
          
          <div class="title">CLIENT DETAILS</div>
          
          <div class="client-header">
            <div class="client-info">
              <div class="client-name">${client.name}</div>
              <div class="client-code">Client ID: ${client.code}</div>
            </div>
            <div>
              <span class="status-badge ${!client.isActive ? 'status-inactive' : ''}">${client.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Contact Information</div>
            <div class="info-grid">
              ${client.email ? `
                <div class="info-item">
                  <span class="info-icon">✉️</span>
                  <span class="info-text">${client.email}</span>
                </div>
              ` : ''}
              ${client.phone ? `
                <div class="info-item">
                  <span class="info-icon">📞</span>
                  <span class="info-text">${client.phone}</span>
                </div>
              ` : ''}
              ${client.mobile ? `
                <div class="info-item">
                  <span class="info-icon">📱</span>
                  <span class="info-text">${client.mobile}</span>
                </div>
              ` : ''}
              ${client.taxId ? `
                <div class="info-item">
                  <span class="info-icon">📄</span>
                  <span class="info-text">Tax ID: ${client.taxId}</span>
                </div>
              ` : ''}
              ${client.address ? `
                <div class="info-item" style="grid-column: span 2;">
                  <span class="info-icon">📍</span>
                  <span class="info-text">${client.address}${client.city ? `, ${client.city}` : ''}${client.country ? `, ${client.country}` : ''}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Financial Summary</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value">Rs ${stats.totalRevenue.toLocaleString()}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Total Invoices</div>
                <div class="stat-value">${stats.totalInvoices}</div>
                <div class="stat-sub">${stats.paidInvoices} paid, ${stats.pendingInvoices} pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Avg. Payment Time</div>
                <div class="stat-value">${stats.averagePaymentDays} days</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Business Details</div>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value"><span class="badge">${client.category}</span></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Payment Terms</div>
                <div class="detail-value">Net ${client.paymentTerms} days</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Credit Limit</div>
                <div class="detail-value">Rs ${client.creditLimit?.toLocaleString() || '0'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Outstanding Amount</div>
                <div class="detail-value" style="color: #f59e0b;">Rs ${stats.outstandingAmount.toLocaleString()}</div>
              </div>
            </div>
            ${client.notes ? `
              <div class="notes-section">
                <div class="detail-label">Notes</div>
                <div class="notes-text">${client.notes}</div>
              </div>
            ` : ''}
          </div>
          
          <div class="section">
            <div class="section-title">Recent Invoices</div>
            <div class="invoices-list">
              ${recentInvoices.map(invoice => `
                <div class="invoice-item">
                  <div class="invoice-left">
                    <div class="invoice-number">${invoice.number}</div>
                    <div class="invoice-date">${invoice.date}</div>
                  </div>
                  <div class="invoice-right">
                    <div class="invoice-amount">Rs ${invoice.amount.toLocaleString()}</div>
                    <div class="invoice-status ${invoice.status === 'paid' ? 'status-paid' : 'status-pending'}">${invoice.status.toUpperCase()}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Recent Interactions</div>
            <div class="interactions-list">
              ${interactions.map(interaction => `
                <div class="interaction-item">
                  <div class="interaction-header">
                    <span class="interaction-type">${interaction.type}</span>
                    <span class="interaction-date">${interaction.date}</span>
                  </div>
                  <div class="interaction-subject">${interaction.subject}</div>
                  <div class="interaction-notes">${interaction.notes}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated client details document.</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    toast.success('Client details PDF opened in new window');
  };

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print PDF');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Client Details - ${client.name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 3px solid #1A2B4A; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #1A2B4A; margin-bottom: 5px; }
            .title { font-size: 24px; font-weight: bold; margin: 20px 0; color: #1A2B4A; }
            .client-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; }
            .client-info { flex: 1; }
            .client-name { font-size: 22px; font-weight: bold; color: #1A2B4A; margin-bottom: 5px; }
            .client-code { color: #64748b; font-size: 14px; }
            .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; background: #10b981; color: white; }
            .status-inactive { background: #6b7280; }
            .section { margin: 30px 0; }
            .section-title { font-size: 18px; font-weight: 600; color: #1A2B4A; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .info-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8fafc; border-radius: 6px; }
            .info-icon { color: #64748b; }
            .info-text { font-size: 14px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 20px 0; }
            .stat-card { padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; }
            .stat-value { font-size: 24px; font-weight: bold; color: #1A2B4A; margin: 10px 0; }
            .stat-label { font-size: 13px; color: #64748b; }
            .stat-sub { font-size: 11px; color: #94a3b8; margin-top: 5px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .detail-item { padding: 12px; background: #f8fafc; border-radius: 6px; }
            .detail-label { font-size: 12px; color: #64748b; margin-bottom: 5px; }
            .detail-value { font-size: 15px; font-weight: 600; color: #1A2B4A; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; background: #e0e7ff; color: #3730a3; }
            .notes-section { padding: 15px; background: #f8fafc; border-radius: 8px; margin-top: 15px; }
            .notes-text { font-size: 13px; color: #475569; line-height: 1.6; }
            .invoices-list { margin-top: 15px; }
            .invoice-item { display: flex; justify-between; padding: 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e5e7eb; }
            .invoice-left { flex: 1; }
            .invoice-number { font-size: 14px; font-weight: 600; color: #1A2B4A; }
            .invoice-date { font-size: 12px; color: #64748b; }
            .invoice-right { text-align: right; }
            .invoice-amount { font-size: 14px; font-weight: 600; color: #1A2B4A; }
            .invoice-status { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; margin-top: 3px; }
            .status-paid { background: #dcfce7; color: #16a34a; }
            .status-pending { background: #fef3c7; color: #d97706; }
            .interactions-list { margin-top: 15px; }
            .interaction-item { padding: 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e5e7eb; }
            .interaction-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .interaction-type { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #e0e7ff; color: #3730a3; }
            .interaction-date { font-size: 11px; color: #64748b; }
            .interaction-subject { font-size: 13px; font-weight: 600; color: #1A2B4A; margin-bottom: 5px; }
            .interaction-notes { font-size: 12px; color: #64748b; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">BizManage Pro Edition</div>
            <div style="color: #666; font-size: 14px;">Professional Business Management System</div>
          </div>
          
          <div class="title">CLIENT DETAILS</div>
          
          <div class="client-header">
            <div class="client-info">
              <div class="client-name">${client.name}</div>
              <div class="client-code">Client ID: ${client.code}</div>
            </div>
            <div>
              <span class="status-badge ${!client.isActive ? 'status-inactive' : ''}">${client.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Contact Information</div>
            <div class="info-grid">
              ${client.email ? `
                <div class="info-item">
                  <span class="info-icon">✉️</span>
                  <span class="info-text">${client.email}</span>
                </div>
              ` : ''}
              ${client.phone ? `
                <div class="info-item">
                  <span class="info-icon">📞</span>
                  <span class="info-text">${client.phone}</span>
                </div>
              ` : ''}
              ${client.mobile ? `
                <div class="info-item">
                  <span class="info-icon">📱</span>
                  <span class="info-text">${client.mobile}</span>
                </div>
              ` : ''}
              ${client.taxId ? `
                <div class="info-item">
                  <span class="info-icon">📄</span>
                  <span class="info-text">Tax ID: ${client.taxId}</span>
                </div>
              ` : ''}
              ${client.address ? `
                <div class="info-item" style="grid-column: span 2;">
                  <span class="info-icon">📍</span>
                  <span class="info-text">${client.address}${client.city ? `, ${client.city}` : ''}${client.country ? `, ${client.country}` : ''}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Financial Summary</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value">Rs ${stats.totalRevenue.toLocaleString()}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Total Invoices</div>
                <div class="stat-value">${stats.totalInvoices}</div>
                <div class="stat-sub">${stats.paidInvoices} paid, ${stats.pendingInvoices} pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Avg. Payment Time</div>
                <div class="stat-value">${stats.averagePaymentDays} days</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Business Details</div>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value"><span class="badge">${client.category}</span></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Payment Terms</div>
                <div class="detail-value">Net ${client.paymentTerms} days</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Credit Limit</div>
                <div class="detail-value">Rs ${client.creditLimit?.toLocaleString() || '0'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Outstanding Amount</div>
                <div class="detail-value" style="color: #f59e0b;">Rs ${stats.outstandingAmount.toLocaleString()}</div>
              </div>
            </div>
            ${client.notes ? `
              <div class="notes-section">
                <div class="detail-label">Notes</div>
                <div class="notes-text">${client.notes}</div>
              </div>
            ` : ''}
          </div>
          
          <div class="section">
            <div class="section-title">Recent Invoices</div>
            <div class="invoices-list">
              ${recentInvoices.map(invoice => `
                <div class="invoice-item">
                  <div class="invoice-left">
                    <div class="invoice-number">${invoice.number}</div>
                    <div class="invoice-date">${invoice.date}</div>
                  </div>
                  <div class="invoice-right">
                    <div class="invoice-amount">Rs ${invoice.amount.toLocaleString()}</div>
                    <div class="invoice-status ${invoice.status === 'paid' ? 'status-paid' : 'status-pending'}">${invoice.status.toUpperCase()}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Recent Interactions</div>
            <div class="interactions-list">
              ${interactions.map(interaction => `
                <div class="interaction-item">
                  <div class="interaction-header">
                    <span class="interaction-type">${interaction.type}</span>
                    <span class="interaction-date">${interaction.date}</span>
                  </div>
                  <div class="interaction-subject">${interaction.subject}</div>
                  <div class="interaction-notes">${interaction.notes}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated client details document.</p>
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
      toast.success('Print dialog opened');
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#1A2B4A]">{client.name}</h3>
          <p className="text-slate-600 mt-1">Client ID: {client.code}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={client.isActive ? 'default' : 'secondary'} className="text-sm">
            {client.isActive ? 'Active' : 'Inactive'}
          </Badge>
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
              onClick={handlePrintPDF}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{client.phone}</span>
              </div>
            )}
            {client.mobile && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{client.mobile}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{client.address}{client.city && `, ${client.city}`}{client.country && `, ${client.country}`}</span>
              </div>
            )}
            {client.taxId && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-sm">Tax ID: {client.taxId}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-[#1A2B4A]">Rs {stats.totalRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Total Invoices</p>
              <p className="text-2xl font-bold text-[#1A2B4A]">{stats.totalInvoices}</p>
              <p className="text-xs text-slate-500 mt-1">{stats.paidInvoices} paid, {stats.pendingInvoices} pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Avg. Payment Time</p>
              <p className="text-2xl font-bold text-[#1A2B4A]">{stats.averagePaymentDays} days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Details */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{invoice.number}</p>
                      <p className="text-xs text-slate-600">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">Rs {invoice.amount.toLocaleString()}</p>
                      <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {interaction.type}
                      </Badge>
                      <span className="text-xs text-slate-600">{interaction.date}</span>
                    </div>
                    <p className="font-semibold text-sm mb-1">{interaction.subject}</p>
                    <p className="text-xs text-slate-600">{interaction.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Category</p>
                    <Badge>{client.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Payment Terms</p>
                    <p className="font-semibold">Net {client.paymentTerms} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Credit Limit</p>
                    <p className="font-semibold">Rs {client.creditLimit?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Outstanding</p>
                    <p className="font-semibold text-amber-600">Rs {stats.outstandingAmount.toLocaleString()}</p>
                  </div>
                </div>
                {client.notes && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Notes</p>
                    <p className="text-sm bg-slate-50 p-3 rounded-lg">{client.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
