import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  HeartHandshake, 
  Truck, 
  Thermometer, 
  CheckCircle,
  Hash,
  AlertCircle,
  Tag,
  ShoppingBag,
  DollarSign,
  Store
} from 'lucide-react';
import { FoodBatch } from '../../types';
import { truncateHash } from '../../utils/crypto';

interface FoodCardProps {
  batch: FoodBatch;
  onClaim: (batch: FoodBatch) => void;
  onVolunteer: (batch: FoodBatch) => void;
  onReserveClearance?: (batch: FoodBatch) => void;
  currentUserRole?: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  batch,
  onClaim,
  onVolunteer,
  onReserveClearance,
  currentUserRole,
}) => {
  // Calculate expiry hours remaining
  const now = new Date();
  const expiry = new Date(batch.expiryDate);
  const diffHours = Math.max(1, Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60)));

  // Urgency color styling
  let urgencyClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let urgencyText = `Expires in ${diffHours} hrs`;

  if (diffHours <= 12) {
    urgencyClass = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
    urgencyText = `Critical: ${diffHours}h left`;
  } else if (diffHours <= 24) {
    urgencyClass = 'bg-amber-50 text-amber-800 border-amber-200';
    urgencyText = `Urgent: ${diffHours}h left`;
  }

  const confidence = batch.evaluation?.cnnConfidence || 95;
  const isClaimed = batch.status === 'Claimed';
  const isInTransit = batch.status === 'In Transit';
  const isDelivered = batch.status === 'Delivered';
  const isReserved = batch.status === 'Reserved';
  const isClearance = batch.listingType === 'clearance';
  const clearance = batch.clearanceDetails;

  return (
    <div className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
      isDelivered 
        ? 'border-slate-200 opacity-70 bg-slate-50/50' 
        : isReserved
        ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/10'
        : isClaimed || isInTransit
        ? 'border-teal-200 ring-1 ring-teal-500/20'
        : isClearance
        ? 'border-amber-200/90 hover:border-amber-400'
        : 'border-slate-200/90 hover:border-emerald-300'
    }`}>
      <div>
        {/* Card Image & Verified Confidence Overlay */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={batch.imageUrl}
            alt={batch.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* Freshness Confidence Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{confidence}% Fresh</span>
            <span className="text-slate-400 font-normal">| SHA-256</span>
          </div>

          {/* Expiry Countdown Tag & Badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            {isClearance ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-300 shadow-md">
                <Tag className="w-3 h-3" />
                🏷️ {clearance?.discountPercent || 50}% OFF FLASH SALE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-800 text-white border border-emerald-400/40 shadow-xs">
                🎁 Free for Shelter
              </span>
            )}
            
            <div className="flex items-center gap-1">
              {batch.isNewArrival && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border border-emerald-300 shadow-xs">
                  NEW
                </span>
              )}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${urgencyClass}`}>
                <Clock className="w-3 h-3" />
                <span>{urgencyText}</span>
              </span>
            </div>
          </div>

          {/* Bottom Bar on Image: Supermarket Name & Distance */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-3 text-white flex items-center justify-between text-xs">
            <span className="font-semibold truncate max-w-[200px]">
              {batch.supermarketName}
            </span>
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-mono">
              <MapPin className="w-3 h-3 text-emerald-300" />
              {batch.distanceKm} km away
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className={`font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              isClearance ? 'text-amber-800 bg-amber-50' : 'text-emerald-700 bg-emerald-50'
            }`}>
              {batch.category}
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              {batch.id}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
            {batch.name}
          </h3>

          <p className="text-sm font-semibold text-slate-700 mt-0.5">
            Quantity: <span className="text-slate-900 font-extrabold">{batch.quantity}</span>
          </p>

          {/* Clearance Pricing Callout (when item is listed on Clearance Sale) */}
          {isClearance && clearance && (
            <div className="mt-2.5 p-2.5 rounded-2xl bg-gradient-to-r from-amber-50/90 to-orange-50/70 border border-amber-200/90 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Flash Sale Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-amber-950 font-mono">
                    LKR {clearance.salePrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono">
                    LKR {clearance.originalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  Save LKR {(clearance.originalPrice - clearance.salePrice).toFixed(2)}
                </span>
                <span className="block text-[10px] text-slate-600 mt-0.5 font-medium">
                  📍 {clearance.shelfLocation}
                </span>
              </div>
            </div>
          )}

          {/* Storage & Cold-Chain Tag */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
              <Thermometer className="w-3 h-3 text-slate-500" />
              {batch.ambientTemp}°C ({batch.storageCondition.split(' ')[0]})
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-mono">
              <Hash className="w-3 h-3 text-slate-400" />
              {truncateHash(batch.evaluation?.sha256Hash || '4a6b8e2190fd8e82', 6, 4)}
            </span>
          </div>

          {/* Reserved Status for Store Pickup */}
          {isReserved && clearance?.reservedByCustomer && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Reserved for Store Pickup</span>
              </div>
              <span className="text-[11px] text-amber-700 font-mono">
                {clearance.reservedByCustomer.pickupWindow || clearance.reservedByCustomer.pickupDeadline || 'Within 2 Hours'}
              </span>
            </div>
          )}

          {/* Status notification if claimed for charity */}
          {batch.claimedBy && (
            <div className="mt-3 p-2 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
              <span className="font-semibold">Reserved for: </span>
              <span>{batch.claimedBy.charityName}</span>
            </div>
          )}

          {batch.deliveryTask && (
            <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                Delivery: {batch.deliveryTask.currentStatus}
              </span>
              <span className="font-mono text-[10px] text-amber-700">
                {batch.deliveryTask.estimatedMinutes}m transit
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons with Strict Role Permissions */}
      <div className="p-4 sm:p-5 pt-0">
        {currentUserRole === 'donor' ? (
          /* DONORS CANNOT BUY OR CLAIM */
          <div className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed flex items-center justify-center gap-2 select-none shadow-2xs">
            <Store className="w-3.5 h-3.5 text-gray-400" />
            <span>Donor Mode (Selling Only)</span>
          </div>
        ) : isClearance ? (
          /* PATH 1 ACTION: Reserve for In-Store Pickup */
          <div>
            <button
              onClick={() => onReserveClearance && onReserveClearance(batch)}
              disabled={isReserved}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isReserved
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xs hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isReserved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-amber-700" />
                  <span>Reserved for Store Pickup ({clearance?.reservedByCustomer?.customerName || 'Customer'})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-amber-100" />
                  <span>Reserve / Buy for Pickup (LKR {clearance?.salePrice.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        ) : currentUserRole === 'buyer' ? (
          /* RETAIL BUYERS CANNOT CLAIM CHARITY DONATIONS */
          <div className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed flex items-center justify-center gap-2 select-none">
            <HeartHandshake className="w-3.5 h-3.5 text-gray-400" />
            <span>Certified Shelters Only (Charity Donation)</span>
          </div>
        ) : (
          /* PATH 2 ACTION: Charity Redistribution (Claim or Volunteer) */
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onClaim(batch)}
              disabled={isClaimed || isInTransit || isDelivered}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isClaimed || isInTransit || isDelivered
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 hover:border-emerald-300 shadow-2xs'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>{isClaimed || isInTransit || isDelivered ? 'Claimed' : 'Claim for Shelter'}</span>
            </button>

            <button
              onClick={() => onVolunteer(batch)}
              disabled={isDelivered}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isDelivered
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                  : 'bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] hover:opacity-90 text-white shadow-xs'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-300" />
              <span>{isDelivered ? 'Delivered ✓' : batch.deliveryTask ? 'Track Transit' : 'Volunteer Delivery'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
