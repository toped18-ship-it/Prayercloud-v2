import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Shield, Globe, Database, ArrowLeft } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeAndBrandingProvider } from './context/ThemeAndBrandingContext';
import { storage } from './services/storageService';
import { Country, UnreachedPlace, PrayerRequest, MissionReport, EventMeeting, MissionaryResource, MeetingRecording } from './types';

// Common Components
import { Navbar } from './components/common/Navbar';
import { BottomNavbar } from './components/common/BottomNavbar';
import { Footer } from './components/common/Footer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { OnboardingTourModal } from './components/common/OnboardingTourModal';
import { ForcePasswordChangeModal } from './components/common/ForcePasswordChangeModal';
import { CreatePrayerModal } from './components/prayer/CreatePrayerModal';
import { AppSplashScreen } from './components/common/AppSplashScreen';
import { GoogleMapsQuotaBanner } from './components/common/GoogleMapsQuotaBanner';
import { VideoConferenceRoom } from './components/calls/VideoConferenceRoom';

// Pages
import { HomePage } from './pages/HomePage';
import { CountriesDirectoryPage } from './pages/CountriesDirectoryPage';
import { CountryDetailPage } from './pages/CountryDetailPage';
import { UnreachedPlacesPage } from './pages/UnreachedPlacesPage';
import { WorldMapPage } from './pages/WorldMapPage';
import { MissionaryHubPage } from './pages/MissionaryHubPage';
import { ChatroomPage } from './pages/ChatroomPage';
import { ConferencesPage } from './pages/ConferencesPage';
import { PrayerBoardPage } from './pages/PrayerBoardPage';
import { FieldReportsPage } from './pages/FieldReportsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPages } from './pages/AuthPages';
import { UserProfilePage } from './pages/UserProfilePage';
import { DevotionalHubPage } from './pages/DevotionalHubPage';

function MainAppContent() {
  const { isAuthenticated, isOnboardingOpen, setIsOnboardingOpen, currentUser } = useAuth();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Global active zoom meeting room state
  const [globalCallRoom, setGlobalCallRoom] = useState<{
    roomTitle: string;
    countryFocus: string;
    meetingId?: string;
    passcode?: string;
  } | null>(null);

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.toLowerCase().replace('#', '');
    const path = window.location.pathname.toLowerCase();
    if (hash === 'admin' || path === '/admin' || hash.startsWith('admin')) {
      return 'admin';
    }
    return 'home';
  });
  const [pageParam, setPageParam] = useState<string | undefined>(undefined);

  // App Data State
  const [countries, setCountries] = useState<Country[]>(() => storage.getCountries());
  const [places, setPlaces] = useState<UnreachedPlace[]>(() => storage.getUnreachedPlaces());
  const [prayers, setPrayers] = useState<PrayerRequest[]>(() => storage.getPrayerRequests());
  const [reports, setReports] = useState<MissionReport[]>(() => storage.getMissionReports());
  const [events, setEvents] = useState<EventMeeting[]>(() => storage.getEvents());
  const [resources, setResources] = useState<MissionaryResource[]>(() => storage.getResources());
  const [recordings, setRecordings] = useState<MeetingRecording[]>(() => storage.getRecordings());

  // Global modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [createPrayerOpen, setCreatePrayerOpen] = useState(false);
  const [createPrayerContext, setCreatePrayerContext] = useState<string>('');

  const refreshData = () => {
    setCountries(storage.getCountries());
    setPlaces(storage.getUnreachedPlaces());
    setPrayers(storage.getPrayerRequests());
    setReports(storage.getMissionReports());
    setEvents(storage.getEvents());
    setResources(storage.getResources());
    setRecordings(storage.getRecordings());
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for Zoom Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // URL Path and Hash listener for direct /admin navigation
  useEffect(() => {
    const handleUrlSync = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || hash === 'admin' || hash.startsWith('admin')) {
        setCurrentPage('admin');
      }
    };
    handleUrlSync();
    window.addEventListener('hashchange', handleUrlSync);
    window.addEventListener('popstate', handleUrlSync);
    return () => {
      window.removeEventListener('hashchange', handleUrlSync);
      window.removeEventListener('popstate', handleUrlSync);
    };
  }, []);

  // Automatic onboarding tour on first launch
  useEffect(() => {
    const hasSeen = localStorage.getItem('prayercloud_onboarding_completed_v1');
    if (!hasSeen) {
      setIsOnboardingOpen(true);
      localStorage.setItem('prayercloud_onboarding_completed_v1', 'true');
    }
  }, [setIsOnboardingOpen]);

  useEffect(() => {
    const handleStorageChange = () => {
      refreshData();
    };
    window.addEventListener('prayercloud_storage_update', handleStorageChange);
    return () => window.removeEventListener('prayercloud_storage_update', handleStorageChange);
  }, []);

  const navigateTo = (page: string, param?: string) => {
    setCurrentPage(page);
    setPageParam(param);
    if (page === 'admin') {
      try {
        window.history.pushState({ page: 'admin' }, '', '/admin');
      } catch {
        window.location.hash = 'admin';
      }
    } else {
      if (window.location.pathname === '/admin' || window.location.hash.includes('admin')) {
        try {
          window.history.pushState({ page }, '', '/');
        } catch {
          window.location.hash = '';
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreatePrayer = (countryOrContext = '') => {
    setCreatePrayerContext(countryOrContext);
    setCreatePrayerOpen(true);
  };

  const handleLaunchInstantMeeting = (customTopic?: string, countryFocus?: string) => {
    setGlobalCallRoom({
      roomTitle: customTopic || `${currentUser?.fullName || 'Operative'}'s Instant Live Watch`,
      countryFocus: countryFocus || 'Global 10/40 Unreached',
      meetingId: '849 2049 1192',
      passcode: '104088'
    });
  };

  // If initial application splash is loading, display the 3D logo loading screen
  if (isInitialLoading) {
    return <AppSplashScreen onLoaded={() => setIsInitialLoading(false)} />;
  }

  // If user is not authenticated, show sign up / login page first
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#0e121b] text-slate-100 antialiased font-sans">
        <GoogleMapsQuotaBanner />
        <main className="flex-1 w-full max-w-full flex items-center justify-center p-3 sm:p-4 overflow-x-hidden">
          <AuthPages
            mode={currentPage === 'register' ? 'register' : 'login'}
            onNavigate={navigateTo}
          />
        </main>
      </div>
    );
  }

  // Dedicated Isolated Admin Portal UI when at /admin
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#0b0e14] text-slate-100 antialiased font-sans transition-colors selection:bg-blue-600 selection:text-white">
        {/* Isolated Command Topbar */}
        <header className="sticky top-0 z-50 w-full bg-[#111622] border-b border-[#1f2738] px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black shadow-inner shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-sm text-white tracking-tight">PRAYER CLOUD</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider">
                  Admin Console
                </span>
                <span className="hidden md:inline-flex text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 items-center gap-1.5">
                  <Database className="w-3 h-3 text-emerald-400" />
                  Firebase Realtime Database (prayercloud-e341d)
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Secure Isolated Console · URL: <span className="text-amber-400 font-bold">/admin</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="px-3.5 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Return to public application (/)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Public UI (/)</span>
            </button>
          </div>
        </header>

        {/* Standalone Admin Portal Body */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <AdminDashboardPage onExitToPublic={() => navigateTo('home')} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-slate-100 dark:bg-[#0c1018] text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors">
      <GoogleMapsQuotaBanner />

      {/* Global Video Conference / WhatsApp Call Active Room */}
      {globalCallRoom && (
        <VideoConferenceRoom
          roomTitle={globalCallRoom.roomTitle}
          countryFocus={globalCallRoom.countryFocus}
          meetingId={globalCallRoom.meetingId}
          passcode={globalCallRoom.passcode}
          onLeaveRoom={() => setGlobalCallRoom(null)}
        />
      )}
      
      {/* Top Bar Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSearch={() => setSearchOpen(true)}
        onRestartTour={() => setIsOnboardingOpen(true)}
        onLaunchInstantCall={handleLaunchInstantMeeting}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-24 sm:pb-28 overflow-x-hidden">
        {currentPage === 'home' && (
          <HomePage
            countries={countries}
            places={places}
            prayers={prayers}
            reports={reports}
            events={events}
            onNavigate={navigateTo}
            onOpenCreatePrayer={() => handleOpenCreatePrayer()}
            onLaunchInstantMeeting={handleLaunchInstantMeeting}
          />
        )}

        {currentPage === 'countries' && (
          <CountriesDirectoryPage
            countries={countries}
            onSelectCountry={(code) => navigateTo('country', code)}
          />
        )}

        {currentPage === 'country' && pageParam && (
          <CountryDetailPage
            country={storage.getCountryByCode(pageParam) || countries[0]}
            unreachedPlaces={storage.getUnreachedPlacesByCountry(pageParam)}
            prayers={prayers}
            onBack={() => navigateTo('countries')}
            onSelectPlace={(placeId) => navigateTo('unreached-places', placeId)}
            onJoinCountryChat={(code) => navigateTo('chat', `room-country-${code.toLowerCase()}`)}
            onOpenCreatePrayer={(countryName) => handleOpenCreatePrayer(countryName)}
          />
        )}

        {currentPage === 'unreached-places' && (
          <UnreachedPlacesPage
            places={places}
            onSelectCountry={(code) => navigateTo('country', code)}
            onOpenCreatePrayer={(ctx) => handleOpenCreatePrayer(ctx)}
            initialSelectedPlaceId={pageParam}
          />
        )}

        {(currentPage === 'missionary-hub' || currentPage === 'hub' || currentPage === 'map' || currentPage === 'prayer-requests' || currentPage === 'calls' || currentPage === 'conferences' || currentPage === 'events') && (
          <MissionaryHubPage
            countries={countries}
            places={places}
            resources={resources}
            prayers={prayers}
            reports={reports}
            events={events}
            recordings={recordings}
            onNavigate={navigateTo}
            onOpenCreatePrayer={(ctx) => handleOpenCreatePrayer(ctx)}
            onRefreshPrayers={refreshData}
            initialRoomId={pageParam}
            initialTab={
              currentPage === 'map'
                ? 'map'
                : currentPage === 'prayer-requests'
                ? 'prayers'
                : (currentPage === 'calls' || currentPage === 'conferences' || currentPage === 'events')
                ? 'watches'
                : pageParam || 'map'
            }
          />
        )}

        {(currentPage === 'chat' || currentPage === 'chatroom') && (
          <ChatroomPage initialRoomId={pageParam} />
        )}

        {currentPage === 'reports' && (
          <FieldReportsPage
            reports={reports}
            onRefreshReports={refreshData}
          />
        )}

        {(currentPage === 'devotionals' || currentPage === 'devotional-hub' || currentPage === 'bible' || currentPage === 'devotional') && (
          <DevotionalHubPage
            initialTab={currentPage === 'bible' ? 'bible' : 'devotional'}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'resources' && (
          <ResourcesPage
            resources={resources}
            onRefreshResources={refreshData}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage onExitToPublic={() => navigateTo('home')} />
        )}

        {currentPage === 'login' && (
          <AuthPages
            mode="login"
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'register' && (
          <AuthPages
            mode="register"
            onNavigate={navigateTo}
          />
        )}

        {(currentPage === 'profile' || currentPage === 'user-profile') && (
          <UserProfilePage onNavigate={navigateTo} />
        )}
      </main>

        {/* Footer only on homepage */}
        {currentPage === 'home' && <Footer onNavigate={navigateTo} />}

      {/* Docked Global Bottom Navigation Bar */}
      <BottomNavbar
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

      {/* Modals and Overlays */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigateTo}
      />

      <OnboardingTourModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onNavigate={navigateTo}
      />

      <ForcePasswordChangeModal />

      <CreatePrayerModal
        isOpen={createPrayerOpen}
        onClose={() => setCreatePrayerOpen(false)}
        onSuccess={refreshData}
        initialCountry={createPrayerContext}
      />
    </div>
  );
}

export default function App() {
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <APIProvider apiKey={mapsApiKey} libraries={['places', 'marker', 'geometry', 'routes']}>
      <ThemeAndBrandingProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </ThemeAndBrandingProvider>
    </APIProvider>
  );
}
