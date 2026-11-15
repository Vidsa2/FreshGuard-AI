import React, { useState } from 'react';
import { X, HeartHandshake, ShieldCheck, MapPin, Clock, Building, Check, Sparkles } from 'lucide-react';
import { FoodBatch } from '../../types';
import { CHARITY_SHELTERS } from '../../utils/mockData';

interface ClaimModalProps {
  batch: FoodBatch | null;
  onClose: () => void;
  onConfirmClaim: (batchId: string, charityName: string, shelterType: string) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  batch,
  onClose,
  onConfirmClaim,
}) => {
  if (!batch) return null;

  const [selectedCharity, setSelectedCharity] = useState(CHARITY_SHELTERS[0]);
  const [pickupSlot, setPickupSlot] = useState('Within 2 Hours (Urgent Priority)');
  const [dietNotes, setDietNotes] = useState('Immediate dinner service at shelter soup kitchen.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmClaim(batch.id, selectedCharity.name, selectedCharity.type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Claim Surplus Food for Charity</h3>
            <p className="text-xs text-slate-500">Allocate certified safe food batch to emergency meal services.</p>
          </div>
        </div>

        {/* Selected Batch Summary */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3.5">
          <img
            src={batch.imageUrl}
            alt={batch.name}
            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                {batch.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">{batch.id}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">{batch.name}</h4>
            <p className="text-xs text-emerald-700 font-semibold">{batch.quantity}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {batch.supermarketName} ({batch.distanceKm} km away)
            </p>
          </div>
        </div>

        {/* Claim Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Recipient Organization / Shelter
            </label>
            <select
              value={selectedCharity.name}
              onChange={(e) => {
                const found = CHARITY_SHELTERS.find((c) => c.name === e.target.value);
                if (found) setSelectedCharity(found);
              }}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
            >
              {CHARITY_SHELTERS.map((shelter) => (
                <option key={shelter.name} value={shelter.name}>
                  {shelter.name} — {shelter.type} ({shelter.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup Window
              </label>
              <select
                value={pickupSlot}
                onChange={(e) => setPickupSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-500 text-slate-800"
              >
                <option value="Within 2 Hours (Urgent Priority)">Within 2 Hours (Urgent)</option>
                <option value="This Afternoon (Before 5 PM)">This Afternoon (Before 5 PM)</option>
                <option value="Tomorrow Morning (8:00 AM)">Tomorrow Morning (8:00 AM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shelter Contact
              </label>
              <input
                type="text"
                readOnly
                value={selectedCharity.contact}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Distribution Purpose / Notes
            </label>
            <input
              type="text"
              value={dietNotes}
              onChange={(e) => setDietNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-500 text-slate-800"
            />
          </div>

          {/* Verification Assurance */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-emerald-900 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Cryptographic Verification:</strong> Digital authenticity fingerprint will transfer automatically to your recipient receipt.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Allocation</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

