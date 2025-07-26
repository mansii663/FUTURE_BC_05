// src/components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ coinData, holdings }) => {
  const filteredData = coinData
    .filter((coin) => holdings[coin.id] && holdings[coin.id] > 0);

  const data = {
    labels: filteredData.map((coin) => coin.name),
    datasets: [
      {
        label: 'Token Value ($)',
        data: filteredData.map((coin) =>
          (coin.current_price * holdings[coin.id]).toFixed(2)
        ),
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#ffce56',
          '#4bc0c0',
          '#9966ff',
          '#f67019',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '500px', marginTop: '40px' }}>
      <h3>📊 Portfolio Distribution</h3>
      {filteredData.length > 0 ? (
        <Pie data={data} />
      ) : (
        <p>No data to display. Enter some holdings!</p>
      )}
    </div>
  );
};

export default PieChart;
