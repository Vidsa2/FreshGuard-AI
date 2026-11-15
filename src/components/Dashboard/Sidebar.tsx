import React from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Tag, 
  ShoppingCart, 
  Clock, 
  Database, 
  LogIn, 
  LogOut,
  Lock,
  ChevronRight
} from 'lucide-react';
import { DashboardModule, UserProfile, MongoDbStatus } from '../../types';

interface SidebarProps {
  currentModule: DashboardModule;
  onSelectModule: (module: DashboardModule) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenRoleSwitcher: () => void;
  dbStatus: MongoDbStatus | null;
  onOpenDbConfig: () => void;
}

export function Sidebar({
  currentModule,
  onSelectModule,
  currentUser,
  onOpenAuth,
  onSignOut,
  dbStatus,
  onOpenDbConfig,
}: SidebarProps) {
  const navItems = [
    {
      id: 'accounts' as DashboardModule,
      title: currentUser ? 'My Organization' : 'Auth & Sign In',
      icon: Building2,
      requiresAuth: false,
    },
    {
      id: 'sell' as DashboardModule,
      title: 'Sell Produce & Intake',
      icon: Tag,
      requiresAuth: true,
    },
    {
      id: 'buy' as DashboardModule,
      title: 'Food Marketplace',
      icon: ShoppingCart,
      requiresAuth: true,
    },
    {
      id: 'expiry' as DashboardModule,
      title: 'Shelf-Life Monitor',
      icon: Clock,
      requiresAuth: true,
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.requiresAuth && !currentUser) {
      // Redirect to Auth page
      onSelectModule('accounts');
      return;
    }
    onSelectModule(item.id);
  };

  return (
    <aside className="w-[240px] min-w-[240px] max-w-[240px] h-screen sticky top-0 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
            FreshGuard
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PRO
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">Food Safety & Redistribution</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          const isAuthLocked = item.requiresAuth && !currentUser;
          const isRoleLocked = item.id === 'sell' && currentUser && currentUser.role !== 'donor';

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => handleNavClick(item)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : isRoleLocked
                      ? 'text-slate-500 hover:text-slate-400 hover:bg-slate-800/30 cursor-pointer'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : isRoleLocked ? 'text-slate-600' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <span className="block truncate">{item.title}</span>
                    {isRoleLocked && (
                      <span className="block text-[9px] text-amber-500/80 truncate font-normal">
                        Donors Only
                      </span>
                    )}
                  </div>
                </div>
                {isAuthLocked && (
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                )}
                {isRoleLocked && (
                  <span title="Intake restricted to Supermarket Donors">
                    <Lock className="w-3 h-3 text-amber-500/70 shrink-0" />
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Understated Bottom System Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <button
          onClick={onOpenDbConfig}
          className="w-full px-2.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left transition flex items-center justify-between group"
          title="Database connectivity"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-300">System Connected</p>
              <p className="text-[10px] text-slate-400 truncate">Cloud Data Sync Active</p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform" />
        </button>

        {currentUser ? (
          <button
            onClick={onSignOut}
            className="w-full px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/40 transition flex items-center justify-between"
          >
            <span className="truncate">Sign Out ({currentUser.organizationName})</span>
            <LogOut className="w-3.5 h-3.5 shrink-0" />
          </button>
        ) : (
          <button
            onClick={() => onSelectModule('accounts')}
            className="w-full px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:bg-slate-800/40 transition flex items-center justify-between"
          >
            <span>Sign In to Organization</span>
            <LogIn className="w-3.5 h-3.5 shrink-0" />
          </button>
        )}
      </div>
    </aside>
  );
}
