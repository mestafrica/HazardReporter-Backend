import React, { useState, useMemo } from "react";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import { FiHome, FiSearch, FiCheckSquare, FiAlertTriangle, FiChevronDown, FiPaperclip, FiMapPin, FiX, FiImage, FiExternalLink, FiCheck, FiTrash, FiFile, FiFileText, FiVideo, FiMap, FiEye, FiDownload, FiCloud } from "react-icons/fi";
import adminDashboard from '../assets/images/adminDashboard.jpg';
import { useDashboard, Report } from "../context/DashboardContext";
import toast from "react-hot-toast";

const ContentModeration: React.FC = () => {
  const { reports, updateReport, deleteReport } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const itemsPerPage = 4;

  const filteredAndSortedReports = useMemo(() => {
    let result = reports.filter((report) => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            report.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortOrder === "Oldest") {
      result = [...result].reverse();
    }
    
    return result;
  }, [reports, searchQuery, statusFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedReports.length / itemsPerPage));
  const currentReports = filteredAndSortedReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortOrder]);

  const openViewModal = (report: Report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleStatusChange = (reportId: string, newStatus: string) => {
    updateReport(reportId, { status: newStatus });
    toast.success(`Report status updated to ${newStatus}`);
    setShowViewModal(false);
  };

  const handleDelete = (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReport(reportId);
      toast.success('Report deleted successfully');
      setShowViewModal(false);
    }
  };

  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const investigatingCount = reports.filter(r => r.status === 'Active').length;
  const resolvedCount = reports.filter(r => r.status === 'Confirmed' || r.status === 'Resolved').length;
  const spamCount = reports.filter(r => r.status === 'Spam').length;

  const getFileIcon = (filename: string) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <FiImage className="text-green-500" />;
    if (ext === 'pdf') return <FiFileText className="text-red-500" />;
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) return <FiVideo className="text-purple-500" />;
    return <FiFile className="text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<FiHome />}
          iconBgColor="#2563EB"
          iconColor="#FFFFFF"
          title="Pending Reports"
          value={pendingCount.toString()}
          percentage="12.5%"
          isPositive={true}
        />
        <MetricCard
          icon={<FiSearch />}
          iconBgColor="#22C55E"
          iconColor="#FFFFFF"
          title="Investigating"
          value={investigatingCount.toString()}
          percentage="8.3%"
          isPositive={true}
        />
        <MetricCard
          icon={<FiCheckSquare />}
          iconBgColor="#9333EA"
          iconColor="#FFFFFF"
          title="Resolved Issues"
          value={resolvedCount.toString()}
          percentage="15.7%"
          isPositive={true}
        />
        <MetricCard
          icon={<FiAlertTriangle />}
          iconBgColor="#EF4444"
          iconColor="#FFFFFF"
          title="Spam Mark"
          value={spamCount.toString()}
          percentage="2.1%"
          isPositive={false}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-blue outline-none text-sm"
              placeholder="Search hazard details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-200 text-gray-700 pl-4 pr-10 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="Resolved">Resolved</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Spam">Spam</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-200 text-gray-700 pl-4 pr-10 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "Newest" | "Oldest")}
              >
                <option value="Newest">Sort: Newest</option>
                <option value="Oldest">Sort: Oldest</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <button 
              onClick={() => { setSearchQuery(""); setStatusFilter("All Status"); setSortOrder("Newest"); }}
              className="text-brand-blue text-sm font-medium hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left align-middle border-t border-gray-100">
            <thead className="text-xs text-brand-dark uppercase bg-transparent border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Hazard Details</th>
                <th className="px-6 py-4 font-bold tracking-wider">Location</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Reporter</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Date & Time</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider">Attachments</th>
                <th className="px-6 py-4 font-bold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {row.attachmentUrl ? (
                        <img 
                          src={row.attachmentUrl} 
                          alt={row.title}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-brand-blue"
                        />
                      ) : (
                        <img src={adminDashboard} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{row.title}</p>
                        <p className="text-xs text-gray-500 font-medium">{row.category}</p>
                        <p className="text-xs text-gray-400 font-medium">ID: {row.id}</p>
                        {row.reportType === 'announcement' && (
                          <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">Alert</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 text-gray-700">
                        <FiMapPin className="text-brand-blue shrink-0" />
                        {row.location}
                      </span>
                      {row.locationData?.city && (
                        <span className="text-xs text-gray-400 ml-4">{row.locationData.city}, {row.locationData.country}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="font-bold text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-400 font-medium">Verified User</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="font-bold text-gray-900">{row.date}</p>
                    <p className="text-xs text-gray-400 font-medium">{row.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4">
                    {row.attachmentUrl ? (
                      <div className="flex items-center gap-2">
                        <div className="relative group cursor-pointer">
                          <img 
                            src={row.attachmentUrl} 
                            alt="" 
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FiEye className="text-white text-sm" />
                          </div>
                        </div>
                        {row.attachmentName && row.attachmentName.includes(',') && (
                          <span className="text-xs text-brand-blue bg-blue-50 px-2 py-1 rounded-full font-medium">
                            +{row.attachmentName.split(',').length - 1} more
                          </span>
                        )}
                      </div>
                    ) : row.attachmentName ? (
                      <div className="flex items-center gap-1.5 text-xs text-brand-blue bg-blue-50 px-2.5 py-1.5 rounded-lg">
                        {getFileIcon(row.attachmentName)}
                        <span className="truncate max-w-[100px]">{row.attachmentName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No attachments</span>
                    )}
                  </td>
                  <td 
                    onClick={() => openViewModal(row)}
                    className="px-6 py-4 text-brand-blue font-semibold hover:underline cursor-pointer"
                  >
                    View Details
                  </td>
                </tr>
              ))}
              {currentReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-medium">
                    No reports match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-500 font-medium">
              Showing {currentReports.length} results (Page {currentPage} of {totalPages})
            </span>
            <div className="flex space-x-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Previous
              </button>
              <div className="flex space-x-1 mx-1">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === idx + 1 
                        ? 'bg-brand-blue text-white' 
                        : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-200 rounded text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showViewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">Report Details</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{selectedReport.id}</span>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <FiX className="text-2xl" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge status={selectedReport.category} />
                <StatusBadge status={selectedReport.status} />
                {selectedReport.announcementId && (
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">From Announcement</span>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedReport.title}</h2>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{selectedReport.date}</span>
                  <span>•</span>
                  <span>{selectedReport.time}</span>
                  <span>•</span>
                  <span>Reporter: <span className="font-medium text-gray-700">{selectedReport.name}</span></span>
                </div>
              </div>
              
              {selectedReport.locationData && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiMapPin className="text-blue-600 text-xs" />
                    </div>
                    Location Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium">{selectedReport.locationData.text}</span>
                    </div>
                    {(selectedReport.locationData.city || selectedReport.locationData.country) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{selectedReport.locationData.city}</span>
                        {selectedReport.locationData.city && selectedReport.locationData.country && <span>•</span>}
                        <span>{selectedReport.locationData.country}</span>
                      </div>
                    )}
                    {selectedReport.locationData.coordinates?.latitude && selectedReport.locationData.coordinates?.longitude && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100 rounded-lg px-3 py-2 w-fit">
                        <FiMap />
                        <span>Lat: {selectedReport.locationData.coordinates.latitude.toFixed(6)}</span>
                        <span>•</span>
                        <span>Lng: {selectedReport.locationData.coordinates.longitude.toFixed(6)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedReport.attachmentUrl && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiPaperclip className="text-purple-600 text-xs" />
                    </div>
                    Attachments
                    {selectedReport.attachmentName?.includes(',') && (
                      <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full ml-2">
                        {selectedReport.attachmentName.split(',').length} files
                      </span>
                    )}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative group bg-white rounded-xl overflow-hidden shadow-sm">
                      <img 
                        src={selectedReport.attachmentUrl} 
                        alt="Attachment preview" 
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <div className="flex gap-2">
                          <a 
                            href={selectedReport.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-colors"
                            title="View full size"
                          >
                            <FiExternalLink className="text-sm" />
                          </a>
                          <a 
                            href={selectedReport.attachmentUrl} 
                            download
                            className="bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-colors"
                            title="Download"
                          >
                            <FiDownload className="text-sm" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-2">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-800 truncate">{selectedReport.attachmentName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getFileIcon(selectedReport.attachmentName || '')}
                          <span className="text-xs text-gray-500">Image file</span>
                        </div>
                      </div>
                      <p className="text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                        <FiCloud /> Stored on Cloudinary
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleStatusChange(selectedReport.id, 'Confirmed')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors"
                  >
                    <FiCheck />
                    Confirm
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedReport.id, 'Active')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                  >
                    <FiSearch />
                    Investigate
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedReport.id, 'Resolved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition-colors"
                  >
                    <FiCheckSquare />
                    Resolve
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedReport.id, 'Spam')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-colors"
                  >
                    <FiAlertTriangle />
                    Mark Spam
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedReport.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    <FiTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;
