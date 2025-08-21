"use client"

import { useEffect, useState, useRef } from 'react'
import { Calendar, ChevronRight, BookOpen, Users, Clock, MapPin, Shield, Smartphone, Laptop, Camera, ShoppingCart, MessageCircle, Brain, Star, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import CardBase from './CardBase'

interface LearningContent {
  id: string
  title: string
  description: string
  category: string
  target_grade: string
  duration: string
  start_date: string
  end_date: string
  is_active: boolean
  max_participants: number
  current_participants: number
  instructor: string
  location: string
  district?: string
  created_by?: string
}

export default function LearningStrip() {
  const [contents, setContents] = useState<LearningContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLearningContents()
  }, [])

  const fetchLearningContents = async () => {
    try {
      const response = await fetch('/api/learning-contents')
      if (!response.ok) {
        throw new Error('Failed to fetch learning contents')
      }
      const data = await response.json()
      // アクティブなコンテンツのみをフィルタリング
      const activeContents = data.filter((content: LearningContent) => content.is_active)
      setContents(activeContents || [])
    } catch (error) {
      console.error('Failed to fetch learning contents:', error)
      // フォールバックデータ（スマートライフAO長野校の講座）
      setContents([
        {
          id: '1',
          title: '安全講習',
          description: '日常生活での安全意識向上と事故防止について学ぶ講座',
          category: '安全・防災',
          target_grade: '一般・成人',
          duration: '2時間',
          start_date: '2024-12-15',
          end_date: '2024-12-15',
          is_active: true,
          max_participants: 25,
          current_participants: 18,
          instructor: '田中 安全',
          location: 'スマートライフAO長野校',
          district: '長野県',
          created_by: 'スマートライフAO長野校'
        },
        {
          id: '2',
          title: 'Apple活用講座',
          description: 'iPhone・iPad・Macの基本操作から応用まで、Apple製品を活用するための講座',
          category: 'IT・デジタル',
          target_grade: '一般・成人',
          duration: '3時間',
          start_date: '2024-12-18',
          end_date: '2024-12-18',
          is_active: true,
          max_participants: 20,
          current_participants: 15,
          instructor: '佐藤 アップル',
          location: 'スマートライフAO長野校・オンライン',
          district: '長野県',
          created_by: 'スマートライフAO長野校'
        },
        {
          id: '3',
          title: '生成AI活用講座',
          description: 'ChatGPT、Bard、Claudeなどの生成AIの基本的な使い方と実用的な活用方法を学ぶ講座',
          category: 'IT・デジタル',
          target_grade: '一般・成人',
          duration: '4時間',
          start_date: '2024-12-22',
          end_date: '2024-12-22',
          is_active: true,
          max_participants: 18,
          current_participants: 16,
          instructor: '高橋 AI',
          location: 'スマートライフAO長野校・オンライン',
          district: '長野県',
          created_by: 'スマートライフAO長野校'
        },
        {
          id: '4',
          title: 'スマートフォン基本操作',
          description: 'スマートフォンの基本操作からアプリの使い方まで、初心者向けの講座',
          category: 'IT・デジタル',
          target_grade: 'シニア・一般',
          duration: '2時間',
          start_date: '2024-12-25',
          end_date: '2024-12-25',
          is_active: true,
          max_participants: 30,
          current_participants: 25,
          instructor: '鈴木 スマホ',
          location: 'スマートライフAO長野校',
          district: '長野県',
          created_by: 'スマートライフAO長野校'
        },
        {
          id: '5',
          title: 'オンラインショッピング講座',
          description: '安全で便利なオンラインショッピングの方法と注意点を学ぶ講座',
          category: 'IT・デジタル',
          target_grade: '一般・成人',
          duration: '1.5時間',
          start_date: '2024-12-28',
          end_date: '2024-12-28',
          is_active: true,
          max_participants: 25,
          current_participants: 20,
          instructor: '伊藤 ショッピング',
          location: 'スマートライフAO長野校・オンライン',
          district: '長野県',
          created_by: 'スマートライフAO長野校'
        },
        {
          id: '6',
          title: 'SNS活用講座',
          description: 'Facebook、Instagram、TwitterなどのSNSの安全な使い方と活用方法を学ぶ講座',
          category: 'IT・デジタル',
          target_grade: '一般・成人',
          duration: '2時間',
          start_date: '2024-12-30',
          end_date: '2024-12-30',
          is_active: true,
          max_participants: 20,
          current_participants: 17,
          instructor: '渡辺 SNS',
          location: 'スマートライフAO長野校・オンライン',
          district: '長野県',
          created_by: 'スマートライフAO長野校'
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
      case '安全・防災':
        return Shield
      case 'IT・デジタル':
        return Laptop
      case '健康・医療':
        return BookOpen
      case '子育て・教育':
        return Users
      default:
        return BookOpen
    }
  }

  const getStatusBadge = (current: number, max: number) => {
    const ratio = current / max
    if (ratio >= 0.9) {
      return { text: '定員間近', color: 'bg-orange-100 text-orange-700 border-orange-200' }
    } else if (ratio >= 0.7) {
      return { text: '残りわずか', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    } else {
      return { text: '受付中', color: 'bg-green-100 text-green-700 border-green-200' }
    }
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

  return (
    <div className="space-y-8">
      {/* セクションヘッダー */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          今月の学び
          <span className="block text-lg font-normal text-gray-600 mt-2">
            This Month's Learning
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          スマートライフAO長野校で開催される講座やワークショップをご紹介します
        </p>
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
          {contents.map((content) => {
            const CategoryIcon = getCategoryIcon(content.category)
            const statusBadge = getStatusBadge(content.current_participants, content.max_participants)
            const startDate = new Date(content.start_date)
            const endDate = new Date(content.end_date)
            
            return (
              <div
                key={content.id}
                className="flex-shrink-0 w-80 snap-start"
              >
                <CardBase className="h-full group hover:scale-105 transition-transform duration-300">
                  <div className="flex flex-col h-full">
                    {/* 上部コンテンツエリア */}
                    <div className="flex-1 space-y-4">
                      {/* ステータスバッジ */}
                      <div className="flex justify-between items-start">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                          {statusBadge.text}
                        </div>
                        <CategoryIcon className="w-5 h-5 text-gray-400" />
                      </div>

                      {/* タイトル */}
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-[#3A9BDC] transition-colors">
                        {content.title}
                      </h3>

                      {/* 説明 */}
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {content.description}
                      </p>

                      {/* 詳細情報 */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(startDate, 'M月d日', { locale: ja })}
                            {startDate.getTime() !== endDate.getTime() && ` - ${format(endDate, 'M月d日', { locale: ja })}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{content.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{content.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>{content.target_grade}</span>
                        </div>
                      </div>

                      {/* 定員情報 */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">定員: {content.max_participants}名</span>
                          <span className="text-[#3A9BDC] font-medium">
                            残り{content.max_participants - content.current_participants}名
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-gradient-to-r from-[#3A9BDC] to-[#2E5D50] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(content.current_participants / content.max_participants) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* CTAボタン - 下部に固定 */}
                    <div className="pt-6 mt-auto">
                      <button className="w-full bg-gradient-to-r from-[#3A9BDC] to-[#2E5D50] hover:from-[#2E5D50] hover:to-[#3A9BDC] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                        詳細を見る
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

      {/* すべての講座を見るボタン */}
      <div className="text-center">
        <button className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#3A9BDC]/30 rounded-xl text-gray-700 hover:text-[#3A9BDC] font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
          すべての講座を見る
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}