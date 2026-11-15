import React, { useState, useMemo } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  ShieldCheck, 
  Thermometer, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { REGULATORY_SAFETY_RULES } from '../utils/mockData';
import { RegulatoryRule, FoodCategory } from '../types';

interface RegulatoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulatoryDrawer: React.FC<RegulatoryDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredRules = useMemo(() => {
    return REGULATORY_SAFETY_RULES.filter((rule) => {
      const matchSearch =
        rule.ruleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.standardCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.authority.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      if (selectedCategory !== 'All' && rule.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* Top Decorative Gradient */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#52b788]"></div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-xs">
              <BookOpen className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-700">
                Statutory Compliance Knowledge-Base
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Food Safety & Regulatory Redistribution Standards
              </h3>
              <p className="text-xs text-slate-500">
                Authoritative thresholds governed by <strong>FSANZ Standard 1.2.5</strong>, <strong>Queensland Health Food Act 2006</strong>, and <strong>HACCP CCP-1</strong>.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rules by standard, category, or keyword..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 text-slate-800"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Prepared Meals'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Rules Table */}
        <div className="overflow-y-auto my-4 pr-1 space-y-3 max-h-[55vh]">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-emerald-300 transition-all space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {rule.standardCode}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{rule.ruleTitle}</h4>
                </div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                  {rule.category}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                    Maximum Safe Holding Temp
                  </span>
                  <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                    {rule.maxHoldingTemp}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                    Redistribution Expiry Buffer
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {rule.safeExpiryBuffer}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                    Ethylene Behavior
                  </span>
                  <span className={`font-semibold inline-block px-1.5 py-0.2 rounded text-[11px] ${
                    rule.ethyleneBehavior === 'High Producer'
                      ? 'bg-amber-100 text-amber-800'
                      : rule.ethyleneBehavior === 'High Sensitivity'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {rule.ethyleneBehavior}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 pt-1 gap-2 border-t border-slate-200/60">
                <div className="flex items-center gap-1 text-[11px]">
                  <strong className="text-slate-800">Packaging: </strong>
                  <span>{rule.packagingStandard}</span>
                </div>
                <div className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-medium border border-rose-100">
                  Action on breach: {rule.actionOnViolation}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Statutory criteria synchronized with FreshGuard Deterministic Rules Engine
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Close Knowledge-Base
          </button>
        </div>

      </div>
    </div>
  );
};

