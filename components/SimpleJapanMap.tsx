'use client';
import { useRouter } from 'next/navigation';
import { PREFS } from '@/data/prefectures';
import { MapPin, ChevronRight } from 'lucide-react';

export default function SimpleJapanMap() {
  const router = useRouter();
  
  const handlePrefClick = (prefName: string) => {
    router.push(`/?pref=${encodeURIComponent(prefName)}`);
  };

  // 地域ブロックごとに都道府県をグループ化
  const groupedPrefs = PREFS.reduce((acc, pref) => {
    if (!acc[pref.block]) {
      acc[pref.block] = [];
    }
    acc[pref.block].push(pref);
    return acc;
  }, {} as Record<string, typeof PREFS>);

  const blockOrder = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄'];

  return (
    <div className="w-full">
      {/* 地域ブロック別表示 */}
      <div className="space-y-6">
        {blockOrder.map((block) => (
          <div key={block} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-[#2E5D50] to-[#3A9BDC] rounded-full"></div>
              <h4 className="text-lg font-semibold text-gray-800 border-b-2 border-[#2E5D50]/20 pb-1">
                {block}
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {groupedPrefs[block]?.map((pref) => (
                <button
                  key={pref.code}
                  onClick={() => handlePrefClick(pref.nameJa)}
                  className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#3A9BDC]/30 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-105 text-center"
                  title={`${pref.nameJa} (${pref.nameEn})`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2E5D50] to-[#3A9BDC] rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto mb-3">
                    {pref.code}
                  </div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#2E5D50] transition-colors text-sm">
                    {pref.nameJa}
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                    {pref.nameEn}
                  </div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-[#3A9BDC] mx-auto" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
