'use client';
import { useEffect, useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

export default function CurrentPrefPill() {
  const [pref, setPref] = useState<string>('');
  
  useEffect(() => {
    // URL ?pref=.. があればそれを優先して保存
    const url = new URL(window.location.href);
    const p = url.searchParams.get('pref');
    const saved = localStorage.getItem('osl_pref') || '';
    
    if (p) {
      setPref(p);
      localStorage.setItem('osl_pref', p);
    } else if (saved) {
      setPref(saved);
    }
  }, []);

  if (!pref) {
    return (
      <a 
        href="/regions" 
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 bg-white hover:bg-gray-50 hover:border-[#3A9BDC]/30 transition-all duration-200 group"
      >
        <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#3A9BDC] transition-colors" />
        <div className="text-left">
          <span className="block text-sm font-medium text-gray-900 group-hover:text-[#2E5D50] transition-colors">
            地域を選択
          </span>
          <span className="block text-xs text-gray-500">
            Select Region
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#3A9BDC] transition-colors" />
      </a>
    );
  }

  return (
    <a 
      href="/regions" 
      className="inline-flex items-center gap-3 rounded-xl border border-[#E6EBEE] px-4 py-2 bg-white hover:bg-[#F7F9FB] hover:border-sky-400/40 transition-all duration-200 group"
    >
      <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
        <MapPin className="w-4 h-4 text-white" />
      </div>
      <div className="text-left">
        <span className="block text-sm font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">
          {pref}
        </span>
        <span className="block text-xs text-gray-500">
          Current Region
        </span>
      </div>
      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-sky-500 transition-colors" />
    </a>
  );
}
