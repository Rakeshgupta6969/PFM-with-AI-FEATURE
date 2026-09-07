import 'dotenv/config'; // Must be the first import to load .env before ES modules evaluate
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import plaidRoutes from './routes/plaidRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import supportRoutes from './routes/supportRoutes.js';


const app = express();

// Middleware
// app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
// // app.use(cors({
// //   origin: process.env.CORS_ORIGIN || "*",
// //   credentials: true
// // }));


// app.use(cors({
//   origin: [
//     'http://localhost:5173', 
//     'https://pfm-with-ai-feature-kdsi.vercel.app',
//     'https://pfm-with-ai-feature-kdsi-onx6zk5q6.vercel.app'
//   ],
//   credentials: true
// }));

// --- UPDATED CORS CONFIGURATION ---
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
// ----------------------------------



app.use(express.json());
// Connect to Database
connectDB();

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/plaid', plaidRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/support', supportRoutes);

app.get('/', (req, res) => {
  res.send('PFM API is running');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
