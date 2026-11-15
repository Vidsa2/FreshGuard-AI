import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Tag, 
  Heart, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Store,
  Layers,
  Database,
  RotateCcw
} from 'lucide-react';
import { FoodBatch, FoodCategory, UserProfile } from '../../types';
import { FoodCard } from '../CharityView/FoodCard';
import { OrderConfirmationModal } from './OrderConfirmationModal';

interface BuyMarketplaceModuleProps {
  batches: FoodBatch[];
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOrderCompleted: (updatedBatch: FoodBatch) => void;
}

export function BuyMarketplaceModule({
  batches,
  currentUser,
  onOpenAuth,
  onOrderCompleted,
}: BuyMarketplaceModuleProps) {
  const [filterType, setFilterType] = useState<'all' | 'clearance' | 'donation'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatchForOrder, setSelectedBatchForOrder] = useState<FoodBatch | null>(null);

  const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Prepared Meals'];

  // Filter batches
  const filteredBatches = batches.filter((b) => {
    // Type filter
    if (filterType === 'clearance' && b.listingType !== 'clearance') return false;
    if (filterType === 'donation' && b.listingType === 'clearance') return false;

    // Category filter
    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchStore = b.supermarketName.toLowerCase().includes(q);
      const matchLocation = b.clearanceDetails?.shelfLocation?.toLowerCase().includes(q) || false;
      if (!matchName && !matchStore && !matchLocation) return false;
    }

    return true;
  });

  const clearanceCount = batches.filter((b) => b.listingType === 'clearance').length;
  const donationCount = batches.filter((b) => b.listingType !== 'clearance').length;

  const handleActionClick = (batch: FoodBatch) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setSelectedBatchForOrder(batch);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Surplus Food Marketplace
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Browse available produce batches for discounted purchase or charity shelter claim.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-medium text-purple-800">
            {clearanceCount} Clearance
          </div>
          <div className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-medium text-blue-800">
            {donationCount} Donations
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Main Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({batches.length})
            </button>
            <button
              onClick={() => setFilterType('clearance')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                filterType === 'clearance'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Discount Retail Sale ({clearanceCount})</span>
            </button>
            <button
              onClick={() => setFilterType('donation')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                filterType === 'donation'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Free Charity Donations ({donationCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce, store, or aisle..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBatches.map((batch) => (
            <FoodCard
              key={batch.id}
              batch={batch}
              onClaim={() => handleActionClick(batch)}
              onVolunteer={() => handleActionClick(batch)}
              onReserveClearance={() => handleActionClick(batch)}
              currentUserRole={currentUser?.role}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Food Batches Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {selectedCategory !== 'All' 
              ? `There are no items currently matching category "${selectedCategory}" under this filter.`
              : 'There are currently no items matching your filter criteria.'}
          </p>
          {(selectedCategory !== 'All' || filterType !== 'all' || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setFilterType('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All Items ({batches.length})</span>
            </button>
          )}
        </div>
      )}

      {/* Order Confirmation Modal */}
      {selectedBatchForOrder && (
        <OrderConfirmationModal
          isOpen={selectedBatchForOrder !== null}
          onClose={() => setSelectedBatchForOrder(null)}
          batch={selectedBatchForOrder}
          currentUser={currentUser}
          onSuccess={(updated) => {
            onOrderCompleted(updated);
            setSelectedBatchForOrder(null);
          }}
        />
      )}
    </div>
  );
}

