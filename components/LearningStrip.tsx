"use client"

import { useEffect, useState } from 'react'
import { Calendar, ChevronRight, BookOpen, Users, Clock, MapPin, Shield, Smartphone, Laptop, Camera, ShoppingCart, MessageCircle, Brain } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

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
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getContentIcon = (title: string, category: string) => {
    if (title.includes('安全') || category.includes('安全')) return Shield
    if (title.includes('Apple') || title.includes('iPhone') || title.includes('Mac')) return Laptop
    if (title.includes('AI') || title.includes('生成')) return Brain
    if (title.includes('スマホ') || title.includes('スマートフォン')) return Smartphone
    if (title.includes('写真')) return Camera
    if (title.includes('ショッピング')) return ShoppingCart
    if (title.includes('SNS')) return MessageCircle
    if (category.includes('IT') || category.includes('デジタル')) return BookOpen
    return Calendar
  }

  const getParticipationStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 80) return { text: '定員間近', color: 'text-red-500' }
    if (percentage >= 60) return { text: '残りわずか', color: 'text-yellow-500' }
    if (percentage >= 40) return { text: '募集中', color: 'text-blue-500' }
    return { text: '募集中', color: 'text-green-500' }
  }

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="flex gap-6 pb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 min-w-[320px] animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-6 pb-4">
        {contents.map((content) => {
          const ContentIcon = getContentIcon(content.title, content.category)
          const participationStatus = getParticipationStatus(content.current_participants, content.max_participants)
          const isOnline = content.location.includes('オンライン')
          
          return (
            <div
              key={content.id}
              className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-sky-400/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-[320px] cursor-pointer"
            >
              <div className="space-y-4">
                {/* アイコンとタイトル */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-sky-200 group-hover:to-blue-200 transition-all duration-300">
                    <ContentIcon className="w-6 h-6 text-sky-600 group-hover:text-sky-700 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-sky-700 transition-colors text-lg mb-2 line-clamp-2">
                      {content.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{content.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{isOnline ? 'オンライン' : '対面'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 説明 */}
                {content.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {content.description}
                  </p>
                )}

                {/* 講師と対象 */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div>講師: {content.instructor}</div>
                  <div>対象: {content.target_grade}</div>
                </div>

                {/* 参加者状況 */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3 h-3" />
                    <span className={participationStatus.color}>
                      {participationStatus.text}
                    </span>
                    <span className="text-gray-400">
                      ({content.current_participants}/{content.max_participants}人)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">詳細を見る</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}