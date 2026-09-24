import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  MessageSquare,
  Video,
  ShieldCheck,
  HeartHandshake,
  CheckCircle,
  ChevronRight,
  X,
  Sparkles,
  Flame,
  PlusCircle,
  Compass,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, param?: string) => void;
  onOpenCreatePrayer?: () => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCreatePrayer
}) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      id: 'dashboard',
      badge: 'Step 1 of 5: Global Mission Command',
      title: 'Main Dashboard & Live Ticking Earth',
      subtitle: 'Real-time global mission telemetry, live rotating Earth, and 24/7 prayer watches',
      icon: Globe,
      iconBg: 'bg-blue-600 text-white shadow-blue-500/30',
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            Welcome to <strong className="text-blue-600 dark:text-blue-400 font-bold">PRAYERCLOUD</strong>! The Home Dashboard acts as your mission operations center.
          </p>
          <div className="space-y-1.5 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Key Dashboard Capabilities:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
              <li><strong>Live Rotating 3D Earth Globe:</strong> Real-time ticking UTC clock and pulsing frontier hotspots.</li>
              <li><strong>195 Nations Metric Bar:</strong> Active trackers for 7,400+ UPGs, field missionaries, and intercessors.</li>
              <li><strong>24/7 Live Video Watches:</strong> Instant 1-click entry into ongoing global prayer rooms.</li>
            </ul>
          </div>
        </div>
      ),
      actionButton: {
        label: 'Preview Home Dashboard',
        onClick: () => onNavigate('home')
      }
    },
    {
      id: 'countries',
      badge: 'Step 2 of 5: 195 Sovereign Nations',
      title: 'Country Directory & Missional Dossiers',
      subtitle: 'Deep missional intelligence on all 195 nations and the 10/40 window',
      icon: Compass,
      iconBg: 'bg-indigo-600 text-white shadow-indigo-500/30',
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            The Country Directory provides authoritative Joshua Project & Operation World demographic dossiers.
          </p>
          <div className="space-y-1.5 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>Filter nations by <strong>10/40 Window</strong>, Continent, Dominant Religion, and Security Risk (*Low, Medium, High, Extreme*).</li>
              <li>Access specific country prayer anchors, capital city data, and pioneer opportunities.</li>
              <li>Directly open nation-specific strategy channels in the Missionary Hub.</li>
            </ul>
          </div>
        </div>
      ),
      actionButton: {
        label: 'Open Countries Directory',
        onClick: () => onNavigate('countries')
      }
    },
    {
      id: 'unreached',
      badge: 'Step 3 of 5: Frontier Unreached Peoples',
      title: 'Unreached Peoples & Tribes Module',
      subtitle: 'Mapping over 7,400 unengaged groups, isolated tribes, and zero-gospel regions',
      icon: Flame,
      iconBg: 'bg-amber-600 text-white shadow-amber-500/30',
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            Discover and intercede for people groups with zero known indigenous church or scripture translation.
          </p>
          <div className="space-y-1.5 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>Inspect Bible translation progress (*None, Portions, Complete*).</li>
              <li>View missionary presence status (*No Known Workers, Pioneer Needed*).</li>
              <li>Log new frontline field survey points to mobilize workers to unreached villages.</li>
            </ul>
          </div>
        </div>
      ),
      actionButton: {
        label: 'Explore Unreached Peoples',
        onClick: () => onNavigate('unreached-places')
      }
    },
    {
      id: 'hub',
      badge: 'Step 4 of 5: Secure Communication',
      title: 'Missionary Hub & Strategy Rooms',
      subtitle: 'Real-time encrypted chat, recorded voice notes, and mission document sharing',
      icon: MessageSquare,
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/30',
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            Connect directly with frontline pioneers, pastors, and church planters across global rooms.
          </p>
          <div className="space-y-1.5 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>Send instant text and <strong>recorded voice notes with waveform audio</strong>.</li>
              <li>Access field security manuals, frontier training PDFs, and recorded video summits.</li>
              <li>Coordinate safe logistics and emergency crisis intercession.</li>
            </ul>
          </div>
        </div>
      ),
      actionButton: {
        label: 'Visit Missionary Hub',
        onClick: () => onNavigate('missionary-hub')
      }
    },
    {
      id: 'prayer',
      badge: 'Step 5 of 5: Intercession Engine',
      title: 'How to Post a Prayer Request',
      subtitle: 'Mobilize thousands of intercessors worldwide in minutes',
      icon: HeartHandshake,
      iconBg: 'bg-rose-600 text-white shadow-rose-500/30',
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            Posting a prayer request is simple, rapid, and securely targeted for spiritual breakthrough.
          </p>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 space-y-2 text-xs">
            <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>3-Step Prayer Posting Workflow:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
              <li>Click the <strong>"+ Post Prayer Need"</strong> button found on the Prayer Board or top banner.</li>
              <li>Select the <strong>Target Country / Category</strong> (*Urgent, Persecution, Frontier Tribe, Healing*).</li>
              <li>Toggle <strong>Anonymous Posting</strong> if operating in a sensitive or closed security nation.</li>
            </ol>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            Watch live spiritual agreements increment in real time as believers press "I Prayed for This".
          </p>
        </div>
      ),
      actionButton: {
        label: 'Open Prayer Board',
        onClick: () => onNavigate('prayer-requests')
      }
    }
  ];

  const currentStepData = tourSteps[step];
  const IconComponent = currentStepData.icon;

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentStepData.badge}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Close tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl ${currentStepData.iconBg} flex items-center justify-center shadow-lg shrink-0 mt-0.5`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white leading-snug">
                {currentStepData.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentStepData.subtitle}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            {currentStepData.content}
          </div>

          {/* Optional Direct Preview Link */}
          {currentStepData.actionButton && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  currentStepData.actionButton.onClick();
                  if (step === tourSteps.length - 1) {
                    onClose();
                  }
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{currentStepData.actionButton.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all ${
                  step === i ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
                title={`Jump to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
            >
              <span>{step === tourSteps.length - 1 ? 'Complete Tour & Start Praying' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
