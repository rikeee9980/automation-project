import React, { useState, useRef, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Eye, MousePointerClick, RefreshCw, Loader2, AlertCircle, Search, Navigation } from 'lucide-react';

// Custom Map Styling to match the premium minimalist theme of Aetheria
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
  "pokhara": { lat: 28.2096, lng: 83.9856 },
  "chitwan": { lat: 27.6756, lng: 84.4284 },
  "bharatpur": { lat: 27.6756, lng: 84.4284 },
  "butwal": { lat: 27.7006, lng: 83.4484 },
  "biratnagar": { lat: 26.4525, lng: 87.2718 },
  "dharan": { lat: 26.8124, lng: 87.2834 }
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

// Function to generate the premium custom SVG listing price pill marker
function createPricePillSvg(price, isSelected) {
  const priceText = `Rs. ${(price / 100000).toFixed(0)}L`;
  const bg = isSelected ? '#0071e3' : '#ffffff';
  const text = isSelected ? '#ffffff' : '#1d1d1f';
  const strokeColor = isSelected ? '#0071e3' : '#e5e5ea';
  
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

// Point-in-polygon helper using ray-casting algorithm for fallback drawing search
function isPointInPolygon(point, polygon) {
  const x = point.x, y = point.y;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function MapExplorer({ properties, onSelectProperty }) {
  const [selectedProp, setSelectedProp] = useState(properties[0]);
  const [heatmapMode, setHeatmapMode] = useState(false);
  
  // Custom drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [rawPoints, setRawPoints] = useState([]);
  
  const [filteredProperties, setFilteredProperties] = useState(properties);
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

  // Sync state if property data updates from parent service
  useEffect(() => {
    if (hasDrawnFilter && drawingPolygonRef.current && window.google) {
      const google = window.google;
      const matched = properties.filter(prop => {
        if (!prop.location?.lat || !prop.location?.lng) return false;
        const pt = new google.maps.LatLng(prop.location.lat, prop.location.lng);
        return google.maps.geometry.poly.containsLocation(pt, drawingPolygonRef.current);
      });
      setFilteredProperties(matched);
    } else if (!hasDrawnFilter) {
      setFilteredProperties(properties);
    }

    if (properties.length > 0) {
      const matchedSelected = properties.find(p => p.id === selectedProp?.id) || properties[0];
      setSelectedProp(matchedSelected);
    }
  }, [properties]);

  // Redraw Markers and Heatmap Layer when properties or heatmap mode changes
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

    if (heatmapMode) {
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
        onSelectProperty(prop);
      });

      markersRef.current.push(marker);
    });
  }, [filteredProperties, heatmapMode, loading]);

  // Sync selected pin styling when selection shifts
  useEffect(() => {
    if (!window.google) return;
    markersRef.current.forEach(marker => {
      const propId = marker.get('propId');
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
    }
  }, [selectedProp, error]);

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
    if (heatmapMode) {
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
      
      ctx.moveTo(rawPoints[0].x, rawPoints[0].y);
      for (let i = 1; i < rawPoints.length; i++) {
        ctx.lineTo(rawPoints[i].x, rawPoints[i].y);
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

    // Custom price pill markers on fallback canvas
    filteredProperties.forEach(prop => {
      if (!prop.location?.lat || !prop.location?.lng) return;
      const { x, y } = getCanvasCoords(prop.location.lat, prop.location.lng, width, height);
      const isSelected = selectedProp && selectedProp.id === prop.id;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = isSelected ? '#0071e3' : '#ffffff';
      ctx.strokeStyle = isSelected ? '#0071e3' : '#e5e5ea';
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

      ctx.fillStyle = isSelected ? '#ffffff' : '#1d1d1f';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Rs. ${(prop.price / 100000).toFixed(0)}L`, x, y);
    });
  }, [filteredProperties, selectedProp, heatmapMode, rawPoints, isDrawingActive, error, fallbackCenter, userLocationFallback, searchedLocationFallback, fallbackZoom, redrawTrigger]);

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

    if (clickedProp) {
      setSelectedProp(clickedProp);
      onSelectProperty(clickedProp);
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
            Toggle luxury rent/valuation heatmaps and draw custom boundaries to filter properties.
          </p>
        </div>

        <div className="flex gap-2.5 animate-fade-in">
          <button 
            onClick={() => setHeatmapMode(!heatmapMode)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${heatmapMode ? 'bg-accent-blue text-white shadow-sm' : 'bg-surface-offwhite hover:bg-border-subtle text-primary'}`}
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
            {filteredProperties.length} PROPERTIES IN REGION
          </div>

          {filteredProperties.length === 0 ? (
            <div className="py-12 px-4 text-center border border-dashed border-border-subtle rounded-lg">
              <p className="text-on-surface-variant text-[13px] font-semibold">No properties in this boundary.</p>
              <button 
                onClick={clearDrawBoundary}
                className="mt-2 text-[12px] text-accent-blue font-bold hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredProperties.map((prop) => (
              <div 
                key={prop.id}
                onClick={() => {
                  setSelectedProp(prop);
                  onSelectProperty(prop);
                }}
                className={`flex gap-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedProp?.id === prop.id ? 'bg-accent-blue/5 border-accent-blue' : 'bg-white border-border-subtle hover:border-border-strong'}`}
              >
                <img 
                  src={prop.image} 
                  alt={prop.title} 
                  className="w-16 h-12 rounded-[6px] object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="text-[14px] font-bold text-primary truncate">
                    {prop.title}
                  </h4>
                  <div className="text-[12px] text-on-surface-variant mt-1 font-medium">
                    Rs. {(prop.price / 100000).toFixed(0)}L | {prop.type}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right map display */}
        <div className="relative rounded-card overflow-hidden border border-border-subtle h-[420px] md:h-full bg-surface-offwhite">
          
          {/* Floating Location Search */}
          <div className="absolute top-4 left-4 z-10 w-[240px] md:w-[300px]">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-on-surface-variant/70" />
              <input
                type="text"
                placeholder="Search location or city..."
                className="w-full bg-white/95 backdrop-blur border border-border-subtle rounded-full py-2 pl-10 pr-4 focus:outline-none shadow-md text-[13px] text-primary focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLocationSearch(e.target.value);
                  }
                }}
              />
            </div>
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
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur border border-border-subtle p-3 rounded-lg text-[12px] font-semibold text-on-surface-variant shadow-sm z-10 text-left">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#86868b] inline-block"></span>
                <span>Active Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-blue inline-block"></span>
                <span>Selected Pin</span>
              </div>
              {heatmapMode && (
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
