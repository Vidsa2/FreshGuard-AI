import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  LogOut, 
  Building2, 
  ShieldCheck, 
  Lock,
  User
} from 'lucide-react';
import { UserProfile, RegisteredAccount } from '../../types';

interface UserMenuDropdownProps {
  currentUser: UserProfile | null;
  accounts?: RegisteredAccount[];
  onSelectUser: (user: UserProfile | null) => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onAddNewAccount?: () => void;
  onNavigateToOrg?: () => void;
}

export function UserMenuDropdown({
  currentUser,
  onSelectUser,
  onOpenAuth,
  onSignOut,
  onAddNewAccount,
  onNavigateToOrg,
}: UserMenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'donor':
        return { label: 'Store Donor', style: 'bg-green-50 text-green-700 border-green-200' };
      case 'charity':
        return { label: 'Charity Partner', style: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'buyer':
        return { label: 'Retail Buyer', style: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'User', style: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAuth}
          className="text-xs font-semibold text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
        >
          Sign In
        </button>
        <button
          onClick={onAddNewAccount || onOpenAuth}
          className="text-xs font-semibold text-white bg-green-700 hover:bg-green-800 px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
        >
          Register Organization
        </button>
      </div>
    );
  }

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Standard Header User Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg hover:bg-gray-100 transition border border-transparent hover:border-gray-200 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-green-700 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
          {getInitials(currentUser.fullName)}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-semibold text-gray-900 leading-tight">
            {currentUser.fullName}
          </p>
          <p className="text-[11px] text-gray-500 leading-tight truncate max-w-[140px]">
            {currentUser.organizationName}
          </p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Strict Privacy Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 animate-fadeIn">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60 rounded-t-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-900 truncate pr-2">
                {currentUser.fullName}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded border shrink-0 ${roleInfo.style}`}>
                {roleInfo.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            <p className="text-[11px] text-gray-700 font-medium truncate mt-0.5">
              {currentUser.organizationName}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-mono mt-1 pt-1 border-t border-gray-200/60">
              <Lock className="w-3 h-3" />
              <span>Private Tenant Session</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-1 space-y-0.5">
            <button
              onClick={() => {
                if (onNavigateToOrg) onNavigateToOrg();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2.5 transition cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-green-700" />
              <span>My Organization Profile</span>
            </button>

            <button
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
