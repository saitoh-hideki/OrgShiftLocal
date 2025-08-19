"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Quiz } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Plus, Eye, Edit3, BarChart3, Calendar, Trophy } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function PartnerQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      // プロトタイプ用: 全クイズを取得（本来は org_id でフィルター）
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, org:orgs(*)')
        .not('org_id', 'is', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuizzes(data || [])
    } catch (error) {
      console.error('Failed to fetch quizzes:', error)
      // フォールバックデータ
      setQuizzes([
        {
          id: '1',
          title: 'パンの保存基礎',
          description: '美味しさを保つパンの保存方法',
          category: 'bakery',
          tags: ['パン', '保存'],
          difficulty: 'easy',
          status: 'published',
          trust_score: 85,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">公開中</span>
      case 'draft':
        return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">下書き</span>
      case 'suspended':
        return <span className="px-2 py-1 bg-danger/10 text-danger text-xs rounded-full">停止中</span>
      default:
        return null
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '初級'
      case 'medium': return '中級'
      case 'hard': return '上級'
      default: return difficulty
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">クイズ管理</h1>
            <p className="text-gray-600">作成したクイズの管理と統計</p>
          </div>
          <Link href="/partner/quizzes/new" className="btn btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新規作成
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">まだクイズがありません</h3>
            <p className="text-gray-600 mb-6">最初のクイズを作成して、お客様に知識を共有しましょう</p>
            <Link href="/partner/quizzes/new" className="btn btn-primary">
              クイズを作成
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{quiz.title}</h3>
                      {getStatusBadge(quiz.status)}
                      <span className="px-2 py-1 bg-gray-50 text-xs rounded-full">
                        {getDifficultyLabel(quiz.difficulty)}
                      </span>
                    </div>
                    
                    {quiz.description && (
                      <p className="text-gray-600 mb-3">{quiz.description}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(quiz.created_at), 'yyyy/MM/dd', { locale: ja })}
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        受験回数: 42回
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        平均スコア: 74%
                      </div>
                    </div>

                    {quiz.tags && quiz.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {quiz.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-50 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/quiz/${quiz.id}`}
                      className="p-2 text-gray-400 hover:text-accent transition-colors"
                      title="プレビュー"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                      title="編集"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-success transition-colors"
                      title="統計"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}