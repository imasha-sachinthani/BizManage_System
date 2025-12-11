import { useState, useEffect, useMemo } from 'react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Client } from '../types';
import { clientService, CreateClientData, UpdateClientData } from '../services/clients';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  User,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useDebounce } from '../hooks/useDebounce';

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState<CreateClientData>({
    name: '',
    email: '',
    phone: '',
    mobile: '',
    address: '',
    city: '',
    country: '',
    taxId: '',
    creditLimit: 0,
    paymentTerms: 30,
    category: 'REGULAR',
    notes: '',
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = !debouncedSearch || 
        client.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        client.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        client.phone?.includes(debouncedSearch) ||
        client.taxId?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && client.isActive) ||
        (statusFilter === 'inactive' && !client.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [clients, debouncedSearch, statusFilter]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const result = await clientService.getAllClients({
        limit: 100, // Load more for client list
        search: debouncedSearch,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setClients(result.clients);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [debouncedSearch, statusFilter]);

  const handleAdd = async () => {
    if (!formData.name) {
      toast.error('Client name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const newClient = await clientService.createClient(formData);
      setClients(prev => [newClient, ...prev]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Client added successfully');
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedClient) return;

    try {
      setIsSubmitting(true);
      const updateData: UpdateClientData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        mobile: formData.mobile,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        taxId: formData.taxId,
        creditLimit: formData.creditLimit,
        paymentTerms: formData.paymentTerms,
        category: formData.category,
        notes: formData.notes,
      };

      const updatedClient = await clientService.updateClient(selectedClient.id, updateData);
      setClients(prev => prev.map(client => 
        client.id === selectedClient.id ? updatedClient : client
      ));
      setIsEditDialogOpen(false);
      setSelectedClient(null);
      resetForm();
      toast.success('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;

    try {
      setIsSubmitting(true);
      const result = await clientService.deleteClient(selectedClient.id);
      
      if (result.action === 'deactivated') {
        // Update the client status to inactive
        setClients(prev => prev.map(client => 
          client.id === selectedClient.id 
            ? { ...client, isActive: false, status: 'inactive' as const }
            : client
        ));
        toast.success('Client deactivated (has existing transactions)');
      } else {
        // Remove from list
        setClients(prev => prev.filter(client => client.id !== selectedClient.id));
        toast.success('Client deleted successfully');
      }

      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      mobile: client.mobile || '',
      address: client.address || '',
      city: client.city || '',
      country: client.country || '',
      taxId: client.taxId || '',
      creditLimit: client.creditLimit || 0,
      paymentTerms: client.paymentTerms || 30,
      category: client.category || 'REGULAR',
      notes: client.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      mobile: '',
      address: '',
      city: '',
      country: '',
      taxId: '',
      creditLimit: 0,
      paymentTerms: 30,
      category: 'REGULAR',
      notes: '',
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl">Client Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your client database and information</p>
        </div>
        <Button 
          onClick={openAddDialog}
          className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2 shadow-lg border-slate-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search clients by name, email, phone, or tax ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200">
          <CardContent className="p-4">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-[#1A2B4A] to-[#2D4A7C]">
          <CardContent className="p-4">
            <div className="text-white">
              <p className="text-sm opacity-90">Total Clients</p>
              <p className="text-3xl mt-1">{loading ? '-' : clients.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Details</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Tax ID & Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No clients found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4E5B0] flex items-center justify-center">
                            <span className="text-[#1A2B4A] text-sm font-medium">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-xs text-slate-500">
                              {client.code && `Code: ${client.code}`}
                            </div>
                            {client._count && (
                              <div className="text-xs text-slate-500">
                                {client._count.invoices} invoices
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {client.email}
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {client.phone}
                            </div>
                          )}
                          {client.mobile && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-3 w-3 text-slate-400" />
                              Mobile: {client.mobile}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {client.address && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {client.address}
                            </div>
                          )}
                          {(client.city || client.country) && (
                            <div className="text-xs text-slate-500">
                              {[client.city, client.country].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {client.taxId && (
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-3 w-3 text-slate-400" />
                              {client.taxId}
                            </div>
                          )}
                          {client.category && (
                            <Badge 
                              variant="outline"
                              className="text-xs"
                            >
                              {client.category}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={client.isActive ? 'default' : 'secondary'}
                          className={
                            client.isActive
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-100'
                          }
                        >
                          {client.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(client)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(client)}
                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                            disabled={isSubmitting}
                          >
                            {isSubmitting && selectedClient?.id === client.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the client details below to add them to your database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Client Name *</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ABC Corporation Ltd"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@company.lk"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-taxid">Tax ID</Label>
              <Input
                id="add-taxid"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="123456789V"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">Phone</Label>
              <Input
                id="add-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+94 11 234 5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-mobile">Mobile</Label>
              <Input
                id="add-mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+94 77 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-category">Category</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-address">Address</Label>
              <Input
                id="add-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Galle Road"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-city">City</Label>
              <Input
                id="add-city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Colombo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-country">Country</Label>
              <Input
                id="add-country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Sri Lanka"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-creditlimit">Credit Limit (LKR)</Label>
              <Input
                id="add-creditlimit"
                type="number"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
                placeholder="100000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-paymentterms">Payment Terms (Days)</Label>
              <Input
                id="add-paymentterms"
                type="number"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: parseInt(e.target.value) || 30 })}
                placeholder="30"
              />
            </div>
            <div className="space-y-2"></div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="add-notes">Notes</Label>
              <Input
                id="add-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the client..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAdd}
              className="bg-[#1A2B4A] hover:bg-[#0F1729]"
              disabled={!formData.name || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Client'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update the client details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Client Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-taxid">Tax ID</Label>
              <Input
                id="edit-taxid"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-mobile">Mobile</Label>
              <Input
                id="edit-mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-creditlimit">Credit Limit (LKR)</Label>
              <Input
                id="edit-creditlimit"
                type="number"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-paymentterms">Payment Terms (Days)</Label>
              <Input
                id="edit-paymentterms"
                type="number"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: parseInt(e.target.value) || 30 })}
              />
            </div>
            <div className="space-y-2"></div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEdit}
              className="bg-[#1A2B4A] hover:bg-[#0F1729]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client "{selectedClient?.name}". This action cannot be undone.
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
