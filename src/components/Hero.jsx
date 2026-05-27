import React, { useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';

export default function Hero({ onSearchSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedCriteria, setParsedCriteria] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsProcessing(true);
    setParsedCriteria(null);

    setTimeout(() => {
      setIsProcessing(false);
      
      const queryLower = searchQuery.toLowerCase();
      let bedrooms = null;
      let maxPrice = null;
      let features = [];

      if (queryLower.includes('3bhk') || queryLower.includes('3 bedroom') || queryLower.includes('3 bhk')) bedrooms = 3;
      if (queryLower.includes('4bhk') || queryLower.includes('4 bedroom') || queryLower.includes('4 bhk')) bedrooms = 4;
      
      if (queryLower.includes('under 50 lakhs') || queryLower.includes('50l') || queryLower.includes('5m') || queryLower.includes('50 lakhs')) maxPrice = 5000000;
      if (queryLower.includes('under 85 lakhs') || queryLower.includes('85l') || queryLower.includes('8.5m') || queryLower.includes('85 lakhs')) maxPrice = 8500000;

      if (queryLower.includes('pool') || queryLower.includes('swimming')) features.push('Gravity Pool');
      if (queryLower.includes('theater') || queryLower.includes('cinema') || queryLower.includes('holographic')) features.push('Holographic Home Theater');

      const parsed = {
        query: searchQuery,
        bedrooms,
        maxPrice,
        features
      };

      setParsedCriteria(parsed);
      onSearchSubmit(parsed);
    }, 1200);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    // Submit query immediately
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      let bedrooms = null;
      let maxPrice = null;
      let features = [];
      const queryLower = suggestion.toLowerCase();
      
      if (queryLower.includes('3bhk')) bedrooms = 3;
      if (queryLower.includes('4bhk')) bedrooms = 4;
      if (queryLower.includes('50 lakhs')) maxPrice = 5000000;
      if (queryLower.includes('85 lakhs')) maxPrice = 8500000;
      if (queryLower.includes('pool')) features.push('Gravity Pool');
      if (queryLower.includes('theater')) features.push('Holographic Home Theater');

      const parsed = { query: suggestion, bedrooms, maxPrice, features };
      setParsedCriteria(parsed);
      onSearchSubmit(parsed);
    }, 600);
  };

  return (
    <div className="w-full">
      {/* Immersive Hero Section Banner */}
      <section className="max-w-[1200px] mx-auto px-gutter pt-8">
        <div className="relative w-full h-[55vh] rounded-container overflow-hidden shadow-sm">
          <img 
            alt="The Helix Penthouse" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida/ADBb0uib9sYGLaNqMrliIZbabrWpJzJ8BO9x5QO8GKTmD1knTXj9dAERfvAAAQwfhDPhzcqf5DSmM_fMbbVULY-XBWHqB_ScPZzef1pFZkBfElyyDTx2pNp8HM0HgYftnkFWbAg_UY2zb6mhL2Jvqed_tu4sBH37eoGs6ehKziaUqFqU7OdrhO28rkD5COuUCWUZ1FTGkCIIAPuTi7GVJwrtaKsKdp23p2B6ITwD4ST3u2eQ7u9dJeEXnVc4gHWI"
          />
          {/* Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-10 left-10 text-white space-y-4 reveal-on-scroll revealed">
            <h1 className="text-[32px] md:text-[40px] font-bold leading-tight tracking-tight">The Helix Penthouse</h1>
            <p className="text-[24px] font-semibold">₹85 Lakhs</p>
            <button className="bg-white text-primary px-8 py-3 rounded-full text-[14px] font-medium flex items-center gap-2 hover:bg-surface-offwhite transition-all duration-300 active:scale-95 cursor-pointer">
              <span>View Property</span> 
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Clean Search Input Section */}
      <section className="max-w-[1200px] mx-auto px-gutter mt-12 flex flex-col items-center">
        <div className="relative w-full max-w-2xl group">
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant">
              <Search size={20} />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-32 bg-surface-offwhite border border-border-strong rounded-full text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all duration-300" 
              placeholder="Search by location, type, or budget..." 
              disabled={isProcessing}
            />
            <button 
              type="submit"
              disabled={isProcessing}
              className="absolute right-2 top-2 bottom-2 bg-accent-blue text-white px-6 rounded-full text-[14px] font-semibold hover:opacity-90 transition-opacity duration-300 cursor-pointer flex items-center justify-center min-w-[90px]"
            >
              {isProcessing ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </form>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button 
            onClick={() => handleSuggestionClick("3BHK in Mumbai")}
            className="bg-surface-offwhite border border-border-subtle hover:bg-border-strong px-4 py-1.5 rounded-full text-[14px] font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            3BHK in Mumbai
          </button>
          <button 
            onClick={() => handleSuggestionClick("Villas under 50 Lakhs")}
            className="bg-surface-offwhite border border-border-subtle hover:bg-border-strong px-4 py-1.5 rounded-full text-[14px] font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Villas under 50L
          </button>
          <button 
            onClick={() => handleSuggestionClick("Eco Homes with solar technology")}
            className="bg-surface-offwhite border border-border-subtle hover:bg-border-strong px-4 py-1.5 rounded-full text-[14px] font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Eco Homes
          </button>
        </div>

        {/* AI Parser Feedback */}
        {isProcessing && (
          <div className="mt-6 flex items-center justify-center gap-2 text-[14px] text-on-surface-variant animate-pulse">
            <Sparkles size={14} className="text-accent-blue" />
            <span>Parsing neural parameters...</span>
          </div>
        )}

        {/* Applied Criteria Matrix */}
        {parsedCriteria && (
          <div className="w-full max-w-2xl mt-6 p-5 bg-surface-offwhite border border-border-subtle rounded-container text-left transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-[14px] font-semibold text-primary">
              <SlidersHorizontal size={14} className="text-accent-blue" />
              <span>Applied Criteria Matrices</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-[14px] text-on-surface-variant">
              <div>Layout: <strong className="text-primary">{parsedCriteria.bedrooms ? `${parsedCriteria.bedrooms} BHK` : 'Any'}</strong></div>
              <div>Budget: <strong className="text-primary">{parsedCriteria.maxPrice ? `₹${(parsedCriteria.maxPrice / 100000).toFixed(0)} Lakhs` : 'Any'}</strong></div>
              <div>Amenities: <strong className="text-primary">{parsedCriteria.features.length ? parsedCriteria.features.join(', ') : 'Any'}</strong></div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
