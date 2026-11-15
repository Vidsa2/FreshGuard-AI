import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Package, 
  Sparkles, 
  HeartHandshake, 
  CheckCircle,
  SlidersHorizontal,
  Flame,
  Tag,
  Gift,
  ShoppingBag
} from 'lucide-react';
import { FoodBatch, FoodCategory } from '../../types';
import { FoodCard } from './FoodCard';

interface MarketplacePortalProps {
  batches: FoodBatch[];
  onClaim: (batch: FoodBatch) => void;
  onVolunteer: (batch: FoodBatch) => void;
  onReserveClearance?: (batch: FoodBatch) => void;
}

export const MarketplacePortal: React.FC<MarketplacePortalProps> = ({
  batches,
  onClaim,
  onVolunteer,
  onReserveClearance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState<number>(25); // km
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All'); // 'All' | 'critical' | 'urgent' | 'safe'
  const [listingTypeFilter, setListingTypeFilter] = useState<'all' | 'clearance' | 'donation'>('all');

  // Only show batches that are Approved, Claimed, Reserved, or In Transit/Delivered (excluding spoiled batches)
  const availableBatches = useMemo(() => {
    return batches.filter((b) => b.status !== 'Spoiled');
  }, [batches]);

  // Counts for segmented control
  const allCount = availableBatches.length;
  const clearanceCount = availableBatches.filter((b) => b.listingType === 'clearance').length;
  const donationCount = availableBatches.filter((b) => b.listingType !== 'clearance').length;

  const filteredBatches = useMemo(() => {
    const now = new Date();
    return availableBatches.filter((batch) => {
      // Listing type match
      if (listingTypeFilter === 'clearance' && batch.listingType !== 'clearance') return false;
      if (listingTypeFilter === 'donation' && batch.listingType === 'clearance') return false;

      // Search match
      const matchSearch =
        batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.supermarketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.id.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      // Category match
      if (selectedCategory !== 'All' && batch.category !== selectedCategory) {
        return false;
      }

      // Distance match
      if (batch.distanceKm > maxDistance) {
        return false;
      }

      // Urgency filter match
      const expiry = new Date(batch.expiryDate);
      const diffHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (urgencyFilter === 'critical') {
        if (diffHours > 12) return false;
      } else if (urgencyFilter === 'urgent') {
        if (diffHours > 24) return false;
      } else if (urgencyFilter === 'safe') {
        if (diffHours <= 24) return false;
      }

      return true;
    });
  }, [availableBatches, listingTypeFilter, searchTerm, selectedCategory, maxDistance, urgencyFilter]);

  const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Prepared Meals'];

  return (
    <section id="marketplace" className="py-12 border-t border-slate-200/80 space-y-6">
      {/* Banner & Value Proposition */}
      <div className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-emerald-200 border border-white/20 mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            Dual-Path: Discount Flash Sale & Free Shelter Redistribution
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Surplus Food Marketplace
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Every batch below has passed cryptographic SHA-256 integrity checks, CNN visual defect scans, and cold-chain safety rules before being cleared for consumer purchase or charity consumption.
          </p>
        </div>
      </div>

      {/* Primary Listing Type Segmented View Toggle */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit">
        <button
          onClick={() => setListingTypeFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            listingTypeFilter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>All Listings</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
            listingTypeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-300 text-slate-700'
          }`}>
            {allCount}
          </span>
        </button>

        <button
          onClick={() => setListingTypeFilter('clearance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            listingTypeFilter === 'clearance'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-700 hover:text-amber-900'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>🏷️ Discount Retail Flash Sale</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
            listingTypeFilter === 'clearance' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {clearanceCount}
          </span>
        </button>

        <button
          onClick={() => setListingTypeFilter('donation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            listingTypeFilter === 'donation'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:text-emerald-900'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>🎁 Free Charity Donations</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
            listingTypeFilter === 'donation' ? 'bg-emerald-900 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {donationCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food name, supermarket, or batch ID..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-800"
            />
          </div>

          {/* Quick Urgency Toggles */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setUrgencyFilter('All')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                urgencyFilter === 'All'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Shelf-Lives
            </button>
            <button
              onClick={() => setUrgencyFilter('critical')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 border ${
                urgencyFilter === 'critical'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Critical (&lt; 12h)
            </button>
            <button
              onClick={() => setUrgencyFilter('urgent')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                urgencyFilter === 'urgent'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Urgent (&lt; 24h)
            </button>
            <button
              onClick={() => setUrgencyFilter('safe')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                urgencyFilter === 'safe'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                  : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
              }`}
            >
              Extended (&gt; 24h)
            </button>
          </div>
        </div>

        {/* Categories Bar & Distance Range */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-100 gap-3">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Max Distance Slider */}
          <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
              Max Radius: <strong className="text-slate-900">{maxDistance} km</strong>
            </span>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-20 sm:w-24 accent-emerald-600 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Batches Counter & View Status */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <span>Displaying {filteredBatches.length} Verified Food Batches</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-400 font-normal">Updated Live</span>
        </p>

        {(searchTerm || selectedCategory !== 'All' || urgencyFilter !== 'All' || maxDistance < 25 || listingTypeFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setUrgencyFilter('All');
              setMaxDistance(25);
              setListingTypeFilter('all');
            }}
            className="text-xs text-emerald-700 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Food Cards */}
      {filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBatches.map((batch) => (
            <FoodCard
              key={batch.id}
              batch={batch}
              onClaim={onClaim}
              onVolunteer={onVolunteer}
              onReserveClearance={onReserveClearance}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {batches.length === 0 ? 'No Surplus Batches Listed Yet' : 'No surplus batches match your filters'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {batches.length === 0 
              ? 'Supermarket donors can evaluate fresh surplus batches above or capture live produce with the camera scanner to list them on clearance flash sale or for charity claiming.' 
              : 'Try adjusting your radius, category selection, or switching listing view mode.'}
          </p>
        </div>
      )}
    </section>
  );
};
