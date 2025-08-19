import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      quiz_id, 
      user_name, 
      score, 
      max_score, 
      started_at, 
      finished_at, 
      detail 
    } = body

    if (!quiz_id || score === undefined || max_score === undefined) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    // 受験記録を保存
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id,
        user_name,
        score,
        max_score,
        started_at,
        finished_at,
        detail
      })
      .select()
      .single()

    if (attemptError) throw attemptError

    // クーポン付与処理を呼び出し（プロトタイプ用）
    let grantedCoupons = []
    try {
      const couponResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/grant_coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz_id,
          score,
          userName: user_name
        })
      })

      if (couponResponse.ok) {
        const couponData = await couponResponse.json()
        grantedCoupons = couponData.grantedCoupons || []
      }
    } catch (error) {
      console.error('Failed to check coupons:', error)
    }

    return NextResponse.json({
      success: true,
      attempt,
      grantedCoupons
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to save attempt' },
      { status: 500 }
    )
  }
}