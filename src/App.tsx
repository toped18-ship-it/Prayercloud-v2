import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Shield, Globe, Database, Sparkles, Heart } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeAndBrandingProvider } from './context/ThemeAndBrandingContext';
import { firebaseService } from './services/firebase';
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
import { NotificationToastContainer } from './components/common/NotificationToastContainer';
import { GeminiMissionsChatModal } from './components/gemini/GeminiMissionsChatModal';

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

const CURRENT_PAGE_STORAGE_KEY = 'prayercloud_current_active_page_v3';

function MainAppContent() {
  const { isAuthenticated, isOnboardingOpen, setIsOnboardingOpen, currentUser, isAdmin } = useAuth();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Global active zoom meeting room state
  const [globalCallRoom, setGlobalCallRoom] = useState<{
    roomTitle: string;
    countryFocus: string;
    meetingId?: string;
    passcode?: string;
  } | null>(null);

  // Navigation state with persistent recall for admin and active view
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.toLowerCase().replace('#', '');
    const path = window.location.pathname.toLowerCase();
    if (hash === 'admin' || path === '/admin' || hash.startsWith('admin')) {
      return 'admin';
    }
    const saved = localStorage.getItem(CURRENT_PAGE_STORAGE_KEY);
    if (saved) {
      return saved;
    }
    return 'home';
  });
  const [pageParam, setPageParam] = useState<string | undefined>(undefined);

  // App Data State backed by Firestore and persistent cloud sync
  const [countries, setCountries] = useState<Country[]>(() => firebaseService.getCountries());
  const [places, setPlaces] = useState<UnreachedPlace[]>(() => firebaseService.getUnreachedPlaces());
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [reports, setReports] = useState<MissionReport[]>([]);
  const [events, setEvents] = useState<EventMeeting[]>([]);
  const [resources, setResources] = useState<MissionaryResource[]>(() => firebaseService.getResources());
  const [recordings, setRecordings] = useState<MeetingRecording[]>(() => firebaseService.getRecordings());

  // Global modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [createPrayerOpen, setCreatePrayerOpen] = useState(false);
  const [createPrayerContext, setCreatePrayerContext] = useState<string>('');
  const [geminiChatOpen, setGeminiChatOpen] = useState(false);
  const [geminiInitialTopic, setGeminiInitialTopic] = useState<string>('');

  const refreshData = async () => {
    setCountries(firebaseService.getCountries());
    setPlaces(firebaseService.getUnreachedPlaces());
    setResources(firebaseService.getResources());
    setRecordings(firebaseService.getRecordings());

    const [loadedPrayers, loadedReports, loadedEvents] = await Promise.all([
      firebaseService.getPrayers(),
      firebaseService.getReports(),
      firebaseService.getEvents()
    ]);

    setPrayers(loadedPrayers);
    setReports(loadedReports);
    setEvents(loadedEvents);
  };

  // Load Firestore cloud data & set up real-time prayer listeners
  useEffect(() => {
    refreshData();

    // Real-time Firestore subscriptions
    const unsubPrayers = firebaseService.subscribeToPrayers((realtimePrayers) => {
      setPrayers(realtimePrayers);
    });

    return () => {
      unsubPrayers();
    };
  }, []);

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

  // URL Path and Hash listener for direct /admin navigation and back/forward
  useEffect(() => {
    const handleUrlSync = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || hash === 'admin' || hash.startsWith('admin')) {
        setCurrentPage('admin');
        localStorage.setItem(CURRENT_PAGE_STORAGE_KEY, 'admin');
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

  // Guard admin session state: preserve admin portal if active
  useEffect(() => {
    if (currentPage === 'admin') {
      localStorage.setItem(CURRENT_PAGE_STORAGE_KEY, 'admin');
    }
  }, [currentPage]);

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
    localStorage.setItem(CURRENT_PAGE_STORAGE_KEY, page);

    if (page === 'admin') {
      window.location.hash = 'admin';
      try {
        window.history.pushState({ page: 'admin' }, '', '/admin');
      } catch {}
    } else {
      if (window.location.hash.includes('admin') || window.location.pathname === '/admin') {
        window.location.hash = page === 'home' ? '' : page;
        try {
          window.history.pushState({ page }, '', page === 'home' ? '/' : `/${page}`);
        } catch {}
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreatePrayer = (countryOrContext = '') => {
    setCreatePrayerContext(countryOrContext);
    setCreatePrayerOpen(true);
  };

  const handleOpenPrayerCompanion = (topic = '') => {
    setGeminiInitialTopic(topic);
    setGeminiChatOpen(true);
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
        <main className="flex-1 w-full max-w-[1700px] mx-auto p-2 sm:p-4">
          <AdminDashboardPage onNavigate={navigateTo} />
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
      
      {/* Top Bar Navigation - hidden during admin session */}
      {currentPage !== 'admin' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          onOpenSearch={() => setSearchOpen(true)}
          onRestartTour={() => setIsOnboardingOpen(true)}
          onLaunchInstantCall={handleLaunchInstantMeeting}
        />
      )}

      {/* Main View Area */}
      <main className={`flex-1 w-full mx-auto ${currentPage === 'admin' ? 'max-w-[1750px] px-2 sm:px-4 pt-2 sm:pt-4 pb-4' : 'max-w-[1600px] px-3 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-24 sm:pb-28'} overflow-x-hidden`}>
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
            country={firebaseService.getCountryByCode(pageParam) || countries[0]}
            unreachedPlaces={firebaseService.getUnreachedPlacesByCountry(pageParam)}
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
          <AdminDashboardPage />
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

      {/* Discreet Prayer Companion Pop-up Trigger */}
      {currentPage !== 'admin' && (
        <div className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-30 flex items-center">
          <button
            onClick={() => handleOpenPrayerCompanion()}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#121726]/95 hover:bg-[#1a2136] text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-full font-bold text-xs shadow-xl shadow-black/40 hover:shadow-amber-500/10 hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
            title="Open Prayer Companion"
          >
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span className="font-semibold text-[11px] sm:text-xs tracking-wide">Prayer Companion</span>
          </button>
        </div>
      )}

      {/* Footer only on homepage */}
      {currentPage === 'home' && <Footer onNavigate={navigateTo} />}

      {/* Docked Global Bottom Navigation Bar - hidden during admin session */}
      {currentPage !== 'admin' && (
        <BottomNavbar
          currentPage={currentPage}
          onNavigate={navigateTo}
        />
      )}

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

      {/* Gemini AI Multi-Turn Grounded Chatbot Modal */}
      <GeminiMissionsChatModal
        isOpen={geminiChatOpen}
        onClose={() => setGeminiChatOpen(false)}
        initialTopic={geminiInitialTopic}
      />

      {/* Real-time System Notification Toast Alerts */}
      <NotificationToastContainer onNavigate={navigateTo} />
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
