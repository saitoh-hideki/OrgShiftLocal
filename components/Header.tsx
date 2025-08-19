"use client"

import Link from 'next/link'
import { Search, Bot, User } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  const navItems = [
    { href: '/living', label: 'くらし' },
    { href: '/disaster', label: '防災' },
    { href: '/childcare', label: '子育て' },
    { href: '/health', label: '健康' },
    { href: '/library', label: '図書館' },
    { href: '/transport', label: '交通' },
    { href: '/learn', label: '学び' },
    { href: '/quizzes', label: '地域クイズ' },
  ]

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-primary">
              OrgShift
            </Link>
            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-secondary hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 py-2 w-64 hidden md:block"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <button className="p-2 rounded-lg hover:bg-surface transition-colors">
              <Bot className="w-5 h-5 text-primary" />
            </button>
            
            <button className="p-2 rounded-lg hover:bg-surface transition-colors">
              <User className="w-5 h-5 text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}