import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { setIsLoggedIn, addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const commitLogin = () => {
    setIsLoggedIn(true);

    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 0);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);

    // Simulated Authentication
    setTimeout(() => {
      setLoading(false);
      commitLogin();
      addToast('Welcome back to NoteSphere!', 'success');
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      commitLogin();
      addToast('Logged in with Google account.', 'success');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">

      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >

          {/* Logo */}
          <div
            className="flex items-center gap-2 mb-8 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-lg">
              N
            </div>

            <span className="font-heading text-xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              NoteSphere
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold font-heading mb-2 dark:text-white">
            Welcome back
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Enter your credentials to access study resources.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 text-xs font-semibold mb-6">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />

                <input
                  type="email"
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 outline-none transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs font-semibold pt-1">

              <label className="flex items-center gap-2 text-slate-500 hover:text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-500/25"
                />

                <span>Remember me</span>
              </label>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  addToast(
                    'Password reset link simulated sent to email.',
                    'info'
                  );
                }}
                className="text-sky-500 hover:text-sky-600"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:scale-[1.01] transition-transform flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-slate-300 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />

            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              or continue with
            </span>

            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-colors"
          >

            {/* Google Icon */}
            <span className="flex items-center justify-center">
              <img
                src="/google-small.svg"
                alt="Google"
                className="w-5 h-5 object-contain"
              />
            </span>

            <span>Continue with Google</span>
          </button>

          {/* Signup Link */}
          <p className="text-xs text-center text-slate-500 mt-8 font-semibold">
            New to NoteSphere?{' '}
            <Link
              to="/signup"
              className="text-sky-500 hover:text-sky-600"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden premium-gradient p-12">

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/40 via-indigo-600/20 to-purple-600/40 backdrop-blur-3xl" />

        {/* Decorative Glow */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-white/5 blur-2xl animate-pulse" />

        <div className="max-w-md text-white text-center relative z-10">

          <BookOpen className="h-16 w-16 mx-auto mb-6 opacity-80" />

          <h2 className="text-3xl font-extrabold font-heading mb-4 leading-tight">
            Join the smart academic circle
          </h2>

          <p className="text-sm text-white/80 leading-relaxed">
            NoteSphere helps you sync notebooks, watch playlist guides,
            study with group colleagues, and get ready for tests.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <span className="block text-xl font-bold">15K+</span>

              <span className="block text-[9px] text-white/60 tracking-wider font-semibold uppercase mt-0.5">
                Students
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <span className="block text-xl font-bold">25K+</span>

              <span className="block text-[9px] text-white/60 tracking-wider font-semibold uppercase mt-0.5">
                Resources
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <span className="block text-xl font-bold">4.9★</span>

              <span className="block text-[9px] text-white/60 tracking-wider font-semibold uppercase mt-0.5">
                Rating
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;