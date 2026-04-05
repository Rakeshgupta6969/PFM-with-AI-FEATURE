import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Example protected route for testing
router.get('/me', protect, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
