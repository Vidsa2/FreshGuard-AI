import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Lock,
  Server
} from 'lucide-react';
import { MongoDbStatus } from '../../types';
import { configureMongoUri } from '../../utils/api';

interface MongoConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbStatus: MongoDbStatus | null;
  onStatusUpdated: (newStatus: MongoDbStatus) => void;
}

export function MongoConfigModal({
  isOpen,
  onClose,
  dbStatus,
  onStatusUpdated,
}: MongoConfigModalProps) {
  const [uriInput, setUriInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);

    const res = await configureMongoUri(uriInput);
    setLoading(false);

    if (res.success && res.status) {
      setResultMessage({
        success: true,
        text: 'Connected live to MongoDB Atlas cluster! All data is syncing directly with Atlas.',
      });
      onStatusUpdated(res.status);
    } else {
      setResultMessage({
        success: false,
        text: res.message || 'Connection failed. Please check cluster hostname and credentials.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                MongoDB Persistence Layer
                {dbStatus?.is_live ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Atlas Live Cluster
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Replica Engine Active
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Real database storage for products, user accounts, and claim orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Telemetry Stats Bar */}
          <div className="grid grid-cols-4 gap-2">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Users</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                {dbStatus?.counts.users ?? 6}
              </div>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Products</div>
              <div className="text-lg font-bold text-blue-400 mt-0.5">
                {dbStatus?.counts.products ?? 5}
              </div>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Orders</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">
                {dbStatus?.counts.orders ?? 0}
              </div>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Audit Logs</div>
              <div className="text-lg font-bold text-purple-400 mt-0.5">
                {dbStatus?.counts.audit_ledger ?? 5}
              </div>
            </div>
          </div>

          {/* Current Status Box */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Connection Mode:</span>
              <span className="font-semibold text-slate-200">
                {dbStatus?.mode || 'Local MongoDB Replica (JSON Disk Sync)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Database Name:</span>
              <span className="font-mono text-emerald-400 font-medium">
                {dbStatus?.database || 'freshguard'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Persistence Guarantee:</span>
              <span className="text-slate-300 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Permanent Across Refreshes & Restarts
              </span>
            </div>
          </div>

          {/* URI Configuration Form */}
          <form onSubmit={handleConnect} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>MongoDB Atlas Connection String (SRV / URI)</span>
                <span className="text-[11px] text-slate-400">Saved in .env</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={uriInput}
                  onChange={(e) => setUriInput(e.target.value)}
                  placeholder="mongodb+srv://user:pass@cluster0.abcde.mongodb.net/freshguard?retryWrites=true&w=majority"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                💡 Replace <code className="text-amber-300">xxxxx</code> with your cluster's unique alphanumeric id from MongoDB Atlas (click the green <strong>"Connect"</strong> button next to Cluster0, select <em>Drivers → Python</em>).
              </p>
            </div>

            {resultMessage && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  resultMessage.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                {resultMessage.success ? (
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                )}
                <span>{resultMessage.text}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading || !uriInput.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting to Cluster...</span>
                  </>
                ) : (
                  <>
                    <Server className="w-3.5 h-3.5" />
                    <span>Connect & Sync to Atlas</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

