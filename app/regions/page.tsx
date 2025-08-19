import SimpleJapanMap from '@/components/SimpleJapanMap';
import { PREFS } from '@/data/prefectures';
import { Search, MapPin, TrendingUp, Star } from 'lucide-react';

export const dynamic = 'force-static';

export default function RegionsPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q || '').trim();
  const list = q
    ? PREFS.filter(p => p.nameJa.includes(q) || p.nameEn.toLowerCase().includes(q.toLowerCase()))
    : PREFS;

  // ブロックごとに都道府県をグループ化
  const groupedPrefs = PREFS.reduce((acc, pref) => {
    if (!acc[pref.block]) {
      acc[pref.block] = [];
    }
    acc[pref.block].push(pref);
    return acc;
  }, {} as Record<string, typeof PREFS>);

  const blockOrder = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄'];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gradient-from to-gradient-to">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#2E5D50] via-brand-primary/90 to-[#3A9BDC]/80 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            都道府県を選ぶ
            <span className="block text-2xl md:text-3xl font-normal text-white/80 mt-2">
              Choose your prefecture
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            選択すると、そのエリア向けダッシュボードに移動します。
            <span className="block text-base text-white/70 mt-1">
              Select a region to open a local dashboard.
            </span>
          </p>
        </div>
        
        {/* 装飾的な背景要素 */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 検索セクション */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="q" 
                defaultValue={q}
                placeholder="都道府県名で検索（例：長野 / Nagano）"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-lg text-gray-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent shadow-md transition-all"
              />
            </div>
          </div>
        </section>

        {/* メインコンテンツ：地図と一覧 */}
        <section className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* 日本地図 */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#2E5D50]" />
              <h2 className="text-2xl font-bold text-gray-900">
                地図で選択
                <span className="block text-sm font-normal text-gray-500">Select on Map</span>
              </h2>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200">
              <SimpleJapanMap />
            </div>
          </div>

          {/* 一覧表示 */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#3A9BDC]" />
              <h2 className="text-2xl font-bold text-gray-900">
                一覧で選択
                <span className="block text-sm font-normal text-gray-500">Select from List</span>
              </h2>
            </div>
            
            {q && (
              <div className="mb-4 p-3 bg-[#3A9BDC]/10 border border-[#3A9BDC]/20 rounded-xl">
                <p className="text-sm text-[#3A9BDC]">
                  「{q}」の検索結果: {list.length}件
                </p>
              </div>
            )}

            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {list.map(p => (
                <a
                  key={p.code}
                  href={`/?pref=${encodeURIComponent(p.nameJa)}`}
                  className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#3A9BDC]/30 rounded-xl p-4 transition-all duration-200 hover:shadow-lg"
                  title={p.nameEn}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#2E5D50] to-[#3A9BDC] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {p.code}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 group-hover:text-[#2E5D50] transition-colors">
                          {p.nameJa}
                        </span>
                        <span className="block text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                          {p.nameEn}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                      {p.block}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ブロック別グループ表示 */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              地域ブロック別
              <span className="block text-lg font-normal text-gray-500">By Region Block</span>
            </h2>
          </div>

          {blockOrder.map(block => (
            <div key={block} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-[#2E5D50] pl-4">
                {block}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {groupedPrefs[block]?.map(pref => (
                  <a
                    key={pref.code}
                    href={`/?pref=${encodeURIComponent(pref.nameJa)}`}
                    className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#3A9BDC]/30 rounded-xl p-3 text-center transition-all duration-200 hover:shadow-lg hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#2E5D50] to-[#3A9BDC] rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto mb-2">
                      {pref.code}
                    </div>
                    <div className="text-sm font-medium text-gray-900 group-hover:text-[#2E5D50] transition-colors">
                      {pref.nameJa}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                      {pref.nameEn}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* 最近選択した地域 */}
        <section className="mt-16 bg-white rounded-3xl p-8 shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-[#3A9BDC]" />
            <h2 className="text-2xl font-bold text-gray-900">
              最近選んだ地域
              <span className="block text-sm font-normal text-gray-500">Recently Selected</span>
            </h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {['長野県', '東京都', '北海道'].map((pref, index) => (
              <a 
                key={pref}
                href={`/?pref=${encodeURIComponent(pref)}`}
                className="px-4 py-2 rounded-full border border-[#3A9BDC]/30 bg-[#3A9BDC]/5 hover:bg-[#3A9BDC]/10 hover:border-[#3A9BDC]/50 transition-all duration-200 text-sm font-medium text-[#3A9BDC] hover:text-[#2E5D50]"
              >
                {pref}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
