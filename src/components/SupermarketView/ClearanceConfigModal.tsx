import React, { useState } from 'react';
import { 
  X, 
  Tag, 
  DollarSign, 
  Percent, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingBag,
  Store,
  Clock
} from 'lucide-react';
import { ClearanceDetails } from '../../types';

interface ClearanceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodName: string;
  category: string;
  quantity: string;
  imageUrl: string;
  onConfirmClearance: (details: ClearanceDetails) => void;
}

export const ClearanceConfigModal: React.FC<ClearanceConfigModalProps> = ({
  isOpen,
  onClose,
  foodName,
  category,
  quantity,
  imageUrl,
  onConfirmClearance,
}) => {
  const [originalPrice, setOriginalPrice] = useState<number>(8.0);
  const [discountPercent, setDiscountPercent] = useState<number>(50);
  const [shelfLocation, setShelfLocation] = useState<string>('Aisle 3 - Flash Sale Bin');

  if (!isOpen) return null;

  // Calculate final sale price
  const salePrice = +(originalPrice * (1 - discountPercent / 100)).toFixed(2);
  const savings = +(originalPrice - salePrice).toFixed(2);

  const presetLocations = [
    'Aisle 3 - Flash Sale Bin',
    'Produce Clearance Endcap',
    'Front Deli Refrigerated Tub',
    'Bakery Quick-Sale Table',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmClearance({
      originalPrice,
      discountPercent,
      salePrice,
      shelfLocation,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-300 shadow-xs">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Discount Clearance Configuration
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                Retail Mode
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Recover inventory cost by offering verified fresh surplus at flash sale prices.
            </p>
          </div>
        </div>

        {/* Product Specimen Summary */}
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80'}
            alt={foodName}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">{foodName || 'Food Item'}</h4>
            <p className="text-[11px] text-slate-500">{category} • {quantity}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Verified Fresh
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Price & Discount Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Original Retail Price (LKR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">LKR</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Discount Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="90"
                  required
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
                  className="w-full pl-3 pr-7 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white font-mono font-bold text-slate-800"
                />
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Discount Preset Chips */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Quick Discount Presets:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 50, 70].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    discountPercent === pct
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pct}% OFF
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Price Display Callout */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-800 font-bold">
                Customer Flash Price:
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-amber-900 font-mono">
                  LKR {salePrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 line-through font-mono">
                  LKR {originalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-white shadow-2xs">
                Save LKR {savings.toFixed(2)} ({discountPercent}% OFF)
              </span>
              <p className="text-[10px] text-amber-700 mt-1">Instant Register Markdown</p>
            </div>
          </div>

          {/* In-Store Shelf Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clearance Shelf / Display Location
            </label>
            <div className="relative mb-2">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                required
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="e.g. Aisle 3 - Flash Sale Bin"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white text-slate-800"
              />
            </div>
            {/* Quick shelf preset pills */}
            <div className="flex flex-wrap gap-1.5">
              {presetLocations.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setShelfLocation(loc)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors ${
                    shelfLocation === loc
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-95 shadow-md shadow-amber-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Tag className="w-4 h-4" />
              <span>Publish to Clearance Sale</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

