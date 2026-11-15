import React, { useState } from 'react';
import { 
  X, 
  Tag, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  ShoppingBag, 
  ShieldCheck,
  Store,
  ArrowRight
} from 'lucide-react';
import { FoodBatch } from '../../types';

interface ReservePickupModalProps {
  batch: FoodBatch | null;
  onClose: () => void;
  onConfirmReserve: (batchId: string, customerName: string, customerPhone: string, pickupWindow: string) => void;
}

export const ReservePickupModal: React.FC<ReservePickupModalProps> = ({
  batch,
  onClose,
  onConfirmReserve,
}) => {
  const [customerName, setCustomerName] = useState('Alex Taylor');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 789-2345');
  const [pickupWindow, setPickupWindow] = useState('Within 2 Hours');

  if (!batch || !batch.clearanceDetails) return null;

  const clearance = batch.clearanceDetails;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReserve(batch.id, customerName, customerPhone, pickupWindow);
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
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-200 shadow-xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Reserve Clearance Food for Store Pickup
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Lock in your discounted flash sale item. Payment & pickup at in-store register.
            </p>
          </div>
        </div>

        {/* Item Pricing & Shelf Summary */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 border border-amber-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={batch.imageUrl}
              alt={batch.name}
              className="w-14 h-14 rounded-xl object-cover border border-amber-300/60 shrink-0"
            />
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white mb-1 shadow-2xs">
                <Tag className="w-3 h-3" />
                {clearance.discountPercent}% OFF CLEARANCE
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate">{batch.name}</h4>
              <p className="text-[11px] text-slate-500">{batch.quantity}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl font-black text-amber-900 font-mono">
              LKR {clearance.salePrice.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 line-through font-mono">
              LKR {clearance.originalPrice.toFixed(2)}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              Save LKR {(clearance.originalPrice - clearance.salePrice).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Store & Shelf Location */}
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Store:</strong> {batch.supermarketName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Clearance Location:</strong> <span className="font-semibold text-amber-900 bg-amber-100/70 px-1.5 py-0.2 rounded border border-amber-200">{clearance.shelfLocation}</span></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Full Name
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Contact Number (for SMS Pickup Code)
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Estimated In-Store Pickup Window
            </label>
            <div className="relative">
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white text-slate-800"
              >
                <option value="Within 1 Hour">Within 1 Hour (Priority Hold)</option>
                <option value="Within 2 Hours">Within 2 Hours</option>
                <option value="Within 4 Hours">Within 4 Hours</option>
                <option value="Today by Store Closing">Today by Store Closing</option>
              </select>
            </div>
          </div>

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
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:opacity-95 shadow-md shadow-amber-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Pickup Hold</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

