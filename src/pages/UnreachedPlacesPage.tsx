import React, { useState, useMemo } from 'react';
import { UnreachedPlace } from '../types';
import {
  MapPin,
  Search,
  Flame,
  Globe,
  BookOpen,
  Compass,
  HeartHandshake,
  ShieldAlert,
  ChevronRight,
  Filter,
  Plus,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storageService';

interface UnreachedPlacesPageProps {
  places: UnreachedPlace[];
  onSelectCountry: (countryCode: string) => void;
  onOpenCreatePrayer: (context: string) => void;
  initialSelectedPlaceId?: string;
}

export const UnreachedPlacesPage: React.FC<UnreachedPlacesPageProps> = ({
  places,
  onSelectCountry,
  onOpenCreatePrayer,
  initialSelectedPlaceId
}) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedReligion, setSelectedReligion] = useState<string>('All');
  const [selectedAccess, setSelectedAccess] = useState<string>('All');
  const [activePlaceModal, setActivePlaceModal] = useState<UnreachedPlace | null>(() => {
    if (initialSelectedPlaceId) {
      return places.find(p => p.id === initialSelectedPlaceId) || null;
    }
    return null;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter types
  const placeTypes = ['All', 'People Group', 'Tribe', 'City', 'Village', 'Region'];
  const religions = ['All', 'Islam', 'Hinduism', 'Buddhism', 'Ethnic Religions', 'Secular / Agnostic'];
  const accessLevels = ['All', 'Unreached', 'Minimally Reached', 'Partially Reached', 'Reached'];

  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCountry = p.countryName.toLowerCase().includes(q);
        const matchesLang = p.languages.some(l => l.toLowerCase().includes(q));
        if (!matchesName && !matchesCountry && !matchesLang) return false;
      }

      if (selectedType !== 'All' && p.type !== selectedType) return false;
      if (selectedReligion !== 'All' && !p.mainReligion.toLowerCase().includes(selectedReligion.toLowerCase())) return false;
      if (selectedAccess !== 'All' && p.gospelAccessStatus !== selectedAccess) return false;

      return true;
    });
  }, [places, searchQuery, selectedType, selectedReligion, selectedAccess]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Unreached People Groups, Cities & Villages
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dossiers of tribal communities, closed cities, and nomadic villages with zero or minimal church presence.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Unreached Locus Survey</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tribe name, country, spoken language, or province..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Category Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              {placeTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Main Religion
            </label>
            <select
              value={selectedReligion}
              onChange={(e) => setSelectedReligion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              {religions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Gospel Access Status
            </label>
            <select
              value={selectedAccess}
              onChange={(e) => setSelectedAccess(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              {accessLevels.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Unreached Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            onClick={() => setActivePlaceModal(place)}
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded border border-amber-300 dark:border-amber-800">
                    {place.type}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1 group-hover:text-amber-600 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {place.countryName}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono-data">
                    {place.percentEvangelical}% Gospel
                  </div>
                  <div className="text-[10px] text-slate-400">{(place.population / 1000000).toFixed(2)}M Pop</div>
                </div>
              </div>

              <div className="my-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Religion:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{place.mainReligion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scripture:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{place.bibleAvailability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Churches:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{place.churchesCount} known</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic mb-2">
                "{place.strategicRecommendations}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{place.prayerRequests?.length || 2} Prayer Burdens</span>
              </span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Inspect Locus</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Place Inspection Modal Drawer */}
      {activePlaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-amber-500 text-slate-950 rounded">
                    {activePlaceModal.type}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {activePlaceModal.name}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Located in {activePlaceModal.countryName} · Coordinates: {activePlaceModal.coordinates.lat}°N, {activePlaceModal.coordinates.lng}°E
                </p>
              </div>

              <button
                onClick={() => setActivePlaceModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Population</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {(activePlaceModal.population / 1000000).toFixed(2)} Million
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Main Religion</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {activePlaceModal.mainReligion}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Evangelical %</span>
                <div className="text-base font-bold text-amber-500 mt-0.5">
                  {activePlaceModal.percentEvangelical}%
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Churches Planted</span>
                <div className="text-base font-bold text-blue-500 mt-0.5">
                  {activePlaceModal.churchesCount}
                </div>
              </div>
            </div>

            {/* In-depth details */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Language & Scripture Translation Status</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Primary Languages: <strong>{activePlaceModal.languages.join(', ')}</strong>
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Bible Availability: <strong>{activePlaceModal.bibleAvailability}</strong>
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Missionary Presence: <strong>{activePlaceModal.missionaryPresence}</strong>
                </p>
              </div>

              {/* Strategic recommendations */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-1.5">
                <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>Strategic Pioneer Recommendations</span>
                </div>
                <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                  {activePlaceModal.strategicRecommendations}
                </p>
                <p className="text-amber-800/80 dark:text-amber-300/80 text-xs">
                  <strong>Risk Notes:</strong> {activePlaceModal.riskNotes}
                </p>
              </div>

              {/* Prayer Points for this group */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-2">
                <div className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-blue-600" />
                  <span>Field Intercession Burdens</span>
                </div>
                <ul className="space-y-1 text-blue-950 dark:text-blue-200 list-disc list-inside">
                  {activePlaceModal.prayerRequests.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onSelectCountry(activePlaceModal.countryCode);
                  setActivePlaceModal(null);
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View {activePlaceModal.countryName} Country Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  onOpenCreatePrayer(`${activePlaceModal.name} (${activePlaceModal.countryName})`);
                  setActivePlaceModal(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
              >
                Broadcast Prayer for {activePlaceModal.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Survey Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Submit Field Survey on Unreached People Group
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newPlace: UnreachedPlace = {
                  id: `upg-${Date.now()}`,
                  countryCode: (formData.get('countryCode') as string) || 'AF',
                  countryName: (formData.get('countryName') as string) || 'Field Region',
                  name: formData.get('name') as string,
                  type: 'People Group',
                  population: Number(formData.get('population')) || 500000,
                  mainReligion: (formData.get('religion') as string) || 'Islam',
                  languages: [(formData.get('languages') as string) || 'Indigenous Dialect'],
                  gospelAccessStatus: 'Unreached',
                  percentEvangelical: 0.01,
                  churchesCount: 0,
                  bibleAvailability: 'None',
                  missionaryPresence: 'Pioneer Needed',
                  prayerRequests: [(formData.get('prayer') as string) || 'Pray for hearts to be prepared.'],
                  coordinates: { lat: 25.0, lng: 55.0 },
                  riskNotes: 'Persecution context. Maintain caution.',
                  strategicRecommendations: (formData.get('strategy') as string) || 'Establish medical and translation bridges.'
                };
                storage.addUnreachedPlace(newPlace);
                setIsAddModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Tribe or Place Name *</label>
                <input required name="name" placeholder="e.g. Nuristani Tribe, Gorgan Valley" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Country Name *</label>
                  <input required name="countryName" placeholder="e.g. Pakistan" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select name="type" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                    <option value="Tribe/People Group">Tribe/People Group</option>
                    <option value="Village">Village</option>
                    <option value="City">City</option>
                    <option value="State/Province">State/Province</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Approximate Population</label>
                <input type="number" name="population" placeholder="e.g. 1500000" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Strategic Missional Recommendations</label>
                <textarea name="strategy" rows={2} placeholder="Actionable recommendations for pioneer church planters..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow">Log Unreached Place</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
