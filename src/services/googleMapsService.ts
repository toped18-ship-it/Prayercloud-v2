/**
 * Google Maps Platform Service (Modern JS SDK & Places API New)
 * 
 * Provides utility methods for Places API (New), Routes API, and Geocoding
 * for the World Map and Unreached Places modules.
 * Attribution ID: gmp_mcp_codeassist_v1_aistudio
 */

declare global {
  interface Window {
    google?: any;
    gm_authFailure?: () => void;
  }
}

export interface GooglePlaceResult {
  placeId: string;
  name: string;
  displayName: string;
  formattedAddress?: string;
  location: { lat: number; lng: number };
  types?: string[];
  rating?: number;
  userRatingCount?: number;
  photos?: { url: string; authorAttributions?: string[] }[];
  nationalPhoneNumber?: string;
  websiteUri?: string;
  regularOpeningHours?: any;
  summary?: string;
}

export interface RouteComputationResult {
  distanceMeters: number;
  distanceText: string;
  durationText: string;
  durationString: string;
  originAddress: string;
  destinationAddress: string;
  polylinePath: { lat: number; lng: number }[];
  polylineCoordinates: { lat: number; lng: number }[];
  steps: { instruction: string; distance: string; duration: string }[];
}

export type PlaceSearchResult = GooglePlaceResult;
export type RouteCalculationResult = RouteComputationResult;

class GoogleMapsService {
  private isLoaded = false;
  private loadPromise: Promise<any> | null = null;
  private apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  constructor() {
    this.setupQuotaListener();
  }

  /**
   * Two-Tier Quota & Error listener
   */
  private setupQuotaListener() {
    if (typeof window !== 'undefined') {
      window.gm_authFailure = () => {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      };
      
      const origError = console.error;
      console.error = (...args: unknown[]) => {
        origError.apply(console, args);
        const msg = args.map((a) => String(a)).join(' ');
        if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
      };
    }
  }

  public getApiKey(): string {
    return this.apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  }

  public isKeyConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5 && !key.includes('PLACEHOLDER'));
  }

  /**
   * Initializes Google Maps JavaScript API libraries dynamically
   */
  public async initLibraries(): Promise<any> {
    if (this.isLoaded && window.google) return window.google;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise(async (resolve, reject) => {
      try {
        if (!window.google?.maps) {
          const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
          if (!existingScript && this.isKeyConfigured()) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.getApiKey()}&libraries=places,marker,geometry,routes&v=weekly`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
              this.isLoaded = true;
              resolve(window.google);
            };
            script.onerror = (err) => {
              reject(err);
            };
            document.head.appendChild(script);
            return;
          }
        }
        this.isLoaded = true;
        resolve(window.google);
      } catch (err) {
        reject(err);
      }
    });

    return this.loadPromise;
  }

  /**
   * Search real-time places via Places API (New) Text Search
   */
  public async searchPlaces(query: string, locationBias?: { lat: number; lng: number; radiusMeters?: number }): Promise<GooglePlaceResult[]> {
    try {
      const g = await this.initLibraries();
      if (!g?.maps?.places?.Place) {
        if (g?.maps?.importLibrary) {
          await g.maps.importLibrary('places');
        }
      }

      const Place = g?.maps?.places?.Place;
      if (Place && typeof Place.searchByText === 'function') {
        const request: any = {
          textQuery: query,
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'types',
            'rating',
            'userRatingCount',
            'photos',
            'editorialSummary'
          ]
        };

        if (locationBias) {
          request.locationBias = {
            center: { lat: locationBias.lat, lng: locationBias.lng },
            radius: locationBias.radiusMeters || 50000
          };
        }

        const { places } = await Place.searchByText(request);
        if (places && places.length > 0) {
          return places.map((p: any) => {
            const name = typeof p.displayName === 'string' ? p.displayName : p.displayName?.text || query;
            return {
              placeId: p.id || '',
              name,
              displayName: name,
              formattedAddress: p.formattedAddress || '',
              location: {
                lat: typeof p.location?.lat === 'function' ? p.location.lat() : (p.location?.lat ?? 0),
                lng: typeof p.location?.lng === 'function' ? p.location.lng() : (p.location?.lng ?? 0)
              },
              types: p.types || [],
              rating: p.rating,
              userRatingCount: p.userRatingCount,
              summary: p.editorialSummary?.text,
              photos: p.photos?.slice(0, 3).map((photo: any) => ({
                url: typeof photo.getURI === 'function' ? photo.getURI({ maxWidth: 800 }) : ''
              }))
            };
          });
        }
      }

      // Fallback geocode search if Places searchByText is not available
      if (g?.maps?.Geocoder) {
        const geocoder = new g.maps.Geocoder();
        const res = await geocoder.geocode({ address: query });
        if (res.results && res.results.length > 0) {
          return res.results.map((r: any) => ({
            placeId: r.place_id,
            name: r.formatted_address,
            displayName: r.formatted_address,
            formattedAddress: r.formatted_address,
            location: {
              lat: r.geometry.location.lat(),
              lng: r.geometry.location.lng()
            },
            types: r.types || []
          }));
        }
      }

      return [];
    } catch (err: any) {
      console.warn('Google Maps Places search error:', err);
      return [];
    }
  }

  public async searchPlace(query: string): Promise<GooglePlaceResult[]> {
    return this.searchPlaces(query);
  }

  /**
   * Calculate live mission route between origin and destination
   */
  public async calculateRoute(origin: string, destination: string, travelMode: string = 'DRIVING'): Promise<RouteComputationResult | null> {
    try {
      const g = await this.initLibraries();
      if (!g?.maps?.DirectionsService) return null;

      const directionsService = new g.maps.DirectionsService();
      const mode = (g.maps.TravelMode as any)[travelMode] || g.maps.TravelMode.DRIVING;

      const response = await directionsService.route({
        origin,
        destination,
        travelMode: mode
      });

      if (response && response.routes && response.routes.length > 0) {
        const route = response.routes[0];
        const leg = route.legs[0];

        const pathCoords = route.overview_path.map((latLng: any) => ({
          lat: typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat,
          lng: typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng
        }));

        const steps = (leg.steps || []).map((step: any) => ({
          instruction: step.instructions ? step.instructions.replace(/<[^>]*>?/gm, '') : '',
          distance: step.distance?.text || '',
          duration: step.duration?.text || ''
        }));

        return {
          distanceMeters: leg.distance?.value || 0,
          distanceText: leg.distance?.text || '',
          durationText: leg.duration?.text || '',
          durationString: leg.duration?.text || '',
          originAddress: leg.start_address || origin,
          destinationAddress: leg.end_address || destination,
          polylinePath: pathCoords,
          polylineCoordinates: pathCoords,
          steps
        };
      }
      return null;
    } catch (err) {
      console.warn('Google Maps route calculation failed:', err);
      return null;
    }
  }

  /**
   * Fetch detailed place information and photos by Place ID using Place.fetchFields
   */
  public async getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
    try {
      const g = await this.initLibraries();
      if (!g?.maps?.places?.Place) {
        if (g?.maps?.importLibrary) await g.maps.importLibrary('places');
      }
      const Place = g?.maps?.places?.Place;
      if (!Place) return null;

      const place = new Place({ id: placeId });

      await place.fetchFields({
        fields: [
          'id',
          'displayName',
          'formattedAddress',
          'location',
          'types',
          'rating',
          'photos',
          'editorialSummary',
          'nationalPhoneNumber',
          'websiteURI'
        ]
      });

      const name = typeof place.displayName === 'string' ? place.displayName : place.displayName?.text || '';

      return {
        placeId: place.id,
        name,
        displayName: name,
        formattedAddress: place.formattedAddress || '',
        location: {
          lat: typeof place.location?.lat === 'function' ? place.location.lat() : 0,
          lng: typeof place.location?.lng === 'function' ? place.location.lng() : 0
        },
        types: place.types || [],
        rating: place.rating,
        summary: place.editorialSummary?.text,
        websiteUri: place.websiteURI,
        nationalPhoneNumber: place.nationalPhoneNumber,
        photos: place.photos?.slice(0, 4).map((photo: any) => ({
          url: typeof photo.getURI === 'function' ? photo.getURI({ maxWidth: 800 }) : ''
        }))
      };
    } catch (err) {
      console.warn('Could not fetch place details:', err);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to get country and regional district details
   */
  public async getGeographicInfo(lat: number, lng: number): Promise<{ address: string; country: string; locality: string } | null> {
    try {
      const g = await this.initLibraries();
      if (!g?.maps?.Geocoder) return null;

      const geocoder = new g.maps.Geocoder();
      const res = await geocoder.geocode({ location: { lat, lng } });

      if (res.results && res.results.length > 0) {
        const first = res.results[0];
        let country = '';
        let locality = '';

        (first.address_components || []).forEach((c: any) => {
          if (c.types.includes('country')) country = c.long_name;
          if (c.types.includes('locality') || c.types.includes('administrative_area_level_1')) locality = c.long_name;
        });

        return {
          address: first.formatted_address,
          country,
          locality
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}

export const googleMapsService = new GoogleMapsService();
export const GoogleMapsAgentService = googleMapsService;
export const loadGoogleMaps = () => googleMapsService.initLibraries();
