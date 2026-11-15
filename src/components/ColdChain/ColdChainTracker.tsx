import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Thermometer, 
  Radio, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Battery, 
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Box
} from 'lucide-react';
import { FoodBatch, DeliveryTask, DeliveryStatus, IoTTelemetryPoint } from '../../types';

interface ColdChainTrackerProps {
  batches: FoodBatch[];
  onUpdateDeliveryStatus: (batchId: string, nextStatus: DeliveryStatus) => void;
  onLogNewTemperatureProbe: (batchId: string, temp: number) => void;
  selectedBatchId?: string;
}

export const ColdChainTracker: React.FC<ColdChainTrackerProps> = ({
  batches,
  onUpdateDeliveryStatus,
  onLogNewTemperatureProbe,
  selectedBatchId: propSelectedBatchId,
}) => {
  // Find batches with delivery tasks
  const deliveryBatches = batches.filter((b) => b.deliveryTask || b.status === 'In Transit' || b.status === 'Claimed');

  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    propSelectedBatchId || deliveryBatches[0]?.id || 'BATCH-2026-8812'
  );

  useEffect(() => {
    if (propSelectedBatchId) {
      setSelectedBatchId(propSelectedBatchId);
    }
  }, [propSelectedBatchId]);

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || deliveryBatches[0] || batches[0];
  const task: DeliveryTask | undefined = activeBatch?.deliveryTask;
  const currentStatus: DeliveryStatus = task?.currentStatus || 'Assigned';

  const steps: { status: DeliveryStatus; label: string; desc: string }[] = [
    { status: 'Assigned', label: '1. Task Assigned', desc: 'Volunteer courier matched via geofence' },
    { status: 'Route Optimized', label: '2. Route Optimized', desc: 'Dijkstra shortest path with cold-chain window' },
    { status: 'Picked Up', label: '3. Picked Up (Dock Verified)', desc: 'Sensor probe locked & container sealed' },
    { status: 'Delivered', label: '4. Delivered to Shelter', desc: 'Digital receipt signed & tamper-proof closed' },
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
    if (!activeBatch) return;
    if (currentStatus === 'Assigned') {
      onUpdateDeliveryStatus(activeBatch.id, 'Route Optimized');
    } else if (currentStatus === 'Route Optimized') {
      onUpdateDeliveryStatus(activeBatch.id, 'Picked Up');
    } else if (currentStatus === 'Picked Up') {
      onUpdateDeliveryStatus(activeBatch.id, 'Delivered');
    }
  };

  const telemetry: IoTTelemetryPoint[] = task?.iotTelemetry || [
    { time: '14:00', temperature: 3.1, targetMax: 4.0, targetMin: 0.5, humidity: 82, batteryLevel: 98 },
    { time: '14:08', temperature: 3.3, targetMax: 4.0, targetMin: 0.5, humidity: 81, batteryLevel: 97 },
    { time: '14:16', temperature: 3.5, targetMax: 4.0, targetMin: 0.5, humidity: 80, batteryLevel: 96 },
    { time: '14:24', temperature: 3.2, targetMax: 4.0, targetMin: 0.5, humidity: 82, batteryLevel: 95 },
    { time: '14:32', temperature: 3.4, targetMax: 4.0, targetMin: 0.5, humidity: 83, batteryLevel: 94 },
    { time: '14:40', temperature: 3.6, targetMax: 4.0, targetMin: 0.5, humidity: 79, batteryLevel: 93 },
    { time: '14:48', temperature: 3.3, targetMax: 4.0, targetMin: 0.5, humidity: 81, batteryLevel: 92 },
    { time: '14:56', temperature: 3.4, targetMax: 4.0, targetMin: 0.5, humidity: 82, batteryLevel: 91 },
  ];

  const currentTemp = task?.currentProbeTemp || telemetry[telemetry.length - 1].temperature;
  const isTempSafe = currentTemp <= 4.0 && currentTemp >= 0.5;

  return (
    <section id="coldchain" className="py-12 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
                <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                Live IoT Telemetry • HACCP CCP-1
              </span>
              <span className="text-xs text-slate-400 font-medium">Queensland Health Transport Act</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Volunteer Cold-Chain Delivery Tracker
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mt-1">
              Active logistics dispatch board monitoring insulated transit containers. Sensor probes log real-time ambient temperature to guarantee zero microbial danger zone excursion.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-xs font-bold text-slate-700">100% Cold-Chain Integrity</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-mono text-emerald-700 font-bold">0 Temperature Breaches</span>
          </div>
        </div>

        {/* Main Cold Chain Monitoring */}
        {deliveryBatches.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-12 border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 border border-amber-200">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Active Cold-Chain Dispatches in Transit</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              When charities claim surplus batches or volunteer drivers accept transport tasks in the Surplus Marketplace, live IoT probe telemetry and the 4-step dispatch timeline will activate here.
            </p>
          </div>
        ) : (
          <>
            {/* Batch Dispatch Job Selector Tabs */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {deliveryBatches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBatchId(b.id)}
                  className={`shrink-0 text-left px-4 py-2.5 rounded-2xl border transition-all ${
                    activeBatch?.id === b.id
                      ? 'bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${activeBatch?.id === b.id ? 'bg-emerald-300' : 'bg-emerald-500'}`}></span>
                    <span className="text-xs font-bold truncate max-w-[150px]">{b.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      activeBatch?.id === b.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {b.id}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-0.5 ${activeBatch?.id === b.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                    Status: {b.deliveryTask?.currentStatus || b.status} • {b.distanceKm} km
                  </div>
                </button>
              ))}
            </div>

            {/* Main Cold Chain Monitoring Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive 4-Step Timeline & Route Details (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-xs">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          Dispatch Job: {task?.taskId || 'DELIV-LOG-901'}
                        </h3>
                        <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {currentStatus}
                        </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Cargo: <strong>{activeBatch?.name}</strong> ({activeBatch?.quantity})
                  </p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  Container: {task?.containerId || 'ISOPACK-B812'}
                </span>
              </div>
            </div>

            {/* 4-Step Interactive Timeline */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Logistics Lifecycle Progression:
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                  Step {currentIndex + 1} of 4
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {steps.map((step, idx) => {
                  const isPast = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  return (
                    <div
                      key={step.status}
                      className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[90px] ${
                        isCurrent
                          ? 'bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white border-emerald-950 shadow-md ring-2 ring-emerald-500/20'
                          : isPast
                          ? 'bg-emerald-50/80 text-emerald-950 border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-extrabold uppercase ${isCurrent ? 'text-emerald-200' : ''}`}>
                            Stage {idx + 1}
                          </span>
                          {isPast ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isCurrent ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                          )}
                        </div>
                        <p className={`text-xs font-bold line-clamp-1 ${isCurrent ? 'text-white' : ''}`}>
                          {step.status}
                        </p>
                      </div>
                      <p className={`text-[10px] mt-1 line-clamp-2 ${isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Origin & Destination Route Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Origin Supermarket Hub
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" /> Intake Dock 2
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{activeBatch?.supermarketName}</p>
                  <p className="text-[11px] text-slate-500">{activeBatch?.supermarketAddress}</p>
                </div>
              </div>

              <div className="ml-4 border-l-2 border-dashed border-emerald-300 h-3"></div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Navigation className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                      Destination Charity Shelter
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono font-bold">
                      {activeBatch?.distanceKm} km transit (~14 mins)
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {activeBatch?.claimedBy?.charityName || 'Brisbane Community Food Hub (Emergency Meals)'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Contact: Sarah Jenkins (+61 7 3840 9100) • Intake Gate C
                  </p>
                </div>
              </div>
            </div>

            {/* Advance Dispatch Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Courier: <strong>{task?.volunteerName || 'Marcus Evans (Volunteer)'}</strong></span>
              </div>

              {currentStatus !== 'Delivered' ? (
                <button
                  onClick={handleNextStep}
                  className="py-2.5 px-5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2"
                >
                  <span>
                    {currentStatus === 'Assigned' && 'Confirm Route Optimization'}
                    {currentStatus === 'Route Optimized' && 'Log Dock Cargo Pickup'}
                    {currentStatus === 'Picked Up' && 'Complete Drop-Off & Sign Receipt'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Delivery Verified & Chain Closed
                </span>
              )}
            </div>

          </div>

          {/* Right Column: Simulated IoT Cold-Chain Sensor Chart & Telemetry (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">IoT Container Sensor Telemetry</h4>
                  <p className="text-[11px] text-slate-400">Bluetooth BLE 5.2 • Probe #TH-902</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
                <span>94% Battery</span>
              </div>
            </div>

            {/* Current Real-Time Temperature Gauge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Ambient Probe Reading
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {currentTemp.toFixed(1)}°C
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isTempSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isTempSafe ? 'COMPLIANT' : 'BREACH'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Safe Threshold: <strong>0.5°C to 4.0°C</strong> (HACCP)
                </p>
              </div>

              <div className="text-right text-xs space-y-1 font-mono text-slate-300 border-l border-white/10 pl-4">
                <div>Humidity: <strong className="text-white">82%</strong></div>
                <div>Pressure: <strong className="text-white">1013 hPa</strong></div>
                <div>Sync: <strong className="text-emerald-400">Real-Time</strong></div>
              </div>
            </div>

            {/* Time-Series Temperature Chart (SVG Data Visualization) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">Transit Temperature Graph (Past 60 mins):</span>
                <span className="text-[10px] text-slate-400 font-mono">Sampling: 8 min intervals</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden">
                <svg className="w-full h-36" viewBox="0 0 320 120">
                  {/* Safe threshold band (0.5 to 4.0 °C mapped to Y) */}
                  <rect x="0" y="15" width="320" height="75" fill="#10b981" fillOpacity="0.08" />
                  
                  {/* Danger limit lines */}
                  <line x1="0" y1="15" x2="320" y2="15" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                  <text x="5" y="12" fill="#ef4444" fontSize="8" fontFamily="monospace">4.0°C Max Safe Ceiling</text>

                  <line x1="0" y1="90" x2="320" y2="90" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,3" />
                  <text x="5" y="102" fill="#0ea5e9" fontSize="8" fontFamily="monospace">0.5°C Minimum Floor</text>

                  {/* Temperature curve coordinates */}
                  <polyline
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="
                      10,65
                      50,58
                      90,52
                      130,62
                      170,55
                      210,48
                      250,57
                      290,54
                    "
                  />

                  {/* Data points */}
                  {[
                    { cx: 10, cy: 65, t: '3.1°' },
                    { cx: 50, cy: 58, t: '3.3°' },
                    { cx: 90, cy: 52, t: '3.5°' },
                    { cx: 130, cy: 62, t: '3.2°' },
                    { cx: 170, cy: 55, t: '3.4°' },
                    { cx: 210, cy: 48, t: '3.6°' },
                    { cx: 250, cy: 57, t: '3.3°' },
                    { cx: 290, cy: 54, t: '3.4°' },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.cx} cy={pt.cy} r="4" fill="#ffffff" stroke="#059669" strokeWidth="2" />
                      <text x={pt.cx - 6} y={pt.cy - 7} fill="#065f46" fontSize="7" fontWeight="bold" fontFamily="monospace">
                        {pt.t}
                      </text>
                    </g>
                  ))}
                </svg>

                <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1 px-1">
                  {telemetry.map((t, idx) => (
                    <span key={idx}>{t.time}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Probe Ping Action */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Continuous Bluetooth IoT Telemetry active.</span>
              </div>
              <button
                onClick={() => onLogNewTemperatureProbe(activeBatch.id, +(3.2 + Math.random() * 0.4).toFixed(1))}
                className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Ping Probe</span>
              </button>
            </div>

          </div>

        </div>
      </>
    )}

      </div>
    </section>
  );
};
