import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/ThemeAndBrandingContext';
import { compressAvatarImage } from '../utils/imageUtils';
import {
  User,
  Shield,
  Sun,
  Moon,
  Eye,
  Check,
  CheckCircle,
  Save,
  LogOut,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface UserProfilePageProps {
  onNavigate?: (page: string) => void;
}

// Preset avatars for missionary/prayer identification
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
];

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onNavigate }) => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { isDarkMode, setThemeMode } = useBranding();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [country, setCountry] = useState(currentUser?.country || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [saved, setSaved] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [themeNotif, setThemeNotif] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const handleThemeChange = (mode: 'dark' | 'light') => {
    setThemeMode(mode);
    const label = mode === 'light' ? 'High-Contrast Daylight Mode activated' : 'Deep Dark Night Mode activated';
    setThemeNotif(label);
    setTimeout(() => setThemeNotif(null), 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, or WebP).');
      return;
    }

    setIsProcessingPhoto(true);
    setPhotoMessage(null);

    try {
      // Compress to high quality compact format (< 40KB) to ensure reliable storage
      const optimizedDataUrl = await compressAvatarImage(file, 360, 360, 0.85);
      setAvatarUrl(optimizedDataUrl);
      
      // Immediately save to profile and persist
      updateProfile({
        avatarUrl: optimizedDataUrl
      });
      setSaved(true);
      setPhotoMessage('Profile photo uploaded and saved successfully.');
      setTimeout(() => {
        setSaved(false);
        setPhotoMessage(null);
      }, 3500);
    } catch (err) {
      console.error('Photo optimization failed:', err);
      alert('Could not process this image. Please try another image file.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleSelectPreset = (preset: string) => {
    setAvatarUrl(preset);
    updateProfile({ avatarUrl: preset });
    setSaved(true);
    setPhotoMessage('Avatar updated and saved.');
    setTimeout(() => {
      setSaved(false);
      setPhotoMessage(null);
    }, 2500);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    updateProfile({ avatarUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSaved(true);
    setPhotoMessage('Profile photo removed.');
    setTimeout(() => {
      setSaved(false);
      setPhotoMessage(null);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      bio,
      phoneNumber,
      country,
      avatarUrl
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header Profile Banner with Quick Sign Out */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-[#0d1322] text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-blue-800/40">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative group shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={currentUser.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg ring-4 ring-blue-500/30 border-2 border-blue-400"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg ring-4 ring-blue-500/20">
                {currentUser.fullName.charAt(0)}
              </div>
            )}
            <button
              type="button"
              disabled={isProcessingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md border border-white/20 transition-transform active:scale-95 disabled:opacity-50"
              title="Upload profile picture"
            >
              {isProcessingPhoto ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{currentUser.fullName}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1 truncate">
              {currentUser.email} · {currentUser.country || 'Global Station'}
            </p>
          </div>
        </div>

        {/* Quick Log Out Button in Header Banner */}
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="px-3.5 py-2 bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-200 hover:text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
          title="Sign out of Prayer Cloud"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Field Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Prayers Offered</div>
          <div className="text-3xl font-bold font-mono-data text-blue-600 dark:text-blue-400 mt-1">
            {currentUser.prayersOfferedCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Spiritual agreements recorded</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Credential Status</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Verified Worker</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Active Global Identifier</div>
        </div>
      </div>

      {/* Update confirmation banner */}
      {(saved || photoMessage) && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{photoMessage || 'Profile & identification details saved successfully.'}</span>
        </div>
      )}

      {/* Profile Picture Upload & Identification Box */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Profile Picture Identification</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload your personal photo for video rooms, chatrooms, and prayer requests.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar Preview */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-500/20 border-2 border-blue-500 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 gap-1">
                <ImageIcon className="w-6 h-6" />
                <span className="text-[10px] font-semibold">No Photo</span>
              </div>
            )}
            {isProcessingPhoto && (
              <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Upload and Preset Controls */}
          <div className="flex-1 space-y-3 w-full">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isProcessingPhoto}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isProcessingPhoto ? 'Optimizing Photo...' : 'Upload from Device'}</span>
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900 text-red-600 dark:text-red-300 font-semibold text-xs rounded-xl border border-red-200 dark:border-red-900/50 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {/* Quick Preset Selector */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                Or choose from missionary representative avatars:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      avatarUrl === preset ? 'border-blue-500 scale-105 shadow-md ring-2 ring-blue-400/30' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-10 h-10 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Profile Details</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage your identity, field location, and missional call.</p>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Country of Ministry / Station</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio / Missional Calling</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Describe your missional focus, target people group, or prayer watch."
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Field Display & Visual Theme Selector */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Field Display & Theme Mode</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Switch between daylight field mode for outdoor glare readability and deep dark mode for night vigils.
            </p>
          </div>
          {themeNotif && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-fadeIn">
              {themeNotif}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Daylight Mode Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-4 ${
              !isDarkMode
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                <Sun className="w-6 h-6" />
              </div>
              {!isDarkMode && (
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Daylight Field Mode</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Optimized high contrast for outdoor field use and daytime mission tasks.
              </p>
            </div>
          </button>

          {/* Deep Dark Mode Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-4 ${
              isDarkMode
                ? 'border-blue-600 bg-blue-950/20 ring-2 ring-blue-500/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Moon className="w-6 h-6" />
              </div>
              {isDarkMode && (
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Deep Dark Night Mode</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Low-light dark UI for overnight 24/7 prayer watches and battery longevity.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Account Session & Danger Zone */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-950/60 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Account Session</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign out from this device to protect your missionary credentials and prayer shields.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out / Log Out</span>
          </button>
        </div>
      </section>

      {/* Log Out Confirmation Dialog Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-3 text-amber-500 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Sign Out Confirmation</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to end your current session? You will need your login credentials to sign back in.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  if (onNavigate) onNavigate('home');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserProfilePage;
