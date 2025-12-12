const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api';

// Sample client data
const newClient = {
  name: 'Tech Solutions Pvt Ltd',
  email: 'contact@techsolutions.lk',
  phone: '+94 11 789 4561',
  mobile: '+94 77 123 4567',
  address: '123 Main Street, Colombo 05',
  city: 'Colombo',
  country: 'Sri Lanka',
  taxId: 'VAT-TECH789',
  creditLimit: 750000,
  paymentTerms: 30,
  category: 'REGULAR',
  notes: 'Technology solutions provider - Regular customer',
};

async function addClient() {
  try {
    console.log('🔄 Adding new client...\n');
    console.log('Client Data:', JSON.stringify(newClient, null, 2));
    
    const response = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('\n✅ Client added successfully!');
      console.log('\nClient Details:');
      console.log('================');
      console.log(`ID: ${result.data.client.id}`);
      console.log(`Code: ${result.data.client.code}`);
      console.log(`Name: ${result.data.client.name}`);
      console.log(`Email: ${result.data.client.email}`);
      console.log(`Phone: ${result.data.client.phone}`);
      console.log(`Tax ID: ${result.data.client.taxId}`);
      console.log(`Credit Limit: LKR ${result.data.client.creditLimit}`);
      console.log(`Payment Terms: ${result.data.client.paymentTerms} days`);
      console.log(`Status: ${result.data.client.isActive ? 'Active' : 'Inactive'}`);
      console.log('\n🎉 You can now view this client in the Clients page!');
    } else {
      console.error('❌ Failed to add client:', result.error || result.message);
      if (result.errors) {
        console.error('Validation errors:', result.errors);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
addClient();
