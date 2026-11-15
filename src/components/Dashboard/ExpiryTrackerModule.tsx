import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  AlertOctagon, 
  Thermometer, 
  ShieldCheck, 
  ArrowRight, 
  Tag, 
  Heart, 
  Flame, 
  Snowflake, 
  BarChart3, 
  Layers,
  ExternalLink,
  Store,
  Database,
  RotateCcw
} from 'lucide-react';
import { ExpiryTrackedItem, FoodBatch } from '../../types';
import { fetchExpiryTracker } from '../../utils/api';

interface ExpiryTrackerModuleProps {
  batches: FoodBatch[];
  onNavigateToSell: () => void;
  onNavigateToBuy: () => void;
}

export function ExpiryTrackerModule({
  batches,
  onNavigateToSell,
  onNavigateToBuy,
}: ExpiryTrackerModuleProps) {
  const [trackedItems, setTrackedItems] = useState<ExpiryTrackedItem[]>([]);
  const [urgencyFilter, setUrgencyFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'SAFE'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Compute shelf-life urgency from live batches or backend API
  const loadTracker = async (silent: boolean = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const apiData = await fetchExpiryTracker();
      if (apiData && apiData.length > 0) {
        setTrackedItems(apiData);
      } else if (batches && batches.length > 0) {
        // Fallback compute locally from batches
        const now = new Date();
        const computed: ExpiryTrackedItem[] = batches.map((b) => {
          const expTime = new Date(b.expiryDate);
          const diffHours = Math.max(0, Math.round(((expTime.getTime() - now.getTime()) / (1000 * 60 * 60)) * 10) / 10);
          
          let urgency: 'CRITICAL' | 'WARNING' | 'SAFE' | 'EXPIRED' = 'SAFE';
          let action = 'Optimal Storage Compliance — Regular Inventory';

          if (diffHours <= 0) {
            urgency = 'EXPIRED';
            action = 'Immediate Condemnation & Compost Disposal';
          } else if (diffHours < 12) {
            urgency = 'CRITICAL';
            action = 'Urgent 70% Clearance Markdown or Immediate Charity Dispatch';
          } else if (diffHours <= 36) {
            urgency = 'WARNING';
            action = 'Recommend 30% - 50% Flash Sale Markdown';
          }

          return {
            id: b.id,
            food_name: b.name,
            category: b.category,
            batch_quantity: b.quantity,
            expiry_date: b.expiryDate,
            storage_condition: b.storageCondition,
            storage_temp: b.ambientTemp,
            image_url: b.imageUrl,
            sha256_hash: b.evaluation?.sha256Hash || '0'.repeat(64),
            cnn_freshness_score: b.evaluation?.cnnConfidence || 92,
            listing_type: b.listingType === 'clearance' ? 'SALE' : 'DONATION',
            original_price: b.clearanceDetails?.originalPrice || 600.0,
            sale_price: b.clearanceDetails?.salePrice || 250.0,
            discount_percent: b.clearanceDetails?.discountPercent || 50,
            shelf_location: b.clearanceDetails?.shelfLocation || 'Aisle 3',
            status: b.status,
            hours_remaining: diffHours,
            urgency: urgency,
            recommended_action: action,
            donor_name: b.supermarketName,
            donor_org: b.supermarketName,
          };
        });
        computed.sort((a, b) => a.hours_remaining - b.hours_remaining);
        setTrackedItems(computed);
      }
    } catch (e) {
      console.error('Error loading expiry tracker:', e);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracker(false);
  }, [batches]);

  const criticalCount = trackedItems.filter((i) => i.urgency === 'CRITICAL').length;
  const warningCount = trackedItems.filter((i) => i.urgency === 'WARNING').length;
  const safeCount = trackedItems.filter((i) => i.urgency === 'SAFE').length;

  const filteredItems = trackedItems.filter((item) => {
    if (urgencyFilter === 'ALL') return true;
    return item.urgency === urgencyFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Shelf-Life & Waste Monitor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time urgency prioritization, markdown recommendations, and cold-chain temperature compliance.
          </p>
        </div>

        {/* Urgency Summary Chips & Live Sync Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => loadTracker(false)}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            title="Refresh real-time data from MongoDB Atlas"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs flex items-center gap-2 text-rose-800 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>{criticalCount} Critical (&lt;12h)</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center gap-2 text-amber-800 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>{warningCount} Warning (12-36h)</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-xs flex items-center gap-2 text-green-800 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span>{safeCount} Safe (&gt;36h)</span>
          </div>
        </div>
      </div>

      {/* Main Table Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setUrgencyFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              urgencyFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Inventory ({trackedItems.length})
          </button>
          <button
            onClick={() => setUrgencyFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              urgencyFilter === 'CRITICAL'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Critical &lt;12h ({criticalCount})</span>
          </button>
          <button
            onClick={() => setUrgencyFilter('WARNING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              urgencyFilter === 'WARNING'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Warning 12-36h ({warningCount})</span>
          </button>
          <button
            onClick={() => setUrgencyFilter('SAFE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              urgencyFilter === 'SAFE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Safe &gt;36h ({safeCount})</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Sorted automatically by nearest expiration deadline
        </span>
      </div>

      {/* Expiry Urgency Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Produce Specimen</th>
                <th className="py-3 px-4">Storage & Temp</th>
                <th className="py-3 px-4">Freshness Score</th>
                <th className="py-3 px-4">Hours Left</th>
                <th className="py-3 px-4">Urgency Tier</th>
                <th className="py-3 px-4">Recommended Proactive Action</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">No Food Batches in This Urgency Tier</p>
                      <p className="text-[11px] text-slate-500">
                        {urgencyFilter !== 'ALL'
                          ? `There are currently no items under "${urgencyFilter}".`
                          : 'No tracked inventory found. Click Live Sync to refresh from MongoDB Atlas.'}
                      </p>
                      <button
                        onClick={() => {
                          setUrgencyFilter('ALL');
                          loadTracker(false);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Filter & Sync</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isCritical = item.urgency === 'CRITICAL';
                  const isWarning = item.urgency === 'WARNING';

                return (
                  <tr
                    key={item.id}
                    className={`transition hover:bg-slate-50/70 ${
                      isCritical ? 'bg-rose-50/30' : isWarning ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Item */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url}
                          alt={item.food_name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.food_name}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span className="truncate">{item.batch_quantity}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Storage */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Thermometer className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="font-semibold">{item.storage_temp}°C</span>
                        <span className="text-[10px] text-slate-400">({item.storage_condition.split(' ')[0]})</span>
                      </div>
                    </td>

                    {/* Freshness */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {Math.round(item.cnn_freshness_score)}%
                        </span>
                      </div>
                    </td>

                    {/* Hours Remaining */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span
                          className={`font-mono font-bold ${
                            isCritical
                              ? 'text-rose-700 text-sm'
                              : isWarning
                              ? 'text-amber-800'
                              : 'text-slate-700'
                          }`}
                        >
                          {item.hours_remaining} hrs
                        </span>
                      </div>
                    </td>

                    {/* Urgency Tier */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          <AlertOctagon className="w-3 h-3 text-rose-600" />
                          Critical
                        </span>
                      ) : isWarning ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Safe
                        </span>
                      )}
                    </td>

                    {/* Strategic Recommendation */}
                    <td className="py-3.5 px-4">
                      <p className="text-[11px] font-medium text-slate-700 max-w-xs leading-snug">
                        {item.recommended_action}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isCritical ? (
                        <button
                          onClick={onNavigateToBuy}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] shadow-sm transition flex items-center gap-1 ml-auto"
                        >
                          <span>Claim / Dispatch</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : isWarning ? (
                        <button
                          onClick={onNavigateToBuy}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] shadow-sm transition flex items-center gap-1 ml-auto"
                        >
                          <span>View Sale</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={onNavigateToBuy}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition ml-auto"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FSANZ & HACCP Storage Safety Temperature Guidelines Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              FSANZ & HACCP Critical Storage Temperature Reference
            </h3>
            <p className="text-xs text-slate-500">
              Statutory thermal holding thresholds required by Food Standards Australia New Zealand (FSANZ Standard 3.2.2)
            </p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
            Standard 3.2.2
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">Perishable Dairy & Chilled</span>
              <Snowflake className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-blue-700 mt-2">&lt; 5.0°C</div>
            <p className="text-[11px] text-blue-800 mt-1">
              Milk, yogurt, cheeses, poultry. Prevents Listeria monocytogenes proliferation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">Frozen Food Stock</span>
              <Snowflake className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-700 mt-2">&lt; -18.0°C</div>
            <p className="text-[11px] text-indigo-800 mt-1">
              Zero tolerance thaw threshold. Microbial dormancy guaranteed.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">Ambient Fresh Produce</span>
              <Thermometer className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-2">15°C - 22°C</div>
            <p className="text-[11px] text-emerald-800 mt-1">
              Apples, citrus, root vegetables. Proper airflow & ethylene segregation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Hot Cooked Prepared Meals</span>
              <Flame className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-700 mt-2">&gt; 60.0°C</div>
            <p className="text-[11px] text-amber-800 mt-1">
              Danger zone (&gt;5°C and &lt;60°C) strictly prohibited over 2 hours (HACCP 2h/4h rule).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

