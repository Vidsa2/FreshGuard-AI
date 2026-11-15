import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Scan, 
  Store, 
  Truck, 
  FileCheck2, 
  Cpu, 
  BookOpen, 
  RefreshCw, 
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Building2,
  Sparkles,
  HeartHandshake,
  UserCheck,
  Check
} from 'lucide-react';
import { NavSection, UserProfile, UserRole, AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onSwitchView: (view: AppView) => void;
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  availableItemsCount: number;
  totalAuditCount: number;
  onResetData: () => void;
  onOpenRulesDrawer: () => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: (defaultTab?: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onSwitchUser: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSwitchView,
  activeSection,
  onNavigate,
  availableItemsCount,
  totalAuditCount,
  onResetData,
  onOpenRulesDrawer,
  currentUser,
  onOpenAuthModal,
  onSignOut,
  onSwitchUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: NavSection; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'impact', label: 'Impact Metrics', icon: BarChart3 },
    { id: 'diagnostics', label: 'AI Intake & Scan', icon: Scan },
    { id: 'marketplace', label: 'Surplus Marketplace', icon: Store, badge: availableItemsCount },
    { id: 'coldchain', label: 'Cold-Chain Dispatch', icon: Truck },
    { id: 'audit', label: 'Security Ledger', icon: FileCheck2, badge: totalAuditCount },
    { id: 'hpc-benchmarks', label: 'Engine Benchmarks', icon: Cpu },
  ];

  const handleLinkClick = (id: NavSection, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'donor':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'charity':
        return 'bg-teal-50 text-teal-900 border-teal-200';
      case 'driver':
      case 'volunteer':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'buyer':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200';
      case 'inspector':
        return 'bg-purple-50 text-purple-900 border-purple-200';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'donor': return 'Supermarket Donor';
      case 'charity': return 'Food Bank Charity';
      case 'driver':
      case 'volunteer': return 'Volunteer Driver';
      case 'buyer': return 'Community Buyer';
      case 'inspector': return 'Safety Inspector';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Commercial Enterprise Tagline */}
          <a 
            href="#impact"
            onClick={(e) => handleLinkClick('impact', e)}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#40916c] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  FreshGuard <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Enterprise v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden md:block">
                Enterprise Food Freshness Verification & Zero-Waste Redistribution Network
              </p>
            </div>
          </a>

          {/* Two Dedicated Portals Navigation Switcher (No Overload) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => onSwitchView('donor_portal')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'donor_portal'
                  ? 'bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white shadow-sm ring-1 ring-emerald-400/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Scan className={`w-3.5 h-3.5 ${currentView === 'donor_portal' ? 'text-emerald-300' : 'text-slate-500'}`} />
              <span>🏬 Donor & Supermarket Portal</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchView('marketplace_portal')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'marketplace_portal'
                  ? 'bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white shadow-sm ring-1 ring-emerald-400/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Store className={`w-3.5 h-3.5 ${currentView === 'marketplace_portal' ? 'text-emerald-300' : 'text-slate-500'}`} />
              <span>🤝 Marketplace, Charity & Volunteer</span>
              {availableItemsCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  currentView === 'marketplace_portal' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {availableItemsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Tools & Auth */}
          <div className="flex items-center gap-2">
            
            {/* Live Model Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Model: <strong className="text-emerald-950 font-bold">Online</strong></span>
              <span className="text-emerald-300">•</span>
              <span className="text-[10px] font-mono bg-emerald-200/60 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                11.4ms
              </span>
            </div>

            {/* Safety Rules Knowledge Drawer Button */}
            <button
              onClick={onOpenRulesDrawer}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs"
              title="Inspect FSANZ & HACCP Food Safety Rules"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Rules</span>
            </button>

            {/* Clear Data Button */}
            <button
              onClick={onResetData}
              title="Clear All Batch Records"
              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* User Authentication Status */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-7 h-7 rounded-xl object-cover border border-emerald-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                      {currentUser.fullName.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                      {currentUser.organizationName}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold leading-none">
                      {getRoleLabel(currentUser.role)}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* User Profile Header */}
                    <div className="pb-3 border-b border-slate-100 flex items-center gap-3">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white text-sm font-bold flex items-center justify-center shrink-0">
                          {currentUser.fullName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">
                          {currentUser.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {currentUser.email}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold border ${getRoleBadgeStyle(currentUser.role)}`}>
                            {getRoleLabel(currentUser.role)}
                          </span>
                          {currentUser.badgeNumber && (
                            <span className="text-[9px] font-mono text-slate-400">
                              #{currentUser.badgeNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Role Switcher (1-Click Demo Personas) */}
                    <div className="py-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Switch Persona Role (1-Click):
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => { onSwitchUser('donor'); setUserDropdownOpen(false); }}
                          className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold text-left flex items-center gap-1.5 transition-colors ${
                            currentUser.role === 'donor'
                              ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Store className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="truncate">Donor</span>
                          {currentUser.role === 'donor' && <Check className="w-3 h-3 text-emerald-600 ml-auto" />}
                        </button>

                        <button
                          onClick={() => { onSwitchUser('charity'); setUserDropdownOpen(false); }}
                          className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold text-left flex items-center gap-1.5 transition-colors ${
                            currentUser.role === 'charity'
                              ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                          <span className="truncate">Charity</span>
                          {currentUser.role === 'charity' && <Check className="w-3 h-3 text-teal-600 ml-auto" />}
                        </button>

                        <button
                          onClick={() => { onSwitchUser('driver'); setUserDropdownOpen(false); }}
                          className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold text-left flex items-center gap-1.5 transition-colors ${
                            currentUser.role === 'driver'
                              ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-600" />
                          <span className="truncate">Driver</span>
                          {currentUser.role === 'driver' && <Check className="w-3 h-3 text-amber-600 ml-auto" />}
                        </button>

                        <button
                          onClick={() => { onSwitchUser('inspector'); setUserDropdownOpen(false); }}
                          className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold text-left flex items-center gap-1.5 transition-colors ${
                            currentUser.role === 'inspector'
                              ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span className="truncate">Inspector</span>
                          {currentUser.role === 'inspector' && <Check className="w-3 h-3 text-purple-600 ml-auto" />}
                        </button>
                      </div>
                    </div>

                    {/* Role Jump Shortcuts */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs">
                      {currentUser.role === 'donor' && (
                        <a
                          href="#diagnostics"
                          onClick={(e) => { handleLinkClick('diagnostics', e); setUserDropdownOpen(false); }}
                          className="px-2.5 py-1.5 rounded-lg text-emerald-800 hover:bg-emerald-50 font-semibold flex items-center gap-1.5"
                        >
                          <Scan className="w-3.5 h-3.5" />
                          <span>Go to Intake Hub</span>
                        </a>
                      )}
                      {currentUser.role === 'charity' && (
                        <a
                          href="#marketplace"
                          onClick={(e) => { handleLinkClick('marketplace', e); setUserDropdownOpen(false); }}
                          className="px-2.5 py-1.5 rounded-lg text-teal-800 hover:bg-teal-50 font-semibold flex items-center gap-1.5"
                        >
                          <Store className="w-3.5 h-3.5" />
                          <span>Claim Available Surplus</span>
                        </a>
                      )}
                      {currentUser.role === 'driver' && (
                        <a
                          href="#coldchain"
                          onClick={(e) => { handleLinkClick('coldchain', e); setUserDropdownOpen(false); }}
                          className="px-2.5 py-1.5 rounded-lg text-amber-800 hover:bg-amber-50 font-semibold flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Manage Active Deliveries</span>
                        </a>
                      )}
                      {currentUser.role === 'inspector' && (
                        <a
                          href="#audit"
                          onClick={(e) => { handleLinkClick('audit', e); setUserDropdownOpen(false); }}
                          className="px-2.5 py-1.5 rounded-lg text-purple-800 hover:bg-purple-50 font-semibold flex items-center gap-1.5"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>View Security Ledger</span>
                        </a>
                      )}

                      <button
                        onClick={() => { onSignOut(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5 mt-1 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal('signin')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal('signup')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:opacity-95 shadow-xs transition-all cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 bg-white space-y-2 animate-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={() => { onSwitchView('donor_portal'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                currentView === 'donor_portal'
                  ? 'bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-emerald-300" />
                <span>🏬 Donor & Intake Portal</span>
              </span>
              <span>&rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => { onSwitchView('marketplace_portal'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                currentView === 'marketplace_portal'
                  ? 'bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-300" />
                <span>🤝 Marketplace, Charity & Volunteer</span>
              </span>
              {availableItemsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500 text-slate-950 font-bold">
                  {availableItemsCount}
                </span>
              )}
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
