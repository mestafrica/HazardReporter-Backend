import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: string;
  percentage: string;
  isPositive: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  value,
  percentage,
  isPositive,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between h-full border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          {icon}
        </div>
        <div
          className={`text-sm font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isPositive ? '+' : ''}{percentage}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-400 mt-1">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;
