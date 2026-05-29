import React, { useState } from 'react';
import { X, Check, ArrowRight, ShieldAlert, Sparkles, Info } from 'lucide-react';

export default function CompareDrawer({ selectedProperties = [], onRemoveProperty, onClearAll, onPropertyClick, onInquireClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedProperties.length === 0) return null;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Bottom Floating Compare Bar */}
      <div 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[92%] max-w-[680px] bg-white/90 backdrop-blur-md border border-border-subtle rounded-2xl shadow-xl p-4 flex items-center justify-between gap-4 animate-[slideUp_0.4s_var(--apple-ease)]"
        style={{ boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.15)' }}
      >
        <div className="flex items-center gap-3 overflow-x-auto py-1 pr-2 no-scrollbar min-w-0">
          {selectedProperties.map((prop) => (
            <div 
              key={prop.id} 
              className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-border-strong group"
            >
              <img 
                src={prop.image} 
                alt={prop.title} 
                className="w-full h-full object-cover" 
              />
              <button
                onClick={() => onRemoveProperty(prop.id)}
                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                title="Remove"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {selectedProperties.length < 3 && (
            <div className="flex-shrink-0 w-12 h-12 border-2 border-dashed border-border-strong rounded-lg flex items-center justify-center text-on-surface-variant/40 text-[11px] font-bold">
              +{3 - selectedProperties.length}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onClearAll}
            className="text-[12px] text-on-surface-variant hover:text-primary font-semibold px-3 py-2 cursor-pointer transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleOpenModal}
            disabled={selectedProperties.length < 2}
            className="bg-accent-blue disabled:bg-border-strong disabled:cursor-not-allowed hover:opacity-95 text-white text-[13px] font-bold py-2 px-5 rounded-full flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Compare</span>
            <span className="bg-white/20 text-white text-[11px] px-1.5 py-0.5 rounded-full font-bold">
              {selectedProperties.length}
            </span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-[960px] max-h-[85vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border-subtle"
            style={{ animation: 'modalSlideIn 0.3s ease-out' }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-border-subtle">
              <div>
                <h3 className="text-[18px] md:text-[20px] font-bold text-primary flex items-center gap-2">
                  <Sparkles size={18} className="text-accent-blue" />
                  Side-by-Side Comparison
                </h3>
                <p className="text-[12px] text-on-surface-variant font-medium">
                  Compare technical details, valuations, and parameters.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-offwhite cursor-pointer transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Scrollable Table) */}
            <div className="flex-1 overflow-auto p-6 bg-surface-offwhite">
              <div className="min-w-[600px] bg-white rounded-xl border border-border-subtle overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="bg-surface-offwhite border-b border-border-subtle">
                      <th className="p-4 font-bold text-primary w-[22%]">Features</th>
                      {selectedProperties.map((prop) => (
                        <th key={prop.id} className="p-4 font-bold text-primary w-[26%] border-l border-border-subtle">
                          <div className="space-y-2">
                            <img 
                              src={prop.image} 
                              alt={prop.title} 
                              className="w-full h-24 object-cover rounded-lg border border-border-subtle"
                            />
                            <h4 className="font-bold text-[14px] text-primary leading-tight line-clamp-1">{prop.title}</h4>
                            <p className="text-[11px] text-on-surface-variant">{prop.location.city}</p>
                          </div>
                        </th>
                      ))}
                      {/* Fill empty cells if comparing less than 3 */}
                      {selectedProperties.length === 2 && (
                        <th className="p-4 text-on-surface-variant/40 text-center border-l border-border-subtle w-[26%] bg-surface-offwhite/30">
                          <div className="flex flex-col items-center justify-center h-full py-6">
                            <Info size={16} className="mb-1" />
                            <span className="text-[11px] font-semibold">Add another property to compare</span>
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row: Price */}
                    <tr className="border-b border-border-subtle hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">Price</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 font-bold text-accent-blue border-l border-border-subtle">
                          {prop.purpose === 'rent' 
                            ? `Rs. ${prop.price.toLocaleString('en-NP')}/month`
                            : `Rs. ${(prop.price / 100000).toFixed(0)} Lakhs`
                          }
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>

                    {/* Row: Purpose */}
                    <tr className="border-b border-border-subtle hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">Listing Type</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 capitalize font-semibold text-primary border-l border-border-subtle">
                          {prop.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>

                    {/* Row: Property Type */}
                    <tr className="border-b border-border-subtle hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">Property Type</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 capitalize font-semibold text-primary border-l border-border-subtle">
                          {prop.type || 'House'}
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>

                    {/* Row: BHK Config */}
                    <tr className="border-b border-border-subtle hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">Bedrooms</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 font-medium text-primary border-l border-border-subtle">
                          {prop.type === 'land' ? '—' : `${prop.details?.bedrooms || 0} BHK`}
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>

                    {/* Row: Bathrooms */}
                    <tr className="border-b border-border-subtle hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">Bathrooms</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 font-medium text-primary border-l border-border-subtle">
                          {prop.type === 'land' ? '—' : `${prop.details?.bathrooms || 0} Baths`}
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>

                    {/* Row: Area */}
                    <tr className="border-b border-border-subtle hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">Area (Sqft)</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 font-semibold text-primary border-l border-border-subtle">
                          {prop.details?.area?.toLocaleString()} sqft
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>

                    {/* Row: Road Access */}
                    <tr className="border-b border-border-subtle hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">Road Access</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 font-bold text-primary border-l border-border-subtle">
                          {prop.roadAccess || 'N/A'}
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>

                    {/* Row: Facing */}
                    <tr className="border-b border-border-subtle hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">
                        Facing Direction
                      </td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 border-l border-border-subtle font-semibold text-primary">
                          {prop.facing || 'N/A'}
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>

                    {/* Row: Amenities */}
                    <tr className="border-b border-border-subtle hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">Amenities</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 border-l border-border-subtle">
                          <div className="flex flex-wrap gap-1">
                            {prop.amenities?.map((amenity, idx) => (
                              <span 
                                key={idx} 
                                className="bg-surface-offwhite border border-border-subtle text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>

                    {/* Row: Action buttons */}
                    <tr className="hover:bg-surface-offwhite/50">
                      <td className="p-4 font-bold text-primary bg-surface-offwhite/20">Actions</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="p-4 border-l border-border-subtle">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                handleCloseModal();
                                onPropertyClick && onPropertyClick(prop);
                              }}
                              className="w-full bg-surface-offwhite border border-border-subtle hover:bg-border-subtle text-primary py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer text-center"
                            >
                              View Specs
                            </button>
                            <button
                              onClick={() => {
                                handleCloseModal();
                                onInquireClick && onInquireClick(prop);
                              }}
                              className="w-full bg-accent-blue hover:opacity-95 text-white py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer text-center"
                            >
                              Inquire Now
                            </button>
                          </div>
                        </td>
                      ))}
                      {selectedProperties.length === 2 && <td className="border-l border-border-subtle bg-surface-offwhite/10" />}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-white border-t border-border-subtle">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 border border-border-subtle hover:bg-surface-offwhite text-primary rounded-full text-[13px] font-bold cursor-pointer transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS styles for compare drawer and scroll bar */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 40px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
