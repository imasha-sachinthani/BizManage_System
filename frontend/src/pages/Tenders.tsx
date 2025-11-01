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
import { StatusBadge } from '../components/StatusBadge';
import { mockTenders } from '../lib/mockData';
import { Tender } from '../types';
import { Plus, Search, Filter, Download, Eye, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';

export function Tenders() {
  const [tenders, setTenders] = useState<Tender[]>(mockTenders);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleExport = () => {
    toast.success('Tenders exported successfully');
  };

  const handleSubmitProposal = (tender: Tender) => {
    toast.success(`Proposal submitted for ${tender.title}`);
  };

  const handleDownloadDocs = (tender: Tender) => {
    toast.success(`Documents downloaded for ${tender.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl">Tender Management</h2>
          <p className="text-slate-500 text-sm mt-1">Track and manage tender submissions and opportunities</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A2B4A] hover:bg-[#0F1729] btn-hover">
              <Plus className="h-4 w-4 mr-2" />
              Add Tender
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Tender</DialogTitle>
              <DialogDescription>
                Track a new tender opportunity
              </DialogDescription>
            </DialogHeader>
            <AddTenderForm 
              onClose={() => setShowCreateDialog(false)}
              onSuccess={(newTender) => {
                setTenders([...tenders, newTender]);
                setShowCreateDialog(false);
                toast.success('Tender added successfully');
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg border-0 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Open Tenders</p>
            <p className="text-3xl mt-2">8</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg border-0 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Submitted</p>
            <p className="text-3xl mt-2">12</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg border-0 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Won</p>
            <p className="text-3xl mt-2">7</p>
          </CardContent>
        </Card>

        <Card className="luxury-gradient text-white shadow-lg border-0 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Win Rate</p>
            <p className="text-3xl mt-2">58.3%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Tenders</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="won">Won</TabsTrigger>
          <TabsTrigger value="lost">Lost</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card className="shadow-lg border-slate-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search tenders..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto"
                  onClick={() => toast.info('Additional filters coming soon')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
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

          {/* Tenders Table */}
          <Card className="shadow-lg border-slate-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Tender Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenders.filter(t => 
                      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.client.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((tender) => (
                      <TableRow key={tender.id} className="hover:bg-slate-50">
                        <TableCell>
                          <span className="text-[#1A2B4A]">{tender.title}</span>
                        </TableCell>
                        <TableCell>{tender.client}</TableCell>
                        <TableCell className="text-right">
                          Rs {(tender.value / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {tender.deadline}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={tender.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <TenderDetail 
                                  tender={tender} 
                                  onDownload={handleDownloadDocs}
                                  onSubmit={handleSubmitProposal}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="open" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Open Tender Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTenders.filter(t => t.status === 'open').map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submitted" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Submitted Tenders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTenders.filter(t => t.status === 'submitted').map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="won" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Won Tenders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTenders.filter(t => t.status === 'won').map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lost" className="space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Lost Tenders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTenders.filter(t => t.status === 'lost').map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TenderCard({ tender }: { tender: any }) {
  const daysUntilDeadline = Math.floor((new Date(tender.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-[#1A2B4A] mb-1">{tender.title}</h4>
          <p className="text-sm text-slate-600">{tender.client}</p>
        </div>
        <StatusBadge status={tender.status} />
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
        <span className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          Rs {(tender.value / 1000000).toFixed(1)}M
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Deadline: {tender.deadline}
        </span>
      </div>

      {tender.status === 'open' && daysUntilDeadline >= 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Time remaining</span>
            <span className="text-[#1A2B4A]">{daysUntilDeadline} days</span>
          </div>
          <Progress value={(daysUntilDeadline / 30) * 100} className="h-2" />
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => toast.info(`Viewing details for ${tender.title}`)}
        >
          View Details
        </Button>
        {tender.status === 'open' && (
          <Button 
            size="sm" 
            className="flex-1 bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
            onClick={() => toast.success(`Proposal submitted for ${tender.title}`)}
          >
            Submit Proposal
          </Button>
        )}
      </div>
    </div>
  );
}

function AddTenderForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: (tender: Tender) => void }) {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [value, setValue] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'open' | 'submitted' | 'won' | 'lost'>('open');

  const handleSubmit = () => {
    if (!title || !client || !value || !deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newTender: Tender = {
      id: (Math.random() * 1000).toString(),
      title,
      client,
      value: parseFloat(value),
      deadline,
      status
    };

    onSuccess(newTender);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Tender Title *</Label>
          <Input 
            placeholder="Enter tender title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Client/Organization *</Label>
          <Input 
            placeholder="Enter client name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tender Value (Rs) *</Label>
            <Input 
              type="number" 
              placeholder="0.00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Deadline *</Label>
            <Input 
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value: any) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-[#1A2B4A] hover:bg-[#0F1729]" onClick={handleSubmit}>
          Add Tender
        </Button>
      </div>
    </div>
  );
}

function TenderDetail({ tender, onDownload, onSubmit }: { tender: Tender; onDownload: (t: Tender) => void; onSubmit: (t: Tender) => void }) {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>{tender.title}</span>
          <StatusBadge status={tender.status} />
        </DialogTitle>
        <DialogDescription>{tender.client}</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-slate-500">Tender Value</p>
          <p className="text-2xl text-[#1A2B4A] mt-1">Rs {(tender.value / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Deadline</p>
          <p className="text-lg mt-1">{tender.deadline}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4>Tender Requirements</h4>
        <ul className="space-y-2 text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">✓</span>
            <span>Valid company registration and VAT documentation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">✓</span>
            <span>Technical proposal with detailed methodology</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">✓</span>
            <span>Financial proposal with cost breakdown</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">✓</span>
            <span>Previous project references and case studies</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onDownload(tender)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Documents
        </Button>
        {tender.status === 'open' && (
          <Button 
            className="flex-1 bg-[#1A2B4A] hover:bg-[#0F1729] transition-all duration-300"
            onClick={() => onSubmit(tender)}
          >
            Submit Proposal
          </Button>
        )}
      </div>
    </div>
  );
}
