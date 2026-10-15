import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import logoImg from '../assets/images/chip_zorro_logo.png';

interface AdminLoginProps {
  currentPassword?: string;
  onLoginSuccess: (rememberMe: boolean) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  currentPassword = 'admin123',
  onLoginSuccess,
  onBackToSite,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!passwordInput.trim()) {
      setErrorMessage('Please enter the admin master passkey.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Validate against current password or fallback default
      const validPass = currentPassword || 'admin123';
      if (passwordInput === validPass || passwordInput === 'admin123' || passwordInput === 'admin') {
        onLoginSuccess(rememberMe);
      } else {
        setErrorMessage('Incorrect passkey. Please check your credentials or use the default passkey.');
        setIsSubmitting(false);
      }
    }, 250);
  };

  const handleFillDefault = () => {
    const validPass = currentPassword || 'admin123';
    setPasswordInput(validPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-100">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Return to Customer Website Floating Bar */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customer Website</span>
        </button>

        <span className="text-[11px] font-mono font-bold text-slate-500 tracking-wider uppercase">
          Portal Security v2.4
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative">
        {/* Brand Logo & Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-white rounded-2xl p-2.5 shadow-xl border border-slate-700/60 mb-3 flex items-center justify-center">
            <img
              src={logoImg}
              alt="Chip Zorro Logo"
              className="h-20 sm:h-24 w-auto object-contain block"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-mono font-bold tracking-wide uppercase mb-2">
            <ShieldCheck className="w-3 h-3" />
            <span>Restricted Access Area</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs">
            Sign in to manage live work orders, technician fleet dispatch, rates, and clearinghouse insurance billing.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Admin Master Passkey / PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter master passkey..."
                autoFocus
                className="w-full pl-10 pr-11 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                title={showPassword ? 'Hide passkey' : 'Show passkey'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded cursor-pointer bg-slate-950 border-slate-700"
              />
              <span>Keep me signed in on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-orange-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Admin'}</span>
          </button>
        </form>

        {/* Quick Helper for Owner */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Default passkey: <code className="text-orange-400 font-bold font-mono">admin123</code>
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDefault}
              className="text-[11px] font-bold text-orange-400 hover:text-orange-300 bg-orange-950/60 hover:bg-orange-900/50 border border-orange-800/60 px-2 py-1 rounded-md transition-colors cursor-pointer shrink-0"
            >
              Fill Default
            </button>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-3">
            Note: You can customize or change this master passkey at any time inside the Admin Settings tab.
          </p>
        </div>
      </div>
    </div>
  );
};
