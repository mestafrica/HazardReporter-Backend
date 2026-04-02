import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus = status.toLowerCase();

  let bgClass = "bg-gray-100";
  let textClass = "text-gray-600";

  switch (normalizedStatus) {
    case "resolved":
    case "confirmed":
      bgClass = "bg-green-100";
      textClass = "text-green-700";
      break;
    case "active":
    case "investigating":
      bgClass = "bg-blue-100";
      textClass = "text-blue-700";
      break;
    case "pending":
      bgClass = "bg-orange-100";
      textClass = "text-orange-700";
      break;
    case "spam":
    case "suspended":
    case "archived":
      bgClass = "bg-red-100";
      textClass = "text-red-700";
      break;
    case "pinned":
      bgClass = "bg-purple-100";
      textClass = "text-purple-700";
      break;
    case "alert":
      textClass = "text-red-600";
      bgClass = "bg-white";
      break;
    case "info":
      textClass = "text-yellow-600";
      bgClass = "bg-white";
      break;
    case "update":
      textClass = "text-blue-600";
      bgClass = "bg-white";
      break;
    case "floods":
      bgClass = "bg-blue-100";
      textClass = "text-blue-700";
      break;
    case "wildfire":
      bgClass = "bg-orange-100";
      textClass = "text-orange-700";
      break;
    case "others":
      bgClass = "bg-gray-100";
      textClass = "text-gray-700";
      break;
    default:
      bgClass = "bg-gray-100";
      textClass = "text-gray-600";
  }

  // Handle transparent background cases for Categories in Announcements
  if (['alert', 'info', 'update'].includes(normalizedStatus)) {
      return <span className={`text-sm font-medium ${textClass}`}>{status}</span>;
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${bgClass} ${textClass}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
