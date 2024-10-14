
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => navigate('/browse-funds')}>Browse Mutual Funds</button>
      <button onClick={() => navigate('/view-investments')}>View My Investment</button>
    </div>
  );
};

export default Dashboard;
