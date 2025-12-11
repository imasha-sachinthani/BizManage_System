import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Client } from '../types';
import { Mail, Phone, MapPin, FileText, TrendingUp, Calendar } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#1A2B4A]">{client.name}</h3>
          <p className="text-slate-600 mt-1">Client ID: {client.code}</p>
        </div>
        <Badge variant={client.isActive ? 'default' : 'secondary'} className="text-sm">
          {client.isActive ? 'Active' : 'Inactive'}
        </Badge>
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
