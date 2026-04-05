import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import User from '../models/User.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

const getPlaidClient = () => {
  const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  });
  return new PlaidApi(configuration);
};

export const createLinkToken = async (req, res) => {
  try {
    const plaidClient = getPlaidClient();
    const request = {
      user: {
        client_user_id: req.user._id.toString(),
      },
      client_name: 'Nexus PFM',
      products: ['auth', 'transactions'],
      language: 'en',
      country_codes: ['US'],
    };
    
    const response = await plaidClient.linkTokenCreate(request);
    res.json(response.data);
  } catch (error) {
    console.error('CREATE LINK ERROR:', error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

export const setAccessToken = async (req, res) => {
  try {
    const { public_token } = req.body;
    if (!public_token) {
      throw new Error('Public token is missing from request body');
    }
    
    const plaidClient = getPlaidClient();
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });
    
    const accessToken = tokenResponse.data.access_token;
    const itemId = tokenResponse.data.item_id;
    
    // Save to user
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error('User not found in database');
    }

    user.plaidAccessToken = accessToken;
    user.plaidItemId = itemId;
    await user.save();
    
    res.json({ success: true, message: 'Bank accounts securely linked' });
  } catch (error) {
    console.error('SET ACCESS TOKEN ERROR:', error.response?.data || error.message);
    res.status(500).json({ message: error.message, details: error.response?.data });
  }
};

export const getAccounts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.plaidAccessToken) {
      return res.status(400).json({ message: 'User has not linked a bank account' });
    }

    const plaidClient = getPlaidClient();
    const authResponse = await plaidClient.authGet({
      access_token: user.plaidAccessToken,
    });

    const accounts = authResponse.data.accounts;

    // Save to database
    const savedAccounts = await Promise.all(accounts.map(async (acc) => {
      let account = await Account.findOne({ plaidAccountId: acc.account_id, userId: user._id });
      if (!account) {
        account = new Account({
          userId: user._id,
          plaidAccountId: acc.account_id,
          name: acc.name,
          officialName: acc.official_name,
          type: acc.type,
          subtype: acc.subtype,
          balanceAvailable: acc.balances.available,
          balanceCurrent: acc.balances.current,
        });
      } else {
        account.balanceAvailable = acc.balances.available;
        account.balanceCurrent = acc.balances.current;
      }
      await account.save();
      return account;
    }));

    res.json(savedAccounts);
  } catch (error) {
    console.error('GET ACCOUNTS ERROR:', error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const userId = req.user._id;

    const account = await Account.findOne({ _id: accountId, userId });

    if (!account) {
      return res.status(404).json({ message: 'Account not found or access denied' });
    }

    // Delete associated transactions
    await Transaction.deleteMany({ accountId: account._id, userId });

    // Delete the account
    await account.deleteOne();

    res.json({ message: 'Account and associated transactions deleted successfully' });
  } catch (error) {
    console.error('DELETE ACCOUNT ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};
