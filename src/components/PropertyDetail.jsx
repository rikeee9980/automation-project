import React from 'react';
import { 
  ArrowLeft, MapPin, BedDouble, Bath, Ruler, CheckCircle, 
  TrendingUp, Calendar, Phone, Globe, Image as ImageIcon
} from 'lucide-react';

export default function PropertyDetail({ property, onBackClick, onStagingClick, onInquireClick }) {
  if (!property) return null;

  // Render SVG Price Trend chart path dynamically or use default
  const chartPath = "M0 35 L20 32 L40 25 L60 28 L80 15 L100 10";

  return (
    <div className="w-full bg-background min-h-screen pb-section-v text-left">
      {/* Back navigation & header */}
      <div className="max-w-[1200px] mx-auto px-gutter py-4">
        <button 
          onClick={onBackClick}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-semibold text-[14px] cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Listings</span>
        </button>
      </div>

      {/* Hero Image Section */}
      <section className="max-w-[1200px] mx-auto px-gutter">
        <div className="relative w-full h-[512px] overflow-hidden rounded-container bg-surface-offwhite shadow-sm">
          <img 
            alt={property.title} 
            className="w-full h-full object-cover" 
            src={property.image}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
            <button className="bg-white/90 backdrop-blur px-5 py-2 rounded-full font-semibold text-[14px] text-primary flex items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-white transition-all cursor-pointer">
              <ImageIcon size={16} />
              <span>View 24 Photos</span>
            </button>
          </div>
        </div>
      </section>

      {/* Specs Bar */}
      <section className="max-w-[1200px] mx-auto px-gutter py-6 mt-4">
        <div className="flex justify-between items-center text-on-surface-variant border-b border-border-subtle pb-6 font-medium">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.details.bedrooms}</span>
            <span className="text-[12px] uppercase tracking-wider font-semibold">BHK</span>
          </div>
          <div className="w-[1px] h-8 bg-border-subtle"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.details.bathrooms || 3}</span>
            <span className="text-[12px] uppercase tracking-wider font-semibold">Bath</span>
          </div>
          <div className="w-[1px] h-8 bg-border-subtle"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.details.area.toLocaleString()}</span>
            <span className="text-[12px] uppercase tracking-wider font-semibold">sqft</span>
          </div>
          <div className="w-[1px] h-8 bg-border-subtle"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.details.floors || 2}</span>
            <span className="text-[12px] uppercase tracking-wider font-semibold">Floors</span>
          </div>
        </div>
      </section>

      {/* Content Section (60/40 Split) */}
      <main className="max-w-[1200px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 md:gap-[60px] mt-6">
        
        {/* Left Column: Details */}
        <section className="flex flex-col gap-8">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-primary tracking-tight mb-2">
              {property.title}
            </h1>
            <p className="text-[19px] text-on-surface-variant flex items-center gap-1 mb-4 font-medium">
              <MapPin size={16} className="text-accent-blue" />
              <span>{property.location.address}, {property.location.city}</span>
            </p>
            <p className="text-[28px] font-bold text-accent-blue">
              ₹{(property.price / 100000).toFixed(0)} Lakhs
            </p>
          </div>

          <hr className="border-border-subtle" />

          {/* About */}
          <div>
            <h2 className="text-[24px] font-semibold text-primary mb-3">About This Property</h2>
            <p className="text-[17px] leading-relaxed text-on-surface-variant font-medium">
              A masterpiece of modern minimalism, {property.title} offers unparalleled views and clean spatial design. 
              Designed by award-winning architects, this residence seamlessly blends indoor and outdoor living with retractable 
              glass facades and curated natural materials. Every detail, from the hand-honed basalt floors to the custom oak cabinetry, 
              has been executed with clinical precision for the discerning buyer.
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-[24px] font-semibold text-primary mb-4">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-success" />
                  <span className="text-[17px] text-primary font-medium">{amenity}</span>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-success" />
                <span className="text-[17px] text-primary font-medium">Infinity Pool</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-success" />
                <span className="text-[17px] text-primary font-medium">Smart Security Grid</span>
              </div>
            </div>
          </div>

          <hr className="border-border-subtle" />

          {/* Price Trend */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[24px] font-semibold text-primary">Price Trend</h2>
              <span className="text-[14px] font-semibold text-success flex items-center">
                <TrendingUp size={16} className="mr-1" />
                Steady Growth Forecast
              </span>
            </div>
            <div className="w-full h-48 bg-surface-offwhite border border-border-subtle rounded-card p-6 relative overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path 
                  className="stroke-accent-blue fill-none" 
                  d={chartPath} 
                  strokeWidth="2" 
                  vectorEffect="non-scaling-stroke"
                />
                <path 
                  d={`${chartPath} V40 H0 Z`} 
                  fill="url(#detailGrad)" 
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="detailGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#0071e3" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex justify-between mt-2 text-[12px] font-medium text-on-surface-variant">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Agent & Map */}
        <aside className="flex flex-col gap-6">
          {/* Agent Card */}
          <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-4 mb-6">
              <img 
                className="w-16 h-16 rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs-gryQ2QT1Ll1wjyZuieaEKR6svgE2HSjAf7hOsH3zNL-daLOSmFzVkzx2BhuUTfxIZuBc-iR9toS0_ze-R0Ert3oab9XDp36-x8K9Gypsn0eom09P379RHWSMOsT5sq_7J0Vvsx9a3wk516tKoTc4Rw6uRQuSteNsbIMLIBsXr7BACBastX08myMn5nRFFlW2c1QVgRNkIWN81Rzt8QlVIF6R6k52GafsZOl4CgjG2S08appqRX4F2uWOuHulpJTDFpxnj0pOVv0"
                alt="Julian Thorne"
              />
              <div>
                <h3 className="text-[18px] font-bold text-primary">Julian Thorne</h3>
                <p className="text-[12px] font-semibold text-on-surface-variant">Senior Portfolio Partner</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onInquireClick && onInquireClick(property)}
                className="w-full bg-accent-blue text-white py-3 rounded-full text-[14px] font-semibold hover:opacity-90 transition-all cursor-pointer active:scale-95"
              >
                Contact Agent
              </button>
              <button 
                onClick={() => onStagingClick(property)}
                className="w-full border border-accent-blue text-accent-blue py-3 rounded-full text-[14px] font-semibold hover:bg-surface-offwhite transition-all cursor-pointer active:scale-95"
              >
                Virtual Stage Lab
              </button>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="w-full aspect-square rounded-card bg-surface-offwhite overflow-hidden relative border border-border-subtle">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant z-10 bg-black/5 pointer-events-none">
              <MapPin size={28} className="mb-2 text-accent-blue" />
              <span className="text-[13px] font-semibold">Interactive Map</span>
            </div>
            <img 
              className="w-full h-full object-cover opacity-60 grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFVLxRqZ5aEyqH_RBpJWPuJGA8by0mVH52saVTM7Rx_VBBUIdE5pFk0bFTrG3VHAFkq-F82bsTOnUx0dmowWmTYGO0ippqWjg7MJh5ZpjYK1zbzJ0w4ApHa2oVCr16Tt8M8QBcY1DZC2PW4_fSOoZr9KHGb4_FcDsmFgDvmt2xc0IlxkZ7N8cWjdO465N8octMKltimklaTXjo3aezAVBweFEWJnJ_u4lpHjyfceFpwLnXlZ9eKRpnCbJoYWtGvSSkKm3a8E2U7c2T"
              alt="Map location"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
