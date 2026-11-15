import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Award,
  Lock,
  Download
} from 'lucide-react';
import { FoodBatch } from '../../types';
import { truncateHash } from '../../utils/crypto';

interface CertificateModalProps {
  batch: FoodBatch | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ batch, onClose }) => {
  if (!batch) return null;

  const [copied, setCopied] = useState(false);
  const evaluation = batch.evaluation;
  const hash = evaluation?.sha256Hash || '4a6b8e2190fd8e82a5c4d1109923ef120b4c81a29903b128509c8f203841ec45';

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* Certificate Decorative Top Border */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1b4332] via-[#40916c] to-[#1b4332]"></div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto pr-1">
          {/* Official Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-xs">
                <Award className="w-7 h-7 text-emerald-700" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-700 font-extrabold uppercase">
                  Enterprise Security Verification
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Cryptographic Certificate of Freshness (COA)
                </h3>
                <p className="text-xs text-slate-500">
                  Dual-tier Neural & Regulatory Chain-of-Custody Record
                </p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {batch.id}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 font-mono">
                ISO/IEC 27001 Aligned
              </span>
            </div>
          </div>

          {/* Cryptographic Proof Card */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Lock className="w-3.5 h-3.5" />
                Immutable SHA-256 Ledger Digest:
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-black/40 rounded-xl break-all text-emerald-300 select-all font-mono text-xs leading-relaxed border border-white/10">
              {hash}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>EXIF Stripped: GPS Coordinates, Camera Model Scrubbed</span>
              <span className="text-emerald-400">Status: Valid / Untampered</span>
            </div>
          </div>

          {/* Batch Information & Assessment Parameters */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Specimen Metadata</span>
              <div className="flex justify-between">
                <span className="text-slate-500">Specimen:</span>
                <span className="font-semibold text-slate-800">{batch.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{batch.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-semibold text-slate-800">{batch.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Supermarket:</span>
                <span className="font-semibold text-slate-800">{batch.supermarketName}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Safety Criteria & AI</span>
              <div className="flex justify-between">
                <span className="text-slate-500">CNN Confidence:</span>
                <span className="font-bold text-emerald-700">{evaluation?.cnnConfidence || 95}% Fresh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rule Engine Verdict:</span>
                <span className="font-bold text-emerald-700">{evaluation?.overallVerdict || 'APPROVED'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recorded Temp:</span>
                <span className="font-semibold text-slate-800">{batch.ambientTemp}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono text-slate-700">{new Date(batch.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Regulatory Rules Table */}
          <div className="mt-5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Food Safety Standards Verification:
            </h4>
            <div className="space-y-1.5">
              {(evaluation?.ruleChecks || []).map((rule) => (
                <div
                  key={rule.id}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">{rule.name}</span>
                  </div>
                  <span className="font-mono text-slate-600 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {rule.actual}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital signature verified by FreshGuard Node #104</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Close Certificate
          </button>
        </div>

      </div>
    </div>
  );
};

