"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  BarChart3, 
  FileText, 
  Gift, 
  Users, 
  TrendingUp,
  Plus,
  ChevronRight
} from 'lucide-react'

export default function PartnerDashboard() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
    activeCoupons: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // プロトタイプ用のダミーデータ
    setStats({
      totalQuizzes: 3,
      totalAttempts: 157,
      averageScore: 72,
      activeCoupons: 2
    })
  }

  const quickLinks = [
    {
      title: '新しいクイズを作成',
      description: 'AIアシスト付きでクイズを作成',
      href: '/partner/quizzes/new',
      icon: Plus,
      color: 'text-primary'
    },
    {
      title: 'クイズ管理',
      description: '作成したクイズの編集・確認',
      href: '/partner/quizzes',
      icon: FileText,
      color: 'text-accent'
    },
    {
      title: 'クーポン管理',
      description: 'クーポンの発行・管理',
      href: '/partner/coupons',
      icon: Gift,
      color: 'text-warning'
    },
    {
      title: 'プロフィール',
      description: '事業者情報の編集',
      href: '/partner/profile',
      icon: Users,
      color: 'text-success'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">事業者ダッシュボード</h1>
          <p className="text-gray-600">クイズとクーポンの管理</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">公開中のクイズ</span>
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
            <p className="text-xs text-gray-500 mt-1">すべて公開中</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">総受験回数</span>
              <Users className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold">{stats.totalAttempts}</p>
            <p className="text-xs text-success mt-1">+12% 先月比</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">平均スコア</span>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-2xl font-bold">{stats.averageScore}%</p>
            <p className="text-xs text-gray-500 mt-1">全クイズ平均</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">有効クーポン</span>
              <Gift className="w-5 h-5 text-warning" />
            </div>
            <p className="text-2xl font-bold">{stats.activeCoupons}</p>
            <p className="text-xs text-gray-500 mt-1">発行可能</p>
          </div>
        </div>

        {/* クイックリンク */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="card hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-surface flex items-center justify-center ${link.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* 最近の活動 */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">最近の活動</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">「パンの保存基礎」が10回受験されました</p>
                <p className="text-sm text-gray-600">2時間前</p>
              </div>
              <span className="text-sm text-success">+10</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">クーポンが1枚使用されました</p>
                <p className="text-sm text-gray-600">5時間前</p>
              </div>
              <span className="text-sm text-warning">使用済</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">新しいクイズ「タイヤの基本知識」を公開</p>
                <p className="text-sm text-gray-600">昨日</p>
              </div>
              <span className="text-sm text-primary">公開</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}