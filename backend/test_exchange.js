import 'dotenv/config';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

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
    console.log('1. Creating Sandbox Public Token...');
    const sandboxResponse = await plaidClient.sandboxPublicTokenCreate({
      institution_id: 'ins_109508',
      initial_products: ['auth', 'transactions'],
    });

    const publicToken = sandboxResponse.data.public_token;
    console.log('Success - Public Token:', publicToken);

    console.log('\n2. Exchanging for Access Token...');
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    console.log('Success - Access Token:', exchangeResponse.data.access_token);
    console.log('Success - Item ID:', exchangeResponse.data.item_id);

  } catch (error) {
    console.error('\nERROR CAUGHT EXCHANGING TOKEN:');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

test();
