import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ListingCard from './components/ListingCard';
import MapExplorer from './components/MapExplorer';
import AdminPanel from './components/AdminPanel';
import PropertyDetail from './components/PropertyDetail';
import SellProperty from './components/SellProperty';
import InquiryModal from './components/InquiryModal';
import Calculator from './components/Calculator';
import UnitConverter from './components/UnitConverter';
import CompareDrawer from './components/CompareDrawer';
import { fetchProperties } from './lib/propertyService';
import { mockProperties, mockAgents } from './data/mockProperties';
import { Phone, Mail, MapPin, ArrowRightLeft, Calculator as CalcIcon } from 'lucide-react';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [isAdmin, setIsAdmin] = useState(false);
  const [properties, setProperties] = useState(mockProperties);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryProperty, setInquiryProperty] = useState(null);

  // Tools sub-tab state
  const [activeToolTab, setActiveToolTab] = useState('emi');

  // Saved properties state
  const [savedPropertyIds, setSavedPropertyIds] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('saved_properties') || '[]');
      return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });
  const [compareList, setCompareList] = useState([]);
  const [filterPurpose, setFilterPurpose] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const handleInquireClick = (property) => {
    setInquiryProperty(property);
    setIsInquiryOpen(true);
  };

  const handleFavoriteToggle = (id) => {
    setSavedPropertyIds((prev) => {
      const updated = prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id];
      localStorage.setItem('saved_properties', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCompareToggle = (property) => {
    const exists = compareList.find(p => p.id === property.id);
    if (exists) {
      setCompareList(compareList.filter(p => p.id !== property.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare a maximum of 3 properties side-by-side.");
        return;
      }
      setCompareList([...compareList, property]);
    }
  };

  const handleRemoveCompare = (id) => {
    setCompareList(compareList.filter(p => p.id !== id));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  // Fetch properties from Supabase on mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await fetchProperties();
      setProperties(data);
      if (data.length > 0 && !selectedProperty) {
        setSelectedProperty(data[0]);
      }
      setDataLoaded(true);
    } catch (err) {
      console.warn('Using mock data:', err);
      setProperties(mockProperties);
      setSelectedProperty(mockProperties[0]);
      setDataLoaded(true);
    }
  };

  // Guard admin mode — if user logs out, kick them out of admin
  useEffect(() => {
    if (!isAuthenticated && isAdmin) {
      setIsAdmin(false);
      setCurrentTab('home');
    }
  }, [isAuthenticated, isAdmin]);

  // Handler for custom search
  const handleSearchSubmit = (criteria) => {
    setSearchCriteria(criteria);
  };

  // Filter listings based on purpose, type, search criteria
  const filteredProperties = properties.filter((prop) => {
    // Filter purpose
    if (filterPurpose !== 'all' && prop.purpose !== filterPurpose) {
      return false;
    }

    // Filter type
    if (filterType !== 'all' && prop.type !== filterType) {
      return false;
    }

    if (!searchCriteria) return true;

    // Filter by location
    if (searchCriteria.location) {
      const city = prop.location?.city?.toLowerCase() || '';
      const district = prop.location?.district?.toLowerCase() || '';
      if (!city.includes(searchCriteria.location) && !district.includes(searchCriteria.location)) {
        return false;
      }
    }

    // Filter by property type from search
    if (searchCriteria.propertyType && prop.type !== searchCriteria.propertyType) {
      return false;
    }

    // Filter by price range
    if (searchCriteria.maxPrice && prop.price > searchCriteria.maxPrice) {
      return false;
    }
    if (searchCriteria.minPrice && prop.price < searchCriteria.minPrice) {
      return false;
    }

    // Filter bedrooms
    if (searchCriteria.bedrooms && prop.details?.bedrooms !== searchCriteria.bedrooms) {
      return false;
    }

    return true;
  });

  // Split into featured and recent
  const featuredProperties = filteredProperties.filter(p => p.isFeatured);
  const recentProperties = filteredProperties.filter(p => !p.isFeatured);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setViewMode('list');
  };

  // Callback to refresh properties after CRUD operations
  const handlePropertiesChange = () => {
    loadProperties();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-primary font-sans">
      {/* Navbar always visible */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={handleTabChange} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
        savedCount={savedPropertyIds.length}
      />

      {/* Main Container Section */}
      <main className="flex-1 pb-20 pt-[52px]">
        {isAdmin && isAuthenticated ? (
          /* Admin Dashboard Console view — only when authenticated */
          <AdminPanel 
            properties={properties} 
            setProperties={setProperties} 
            agents={mockAgents}
            onPropertiesChange={handlePropertiesChange}
          />
        ) : (
          /* Customer Portal View */
          <>
            {currentTab === 'home' && (
              viewMode === 'detail' && selectedProperty ? (
                <PropertyDetail 
                  property={selectedProperty} 
                  onBackClick={() => setViewMode('list')} 
                  onInquireClick={handleInquireClick}
                />
              ) : (
                <>
                  {/* Hero section */}
                  <Hero onSearchSubmit={handleSearchSubmit} />

                  {/* Filter Sub Bar */}
                  <div className="max-w-[1200px] mx-auto px-gutter mb-8 mt-12 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-left">
                    {/* Purpose Filters */}
                    <div className="flex bg-surface-offwhite p-1 rounded-full border border-border-subtle">
                      <button
                        onClick={() => setFilterPurpose('all')}
                        className={`px-5 py-1.5 rounded-full text-[13px] font-bold transition-all cursor-pointer ${filterPurpose === 'all' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilterPurpose('buy')}
                        className={`px-5 py-1.5 rounded-full text-[13px] font-bold transition-all cursor-pointer ${filterPurpose === 'buy' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                      >
                        For Sale
                      </button>
                      <button
                        onClick={() => setFilterPurpose('rent')}
                        className={`px-5 py-1.5 rounded-full text-[13px] font-bold transition-all cursor-pointer ${filterPurpose === 'rent' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                      >
                        For Rent
                      </button>
                    </div>

                    {/* Type Filters */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'All Types' },
                        { id: 'house', label: 'Houses' },
                        { id: 'flat', label: 'Apartments' },
                        { id: 'land', label: 'Land Plots' },
                        { id: 'commercial', label: 'Commercial' }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setFilterType(t.id)}
                          className={`px-4 py-1.5 border rounded-full text-[12px] font-bold transition-all cursor-pointer active:scale-95 ${
                            filterType === t.id
                              ? 'bg-accent-blue text-white border-accent-blue shadow-sm'
                              : 'bg-white text-on-surface-variant border-border-subtle hover:border-border-strong hover:text-primary'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Filters */}
                  {(searchCriteria || filterPurpose !== 'all' || filterType !== 'all') && (
                    <div className="max-w-[1200px] mx-auto px-gutter mb-6 text-left">
                      <button 
                        className="bg-surface-offwhite hover:bg-border-subtle text-primary border border-border-subtle px-4 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer" 
                        onClick={() => {
                          setSearchCriteria(null);
                          setFilterPurpose('all');
                          setFilterType('all');
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}

                  {/* Featured Properties */}
                  {featuredProperties.length > 0 && (
                    <section className="max-w-[1200px] mx-auto px-gutter pb-8 text-left">
                      <div className="mb-6">
                        <h2 className="text-[24px] font-bold text-primary">Featured Properties</h2>
                        <p className="text-on-surface-variant text-[14px] mt-1 font-medium">
                          Handpicked premium listings.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredProperties.map((prop) => (
                          <ListingCard 
                            key={prop.id} 
                            property={prop} 
                            onPropertyClick={(p) => {
                              setSelectedProperty(p);
                              setViewMode('detail');
                            }}
                            onInquireClick={handleInquireClick}
                            isFavorited={savedPropertyIds.includes(prop.id)}
                            onFavoriteClick={handleFavoriteToggle}
                            isComparing={!!compareList.find(p => p.id === prop.id)}
                            onCompareToggle={handleCompareToggle}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Recent / All Listings */}
                  <section className="max-w-[1200px] mx-auto px-gutter pb-12 text-left">
                    <div className="mb-6">
                      <h2 className="text-[24px] font-bold text-primary">
                        {featuredProperties.length > 0 ? 'More Properties' : 'All Properties'}
                      </h2>
                      <p className="text-on-surface-variant text-[14px] mt-1 font-medium">
                        {filteredProperties.length} properties found.
                      </p>
                    </div>

                    {recentProperties.length === 0 && featuredProperties.length === 0 ? (
                      <div className="py-20 px-5 bg-white border border-dashed border-border-strong rounded-card text-center">
                        <h3 className="text-primary text-[18px] font-bold mb-2">No properties match your search</h3>
                        <p className="text-on-surface-variant text-[14px]">Try broadening your search parameters.</p>
                      </div>
                    ) : recentProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentProperties.map((prop) => (
                          <ListingCard 
                            key={prop.id} 
                            property={prop} 
                            onPropertyClick={(p) => {
                              setSelectedProperty(p);
                              setViewMode('detail');
                            }}
                            onInquireClick={handleInquireClick}
                            isFavorited={savedPropertyIds.includes(prop.id)}
                            onFavoriteClick={handleFavoriteToggle}
                            isComparing={!!compareList.find(p => p.id === prop.id)}
                            onCompareToggle={handleCompareToggle}
                          />
                        ))}
                      </div>
                    ) : null}
                  </section>
                </>
              )
            )}

            {currentTab === 'map' && (
              <section className="pt-8">
                <MapExplorer 
                  properties={properties} 
                  onSelectProperty={(prop) => {
                    setSelectedProperty(prop);
                  }} 
                />
              </section>
            )}

            {currentTab === 'sell' && (
              <section className="pt-8">
                <SellProperty />
              </section>
            )}

            {currentTab === 'tools' && (
              <section className="pt-8 max-w-[1200px] mx-auto px-gutter">
                {/* Tools Sub-Tab Switcher */}
                <div className="flex justify-center gap-3 mb-10">
                  <button
                    onClick={() => setActiveToolTab('emi')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all cursor-pointer active:scale-95 ${
                      activeToolTab === 'emi'
                        ? 'bg-accent-blue text-white shadow-sm'
                        : 'bg-surface-offwhite text-on-surface-variant border border-border-subtle hover:text-primary'
                    }`}
                  >
                    <CalcIcon size={16} />
                    EMI Calculator
                  </button>
                  <button
                    onClick={() => setActiveToolTab('converter')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all cursor-pointer active:scale-95 ${
                      activeToolTab === 'converter'
                        ? 'bg-accent-blue text-white shadow-sm'
                        : 'bg-surface-offwhite text-on-surface-variant border border-border-subtle hover:text-primary'
                    }`}
                  >
                    <ArrowRightLeft size={16} />
                    Unit Converter
                  </button>
                </div>

                {activeToolTab === 'emi' && <Calculator />}
                {activeToolTab === 'converter' && <UnitConverter />}
              </section>
            )}

            {currentTab === 'saved' && (
              <section className="max-w-[1200px] mx-auto px-gutter py-12 text-left animate-[fadeInUp_0.4s_var(--apple-ease)]">
                <div className="mb-8">
                  <h2 className="text-[24px] font-bold text-primary">Saved Properties</h2>
                  <p className="text-on-surface-variant text-[14px] mt-1 font-medium">
                    Your bookmarked properties list.
                  </p>
                </div>
                {properties.filter(p => savedPropertyIds.includes(p.id)).length === 0 ? (
                  <div className="py-20 px-5 bg-white border border-dashed border-border-strong rounded-card text-center">
                    <h3 className="text-primary text-[18px] font-bold mb-2">No saved properties</h3>
                    <p className="text-on-surface-variant text-[14px]">Click the heart icon on listings to bookmark properties.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {properties
                      .filter(p => savedPropertyIds.includes(p.id))
                      .map((prop) => (
                        <ListingCard 
                          key={prop.id} 
                          property={prop} 
                          onPropertyClick={(p) => {
                            setSelectedProperty(p);
                            setViewMode('detail');
                            setCurrentTab('home'); // Go to home to display detail
                          }}
                          onInquireClick={handleInquireClick}
                          isFavorited={true}
                          onFavoriteClick={handleFavoriteToggle}
                          isComparing={!!compareList.find(p => p.id === prop.id)}
                          onCompareToggle={handleCompareToggle}
                        />
                      ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {/* Inquiry Popup Modal */}
      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        property={inquiryProperty} 
      />

      {/* Compare Floating Drawer */}
      {!isAdmin && (
        <CompareDrawer 
          selectedProperties={compareList}
          onRemoveProperty={handleRemoveCompare}
          onClearAll={handleClearCompare}
          onPropertyClick={(p) => {
            setSelectedProperty(p);
            setViewMode('detail');
            setCurrentTab('home');
          }}
          onInquireClick={handleInquireClick}
        />
      )}

      {/* Footer */}
      <footer className="w-full py-12 bg-surface-offwhite border-t border-border-subtle">
        <div className="max-w-[1200px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="text-[24px] font-bold text-primary">Nepal Exchange Pvt. Ltd</div>
            <p className="text-[14px] text-on-surface-variant leading-relaxed font-medium">
              Your trusted partner for buying, selling, and renting properties across Nepal. 
              Serving Kathmandu Valley, Pokhara, Chitwan, and beyond.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-border-subtle flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all" title="Facebook">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-blue-600">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-border-subtle flex items-center justify-center hover:bg-pink-50 hover:border-pink-300 transition-all" title="Instagram">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-pink-600">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-border-subtle flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all" title="YouTube">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-red-600">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-[14px] text-primary font-bold">Quick Links</div>
              <ul className="space-y-2 text-[14px] text-on-surface-variant font-medium">
                <li><a onClick={() => { setCurrentTab('home'); setFilterPurpose('buy'); }} className="hover:underline cursor-pointer">Buy Property</a></li>
                <li><a onClick={() => { setCurrentTab('home'); setFilterPurpose('rent'); }} className="hover:underline cursor-pointer">Rent Property</a></li>
                <li><a onClick={() => setCurrentTab('sell')} className="hover:underline cursor-pointer">Sell Property</a></li>
                <li><a onClick={() => setCurrentTab('map')} className="hover:underline cursor-pointer">Map Explorer</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="text-[14px] text-primary font-bold">Tools</div>
              <ul className="space-y-2 text-[14px] text-on-surface-variant font-medium">
                <li><a onClick={() => { setCurrentTab('tools'); setActiveToolTab('emi'); }} className="hover:underline cursor-pointer">EMI Calculator</a></li>
                <li><a onClick={() => { setCurrentTab('tools'); setActiveToolTab('converter'); }} className="hover:underline cursor-pointer">Unit Converter</a></li>
                <li><a onClick={() => setCurrentTab('saved')} className="hover:underline cursor-pointer">Saved Properties</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="text-[14px] text-primary font-bold">Contact Us</div>
            <div className="space-y-3 text-[14px] text-on-surface-variant font-medium">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-accent-blue flex-shrink-0 mt-0.5" />
                <span>Baluwatar, Kathmandu<br />Nepal 44600</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-accent-blue flex-shrink-0" />
                <span>+977 980-0000000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-accent-blue flex-shrink-0" />
                <span>info@nepalexchange.com.np</span>
              </div>
            </div>
            <div className="mt-6 text-[13px] text-on-surface-variant opacity-70 font-medium">
              © 2026 Nepal Exchange Pvt. Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
