'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Calendar, Target, Users, Clock, Save, Plus, X, Edit, Eye } from 'lucide-react'
import Link from 'next/link'

interface LearningContent {
  id: string
  title: string
  description: string
  category: string
  target_grade: string
  duration: string
  start_date: string
  end_date: string
  is_active: boolean
  max_participants: number
  current_participants: number
  instructor: string
  location: string
  district?: string
  created_by?: string
}

export default function LearningSettingsPage() {
  const [contents, setContents] = useState<LearningContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    category: '',
    target_grade: '',
    duration: '',
    start_date: '',
    end_date: '',
    max_participants: 20,
    instructor: '',
    location: '',
    district: '長野県',
    created_by: '管理者'
  })

  const categories = [
    'IT・デジタル',
    '安全・防災',
    '歴史・文化',
    '環境・自然',
    '経済・産業',
    '健康・福祉',
    '教育・子育て',
    '交通・インフラ',
    '科学・技術',
    '芸術・音楽',
    'スポーツ・健康',
    'その他'
  ]

  const targetGrades = [
    '未就学児',
    '小学1年生〜3年生',
    '小学4年生〜6年生',
    '中学生',
    '高校生',
    'シニア・一般',
    '一般・成人',
    '全対象'
  ]

  // データベースから学習コンテンツを取得
  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/learning-contents')
        if (!response.ok) {
          throw new Error('Failed to fetch learning contents')
        }
        const data = await response.json()
        setContents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching learning contents:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContents()
  }, [])

  const addContent = async () => {
    if (newContent.title && newContent.category && newContent.start_date) {
      try {
        const response = await fetch('/api/learning-contents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContent),
        })

        if (!response.ok) {
          throw new Error('Failed to create learning content')
        }

        const createdContent = await response.json()
        setContents([...contents, createdContent])
        setNewContent({ 
          title: '', description: '', category: '', target_grade: '', 
          duration: '', start_date: '', end_date: '', max_participants: 20, 
          instructor: '', location: '', district: '長野県', created_by: '管理者'
        })
        setShowAddForm(false)
      } catch (err) {
        console.error('Error creating learning content:', err)
        setError('学習コンテンツの作成に失敗しました')
      }
    }
  }

  const toggleContentStatus = async (id: string) => {
    // ここでAPIを呼び出してステータスを更新する処理を追加できます
    setContents(contents.map(content => 
      content.id === id ? { ...content, is_active: !content.is_active } : content
    ))
  }

  const updateParticipants = async (id: string, participants: number) => {
    // ここでAPIを呼び出して参加者数を更新する処理を追加できます
    setContents(contents.map(content => 
      content.id === id ? { ...content, current_participants: Math.max(0, Math.min(participants, content.max_participants)) } : content
    ))
  }

  const deleteContent = (id: string) => {
    // ここでAPIを呼び出してコンテンツを削除する処理を追加できます
    setContents(contents.filter(content => content.id !== id))
  }

  const getParticipationPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100)
  }

  const getParticipationColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-blue-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F7F9FB] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">学習コンテンツを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F7F9FB] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">エラーが発生しました</p>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FB] to-white">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">今月の学び管理</h1>
                <p className="text-sm text-gray-500">学校提供の学習コンテンツ管理</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              コンテンツを追加
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">提供コンテンツ</p>
                <p className="text-2xl font-bold text-gray-900">{contents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">総参加者数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contents.reduce((sum, content) => sum + content.current_participants, 0)}人
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">定員合計</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contents.reduce((sum, content) => sum + content.max_participants, 0)}人
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">平均参加率</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contents.length > 0 
                    ? Math.round(
                        (contents.reduce((sum, content) => sum + content.current_participants, 0) / 
                         contents.reduce((sum, content) => sum + content.max_participants, 0)) * 100
                      )
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 学習コンテンツリスト */}
        <div className="space-y-6">
          {contents.map((content) => (
            <div key={content.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        content.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {content.is_active ? '募集中' : '募集終了'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{content.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {content.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {content.target_grade}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {content.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(content.start_date).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      <span className="mr-4">講師: {content.instructor}</span>
                      <span>場所: {content.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleContentStatus(content.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        content.is_active
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {content.is_active ? '募集停止' : '募集開始'}
                    </button>
                    <button
                      onClick={() => deleteContent(content.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 参加者数バー */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">参加者数</span>
                    <span className="font-medium text-gray-900">
                      {content.current_participants}人 / {content.max_participants}人
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getParticipationColor(getParticipationPercentage(content.current_participants, content.max_participants))}`}
                      style={{ width: `${getParticipationPercentage(content.current_participants, content.max_participants)}%` }}
                    ></div>
                  </div>
                </div>

                {/* 参加者数更新 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-600">参加者数を更新:</label>
                  <input
                    type="number"
                    min="0"
                    max={content.max_participants}
                    value={content.current_participants}
                    onChange={(e) => updateParticipants(content.id, parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500">人</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* コンテンツ追加フォーム */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">新しい学習コンテンツを追加</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                  <input
                    type="text"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="学習コンテンツのタイトル"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                  <select
                    value={newContent.category}
                    onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">カテゴリを選択</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">対象学年</label>
                  <select
                    value={newContent.target_grade}
                    onChange={(e) => setNewContent({...newContent, target_grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">対象学年を選択</option>
                    {targetGrades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所要時間</label>
                  <input
                    type="text"
                    value={newContent.duration}
                    onChange={(e) => setNewContent({...newContent, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="例: 2時間"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">開始日</label>
                  <input
                    type="date"
                    value={newContent.start_date}
                    onChange={(e) => setNewContent({...newContent, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
                  <input
                    type="date"
                    value={newContent.end_date}
                    onChange={(e) => setNewContent({...newContent, end_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">定員</label>
                  <input
                    type="number"
                    min="1"
                    value={newContent.max_participants}
                    onChange={(e) => setNewContent({...newContent, max_participants: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">講師名</label>
                  <input
                    type="text"
                    value={newContent.instructor}
                    onChange={(e) => setNewContent({...newContent, instructor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="講師の名前"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                  <textarea
                    value={newContent.description}
                    onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="学習コンテンツの詳細説明"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">開催場所</label>
                  <input
                    type="text"
                    value={newContent.location}
                    onChange={(e) => setNewContent({...newContent, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="開催場所"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={addContent}
                  className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  追加
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
