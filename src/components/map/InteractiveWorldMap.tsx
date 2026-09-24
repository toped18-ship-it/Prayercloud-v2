import React, { useState, useMemo } from 'react';
import { Country, UnreachedPlace } from '../../types';
import {
  Globe,
  MapPin,
  Users,
  Flame,
  CheckCircle2,
  XCircle,
  Search,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
  HeartHandshake,
  PieChart,
  BarChart3,
  X
} from 'lucide-react';

interface InteractiveWorldMapProps {
  countries: Country[];
  places: UnreachedPlace[];
  onSelectCountry: (countryCode: string) => void;
  onSelectPlace?: (placeId: string) => void;
  onOpenCreatePrayer?: (context?: string) => void;
}

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  countries,
  places,
  onSelectCountry,
  onSelectPlace,
  onOpenCreatePrayer
}) => {
  // Reach Filter: all | unreached | reached
  const [reachFilter, setReachFilter] = useState<'all' | 'unreached' | 'reached'>('all');
  
  // Religion Filter: all | Islam | Hinduism | Buddhism | Christianity | Ethnic | Non-Religious
  const [religionFilter, setReligionFilter] = useState<string>('all');

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // Selected place or country
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(() => countries.find(c => c.code === 'AF') || countries[0] || null);
  const [selectedPlace, setSelectedPlace] = useState<UnreachedPlace | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  // Mapped SVG coordinates for sovereign countries & strategic locations across all continents
  const countryNodes = useMemo(() => {
    const coordsMap: Record<string, { x: number; y: number; label: string }> = {
      AF: { x: 660, y: 220, label: 'Afghanistan' },
      YE: { x: 620, y: 310, label: 'Yemen' },
      SO: { x: 625, y: 360, label: 'Somalia' },
      TR: { x: 575, y: 195, label: 'Turkey' },
      IN: { x: 720, y: 265, label: 'India' },
      PK: { x: 670, y: 245, label: 'Pakistan' },
      IR: { x: 625, y: 225, label: 'Iran' },
      CN: { x: 800, y: 215, label: 'China' },
      SA: { x: 600, y: 270, label: 'Saudi Arabia' },
      BD: { x: 750, y: 265, label: 'Bangladesh' },
      ID: { x: 835, y: 380, label: 'Indonesia' },
      JP: { x: 895, y: 215, label: 'Japan' },
      KP: { x: 865, y: 200, label: 'North Korea' },
      NG: { x: 480, y: 320, label: 'Nigeria' },
      EG: { x: 550, y: 255, label: 'Egypt' },
      MA: { x: 440, y: 230, label: 'Morocco' },
      US: { x: 230, y: 195, label: 'USA' },
      BR: { x: 340, y: 400, label: 'Brazil' },
      GB: { x: 460, y: 155, label: 'UK' },
      KR: { x: 860, y: 215, label: 'South Korea' },
      FR: { x: 475, y: 175, label: 'France' },
      KE: { x: 580, y: 360, label: 'Kenya' },
      ET: { x: 585, y: 330, label: 'Ethiopia' },
      RU: { x: 730, y: 125, label: 'Russia' },
      AU: { x: 875, y: 470, label: 'Australia' },
      MX: { x: 200, y: 265, label: 'Mexico' },
      ZA: { x: 540, y: 470, label: 'South Africa' },
      PH: { x: 845, y: 310, label: 'Philippines' },
      MM: { x: 765, y: 275, label: 'Myanmar' },
      DZ: { x: 470, y: 235, label: 'Algeria' },
      IQ: { x: 605, y: 230, label: 'Iraq' },
      SY: { x: 585, y: 220, label: 'Syria' },
      TH: { x: 780, y: 300, label: 'Thailand' },
      VN: { x: 805, y: 295, label: 'Vietnam' },
      NP: { x: 730, y: 240, label: 'Nepal' },
      KZ: { x: 680, y: 165, label: 'Kazakhstan' },
      UZ: { x: 655, y: 190, label: 'Uzbekistan' },
      SD: { x: 560, y: 310, label: 'Sudan' },
      NE: { x: 475, y: 290, label: 'Niger' },
      ML: { x: 435, y: 290, label: 'Mali' },
      DE: { x: 495, y: 160, label: 'Germany' },
      CA: { x: 210, y: 140, label: 'Canada' },
      AR: { x: 310, y: 480, label: 'Argentina' }
    };

    return countries.map(c => {
      const pos = coordsMap[c.code] || {
        x: 150 + ((c.name.charCodeAt(0) * 23) % 700),
        y: 120 + ((c.name.charCodeAt(1) * 17) % 360),
        label: c.name
      };

      // Determine reach classification:
      // Unreached = evangelical < 2% or unreachedPopulationPercentage >= 50%
      const isUnreached = c.unreachedPopulationPercentage >= 50 || c.evangelicalPercentage < 2;

      // Primary dominant religion
      const primaryRel = c.dominantReligions?.[0]?.religion || 'Islam';

      return {
        ...c,
        x: pos.x,
        y: pos.y,
        isUnreached,
        primaryRel
      };
    });
  }, [countries]);

  // Filtered countries based on Reach status and Religion
  const filteredNodes = useMemo(() => {
    return countryNodes.filter(node => {
      // Reach Filter
      if (reachFilter === 'unreached' && !node.isUnreached) return false;
      if (reachFilter === 'reached' && node.isUnreached) return false;

      // Religion Filter
      if (religionFilter !== 'all') {
        const hasReligion = node.dominantReligions?.some(r =>
          r.religion.toLowerCase().includes(religionFilter.toLowerCase())
        );
        if (!hasReligion) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          node.name.toLowerCase().includes(q) ||
          node.primaryRel.toLowerCase().includes(q) ||
          node.capitalCity?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [countryNodes, reachFilter, religionFilter, searchQuery]);

  // Unreached places node mapping
  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      if (reachFilter === 'reached' && p.gospelAccessStatus === 'Unreached') return false;
      if (reachFilter === 'unreached' && p.gospelAccessStatus === 'Reached') return false;
      if (religionFilter !== 'all' && !p.mainReligion.toLowerCase().includes(religionFilter.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.countryName.toLowerCase().includes(q) || p.mainReligion.toLowerCase().includes(q);
      }
      return true;
    });
  }, [places, reachFilter, religionFilter, searchQuery]);

  // Color helper for religion breakdown
  const getReligionColor = (rel: string) => {
    const r = rel.toLowerCase();
    if (r.includes('islam') || r.includes('muslim')) return 'bg-emerald-500 text-emerald-100';
    if (r.includes('hindu')) return 'bg-amber-500 text-amber-100';
    if (r.includes('buddh')) return 'bg-orange-500 text-orange-100';
    if (r.includes('christ') || r.includes('orthodox') || r.includes('catholic') || r.includes('protestant')) return 'bg-blue-500 text-blue-100';
    if (r.includes('animis') || r.includes('ethnic') || r.includes('tribal') || r.includes('folk')) return 'bg-purple-500 text-purple-100';
    if (r.includes('secular') || r.includes('non') || r.includes('agnostic') || r.includes('atheist')) return 'bg-slate-500 text-slate-100';
    return 'bg-teal-500 text-teal-100';
  };

  const getReligionBarColor = (rel: string) => {
    const r = rel.toLowerCase();
    if (r.includes('islam') || r.includes('muslim')) return '#10b981';
    if (r.includes('hindu')) return '#f59e0b';
    if (r.includes('buddh')) return '#f97316';
    if (r.includes('christ') || r.includes('orthodox') || r.includes('catholic') || r.includes('protestant')) return '#3b82f6';
    if (r.includes('animis') || r.includes('ethnic') || r.includes('tribal') || r.includes('folk')) return '#a855f7';
    if (r.includes('secular') || r.includes('non') || r.includes('agnostic') || r.includes('atheist')) return '#64748b';
    return '#14b8a6';
  };

  return (
    <div className="w-full bg-[#121622] rounded-3xl overflow-hidden border border-[#262f43] shadow-2xl text-white flex flex-col">
      
      {/* Top Controls Header */}
      <div className="p-4 sm:p-6 border-b border-[#262f43] bg-[#161b26] space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>Global Reached & Unreached Tracker with Religion Statistics</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tracking world gospel access status (🔴 Unreached vs. 🟢 Reached) & comprehensive religious demographic percentages.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nation, place, or religion..."
              className="w-full pl-9 pr-3 py-2 bg-[#1f2738] border border-[#2f3950] rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters Bar: 1) Reach Status Toggle & 2) Major World Religions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#232a3b]">
          
          {/* Reach Status Filter */}
          <div className="flex items-center gap-1 bg-[#1f2738] p-1 rounded-xl border border-[#2f3950]">
            <span className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Status:</span>
            
            <button
              onClick={() => setReachFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                reachFilter === 'all'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Nations ({countries.length})
            </button>

            <button
              onClick={() => setReachFilter('unreached')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                reachFilter === 'unreached'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-red-400 hover:text-red-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Unreached Places (UPGs)</span>
            </button>

            <button
              onClick={() => setReachFilter('reached')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                reachFilter === 'reached'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Reached Places</span>
            </button>
          </div>

          {/* Major Religion Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Religion:</span>
            {[
              { id: 'all', label: 'All Religions' },
              { id: 'Islam', label: '☪️ Islam' },
              { id: 'Hindu', label: '🕉️ Hinduism' },
              { id: 'Buddh', label: '☸️ Buddhism' },
              { id: 'Christ', label: '✝️ Christianity' },
              { id: 'Animis', label: '🌿 Tribal/Ethnic' },
              { id: 'Secular', label: '⚛️ Non-Religious' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setReligionFilter(r.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  religionFilter === r.id
                    ? 'bg-[#0e71eb] text-white shadow'
                    : 'bg-[#1a2130] text-slate-300 hover:text-white hover:bg-[#252f44]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main Interactive Map & Details Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[520px]">
        
        {/* Left 8 Columns: Interactive World Map Graphic */}
        <div className="lg:col-span-8 relative bg-[#0b0e17] overflow-hidden flex flex-col justify-between p-4 border-b lg:border-b-0 lg:border-r border-[#262f43]">
          
          {/* Subtle Lat/Lng Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b2234_1px,transparent_1px),linear-gradient(to_bottom,#1b2234_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          {/* 10/40 Window Geographical Band Overlay */}
          <div className="absolute left-0 right-0 top-[31%] h-[33%] bg-amber-500/5 border-y border-dashed border-amber-500/20 pointer-events-none flex items-center justify-between px-4 z-0">
            <span className="text-[9px] font-mono text-amber-400/60 uppercase">Latitude 40°N</span>
            <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest bg-[#0b0e17]/80 px-2 py-0.5 rounded border border-amber-500/20">
              10/40 Window: 85% of Unreached World
            </span>
            <span className="text-[9px] font-mono text-amber-400/60 uppercase">Latitude 10°N</span>
          </div>

          {/* Map Legend Overlay */}
          <div className="relative z-10 flex items-center gap-3 bg-[#161b26]/90 backdrop-blur-md p-2 rounded-xl border border-[#2a3754] text-[11px] self-start mb-2 shadow-lg">
            <span className="font-bold text-slate-300">Map Legend:</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-red-300" />
              <span className="text-red-300 font-semibold">🔴 Unreached (&lt;2% Evangelical)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
              <span className="text-emerald-300 font-semibold">🟢 Reached</span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[400px] sm:h-[460px] flex items-center justify-center">
            <svg viewBox="0 0 1000 580" className="w-full h-full max-w-4xl">
              
              {/* World Continents Background Shapes */}
              <g fill="#1a2338" stroke="#283552" strokeWidth="1" opacity="0.6">
                {/* North America */}
                <path d="M130,110 Q190,80 290,100 Q330,130 290,190 Q270,240 220,270 Q170,240 140,170 Z" />
                {/* South America */}
                <path d="M280,300 Q370,320 380,390 Q340,500 310,540 Q260,450 280,350 Z" />
                {/* Europe */}
                <path d="M430,110 Q540,100 570,150 Q520,200 450,200 Q420,160 430,110 Z" />
                {/* Africa */}
                <path d="M420,210 Q580,200 600,290 Q590,400 520,500 Q470,450 420,330 Q400,250 420,210 Z" />
                {/* Asia */}
                <path d="M560,110 Q790,90 900,170 Q920,270 820,330 Q740,320 650,260 Q580,230 560,110 Z" />
                {/* Australia */}
                <path d="M790,420 Q920,410 930,480 Q850,540 780,480 Z" />
              </g>

              {/* Connecting Global Prayer Arcs */}
              <path d="M230,195 Q450,70 660,220" fill="none" stroke="#0e71eb" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <path d="M460,155 Q600,90 720,265" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <path d="M480,320 Q600,270 835,380" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

              {/* Country Nodes with Reached (Green) / Unreached (Red) and Religion indicator */}
              {filteredNodes.map((node) => {
                const isSelected = selectedCountry?.id === node.id;
                const isHovered = hoveredEntity === node.id;
                const isUnreached = node.isUnreached;

                const nodeRadius = Math.max(8, Math.min(16, Math.log10(node.population) * 2));

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-all transform hover:scale-125"
                    onClick={() => {
                      setSelectedCountry(node);
                      setSelectedPlace(null);
                    }}
                    onMouseEnter={() => setHoveredEntity(node.id)}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    {/* Pulsing Outer Ring for Unreached */}
                    {isUnreached && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={nodeRadius + 6}
                        fill="#ef4444"
                        opacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius}
                      fill={isUnreached ? '#ef4444' : '#10b981'}
                      stroke={isSelected ? '#ffffff' : isUnreached ? '#fca5a5' : '#86efac'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="shadow-lg"
                    />

                    {/* Center Icon Dot */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={2.5}
                      fill="#ffffff"
                    />

                    {/* Nation Name Label */}
                    <text
                      x={node.x}
                      y={node.y + nodeRadius + 11}
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : isUnreached ? '#fca5a5' : '#86efac'}
                      fontSize="9.5"
                      fontWeight={isSelected ? 'bold' : '600'}
                      className="pointer-events-none drop-shadow-md"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}

            </svg>
          </div>

          {/* Bottom Live Data Ribbon */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 bg-[#161b26]/90 backdrop-blur-md p-3 rounded-2xl border border-[#2a3754] mt-2">
            <div>
              <span>Displaying: </span>
              <strong className="text-white">{filteredNodes.length} Nations</strong> &{' '}
              <strong className="text-white">{filteredPlaces.length} Specific Unreached Places</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-semibold">
                {countryNodes.filter(c => c.isUnreached).length} Unreached
              </span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">
                {countryNodes.filter(c => !c.isUnreached).length} Reached
              </span>
            </div>
          </div>

        </div>

        {/* Right 4 Columns: Detailed Religion Statistics & Reach Dossier */}
        <div className="lg:col-span-4 bg-[#161b26] p-5 sm:p-6 flex flex-col justify-between space-y-5 overflow-y-auto">
          
          {selectedCountry ? (
            <div className="space-y-5">
              
              {/* Header: Name, Flag, Reach Status Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-[#262f43] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedCountry.flag}</span>
                    <h3 className="font-extrabold text-lg text-white">
                      {selectedCountry.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedCountry.capitalCity} · {selectedCountry.continent}
                  </p>
                </div>

                {/* Reach Badge */}
                <div className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-md ${
                  selectedCountry.unreachedPopulationPercentage >= 50 || selectedCountry.evangelicalPercentage < 2
                    ? 'bg-red-950 text-red-300 border border-red-700'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}>
                  {selectedCountry.unreachedPopulationPercentage >= 50 || selectedCountry.evangelicalPercentage < 2 ? (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>UNREACHED</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>REACHED</span>
                    </>
                  )}
                </div>
              </div>

              {/* RELIGION STATISTICS BREAKDOWN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <PieChart className="w-4 h-4 text-[#0e71eb]" />
                    <span>Religion Statistics Breakdown</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">100% Population</span>
                </div>

                {/* Visual Religion Percentage Bars */}
                <div className="space-y-2.5 bg-[#121622] p-3.5 rounded-2xl border border-[#262f43]">
                  {selectedCountry.dominantReligions?.map((rel, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-semibold">{rel.religion}</span>
                        <strong className="text-white font-mono">{rel.percentage}%</strong>
                      </div>
                      <div className="w-full h-2 bg-[#1f2738] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${rel.percentage}%`,
                            backgroundColor: getReligionBarColor(rel.religion)
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Evangelical Christian Specific % */}
                  <div className="pt-2 border-t border-[#1f2738] flex items-center justify-between text-xs">
                    <span className="text-blue-400 font-semibold flex items-center gap-1">
                      <span>✝️ Evangelical Christian Base:</span>
                    </span>
                    <strong className="font-mono text-blue-300 text-sm">
                      {selectedCountry.evangelicalPercentage}%
                    </strong>
                  </div>
                </div>
              </div>

              {/* Population & UPG Metrics */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-[#121622] rounded-xl border border-[#262f43]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Population</span>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {selectedCountry.population.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-[#121622] rounded-xl border border-[#262f43]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Unreached People Groups</span>
                  <div className="text-base font-bold font-mono text-red-400 mt-0.5">
                    {selectedCountry.unreachedPeopleGroupsCount} Groups
                  </div>
                </div>
              </div>

              {/* Key Prayer Focus Points */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Strategic Prayer Target:</span>
                <div className="p-3 bg-[#1a2130] rounded-xl border border-[#2a3449] text-xs text-slate-300 leading-relaxed">
                  {selectedCountry.prayerPoints?.[0] || `Pray for breakthrough among unreached language groups and open doors for biblical scripture translation.`}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onSelectCountry(selectedCountry.code)}
                  className="flex-1 py-2.5 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Full Country Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onOpenCreatePrayer && (
                  <button
                    onClick={() => onOpenCreatePrayer(selectedCountry.name)}
                    className="px-4 py-2.5 bg-[#f26d21] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Pray Now</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <Globe className="w-10 h-10 text-[#0e71eb]" />
              <p className="font-bold text-white text-sm">Select any Nation on the Map</p>
              <p className="text-xs">Click on any red (unreached) or green (reached) node to view full religious statistics and prayer points.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
