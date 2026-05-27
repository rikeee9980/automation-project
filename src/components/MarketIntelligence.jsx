import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export default function MarketIntelligence({ selectedProperty }) {
  const [activeRange, setActiveRange] = useState('12m');
  const [avgPrice, setAvgPrice] = useState(0);
  const [listedCount, setListedCount] = useState(0);
  const [avgDays, setAvgDays] = useState(0);

  // Staggered counters animation on component mount
  useEffect(() => {
    const targetPrice = 62;
    const targetListed = 1247;
    const targetDays = 28;

    const duration = 1500;
    const startTime = performance.now();

    const updateCounters = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = (t) => t * (2 - t);
      const easeProgress = easeOutQuad(progress);

      setAvgPrice(Math.floor(easeProgress * targetPrice));
      setListedCount(Math.floor(easeProgress * targetListed));
      setAvgDays(Math.floor(easeProgress * targetDays));

      if (progress < 1) {
        requestAnimationFrame(updateCounters);
      }
    };

    requestAnimationFrame(updateCounters);
  }, []);

  return (
    <div className="w-full bg-background min-h-screen text-primary pb-section-v">
      {/* Title Section */}
      <section className="max-w-[1200px] mx-auto px-gutter pt-8 text-left">
        <h1 className="text-[32px] md:text-[40px] font-bold text-primary mb-2">Market Insights</h1>
        <p className="text-[19px] leading-relaxed text-on-surface-variant">Real-time data and analytics for the luxury real estate sector.</p>
      </section>

      {/* Stats Grid */}
      <section className="max-w-[1200px] mx-auto px-gutter mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white border border-border-subtle rounded-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left">
            <p className="text-[14px] font-medium text-on-surface-variant mb-2">Avg Price</p>
            <div className="flex items-end gap-2">
              <span className="text-[32px] font-bold leading-none">₹{avgPrice}L</span>
              <span className="text-[14px] font-semibold text-success flex items-center mb-1">
                <TrendingUp size={14} className="mr-0.5" />
                +4.2%
              </span>
            </div>
          </div>
          {/* Stat Card 2 */}
          <div className="bg-white border border-border-subtle rounded-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left">
            <p className="text-[14px] font-medium text-on-surface-variant mb-2">Listed</p>
            <div className="text-[32px] font-bold leading-none">{listedCount.toLocaleString()}</div>
          </div>
          {/* Stat Card 3 */}
          <div className="bg-white border border-border-subtle rounded-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left">
            <p className="text-[14px] font-medium text-on-surface-variant mb-2">Avg Days</p>
            <div className="text-[32px] font-bold leading-none">{avgDays}</div>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="max-w-[1200px] mx-auto px-gutter mt-12 text-left">
        <div className="bg-white border border-border-subtle rounded-card p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[24px] font-semibold text-primary">Price Index</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveRange('12m')}
                className={`px-4 py-1.5 text-[14px] font-semibold rounded-full transition-all ${activeRange === '12m' ? 'bg-surface-offwhite text-primary' : 'text-on-surface-variant hover:bg-surface-offwhite'}`}
              >
                12 Months
              </button>
              <button 
                onClick={() => setActiveRange('ytd')}
                className={`px-4 py-1.5 text-[14px] font-semibold rounded-full transition-all ${activeRange === 'ytd' ? 'bg-surface-offwhite text-primary' : 'text-on-surface-variant hover:bg-surface-offwhite'}`}
              >
                YTD
              </button>
            </div>
          </div>

          <div className="w-full relative h-[300px]">
            {/* SVG Price Index Chart */}
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0071e3" stopOpacity={0.15}></stop>
                  <stop offset="100%" stopColor="#0071e3" stopOpacity={0}></stop>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line className="stroke-border-subtle" x1="0" x2="800" y1="0" y2="0" strokeWidth="1"></line>
              <line className="stroke-border-subtle" x1="0" x2="800" y1="75" y2="75" strokeWidth="1"></line>
              <line className="stroke-border-subtle" x1="0" x2="800" y1="150" y2="150" strokeWidth="1"></line>
              <line className="stroke-border-subtle" x1="0" x2="800" y1="225" y2="225" strokeWidth="1"></line>
              <line className="stroke-border-subtle" x1="0" x2="800" y1="300" y2="300" strokeWidth="1"></line>
              
              {/* Area Under Curve */}
              <path 
                className="fill-[url(#chartGradient)] transition-all duration-1000" 
                d="M0,250 C100,240 150,260 200,220 C250,180 300,190 350,150 C400,110 450,130 500,100 C550,70 600,90 650,60 C700,30 750,40 800,20 L800,300 L0,300 Z"
              />
              {/* Line Curve */}
              <path 
                className="fill-none stroke-accent-blue transition-all duration-1000" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M0,250 C100,240 150,260 200,220 C250,180 300,190 350,150 C400,110 450,130 500,100 C550,70 600,90 650,60 C700,30 750,40 800,20"
              />
            </svg>
            <div className="flex justify-between mt-4 text-[14px] text-on-surface-variant font-medium">
              <span>Jan</span>
              <span>Mar</span>
              <span>Jun</span>
              <span>Sep</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="max-w-[1200px] mx-auto px-gutter mt-12 text-left">
        <h2 className="text-[24px] font-semibold text-primary mb-6">Top Areas</h2>
        <div className="overflow-x-auto border border-border-subtle rounded-card bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-offwhite border-b border-border-subtle">
                <th className="px-6 py-4 text-[14px] font-bold text-on-surface-variant uppercase tracking-wider">Area</th>
                <th className="px-6 py-4 text-[14px] font-bold text-on-surface-variant uppercase tracking-wider">Avg Price</th>
                <th className="px-6 py-4 text-[14px] font-bold text-on-surface-variant uppercase tracking-wider">Change</th>
                <th className="px-6 py-4 text-[14px] font-bold text-on-surface-variant uppercase tracking-wider">Demand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              <tr className="hover:bg-surface-offwhite transition-colors duration-200">
                <td className="px-6 py-4 text-[17px] font-semibold text-primary">Bandra West</td>
                <td className="px-6 py-4 text-[17px] text-on-surface-variant">₹4.2 Cr</td>
                <td className="px-6 py-4 text-[17px] font-semibold text-success">+8.5%</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-[12px] font-bold bg-[#abc7ff]/30 text-accent-blue rounded-full">High</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-offwhite transition-colors duration-200">
                <td className="px-6 py-4 text-[17px] font-semibold text-primary">Worli Sea Face</td>
                <td className="px-6 py-4 text-[17px] text-on-surface-variant">₹8.9 Cr</td>
                <td className="px-6 py-4 text-[17px] font-semibold text-success">+5.2%</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-[12px] font-bold bg-[#abc7ff]/30 text-accent-blue rounded-full">High</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-offwhite transition-colors duration-200">
                <td className="px-6 py-4 text-[17px] font-semibold text-primary">Juhu Scheme</td>
                <td className="px-6 py-4 text-[17px] text-on-surface-variant">₹6.1 Cr</td>
                <td className="px-6 py-4 text-[17px] font-semibold text-error">-1.2%</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-[12px] font-bold bg-surface-offwhite text-on-surface-variant rounded-full">Stable</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-offwhite transition-colors duration-200">
                <td className="px-6 py-4 text-[17px] font-semibold text-primary">Lower Parel</td>
                <td className="px-6 py-4 text-[17px] text-on-surface-variant">₹3.8 Cr</td>
                <td className="px-6 py-4 text-[17px] font-semibold text-success">+3.4%</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-[12px] font-bold bg-[#abc7ff]/30 text-accent-blue rounded-full">High</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-offwhite transition-colors duration-200">
                <td className="px-6 py-4 text-[17px] font-semibold text-primary">Colaba Causeway</td>
                <td className="px-6 py-4 text-[17px] text-on-surface-variant">₹5.5 Cr</td>
                <td className="px-6 py-4 text-[17px] text-on-surface-variant">0.0%</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-[12px] font-bold bg-surface-offwhite text-on-surface-variant rounded-full">Moderate</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
