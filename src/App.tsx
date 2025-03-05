import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import DashboardLogin from './pages/DashboardLogin';
import Home from './pages/Home';
import PfpGenerator from './components/PfpGenerator';

const App: React.FC = () => {
  return (
    <div className="scale-wrapper">
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard-login" element={<DashboardLogin />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    </div>
  );
};

export default App;
