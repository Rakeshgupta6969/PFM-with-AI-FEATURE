import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Account from '../models/Account.js';
import mongoose from 'mongoose';

const MOCK_CATEGORIES = ['Food and Drink', 'Travel', 'Payment', 'Recreation', 'Shops', 'Transfer'];

const seedMockData = async (userId) => {
  console.log('Seeding mock transactions for visual testing...');
  const transactions = [];
  const now = new Date();
  
  // Create a mock account to tie it to
  let account = await Account.findOne({ userId });
  if (!account) {
    account = await Account.create({
      userId,
      plaidAccountId: 'mock-account-1',
      name: 'Nexus Primary Checking',
      type: 'depository',
      subtype: 'checking',
      balanceAvailable: 4250.50,
      balanceCurrent: 4500.00,
    });
  }

  for (let i = 0; i < 45; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(now.getDate() - randomDaysAgo);
    
    transactions.push({
      userId,
      accountId: account._id,
      plaidTransactionId: `mock-txn-${i}`,
      name: `Transaction ${i + 1}`,
      amount: Math.random() * (120 - 5) + 5, // Random 5 to 120
      date,
      category: [MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)]],
    });
  }
  await Transaction.insertMany(transactions);
};

export const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Seeder hook for Phase 3 visual demonstration
    const txnListCount = await Transaction.countDocuments({ userId });
    if (txnListCount === 0) {
      await seedMockData(userId);
    }

    // 1. Group by Category (For Pie Chart)
    const categorySummary = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$category" },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $project: { name: "$_id", value: { $round: ["$total", 2] }, _id: 0 } }
    ]);

    // 2. Total Monthly Spending
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlySpendingRes = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: firstDayOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const monthlySpent = monthlySpendingRes.length > 0 ? monthlySpendingRes[0].total : 0;

    // 3. Last 30 Days (For Bar Chart trend)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const dailyTrend = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: thirtyDaysAgo } } },
      { $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", amount: { $round: ["$amount", 2] }, _id: 0 } }
    ]);

    res.json({
      pieChartData: categorySummary,
      barChartData: dailyTrend,
      monthlySpent: parseFloat(monthlySpent.toFixed(2))
    });
  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.user._id });
    if (!budget) {
      budget = await Budget.create({ userId: req.user._id, limit: 1500 });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { limit } = req.body;
    let budget = await Budget.findOne({ userId: req.user._id });
    if (budget) {
      budget.limit = Number(limit);
      await budget.save();
    } else {
      budget = await Budget.create({ userId: req.user._id, limit: Number(limit) });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(10);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addManualTransaction = async (req, res) => {
  try {
    const { amount, category, name, date } = req.body;
    let account = await Account.findOne({ userId: req.user._id });
    if (!account) {
      account = await Account.create({
        userId: req.user._id,
        plaidAccountId: 'manual-account',
        name: 'Nexus Primary Checking',
        type: 'depository',
        subtype: 'checking',
        balanceAvailable: 0,
        balanceCurrent: 0,
      });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      accountId: account._id,
      plaidTransactionId: `manual-txn-${Date.now()}`,
      name,
      amount: Number(amount),
      date: date || new Date(),
      category: [category],
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
