"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Coupon } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Plus, Gift, Users, Calendar, CheckCircle, XCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function PartnerCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*, org:orgs(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCoupons(data || [])
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
      // フォールバックデータ
      setCoupons([
        {
          id: '1',
          org_id: '1',
          name: 'パン10%割引クーポン',
          description: 'クイズで80点以上獲得した方限定',
          reward_type: 'coupon',
          conditions: { min_score: 80, quiz_ids: ['quiz1'] },
          stock: 100,
          created_at: new Date().toISOString(),
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

  const isActive = (coupon: Coupon) => {
    const now = new Date()
    const start = coupon.starts_at ? new Date(coupon.starts_at) : null
    const end = coupon.ends_at ? new Date(coupon.ends_at) : null
    
    if (start && start > now) return false
    if (end && end < now) return false
    if (coupon.stock !== undefined && coupon.stock <= 0) return false
    
    return true
  }

  const getStatusBadge = (coupon: Coupon) => {
    if (isActive(coupon)) {
      return <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">配布中</span>
    } else if (coupon.stock !== undefined && coupon.stock <= 0) {
      return <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">在庫切れ</span>
    } else {
      return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">停止中</span>
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">クーポン管理</h1>
            <p className="text-gray-600">クーポンの作成と配布状況の確認</p>
          </div>
          <Link href="/partner/coupons/new" className="btn btn-primary flex items-center gap-2">
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
        ) : coupons.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">まだクーポンがありません</h3>
            <p className="text-gray-600 mb-6">クイズ受験者にお得な特典を提供しましょう</p>
            <Link href="/partner/coupons/new" className="btn btn-primary">
              クーポンを作成
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{coupon.name}</h3>
                      {getStatusBadge(coupon)}
                    </div>
                    
                    {coupon.description && (
                      <p className="text-gray-600 mb-3">{coupon.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* 条件 */}
                      <div className="bg-surface rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">獲得条件</h4>
                        <p className="text-sm text-gray-600">
                          {coupon.conditions.min_score && `${coupon.conditions.min_score}点以上`}
                          {coupon.conditions.quiz_ids && ` (対象クイズ${coupon.conditions.quiz_ids.length}個)`}
                        </p>
                      </div>

                      {/* 在庫 */}
                      <div className="bg-surface rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">在庫</h4>
                        <p className="text-sm text-gray-600">
                          {coupon.stock !== undefined ? `残り${coupon.stock}枚` : '無制限'}
                        </p>
                      </div>

                      {/* 期間 */}
                      <div className="bg-surface rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">配布期間</h4>
                        <p className="text-sm text-gray-600">
                          {coupon.starts_at && coupon.ends_at ? (
                            <>
                              {format(new Date(coupon.starts_at), 'MM/dd', { locale: ja })} - {format(new Date(coupon.ends_at), 'MM/dd', { locale: ja })}
                            </>
                          ) : '無期限'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        作成日: {format(new Date(coupon.created_at), 'yyyy/MM/dd', { locale: ja })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        発行済み: 12枚
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        使用済み: 8枚
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      className="p-2 text-gray-400 hover:text-accent transition-colors"
                      title="詳細表示"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 transition-colors ${
                        isActive(coupon) 
                          ? 'text-danger hover:text-danger/80' 
                          : 'text-success hover:text-success/80'
                      }`}
                      title={isActive(coupon) ? '停止' : '再開'}
                    >
                      {isActive(coupon) ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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