import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  Share2, 
  Scan, 
  Cpu, 
  Sparkles,
  ArrowRight,
  Info,
  Eye,
  Layers,
  Thermometer,
  Flame,
  Tag,
  AlertOctagon
} from 'lucide-react';
import { EvaluationResult, FoodCategory, GradCamDefectBox } from '../../types';
import { truncateHash } from '../../utils/crypto';

interface DiagnosticResultsCardProps {
  evaluation: EvaluationResult | null;
  isAnalyzing: boolean;
  foodName: string;
  category: FoodCategory;
  quantity: string;
  imageUrl: string;
  onListBatch: () => void;
  onOpenClearanceModal?: () => void;
  isListed: boolean;
}

export const DiagnosticResultsCard: React.FC<DiagnosticResultsCardProps> = ({
  evaluation,
  isAnalyzing,
  foodName,
  category,
  quantity,
  imageUrl,
  onListBatch,
  onOpenClearanceModal,
  isListed,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'gradcam'>('standard');
  const [selectedDefect, setSelectedDefect] = useState<GradCamDefectBox | null>(null);

  const handleCopyHash = () => {
    if (evaluation?.sha256Hash) {
      navigator.clipboard.writeText(evaluation.sha256Hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  // Pre-analysis / Empty placeholder
  if (!evaluation && !isAnalyzing) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm h-full flex flex-col items-center justify-center text-center min-h-[500px]">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
          <Scan className="w-10 h-10 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Diagnostic Hub Standby</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5">
          Select or drop a food sample on the left and click <span className="text-emerald-700 font-semibold">"Analyze Freshness & Verify Safety"</span> to execute real-time dual-tier verification.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-md text-left">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Cpu className="w-4 h-4 text-emerald-600" />
              1. CNN MobileNetV3
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Classifies 26 produce categories and detects mold, skin discoloration, and turgor.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. FSANZ & HACCP Rules
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Checks cold chain limits (≤ 4°C), packaging seal, and Queensland Health thresholds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Analyzing state: Scanning animation & radar
  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm min-h-[500px] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 animate-pulse"></div>

        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
              <h3 className="text-sm font-bold text-slate-800">Processing Diagnostic Pipeline</h3>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              HPC Inference Active
            </span>
          </div>

          {/* Image with laser scan line */}
          <div className="relative mt-5 rounded-2xl overflow-hidden h-56 bg-slate-900 shadow-md">
            <img
              src={imageUrl}
              alt="Analyzing sample"
              className="w-full h-full object-cover opacity-60 filter contrast-125"
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-emerald-500/20"></div>
            <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-scanner-line"></div>
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 font-mono">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" />
                Grad-CAM Activation & Feature Maps
              </span>
              <span className="text-emerald-400 font-bold">11.4 ms</span>
            </div>
          </div>

          {/* Sequential step progress */}
          <div className="mt-5 space-y-2.5">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-900">
              <span className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                EXIF Metadata Privacy Scrubbing
              </span>
              <span className="font-mono text-[10px] text-emerald-700">COMPLETED (3.2ms)</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-900">
              <span className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                SHA-256 SIMD Cryptographic Digest
              </span>
              <span className="font-mono text-[10px] text-emerald-700">LOCKED (1.45 GB/s)</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="flex items-center gap-2 font-medium">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></div>
                MobileNetV3 TensorRT Classification
              </span>
              <span className="font-mono text-[10px] text-slate-500 animate-pulse">EVALUATING</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="flex items-center gap-2 font-medium">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></div>
                FSANZ 1.2.5 & Queensland Health Rules
              </span>
              <span className="font-mono text-[10px] text-slate-500 animate-pulse">VERIFYING</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 font-mono mt-4">
          Securing tamper-evident audit record...
        </p>
      </div>
    );
  }

  // Results State
  if (!evaluation) return null;

  const isApproved = evaluation.overallVerdict === 'APPROVED';
  const confidence = evaluation.cnnConfidence;
  const defects = evaluation.gradCamDefects || [];

  // SVG Circular Progress Bar calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
      <div>
        {/* Security Check & Hash Header */}
        <div className="pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              EXIF Metadata Stripped (Privacy Safe)
            </span>
          </div>

          {/* SHA-256 Digital Fingerprint */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-mono text-slate-600">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">SHA-256:</span>
            <span className="font-semibold text-slate-800">
              {truncateHash(evaluation.sha256Hash, 8, 6)}
            </span>
            <button
              onClick={handleCopyHash}
              title="Copy Full SHA-256 Hash"
              className="p-1 hover:text-emerald-700 rounded transition-colors"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Final Verdict Banner (Binary Classification) */}
        <div className="mt-4">
          {isApproved ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#1b4332] text-white shadow-md shadow-emerald-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <CheckCircle className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      Binary Classification Result
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">
                      {confidence}% Confidence
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight mt-0.5">
                    🟢 FRESH / GOOD (APPROVED)
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Item verified safe. Approved for discount clearance sale or charity donation.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-900 text-white shadow-md shadow-rose-950/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <XCircle className="w-7 h-7 text-rose-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-400/30">
                      Binary Classification Result
                    </span>
                    <span className="text-[10px] font-mono text-rose-300 font-bold">
                      {confidence}% Confidence
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight mt-0.5">
                    🔴 SPOILED (UNSAFE)
                  </h3>
                  <p className="text-xs text-rose-100 font-medium">
                    Item identified as spoiled. Selling and donation are strictly blocked.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FEATURE C: Photo vs Grad-CAM Defect Heatmap Toggle Switch */}
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-600" />
              Computer Vision Inspection Mode:
            </span>
            <div className="flex items-center bg-slate-200 p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('standard')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === 'standard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Standard Photo
              </button>
              <button
                type="button"
                onClick={() => setViewMode('gradcam')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'gradcam'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3 h-3 text-amber-200" />
                Defect Heatmap (Grad-CAM)
              </button>
            </div>
          </div>

          {/* Interactive Inspection Canvas with Grad-CAM overlay */}
          <div className="relative rounded-2xl overflow-hidden h-52 bg-slate-950 shadow-inner group">
            <img
              src={imageUrl}
              alt="Food Inspection"
              className={`w-full h-full object-cover transition-all duration-300 ${
                viewMode === 'gradcam' ? 'filter contrast-125 brightness-90' : ''
              }`}
            />

            {/* Grad-CAM Thermal Gradient Mask Overlay */}
            {viewMode === 'gradcam' && (
              <>
                <div 
                  className={`absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-300 ${
                    isApproved 
                      ? 'bg-gradient-to-tr from-emerald-600/30 via-teal-400/20 to-lime-300/40' 
                      : 'bg-gradient-to-tr from-rose-600/50 via-amber-500/40 to-blue-500/20'
                  }`}
                />
                
                {/* Bounding boxes with labels */}
                {defects.map((defect) => (
                  <div
                    key={defect.id}
                    onClick={() => setSelectedDefect(defect)}
                    style={{
                      top: `${defect.top}%`,
                      left: `${defect.left}%`,
                      width: `${defect.width}%`,
                      height: `${defect.height}%`,
                    }}
                    className={`absolute cursor-pointer border-2 rounded-xl transition-all ${
                      defect.severity === 'Critical'
                        ? 'border-rose-500 bg-rose-500/25 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                        : defect.severity === 'Warning'
                        ? 'border-amber-400 bg-amber-400/20 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                        : 'border-emerald-400 bg-emerald-400/15'
                    }`}
                  >
                    <div className="absolute -top-6 left-0 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/20 whitespace-nowrap shadow-md">
                      {defect.label} ({defect.confidence}%)
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[11px] flex items-center justify-between border border-white/10 font-mono">
                  <span>Grad-CAM Activation: Layer `features.11`</span>
                  <span className="text-amber-300 font-bold">{defects.length} defect zones mapped</span>
                </div>
              </>
            )}
          </div>

          {viewMode === 'gradcam' && (
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>* Gradient-weighted Class Activation Mapping computes localized gradients on MobileNetV3 convolutional feature maps.</span>
            </div>
          )}
        </div>

        {/* Dual Evaluation Breakdown Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. CNN Visual Freshness Score */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                1. CNN Visual Freshness Score
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                confidence >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {evaluation.cnnLabel.toUpperCase()}
              </span>
            </div>

            {/* Circular Progress & Visual Metrics */}
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="text-slate-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className={`${confidence >= 80 ? 'text-emerald-500' : 'text-rose-500'} transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-slate-900">{confidence}%</span>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase">Confidence</span>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="flex-1 space-y-1.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Color Pigment Vibrancy</span>
                    <span className="font-semibold">{evaluation.cnnVisualDetails.colorScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${evaluation.cnnVisualDetails.colorScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Peel/Surface Texture</span>
                    <span className="font-semibold">{evaluation.cnnVisualDetails.textureIntegrity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${evaluation.cnnVisualDetails.textureIntegrity}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Mold Spore Index</span>
                    <span className={`font-semibold ${evaluation.cnnVisualDetails.moldIndex > 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {evaluation.cnnVisualDetails.moldIndex}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${evaluation.cnnVisualDetails.moldIndex > 10 ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full`}
                      style={{ width: `${evaluation.cnnVisualDetails.moldIndex}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature markers */}
            <div className="mt-3 pt-2 border-t border-slate-200/70 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Identified Features: </span>
              {evaluation.cnnVisualDetails.detectedFeatures.join(' • ')}
            </div>
          </div>

          {/* 2. Rule-Based Compliance Matrix */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                2. Regulatory Compliance Matrix
              </span>
              <span className="text-[10px] text-slate-400 font-mono">FSANZ & QLD Health</span>
            </div>

            <div className="space-y-2 mt-1">
              {evaluation.ruleChecks.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-2 rounded-xl text-xs flex items-start gap-2 border ${
                    rule.passed
                      ? 'bg-white border-emerald-200/70 text-slate-800'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {rule.passed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px]">{rule.name.split('(')[0]}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        rule.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-200 text-rose-900'
                      }`}>
                        {rule.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono text-slate-700">{rule.actual}</span> — {rule.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              Automated deterministic verification against Food Standards Australia & Queensland Health Act 2006.
            </div>
          </div>
        </div>

      </div>

      {/* Dual Strategic Actions: Clearance Flash Sale vs Charity Donation (Decision Logic) */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        {isApproved ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Verified Fresh / Good — Choose Redistribution Pathway:</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">Approved</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* PATH 1: List on Discount Clearance Sale (Commercial Retail) */}
              <button
                type="button"
                onClick={onOpenClearanceModal}
                disabled={isListed}
                className={`py-3 px-4 rounded-2xl font-bold text-xs tracking-wide text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                  isListed
                    ? 'bg-amber-800/60 cursor-default opacity-60'
                    : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-600/30 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                <Tag className="w-4 h-4 text-amber-200" />
                <span className="truncate">🏷️ Put on Clearance Sale (Retail)</span>
              </button>

              {/* PATH 2: Donate to Charity Network (Redistribution) */}
              <button
                type="button"
                onClick={onListBatch}
                disabled={isListed}
                className={`py-3 px-4 rounded-2xl font-bold text-xs tracking-wide text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                  isListed
                    ? 'bg-emerald-800/80 cursor-default'
                    : 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-emerald-700/30 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isListed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span className="truncate">Listed in Live Marketplace!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-emerald-200" />
                    <span className="truncate">🎁 Donate to Charity Network</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* SPOILED: STRICTLY BLOCK SELLING AND DONATION */
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold space-y-2">
            <div className="flex items-center justify-center gap-2 text-rose-700">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="text-sm font-extrabold uppercase">
                Publishing Blocked — Item Evaluated as Spoiled
              </span>
            </div>
            <p className="text-[11px] font-normal text-rose-800 text-center max-w-md mx-auto">
              Food safety regulations strictly prohibit selling or donating spoiled food. Clearance sale and charity donation pathways are disabled. Please route specimen to organic compost or safe disposal.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 opacity-50 cursor-not-allowed">
              <button
                type="button"
                disabled
                className="py-2.5 px-3 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Clearance Sale (Blocked)</span>
              </button>
              <button
                type="button"
                disabled
                className="py-2.5 px-3 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Charity Donation (Blocked)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
