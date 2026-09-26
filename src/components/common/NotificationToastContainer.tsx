import React, { useState, useEffect } from 'react';
import { Video, X } from 'lucide-react';
import { SystemNotification } from '../../services/notificationService';

interface NotificationToastContainerProps {
  onNavigate: (page: string, param?: string) => void;
}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({ onNavigate }) => {
  const [activeToast, setActiveToast] = useState<SystemNotification | null>(null);

  useEffect(() => {
    const handleToast = (e: any) => {
      const notif = e.detail as SystemNotification;
      if (notif) {
        setActiveToast(notif);
        // Auto dismiss after 6.5 seconds
        setTimeout(() => {
          setActiveToast(prev => (prev?.id === notif.id ? null : prev));
        }, 6500);
      }
    };

    window.addEventListener('prayercloud_toast_notification', handleToast);
    return () => window.removeEventListener('prayercloud_toast_notification', handleToast);
  }, []);

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-sm sm:max-w-md w-full animate-slideInRight">
      <div className="p-4 rounded-2xl bg-[#141926]/95 backdrop-blur-md border border-amber-500/40 shadow-2xl text-slate-100 flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {activeToast.type === 'conference' ? (
            <div className="w-9 h-9 rounded-xl bg-red-950/90 border border-red-500/60 text-red-400 flex items-center justify-center">
              <Video className="w-5 h-5 animate-pulse" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-amber-950/90 border border-amber-500/60 text-amber-400 flex items-center justify-center text-lg">
              🙏
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-white truncate">
              {activeToast.title}
            </h4>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-2">
            {activeToast.message}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            {activeToast.targetUrl && (
              <button
                onClick={() => {
                  onNavigate(activeToast.targetUrl!);
                  setActiveToast(null);
                }}
                className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all"
              >
                {activeToast.actionLabel || 'View Now'}
              </button>
            )}
            <button
              onClick={() => setActiveToast(null)}
              className="px-2.5 py-1 text-slate-400 hover:text-slate-200 text-[11px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
