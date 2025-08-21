"use client"

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Quiz } from '@/types'
import { useRouter } from 'next/navigation'
import CardBase from './CardBase'
import { Brain, Shield, Heart, BookOpen, Bus, FileText, Building, Calendar, Users, Star, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'

export default function LocalQuizRail() {
  const [activeTab, setActiveTab] = useState<'gov' | 'business'>('gov')
  const [govQuizzes, setGovQuizzes] = useState<Quiz[]>([])
  const [businessQuizzes, setBusinessQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      // 行政系クイズ
      const { data: govData, error: govError } = await supabase
        .from('quizzes')
        .select('*, org:orgs(*)')
        .eq('status', 'published')
        .in('category', ['waste', 'disaster', 'library', 'health', 'tax'])
        .order('created_at', { ascending: false })
        .limit(12)

      if (govError) throw govError
      setGovQuizzes(govData || [])

      // 事業者系クイズ
      const { data: bizData, error: bizError } = await supabase
        .from('quizzes')
        .select('*, org:orgs(*)')
        .eq('status', 'published')
        .not('org_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(12)

      if (bizError) throw bizError
      setBusinessQuizzes(bizData || [])
    } catch (error) {
      console.error('Failed to fetch quizzes:', error)
      // フォールバックデータ
      setGovQuizzes([
        {
          id: '1',
          title: 'ごみ分別基礎',
          description: '正しいごみの分別方法を学ぼう',
          category: 'waste',
          tags: ['ごみ', '分別'],
          difficulty: 'easy',
          status: 'published',
          trust_score: 0,
          version: 1,
          locale: 'ja-JP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: '防災準備チェック',
          description: '災害に備えて必要な準備を確認',
          category: 'disaster',
          tags: ['防災', '災害'],
          difficulty: 'medium',
          status: 'published',
          trust_score: 0,
          version: 1,
          locale: 'ja-JP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          title: '図書館利用クイズ',
          description: '図書館の便利な使い方',
          category: 'library',
          tags: ['図書館', '本'],
          difficulty: 'easy',
          status: 'published',
          trust_score: 0,
          version: 1,
          locale: 'ja-JP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      setBusinessQuizzes([
        {
          id: '4',
          title: 'パンの保存基礎',
          description: '美味しさを保つパンの保存方法',
          category: 'bakery',
          tags: ['パン', '保存'],
          difficulty: 'easy',
          status: 'published',
          trust_score: 0,
          version: 1,
          locale: 'ja-JP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '5',
          title: 'タイヤの基本知識',
          description: '安全運転のためのタイヤ管理',
          category: 'auto',
          tags: ['車', '安全'],
          difficulty: 'medium',
          status: 'published',
          trust_score: 0,
          version: 1,
          locale: 'ja-JP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '6',
          title: '薬の正しい飲み方',
          description: '薬を安全に服用するための基礎知識',
          category: 'pharmacy',
          tags: ['薬', '健康'],
          difficulty: 'easy',
          status: 'published',
          trust_score: 0,
          version: 1,
          locale: 'ja-JP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'waste':
        return Shield
      case 'disaster':
        return Shield
      case 'library':
        return BookOpen
      case 'health':
        return Heart
      case 'tax':
        return FileText
      case 'bakery':
        return Heart
      case 'auto':
        return Bus
      case 'pharmacy':
        return Heart
      default:
        return Brain
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '初級'
      case 'medium':
        return '中級'
      case 'hard':
        return '上級'
      default:
        return '初級'
    }
  }

  const handleQuizClick = (quiz: Quiz) => {
    router.push(`/quiz/${quiz.id}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex space-x-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-md border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const currentQuizzes = activeTab === 'gov' ? govQuizzes : businessQuizzes

  return (
    <div className="space-y-8">
      {/* セクションヘッダー */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          新着クイズ
          <span className="block text-lg font-normal text-gray-600 mt-2">
            Latest Quizzes
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          地域の知識を楽しく学べるクイズに挑戦してみましょう
        </p>
      </div>

      {/* タブ切り替え */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('gov')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'gov'
                ? 'bg-white text-[#3A9BDC] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            行政系
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'business'
                ? 'bg-white text-[#3A9BDC] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            事業者系
          </button>
        </div>
      </div>

      {/* 横スクロールカルーセル */}
      <div className="relative group">
        {/* 左スクロールボタン */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[#3A9BDC] hover:border-[#3A9BDC]/30 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 右スクロールボタン */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[#3A9BDC] hover:border-[#3A9BDC]/30 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        {/* スクロールコンテナ */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {currentQuizzes.map((quiz) => {
            const CategoryIcon = getCategoryIcon(quiz.category)
            
            return (
              <div
                key={quiz.id}
                className="flex-shrink-0 w-80 snap-start"
              >
                <CardBase className="h-full group hover:scale-105 transition-transform duration-300">
                  <div className="space-y-4">
                    {/* 難易度バッジ */}
                    <div className="flex justify-between items-start">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                        {getDifficultyText(quiz.difficulty)}
                      </div>
                      <CategoryIcon className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* タイトル */}
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-[#3A9BDC] transition-colors">
                      {quiz.title}
                    </h3>

                    {/* 説明 */}
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {quiz.description}
                    </p>

                    {/* タグ */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {quiz.tags?.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* メタ情報 */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>信頼度: {quiz.trust_score || 0}</span>
                      </div>
                    </div>

                    {/* CTAボタン */}
                    <div className="pt-4">
                      <button 
                        onClick={() => handleQuizClick(quiz)}
                        className="w-full bg-gradient-to-r from-[#3A9BDC] to-[#2E5D50] hover:from-[#2E5D50] hover:to-[#3A9BDC] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                      >
                        クイズを始める
                      </button>
                    </div>
                  </div>
                </CardBase>
              </div>
            )
          })}
        </div>

        {/* グラデーションフェード（右端） */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* すべてのクイズを見るボタン */}
      <div className="text-center">
        <button className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#3A9BDC]/30 rounded-xl text-gray-700 hover:text-[#3A9BDC] font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
          すべてのクイズを見る
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}