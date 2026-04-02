import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiActivity, 
  FiClipboard, 
  FiVolume2, 
  FiUser, 
  FiSettings, 
  FiPlus,
  FiX,
  FiMapPin,
  FiImage,
  FiAlertTriangle
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useDashboard } from "../context/DashboardContext";

const categories = ['Floods', 'Earthquake', 'Fire', 'Wildfire', 'Landslide', 'Others'];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { addReport, addAnnouncement } = useDashboard();
  
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Floods');
  const [reportLocation, setReportLocation] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showLocationInput, setShowLocationInput] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: <FiActivity className="text-lg" /> },
    { name: "Content Moderation", path: "/admin-dashboard/moderation", icon: <FiClipboard className="text-lg" /> },
    { name: "Announcement", path: "/admin-dashboard/announcements", icon: <FiVolume2 className="text-lg" /> },
    { name: "User Management", path: "/admin-dashboard/users", icon: <FiUser className="text-lg" /> },
    { name: "Settings", path: "/admin-dashboard/settings", icon: <FiSettings className="text-lg" /> },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File too large: ${file.name} (max 10MB)`);
          return false;
        }
        return true;
      });
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReport = () => {
    if (!reportTitle.trim()) {
      toast.error("Please enter a report title");
      return;
    }

    const firstAttachmentUrl = selectedFiles.length > 0 
      ? URL.createObjectURL(selectedFiles[0]) 
      : undefined;

    addReport({
      title: reportTitle,
      location: reportLocation || "Global",
      name: "Admin System",
      status: "Confirmed",
      category: reportCategory,
      attachmentName: selectedFiles.length > 0 ? `${selectedFiles.length} file(s)` : undefined,
      attachmentUrl: firstAttachmentUrl,
      locationData: reportLocation ? { text: reportLocation } : undefined
    });

    addAnnouncement({
      title: `Report: ${reportTitle}`,
      detail: reportDescription || `New ${reportCategory} report submitted from ${reportLocation || "Global"}.`,
      category: reportCategory.toLowerCase(),
      status: "Active",
      location: reportLocation ? { text: reportLocation } : undefined
    });

    toast.success("Report submitted successfully!");
    resetForm();
    setShowNewReportModal(false);
  };

  const resetForm = () => {
    setReportTitle('');
    setReportCategory('Floods');
    setReportLocation('');
    setReportDescription('');
    setSelectedFiles([]);
    setShowLocationInput(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <aside className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col pt-6 pb-8 fixed left-0 top-0 overflow-y-auto">
        <div className="px-8 mb-10">
          <h1 className="text-2xl font-black text-brand-blue tracking-tight">
            Gh-Hazard
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.path === "/admin-dashboard"
                ? location.pathname === "/admin-dashboard"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                  isActive
                    ? "bg-blue-50 text-brand-blue font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`${
                  isActive
                    ? "text-brand-blue"
                    : "text-gray-400"
                }`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-8">
          <button 
            onClick={() => setShowNewReportModal(true)}
            className="w-full flex items-center justify-center space-x-2 bg-brand-blue hover:bg-blue-700 text-white py-3 rounded-lg transition-colors text-sm font-semibold shadow-sm hover:shadow-md"
          >
            <FiPlus className="text-lg" />
            <span>New Report</span>
          </button>
        </div>
      </aside>

      {showNewReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Create New Report</h3>
                  <p className="text-sm text-gray-500">Submit a new hazard report</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowNewReportModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Report Title *</label>
                <input
                  type="text"
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="e.g., Severe flooding at Market Square"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setReportCategory(cat)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        reportCategory === cat
                          ? 'border-brand-blue bg-blue-50 text-brand-blue font-medium'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-900">Location</label>
                  <button
                    onClick={() => setShowLocationInput(!showLocationInput)}
                    className="text-xs text-brand-blue font-medium hover:underline flex items-center gap-1"
                  >
                    <FiMapPin /> {showLocationInput ? 'Hide' : 'Add Location'}
                  </button>
                </div>
                {showLocationInput ? (
                  <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <FiMapPin className="text-brand-blue mr-2" />
                    <input
                      type="text"
                      className="bg-transparent w-full text-sm outline-none"
                      placeholder="Enter specific location"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Enter location"
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none h-24"
                  placeholder="Provide additional details about the hazard..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Attachments</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-brand-blue hover:bg-blue-50 transition-colors"
                >
                  <FiImage className="mx-auto text-3xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload files</p>
                  <p className="text-xs text-gray-400">Images, PDF, DOC (max 10MB each)</p>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                        <button 
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button 
                onClick={() => { setShowNewReportModal(false); resetForm(); }}
                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReport}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FiAlertTriangle />
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
