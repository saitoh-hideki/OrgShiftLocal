"use client"

import Link from 'next/link'
import { Search, Bot, User, Globe, Menu, Home, Shield, Heart, BookOpen, Bus, HelpCircle, Bell } from 'lucide-react'
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
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側：ブランドロゴ */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  OrgShift Local
                </span>
                <span className="text-xs text-gray-500 -mt-1 font-medium">地域ポータル</span>
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
                  className="group relative px-4 py-2 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
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
                className="w-64 pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            {/* 通知ベル */}
            <button className="relative p-2.5 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group">
              <Bell className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
            </button>
            
            {/* AIナビゲーター */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">AI</span>
            </button>
            
            {/* 地域選択ピル */}
            <CurrentPrefPill />
            
            {/* モバイルメニューボタン */}
            <button 
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100/50 bg-white/95 backdrop-blur-md animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              {/* モバイル検索 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="サービスを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              {/* モバイルナビゲーション */}
              <div className="space-y-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* モバイルアクション */}
              <div className="pt-3 border-t border-gray-100/50">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm font-medium">AIナビゲーター</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}