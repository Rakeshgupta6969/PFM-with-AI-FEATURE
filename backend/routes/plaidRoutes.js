import express from 'express';
import { createLinkToken, setAccessToken, getAccounts, deleteAccount } from '../controllers/plaidController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-link-token', protect, createLinkToken);
router.post('/set-access-token', protect, setAccessToken);
router.get('/accounts', protect, getAccounts);
router.delete('/accounts/:id', protect, deleteAccount);

export default router;
