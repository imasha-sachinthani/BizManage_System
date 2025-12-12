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
import { mockCompanies } from '../lib/mockData';
import { Company } from '../types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Globe,
  FileText,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

export function Companies() {
  // Load companies from localStorage or use mock data as default
  const getInitialCompanies = (): Company[] => {
    const savedCompanies = localStorage.getItem('companies');
    if (savedCompanies) {
      return JSON.parse(savedCompanies);
    }
    return mockCompanies;
  };

  const [companies, setCompanies] = useState<Company[]>(getInitialCompanies());
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Save companies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    vatNumber: '',
    registrationNumber: '',
    industry: '',
    website: '',
    status: 'active',
  });

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.phone.includes(searchQuery) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.vatNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    const newCompany: Company = {
      id: (companies.length + 1).toString(),
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      vatNumber: formData.vatNumber || '',
      registrationNumber: formData.registrationNumber || '',
      industry: formData.industry || '',
      website: formData.website,
      status: formData.status || 'active',
    };

    setCompanies([...companies, newCompany]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Company added successfully');
  };

  const handleEdit = () => {
    if (!selectedCompany) return;

    const updatedCompanies = companies.map(company =>
      company.id === selectedCompany.id
        ? { ...company, ...formData }
        : company
    );

    setCompanies(updatedCompanies);
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
    resetForm();
    toast.success('Company updated successfully');
  };

  const handleDelete = () => {
    if (!selectedCompany) return;

    const updatedCompanies = companies.filter(company => company.id !== selectedCompany.id);
    setCompanies(updatedCompanies);
    setIsDeleteDialogOpen(false);
    setSelectedCompany(null);
    toast.success('Company deleted successfully');
  };

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setFormData(company);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      vatNumber: '',
      registrationNumber: '',
      industry: '',
      website: '',
      status: 'active',
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
          <h2 className="text-2xl">Company Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage registered companies and their information</p>
        </div>
        <Button 
          onClick={openAddDialog}
          className="bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3 shadow-lg border-slate-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search companies by name, industry, email, or VAT number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-[#D4AF37] to-[#F4E5B0]">
          <CardContent className="p-4">
            <div className="text-[#1A2B4A]">
              <p className="text-sm">Total Companies</p>
              <p className="text-3xl mt-1">{companies.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies Table */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>VAT Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No companies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1A2B4A] to-[#2D4A7C] flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p>{company.name}</p>
                            {company.website && (
                              <a 
                                href={`https://${company.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Globe className="h-3 w-3" />
                                {company.website}
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-[#D4AF37] text-[#1A2B4A]">
                          {company.industry}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {company.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {company.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-3 w-3 text-slate-400" />
                          {company.registrationNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-3 w-3 text-slate-400" />
                          {company.vatNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={company.status === 'active' ? 'default' : 'secondary'}
                          className={
                            company.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-100'
                          }
                        >
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(company)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(company)}
                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
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

      {/* Add Company Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>
              Enter the company details below to add them to your database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Company Name *</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ABC Corporation Pvt Ltd"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-industry">Industry *</Label>
              <Input
                id="add-industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Manufacturing, IT, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">Email *</Label>
              <Input
                id="add-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@company.lk"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">Phone *</Label>
              <Input
                id="add-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+94 11 234 5678"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="add-address">Address *</Label>
              <Input
                id="add-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Galle Road, Colombo 03"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-vat">VAT Number *</Label>
              <Input
                id="add-vat"
                value={formData.vatNumber}
                onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                placeholder="VAT-123456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-reg">Registration Number *</Label>
              <Input
                id="add-reg"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="PV-12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-website">Website</Label>
              <Input
                id="add-website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="www.company.lk"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAdd}
              className="bg-[#1A2B4A] hover:bg-[#0F1729]"
              disabled={!formData.name || !formData.email || !formData.phone || !formData.address || !formData.vatNumber || !formData.registrationNumber || !formData.industry}
            >
              Add Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update the company details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Company Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-industry">Industry *</Label>
              <Input
                id="edit-industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone *</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-vat">VAT Number *</Label>
              <Input
                id="edit-vat"
                value={formData.vatNumber}
                onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-reg">Registration Number *</Label>
              <Input
                id="edit-reg"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEdit}
              className="bg-[#1A2B4A] hover:bg-[#0F1729]"
            >
              Save Changes
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
              This will permanently delete the company "{selectedCompany?.name}". This action cannot be undone.
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
