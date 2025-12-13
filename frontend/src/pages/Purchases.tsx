import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../components/ui/alert';
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
import { mockPurchaseOrders } from '../lib/mockData';
import { PurchaseOrder, PurchaseOrderItem } from '../types';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Printer, AlertTriangle, DollarSign, Truck, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

export function Purchases() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('purchaseOrders');
    return saved ? JSON.parse(saved) : mockPurchaseOrders;
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [alerts, setAlerts] = useState<Array<{id: string; type: string; message: string}>>([]);

  useEffect(() => {
    // Save to localStorage whenever purchaseOrders change
    localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    // Check for important alerts when POs change
    checkForAlerts();
  }, [purchaseOrders]);

  const checkForAlerts = () => {
    const newAlerts: Array<{id: string; type: string; message: string}> = [];
    
    purchaseOrders.forEach(po => {
      const deliveryDate = new Date(po.deliveryDate);
      const today = new Date();
      const daysUntilDelivery = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Alert for upcoming deliveries (within 7 days)
      if (daysUntilDelivery > 0 && daysUntilDelivery <= 7 && (po.status === 'confirmed' || po.status === 'approved')) {
        newAlerts.push({
          id: `delivery-${po.id}`,
          type: 'warning',
          message: `PO ${po.poNumber} delivery expected in ${daysUntilDelivery} days`
        });
      }
      
      // Alert for overdue deliveries
      if (daysUntilDelivery < 0 && po.status !== 'received') {
        newAlerts.push({
          id: `overdue-${po.id}`,
          type: 'error',
          message: `PO ${po.poNumber} delivery is OVERDUE by ${Math.abs(daysUntilDelivery)} days!`
        });
      }
      
      // Alert for pending approvals
      if (po.status === 'pending') {
        newAlerts.push({
          id: `pending-${po.id}`,
          type: 'info',
          message: `PO ${po.poNumber} awaiting approval`
        });
      }
      
      // Alert for high-value overseas purchases
      if (po.currency && po.currency !== 'LKR' && po.amount > 10000) {
        const lkrValue = po.amount * (po.exchangeRate || 1);
        newAlerts.push({
          id: `highvalue-${po.id}`,
          type: 'warning',
          message: `High-value overseas PO ${po.poNumber}: ${po.currency} ${po.amount.toLocaleString()} (Rs ${lkrValue.toLocaleString()})`
        });
      }
    });
    
    setAlerts(newAlerts);
  };

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = () => {
    if (!selectedPO) return;
    setPurchaseOrders(purchaseOrders.filter(po => po.id !== selectedPO.id));
    setShowDeleteDialog(false);
    setSelectedPO(null);
    toast.success(`Purchase Order ${selectedPO.poNumber} deleted successfully`);
  };

  const handleExport = () => {
    try {
      console.log('Export button clicked, processing', purchaseOrders.length, 'purchase orders');
      
      // Create CSV content
      const headers = ['PO Number', 'Supplier', 'Date', 'Amount', 'Status', 'Delivery Date'];
      const csvData = purchaseOrders.map(po => [
        po.poNumber,
        po.supplier,
        po.date,
        `Rs. ${po.amount.toLocaleString()}`,
        po.status,
        po.deliveryDate
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      console.log('CSV content created, length:', csvContent.length);
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const filename = `purchase-orders-${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('CSV file download initiated:', filename);
      toast.success('Purchase Orders exported successfully as CSV');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export Purchase Orders');
    }
  };

  const openViewDialog = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setShowViewDialog(true);
  };

  const openEditDialog = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setShowDeleteDialog(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-cyan-100 text-cyan-800',
      received: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 5).map(alert => (
            <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : 'default'} className={alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : ''}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">
                {alert.type === 'error' ? 'Urgent Action Required' : alert.type === 'warning' ? 'Attention Required' : 'Notice'}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
          {alerts.length > 5 && (
            <p className="text-sm text-slate-500 text-center">+ {alerts.length - 5} more alerts</p>
          )}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Purchase Orders Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage overseas and local supplier purchase orders</p>
        </div>
        
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg border-0 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setStatusFilter('all')}
        >
          <CardContent className="p-6">
            <p className="text-white/80 text-sm">Total POs</p>
            <p className="text-3xl mt-2">{purchaseOrders.length}</p>
          </CardContent>
        </Card>
        <Card
          className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg border-0 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setStatusFilter('approved')}
        >
          <CardContent className="p-6">
            <p className="text-white/80 text-sm">Approved</p>
            <p className="text-3xl mt-2">{purchaseOrders.filter(po => po.status === 'approved').length}</p>
          </CardContent>
        </Card>
        <Card
          className="bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg border-0 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setStatusFilter('pending')}
        >
          <CardContent className="p-6">
            <p className="text-white/80 text-sm">Pending</p>
            <p className="text-3xl mt-2">{purchaseOrders.filter(po => po.status === 'pending').length}</p>
          </CardContent>
        </Card>
        <Card
          className="bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg border-0 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setStatusFilter('all')}
        >
          <CardContent className="p-6">
            <p className="text-white/80 text-sm">Total Value</p>
            <p className="text-3xl mt-2">Rs {(purchaseOrders.reduce((sum, po) => sum + po.amount, 0) / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by PO number, supplier..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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

      {/* Purchase Orders Table */}
      <Card className="shadow-lg border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPOs.map((po) => (
                    <TableRow key={po.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <span className="text-[#1A2B4A]">{po.poNumber}</span>
                      </TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell className="text-slate-600">{po.date}</TableCell>
                      <TableCell className="text-slate-600">{po.deliveryDate}</TableCell>
                      <TableCell className="text-right">
                        Rs {(po.amount / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={po.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openViewDialog(po)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(po)}
                            className="hover:bg-amber-50 hover:text-amber-600 transition-colors"
                            title="Edit PO"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openDeleteDialog(po)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete PO"
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
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Create a new purchase order for your supplier
            </DialogDescription>
          </DialogHeader>
          <CreatePOForm 
            onClose={() => setShowCreateDialog(false)}
            onSuccess={(newPO) => {
              setPurchaseOrders([...purchaseOrders, newPO]);
              setShowCreateDialog(false);
              toast.success('Purchase Order created successfully');
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPO && <PODetail po={selectedPO} />}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
            <DialogDescription>Update purchase order status</DialogDescription>
          </DialogHeader>
          {selectedPO && (
            <EditPOForm 
              po={selectedPO}
              onClose={() => setShowEditDialog(false)}
              onSuccess={(updatedPO) => {
                setPurchaseOrders(purchaseOrders.map(po => po.id === updatedPO.id ? updatedPO : po));
                setShowEditDialog(false);
                toast.success('Purchase Order updated successfully');
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete purchase order {selectedPO?.poNumber}. This action cannot be undone.
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

function CreatePOForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: (po: PurchaseOrder) => void }) {
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleSubmit = () => {
    if (!supplier || !deliveryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newPO: PurchaseOrder = {
      id: (Math.random() * 1000).toString(),
      poNumber: `PO-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      supplier: supplier,
      amount: 500000,
      status: 'draft',
      date: date,
      deliveryDate: deliveryDate,
    };

    onSuccess(newPO);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Supplier *</Label>
          <Input 
            placeholder="Enter supplier name"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Order Date *</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        
        <div className="space-y-2">
          <Label>Delivery Date *</Label>
          <Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
        </div>
        
        <div className="space-y-2">
          <Label>Payment Terms</Label>
          <Select defaultValue="30">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Immediate</SelectItem>
              <SelectItem value="15">Net 15</SelectItem>
              <SelectItem value="30">Net 30</SelectItem>
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
          Create PO
        </Button>
      </div>
    </div>
  );
}

function EditPOForm({ po, onClose, onSuccess }: { po: PurchaseOrder; onClose: () => void; onSuccess: (po: PurchaseOrder) => void }) {
  const [status, setStatus] = useState(po.status);

  const handleSubmit = () => {
    const updatedPO = { ...po, status };
    onSuccess(updatedPO);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>PO Number</Label>
          <Input value={po.poNumber} disabled />
        </div>
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Input value={po.supplier} disabled />
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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

function PODetail({ po }: { po: PurchaseOrder }) {
  const handleDownloadPDF = () => {
    // Create a hidden container for the print content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase Order - ${po.poNumber}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 2px solid #1A2B4A; padding-bottom: 20px; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #1A2B4A; }
            .title { font-size: 20px; font-weight: bold; margin: 20px 0; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .detail-item { margin-bottom: 10px; }
            .label { font-size: 12px; color: #666; margin-bottom: 5px; }
            .value { font-size: 16px; font-weight: 600; color: #1A2B4A; }
            .amount { font-size: 24px; font-weight: bold; color: #1A2B4A; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .status-approved { background: #dcfce7; color: #16a34a; }
            .status-pending { background: #fef3c7; color: #d97706; }
            .status-draft { background: #e5e7eb; color: #6b7280; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Your Company Name</div>
            <div style="color: #666;">123 Business Street, Colombo</div>
            <div style="color: #666;">Phone: +94 11 234 5678 | Email: info@yourcompany.com</div>
          </div>
          
          <div class="title">PURCHASE ORDER</div>
          
          <div class="details">
            <div class="detail-item">
              <div class="label">PO Number</div>
              <div class="value">${po.poNumber}</div>
            </div>
            <div class="detail-item">
              <div class="label">Status</div>
              <div><span class="status status-${po.status}">${po.status.toUpperCase()}</span></div>
            </div>
            <div class="detail-item">
              <div class="label">Supplier</div>
              <div class="value">${po.supplier}</div>
            </div>
            <div class="detail-item">
              <div class="label">Order Date</div>
              <div class="value">${po.date}</div>
            </div>
            <div class="detail-item">
              <div class="label">Delivery Date</div>
              <div class="value">${po.deliveryDate}</div>
            </div>
            <div class="detail-item">
              <div class="label">Total Amount</div>
              <div class="amount">Rs ${po.amount.toLocaleString()}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated purchase order and is valid without signature.</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger download
    setTimeout(() => {
      printWindow.print();
      // Close after printing/saving
      setTimeout(() => printWindow.close(), 500);
      toast.success('PDF download initiated');
    }, 250);
  };

  const handlePrintPDF = () => {
    // Create a temporary container for print
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print PDF');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase Order - ${po.poNumber}</title>
          <style>
            @page { margin: 20mm; }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { border-bottom: 2px solid #1A2B4A; padding-bottom: 20px; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #1A2B4A; }
            .title { font-size: 20px; font-weight: bold; margin: 20px 0; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .detail-item { margin-bottom: 10px; }
            .label { font-size: 12px; color: #666; margin-bottom: 5px; }
            .value { font-size: 16px; font-weight: 600; color: #1A2B4A; }
            .amount { font-size: 24px; font-weight: bold; color: #1A2B4A; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .status-approved { background: #dcfce7; color: #16a34a; }
            .status-pending { background: #fef3c7; color: #d97706; }
            .status-draft { background: #e5e7eb; color: #6b7280; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Your Company Name</div>
            <div style="color: #666;">123 Business Street, Colombo</div>
            <div style="color: #666;">Phone: +94 11 234 5678 | Email: info@yourcompany.com</div>
          </div>
          
          <div class="title">PURCHASE ORDER</div>
          
          <div class="details">
            <div class="detail-item">
              <div class="label">PO Number</div>
              <div class="value">${po.poNumber}</div>
            </div>
            <div class="detail-item">
              <div class="label">Status</div>
              <div><span class="status status-${po.status}">${po.status.toUpperCase()}</span></div>
            </div>
            <div class="detail-item">
              <div class="label">Supplier</div>
              <div class="value">${po.supplier}</div>
            </div>
            <div class="detail-item">
              <div class="label">Order Date</div>
              <div class="value">${po.date}</div>
            </div>
            <div class="detail-item">
              <div class="label">Delivery Date</div>
              <div class="value">${po.deliveryDate}</div>
            </div>
            <div class="detail-item">
              <div class="label">Total Amount</div>
              <div class="amount">Rs ${po.amount.toLocaleString()}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated purchase order and is valid without signature.</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      toast.success('Printing initiated');
    }, 250);
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Purchase Order Details</span>
          <StatusBadge status={po.status} />
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-slate-500">PO Number</p>
          <p className="text-lg text-[#1A2B4A]">{po.poNumber}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Supplier</p>
          <p className="text-lg">{po.supplier}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Order Date</p>
          <p>{po.date}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Delivery Date</p>
          <p>{po.deliveryDate}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Amount</p>
          <p className="text-2xl text-[#1A2B4A]">Rs {po.amount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          className="flex-1 bg-[#1A2B4A] hover:bg-[#0F1729]"
          onClick={handleDownloadPDF}
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button 
          variant="outline"
          className="flex-1 border-[#1A2B4A] text-[#1A2B4A] hover:bg-[#1A2B4A] hover:text-white"
          onClick={handlePrintPDF}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print PDF
        </Button>
      </div>
    </div>
  );
}
