import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import BrowseMutualFunds from './components/BrowseMutualFunds';
import ViewInvestments from './components/ViewInvestments';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse-funds" element={<BrowseMutualFunds />} />
        <Route path="/view-investments" element={<ViewInvestments />} />
      </Routes>
    </Router>
  );
};

export default App;
