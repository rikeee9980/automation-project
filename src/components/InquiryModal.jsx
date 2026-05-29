import React, { useState, useEffect } from 'react';
import { X, Loader2, Send, CheckCircle2, User, Mail, MessageSquare, MapPin } from 'lucide-react';
import { createInquiry } from '../lib/propertyService';

export default function InquiryModal({ isOpen, onClose, property }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill message when property changes
  useEffect(() => {
    if (property) {
      setMessage(`Hello, I am interested in inquiring about ${property.title} in ${property.location?.city || 'this area'}. Please share more details regarding availability and private tour bookings.`);
    } else {
      setMessage("Hello, I'm interested in learning more about this property. Please contact me with more information.");
    }
    // Reset success/error on property change or open
    setSuccess(false);
    setError('');
  }, [property, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createInquiry({
        name,
        email,
        message,
        propertyId: property?.id,
        propertyTitle: property?.title || 'General Inquiry'
      });
      setSuccess(true);
      // Clear inputs
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden text-left border border-border-subtle"
        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
      >
        {/* Header line accent */}
        <div className="h-1 bg-gradient-to-r from-accent-blue via-indigo-500 to-purple-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer z-10 p-1.5 rounded-full hover:bg-surface-offwhite"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Success View */}
        {success ? (
          <div className="p-8 flex flex-col items-center justify-center text-center min-h-[350px]">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 animate-[scaleIn_0.4s_ease-out]">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-[22px] font-bold text-primary tracking-tight mb-2">
              Inquiry Submitted
            </h3>
            <p className="text-[14px] text-on-surface-variant max-w-[320px] leading-relaxed mb-8">
              Thank you for your interest! A luxury portfolio representative will reach out to you at <strong className="text-primary">{email || 'your email'}</strong> shortly.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-primary hover:opacity-90 text-white rounded-full text-[14px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              Back to Properties
            </button>
          </div>
        ) : (
          /* Form View */
          <div className="p-7">
            {/* Property Summary Header */}
            {property && (
              <div className="flex gap-4 p-3 bg-surface-offwhite rounded-xl mb-6 border border-border-subtle">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-20 h-20 object-cover rounded-lg border border-border-subtle flex-shrink-0"
                />
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[11px] font-bold text-accent-blue uppercase tracking-wider mb-0.5">
                    Property Inquiry
                  </span>
                  <h4 className="font-semibold text-[15px] text-primary truncate">
                    {property.title}
                  </h4>
                  <div className="flex items-center gap-1 text-on-surface-variant text-[12px] mt-0.5">
                    <MapPin size={11} className="text-on-surface-variant/70" />
                    <span className="truncate">{property.location?.address}, {property.location?.city}</span>
                  </div>
                  <span className="text-[13px] font-bold text-primary mt-1">
                    Rs. {(property.price / 100000).toFixed(0)} Lakhs
                  </span>
                </div>
              </div>
            )}

            {!property && (
              <div className="mb-6">
                <h3 className="text-[20px] font-bold text-primary tracking-tight">
                  Inquire Information
                </h3>
                <p className="text-[13px] text-on-surface-variant mt-1">
                  Submit your contact details and questions, and our luxury advisory desk will connect with you.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px] font-medium animate-pulse">
                {error}
              </div>
            )}

            {/* Inquiry Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <User size={13} className="text-on-surface-variant/80" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ritesh Acharya"
                  required
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <Mail size={13} className="text-on-surface-variant/80" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-on-surface-variant/80" />
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message or questions here..."
                  required
                  rows={4}
                  className="w-full p-4 bg-surface-offwhite border border-border-strong rounded-xl text-[14px] text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all resize-none"
                />
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-on-surface-variant/70 leading-relaxed font-medium mt-1">
                By submitting this inquiry, you agree to connect with Aetheria's advisory team regarding this property and future portfolios matching your interests.
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 bg-accent-blue hover:opacity-95 text-white rounded-full text-[14px] font-semibold transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
