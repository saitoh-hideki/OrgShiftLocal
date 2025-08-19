import Header from '@/components/Header'
import EmergencyBanner from '@/components/EmergencyBanner'
import HeroStatus from '@/components/HeroStatus'
import AiNavigator from '@/components/AiNavigator'
import GovShortcutGrid from '@/components/GovShortcutGrid'
import LearningStrip from '@/components/LearningStrip'
import LocalQuizRail from '@/components/LocalQuizRail'
import NoticeSection from '@/components/NoticeSection'
import Footer from '@/components/Footer'
import PrefSelector from '@/components/PrefSelector'
import SimpleJapanMap from '@/components/SimpleJapanMap'
import { MapPin, TrendingUp, BookOpen, Shield, Heart, Bus, FileText, Building, Calendar } from 'lucide-react'

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ pref?: string }>
}) {
  const params = await searchParams;
  const pref = params?.pref || null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-gray-100/30">
      <Header />
      
      <EmergencyBanner
        message="【緊急】大雪警報発令中：不要不急の外出は控えてください"
        link="https://example.city/emergency"
      />

      <main>
        {/* 地域選択表示 */}
        {!pref && (
          <section className="bg-gradient-to-b from-[#F7F9FB] to-white py-12 md:py-16 relative overflow-hidden min-h-screen flex items-center">
            {/* 装飾的な背景要素 */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/20 to-blue-100/30"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-sky-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-sky-100/25 rounded-full blur-xl"></div>
            <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-blue-100/25 rounded-full blur-xl"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                  地域を選ぶ
                </h1>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  都道府県をクリックすると、その地域向けのサービスと情報が表示されます
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 shadow-xl max-w-5xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">都道府県から選択</h2>
                </div>
                <SimpleJapanMap />
              </div>
              
              {/* 追加の説明 */}
              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-6 py-4 shadow-lg">
                  <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-800 text-sm font-medium">
                    地域を選択すると、AIアシスタントと地域情報が利用できます
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 地域選択済み時のダッシュボード */}
        {pref && (
          <>
            {/* ヒーローセクション */}
            <section className="bg-gradient-to-br from-sky-400 via-sky-500/90 to-blue-600/80 py-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                      <span className="text-white">{pref}</span>の
                      <span className="block text-white">まちの情報</span>
                    </h1>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                      今日の行政サービス、イベント、学びの機会をお届けします。
                      <span className="block text-base text-white/70 mt-2">
                        Today's local government services, events, and learning opportunities.
                      </span>
                    </p>
                    <HeroStatus />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                    <AiNavigator />
                  </div>
                </div>
              </div>
              
              {/* 装飾的な背景要素 */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            </section>

            {/* 行政ショートカット */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    よく使うサービス
                    <span className="block text-lg font-normal text-gray-500">Frequently Used Services</span>
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    日常生活で便利な行政サービスへのアクセス
                    <span className="block text-base text-gray-500 mt-1">
                      Quick access to essential government services for daily life
                    </span>
                  </p>
                </div>
                <GovShortcutGrid />
              </div>
            </section>

            {/* 今日の学び */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    今日の学び
                    <span className="block text-lg font-normal text-gray-500">Today's Learning</span>
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    地域の特色を活かした学習コンテンツ
                    <span className="block text-base text-gray-500 mt-1">
                      Learning content featuring local characteristics
                    </span>
                  </p>
                </div>
                <LearningStrip />
              </div>
            </section>

            {/* 地域クイズ */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    新着クイズ
                    <span className="block text-lg font-normal text-gray-500">Latest Quizzes</span>
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    地域の知識を楽しく学べるクイズ
                    <span className="block text-base text-gray-500 mt-1">
                      Fun quizzes to learn about your local area
                    </span>
                  </p>
                </div>
                <LocalQuizRail />
              </div>
            </section>

            {/* お知らせ */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    お知らせ
                    <span className="block text-lg font-normal text-gray-500">Announcements</span>
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    重要な情報や更新のお知らせ
                    <span className="block text-base text-gray-500 mt-1">
                      Important information and updates
                    </span>
                  </p>
                </div>
                <NoticeSection />
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
