import React, { useState, useRef, useEffect } from 'react';
import { Layers, Sparkles, Sliders } from 'lucide-react';

export default function VirtualStaging({ selectedProperty }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeStyle, setActiveStyle] = useState('obsidian');
  const [isStaging, setIsStaging] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  const styles = [
    { id: 'obsidian', name: 'Minimal Obsidian', desc: 'Modern dark wood & clean metals' },
    { id: 'biophilic', name: 'Biophilic Oasis', desc: 'Warm oak wood & light green accents' },
    { id: 'neon', name: 'Ambient Loft', desc: 'Chrome fixtures & soft backlight glows' }
  ];

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => {
    if (e.buttons !== 1) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  const triggerStaging = () => {
    setIsStaging(true);
    setProgress(0);
  };

  useEffect(() => {
    if (!isStaging) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsStaging(false);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isStaging]);

  const beforeImg = selectedProperty?.beforeImage || "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80";
  const obsidianImg = selectedProperty?.afterImage || "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80";
  const biophilicImg = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80";
  const neonImg = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80";

  let afterImg = obsidianImg;
  if (activeStyle === 'biophilic') afterImg = biophilicImg;
  if (activeStyle === 'neon') afterImg = neonImg;

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white border border-border-subtle rounded-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left pb-section-v">
      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[24px] font-semibold text-primary flex items-center gap-2">
            <Layers size={22} className="text-accent-blue" /> 
            <span>AI Virtual Staging Synthesizer</span>
          </h2>
          <p className="text-on-surface-variant text-[14px] mt-1">
            Furnish your empty property templates with a simple style preset toggle.
          </p>
        </div>
        {selectedProperty && (
          <span className="bg-[#abc7ff]/30 text-accent-blue font-bold text-[12px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Staging: {selectedProperty.title}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 min-h-[420px]">
        {/* Left Slider */}
        <div className="flex flex-col relative w-full h-[400px]">
          {isStaging ? (
            <div className="flex-1 bg-surface-offwhite border border-border-subtle rounded-card flex flex-col justify-center items-center gap-3">
              <span className="text-[14px] font-semibold text-primary animate-pulse flex items-center gap-1">
                <Sparkles size={14} className="text-accent-blue" />
                Synthesizing space layout...
              </span>
              <div className="w-[250px] h-[5px] bg-border-subtle rounded-full overflow-hidden">
                <div style={{ width: `${progress}%` }} className="h-full bg-accent-blue transition-all duration-200"></div>
              </div>
            </div>
          ) : (
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative flex-1 rounded-card overflow-hidden cursor-ew-resize select-none border border-border-subtle"
            >
              <img src={afterImg} alt="Staged" className="w-full h-full object-cover pointer-events-none" />

              <div 
                style={{ width: `${sliderPosition}%` }} 
                className="absolute top-0 left-0 bottom-0 overflow-hidden border-r-2 border-accent-blue"
              >
                <img 
                  src={beforeImg} 
                  alt="Empty" 
                  style={{ 
                    width: containerRef.current?.getBoundingClientRect().width || 800,
                    maxWidth: 'none'
                  }}
                  className="absolute top-0 left-0 h-full object-cover pointer-events-none"
                />
              </div>

              {/* Slider Handle */}
              <div 
                style={{ left: `${sliderPosition}%` }} 
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-border-strong flex items-center justify-center shadow-md z-10 pointer-events-none text-on-surface-variant"
              >
                <Sliders size={14} />
              </div>
            </div>
          )}
        </div>

        {/* Right Presets */}
        <div className="flex flex-col gap-4">
          <div className="bg-surface-offwhite border border-border-subtle rounded-card p-5">
            <h3 className="text-[14px] font-bold text-primary mb-3">Design Presets</h3>
            <div className="flex flex-col gap-2">
              {styles.map(style => (
                <div 
                  key={style.id}
                  onClick={() => !isStaging && setActiveStyle(style.id)}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${activeStyle === style.id ? 'bg-white border-border-strong' : 'border-transparent hover:bg-white/50'}`}
                >
                  <div className="text-[14px] font-bold text-primary">{style.name}</div>
                  <div className="text-[12px] text-on-surface-variant mt-1">{style.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={triggerStaging} 
            disabled={isStaging} 
            className="w-full h-11 bg-accent-blue text-white rounded-full text-[14px] font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={14} /> 
            <span>Render Staging Layout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
