"use client"

import Link from 'next/link'
import { Search, Bot, User, Globe, Menu, Home, Shield, Heart, BookOpen, Bus, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import CurrentPrefPill from './CurrentPrefPill'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/living', label: '生活', icon: Home },
    { href: '/disaster', label: '防災', icon: Shield },
    { href: '/health', label: '健康・子育て', icon: Heart },
    { href: '/library', label: '図書館・学び', icon: BookOpen },
    { href: '/transport', label: '交通', icon: Bus },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側：ブランドロゴ */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                  OrgShift Local
                </span>
                <span className="text-xs text-gray-500 -mt-1">地域ポータル</span>
              </div>
            </Link>
          </div>

          {/* 中央：カテゴリナビゲーション */}
          <nav className="hidden lg:flex gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-sky-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-sky-600 transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-sky-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                </Link>
              );
            })}
          </nav>
          
          {/* 右側：検索・アクション・地域選択 */}
          <div className="flex items-center gap-3">
            {/* 検索バー */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="サービスを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            {/* 通知ベル */}
            <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors relative">
              <div className="w-5 h-5 text-gray-500 hover:text-sky-500 transition-colors">🔔</div>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
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
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-3">
              {/* モバイル検索 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="サービスを検索..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              {/* モバイルナビゲーション */}
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="p-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}