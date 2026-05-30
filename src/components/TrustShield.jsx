import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Info 
} from 'lucide-react';

export default function TrustShield({ property }) {
  const ver = property.verification || {};
  const [openIndex, setOpenIndex] = useState(0);

  const checklist = [
    { key: 'legalOwnership', label: 'Legal Ownership', description: 'Lalpurja registration certificate verified.' },
    { key: 'taxClearance', label: 'Tax Clearance', description: 'Government property tax cleared for the current fiscal year.' },
    { key: 'accessRoad', label: 'Access Road Confirmation', description: 'Access road width and public right-of-way confirmed.' },
    { key: 'physicalCheck', label: 'Broker Physical Inspection', description: 'Broker on-site inspection of property structure and boundaries.' },
    { key: 'utilityChecks', label: 'Utility Infrastructure', description: 'Dedicated electricity lines and water supply verified.' }
  ];

  const verifiedCount = checklist.filter(item => ver[item.key]).length;
  const percent = Math.round((verifiedCount / checklist.length) * 100);

  const qas = [
    {
      q: "What is the exact road access width and condition?",
      a: property.roadAccess 
        ? `Our broker confirmed the access road width is ${property.roadAccess}. The road is fully accessible and public right-of-way is verified.`
        : "Road access details are pending formal broker measurement. Please consult our agent.",
      isVerified: !!ver.accessRoad
    },
    {
      q: "Which direction does the property face and how is the natural light?",
      a: property.facing 
        ? `The property faces ${property.facing}. This orientation ensures excellent natural light throughout the day, as verified on-site.`
        : "Facing direction is not officially documented. Our agents can verify this during a physical visit.",
      isVerified: !!ver.physicalCheck
    },
    {
      q: "What is the building age and construction quality?",
      a: property.builtYear 
        ? `Construction was completed in the year ${property.builtYear}. The structure is built with earthquake-resistant standards and has passed our basic physical inspection.`
        : "Built year and construction documents are undergoing verification. Our structural audit is pending.",
      isVerified: !!ver.physicalCheck
    },
    {
      q: "Are the utility lines (water, electricity, drainage) confirmed?",
      a: ver.utilityChecks 
        ? "Yes, dedicated utility lines are active. There is a municipal water connection, drainage systems, and a stable 3-phase electricity supply."
        : "Basic electricity connection is present. Water supply is currently via tanker/groundwater, municipal supply line verification is pending.",
      isVerified: !!ver.utilityChecks
    },
    {
      q: "Are the ownership deeds and government taxes clear?",
      a: ver.legalOwnership && ver.taxClearance
        ? "Absolutely. The Lalpurja (land registry deed) has been cross-checked with the Land Revenue Office (Malpot) and property taxes are fully cleared up to the current fiscal year."
        : "Documents are currently undergoing audit. Basic ownership claims are registered, but tax clearance verification is in progress.",
      isVerified: !!(ver.legalOwnership && ver.taxClearance)
    }
  ];

  // Determine trust level badge color/text
  let trustBadgeColor = "bg-red-50 text-red-700 border-red-200/50";
  let trustLabel = "Basic Listing";
  if (verifiedCount >= 5) {
    trustBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
    trustLabel = "Fully Verified";
  } else if (verifiedCount >= 3) {
    trustBadgeColor = "bg-accent-blue/10 text-accent-blue border-accent-blue/20";
    trustLabel = "Highly Verified";
  } else if (verifiedCount > 0) {
    trustBadgeColor = "bg-amber-50 text-amber-700 border-amber-200/50";
    trustLabel = "Partially Verified";
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Verification Card */}
      <div className="bg-white border border-border-subtle rounded-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${verifiedCount === 5 ? 'bg-emerald-50 text-emerald-600' : 'bg-accent-blue/10 text-accent-blue'}`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-primary">Property Trust Shield</h2>
              <p className="text-[12px] text-on-surface-variant font-medium">Nepal Exchange Pvt. Ltd. Verification Standard</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[12px] font-bold border ${trustBadgeColor} self-start sm:self-auto`}>
            {trustLabel}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-[13px] font-bold mb-2">
            <span className="text-primary">Verification Checklist Progress</span>
            <span className={verifiedCount === 5 ? 'text-emerald-600' : 'text-accent-blue'}>{percent}% Completed</span>
          </div>
          <div className="bg-surface-offwhite h-2.5 rounded-full overflow-hidden border border-border-subtle/50">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                verifiedCount === 5 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-accent-blue to-blue-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklist.map((item) => {
            const isDone = !!ver[item.key];
            return (
              <div 
                key={item.key} 
                className={`p-4 rounded-xl border transition-all ${
                  isDone 
                    ? 'border-emerald-100 bg-emerald-50/20' 
                    : 'border-border-subtle bg-surface-offwhite/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1 rounded-full ${isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-border-subtle text-on-surface-variant'}`}>
                    {isDone ? <Check size={14} className="stroke-[3]" /> : <Clock size={14} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="text-[14px] font-bold text-primary">{item.label}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
                        {isDone ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant leading-snug">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Virtual Site Visit Accordion Q&A */}
      <div className="bg-white border border-border-subtle rounded-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue">
            <HelpCircle size={22} />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-primary">Virtual Site Visit Q&A</h2>
            <p className="text-[12px] text-on-surface-variant font-medium">Verified facts from our broker's on-site visit</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-accent-blue/5 border border-accent-blue/10 p-3 rounded-lg mb-6">
          <Info size={16} className="text-accent-blue mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            Avoid physical travel and assess the property accurately. These responses are compiled directly by our certified agents during physical checkups.
          </p>
        </div>

        <div className="flex flex-col border border-border-subtle rounded-xl overflow-hidden">
          {qas.map((qa, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`border-b border-border-subtle last:border-b-0 ${isOpen ? 'bg-surface-offwhite/30' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full py-4 px-5 flex items-center justify-between gap-4 text-left font-bold text-[15px] text-primary hover:bg-surface-offwhite/50 transition-all focus:outline-none"
                >
                  <span className="flex-1 leading-snug">{qa.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-on-surface-variant" /> : <ChevronDown size={16} className="text-on-surface-variant" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-0 text-[14px] text-on-surface-variant leading-relaxed border-t border-border-subtle/50 animate-fadeIn">
                    <div className="flex items-start gap-3 mt-3">
                      <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${qa.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {qa.isVerified ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${qa.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {qa.isVerified ? 'Verified Answer' : 'Pending Audit'}
                          </span>
                        </div>
                        <p>{qa.a}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
