import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Video, Clock, X, ExternalLink } from 'lucide-react';
import { notificationService, SystemNotification } from '../../services/notificationService';

interface NotificationBellProps {
  onNavigate: (page: string, param?: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((list) => {
      setNotifications([...list]);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpenDropdown = async () => {
    setIsOpen(!isOpen);
    // Request permission gently if not prompted yet
    notificationService.requestBrowserPermission().catch(() => {});
  };

  const handleNotificationClick = (notif: SystemNotification) => {
    notificationService.markAsRead(notif.id);
    setIsOpen(false);
    if (notif.targetUrl) {
      onNavigate(notif.targetUrl);
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.markAllAsRead();
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.clearAll();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpenDropdown}
        className="relative p-1.5 sm:p-2 rounded-xl bg-[#1c2232] hover:bg-[#253046] border border-[#283247] text-slate-300 hover:text-white transition-colors"
        title="Mission Notifications & Live Alerts"
      >
        <Bell className="w-4 h-4 text-amber-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-11 right-0 w-80 sm:w-96 bg-[#161b26] border border-[#283247] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col text-slate-200 animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-3 bg-[#111622] border-b border-[#232b3d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-xs sm:text-sm text-white">System Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-bold border border-red-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-blue-400 hover:text-blue-300 font-medium px-1.5 py-0.5 rounded hover:bg-[#1a2236] transition-colors"
                  title="Mark all as read"
                >
                  <Check className="w-3.5 h-3.5 inline mr-0.5" />
                  Read All
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-[#1a2236] transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1a2236]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#202738]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs font-semibold">No notifications right now</p>
                <p className="text-[11px] text-slate-500">
                  You will receive real-time alerts when new prayer requests are posted or live conferences start.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-[#1c2333] transition-colors cursor-pointer flex gap-3 items-start ${
                    !notif.read ? 'bg-[#182030]/80' : ''
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {notif.type === 'conference' ? (
                      <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center">
                        <Video className="w-4 h-4 animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                        <span className="text-sm">🙏</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className={`text-xs font-bold truncate ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                        {notif.title}
                      </h5>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {notif.actionLabel && (
                        <span className="text-blue-400 font-semibold flex items-center gap-0.5 hover:underline">
                          <span>{notif.actionLabel}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#111622] border-t border-[#232b3d] text-center">
            <span className="text-[10px] text-slate-400 font-mono">
              Live Intercession & Conference Dispatch Online
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
