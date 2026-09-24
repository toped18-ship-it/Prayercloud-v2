import React, { useState } from 'react';
import { MissionaryResource } from '../types';
import { BookOpen, Download, Search, FileText, Shield, Globe, Plus, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storageService';

interface ResourcesPageProps {
  resources: MissionaryResource[];
  onRefreshResources: () => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  resources,
  onRefreshResources
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = ['All', 'Strategy Guide', 'Security Protocol', 'Prayer Manual', 'Language & Cultural Dossier', 'Church Planting Framework'];

  const filtered = resources.filter(r => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    }
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Missionary Resource & Security Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standard operating manuals, unreached maps, field security protocols, and prayer guides.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Strategy Document</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by title or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white w-full sm:w-auto"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                  {res.category}
                </span>
                <span className="text-slate-400 text-[11px] uppercase font-mono">
                  {res.fileType} · {res.fileSize}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {res.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {res.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Author: {res.author}</span>
              <a
                href={res.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base">Upload Missionary Resource</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newRes: MissionaryResource = {
                  id: `res-${Date.now()}`,
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  category: 'Training Manual',
                  downloadUrl: '#',
                  fileType: 'PDF',
                  fileSize: '1.8 MB',
                  author: currentUser?.fullName || 'Frontier Mobilizer',
                  language: 'English',
                  createdAt: new Date().toISOString().split('T')[0],
                  downloadsCount: 0
                };
                storage.addResource(newRes);
                onRefreshResources();
                setIsAddModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Document Title *</label>
                <input required name="title" placeholder="e.g. 10/40 Window Mobilization Framework" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select name="category" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Description *</label>
                <textarea required name="description" rows={3} placeholder="Brief summary of document..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow">Save Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
