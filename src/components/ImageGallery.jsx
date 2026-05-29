import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export default function ImageGallery({ images = [], title = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);

  const safeImages = images.length > 0 ? images : [];
  if (safeImages.length === 0) return null;

  const goNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  return (
    <>
      {/* Main Gallery */}
      <div className="relative group">
        {/* Main Image */}
        <div
          className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-surface-offwhite cursor-pointer"
          onClick={() => setIsLightbox(true)}
        >
          <img
            src={safeImages[activeIndex]}
            alt={`${title} - Photo ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
          />

          {/* Expand icon */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 size={14} className="text-white" />
          </div>

          {/* Image counter */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[12px] font-bold px-3 py-1 rounded-full">
              {activeIndex + 1} / {safeImages.length}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white cursor-pointer active:scale-95"
            >
              <ChevronLeft size={18} className="text-primary" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white cursor-pointer active:scale-95"
            >
              <ChevronRight size={18} className="text-primary" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden cursor-pointer transition-all ${
                idx === activeIndex
                  ? 'ring-2 ring-primary ring-offset-1 opacity-100'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-[fadeIn_0.2s_ease]"
          onClick={() => setIsLightbox(false)}
        >
          {/* Close */}
          <button
            onClick={() => setIsLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all z-10"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Image */}
          <img
            src={safeImages[activeIndex]}
            alt={`${title} - Full ${activeIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Lightbox Navigation */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}

          {/* Lightbox counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-sm text-white text-[13px] font-bold px-4 py-1.5 rounded-full">
            {activeIndex + 1} / {safeImages.length}
          </div>
        </div>
      )}
    </>
  );
}
