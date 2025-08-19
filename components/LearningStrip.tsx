"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Link } from '@/types'
import { Calendar, ChevronRight, BookOpen, Users, Clock, MapPin, Shield, Smartphone } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function LearningStrip() {
  const [events, setEvents] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('type', 'event')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12)

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
      // フォールバックデータ
      setEvents([
        { id: '1', category: 'event', title: '防災入門講座', description: '初めての防災について学ぶ講座です。避難所の確認方法や非常持ち出し袋の準備など、基本的な防災知識を身につけましょう。', url: '#', type: 'event', order_index: 0, is_active: true, created_at: new Date().toISOString() },
        { id: '2', category: 'event', title: 'プログラミング教室', description: '小学生向けのプログラミング体験教室。Scratchを使ったゲーム作りを通じて、論理的思考力を育みます。', url: '#', type: 'event', order_index: 0, is_active: true, created_at: new Date().toISOString() },
        { id: '3', category: 'event', title: 'スマホ教室', description: 'シニア向けスマートフォン基本操作教室。LINEや写真撮影など、日常で使える機能を中心に学びます。', url: '#', type: 'event', order_index: 0, is_active: true, created_at: new Date().toISOString() },
        { id: '4', category: 'event', title: '地域ボランティア', description: '地域の清掃活動や高齢者見守りなど、地域貢献活動への参加を募集しています。', url: '#', type: 'event', order_index: 0, is_active: true, created_at: new Date().toISOString() },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getEventIcon = (title: string) => {
    if (title.includes('防災')) return Shield;
    if (title.includes('プログラミング')) return BookOpen;
    if (title.includes('スマホ')) return Smartphone;
    if (title.includes('ボランティア')) return Users;
    return Calendar;
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
        {events.map((event) => {
          const EventIcon = getEventIcon(event.title);
          return (
            <a
              key={event.id}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#3A9BDC]/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-[320px]"
            >
              <div className="space-y-4">
                {/* アイコンとタイトル */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2E5D50]/10 to-[#3A9BDC]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-[#2E5D50]/20 group-hover:to-[#3A9BDC]/20 transition-all duration-300">
                    <EventIcon className="w-6 h-6 text-[#2E5D50] group-hover:text-[#3A9BDC] transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-[#2E5D50] transition-colors text-lg mb-2 line-clamp-2">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(event.created_at), 'M月d日', { locale: ja })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>地域</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 説明 */}
                {event.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                )}

                {/* アクション */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>参加者募集中</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#3A9BDC] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">詳細を見る</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  )
}