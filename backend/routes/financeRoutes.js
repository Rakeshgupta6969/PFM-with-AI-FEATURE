import express from 'express';
import { getSummary, getBudget, updateBudget, getRecentTransactions, addManualTransaction, deleteTransaction } from '../controllers/financeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getSummary);
router.get('/budget', protect, getBudget);
router.post('/budget', protect, updateBudget);

router.get('/transactions', protect, getRecentTransactions);
router.post('/transactions', protect, addManualTransaction);
router.delete('/transactions/:id', protect, deleteTransaction);

export default router;
