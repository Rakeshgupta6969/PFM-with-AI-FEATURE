import express from 'express';
import { reportIssue, submitFeedback, getAllFeedback } from '../controllers/supportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/report-issue', protect, reportIssue);
router.post('/feedback', protect, submitFeedback);
router.get('/feedback', protect, getAllFeedback);

export default router;
