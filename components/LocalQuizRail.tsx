"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Quiz } from '@/types'
import QuizCard from './QuizCard'

export default function LocalQuizRail() {
  const [activeTab, setActiveTab] = useState<'gov' | 'business'>('gov')
  const [govQuizzes, setGovQuizzes] = useState<Quiz[]>([])
  const [businessQuizzes, setBusinessQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      // 行政系クイズ
      const { data: govData, error: govError } = await supabase
        .from('quizzes')
        .select('*, org:orgs(*)')
        .eq('status', 'published')
        .in('category', ['waste', 'disaster', 'library', 'health', 'tax'])
        .order('created_at', { ascending: false })
        .limit(12)

      if (govError) throw govError
      setGovQuizzes(govData || [])

      // 事業者系クイズ
      const { data: bizData, error: bizError } = await supabase
        .from('quizzes')
        .select('*, org:orgs(*)')
        .eq('status', 'published')
        .not('org_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(12)

      if (bizError) throw bizError
      setBusinessQuizzes(bizData || [])
    } catch (error) {
      console.error('Failed to fetch quizzes:', error)
      // フォールバックデータ
      setGovQuizzes([
        {
          id: '1',
          title: 'ごみ分別基礎',
          description: '正しいごみの分別方法を学ぼう',
          category: 'waste',
          tags: ['ごみ', '分別'],
          difficulty: 'easy',
          status: 'published',
          trust_score: 0,
          version: 1,
          locale: 'ja-JP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setBusinessQuizzes([
        {
          id: '2',
          title: 'パンの保存基礎',
          description: '美味しさを保つパンの保存方法',
          category: 'bakery',
          tags: ['パン', '保存'],
          difficulty: 'easy',
          status: 'published',
          trust_score: 0,
          version: 1,
          locale: 'ja-JP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          org: {
            id: '1',
            name: 'ベーカリー花',
            category: 'bakery',
            verified: true,
            created_at: new Date().toISOString(),
          },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const displayQuizzes = activeTab === 'gov' ? govQuizzes : businessQuizzes

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('gov')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'gov'
              ? 'text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          行政系
          {activeTab === 'gov' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'business'
              ? 'text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          事業者系
          {activeTab === 'business' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  )
}