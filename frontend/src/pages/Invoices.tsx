import { useState } from 'react';
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
import { mockInvoices, mockClients } from '../lib/mockData';
import { Invoice } from '../types';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Send } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner@2.0.3';

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(mockInvoices[0]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = () => {
    if (!deletingInvoice) return;
    setInvoices(invoices.filter(inv => inv.id !== deletingInvoice.id));
    setShowDeleteDialog(false);
    setDeletingInvoice(null);
    toast.success(`Invoice ${deletingInvoice.invoiceNumber} deleted successfully`);
  };

  const handleSendEmail = (invoice: Invoice) => {
    toast.success(`Invoice ${invoice.invoiceNumber} sent to ${invoice.client}`);
  };

  const handleExport = () => {
    toast.success('Invoices exported successfully as CSV');
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    toast.success(`Invoice ${invoice.invoiceNumber} downloaded as PDF`);
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
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
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
                {filteredInvoices.length === 0 ? (
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
                              <InvoiceDetail 
                                invoice={selectedInvoice} 
                                onDownload={handleDownloadPDF}
                                onSend={handleSendEmail}
                              />
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new invoice for your client
            </DialogDescription>
          </DialogHeader>
          <CreateInvoiceForm 
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
    </div>
  );
}

function CreateInvoiceForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: (invoice: Invoice) => void }) {
  const [client, setClient] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  
  const handleSubmit = () => {
    const selectedClient = mockClients.find(c => c.id === client);
    if (!selectedClient || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newInvoice: Invoice = {
      id: (Math.random() * 1000).toString(),
      invoiceNumber: `INV-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      client: selectedClient.name,
      amount: 1000000,
      status: 'draft',
      date: date,
      dueDate: dueDate,
      items: []
    };

    onSuccess(newInvoice);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Client *</Label>
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
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
          <Select defaultValue="30">
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
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-[#1A2B4A] hover:bg-[#0F1729]"
        >
          Create Invoice
        </Button>
      </div>
    </div>
  );
}

function EditInvoiceForm({ invoice, onClose, onSuccess }: { invoice: Invoice | null; onClose: () => void; onSuccess: (invoice: Invoice) => void }) {
  if (!invoice) return null;
  
  const [status, setStatus] = useState(invoice.status);

  const handleSubmit = () => {
    const updatedInvoice = { ...invoice, status };
    onSuccess(updatedInvoice);
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
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-[#1A2B4A] hover:bg-[#0F1729]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function InvoiceDetail({ invoice, onDownload, onSend }: { invoice: Invoice; onDownload: (inv: Invoice) => void; onSend: (inv: Invoice) => void }) {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Invoice Details</span>
          <StatusBadge status={invoice.status} />
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

      <div className="flex gap-3">
        <Button 
          className="flex-1 bg-[#1A2B4A] hover:bg-[#0F1729]"
          onClick={() => onDownload(invoice)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button 
          className="flex-1" 
          variant="outline"
          onClick={() => onSend(invoice)}
        >
          <Send className="h-4 w-4 mr-2" />
          Send to Client
        </Button>
      </div>
    </div>
  );
}
