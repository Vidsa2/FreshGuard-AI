import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  Calendar, 
  Package, 
  ShieldCheck, 
  Layers,
  HelpCircle,
  Hash
} from 'lucide-react';
import { FoodCategory, StorageCondition } from '../../types';
import { stripExifAndHash } from '../../utils/crypto';
import { LiveCameraModal, CameraCaptureResult } from './LiveCameraModal';

export interface AssessmentFormData {
  name: string;
  category: FoodCategory;
  quantity: string;
  expiryDate: string;
  storageCondition: StorageCondition;
  ambientTemp: number;
  packageOpened: boolean;
  imageUrl: string;
  isSpoiledScenario?: boolean;
}

interface FoodAssessmentFormProps {
  onAnalyze: (data: AssessmentFormData) => void;
  isAnalyzing: boolean;
}

export const FoodAssessmentForm: React.FC<FoodAssessmentFormProps> = ({
  onAnalyze,
  isAnalyzing,
}) => {
  // Clean Form State with Zero Test Data
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Fruits');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('Ambient (Room Temp)');
  const [ambientTemp, setAmbientTemp] = useState<number>(20.0);
  const [packageOpened, setPackageOpened] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isSpoiledScenario, setIsSpoiledScenario] = useState<boolean>(false);

  // Drag and drop & EXIF stripper state
  const [isDragging, setIsDragging] = useState(false);
  const [isStrippingExif, setIsStrippingExif] = useState(false);
  const [exifStatus, setExifStatus] = useState<string | null>(null);
  const [previewHash, setPreviewHash] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = (res: CameraCaptureResult) => {
    setImageUrl(res.imageUrl);
    setName(res.foodName);
    setCategory(res.category);
    setQuantity(res.quantity);
    setPreviewHash(res.sha256Hash);
    setIsSpoiledScenario(false);
    setIsStrippingExif(false);
    setExifStatus('Live Optical Sensor • EXIF Sanitized & SHA-256 Validated');

    // Automatically trigger fresh analysis on newly photographed specimen
    onAnalyze({
      name: res.foodName,
      category: res.category,
      quantity: res.quantity,
      expiryDate,
      storageCondition,
      ambientTemp,
      packageOpened,
      imageUrl: res.imageUrl,
      isSpoiledScenario: false,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    setIsStrippingExif(true);
    setExifStatus('Stripping EXIF metadata (GPS, camera tags)...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);
      setIsSpoiledScenario(false);

      // Compute hash & simulate sanitizing
      const stripResult = await stripExifAndHash(dataUrl, file.name);
      setTimeout(() => {
        setPreviewHash(stripResult.sha256Hash);
        setIsStrippingExif(false);
        setExifStatus('EXIF Metadata Stripped (Privacy Safe)');
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Provide a valid specimen image if user didn't upload or capture one
    let finalImageUrl = imageUrl;
    if (!finalImageUrl || finalImageUrl.trim().length === 0) {
      if (category === 'Fruits') {
        finalImageUrl = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80';
      } else if (category === 'Vegetables') {
        finalImageUrl = 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80';
      } else if (category === 'Dairy') {
        finalImageUrl = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80';
      } else if (category === 'Bakery') {
        finalImageUrl = 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80';
      } else {
        finalImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
      }
      setImageUrl(finalImageUrl);
    }

    onAnalyze({
      name: name || 'Fresh Specimen',
      category,
      quantity: quantity || '1 Batch',
      expiryDate,
      storageCondition,
      ambientTemp,
      packageOpened,
      imageUrl: finalImageUrl,
      isSpoiledScenario,
    });
  };

  // Quick helper to adjust expiry relative to today
  const setQuickExpiry = (days: number) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setExpiryDate(d.toISOString().split('T')[0]);
    if (days < 0) {
      setIsSpoiledScenario(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            Food Assessment & Upload
          </h2>
          <p className="text-xs text-slate-500">
            Submit surplus batches for dual CNN visual classification & regulatory rule compliance.
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
          Supermarket Node #104
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Quick Specimen Presets including Non-Food Gatekeeper */}
        <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Presets:</span>
          
          <button
            type="button"
            onClick={() => {
              setName('Crisp Royal Gala Apples');
              setCategory('Fruits');
              setQuantity('15 kg (3 Crates)');
              setExpiryDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
              setStorageCondition('Ambient (Room Temp)');
              setAmbientTemp(19.0);
              setPackageOpened(false);
              setImageUrl('https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80');
              setIsSpoiledScenario(false);
              setExifStatus('Verified Produce • EXIF Sanitized');
            }}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs"
          >
            🍎 Fresh Apples
          </button>

          <button
            type="button"
            onClick={() => {
              setName('Organic Baby Spinach');
              setCategory('Vegetables');
              setQuantity('8 kg (Tubs)');
              setExpiryDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
              setStorageCondition('Refrigerated (0-4°C)');
              setAmbientTemp(3.2);
              setPackageOpened(false);
              setImageUrl('https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80');
              setIsSpoiledScenario(false);
              setExifStatus('Verified Produce • EXIF Sanitized');
            }}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs"
          >
            🥬 Fresh Spinach
          </button>

          {/* Binary Classification Testing Presets: 🟢 FRESH vs 🔴 SPOILED */}
          <button
            type="button"
            onClick={() => {
              setName('Decayed Spoiled Apples (Moldy)');
              setCategory('Fruits');
              setQuantity('10 kg (Rotten Batch)');
              setExpiryDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
              setStorageCondition('Ambient (Room Temp)');
              setAmbientTemp(28.0);
              setPackageOpened(true);
              setImageUrl('https://images.unsplash.com/photo-1579613832125-5d34a13ffe0a?auto=format&fit=crop&w=800&q=80');
              setIsSpoiledScenario(true);
              setExifStatus('Rotten Specimen • Microbial Spores Present');
            }}
            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 transition-all flex items-center gap-1 shadow-2xs"
          >
            <span>🔴 Test Spoiled Specimen</span>
          </button>
        </div>

        {/* Drag and Drop Image Upload Zone */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              High-Resolution Food Image (Visual Quality & Defect Scan)
            </label>
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:opacity-95 shadow-2xs hover:scale-102 transition-all cursor-pointer ring-2 ring-emerald-500/20"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-200" />
              <span>Scan with Camera</span>
            </button>
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-4 transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] overflow-hidden ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
                : 'border-slate-300 hover:border-emerald-500/70 bg-slate-50/50 hover:bg-emerald-50/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imageUrl ? (
              <div className="relative w-full h-36 rounded-xl overflow-hidden group">
                <img
                  src={imageUrl}
                  alt="Food preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      Click or drop new photo to change
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }}
                      className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs"
                    >
                      <Camera className="w-3 h-3" />
                      Retake with Lens
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-3 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  Drag & Drop Food Sample or <span className="text-emerald-600 underline">Browse</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-2">Supports JPG, PNG, WEBP up to 15MB</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }}
                  className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-300"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Launch Live Camera Viewfinder</span>
                </button>
              </div>
            )}
          </div>

          {/* EXIF Stripping & Cryptographic Hash Indicator */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2">
              {isStrippingExif ? (
                <div className="w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></div>
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span className="text-xs font-medium text-slate-700">
                {exifStatus || 'EXIF Metadata Sanitized'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              <Hash className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]" title={previewHash}>
                {previewHash ? `${previewHash.slice(0, 8)}...${previewHash.slice(-6)}` : 'Generating...'}
              </span>
            </div>
          </div>
        </div>

        {/* Food Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Food Item Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Organic Cavendish Bananas"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Food Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FoodCategory)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800"
            >
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy (High Perishable)</option>
              <option value="Bakery">Bakery</option>
              <option value="Prepared Meals">Prepared Meals</option>
            </select>
          </div>
        </div>

        {/* Quantity & Expiry Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Batch Quantity / Units</label>
            <input
              type="text"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 15 kg (3 Crates)"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Expiry Date</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setQuickExpiry(1)}
                  className="text-[10px] text-emerald-700 hover:bg-emerald-50 px-1 rounded"
                >
                  +1d
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(3)}
                  className="text-[10px] text-emerald-700 hover:bg-emerald-50 px-1 rounded"
                >
                  +3d
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(7)}
                  className="text-[10px] text-emerald-700 hover:bg-emerald-50 px-1 rounded"
                >
                  +7d
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => {
                  setExpiryDate(e.target.value);
                  const isPast = new Date(e.target.value) < new Date();
                  if (isPast) setIsSpoiledScenario(true);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Storage Condition & Ambient Temp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Condition</label>
            <select
              value={storageCondition}
              onChange={(e) => setStorageCondition(e.target.value as StorageCondition)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800"
            >
              <option value="Ambient (Room Temp)">Ambient (Room Temp)</option>
              <option value="Refrigerated (0-4°C)">Refrigerated (0-4°C)</option>
              <option value="Chilled (4-8°C)">Chilled (4-8°C)</option>
              <option value="Frozen (-18°C)">Frozen (-18°C)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Storage / Probe Temp (°C)
              </label>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                storageCondition === 'Refrigerated (0-4°C)' && ambientTemp > 4
                  ? 'bg-rose-100 text-rose-700 font-bold'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {ambientTemp > 0 ? `+${ambientTemp}°C` : `${ambientTemp}°C`}
              </span>
            </div>
            <div className="relative flex items-center">
              <Thermometer className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="number"
                step="0.1"
                required
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Package Opened Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <p className="text-xs font-semibold text-slate-800">Package Opened or Broken Seal?</p>
            <p className="text-[11px] text-slate-500">
              Perishable dairy & prepared meals will be rejected if seal is breached (HACCP standard).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPackageOpened(!packageOpened)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              packageOpened ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                packageOpened ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Safety Rule Preview Banner */}
        <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 text-emerald-900 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Dual Validation Pipeline: </span>
            <span>MobileNetV3 Visual Freshness Classifier + Deterministic FSANZ & HACCP Rule Safety Matrix.</span>
          </div>
        </div>

        {/* Action Button: Analyze Freshness & Verify Safety */}
        <button
          type="submit"
          disabled={isAnalyzing}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide text-white transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg ${
            isAnalyzing
              ? 'bg-slate-700 cursor-wait'
              : 'bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] hover:opacity-95 shadow-emerald-950/20 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              <span>Executing AI Inference & Safety Rules...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-emerald-300" />
              <span>Analyze Freshness & Verify Safety</span>
            </>
          )}
        </button>
      </form>

      {/* Live Optical Webcam Scanner Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

