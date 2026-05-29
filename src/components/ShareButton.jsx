import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';

export default function ShareButton({ property }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this property: ${property?.title || 'Property'} - Rs. ${property?.price?.toLocaleString('en-NP') || ''} | ${property?.location?.city || ''}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border-subtle bg-white hover:bg-surface-offwhite text-on-surface-variant text-[13px] font-semibold transition-all cursor-pointer active:scale-95"
      >
        <Share2 size={14} />
        <span>Share</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-border-subtle rounded-xl shadow-lg z-50 overflow-hidden animate-[fadeInUp_0.2s_var(--apple-ease)]">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-primary hover:bg-surface-offwhite transition-colors cursor-pointer text-left"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-primary hover:bg-surface-offwhite transition-colors cursor-pointer text-left"
          >
            <MessageCircle size={16} className="text-green-600" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-primary hover:bg-surface-offwhite transition-colors cursor-pointer text-left"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600 fill-current">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Share on Facebook</span>
          </button>
        </div>
      )}
    </div>
  );
}
