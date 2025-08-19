"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Link } from '@/types'
import { Calendar, ChevronRight } from 'lucide-react'
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
        { id: '1', category: 'event', title: '防災入門講座', description: '初めての防災', url: '#', type: 'event', order_index: 0, is_active: true, created_at: new Date().toISOString() },
        { id: '2', category: 'event', title: 'プログラミング教室', description: '小学生向け', url: '#', type: 'event', order_index: 0, is_active: true, created_at: new Date().toISOString() },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card min-w-[280px] animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 pb-4">
        {events.map((event) => (
          <a
            key={event.id}
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card min-w-[280px] hover:shadow-xl transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1 group-hover:text-accent transition-colors">
                  {event.title}
                </h4>
                {event.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {format(new Date(event.created_at), 'M月d日', { locale: ja })}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}