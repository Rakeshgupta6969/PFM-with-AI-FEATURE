import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AiLab from './pages/AiLab';
import ReportIssue from './pages/ReportIssue';
import Feedback from './pages/Feedback';
import ContactUs from './pages/ContactUs';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium animate-pulse tracking-widest text-xs uppercase">Initializing Session</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ai-lab" 
        element={
          <ProtectedRoute>
            <AiLab />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/report-issue" 
        element={
          <ProtectedRoute>
            <ReportIssue />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/feedback" 
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contact-us" 
        element={
          <ProtectedRoute>
            <ContactUs />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
