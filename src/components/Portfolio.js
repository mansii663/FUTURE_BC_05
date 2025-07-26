// src/components/Portfolio.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './PieChart'; // ✅ Import PieChart

const Portfolio = () => {
  const [holdings, setHoldings] = useState({});
  const [coinData, setCoinData] = useState([]);
  const [coinInput, setCoinInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCoinData = async () => {
    if (Object.keys(holdings).length === 0) return;

    setLoading(true);
    try {
      const ids = Object.keys(holdings).join(',');
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: 'usd',
            ids: ids,
          },
        }
      );
      setCoinData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoinData();
  }, [holdings]);

  const handleAddCoin = () => {
    if (coinInput.trim() && !holdings[coinInput.trim().toLowerCase()]) {
      setHoldings({ ...holdings, [coinInput.trim().toLowerCase()]: 0 });
      setCoinInput('');
    }
  };

  const handleQuantityChange = (coin, quantity) => {
    setHoldings({ ...holdings, [coin]: parseFloat(quantity) });
  };

  const totalValue = coinData.reduce((acc, coin) => {
    const quantity = holdings[coin.id] || 0;
    return acc + coin.current_price * quantity;
  }, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🪙 Crypto Portfolio Tracker</h1>

      <div>
        <input
          type="text"
          placeholder="Enter coin ID (e.g., bitcoin)"
          value={coinInput}
          onChange={(e) => setCoinInput(e.target.value)}
        />
        <button onClick={handleAddCoin}>Add Coin</button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Price (USD)</th>
                <th>Quantity</th>
                <th>Total Value</th>
                <th>24h Change (%)</th>
              </tr>
            </thead>
            <tbody>
              {coinData.map((coin) => (
                <tr key={coin.id}>
                  <td>{coin.name}</td>
                  <td>${coin.current_price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      value={holdings[coin.id] || ''}
                      onChange={(e) =>
                        handleQuantityChange(coin.id, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    $
                    {(
                      coin.current_price * (holdings[coin.id] || 0)
                    ).toFixed(2)}
                  </td>
                  <td
                    style={{
                      color:
                        coin.price_change_percentage_24h > 0
                          ? 'green'
                          : 'red',
                    }}
                  >
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: '20px' }}>
            💼 Total Portfolio Value: ${totalValue.toFixed(2)}
          </h2>

          {/* ✅ Pie Chart Display */}
          <PieChart coinData={coinData} holdings={holdings} />
        </div>
      )}
    </div>
  );
};

export default Portfolio;
