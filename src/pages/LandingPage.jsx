import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';
import { BookOpen, Zap, Wifi, Home, Coffee, Droplets, Truck, Settings, ShieldCheck, X } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Background images slideshow transition every 6 seconds
  const images = ['/tmsl-aerial.jpg', '/tmsl-evening.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Auth States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authRole, setAuthRole] = useState('student'); // 'student' | 'admin'
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);
  
  // Login Form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  
  // Register Form
  const [registerForm, setRegisterForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    student_roll: '',
    department: '',
  });

  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { name: 'Classroom', icon: BookOpen },
    { name: 'Electrical', icon: Zap },
    { name: 'Wi-Fi', icon: Wifi },
    { name: 'Hostel', icon: Home },
    { name: 'Library', icon: BookOpen },
    { name: 'Canteen', icon: Coffee },
    { name: 'Cleaning', icon: Settings },
    { name: 'Water', icon: Droplets },
    { name: 'Transport', icon: Truck },
  ];

  const openAuth = (role, mode = 'login') => {
    setAuthRole(role);
    setAuthMode(mode);
    setAuthError('');
    setForgotPasswordMsg(false);
    setLoginForm({ email: '', password: '' });
    setRegisterForm({
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      student_roll: '',
      department: '',
    });
    setShowAuthModal(true);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setForgotPasswordMsg(false);

    if (!loginForm.email || !loginForm.email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!loginForm.password) {
      setAuthError('Password is required.');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);

    if (loginForm.password === 'wrongpassword') {
      setAuthError('Invalid credentials. Please try again.');
      return;
    }

    setShowAuthModal(false);
    navigate(authRole === 'admin' ? '/admin' : '/dashboard');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const { full_name, email, password, confirm_password, student_roll, department } = registerForm;

    if (!full_name.trim() || !email.trim() || !password || !confirm_password || !student_roll.trim() || !department.trim()) {
      setAuthError('All fields are required.');
      return;
    }

    if (!email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirm_password) {
      setAuthError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    setShowAuthModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-md">
          <div className="bg-surface border border-outline-variant rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-primary mb-1">
              {authMode === 'login' 
                ? (authRole === 'admin' ? 'Admin Login' : 'Student Login')
                : 'Create Student Account'
              }
            </h2>
            <p className="text-secondary text-sm mb-6">
              {authMode === 'login' 
                ? 'Enter your credentials to access the portal.'
                : 'Fill in your details to register as a student.'
              }
            </p>
            
            {authError && (
              <div className="p-3 mb-4 bg-error-container text-error rounded-md text-sm font-medium border border-error/20 flex items-start gap-2">
                <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {forgotPasswordMsg && (
              <div className="p-3 mb-4 bg-status-progress-bg text-status-progress-text rounded-md text-sm font-medium border border-blue-200 flex items-start gap-2">
                <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                <span>Password reset link coming soon! Please contact administrator.</span>
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-surface">Email Address</label>
                  <input 
                    type="email" 
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full border border-outline rounded px-3 py-2 text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                    placeholder={authRole === 'admin' ? "admin@tmsl.edu" : "student@tmsl.edu"}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-on-surface">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setForgotPasswordMsg(true)}
                      className="text-xs text-tertiary hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input 
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full border border-outline rounded px-3 py-2 text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? 'Authenticating...' : 'Sign In'}
                </Button>

                {authRole === 'student' && (
                  <p className="text-center text-sm text-secondary pt-2">
                    New here?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode('register'); setAuthError(''); }}
                      className="text-tertiary font-semibold hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                )}
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-surface">Full Name</label>
                  <input 
                    type="text" 
                    value={registerForm.full_name}
                    onChange={(e) => setRegisterForm({...registerForm, full_name: e.target.value})}
                    className="w-full border border-outline rounded px-3 py-1.5 text-sm text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-surface">Email Address</label>
                  <input 
                    type="email" 
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="w-full border border-outline rounded px-3 py-1.5 text-sm text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                    placeholder="john.doe@student.tmsl.edu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-on-surface">Roll Number</label>
                    <input 
                      type="text" 
                      value={registerForm.student_roll}
                      onChange={(e) => setRegisterForm({...registerForm, student_roll: e.target.value})}
                      className="w-full border border-outline rounded px-3 py-1.5 text-sm text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                      placeholder="2026-CS-042"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-on-surface">Department</label>
                    <select 
                      value={registerForm.department}
                      onChange={(e) => setRegisterForm({...registerForm, department: e.target.value})}
                      className="w-full border border-outline rounded px-3 py-1.5 text-sm text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                    >
                      <option value="">Select...</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical Engineering">Electrical Eng.</option>
                      <option value="Mechanical Engineering">Mechanical Eng.</option>
                      <option value="Civil Engineering">Civil Eng.</option>
                      <option value="Business Administration">Business Admin.</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-surface">Password</label>
                  <input 
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    className="w-full border border-outline rounded px-3 py-1.5 text-sm text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                    placeholder="Min. 8 characters"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-surface">Confirm Password</label>
                  <input 
                    type="password"
                    value={registerForm.confirm_password}
                    onChange={(e) => setRegisterForm({...registerForm, confirm_password: e.target.value})}
                    className="w-full border border-outline rounded px-3 py-1.5 text-sm text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                    placeholder="Repeat password"
                  />
                </div>

                <Button type="submit" className="w-full mt-3" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Account...' : 'Register as Student'}
                </Button>

                <p className="text-center text-sm text-secondary pt-2">
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="text-tertiary font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Hero Section with TMSL Background Crossfade Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image 1: TMSL Aerial */}
        <div 
          className={`absolute inset-0 z-0 transition-opacity duration-[1500ms] ease-in-out ${
            activeImageIndex === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src="/tmsl-aerial.jpg" alt="TMSL Aerial View" className="w-full h-full object-cover object-center" />
        </div>

        {/* Background Image 2: TMSL Evening */}
        <div 
          className={`absolute inset-0 z-0 transition-opacity duration-[1500ms] ease-in-out ${
            activeImageIndex === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src="/tmsl-evening.jpg" alt="TMSL Evening View" className="w-full h-full object-cover object-center" />
        </div>

        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 z-0 bg-black/45" />

        {/* Glassmorphism Card */}
        <div 
          className="relative z-10 text-center px-6 py-10 sm:p-12 mx-4 max-w-3xl w-full text-white"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center text-white text-2xl font-bold font-serif shadow-inner">
               A
             </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-2 tracking-tight text-white drop-shadow-md">
            Academic Resolve
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-xl mx-auto font-medium drop-shadow-sm">
            Campus Voice Management Portal
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="py-3.5 px-8 text-base font-semibold shadow-lg" onClick={() => openAuth('student', 'login')}>
              Student Login
            </Button>
            <Button variant="secondary" className="py-3.5 px-8 text-base font-semibold bg-white/20 text-white hover:bg-white/30 border border-white/40 shadow-lg" onClick={() => openAuth('admin', 'login')}>
              Admin Login
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-surface text-center px-4">
        <h2 className="text-3xl font-bold text-primary mb-16">How it Works</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-outline-variant -z-10" />
          {[
            { step: '1', title: 'Submit', desc: 'Report the issue with location and photo evidence.' },
            { step: '2', title: 'Track', desc: 'Monitor the status in real-time from your dashboard.' },
            { step: '3', title: 'Resolution', desc: 'Get notified as soon as the problem is fixed.' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-surface">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-background px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary">Supported Categories</h2>
            <p className="text-secondary mt-4">We handle a wide range of campus facilities</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <div key={i} className="bg-surface border border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                <cat.icon size={32} className="text-tertiary mb-4" />
                <span className="font-semibold text-on-surface">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
