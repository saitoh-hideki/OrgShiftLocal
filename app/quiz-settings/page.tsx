'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Calendar, Target, Users, Clock, Save, Plus, X, Edit, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  difficulty: string
  status: string
  trust_score: number
  version: number
  locale: string
  created_at: string
  updated_at: string
  org?: {
    id: string
    name: string
    category: string
    verified: boolean
    created_at: string
  }
}

export default function QuizSettingsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: '',
    tags: [''],
    difficulty: 'easy',
    status: 'draft',
    trust_score: 0,
    version: 1,
    locale: 'ja-JP'
  })

  const categories = [
    'waste',
    'disaster',
    'library',
    'health',
    'tax',
    'bakery',
    'restaurant',
    'retail',
    'service',
    'other'
  ]

  const difficulties = [
    'easy',
    'medium',
    'hard'
  ]

  const statuses = [
    'draft',
    'published',
    'archived'
  ]

  // サンプルデータ
  useEffect(() => {
    setQuizzes([
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
      }
    ])
    setLoading(false)
  }, [])

  const addQuiz = () => {
    if (newQuiz.title && newQuiz.category) {
      const quiz: Quiz = {
        id: Date.now().toString(),
        ...newQuiz,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setQuizzes([...quizzes, quiz])
      setNewQuiz({ 
        title: '', description: '', category: '', tags: [''], 
        difficulty: 'easy', status: 'draft', trust_score: 0, 
        version: 1, locale: 'ja-JP' 
      })
      setShowAddForm(false)
    }
  }

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== id))
  }

  const updateQuizStatus = (id: string, status: string) => {
    setQuizzes(quizzes.map(quiz => 
      quiz.id === id ? { ...quiz, status, updated_at: new Date().toISOString() } : quiz
    ))
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'waste': 'ごみ・環境',
      'disaster': '防災・安全',
      'library': '図書館・文化',
      'health': '健康・福祉',
      'tax': '税金・手続き',
      'bakery': 'パン・菓子',
      'restaurant': '飲食店',
      'retail': '小売店',
      'service': 'サービス業',
      'other': 'その他'
    }
    return labels[category] || category
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels: { [key: string]: string } = {
      'easy': '初級',
      'medium': '中級',
      'hard': '上級'
    }
    return labels[difficulty] || difficulty
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'draft': '下書き',
      'published': '公開中',
      'archived': 'アーカイブ'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'draft': 'bg-gray-100 text-gray-800',
      'published': 'bg-green-100 text-green-800',
      'archived': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              戻る
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">クイズ設定</h1>
              <p className="text-gray-600 mt-1">地域の知識を楽しく学べるクイズの管理</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            クイズを追加
          </button>
        </div>

        {/* クイズ追加フォーム */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">新しいクイズを追加</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="クイズのタイトル"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                <select
                  value={newQuiz.category}
                  onChange={(e) => setNewQuiz({...newQuiz, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">カテゴリを選択</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">難易度</label>
                <select
                  value={newQuiz.difficulty}
                  onChange={(e) => setNewQuiz({...newQuiz, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {getDifficultyLabel(difficulty)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                <select
                  value={newQuiz.status}
                  onChange={(e) => setNewQuiz({...newQuiz, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
                <textarea
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="クイズの説明"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={addQuiz}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md transition-colors"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        )}

        {/* クイズ一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{quiz.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteQuiz(quiz.id)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{getCategoryLabel(quiz.category)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{getDifficultyLabel(quiz.difficulty)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(quiz.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                
                {quiz.org && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{quiz.org.name}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)}`}>
                    {getStatusLabel(quiz.status)}
                  </span>
                  <span className="text-xs text-gray-500">v{quiz.version}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {quiz.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">クイズがありません</h3>
            <p className="text-gray-600 mb-4">最初のクイズを作成してみましょう</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              クイズを追加
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
