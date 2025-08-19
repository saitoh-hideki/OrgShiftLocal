'use client';
import { MapPin, ChevronRight } from 'lucide-react';

interface PrefSelectorProps {
  pref: string | null;
}

export default function PrefSelector({ pref }: PrefSelectorProps) {
  if (!pref) return null;

  return (
    <div className="bg-gradient-to-r from-[#2E5D50]/5 to-[#3A9BDC]/5 border border-[#2E5D50]/20 rounded-2xl p-6 mb-8 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#2E5D50] to-[#3A9BDC] rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#2E5D50] mb-1">
              地域選択中 / Region Selected
            </h3>
            <p className="text-gray-600">
              <span className="font-medium">{pref}</span>の情報を表示中
              <span className="block text-sm text-gray-500">
                Showing information for {pref}
              </span>
            </p>
          </div>
        </div>
        <a 
          href="/regions" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-[#3A9BDC]/30 hover:border-[#3A9BDC]/50 rounded-xl text-[#3A9BDC] hover:text-[#2E5D50] font-medium transition-all duration-200 hover:shadow-lg"
        >
          <span>地域を変更</span>
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
