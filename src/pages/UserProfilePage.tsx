import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/ThemeAndBrandingContext';
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
  AlertTriangle
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { isDarkMode, setThemeMode } = useBranding();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [country, setCountry] = useState(currentUser?.country || '');
  const [saved, setSaved] = useState(false);
  const [themeNotif, setThemeNotif] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!currentUser) return null;

  const handleThemeChange = (mode: 'dark' | 'light') => {
    setThemeMode(mode);
    const label = mode === 'light' ? 'High-Contrast Daylight Mode activated' : 'Deep Dark Night Mode activated';
    setThemeNotif(label);
    setTimeout(() => setThemeNotif(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      bio,
      phoneNumber,
      country
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header Profile Banner with Quick Sign Out */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-[#0d1322] text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-blue-800/40">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg ring-4 ring-blue-500/20 shrink-0">
            {currentUser.fullName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{currentUser.fullName}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1 truncate">
              {currentUser.email} · {currentUser.country}
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
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Full Missionary Hub Access</div>
        </div>
      </div>

      {/* Update confirmation banner */}
      {saved && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Profile details saved successfully.</span>
        </div>
      )}

      {/* Profile Details Form - At the Top of Theme Mode */}
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Country of Ministry / Residence</label>
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
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Field Display & Visual Theme Selector - Below Profile Details */}
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

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {isDarkMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>Deep Dark Active</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Daylight Field Active</span>
              </>
            )}
          </div>
        </div>

        {themeNotif && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{themeNotif}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* High-Contrast Light Mode (Sunlight Field Ops) */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
              !isDarkMode
                ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-500/10 shadow-md'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shadow-sm">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      Daylight Field Mode
                      {!isDarkMode && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
                          Active
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                      High-Contrast Sunlight UI
                    </span>
                  </div>
                </div>

                {!isDarkMode && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                High-contrast clean white and slate canvas with rich bold typography. Engineered for direct outdoor sunlight readability during missionary field operations.
              </p>
            </div>

            {/* Visual Micro Preview */}
            <div className="p-2.5 bg-white border border-slate-300 rounded-xl space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-900 border-b border-slate-200 pb-1">
                <span>Field Station Preview</span>
                <span className="text-blue-600 font-mono">100% Contrast</span>
              </div>
              <div className="h-2 bg-slate-200 rounded w-3/4"></div>
              <div className="h-2 bg-blue-600 rounded w-1/2"></div>
            </div>
          </button>

          {/* Deep Dark Mode (Night Vigils & Stealth) */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
              isDarkMode
                ? 'border-blue-500 bg-blue-950/20 ring-4 ring-blue-500/10 shadow-md'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center font-bold shadow-sm border border-slate-700">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      Deep Dark Mode
                      {isDarkMode && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
                          Active
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-blue-400 font-medium">
                      Night Ops & OLED Stealth
                    </span>
                  </div>
                </div>

                {isDarkMode && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Obsidian and deep slate palette with luminous accent layers. Optimized for midnight prayer vigils, low-light stealth environments, and minimal battery drain.
              </p>
            </div>

            {/* Visual Micro Preview */}
            <div className="p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-100 border-b border-slate-800 pb-1">
                <span>Vigil Console Preview</span>
                <span className="text-blue-400 font-mono">OLED Low-Power</span>
              </div>
              <div className="h-2 bg-slate-800 rounded w-3/4"></div>
              <div className="h-2 bg-blue-500 rounded w-1/2"></div>
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
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Confirm Sign Out</h3>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to log out of your Prayer Cloud session? You will need your email/username and password to sign back in.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserProfilePage;
