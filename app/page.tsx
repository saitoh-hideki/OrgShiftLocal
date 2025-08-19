"use client"

import Header from '@/components/Header'
import EmergencyBanner from '@/components/EmergencyBanner'
import HeroStatus from '@/components/HeroStatus'
import AiNavigator from '@/components/AiNavigator'
import GovShortcutGrid from '@/components/GovShortcutGrid'
import LearningStrip from '@/components/LearningStrip'
import LocalQuizRail from '@/components/LocalQuizRail'
import NoticeSection from '@/components/NoticeSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <EmergencyBanner
        message="【緊急】大雪警報発令中：不要不急の外出は控えてください"
        link="https://example.city/emergency"
      />

      <main>
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-b from-surface to-white py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-bold mb-6">
                  今日の<span className="text-primary">まちの情報</span>
                </h1>
                <HeroStatus />
              </div>
              <div>
                <AiNavigator />
              </div>
            </div>
          </div>
        </section>

        {/* 行政ショートカット */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">よく使うサービス</h2>
            <GovShortcutGrid />
          </div>
        </section>

        {/* 今日の学び */}
        <section className="py-12 bg-surface">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">今日の学び</h2>
            <LearningStrip />
          </div>
        </section>

        {/* 地域クイズ */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">新着クイズ</h2>
            <LocalQuizRail />
          </div>
        </section>

        {/* お知らせ */}
        <section className="py-12 bg-surface">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">お知らせ</h2>
            <NoticeSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
