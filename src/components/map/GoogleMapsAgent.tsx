import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Compass,
  Layers,
  Sparkles,
  Shield,
  Clock,
  Car,
  Plane,
  HeartHandshake,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Route as RouteIcon,
  Crosshair,
  Info
} from 'lucide-react';
import { loadGoogleMaps, GoogleMapsAgentService, PlaceSearchResult, RouteCalculationResult } from '../../services/googleMapsService';
import { UnreachedPlace, Country } from '../../types';

interface GoogleMapsAgentProps {
  unreachedPlaces: UnreachedPlace[];
  countries: Country[];
  onSelectCountry?: (code: string) => void;
  onOpenCreatePrayer?: (context: string) => void;
  initialDestination?: string;
}

export const GoogleMapsAgent: React.FC<GoogleMapsAgentProps> = ({
  unreachedPlaces,
  countries,
  onSelectCountry,
  onOpenCreatePrayer,
  initialDestination
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  // States
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<PlaceSearchResult | null>(null);

  // Route Planning state
  const [originInput, setOriginInput] = useState('Islamabad, Pakistan');
  const [destinationInput, setDestinationInput] = useState(initialDestination || 'Swat Valley, Pakistan');
  const [travelMode, setTravelMode] = useState<string>('DRIVING');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteCalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'routes' | 'places' | 'unreached'>('routes');

  // Pre-configured strategic frontier mission corridors
  const missionCorridors = [
    {
      name: 'Pashtun Frontier Corridor',
      origin: 'Peshawar, Pakistan',
      destination: 'Mingora, Swat Valley, Pakistan',
      focus: 'Pashtun & Kohistani Peoples',
      distance: '~175 km',
      risk: 'High (Persecution Zone)'
    },
    {
      name: 'Horns of Africa Desert Passage',
      origin: 'Nairobi, Kenya',
      destination: 'Lodwar, Turkana, Kenya',
      focus: 'Turkana & Somali Nomads',
      distance: '~660 km',
      risk: 'Moderate (Remote Desert)'
    },
    {
      name: 'Himalayan Frontier Path',
      origin: 'Kathmandu, Nepal',
      destination: 'Jomsom, Mustang, Nepal',
      focus: 'Tibetan-Buddhist Mountain Tribes',
      distance: '~370 km',
      risk: 'Extreme High Altitude'
    },
    {
      name: 'Sinai Bedouin Trail',
      origin: 'Cairo, Egypt',
      destination: 'Saint Catherine, Sinai, Egypt',
      focus: 'Bedouin Tribes of Sinai',
      distance: '~450 km',
      risk: 'Restricted Access'
    }
  ];

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        const g: any = await loadGoogleMaps();
        if (!isMounted || !mapContainerRef.current || !g?.maps) return;

        // Center on 10/40 window hub
        const map = new g.maps.Map(mapContainerRef.current, {
          center: { lat: 30.0, lng: 65.0 }, // Middle East / South Asia hub
          zoom: 4,
          mapTypeId: 'terrain',
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: g.maps.ControlPosition.TOP_RIGHT
          },
          styles: [
            {
              featureType: 'administrative.country',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#3b82f6' }, { weight: 1.2 }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#0f172a' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry.fill',
              stylers: [{ color: '#1e293b' }]
            }
          ]
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new g.maps.InfoWindow();
        setIsMapLoaded(true);

        // Populate Unreached Place Markers
        renderUnreachedMarkers(g, map);
      } catch (err: any) {
        console.error('Failed to load Google Maps:', err);
        setMapError(err?.message || 'Unable to load real-time Google Maps data. Check network.');
      }
    }

    initMap();

    return () => {
      isMounted = false;
      // Cleanup markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // Render unreached place markers
  const renderUnreachedMarkers = (g: any, map: any) => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    unreachedPlaces.forEach(place => {
      const marker = new g.maps.Marker({
        position: { lat: place.coordinates.lat, lng: place.coordinates.lng },
        map: map,
        title: place.name,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#ef4444',
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          const content = `
            <div style="color: #0f172a; padding: 6px; font-family: sans-serif; max-width: 240px;">
              <h4 style="margin: 0; font-weight: bold; font-size: 14px;">${place.name}</h4>
              <p style="margin: 3px 0 6px 0; font-size: 11px; color: #64748b;">${place.countryName} · ${place.mainReligion}</p>
              <div style="font-size: 11px; margin-bottom: 6px;">
                <strong>Population:</strong> ${(place.population / 1000).toLocaleString()}k<br/>
                <strong>Gospel Access:</strong> ${place.gospelAccessStatus}
              </div>
              <div style="color: #2563eb; font-weight: bold; font-size: 10px;">Click 'Set as Destination' in Agent</div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);
        }
        setDestinationInput(`${place.name}, ${place.countryName}`);
      });

      markersRef.current.push(marker);
    });
  };

  // Perform Google Maps Place search
  const handleSearchPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await GoogleMapsAgentService.searchPlace(searchQuery);
      setSearchResults(results);
      if (results.length > 0) {
        focusOnPlace(results[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Focus on a searched place
  const focusOnPlace = (place: PlaceSearchResult) => {
    setSelectedPlaceInfo(place);
    if (mapInstanceRef.current && window.google) {
      mapInstanceRef.current.setCenter(place.location);
      mapInstanceRef.current.setZoom(11);

      // Add a highlighted search marker
      const g = window.google;
      new g.maps.Marker({
        position: place.location,
        map: mapInstanceRef.current,
        title: place.name,
        animation: g.maps.Animation.DROP
      });
    }
  };

  // Calculate live route with Google Directions
  const handleCalculateRoute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!originInput.trim() || !destinationInput.trim()) return;

    setIsCalculatingRoute(true);
    setRouteResult(null);

    try {
      const mode = travelMode === 'FLYING' ? 'DRIVING' : travelMode;
      const res = await GoogleMapsAgentService.calculateRoute(originInput, destinationInput, mode);
      setRouteResult(res);

      if (res && mapInstanceRef.current && window.google) {
        const g = window.google;

        // Clear existing polyline
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
        }

        // Draw new route polyline
        const pathCoords = res.polylinePath.map(p => new g.maps.LatLng(p.lat, p.lng));
        const poly = new g.maps.Polyline({
          path: pathCoords,
          geodesic: true,
          strokeColor: '#38bdf8',
          strokeOpacity: 0.9,
          strokeWeight: 5,
          map: mapInstanceRef.current
        });
        polylineRef.current = poly;

        // Fit map bounds to show whole route
        const bounds = new g.maps.LatLngBounds();
        pathCoords.forEach(c => bounds.extend(c));
        mapInstanceRef.current.fitBounds(bounds, 60);
      }
    } catch (err) {
      console.error('Route calculation error:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
      
      {/* Sidebar Control Agent */}
      <div className="w-full lg:w-96 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between bg-slate-900/95 backdrop-blur-md shrink-0 space-y-5">
        <div className="space-y-4">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Google Maps Field Navigator Agent</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Frontier Route & Terrain Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time Google Maps geocoding, directions, and mission path planning for unreached frontiers.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('routes')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'routes' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <RouteIcon className="w-3.5 h-3.5" />
              <span>Route Agent</span>
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'places' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Place Search</span>
            </button>
            <button
              onClick={() => setActiveTab('unreached')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'unreached' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Hotspots ({unreachedPlaces.length})</span>
            </button>
          </div>

          {/* TAB 1: Route Planning */}
          {activeTab === 'routes' && (
            <div className="space-y-3.5">
              <form onSubmit={handleCalculateRoute} className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Origin / Basecamp (City or Coordinates)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={originInput}
                      onChange={(e) => setOriginInput(e.target.value)}
                      placeholder="e.g. Islamabad, Pakistan"
                      className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Frontier Destination (Unreached Place)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={destinationInput}
                      onChange={(e) => setDestinationInput(e.target.value)}
                      placeholder="e.g. Swat Valley, Pakistan"
                      className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <Crosshair className="w-3.5 h-3.5 text-red-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isCalculatingRoute}
                    className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isCalculatingRoute ? (
                      <span className="flex items-center gap-1.5 text-white">
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Calculating Route...
                      </span>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 fill-slate-950" />
                        <span>Calculate Real-Time Route</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Strategic Corridor Presets */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Strategic Mission Corridors
                </span>
                <div className="space-y-1.5 mt-1.5 max-h-36 overflow-y-auto pr-1">
                  {missionCorridors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setOriginInput(c.origin);
                        setDestinationInput(c.destination);
                        handleCalculateRoute();
                      }}
                      className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-sky-500/50 transition-all text-xs flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-200 group-hover:text-sky-300">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {c.focus} · {c.distance}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Route Summary if computed */}
              {routeResult && (
                <div className="p-3 bg-sky-950/40 border border-sky-800/60 rounded-2xl space-y-2 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between font-bold text-sky-300">
                    <span className="flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" />
                      <span>{routeResult.distanceText}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{routeResult.durationText} ETA</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    <strong>Route:</strong> {routeResult.originAddress} ➔ {routeResult.destinationAddress}
                  </p>
                  <div className="pt-1.5 flex gap-2">
                    {onOpenCreatePrayer && (
                      <button
                        onClick={() => onOpenCreatePrayer(`Frontier Route to ${destinationInput}`)}
                        className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] rounded-lg shadow flex items-center justify-center gap-1"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>Pray for this Route</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Place Search */}
          {activeTab === 'places' && (
            <div className="space-y-3">
              <form onSubmit={handleSearchPlace} className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any town, mountain, valley..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  {isSearching ? 'Querying Google Places...' : 'Search Google Maps'}
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {searchResults.map((res) => (
                    <button
                      key={res.placeId}
                      onClick={() => focusOnPlace(res)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs transition-colors"
                    >
                      <div className="font-semibold text-white">{res.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{res.formattedAddress}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedPlaceInfo && (
                <div className="p-3 bg-slate-800 rounded-xl space-y-2 text-xs border border-slate-700">
                  <div className="font-bold text-sky-400">{selectedPlaceInfo.name}</div>
                  <div className="text-[11px] text-slate-300">{selectedPlaceInfo.formattedAddress}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Lat: {selectedPlaceInfo.location.lat.toFixed(4)}, Lng: {selectedPlaceInfo.location.lng.toFixed(4)}
                  </div>
                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => {
                        setDestinationInput(selectedPlaceInfo.formattedAddress || selectedPlaceInfo.name || '');
                        setActiveTab('routes');
                      }}
                      className="flex-1 py-1 bg-sky-500 text-slate-950 font-bold rounded text-[11px]"
                    >
                      Set Destination
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Unreached Hotspots list */}
          {activeTab === 'unreached' && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {unreachedPlaces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (mapInstanceRef.current && window.google) {
                      mapInstanceRef.current.setCenter({ lat: p.coordinates.lat, lng: p.coordinates.lng });
                      mapInstanceRef.current.setZoom(8);
                    }
                    setDestinationInput(`${p.name}, ${p.countryName}`);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-red-500/40 text-xs flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>{p.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {p.countryName} · {(p.population / 1000).toLocaleString()}k souls
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 font-semibold">
                    {p.gospelAccessStatus}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Status indicator */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Google Maps Live Connected</span>
          </span>
          <span className="font-mono text-[10px] text-slate-500">Places & Routes API</span>
        </div>
      </div>

      {/* Main Interactive Map Viewport */}
      <div className="flex-1 relative min-h-[480px] lg:min-h-full bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />

        {/* Map loading overlay */}
        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-sky-300 font-semibold tracking-wide">
              Connecting to Real-Time Google Maps Platform...
            </p>
          </div>
        )}

        {/* Error notice */}
        {mapError && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
            <h4 className="text-base font-bold text-white">Google Maps Connection Alert</h4>
            <p className="text-xs text-slate-400 max-w-md mt-1">{mapError}</p>
          </div>
        )}

        {/* Quick floating overlay tags */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 shadow-xl hidden sm:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-300">Unreached Hotspot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-400" />
            <span className="text-slate-300">Mission Corridor Polyline</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono border-l border-slate-700 pl-3">
            10/40 Window Coordinate Grid
          </div>
        </div>
      </div>
    </div>
  );
};
