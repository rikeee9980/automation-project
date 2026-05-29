import React, { useState, useEffect } from 'react';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function Navbar({ currentTab, setCurrentTab, isAdmin, setIsAdmin, savedCount = 0 }) {
  const { user, signOut, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When user authenticates, switch to admin mode
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      setIsAdmin(true);
    }
  }, [isAuthenticated]);

  const handleAgentClick = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        // Switch back to customer portal
        setIsAdmin(false);
        setCurrentTab('home');
      } else {
        // Already authenticated, switch to admin view
        setIsAdmin(true);
      }
    } else {
      // Open login modal
      setShowLoginModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAdmin(false);
      setCurrentTab('home');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navTabs = [
    { id: 'home', label: 'Buy' },
    { id: 'map', label: 'Map' },
    { id: 'sell', label: 'Sell' },
    { id: 'tools', label: 'Tools' },
    { id: 'saved', label: 'Saved', showCount: true },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full h-[52px] bg-white border-b border-border-subtle z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md border-transparent' : ''}`}>
        <div className="flex justify-between items-center px-gutter max-w-[1200px] mx-auto h-full w-full">
          {/* Logo / Brand Name */}
          <div 
            onClick={() => {
              setIsAdmin(false);
              setCurrentTab('home');
            }} 
            className="font-semibold text-[24px] leading-[1.25] text-primary cursor-pointer tracking-tight"
          >
            Nepal Exchange
          </div>

          {/* Tab Links */}
          <div className="hidden md:flex gap-8 items-center h-full">
            {!isAdmin ? (
              <>
                {navTabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)} 
                    className={`nav-link text-[17px] leading-[1.47] h-full flex items-center cursor-pointer transition-colors gap-1.5 ${currentTab === tab.id ? 'text-primary font-bold nav-link-active' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    <span>{tab.label}</span>
                    {tab.showCount && savedCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-accent-blue text-white rounded-full leading-none flex items-center justify-center">
                        {savedCount}
                      </span>
                    )}
                  </button>
                ))}
              </>
            ) : (
              <span className="text-accent-blue font-medium text-[14px] leading-[1.2] px-4 py-1 bg-primary-container/5 rounded-full">
                Broker Console Active
              </span>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Auth-aware button */}
            <div 
              onClick={handleAgentClick}
              className="flex items-center gap-2 cursor-pointer bg-surface-offwhite hover:bg-border-subtle text-on-surface-variant hover:text-primary px-4 py-1.5 rounded-full text-[14px] font-medium transition-all active:scale-95"
            >
              {isAuthenticated ? (
                <>
                  <LayoutDashboard size={14} />
                  <span>{isAdmin ? 'Customer Portal' : 'Broker Console'}</span>
                </>
              ) : (
                <>
                  <User size={14} />
                  <span>Agent Login</span>
                </>
              )}
            </div>

            {/* Logout button (only when authenticated) */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant hover:text-red-500 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all hover:bg-red-50 active:scale-95"
                title="Sign out"
              >
                <LogOut size={14} />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}
