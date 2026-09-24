import React, { useState } from 'react';
import {
  Video,
  Mic,
  Calendar,
  Disc,
  Play,
  Download,
  Users,
  Plus,
  Radio,
  Clock,
  ExternalLink,
  Shield,
  Sparkles,
  Share2,
  Copy,
  Check,
  KeyRound,
  X
} from 'lucide-react';
import { EventMeeting, MeetingRecording } from '../types';
import { VideoConferenceRoom } from '../components/calls/VideoConferenceRoom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storageService';

interface ConferencesPageProps {
  events: EventMeeting[];
  recordings: MeetingRecording[];
  onNavigate: (page: string) => void;
}

export const ConferencesPage: React.FC<ConferencesPageProps> = ({
  events,
  recordings,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const [activeCallRoom, setActiveCallRoom] = useState<{ roomTitle: string; countryFocus: string; meetingId?: string; passcode?: string } | null>(null);
  const [activeRecordingPlayback, setActiveRecordingPlayback] = useState<MeetingRecording | null>(null);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'recordings' | 'pmi'>('upcoming');

  // Modals
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [joinId, setJoinId] = useState('');
  const [joinName, setJoinName] = useState(currentUser?.fullName || '');
  
  // Schedule state
  const [scheduleTopic, setScheduleTopic] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('19:00');
  const [scheduleCountry, setScheduleCountry] = useState('Iran');
  const [schedulePasscode, setSchedulePasscode] = useState('prayer247');

  // PMI
  const pmiNumber = '849 2049 1192';
  const pmiPasscode = '104088';
  const [copiedPmi, setCopiedPmi] = useState(false);

  const copyPmiLink = () => {
    const link = `https://prayercloud.app/j/${pmiNumber.replace(/\s+/g, '')}\nMeeting ID: ${pmiNumber}\nPasscode: ${pmiPasscode}`;
    navigator.clipboard.writeText(link);
    setCopiedPmi(true);
    setTimeout(() => setCopiedPmi(false), 2500);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTopic.trim()) return;

    const newMeeting: EventMeeting = {
      id: `call-${Date.now()}`,
      title: scheduleTopic,
      description: `Strategic Call & Watch for ${scheduleCountry}. Passcode: ${schedulePasscode}`,
      startTime: `${scheduleDate || 'Tomorrow'} at ${scheduleTime} UTC`,
      endTime: `${scheduleDate || 'Tomorrow'} at 21:00 UTC`,
      type: 'Mission Strategy Summit',
      hostId: currentUser?.id || 'me',
      hostName: currentUser?.fullName || 'Mission Mobilizer',
      meetingLink: `https://prayercloud.app/j/${pmiNumber.replace(/\s+/g, '')}`,
      isLiveNow: false,
      targetCountry: scheduleCountry,
      rsvps: [currentUser?.id || 'me']
    };

    storage.addEvent(newMeeting);
    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      
      {/* Active Video Conference Modal Overlay */}
      {activeCallRoom && (
        <VideoConferenceRoom
          roomTitle={activeCallRoom.roomTitle}
          countryFocus={activeCallRoom.countryFocus}
          meetingId={activeCallRoom.meetingId}
          passcode={activeCallRoom.passcode}
          onLeaveRoom={() => setActiveCallRoom(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#161b26] rounded-3xl border border-[#262f43] text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#0e71eb] flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/25">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Live Video Watches & Conferences</span>
              <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                E2EE Active
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage scheduled prayer watches, launch Personal Meeting Rooms, and view recordings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 bg-[#232a3b] hover:bg-[#2f3950] text-slate-200 font-bold text-xs rounded-xl border border-[#343e54] transition-colors"
          >
            Join with ID
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Watch</span>
          </button>
          <button
            onClick={() => setActiveCallRoom({
              roomTitle: `${currentUser?.fullName || 'Operative'}'s Instant Live Watch`,
              countryFocus: 'Global 10/40 Unreached',
              meetingId: pmiNumber,
              passcode: pmiPasscode
            })}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Video className="w-4 h-4 fill-white" />
            <span>Start Instant Call</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#262f43] pb-2">
        <button
          onClick={() => setSelectedTab('upcoming')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            selectedTab === 'upcoming'
              ? 'bg-[#0e71eb] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2738]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming Watches ({events.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('recordings')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            selectedTab === 'recordings'
              ? 'bg-[#0e71eb] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2738]'
          }`}
        >
          <Disc className="w-4 h-4" />
          <span>Cloud Recordings ({recordings.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('pmi')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            selectedTab === 'pmi'
              ? 'bg-[#0e71eb] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2738]'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Personal Room (PMI)</span>
        </button>
      </div>

      {/* TAB 1: Upcoming Meetings */}
      {selectedTab === 'upcoming' && (
        <div className="space-y-4">
          {events.map((evt, idx) => (
            <div
              key={evt.id}
              className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    evt.isLiveNow ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}>
                    {evt.isLiveNow ? '🔴 LIVE NOW' : evt.type}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{evt.startTime}</span>
                  <span className="text-xs text-slate-400">· Meeting ID: 849 {2040 + idx} {1190 + idx}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {evt.description}
                </p>

                <div className="text-xs text-slate-500 pt-1 flex items-center gap-3">
                  <span>Target Nation: <strong className="text-slate-700 dark:text-slate-300">{evt.targetCountry || 'Global Focus'}</strong></span>
                  <span>·</span>
                  <span>Host: <strong className="text-slate-700 dark:text-slate-300">{evt.hostName}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => {
                    const link = `https://prayercloud.app/j/849${2040 + idx}${1190 + idx}\nTopic: ${evt.title}\nPasscode: prayer247`;
                    navigator.clipboard.writeText(link);
                  }}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-[#232a3b] hover:bg-slate-200 dark:hover:bg-[#2f3950] text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Invite</span>
                </button>

                <button
                  onClick={() => setActiveCallRoom({
                    roomTitle: evt.title,
                    countryFocus: evt.targetCountry || 'Global Focus',
                    meetingId: `849 ${2040 + idx} ${1190 + idx}`,
                    passcode: 'prayer247'
                  })}
                  className="px-5 py-2 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>{evt.isLiveNow ? 'Join Live Room' : 'Start Meeting'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Cloud Recordings */}
      {selectedTab === 'recordings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-36 bg-gradient-to-br from-[#121622] to-[#1c2438] flex items-center justify-center group">
                  <button
                    onClick={() => setActiveRecordingPlayback(rec)}
                    className="w-12 h-12 rounded-full bg-[#0e71eb] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                  >
                    <Play className="w-6 h-6 ml-1" />
                  </button>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded">
                    {rec.durationFormatted}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{rec.date}</span>
                    <span className="font-mono">{rec.sizeFormatted}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {rec.title}
                  </h4>

                  <p className="text-xs text-slate-500">
                    Host: {rec.hostName} · Focus: {rec.countryFocus}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#121622] border-t border-slate-100 dark:border-[#262f43] flex items-center justify-between text-xs">
                  <button
                    onClick={() => setActiveRecordingPlayback(rec)}
                    className="font-semibold text-[#0e71eb] hover:underline flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch Session</span>
                  </button>

                  <a
                    href={rec.mediaUrl}
                    download={`${rec.title}.webm`}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-white flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Personal Meeting Room (PMI) */}
      {selectedTab === 'pmi' && (
        <div className="p-6 bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] shadow-md space-y-6 max-w-3xl">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Personal Watch Room (PMI)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your persistent 24/7 dedicated encrypted room for frontier briefings, prayer watches, and direct coordination.
            </p>
          </div>

          <div className="space-y-4 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500">Personal Watch ID:</span>
              <strong className="font-mono text-sm text-slate-900 dark:text-white">{pmiNumber}</strong>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500">Passcode:</span>
              <strong className="font-mono text-slate-900 dark:text-white">{pmiPasscode}</strong>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500">Invite Link:</span>
              <span className="text-emerald-500 font-mono truncate max-w-xs">https://prayercloud.app/j/{pmiNumber.replace(/\s+/g, '')}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500">Security Encryption:</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Enhanced End-to-End Encryption (E2EE)</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveCallRoom({
                roomTitle: `${currentUser?.fullName || 'Operative'}'s Personal Watch`,
                countryFocus: 'Global Unreached',
                meetingId: pmiNumber,
                passcode: pmiPasscode
              })}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Start Watch Room</span>
            </button>

            <button
              onClick={copyPmiLink}
              className="px-4 py-2.5 bg-slate-100 dark:bg-[#232a3b] hover:bg-slate-200 dark:hover:bg-[#2f3950] text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              {copiedPmi ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPmi ? 'Invitation Copied!' : 'Copy Invitation Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* JOIN MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#161b26] rounded-3xl border border-[#262f43] shadow-2xl p-6 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-[#262f43] pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-400" />
                <span>Join Live Watch</span>
              </h3>
              <button onClick={() => setShowJoinModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!joinId) return;
              setShowJoinModal(false);
              setActiveCallRoom({ roomTitle: `Prayer Watch: ${joinId}`, countryFocus: '10/40 Window', meetingId: joinId, passcode: 'prayer247' });
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Watch ID or Link Name</label>
                <input
                  type="text"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  placeholder="e.g. 849 2049 1192"
                  className="w-full px-3.5 py-2.5 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-2.5 bg-[#232a3b] hover:bg-[#2f3950] text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow"
                >
                  Join Watch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#161b26] rounded-3xl border border-[#262f43] shadow-2xl p-6 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-[#262f43] pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Schedule Live Watch</span>
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topic</label>
                <input
                  type="text"
                  value={scheduleTopic}
                  onChange={(e) => setScheduleTopic(e.target.value)}
                  placeholder="e.g. 24/7 Strategic Watch: Yemen & Somali Coast"
                  className="w-full px-3.5 py-2.5 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time (UTC)</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Nation Focus</label>
                  <input
                    type="text"
                    value={scheduleCountry}
                    onChange={(e) => setScheduleCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Passcode</label>
                  <input
                    type="text"
                    value={schedulePasscode}
                    onChange={(e) => setSchedulePasscode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-2.5 bg-[#232a3b] hover:bg-[#2f3950] text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold rounded-xl shadow"
                >
                  Schedule Watch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recording Playback */}
      {activeRecordingPlayback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{activeRecordingPlayback.title}</h3>
                <p className="text-xs text-slate-400">Recorded on {activeRecordingPlayback.date} · Host: {activeRecordingPlayback.hostName}</p>
              </div>
              <button onClick={() => setActiveRecordingPlayback(null)} className="text-slate-400 hover:text-white text-sm">
                Close
              </button>
            </div>

            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center">
              <video
                src={activeRecordingPlayback.mediaUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Size: {activeRecordingPlayback.sizeFormatted}</span>
              <a
                href={activeRecordingPlayback.mediaUrl}
                download={`${activeRecordingPlayback.title}.webm`}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Download Video Session</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
