import React, { useState } from 'react';
import { 
  Tag, 
  Store, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Database,
  Lock,
  ArrowRight,
  Heart,
  Percent
} from 'lucide-react';
import { FoodAssessmentForm, AssessmentFormData } from '../SupermarketView/FoodAssessmentForm';
import { DiagnosticResultsCard } from '../SupermarketView/DiagnosticResultsCard';
import { ClearanceConfigModal } from '../SupermarketView/ClearanceConfigModal';
import { 
  FoodBatch, 
  EvaluationResult, 
  UserProfile, 
  ClearanceDetails 
} from '../../types';
import { evaluateFoodSafety } from '../../utils/evaluationEngine';
import { saveFoodItemToDb } from '../../utils/api';

interface SellModuleProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onBatchPublished: (batch: FoodBatch) => void;
  onSwitchToDonorPersona: () => void;
}

export function SellModule({
  currentUser,
  onOpenAuth,
  onBatchPublished,
  onSwitchToDonorPersona,
}: SellModuleProps) {
  const [formData, setFormData] = useState<AssessmentFormData | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [lastPublishedId, setLastPublishedId] = useState<string | null>(null);

  const isSeller = currentUser && currentUser.role === 'donor';

  const handleAnalyze = async (data: AssessmentFormData) => {
    setFormData(data);
    setIsAnalyzing(true);
    setPublishSuccess(null);

    try {
      const result = await evaluateFoodSafety(data);
      setEvaluation(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Option 1: Donate to Charity Network
  const handleDonateBatch = async () => {
    if (!formData || !evaluation) return;
    if (!isSeller) {
      onOpenAuth();
      return;
    }

    setIsPublishing(true);
    const newBatchId = `BATCH_${Date.now()}`;

    const newBatch: FoodBatch = {
      id: newBatchId,
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      expiryDate: formData.expiryDate,
      storageCondition: formData.storageCondition,
      ambientTemp: formData.ambientTemp,
      packageOpened: formData.packageOpened,
      imageUrl: formData.imageUrl,
      supermarketName: currentUser.organizationName,
      supermarketAddress: currentUser.storeAddress || '452 Grand Avenue, Central Metro',
      distanceKm: 1.8,
      createdAt: new Date().toISOString(),
      evaluation: evaluation,
      status: 'Approved',
      listingType: 'donation',
    };

    await saveFoodItemToDb(newBatch);
    setIsPublishing(false);
    setLastPublishedId(newBatchId);
    setPublishSuccess(`Food Batch "${formData.name}" successfully published as a Charity Donation!`);
    onBatchPublished(newBatch);
  };

  // Option 2: Put into Clearance Flash Sale
  const handleConfirmClearance = async (details: ClearanceDetails) => {
    if (!formData || !evaluation) return;
    if (!isSeller) {
      setIsClearanceModalOpen(false);
      onOpenAuth();
      return;
    }

    setIsPublishing(true);
    const newBatchId = `BATCH_CLEARANCE_${Date.now()}`;

    const newBatch: FoodBatch = {
      id: newBatchId,
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      expiryDate: formData.expiryDate,
      storageCondition: formData.storageCondition,
      ambientTemp: formData.ambientTemp,
      packageOpened: formData.packageOpened,
      imageUrl: formData.imageUrl,
      supermarketName: currentUser.organizationName,
      supermarketAddress: currentUser.storeAddress || '452 Grand Avenue, Central Metro',
      distanceKm: 1.8,
      createdAt: new Date().toISOString(),
      evaluation: evaluation,
      status: 'Approved',
      listingType: 'clearance',
      clearanceDetails: details,
    };

    await saveFoodItemToDb(newBatch);
    setIsPublishing(false);
    setIsClearanceModalOpen(false);
    setLastPublishedId(newBatchId);
    setPublishSuccess(`Food Batch "${formData.name}" listed at ${details.discountPercent}% OFF (LKR ${details.salePrice.toFixed(2)}) in Clearance Storefront!`);
    onBatchPublished(newBatch);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Sell Produce & Intake
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Assess food freshness quality and list batches for discounted clearance sale or charity donation.
          </p>
        </div>

        {/* Seller Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isSeller ? (
            <div className="px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-xs flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-green-700" />
              <span className="text-gray-600">Store:</span>
              <span className="font-semibold text-green-800">{currentUser.organizationName}</span>
            </div>
          ) : (
            <button
              onClick={onSwitchToDonorPersona}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-medium text-amber-800 transition flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Switch to Store Seller Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Banner */}
      {publishSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{publishSuccess}</span>
          </div>
          <button
            onClick={() => setPublishSuccess(null)}
            className="text-xs text-emerald-700 hover:underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form & Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Intake Form with Camera & Presets */}
        <div>
          <FoodAssessmentForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>

        {/* Right Column: AI Diagnostic Results & Dual Action Buttons */}
        <div>
          <DiagnosticResultsCard
            evaluation={evaluation}
            isAnalyzing={isAnalyzing}
            foodName={formData?.name || 'Selected Specimen'}
            category={formData?.category || 'Fruits'}
            quantity={formData?.quantity || '1 Batch'}
            imageUrl={formData?.imageUrl || ''}
            onListBatch={handleDonateBatch}
            onOpenClearanceModal={() => setIsClearanceModalOpen(true)}
            isListed={lastPublishedId !== null}
          />
        </div>
      </div>

      {/* Clearance Configuration Modal */}
      {formData && (
        <ClearanceConfigModal
          isOpen={isClearanceModalOpen}
          onClose={() => setIsClearanceModalOpen(false)}
          foodName={formData.name}
          category={formData.category}
          quantity={formData.quantity}
          imageUrl={formData.imageUrl}
          onConfirmClearance={handleConfirmClearance}
        />
      )}
    </div>
  );
}

