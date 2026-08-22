import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { 
  Mail, KeyRound, X, Lock, Eye, EyeOff, 
  ArrowLeft, CheckCircle2, RefreshCw, ShieldCheck, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordModal({ isOpen, onClose, onPasswordResetSuccess }) {
  // Step 1: Email, Step 2: OTP, Step 3: New Password, Step 4: Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputsRef = useRef([]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const resetModalState = () => {
    setStep(1);
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setResendTimer(60);
    setCanResend(false);
    setLoading(false);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      setResendTimer(60);
      setCanResend(false);
      toast.success('Verification code sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setResendTimer(60);
      setCanResend(false);
      toast.success('New OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs handling
  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take single character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteArray = pasteData.split('');
      setOtp(pasteArray);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter all 6 digits of the OTP');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp: otpCode });
      setStep(3);
      toast.success('Code verified successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset to New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const otpCode = otp.join('');
      await api.post('/auth/reset-password', {
        email,
        otp: otpCode,
        newPassword
      });
      setStep(4);
      toast.success('Password reset successfully!');
      setTimeout(() => {
        handleClose();
        if (onPasswordResetSuccess) onPasswordResetSuccess();
      }, 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Password Strength Indicator
  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let strength = 0;
    if (newPassword.length >= 6) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Too Weak', 'Weak', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500', 'bg-emerald-600'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop: High quality frosted glass instead of plain black */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-all duration-300"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10 z-10 overflow-hidden"
        >
          {/* Subtle Ambient Gradient Background Blob */}
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-primary-100/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Step 1: Request OTP */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600 shadow-sm">
                  <KeyRound size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password?</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  No worries! Enter your email address and we will send you a 6-digit verification code.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center space-x-1"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Enter 6-digit OTP */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Verify Your Email</h3>
                <p className="text-sm text-slate-500 mt-2">
                  We've sent a 6-digit code to{' '}
                  <span className="font-semibold text-slate-800">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        onFocus={(e) => e.target.select()}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-900 shadow-sm transition-all"
                        required
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Didn't receive code?</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="font-semibold text-primary-600 hover:text-primary-700 transition"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      Resend in <span className="font-bold text-slate-600">{resendTimer}s</span>
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <span>Verify Code</span>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center"
                >
                  <ArrowLeft size={14} className="mr-1" />
                  <span>Use a different email address</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Set New Password */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm">
                  <Lock size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Set New Password</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Create a new, strong password to secure your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 transition-all duration-300 ${
                              strength >= level ? strengthColors[strength] : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-right font-medium text-slate-500">
                        Strength: <span className="font-semibold text-slate-700">{strengthLabels[strength]}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !newPassword || newPassword !== confirmPassword}
                  className="w-full mt-2 py-3.5 px-4 bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 4: Success State */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={44} className="animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Password Changed!</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Your password has been successfully reset. Redirecting you to the sign in page...
              </p>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition"
                >
                  Continue to Sign In
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
