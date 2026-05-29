import React from 'react';
import { MapPin, Calendar, HelpCircle, ArrowUpRight, MessageSquare, Plus, Check } from 'lucide-react';

// Price formatting helper for Nepal (Lakh/Crore)
export function formatNpPrice(price) {
  if (!price && price !== 0) return '';
  if (price >= 10000000) {
    return `Rs. ${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Crore`;
  }
  if (price >= 100000) {
    return `Rs. ${(price / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return `Rs. ${price.toLocaleString('en-NP')}`;
}

export default function DemandSection({ demands = [], onPostDemandClick }) {
  // Only display approved demands publicly
  const approvedDemands = demands.filter(d => d.reviewStatus === 'approved');

  const getTypeBadgeStyles = (type) => {
    switch (type) {
      case 'house':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'flat':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'land':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'commercial':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      default:
        return 'bg-surface-offwhite text-on-surface-variant border-border-subtle';
    }
  };

  const formatTypeLabel = (type) => {
    switch (type) {
      case 'house': return 'House';
      case 'flat': return 'Apartment / Flat';
      case 'land': return 'Land Plot';
      case 'commercial': return 'Commercial';
      default: return type;
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-gutter py-12 border-t border-border-subtle text-left">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-[11px] font-bold text-accent-blue uppercase tracking-wider block mb-1">
            Marketplace Needs
          </span>
          <h2 className="text-[28px] font-bold text-primary tracking-tight leading-none">
            Active Buyer Demands
          </h2>
          <p className="text-on-surface-variant text-[14px] mt-2 font-medium max-w-[600px]">
            Check out what active buyers are searching for in Nepal. If you own a matching property, connect with our agents to seal the deal instantly.
          </p>
        </div>
        
        <button
          onClick={onPostDemandClick}
          className="flex items-center gap-1.5 bg-primary hover:opacity-95 text-white px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all cursor-pointer active:scale-95 shadow-sm self-start md:self-auto flex-shrink-0"
        >
          <Plus size={16} />
          <span>Post Your Demand</span>
        </button>
      </div>

      {/* Demands Grid */}
      {approvedDemands.length === 0 ? (
        <div className="py-16 px-5 bg-white border border-dashed border-border-strong rounded-2xl text-center flex flex-col items-center justify-center">
          <HelpCircle size={32} className="text-on-surface-variant/40 mb-3" />
          <h3 className="text-primary text-[17px] font-bold mb-1">No active demands listed</h3>
          <p className="text-on-surface-variant text-[13px] max-w-[320px] mb-4">
            Be the first to list what you're looking for. Connect with brokers and sellers.
          </p>
          <button
            onClick={onPostDemandClick}
            className="text-accent-blue font-bold text-[13px] hover:underline cursor-pointer"
          >
            Post a demand now &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedDemands.map((demand) => {
            const dateStr = demand.createdAt 
              ? new Date(demand.createdAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric' })
              : 'Recent';

            const whatsappMessage = `Hello, I saw a buyer demand for a ${formatTypeLabel(demand.propertyType)} in ${demand.location} (Budget: ${formatNpPrice(demand.minPrice)} - ${formatNpPrice(demand.maxPrice)}). I have a property that might match this. Let's discuss details.`;
            const waLink = `https://wa.me/9779800000000?text=${encodeURIComponent(whatsappMessage)}`;

            return (
              <div 
                key={demand.id}
                className="bg-white rounded-2xl border border-border-subtle p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-border-strong transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Badge & Date Row */}
                  <div className="flex justify-between items-center mb-3.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getTypeBadgeStyles(demand.propertyType)}`}>
                      {formatTypeLabel(demand.propertyType)}
                    </span>
                    <span className="text-[11px] font-semibold text-on-surface-variant/60 flex items-center gap-1">
                      <Calendar size={11} />
                      {dateStr}
                    </span>
                  </div>

                  {/* Location Info */}
                  <div className="flex items-center gap-1 text-[13px] text-on-surface-variant font-semibold mb-2">
                    <MapPin size={13} className="text-accent-blue" />
                    <span>{demand.location}</span>
                  </div>

                  {/* Budget Details */}
                  <div className="text-[16px] font-bold text-primary mb-3">
                    Budget: <span className="text-accent-blue">{formatNpPrice(demand.minPrice)} - {formatNpPrice(demand.maxPrice)}</span>
                  </div>

                  {/* Conditional specs row (Bedrooms / Area) */}
                  {demand.details && (demand.details.bedrooms || demand.details.areaSqft) && (
                    <div className="flex gap-4 text-[12px] font-bold text-on-surface-variant mb-3 bg-surface-offwhite py-1.5 px-3 rounded-lg border border-border-subtle/50">
                      {demand.details.bedrooms && (
                        <span>🛏️ {demand.details.bedrooms} BHK</span>
                      )}
                      {demand.details.bathrooms && (
                        <span>🚿 {demand.details.bathrooms} Bath</span>
                      )}
                      {demand.details.areaSqft && (
                        <span>📏 {demand.details.areaSqft.toLocaleString()} sqft</span>
                      )}
                    </div>
                  )}

                  {/* Description message */}
                  <p className="text-[13px] text-on-surface-variant leading-relaxed line-clamp-3 mb-5 font-medium">
                    "{demand.description}"
                  </p>
                </div>

                {/* Match CTA button */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-surface-offwhite hover:bg-border-subtle text-primary border border-border-subtle hover:border-border-strong rounded-full text-[13px] font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 text-center mt-auto"
                >
                  <Plus size={14} className="text-accent-blue" />
                  <span>Match My Property</span>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
