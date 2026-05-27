import React from 'react';
import { MapPin, Ruler, BedDouble, Bath, TrendingUp } from 'lucide-react';

export default function ListingCard({ property, onStagingClick, onPropertyClick }) {
  // Calculate 1-year projected price change percentage
  const projectedPercent = (((property.aiPricePrediction.oneYear - property.price) / property.price) * 100).toFixed(1);

  return (
    <div className="group bg-white rounded-card overflow-hidden border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-[0.4s] ease-out flex flex-col h-full">
      {/* Property Image Header */}
      <div 
        onClick={() => onPropertyClick && onPropertyClick(property)}
        className="relative h-48 overflow-hidden bg-surface-offwhite cursor-pointer"
      >
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* AI score badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur text-primary text-[11px] font-bold px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-border-subtle tracking-tight">
            Match: {property.aiScore}%
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur border border-black/5 px-3 py-1.5 rounded-[8px] font-semibold text-[15px] text-primary shadow-sm">
          ₹{(property.price / 100000).toFixed(0)} Lakhs
        </div>
      </div>

      {/* Property Content */}
      <div className="p-5 flex flex-col flex-1 text-left">
        {/* Location Info */}
        <div className="flex items-center gap-1 text-on-surface-variant text-[13px] font-medium mb-2">
          <MapPin size={13} className="text-accent-blue" />
          <span className="truncate">{property.location.address}, {property.location.city}</span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onPropertyClick && onPropertyClick(property)}
          className="font-semibold text-[18px] text-primary group-hover:text-accent-blue transition-colors duration-300 mb-2 cursor-pointer"
        >
          {property.title}
        </h3>

        {/* Tagline */}
        <p className="text-on-surface-variant text-[14px] leading-relaxed mb-4 flex-1">
          {property.tagline}
        </p>

        {/* Specs row */}
        <div className="flex justify-between py-2.5 border-y border-border-subtle mb-4 text-[13px] text-on-surface-variant font-medium">
          <span className="flex items-center gap-1">
            <BedDouble size={14} /> {property.details.bedrooms} BHK
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} /> {property.details.bathrooms} Bath
          </span>
          <span className="flex items-center gap-1">
            <Ruler size={14} /> {property.details.area} sqft
          </span>
        </div>

        {/* AI price projection widget */}
        <div className="bg-surface-offwhite rounded-[10px] p-3 mb-4 border border-border-subtle">
          <div className="flex justify-between items-center text-[12px] font-bold text-primary mb-2">
            <span className="flex items-center gap-1">
              <TrendingUp size={13} className="text-accent-blue" /> Valuation Trend
            </span>
            <span className="text-accent-blue">+{projectedPercent}% (1 yr)</span>
          </div>
          <div className="flex justify-between text-[12px] text-on-surface-variant font-medium">
            <div>6m: <strong className="text-primary">₹{(property.aiPricePrediction.sixMonth / 100000).toFixed(0)}L</strong></div>
            <div>1y: <strong className="text-primary">₹{(property.aiPricePrediction.oneYear / 100000).toFixed(0)}L</strong></div>
            <div>3y: <strong className="text-primary">₹{(property.aiPricePrediction.threeYear / 100000).toFixed(0)}L</strong></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button 
            onClick={() => onStagingClick(property)}
            className="flex-1 bg-surface-offwhite hover:bg-border-subtle text-primary border border-border-subtle py-2 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer active:scale-95 text-center"
          >
            Virtual Stage
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('chatbot-input');
              if (el) {
                el.value = `Tell me more about ${property.title} in ${property.location.city}`;
                el.focus();
              }
            }}
            className="flex-1 bg-accent-blue hover:opacity-90 text-white py-2 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer active:scale-95 text-center"
          >
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
}
