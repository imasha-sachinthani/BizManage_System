import { Client } from '../types';
import { authService } from './auth';
import { mockClientData, mockClientStats } from './mockClients';

const API_BASE_URL = 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set to true to use mock data during development

export interface CreateClientData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  isActive?: boolean;
}

export interface ClientsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClientStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueInvoices: number;
}

class ClientService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAllClients(params?: ClientsListParams) {
    if (USE_MOCK_DATA) {
      // Use mock data for development
      let filteredClients = [...mockClientData];
      
      // Apply search filter
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredClients = filteredClients.filter(client =>
          client.name.toLowerCase().includes(searchLower) ||
          (client.email && client.email.toLowerCase().includes(searchLower)) ||
          (client.contactPerson && client.contactPerson.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply status filter
      if (params?.status) {
        filteredClients = filteredClients.filter(client => client.status === params.status);
      }
      
      // Apply sorting
      if (params?.sortBy) {
        const sortKey = params.sortBy as keyof Client;
        const order = params.sortOrder === 'desc' ? -1 : 1;
        filteredClients.sort((a, b) => {
          const aVal = a[sortKey];
          const bVal = b[sortKey];
          if (aVal && bVal) {
            if (aVal < bVal) return -order;
            if (aVal > bVal) return order;
          }
          return 0;
        });
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedClients = filteredClients.slice(startIndex, startIndex + limit);
      
      return {
        clients: paginatedClients,
        pagination: {
          page,
          limit,
          total: filteredClients.length,
          totalPages: Math.ceil(filteredClients.length / limit),
        },
      };
    }
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    try {
      const response = await fetch(`${API_BASE_URL}/clients?${searchParams}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          clients: data.data.clients as Client[],
          pagination: data.data.pagination,
        };
      }
    } catch (error) {
      console.warn('API clients fetch failed, using mock data:', error);
    }

    // Fallback to mock data
    const mockClients: Client[] = [
      {
        id: '1',
        code: 'CLI-001',
        name: 'ABC Corporation Ltd',
        email: 'contact@abccorp.lk',
        phone: '+94 11 234 5678',
        address: '456 Business Avenue, Colombo 03',
        city: 'Colombo',
        country: 'Sri Lanka',
        taxId: 'VAT-ABC123',
        creditLimit: 500000,
        paymentTerms: 30,
        category: 'VIP',
        status: 'active',
        isActive: true,
        notes: 'Premium client with excellent payment history',
        contactPerson: 'John Perera',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        code: 'CLI-002',
        name: 'XYZ Trading Company',
        email: 'info@xyztrading.lk',
        phone: '+94 11 567 8901',
        address: '789 Commercial Street, Colombo 01',
        city: 'Colombo',
        country: 'Sri Lanka',
        taxId: 'VAT-XYZ456',
        creditLimit: 300000,
        paymentTerms: 45,
        category: 'REGULAR',
        status: 'active',
        isActive: true,
        notes: 'Regular client with good payment terms',
        contactPerson: 'Mary Silva',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        code: 'CLI-003',
        name: 'Global Tech Solutions',
        email: 'admin@globaltech.lk',
        phone: '+94 11 888 9999',
        address: '123 Tech Park, Colombo 07',
        city: 'Colombo',
        country: 'Sri Lanka',
        taxId: 'VAT-GTS789',
        creditLimit: 750000,
        paymentTerms: 30,
        category: 'VIP',
        status: 'active',
        isActive: true,
        notes: 'Technology sector client',
        contactPerson: 'David Fernando',
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Filter mock data based on params
    let filteredClients = mockClients;
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredClients = mockClients.filter(client => 
        client.name.toLowerCase().includes(search) ||
        (client.email && client.email.toLowerCase().includes(search)) ||
        client.code.toLowerCase().includes(search)
      );
    }
    
    if (params?.status) {
      filteredClients = filteredClients.filter(client => 
        client.isActive === (params.status === 'active')
      );
    }

    return {
      clients: filteredClients,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: filteredClients.length,
        totalPages: Math.ceil(filteredClients.length / (params?.limit || 10)),
      },
    };
  }

  async getClientById(id: string) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch client');
    }

    const data = await response.json();
    return data.data.client as Client;
  }

  async createClient(clientData: CreateClientData) {
    if (USE_MOCK_DATA) {
      const newClient: Client = {
        id: (Date.now()).toString(),
        code: `CLI-${String(Date.now()).slice(-3)}`,
        name: clientData.name,
        email: clientData.email || '',
        phone: clientData.phone || '',
        address: clientData.address || '',
        city: 'Colombo',
        country: 'Sri Lanka',
        taxId: '',
        contactPerson: clientData.contactPerson,
        businessType: '',
        creditLimit: 0,
        paymentTerms: 30,
        category: 'REGULAR',
        status: 'active',
        isActive: true,
        notes: clientData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newClient;
    }
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create client');
    }

    const data = await response.json();
    return data.data.client as Client;
  }

  async updateClient(id: string, clientData: UpdateClientData) {
    if (USE_MOCK_DATA) {
      const existingClient = mockClientData.find(c => c.id === id);
      if (!existingClient) {
        throw new Error('Client not found');
      }
      
      const updatedClient: Client = {
        ...existingClient,
        ...clientData,
        updatedAt: new Date().toISOString(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return updatedClient;
    }

    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      return await response.json();
    } catch (error) {
      console.error('Update client error:', error);
      throw error;
    }
  }

    const data = await response.json();
    return data.data.client as Client;
  }

  async deleteClient(id: string) {
    if (USE_MOCK_DATA) {
      const existingClient = mockClientData.find(c => c.id === id);
      if (!existingClient) {
        throw new Error('Client not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, message: 'Client deleted successfully' };
    }
    
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      return { success: true, message: 'Client deleted successfully' };
    } catch (error) {
      console.error('Delete client error:', error);
      throw error;
    }
  },

  async getClient(id: string): Promise<Client> {
    if (USE_MOCK_DATA) {
      const client = mockClientData.find(c => c.id === id);
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return client;
    }
    
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client');
      }

      return await response.json();
    } catch (error) {
      console.error('Get client error:', error);
      throw error;
    }
  },

  async getClientStats(): Promise<{ totalClients: number, activeClients: number, inactiveClients: number }> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const totalClients = mockClientData.length;
      const activeClients = mockClientData.filter(c => c.status === 'active').length;
      const inactiveClients = mockClientData.filter(c => c.status === 'inactive').length;
      
      return { totalClients, activeClients, inactiveClients };
    }
    
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}/clients/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get client stats error:', error);
      throw error;
    }
  }
}

export const clientService = new ClientService();