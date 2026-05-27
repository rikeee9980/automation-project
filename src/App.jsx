import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ListingCard from './components/ListingCard';
import MapExplorer from './components/MapExplorer';
import VirtualStaging from './components/VirtualStaging';
import MarketIntelligence from './components/MarketIntelligence';
import AIChatbot from './components/AIChatbot';
import AdminPanel from './components/AdminPanel';
import PropertyDetail from './components/PropertyDetail';
import SellProperty from './components/SellProperty';
import { fetchProperties } from './lib/propertyService';
import { mockProperties, mockAgents } from './data/mockProperties';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [isAdmin, setIsAdmin] = useState(false);
  const [properties, setProperties] = useState(mockProperties);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  // Filter listings based on AI parsed criteria
  const filteredProperties = properties.filter((prop) => {
    if (!searchCriteria) return true;

    // Filter bedrooms
    if (searchCriteria.bedrooms && prop.details?.bedrooms !== searchCriteria.bedrooms) {
      return false;
    }

    // Filter max price
    if (searchCriteria.maxPrice && prop.price > searchCriteria.maxPrice) {
      return false;
    }

    // Filter amenities/features
    if (searchCriteria.features && searchCriteria.features.length > 0) {
      const propAmenities = prop.amenities || [];
      const hasAllFeatures = searchCriteria.features.every(feat => propAmenities.includes(feat));
      if (!hasAllFeatures) return false;
    }

    return true;
  });

  const selectPropertyForStaging = (prop) => {
    setSelectedProperty(prop);
    setCurrentTab('staging');
    setViewMode('list');
  };

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
                  onStagingClick={selectPropertyForStaging} 
                />
              ) : (
                <>
                  {/* Immersive Hero section */}
                  <Hero onSearchSubmit={handleSearchSubmit} />

                  {/* Listings Grid */}
                  <section className="max-w-[1200px] mx-auto px-gutter py-12">
                    <div className="flex justify-between items-center mb-8 text-left">
                      <div>
                        <h2 className="text-[24px] font-bold text-primary">
                          Featured Properties
                        </h2>
                        <p className="text-on-surface-variant text-[14px] mt-1 font-medium">
                          Explore our curated selection of premium properties.
                        </p>
                      </div>
                      {searchCriteria && (
                        <button 
                          className="bg-surface-offwhite hover:bg-border-subtle text-primary border border-border-subtle px-4 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer" 
                          onClick={() => setSearchCriteria(null)}
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>

                    {filteredProperties.length === 0 ? (
                      <div className="py-20 px-5 bg-white border border-dashed border-border-strong rounded-card text-center">
                        <h3 className="text-primary text-[18px] font-bold mb-2">No properties match your search</h3>
                        <p className="text-on-surface-variant text-[14px]">Try broadening your search parameters.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredProperties.map((prop) => (
                          <ListingCard 
                            key={prop.id} 
                            property={prop} 
                            onStagingClick={selectPropertyForStaging} 
                            onPropertyClick={(p) => {
                              setSelectedProperty(p);
                              setViewMode('detail');
                            }}
                          />
                        ))}
                      </div>
                    )}
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

            {currentTab === 'staging' && (
              <section className="pt-8">
                <VirtualStaging selectedProperty={selectedProperty} />
              </section>
            )}

            {currentTab === 'trends' && (
              <section className="pt-8">
                <MarketIntelligence selectedProperty={selectedProperty} />
              </section>
            )}
          </>
        )}
      </main>

      {/* Floating Chatbot */}
      {!isAdmin && <AIChatbot properties={properties} />}

      {/* Clean Footer */}
      <footer className="w-full py-12 bg-surface-offwhite border-t border-border-subtle">
        <div className="max-w-[1200px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          <div className="space-y-4">
            <div className="text-[24px] font-bold text-primary">Aetheria</div>
            <p className="text-[14px] text-on-surface-variant leading-relaxed font-medium">
              Elevating the standards of luxury living through curated real estate excellence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-[14px] text-primary font-bold">Explore</div>
              <ul className="space-y-2 text-[14px] text-on-surface-variant font-medium">
                <li><a className="hover:underline cursor-pointer">Brand</a></li>
                <li><a className="hover:underline cursor-pointer">Description</a></li>
                <li><a className="hover:underline cursor-pointer">Features</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="text-[14px] text-primary font-bold">Support</div>
              <ul className="space-y-2 text-[14px] text-on-surface-variant font-medium">
                <li><a className="hover:underline cursor-pointer">Contact</a></li>
                <li><a className="hover:underline cursor-pointer">Privacy</a></li>
                <li><a className="hover:underline cursor-pointer">Info</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-[14px] text-primary font-bold mb-4">Newsletter</div>
              <div className="relative">
                <input 
                  className="w-full bg-white border border-border-subtle rounded-full py-2.5 px-5 focus:outline-none focus:ring-1 focus:ring-accent-blue/30 focus:border-accent-blue text-[13px]" 
                  placeholder="Your email" 
                  type="email" 
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary hover:opacity-90 text-white px-5 rounded-full text-[12px] font-semibold transition-opacity cursor-pointer">
                  Join
                </button>
              </div>
            </div>
            <div className="mt-8 text-[13px] text-on-surface-variant opacity-70 font-medium">
              © 2026 Aetheria Luxury Real Estate. All rights reserved.
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
