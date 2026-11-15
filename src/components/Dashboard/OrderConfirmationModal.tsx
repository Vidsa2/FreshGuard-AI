import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Tag, 
  Heart, 
  DollarSign, 
  CheckCircle2, 
  Store, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Database,
  ArrowRight,
  FileText
} from 'lucide-react';
import { FoodBatch, UserProfile } from '../../types';
import { createMongoOrder } from '../../utils/api';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: FoodBatch;
  currentUser: UserProfile | null;
  onSuccess: (updatedBatch: FoodBatch) => void;
}

export function OrderConfirmationModal({
  isOpen,
  onClose,
  batch,
  currentUser,
  onSuccess,
}: OrderConfirmationModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isClearance = batch.listingType === 'clearance';
  const clearance = batch.clearanceDetails;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const transactionType = isClearance ? 'PURCHASE' : 'CHARITY_CLAIM';

      await createMongoOrder({
        item_id: batch.id,
        user_id: currentUser.id,
        user_name: currentUser.fullName,
        user_org: currentUser.organizationName,
        transaction_type: transactionType,
        notes: notes || (isClearance ? 'Reserved for in-store checkout' : 'Urgent shelter food bank claim'),
      });

      // Confetti celebration
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      const updatedBatch: FoodBatch = {
        ...batch,
        status: isClearance ? 'Reserved' : 'Claimed',
        claimedBy: {
          charityName: currentUser.organizationName,
          shelterType: currentUser.role === 'charity' ? 'Accredited Food Bank' : 'Verified Buyer',
          claimedAt: new Date().toISOString(),
        },
      };

      onSuccess(updatedBatch);
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isClearance
              ? 'bg-purple-900 text-white border-purple-800'
              : 'bg-emerald-900 text-white border-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              {isClearance ? <Tag className="w-4 h-4 text-purple-300" /> : <Heart className="w-4 h-4 text-emerald-300" />}
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isClearance ? 'Confirm Clearance Reservation' : 'Confirm Charity Shelter Claim'}
              </h3>
              <p className="text-xs text-white/70">
                Verified cryptographic transaction logged with SHA-256 seal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          {/* Specimen Preview Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <img
              src={batch.imageUrl}
              alt={batch.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {batch.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">{batch.name}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>{batch.supermarketName}</span>
              </p>
            </div>
          </div>

          {/* Pricing / Claim Details */}
          {isClearance ? (
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Original Retail Price:</span>
                <span className="line-through text-slate-400">
                  LKR {clearance?.originalPrice ? clearance.originalPrice.toFixed(2) : '800.00'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-700 font-semibold">Clearance Discount:</span>
                <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  {clearance?.discountPercent || 50}% OFF
                </span>
              </div>
              <div className="pt-2 border-t border-purple-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Calculated Final Price:</span>
                <span className="text-lg font-extrabold text-purple-700">
                  LKR {clearance?.salePrice ? clearance.salePrice.toFixed(2) : '400.00'}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center gap-1 pt-1">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                <span>Pickup: <strong>{clearance?.shelfLocation || 'Aisle 3 - Flash Sale Bin'}</strong></span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Transaction Fee:</span>
                <span className="text-emerald-700 font-bold">LKR 0.00 (100% Free Donation)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Recipient Organization:</span>
                <span className="font-bold text-slate-800">
                  {currentUser?.organizationName || 'St. Vincent Hope Shelter'}
                </span>
              </div>
              <div className="text-[11px] text-emerald-800 flex items-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Automated DGR Tax-Deductible Transfer Receipt logged</span>
              </div>
            </div>
          )}

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Order Pickup / Delivery Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Arriving at 3:30 PM with insulated food carrier..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl text-white font-semibold text-xs shadow-md transition flex items-center gap-2 ${
                isClearance
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Processing...'
                  : isClearance
                  ? 'Confirm Purchase'
                  : 'Claim Donation'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

