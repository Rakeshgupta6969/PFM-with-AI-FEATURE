import dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

dotenv.config();

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

async function test() {
  try {
    const request = {
      user: {
        client_user_id: 'test_user_id',
      },
      client_name: 'Nexus PFM',
      products: ['auth', 'transactions'],
      language: 'en',
      country_codes: ['US'],
    };
    
    console.log("Sending request to Plaid...");
    const response = await plaidClient.linkTokenCreate(request);
    console.log("SUCCESS:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("PLAID ERROR:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("NODE ERROR:", error.message);
    }
  }
}

test();
