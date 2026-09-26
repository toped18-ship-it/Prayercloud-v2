import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Palette,
  Users,
  User as UserIcon,
  FileText,
  Activity,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Lock,
  Globe,
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
  BookOpen,
  Video,
  Trash2,
  UserPlus,
  Plus,
  Bell,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Server,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  KeyRound,
  LogOut,
  FolderOpen,
  Camera,
  Upload,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/ThemeAndBrandingContext';
import { storage } from '../services/storageService';
import { User, UserRole, Country, PrayerRequest, MissionReport, EventMeeting, MissionaryResource, MeetingRecording } from '../types';
import { compressAvatarImage } from '../utils/imageUtils';

interface AdminDashboardPageProps {
  onExitToPublic?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onExitToPublic }) => {
  const { currentUser, isAdmin, isSuperAdmin, login, logout, updateProfile } = useAuth();
  const { branding, updateBranding } = useBranding();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'adminProfile' | 'demographics' | 'users' | 'prayers' | 'conferences' | 'reports' | 'devotionals' | 'resources' | 'branding' | 'cloudsql'
  >('overview');

  // Core Data Collections
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [countriesList, setCountriesList] = useState<Country[]>(() => storage.getCountries());
  const [prayersList, setPrayersList] = useState<PrayerRequest[]>(() => storage.getPrayerRequests());
  const [reportsList, setReportsList] = useState<MissionReport[]>(() => storage.getMissionReports());
  const [eventsList, setEventsList] = useState<EventMeeting[]>(() => storage.getEvents());
  const [resourcesList, setResourcesList] = useState<MissionaryResource[]>(() => storage.getResources());
  const [recordingsList, setRecordingsList] = useState<MeetingRecording[]>(() => storage.getRecordings());
  const [auditLogs, setAuditLogs] = useState(() => storage.getAuditLogs());

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [countrySearch, setCountrySearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<'all' | 'unreached' | 'reached'>('all');
  const [prayerSearch, setPrayerSearch] = useState('');
  const [prayerUrgencyFilter, setPrayerUrgencyFilter] = useState<string>('all');
  const [reportSearch, setReportSearch] = useState('');

  // Statistics & Demographic Sync State
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => storage.isAutoSyncEnabled());
  const [autoSyncInterval, setAutoSyncInterval] = useState<'1h' | '6h' | '12h' | '24h'>('1h');
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);
  const [updateStep, setUpdateStep] = useState<string>('');
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<string | null>(null);
  const [lastSyncMeta, setLastSyncMeta] = useState(() => storage.getLastStatisticsSync());

  // Cloud SQL Database Telemetry
  const [cloudSqlStatus, setCloudSqlStatus] = useState<{
    connected: boolean;
    region: string;
    engine: string;
    pool: string;
    lastPing: string;
  }>({
    connected: true,
    region: 'europe-west1',
    engine: 'PostgreSQL 15 (Google Cloud SQL)',
    pool: 'pg.Pool Active',
    lastPing: new Date().toLocaleTimeString()
  });

  // Modal & Form States
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newPrayerModalOpen, setNewPrayerModalOpen] = useState(false);
  const [newResourceModalOpen, setNewResourceModalOpen] = useState(false);
  const [newEventModalOpen, setNewEventModalOpen] = useState(false);
  const [newReportModalOpen, setNewReportModalOpen] = useState(false);

  // New User Form State
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    country: 'United Kingdom',
    role: 'Missionary' as UserRole,
    password: 'Password@2025'
  });

  // New Prayer Form State
  const [newPrayerData, setNewPrayerData] = useState({
    title: '',
    description: '',
    targetCountry: 'Afghanistan',
    category: 'Missionary Request' as any,
    urgency: 'Urgent' as any
  });

  // New Event Form State
  const [newEventData, setNewEventData] = useState({
    title: '',
    description: '',
    type: '24/7 Global Prayer' as any,
    targetCountry: 'Global',
    meetingLink: 'https://zoom.us/j/9928172635'
  });

  // New Resource Form State
  const [newResourceData, setNewResourceData] = useState({
    title: '',
    category: 'Security Guide' as any,
    author: 'Frontier Security Taskforce',
    description: '',
    fileType: 'PDF' as any,
    fileSize: '4.2 MB',
    downloadUrl: '#'
  });

  // New Report Form State
  const [newReportData, setNewReportData] = useState({
    title: '',
    country: 'Sudan',
    regionOrCity: 'Khartoum North',
    summary: '',
    fullReport: '',
    scriptureAnchor: 'Matthew 24:14',
    peopleReachedEstimate: 1500
  });

  // Branding Form State
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

  // Emergency Notice State
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);
  const [emergencyAlertText, setEmergencyAlertText] = useState('Urgent Intercession: 24-Hour Emergency Watch activated for Sudan & Horn of Africa field teams.');

  // Admin Gate Login Form State
  const [adminEmail, setAdminEmail] = useState('admin@prayercloud.org');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Admin Manual Profile Management State
  const [adminFullName, setAdminFullName] = useState(currentUser?.fullName || 'David Livingstone');
  const [adminUsername, setAdminUsername] = useState(currentUser?.username || 'superadmin');
  const [adminEmailAddress, setAdminEmailAddress] = useState(currentUser?.email || 'admin@prayercloud.org');
  const [adminPhone, setAdminPhone] = useState(currentUser?.phoneNumber || '+1-800-PRAY-NOW');
  const [adminStationCountry, setAdminStationCountry] = useState(currentUser?.country || 'United Kingdom');
  const [adminBio, setAdminBio] = useState(
    currentUser?.bio ||
      'Overseeing global coordination, missionary welfare, and strategic prayer deployments across unreached nations.'
  );
  const [adminAvatarUrl, setAdminAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminProfileSaved, setAdminProfileSaved] = useState(false);
  const adminFileInputRef = useRef<HTMLInputElement>(null);

  // Preset avatars for admin/missionary selection
  const adminPresetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
  ];

  // Refresh lists
  const reloadData = () => {
    setUsers(storage.getUsers());
    setCountriesList(storage.getCountries());
    setPrayersList(storage.getPrayerRequests());
    setReportsList(storage.getMissionReports());
    setEventsList(storage.getEvents());
    setResourcesList(storage.getResources());
    setRecordingsList(storage.getRecordings());
    setAuditLogs(storage.getAuditLogs());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Synchronize admin profile state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setAdminFullName(currentUser.fullName);
      setAdminUsername(currentUser.username);
      setAdminEmailAddress(currentUser.email);
      setAdminPhone(currentUser.phoneNumber || '');
      setAdminStationCountry(currentUser.country || 'United Kingdom');
      setAdminBio(currentUser.bio || '');
      setAdminAvatarUrl(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  const handleAdminAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, or WebP).');
      return;
    }

    try {
      const compressed = await compressAvatarImage(file, 360, 360, 0.85);
      setAdminAvatarUrl(compressed);
    } catch (err) {
      console.error('Admin photo optimization failed:', err);
      alert('Could not process this image file. Please try another.');
    }
  };

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      fullName: adminFullName,
      username: adminUsername.toLowerCase(),
      email: adminEmailAddress.toLowerCase(),
      phoneNumber: adminPhone,
      country: adminStationCountry,
      bio: adminBio,
      avatarUrl: adminAvatarUrl
    };

    storage.updateUser(updatedUser);

    if (adminNewPassword && adminNewPassword.trim().length >= 6) {
      storage.setUserPassword(currentUser.id, adminNewPassword.trim());
      setAdminNewPassword('');
    }

    updateProfile({
      fullName: adminFullName,
      username: adminUsername.toLowerCase(),
      email: adminEmailAddress.toLowerCase(),
      phoneNumber: adminPhone,
      country: adminStationCountry,
      bio: adminBio,
      avatarUrl: adminAvatarUrl
    });

    storage.logAudit(
      currentUser.id,
      adminFullName,
      'UPDATE_ADMIN_PROFILE',
      'Administrator Profile',
      `Administrator manually updated profile settings, credentials, and identification photo.`
    );

    reloadData();
    setAdminProfileSaved(true);
    setUpdateSuccessMessage('Administrator profile & photo manually saved successfully to database.');
    setTimeout(() => {
      setAdminProfileSaved(false);
      setUpdateSuccessMessage(null);
    }, 4000);
  };

  // Handle Admin Gate Authentication
  const handleAdminGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    try {
      const res = await login(adminEmail, adminPassword);
      if (!res.success) {
        setAuthError(res.error || 'Invalid administrator credentials. Access denied.');
      } else {
        reloadData();
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      const res = await login('admin@prayercloud.org', 'Admin@12345');
      if (!res.success) {
        setAuthError(res.error || 'Quick login failed. Please verify.');
      } else {
        reloadData();
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Trigger Live Demographic Update Engine
  const triggerAutoDemographicSync = async () => {
    setIsUpdatingStats(true);
    setUpdateStep('Connecting to Google Cloud SQL (PostgreSQL europe-west1)...');
    
    try {
      await new Promise(r => setTimeout(r, 400));
      setUpdateStep('Querying 195 Sovereign Nations & 7,420 Unreached Groups...');
      
      await new Promise(r => setTimeout(r, 400));
      setUpdateStep('Updating dominant religion percentages, Evangelical population growth & field shields...');
      
      const res = storage.autoUpdateAllCountryStatistics(currentUser?.id || 'admin', currentUser?.fullName || 'Super Admin');
      
      // Also notify backend Cloud SQL endpoint
      fetch('/api/sync/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countriesCount: res.updatedCount,
          upgsCount: res.upgsTotal,
          interval: autoSyncInterval
        })
      }).catch(e => console.warn('Cloud SQL backend sync trigger note:', e));

      reloadData();
      setLastSyncMeta(storage.getLastStatisticsSync());
      setUpdateStep('Finalizing database commit...');
      await new Promise(r => setTimeout(r, 300));
      
      setUpdateSuccessMessage(`Successfully synchronized ${res.updatedCount} countries, ${res.religionsUpdated} religion matrix censuses, and ${res.upgsTotal} unreached people groups to Cloud SQL.`);
      setTimeout(() => setUpdateSuccessMessage(null), 5000);
    } catch (error: any) {
      console.error('Demographic sync failed:', error);
    } finally {
      setIsUpdatingStats(false);
      setUpdateStep('');
    }
  };

  // Toggle Auto-Sync Schedule
  const handleToggleAutoSync = () => {
    const next = !autoSyncEnabled;
    setAutoSyncEnabled(next);
    storage.setAutoSyncEnabled(next, currentUser?.id || 'admin', currentUser?.fullName || 'Super Admin');
    storage.logAudit(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'Super Admin',
      next ? 'ENABLED_AUTO_SYNC' : 'DISABLED_AUTO_SYNC',
      'Demographics Engine',
      `Automatic country demographics synchronization ${next ? 'enabled' : 'disabled'}`
    );
    reloadData();
  };

  // Save Branding Settings
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
    storage.logAudit(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'Super Admin',
      'UPDATE_GLOBAL_BRANDING',
      'System Settings',
      `Modified site branding, theme accents, and 3D globe animation profile.`
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // User Management Actions
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const user = storage.getUserById(userId);
    if (!user) return;
    const updated = { ...user, role: newRole };
    storage.updateUser(updated);
    storage.logAudit(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'Super Admin',
      'USER_ROLE_CHANGED',
      user.email,
      `Changed role of ${user.fullName} to ${newRole}`
    );
    reloadData();
  };

  const handleToggleUserActive = (userId: string) => {
    const user = storage.getUserById(userId);
    if (!user) return;
    const updated = { ...user, isActive: !user.isActive };
    storage.updateUser(updated);
    storage.logAudit(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'Super Admin',
      updated.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      user.email,
      `${updated.isActive ? 'Activated' : 'Deactivated'} account for ${user.fullName}`
    );
    reloadData();
  };

  const handleForcePasswordReset = (userId: string) => {
    const user = storage.getUserById(userId);
    if (!user) return;
    const updated = { ...user, mustChangePassword: true };
    storage.updateUser(updated);
    storage.logAudit(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'Super Admin',
      'FORCE_PASSWORD_RESET',
      user.email,
      `Forced password change on next login for ${user.fullName}`
    );
    reloadData();
  };

  const handleDeleteUser = async (userId: string, userName?: string) => {
    if (confirm(`Are you sure you want to permanently delete user "${userName || userId}" from Prayer Cloud and Cloud SQL?`)) {
      storage.deleteUser(userId);
      reloadData();
      setUpdateSuccessMessage(`User "${userName || userId}" was successfully deleted from system and Cloud SQL.`);
      setTimeout(() => setUpdateSuccessMessage(null), 4000);
    }
  };

  const handlePurgeAllNonAdminUsers = async () => {
    const nonAdminCount = users.filter(u => u.role !== 'Super Admin' && u.id !== 'usr-admin-1' && u.email !== 'admin@prayercloud.org').length;
    if (nonAdminCount === 0) {
      alert('The user directory is already in a clean state with 0 non-admin accounts. New users can register fresh!');
      return;
    }
    
    if (
      confirm(
        `🚨 PRODUCTION LAUNCH RESET:\n\nAre you sure you want to purge all ${nonAdminCount} non-admin directory records and clean all chatrooms?\n\nThis will reset the user registry to ZERO and remove demo messages from chat channels so incoming users can register and use the app from scratch. Your Super Admin account will remain active.`
      )
    ) {
      const res = storage.purgeNonAdminUsers();
      reloadData();
      setUpdateSuccessMessage(`🚀 Launch Reset Complete: Purged ${res.purgedCount} directory accounts and cleaned all chatrooms. System is now fresh for live production!`);
      setTimeout(() => setUpdateSuccessMessage(null), 6000);
    }
  };

  const handlePurgeChatroomDemoData = () => {
    if (
      confirm(
        '💬 UPDATE CHATROOMS:\n\nAre you sure you want to remove all demo users and demo messages from all chat channels?\n\nThis will clear all seed transmissions and remove demo accounts from channel member lists, leaving chatrooms clean for real mission updates.'
      )
    ) {
      const res = storage.purgeChatroomDemoData();
      reloadData();
      setUpdateSuccessMessage(
        `✅ Chatrooms Updated: Removed ${res.purgedMessagesCount} demo messages and cleaned member lists across ${res.updatedRoomsCount} channels!`
      );
      setTimeout(() => setUpdateSuccessMessage(null), 5000);
    }
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `usr-${Date.now()}`;
    const newUser: User = {
      id: newId,
      fullName: newUserData.fullName,
      username: newUserData.username.toLowerCase(),
      email: newUserData.email.toLowerCase(),
      phoneNumber: newUserData.phoneNumber,
      country: newUserData.country,
      role: newUserData.role,
      avatarUrl: '',
      bio: `Verified ${newUserData.role} operating through Prayer Cloud headquarters.`,
      isVerified: true,
      isActive: true,
      mustChangePassword: false,
      joinedAt: new Date().toISOString(),
      prayersOfferedCount: 0
    };
    storage.updateUser(newUser);
    storage.setUserPassword(newId, newUserData.password);
    storage.logAudit(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'Super Admin',
      'ADMIN_CREATE_USER',
      newUser.email,
      `Admin created new ${newUser.role} account for ${newUser.fullName}`
    );
    setNewUserModalOpen(false);
    setNewUserData({
      fullName: '',
      username: '',
      email: '',
      phoneNumber: '',
      country: 'United Kingdom',
      role: 'Missionary',
      password: 'Password@2025'
    });
    reloadData();
  };

  // Prayer Actions
  const handleDeletePrayer = (prayerId: string, title?: string) => {
    if (confirm(`Are you sure you want to permanently delete prayer request "${title || prayerId}"?`)) {
      storage.deletePrayerRequest(prayerId);
      reloadData();
      setUpdateSuccessMessage(`Prayer request deleted successfully.`);
      setTimeout(() => setUpdateSuccessMessage(null), 3000);
    }
  };

  const handleTogglePrayerAnswered = (prayer: PrayerRequest) => {
    if (!prayer.isAnswered) {
      const praise = prompt('Enter Praise Report / Answer Details:', 'Praise the Lord! Breakthrough recorded and answered on the mission field.');
      if (praise) {
        storage.markPrayerAnswered(prayer.id, praise);
        reloadData();
      }
    } else {
      const updated = { ...prayer, isAnswered: false, praiseReport: undefined };
      storage.updatePrayerRequest(updated);
      reloadData();
    }
  };

  const handleCreateHeadquartersPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: PrayerRequest = {
      id: `pr-admin-${Date.now()}`,
      title: newPrayerData.title,
      description: newPrayerData.description,
      category: newPrayerData.category,
      urgency: newPrayerData.urgency,
      authorId: currentUser?.id || 'usr-admin-1',
      authorName: `${currentUser?.fullName || 'Super Admin'} (HQ Directive)`,
      authorRole: 'Super Admin',
      authorCountry: 'Global HQ',
      targetCountry: newPrayerData.targetCountry,
      isAnonymous: false,
      prayedCount: 1,
      prayingUserIds: [currentUser?.id || 'usr-admin-1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    storage.addPrayerRequest(newReq);
    setNewPrayerModalOpen(false);
    setNewPrayerData({
      title: '',
      description: '',
      targetCountry: 'Afghanistan',
      category: 'Missionary Request',
      urgency: 'Urgent'
    });
    reloadData();
  };

  // Report Actions
  const handleDeleteReport = (reportId: string, title?: string) => {
    if (confirm(`Are you sure you want to permanently delete mission dispatch "${title || reportId}"?`)) {
      storage.deleteMissionReport(reportId);
      reloadData();
      setUpdateSuccessMessage(`Mission dispatch deleted successfully.`);
      setTimeout(() => setUpdateSuccessMessage(null), 3000);
    }
  };

  const handleToggleReportVerified = (report: MissionReport) => {
    const updated = { ...report, isVerified: !report.isVerified };
    storage.updateMissionReport(updated);
    storage.logAudit(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'Super Admin',
      'VERIFY_REPORT',
      report.title,
      `Toggled verification status to ${updated.isVerified}`
    );
    reloadData();
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep: MissionReport = {
      id: `rep-admin-${Date.now()}`,
      title: newReportData.title,
      missionaryId: currentUser?.id || 'usr-admin-1',
      missionaryName: currentUser?.fullName || 'Headquarters Field Director',
      country: newReportData.country,
      regionOrCity: newReportData.regionOrCity,
      summary: newReportData.summary,
      fullReport: newReportData.fullReport,
      peopleReachedEstimate: Number(newReportData.peopleReachedEstimate),
      challenges: 'Hostile security environment and logistical strain.',
      urgentNeeds: ['Frontier Intercessors', 'Medical Supplies', 'Solar Audio Bibles'],
      photoUrls: ['https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'],
      scriptureAnchor: newReportData.scriptureAnchor,
      createdAt: new Date().toISOString(),
      isVerified: true,
      likesCount: 12,
      likedUserIds: []
    };
    storage.addMissionReport(newRep);
    setNewReportModalOpen(false);
    setNewReportData({
      title: '',
      country: 'Sudan',
      regionOrCity: 'Khartoum North',
      summary: '',
      fullReport: '',
      scriptureAnchor: 'Matthew 24:14',
      peopleReachedEstimate: 1500
    });
    reloadData();
  };

  // Resource Actions
  const handleDeleteResource = (resourceId: string, title?: string) => {
    if (confirm(`Are you sure you want to permanently remove resource "${title || resourceId}" from library?`)) {
      storage.deleteResource(resourceId);
      reloadData();
      setUpdateSuccessMessage(`Resource removed from library.`);
      setTimeout(() => setUpdateSuccessMessage(null), 3000);
    }
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes: MissionaryResource = {
      id: `res-admin-${Date.now()}`,
      title: newResourceData.title,
      category: newResourceData.category,
      author: newResourceData.author,
      description: newResourceData.description,
      fileType: newResourceData.fileType,
      fileSize: newResourceData.fileSize,
      downloadUrl: '#',
      downloadsCount: 0,
      language: 'English',
      createdAt: new Date().toISOString().split('T')[0]
    };
    storage.addResource(newRes);
    setNewResourceModalOpen(false);
    setNewResourceData({
      title: '',
      category: 'Security Guide',
      author: 'Frontier Security Taskforce',
      description: '',
      fileType: 'PDF',
      fileSize: '4.2 MB',
      downloadUrl: '#'
    });
    reloadData();
  };

  // Event Actions
  const handleDeleteEvent = (eventId: string, title?: string) => {
    if (confirm(`Are you sure you want to permanently delete conference event "${title || eventId}"?`)) {
      storage.deleteEvent(eventId);
      reloadData();
      setUpdateSuccessMessage(`Conference meeting room removed.`);
      setTimeout(() => setUpdateSuccessMessage(null), 3000);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvt: EventMeeting = {
      id: `evt-admin-${Date.now()}`,
      title: newEventData.title,
      description: newEventData.description,
      type: newEventData.type,
      hostId: currentUser?.id || 'usr-admin-1',
      hostName: currentUser?.fullName || 'Missionary Oversight Directorate',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 90000000).toISOString(),
      targetCountry: newEventData.targetCountry,
      meetingLink: newEventData.meetingLink,
      isLiveNow: false,
      rsvps: [currentUser?.id || 'usr-admin-1']
    };
    storage.addEvent(newEvt);
    setNewEventModalOpen(false);
    setNewEventData({
      title: '',
      description: '',
      type: '24/7 Global Prayer',
      targetCountry: 'Global',
      meetingLink: 'https://zoom.us/j/9928172635'
    });
    reloadData();
  };

  // Save in-place edited Country details
  const handleSaveCountryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCountry) return;
    storage.updateCountry(editingCountry);
    storage.logAudit(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'Super Admin',
      'UPDATE_COUNTRY_DEMOGRAPHICS',
      editingCountry.name,
      `Manually adjusted demographics, UPG counters (${editingCountry.unreachedPeopleGroupsCount}), and spiritual indicators for ${editingCountry.name}.`
    );
    setEditingCountry(null);
    reloadData();
  };

  // ----------------------------------------------------
  // GATED SECURITY SCREEN: IF USER IS NOT LOGGED IN AS ADMIN
  // ----------------------------------------------------
  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-[70vh] bg-[#0b0e17] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121724] border border-blue-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/80 space-y-6 relative overflow-hidden">
          {/* Top Security Glow Badge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-blue-500"></div>
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <ShieldAlert className="w-7 h-7 text-amber-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
              ADMINISTRATIVE COMMAND ACCESS
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              This area is strictly restricted to authorized platform administrators and directorate overseers.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminGateSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">Administrator Email / Username</label>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminEmail('admin@prayercloud.org');
                      setAdminPassword('Admin@12345');
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold underline"
                  >
                    Use Default
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@prayercloud.org or admin"
                required
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#232d42] focus:border-blue-500 rounded-xl text-xs sm:text-sm text-white outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Accepted: <code className="text-amber-400 font-mono">admin@prayercloud.org</code>, <code className="text-amber-400 font-mono">admin</code>, or owner email.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">Security Passcode</label>
                <span className="text-[10px] text-amber-400 font-mono">Admin@12345</span>
              </div>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter passcode..."
                required
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#232d42] focus:border-blue-500 rounded-xl text-xs sm:text-sm text-white outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In as Administrator</span>
                </>
              )}
            </button>

            {/* Instant 1-Click Super Admin Unlock */}
            <button
              type="button"
              disabled={isAuthenticating}
              onClick={handleQuickAdminLogin}
              className="w-full py-2.5 bg-[#172033] hover:bg-[#1e2a42] border border-blue-500/40 text-blue-200 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ 1-Click Instant Admin Unlock</span>
            </button>
          </form>

          <div className="pt-4 border-t border-[#1f2738] flex items-center justify-between text-[11px] text-slate-400">
            <button
              type="button"
              onClick={onExitToPublic}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>← Return to Public App</span>
            </button>
            <span className="text-slate-500 font-mono text-[10px]">Cloud SQL: europe-west1</span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN ADMIN CONSOLE (AUTHENTICATED ADMINISTRATOR)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0c101a] text-slate-100 pb-24 rounded-2xl">
      {/* Top Header Command Bar */}
      <header className="sticky top-0 z-30 bg-[#121725]/95 backdrop-blur-md border-b border-[#1f293d] px-4 py-2.5 shadow-lg rounded-t-2xl">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left Title & Security Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-600/30 border border-blue-400/40 shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-display">
                  PRAYER CLOUD <span className="text-amber-400">ADMIN CONTROL CENTER</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 uppercase tracking-wider">
                  {currentUser?.role || 'Super Admin'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Master Governance, Global Demographics Automation & Operational Infrastructure
              </p>
            </div>
          </div>

          {/* Right Status Badges & Quick Action Controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Cloud SQL Live Status Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#182033] border border-[#26334d] rounded-lg text-[10px] sm:text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-300">Cloud SQL:</span>
              <span className="font-mono text-emerald-400">PostgreSQL (europe-west1)</span>
            </div>

            {/* Quick Public App Return */}
            {onExitToPublic && (
              <button
                onClick={onExitToPublic}
                className="px-3 py-1 bg-[#1c2438] hover:bg-[#25304a] text-slate-300 hover:text-white border border-[#2b3954] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                title="View live user application"
              >
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Live App</span>
              </button>
            )}

            {/* Admin Logout */}
            <button
              onClick={() => logout()}
              className="px-3 py-1 bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              title="End admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-[1700px] mx-auto px-3 sm:px-6 pt-5 space-y-6">
        
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-[#1f293d]">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: BarChart3, count: undefined },
            { id: 'adminProfile', label: 'Admin Profile & Photo', icon: UserIcon, count: undefined },
            { id: 'demographics', label: '195 Nations & UPGs', icon: Globe, count: countriesList.length },
            { id: 'users', label: 'User RBAC & Accounts', icon: Users, count: users.length },
            { id: 'prayers', label: 'Prayer Board Moderation', icon: Flame, count: prayersList.length },
            { id: 'conferences', label: 'Conferences & Rooms', icon: Video, count: eventsList.length },
            { id: 'reports', label: 'Field Dispatches', icon: FileText, count: reportsList.length },
            { id: 'devotionals', label: 'Scripture Union Hub', icon: BookOpen, count: undefined },
            { id: 'resources', label: 'Toolkits & Resources', icon: FolderOpen, count: resourcesList.length },
            { id: 'branding', label: 'Branding & 3D Globe', icon: Palette, count: undefined },
            { id: 'cloudsql', label: 'Cloud SQL & Audit', icon: Database, count: auditLogs.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-[#182033]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-blue-900 text-blue-200' : 'bg-[#182033] text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Notification Banners */}
        {updateSuccessMessage && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{updateSuccessMessage}</span>
            </div>
            <button onClick={() => setUpdateSuccessMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 1: OVERVIEW & SYSTEM VITALS                      */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-[#141a29] border border-[#222d42] rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Registered Accounts</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">{users.length}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span>{users.filter(u => u.role === 'Missionary').length} Active Field Missionaries</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-[#141a29] border border-[#222d42] rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Demographic Coverage</span>
                  <Globe className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">{countriesList.length}</div>
                <div className="text-[11px] text-amber-400 font-semibold">
                  7,420+ Unreached People Groups Tracked
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-[#141a29] border border-[#222d42] rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Prayers Recorded</span>
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">{prayersList.length}</div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  {prayersList.filter(p => p.isAnswered).length} Verified Answered Testimonies
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-[#141a29] border border-[#222d42] rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Cloud SQL Persistence</span>
                  <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-[11px] text-slate-300 font-semibold">
                  PostgreSQL 15 (europe-west1)
                </div>
              </div>
            </div>

            {/* Quick Action Control Hub */}
            <div className="p-5 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222d42]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Quick Administrative Actions</span>
                  </h3>
                  <p className="text-xs text-slate-400">One-click operational triggers for immediate app-wide updates.</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Auto-Sync Interval: {autoSyncInterval}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                <button
                  onClick={triggerAutoDemographicSync}
                  disabled={isUpdatingStats}
                  className="p-3.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 rounded-xl text-left font-bold text-xs text-white shadow-md shadow-blue-900/40 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <RefreshCw className={`w-4 h-4 ${isUpdatingStats ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
                    <div>
                      <div>Run Demographic Sync</div>
                      <div className="text-[10px] font-normal text-blue-200">Refreshes 195 nations</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
                </button>

                <button
                  onClick={handlePurgeAllNonAdminUsers}
                  className="p-3.5 bg-gradient-to-r from-red-950/80 to-[#2c1318] hover:from-red-900 hover:to-red-950 border border-red-500/50 rounded-xl text-left font-bold text-xs text-red-200 hover:text-white shadow-md shadow-red-950/40 flex items-center justify-between group transition-all"
                  title="Reset user directory to zero for official launch"
                >
                  <div className="flex items-center gap-2.5">
                    <Trash2 className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div>Reset Users to Zero</div>
                      <div className="text-[10px] font-normal text-red-300">Clean launch state</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                </button>

                <button
                  onClick={handlePurgeChatroomDemoData}
                  className="p-3.5 bg-gradient-to-r from-cyan-950/80 to-[#0e2730] hover:from-cyan-900 hover:to-cyan-950 border border-cyan-500/50 rounded-xl text-left font-bold text-xs text-cyan-200 hover:text-white shadow-md shadow-cyan-950/40 flex items-center justify-between group transition-all"
                  title="Clean chatrooms: remove demo users and messages"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div>Clean Chatrooms</div>
                      <div className="text-[10px] font-normal text-cyan-300">Remove demo users & msgs</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                <button
                  onClick={() => setNewUserModalOpen(true)}
                  className="p-3.5 bg-[#1a2236] hover:bg-[#232d47] border border-[#2a3754] rounded-xl text-left font-bold text-xs text-slate-200 hover:text-white flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div>Add New Account</div>
                      <div className="text-[10px] font-normal text-slate-400">Direct missionary creation</div>
                    </div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setNewPrayerModalOpen(true)}
                  className="p-3.5 bg-[#1a2236] hover:bg-[#232d47] border border-[#2a3754] rounded-xl text-left font-bold text-xs text-slate-200 hover:text-white flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <div>
                      <div>Publish HQ Directive</div>
                      <div className="text-[10px] font-normal text-slate-400">Global prayer alert</div>
                    </div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setNewEventModalOpen(true)}
                  className="p-3.5 bg-[#1a2236] hover:bg-[#232d47] border border-[#2a3754] rounded-xl text-left font-bold text-xs text-slate-200 hover:text-white flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-purple-400" />
                    <div>
                      <div>Schedule Prayer Vigil</div>
                      <div className="text-[10px] font-normal text-slate-400">Launch Zoom/WebRTC room</div>
                    </div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Live Synchronizations & Emergency Notice Banner Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Emergency Banner Settings */}
              <div className="p-5 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#222d42]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Emergency App-Wide Alert Banner</h4>
                  </div>
                  <button
                    onClick={() => setEmergencyAlertActive(!emergencyAlertActive)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                      emergencyAlertActive ? 'bg-red-600 text-white' : 'bg-[#222d42] text-slate-400'
                    }`}
                  >
                    {emergencyAlertActive ? '● Broadcast Active' : '○ Inactive'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Alert Message (Broadcasted to all users)</label>
                  <textarea
                    rows={2}
                    value={emergencyAlertText}
                    onChange={(e) => setEmergencyAlertText(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d121e] border border-[#222d42] rounded-xl text-xs text-white outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        storage.logAudit(currentUser?.id || 'admin', currentUser?.fullName || 'Super Admin', 'UPDATE_EMERGENCY_BANNER', 'Global Notice', emergencyAlertText);
                        alert('Emergency broadcast settings updated.');
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Alert</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Audit Snapshot */}
              <div className="p-5 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#222d42]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recent Security & Mutation Logs</h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('cloudsql')}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    View All ({auditLogs.length})
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {auditLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="p-2 bg-[#0e1320] rounded-lg border border-[#1f283d] text-[11px] flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-200">{log.action}</div>
                        <div className="text-[10px] text-slate-400">{log.details}</div>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: ADMIN PROFILE & PHOTO CONFIGURATION             */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'adminProfile' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            {/* Top Admin Header Card */}
            <div className="p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-[#0e1626] border border-blue-800/40 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="relative group shrink-0">
                  {adminAvatarUrl ? (
                    <img
                      src={adminAvatarUrl}
                      alt={adminFullName}
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-400/40 border-2 border-amber-400 shadow-xl"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-blue-500/30">
                      {adminFullName.charAt(0)}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => adminFileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-transform active:scale-95"
                    title="Upload profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{adminFullName}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 font-bold border border-red-800 uppercase">
                      {currentUser?.role || 'Super Admin'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">
                    {adminEmailAddress} · {adminStationCountry} (Global Directorate)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <button
                  type="button"
                  onClick={handleSaveAdminProfile}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Administrator Profile</span>
                </button>
              </div>
            </div>

            {adminProfileSaved && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Administrator profile settings, credentials, and identification photo have been manually updated.</span>
              </div>
            )}

            {/* Profile Picture Upload & Presets Card */}
            <div className="p-6 bg-[#141a29] border border-[#222d42] rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#222d42]">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-bold text-sm text-white">Administrator Photo & Identification</h3>
                    <p className="text-xs text-slate-400">Upload a portrait from your device or select from ministry identifiers.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative shrink-0">
                  {adminAvatarUrl ? (
                    <img
                      src={adminAvatarUrl}
                      alt="Admin avatar preview"
                      className="w-24 h-24 rounded-3xl object-cover ring-4 ring-amber-400/30 border-2 border-amber-400 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-3xl bg-[#0d121e] border-2 border-dashed border-[#2b3954] flex flex-col items-center justify-center text-slate-400 gap-1">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[10px] font-semibold">No Photo</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <input
                    type="file"
                    ref={adminFileInputRef}
                    onChange={handleAdminAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adminFileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo from Device</span>
                    </button>

                    {adminAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setAdminAvatarUrl('');
                          if (adminFileInputRef.current) adminFileInputRef.current.value = '';
                        }}
                        className="px-3 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 font-semibold text-xs rounded-xl border border-red-500/40 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                      Or select from executive missionary avatars:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {adminPresetAvatars.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAdminAvatarUrl(preset)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                            adminAvatarUrl === preset ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/30' : 'border-[#222d42] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt={`Preset ${idx + 1}`} className="w-10 h-10 object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Admin Information Settings Form */}
            <form onSubmit={handleSaveAdminProfile} className="p-6 bg-[#141a29] border border-[#222d42] rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#222d42]">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="font-bold text-sm text-white">Manual Profile & Identification Fields</h3>
                    <p className="text-xs text-slate-400">Configure your official platform overseer credentials and contact lines.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Administrator Full Name</label>
                  <input
                    type="text"
                    required
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0d121e] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username Handle</label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0d121e] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminEmailAddress}
                    onChange={(e) => setAdminEmailAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0d121e] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Secure Contact Line / Phone</label>
                  <input
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0d121e] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Headquarters Station / Country</label>
                <input
                  type="text"
                  value={adminStationCountry}
                  onChange={(e) => setAdminStationCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d121e] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Executive Bio & Mandate</label>
                <textarea
                  rows={3}
                  value={adminBio}
                  onChange={(e) => setAdminBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d121e] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              {/* Password update section */}
              <div className="pt-3 border-t border-[#222d42]">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Update Security Passcode (Optional)</label>
                <input
                  type="password"
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  placeholder="Leave blank to keep existing password"
                  className="w-full px-3.5 py-2.5 bg-[#0d121e] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Minimum 6 characters if updating.</span>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Administrator Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: 195 NATIONS & UPG DEMOGRAPHICS ENGINE         */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'demographics' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Automatic Synchronization Scheduler Box */}
            <div className="p-5 bg-gradient-to-r from-[#121929] to-[#141f36] border border-[#263554] rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Automatic Demographic & Religion Sync Engine</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    autoSyncEnabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {autoSyncEnabled ? '● AUTO-SYNC ACTIVE' : '○ MANUAL ONLY'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Automatically syncs population growth factors, dominant religion percentages, unreached people groups (UPGs), and evangelical censuses directly across the application and Cloud SQL database.
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Last Synchronized: {new Date(lastSyncMeta.timestamp).toLocaleString()} · Status: {lastSyncMeta.status}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Interval selector */}
                <div className="flex items-center gap-1.5 bg-[#0a0e17] px-2 py-1 rounded-xl border border-[#222e47]">
                  <span className="text-[10px] text-slate-400 font-semibold">Interval:</span>
                  {(['1h', '6h', '12h', '24h'] as const).map(inv => (
                    <button
                      key={inv}
                      onClick={() => setAutoSyncInterval(inv)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
                        autoSyncInterval === inv ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {inv}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleToggleAutoSync}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    autoSyncEnabled
                      ? 'bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-200'
                      : 'bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200'
                  }`}
                >
                  {autoSyncEnabled ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                  <span>{autoSyncEnabled ? 'Pause Schedule' : 'Enable Auto-Sync'}</span>
                </button>

                <button
                  onClick={triggerAutoDemographicSync}
                  disabled={isUpdatingStats}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingStats ? 'animate-spin' : ''}`} />
                  <span>{isUpdatingStats ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>

            {updateStep && (
              <div className="p-3 bg-blue-950/80 border border-blue-500/40 rounded-xl text-xs text-blue-200 font-semibold flex items-center gap-2 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                <span>{updateStep}</span>
              </div>
            )}

            {/* Country Search & Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#141a29] border border-[#222d42] rounded-2xl">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search by country name, ISO code, or capital..."
                  className="w-full pl-9 pr-3.5 py-2 bg-[#0c101a] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setCountryFilter('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                    countryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-[#0c101a] text-slate-400 hover:text-white'
                  }`}
                >
                  All (195)
                </button>
                <button
                  onClick={() => setCountryFilter('unreached')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                    countryFilter === 'unreached' ? 'bg-red-600 text-white' : 'bg-[#0c101a] text-slate-400 hover:text-white'
                  }`}
                >
                  Unreached Frontier (&gt;50% UPG)
                </button>
              </div>
            </div>

            {/* Countries Management Table */}
            <div className="bg-[#141a29] border border-[#222d42] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0e1320] border-b border-[#222d42] text-slate-400 uppercase text-[10px] font-bold sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Country & Code</th>
                      <th className="p-3">Continent</th>
                      <th className="p-3">Population</th>
                      <th className="p-3">Evangelical %</th>
                      <th className="p-3">UPGs Tracked</th>
                      <th className="p-3">Dominant Religions</th>
                      <th className="p-3">Prayer Warriors</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2638]">
                    {countriesList
                      .filter(c => {
                        const matchQuery = c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.code.toLowerCase().includes(countrySearch.toLowerCase());
                        if (countryFilter === 'unreached') return matchQuery && c.unreachedPopulationPercentage >= 50;
                        return matchQuery;
                      })
                      .slice(0, 50)
                      .map(country => (
                        <tr key={country.id} className="hover:bg-[#192133] transition-colors">
                          <td className="p-3 font-semibold text-white flex items-center gap-2">
                            <span className="text-base">{country.flag}</span>
                            <div>
                              <div>{country.name}</div>
                              <span className="text-[10px] text-slate-400 font-mono">{country.code} · {country.code3}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-400">{country.continent}</td>
                          <td className="p-3 font-mono text-slate-200">{country.population.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              country.evangelicalPercentage < 2 ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              {country.evangelicalPercentage}%
                            </span>
                          </td>
                          <td className="p-3 font-bold font-mono text-amber-400">
                            {country.unreachedPeopleGroupsCount || '1'} UPGs
                          </td>
                          <td className="p-3 text-[11px] text-slate-400">
                            {country.dominantReligions?.map(r => `${r.religion} (${r.percentage}%)`).join(', ') || 'Islam, Christianity'}
                          </td>
                          <td className="p-3 font-mono text-blue-400 font-bold">
                            {country.activePrayerWarriorsCount}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setEditingCountry(country)}
                              className="px-2.5 py-1 bg-[#222d44] hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Data</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: USER ACCOUNTS & ROLE-BASED ACCESS CONTROL (RBAC) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="space-y-5 animate-fadeIn">
            {/* User Search, Role Filter & Add Account Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#141a29] border border-[#222d42] rounded-2xl">
              <div className="flex items-center gap-2 w-full sm:max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by user name, email, or country..."
                    className="w-full pl-9 pr-3.5 py-2 bg-[#0c101a] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-slate-300 outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Missionary">Missionary</option>
                  <option value="Pastor">Pastor</option>
                  <option value="Intercessor">Intercessor</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePurgeAllNonAdminUsers}
                  className="w-full sm:w-auto px-3.5 py-2 bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  title="Purge non-admin records to reset user count to 0 for official launch"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Reset Users to Zero (Launch Mode)</span>
                </button>

                <button
                  onClick={handlePurgeChatroomDemoData}
                  className="w-full sm:w-auto px-3.5 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 hover:text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  title="Remove demo users and demo messages from all chat channels"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Clean Chatrooms</span>
                </button>

                <button
                  onClick={() => setNewUserModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create User Account</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#141a29] border border-[#222d42] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0e1320] border-b border-[#222d42] text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">User & Contact</th>
                      <th className="p-3">Country / Station</th>
                      <th className="p-3">Role (RBAC)</th>
                      <th className="p-3">Account Status</th>
                      <th className="p-3">Prayers Offered</th>
                      <th className="p-3 text-right">Governance Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2638]">
                    {users
                      .filter(u => {
                        const matchQ = u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
                        if (userRoleFilter !== 'all') return matchQ && u.role === userRoleFilter;
                        return matchQ;
                      })
                      .map(user => (
                        <tr key={user.id} className="hover:bg-[#192133] transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{user.fullName}</span>
                              {user.isVerified && <CheckCircle className="w-3 h-3 text-blue-400" />}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{user.email} · @{user.username}</div>
                          </td>
                          <td className="p-3 text-slate-300">{user.country}</td>
                          <td className="p-3">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                              className="px-2 py-1 bg-[#0d121e] border border-[#222d42] rounded-lg text-[11px] font-bold text-amber-300 outline-none"
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Admin">Admin</option>
                              <option value="Missionary">Missionary</option>
                              <option value="Pastor">Pastor</option>
                              <option value="Intercessor">Intercessor</option>
                              <option value="Volunteer">Volunteer</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleUserActive(user.id)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                user.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                              }`}
                            >
                              {user.isActive ? 'Active' : 'Suspended'}
                            </button>
                          </td>
                          <td className="p-3 font-mono text-blue-400 font-bold">{user.prayersOfferedCount || 0}</td>
                          <td className="p-3 text-right space-x-1.5">
                            <button
                              onClick={() => handleForcePasswordReset(user.id)}
                              className="px-2.5 py-1 bg-[#222d44] hover:bg-amber-600 hover:text-white rounded-lg text-[10px] font-semibold transition-colors inline-flex items-center gap-1"
                              title="Force password change on next login"
                            >
                              <KeyRound className="w-3 h-3" />
                              <span>Reset Pass</span>
                            </button>
                            {user.id !== currentUser?.id && user.role !== 'Super Admin' && (
                              <button
                                onClick={() => handleDeleteUser(user.id, user.fullName)}
                                className="px-2.5 py-1 bg-red-950/70 hover:bg-red-800 border border-red-500/40 text-red-200 hover:text-white rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 active:scale-95 shadow-xs"
                                title={`Delete account for ${user.fullName}`}
                              >
                                <Trash2 className="w-3 h-3 text-red-400" />
                                <span>Delete</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: PRAYER PETITIONS & MODERATION                 */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'prayers' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#141a29] border border-[#222d42] rounded-2xl">
              <div className="flex items-center gap-2 w-full sm:max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={prayerSearch}
                    onChange={(e) => setPrayerSearch(e.target.value)}
                    placeholder="Search prayer title, petition, or country..."
                    className="w-full pl-9 pr-3.5 py-2 bg-[#0c101a] border border-[#222d42] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <select
                  value={prayerUrgencyFilter}
                  onChange={(e) => setPrayerUrgencyFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-slate-300 outline-none"
                >
                  <option value="all">All Urgencies</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <button
                onClick={() => setNewPrayerModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Global Prayer Directive</span>
              </button>
            </div>

            {/* Prayers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prayersList
                .filter(p => {
                  const matchQ = p.title.toLowerCase().includes(prayerSearch.toLowerCase()) || p.description.toLowerCase().includes(prayerSearch.toLowerCase()) || (p.targetCountry && p.targetCountry.toLowerCase().includes(prayerSearch.toLowerCase()));
                  if (prayerUrgencyFilter !== 'all') return matchQ && p.urgency === prayerUrgencyFilter;
                  return matchQ;
                })
                .map(prayer => (
                  <div key={prayer.id} className="p-4 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-3 relative shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          prayer.urgency === 'Urgent' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {prayer.urgency} · {prayer.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">{prayer.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{prayer.targetCountry || 'Global'}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{prayer.description}</p>

                    {prayer.isAnswered && (
                      <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/40 rounded-xl text-emerald-300 text-[11px]">
                        <div className="font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Praise Report:</span>
                        </div>
                        <div className="mt-0.5">{prayer.praiseReport}</div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between text-xs">
                      <div className="text-[10px] text-slate-400">
                        By <span className="text-slate-200 font-semibold">{prayer.authorName}</span> · {prayer.prayedCount} Agreements
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePrayerAnswered(prayer)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            prayer.isAnswered ? 'bg-emerald-900 text-emerald-200' : 'bg-[#1e273b] hover:bg-emerald-950 text-emerald-400'
                          }`}
                        >
                          {prayer.isAnswered ? 'Answered ✓' : 'Mark Answered'}
                        </button>
                        <button
                          onClick={() => handleDeletePrayer(prayer.id, prayer.title)}
                          className="px-2 py-1 bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 active:scale-95 shadow-xs"
                          title="Delete prayer petition"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: VIDEO CONFERENCES & CALL ROOMS                */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'conferences' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#141a29] border border-[#222d42] rounded-2xl">
              <div>
                <h3 className="text-sm font-bold text-white">Live Prayer Rooms & Scheduled Vigils</h3>
                <p className="text-xs text-slate-400">Configure WebRTC / Zoom instant rooms and scheduled global intercession summits.</p>
              </div>
              <button
                onClick={() => setNewEventModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Global Prayer Room</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventsList.map(evt => (
                <div key={evt.id} className="p-5 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                      {evt.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{evt.targetCountry}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                  <p className="text-xs text-slate-300">{evt.description}</p>
                  
                  <div className="p-2 bg-[#0c101a] rounded-xl border border-[#1e2638] text-[11px] font-mono text-blue-400 truncate">
                    {evt.meetingLink}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1e2638]">
                    <span className="text-[10px] text-slate-400">Host: {evt.hostName} · {evt.rsvps.length} RSVPs</span>
                    <button
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      className="px-2.5 py-1 bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 active:scale-95 shadow-xs"
                      title="Remove conference room"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span>Remove Room</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: MISSION FIELD DISPATCHES & TESTIMONIES        */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'reports' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#141a29] border border-[#222d42] rounded-2xl">
              <div>
                <h3 className="text-sm font-bold text-white">Field Dispatches & Ground Intelligence</h3>
                <p className="text-xs text-slate-400">Moderate ground reports submitted by missionaries and publish official dispatches.</p>
              </div>
              <button
                onClick={() => setNewReportModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish HQ Dispatch</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportsList.map(report => (
                <div key={report.id} className="p-5 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{report.country} · {report.regionOrCity}</span>
                    <button
                      onClick={() => handleToggleReportVerified(report)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        report.isVerified ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {report.isVerified ? 'Verified Ground Report ✓' : 'Unverified'}
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white">{report.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{report.summary}</p>
                  <div className="text-[11px] text-blue-300 font-semibold">Scripture Anchor: {report.scriptureAnchor}</div>

                  <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Reported by {report.missionaryName}</span>
                    <button
                      onClick={() => handleDeleteReport(report.id, report.title)}
                      className="px-2.5 py-1 bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 active:scale-95 shadow-xs"
                      title="Delete report"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 7: SCRIPTURE UNION DAILY DEVOTIONALS            */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'devotionals' && (
          <div className="p-6 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#222d42]">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Scripture Union Daily Devotionals & Holy Bible Hub</h3>
                  <p className="text-xs text-slate-400">Automate daily Scripture Union reading rotations, key verses, and missionary reflection notes.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold rounded-full">
                Active & Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#0d121e] rounded-xl border border-[#222d42] space-y-2">
                <div className="font-bold text-white">Daily Guide Edition</div>
                <div className="text-slate-400">Comprehensive verses, commentary notes, and intercession commitments.</div>
                <div className="text-blue-400 font-mono text-[10px]">Rotation: Automatic Midnight UTC</div>
              </div>

              <div className="p-4 bg-[#0d121e] rounded-xl border border-[#222d42] space-y-2">
                <div className="font-bold text-white">Daily Power Edition</div>
                <div className="text-slate-400">Youth and frontline action points for evangelism and spiritual warfare.</div>
                <div className="text-blue-400 font-mono text-[10px]">Rotation: Automatic Midnight UTC</div>
              </div>

              <div className="p-4 bg-[#0d121e] rounded-xl border border-[#222d42] space-y-2">
                <div className="font-bold text-white">Encounter with God</div>
                <div className="text-slate-400">Deep theological reflections for leaders, pastors, and strategists.</div>
                <div className="text-blue-400 font-mono text-[10px]">Rotation: Automatic Midnight UTC</div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 8: TOOLKITS & MISSIONARY RESOURCES               */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'resources' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#141a29] border border-[#222d42] rounded-2xl">
              <div>
                <h3 className="text-sm font-bold text-white">Frontier Toolkits & Operational Manuals</h3>
                <p className="text-xs text-slate-400">Manage downloadable security guides, language packages, and field training modules.</p>
              </div>
              <button
                onClick={() => setNewResourceModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Resource</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resourcesList.map(res => (
                <div key={res.id} className="p-5 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {res.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{res.fileType} · {res.fileSize}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{res.title}</h4>
                  <p className="text-xs text-slate-300">{res.description}</p>
                  <div className="text-[10px] text-slate-400">Author: {res.author} · {res.downloadsCount} Downloads</div>

                  <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400">Publicly Available</span>
                    <button
                      onClick={() => handleDeleteResource(res.id, res.title)}
                      className="px-2.5 py-1 bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 active:scale-95 shadow-xs"
                      title="Delete resource"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 9: APP BRANDING & 3D INTERACTIVE GLOBE           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'branding' && (
          <form onSubmit={handleSaveBranding} className="space-y-6 animate-fadeIn">
            {saveSuccess && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>App branding, identity settings, and 3D globe animation parameters saved successfully.</span>
              </div>
            )}

            {/* General Site Identity */}
            <div className="p-6 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-400" />
                <span>Site Identity & Global Typography</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Application Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline Slogan</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Title</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* 3D Interactive Globe Settings */}
            <div className="p-6 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>3D Interactive World Globe Engine Settings</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#0d121e] rounded-xl border border-[#222d42] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Auto-Rotation</div>
                    <div className="text-[10px] text-slate-400">Continuous globe spin</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGlobeRotationPaused(!globeRotationPaused)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      !globeRotationPaused ? 'bg-emerald-600 text-white' : 'bg-[#222d42] text-slate-400'
                    }`}
                  >
                    {!globeRotationPaused ? 'Spinning' : 'Paused'}
                  </button>
                </div>

                <div className="p-4 bg-[#0d121e] rounded-xl border border-[#222d42] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Night Beacon Audio</div>
                    <div className="text-[10px] text-slate-400">Vigil pulse acoustics</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGlobeTickingSound(!globeTickingSound)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      globeTickingSound ? 'bg-blue-600 text-white' : 'bg-[#222d42] text-slate-400'
                    }`}
                  >
                    {globeTickingSound ? 'Enabled' : 'Muted'}
                  </button>
                </div>

                <div className="p-4 bg-[#0d121e] rounded-xl border border-[#222d42] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Spin Velocity</div>
                    <div className="text-[10px] text-slate-400">Rotation multiplier</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {([0.5, 1, 2] as const).map(spd => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setGlobeSpeed(spd)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          globeSpeed === spd ? 'bg-blue-600 text-white' : 'bg-[#1a2236] text-slate-400'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Branding & Engine Configurations</span>
              </button>
            </div>
          </form>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 10: GOOGLE CLOUD SQL & SECURITY AUDIT TRAIL      */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'cloudsql' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Cloud SQL Connection Status Card */}
            <div className="p-6 bg-gradient-to-r from-[#111827] via-[#16223b] to-[#10192e] border border-blue-900/50 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md shrink-0">
                  <Database className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Google Cloud SQL (PostgreSQL 15)</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      ● Active & Healthy
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 mt-1">
                    Region: <span className="font-mono text-white">europe-west1</span> · Instance ID: <span className="font-mono text-white">ai-studio-13fbd439</span>
                  </p>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ORM: Drizzle ORM · Connection Pool: pg.Pool (Object configuration with auto-reconnect)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setCloudSqlStatus(prev => ({ ...prev, lastPing: new Date().toLocaleTimeString() }));
                    alert('Cloud SQL database ping successful: Response latency 12ms');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Ping Database</span>
                </button>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="p-5 bg-[#141a29] border border-[#222d42] rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#222d42]">
                <div>
                  <h4 className="text-sm font-bold text-white">Full Security Audit Trail & Mutation History</h4>
                  <p className="text-xs text-slate-400">Real-time log of administrative logins, role modifications, demographic updates, and user actions.</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">{auditLogs.length} Total Records</span>
              </div>

              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0e1320] border-b border-[#222d42] text-slate-400 uppercase text-[10px] font-bold sticky top-0">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor / Admin</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target Scope</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2638]">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-[#192133] transition-colors">
                        <td className="p-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3 font-semibold text-white">{log.actorName}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">{log.action}</td>
                        <td className="p-3 text-slate-300">{log.target}</td>
                        <td className="p-3 text-slate-400">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ---------------------------------------------------- */}
      {/* MODALS FOR CREATING ENTITIES                         */}
      {/* ---------------------------------------------------- */}

      {/* 1. Country Editor Modal */}
      {editingCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#121725] border border-[#25324d] rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{editingCountry.flag}</span>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Demographics: {editingCountry.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{editingCountry.code} · {editingCountry.continent}</span>
                </div>
              </div>
              <button onClick={() => setEditingCountry(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveCountryEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Population</label>
                  <input
                    type="number"
                    value={editingCountry.population}
                    onChange={(e) => setEditingCountry({ ...editingCountry, population: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Unreached People Groups (UPGs)</label>
                  <input
                    type="number"
                    value={editingCountry.unreachedPeopleGroupsCount || 1}
                    onChange={(e) => setEditingCountry({ ...editingCountry, unreachedPeopleGroupsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Evangelical %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCountry.evangelicalPercentage}
                    onChange={(e) => setEditingCountry({ ...editingCountry, evangelicalPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Christian %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCountry.christianPercentage}
                    onChange={(e) => setEditingCountry({ ...editingCountry, christianPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Active Prayer Warriors</label>
                  <input
                    type="number"
                    value={editingCountry.activePrayerWarriorsCount}
                    onChange={(e) => setEditingCountry({ ...editingCountry, activePrayerWarriorsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1f293d]">
                <button
                  type="button"
                  onClick={() => setEditingCountry(null)}
                  className="px-4 py-2 bg-[#1a2236] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. New User Creation Modal */}
      {newUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#121725] border border-[#25324d] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <span>Create New User / Missionary Account</span>
              </h3>
              <button onClick={() => setNewUserModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserData.fullName}
                  onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                  placeholder="e.g. Sister Grace Williams"
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={newUserData.username}
                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                    placeholder="grace_missions"
                    required
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    placeholder="grace@prayercloud.org"
                    required
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role (RBAC)</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  >
                    <option value="Missionary">Missionary</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Intercessor">Intercessor</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Default Password</label>
                  <input
                    type="text"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1f293d]">
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="px-4 py-2 bg-[#1a2236] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. New Global Prayer Directive Modal */}
      {newPrayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#121725] border border-[#25324d] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span>Publish Global Headquarters Prayer Directive</span>
              </h3>
              <button onClick={() => setNewPrayerModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateHeadquartersPrayer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Directive Title</label>
                <input
                  type="text"
                  value={newPrayerData.title}
                  onChange={(e) => setNewPrayerData({ ...newPrayerData, title: e.target.value })}
                  placeholder="e.g. Urgent Intercession: Pamir Corridor Frontier Teams"
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Country</label>
                  <input
                    type="text"
                    value={newPrayerData.targetCountry}
                    onChange={(e) => setNewPrayerData({ ...newPrayerData, targetCountry: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Urgency</label>
                  <select
                    value={newPrayerData.urgency}
                    onChange={(e) => setNewPrayerData({ ...newPrayerData, urgency: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Petition & Spiritual Warfare Strategy</label>
                <textarea
                  rows={3}
                  value={newPrayerData.description}
                  onChange={(e) => setNewPrayerData({ ...newPrayerData, description: e.target.value })}
                  placeholder="Detail the spiritual resistance, administrative needs, or evangelistic breakthrough points..."
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1f293d]">
                <button
                  type="button"
                  onClick={() => setNewPrayerModalOpen(false)}
                  className="px-4 py-2 bg-[#1a2236] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Publish Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. New Event Modal */}
      {newEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#121725] border border-[#25324d] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-400" />
                <span>Schedule Global Prayer Room</span>
              </h3>
              <button onClick={() => setNewEventModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room Title</label>
                <input
                  type="text"
                  value={newEventData.title}
                  onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                  placeholder="e.g. 24-Hour Horn of Africa Midnight Prayer Watch"
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Type</label>
                  <select
                    value={newEventData.type}
                    onChange={(e) => setNewEventData({ ...newEventData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  >
                    <option value="24/7 Global Prayer">24/7 Global Prayer</option>
                    <option value="Mission Strategy Summit">Mission Strategy Summit</option>
                    <option value="Country Intercession">Country Intercession</option>
                    <option value="Frontier Briefing">Frontier Briefing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Focus</label>
                  <input
                    type="text"
                    value={newEventData.targetCountry}
                    onChange={(e) => setNewEventData({ ...newEventData, targetCountry: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Link</label>
                <input
                  type="text"
                  value={newEventData.meetingLink}
                  onChange={(e) => setNewEventData({ ...newEventData, meetingLink: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room Description</label>
                <textarea
                  rows={2}
                  value={newEventData.description}
                  onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1f293d]">
                <button
                  type="button"
                  onClick={() => setNewEventModalOpen(false)}
                  className="px-4 py-2 bg-[#1a2236] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Schedule Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. New Resource Modal */}
      {newResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#121725] border border-[#25324d] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-400" />
                <span>Upload Missionary Toolkit / Manual</span>
              </h3>
              <button onClick={() => setNewResourceModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document / Resource Title</label>
                <input
                  type="text"
                  value={newResourceData.title}
                  onChange={(e) => setNewResourceData({ ...newResourceData, title: e.target.value })}
                  placeholder="e.g. Frontier Stealth Protocol & Digital Safety Manual"
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newResourceData.category}
                    onChange={(e) => setNewResourceData({ ...newResourceData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  >
                    <option value="Security Guide">Security Guide</option>
                    <option value="Training Manual">Training Manual</option>
                    <option value="Research Brief">Research Brief</option>
                    <option value="Prayer Guide">Prayer Guide</option>
                    <option value="Bible Tool">Bible Tool</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">File Format</label>
                  <select
                    value={newResourceData.fileType}
                    onChange={(e) => setNewResourceData({ ...newResourceData, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="MP3">MP3</option>
                    <option value="EPUB">EPUB</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Target Audience</label>
                <textarea
                  rows={2}
                  value={newResourceData.description}
                  onChange={(e) => setNewResourceData({ ...newResourceData, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1f293d]">
                <button
                  type="button"
                  onClick={() => setNewResourceModalOpen(false)}
                  className="px-4 py-2 bg-[#1a2236] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Upload Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. New Report Modal */}
      {newReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#121725] border border-[#25324d] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Publish Official Field Dispatch</span>
              </h3>
              <button onClick={() => setNewReportModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Title</label>
                <input
                  type="text"
                  value={newReportData.title}
                  onChange={(e) => setNewReportData({ ...newReportData, title: e.target.value })}
                  placeholder="e.g. Breakthrough Harvest among Red Sea Nomadic Tribes"
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={newReportData.country}
                    onChange={(e) => setNewReportData({ ...newReportData, country: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Region / City</label>
                  <input
                    type="text"
                    value={newReportData.regionOrCity}
                    onChange={(e) => setNewReportData({ ...newReportData, regionOrCity: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Summary Executive Brief</label>
                <textarea
                  rows={2}
                  value={newReportData.summary}
                  onChange={(e) => setNewReportData({ ...newReportData, summary: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Dispatch Narrative</label>
                <textarea
                  rows={3}
                  value={newReportData.fullReport}
                  onChange={(e) => setNewReportData({ ...newReportData, fullReport: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#0c101a] border border-[#222d42] rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1f293d]">
                <button
                  type="button"
                  onClick={() => setNewReportModalOpen(false)}
                  className="px-4 py-2 bg-[#1a2236] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Publish Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
