"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Link as LinkType } from '@/types'
import Link from 'next/link'
import { 
  Trash2, Shield, BookOpen, Heart, 
  Baby, Bus, FileText, Building,
  ExternalLink, ChevronRight, Star
} from 'lucide-react'

const iconMap: { [key: string]: any } = {
  'recycle': Trash2,
  'shield': Shield,
  'book-open': BookOpen,
  'heart': Heart,
  'baby': Baby,
  'bus': Bus,
  'file-text': FileText,
  'building': Building,
}

// カテゴリマッピングを統一（カテゴリページのスラッグと一致させる）
const categoryMapping: { [key: string]: string } = {
  'waste': 'life',
  'disaster': 'safety',
  'library': 'future',
  'health': 'health',
  'childcare': 'childcare',
  'transport': 'life',
  'tax': 'procedures',
  'facility': 'life',
  'event': 'future',
}

const categoryLabels: { [key: string]: { ja: string; en: string; color: string; gradient: string } } = {
  'waste': { 
    ja: 'ごみ・リサイクル', 
    en: 'Waste & Recycling', 
    color: 'bg-green-100 text-green-700 border-green-200',
    gradient: 'from-green-50 to-emerald-50'
  },
  'disaster': { 
    ja: '防災・安全', 
    en: 'Disaster & Safety', 
    color: 'bg-red-100 text-red-700 border-red-200',
    gradient: 'from-red-50 to-pink-50'
  },
  'library': { 
    ja: '図書館・学習', 
    en: 'Library & Learning', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    gradient: 'from-blue-50 to-cyan-50'
  },
  'health': { 
    ja: '健康・医療', 
    en: 'Health & Medical', 
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    gradient: 'from-pink-50 to-rose-50'
  },
  'childcare': { 
    ja: '子育て・教育', 
    en: 'Childcare & Education', 
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    gradient: 'from-purple-50 to-violet-50'
  },
  'transport': { 
    ja: '交通・移動', 
    en: 'Transport & Mobility', 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    gradient: 'from-orange-50 to-amber-50'
  },
  'tax': { 
    ja: '税金・手続き', 
    en: 'Tax & Procedures', 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    gradient: 'from-gray-50 to-slate-50'
  },
  'facility': { 
    ja: '施設・予約', 
    en: 'Facilities & Booking', 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    gradient: 'from-indigo-50 to-blue-50'
  },
  'event': { 
    ja: 'イベント・講座', 
    en: 'Events & Courses', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    gradient: 'from-yellow-50 to-orange-50'
  },
}

export default function GovShortcutGrid() {
  const [links, setLinks] = useState<LinkType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('type', 'gov')
        .eq('is_active', true)
        .order('order_index')
        .limit(showAll ? 50 : 9) // 3列×3行で9個表示

      if (error) throw error
      setLinks(data || [])
    } catch (error) {
      console.error('Failed to fetch links:', error)
      // フォールバック用のダミーデータ
      setLinks([
        { id: '1', category: 'waste', title: 'ごみ分別早見表', description: '分別ルールと収集日を確認', url: 'https://www.env.go.jp/recycle/waste/', icon: 'recycle', type: 'gov', order_index: 1, is_active: true, created_at: '' },
        { id: '2', category: 'disaster', title: '防災マップ', description: '避難所と危険箇所の確認', url: 'https://www.bousai.go.jp/', icon: 'shield', type: 'gov', order_index: 2, is_active: true, created_at: '' },
        { id: '3', category: 'library', title: '図書館予約', description: '資料検索と予約システム', url: 'https://www.jla.or.jp/', icon: 'book-open', type: 'gov', order_index: 3, is_active: true, created_at: '' },
        { id: '4', category: 'health', title: '健康診断予約', description: '市民健診の予約', url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kenkounippon21/index.html', icon: 'heart', type: 'gov', order_index: 4, is_active: true, created_at: '' },
        { id: '5', category: 'childcare', title: '子育て支援', description: '子育て支援情報', url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kodomo/kodomo_kosodate/', icon: 'baby', type: 'gov', order_index: 5, is_active: true, created_at: '' },
        { id: '6', category: 'transport', title: '公共交通', description: 'バス・電車の時刻表', url: 'https://www.jr.odekake.net/', icon: 'bus', type: 'gov', order_index: 6, is_active: true, created_at: '' },
        { id: '7', category: 'tax', title: '税金・手続き', description: '税金の申告と各種手続き', url: 'https://www.nta.go.jp/', icon: 'file-text', type: 'gov', order_index: 7, is_active: true, created_at: '' },
        { id: '8', category: 'facility', title: '施設予約', description: '公共施設の予約', url: 'https://www.kantei.go.jp/jp/singi/tiiki/kokusentoc/', icon: 'building', type: 'gov', order_index: 8, is_active: true, created_at: '' },
        { id: '9', category: 'event', title: 'イベント・講座', description: '地域のイベント情報', url: 'https://www.bunka.go.jp/', icon: 'calendar', type: 'gov', order_index: 9, is_active: true, created_at: '' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = (iconName?: string) => {
    if (!iconName) return ExternalLink
    return iconMap[iconName] || ExternalLink
  }

  const getCategoryInfo = (category: string) => {
    return categoryLabels[category] || { ja: 'その他', en: 'Others', color: 'bg-gray-100 text-gray-700 border-gray-200', gradient: 'from-gray-50 to-slate-50' }
  }

  const toggleShowAll = () => {
    setShowAll(!showAll)
    // 状態変更後にリンクを再取得
    setTimeout(() => fetchLinks(), 100)
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* 3列×3行のグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {links.map((link) => {
          const Icon = getIcon(link.icon)
          const categoryInfo = getCategoryInfo(link.category)
          const categorySlug = categoryMapping[link.category] || 'life'
          
          return (
            <Link
              key={link.id}
              href={`/c/${categorySlug}`}
              className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-white border border-gray-200 hover:border-[#3A9BDC]/30 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              {/* 背景グラデーション */}
              <div className={`absolute inset-0 bg-gradient-to-br ${categoryInfo.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative space-y-6">
                {/* カテゴリラベル */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${categoryInfo.color} bg-white/80 backdrop-blur-sm`}>
                  <span>{categoryInfo.ja}</span>
                  <span className="text-xs opacity-75">|</span>
                  <span className="text-xs">{categoryInfo.en}</span>
                </div>

                {/* 丸背景のアイコン */}
                <div className="w-20 h-20 bg-gradient-to-br from-[#2E5D50]/10 to-[#3A9BDC]/10 rounded-full flex items-center justify-center group-hover:from-[#2E5D50]/20 group-hover:to-[#3A9BDC]/20 transition-all duration-300 group-hover:scale-110">
                  <Icon className="w-10 h-10 text-[#2E5D50] group-hover:text-[#3A9BDC] transition-colors" />
                </div>

                {/* タイトルと説明 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#2E5D50] transition-colors line-clamp-2">
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {link.description}
                    </p>
                  )}
                </div>

                {/* アクションインジケーター */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-sm text-[#3A9BDC] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>カテゴリを見る</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span>人気</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* もっと見るボタン */}
      <div className="text-center">
        <button
          onClick={toggleShowAll}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#3A9BDC]/30 rounded-xl text-gray-700 hover:text-[#3A9BDC] font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          {showAll ? '一部表示' : 'すべてのカテゴリを見る'}
          <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${showAll ? 'rotate-90' : ''}`} />
        </button>
      </div>
    </div>
  )
}