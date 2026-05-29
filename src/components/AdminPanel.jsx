import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PlusCircle, Layers, MessageSquare,
  Trash2, ShieldCheck, Mail, Upload, Sparkles, Plus,
  TrendingUp, Calendar, Inbox, DollarSign, MoreHorizontal,
  Edit3, X, CheckCircle2, XCircle, Eye, ClipboardList,
  Loader2, AlertTriangle, MapPin, Search
} from 'lucide-react';
import {
  createProperty, updateProperty, deleteProperty,
  fetchInquiries, updateInquiryStatus,
  fetchSubmissions, approveSubmission, rejectSubmission, uploadImage,
  approveDemand, rejectDemand
} from '../lib/propertyService';
// Predefined cities mapping for local geocoding lookup inside AdminPanel
const adminCitiesLookup = {
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

export default function AdminPanel({ 
  properties, 
  setProperties, 
  agents, 
  onPropertiesChange,
  demands = [],
  onDemandsChange
}) {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [tagline, setTagline] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [area, setArea] = useState('3000');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Nepal Property Details & Location coordinates
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Kathmandu');
  const [district, setDistrict] = useState('Kathmandu');
  const [lat, setLat] = useState('27.7172');
  const [lng, setLng] = useState('85.3240');
  const [roadAccess, setRoadAccess] = useState('');
  const [facing, setFacing] = useState('');
  const [builtYear, setBuiltYear] = useState('');

  // Mini-map picker states & refs
  const [mapError, setMapError] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const adminMapRef = React.useRef(null);
  const adminMapInstanceRef = React.useRef(null);
  const adminMarkerRef = React.useRef(null);

  // Initialize and load Google Maps inside Admin Panel
  useEffect(() => {
    if (activeSubTab !== 'add') return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'placeholder' || apiKey.trim() === '') {
      setMapError(true);
      return;
    }

    setMapLoading(true);
    setMapError(false);
    loadGoogleMapsAPI(apiKey)
      .then((google) => {
        setMapLoading(false);
        if (!adminMapRef.current) return;

        const currentLat = parseFloat(lat) || 27.7172;
        const currentLng = parseFloat(lng) || 85.3240;
        const centerPos = { lat: currentLat, lng: currentLng };

        const map = new google.maps.Map(adminMapRef.current, {
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

        adminMapInstanceRef.current = map;

        const marker = new google.maps.Marker({
          position: centerPos,
          map: map,
          draggable: true,
          title: "Drag to set location"
        });

        adminMarkerRef.current = marker;

        // Map Click updates coordinates and marker
        map.addListener('click', (e) => {
          const clickPos = e.latLng;
          marker.setPosition(clickPos);
          setLat(String(clickPos.lat().toFixed(6)));
          setLng(String(clickPos.lng().toFixed(6)));
        });

        // Marker Drag updates coordinates
        marker.addListener('dragend', () => {
          const dragPos = marker.getPosition();
          setLat(String(dragPos.lat().toFixed(6)));
          setLng(String(dragPos.lng().toFixed(6)));
        });
      })
      .catch((err) => {
        console.warn("Failed to load Google Maps inside AdminPanel:", err);
        setMapError(true);
        setMapLoading(false);
      });

    return () => {
      adminMapInstanceRef.current = null;
      adminMarkerRef.current = null;
    };
  }, [activeSubTab]);

  // Sync marker position when lat/lng inputs change manually
  useEffect(() => {
    if (adminMapInstanceRef.current && adminMarkerRef.current) {
      const currentLat = parseFloat(lat);
      const currentLng = parseFloat(lng);
      if (!isNaN(currentLat) && !isNaN(currentLng)) {
        const newPos = { lat: currentLat, lng: currentLng };
        adminMarkerRef.current.setPosition(newPos);
        adminMapInstanceRef.current.panTo(newPos);
      }
    }
  }, [lat, lng]);

  const handleGeocodeLookup = () => {
    const query = `${address}, ${city}`.trim();
    if (!query) {
      showToast('Please type an address or city first.', 'error');
      return;
    }

    if (window.google && window.google.maps && !mapError) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          setLat(String(loc.lat().toFixed(6)));
          setLng(String(loc.lng().toFixed(6)));
          showToast('Location coordinates resolved!');
        } else {
          fallbackGeocodeLookup();
        }
      });
    } else {
      fallbackGeocodeLookup();
    }
  };

  const fallbackGeocodeLookup = () => {
    const cleanedQuery = `${address} ${city}`.toLowerCase().trim();
    let targetLoc = null;
    
    for (const [key, coord] of Object.entries(adminCitiesLookup)) {
      if (cleanedQuery.includes(key) || key.includes(cleanedQuery)) {
        targetLoc = coord;
        break;
      }
    }

    if (targetLoc) {
      setLat(String(targetLoc.lat.toFixed(6)));
      setLng(String(targetLoc.lng.toFixed(6)));
      showToast('Resolved to nearest city center coordinates.');
    } else {
      showToast('Could not resolve. Please enter coordinates manually.', 'error');
    }
  };



  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [aiDraftText, setAiDraftText] = useState('');

  // Submissions State
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');

  // Demands State
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [demandRejectNotes, setDemandRejectNotes] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load inquiries and submissions from Supabase
  useEffect(() => {
    loadInquiries();
    loadSubmissions();
  }, []);

  const loadInquiries = async () => {
    try {
      const data = await fetchInquiries();
      if (data.length > 0) {
        setInquiries(data);
      } else {
        // Fallback mock inquiries
        setInquiries([
          { id: 'mock-1', name: "Rohan Sharma", email: "rohan.s@email.com", message: "Interested in the Helix Penthouse. Can we arrange a VR walkthrough tomorrow?", status: "New", date: "2 hours ago", property: "The Helix Penthouse" },
          { id: 'mock-2', name: "Priya Kapoor", email: "p.kapoor@global.com", message: "Does Emerald Estates Villa 4 support solar grid additions?", status: "Replied", date: "Yesterday", property: "Emerald Estates Villa 4" },
          { id: 'mock-3', name: "Vikram Malhotra", email: "v.malhotra@tech.in", message: "Is the price on Skyline Towers — 4BHK negotiable?", status: "Pending", date: "Oct 22, 2024", property: "Skyline Towers — 4BHK" },
          { id: 'mock-4', name: "Ananya Iyer", email: "ananya.i@art.org", message: "Is The Marquee Residences available for immediate move in?", status: "Replied", date: "Oct 21, 2024", property: "The Marquee Residences" }
        ]);
      }
    } catch (err) {
      console.warn('Failed to load inquiries');
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await fetchSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.warn('Failed to load submissions');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Handle image file selection
  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImage('');
    }
  };

  // Handle add / edit property
  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!title || !price) return;
    setLoading(true);

    try {
      let finalImageUrl = image;

      // Upload image if file was selected
      if (imageFile) {
        try {
          finalImageUrl = await uploadImage(imageFile);
        } catch (uploadErr) {
          console.warn('Image upload failed:', uploadErr.message);
          if (!image) {
            finalImageUrl = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80';
          }
        }
      }

      const ropaniBreakdown = sqftToRopaniBreakdown(parseInt(area) || 0);
      const [r, a, p, d] = ropaniBreakdown.split('-').map(Number);
      const areaLocal = { ropani: r, aana: a, paisa: p, dam: d, sqft: parseInt(area) || 0 };

      const locationData = {
        lat: parseFloat(lat) || 27.7172,
        lng: parseFloat(lng) || 85.3240,
        address: address || 'Baluwatar Road',
        city: city || 'Kathmandu',
        district: district || 'Kathmandu',
        state: 'Bagmati',
        zip: '44600'
      };

      if (editingId) {
        // UPDATE existing property
        await updateProperty(editingId, {
          title,
          price: parseFloat(price) * 100000,
          tagline,
          image: finalImageUrl,
          location: locationData,
          roadAccess,
          facing,
          builtYear: parseInt(builtYear) || null,
          areaLocal,
          details: {
            bedrooms: parseInt(bedrooms),
            bathrooms: Math.ceil(parseInt(bedrooms) * 0.9),
            area: parseInt(area),
            floors: 1,
            parking: 2
          },
        });
        showToast('Property updated successfully!');
      } else {
        // CREATE new property
        await createProperty({
          title,
          price: parseFloat(price) * 100000,
          tagline,
          image: finalImageUrl,
          location: locationData,
          roadAccess,
          facing,
          builtYear: parseInt(builtYear) || null,
          areaLocal,
          details: {
            bedrooms: parseInt(bedrooms),
            bathrooms: Math.ceil(parseInt(bedrooms) * 0.9),
            area: parseInt(area),
            floors: 1,
            parking: 2
          },
        });
        showToast('Listing created successfully!');
      }

      // Refresh properties
      if (onPropertiesChange) onPropertiesChange();

      // Reset form
      resetForm();
      setActiveSubTab('overview');
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setTagline('');
    setBedrooms('3');
    setArea('3000');
    setImage('');
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);

    // Nepal specifications
    setAddress('');
    setCity('Kathmandu');
    setDistrict('Kathmandu');
    setLat('27.7172');
    setLng('85.3240');
    setRoadAccess('');
    setFacing('');
    setBuiltYear('');
  };

  // Start editing a property
  const startEdit = (prop) => {
    setEditingId(prop.id);
    setTitle(prop.title);
    setPrice(String(prop.price / 100000));
    setTagline(prop.tagline || '');
    setBedrooms(String(prop.details?.bedrooms || 3));
    setArea(String(prop.details?.area || 3000));
    setImage(prop.image || '');
    setImagePreview('');
    setImageFile(null);

    // Load location and Nepal specifications
    setAddress(prop.location?.address || '');
    setCity(prop.location?.city || 'Kathmandu');
    setDistrict(prop.location?.district || 'Kathmandu');
    setLat(String(prop.location?.lat || '27.7172'));
    setLng(String(prop.location?.lng || '85.3240'));
    setRoadAccess(prop.roadAccess || '');
    setFacing(prop.facing || '');
    setBuiltYear(prop.builtYear ? String(prop.builtYear) : '');

    setActiveSubTab('add');
  };

  // Delete property
  const handleDelete = async (propId) => {
    setActionLoading(propId);
    try {
      await deleteProperty(propId);
      if (onPropertiesChange) onPropertiesChange();
      showToast('Property deleted successfully!');
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setActionLoading('');
      setDeleteConfirm(null);
    }
  };



  // Draft AI Response
  const draftAIResponse = (inquiry) => {
    setSelectedInquiry(inquiry);
    let draft = "";
    if (inquiry.property.includes("Helix") || inquiry.property.includes("Penthouse")) {
      draft = `Dear ${inquiry.name},\n\nRegarding the Helix Penthouse: Yes, we can coordinate a private VR showing. I have availability tomorrow at 2:00 PM. Please confirm if that slot works for you.\n\nWarm regards,\nJulian Thorne\nNepal Exchange Pvt. Ltd`;
    } else if (inquiry.property.includes("Emerald")) {
      draft = `Dear ${inquiry.name},\n\nThe Emerald Estates Villa 4 features pre-installed solar connections and allows simple battery retrofits up to 40 kW.\n\nWarm regards,\nAlex Rivera\nLuxury Consultant`;
    } else {
      draft = `Dear ${inquiry.name},\n\nThank you for reaching out. Let us schedule a direct conversation node to review terms for the ${inquiry.property}.\n\nWarm regards,\nNepal Exchange Pvt. Ltd`;
    }
    setAiDraftText(draft);
  };

  // Handle inquiry reply
  const handleInquiryReply = async () => {
    if (!selectedInquiry) return;
    setActionLoading('reply');
    try {
      // Update status if it's a real DB inquiry
      if (!selectedInquiry.id.startsWith('mock-')) {
        await updateInquiryStatus(selectedInquiry.id, 'replied');
      }
      setInquiries(inquiries.map(item =>
        item.id === selectedInquiry.id ? { ...item, status: 'Replied' } : item
      ));
      showToast(`Reply sent to ${selectedInquiry.email}`);
      setSelectedInquiry(null);
    } catch (err) {
      showToast('Reply failed: ' + err.message, 'error');
    } finally {
      setActionLoading('');
    }
  };

  // Approve submission
  const handleApprove = async (submission) => {
    setActionLoading(submission.id);
    try {
      await approveSubmission(submission, user?.id);
      if (onPropertiesChange) onPropertiesChange();
      loadSubmissions();
      showToast(`"${submission.title}" approved and published!`);
      setSelectedSubmission(null);
    } catch (err) {
      showToast('Approval failed: ' + err.message, 'error');
    } finally {
      setActionLoading('');
    }
  };

  // Reject submission
  const handleReject = async (submissionId) => {
    setActionLoading(submissionId);
    try {
      await rejectSubmission(submissionId, user?.id, rejectNotes);
      loadSubmissions();
      showToast('Submission rejected');
      setSelectedSubmission(null);
      setRejectNotes('');
    } catch (err) {
      showToast('Rejection failed: ' + err.message, 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleApproveDemand = async (demand) => {
    setActionLoading(demand.id);
    try {
      await approveDemand(demand.id, user?.id);
      if (onDemandsChange) onDemandsChange();
      showToast(`Demand by "${demand.buyerName}" approved and published!`);
      setSelectedDemand(null);
    } catch (err) {
      showToast('Approval failed: ' + err.message, 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleRejectDemand = async (demandId) => {
    setActionLoading(demandId);
    try {
      await rejectDemand(demandId, user?.id, demandRejectNotes);
      if (onDemandsChange) onDemandsChange();
      showToast('Demand rejected');
      setSelectedDemand(null);
      setDemandRejectNotes('');
    } catch (err) {
      showToast('Rejection failed: ' + err.message, 'error');
    } finally {
      setActionLoading('');
    }
  };

  const pendingCount = submissions.filter(s => s.review_status === 'pending').length;
  const pendingDemandsCount = demands.filter(d => d.reviewStatus === 'pending').length;

  return (
    <div className="flex min-h-screen bg-surface-offwhite w-full">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-[64px] right-6 z-[60] px-5 py-3 rounded-xl shadow-lg text-[14px] font-semibold flex items-center gap-2 transition-all ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}
        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
        >
          {toast.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" style={{ animation: 'modalSlideIn 0.3s ease-out' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-primary">Delete Property</h3>
                <p className="text-[13px] text-on-surface-variant">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-[14px] text-on-surface-variant mb-6">
              Are you sure you want to permanently delete <strong className="text-primary">{deleteConfirm.title}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-[14px] font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={actionLoading === deleteConfirm.id}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[14px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading === deleteConfirm.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar: 240px white sidebar */}
      <aside className="w-[240px] border-r border-border-subtle bg-white flex flex-col fixed inset-y-0 left-0 z-40 pt-[52px]">
        <div className="p-5 flex-1 flex flex-col gap-2 mt-4 text-left">
          <button 
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${activeSubTab === 'overview' ? 'sidebar-active text-accent-blue bg-surface-offwhite' : 'text-on-surface-variant hover:bg-surface-offwhite hover:text-primary font-medium'}`}
          >
            <LayoutDashboard size={18} />
            <span className="text-[14px] font-semibold">Dashboard</span>
          </button>
          
          <button 
            onClick={() => { resetForm(); setActiveSubTab('add'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${activeSubTab === 'add' ? 'sidebar-active text-accent-blue bg-surface-offwhite' : 'text-on-surface-variant hover:bg-surface-offwhite hover:text-primary font-medium'}`}
          >
            <PlusCircle size={18} />
            <span className="text-[14px] font-semibold">Add Listing</span>
          </button>



          <button 
            onClick={() => setActiveSubTab('inquiries')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${activeSubTab === 'inquiries' ? 'sidebar-active text-accent-blue bg-surface-offwhite' : 'text-on-surface-variant hover:bg-surface-offwhite hover:text-primary font-medium'}`}
          >
            <MessageSquare size={18} />
            <span className="text-[14px] font-semibold">Inquiries</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('submissions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${activeSubTab === 'submissions' ? 'sidebar-active text-accent-blue bg-surface-offwhite' : 'text-on-surface-variant hover:bg-surface-offwhite hover:text-primary font-medium'}`}
          >
            <ClipboardList size={18} />
            <span className="text-[14px] font-semibold">Review Submissions</span>
            {pendingCount > 0 && (
              <span className="ml-auto bg-accent-blue text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveSubTab('demands')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${activeSubTab === 'demands' ? 'sidebar-active text-accent-blue bg-surface-offwhite' : 'text-on-surface-variant hover:bg-surface-offwhite hover:text-primary font-medium'}`}
          >
            <Inbox size={18} />
            <span className="text-[14px] font-semibold">Review Demands</span>
            {pendingDemandsCount > 0 && (
              <span className="ml-auto bg-accent-blue text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {pendingDemandsCount}
              </span>
            )}
          </button>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-border-subtle bg-white text-left">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-indigo-600 flex items-center justify-center">
              <span className="text-white text-[13px] font-bold">
                {user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[14px] font-bold text-primary truncate">{user?.email?.split('@')[0] || 'Agent'}</span>
              <span className="text-[12px] text-on-surface-variant font-medium truncate">{user?.email || 'agent@nepalexchange.com.np'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[240px] p-gutter pt-[80px] min-h-screen text-left">
        <div className="max-w-[980px] mx-auto py-8">
          
          {/* Subtab: Overview */}
          {activeSubTab === 'overview' && (
            <div>
              {/* Header Actions */}
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-[32px] font-bold text-primary tracking-tight">Welcome back</h1>
                  <p className="text-on-surface-variant text-[17px] mt-1">Here is what's happening with your properties today.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveSubTab('inquiries')}
                    className="px-6 py-2.5 bg-white border border-border-strong text-primary rounded-full text-[14px] font-semibold hover:bg-surface-offwhite transition-all cursor-pointer"
                  >
                    View Inquiries
                  </button>
                  <button 
                    onClick={() => { resetForm(); setActiveSubTab('add'); }}
                    className="px-6 py-2.5 bg-accent-blue text-white rounded-full text-[14px] font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Plus size={16} />
                    <span>Add Listing</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="text-on-surface-variant text-[14px] font-semibold mb-2">Active Listings</p>
                  <p className="text-[32px] font-bold text-primary">{properties.length}</p>
                  <div className="mt-2 flex items-center gap-1 text-success text-[13px] font-semibold">
                    <TrendingUp size={14} />
                    <span>2 New this week</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="text-on-surface-variant text-[14px] font-semibold mb-2">New Inquiries</p>
                  <p className="text-[32px] font-bold text-accent-blue">{inquiries.filter(i => i.status === 'New').length || 5}</p>
                  <div className="mt-2 text-on-surface-variant text-[13px] font-medium">
                    Requires immediate action
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="text-on-surface-variant text-[14px] font-semibold mb-2">Pending Reviews</p>
                  <p className="text-[32px] font-bold text-orange-500">{pendingCount}</p>
                  <div className="mt-2 text-on-surface-variant text-[13px] font-medium">
                    Seller submissions
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="text-on-surface-variant text-[14px] font-semibold mb-2">Revenue</p>
                  <p className="text-[32px] font-bold text-primary">Rs. 2.4Cr</p>
                  <div className="mt-2 text-success text-[13px] font-semibold">
                    Q3 Target achieved
                  </div>
                </div>
              </div>

              {/* Properties List with Edit/Delete */}
              <div className="bg-white rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-5 border-b border-border-subtle flex justify-between items-center">
                  <h2 className="text-[24px] font-semibold text-primary">Your Properties</h2>
                  <span className="text-[14px] text-on-surface-variant font-medium">{properties.length} total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-offwhite border-b border-border-subtle">
                        <th className="px-6 py-4 text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Property</th>
                        <th className="px-6 py-4 text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-[13px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {properties.map(prop => (
                        <tr key={prop.id} className="hover:bg-surface-offwhite transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {prop.image && (
                                <img src={prop.image} alt={prop.title} className="w-10 h-10 rounded-lg object-cover" />
                              )}
                              <div className="flex flex-col">
                                <span className="text-[15px] font-semibold text-primary">{prop.title}</span>
                                <span className="text-[12px] text-on-surface-variant">{prop.details?.bedrooms || '—'} BHK · {prop.details?.area || '—'} sqft</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[15px] font-semibold text-primary">
                            Rs. {(prop.price / 100000).toFixed(0)}L
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              prop.status === 'available' ? 'bg-green-50 text-green-600' :
                              prop.status === 'sold' ? 'bg-red-50 text-red-600' :
                              'bg-yellow-50 text-yellow-600'
                            }`}>
                              {prop.status || 'available'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEdit(prop)}
                                className="p-2 text-on-surface-variant hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(prop)}
                                className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Subtab: Add / Edit Property */}
          {activeSubTab === 'add' && (
            <div className="max-w-2xl bg-white border border-border-subtle rounded-card p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[24px] font-semibold text-primary">
                  {editingId ? 'Edit Listing' : 'Create Listing'}
                </h2>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-[13px] text-on-surface-variant hover:text-primary font-semibold cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleAddProperty} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-on-surface-variant">Property Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Skyline Oasis Villa" 
                    className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Price (in Lakhs)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)} 
                      placeholder="e.g. 75" 
                      className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Area (sqft)</label>
                    <input 
                      type="number" 
                      value={area} 
                      onChange={e => setArea(e.target.value)} 
                      placeholder="e.g. 3000" 
                      className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Bedrooms</label>
                    <select 
                      value={bedrooms} 
                      onChange={e => setBedrooms(e.target.value)} 
                      className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                    >
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Property Photo</label>
                    <label className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] flex items-center gap-2 cursor-pointer hover:bg-border-subtle transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        className="hidden"
                      />
                      <Upload size={16} className="text-accent-blue" />
                      <span className="text-on-surface-variant truncate">
                        {imageFile ? imageFile.name : 'Upload image...'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Image URL fallback */}
                {!imageFile && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Or Image URL</label>
                    <input 
                      type="text" 
                      value={image} 
                      onChange={e => setImage(e.target.value)} 
                      placeholder="https://..."
                      className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                    />
                  </div>
                )}

                {/* Image Preview */}
                {(imagePreview || image) && (
                  <div className="rounded-xl overflow-hidden border border-border-subtle">
                    <img src={imagePreview || image} alt="Preview" className="w-full h-40 object-cover" />
                  </div>
                )}

                {/* Nepal Property Specifications */}
                <div className="border-t border-border-subtle pt-4 mt-2 text-left">
                  <h3 className="text-[14px] font-bold text-primary mb-3">Nepal Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-on-surface-variant">Road Access (e.g. 13ft, 20ft)</label>
                      <input 
                        type="text" 
                        value={roadAccess} 
                        onChange={e => setRoadAccess(e.target.value)} 
                        placeholder="e.g. 13ft" 
                        className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-on-surface-variant">Facing Direction</label>
                      <input 
                        type="text" 
                        value={facing} 
                        onChange={e => setFacing(e.target.value)} 
                        placeholder="e.g. East" 
                        className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-on-surface-variant">Built Year</label>
                      <input 
                        type="number" 
                        value={builtYear} 
                        onChange={e => setBuiltYear(e.target.value)} 
                        placeholder="e.g. 2022" 
                        className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      />
                    </div>
                  </div>
                </div>

                {/* Location and Map Pinning */}
                <div className="border-t border-border-subtle pt-4 text-left">
                  <h3 className="text-[14px] font-bold text-primary mb-3">Location & Map Pinning</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-on-surface-variant">Street Address / Local Area</label>
                      <input 
                        type="text" 
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                        placeholder="e.g. Baluwatar Marg" 
                        className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-on-surface-variant">City</label>
                      <select 
                        value={city} 
                        onChange={e => setCity(e.target.value)} 
                        className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      >
                        <option value="">Select a city...</option>
                        {Object.keys(adminCitiesLookup).sort().map((cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-on-surface-variant">District</label>
                      <input 
                        type="text" 
                        value={district} 
                        onChange={e => setDistrict(e.target.value)} 
                        placeholder="e.g. Kathmandu" 
                        className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 mt-3 items-end">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-on-surface-variant">Latitude</label>
                      <input 
                        type="text" 
                        value={lat} 
                        onChange={e => setLat(e.target.value)} 
                        className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-on-surface-variant">Longitude</label>
                      <input 
                        type="text" 
                        value={lng} 
                        onChange={e => setLng(e.target.value)} 
                        className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleGeocodeLookup}
                      className="h-11 px-6 bg-surface-offwhite hover:bg-border-subtle text-primary border border-border-strong rounded-full text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <Search size={14} className="text-accent-blue" />
                      Get Coordinates
                    </button>
                  </div>

                  {/* Interactive Mini-map location picker */}
                  <div className="w-full h-[220px] rounded-lg border border-border-subtle bg-surface-offwhite mt-4 relative overflow-hidden">
                    {mapLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 gap-2">
                        <Loader2 size={18} className="animate-spin text-accent-blue" />
                        <span className="text-[12px] font-semibold text-primary">Loading Map...</span>
                      </div>
                    )}
                    {mapError ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-surface-offwhite">
                        <MapPin size={24} className="text-accent-blue mb-1" />
                        <span className="text-[13px] font-bold text-primary">Offline Map Grid Mode</span>
                        <span className="text-[11px] text-on-surface-variant mt-0.5">
                          Set coordinates manually above or search address.
                        </span>
                      </div>
                    ) : (
                      <div ref={adminMapRef} className="w-full h-full" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-on-surface-variant">Brief Description</label>
                  <textarea 
                    value={tagline} 
                    onChange={e => setTagline(e.target.value)} 
                    placeholder="Accents & location details..." 
                    className="w-full h-24 p-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue resize-none" 
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-accent-blue hover:opacity-90 text-white rounded-full text-[14px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {editingId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingId ? 'Update Listing' : 'Publish Listing'
                  )}
                </button>
              </form>
            </div>
          )}



          {/* Subtab: Inquiries */}
          {activeSubTab === 'inquiries' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-[24px] font-semibold text-primary mb-6">Inquiries Hub</h2>
                <div className="flex flex-col gap-4">
                  {inquiries.map(inq => (
                    <div 
                      key={inq.id}
                      onClick={() => draftAIResponse(inq)}
                      className={`bg-white border rounded-card p-5 cursor-pointer transition-all text-left shadow-sm ${selectedInquiry?.id === inq.id ? 'border-accent-blue' : 'border-border-subtle hover:border-border-strong'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-primary text-[15px]">{inq.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inq.status === 'New' ? 'bg-[#abc7ff]/30 text-accent-blue' :
                          inq.status === 'Replied' ? 'bg-success/15 text-success' : 'bg-orange-100 text-orange-700'
                        }`}>{inq.status}</span>
                      </div>
                      <div className="text-[13px] text-on-surface-variant mb-2">
                        Property: <strong className="text-primary font-semibold">{inq.property}</strong>
                      </div>
                      <p className="text-[14px] text-on-surface-variant italic font-medium">"{inq.message}"</p>
                    </div>
                  ))}
                  {inquiries.length === 0 && (
                    <div className="py-12 text-center text-on-surface-variant">
                      <Inbox size={32} className="mx-auto mb-3 opacity-40" />
                      <p className="text-[14px] font-medium">No inquiries yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Draft AI Panel */}
              <div>
                {selectedInquiry ? (
                  <div className="bg-white border border-border-subtle rounded-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <h3 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-1.5">
                      <Sparkles size={16} className="text-accent-blue" /> 
                      <span>AI Suggested Reply</span>
                    </h3>
                    <textarea 
                      value={aiDraftText}
                      onChange={e => setAiDraftText(e.target.value)}
                      className="w-full h-44 p-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue resize-none mb-4 font-mono leading-relaxed"
                    />
                    <button 
                      onClick={handleInquiryReply}
                      disabled={actionLoading === 'reply'}
                      className="w-full h-11 bg-accent-blue hover:opacity-90 text-white rounded-full text-[14px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading === 'reply' ? (
                        <><Loader2 size={14} className="animate-spin" /> Sending...</>
                      ) : (
                        'Send Reply'
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col justify-center items-center border border-dashed border-border-strong rounded-card p-10 text-on-surface-variant text-center bg-white">
                    <Mail size={32} className="mb-3 text-accent-blue" />
                    <p className="text-[14px] font-medium">Select an inquiry node to generate draft responses</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtab: Review Submissions */}
          {activeSubTab === 'submissions' && (
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-[28px] font-bold text-primary tracking-tight">Review Submissions</h1>
                  <p className="text-on-surface-variant text-[15px] mt-1">Seller property submissions awaiting your review.</p>
                </div>
                <button
                  onClick={loadSubmissions}
                  className="px-5 py-2 bg-white border border-border-strong text-primary rounded-full text-[13px] font-semibold hover:bg-surface-offwhite transition-all cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-border-strong">
                  <ClipboardList size={40} className="mx-auto mb-4 text-on-surface-variant opacity-30" />
                  <h3 className="text-[18px] font-bold text-primary mb-2">No submissions yet</h3>
                  <p className="text-[14px] text-on-surface-variant">When sellers submit properties via the Sell tab, they'll appear here for review.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Submissions List */}
                  <div className="flex flex-col gap-4">
                    {submissions.map(sub => (
                      <div
                        key={sub.id}
                        onClick={() => { setSelectedSubmission(sub); setRejectNotes(''); }}
                        className={`bg-white border rounded-xl p-5 cursor-pointer transition-all ${
                          selectedSubmission?.id === sub.id ? 'border-accent-blue shadow-md' : 'border-border-subtle hover:border-border-strong'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-[16px] font-bold text-primary">{sub.title}</h3>
                            <p className="text-[13px] text-on-surface-variant mt-0.5">
                              by {sub.seller_name} · {sub.seller_email}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            sub.review_status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            sub.review_status === 'approved' ? 'bg-green-50 text-green-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {sub.review_status}
                          </span>
                        </div>
                        <div className="flex gap-4 text-[13px] text-on-surface-variant">
                          <span>Rs. {(sub.price / 100000).toFixed(0)}L</span>
                          <span>{sub.details?.bedrooms || '—'} BHK</span>
                          <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submission Detail */}
                  <div>
                    {selectedSubmission ? (
                      <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-[80px]">
                        <h3 className="text-[20px] font-bold text-primary mb-1">{selectedSubmission.title}</h3>
                        <p className="text-[14px] text-on-surface-variant mb-4">
                          Submitted by <strong>{selectedSubmission.seller_name}</strong>
                        </p>

                        {selectedSubmission.image && (
                          <img
                            src={selectedSubmission.image}
                            alt={selectedSubmission.title}
                            className="w-full h-44 object-cover rounded-xl border border-border-subtle mb-4"
                          />
                        )}

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-surface-offwhite p-3 rounded-lg">
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase">Price</p>
                            <p className="text-[16px] font-bold text-primary">Rs. {(selectedSubmission.price / 100000).toFixed(0)} Lakhs</p>
                          </div>
                          <div className="bg-surface-offwhite p-3 rounded-lg">
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase">Config</p>
                            <p className="text-[16px] font-bold text-primary">{selectedSubmission.details?.bedrooms || '—'} BHK · {selectedSubmission.details?.area || '—'} sqft</p>
                          </div>
                        </div>

                        {selectedSubmission.description && (
                          <div className="bg-surface-offwhite p-3 rounded-lg mb-4">
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase mb-1">Description</p>
                            <p className="text-[14px] text-primary">{selectedSubmission.description}</p>
                          </div>
                        )}

                        <div className="bg-surface-offwhite p-3 rounded-lg mb-6">
                          <p className="text-[11px] text-on-surface-variant font-bold uppercase mb-1">Seller Contact</p>
                          <p className="text-[14px] text-primary">{selectedSubmission.seller_email}</p>
                          {selectedSubmission.seller_phone && (
                            <p className="text-[13px] text-on-surface-variant">{selectedSubmission.seller_phone}</p>
                          )}
                        </div>

                        {selectedSubmission.review_status === 'pending' && (
                          <>
                            <div className="flex flex-col gap-2 mb-4">
                              <label className="text-[12px] font-semibold text-on-surface-variant">Reviewer Notes (optional)</label>
                              <textarea
                                value={rejectNotes}
                                onChange={(e) => setRejectNotes(e.target.value)}
                                placeholder="Add notes for rejection reason..."
                                rows={2}
                                className="w-full p-3 bg-surface-offwhite border border-border-strong rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 resize-none"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleApprove(selectedSubmission)}
                                disabled={actionLoading === selectedSubmission.id}
                                className="flex-1 h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[13px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {actionLoading === selectedSubmission.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={14} />
                                )}
                                Approve & Publish
                              </button>
                              <button
                                onClick={() => handleReject(selectedSubmission.id)}
                                disabled={actionLoading === selectedSubmission.id}
                                className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[13px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </div>
                          </>
                        )}

                        {selectedSubmission.review_status !== 'pending' && (
                          <div className={`px-4 py-3 rounded-xl text-[13px] font-medium ${
                            selectedSubmission.review_status === 'approved'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            This submission has been <strong>{selectedSubmission.review_status}</strong>
                            {selectedSubmission.reviewer_notes && (
                              <p className="mt-1 opacity-80">Notes: {selectedSubmission.reviewer_notes}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full min-h-[300px] flex flex-col justify-center items-center border border-dashed border-border-strong rounded-xl p-10 text-on-surface-variant text-center bg-white">
                        <Eye size={32} className="mb-3 text-accent-blue" />
                        <p className="text-[14px] font-medium">Select a submission to review details</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'demands' && (
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-[28px] font-bold text-primary tracking-tight">Review Demands</h1>
                  <p className="text-on-surface-variant text-[15px] mt-1">Buyer property requirements awaiting review.</p>
                </div>
              </div>

              {demands.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-border-strong">
                  <Inbox size={40} className="mx-auto mb-4 text-on-surface-variant opacity-30" />
                  <h3 className="text-[18px] font-bold text-primary mb-2">No demands posted</h3>
                  <p className="text-[14px] text-on-surface-variant">When buyers post property demands, they'll appear here for review.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Demands List */}
                  <div className="flex flex-col gap-4 text-left">
                    {demands.map(demand => (
                      <div
                        key={demand.id}
                        onClick={() => { setSelectedDemand(demand); setDemandRejectNotes(''); }}
                        className={`bg-white border rounded-xl p-5 cursor-pointer transition-all ${
                          selectedDemand?.id === demand.id ? 'border-accent-blue shadow-md' : 'border-border-subtle hover:border-border-strong'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-[16px] font-bold text-primary">{demand.location}</h3>
                            <p className="text-[13px] text-on-surface-variant mt-0.5">
                              by {demand.buyerName}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            demand.reviewStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                            demand.reviewStatus === 'approved' ? 'bg-green-50 text-green-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {demand.reviewStatus}
                          </span>
                        </div>
                        <div className="flex gap-4 text-[13px] text-on-surface-variant">
                          <span className="font-semibold text-accent-blue">Rs. {(demand.minPrice/100000).toFixed(0)}L - {(demand.maxPrice/100000).toFixed(0)}L</span>
                          <span className="capitalize">{demand.propertyType}</span>
                          <span>{demand.createdAt ? new Date(demand.createdAt).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Demand Detail Panel */}
                  <div>
                    {selectedDemand ? (
                      <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-[80px] text-left">
                        <div className="flex justify-between items-center mb-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-offwhite border border-border-subtle capitalize`}>
                            {selectedDemand.propertyType}
                          </span>
                          <span className="text-[12px] text-on-surface-variant font-medium">
                            Posted: {selectedDemand.createdAt ? new Date(selectedDemand.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>

                        <h3 className="text-[20px] font-bold text-primary mb-1">Looking in {selectedDemand.location}</h3>
                        <p className="text-[14px] text-on-surface-variant mb-6">
                          Submitted by <strong>{selectedDemand.buyerName}</strong>
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <div className="bg-surface-offwhite p-3 rounded-lg">
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase">Budget Range</p>
                            <p className="text-[15px] font-bold text-primary">Rs. {(selectedDemand.minPrice / 100000).toFixed(0)}L - {(selectedDemand.maxPrice / 100000).toFixed(0)}L</p>
                          </div>
                          <div className="bg-surface-offwhite p-3 rounded-lg">
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase">Specification</p>
                            <p className="text-[15px] font-bold text-primary">
                              {selectedDemand.details?.bedrooms ? `${selectedDemand.details.bedrooms} BHK` : 'N/A'}
                            </p>
                          </div>
                        </div>

                        {selectedDemand.description && (
                          <div className="bg-surface-offwhite p-3 rounded-lg mb-5">
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase mb-1">Requirements Message</p>
                            <p className="text-[14px] text-primary italic">"{selectedDemand.description}"</p>
                          </div>
                        )}

                        <div className="bg-surface-offwhite p-3 rounded-lg mb-6 border border-border-subtle/50">
                          <p className="text-[11px] text-on-surface-variant font-bold uppercase mb-2">Buyer Verification Info</p>
                          <div className="flex flex-col gap-1.5 text-[13px] text-primary">
                            <div className="flex items-center gap-2">
                              <Mail size={13} className="text-on-surface-variant/70" />
                              <span>{selectedDemand.buyerEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={13} className="text-on-surface-variant/70" />
                              <span>{selectedDemand.buyerPhone}</span>
                            </div>
                          </div>
                        </div>

                        {selectedDemand.reviewStatus === 'pending' && (
                          <>
                            <div className="flex flex-col gap-2 mb-4">
                              <label className="text-[12px] font-semibold text-on-surface-variant">Reviewer Notes (optional)</label>
                              <textarea
                                value={demandRejectNotes}
                                onChange={(e) => setDemandRejectNotes(e.target.value)}
                                placeholder="Add notes for rejection reason..."
                                rows={2}
                                className="w-full p-3 bg-surface-offwhite border border-border-strong rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 resize-none"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleApproveDemand(selectedDemand)}
                                disabled={actionLoading === selectedDemand.id}
                                className="flex-1 h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[13px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {actionLoading === selectedDemand.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={14} />
                                )}
                                Approve & Publish
                              </button>
                              <button
                                onClick={() => handleRejectDemand(selectedDemand.id)}
                                disabled={actionLoading === selectedDemand.id}
                                className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[13px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </div>
                          </>
                        )}

                        {selectedDemand.reviewStatus !== 'pending' && (
                          <div className={`px-4 py-3 rounded-xl text-[13px] font-medium ${
                            selectedDemand.reviewStatus === 'approved'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            This demand has been <strong>{selectedDemand.reviewStatus}</strong>
                            {selectedDemand.reviewerNotes && (
                              <p className="mt-1 opacity-80">Notes: {selectedDemand.reviewerNotes}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full min-h-[300px] flex flex-col justify-center items-center border border-dashed border-border-strong rounded-xl p-10 text-on-surface-variant text-center bg-white">
                        <Eye size={32} className="mb-3 text-accent-blue" />
                        <p className="text-[14px] font-medium">Select a demand to review details</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
