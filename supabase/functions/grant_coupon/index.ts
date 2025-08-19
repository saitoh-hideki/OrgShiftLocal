import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS プリフライトリクエスト
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { quizId, score, userName } = await req.json()

    if (!quizId || score === undefined) {
      throw new Error('Missing required parameters')
    }

    // Supabaseクライアントを初期化
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 対象クーポンを検索
    const { data: coupons, error: couponsError } = await supabase
      .from('coupons')
      .select('*')
      .or(`conditions->>'quiz_ids' is null,conditions->'quiz_ids' @> '["${quizId}"]'`)

    if (couponsError) throw couponsError

    const eligibleCoupons = coupons?.filter(coupon => {
      // スコア条件をチェック
      const minScore = coupon.conditions?.min_score || 0
      if (score < minScore) return false

      // 期間チェック
      const now = new Date()
      if (coupon.starts_at && new Date(coupon.starts_at) > now) return false
      if (coupon.ends_at && new Date(coupon.ends_at) < now) return false

      // 在庫チェック
      if (coupon.stock !== null && coupon.stock <= 0) return false

      return true
    }) || []

    const grantedCoupons = []

    for (const coupon of eligibleCoupons) {
      try {
        // クーポンコードを生成
        const code = generateCouponCode()

        // クーポンを付与
        const { data: grant, error: grantError } = await supabase
          .from('coupon_grants')
          .insert({
            coupon_id: coupon.id,
            user_name: userName,
            code: code,
            granted_at: new Date().toISOString()
          })
          .select()
          .single()

        if (grantError) throw grantError

        // 在庫を減らす（在庫制限がある場合）
        if (coupon.stock !== null) {
          const { error: updateError } = await supabase
            .from('coupons')
            .update({ stock: coupon.stock - 1 })
            .eq('id', coupon.id)

          if (updateError) throw updateError
        }

        grantedCoupons.push({
          id: grant.id,
          couponId: coupon.id,
          name: coupon.name,
          description: coupon.description,
          code: code,
          rewardType: coupon.reward_type
        })

      } catch (error) {
        console.error(`Failed to grant coupon ${coupon.id}:`, error)
        // 個別のクーポン付与エラーは続行
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        grantedCoupons,
        message: grantedCoupons.length > 0 
          ? `${grantedCoupons.length}個のクーポンを獲得しました！`
          : 'クーポン獲得条件を満たしていません'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'クーポン付与に失敗しました',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}