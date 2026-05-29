import React, { useState, useRef, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Eye, MousePointerClick, RefreshCw, Loader2, AlertCircle, Search, Navigation, User } from 'lucide-react';

// Custom Map Styling to match the premium minimalist theme of Nepal Exchange Pvt. Ltd
const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f7" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f7" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#e2e2e7" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#abc7ff" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  }
];

// Predefined cities mapping for offline fallback search geocoding
const fallbackCities = {
  "kathmandu": { lat: 27.7172, lng: 85.3240 },
  "lalitpur": { lat: 27.6710, lng: 85.3122 },
  "bhaktapur": { lat: 27.6710, lng: 85.4298 },
  "jhamsikhel": { lat: 27.6780, lng: 85.3122 },
  "baluwatar": { lat: 27.7172, lng: 85.3240 },
  "sanepa": { lat: 27.6780, lng: 85.3122 },
  "kirtipur": { lat: 27.6797, lng: 85.2778 },
  "thimi": { lat: 27.6772, lng: 85.3786 },
  "banepa": { lat: 27.6297, lng: 85.5214 },
  "dhulikhel": { lat: 27.6164, lng: 85.5386 },
  "pokhara": { lat: 28.2096, lng: 83.9856 },
  "chitwan": { lat: 27.6756, lng: 84.4284 },
  "bharatpur": { lat: 27.6756, lng: 84.4284 },
  "butwal": { lat: 27.7006, lng: 83.4484 },
  "bhairahawa": { lat: 27.5019, lng: 83.4485 },
  "nepalgunj": { lat: 28.0500, lng: 81.6167 },
  "dhangadhi": { lat: 28.6847, lng: 80.6083 },
  "biratnagar": { lat: 26.4525, lng: 87.2718 },
  "dharan": { lat: 26.8124, lng: 87.2834 },
  "itahari": { lat: 26.6644, lng: 87.2718 },
  "birgunj": { lat: 27.0122, lng: 84.8778 },
  "janakpur": { lat: 26.7271, lng: 85.9220 },
  "hetauda": { lat: 27.4264, lng: 85.0333 },
  "birtamode": { lat: 26.6393, lng: 87.9798 },
  "damak": { lat: 26.6689, lng: 87.6883 },
  "ghorahi": { lat: 28.0264, lng: 82.4936 },
  "tulsipur": { lat: 28.1287, lng: 82.2968 },
  "kalaiya": { lat: 27.0272, lng: 84.9959 },
  "lahan": { lat: 26.7167, lng: 86.4833 },
  "ilam": { lat: 26.9113, lng: 87.9254 },
  "bhadrapur": { lat: 26.5414, lng: 88.0833 },
  "inaruwa": { lat: 26.6025, lng: 87.1517 },
  "rajbiraj": { lat: 26.5411, lng: 86.7533 },
  "siraha": { lat: 26.6547, lng: 86.2081 },
  "gaighat": { lat: 26.7909, lng: 86.6977 },
  "malangwa": { lat: 26.8583, lng: 85.5583 },
  "jaleshwar": { lat: 26.6436, lng: 85.8017 },
  "gaur": { lat: 26.7628, lng: 85.2636 },
  "bidur": { lat: 27.9117, lng: 85.1611 },
  "chautara": { lat: 27.7761, lng: 85.7161 },
  "charikot": { lat: 27.6706, lng: 86.0717 },
  "manthali": { lat: 27.3872, lng: 86.0642 },
  "kamalamai": { lat: 27.2475, lng: 85.9233 },
  "panauti": { lat: 27.5847, lng: 85.5186 },
  "kaski": { lat: 28.2705, lng: 83.8964 },
  "lekhnath": { lat: 28.1691, lng: 84.0536 },
  "baglung": { lat: 28.2725, lng: 83.5908 },
  "beni": { lat: 28.3444, lng: 83.5658 },
  "kushma": { lat: 28.2239, lng: 83.6797 },
  "waling": { lat: 27.9789, lng: 83.7667 },
  "tansen": { lat: 27.8683, lng: 83.5483 },
  "sandhikharka": { lat: 27.9897, lng: 83.0458 },
  "tamghas": { lat: 28.0664, lng: 83.2500 },
  "taulihawa": { lat: 27.5375, lng: 83.0533 },
  "krishnanagar": { lat: 27.5028, lng: 82.8803 },
  "kohalpur": { lat: 28.1925, lng: 81.6917 },
  "gulariya": { lat: 28.2047, lng: 81.3364 },
  "surkhet": { lat: 28.5989, lng: 81.6322 },
  "birendranagar": { lat: 28.5989, lng: 81.6322 },
  "dailekh": { lat: 28.8419, lng: 81.7064 },
  "salyan": { lat: 28.3675, lng: 82.1644 },
  "pyuthan": { lat: 28.1008, lng: 82.8683 },
  "libang": { lat: 28.3039, lng: 82.6367 },
  "musikot": { lat: 28.6364, lng: 82.4797 },
  "jumla": { lat: 29.2747, lng: 82.1864 },
  "dunai": { lat: 28.9867, lng: 82.9114 },
  "simikot": { lat: 29.9678, lng: 81.8189 },
  "gamgadhi": { lat: 29.5294, lng: 82.1683 },
  "manang": { lat: 28.5522, lng: 84.2403 },
  "jomsom": { lat: 28.7844, lng: 83.7297 },
  "dadeldhura": { lat: 29.2978, lng: 80.5847 },
  "baitadi": { lat: 29.4089, lng: 80.4897 },
  "chainpur": { lat: 29.5539, lng: 81.2058 },
  "martadi": { lat: 29.4544, lng: 81.3033 },
  "dipayal": { lat: 29.2611, lng: 80.9392 },
  "mangalsen": { lat: 29.1161, lng: 81.2658 },
  "khalanga": { lat: 29.8456, lng: 80.5283 },
  "tikapur": { lat: 28.5000, lng: 81.1167 },
  "attariya": { lat: 28.7667, lng: 80.6667 },
  "lamki": { lat: 28.5333, lng: 81.0167 },
  "phidim": { lat: 27.1472, lng: 87.7556 },
  "taplejung": { lat: 27.3517, lng: 87.6717 },
  "dhankuta": { lat: 26.9808, lng: 87.3297 },
  "bhojpur": { lat: 27.1706, lng: 87.0456 },
  "khandbari": { lat: 27.3719, lng: 87.2069 },
  "okhaldhunga": { lat: 27.3106, lng: 86.5056 },
  "diktel": { lat: 27.2144, lng: 86.7903 },
  "salleri": { lat: 27.2989, lng: 86.6214 },
  "besisahar": { lat: 28.2272, lng: 84.3756 },
  "sauraha": { lat: 27.5756, lng: 84.4983 },
  "nagarkot": { lat: 27.7122, lng: 85.5217 },
  "dhampus": { lat: 28.2983, lng: 83.8406 },
  "bandipur": { lat: 27.9353, lng: 84.4147 },
  "gorkha": { lat: 28.0022, lng: 84.6297 },
  "lukla": { lat: 27.6878, lng: 86.7314 },
  "namche": { lat: 27.8069, lng: 86.7144 },
  "muktinath": { lat: 28.8164, lng: 83.8719 },
  "swayambhu": { lat: 27.7149, lng: 85.2904 },
  "boudha": { lat: 27.7215, lng: 85.3620 }
};

// Helper to load Google Maps API dynamically with visualization and geometry libraries
let googleMapsPromise = null;
function loadGoogleMapsAPI(apiKey) {
  if (googleMapsPromise) return googleMapsPromise;
  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || ''}&libraries=visualization,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps API failed to load.'));
      }
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
  return googleMapsPromise;
}

// Function to generate the premium custom SVG listing price pill marker (Pink Scheme)
function createPricePillSvg(price, isSelected) {
  const priceText = `Rs. ${(price / 100000).toFixed(0)}L`;
  const bg = isSelected ? '#e91e8f' : '#ffffff';
  const text = isSelected ? '#ffffff' : '#e91e8f';
  const strokeColor = isSelected ? '#e91e8f' : '#fbcfe8';
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="36" viewBox="0 0 90 36">
      <filter id="shadow" x="0" y="0" width="100%" height="100%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity="0.1" flood-color="#000" />
      </filter>
      <g filter="url(#shadow)">
        <rect x="7" y="2" width="76" height="24" rx="12" fill="${bg}" stroke="${strokeColor}" stroke-width="1" />
        <path d="M41,26 L45,30 L49,26 Z" fill="${bg}" stroke="${strokeColor}" stroke-width="1" />
        <path d="M42,25.5 L48,25.5 Z" stroke="${bg}" stroke-width="1.5" />
      </g>
      <text x="45" y="14" fill="${text}" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="11px" font-weight="700" text-anchor="middle" dominant-baseline="middle">
        ${priceText}
      </text>
    </svg>
  `;
  return 'data:image/svg+xml;utf-8,' + encodeURIComponent(svg.trim());
}

// Function to generate the premium custom SVG buyer demand budget pill marker (Blue Scheme)
function createDemandPillSvg(minPrice, maxPrice, isSelected) {
  const minL = (minPrice / 100000).toFixed(0);
  const maxL = (maxPrice / 100000).toFixed(0);
  const priceText = minL === maxL ? `Rs. ${minL}L` : `${minL}-${maxL}L`;
  const bg = isSelected ? '#0071e3' : '#ffffff';
  const text = isSelected ? '#ffffff' : '#0071e3';
  const strokeColor = isSelected ? '#0071e3' : '#bfdbfe';
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="36" viewBox="0 0 90 36">
      <filter id="shadow" x="0" y="0" width="100%" height="100%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity="0.1" flood-color="#000" />
      </filter>
      <g filter="url(#shadow)">
        <rect x="7" y="2" width="76" height="24" rx="12" fill="${bg}" stroke="${strokeColor}" stroke-width="1" />
        <path d="M41,26 L45,30 L49,26 Z" fill="${bg}" stroke="${strokeColor}" stroke-width="1" />
        <path d="M42,25.5 L48,25.5 Z" stroke="${bg}" stroke-width="1.5" />
      </g>
      <text x="45" y="14" fill="${text}" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="10px" font-weight="700" text-anchor="middle" dominant-baseline="middle">
        ${priceText}
      </text>
    </svg>
  `;
  return 'data:image/svg+xml;utf-8,' + encodeURIComponent(svg.trim());
}

// Point-in-polygon helper using ray-casting algorithm for fallback drawing search
function isPointInPolygon(point, polygon) {
  const x = point.x, y = point.y;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ptI = polygon.at(i);
    const ptJ = polygon.at(j);
    if (!ptI || !ptJ) continue;
    const xi = ptI.x, yi = ptI.y;
    const xj = ptJ.x, yj = ptJ.y;
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function MapExplorer({ properties, onSelectProperty, demands = [] }) {
  const [selectedProp, setSelectedProp] = useState(properties[0]);
  const [selectedDemand, setSelectedDemand] = useState(null);
  
  // Layer Toggles
  const [showSeller, setShowSeller] = useState(true);
  const [showBuyer, setShowBuyer] = useState(false);
  
  const [heatmapMode, setHeatmapMode] = useState(false);
  
  // Custom drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [rawPoints, setRawPoints] = useState([]);
  
  // Autocomplete search states
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchContainerRef = useRef(null);
  
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [filteredDemands, setFilteredDemands] = useState(demands);
  const [hasDrawnFilter, setHasDrawnFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [silentOffline, setSilentOffline] = useState(false);

  // Fallback states for centering and custom marker tracking
  const [fallbackCenter, setFallbackCenter] = useState(null);
  const [userLocationFallback, setUserLocationFallback] = useState(null);
  const [searchedLocationFallback, setSearchedLocationFallback] = useState(null);
  const [fallbackZoom, setFallbackZoom] = useState(1);
  const [redrawTrigger, setRedrawTrigger] = useState(0);

  const mapContainerRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const fallbackCanvasRef = useRef(null);
  
  // Google Maps instances kept in refs
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const heatmapLayerRef = useRef(null);
  const drawingPolygonRef = useRef(null);
  const overlayRef = useRef(null);
  
  const userLocationMarkerRef = useRef(null);
  const searchedLocationMarkerRef = useRef(null);

  // Load Google Maps API
  const loadMaps = () => {
    setLoading(true);
    setError(null);
    setSilentOffline(false);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'placeholder' || apiKey.trim() === '') {
      console.warn('No Google Maps API Key provided, using offline fallback map.');
      setError('Google Maps API key is missing.');
      setSilentOffline(true);
      setLoading(false);
      return;
    }
    loadGoogleMapsAPI(apiKey)
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to load Google Maps API, using offline fallback map:', err);
        setError('Could not load Google Maps API.');
        setSilentOffline(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Capture Google Maps Auth Failures (like Invalid Key, ApiProjectMapError, etc.)
    window.gm_authFailure = () => {
      console.warn('Google Maps authentication failed. Falling back to offline map.');
      setError('Google Maps authentication failed (Invalid API Key).');
      setSilentOffline(false);
      setLoading(false);
    };

    loadMaps();

    return () => {
      delete window.gm_authFailure;
    };
  }, []);

  // Handle click outside of search container to close dropdown suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter suggestions when searchQuery updates
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const clean = searchQuery.toLowerCase().trim();

    // 1. Predefined fallback cities
    const matchedCities = Object.keys(fallbackCities)
      .filter(city => city.toLowerCase().includes(clean) || clean.includes(city.toLowerCase()))
      .map(city => ({
        type: 'city',
        name: city.charAt(0).toUpperCase() + city.slice(1),
        key: city
      }));

    // 2. Active property listings matching query text
    const matchedProperties = properties
      .filter(p => 
        p.title.toLowerCase().includes(clean) ||
        (p.location?.address && p.location.address.toLowerCase().includes(clean)) ||
        (p.location?.city && p.location.city.toLowerCase().includes(clean))
      )
      .map(p => ({
        type: 'property',
        name: p.title,
        property: p
      }));

    // Combine both suggestions lists
    setSuggestions([...matchedCities, ...matchedProperties]);
  }, [searchQuery, properties]);

  // Initialize Map
  useEffect(() => {
    if (loading || error || !mapContainerRef.current) return;

    const google = window.google;
    const lats = properties.map(p => p.location?.lat).filter(Boolean);
    const lngs = properties.map(p => p.location?.lng).filter(Boolean);
    const center = {
      lat: lats.reduce((a, b) => a + b, 0) / lats.length || 40.7128,
      lng: lngs.reduce((a, b) => a + b, 0) / lngs.length || -74.0060
    };

    const map = new google.maps.Map(mapContainerRef.current, {
      center: center,
      zoom: 13,
      styles: mapStyles,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    mapInstanceRef.current = map;

    const overlay = new google.maps.OverlayView();
    overlay.onAdd = () => {};
    overlay.draw = () => {};
    overlay.onRemove = () => {};
    overlay.setMap(map);
    overlayRef.current = overlay;

    return () => {
      if (drawingPolygonRef.current) drawingPolygonRef.current.setMap(null);
      markersRef.current.forEach(m => m.setMap(null));
      if (heatmapLayerRef.current) heatmapLayerRef.current.setMap(null);
      if (userLocationMarkerRef.current) userLocationMarkerRef.current.setMap(null);
      if (searchedLocationMarkerRef.current) searchedLocationMarkerRef.current.setMap(null);
    };
  }, [loading, error]);

  // Sync state if property and demands data updates from parent service
  useEffect(() => {
    if (hasDrawnFilter && drawingPolygonRef.current && window.google) {
      const google = window.google;
      const matchedProps = properties.filter(prop => {
        if (!prop.location?.lat || !prop.location?.lng) return false;
        const pt = new google.maps.LatLng(prop.location.lat, prop.location.lng);
        return google.maps.geometry.poly.containsLocation(pt, drawingPolygonRef.current);
      });
      setFilteredProperties(matchedProps);

      const matchedDemands = demands.filter(d => {
        if (!d.lat || !d.lng) return false;
        const pt = new google.maps.LatLng(d.lat, d.lng);
        return google.maps.geometry.poly.containsLocation(pt, drawingPolygonRef.current);
      });
      setFilteredDemands(matchedDemands);
    } else if (!hasDrawnFilter) {
      setFilteredProperties(properties);
      setFilteredDemands(demands);
    }

    if (properties.length > 0) {
      const matchedSelected = properties.find(p => p.id === selectedProp?.id) || properties[0];
      setSelectedProp(matchedSelected);
    }
    
    if (demands.length > 0) {
      const matchedSelectedDemand = demands.find(d => d.id === selectedDemand?.id) || null;
      setSelectedDemand(matchedSelectedDemand);
    }
  }, [properties, demands, hasDrawnFilter]);

  // Redraw Markers and Heatmap Layer when properties, demands, heatmap mode, showSeller, or showBuyer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google) return;

    const google = window.google;

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (heatmapLayerRef.current) {
      heatmapLayerRef.current.setMap(null);
      heatmapLayerRef.current = null;
    }

    // Heatmap showing properties
    if (heatmapMode && showSeller) {
      const heatmapData = filteredProperties.map(p => ({
        location: new google.maps.LatLng(p.location.lat, p.location.lng),
        weight: p.price / 100000
      }));

      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 60,
        opacity: 0.85,
        gradient: [
          'rgba(0, 113, 227, 0)',
          'rgba(0, 113, 227, 0.1)',
          'rgba(0, 113, 227, 0.3)',
          'rgba(0, 113, 227, 0.5)',
          'rgba(0, 113, 227, 0.7)',
          'rgba(0, 113, 227, 0.9)',
          'rgba(0, 75, 150, 1)'
        ]
      });
      heatmap.setMap(map);
      heatmapLayerRef.current = heatmap;
    }

    // Render Seller listing markers (pink)
    if (showSeller) {
      filteredProperties.forEach(prop => {
        if (!prop.location?.lat || !prop.location?.lng) return;

        const isSelected = selectedProp && selectedProp.id === prop.id;
        const iconSvg = createPricePillSvg(prop.price, isSelected);

        const marker = new google.maps.Marker({
          position: { lat: prop.location.lat, lng: prop.location.lng },
          map: map,
          title: prop.title,
          icon: {
            url: iconSvg,
            scaledSize: new google.maps.Size(90, 36),
            anchor: new google.maps.Point(45, 30)
          },
          zIndex: isSelected ? 1000 : 1
        });

        marker.set('propId', prop.id);

        marker.addListener('click', () => {
          setSelectedProp(prop);
          setSelectedDemand(null);
          onSelectProperty(prop);
        });

        markersRef.current.push(marker);
      });
    }

    // Render Buyer demand markers (blue)
    if (showBuyer) {
      filteredDemands.forEach(demand => {
        if (!demand.lat || !demand.lng) return;

        const isSelected = selectedDemand && selectedDemand.id === demand.id;
        const iconSvg = createDemandPillSvg(demand.minPrice, demand.maxPrice, isSelected);

        const marker = new google.maps.Marker({
          position: { lat: demand.lat, lng: demand.lng },
          map: map,
          title: `Demand by ${demand.buyerName}`,
          icon: {
            url: iconSvg,
            scaledSize: new google.maps.Size(90, 36),
            anchor: new google.maps.Point(45, 30)
          },
          zIndex: isSelected ? 1000 : 1
        });

        marker.set('demandId', demand.id);

        marker.addListener('click', () => {
          setSelectedDemand(demand);
          setSelectedProp(null);
        });

        markersRef.current.push(marker);
      });
    }
  }, [filteredProperties, filteredDemands, heatmapMode, showSeller, showBuyer, loading]);

  // Sync selected pin styling when selection shifts
  useEffect(() => {
    if (!window.google) return;
    markersRef.current.forEach(marker => {
      const propId = marker.get('propId');
      if (propId) {
        const isSelected = selectedProp && selectedProp.id === propId;
        const prop = properties.find(p => p.id === propId);
        if (prop) {
          const iconSvg = createPricePillSvg(prop.price, isSelected);
          marker.setIcon({
            url: iconSvg,
            scaledSize: new window.google.maps.Size(90, 36),
            anchor: new window.google.maps.Point(45, 30)
          });
          marker.setZIndex(isSelected ? 1000 : 1);
        }
      }

      const demandId = marker.get('demandId');
      if (demandId) {
        const isSelected = selectedDemand && selectedDemand.id === demandId;
        const d = demands.find(item => item.id === demandId);
        if (d) {
          const iconSvg = createDemandPillSvg(d.minPrice, d.maxPrice, isSelected);
          marker.setIcon({
            url: iconSvg,
            scaledSize: new window.google.maps.Size(90, 36),
            anchor: new window.google.maps.Point(45, 30)
          });
          marker.setZIndex(isSelected ? 1000 : 1);
        }
      }
    });

    if (selectedProp) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo({
          lat: selectedProp.location.lat,
          lng: selectedProp.location.lng
        });
      } else if (error) {
        setFallbackCenter({
          lat: selectedProp.location.lat,
          lng: selectedProp.location.lng
        });
      }
    } else if (selectedDemand) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo({
          lat: selectedDemand.lat,
          lng: selectedDemand.lng
        });
      } else if (error) {
        setFallbackCenter({
          lat: selectedDemand.lat,
          lng: selectedDemand.lng
        });
      }
    }
  }, [selectedProp, selectedDemand, error]);

  // Handle drawing & fallback canvas resizing and responsiveness
  useEffect(() => {
    const canvas = error ? fallbackCanvasRef.current : drawingCanvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
          if (error) {
            setRedrawTrigger(prev => prev + 1);
          }
        }
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas.parentElement || canvas);

    if (isDrawing) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isDrawing, error, loading]);

  // Dynamic canvas projection calculation for offline fallback mode
  const getCanvasCoords = (lat, lng, width, height, padding = 60) => {
    const lats = properties.map(p => p.location?.lat).filter(Boolean);
    const lngs = properties.map(p => p.location?.lng).filter(Boolean);
    
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    let minLng = Math.min(...lngs);
    let maxLng = Math.max(...lngs);
    
    // If a fallback center is set, shift the canvas viewport accordingly
    if (fallbackCenter) {
      const latDiff = (maxLat - minLat || 0.02) / fallbackZoom;
      const lngDiff = (maxLng - minLng || 0.02) / fallbackZoom;
      
      minLat = fallbackCenter.lat - latDiff / 2;
      maxLat = fallbackCenter.lat + latDiff / 2;
      minLng = fallbackCenter.lng - lngDiff / 2;
      maxLng = fallbackCenter.lng + lngDiff / 2;
    }
    
    const latRange = maxLat - minLat || 0.01;
    const lngRange = maxLng - minLng || 0.01;
    
    const x = padding + ((lng - minLng) / lngRange) * (width - 2 * padding);
    const y = height - padding - ((lat - minLat) / latRange) * (height - 2 * padding);
    
    return { x, y };
  };

  // Fallback Canvas drawing renderer
  useEffect(() => {
    if (!error) return;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#f5f5f7';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#e5e5ea';
    ctx.lineWidth = 1;
    const gridSize = 45;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Heatmap mode on fallback canvas
    if (heatmapMode && showSeller) {
      filteredProperties.forEach(p => {
        if (!p.location?.lat || !p.location?.lng) return;
        const { x, y } = getCanvasCoords(p.location.lat, p.location.lng, width, height);
        
        const gradient = ctx.createRadialGradient(x, y, 10, x, y, 90);
        gradient.addColorStop(0, 'rgba(0, 113, 227, 0.25)');
        gradient.addColorStop(0.6, 'rgba(0, 113, 227, 0.08)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });
    }

    // Boundary drawing line
    if (rawPoints.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#0071e3';
      ctx.fillStyle = 'rgba(0, 113, 227, 0.04)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      
      const firstPt = rawPoints.at(0);
      if (firstPt) {
        ctx.moveTo(firstPt.x, firstPt.y);
        for (let i = 1; i < rawPoints.length; i++) {
          const pt = rawPoints.at(i);
          if (pt) {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }

      if (!isDrawingActive && rawPoints.length > 2) {
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // User location marker on fallback canvas
    if (userLocationFallback) {
      const { x, y } = getCanvasCoords(userLocationFallback.lat, userLocationFallback.lng, width, height);
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#0071e3';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 14, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(0, 113, 227, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Searched location pin on fallback canvas
    if (searchedLocationFallback) {
      const { x, y } = getCanvasCoords(searchedLocationFallback.lat, searchedLocationFallback.lng, width, height);
      
      ctx.beginPath();
      ctx.arc(x, y - 10, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#ba1a1a';
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(x - 5, y - 10);
      ctx.lineTo(x, y);
      ctx.lineTo(x + 5, y - 10);
      ctx.closePath();
      ctx.fillStyle = '#ba1a1a';
      ctx.fill();
    }

    // Custom price pill markers on fallback canvas (Pink Listings)
    if (showSeller) {
      filteredProperties.forEach(prop => {
        if (!prop.location?.lat || !prop.location?.lng) return;
        const { x, y } = getCanvasCoords(prop.location.lat, prop.location.lng, width, height);
        const isSelected = selectedProp && selectedProp.id === prop.id;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = isSelected ? '#e91e8f' : '#ffffff';
        ctx.strokeStyle = isSelected ? '#e91e8f' : '#fbcfe8';
        ctx.lineWidth = 1.2;
        
        const pillWidth = 72;
        const pillHeight = 24;
        const rx = x - pillWidth / 2;
        const ry = y - pillHeight / 2;

        ctx.beginPath();
        ctx.roundRect(rx, ry, pillWidth, pillHeight, 12);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 4, ry + pillHeight);
        ctx.lineTo(x, ry + pillHeight + 4);
        ctx.lineTo(x + 4, ry + pillHeight);
        ctx.closePath();
        ctx.fillStyle = isSelected ? '#e91e8f' : '#ffffff';
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = isSelected ? '#ffffff' : '#e91e8f';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Rs. ${(prop.price / 100000).toFixed(0)}L`, x, y);
      });
    }

    // Custom demand pill markers on fallback canvas (Blue Demands)
    if (showBuyer) {
      filteredDemands.forEach(d => {
        if (!d.lat || !d.lng) return;
        const { x, y } = getCanvasCoords(d.lat, d.lng, width, height);
        const isSelected = selectedDemand && selectedDemand.id === d.id;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = isSelected ? '#0071e3' : '#ffffff';
        ctx.strokeStyle = isSelected ? '#0071e3' : '#bfdbfe';
        ctx.lineWidth = 1.2;
        
        const pillWidth = 72;
        const pillHeight = 24;
        const rx = x - pillWidth / 2;
        const ry = y - pillHeight / 2;

        ctx.beginPath();
        ctx.roundRect(rx, ry, pillWidth, pillHeight, 12);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 4, ry + pillHeight);
        ctx.lineTo(x, ry + pillHeight + 4);
        ctx.lineTo(x + 4, ry + pillHeight);
        ctx.closePath();
        ctx.fillStyle = isSelected ? '#0071e3' : '#ffffff';
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = isSelected ? '#ffffff' : '#0071e3';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const minL = (d.minPrice / 100000).toFixed(0);
        const maxL = (d.maxPrice / 100000).toFixed(0);
        const label = minL === maxL ? `Rs. ${minL}L` : `${minL}-${maxL}L`;
        ctx.fillText(label, x, y);
      });
    }
  }, [filteredProperties, filteredDemands, selectedProp, selectedDemand, showSeller, showBuyer, heatmapMode, rawPoints, isDrawingActive, error, fallbackCenter, userLocationFallback, searchedLocationFallback, fallbackZoom, redrawTrigger]);

  // Fallback Canvas interactions
  const handleFallbackCanvasClick = (e) => {
    if (isDrawing || !error) return;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;

    let clickedProp = null;
    let clickedDemand = null;

    if (showSeller) {
      filteredProperties.forEach(prop => {
        if (!prop.location?.lat || !prop.location?.lng) return;
        const { x, y } = getCanvasCoords(prop.location.lat, prop.location.lng, width, height);
        
        const pillWidth = 72;
        const pillHeight = 24;
        if (
          clickX >= x - pillWidth / 2 &&
          clickX <= x + pillWidth / 2 &&
          clickY >= y - pillHeight / 2 &&
          clickY <= y + pillHeight / 2
        ) {
          clickedProp = prop;
        }
      });
    }

    if (showBuyer && !clickedProp) {
      filteredDemands.forEach(d => {
        if (!d.lat || !d.lng) return;
        const { x, y } = getCanvasCoords(d.lat, d.lng, width, height);
        
        const pillWidth = 72;
        const pillHeight = 24;
        if (
          clickX >= x - pillWidth / 2 &&
          clickX <= x + pillWidth / 2 &&
          clickY >= y - pillHeight / 2 &&
          clickY <= y + pillHeight / 2
        ) {
          clickedDemand = d;
        }
      });
    }

    if (clickedProp) {
      setSelectedProp(clickedProp);
      setSelectedDemand(null);
      onSelectProperty(clickedProp);
    } else if (clickedDemand) {
      setSelectedDemand(clickedDemand);
      setSelectedProp(null);
    }
  };

  const handleFallbackCanvasMouseDown = (e) => {
    if (!isDrawing || !error) return;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawingActive(true);
    setRawPoints([{ x, y }]);
  };

  const handleFallbackCanvasMouseMove = (e) => {
    if (!isDrawingActive || !isDrawing || !error) return;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRawPoints(prev => [...prev, { x, y }]);
  };

  const handleFallbackCanvasMouseUp = () => {
    if (!error) return;
    setIsDrawingActive(false);
    setIsDrawing(false);

    if (rawPoints.length < 3) {
      return;
    }

    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const matched = properties.filter(prop => {
      if (!prop.location?.lat || !prop.location?.lng) return false;
      const pt = getCanvasCoords(prop.location.lat, prop.location.lng, width, height);
      return isPointInPolygon(pt, rawPoints);
    });

    setFilteredProperties(matched);
    setHasDrawnFilter(true);
  };

  // Search Address/Location geocoding
  const handleLocationSearch = (query) => {
    if (!query) return;

    if (window.google && mapInstanceRef.current && !error) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          mapInstanceRef.current.setCenter(loc);
          mapInstanceRef.current.setZoom(13);
          
          if (searchedLocationMarkerRef.current) {
            searchedLocationMarkerRef.current.setMap(null);
          }
          
          // Drop red pin for searched address
          searchedLocationMarkerRef.current = new window.google.maps.Marker({
            position: loc,
            map: mapInstanceRef.current,
            title: results[0].formatted_address,
            animation: window.google.maps.Animation.DROP
          });
        } else {
          // If Geocoding API fails/denied, check local database before alerting
          const cleanedQuery = query.toLowerCase().trim();
          let targetLoc = null;
          for (const [city, coord] of Object.entries(fallbackCities)) {
            if (cleanedQuery.includes(city) || city.includes(cleanedQuery)) {
              targetLoc = coord;
              break;
            }
          }

          if (!targetLoc) {
            const found = properties.find(p => 
              p.title.toLowerCase().includes(cleanedQuery) ||
              p.location?.address?.toLowerCase().includes(cleanedQuery) ||
              p.location?.city?.toLowerCase().includes(cleanedQuery)
            );
            if (found) {
              targetLoc = { lat: found.location.lat, lng: found.location.lng };
            }
          }

          if (targetLoc) {
            const googleLoc = new window.google.maps.LatLng(targetLoc.lat, targetLoc.lng);
            mapInstanceRef.current.setCenter(googleLoc);
            mapInstanceRef.current.setZoom(13);
            
            if (searchedLocationMarkerRef.current) {
              searchedLocationMarkerRef.current.setMap(null);
            }
            
            searchedLocationMarkerRef.current = new window.google.maps.Marker({
              position: googleLoc,
              map: mapInstanceRef.current,
              title: query,
              animation: window.google.maps.Animation.DROP
            });
          } else {
            alert(`Location "${query}" not found. Try searching Kathmandu, Lalitpur, Pokhara, Chitwan or Butwal.`);
          }
        }
      });
    } else {
      // Fallback geocoding matches predefined cities or listing addresses
      const cleanedQuery = query.toLowerCase().trim();
      
      let targetLoc = null;
      for (const [city, coord] of Object.entries(fallbackCities)) {
        if (cleanedQuery.includes(city) || city.includes(cleanedQuery)) {
          targetLoc = coord;
          break;
        }
      }
      
      if (!targetLoc) {
        const found = properties.find(p => 
          p.title.toLowerCase().includes(cleanedQuery) ||
          p.location?.address?.toLowerCase().includes(cleanedQuery) ||
          p.location?.city?.toLowerCase().includes(cleanedQuery)
        );
        if (found) {
          targetLoc = { lat: found.location.lat, lng: found.location.lng };
        }
      }

      if (targetLoc) {
        setSearchedLocationFallback(targetLoc);
        setFallbackCenter(targetLoc);
      } else {
        alert(`No results matched "${query}" in offline mode. Try searching Kathmandu, Lalitpur, Pokhara, Chitwan or Butwal.`);
      }
    }
  };

  // Handle suggestion click to center map / select property
  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    if (suggestion.type === 'city') {
      setSearchQuery(suggestion.name);
      handleLocationSearch(suggestion.name);
    } else if (suggestion.type === 'property') {
      setSearchQuery(suggestion.name);
      setSelectedProp(suggestion.property);
      onSelectProperty(suggestion.property);

      const targetLoc = { lat: suggestion.property.location.lat, lng: suggestion.property.location.lng };
      if (window.google && mapInstanceRef.current && !error) {
        const googleLoc = new window.google.maps.LatLng(targetLoc.lat, targetLoc.lng);
        mapInstanceRef.current.setCenter(googleLoc);
        mapInstanceRef.current.setZoom(14);

        if (searchedLocationMarkerRef.current) {
          searchedLocationMarkerRef.current.setMap(null);
        }
        searchedLocationMarkerRef.current = new window.google.maps.Marker({
          position: googleLoc,
          map: mapInstanceRef.current,
          title: suggestion.property.title,
          animation: window.google.maps.Animation.DROP
        });
      } else {
        setSearchedLocationFallback(targetLoc);
        setFallbackCenter(targetLoc);
      }
    }
  };

  // Get Live Location geolocation trigger
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const userLoc = { lat, lng };
        
        if (window.google && mapInstanceRef.current && !error) {
          mapInstanceRef.current.setCenter(userLoc);
          mapInstanceRef.current.setZoom(14);
          
          if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setMap(null);
          }
          
          // Render dynamic pulsing geolocate dot on Google Maps
          const userDotSvg = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="%230071e3" stroke="%23ffffff" stroke-width="2"/><circle cx="12" cy="12" r="11" fill="%230071e3" opacity="0.3"/></svg>`;
          
          userLocationMarkerRef.current = new window.google.maps.Marker({
            position: userLoc,
            map: mapInstanceRef.current,
            title: "Your Location",
            icon: {
              url: userDotSvg,
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
            }
          });
        } else {
          // Centering fallback canvas on user live coordinates
          setUserLocationFallback(userLoc);
          setFallbackCenter(userLoc);
        }
      },
      (err) => {
        console.warn("Geolocation permission error or failure:", err);
        alert("Could not access your location. Please check your browser location permissions.");
      }
    );
  };

  // Start Drawing Boundary
  const startDrawBoundary = () => {
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null);
      drawingPolygonRef.current = null;
    }
    setHasDrawnFilter(false);
    setFilteredProperties(properties);
    setIsDrawing(true);
    setRawPoints([]);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setOptions({
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true
      });
    }
  };

  // Clear drawn boundaries and reset filter
  const clearDrawBoundary = () => {
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null);
      drawingPolygonRef.current = null;
    }
    setFilteredProperties(properties);
    setFilteredDemands(demands);
    setHasDrawnFilter(false);
    setIsDrawing(false);
    setRawPoints([]);
    setFallbackCenter(null);
    setSearchedLocationFallback(null);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setOptions({
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false
      });
    }
  };

  // Google Maps drawing line events
  const handleDrawingMouseDown = (e) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawingActive(true);
    setRawPoints([{ x, y }]);
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#0071e3';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.moveTo(x, y);
  };

  const handleDrawingMouseMove = (e) => {
    if (!isDrawingActive) return;
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRawPoints(prev => [...prev, { x, y }]);
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleDrawingMouseUp = () => {
    setIsDrawingActive(false);
    setIsDrawing(false);
    
    if (rawPoints.length < 3) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setOptions({
          draggable: true,
          zoomControl: true,
          scrollwheel: true,
          disableDoubleClickZoom: false
        });
      }
      return;
    }
    
    const google = window.google;
    const projection = overlayRef.current?.getProjection();
    if (!projection) return;
    
    const latLngs = rawPoints.map(pt => {
      const gPt = new google.maps.Point(pt.x, pt.y);
      return projection.fromContainerPixelToLatLng(gPt);
    });
    
    latLngs.push(latLngs[0]);
    
    const newPolygon = new google.maps.Polygon({
      paths: latLngs,
      strokeColor: '#0071e3',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#0071e3',
      fillOpacity: 0.08,
      map: mapInstanceRef.current
    });
    
    drawingPolygonRef.current = newPolygon;
    
    const matched = properties.filter(prop => {
      if (!prop.location?.lat || !prop.location?.lng) return false;
      const pt = new google.maps.LatLng(prop.location.lat, prop.location.lng);
      return google.maps.geometry.poly.containsLocation(pt, newPolygon);
    });
    
    setFilteredProperties(matched);
    setHasDrawnFilter(true);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setOptions({
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false
      });
    }
  };

  const handleRetryLoad = () => {
    googleMapsPromise = null;
    loadMaps();
  };

  const sidebarItems = [];
  if (showSeller) {
    filteredProperties.forEach(p => {
      sidebarItems.push({
        id: `prop-${p.id}`,
        type: 'seller',
        title: p.title,
        priceLabel: `Rs. ${(p.price / 100000).toFixed(0)}L`,
        subLabel: p.type.toUpperCase(),
        locationLabel: p.location?.address || p.location?.city || '',
        image: p.image,
        rawItem: p
      });
    });
  }
  if (showBuyer) {
    filteredDemands.forEach(d => {
      const minL = (d.minPrice / 100000).toFixed(0);
      const maxL = (d.maxPrice / 100000).toFixed(0);
      sidebarItems.push({
        id: `demand-${d.id}`,
        type: 'buyer',
        title: `Demand: ${d.buyerName}`,
        priceLabel: minL === maxL ? `Rs. ${minL}L` : `Rs. ${minL}-${maxL}L`,
        subLabel: d.propertyType.toUpperCase(),
        locationLabel: d.location,
        image: null,
        rawItem: d
      });
    });
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white border border-border-subtle rounded-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left">
      {/* Header and Action toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-[24px] font-semibold text-primary flex items-center gap-2">
            <Compass size={22} className="text-accent-blue" />
            <span>Geospatial Map Explorer</span>
          </h2>
          <p className="text-on-surface-variant text-[14px] mt-1">
            Toggle layers (Sellers / Buyers), heatmaps, and draw boundaries to filter items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 animate-fade-in">
          {/* Dual Layer Tabs Selector */}
          <div className="flex bg-surface-offwhite p-1 rounded-full border border-border-subtle items-center gap-1 select-none">
            <button
              onClick={() => {
                setShowSeller(!showSeller);
                if (showSeller && !showBuyer) {
                  setShowBuyer(true);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                showSeller 
                  ? 'bg-[#e91e8f] text-white shadow-sm font-bold' 
                  : 'text-on-surface-variant hover:bg-border-subtle/50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${showSeller ? 'bg-white' : 'bg-[#e91e8f]'}`} />
              <span>Seller Listings</span>
            </button>
            <button
              onClick={() => {
                setShowBuyer(!showBuyer);
                if (showBuyer && !showSeller) {
                  setShowSeller(true);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                showBuyer 
                  ? 'bg-[#0071e3] text-white shadow-sm font-bold' 
                  : 'text-on-surface-variant hover:bg-border-subtle/50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${showBuyer ? 'bg-white' : 'bg-[#0071e3]'}`} />
              <span>Buyer Demands</span>
            </button>
          </div>

          <button 
            onClick={() => setHeatmapMode(!heatmapMode)}
            disabled={!showSeller}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${heatmapMode && showSeller ? 'bg-accent-blue text-white shadow-sm' : 'bg-surface-offwhite hover:bg-border-subtle text-primary'}`}
          >
            {heatmapMode ? 'Disable Heatmap' : 'Heatmap View'}
          </button>
          
          <button 
            onClick={startDrawBoundary}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${isDrawing ? 'bg-accent-blue text-white animate-pulse' : 'bg-surface-offwhite hover:bg-border-subtle text-primary'}`}
          >
            {isDrawing ? 'Drawing Mode Active...' : 'Draw Search'}
          </button>

          {(hasDrawnFilter || isDrawing || searchedLocationFallback || userLocationFallback) && (
            <button 
              onClick={clearDrawBoundary}
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold bg-surface-offwhite hover:bg-border-subtle text-primary transition-all cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6 h-[720px] md:h-[520px]">
        {/* Left filtered listings sidebar */}
        <div className="flex flex-col gap-3 h-[240px] md:h-auto overflow-y-auto pr-2 border-b md:border-b-0 md:border-r border-border-subtle pb-4 md:pb-0 md:pr-4">
          <div className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider pb-2 border-b border-border-subtle mb-1">
            {sidebarItems.length} {sidebarItems.length === 1 ? 'ITEM' : 'ITEMS'} IN REGION
          </div>

          {sidebarItems.length === 0 ? (
            <div className="py-12 px-4 text-center border border-dashed border-border-subtle rounded-lg">
              <p className="text-on-surface-variant text-[13px] font-semibold">No listings or demands in this boundary.</p>
              <button 
                onClick={clearDrawBoundary}
                className="mt-2 text-[12px] text-accent-blue font-bold hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            sidebarItems.map((item) => {
              const isSelected = item.type === 'seller' 
                ? (selectedProp && selectedProp.id === item.rawItem.id)
                : (selectedDemand && selectedDemand.id === item.rawItem.id);
              
              const activeBgClass = item.type === 'seller'
                ? 'bg-pink-500/5 border-[#e91e8f]'
                : 'bg-blue-500/5 border-[#0071e3]';
              
              const borderClass = isSelected ? activeBgClass : 'bg-white border-border-subtle hover:border-border-strong';
              
              return (
                <div 
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'seller') {
                      setSelectedProp(item.rawItem);
                      setSelectedDemand(null);
                      onSelectProperty(item.rawItem);
                    } else {
                      setSelectedDemand(item.rawItem);
                      setSelectedProp(null);
                    }
                  }}
                  className={`flex gap-3 p-3 rounded-lg border transition-all cursor-pointer ${borderClass}`}
                >
                  {item.type === 'seller' ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-16 h-12 rounded-[6px] object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-[6px] bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100 text-blue-500">
                      <User size={20} />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="text-[13px] font-bold text-primary truncate flex-1">
                        {item.title}
                      </h4>
                      {showSeller && showBuyer && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 select-none ${
                          item.type === 'seller' ? 'bg-pink-50 text-[#e91e8f]' : 'bg-blue-50 text-[#0071e3]'
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-[11px] text-on-surface-variant mt-0.5 font-semibold">
                      {item.priceLabel} | {item.subLabel}
                    </div>
                    <div className="text-[10px] text-on-surface-variant/70 mt-0.5 truncate font-medium flex items-center gap-0.5">
                      <MapPin size={10} className="inline text-on-surface-variant/50" />
                      <span>{item.locationLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right map display */}
        <div className="relative rounded-card overflow-hidden border border-border-subtle h-[420px] md:h-full bg-surface-offwhite">
          
          {/* Floating Location Search */}
          <div ref={searchContainerRef} className="absolute top-4 left-4 z-30 w-[240px] md:w-[300px]">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-on-surface-variant/70" />
              <input
                type="text"
                placeholder="Search location or city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-white/95 backdrop-blur border border-border-subtle rounded-full py-2 pl-10 pr-4 focus:outline-none shadow-md text-[13px] text-primary focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLocationSearch(e.target.value);
                    setShowSuggestions(false);
                  }
                }}
              />
            </div>

            {/* Suggestions list menu */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-border-subtle rounded-2xl shadow-lg max-h-[250px] overflow-y-auto z-40 animate-fade-in divide-y divide-border-subtle/50">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent-blue/5 transition-colors cursor-pointer text-left"
                  >
                    {suggestion.type === 'city' ? (
                      <Navigation size={14} className="text-accent-blue rotate-45 flex-shrink-0" />
                    ) : (
                      <MapPin size={14} className="text-accent-blue flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-primary truncate">
                        {suggestion.name}
                      </div>
                      <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        {suggestion.type === 'city' ? 'City' : `Property | Rs. ${(suggestion.property.price / 100000).toFixed(0)}L`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Locate User button */}
          <button 
            onClick={handleLocateUser}
            title="Get my location"
            className="absolute bottom-[110px] right-4 z-10 bg-white/95 backdrop-blur border border-border-subtle p-2.5 rounded-full shadow-md text-primary hover:text-accent-blue hover:bg-border-subtle transition-all cursor-pointer"
          >
            <Navigation size={18} className="fill-current" />
          </button>

          {/* Zoom controls for offline fallback canvas map */}
          {error && (
            <div className="absolute bottom-[160px] right-4 z-10 flex flex-col gap-2 animate-fade-in">
              <button 
                onClick={() => setFallbackZoom(prev => Math.min(prev + 0.5, 6))}
                title="Zoom In"
                className="bg-white/95 backdrop-blur border border-border-subtle w-9 h-9 flex items-center justify-center rounded-full shadow-md text-primary hover:text-accent-blue hover:bg-border-subtle transition-all cursor-pointer font-bold text-[16px]"
              >
                +
              </button>
              <button 
                onClick={() => setFallbackZoom(prev => Math.max(prev - 0.5, 1))}
                title="Zoom Out"
                className="bg-white/95 backdrop-blur border border-border-subtle w-9 h-9 flex items-center justify-center rounded-full shadow-md text-primary hover:text-accent-blue hover:bg-border-subtle transition-all cursor-pointer font-bold text-[16px]"
              >
                −
              </button>
            </div>
          )}

          {/* Offline Fallback Banner */}
          {error && !silentOffline && (
            <div className="absolute top-16 left-4 right-4 bg-amber-50/95 backdrop-blur border border-amber-200 text-amber-900 px-4 py-2 rounded-lg text-[12px] font-medium z-30 flex justify-between items-center shadow-sm animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
                <span>Offline fallback map. Load error (check VITE_GOOGLE_MAPS_API_KEY).</span>
              </div>
              <button 
                onClick={handleRetryLoad}
                className="text-[11px] font-bold text-accent-blue hover:underline ml-3 flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                <RefreshCw size={11} />
                Retry
              </button>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-offwhite z-10 gap-3">
              <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
              <span className="text-[14px] font-semibold text-on-surface-variant">Loading Google Maps...</span>
            </div>
          )}

          {/* Google Maps Container */}
          {!error && <div ref={mapContainerRef} className="w-full h-full" />}

          {/* Google Maps Drawing Canvas overlay */}
          {!error && isDrawing && (
            <canvas
              ref={drawingCanvasRef}
              className="absolute inset-0 z-20 w-full h-full block cursor-crosshair"
              onMouseDown={handleDrawingMouseDown}
              onMouseMove={handleDrawingMouseMove}
              onMouseUp={handleDrawingMouseUp}
            />
          )}

          {/* Offline Fallback Interactive Canvas Map */}
          {error && (
            <canvas
              ref={fallbackCanvasRef}
              className="w-full h-full block"
              style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
              onClick={handleFallbackCanvasClick}
              onMouseDown={handleFallbackCanvasMouseDown}
              onMouseMove={handleFallbackCanvasMouseMove}
              onMouseUp={handleFallbackCanvasMouseUp}
            />
          )}
          
          {/* Custom Map Legend overlay */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur border border-border-subtle p-3.5 rounded-xl text-[11px] font-semibold text-on-surface-variant shadow-md z-10 text-left select-none pointer-events-none flex flex-col gap-2">
            <div className="text-[9px] text-on-surface-variant/60 font-bold uppercase tracking-wider">Map Legend</div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e91e8f] inline-block"></span>
                <span>Active Listings (Seller)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3] inline-block"></span>
                <span>Buyer Demands (Buyer)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border border-border-strong bg-white inline-block"></span>
                <span>Selected Pin</span>
              </div>
              {heatmapMode && showSeller && (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-accent-blue to-[#004b96] inline-block"></span>
                  <span>Rent Density Heatmap</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
