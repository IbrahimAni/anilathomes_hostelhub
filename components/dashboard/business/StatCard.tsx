import React from 'react';
import { StatData } from '@/types/business';

const StatCard: React.FC<StatData> = ({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  icon,
  testId
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md"
      data-testid={testId || `stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600" id={`${title.toLowerCase().replace(/\s+/g, '-')}-label`}>
            {title}
          </p>
          <p 
            className="mt-2 text-3xl font-semibold text-gray-900"
            aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-label`}
          >
            {value}
          </p>
          {change && (
            <div className="mt-2 flex items-center">
              <span 
                className={`text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? '↑' : '↓'} {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${isPositive ? 'indigo' : 'red'}-100`}>
          <i className={`fas fa-${icon} text-${isPositive ? 'indigo' : 'red'}-600 text-xl`} aria-hidden="true"></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;