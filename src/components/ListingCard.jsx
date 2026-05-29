import React from 'react';
import { MapPin, Ruler, BedDouble, Bath, Heart, ArrowUpRight, Route } from 'lucide-react';
import { formatAreaLocal } from '../lib/unitConvert';

export default function ListingCard({ 
  property, 
  onPropertyClick, 
  onInquireClick,
  isComparing = false,
  onCompareToggle
}) {
  const areaLocalStr = formatAreaLocal(property.areaLocal);

  return (
    <div className="group bg-white rounded-card overflow-hidden border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-[0.4s] ease-out flex flex-col h-full relative">
      
      {/* Property Image Header */}
      <div 
        onClick={() => onPropertyClick && onPropertyClick(property)}
        className="relative h-48 overflow-hidden bg-surface-offwhite cursor-pointer"
      >
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        


        {/* Purpose badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-sm tracking-tight ${
            property.purpose === 'rent'
              ? 'bg-amber-500 text-white'
              : 'bg-emerald-500 text-white'
          }`}>
            {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        {/* Image count badge */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
            📷 {property.images.length}
          </div>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur border border-black/5 px-3 py-1.5 rounded-[8px] font-semibold text-[15px] text-primary shadow-sm z-10">
          {property.purpose === 'rent'
            ? `Rs. ${property.price.toLocaleString('en-NP')}/mo`
            : `Rs. ${(property.price / 100000).toFixed(0)} Lakhs`
          }
        </div>
      </div>

      {/* Property Content */}
      <div className="p-5 flex flex-col flex-1 text-left">
        
        {/* Compare Checkbox and Type Row */}
        <div className="flex justify-between items-center mb-2.5">
          <label 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center gap-1.5 text-[12px] font-bold text-on-surface-variant cursor-pointer select-none"
          >
            <input 
              type="checkbox" 
              checked={isComparing} 
              onChange={() => onCompareToggle && onCompareToggle(property)}
              className="w-3.5 h-3.5 border-border-strong rounded accent-accent-blue cursor-pointer"
            />
            <span>Compare</span>
          </label>
          <span className="capitalize text-[11px] font-bold bg-surface-offwhite border border-border-subtle px-2 py-0.5 rounded-full text-on-surface-variant">
            {property.type}
          </span>
        </div>

        {/* Location Info */}
        <div className="flex items-center gap-1 text-on-surface-variant text-[13px] font-medium mb-2">
          <MapPin size={13} className="text-accent-blue flex-shrink-0" />
          <span className="truncate">{property.location?.address}, {property.location?.city}</span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onPropertyClick && onPropertyClick(property)}
          className="font-semibold text-[18px] text-primary group-hover:text-accent-blue transition-colors duration-300 mb-2 cursor-pointer"
        >
          {property.title}
        </h3>

        {/* Tagline */}
        <p className="text-on-surface-variant text-[14px] leading-relaxed mb-4 flex-1 line-clamp-2">
          {property.tagline}
        </p>

        {/* Specs row */}
        {property.type === 'land' ? (
          <div className="flex justify-between py-2.5 border-y border-border-subtle mb-4 text-[13px] text-on-surface-variant font-medium">
            <span className="flex items-center gap-1 font-bold text-primary">
              <Ruler size={14} className="text-accent-blue" /> {property.details?.area?.toLocaleString('en-NP')} sqft
            </span>
            {areaLocalStr && (
              <span className="text-[12px] text-emerald-600 font-bold">{areaLocalStr}</span>
            )}
          </div>
        ) : (
          <div className="flex justify-between py-2.5 border-y border-border-subtle mb-4 text-[13px] text-on-surface-variant font-medium">
            <span className="flex items-center gap-1">
              <BedDouble size={14} /> {property.details?.bedrooms} BHK
            </span>
            <span className="flex items-center gap-1">
              <Bath size={14} /> {property.details?.bathrooms} Bath
            </span>
            <span className="flex items-center gap-1">
              <Ruler size={14} /> {property.details?.area?.toLocaleString('en-NP')} sqft
            </span>
          </div>
        )}

        {/* Practical property info badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {property.roadAccess && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
              <Route size={11} /> {property.roadAccess} Road
            </span>
          )}
          {property.facing && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">
              <ArrowUpRight size={11} /> {property.facing}
            </span>
          )}
          {property.builtYear && (
            <span className="text-[11px] font-bold bg-surface-offwhite text-on-surface-variant px-2.5 py-1 rounded-full border border-border-subtle">
              Built {property.builtYear}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto items-center">
          <button 
            onClick={() => onPropertyClick && onPropertyClick(property)}
            className="flex-[1.2] bg-surface-offwhite hover:bg-border-subtle text-primary border border-border-subtle py-2 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer active:scale-95 text-center"
          >
            View Details
          </button>
          <button 
            onClick={() => onInquireClick && onInquireClick(property)}
            className="flex-[1.2] bg-accent-blue hover:opacity-90 text-white py-2 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer active:scale-95 text-center"
          >
            Inquire
          </button>
          
          {/* WhatsApp Direct Action Button */}
          <a
            href={`https://wa.me/9779800000000?text=${encodeURIComponent(`Hello, I am interested in: "${property.title}" in ${property.location?.city || ''}. Please share details and availability.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-full bg-success text-white flex items-center justify-center hover:opacity-90 transition-all duration-300 active:scale-95 cursor-pointer flex-shrink-0"
            title="WhatsApp Agent"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12.012 2c-5.506 0-9.97 4.463-9.97 9.969 0 1.761.458 3.477 1.332 5.006L2 22l5.161-1.353a9.923 9.923 0 0 0 4.851 1.258c5.507 0 9.97-4.463 9.97-9.969C21.982 6.463 17.518 2 12.012 2zm6.18 13.916c-.253.712-1.464 1.306-2.023 1.391-.505.076-1.162.138-3.411-.79-2.879-1.189-4.707-4.108-4.851-4.3-.143-.192-1.162-1.543-1.162-2.943 0-1.4 0-2.316.712-3.028.143-.143.38-.216.57-.216.143 0 .285.008.38.016.275.016.411.03.59.39.224.475.761 1.854.827 1.996.068.143.111.312.017.5-.095.191-.143.312-.285.474-.143.167-.3.376-.429.5-.15.143-.312.3-.135.61.176.312.784 1.293 1.685 2.093.125.111.23.216.347.312.768.636 1.488.857 2.026.969.539.111.855-.008 1.155-.312.3-.306 1.293-1.482 1.636-1.99.343-.508.685-.411 1.155-.24.476.175 3.013 1.417 3.14 1.482.126.068.21.103.253.18.043.076.043.435-.21.144z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
