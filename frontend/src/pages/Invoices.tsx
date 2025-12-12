import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { StatusBadge } from '../components/StatusBadge';
import { InvoicePrint } from '../components/InvoicePrint';
import { mockClients } from '../lib/mockData';
import { Invoice, InvoiceItem, Client } from '../types';
import { invoiceService, CreateInvoiceRequest, UpdateInvoiceRequest } from '../services/invoiceService';
import { clientService } from '../services/clientService';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Send, Printer } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceDetailsDialog, setShowInvoiceDetailsDialog] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Load invoices and clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadInvoices();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, pagination.page]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (searchQuery) {
        filters.search = searchQuery;
      }
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      const response = await invoiceService.getInvoices(filters);
      setInvoices(response.invoices);
      setPagination(response.pagination);
      
      // Set first invoice as selected if none selected
      if (response.invoices.length > 0 && !selectedInvoice) {
        setSelectedInvoice(response.invoices[0]);
      }
    } catch (error) {
      console.error('Failed to load invoices:', error);
      toast.error('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const response = await clientService.getClients({ limit: 1000 });
      setClients(response.clients);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  // Since we're doing server-side filtering, just use invoices directly
  const filteredInvoices = invoices;

  const handleDelete = async () => {
    if (!deletingInvoice) return;
    
    try {
      await invoiceService.deleteInvoice(deletingInvoice.id);
      setInvoices(invoices.filter(inv => inv.id !== deletingInvoice.id));
      setShowDeleteDialog(false);
      setDeletingInvoice(null);
      toast.success(`Invoice ${deletingInvoice.invoiceNumber} deleted successfully`);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      toast.error('Failed to delete invoice. Please try again.');
    }
  };

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      await invoiceService.sendInvoice(invoice.id);
      toast.success(`Invoice ${invoice.invoiceNumber} sent to ${invoice.client}`);
      loadInvoices(); // Reload to get updated status
    } catch (error) {
      console.error('Failed to send invoice:', error);
      toast.error('Failed to send invoice. Please try again.');
    }
  };

  const handleExport = () => {
    // Create CSV content with headers
    const headers = [
      'Invoice Number',
      'Client',
      'Date',
      'Due Date',
      'Amount',
      'Status',
      'Items Count'
    ];

    // Create rows from invoices
    const rows = invoices.map(invoice => [
      invoice.invoiceNumber,
      invoice.client,
      invoice.date,
      invoice.dueDate,
      invoice.amount,
      invoice.status,
      invoice.items?.length || 0
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
    link.setAttribute('download', `Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Invoices exported successfully!');
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    toast.success(`Invoice ${invoice.invoiceNumber} downloaded as PDF`);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    // Set the invoice to be printed
    setSelectedInvoice(invoice);
    
    // Wait for next render cycle to ensure component is mounted
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const openEditDialog = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (invoice: Invoice) => {
    setDeletingInvoice(invoice);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl">Invoice Management</h2>
          <p className="text-slate-500 text-sm mt-1">Create, manage and track all your invoices</p>
        </div>
        
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by invoice number, client name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="w-full md:w-auto"
              onClick={() => setShowInvoiceDetailsDialog(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Invoice Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card className="shadow-lg border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1A2B4A]"></div>
                        Loading invoices...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <span className="text-[#1A2B4A]">{invoice.invoiceNumber}</span>
                      </TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell className="text-slate-600">{invoice.date}</TableCell>
                      <TableCell className="text-slate-600">{invoice.dueDate}</TableCell>
                      <TableCell className="text-right">
                        Rs {(invoice.amount / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedInvoice(invoice)}
                                className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              {selectedInvoice && (
                                <InvoiceDetail 
                                  invoice={selectedInvoice} 
                                  onDownload={handleDownloadPDF}
                                  onSend={handleSendEmail}
                                  onPrint={handlePrintInvoice}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(invoice)}
                            className="hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleSendEmail(invoice)}
                            className="hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openDeleteDialog(invoice)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new invoice for your client
            </DialogDescription>
          </DialogHeader>
          <CreateInvoiceForm 
            clients={clients}
            onClose={() => setShowCreateDialog(false)} 
            onSuccess={(newInvoice) => {
              setInvoices([...invoices, newInvoice]);
              setShowCreateDialog(false);
              toast.success('Invoice created successfully');
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Update invoice details
            </DialogDescription>
          </DialogHeader>
          <EditInvoiceForm 
            invoice={editingInvoice}
            onClose={() => setShowEditDialog(false)} 
            onSuccess={(updatedInvoice) => {
              setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
              setShowEditDialog(false);
              toast.success('Invoice updated successfully');
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete invoice {deletingInvoice?.invoiceNumber}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden Print Component */}
      {selectedInvoice && (
        <div className="hidden print:block">
          <InvoicePrint 
            invoice={selectedInvoice}
            company={{
              name: 'Your Company Name',
              address: '123 Business Street, Colombo',
              phone: '+94 11 234 5678',
              email: 'info@yourcompany.com',
              taxId: 'TAX-12345',
            }}
          />
        </div>
      )}

      {/* Invoice Details Dialog */}
      <Dialog open={showInvoiceDetailsDialog} onOpenChange={setShowInvoiceDetailsDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>All Invoice Details</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="bg-[#1A2B4A] text-white hover:bg-[#0F1729] hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell>
                          <span className="text-[#1A2B4A] font-semibold">{invoice.invoiceNumber}</span>
                        </TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell className="text-slate-600">{invoice.date}</TableCell>
                        <TableCell className="text-slate-600">{invoice.dueDate}</TableCell>
                        <TableCell className="text-right font-semibold">
                          Rs {invoice.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                            {invoice.items?.length || 0}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Summary Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-1">Total Invoices</p>
                    <p className="text-2xl font-bold text-[#1A2B4A]">{invoices.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-[#1A2B4A]">
                      Rs {invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-1">Average Amount</p>
                    <p className="text-2xl font-bold text-[#1A2B4A]">
                      Rs {invoices.length > 0 ? Math.round(invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length).toLocaleString() : '0'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateInvoiceForm({ onClose, onSuccess, clients }: { onClose: () => void; onSuccess: (invoice: Invoice) => void; clients: Client[] }) {
  const [client, setClient] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 15,
      total: 0
    }
  ]);
  const [submitting, setSubmitting] = useState(false);

  // Debug: Log clients when component mounts or clients change
  useEffect(() => {
    console.log('CreateInvoiceForm - Available clients:', clients);
  }, [clients]);
  
  const calculateItemTotal = (quantity: number, unitPrice: number, vatRate: number) => {
    const subtotal = quantity * unitPrice;
    const vatAmount = subtotal * (vatRate / 100);
    return subtotal + vatAmount;
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: (Math.random() * 1000).toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 15,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice' || field === 'vatRate') {
          updatedItem.total = calculateItemTotal(
            updatedItem.quantity, 
            updatedItem.unitPrice, 
            updatedItem.vatRate
          );
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + itemSubtotal;
    }, 0);
  };

  const calculateTaxAmount = () => {
    return calculateTotalAmount() - calculateSubtotal();
  };
  
  const handleSubmit = async () => {
    const selectedClient = clients.find(c => c.id === client);
    if (!selectedClient || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validItems = items.filter(item => 
      item.description.trim() !== '' && item.quantity > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      toast.error('Please add at least one valid item');
      return;
    }

    try {
      setSubmitting(true);
      
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTaxAmount();
      const totalAmount = calculateTotalAmount();

      const invoiceData: CreateInvoiceRequest = {
        clientId: client,
        amount: subtotal,
        taxAmount: taxAmount,
        discountAmount: 0,
        dueDate: dueDate,
        notes: notes,
        items: validItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.vatRate,
        })),
        status: 'DRAFT',
      };

      const newInvoice = await invoiceService.createInvoice(invoiceData);
      onSuccess(newInvoice);
      toast.success('Invoice created successfully');
    } catch (error) {
      console.error('Failed to create invoice:', error);
      toast.error('Failed to create invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Invoice Header Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Client *</Label>
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.length === 0 ? (
                <SelectItem value="no-clients" disabled>No clients available</SelectItem>
              ) : (
                clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Invoice Date *</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        
        <div className="space-y-2">
          <Label>Due Date *</Label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        
        <div className="space-y-2">
          <Label>Payment Terms</Label>
          <Select value={paymentTerms} onValueChange={setPaymentTerms}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">Net 15</SelectItem>
              <SelectItem value="30">Net 30</SelectItem>
              <SelectItem value="45">Net 45</SelectItem>
              <SelectItem value="60">Net 60</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label>Notes</Label>
          <Input 
            placeholder="Additional notes or terms..."
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />
        </div>
      </div>

      {/* Invoice Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <Button 
            type="button"
            onClick={addItem}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[300px] text-slate-900">Description *</TableHead>
                <TableHead className="w-[100px] text-center text-slate-900">Qty *</TableHead>
                <TableHead className="w-[140px] text-right text-slate-900">Unit Price (Rs) *</TableHead>
                <TableHead className="w-[100px] text-center text-slate-900">VAT %</TableHead>
                <TableHead className="w-[140px] text-right text-slate-900">Total (Rs)</TableHead>
                <TableHead className="w-[80px] text-center text-slate-900">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      placeholder="Enter item description..."
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={item.vatRate.toString()} 
                      onValueChange={(value) => updateItem(item.id, 'vatRate', parseInt(value))}
                    >
                      <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="8">8%</SelectItem>
                        <SelectItem value="15">15%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Rs {item.total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Total Summary */}
        <div className="flex justify-end">
          <div className="bg-slate-50 p-4 rounded-lg min-w-[300px]">
            <div className="space-y-2">
              {(() => {
                const total = calculateTotalAmount();
                const subtotal = items.reduce((sum, item) => {
                  const itemSubtotal = item.quantity * item.unitPrice;
                  return sum + itemSubtotal;
                }, 0);
                const totalVat = total - subtotal;
                
                return (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal:</span>
                      <span>Rs {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">VAT:</span>
                      <span>Rs {totalVat.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-[#1A2B4A]">Rs {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-[#1A2B4A] hover:bg-[#0F1729]"
        >
          {submitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </div>
  );
}

function EditInvoiceForm({ invoice, onClose, onSuccess }: { invoice: Invoice | null; onClose: () => void; onSuccess: (invoice: Invoice) => void }) {
  if (!invoice) return null;
  
  const [status, setStatus] = useState(invoice.status);
  const [items, setItems] = useState<InvoiceItem[]>(invoice.items || []);
  const [submitting, setSubmitting] = useState(false);

  const calculateItemTotal = (quantity: number, unitPrice: number, vatRate: number) => {
    const subtotal = quantity * unitPrice;
    const vatAmount = subtotal * (vatRate / 100);
    return subtotal + vatAmount;
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: (Math.random() * 1000).toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 15,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice' || field === 'vatRate') {
          updatedItem.total = calculateItemTotal(
            updatedItem.quantity, 
            updatedItem.unitPrice, 
            updatedItem.vatRate
          );
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + itemSubtotal;
    }, 0);
  };

  const calculateTaxAmount = () => {
    return calculateTotalAmount() - calculateSubtotal();
  };

  const handleSubmit = async () => {
    const validItems = items.filter(item => 
      item.description.trim() !== '' && item.quantity > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      toast.error('Please add at least one valid item');
      return;
    }

    try {
      setSubmitting(true);

      const subtotal = calculateSubtotal();
      const taxAmount = calculateTaxAmount();

      const updateData: UpdateInvoiceRequest = {
        amount: subtotal,
        taxAmount: taxAmount,
        status: status as any,
        items: validItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.vatRate,
        })),
      };

      const updatedInvoice = await invoiceService.updateInvoice(invoice.id, updateData);
      onSuccess(updatedInvoice);
      toast.success('Invoice updated successfully');
    } catch (error) {
      console.error('Failed to update invoice:', error);
      toast.error('Failed to update invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Invoice Number</Label>
          <Input value={invoice.invoiceNumber} disabled />
        </div>
        <div className="space-y-2">
          <Label>Client</Label>
          <Input value={invoice.client} disabled />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value: any) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Invoice Date</Label>
          <Input value={invoice.date} disabled />
        </div>
      </div>

      {/* Invoice Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <Button 
            type="button"
            onClick={addItem}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[300px] text-slate-900">Description *</TableHead>
                <TableHead className="w-[100px] text-center text-slate-900">Qty *</TableHead>
                <TableHead className="w-[140px] text-right text-slate-900">Unit Price (Rs) *</TableHead>
                <TableHead className="w-[100px] text-center text-slate-900">VAT %</TableHead>
                <TableHead className="w-[140px] text-right text-slate-900">Total (Rs)</TableHead>
                <TableHead className="w-[80px] text-center text-slate-900">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No items added yet. Click "Add Item" to start.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        placeholder="Enter item description..."
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={item.vatRate.toString()} 
                        onValueChange={(value) => updateItem(item.id, 'vatRate', parseInt(value))}
                      >
                        <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="8">8%</SelectItem>
                          <SelectItem value="15">15%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      Rs {item.total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Total Summary */}
        <div className="flex justify-end">
          <div className="bg-slate-50 p-4 rounded-lg min-w-[300px]">
            <div className="space-y-2">
              {(() => {
                const total = calculateTotalAmount();
                const subtotal = items.reduce((sum, item) => {
                  const itemSubtotal = item.quantity * item.unitPrice;
                  return sum + itemSubtotal;
                }, 0);
                const totalVat = total - subtotal;
                
                return (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal:</span>
                      <span>Rs {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">VAT:</span>
                      <span>Rs {totalVat.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-[#1A2B4A]">Rs {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-[#1A2B4A] hover:bg-[#0F1729]"
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

function InvoiceDetail({ invoice, onDownload, onSend, onPrint }: { invoice: Invoice; onDownload: (inv: Invoice) => void; onSend: (inv: Invoice) => void; onPrint?: (inv: Invoice) => void }) {
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF');
      return;
    }

    const subtotal = invoice.amount / 1.15;
    const vat = invoice.amount - subtotal;
    const statusColors: any = {
      paid: 'background: #10b981; color: white;',
      pending: 'background: #f59e0b; color: white;',
      overdue: 'background: #ef4444; color: white;',
      draft: 'background: #6b7280; color: white;',
      partially_paid: 'background: #3b82f6; color: white;',
    };

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceNumber}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 3px solid #1A2B4A; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #1A2B4A; margin-bottom: 5px; }
            .title { font-size: 24px; font-weight: bold; margin: 20px 0; color: #1A2B4A; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
            .info-item { margin-bottom: 15px; }
            .label { font-size: 12px; color: #666; margin-bottom: 5px; }
            .value { font-size: 16px; font-weight: 600; color: #1A2B4A; }
            .status { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; ${statusColors[invoice.status] || statusColors.draft} }
            .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .items-table th { background: #f1f5f9; padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1; font-weight: 600; }
            .items-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .items-table tr:last-child td { border-bottom: none; }
            .totals { background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px; }
            .totals-row { display: flex; justify-between; margin-bottom: 10px; }
            .totals-label { color: #64748b; font-size: 15px; }
            .totals-value { font-weight: 600; font-size: 15px; }
            .total-final { border-top: 2px solid #cbd5e1; padding-top: 12px; margin-top: 12px; }
            .total-final .totals-label { font-size: 18px; font-weight: 600; color: #1A2B4A; }
            .total-final .totals-value { font-size: 20px; font-weight: 700; color: #1A2B4A; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">BizManage Pro Edition</div>
            <div style="color: #666; font-size: 14px;">Professional Business Management System</div>
          </div>
          
          <div class="title">INVOICE</div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Invoice Number</div>
              <div class="value">${invoice.invoiceNumber}</div>
            </div>
            <div class="info-item">
              <div class="label">Status</div>
              <div><span class="status">${invoice.status.toUpperCase().replace('_', ' ')}</span></div>
            </div>
            <div class="info-item">
              <div class="label">Client</div>
              <div class="value">${invoice.client}</div>
            </div>
            <div class="info-item">
              <div class="label">Invoice Date</div>
              <div class="value">${invoice.date}</div>
            </div>
            <div class="info-item" style="grid-column: span 2;">
              <div class="label">Due Date</div>
              <div class="value">${invoice.dueDate}</div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">VAT</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item: any) => `
                <tr>
                  <td><strong>${item.description}</strong></td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">Rs ${item.unitPrice.toLocaleString()}</td>
                  <td class="text-right">${item.vatRate}%</td>
                  <td class="text-right"><strong>Rs ${item.total.toLocaleString()}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="totals-row">
              <span class="totals-label">Subtotal:</span>
              <span class="totals-value">Rs ${subtotal.toFixed(0)}</span>
            </div>
            <div class="totals-row">
              <span class="totals-label">VAT (15%):</span>
              <span class="totals-value">Rs ${vat.toFixed(0)}</span>
            </div>
            <div class="totals-row total-final">
              <span class="totals-label">Total Amount:</span>
              <span class="totals-value">Rs ${invoice.amount.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated invoice.</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Just open the window for viewing/downloading, don't auto-print
    toast.success('Invoice PDF opened in new window');
  };

  const handlePrintPDF = () => {
    if (!invoice) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print PDF');
      return;
    }

    const subtotal = invoice.amount / 1.15;
    const vat = invoice.amount - subtotal;
    const statusColors: any = {
      paid: 'background: #10b981; color: white;',
      pending: 'background: #f59e0b; color: white;',
      overdue: 'background: #ef4444; color: white;',
      draft: 'background: #6b7280; color: white;',
      partially_paid: 'background: #3b82f6; color: white;',
    };

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceNumber}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 3px solid #1A2B4A; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #1A2B4A; margin-bottom: 5px; }
            .title { font-size: 24px; font-weight: bold; margin: 20px 0; color: #1A2B4A; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
            .info-item { margin-bottom: 15px; }
            .label { font-size: 12px; color: #666; margin-bottom: 5px; }
            .value { font-size: 16px; font-weight: 600; color: #1A2B4A; }
            .status { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; ${statusColors[invoice.status] || statusColors.draft} }
            .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .items-table th { background: #f1f5f9; padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1; font-weight: 600; }
            .items-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .items-table tr:last-child td { border-bottom: none; }
            .totals { background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px; }
            .totals-row { display: flex; justify-between; margin-bottom: 10px; }
            .totals-label { color: #64748b; font-size: 15px; }
            .totals-value { font-weight: 600; font-size: 15px; }
            .total-final { border-top: 2px solid #cbd5e1; padding-top: 12px; margin-top: 12px; }
            .total-final .totals-label { font-size: 18px; font-weight: 600; color: #1A2B4A; }
            .total-final .totals-value { font-size: 20px; font-weight: 700; color: #1A2B4A; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">BizManage Pro Edition</div>
            <div style="color: #666; font-size: 14px;">Professional Business Management System</div>
          </div>
          
          <div class="title">INVOICE</div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Invoice Number</div>
              <div class="value">${invoice.invoiceNumber}</div>
            </div>
            <div class="info-item">
              <div class="label">Status</div>
              <div><span class="status">${invoice.status.toUpperCase().replace('_', ' ')}</span></div>
            </div>
            <div class="info-item">
              <div class="label">Client</div>
              <div class="value">${invoice.client}</div>
            </div>
            <div class="info-item">
              <div class="label">Invoice Date</div>
              <div class="value">${invoice.date}</div>
            </div>
            <div class="info-item" style="grid-column: span 2;">
              <div class="label">Due Date</div>
              <div class="value">${invoice.dueDate}</div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">VAT</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item: any) => `
                <tr>
                  <td><strong>${item.description}</strong></td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">Rs ${item.unitPrice.toLocaleString()}</td>
                  <td class="text-right">${item.vatRate}%</td>
                  <td class="text-right"><strong>Rs ${item.total.toLocaleString()}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="totals-row">
              <span class="totals-label">Subtotal:</span>
              <span class="totals-value">Rs ${subtotal.toFixed(0)}</span>
            </div>
            <div class="totals-row">
              <span class="totals-label">VAT (15%):</span>
              <span class="totals-value">Rs ${vat.toFixed(0)}</span>
            </div>
            <div class="totals-row total-final">
              <span class="totals-label">Total Amount:</span>
              <span class="totals-value">Rs ${invoice.amount.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated invoice.</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Auto-trigger print dialog and close after printing
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => printWindow.close(), 500);
      toast.success('Print dialog opened');
    }, 250);
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Invoice Details</span>
          <div className="flex items-center gap-3">
            <StatusBadge status={invoice.status} />
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
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-slate-500">Invoice Number</p>
          <p className="text-lg text-[#1A2B4A]">{invoice.invoiceNumber}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Client</p>
          <p className="text-lg">{invoice.client}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Invoice Date</p>
          <p>{invoice.date}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Due Date</p>
          <p>{invoice.dueDate}</p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">VAT</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">Rs {item.unitPrice.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.vatRate}%</TableCell>
                <TableCell className="text-right">Rs {item.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-600">Subtotal:</span>
          <span>Rs {(invoice.amount / 1.15).toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">VAT (15%):</span>
          <span>Rs {(invoice.amount - invoice.amount / 1.15).toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-lg border-t pt-2">
          <span>Total:</span>
          <span className="text-[#1A2B4A]">Rs {invoice.amount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
