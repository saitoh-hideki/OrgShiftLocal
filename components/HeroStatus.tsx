"use client"

import { Newspaper, TrendingUp, Clock, ExternalLink, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NewsItem {
  id: string
  title: string
  category: string
  timestamp: string
  url?: string
}

export default function HeroStatus() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: '長野市で新しい図書館がオープン',
      category: '文化・教育',
      timestamp: '2時間前',
      url: '#'
    },
    {
      id: '2',
      title: '長野県の観光客数が前年比120%に',
      category: '観光・経済',
      timestamp: '4時間前',
      url: '#'
    },
    {
      id: '3',
      title: '長野県内の道路工事情報',
      category: '交通・インフラ',
      timestamp: '6時間前',
      url: '#'
    },
    {
      id: '4',
      title: '長野県の農産物直売所が拡充',
      category: '農業・食',
      timestamp: '8時間前',
      url: '#'
    },
    {
      id: '5',
      title: '長野県の防災訓練が実施予定',
      category: '防災・安全',
      timestamp: '1日前',
      url: '#'
    },
    {
      id: '6',
      title: '長野県の新しい子育て支援制度',
      category: '子育て・福祉',
      timestamp: '2日前',
      url: '#'
    }
  ])

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)

  useEffect(() => {
    // ニュースを自動的にスクロール
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length)
    }, 4000) // 4秒ごとに切り替え

    return () => clearInterval(interval)
  }, [newsItems.length])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '文化・教育': 'bg-blue-100 text-blue-700 border-blue-200',
      '観光・経済': 'bg-green-100 text-green-700 border-green-200',
      '交通・インフラ': 'bg-orange-100 text-orange-700 border-orange-200',
      '農業・食': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      '防災・安全': 'bg-red-100 text-red-700 border-red-200',
      '子育て・福祉': 'bg-purple-100 text-purple-700 border-purple-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-100/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-sm">
          <Newspaper className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-xl text-gray-900">長野localニュース</h3>
          <p className="text-sm text-gray-600">地域の最新情報をお届け</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-blue-700">LIVE</span>
        </div>
      </div>

      <div className="space-y-4">
        {newsItems.slice(currentNewsIndex, currentNewsIndex + 3).map((item, index) => (
          <div 
            key={item.id}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              index === 0 
                ? 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-blue-200/50 shadow-sm' 
                : 'bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/80'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm leading-relaxed">
                  {item.title}
                </h4>
              </div>
              {item.url && (
                <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ニュースナビゲーション */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">ニュース</span>
          <span className="text-xs font-medium text-gray-700">{currentNewsIndex + 1} / {newsItems.length}</span>
        </div>
        <div className="flex items-center gap-1">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentNewsIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentNewsIndex 
                  ? 'bg-blue-600 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}