import React, { useState, useRef } from "react";
import { FiMail, FiMessageSquare, FiBell, FiShield, FiSmartphone, FiMonitor, FiMoon, FiAlertTriangle, FiTrash2, FiCamera } from "react-icons/fi";
import toast from "react-hot-toast";
import adminDashboard from '../assets/images/adminDashboard.jpg';
import { useDashboard } from "../context/DashboardContext";

const Settings: React.FC = () => {
  const { userProfile, updateUserProfile } = useDashboard();
  
  const [profile, setProfile] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone
  });

  const [profileImage, setProfileImage] = useState<string | null>(userProfile.avatar || null);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const [security, setSecurity] = useState({
    twoFactor: true
  });

  const [appearance, setAppearance] = useState({
    darkMode: false,
    accentColor: "blue"
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
        updateUserProfile({ avatar: imageUrl });
        toast.success('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUserProfile({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      avatar: profileImage || undefined
    });
    toast.success("Settings saved successfully!");
  };

  const handleDeactivate = () => {
    if(window.confirm("Are you sure you want to deactivate your account?")) {
      toast.error("Account deactivated (simulated).");
    }
  };

  const handleDelete = () => {
    if(window.confirm("Warning: This cannot be undone! Are you absolutely sure?")) {
      toast.error("Account deleted (simulated).");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Profile Settings</h2>
        <p className="text-sm text-gray-500 mb-8 font-medium">Update your personal information and profile picture</p>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <img 
                src={profileImage || adminDashboard} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-50" 
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
              onChange={handleAvatarChange}
            />
            <button 
              onClick={() => avatarInputRef.current?.click()}
              className="px-4 py-2 border border-brand-blue text-brand-blue text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <FiCamera />
              Change Photo
            </button>
          </div>
          
          <div className="flex-1 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue" 
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
              <input 
                type="tel" 
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue" 
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Notifications</h2>
          <p className="text-sm text-gray-500 mb-8 font-medium">Choose how you want to receive notifications</p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-50 text-brand-blue rounded-lg mt-1"><FiMail /></div>
                <div>
                  <p className="font-bold text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500 font-medium">Receive updates via email</p>
                </div>
              </div>
              <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="email-toggle"
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-200 appearance-none cursor-pointer top-0 bottom-0 m-auto" 
                    checked={notifications.email}
                    onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  />
                  <label htmlFor="email-toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${notifications.email ? 'bg-brand-blue' : 'bg-gray-200'}`}></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-50 text-green-500 rounded-lg mt-1"><FiMessageSquare /></div>
                <div>
                  <p className="font-bold text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-500 font-medium">Get text messages for important updates</p>
                </div>
              </div>
              <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="sms-toggle"
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-200 appearance-none cursor-pointer top-0 bottom-0 m-auto" 
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                  />
                  <label htmlFor="sms-toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${notifications.sms ? 'bg-brand-blue' : 'bg-gray-200'}`}></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-50 text-purple-500 rounded-lg mt-1"><FiBell /></div>
                <div>
                  <p className="font-bold text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500 font-medium">Receive push notifications on your device</p>
                </div>
              </div>
              <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="push-toggle"
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-200 appearance-none cursor-pointer top-0 bottom-0 m-auto" 
                    checked={notifications.push}
                    onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  />
                  <label htmlFor="push-toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${notifications.push ? 'bg-brand-blue' : 'bg-gray-200'}`}></label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Privacy & Security</h2>
          <p className="text-sm text-gray-500 mb-8 font-medium">Manage your security settings and privacy preferences</p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-50 text-brand-blue rounded-lg mt-1"><FiShield /></div>
                <div>
                  <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 font-medium">Add an extra layer of security to your account</p>
                </div>
              </div>
              <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="2fa-toggle"
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-200 appearance-none cursor-pointer top-0 bottom-0 m-auto" 
                    checked={security.twoFactor}
                    onChange={(e) => setSecurity({...security, twoFactor: e.target.checked})}
                  />
                  <label htmlFor="2fa-toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${security.twoFactor ? 'bg-brand-blue' : 'bg-gray-200'}`}></label>
              </div>
            </div>

            <div className="mt-8">
              <p className="font-bold text-gray-900 mb-4">Active Sessions</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                   <div className="flex items-center space-x-3">
                     <FiMonitor className="text-brand-blue text-xl" />
                     <div>
                       <p className="text-sm font-bold text-gray-900">Windows PC - Chrome</p>
                       <p className="text-xs text-gray-500 font-medium">Accra, GH • Active now</p>
                     </div>
                   </div>
                   <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded text-center">Current</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                   <div className="flex items-center space-x-3">
                     <FiSmartphone className="text-gray-400 text-xl" />
                     <div>
                       <p className="text-sm font-bold text-gray-900">iPhone 14 Pro - Safari</p>
                       <p className="text-xs text-gray-500 font-medium">Kumasi, GH • 2 hours ago</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => toast.success("Session revoked")}
                     className="text-xs font-semibold text-red-600 hover:text-red-800"
                   >
                     Revoke
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Appearance</h2>
          <p className="text-sm text-gray-500 mb-8 font-medium">Customize how Gh-Hazard looks for you</p>
          
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gray-900 text-white rounded-lg mt-1"><FiMoon /></div>
              <div>
                <p className="font-bold text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-500 font-medium">Switch between light and dark themes</p>
              </div>
            </div>
            <div className="relative inline-block w-10 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="dark-toggle"
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-200 appearance-none cursor-pointer top-0 bottom-0 m-auto" 
                  checked={appearance.darkMode}
                  onChange={(e) => setAppearance({...appearance, darkMode: e.target.checked})}
                />
                <label htmlFor="dark-toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${appearance.darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}></label>
            </div>
          </div>

          <div>
             <p className="font-bold text-gray-900 mb-4">Accent Color</p>
             <div className="flex space-x-3">
               <button 
                 onClick={() => setAppearance({...appearance, accentColor: 'blue'})}
                 className={`w-8 h-8 rounded bg-brand-blue outline-none transition-all ${appearance.accentColor === 'blue' ? 'ring-2 ring-offset-2 ring-brand-blue' : 'hover:ring-2 ring-offset-2 ring-brand-blue/50'}`}
               />
               <button 
                 onClick={() => setAppearance({...appearance, accentColor: 'green'})}
                 className={`w-8 h-8 rounded bg-green-500 outline-none transition-all ${appearance.accentColor === 'green' ? 'ring-2 ring-offset-2 ring-green-500' : 'hover:ring-2 ring-offset-2 ring-green-500/50'}`}
               />
               <button 
                 onClick={() => setAppearance({...appearance, accentColor: 'purple'})}
                 className={`w-8 h-8 rounded bg-purple-500 outline-none transition-all ${appearance.accentColor === 'purple' ? 'ring-2 ring-offset-2 ring-purple-500' : 'hover:ring-2 ring-offset-2 ring-purple-500/50'}`}
               />
               <button 
                 onClick={() => setAppearance({...appearance, accentColor: 'red'})}
                 className={`w-8 h-8 rounded bg-red-500 outline-none transition-all ${appearance.accentColor === 'red' ? 'ring-2 ring-offset-2 ring-red-500' : 'hover:ring-2 ring-offset-2 ring-red-500/50'}`}
               />
             </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Account Management</h2>
          <p className="text-sm text-gray-500 mb-8 font-medium">Manage your account status and data</p>
          
          <div className="space-y-4">
             <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
               <div className="flex items-start space-x-3">
                 <FiAlertTriangle className="text-orange-500 text-xl mt-0.5" />
                 <div>
                   <p className="text-sm font-bold text-gray-900">Deactivate Account</p>
                   <p className="text-xs text-gray-600 font-medium mt-1 mb-3">Temporarily disable your account. You can reactivate it anytime by logging back in.</p>
                   <button 
                     onClick={handleDeactivate}
                     className="px-4 py-1.5 border border-orange-300 text-orange-700 bg-white text-xs font-bold rounded hover:bg-orange-50 transition-colors"
                   >
                     Deactivate Account
                   </button>
                 </div>
               </div>
             </div>

             <div className="p-4 rounded-lg bg-red-50 border border-red-100">
               <div className="flex items-start space-x-3">
                 <FiTrash2 className="text-red-500 text-xl mt-0.5" />
                 <div>
                   <p className="text-sm font-bold text-gray-900">Delete Account</p>
                   <p className="text-xs text-gray-600 font-medium mt-1 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                   <button 
                     onClick={handleDelete}
                     className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition-colors"
                   >
                     Delete Account
                   </button>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-gray-100 p-4 px-8 flex justify-end space-x-4">
        <button 
          className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
          onClick={() => {
            if(window.confirm("Discard changes?")) {
              toast('Changes discarded', { icon: '🔄' });
            }
          }}
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          className="px-6 py-2 bg-brand-blue text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
