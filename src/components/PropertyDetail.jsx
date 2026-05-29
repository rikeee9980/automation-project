import React from 'react';
import { 
  ArrowLeft, MapPin, BedDouble, Bath, Ruler, CheckCircle, 
  Calendar, Route, ArrowUpRight, Layers
} from 'lucide-react';
import ImageGallery from './ImageGallery';
import ShareButton from './ShareButton';
import { formatAreaLocal } from '../lib/unitConvert';

export default function PropertyDetail({ property, onBackClick, onInquireClick }) {
  if (!property) return null;

  const areaLocalStr = formatAreaLocal(property.areaLocal);

  return (
    <div className="w-full bg-background min-h-screen pb-section-gap text-left animate-[fadeInUp_0.4s_var(--apple-ease)]">
      {/* Back navigation & header */}
      <div className="max-w-[1200px] mx-auto px-gutter py-4 flex justify-between items-center">
        <button 
          onClick={onBackClick}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-semibold text-[14px] cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Listings</span>
        </button>
        <ShareButton property={property} />
      </div>

      {/* Image Gallery */}
      <section className="max-w-[1200px] mx-auto px-gutter">
        <ImageGallery 
          images={property.images || [property.image]} 
          title={property.title} 
        />
      </section>

      {/* Specs Bar */}
      <section className="max-w-[1200px] mx-auto px-gutter py-6 mt-4">
        {property.type === 'land' ? (
          <div className="flex justify-around items-center text-on-surface-variant border-b border-border-subtle pb-6 font-medium">
            <div className="flex flex-col items-center flex-1">
              <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.details?.area?.toLocaleString('en-NP')}</span>
              <span className="text-[12px] uppercase tracking-wider font-semibold">Sqft Area</span>
            </div>
            {areaLocalStr && (
              <>
                <div className="w-[1px] h-8 bg-border-subtle"></div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-[20px] md:text-[28px] font-bold text-emerald-600">{areaLocalStr}</span>
                  <span className="text-[12px] uppercase tracking-wider font-semibold">Local Unit</span>
                </div>
              </>
            )}
            <div className="w-[1px] h-8 bg-border-subtle"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.purpose === 'rent' ? 'Rent' : 'Sale'}</span>
              <span className="text-[12px] uppercase tracking-wider font-semibold">Purpose</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center text-on-surface-variant border-b border-border-subtle pb-6 font-medium">
            <div className="flex flex-col items-center flex-1">
              <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.details?.bedrooms}</span>
              <span className="text-[12px] uppercase tracking-wider font-semibold">BHK</span>
            </div>
            <div className="w-[1px] h-8 bg-border-subtle"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.details?.bathrooms || 0}</span>
              <span className="text-[12px] uppercase tracking-wider font-semibold">Bath</span>
            </div>
            <div className="w-[1px] h-8 bg-border-subtle"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.details?.area?.toLocaleString('en-NP')}</span>
              <span className="text-[12px] uppercase tracking-wider font-semibold">sqft</span>
            </div>
            <div className="w-[1px] h-8 bg-border-subtle"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[24px] md:text-[32px] font-bold text-primary">{property.details?.floors || 0}</span>
              <span className="text-[12px] uppercase tracking-wider font-semibold">Floors</span>
            </div>
          </div>
        )}
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
              <span>{property.location?.address}, {property.location?.city}</span>
            </p>
            <p className="text-[28px] font-bold text-accent-blue">
              {property.purpose === 'rent'
                ? `Rs. ${property.price.toLocaleString('en-NP')}/mo`
                : `Rs. ${(property.price / 100000).toFixed(0)} Lakhs`
              }
            </p>
          </div>

          <hr className="border-border-subtle" />

          {/* Property Details Grid */}
          <div>
            <h2 className="text-[24px] font-semibold text-primary mb-4">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.roadAccess && (
                <div className="bg-surface-offwhite rounded-xl p-4 border border-border-subtle">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Route size={16} />
                    <span className="text-[12px] font-bold uppercase tracking-wider">Road Access</span>
                  </div>
                  <span className="text-[18px] font-bold text-primary">{property.roadAccess}</span>
                </div>
              )}
              {property.facing && (
                <div className="bg-surface-offwhite rounded-xl p-4 border border-border-subtle">
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <ArrowUpRight size={16} />
                    <span className="text-[12px] font-bold uppercase tracking-wider">Facing</span>
                  </div>
                  <span className="text-[18px] font-bold text-primary">{property.facing}</span>
                </div>
              )}
              {property.builtYear && (
                <div className="bg-surface-offwhite rounded-xl p-4 border border-border-subtle">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Calendar size={16} />
                    <span className="text-[12px] font-bold uppercase tracking-wider">Built Year</span>
                  </div>
                  <span className="text-[18px] font-bold text-primary">{property.builtYear}</span>
                </div>
              )}
              {property.details?.parking > 0 && (
                <div className="bg-surface-offwhite rounded-xl p-4 border border-border-subtle">
                  <div className="flex items-center gap-2 text-teal-600 mb-1">
                    <Layers size={16} />
                    <span className="text-[12px] font-bold uppercase tracking-wider">Parking</span>
                  </div>
                  <span className="text-[18px] font-bold text-primary">{property.details.parking} Vehicles</span>
                </div>
              )}
              {areaLocalStr && (
                <div className="bg-surface-offwhite rounded-xl p-4 border border-border-subtle col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Ruler size={16} />
                    <span className="text-[12px] font-bold uppercase tracking-wider">Area (Local)</span>
                  </div>
                  <span className="text-[18px] font-bold text-primary">{areaLocalStr}</span>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div>
            <h2 className="text-[24px] font-semibold text-primary mb-3">About This Property</h2>
            <p className="text-[17px] leading-relaxed text-on-surface-variant font-medium">
              {property.tagline} This property is located in {property.location?.city}, {property.location?.state || 'Bagmati'} 
              {property.roadAccess ? ` with ${property.roadAccess} road access` : ''}
              {property.facing ? `, facing ${property.facing}` : ''}.
              {property.details?.area ? ` Total area of ${property.details.area.toLocaleString('en-NP')} sqft` : ''}
              {areaLocalStr ? ` (${areaLocalStr})` : ''}.
              {property.details?.parking > 0 ? ` Includes parking for ${property.details.parking} vehicle${property.details.parking > 1 ? 's' : ''}.` : ''}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-[24px] font-semibold text-primary mb-4">Amenities & Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(property.amenities || []).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-success flex-shrink-0" />
                  <span className="text-[17px] text-primary font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Agent & Contact */}
        <aside className="flex flex-col gap-6">
          {/* Agent Card */}
          <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center text-white font-bold text-[20px]">
                {property.agentId === 'agent-1' ? 'RS' : 'SA'}
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-primary">
                  {property.agentId === 'agent-1' ? 'Ramesh Sharma' : 'Sita Adhikari'}
                </h3>
                <p className="text-[12px] font-semibold text-on-surface-variant">
                  {property.agentId === 'agent-1' ? 'Senior Property Consultant' : 'Property Specialist'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onInquireClick && onInquireClick(property)}
                className="w-full bg-accent-blue text-white py-3 rounded-full text-[14px] font-semibold hover:opacity-90 transition-all cursor-pointer active:scale-95 text-center"
              >
                Contact Agent
              </button>
              <a
                href={`https://wa.me/9779800000000?text=${encodeURIComponent(`Hello, I'm viewing "${property.title}" in ${property.location?.city || ''} and would like more details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-success text-success bg-white py-3 rounded-full text-[14px] font-semibold hover:bg-green-50 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-success">
                  <path d="M12.012 2c-5.506 0-9.97 4.463-9.97 9.969 0 1.761.458 3.477 1.332 5.006L2 22l5.161-1.353a9.923 9.923 0 0 0 4.851 1.258c5.507 0 9.97-4.463 9.97-9.969C21.982 6.463 17.518 2 12.012 2zm6.18 13.916c-.253.712-1.464 1.306-2.023 1.391-.505.076-1.162.138-3.411-.79-2.879-1.189-4.707-4.108-4.851-4.3-.143-.192-1.162-1.543-1.162-2.943 0-1.4 0-2.316.712-3.028.143-.143.38-.216.57-.216.143 0 .285.008.38.016.275.016.411.03.59.39.224.475.761 1.854.827 1.996.068.143.111.312.017.5-.095.191-.143.312-.285.474-.143.167-.3.376-.429.5-.15.143-.312.3-.135.61.176.312.784 1.293 1.685 2.093.125.111.23.216.347.312.768.636 1.488.857 2.026.969.539.111.855-.008 1.155-.312.3-.306 1.293-1.482 1.636-1.99.343-.508.685-.411 1.155-.24.476.175 3.013 1.417 3.14 1.482.126.068.21.103.253.18.043.076.043.435-.21.144z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Property Info Card */}
          <div className="bg-white p-5 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h4 className="text-[14px] font-bold text-primary mb-4">Quick Info</h4>
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Property Type</span>
                <span className="text-primary font-bold capitalize">{property.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Purpose</span>
                <span className="text-primary font-bold capitalize">{property.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">District</span>
                <span className="text-primary font-bold">{property.location?.district || property.location?.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Listed On</span>
                <span className="text-primary font-bold">{property.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Status</span>
                <span className="text-emerald-600 font-bold capitalize">{property.status}</span>
              </div>
            </div>
          </div>

          {/* OpenStreetMap Interactive Map */}
          <div className="w-full aspect-square rounded-card bg-surface-offwhite overflow-hidden relative border border-border-subtle shadow-sm">
            <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-border-subtle shadow-sm flex items-center gap-1.5 pointer-events-none">
              <MapPin size={14} className="text-accent-blue" />
              <span className="text-[12px] font-bold text-primary">{property.location?.city || 'Kathmandu'}</span>
            </div>
            <iframe
              className="w-full h-full border-0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${(property.location?.lng || 85.3240) - 0.003}%2C${(property.location?.lat || 27.7172) - 0.003}%2C${(property.location?.lng || 85.3240) + 0.003}%2C${(property.location?.lat || 27.7172) + 0.003}&layer=mapnik&marker=${property.location?.lat || 27.7172}%2C${property.location?.lng || 85.3240}`}
              title={`${property.title} Location Map`}
              loading="lazy"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
