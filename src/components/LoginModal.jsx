import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccess('Account created! Check your email for confirmation, then sign in.');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
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
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
      >
        {/* Header accent bar */}
        <div className="h-1 bg-gradient-to-r from-accent-blue via-blue-400 to-indigo-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8 pt-7">
          {/* Icon + Title */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <h2 className="text-[22px] font-bold text-primary tracking-tight">
              {isSignUp ? 'Create Agent Account' : 'Agent Portal'}
            </h2>
            <p className="text-[14px] text-on-surface-variant mt-1 font-medium">
              {isSignUp
                ? 'Register for broker console access'
                : 'Sign in to access the Broker Console'
              }
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px] font-medium">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-[13px] font-medium">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-on-surface-variant">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@aetheria.com"
                required
                className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full h-11 px-4 pr-11 bg-surface-offwhite border border-border-strong rounded-xl text-[15px] text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 bg-gradient-to-r from-accent-blue to-indigo-600 hover:opacity-90 text-white rounded-xl text-[14px] font-semibold transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-accent-blue/25"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isSignUp ? 'Creating...' : 'Signing in...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-accent-blue text-[13px] font-semibold hover:underline cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Register'}
            </button>
          </div>

          {/* Security badge */}
          <div className="mt-5 pt-5 border-t border-border-subtle flex items-center justify-center gap-2 text-on-surface-variant">
            <ShieldCheck size={14} />
            <span className="text-[12px] font-medium">
              Secured with end-to-end encryption
            </span>
          </div>
        </div>
      </div>

      {/* Modal animation keyframes */}
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
      `}</style>
    </div>
  );
}
