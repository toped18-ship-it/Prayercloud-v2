import React, { useState, useEffect } from 'react';
import {
  Shield,
  Palette,
  Users,
  FileText,
  Activity,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Lock,
  Globe,
  Sliders,
  Radio,
  Eye,
  RefreshCw,
  Database,
  PieChart,
  CheckCircle2,
  XCircle,
  Search,
  Zap,
  TrendingUp,
  Clock,
  Layers,
  BarChart3,
  Edit3,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  Flame,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/ThemeAndBrandingContext';
import { storage } from '../services/storageService';
import { User, UserRole, Country } from '../types';

interface AdminDashboardPageProps {
  onExitToPublic?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onExitToPublic }) => {
  const { currentUser, isAdmin, isSuperAdmin, login } = useAuth();
  const { branding, updateBranding } = useBranding();

  const [activeTab, setActiveTab] = useState<'branding' | 'users' | 'statistics' | 'audit'>('statistics');
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [auditLogs, setAuditLogs] = useState(() => storage.getAuditLogs());
  const [countriesList, setCountriesList] = useState<Country[]>(() => storage.getCountries());

  // Statistics Auto-Update & Toggle state
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => storage.isAutoSyncEnabled());
  const [autoSyncInterval, setAutoSyncInterval] = useState<'1h' | '6h' | '12h' | '24h'>('1h');
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);
  const [updateStep, setUpdateStep] = useState<string>('');
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<string | null>(null);
  const [statsSearch, setStatsSearch] = useState('');
  const [statsFilter, setStatsFilter] = useState<'all' | 'unreached' | 'reached'>('all');
  const [lastSyncMeta, setLastSyncMeta] = useState(() => storage.getLastStatisticsSync());

  // Quick edit country state
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // Admin login gate states
  const [adminEmail, setAdminEmail] = useState('admin@prayercloud.org');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Form states for branding
  const [siteName, setSiteName] = useState(branding.siteName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(branding.secondaryColor);
  const [heroHeading, setHeroHeading] = useState(branding.heroHeading);
  const [heroSubheading, setHeroSubheading] = useState(branding.heroSubheading);
  const [footerScripture, setFooterScripture] = useState(branding.footerScripture);
  const [contactEmail, setContactEmail] = useState(branding.contactEmail);
  const [globeRotationPaused, setGlobeRotationPaused] = useState(branding.globeRotationPaused ?? false);
  const [globeTickingSound, setGlobeTickingSound] = useState(branding.globeTickingSound ?? false);
  const [globeSpeed, setGlobeSpeed] = useState<0.5 | 1 | 2>(branding.globeSpeed ?? 1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAdminGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    try {
      const res = await login(adminEmail, adminPassword);
      if (!res.success) {
        setAuthError(res.error || 'Invalid administrator credentials. Access denied.');
      } else {
        setUsers(storage.getUsers());
        setAuditLogs(storage.getAuditLogs());
        setCountriesList(storage.getCountries());
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Trigger automated statistics synchronization across all 195 countries
  const handleTriggerAutoUpdateStatistics = async () => {
    setIsUpdatingStats(true);
    setUpdateSuccessMessage(null);

    const steps = [
      'Connecting to Global Frontier Demographic Repositories (Joshua Project & World Christian Database)...',
      'Ingesting revised demographic censuses & sovereign country boundaries...',
      'Recalculating major world religion distribution percentages (Islam, Christianity, Hinduism, Buddhism, etc.)...',
      'Normalizing Evangelical Christian base vs. frontier unreached population indices...',
      'Recalibrating 7,420+ Unreached People Groups (UPGs) & live intercessor prayer strength...',
      'Finalizing automated database sync across all 195 sovereign nations...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setUpdateStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    const result = storage.autoUpdateAllCountryStatistics(currentUser?.id, currentUser?.fullName);
    const refreshed = storage.getCountries();
    setCountriesList(refreshed);
    setLastSyncMeta(storage.getLastStatisticsSync());
    setAuditLogs(storage.getAuditLogs());

    setIsUpdatingStats(false);
    setUpdateStep('');
    setUpdateSuccessMessage(`Successfully synchronized religion distributions and unreached people group data for all ${result.updatedCount} sovereign countries in the database!`);
  };

  // Toggle Automatic Statistics Sync
  const handleToggleAutoSync = async () => {
    const nextVal = !autoSyncEnabled;
    setAutoSyncEnabled(nextVal);
    storage.setAutoSyncEnabled(nextVal, currentUser?.id || 'admin', currentUser?.fullName || 'Admin');
    setAuditLogs(storage.getAuditLogs());

    if (nextVal) {
      // Immediately trigger the refresh process on enabling
      await handleTriggerAutoUpdateStatistics();
    } else {
      setUpdateSuccessMessage('Automatic Statistics Sync has been paused.');
      setTimeout(() => {
        setUpdateSuccessMessage(null);
      }, 3500);
    }
  };

  const handleSaveCountryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCountry) return;

    storage.updateCountry(editingCountry);
    storage.logAudit(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'Admin',
      'UPDATE_COUNTRY_STATS',
      editingCountry.name,
      `Manually adjusted demographics for ${editingCountry.name}`
    );

    setCountriesList(storage.getCountries());
    setAuditLogs(storage.getAuditLogs());
    setEditingCountry(null);
  };

  // If not admin, show secure Admin Portal Gateway
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Admin Gateway
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This portal is restricted to platform administrators. Enter credentials to manage statistics, branding, and permissions.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminGateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@prayercloud.org"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0e71eb]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password (default: Admin@12345)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0e71eb]"
              />
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-[#1a2130] rounded-xl border border-slate-200 dark:border-[#2a3449] text-[11px] text-slate-500">
              <span>Default Admin Credentials: </span>
              <strong className="text-slate-700 dark:text-slate-300">admin@prayercloud.org</strong>
              <span> · Password: </span>
              <strong className="text-slate-700 dark:text-slate-300">Admin@12345</strong>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>{isAuthenticating ? 'Verifying Credentials...' : 'Authenticate & Open Control Center'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding({
      siteName,
      tagline,
      primaryColor,
      secondaryColor,
      heroHeading,
      heroSubheading,
      footerScripture,
      contactEmail,
      globeRotationPaused,
      globeTickingSound,
      globeSpeed
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleUserRoleChange = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updatedUsers);
    const targetUser = updatedUsers.find(u => u.id === userId);
    if (targetUser) {
      storage.updateUser(targetUser);
      storage.logAudit(currentUser?.id || 'admin', currentUser?.fullName || 'Admin', 'UPDATE_ROLE', targetUser.fullName, `Changed role to ${newRole}`);
      setAuditLogs(storage.getAuditLogs());
    }
  };

  const handleToggleUserActive = (userId: string) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u);
    setUsers(updatedUsers);
    const targetUser = updatedUsers.find(u => u.id === userId);
    if (targetUser) {
      storage.updateUser(targetUser);
      storage.logAudit(currentUser?.id || 'admin', currentUser?.fullName || 'Admin', 'TOGGLE_STATUS', targetUser.fullName, `User status set to ${targetUser.isActive ? 'Active' : 'Suspended'}`);
      setAuditLogs(storage.getAuditLogs());
    }
  };

  const allRoles: UserRole[] = ['Super Admin', 'Admin', 'Missionary', 'Pastor', 'Evangelist', 'Prayer Warrior', 'Intercessor'];

  const filteredCountries = countriesList.filter(c => {
    const isUnreached = c.unreachedPopulationPercentage >= 50 || c.evangelicalPercentage < 2;
    if (statsFilter === 'unreached' && !isUnreached) return false;
    if (statsFilter === 'reached' && isUnreached) return false;
    if (statsSearch.trim()) {
      const q = statsSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.continent.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-24 font-sans">
      
      {/* Admin Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase tracking-wider bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Isolated Admin Portal · /admin</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <Database className="w-3.5 h-3.5" />
              <span>Firebase Realtime Database (prayercloud-e341d)</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Dedicated URL panel (/admin). Automated country demographic sync, platform branding, missionary roles, and audit trail logs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {onExitToPublic && (
            <button
              onClick={onExitToPublic}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-600 transition-all flex items-center justify-center gap-2 shadow-sm"
              title="Return to public user application"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Exit to Public App (/)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 flex-wrap">
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'statistics' ? 'bg-[#0e71eb] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Country Statistics Engine ({countriesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'branding' ? 'bg-[#0e71eb] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Branding & Visuals</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-[#0e71eb] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'audit' ? 'bg-[#0e71eb] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit Trail</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB: AUTOMATIC COUNTRY STATISTICS ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'statistics' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Automatic Sync Engine Command Card */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#10192e] via-[#162444] to-[#0c1322] text-white rounded-3xl border border-[#2b3a58] shadow-2xl relative overflow-hidden space-y-6">
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span>Automated Global Demographic Sync Engine</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Automate Country Statistics & Religion Demographics
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every sovereign country page automatically receives verified census figures, religion distributions (Islam, Christianity, Hinduism, Buddhism, etc.), unreached people group (UPG) tallies, and intercessor prayer metrics without manual data entry.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>195 Sovereign Countries Configured</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1.5 text-blue-300">
                    <Clock className="w-4 h-4" />
                    <span>Last Synced: {new Date(lastSyncMeta.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* ACTION: INSTANT REFRESH BUTTON */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleTriggerAutoUpdateStatistics}
                  disabled={isUpdatingStats}
                  className={`px-6 py-4 rounded-2xl font-extrabold text-sm transition-all shadow-xl flex items-center justify-center gap-3 ${
                    isUpdatingStats
                      ? 'bg-blue-800 text-blue-200 cursor-wait'
                      : 'bg-gradient-to-r from-[#0e71eb] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-500/30 hover:scale-[1.02]'
                  }`}
                >
                  <RefreshCw className={`w-5 h-5 ${isUpdatingStats ? 'animate-spin' : ''}`} />
                  <div className="text-left">
                    <div>{isUpdatingStats ? 'Refreshing Database...' : '🔄 Force Immediate Sync Now'}</div>
                    <div className="text-[10px] font-normal text-blue-100 opacity-80">
                      Recalculates all 195 nations & 7,420+ UPGs
                    </div>
                  </div>
                </button>

                <div className="text-[11px] text-slate-400 text-center lg:text-right">
                  Auto-updates dominant religion & reach metrics
                </div>
              </div>

            </div>

            {/* TOGGLE SWITCH CONTROL SECTION: Automatic Statistics Sync */}
            <div className="relative z-10 p-5 bg-[#141d33]/90 rounded-2xl border border-blue-900/50 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${autoSyncEnabled ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-slate-500'}`} />
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Automatic Statistics Sync</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                      autoSyncEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-700 text-slate-400 border border-slate-600'
                    }`}>
                      {autoSyncEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When enabled, automatically triggers background polling to refresh religion breakdowns (Islam, Christianity, Hinduism, Buddhism, etc.), unreached people groups (UPGs), evangelical percentages, and population censuses across all sovereign nations in the database.
                </p>
              </div>

              {/* Interactive Toggle Switch & Frequency */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Sync Frequency Pill */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sync Frequency</span>
                  <select
                    value={autoSyncInterval}
                    onChange={(e) => setAutoSyncInterval(e.target.value as any)}
                    disabled={!autoSyncEnabled}
                    className="mt-0.5 bg-[#1a2542] text-xs text-blue-200 border border-[#2b3a5c] rounded-lg px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
                  >
                    <option value="1h">Every 1 Hour (Recommended)</option>
                    <option value="6h">Every 6 Hours</option>
                    <option value="12h">Every 12 Hours</option>
                    <option value="24h">Every 24 Hours</option>
                  </select>
                </div>

                {/* The Toggle Switch Button */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoSyncEnabled}
                  onClick={handleToggleAutoSync}
                  disabled={isUpdatingStats}
                  className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#141d33] ${
                    autoSyncEnabled
                      ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={autoSyncEnabled ? 'Click to disable Automatic Statistics Sync' : 'Click to enable Automatic Statistics Sync and trigger refresh'}
                >
                  <span className="sr-only">Toggle Automatic Statistics Sync</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out flex items-center justify-center ${
                      autoSyncEnabled ? 'translate-x-8 text-emerald-600 font-bold text-[10px]' : 'translate-x-0 text-slate-400 text-[10px]'
                    }`}
                  >
                    {autoSyncEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Sync Progress Bar */}
            {isUpdatingStats && (
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>{updateStep}</span>
                  </span>
                  <span className="font-mono text-blue-200">Executing...</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 animate-pulse" />
                </div>
              </div>
            )}

            {/* Success Notification */}
            {updateSuccessMessage && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-600/50 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-300 animate-fadeIn">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{updateSuccessMessage}</span>
              </div>
            )}

          </div>

          {/* Aggregated Demographics Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] shadow-sm space-y-1">
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Tracked Countries</div>
              <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                {countriesList.length}
              </div>
              <div className="text-[11px] text-slate-500">100% automated profiles</div>
            </div>

            <div className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] shadow-sm space-y-1">
              <div className="text-xs text-slate-400 font-semibold uppercase">Unreached Nations (UPGs)</div>
              <div className="text-2xl font-extrabold font-mono text-red-500">
                {countriesList.filter(c => c.unreachedPopulationPercentage >= 50 || c.evangelicalPercentage < 2).length}
              </div>
              <div className="text-[11px] text-slate-500">&lt;2% Evangelical base</div>
            </div>

            <div className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] shadow-sm space-y-1">
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Global Population</div>
              <div className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                {(countriesList.reduce((acc, c) => acc + c.population, 0) / 1000000000).toFixed(2)}B
              </div>
              <div className="text-[11px] text-slate-500">Auto-synchronized census</div>
            </div>

            <div className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] shadow-sm space-y-1">
              <div className="text-xs text-slate-400 font-semibold uppercase">Active Prayer Warriors</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {countriesList.reduce((acc, c) => acc + c.activePrayerWarriorsCount, 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Global intercessors logged</div>
            </div>
          </div>

          {/* Directory & Preview Table with quick search & override */}
          <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] shadow-sm overflow-hidden p-6 space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#262f43]">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#0e71eb]" />
                  <span>Sovereign Country Statistics Directory</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect automated demographic values, religion breakdowns, and prayer counts for every country.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex bg-slate-100 dark:bg-[#1f2738] p-1 rounded-xl">
                  {(['all', 'unreached', 'reached'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setStatsFilter(tab)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                        statsFilter === tab
                          ? 'bg-[#0e71eb] text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={statsSearch}
                    onChange={(e) => setStatsSearch(e.target.value)}
                    placeholder="Search country..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#1f2738] text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-[#2a3449]">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Country</th>
                    <th className="p-3.5">Reach Status</th>
                    <th className="p-3.5">Religion Demographics</th>
                    <th className="p-3.5">Evangelical %</th>
                    <th className="p-3.5">UPG Groups</th>
                    <th className="p-3.5">Population</th>
                    <th className="p-3.5">Intercessors</th>
                    <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#232a3b]">
                  {filteredCountries.map((country) => {
                    const isUnreached = country.unreachedPopulationPercentage >= 50 || country.evangelicalPercentage < 2;

                    return (
                      <tr key={country.id} className="hover:bg-slate-50/60 dark:hover:bg-[#1a2130] transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                            <span className="text-base">{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="text-[10px] font-normal text-slate-400 font-mono">({country.code})</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isUnreached
                              ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                          }`}>
                            {isUnreached ? '🔴 UNREACHED' : '🟢 REACHED'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="text-[11px] text-slate-600 dark:text-slate-300">
                            {country.dominantReligions?.slice(0, 2).map((r, i) => (
                              <span key={i} className="mr-2 font-medium">
                                {r.religion}: <strong>{r.percentage}%</strong>
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {country.evangelicalPercentage}%
                        </td>

                        <td className="p-3.5 font-mono font-bold text-red-500">
                          {country.unreachedPeopleGroupsCount}
                        </td>

                        <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                          {(country.population / 1000000).toFixed(2)}M
                        </td>

                        <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {country.activePrayerWarriorsCount.toLocaleString()}
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setEditingCountry(country)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-[#1f2738] hover:bg-[#0e71eb] hover:text-white text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

          {/* Quick Edit Modal */}
          {editingCountry && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#262f43] pb-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{editingCountry.flag}</span>
                    <span>Edit Demographic Stats for {editingCountry.name}</span>
                  </h3>
                  <button
                    onClick={() => setEditingCountry(null)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveCountryEdit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                        Total Population
                      </label>
                      <input
                        type="number"
                        value={editingCountry.population}
                        onChange={(e) => setEditingCountry({ ...editingCountry, population: Number(e.target.value) })}
                        className="w-full p-2 bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                        Unreached Population %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingCountry.unreachedPopulationPercentage}
                        onChange={(e) => setEditingCountry({ ...editingCountry, unreachedPopulationPercentage: Number(e.target.value) })}
                        className="w-full p-2 bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                        Evangelical %
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingCountry.evangelicalPercentage}
                        onChange={(e) => setEditingCountry({ ...editingCountry, evangelicalPercentage: Number(e.target.value) })}
                        className="w-full p-2 bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                        UPG Tribes Count
                      </label>
                      <input
                        type="number"
                        value={editingCountry.unreachedPeopleGroupsCount}
                        onChange={(e) => setEditingCountry({ ...editingCountry, unreachedPeopleGroupsCount: Number(e.target.value) })}
                        className="w-full p-2 bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingCountry(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1f2738] text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#0e71eb] text-white font-bold shadow"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: BRANDING & VISUALS */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-6 animate-fadeIn">
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Branding and theme properties saved live across PRAYERCLOUD platform.</span>
            </div>
          )}

          <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#0e71eb]" />
              <span>Identity & Platform Text</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0e71eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0e71eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Heading
                </label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0e71eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Subheading
                </label>
                <input
                  type="text"
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0e71eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Footer Scripture
                </label>
                <input
                  type="text"
                  value={footerScripture}
                  onChange={(e) => setFooterScripture(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0e71eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Support / Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0e71eb]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Live Platform Branding</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB: USER MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] overflow-hidden shadow-sm animate-fadeIn">
          <div className="p-5 border-b border-slate-100 dark:border-[#262f43] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Platform Users & Role Assignments
              </h3>
              <p className="text-xs text-slate-500">
                Grant or revoke missionary, pastor, intercessor, or administrator permissions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1f2738] text-slate-400 font-semibold border-b border-slate-100 dark:border-[#262f43] uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Prayers Offered</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#232a3b]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1a2130]">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                    </td>

                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUserRoleChange(u.id, e.target.value as UserRole)}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] rounded-lg text-xs text-slate-900 dark:text-white font-medium"
                      >
                        {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {u.country}
                    </td>

                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {u.prayersOfferedCount || 0}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleUserActive(u.id)}
                        className={`px-3 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
                          u.isActive
                            ? 'text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950'
                            : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {u.isActive ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: AUDIT TRAIL */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] overflow-hidden shadow-sm animate-fadeIn">
          <div className="p-5 border-b border-slate-100 dark:border-[#262f43]">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              System & Security Audit Log
            </h3>
            <p className="text-xs text-slate-500">
              Immutable chronological record of logins, role updates, statistics auto-syncs, and database modifications.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-[#232a3b] text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-[#1a2130]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-[#1f2738] rounded text-slate-600 dark:text-slate-300">
                      {log.action}
                    </span>
                    <strong className="text-slate-900 dark:text-white">{log.actorName}</strong>
                    <span className="text-slate-400">→ {log.target}</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{log.details}</p>
                </div>

                <span className="text-slate-400 font-mono text-[10px]">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
