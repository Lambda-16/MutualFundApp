import React, { useState, useEffect } from 'react';
import api from '../api';

// interface Family {
//     id: string;
//     name: string;
//   }
  
interface Scheme {
    scheme_code: number;
    scheme_name: string;
  }

interface MutualFundData {
    Scheme_Code: number;
    ISIN_Div_Payout_ISIN_Growth: string;
    ISIN_Div_Reinvestment: string;
    Scheme_Name: string;
    Net_Asset_Value: number;
    Date: string;
    Scheme_Type: string;
    Scheme_Category: string;
    Mutual_Fund_Family: string;
  }

const BrowseMutualFunds: React.FC = () => {
  const [families, setFamilies] = useState<string[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('');
  const [units, setUnits] = useState<number>(1);
  const [mutualFundData, setMutualFundData] = useState<MutualFundData | null>(null);
  const token = localStorage.getItem('access_token');
  const tokenType = localStorage.getItem('token_type');


  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await api.get('mfdata/fetchfamilies', {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        });
        setFamilies(response.data);
      } catch (error) {
        console.error('Error fetching families:', error);
      }
    };

    fetchFamilies();
  }, []);


  const handleFamilyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFamily(e.target.value);
    const response = await api.get(`mfdata/getopenschemes/${e.target.value}`, {
      headers: {
        Authorization: `${tokenType} ${token}`
      }
    });
    setSchemes(response.data);
  };

  const handleViewMutualFund = async () => {
    const response = await api.get(`mfdata/fetchmutualfund/${selectedScheme}`, {
      headers: {
        Authorization: `${tokenType} ${token}`
      }
    });
    setMutualFundData(response.data);
  };


  const handleBuy = async () => {
    if (!mutualFundData) {
        alert('Mutual fund data is not available. Please select a scheme.');
        return;
      }
    const buyRequestData = {
        units: Number(units),
        scheme_code: mutualFundData.Scheme_Code,
        current_nav: mutualFundData.Net_Asset_Value,
        scheme_name: mutualFundData.Scheme_Name
      };
    
      try {
        const response = await api.post("investment/buyrequest", buyRequestData, {
          headers: {
            Authorization: `${tokenType} ${token}`,
          }
        });
        alert(response.data.detail);
      } catch (error) {
        console.error('Error purchasing mutual fund:', error);
        alert('Purchase failed. Please try again.');
      }
  };

const increaseUnits = () => {
    setUnits((prevUnits) => prevUnits + 1);
};

const decreaseUnits = () => {
    setUnits((prevUnits) => (prevUnits > 1 ? prevUnits - 1 : prevUnits));
};

  return (
    <div>
      <h1>Browse Mutual Funds</h1>
      <select onChange={handleFamilyChange} value={selectedFamily}>
        <option value="">Select Family</option>
        {families.map((family, index) => (
          <option key={index} value={family}>
            {family}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => setSelectedScheme(e.target.value)}
        value={selectedScheme}
        disabled={!selectedFamily}
      >
        <option value="">Select Open-ended Scheme</option>
        {schemes.map(scheme => (
          <option key={scheme.scheme_code} value={scheme.scheme_code}>
            {scheme.scheme_name}
          </option>
        ))}
      </select>
      <button onClick={handleViewMutualFund} disabled={!selectedScheme} >View</button>
      {mutualFundData && (
        <div>
          <h2>Mutual Fund Data</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Field</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(mutualFundData).map(([key, value], index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{key.replace(/_/g, ' ')}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <label style={{ display: 'block', marginBottom: '10px' }}>Select Units:</label>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <button onClick={decreaseUnits} disabled={units <= 1}>-</button>
                        <span style={{ margin: '0 10px' }}>{units}</span>
                        <button onClick={increaseUnits}>+</button>
                    </div>
                    <button onClick={handleBuy}>Buy</button>
        </div>
      )}
    </div>
  );
};

export default BrowseMutualFunds;
