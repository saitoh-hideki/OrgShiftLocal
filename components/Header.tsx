"use client"

import Link from 'next/link'
import { Search, Bot, User, Globe, Menu } from 'lucide-react'
import { useState } from 'react'
import CurrentPrefPill from './CurrentPrefPill'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/living', label: 'くらし', labelEn: 'Living' },
    { href: '/disaster', label: '防災', labelEn: 'Disaster' },
    { href: '/childcare', label: '子育て', labelEn: 'Childcare' },
    { href: '/health', label: '健康', labelEn: 'Health' },
    { href: '/library', label: '図書館', labelEn: 'Library' },
    { href: '/transport', label: '交通', labelEn: 'Transport' },
    { href: '/learn', label: '学び', labelEn: 'Learn' },
    { href: '/quizzes', label: '地域クイズ', labelEn: 'Local Quiz' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側：ロゴとナビゲーション */}
          <div className="flex items-center gap-8">
            {/* ブランドロゴ */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2E5D50] to-[#3A9BDC] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 group-hover:text-[#2E5D50] transition-colors">
                  OrgShift Local
                </span>
                <span className="text-xs text-gray-500 -mt-1">地域ポータル</span>
              </div>
            </Link>

            {/* デスクトップナビゲーション */}
            <nav className="hidden lg:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative py-2"
                >
                  <span className="text-sm font-medium text-gray-600 group-hover:text-[#2E5D50] transition-colors">
                    {item.label}
                  </span>
                  <span className="block text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
                    {item.labelEn}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E5D50] group-hover:w-full transition-all duration-300"></div>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* 右側：検索・アクション・地域選択 */}
          <div className="flex items-center gap-4">
            {/* 検索バー */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="サービスを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A9BDC] focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            {/* AIアシスタントボタン */}
            <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors group relative">
              <Bot className="w-5 h-5 text-[#3A9BDC] group-hover:text-[#2E5D50] transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#3A9BDC] rounded-full animate-pulse"></span>
            </button>
            
            {/* 言語切り替えボタン */}
            <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Globe className="w-5 h-5 text-gray-500 hover:text-[#3A9BDC] transition-colors" />
            </button>
            
            {/* ユーザーメニュー */}
            <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <User className="w-5 h-5 text-gray-500 hover:text-[#3A9BDC] transition-colors" />
            </button>
            
            {/* 地域選択ピル */}
            <CurrentPrefPill />
            
            {/* モバイルメニューボタン */}
            <button 
              className="lg:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              {/* モバイル検索 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="サービスを検索..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              {/* モバイルナビゲーション */}
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.labelEn}</div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}