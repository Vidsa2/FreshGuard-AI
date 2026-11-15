import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, HeartHandshake, Database } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white/95 backdrop-blur-xs text-xs text-gray-500">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Col 1: Brand & Certification */}
          <div className="md:col-span-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-green-700 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-gray-900 text-sm">FreshGuard AI</span>
              <span className="text-[10px] font-semibold bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
              FreshGuard AI - Enterprise Food Safety & Zero-Waste Redistribution Network
            </p>
            <div className="flex items-center gap-2 text-[11px] text-gray-600 font-medium">
              <Lock className="w-3.5 h-3.5 text-green-600" />
              <span>TLS 1.3 & AES-256 Encrypted</span>
            </div>
          </div>

          {/* Col 2: Compliance & Food Standards */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
              Regulatory Standards
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-center gap-1.5 text-gray-600">
                <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0" />
                <span>FSANZ Standard 1.2.5 (Date Marking)</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-600">
                <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0" />
                <span>HACCP Protocols Certified</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-600">
                <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0" />
                <span>Cold Chain Protocol (&lt; 4°C / -18°C)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
              Technology & Security
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li className="text-gray-600">MobileNetV3 Binary Classification</li>
              <li className="text-gray-600">SHA-256 Ledger Audit Fingerprint</li>
              <li className="text-gray-600 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-600" />
                <span>MongoDB Atlas Dedicated Cluster</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Charity Support */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
              Operations & Impact
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li className="text-gray-600 flex items-center gap-1">
                <HeartHandshake className="w-3 h-3 text-amber-600" />
                <span>Priority Shelter Distribution</span>
              </li>
              <li className="text-gray-600">Cold-Chain Incident Hotline: 1800-FRESH-AI</li>
              <li className="text-gray-600">Emergency Dispatch: 24/7 Monitored</li>
            </ul>
          </div>

        </div>

        {/* Bottom divider and exact copyright requirement */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <div>
            FreshGuard AI - Enterprise Food Safety & Zero-Waste Redistribution Network
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span>FSANZ Standard 1.2.5 • HACCP Protocols • TLS 1.3 & AES-256 Encrypted</span>
            <span>•</span>
            <span>© 2026 FreshGuard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
