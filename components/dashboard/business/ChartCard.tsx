"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ChartProps } from '@/types/business';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartCard: React.FC<ChartProps> = ({
  title,
  subtitle,
  type,
  data,
  height = 300,
  testId
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div 
      className="bg-white rounded-lg shadow p-6"
      data-testid={testId || `chart-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div style={{ height: `${height}px` }} aria-label={`${type} chart for ${title}`}>
        {type === 'line' ? (
          <Line options={options} data={data} />
        ) : (
          <Bar options={options} data={data} />
        )}
      </div>
    </div>
  );
};

export default ChartCard;