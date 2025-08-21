"use client"

import { Newspaper, TrendingUp, Clock, ExternalLink } from 'lucide-react'
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
      '文化・教育': 'bg-blue-500/20 text-blue-200',
      '観光・経済': 'bg-green-500/20 text-green-200',
      '交通・インフラ': 'bg-orange-500/20 text-orange-200',
      '農業・食': 'bg-yellow-500/20 text-yellow-200',
      '防災・安全': 'bg-red-500/20 text-red-200',
      '子育て・福祉': 'bg-purple-500/20 text-purple-200'
    }
    return colors[category] || 'bg-gray-500/20 text-gray-200'
  }

  return (
    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Newspaper className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-xl">長野localニュース</h3>
          <p className="text-sm text-white/80">地域の最新情報をお届け</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <TrendingUp className="w-3 h-3" />
            <span>LIVE</span>
          </div>
        </div>
      </div>

      {/* ニュース表示エリア */}
      <div className="relative h-32 overflow-hidden">
        <div className="space-y-4">
          {newsItems.map((news, index) => (
            <div
              key={news.id}
              className={`transition-all duration-500 transform ${
                index === currentNewsIndex
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 absolute top-0 left-0 right-0'
              }`}
            >
              <div className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                        {news.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Clock className="w-3 h-3" />
                        {news.timestamp}
                      </div>
                    </div>
                    <h4 className="font-semibold text-white text-sm leading-relaxed line-clamp-2">
                      {news.title}
                    </h4>
                  </div>
                  <div className="flex-shrink-0">
                    <ExternalLink className="w-4 h-4 text-white/60" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ニュースインジケーター */}
      <div className="flex justify-center gap-2 mt-4">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentNewsIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentNewsIndex
                ? 'bg-white w-6'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* ニュース一覧へのリンク */}
      <div className="mt-4 text-center">
        <button className="text-white/80 hover:text-white text-sm underline transition-colors">
          すべてのニュースを見る
        </button>
      </div>
    </div>
  )
}