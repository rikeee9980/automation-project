import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Send, CheckCircle2, User, Mail, Phone, MapPin, AlignLeft, Landmark, DollarSign, Home, AlertCircle } from 'lucide-react';
import { createDemand } from '../lib/propertyService';
import { 
  validatePhone, 
  validateEmail, 
  validateName, 
  validateDescription, 
  validateLocation, 
  checkRateLimit, 
  recordSubmission 
} from '../lib/validationUtils';

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

const KATHMANDU_BOUNDS = {
  minLat: 27.64,
  maxLat: 27.75,
  minLng: 85.25,
  maxLng: 85.45
};

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

export default function DemandModal({ isOpen, onClose, onSubmitSuccess }) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [propertyType, setPropertyType] = useState('house');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Coordinate Picker States
  const [lat, setLat] = useState(27.7172);
  const [lng, setLng] = useState(85.3240);
  const [mapError, setMapError] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [isGoogleMapLoaded, setIsGoogleMapLoaded] = useState(false);

  // Refs for mini-map
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const canvasRef = useRef(null);
  const locationInputRef = useRef(null);

  // Validation & Anti-Abuse States
  const [errors, setErrors] = useState({});
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');

  // Check rate limit on open
  useEffect(() => {
    if (isOpen) {
      const rateLimitStatus = checkRateLimit();
      if (rateLimitStatus.limited) {
        setRateLimited(true);
        setCooldownTime(rateLimitStatus.retryAfterMinutes);
      } else {
        setRateLimited(false);
        setCooldownTime(0);
      }
      // Reset errors and coordinates when modal opens
      setErrors({});
      setError('');
      setLat(27.7172);
      setLng(85.3240);
    }
  }, [isOpen]);

  // 1. Convert Canvas coordinates to Lat/Lng (bounds: KATHMANDU_BOUNDS)
  const getCanvasCoords = (latVal, lngVal, width, height) => {
    const latRange = KATHMANDU_BOUNDS.maxLat - KATHMANDU_BOUNDS.minLat;
    const lngRange = KATHMANDU_BOUNDS.maxLng - KATHMANDU_BOUNDS.minLng;
    const x = ((lngVal - KATHMANDU_BOUNDS.minLng) / lngRange) * width;
    const y = height - (((latVal - KATHMANDU_BOUNDS.minLat) / latRange) * height);
    return { x, y };
  };

  const getLatLngFromCanvas = (x, y, width, height) => {
    const latRange = KATHMANDU_BOUNDS.maxLat - KATHMANDU_BOUNDS.minLat;
    const lngRange = KATHMANDU_BOUNDS.maxLng - KATHMANDU_BOUNDS.minLng;
    const lngVal = KATHMANDU_BOUNDS.minLng + (x / width) * lngRange;
    const latVal = KATHMANDU_BOUNDS.minLat + ((height - y) / height) * latRange;
    return { lat: parseFloat(latVal.toFixed(6)), lng: parseFloat(lngVal.toFixed(6)) };
  };

  // 2. Draw Offline Fallback Map on Canvas
  const drawCanvasMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 0; j < height; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    // Reference areas inside bounds
    const referenceAreas = [
      { name: "Kathmandu Center", lat: 27.7172, lng: 85.3240 },
      { name: "Lalitpur", lat: 27.6710, lng: 85.3122 },
      { name: "Bhaktapur", lat: 27.6710, lng: 85.4298 },
      { name: "Jhamsikhel", lat: 27.6780, lng: 85.3122 },
      { name: "Baluwatar", lat: 27.7172, lng: 85.3240 },
      { name: "Sanepa", lat: 27.6780, lng: 85.3122 }
    ];

    referenceAreas.forEach(area => {
      const { x, y } = getCanvasCoords(area.lat, area.lng, width, height);
      // Small grey dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.fill();

      // Label text
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.font = '10px sans-serif';
      ctx.fillText(area.name, x + 6, y + 3);
    });

    // Draw active pin
    const { x: pinX, y: pinY } = getCanvasCoords(lat, lng, width, height);

    // Draw pin shadow
    ctx.beginPath();
    ctx.arc(pinX, pinY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fill();

    // Draw actual pin (blue map pin)
    ctx.beginPath();
    ctx.arc(pinX, pinY - 12, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#0071e3'; // accent-blue
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pin stem
    ctx.beginPath();
    ctx.moveTo(pinX, pinY);
    ctx.lineTo(pinX - 3, pinY - 8);
    ctx.lineTo(pinX + 3, pinY - 8);
    ctx.closePath();
    ctx.fillStyle = '#0071e3';
    ctx.fill();

    // Pin center white dot
    ctx.beginPath();
    ctx.arc(pinX, pinY - 12, 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const coord = getLatLngFromCanvas(x, y, canvas.width, canvas.height);
    setLat(coord.lat);
    setLng(coord.lng);

    // Update location text based on closest fallbackCity
    let closestCity = '';
    let minDist = Infinity;
    for (const [name, coordItem] of Object.entries(fallbackCities)) {
      const dist = Math.sqrt(Math.pow(coordItem.lat - coord.lat, 2) + Math.pow(coordItem.lng - coord.lng, 2));
      if (dist < 0.015 && dist < minDist) {
        minDist = dist;
        closestCity = name;
      }
    }

    if (closestCity) {
      const formattedName = closestCity.charAt(0).toUpperCase() + closestCity.slice(1);
      setLocation(`${formattedName}, Kathmandu`);
    } else {
      setLocation(`Coordinate: ${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}`);
    }
  };

  // 3. Load & Initialize Google Map
  useEffect(() => {
    if (!isOpen) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'placeholder' || apiKey.trim() === '') {
      setMapError(true);
      return;
    }

    setMapLoading(true);
    setMapError(false);

    let isMounted = true;

    loadGoogleMapsAPI(apiKey)
      .then((google) => {
        if (!isMounted) return;
        setMapLoading(false);
        setIsGoogleMapLoaded(true);
        if (!mapRef.current) return;

        const currentLat = parseFloat(lat) || 27.7172;
        const currentLng = parseFloat(lng) || 85.3240;
        const centerPos = { lat: currentLat, lng: currentLng };

        const map = new google.maps.Map(mapRef.current, {
          center: centerPos,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [{ "color": "#f5f5f7" }]
            },
            {
              "elementType": "labels.icon",
              "stylers": [{ "visibility": "off" }]
            }
          ]
        });

        mapInstanceRef.current = map;

        const marker = new google.maps.Marker({
          position: centerPos,
          map: map,
          draggable: true,
          title: "Drag to set location"
        });

        markerRef.current = marker;

        const reverseGeocode = (latVal, lngVal) => {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latVal, lng: lngVal } }, (results, status) => {
            if (status === 'OK' && results[0] && isMounted) {
              const addressComponents = results[0].address_components;
              let neighborhood = '';
              let sublocality = '';
              let cityVal = '';

              for (const component of addressComponents) {
                if (component.types.includes('neighborhood')) {
                  neighborhood = component.long_name;
                } else if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1')) {
                  sublocality = component.long_name;
                } else if (component.types.includes('locality')) {
                  cityVal = component.long_name;
                }
              }

              let displayLoc = neighborhood || sublocality || '';
              if (cityVal) {
                displayLoc = displayLoc ? `${displayLoc}, ${cityVal}` : cityVal;
              }

              if (!displayLoc) {
                displayLoc = results[0].formatted_address.split(',').slice(0, 2).join(',').trim();
              }

              if (displayLoc) {
                setLocation(displayLoc);
              }
            }
          });
        };

        // Map Click updates coordinates and marker
        map.addListener('click', (e) => {
          const clickPos = e.latLng;
          marker.setPosition(clickPos);
          setLat(parseFloat(clickPos.lat().toFixed(6)));
          setLng(parseFloat(clickPos.lng().toFixed(6)));
          reverseGeocode(clickPos.lat(), clickPos.lng());
        });

        // Marker Drag updates coordinates
        marker.addListener('dragend', () => {
          const dragPos = marker.getPosition();
          setLat(parseFloat(dragPos.lat().toFixed(6)));
          setLng(parseFloat(dragPos.lng().toFixed(6)));
          reverseGeocode(dragPos.lat(), dragPos.lng());
        });
      })
      .catch((err) => {
        console.warn("Failed to load Google Maps inside DemandModal:", err);
        if (isMounted) {
          setMapError(true);
          setMapLoading(false);
        }
      });

    return () => {
      isMounted = false;
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [isOpen]);

  // 4. Redraw offline canvas map when coords/mode changes
  useEffect(() => {
    if (mapError && isOpen) {
      drawCanvasMap();
    }
  }, [lat, lng, mapError, isOpen]);

  // 5. Center map on typed location (if not triggered by dragging/focusing away)
  useEffect(() => {
    if (!isOpen || !location || document.activeElement !== locationInputRef.current) return;

    const cleanLoc = location.toLowerCase().trim();
    for (const [name, coord] of Object.entries(fallbackCities)) {
      if (cleanLoc === name || cleanLoc.includes(name)) {
        setLat(coord.lat);
        setLng(coord.lng);

        if (mapInstanceRef.current && markerRef.current) {
          const newPos = { lat: coord.lat, lng: coord.lng };
          markerRef.current.setPosition(newPos);
          mapInstanceRef.current.panTo(newPos);
        }
        break;
      }
    }
  }, [location]);

  if (!isOpen) return null;

  // Real-time validation on blur
  const handleBlur = (field, value) => {
    let err = null;
    if (field === 'buyerName') err = validateName(value);
    if (field === 'buyerEmail') err = validateEmail(value);
    if (field === 'buyerPhone') err = validatePhone(value);
    if (field === 'location') err = validateLocation(value);
    if (field === 'description') err = validateDescription(value);
    
    setErrors(prev => ({
      ...prev,
      [field]: err
    }));
  };

  // Clear validation errors when typing
  const handleFieldChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Honeypot check (silently trap bots)
    if (websiteHoneypot) {
      console.warn('Honeypot triggered, simulating successful submission.');
      setSuccess(true);
      return;
    }

    // 2. Submit-time Rate limit check
    const rateLimitStatus = checkRateLimit();
    if (rateLimitStatus.limited) {
      setError(`You have submitted too many demands recently. Please try again in ${rateLimitStatus.retryAfterMinutes} minutes.`);
      setRateLimited(true);
      setCooldownTime(rateLimitStatus.retryAfterMinutes);
      return;
    }

    // 3. Complete field validations
    const nameErr = validateName(buyerName);
    const emailErr = validateEmail(buyerEmail);
    const phoneErr = validatePhone(buyerPhone);
    const locationErr = validateLocation(location);
    const descErr = validateDescription(description);

    const validationErrors = {
      buyerName: nameErr,
      buyerEmail: emailErr,
      buyerPhone: phoneErr,
      location: locationErr,
      description: descErr,
    };

    // Filter out null values (no errors)
    const activeErrors = Object.fromEntries(
      Object.entries(validationErrors).filter(([_, v]) => v !== null)
    );

    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
      setError('Please correct the errors in the form.');
      
      // Smooth scroll to the first error input
      setTimeout(() => {
        const firstErrorField = document.querySelector('.border-red-400');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorField.focus();
        }
      }, 50);
      return;
    }

    // 4. Budget logic validation
    const minVal = parseFloat(minPrice);
    const maxVal = parseFloat(maxPrice);
    if (minVal > maxVal) {
      setError('Minimum budget cannot be greater than maximum budget.');
      return;
    }

    setLoading(true);

    try {
      const details = {};
      if (propertyType === 'house' || propertyType === 'flat') {
        if (bedrooms) details.bedrooms = parseInt(bedrooms, 10);
        if (bathrooms) details.bathrooms = parseInt(bathrooms, 10);
      }

      const newDemand = await createDemand({
        buyerName,
        buyerEmail,
        buyerPhone,
        propertyType,
        location,
        lat: parseFloat(lat) || 27.7172,
        lng: parseFloat(lng) || 85.3240,
        minPrice: minVal,
        maxPrice: maxVal,
        details,
        description
      });

      // Record successful submission for rate limit
      recordSubmission();

      setSuccess(true);
      if (onSubmitSuccess) {
        onSubmitSuccess(newDemand);
      }
    } catch (err) {
      console.error('Failed to submit demand:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden text-left border border-border-subtle flex flex-col max-h-[90vh]"
        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
      >
        {/* Header line accent */}
        <div className="h-1 bg-gradient-to-r from-accent-blue via-indigo-500 to-purple-600 flex-shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer z-10 p-1.5 rounded-full hover:bg-surface-offwhite"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-7 flex-1">
          {success ? (
            /* Success View */
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 animate-[scaleIn_0.4s_ease-out]">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-[22px] font-bold text-primary tracking-tight mb-2">
                Demand Posted for Review
              </h3>
              <p className="text-[14px] text-on-surface-variant max-w-[380px] leading-relaxed mb-8">
                Thank you! Your property demand has been recorded. To maintain a spam-free marketplace, a broker will review and publish it within 24 hours. We will notify you at <strong className="text-primary">{buyerEmail}</strong>.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  // Reset form
                  setBuyerName('');
                  setBuyerEmail('');
                  setBuyerPhone('');
                  setPropertyType('house');
                  setLocation('');
                  setMinPrice('');
                  setMaxPrice('');
                  setBedrooms('');
                  setBathrooms('');
                  setDescription('');
                  onClose();
                }}
                className="px-8 py-2.5 bg-primary hover:opacity-90 text-white rounded-full text-[14px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Close
              </button>
            </div>
          ) : (
            /* Form View */
            <>
              <div className="mb-6">
                <h3 className="text-[20px] font-bold text-primary tracking-tight">
                  Post Your Property Demand
                </h3>
                <p className="text-[13px] text-on-surface-variant mt-1 font-medium">
                  Tell us what kind of property you are looking for. Once verified by our agents, it will be published for sellers and brokers to match with listings.
                </p>
              </div>

              {/* Rate Limit Alert */}
              {rateLimited && (
                <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[13px] font-medium flex items-center gap-2.5 animate-[fadeInUp_0.2s_ease-out]">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                  <span>You have reached the maximum of 3 submissions per hour. Please wait {cooldownTime} minutes before trying again.</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px] font-medium animate-[fadeInUp_0.15s_ease-out]">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Honeypot field - hidden from users */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    value={websiteHoneypot}
                    onChange={(e) => setWebsiteHoneypot(e.target.value)}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                    <User size={13} className="text-on-surface-variant/80" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => handleFieldChange('buyerName', e.target.value, setBuyerName)}
                    onBlur={(e) => handleBlur('buyerName', e.target.value)}
                    disabled={rateLimited}
                    placeholder="e.g. Ramesh Karki"
                    required
                    className={`w-full h-10 px-4 bg-surface-offwhite border rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                      errors.buyerName 
                        ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500' 
                        : 'border-border-strong focus:ring-accent-blue/20 focus:border-accent-blue'
                    }`}
                  />
                  {errors.buyerName && (
                    <span className="text-[12px] text-red-500 font-medium leading-tight">
                      {errors.buyerName}
                    </span>
                  )}
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                      <Mail size={13} className="text-on-surface-variant/80" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => handleFieldChange('buyerEmail', e.target.value, setBuyerEmail)}
                      onBlur={(e) => handleBlur('buyerEmail', e.target.value)}
                      disabled={rateLimited}
                      placeholder="name@example.com"
                      required
                      className={`w-full h-10 px-4 bg-surface-offwhite border rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                        errors.buyerEmail 
                          ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500' 
                          : 'border-border-strong focus:ring-accent-blue/20 focus:border-accent-blue'
                      }`}
                    />
                    {errors.buyerEmail && (
                      <span className="text-[12px] text-red-500 font-medium leading-tight">
                        {errors.buyerEmail}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                      <Phone size={13} className="text-on-surface-variant/80" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={buyerPhone}
                      onChange={(e) => handleFieldChange('buyerPhone', e.target.value, setBuyerPhone)}
                      onBlur={(e) => handleBlur('buyerPhone', e.target.value)}
                      disabled={rateLimited}
                      placeholder="e.g. 98XXXXXXXX"
                      required
                      className={`w-full h-10 px-4 bg-surface-offwhite border rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                        errors.buyerPhone 
                          ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500' 
                          : 'border-border-strong focus:ring-accent-blue/20 focus:border-accent-blue'
                      }`}
                    />
                    {errors.buyerPhone && (
                      <span className="text-[12px] text-red-500 font-medium leading-tight">
                        {errors.buyerPhone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Property Type and Location Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                      <Home size={13} className="text-on-surface-variant/80" />
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      disabled={rateLimited}
                      className="w-full h-10 px-3 bg-surface-offwhite border border-border-strong rounded-xl text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all disabled:opacity-60"
                    >
                      <option value="house">House</option>
                      <option value="flat">Apartment / Flat</option>
                      <option value="land">Land Plot</option>
                      <option value="commercial">Commercial Space</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                      <MapPin size={13} className="text-on-surface-variant/80" />
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      ref={locationInputRef}
                      value={location}
                      onChange={(e) => handleFieldChange('location', e.target.value, setLocation)}
                      onBlur={(e) => handleBlur('location', e.target.value)}
                      disabled={rateLimited}
                      placeholder="e.g. Baluwatar, Kathmandu"
                      required
                      className={`w-full h-10 px-4 bg-surface-offwhite border rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                        errors.location 
                          ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500' 
                          : 'border-border-strong focus:ring-accent-blue/20 focus:border-accent-blue'
                      }`}
                    />
                    {errors.location && (
                      <span className="text-[12px] text-red-500 font-medium leading-tight">
                        {errors.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini-map Location Picker */}
                <div className="flex flex-col gap-1.5 mt-1 animate-[fadeInUp_0.2s_ease-out]">
                  <label className="text-[12px] font-semibold text-on-surface-variant flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-accent-blue" />
                      Pinpoint Location (Drag marker to set coordinates)
                    </span>
                    <span className="text-[11px] text-on-surface-variant/50 font-normal font-mono bg-surface-offwhite px-2 py-0.5 rounded border border-border-subtle">
                      Lat: {parseFloat(lat).toFixed(4)}, Lng: {parseFloat(lng).toFixed(4)}
                    </span>
                  </label>
                  
                  <div className="w-full h-[200px] rounded-xl border border-border-strong bg-surface-offwhite overflow-hidden relative shadow-sm">
                    {mapLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 gap-2">
                        <Loader2 size={20} className="animate-spin text-accent-blue" />
                        <span className="text-[11px] text-on-surface-variant font-medium">Loading Map...</span>
                      </div>
                    )}
                    
                    {mapError ? (
                      /* Fallback Canvas Map */
                      <div className="relative w-full h-full bg-slate-50">
                        <canvas
                          ref={canvasRef}
                          width={480}
                          height={200}
                          onClick={handleCanvasClick}
                          className="w-full h-full cursor-crosshair block"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-medium select-none pointer-events-none">
                          Offline Fallback Canvas Mode
                        </div>
                      </div>
                    ) : (
                      /* Google Map Container */
                      <div ref={mapRef} className="w-full h-full" />
                    )}
                  </div>
                </div>

                {/* Conditional Fields: Bedrooms / Bathrooms */}
                {(propertyType === 'house' || propertyType === 'flat') && (
                  <div className="grid grid-cols-2 gap-4 animate-[fadeInUp_0.2s_ease-out]">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-on-surface-variant">
                        Bedrooms (BHK)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        disabled={rateLimited}
                        placeholder="e.g. 3"
                        className="w-full h-10 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all disabled:opacity-60"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-on-surface-variant">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        disabled={rateLimited}
                        placeholder="e.g. 2"
                        className="w-full h-10 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                )}

                {/* Budget Min/Max Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                      <Landmark size={13} className="text-on-surface-variant/80" />
                      Min Budget (Rs.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      disabled={rateLimited}
                      placeholder="e.g. 10000000"
                      required
                      className="w-full h-10 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all disabled:opacity-60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                      <Landmark size={13} className="text-on-surface-variant/80" />
                      Max Budget (Rs.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      disabled={rateLimited}
                      placeholder="e.g. 15000000"
                      required
                      className="w-full h-10 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                    <AlignLeft size={13} className="text-on-surface-variant/80" />
                    Additional Requirements
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => handleFieldChange('description', e.target.value, setDescription)}
                    onBlur={(e) => handleBlur('description', e.target.value)}
                    disabled={rateLimited}
                    placeholder="Describe specific features (e.g. road size, facing direction, garden, etc.)..."
                    rows={3}
                    className={`w-full p-4 bg-surface-offwhite border rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 transition-all resize-none disabled:opacity-60 ${
                      errors.description 
                        ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500' 
                        : 'border-border-strong focus:ring-accent-blue/20 focus:border-accent-blue'
                    }`}
                  />
                  {errors.description && (
                    <span className="text-[12px] text-red-500 font-medium leading-tight">
                      {errors.description}
                    </span>
                  )}
                </div>

                {/* Disclaimer */}
                <p className="text-[11px] text-on-surface-variant/70 leading-relaxed font-medium mt-1">
                  By posting, you agree that Nepal Exchange Pvt. Ltd can store and process these details. Contact information is only shared with verified, authenticated brokers.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || rateLimited}
                  className="w-full h-11 mt-2 bg-accent-blue hover:opacity-95 text-white rounded-full text-[14px] font-semibold transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting Demand...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit Demand</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
