import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ReturnPrint } from '../components/ReturnPrint';
import { Return, ReturnItem } from '../types';
import {
  Plus,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { toast } from 'sonner';

export function Returns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [printReturn, setPrintReturn] = useState<Return | null>(null);

  // Mock returns data
  const [returns, setReturns] = useState<Return[]>([
    {
      id: '1',
      returnNumber: 'RET-2024-001',
      invoiceNumber: 'INV-2024-001',
      client: 'ABC Corporation Ltd',
      amount: 450000,
      vatAmount: 67500,
      totalAmount: 517500,
      status: 'approved',
      date: '2024-11-15',
      reason: 'Product defective - Quality issues with delivered software module',
      refundMethod: 'bank_transfer',
      approvedBy: 'John Manager',
      items: [
        {
          id: '1',
          description: 'Enterprise Software License',
          quantity: 1,
          unitPrice: 450000,
          vatRate: 15,
          total: 517500,
          reason: 'Defective product',
        },
      ],
    },
    {
      id: '2',
      returnNumber: 'RET-2024-002',
      invoiceNumber: 'INV-2024-003',
      client: 'XYZ Trading Co',
      amount: 125000,
      vatAmount: 18750,
      totalAmount: 143750,
      status: 'pending',
      date: '2024-11-20',
      reason: 'Wrong item delivered - Customer ordered Model A but received Model B',
      refundMethod: 'replacement',
      items: [
        {
          id: '1',
          description: 'Hardware Component Set',
          quantity: 5,
          unitPrice: 25000,
          vatRate: 15,
          total: 143750,
          reason: 'Wrong item',
        },
      ],
    },
    {
      id: '3',
      returnNumber: 'RET-2024-003',
      invoiceNumber: 'INV-2024-005',
      client: 'Global Enterprises',
      amount: 75000,
      vatAmount: 11250,
      totalAmount: 86250,
      status: 'completed',
      date: '2024-11-10',
      reason: 'Customer not satisfied with service quality',
      refundMethod: 'credit_note',
      approvedBy: 'Sarah Admin',
      notes: 'Credit note issued and sent to customer via email',
      items: [
        {
          id: '1',
          description: 'Consulting Services Package',
          quantity: 10,
          unitPrice: 7500,
          vatRate: 15,
          total: 86250,
          reason: 'Not satisfied',
        },
      ],
    },
    {
      id: '4',
      returnNumber: 'RET-2024-004',
      invoiceNumber: 'INV-2024-007',
      client: 'Tech Solutions Inc',
      amount: 320000,
      vatAmount: 48000,
      totalAmount: 368000,
      status: 'rejected',
      date: '2024-11-25',
      reason: 'Return requested after 30-day period expired',
      items: [
        {
          id: '1',
          description: 'Annual Maintenance Contract',
          quantity: 1,
          unitPrice: 320000,
          vatRate: 15,
          total: 368000,
          reason: 'Late return',
        },
      ],
      notes: 'Return policy clearly states 30-day limit. Customer requested return on day 45.',
    },
  ]);

  // Form state for new return
  const [newReturn, setNewReturn] = useState({
    invoiceNumber: '',
    client: '',
    reason: '',
    refundMethod: 'credit_note',
    items: [] as ReturnItem[],
  });

  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0,
    vatRate: 15,
    reason: '',
  });

  const filteredReturns = returns.filter(ret => {
    const matchesSearch = 
      ret.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ret.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.unitPrice <= 0 || !newItem.reason) {
      toast.error('Please fill in all item details');
      return;
    }

    const itemTotal = newItem.quantity * newItem.unitPrice * (1 + newItem.vatRate / 100);
    const item: ReturnItem = {
      id: Date.now().toString(),
      ...newItem,
      total: itemTotal,
    };

    setNewReturn(prev => ({
      ...prev,
      items: [...prev.items, item],
    }));

    setNewItem({
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 15,
      reason: '',
    });

    toast.success('Item added to return');
  };

  const handleRemoveItem = (itemId: string) => {
    setNewReturn(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
    toast.success('Item removed');
  };

  const handleCreateReturn = () => {
    if (!newReturn.invoiceNumber || !newReturn.client || !newReturn.reason || newReturn.items.length === 0) {
      toast.error('Please fill in all required fields and add at least one item');
      return;
    }

    const amount = newReturn.items.reduce((sum, item) => {
      const itemAmount = item.quantity * item.unitPrice;
      return sum + itemAmount;
    }, 0);

    const vatAmount = newReturn.items.reduce((sum, item) => {
      const itemVat = item.quantity * item.unitPrice * (item.vatRate / 100);
      return sum + itemVat;
    }, 0);

    const totalAmount = amount + vatAmount;

    const returnData: Return = {
      id: (returns.length + 1).toString(),
      returnNumber: `RET-2024-${String(returns.length + 1).padStart(3, '0')}`,
      invoiceNumber: newReturn.invoiceNumber,
      client: newReturn.client,
      amount,
      vatAmount,
      totalAmount,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      reason: newReturn.reason,
      refundMethod: newReturn.refundMethod as any,
      items: newReturn.items,
    };

    setReturns([returnData, ...returns]);
    setIsCreateDialogOpen(false);
    setNewReturn({
      invoiceNumber: '',
      client: '',
      reason: '',
      refundMethod: 'credit_note',
      items: [],
    });

    toast.success(`Return ${returnData.returnNumber} created successfully`);
  };

  const handlePrint = (returnData: Return) => {
    setPrintReturn(returnData);
    setTimeout(() => {
      window.print();
      setPrintReturn(null);
    }, 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-300',
      completed: 'bg-blue-100 text-blue-700 border-blue-300',
      rejected: 'bg-red-100 text-red-700 border-red-300',
      pending: 'bg-amber-100 text-amber-700 border-amber-300',
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  // Statistics
  const stats = {
    total: returns.length,
    pending: returns.filter(r => r.status === 'pending').length,
    approved: returns.filter(r => r.status === 'approved').length,
    completed: returns.filter(r => r.status === 'completed').length,
    rejected: returns.filter(r => r.status === 'rejected').length,
    totalAmount: returns.filter(r => r.status !== 'rejected').reduce((sum, r) => sum + r.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Returns Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage product/service returns and refunds</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Create Return
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Return</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                  <Input
                    id="invoiceNumber"
                    value={newReturn.invoiceNumber}
                    onChange={(e) => setNewReturn({...newReturn, invoiceNumber: e.target.value})}
                    placeholder="INV-2024-XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="client">Client Name *</Label>
                  <Input
                    id="client"
                    value={newReturn.client}
                    onChange={(e) => setNewReturn({...newReturn, client: e.target.value})}
                    placeholder="Client name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Return Reason *</Label>
                <Input
                  id="reason"
                  value={newReturn.reason}
                  onChange={(e) => setNewReturn({...newReturn, reason: e.target.value})}
                  placeholder="Detailed reason for return"
                />
              </div>

              <div>
                <Label htmlFor="refundMethod">Refund Method</Label>
                <Select value={newReturn.refundMethod} onValueChange={(value) => setNewReturn({...newReturn, refundMethod: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_note">Credit Note</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash Refund</SelectItem>
                    <SelectItem value="replacement">Replacement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add Items */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Add Return Items</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <Label htmlFor="description">Item Description *</Label>
                    <Input
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Product or service name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="itemReason">Item Return Reason *</Label>
                    <Input
                      id="itemReason"
                      value={newItem.reason}
                      onChange={(e) => setNewItem({...newItem, reason: e.target.value})}
                      placeholder="Specific reason"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="unitPrice">Unit Price (Rs) *</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="vatRate">VAT Rate (%)</Label>
                    <Input
                      id="vatRate"
                      type="number"
                      min="0"
                      max="100"
                      value={newItem.vatRate}
                      onChange={(e) => setNewItem({...newItem, vatRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <Button onClick={handleAddItem} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* Items List */}
              {newReturn.items.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Return Items ({newReturn.items.length})</h3>
                  <div className="space-y-2">
                    {newReturn.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-slate-600">
                            Qty: {item.quantity} × Rs {item.unitPrice.toLocaleString()} | VAT: {item.vatRate}% | 
                            Reason: {item.reason}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">Rs {item.total.toLocaleString()}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-slate-100 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span className="font-semibold">
                        Rs {newReturn.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>VAT:</span>
                      <span className="font-semibold">
                        Rs {newReturn.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.vatRate / 100), 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-300">
                      <span>Total Refund:</span>
                      <span>
                        Rs {newReturn.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateReturn}
                  className="flex-1 bg-[#1A2B4A] hover:bg-[#0F1729]"
                >
                  Create Return
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="text-white" style={{ background: 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)' }}>
          <CardContent className="p-4">
            <p className="text-white/80 text-sm">Total Returns</p>
            <p className="text-2xl font-bold mt-2">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="text-white" style={{ background: 'linear-gradient(to bottom right, #f97316, #c2410c)' }}>
          <CardContent className="p-4">
            <p className="text-white/80 text-sm">Pending</p>
            <p className="text-2xl font-bold mt-2">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card className="text-white" style={{ background: 'linear-gradient(to bottom right, #22c55e, #15803d)' }}>
          <CardContent className="p-4">
            <p className="text-white/80 text-sm">Approved</p>
            <p className="text-2xl font-bold mt-2">{stats.approved}</p>
          </CardContent>
        </Card>

        <Card className="text-white" style={{ background: 'linear-gradient(to bottom right, #10b981, #059669)' }}>
          <CardContent className="p-4">
            <p className="text-white/80 text-sm">Completed</p>
            <p className="text-2xl font-bold mt-2">{stats.completed}</p>
          </CardContent>
        </Card>

        <Card className="text-white" style={{ background: 'linear-gradient(to bottom right, #ef4444, #b91c1c)' }}>
          <CardContent className="p-4">
            <p className="text-white/80 text-sm">Rejected</p>
            <p className="text-2xl font-bold mt-2">{stats.rejected}</p>
          </CardContent>
        </Card>

        <Card className="text-white" style={{ background: 'linear-gradient(to bottom right, #6366f1, #4338ca)' }}>
          <CardContent className="p-4">
            <p className="text-white/80 text-sm">Total Refunds</p>
            <p className="text-xl font-bold mt-2">Rs {(stats.totalAmount / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by return number, invoice, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Returns List */}
      <div className="space-y-4">
        {filteredReturns.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No returns found</p>
            </CardContent>
          </Card>
        ) : (
          filteredReturns.map((returnData) => (
            <Card key={returnData.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      {getStatusIcon(returnData.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[#1A2B4A]">{returnData.returnNumber}</h3>
                        {getStatusBadge(returnData.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-slate-500">Invoice No</p>
                          <p className="font-medium">{returnData.invoiceNumber}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Client</p>
                          <p className="font-medium">{returnData.client}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Return Date</p>
                          <p className="font-medium">{returnData.date}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Refund Method</p>
                          <p className="font-medium">{returnData.refundMethod?.replace('_', ' ').toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r mb-3">
                        <p className="text-sm text-slate-700">
                          <span className="font-semibold">Reason:</span> {returnData.reason}
                        </p>
                      </div>

                      {returnData.notes && (
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r mb-3">
                          <p className="text-sm text-slate-700">
                            <span className="font-semibold">Notes:</span> {returnData.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-500">Items: <span className="font-semibold text-slate-700">{returnData.items.length}</span></span>
                        {returnData.approvedBy && (
                          <span className="text-slate-500">Approved by: <span className="font-semibold text-slate-700">{returnData.approvedBy}</span></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-slate-500 mb-1">Total Refund</p>
                      <p className="text-2xl font-bold text-red-600">
                        Rs {returnData.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <Button
                      onClick={() => handlePrint(returnData)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Hidden Print Component */}
      {printReturn && (
        <div className="hidden print:block">
          <ReturnPrint returnData={printReturn} />
        </div>
      )}
    </div>
  );
}
