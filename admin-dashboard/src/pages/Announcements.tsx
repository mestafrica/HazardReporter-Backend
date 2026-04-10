import React, { useState, useRef, useMemo } from "react";
import StatusBadge from "../components/StatusBadge";
import { FiVolume2, FiSearch, FiChevronDown, FiPaperclip, FiMapPin, FiX, FiFile, FiImage, FiFileText, FiVideo, FiEye, FiDownload, FiExternalLink, FiTrash, FiEdit, FiCheck, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import adminDashboard from '../assets/images/adminDashboard.jpg';
import { useDashboard, Announcement, Attachment, LocationData } from "../context/DashboardContext";
import { announcementApi } from "../services/announcementApi";

interface UploadedFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  url?: string;
  publicId?: string;
}

const Announcements: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement, addReport } = useDashboard();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Alert" | "Info" | "Update">("Alert");
  const [message, setMessage] = useState("");
  const [pinToTop, setPinToTop] = useState(false);
  const [pinToFeed, setPinToFeed] = useState(true);
  
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationData, setLocationData] = useState<LocationData>({ text: "" });
  const [showAttachmentPanel, setShowAttachmentPanel] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAnnouncements = useMemo(() => {
    const result = announcements.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.detail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || item.status === statusFilter;
      const matchesCategory = categoryFilter === "All Categories" || 
                            item.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesCategory;
    });

    return result.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
  }, [announcements, searchQuery, statusFilter, categoryFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAnnouncements.length / itemsPerPage));
  const currentAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, sortOrder]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (filename: string) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <FiImage className="text-green-500" />;
    if (ext === 'pdf') return <FiFileText className="text-red-500" />;
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) return <FiVideo className="text-purple-500" />;
    return <FiFile className="text-gray-500" />;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
                          'application/pdf', 'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                          'video/mp4', 'video/quicktime', 'video/avi', 'video/webm'];
        if (!validTypes.includes(file.type)) {
          toast.error(`Invalid file type: ${file.name}`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File too large: ${file.name} (max 10MB)`);
          return false;
        }
        return true;
      });
      
      const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
        file,
        progress: 0,
        status: 'pending'
      }));
      
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      setShowAttachmentPanel(true);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const simulateUploadProgress = async (index: number) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, progress: 100, status: 'uploaded' } : f
          ));
          resolve();
        } else {
          setUploadedFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, progress, status: 'uploading' } : f
          ));
        }
      }, 200);
    });
  };

  const uploadFiles = async () => {
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
    for (let i = 0; i < pendingFiles.length; i++) {
      const originalIndex = uploadedFiles.findIndex(f => f.file === pendingFiles[i].file && f.status === 'pending');
      if (originalIndex !== -1) {
        await simulateUploadProgress(originalIndex);
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePostAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and Message are required!");
      return;
    }

    setIsUploading(true);
    
    try {
      let uploadedAttachments: Attachment[] = [];
      
      if (uploadedFiles.length > 0) {
        await uploadFiles();
        
        try {
          const response = await announcementApi.createAnnouncement(
            {
              title,
              detail: message,
              category,
              status: pinToTop ? "Pinned" : "Active",
              pinToFeed,
              location: locationData.text ? locationData : undefined
            },
            uploadedFiles.map(f => f.file)
          );
          uploadedAttachments = response.attachments || [];
        } catch (apiError) {
          console.log('API upload failed, using local URLs:', apiError);
          uploadedAttachments = uploadedFiles.map(f => ({
            url: URL.createObjectURL(f.file),
            filename: f.file.name,
            publicId: `local_${Date.now()}`,
            format: f.file.name.split('.').pop() || ''
          }));
        }
      }

      const newAnnouncement = addAnnouncement({
        title,
        detail: message,
        category: category.toLowerCase(),
        status: pinToTop ? "Pinned" : "Active",
        location: locationData.text ? locationData : undefined,
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined
      });

      const firstAttachmentUrl = uploadedAttachments.length > 0 ? uploadedAttachments[0].url : undefined;
      const attachmentNames = uploadedAttachments.length > 0 
        ? uploadedAttachments.map(a => a.filename).join(', ')
        : undefined;

      addReport({
        title,
        location: locationData.text || "Global",
        name: "Admin System",
        status: "Confirmed",
        category: category,
        reportType: 'announcement',
        attachmentName: attachmentNames,
        attachmentUrl: firstAttachmentUrl,
        locationData: locationData.text ? locationData : undefined,
        announcementId: newAnnouncement.id
      });

      toast.success("Announcement posted successfully!");
      resetForm();
    } catch (error) {
      console.error('Error posting announcement:', error);
      toast.error("Failed to post announcement. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAnnouncement = (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id);
      toast.success('Announcement deleted successfully');
      setShowViewModal(false);
    }
  };

  const handleUpdateAnnouncement = () => {
    if (!editingAnnouncement) return;
    
    updateAnnouncement(editingAnnouncement.id, {
      title: editingAnnouncement.title,
      detail: editingAnnouncement.detail,
      category: editingAnnouncement.category.toLowerCase(),
      status: editingAnnouncement.status
    });
    
    toast.success('Announcement updated successfully');
    setShowEditModal(false);
    setEditingAnnouncement(null);
    setShowViewModal(false);
  };

  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement({ ...announcement });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setCategory("Alert");
    setPinToTop(false);
    setPinToFeed(true);
    setUploadedFiles([]);
    setLocationData({ text: "" });
    setShowLocationInput(false);
    setShowAttachmentPanel(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Status");
    setCategoryFilter("All Categories");
    setSortOrder("Newest");
    setCurrentPage(1);
  };

  const openViewModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6 space-x-2">
          <FiVolume2 className="text-brand-blue" />
          <span>New Announcement</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-900 mb-2">Title</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition-shadow"
              placeholder="Eg: Extreme rainfall warning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
            <div className="flex space-x-2">
              {(['Alert', 'Info', 'Update'] as const).map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all border ${
                    category === cat 
                      ? 'border-brand-blue text-brand-blue bg-blue-50 shadow-sm' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-1 flex items-center bg-gray-50 rounded-lg px-4 border border-gray-100 mt-7 h-[46px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-start space-x-2">
                <FiMapPin className="text-brand-blue mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">Pin to top</p>
                  <p className="text-xs text-gray-500 font-medium">Featured at top</p>
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  id="toggle-pin" 
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-200 appearance-none cursor-pointer top-0 bottom-0 m-auto"
                  checked={pinToTop}
                  onChange={(e) => setPinToTop(e.target.checked)}
                />
                <label htmlFor="toggle-pin" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${pinToTop ? 'bg-brand-blue' : 'bg-gray-200'}`}></label>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
          <textarea
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 h-32 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-shadow resize-none text-sm"
            placeholder="Detailed message for users..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {showLocationInput && (
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiMapPin className="text-blue-600" />
                </div>
                <span className="text-sm font-bold text-blue-700">Location Tagging</span>
              </div>
              <button 
                onClick={() => { setShowLocationInput(false); setLocationData({ text: "" }); }} 
                className="text-blue-400 hover:text-blue-600"
              >
                <FiX />
              </button>
            </div>
            <div className="flex items-center">
              <FiMapPin className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="Enter specific location (e.g. Accra Central)"
                className="bg-transparent text-sm w-full outline-none text-gray-700 font-medium"
                value={locationData.text}
                onChange={(e) => setLocationData({ text: e.target.value })}
                autoFocus
              />
            </div>
            {locationData.text && (
              <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-100 rounded-lg p-2">
                <FiMapPin /> Tagged: {locationData.text}
              </div>
            )}
          </div>
        )}

        {showAttachmentPanel && uploadedFiles.length > 0 && (
          <div className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiPaperclip className="text-purple-600" />
                </div>
                <span className="text-sm font-bold text-purple-700">Attachments ({uploadedFiles.length})</span>
                {uploadedFiles.some(f => f.status === 'uploaded') && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    <FiCheck /> Ready
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                >
                  <FiPlus /> Add More
                </button>
                <button onClick={() => setShowAttachmentPanel(false)} className="text-purple-400 hover:text-purple-600">
                  <FiX />
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-2 shadow-sm">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {uploadedFile.file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(uploadedFile.file)} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getFileIcon(uploadedFile.file.name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{uploadedFile.file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
                  </div>
                  <div className="w-20">
                    {uploadedFile.status === 'uploading' && (
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-purple-600">{Math.round(uploadedFile.progress)}%</span>
                      </div>
                    )}
                    {uploadedFile.status === 'uploaded' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <FiCheck />
                        <span className="text-xs">Ready</span>
                      </div>
                    )}
                    {uploadedFile.status === 'pending' && (
                      <div className="text-xs text-gray-400">Pending</div>
                    )}
                  </div>
                  <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*,.pdf,.doc,.docx,.mp4,.mov"
          onChange={handleFileChange}
        />

        <div className="flex justify-between items-center flex-wrap gap-3 pt-2">
          <div className="flex items-center flex-wrap gap-3">
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox text-brand-blue rounded h-4 w-4 border-gray-300"
                checked={pinToFeed}
                onChange={(e) => setPinToFeed(e.target.checked)}
              />
              <span>Pin to top of public feed</span>
            </label>
            <button 
              onClick={() => {
                if (uploadedFiles.length > 0) {
                  setShowAttachmentPanel(!showAttachmentPanel);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                showAttachmentPanel || uploadedFiles.length > 0
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <FiPaperclip />
              <span className="text-sm">Attachments</span>
              {uploadedFiles.length > 0 && (
                <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">{uploadedFiles.length}</span>
              )}
            </button>
            <button 
              onClick={() => {
                if (locationData.text || showLocationInput) {
                  setShowLocationInput(!showLocationInput);
                } else {
                  setShowLocationInput(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                locationData.text 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-400 hover:text-brand-blue hover:bg-blue-50'
              }`}
            >
              <FiMapPin />
              <span className="text-sm">Location</span>
            </button>
          </div>
          <button 
            onClick={handlePostAnnouncement}
            disabled={isUploading}
            className="bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-8 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:shadow-lg"
          >
            {isUploading ? (
              <>
                <span className="animate-spin">⟳</span>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <FiVolume2 />
                <span>Post Announcement</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-200 text-gray-700 pl-4 pr-10 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All Categories">All Categories</option>
                <option value="Alert">Alert</option>
                <option value="Info">Info</option>
                <option value="Update">Update</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-200 text-gray-700 pl-4 pr-10 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="Pinned">Pinned</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
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
                <th className="px-6 py-4 font-bold tracking-wider">Title</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Date</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Category</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Location</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Attachments</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAnnouncements.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {row.attachments && row.attachments.length > 0 ? (
                        <img 
                          src={row.attachments[0].url} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover border-2 border-brand-blue"
                        />
                      ) : (
                        <img src={adminDashboard} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-200" />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{row.title}</p>
                        <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">{row.detail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="font-bold text-gray-900">{row.date}</p>
                    <p className="text-xs text-brand-blue font-medium">{row.time}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={row.category} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.location?.text ? (
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                        <FiMapPin className="text-brand-blue" />
                        <span className="truncate max-w-[100px]">{row.location.text}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.attachments && row.attachments.length > 0 ? (
                      <div className="flex items-center justify-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                        <FiPaperclip />
                        <span>{row.attachments.length}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openViewModal(row)}
                        className="text-brand-blue hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <FiEye />
                        <span className="text-sm">View</span>
                      </button>
                      <button 
                        onClick={() => openEditModal(row)}
                        className="text-green-600 hover:text-green-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                        title="Edit"
                      >
                        <FiEdit />
                        <span className="text-sm">Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteAnnouncement(row.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FiTrash />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentAnnouncements.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="flex flex-col items-center">
                      <FiVolume2 className="text-4xl text-gray-300 mb-2" />
                      <p>No announcements found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or create a new announcement</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {filteredAnnouncements.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Total:</span>
                <span className="font-bold text-gray-700">{filteredAnnouncements.length}</span>
                <span>announcements</span>
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
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
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
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
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

      {showViewModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">Announcement Details</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEditModal(selectedAnnouncement)}
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
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge status={selectedAnnouncement.category} />
                <StatusBadge status={selectedAnnouncement.status} />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{selectedAnnouncement.title}</h2>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{selectedAnnouncement.date}</span>
                <span>•</span>
                <span>{selectedAnnouncement.time}</span>
              </div>
              
              {selectedAnnouncement.location?.text && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiMapPin className="text-blue-600 text-xs" />
                    </div>
                    Location Tagged
                  </h4>
                  <p className="font-medium text-gray-800">{selectedAnnouncement.location.text}</p>
                </div>
              )}
              
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">{selectedAnnouncement.detail}</p>
              
              {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiPaperclip className="text-purple-600 text-xs" />
                    </div>
                    Attachments ({selectedAnnouncement.attachments.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedAnnouncement.attachments.map((att, idx) => (
                      <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm group">
                        {att.format && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(att.format.toLowerCase()) ? (
                          <div className="relative">
                            <img 
                              src={att.url} 
                              alt={att.filename}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <a 
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                                title="View full size"
                              >
                                <FiExternalLink className="text-gray-700" />
                              </a>
                              <a 
                                href={att.url}
                                download={att.filename}
                                className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                                title="Download"
                              >
                                <FiDownload className="text-gray-700" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 flex items-center justify-center bg-gray-50">
                            {getFileIcon(att.filename)}
                          </div>
                        )}
                        <div className="p-2.5">
                          <p className="text-sm font-medium text-gray-800 truncate">{att.filename}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{att.format?.toUpperCase()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleDeleteAnnouncement(selectedAnnouncement.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash />
                  <span>Delete Announcement</span>
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
      )}

      {showEditModal && editingAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Edit Announcement</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="text-2xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none text-sm"
                  value={editingAnnouncement.detail}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, detail: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    value={editingAnnouncement.category}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, category: e.target.value as 'Alert' | 'Info' | 'Update' })}
                  >
                    <option value="Alert">Alert</option>
                    <option value="Info">Info</option>
                    <option value="Update">Update</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Status</label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    value={editingAnnouncement.status}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, status: e.target.value as 'Pinned' | 'Active' | 'Archived' })}
                  >
                    <option value="Pinned">Pinned</option>
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateAnnouncement}
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

export default Announcements;
