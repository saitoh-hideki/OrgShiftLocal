"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Quiz } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Save, ChevronDown, Calendar, Gift } from 'lucide-react'

export default function NewCouponPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rewardType: 'coupon' as 'coupon' | 'stamp' | 'badge',
    startsAt: '',
    endsAt: '',
    stock: '',
    minScore: 80,
    selectedQuizIds: [] as string[]
  })

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuizzes(data || [])
    } catch (error) {
      console.error('Failed to fetch quizzes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    setIsLoading(true)
    try {
      const conditions = {
        min_score: formData.minScore,
        quiz_ids: formData.selectedQuizIds.length > 0 ? formData.selectedQuizIds : undefined
      }

      const couponData = {
        name: formData.name,
        description: formData.description,
        reward_type: formData.rewardType,
        starts_at: formData.startsAt || null,
        ends_at: formData.endsAt || null,
        stock: formData.stock ? parseInt(formData.stock) : null,
        conditions,
        org_id: 'dummy-org-id' // プロトタイプ用
      }

      const { error } = await supabase
        .from('coupons')
        .insert(couponData)

      if (error) throw error

      router.push('/partner/coupons')
    } catch (error) {
      console.error('Failed to create coupon:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuizToggle = (quizId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedQuizIds: prev.selectedQuizIds.includes(quizId)
        ? prev.selectedQuizIds.filter(id => id !== quizId)
        : [...prev.selectedQuizIds, quizId]
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">新しいクーポンを作成</h1>
          <p className="text-gray-600 mb-8">クイズ受験者への特典を設定してください</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                基本情報
              </h2>

              <div>
                <label className="label">クーポン名 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例: パン10%割引クーポン"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">説明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="クーポンの詳細や使用条件を説明してください"
                  className="input min-h-[100px]"
                />
              </div>

              <div>
                <label className="label">特典タイプ</label>
                <div className="relative">
                  <select
                    value={formData.rewardType}
                    onChange={(e) => setFormData({ ...formData, rewardType: e.target.value as any })}
                    className="input pr-10 appearance-none"
                  >
                    <option value="coupon">クーポン</option>
                    <option value="stamp">スタンプ</option>
                    <option value="badge">バッジ</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="card space-y-6">
              <h2 className="text-xl font-bold">獲得条件</h2>

              <div>
                <label className="label">最低スコア</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={formData.minScore}
                    onChange={(e) => setFormData({ ...formData, minScore: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-primary min-w-[60px]">
                    {formData.minScore}点
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  この点数以上でクーポンを獲得できます
                </p>
              </div>

              <div>
                <label className="label">対象クイズ（任意）</label>
                <p className="text-sm text-gray-600 mb-3">
                  選択しない場合は全てのクイズが対象になります
                </p>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                  {quizzes.map((quiz) => (
                    <label
                      key={quiz.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedQuizIds.includes(quiz.id)}
                        onChange={() => handleQuizToggle(quiz.id)}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-sm text-gray-600">{quiz.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="card space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                配布設定
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">配布開始日時（任意）</label>
                  <input
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">配布終了日時（任意）</label>
                  <input
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">在庫数（任意）</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="空欄で無制限"
                  className="input"
                  min="1"
                />
                <p className="text-sm text-gray-600 mt-1">
                  空欄にすると無制限で配布されます
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-outline flex-1"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!formData.name || isLoading}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>作成中...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    作成
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}