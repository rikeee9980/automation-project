import React, { useState } from 'react';
import { Search, ArrowRight, MapPin } from 'lucide-react';

const LOCATIONS = [
  { id: 'all', label: 'All Locations' },
  { id: 'kathmandu', label: 'Kathmandu' },
  { id: 'lalitpur', label: 'Lalitpur' },
  { id: 'bhaktapur', label: 'Bhaktapur' },
  { id: 'pokhara', label: 'Pokhara' },
  { id: 'chitwan', label: 'Chitwan' },
];

const PROPERTY_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'house', label: 'House' },
  { id: 'flat', label: 'Apartment' },
  { id: 'land', label: 'Land' },
  { id: 'commercial', label: 'Commercial' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'Any Budget', min: 0, max: Infinity },
  { id: 'under-30l', label: 'Under 30 Lakhs', min: 0, max: 3000000 },
  { id: '30-60l', label: '30-60 Lakhs', min: 3000000, max: 6000000 },
  { id: '60-100l', label: '60 Lakhs - 1 Cr', min: 6000000, max: 10000000 },
  { id: 'above-1cr', label: 'Above 1 Crore', min: 10000000, max: Infinity },
];

export default function Hero({ onSearchSubmit }) {
  const [location, setLocation] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedPrice = PRICE_RANGES.find(p => p.id === priceRange) || PRICE_RANGES[0];
    
    const criteria = {
      query: searchQuery,
      location: location !== 'all' ? location : null,
      propertyType: propertyType !== 'all' ? propertyType : null,
      maxPrice: selectedPrice.max !== Infinity ? selectedPrice.max : null,
      minPrice: selectedPrice.min > 0 ? selectedPrice.min : null,
    };

    onSearchSubmit(criteria);
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    // Parse quick search
    const lower = query.toLowerCase();
    let loc = null;
    let type = null;
    let maxP = null;

    if (lower.includes('kathmandu')) loc = 'kathmandu';
    if (lower.includes('lalitpur')) loc = 'lalitpur';
    if (lower.includes('pokhara')) loc = 'pokhara';
    if (lower.includes('land')) type = 'land';
    if (lower.includes('flat') || lower.includes('apartment')) type = 'flat';
    if (lower.includes('house')) type = 'house';
    if (lower.includes('80l') || lower.includes('80 lakhs')) maxP = 8000000;
    if (lower.includes('50l') || lower.includes('50 lakhs')) maxP = 5000000;

    onSearchSubmit({
      query,
      location: loc,
      propertyType: type,
      maxPrice: maxP,
      minPrice: null,
    });
  };

  return (
    <div className="w-full">
      {/* Immersive Hero Section Banner */}
      <section className="max-w-[1200px] mx-auto px-gutter pt-8">
        <div className="relative w-full h-[55vh] rounded-container overflow-hidden shadow-sm">
          <img 
            alt="Luxury Property in Nepal" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
            loading="lazy"
          />
          {/* Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-10 left-10 text-white space-y-4">
            <h1 className="text-[32px] md:text-[40px] font-bold leading-tight tracking-tight">
              Find Your Dream Property in Nepal
            </h1>
            <p className="text-[18px] font-medium opacity-90 max-w-lg">
              Buy, Sell & Rent — Houses, Land, Apartments across Kathmandu Valley and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Search Filter Section */}
      <section className="max-w-[1200px] mx-auto px-gutter mt-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border-subtle shadow-sm p-5">
          
          {/* Text Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant">
              <Search size={18} />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-surface-offwhite border border-border-subtle rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all" 
              placeholder="Search by name, location, or keyword..." 
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Location */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-surface-offwhite border border-border-subtle rounded-xl py-2.5 px-3 text-[14px] font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all cursor-pointer appearance-none"
              >
                {LOCATIONS.map(l => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-surface-offwhite border border-border-subtle rounded-xl py-2.5 px-3 text-[14px] font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all cursor-pointer appearance-none"
              >
                {PROPERTY_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-surface-offwhite border border-border-subtle rounded-xl py-2.5 px-3 text-[14px] font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all cursor-pointer appearance-none"
              >
                {PRICE_RANGES.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full bg-accent-blue text-white py-2.5 rounded-xl text-[14px] font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Search size={16} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {[
            'Land in Lalitpur',
            '3BHK under 80 Lakhs',
            'Flat in Baluwatar',
            'House in Pokhara',
          ].map((suggestion) => (
            <button 
              key={suggestion}
              onClick={() => handleQuickSearch(suggestion)}
              className="bg-surface-offwhite border border-border-subtle hover:bg-border-subtle px-4 py-1.5 rounded-full text-[13px] font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <MapPin size={12} />
              {suggestion}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
