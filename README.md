# Nexus Personal Finance Management (PFM) Dashboard

Nexus is a premium, cutting-edge Personal Finance Management application. It empowers users to securely track their spending, manage active bank connections via Plaid, establish dynamic budgeting limits, and elegantly parse financial data through responsive data-visualizations.

## 🚀 Features
- **Secure Authentication:** JWT-based stateless sessions and encrypted `bcryptjs` password storage.
- **Plaid API Integration:** Industry-standard secure bank integration token exchange sequence.
- **Data Visualizations:** Interactive D3 charts (Recharts) parsing native MongoDB aggregation pipelines via Phase 3 Data Seeders.
- **Dynamic Budget Tracker:** Auto-updating budget widgets visualizing monthly spending.
- **Manual Bookkeeping:** Manual transaction insertion & deletion ledgers bridging the gap between automated banking and manual tracking.
- **Glassmorphism UI:** Stunning, high-contrast user interface styled with Tailwind CSS v4 on top of React.

## 💻 Tech Stack
- **Frontend**: React (Vite), React Router Dom, Tailwind CSS v4, Lucide React, Recharts, React-Plaid-Link.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT, bcryptjs.
- **Unit Testing**: Jest & Supertest.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URL (or local MongoDB)
- Plaid Developer sandbox API keys

### 2. Environment Variables
Create a `.env` file in the `backend` directory. Reference `.env.example` heavily:
```env
PORT=8000
MONGODB_URI=your_mongodb_cluster_url
ACCESS_TOKEN_SECRET=your_jwt_strong_secret
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
```

### 3. Installation
Open two terminal instances.

**Backend Installation & Boot:**
```bash
cd backend
npm install
npm run dev
```

**Frontend Installation & Boot:**
```bash
cd frontend
npm install
npm run dev
```

Your system backend listens on port `8000`, whilst Vite aggressively routes your frontend to port `5173`. Open your web browser and navigate directly to your sleek dashboard!

## 🧪 Testing Environment
The backend API features a fully integrated automated testing workspace using Jest & Supertest to validate endpoints and middleware integrity without touching the UI.
```bash
cd backend
npm test
```

## 📜 Roadmap Progress
- [x] Phase 1 - Foundation & Clean Architecture
- [x] Phase 2 - Data Automation & Plaid Sequence
- [x] Phase 3 - SVG Charting, AI Budgeting Insights, UI Styling
- [x] Phase 4 - Manual Interventions, Jest Validations, Project Delivery

*Built by Nexus / AI Pair Programmer.*
