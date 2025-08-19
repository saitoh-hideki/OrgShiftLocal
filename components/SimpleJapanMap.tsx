'use client';
import { useRouter } from 'next/navigation';
import { PREFS } from '@/data/prefectures';
import { MapPin, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useState, useRef } from 'react';

export default function SimpleJapanMap() {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState<Record<string, number>>({});
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const handlePrefClick = (prefName: string) => {
    router.push(`/?pref=${encodeURIComponent(prefName)}`);
  };

  const scroll = (blockKey: string, direction: 'left' | 'right') => {
    const container = scrollContainerRefs.current[blockKey];
    if (container) {
      const scrollAmount = 300; // スクロール量
      const currentPosition = scrollPosition[blockKey] || 0;
      const newPosition = direction === 'left' 
        ? Math.max(0, currentPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, currentPosition + scrollAmount);
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(prev => ({ ...prev, [blockKey]: newPosition }));
    }
  };

  // 地域ブロックごとに都道府県をグループ化
  const groupedPrefs = PREFS.reduce((acc, pref) => {
    if (!acc[pref.block]) {
      acc[pref.block] = [];
    }
    acc[pref.block].push(pref);
    return acc;
  }, {} as Record<string, typeof PREFS>);

  // カスタムブロック定義（北海道・東北を一列、中国・四国を一列に）
  const customBlocks = [
    {
      key: 'hokkaido-tohoku',
      title: '北海道・東北',
      blocks: ['北海道', '東北']
    },
    {
      key: 'kanto',
      title: '関東',
      blocks: ['関東']
    },
    {
      key: 'chubu',
      title: '中部',
      blocks: ['中部']
    },
    {
      key: 'kinki',
      title: '近畿',
      blocks: ['近畿']
    },
    {
      key: 'chugoku-shikoku',
      title: '中国・四国',
      blocks: ['中国', '四国']
    },
    {
      key: 'kyushu-okinawa',
      title: '九州・沖縄',
      blocks: ['九州・沖縄']
    }
  ];

  return (
    <div className="w-full">
      {/* カスタムブロック別表示 */}
      <div className="space-y-8">
        {customBlocks.map((customBlock) => (
          <div key={customBlock.key} className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-sm font-semibold text-slate-600">{customBlock.title}</h3>
              <div className="h-px flex-1 bg-[#E6EBEE]"></div>
            </div>
            
            {/* 横スクロール可能な都道府県リスト */}
            <div className="relative">
              <div 
                ref={(el) => {
                  scrollContainerRefs.current[customBlock.key] = el;
                }}
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {customBlock.blocks.flatMap(block => groupedPrefs[block] || []).map((pref) => (
                  <button
                    key={pref.code}
                    onClick={() => handlePrefClick(pref.nameJa)}
                    className="group bg-white border border-[#E6EBEE] hover:shadow-lg hover:border-sky-400 rounded-2xl p-6 transition-all duration-200 hover:scale-105 text-center flex-shrink-0 min-w-[140px] h-[160px] flex flex-col justify-center focus-visible:outline-2 focus-visible:outline-sky-500 focus-visible:outline-offset-2"
                    title={`${pref.nameJa} (${pref.nameEn})`}
                  >
                    <div className="font-medium text-[#0F172A] group-hover:text-[#0F172A] transition-colors text-lg mb-3">
                      {pref.nameJa}
                    </div>
                    <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors mb-4">
                      {pref.nameEn}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                        <span>選択</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* カスタムスクロールバーのスタイル */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
