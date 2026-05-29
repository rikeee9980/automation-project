import React, { useState } from 'react';
import { createSubmission, uploadImage } from '../lib/propertyService';
import {
  User, Mail, Phone, Home, DollarSign, BedDouble,
  Maximize, Upload, FileText, CheckCircle2, ArrowRight,
  ArrowLeft, Loader2, Sparkles, ImageIcon
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Your Info', icon: User },
  { id: 2, label: 'Property', icon: Home },
  { id: 3, label: 'Media', icon: ImageIcon },
  { id: 4, label: 'Review', icon: FileText },
];

const sellCitiesLookup = {
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

export default function SellProperty() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Seller Info
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [imageError, setImageError] = useState('');

  const validateNameInline = (val) => {
    if (!val.trim()) {
      setNameError('Name is required');
    } else {
      setNameError('');
    }
  };

  const validateEmailInline = (val) => {
    if (!val.trim()) {
      setEmailError('Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      setEmailError('Invalid email format (e.g. name@domain.com)');
    } else {
      setEmailError('');
    }
  };

  const validatePhoneInline = (val) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setPhoneError('Phone number is required');
      return;
    }
    let formatted = trimmed;
    if (/^9[678]\d{8}$/.test(trimmed)) {
      formatted = "+977-" + trimmed;
    }
    const phoneRegex = /^\+977[- ]?9[678]\d{8}$/;
    if (!phoneRegex.test(formatted)) {
      setPhoneError('Must start with +977 followed by 10-digit mobile');
    } else {
      setPhoneError('');
    }
  };

  // Step 2: Property Details
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [amenities, setAmenities] = useState('');

  // Step 3: Media
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 200 * 1024) {
        setImageError('Image size exceeds 200KB limit. Please choose a smaller photo.');
        setImageFile(null);
        setImagePreview('');
        return;
      }
      setImageError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  const handleSubmit = async () => {
    setError('');

    // Auto-fix Nepalese phone format if 10-digit number is input without +977
    let formattedPhone = sellerPhone.trim();
    if (/^9[678]\d{8}$/.test(formattedPhone)) {
      formattedPhone = "+977-" + formattedPhone;
      setSellerPhone(formattedPhone);
    }

    const errorMsg = validateForm(formattedPhone);
    if (errorMsg) {
      setError(errorMsg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = imageUrl;

      // Upload image if file was selected
      if (imageFile) {
        setUploading(true);
        try {
          finalImageUrl = await uploadImage(imageFile);
        } catch (uploadErr) {
          console.warn('Image upload failed, using URL fallback:', uploadErr.message);
          // If upload fails but URL is provided, use URL
          if (!imageUrl) {
            finalImageUrl = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80';
          }
        }
        setUploading(false);
      }

      // Resolve coordinates from input city
      const cleanedCity = (city || '').toLowerCase().trim();
      let lat = 27.7172;
      let lng = 85.3240;
      for (const [key, coord] of Object.entries(sellCitiesLookup)) {
        if (cleanedCity.includes(key) || key.includes(cleanedCity)) {
          lat = coord.lat;
          lng = coord.lng;
          break;
        }
      }

      await createSubmission({
        sellerName,
        sellerEmail,
        sellerPhone: formattedPhone,
        title,
        price: parseFloat(price) * 100000, // Convert lakhs to actual
        location: {
          address,
          city,
          district: city.charAt(0).toUpperCase() + city.slice(1) || 'Kathmandu',
          state: 'Bagmati',
          zip: '44600',
          lat,
          lng
        },
        details: {
          bedrooms: parseInt(bedrooms),
          bathrooms: Math.ceil(parseInt(bedrooms) * 0.9),
          area: parseInt(area) || 0,
          floors: 1,
          parking: 2,
        },
        amenities: amenities
          ? amenities.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
        image: finalImageUrl,
        description,
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    return true; // Lenient step progression: user can move through steps freely without completing
  };

  const validateForm = (formattedPhone) => {
    // Validate Seller Info
    if (!sellerName.trim()) {
      return "Seller Name is required (Step 1).";
    }
    if (!sellerEmail.trim()) {
      return "Seller Email is required (Step 1).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sellerEmail.trim())) {
      return "Seller Email format is invalid (Step 1).";
    }
    if (!formattedPhone) {
      return "Seller Phone Number is required (Step 1).";
    }

    // Strict validation for +977 and 10 digits
    const phoneRegex = /^\+977[- ]?9[678]\d{8}$/;
    if (!phoneRegex.test(formattedPhone)) {
      return "Seller Phone must start with +977 followed by a 10-digit Nepalese mobile number (e.g. +977-9841234567) (Step 1).";
    }

    // Validate Property Details
    if (!title.trim()) {
      return "Property Title is required (Step 2).";
    }
    if (!price || parseFloat(price) <= 0) {
      return "Price must be a positive number of Lakhs (Step 2).";
    }
    if (!area || parseInt(area) <= 0) {
      return "Area must be a positive number of sqft (Step 2).";
    }
    if (!address.trim()) {
      return "Address is required (Step 2).";
    }
    if (!city) {
      return "City selection is required (Step 2).";
    }

    // Validate Media
    if (!imageFile && !imageUrl) {
      return "Please upload a property photo or provide an image URL (Step 3).";
    }
    if (imageFile && imageFile.size > 200 * 1024) {
      return "Selected image size exceeds 200KB. Please choose a smaller photo (Step 3).";
    }
    if (!description.trim()) {
      return "Property description is required (Step 3).";
    }

    return null;
  };

  if (submitted) {
    return (
      <div className="max-w-[680px] mx-auto px-gutter py-16 text-center">
        <div
          className="bg-white rounded-2xl border border-border-subtle p-12 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          style={{ animation: 'modalSlideIn 0.4s ease-out' }}
        >
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-[28px] font-bold text-primary mb-3">
            Property Submitted!
          </h2>
          <p className="text-on-surface-variant text-[16px] leading-relaxed max-w-md mx-auto mb-8">
            Your property <strong className="text-primary">{title}</strong> has been
            submitted for review. Our team will evaluate your listing and publish
            it once approved.
          </p>
          <div className="bg-surface-offwhite border border-border-subtle rounded-xl p-5 text-left max-w-sm mx-auto">
            <p className="text-[13px] text-on-surface-variant font-medium mb-1">What happens next?</p>
            <ul className="space-y-2 text-[14px] text-primary font-medium">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-blue text-[11px] font-bold">1</span>
                </div>
                Admin reviews your submission
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-blue text-[11px] font-bold">2</span>
                </div>
                AI scoring & market analysis
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-blue text-[11px] font-bold">3</span>
                </div>
                Property goes live on Nepal Exchange
              </li>
            </ul>
          </div>
          <p className="text-[13px] text-on-surface-variant mt-6">
            You'll receive updates at <strong>{sellerEmail}</strong>
          </p>
        </div>
        <style>{`
          @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-[780px] mx-auto px-gutter py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-[13px] font-semibold mb-4">
          <Sparkles size={14} />
          <span>AI-Powered Listing</span>
        </div>
        <h1 className="text-[32px] font-bold text-primary tracking-tight mb-2">
          List Your Property
        </h1>
        <p className="text-on-surface-variant text-[16px] font-medium">
          Submit your property for review. Our AI will evaluate and optimize your listing.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => setCurrentStep(step.id)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${isActive
                    ? 'bg-accent-blue text-white shadow-md shadow-accent-blue/30'
                    : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-surface-offwhite text-on-surface-variant border border-border-subtle'
                    }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                </div>
                <span className={`text-[12px] font-semibold transition-colors ${isActive ? 'text-accent-blue' : 'text-on-surface-variant group-hover:text-primary'}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mb-6 mx-1 rounded-full transition-colors ${currentStep > step.id ? 'bg-green-400' : 'bg-border-subtle'
                  }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-border-subtle p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px] font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Seller Info */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-5">
            <h3 className="text-[20px] font-bold text-primary mb-2">Your Information</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                <User size={14} /> Full Name *
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => {
                  setSellerName(e.target.value);
                  validateNameInline(e.target.value);
                }}
                placeholder="John Doe"
                required
                className={`w-full h-11 px-4 bg-surface-offwhite border rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue ${nameError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-border-strong'}`}
              />
              {nameError && (
                <span className="text-red-500 text-[11px] font-semibold mt-1 pl-1">
                  {nameError}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <Mail size={14} /> Email *
                </label>
                <input
                  type="text"
                  value={sellerEmail}
                  onChange={(e) => {
                    setSellerEmail(e.target.value);
                    validateEmailInline(e.target.value);
                  }}
                  placeholder="you@email.com"
                  required
                  className={`w-full h-11 px-4 bg-surface-offwhite border rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-border-strong'}`}
                />
                {emailError && (
                  <span className="text-red-500 text-[11px] font-semibold mt-1 pl-1">
                    {emailError}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <Phone size={14} /> Phone *
                </label>
                <input
                  type="text"
                  value={sellerPhone}
                  onChange={(e) => {
                    setSellerPhone(e.target.value);
                    validatePhoneInline(e.target.value);
                  }}
                  placeholder="+977-9841234567"
                  required
                  className={`w-full h-11 px-4 bg-surface-offwhite border rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-border-strong'}`}
                />
                {phoneError && (
                  <span className="text-red-500 text-[11px] font-semibold mt-1 pl-1">
                    {phoneError}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Property Details */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-5">
            <h3 className="text-[20px] font-bold text-primary mb-2">Property Details</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                <Home size={14} /> Property Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Skyline Oasis Villa"
                required
                className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <DollarSign size={14} /> Price (Lakhs) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="75"
                  required
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <BedDouble size={14} /> Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <Maximize size={14} /> Area (sqft)
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="3000"
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant">Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  required
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                >
                  <option value="">Select a city...</option>
                  {Object.keys(sellCitiesLookup).sort().map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-on-surface-variant">Amenities (comma-separated)</label>
              <input
                type="text"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                placeholder="Smart Home, Pool, Garden, Gym"
                className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
              />
            </div>
          </div>
        )}

        {/* Step 3: Media */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5">
            <h3 className="text-[20px] font-bold text-primary mb-2">Photos & Description</h3>

            {/* Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-on-surface-variant">Property Photo *</label>
              <label
                className={`border-2 border-dashed bg-surface-offwhite hover:bg-border-subtle rounded-xl p-8 text-center cursor-pointer transition-all ${imageError ? 'border-red-500 bg-red-50/10' : 'border-border-strong'}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={imagePreview} alt="Preview" className="w-full max-w-xs h-40 object-cover rounded-xl" />
                    <span className="text-[13px] text-accent-blue font-semibold">Click to change image</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={28} className="text-accent-blue" />
                    <span className="text-primary font-bold text-[14px]">Upload property photo</span>
                    <span className="text-[12px] text-on-surface-variant">PNG, JPG up to 200KB</span>
                  </div>
                )}
              </label>
              {imageError && (
                <span className="text-red-500 text-[11px] font-semibold mt-1 pl-1">
                  {imageError}
                </span>
              )}
            </div>

            {/* Or use URL */}
            {!imageFile && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant">Or paste image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                />
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-on-surface-variant">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your property — highlight unique features, views, nearby landmarks..."
                rows={4}
                className="w-full p-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-6">
            <h3 className="text-[20px] font-bold text-primary mb-2">Review Your Submission</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Seller Info Card */}
              <div className="bg-surface-offwhite rounded-xl p-5 border border-border-subtle">
                <h4 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Seller Info</h4>
                <div className="space-y-2 text-[14px]">
                  <p><span className="text-on-surface-variant font-medium">Name:</span> <span className="text-primary font-semibold">{sellerName}</span></p>
                  <p><span className="text-on-surface-variant font-medium">Email:</span> <span className="text-primary font-semibold">{sellerEmail}</span></p>
                  {sellerPhone && <p><span className="text-on-surface-variant font-medium">Phone:</span> <span className="text-primary font-semibold">{sellerPhone}</span></p>}
                </div>
              </div>

              {/* Property Info Card */}
              <div className="bg-surface-offwhite rounded-xl p-5 border border-border-subtle">
                <h4 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Property</h4>
                <div className="space-y-2 text-[14px]">
                  <p><span className="text-on-surface-variant font-medium">Title:</span> <span className="text-primary font-semibold">{title}</span></p>
                  <p><span className="text-on-surface-variant font-medium">Price:</span> <span className="text-primary font-semibold">Rs. {price} Lakhs</span></p>
                  <p><span className="text-on-surface-variant font-medium">Config:</span> <span className="text-primary font-semibold">{bedrooms} BHK · {area || '—'} sqft</span></p>
                  {city && <p><span className="text-on-surface-variant font-medium">Location:</span> <span className="text-primary font-semibold">{address ? `${address}, ` : ''}{city}</span></p>}
                </div>
              </div>
            </div>

            {/* Preview Image */}
            {(imagePreview || imageUrl) && (
              <div className="rounded-xl overflow-hidden border border-border-subtle">
                <img
                  src={imagePreview || imageUrl}
                  alt="Property preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {description && (
              <div className="bg-surface-offwhite rounded-xl p-5 border border-border-subtle">
                <h4 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description</h4>
                <p className="text-[14px] text-primary">{description}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-subtle">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-2 px-5 py-2.5 text-on-surface-variant hover:text-primary text-[14px] font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent-blue text-white rounded-xl text-[14px] font-semibold hover:opacity-90 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-accent-blue/20"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-blue to-indigo-600 text-white rounded-xl text-[14px] font-semibold hover:opacity-90 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-accent-blue/25"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {uploading ? 'Uploading image...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Submit for Review
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
