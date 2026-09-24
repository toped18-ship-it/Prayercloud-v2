import React, { useState } from 'react';
import { MissionReport } from '../types';
import { FileText, Heart, MessageSquare, Plus, Search, CheckCircle, ArrowRight, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storageService';

interface FieldReportsPageProps {
  reports: MissionReport[];
  onRefreshReports: () => void;
}

export const FieldReportsPage: React.FC<FieldReportsPageProps> = ({
  reports,
  onRefreshReports
}) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReportModal, setActiveReportModal] = useState<MissionReport | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const handleLike = (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    storage.toggleLikeReport(reportId, currentUser.id);
    onRefreshReports();
  };

  const filteredReports = reports.filter(r => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.country.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.missionaryName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Field Mission Reports & Testimonies
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Eyewitness testimonies of Gospel breakthroughs, church plantings, and miracle reports from pioneer frontiers.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Field Report</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search testimonies by country, missionary name, or tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const isLiked = currentUser ? report.likedUserIds.includes(currentUser.id) : false;

          return (
            <div
              key={report.id}
              onClick={() => setActiveReportModal(report)}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {report.country} · {report.regionOrCity}
                  </span>
                  <span className="text-slate-400 text-[11px]">{report.createdAt}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {report.summary}
                </p>

                {/* Key Metrics snapshot */}
                {(report.peopleReachedEstimate || report.churchesPlantedCount) && (
                  <div className="flex gap-2 pt-2">
                    {report.peopleReachedEstimate && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800">
                        {report.peopleReachedEstimate.toLocaleString()} Reached
                      </span>
                    )}
                    {report.churchesPlantedCount && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                        {report.churchesPlantedCount} Planted
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  By {report.missionaryName}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(report.id, e)}
                    className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                      isLiked ? 'text-red-500 font-bold' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                    <span>{report.likesCount}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Report Reader Modal */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {activeReportModal.country} ({activeReportModal.regionOrCity}) · {activeReportModal.createdAt}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeReportModal.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Report filed by: {activeReportModal.missionaryName}</p>
              </div>

              <button onClick={() => setActiveReportModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              <p className="font-semibold text-slate-900 dark:text-white text-base">
                {activeReportModal.summary}
              </p>
              <p>{activeReportModal.fullReport}</p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
              <span className="text-xs text-blue-900 dark:text-blue-200 font-semibold">
                Rejoice with the frontline team! Give glory to Jesus.
              </span>
              <button
                onClick={(e) => handleLike(activeReportModal.id, e)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4" />
                <span>Praise God ({activeReportModal.likesCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Report Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base">Submit Frontier Mission Report</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newRep: MissionReport = {
                  id: `rep-${Date.now()}`,
                  title: formData.get('title') as string,
                  missionaryId: currentUser?.id || 'usr-1',
                  missionaryName: currentUser?.fullName || 'Field Worker',
                  country: formData.get('country') as string,
                  regionOrCity: (formData.get('region') as string) || 'Central Field',
                  createdAt: new Date().toISOString().split('T')[0],
                  summary: formData.get('summary') as string,
                  fullReport: formData.get('fullContent') as string,
                  peopleReachedEstimate: 120,
                  churchesPlantedCount: 1,
                  challenges: 'Persecution threats',
                  urgentNeeds: ['Prayer for safe shelter'],
                  photoUrls: [],
                  scriptureAnchor: 'Matthew 28:19',
                  isVerified: true,
                  likesCount: 1,
                  likedUserIds: [currentUser?.id || 'usr-1']
                };
                storage.addMissionReport(newRep);
                onRefreshReports();
                setIsSubmitModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Report Title *</label>
                <input required name="title" placeholder="e.g. Breakthrough in Remote Valley" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Country *</label>
                  <input required name="country" placeholder="e.g. Turkey" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Region / Province</label>
                  <input name="region" placeholder="e.g. Eastern Highlands" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Summary *</label>
                <input required name="summary" placeholder="Brief 1-2 sentence overview of the testimony" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Full Testimony & Field Details *</label>
                <textarea required name="fullContent" rows={4} placeholder="Full account of the mission breakthrough..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow">Publish Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
