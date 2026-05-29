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

export default function SellProperty() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Seller Info
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');

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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

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

      await createSubmission({
        sellerName,
        sellerEmail,
        sellerPhone,
        title,
        price: parseFloat(price) * 100000, // Convert lakhs to actual
        location: { address, city, state: 'MH', zip: '' },
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
    switch (currentStep) {
      case 1:
        return sellerName && sellerEmail;
      case 2:
        return title && price;
      case 3:
        return true; // Media is optional
      case 4:
        return true;
      default:
        return false;
    }
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
                Property goes live on Aetheria
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
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-accent-blue text-white shadow-md shadow-accent-blue/30'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-surface-offwhite text-on-surface-variant border border-border-subtle'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                </div>
                <span className={`text-[12px] font-semibold ${isActive ? 'text-accent-blue' : 'text-on-surface-variant'}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mb-6 mx-1 rounded-full transition-colors ${
                  currentStep > step.id ? 'bg-green-400' : 'bg-border-subtle'
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
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <Mail size={14} /> Email *
                </label>
                <input
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <Phone size={14} /> Phone
                </label>
                <input
                  type="tel"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                />
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
                <label className="text-[13px] font-semibold text-on-surface-variant">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kathmandu"
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                />
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
              <label className="text-[13px] font-semibold text-on-surface-variant">Property Photo</label>
              <label
                className="border-2 border-dashed border-border-strong bg-surface-offwhite hover:bg-border-subtle rounded-xl p-8 text-center cursor-pointer transition-all"
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
                    <span className="text-[12px] text-on-surface-variant">PNG, JPG up to 10MB</span>
                  </div>
                )}
              </label>
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
