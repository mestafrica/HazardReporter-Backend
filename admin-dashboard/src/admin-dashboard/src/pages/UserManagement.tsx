import React, { useState, useMemo, useRef } from "react";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import { FiHome, FiUsers, FiCheckSquare, FiSearch, FiChevronDown, FiX, FiEye, FiEdit, FiTrash, FiMail, FiPhone, FiCalendar, FiFileText, FiCheck, FiAlertCircle, FiSlash, FiCamera } from "react-icons/fi";
import toast from "react-hot-toast";
import adminDashboard from '../assets/images/adminDashboard.jpg';

interface User {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  reports: number;
  phone: string;
  status: 'Active' | 'Pending' | 'Suspended';
  avatar?: string;
  address?: string;
  lastActive?: string;
}

const INITIAL_USERS: User[] = [
  { id: 1, name: 'Abena Mensah', email: 'abenamensah@gmail.com', date: 'Oct 12, 2026', time: '12:23 PM', reports: 10, phone: '+233 24 849 2323', status: 'Active', address: 'Accra, Ghana', lastActive: '2 hours ago' },
  { id: 2, name: 'Kwame Osei', email: 'kwameosei@gmail.com', date: 'Oct 15, 2026', time: '09:15 AM', reports: 4, phone: '+233 20 123 4567', status: 'Active', address: 'Kumasi, Ghana', lastActive: '5 hours ago' },
  { id: 3, name: 'Sika Yeboah', email: 'sikayeboah@gmail.com', date: 'Nov 02, 2026', time: '14:45 PM', reports: 2, phone: '+233 27 987 6543', status: 'Suspended', address: 'Tema, Ghana', lastActive: '3 days ago' },
  { id: 4, name: 'Kofi Annan', email: 'kofiannan@gmail.com', date: 'Jan 10, 2026', time: '16:30 PM', reports: 0, phone: '+233 55 555 5555', status: 'Pending', address: 'Takoradi, Ghana', lastActive: 'Never' },
  { id: 5, name: 'Akua Serwaa', email: 'akuserwaa@gmail.com', date: 'Feb 15, 2026', time: '10:00 AM', reports: 15, phone: '+233 54 123 4567', status: 'Active', address: 'Cape Coast, Ghana', lastActive: '1 hour ago' },
  { id: 6, name: 'Yaw Oppong', email: 'yawoppong@gmail.com', date: 'Mar 20, 2026', time: '08:30 AM', reports: 8, phone: '+233 50 987 6543', status: 'Active', address: 'Sunyani, Ghana', lastActive: '30 mins ago' },
  { id: 7, name: 'Adwoa Asante', email: 'adwoaasante@gmail.com', date: 'Apr 05, 2026', time: '11:15 AM', reports: 3, phone: '+233 26 111 2222', status: 'Pending', address: 'Ho, Ghana', lastActive: 'Never' },
  { id: 8, name: 'Kweku Mensah', email: 'kwekumensah@gmail.com', date: 'May 12, 2026', time: '15:45 PM', reports: 22, phone: '+233 55 333 4444', status: 'Active', address: 'Tamale, Ghana', lastActive: '10 mins ago' },
  { id: 9, name: 'Efua Osei', email: 'efuaosei@gmail.com', date: 'Jun 18, 2026', time: '09:00 AM', reports: 1, phone: '+233 57 555 6666', status: 'Suspended', address: 'Koforidua, Ghana', lastActive: '1 week ago' },
  { id: 10, name: 'Akwasi Darko', email: 'akwasidarko@gmail.com', date: 'Jul 22, 2026', time: '14:20 PM', reports: 6, phone: '+233 51 777 8888', status: 'Active', address: 'Wa, Ghana', lastActive: '2 days ago' },
  { id: 11, name: ' Ama Boateng', email: 'amaboateng@gmail.com', date: 'Aug 30, 2026', time: '16:10 PM', reports: 12, phone: '+233 54 999 0000', status: 'Active', address: 'Bolgatanga, Ghana', lastActive: '5 mins ago' },
  { id: 12, name: 'Kojo Williams', email: 'kojowilliams@gmail.com', date: 'Sep 14, 2026', time: '12:00 PM', reports: 0, phone: '+233 56 111 2222', status: 'Pending', address: 'Wa, Ghana', lastActive: 'Never' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState<"All" | "Active" | "Pending" | "Suspended">("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 5;

  const tabs = [
    { id: "All", label: "All Users", count: users.length },
    { id: "Active", label: "Active", count: users.filter(u => u.status === 'Active').length },
    { id: "Pending", label: "Pending", count: users.filter(u => u.status === 'Pending').length },
    { id: "Suspended", label: "Suspended", count: users.filter(u => u.status === 'Suspended').length },
  ];

  const filteredUsers = useMemo(() => {
    const result = users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.phone.includes(searchQuery);
      const matchesStatus = selectedTab === "All" || user.status === selectedTab;
      return matchesSearch && matchesStatus;
    });

    return result.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
  }, [users, searchQuery, selectedTab, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTab, sortOrder]);

  const metrics = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    pending: users.filter(u => u.status === 'Pending').length,
    suspended: users.filter(u => u.status === 'Suspended').length,
  }), [users]);

  const handleTabChange = (tab: "All" | "Active" | "Pending" | "Suspended") => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const handleStatusChange = (userId: number, newStatus: 'Active' | 'Pending' | 'Suspended') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    toast.success(`User status updated to ${newStatus}`);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
      setShowViewModal(false);
    }
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    const updatedUser = { ...editingUser };
    if (previewAvatar) {
      updatedUser.avatar = previewAvatar;
    }
    
    setUsers(prev => prev.map(user => 
      user.id === editingUser.id ? updatedUser : user
    ));
    
    toast.success('User updated successfully');
    setShowEditModal(false);
    setEditingUser(null);
    setPreviewAvatar(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>, isEditModal: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isEditModal && editingUser) {
          setPreviewAvatar(result);
          setEditingUser({ ...editingUser, avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser({ ...user });
    setPreviewAvatar(user.avatar || null);
    setShowEditModal(true);
    setShowViewModal(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTab("All");
    setSortOrder("Newest");
    setCurrentPage(1);
  };

  const getUserAvatar = (user: User) => {
    return user.avatar || adminDashboard;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<FiUsers />}
          iconBgColor="#2563EB"
          iconColor="#FFFFFF"
          title="Total Users"
          value={metrics.total.toString()}
          percentage="12.5%"
          isPositive={true}
        />
        <MetricCard
          icon={<FiCheck />}
          iconBgColor="#22C55E"
          iconColor="#FFFFFF"
          title="Active Users"
          value={metrics.active.toString()}
          percentage="8.3%"
          isPositive={true}
        />
        <MetricCard
          icon={<FiAlertCircle />}
          iconBgColor="#F59E0B"
          iconColor="#FFFFFF"
          title="Pending Verification"
          value={metrics.pending.toString()}
          percentage="15.7%"
          isPositive={true}
        />
        <MetricCard
          icon={<FiSlash />}
          iconBgColor="#EF4444"
          iconColor="#FFFFFF"
          title="Suspended Users"
          value={metrics.suspended.toString()}
          percentage="2.1%"
          isPositive={false}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as typeof selectedTab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-200 text-gray-700 pl-4 pr-10 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "Newest" | "Oldest")}
              >
                <option value="Newest">Sort: Newest</option>
                <option value="Oldest">Sort: Oldest</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <button 
              onClick={clearFilters}
              className="text-brand-blue text-sm font-medium hover:underline whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left align-middle border-t border-gray-100">
            <thead className="text-xs text-brand-dark uppercase bg-transparent border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">User Profile</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Join Date</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Reports</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Phone</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img 
                          src={getUserAvatar(user)} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover bg-gray-200" 
                        />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          user.status === 'Active' ? 'bg-green-500' : 
                          user.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="font-bold text-gray-900">{user.date}</p>
                    <p className="text-xs text-brand-blue font-medium">{user.time}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                      <FiFileText className="text-xs" />
                      {user.reports}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-700">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openViewModal(user)}
                        className="text-brand-blue hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <FiEye />
                        <span className="text-sm">View</span>
                      </button>
                      <button 
                        onClick={() => openEditModal(user)}
                        className="text-green-600 hover:text-green-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                        title="Edit User"
                      >
                        <FiEdit />
                        <span className="text-sm">Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="flex flex-col items-center">
                      <FiUsers className="text-4xl text-gray-300 mb-2" />
                      <p>No users found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or search query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Total:</span>
                <span className="font-bold text-gray-700">{filteredUsers.length}</span>
                <span>users</span>
                <span className="text-gray-300">|</span>
                <span>Page</span>
                <span className="font-bold text-brand-blue">{currentPage}</span>
                <span>of</span>
                <span className="font-bold text-gray-700">{totalPages}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="First Page"
                >
                  ««
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ‹ Prev
                </button>
                <div className="flex items-center gap-1 mx-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum 
                              ? 'bg-brand-blue text-white shadow-md' 
                              : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={idx} className="px-1 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next ›
                </button>
                <button 
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Last Page"
                >
                  »»
                </button>
                
                <div className="flex items-center gap-2 ml-4 border-l border-gray-200 pl-4">
                  <span className="text-sm text-gray-500">Go to:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={getUserAvatar(selectedUser)} 
                    alt={selectedUser.name}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200" 
                  />
                  <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    selectedUser.status === 'Active' ? 'bg-green-500' : 
                    selectedUser.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">User ID: #{selectedUser.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEditModal(selectedUser)}
                  className="text-green-600 hover:text-green-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <FiEdit /> Edit
                </button>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <FiX className="text-2xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedUser.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <FiMail className="text-sm" />
                    <span className="text-xs font-medium">Email</span>
                  </div>
                  <p className="font-medium text-gray-900">{selectedUser.email}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <FiPhone className="text-sm" />
                    <span className="text-xs font-medium">Phone</span>
                  </div>
                  <p className="font-medium text-gray-900">{selectedUser.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <FiCalendar className="text-sm" />
                    <span className="text-xs font-medium">Joined</span>
                  </div>
                  <p className="font-medium text-gray-900">{selectedUser.date}</p>
                  <p className="text-xs text-gray-500">{selectedUser.time}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <FiFileText className="text-sm" />
                    <span className="text-xs font-medium">Reports</span>
                  </div>
                  <p className="font-medium text-gray-900">{selectedUser.reports} reports</p>
                </div>
              </div>

              {selectedUser.address && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <FiHome className="text-sm" />
                    <span className="text-xs font-medium">Address</span>
                  </div>
                  <p className="font-medium text-blue-900">{selectedUser.address}</p>
                </div>
              )}

              {selectedUser.lastActive && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <FiCheckSquare className="text-sm" />
                    <span className="text-xs font-medium">Last Active</span>
                  </div>
                  <p className="font-medium text-gray-900">{selectedUser.lastActive}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  {selectedUser.status !== 'Active' && (
                    <button 
                      onClick={() => {
                        handleStatusChange(selectedUser.id, 'Active');
                        setSelectedUser({ ...selectedUser, status: 'Active' });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <FiCheck />
                      <span>Activate</span>
                    </button>
                  )}
                  {selectedUser.status !== 'Suspended' && (
                    <button 
                      onClick={() => {
                        handleStatusChange(selectedUser.id, 'Suspended');
                        setSelectedUser({ ...selectedUser, status: 'Suspended' });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <FiSlash />
                      <span>Suspend</span>
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash />
                    <span>Delete User</span>
                  </button>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
              <button onClick={() => { setShowEditModal(false); setPreviewAvatar(null); }} className="text-gray-400 hover:text-gray-600">
                <FiX className="text-2xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img 
                    src={previewAvatar || editingUser.avatar || adminDashboard} 
                    alt={editingUser.name}
                    className="w-24 h-24 rounded-full object-cover bg-gray-200 border-4 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiCamera className="text-white text-2xl" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarChange(e, true)}
                />
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <FiCamera />
                  Change Photo
                </button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  value={editingUser.address || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Status</label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as User['status'] })}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => { setShowEditModal(false); setPreviewAvatar(null); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateUser}
                className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                <FiCheck />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
