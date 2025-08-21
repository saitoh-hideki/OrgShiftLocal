'use client';

import { useState, useEffect } from 'react';
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
import LearningSettingsButton from '@/components/LearningSettingsButton'
import SectionHeader from '@/components/SectionHeader'
import CardBase from '@/components/CardBase'
import VideoSlider from '@/components/VideoSlider'
import ModalPlayer from '@/components/ModalPlayer'
import { MapPin, TrendingUp, BookOpen, Shield, Heart, Bus, FileText, Building, Calendar, Play } from 'lucide-react'

const CATS = [
  { slug:'safety', name:'防災・安心', href:'/c/safety', icon:'🛡️' },
  { slug:'life', name:'生活サポート', href:'/c/life', icon:'🏠' },
  { slug:'health', name:'健康・医療', href:'/c/health', icon:'🩺' },
  { slug:'childcare', name:'子育て・教育', href:'/c/childcare', icon:'🧒' },
  { slug:'procedures', name:'行政手続き', href:'/c/procedures', icon:'📝' },
  { slug:'subsidy', name:'補助金・助成金', href:'/subsidies', icon:'💰' },
  { slug:'digital', name:'デジタルサービス', href:'/digital-services', icon:'📱' },
  { slug:'future', name:'未来・学び', href:'/c/future', icon:'✨' },
];

// サンプル動画データ（後でAPIから取得）
const SAMPLE_VIDEOS = [
  {
    id: '1',
    title: '防災基礎知識講座',
    description: '地震や台風などの自然災害に対する基本的な備えと対応方法を学びます。',
    year: 2025,
    category: '安全',
    durationSeconds: 3600,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    target: '一般',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    materialsUrl: 'https://example.com/materials/safety-basic.pdf',
    speaker: '山田太郎'
  },
  {
    id: '2',
    title: 'デジタル化の基礎',
    description: '行政手続きのオンライン化について、基本的な操作方法を解説します。',
    year: 2025,
    category: 'IT',
    durationSeconds: 2700,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    target: '一般',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    materialsUrl: 'https://example.com/materials/digital-basic.pdf',
    speaker: '佐藤花子'
  },
  {
    id: '3',
    title: '地域の歴史と文化',
    description: '長野市の歴史的な背景と地域文化について深く学びます。',
    year: 2024,
    category: '文化',
    durationSeconds: 5400,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    target: '一般',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    materialsUrl: 'https://example.com/materials/history-culture.pdf',
    speaker: '田中一郎'
  },
  {
    id: '4',
    title: '健康管理のコツ',
    description: '日常生活で実践できる健康管理の方法を紹介します。',
    year: 2024,
    category: '健康',
    durationSeconds: 1800,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    target: '一般',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    materialsUrl: 'https://example.com/materials/health-tips.pdf',
    speaker: '鈴木美咲'
  },
  {
    id: '5',
    title: '環境問題と私たち',
    description: '地球温暖化やプラスチック問題など、身近な環境問題について考えます。',
    year: 2023,
    category: '環境',
    durationSeconds: 4500,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    target: '一般',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    materialsUrl: 'https://example.com/materials/environment.pdf',
    speaker: '高橋健太'
  },
  {
    id: '6',
    title: '子育て支援制度',
    description: '利用できる子育て支援制度と申請方法について詳しく説明します。',
    year: 2023,
    category: '子育て',
    durationSeconds: 2400,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    target: '子育て世帯',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    materialsUrl: 'https://example.com/materials/childcare-support.pdf',
    speaker: '伊藤恵子'
  }
];

export default function Home({
  searchParams,
}: {
  searchParams?: Promise<{ pref?: string }>
}) {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pref, setPref] = useState<string | null>(null);
  
  // searchParamsを解決
  useEffect(() => {
    if (searchParams) {
      searchParams.then(params => {
        setPref(params?.pref || null);
      });
    }
  }, [searchParams]);
  
  // 動画クリック時の処理
  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // 関連動画を取得（同カテゴリ、同じ動画以外）
  const getRelatedVideos = (currentVideo: any) => {
    return SAMPLE_VIDEOS.filter(video => 
      video.id !== currentVideo.id && 
      video.category === currentVideo.category
    ).slice(0, 3);
  };

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
            {/* ヒーローセクション - SaaS風モダンデザイン */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 py-20 relative overflow-hidden">
              {/* 装飾的な背景要素 */}
              <div className="absolute inset-0 opacity-50">
                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]"></div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/90 via-blue-700/95 to-cyan-700/90"></div>
              
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* メインコンテンツ - 中央配置 */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white/90">地域情報ポータル</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    <span className="text-white">{pref}</span>の
                    <span className="block text-white">まちの情報</span>
                  </h1>
                  
                  <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                    今日の行政サービス、イベント、学びの機会をお届けします。
                    <span className="block text-base text-white/70 mt-3 font-medium">
                      Today's local government services, events, and learning opportunities.
                    </span>
                  </p>
                  
                  {/* CTAボタン */}
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button className="inline-flex items-center gap-3 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                      <span>サービスを探す</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200">
                      <span>AIナビゲーター</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* 情報カード - 2カラムレイアウト */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {/* ニュースカード */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                    <HeroStatus />
                  </div>
                  
                  {/* AIナビゲーターカード */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                    <AiNavigator />
                  </div>
                </div>
                
                {/* 装飾的な背景要素 */}
                <div className="absolute top-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/10 rounded-full blur-xl"></div>
                <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
              </div>
            </section>

            {/* 8カテゴリグリッド（統一されたスタイル） */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                  title="サービスカテゴリ"
                  subtitle="Service Categories"
                  description="地域のサービスをカテゴリ別に探す"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {CATS.map(cat => (
                    <CardBase
                      key={cat.slug}
                      href={cat.href}
                      as="a"
                      variant="elevated"
                      className="text-center group hover:scale-105 transition-transform duration-200"
                    >
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </div>
                    </CardBase>
                  ))}
                </div>
              </div>
            </section>

            {/* 今月の学び（統一されたスタイル） */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center gap-4 mb-16">
                  <SectionHeader
                    title="今月の学び"
                    description="地域の特色を活かした学習コンテンツ"
                  />
                  <LearningSettingsButton />
                </div>
                <LearningStrip />
              </div>
            </section>

            {/* 過去の学び動画（新規追加） */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                  title="過去の学び動画"
                  subtitle="Past Learning Videos"
                  description="アーカイブされた学習動画をいつでも視聴できます"
                />
                <VideoSlider
                  videos={SAMPLE_VIDEOS}
                  onVideoClick={handleVideoClick}
                />
              </div>
            </section>

            {/* 地域クイズ（統一されたスタイル） */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                  title="新着学びのクイズ"
                  subtitle="Latest Learning Quizzes"
                  description="地域の知識を楽しく学べるクイズ"
                />
                <LocalQuizRail />
              </div>
            </section>

            {/* お知らせ（統一されたスタイル） */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                  title="お知らせ"
                  subtitle="Announcements"
                  description="重要な情報や更新のお知らせ"
                />
                <NoticeSection />
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* モーダルプレイヤー */}
      <ModalPlayer
        video={selectedVideo}
        relatedVideos={selectedVideo ? getRelatedVideos(selectedVideo) : []}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onVideoClick={handleVideoClick}
      />
    </div>
  );
}
