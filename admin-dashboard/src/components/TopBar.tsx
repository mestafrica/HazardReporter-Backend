import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaSearch, FaAngleDown, FaTimes, FaFileAlt, FaBullhorn, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import adminDashboard from '../assets/images/adminDashboard.jpg';
import { useDashboard } from '../context/DashboardContext';

interface SearchResult {
  type: 'report' | 'announcement' | 'user';
  id: string | number;
  title: string;
  subtitle: string;
  path: string;
}

const TopBar: React.FC = () => {
  const { userProfile, reports, announcements } = useDashboard();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const notifications = [
    { id: 1, text: 'New report submitted from Accra Central', time: '2 mins ago', unread: true },
    { id: 2, text: 'Flood warning updated for Volta Region', time: '15 mins ago', unread: true },
    { id: 3, text: 'User verification pending', time: '1 hour ago', unread: false },
    { id: 4, text: 'System maintenance scheduled', time: '2 hours ago', unread: false },
  ];
  
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase();
      const results: SearchResult[] = [];

      reports.forEach(report => {
        if (
          report.title.toLowerCase().includes(query) ||
          report.location.toLowerCase().includes(query) ||
          report.name.toLowerCase().includes(query)
        ) {
          results.push({
            type: 'report',
            id: report.id,
            title: report.title,
            subtitle: `${report.location} • ${report.status}`,
            path: '/admin-dashboard/moderation'
          });
        }
      });

      announcements.forEach(announcement => {
        if (
          announcement.title.toLowerCase().includes(query) ||
          announcement.detail.toLowerCase().includes(query)
        ) {
          results.push({
            type: 'announcement',
            id: announcement.id,
            title: announcement.title,
            subtitle: `${announcement.category} • ${announcement.status}`,
            path: '/admin-dashboard/announcements'
          });
        }
      });

      setSearchResults(results.slice(0, 10));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, reports, announcements]);

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(result.path);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FaFileAlt className="text-blue-500" />;
      case 'announcement':
        return <FaBullhorn className="text-purple-500" />;
      case 'user':
        return <FaUser className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 border-b border-gray-100 sticky top-0 z-20">
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-brand-blue focus:ring-1 text-sm outline-none transition-all"
            placeholder="Search reports, announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowResults(false);
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-30">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 bg-gray-50">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </div>
            {searchResults.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  {getResultIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                  <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded capitalize">
                  {result.type}
                </span>
              </button>
            ))}
          </div>
        )}

        {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 p-6 text-center z-30">
            <p className="text-gray-500 text-sm">No results found for "{searchQuery}"</p>
            <p className="text-gray-400 text-xs mt-1">Try different keywords</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-50"
          >
            <FaBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-30">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.unread ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notification.unread && (
                      <div className="w-2 h-2 mt-2 rounded-full bg-brand-blue shrink-0" />
                    )}
                    <div className={notification.unread ? '' : 'ml-5'}>
                      <p className="text-sm text-gray-900">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3 text-center border-t border-gray-100">
                <button className="text-sm text-brand-blue font-medium hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3 cursor-pointer">
          <img
            src={userProfile.avatar || adminDashboard}
            alt={userProfile.name}
            className="h-9 w-9 rounded-full object-cover border border-gray-200"
          />
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-700">{userProfile.name}</span>
            <FaAngleDown className="text-gray-400 text-xs" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
