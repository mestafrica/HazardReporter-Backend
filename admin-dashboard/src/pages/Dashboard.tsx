import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import { FiHome, FiUsers, FiAlertOctagon, FiPercent, FiPaperclip, FiMapPin, FiMap, FiVolume2, FiX, FiImage, FiFileText, FiFile, FiVideo, FiUpload, FiCheck, FiAlertCircle, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import ghMap from "../assets/images/map_GH.png";
import { useDashboard, LocationData, Attachment } from "../context/DashboardContext";
import { announcementApi } from "../services/announcementApi";

interface UploadedFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  url?: string;
  publicId?: string;
}

const Dashboard: React.FC = () => {
  const { reports, addReport, addAnnouncement } = useDashboard();
  
  const [announcementText, setAnnouncementText] = useState("");
  const [pinToTop, setPinToTop] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationData, setLocationData] = useState<LocationData>({ text: "" });
  const [showAttachmentPanel, setShowAttachmentPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return <FiImage className="text-green-500" />;
    if (ext === 'pdf') return <FiFileText className="text-red-500" />;
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) return <FiVideo className="text-purple-500" />;
    return <FiFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const simulateUploadProgress = (index: number) => {
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

  const uploadFilesToCloudinary = async () => {
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
    
    for (let i = 0; i < pendingFiles.length; i++) {
      const originalIndex = uploadedFiles.findIndex(f => f.file === pendingFiles[i].file && f.status === 'pending');
      if (originalIndex !== -1) {
        await simulateUploadProgress(originalIndex);
      }
    }
  };

  const handlePostAlert = async () => {
    if (!announcementText.trim()) {
      toast.error("Please enter a message to post.");
      return;
    }

    setIsUploading(true);
    
    try {
      const announcementTitle = "Quick Alert: " + announcementText.substring(0, 30) + (announcementText.length > 30 ? "..." : "");
      
      let uploadedAttachments: Attachment[] = [];
      
      if (uploadedFiles.length > 0) {
        await uploadFilesToCloudinary();
        
        try {
          const response = await announcementApi.createAnnouncement(
            {
              title: announcementTitle,
              detail: announcementText,
              category: "Alert",
              status: pinToTop ? "Pinned" : "Active",
              pinToFeed: pinToTop,
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
        title: announcementTitle,
        detail: announcementText,
        category: "alert",
        status: pinToTop ? "Pinned" : "Active",
        location: locationData.text ? locationData : undefined,
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined
      });

      const firstAttachmentUrl = uploadedAttachments.length > 0 ? uploadedAttachments[0].url : undefined;
      const attachmentNames = uploadedAttachments.length > 0 
        ? uploadedAttachments.map(a => a.filename).join(', ')
        : undefined;
      
      addReport({
        title: announcementText.substring(0, 40) + (announcementText.length > 40 ? "..." : ""),
        location: locationData.text || "Global",
        name: "Admin System",
        status: "Confirmed",
        category: "Alert",
        reportType: 'announcement',
        attachmentName: attachmentNames,
        attachmentUrl: firstAttachmentUrl,
        locationData: locationData.text ? locationData : undefined,
        announcementId: newAnnouncement?.id
      });

      toast.success("Alert posted successfully with attachments!");
      resetForm();
    } catch (error) {
      console.error('Error posting alert:', error);
      toast.error("Failed to post alert. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setAnnouncementText("");
    setUploadedFiles([]);
    setLocationData({ text: "" });
    setShowLocationInput(false);
    setShowAttachmentPanel(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin-dashboard/moderation" className="block hover:scale-[1.02] transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-xl">
          <MetricCard
            icon={<FiHome />}
            iconBgColor="#2563EB"
            iconColor="#FFFFFF"
            title="Total Reports"
            value="1,247"
            percentage="12.5%"
            isPositive={true}
          />
        </Link>
        <Link to="/admin-dashboard/users" className="block hover:scale-[1.02] transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-xl">
          <MetricCard
            icon={<FiUsers />}
            iconBgColor="#22C55E"
            iconColor="#FFFFFF"
            title="New Users"
            value="3,456"
            percentage="8.3%"
            isPositive={true}
          />
        </Link>
        <Link to="/admin-dashboard/moderation" className="block hover:scale-[1.02] transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-xl">
          <MetricCard
            icon={<FiAlertOctagon />}
            iconBgColor="#EF4444"
            iconColor="#FFFFFF"
            title="Active Hazards"
            value="789"
            percentage="15.7%"
            isPositive={true}
          />
        </Link>
        <Link to="/admin-dashboard/moderation" className="block hover:scale-[1.02] transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-xl">
          <MetricCard
            icon={<FiPercent />}
            iconBgColor="#F59E0B"
            iconColor="#FFFFFF"
            title="Pending Moderation"
            value="74.5%"
            percentage="2.1%"
            isPositive={true}
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <FiVolume2 className="text-brand-blue text-2xl" />
              <span>Global Announcement System</span>
            </h2>
            
            <textarea
              className="w-full bg-gray-50 border border-transparent rounded-lg p-4 h-40 focus:outline-none focus:ring-1 focus:ring-brand-blue resize-none mb-4"
              placeholder="Compose a flood alert or environmental warning..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
            />

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
                        <FiCheck className="text-[10px]" /> Uploaded to Cloud
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                    >
                      <FiUpload /> Add More
                    </button>
                    <button onClick={() => setShowAttachmentPanel(false)} className="text-purple-400 hover:text-purple-600">
                      <FiX />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
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
                        {uploadedFile.status === 'error' && (
                          <div className="flex items-center gap-1 text-red-600">
                            <FiAlertCircle />
                            <span className="text-xs">Failed</span>
                          </div>
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

            {uploadedFiles.length > 0 && !showAttachmentPanel && (
              <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiPaperclip className="text-purple-600" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-purple-700">{uploadedFiles.length} file(s) attached</span>
                    <p className="text-xs text-purple-500">
                      {uploadedFiles.filter(f => f.status === 'uploaded').length} uploaded • {uploadedFiles.filter(f => f.status !== 'uploaded').length} pending
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowAttachmentPanel(true)}
                    className="hover:bg-purple-100 p-1.5 rounded-lg transition-colors text-purple-600"
                  >
                    <FiEye />
                  </button>
                  <button 
                    onClick={() => { setUploadedFiles([]); }}
                    className="hover:bg-red-50 p-1.5 rounded-lg transition-colors text-red-400 hover:text-red-600"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            )}

                {showLocationInput && (
                  <div className="mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4 transition-all">
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

            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox text-brand-blue rounded h-4 w-4"
                    checked={pinToTop}
                    onChange={(e) => setPinToTop(e.target.checked)}
                  />
                  <span>Pin to top of public feed</span>
                </label>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.mp4,.mov"
                  onChange={handleFileChange} 
                />
                
                <button 
                  onClick={() => {
                    if (uploadedFiles.length > 0) {
                      setShowAttachmentPanel(!showAttachmentPanel);
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`transition-colors focus:outline-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                    uploadedFiles.length > 0 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  title="Attach Files"
                >
                  <FiPaperclip className="text-lg" />
                  <span className="text-sm">Attachments</span>
                  {uploadedFiles.length > 0 && (
                    <span className="text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full">{uploadedFiles.length}</span>
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
                  className={`transition-colors focus:outline-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                    locationData.text 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-400 hover:text-brand-blue hover:bg-blue-50'
                  }`}
                  title="Add Location"
                >
                  <FiMapPin className="text-lg" />
                  <span className="text-sm">Location</span>
                </button>
              </div>
              
              <button
                onClick={handlePostAlert}
                disabled={isUploading}
                className="bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-8 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:shadow-lg"
              >
                {isUploading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FiVolume2 />
                    <span>Post Alert</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Reports Moderation</h2>
              <Link to="/admin-dashboard/moderation" className="text-brand-blue text-sm font-medium hover:underline">
                View all reports &rarr;
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-400 uppercase bg-transparent border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Attachments</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 5).map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{row.date}</span>
                          <span className="text-xs text-gray-400">{row.time}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={row.category} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col max-w-[180px]">
                          <span className="flex items-center gap-1.5 text-gray-700">
                            <FiMapPin className="text-brand-blue text-xs shrink-0" />
                            <span className="truncate text-sm font-medium">{row.location}</span>
                          </span>
                          {row.locationData?.city && (
                            <span className="text-xs text-gray-400 ml-4 truncate">{row.locationData.city}, {row.locationData.country}</span>
                          )}
                          {row.locationData?.coordinates?.latitude && (
                            <span className="text-xs text-blue-500 ml-4 flex items-center gap-1">
                              <FiMap className="text-[10px]" /> 
                              {row.locationData.coordinates.latitude.toFixed(4)}, {row.locationData.coordinates.longitude.toFixed(4)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {row.attachmentUrl ? (
                          <div className="flex items-center gap-2">
                            <div className="relative group">
                              <img 
                                src={row.attachmentUrl} 
                                alt="" 
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FiEye className="text-white" />
                              </div>
                            </div>
                            {row.attachmentName && row.attachmentName.includes(',') && (
                              <span className="text-xs text-brand-blue bg-blue-50 px-2 py-1 rounded-full">
                                +{row.attachmentName.split(',').length - 1}
                              </span>
                            )}
                          </div>
                        ) : row.attachmentName ? (
                          <div className="flex items-center gap-1.5 text-sm text-brand-blue bg-blue-50 px-2 py-1 rounded-lg">
                            <FiPaperclip />
                            <span className="truncate max-w-[80px]">{row.attachmentName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No attachments</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-4">
                        <Link to="/admin-dashboard/moderation" className="text-brand-blue font-medium hover:underline cursor-pointer flex items-center gap-1">
                          <FiEye className="text-xs" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Hazard Distribution</h2>
          <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6 overflow-hidden relative">
            <img 
              src={ghMap} 
              alt="Hazard Distribution Map of Ghana" 
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Regional Hotspot</h3>
            <ul className="space-y-3 font-medium text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">High</span>
                <span className="text-red-500">Red</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Moderate</span>
                <span className="text-orange-400">Moderate</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Low</span>
                <span className="text-yellow-500">Low</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
