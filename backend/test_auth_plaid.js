import axios from 'axios';

async function test() {
  try {
    const ts = Date.now();
    console.log('1. Registering user...');
    const regRes = await axios.post('http://localhost:8000/api/auth/register', {
      name: `Test User ${ts}`,
      email: `test${ts}@example.com`,
      password: 'password123'
    });
    
    const token = regRes.data.token;
    console.log('User registered. Token:', token.substring(0, 15) + '...');
    
    console.log('2. Requesting link token...');
    const plaidRes = await axios.post('http://localhost:8000/api/plaid/create-link-token', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('SUCCESS! Link token:', plaidRes.data.link_token);
  } catch (error) {
    if (error.response) {
      console.error('FAILED! Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('ERROR:', error.message);
    }
  }
}

test();
