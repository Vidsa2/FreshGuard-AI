import React from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Thermometer, 
  ShieldCheck, 
  ArrowRight,
  Phone,
  Navigation,
  UserCheck
} from 'lucide-react';
import { FoodBatch, DeliveryStatus } from '../../types';

interface DeliveryModalProps {
  batch: FoodBatch | null;
  onClose: () => void;
  onUpdateDeliveryStatus: (batchId: string, nextStatus: DeliveryStatus) => void;
}

export const DeliveryModal: React.FC<DeliveryModalProps> = ({
  batch,
  onClose,
  onUpdateDeliveryStatus,
}) => {
  if (!batch) return null;

  const currentStatus = batch.deliveryTask?.currentStatus || 'Assigned';

  const steps: { status: DeliveryStatus; label: string; desc: string }[] = [
    { status: 'Assigned', label: '1. Task Assigned', desc: 'Volunteer matched & route calculated' },
    { status: 'Route Optimized', label: '2. Route Optimized', desc: 'Dijkstra shortest path with cold-chain window' },
    { status: 'Picked Up', label: '3. Cargo Picked Up', desc: 'Verified at supermarket loading dock' },
    { status: 'Delivered', label: '4. Delivered', desc: 'Signed off at charity shelter' },
  ];

  const getStepIndex = (status: DeliveryStatus): number => {
    switch (status) {
      case 'Assigned': return 0;
      case 'Route Optimized': return 1;
      case 'Picked Up': return 2;
      case 'In Transit': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  const handleNextStep = () => {
    if (currentStatus === 'Assigned') {
      onUpdateDeliveryStatus(batch.id, 'Route Optimized');
    } else if (currentStatus === 'Route Optimized') {
      onUpdateDeliveryStatus(batch.id, 'Picked Up');
    } else if (currentStatus === 'Picked Up' || currentStatus === 'In Transit') {
      onUpdateDeliveryStatus(batch.id, 'Delivered');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-emerald-300 flex items-center justify-center shadow-md">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Volunteer Delivery Dispatch</h3>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 rounded-full font-bold">
                Live Cold-Chain
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time route tracking, temperature monitoring & proof of custody.
            </p>
          </div>
        </div>

        {/* Item Summary Banner */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={batch.imageUrl}
              alt={batch.name}
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{batch.name}</h4>
              <p className="text-xs text-emerald-700 font-semibold">{batch.quantity}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
              {batch.evaluation?.cnnConfidence || 96}% Verified Fresh
            </span>
          </div>
        </div>

        {/* Origin & Destination Route Card */}
        <div className="mt-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-3">
          
          {/* Supermarket Pickup Origin */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Pickup Store Location
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Dock 3B
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">{batch.supermarketName}</p>
              <p className="text-[11px] text-slate-600">{batch.supermarketAddress}</p>
            </div>
          </div>

          <div className="ml-4 border-l-2 border-dashed border-emerald-300 h-4"></div>

          {/* Charity Destination */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                  Charity Delivery Destination
                </span>
                <span className="text-xs text-emerald-700 font-semibold font-mono">
                  {batch.distanceKm} km (~14 min transit)
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                {batch.claimedBy?.charityName || 'Downtown Hope Shelter & Food Bank'}
              </p>
              <p className="text-[11px] text-slate-600">
                240 S Olive St, Downtown Metro (Rear Intake Entrance)
              </p>
            </div>
          </div>
        </div>

        {/* Cold-Chain Compliance Reminder */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <Thermometer className="w-4 h-4 text-emerald-600" />
            <span>Target Storage: <strong>{batch.storageCondition}</strong></span>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md font-semibold">
            Insulated Bag Active
          </span>
        </div>

        {/* Real-Time Step Progression */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Real-Time Delivery Lifecycle:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={step.status}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/30'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-extrabold uppercase truncate">
                    {step.status}
                  </div>
                  <div className="mt-1 flex justify-center">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-white animate-ping"></div>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button to advance workflow */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            Close Modal
          </button>

          {currentStatus !== 'Delivered' ? (
            <button
              onClick={handleNextStep}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>
                {currentStatus === 'Assigned' && 'Optimize Dispatch Route'}
                {currentStatus === 'Route Optimized' && 'Confirm Cargo Pickup at Store'}
                {(currentStatus === 'Picked Up' || currentStatus === 'In Transit') && 'Complete Drop-Off & Sign'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Delivery Successfully Completed</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

