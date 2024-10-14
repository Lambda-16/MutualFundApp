import React, { useState, useEffect } from 'react';
import api from '../api';

interface InvestedSchemeInfo {
  scheme_code: number;
  scheme_name: string;
  units: number;
  invested: number;
}

interface InvestedSchemeInfoWithCurrentValue extends InvestedSchemeInfo {
  current_value?: number;
}

const ViewInvestments: React.FC = () => {
  const [investments, setInvestments] = useState<InvestedSchemeInfoWithCurrentValue[]>([]);
  const token = localStorage.getItem('access_token');
  const tokenType = localStorage.getItem('token_type');

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await api.get('investment/viewportfolio', {
          headers: {
            Authorization: `${tokenType} ${token}`,
          },
        });
        setInvestments(response.data);
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
    };

    fetchInvestments();
  }, []);

  const handleGetCurrentValue = async () => {
    try {
      const response = await api.get('investment/getcurrentvalue', {
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      });
  

      const currentValueMap = response.data.reduce((acc: { [key: number]: number }, investment: InvestedSchemeInfoWithCurrentValue) => {

        if (investment.current_value !== undefined) {
          acc[investment.scheme_code] = investment.current_value;
        }
        return acc;
      }, {});
  
      const updatedInvestments = investments.map(investment => ({
        ...investment,
        current_value: currentValueMap[investment.scheme_code],
      }));
  
      setInvestments(updatedInvestments);
    } catch (error) {
      console.error('Error fetching current value:', error);
    }
  };
  

  return (
    <div>
      <h1>My Investments</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', fontSize: '16px' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Scheme Code</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Scheme Name</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', fontWeight: 'bold', width: '150px', textAlign: 'right' }}>Units</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', fontWeight: 'bold', width: '150px', textAlign: 'right' }}>Current Value</th>
          </tr>
        </thead>
        <tbody>
          {investments.map(investment => (
            <tr key={investment.scheme_code} style={{ backgroundColor: investment.current_value ? '#ffffff' : '#f9f9f9', transition: 'background-color 0.3s' }}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{investment.scheme_code}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{investment.scheme_name}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>{investment.units}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>{investment.current_value !== undefined ? investment.current_value : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleGetCurrentValue}>Get Current Value</button>
    </div>
  );
};

export default ViewInvestments;
