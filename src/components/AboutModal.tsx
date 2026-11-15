import React from 'react';
import { X, Cpu, ShieldCheck, Database, Layers, CheckCircle, Award } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto pr-2 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-emerald-300 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-700 font-extrabold uppercase tracking-wider">
                System Documentation & Specification
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                FreshGuard AI Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Enterprise Food Freshness Verification & Zero-Waste Redistribution Network
              </p>
            </div>
          </div>

          {/* Core Architecture Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 mb-1">
                <Cpu className="w-4 h-4 text-emerald-700" />
                Dual-Tier AI & Rules
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Combines MobileNetV3 visual surface defect detection with deterministic FSANZ/HACCP food safety constraint rules.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 mb-1">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                Cryptographic Hashing
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Automatic client-side EXIF scrubbing strips private geolocation and tags, computing immutable SHA-256 digests.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                <Database className="w-4 h-4 text-slate-700" />
                Redistribution Mesh
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Connects donor supermarkets with verified shelters and volunteer delivery couriers with cold-chain tracking.
              </p>
            </div>
          </div>

          {/* Food Safety Standards Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Enforced Regulatory Safety Standards:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>FSANZ Standard 1.2.5 (Date Marking)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>HACCP CCP-1 (Temperature Control ≤ 4°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>FDA §117.80 (Tamper Packaging Integrity)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Tolerance for Fungal Mycelium / Decay</span>
              </div>
            </div>
          </div>

          {/* Enterprise Platform Notes */}
          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
            <p>
              FreshGuard AI Enterprise Edition: Certified food freshness diagnostics, cryptographic provenance verification, and zero-waste logistics redistribution.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};

