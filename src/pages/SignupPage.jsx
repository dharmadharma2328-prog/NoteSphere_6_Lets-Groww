import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, GraduationCap, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SignupPage = () => {
  const { setIsLoggedIn, addToast, isLoggedIn } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState('Student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Password strength calc
  const getPasswordStrength = () => {
    if (!password) return { text: '', color: 'bg-slate-200', score: 0 };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score === 1) return { text: 'Weak', color: 'bg-red-500', score: 25 };
    if (score === 2) return { text: 'Fair', color: 'bg-amber-500', score: 50 };
    if (score === 3) return { text: 'Good', color: 'bg-sky-500', score: 75 };
    return { text: 'Strong', color: 'bg-emerald-500', score: 100 };
  };

  const strength = getPasswordStrength();

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !college || !password || !confirmPassword) {
      setError('Please fill in all input fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);

    // Simulate creation
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleModalSuccess = () => {
    setShowSuccessModal(false);
    setIsLoggedIn(true);
    addToast('Account created successfully! Welcome to NoteSphere.', 'success');
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 relative">
      
      {/* Left Column: Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* Logo Heading */}
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-lg">
              N
            </div>
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">NoteSphere</span>
          </div>

          <h2 className="text-2xl font-bold font-heading mb-2 dark:text-white">Create an account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Join thousands of students on NoteSphere today.</p>

          {/* Validation Alert */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 text-xs font-semibold mb-5">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="john@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">College Name</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="State University"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none text-slate-600 dark:text-slate-350"
                >
                  <option value="Student">Student (Upload & Browse)</option>
                  <option value="Admin">Administrator (Manage Files)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                    <span>Password Strength:</span>
                    <span className={
                      strength.text === 'Weak' ? 'text-red-500' :
                      strength.text === 'Fair' ? 'text-amber-500' :
                      strength.text === 'Good' ? 'text-sky-500' :
                      'text-emerald-500'
                    }>{strength.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${strength.color} transition-all duration-350`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <label className="flex items-start gap-2.5 text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer pt-1">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-sky-500 focus:ring-sky-500/25" 
              />
              <span className="leading-tight font-medium">I agree to NoteSphere's Terms of Use, Privacy Policy, and fair usage guidelines.</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:scale-[1.01] transition-transform flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-slate-300 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Social */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          <button 
            type="button"
            onClick={() => {
              setIsLoggedIn(true);
              addToast('Account created successfully! Welcome to NoteSphere.', 'success');
            }}
            className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span className="flex items-center justify-center" style={{ width: 20, height: 20, minWidth: 20, minHeight: 20 }}>
              <img src="/google-small.svg" alt="Google" width="20" height="20" style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', objectFit: 'contain' }} />
            </span>
            <span>Sign Up with Google</span>
          </button>

          <p className="text-xs text-center text-slate-500 mt-6 font-semibold">
            Already have an account? <Link to="/login" className="text-sky-500 hover:text-sky-600">Sign In</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Column (Illustration panels) */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden premium-gradient p-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/40 via-indigo-600/20 to-purple-600/40 backdrop-blur-3xl" />
        <div className="max-w-md text-white text-center relative z-10">
          <Sparkles className="h-16 w-16 mx-auto mb-6 text-sky-300 animate-pulse" />
          <h2 className="text-3xl font-extrabold font-heading mb-4 leading-tight">Unlock premium study assets</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Create groups, track focus cycles, catalog cheat sheets, and unlock badges as you collaborate with classmates.
          </p>
        </div>
      </div>

      {/* Success Modal Popup */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center border border-slate-200/50 dark:border-slate-800/50 shadow-2xl mx-4"
            >
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-2 dark:text-white">Registration Successful!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Your account is ready. Welcome to the ultimate student academic resource platform.
              </p>
              <button
                onClick={handleModalSuccess}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform"
              >
                Go to Workspace
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SignupPage;
