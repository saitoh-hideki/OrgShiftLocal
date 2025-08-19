"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Quiz } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import QuizCard from '@/components/QuizCard'
import { Search, Filter, ChevronDown } from 'lucide-react'

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'easiest'>('newest')

  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'waste', label: 'ごみ・リサイクル' },
    { value: 'disaster', label: '防災' },
    { value: 'library', label: '図書館' },
    { value: 'health', label: '健康' },
    { value: 'bakery', label: 'パン・ベーカリー' },
    { value: 'auto', label: '自動車' },
    { value: 'pharmacy', label: '薬局' },
  ]

  const difficulties = [
    { value: 'all', label: 'すべて' },
    { value: 'easy', label: '初級' },
    { value: 'medium', label: '中級' },
    { value: 'hard', label: '上級' },
  ]

  useEffect(() => {
    fetchQuizzes()
  }, [])

  useEffect(() => {
    filterAndSortQuizzes()
  }, [quizzes, searchQuery, selectedCategory, selectedDifficulty, sortBy])

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, org:orgs(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuizzes(data || [])
    } catch (error) {
      console.error('Failed to fetch quizzes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortQuizzes = () => {
    let filtered = [...quizzes]

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // カテゴリフィルター
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory)
    }

    // 難易度フィルター
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty)
    }

    // ソート
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => b.trust_score - a.trust_score)
        break
      case 'easiest':
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 }
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
        break
    }

    setFilteredQuizzes(filtered)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">地域クイズ</h1>

        {/* フィルターセクション */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 検索 */}
            <div className="relative">
              <input
                type="text"
                placeholder="クイズを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* カテゴリ */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input pr-10 w-full appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* 難易度 */}
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input pr-10 w-full appearance-none"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* ソート */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input pr-10 w-full appearance-none"
              >
                <option value="newest">新着順</option>
                <option value="popular">人気順</option>
                <option value="easiest">難易度順</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 結果表示 */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredQuizzes.length}件のクイズが見つかりました
          </p>
        </div>

        {/* クイズリスト */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">条件に一致するクイズが見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}