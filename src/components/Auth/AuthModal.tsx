import React, { useState } from 'react';
import { 
  X, 
  Store, 
  HeartHandshake, 
  Truck, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { DEMO_USERS } from '../../utils/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  initialTab?: 'signin' | 'signup';
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialTab = 'signin',
  promptMessage
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('metromart@freshguard.io');
  const [signInPassword, setSignInPassword] = useState('password123');

  // Sign Up Form State
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');

  if (!isOpen) return null;

  const handleDemoLogin = (role: UserRole) => {
    const demoUser = DEMO_USERS[role] || DEMO_USERS['donor'];
    if (demoUser) {
      onLogin(demoUser);
      onClose();
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });
      if (res.ok) {
        const dbUser = await res.json();
        onLogin({
          id: dbUser.id,
          fullName: dbUser.full_name,
          email: dbUser.email,
          role: dbUser.role as any,
          organizationName: dbUser.org_name,
        });
        onClose();
        return;
      }
    } catch {
      // Backend offline, fallback to mock demo user
    }

    const existing = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === signInEmail.toLowerCase());
    if (existing) {
      onLogin(existing);
    } else {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        fullName: signInEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        email: signInEmail,
        role: 'donor',
        organizationName: 'Enterprise Partner Org',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        location: 'Metro Distribution Zone',
        badgeNumber: `AUTH-${Math.floor(1000 + Math.random() * 9000)}`
      };
      onLogin(newUser);
    }
    onClose();
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: fullName || 'New Enterprise Member',
      email: email || 'user@enterprise.org',
      role: selectedRole,
      organizationName: orgName || 'Registered Enterprise Partner',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      location: 'Regional Hub',
      badgeNumber: `REG-${Math.floor(1000 + Math.random() * 9000)}`
    };

    try {
      await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: newUser.fullName,
          org_name: newUser.organizationName,
          email: newUser.email,
          password: password || 'password123',
          role: selectedRole,
        }),
      });
    } catch {
      // Fallback locally
    }

    onLogin(newUser);
    onClose();
  };

  const rolesConfig: { role: UserRole; title: string; subtitle: string; icon: React.ElementType; color: string }[] = [
    {
      role: 'donor',
      title: 'Supermarket / Store Donor',
      subtitle: 'Upload food batches, verify AI freshness & list surplus',
      icon: Store,
      color: 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-emerald-500'
    },
    {
      role: 'charity',
      title: 'Charity / Food Bank Shelter',
      subtitle: 'Claim verified safe food batches for community meal prep',
      icon: HeartHandshake,
      color: 'border-teal-500 bg-teal-50/70 text-teal-900 ring-teal-500'
    },
    {
      role: 'driver',
      title: 'Volunteer Delivery Driver',
      subtitle: 'Accept cold-chain transport tasks with IoT temperature probes',
      icon: Truck,
      color: 'border-amber-500 bg-amber-50/70 text-amber-900 ring-amber-500'
    },
    {
      role: 'buyer',
      title: 'Community Flash Sale Buyer',
      subtitle: 'Reserve and purchase discounted fresh produce for in-store pickup',
      icon: ShoppingBag,
      color: 'border-indigo-500 bg-indigo-50/70 text-indigo-900 ring-indigo-500'
    },
    {
      role: 'inspector',
      title: 'Food Safety Inspector',
      subtitle: 'Inspect cryptographic SHA-256 ledgers & FSANZ audit proof',
      icon: ShieldCheck,
      color: 'border-purple-500 bg-purple-50/70 text-purple-900 ring-purple-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200/90 relative overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#40916c] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 ring-4 ring-emerald-500/10 mb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            FreshGuard <span className="text-emerald-700">Enterprise</span> Access
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Zero-Waste Redistribution Mesh • Food Safety & Chain-of-Custody Verification
          </p>
        </div>

        {/* Gated Action Prompt Message */}
        {promptMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{promptMessage}</span>
          </div>
        )}

        {/* 1-Click Demo Profiles Bar */}
        <div className="mb-6 p-3 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-slate-50 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-950 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Instant 1-Click Demo Personas:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('donor')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200 text-slate-800 text-[10px] font-bold transition-all flex flex-col items-center gap-1 shadow-2xs hover:scale-102"
            >
              <Store className="w-3.5 h-3.5 text-emerald-700" />
              <span>Donor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('charity')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-teal-100/60 border border-teal-200 text-slate-800 text-[10px] font-bold transition-all flex flex-col items-center gap-1 shadow-2xs hover:scale-102"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-teal-700" />
              <span>Charity</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('driver')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-slate-800 text-[10px] font-bold transition-all flex flex-col items-center gap-1 shadow-2xs hover:scale-102"
            >
              <Truck className="w-3.5 h-3.5 text-amber-700" />
              <span>Volunteer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('buyer')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-indigo-100/60 border border-indigo-200 text-slate-800 text-[10px] font-bold transition-all flex flex-col items-center gap-1 shadow-2xs hover:scale-102"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-700" />
              <span>Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('inspector')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-purple-100/60 border border-purple-200 text-slate-800 text-[10px] font-bold transition-all flex flex-col items-center gap-1 shadow-2xs hover:scale-102"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span>Inspector</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 border border-slate-200">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'signin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In to Account
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Enterprise Account
          </button>
        </div>

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="e.g. sarah.j@metromart.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a href="#reset" onClick={(e) => e.preventDefault()} className="text-[11px] text-emerald-700 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span>Keep me signed in</span>
              </label>
              <span className="text-[11px] text-slate-400">256-bit TLS Encrypted</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] hover:opacity-95 shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business / Org Name
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Metro Mart #104"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contact@organization.org"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password (8+ characters)"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 text-slate-800"
                />
              </div>
            </div>

            {/* Role Selection Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Your Network Role:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rolesConfig.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.role;
                  return (
                    <button
                      type="button"
                      key={r.role}
                      onClick={() => setSelectedRole(r.role)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? `${r.color} ring-2 shadow-xs`
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 shrink-0 text-emerald-800" />
                        <span className="text-xs font-bold truncate">{r.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 leading-tight">
                        {r.subtitle}
                      </p>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 absolute top-2 right-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:opacity-95 shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              <span>Create Account & Join Network</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

