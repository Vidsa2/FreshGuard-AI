import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  User,
  Lock,
  Sun,
  Moon,
  Coins
} from 'lucide-react';

import { Sidebar } from './components/Dashboard/Sidebar';
import { AccountsModule } from './components/Dashboard/AccountsModule';
import { SellModule } from './components/Dashboard/SellModule';
import { BuyMarketplaceModule } from './components/Dashboard/BuyMarketplaceModule';
import { ExpiryTrackerModule } from './components/Dashboard/ExpiryTrackerModule';
import { MongoConfigModal } from './components/Dashboard/MongoConfigModal';
import { AuthModal } from './components/Auth/AuthModal';
import { AboutModal } from './components/AboutModal';
import { RegulatoryDrawer } from './components/RegulatoryDrawer';
import { Toast, ToastMessage } from './components/Toast';
import { UserMenuDropdown } from './components/Header/UserMenuDropdown';
import { Footer } from './components/Footer';

import { 
  DashboardModule, 
  FoodBatch, 
  UserProfile, 
  MongoDbStatus,
  RegisteredAccount 
} from './types';
import { 
  fetchMongoDbStatus, 
  fetchDbFoodItems, 
  fetchRegisteredAccounts 
} from './utils/api';

const DEFAULT_USER: UserProfile = {
  id: 'usr_donor_001',
  fullName: 'Marcus Vance',
  organizationName: 'Metro Mart Supermarket',
  email: 'marcus.vance@metromart.com',
  role: 'donor',
  businessLicense: 'RET-NSW-2024-9844',
  storeAddress: '45 Market Street, Sydney NSW 2000',
  coldStorageCapacity: '4,500 L (-22°C to +4°C)',
};

export function App() {
  // Current active Left Sidebar Module
  const [currentModule, setCurrentModule] = useState<DashboardModule>('accounts');

  // Master Food Inventory State (Persisted in Database)
  const [batches, setBatches] = useState<FoodBatch[]>([]);
  const [allAccounts, setAllAccounts] = useState<RegisteredAccount[]>([]);
  const [accountsCount, setAccountsCount] = useState<number>(2);

  // Active Authenticated Persona (Defaults to Metro Mart Store Donor)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('freshguard_active_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Theme Mode State (Dark Shaded Theme by default)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('freshguard_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply dark theme class to document element
  useEffect(() => {
    try {
      localStorage.setItem('freshguard_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Database Connection Telemetry State
  const [dbStatus, setDbStatus] = useState<MongoDbStatus | null>(null);

  // Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMongoModalOpen, setIsMongoModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isRegulatoryDrawerOpen, setIsRegulatoryDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync active user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('freshguard_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('freshguard_active_user');
      // If user logs out and is on a locked page, redirect to auth gateway
      if (currentModule !== 'accounts') {
        setCurrentModule('accounts');
      }
    }
  }, [currentUser]);

  // Load database telemetry & products on mount
  useEffect(() => {
    const initData = async () => {
      // 1. Fetch DB Status
      const status = await fetchMongoDbStatus();
      setDbStatus(status);

      // 2. Fetch Products
      const items = await fetchDbFoodItems();
      if (items && items.length > 0) {
        setBatches(items);
      }

      // 3. Fetch Accounts
      const accounts = await fetchRegisteredAccounts();
      if (accounts && accounts.length > 0) {
        setAllAccounts(accounts);
        setAccountsCount(accounts.length);
      }
    };

    initData();
  }, []);

  // Compute urgent critical items count (< 12 hours)
  const criticalExpiryCount = batches.filter((b) => {
    const now = new Date();
    const exp = new Date(b.expiryDate);
    const diffHours = (exp.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 12;
  }).length;

  // Sign out handler
  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentModule('accounts');
    addToast('info', 'Signed Out', 'Please sign in or register to access organization operations.');
  };

  // When a new batch is created in SellModule
  const handleBatchPublished = (newBatch: FoodBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    addToast('success', 'Product Published', `"${newBatch.name}" is now live in the marketplace.`);
  };

  // When an order is completed in Marketplace
  const handleOrderCompleted = (updatedBatch: FoodBatch) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === updatedBatch.id ? updatedBatch : b))
    );
    addToast('success', 'Order Confirmed', `Transaction for "${updatedBatch.name}" recorded successfully.`);
  };

  // Human-readable titles for breadcrumbs
  const moduleTitles: Record<DashboardModule, { title: string }> = {
    accounts: {
      title: currentUser ? 'My Organization Profile' : 'Auth & Sign In',
    },
    sell: {
      title: 'Sell Produce & Intake',
    },
    buy: {
      title: 'Food Marketplace',
    },
    expiry: {
      title: 'Shelf-Life Monitor',
    },
  };

  // Module navigation interceptor for unauthenticated users
  const handleSelectModule = (target: DashboardModule) => {
    if (!currentUser && target !== 'accounts') {
      setCurrentModule('accounts');
      addToast('warning', 'Access Restricted', 'Please sign in or register to access this operations portal.');
      return;
    }
    setCurrentModule(target);
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-800'} antialiased font-sans overflow-x-hidden`}>
      {/* 1. Fixed Left Sidebar */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        currentUser={currentUser}
        onOpenAuth={() => setCurrentModule('accounts')}
        onSignOut={handleSignOut}
        onOpenRoleSwitcher={() => setCurrentModule('accounts')}
        dbStatus={dbStatus}
        onOpenDbConfig={() => setIsMongoModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-gray-500">FreshGuard</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-900">{moduleTitles[currentModule].title}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>LKR (Rs.)</span>
            </div>

            {/* Dark Shaded / Light Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
              title={`Toggle ${theme === 'dark' ? 'Light Mode' : 'Dark Shaded Theme'}`}
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Dark Shaded</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden md:inline">Light</span>
                </>
              )}
            </button>

            {/* Standard User Avatar & Switcher Dropdown */}
            <UserMenuDropdown
              currentUser={currentUser}
              onSelectUser={(u) => {
                setCurrentUser(u);
                if (u) {
                  addToast('info', 'Account Switched', `Logged in as ${u.organizationName}.`);
                }
              }}
              onOpenAuth={() => setCurrentModule('accounts')}
              onSignOut={handleSignOut}
              onAddNewAccount={() => setCurrentModule('accounts')}
              onNavigateToOrg={() => setCurrentModule('accounts')}
            />
          </div>
        </header>

        {/* Dynamic Module Content View */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {currentModule === 'accounts' && (
            <AccountsModule
              currentUser={currentUser}
              onSelectUser={(u) => {
                setCurrentUser(u);
                if (u) {
                  addToast('success', 'Authenticated', `Welcome back, ${u.fullName}!`);
                }
              }}
              onAccountCreated={(newAcc) => {
                setAllAccounts((prev) => [newAcc, ...prev]);
                setAccountsCount((c) => c + 1);
                addToast('success', 'Account Registered', `${newAcc.org_name} registered successfully.`);
              }}
              onSignOut={handleSignOut}
              batches={batches}
              onNavigateToSell={() => setCurrentModule('sell')}
              onNavigateToBuy={() => setCurrentModule('buy')}
            />
          )}

          {currentModule === 'sell' && (
            !currentUser ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm max-w-md mx-auto my-12 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Sign In Required</h3>
                <p className="text-xs text-gray-500">
                  Please sign in with your verified supermarket donor account to intake and publish food items.
                </p>
                <button
                  onClick={() => setCurrentModule('accounts')}
                  className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Go to Sign In
                </button>
              </div>
            ) : currentUser.role !== 'donor' ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm max-w-md mx-auto my-12 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Intake Restricted to Supermarket Donors</h3>
                <p className="text-xs text-gray-500">
                  Only registered Supermarket Donors can intake and list food items. Charities and retail buyers access surplus through the Food Marketplace.
                </p>
                <button
                  onClick={() => setCurrentModule('buy')}
                  className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Go to Food Marketplace
                </button>
              </div>
            ) : (
              <SellModule
                currentUser={currentUser}
                onOpenAuth={() => setCurrentModule('accounts')}
                onBatchPublished={handleBatchPublished}
                onSwitchToDonorPersona={() => {}}
              />
            )
          )}

          {currentModule === 'buy' && (
            currentUser ? (
              <BuyMarketplaceModule
                batches={batches}
                currentUser={currentUser}
                onOpenAuth={() => setCurrentModule('accounts')}
                onOrderCompleted={handleOrderCompleted}
              />
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm max-w-md mx-auto my-12 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Sign In Required</h3>
                <p className="text-xs text-gray-500">
                  Please sign in or register to browse marketplace listings and claim food donations.
                </p>
                <button
                  onClick={() => setCurrentModule('accounts')}
                  className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-xs font-semibold"
                >
                  Go to Sign In
                </button>
              </div>
            )
          )}

          {currentModule === 'expiry' && (
            currentUser ? (
              <ExpiryTrackerModule
                batches={batches}
                onNavigateToSell={() => setCurrentModule('sell')}
                onNavigateToBuy={() => setCurrentModule('buy')}
              />
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm max-w-md mx-auto my-12 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Sign In Required</h3>
                <p className="text-xs text-gray-500">
                  Please sign in to view real-time shelf-life monitors and cold-chain temperature logs.
                </p>
                <button
                  onClick={() => setCurrentModule('accounts')}
                  className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-xs font-semibold"
                >
                  Go to Sign In
                </button>
              </div>
            )
          )}
        </main>

        {/* 3. Professional Enterprise Footer */}
        <Footer />
      </div>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(user: UserProfile) => {
          setCurrentUser(user);
          addToast('success', 'Authenticated', `Welcome back, ${user.fullName}!`);
        }}
      />

      <MongoConfigModal
        isOpen={isMongoModalOpen}
        onClose={() => setIsMongoModalOpen(false)}
        dbStatus={dbStatus}
        onStatusUpdated={(newStatus) => {
          setDbStatus(newStatus);
          addToast('success', 'MongoDB Connected', `Persistence engine set to: ${newStatus.mode}`);
        }}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <RegulatoryDrawer
        isOpen={isRegulatoryDrawerOpen}
        onClose={() => setIsRegulatoryDrawerOpen(false)}
      />

      {/* Toast Notifications Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
