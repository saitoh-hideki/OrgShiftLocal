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
    const { code, action = 'verify' } = await req.json()

    if (!code) {
      throw new Error('Coupon code is required')
    }

    // Supabaseクライアントを初期化
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // クーポンコードを検索
    const { data: grant, error: grantError } = await supabase
      .from('coupon_grants')
      .select(`
        *,
        coupon:coupons (
          id,
          name,
          description,
          reward_type,
          org:orgs (
            id,
            name,
            verified
          )
        )
      `)
      .eq('code', code)
      .single()

    if (grantError || !grant) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'クーポンコードが見つかりません'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    // 使用済みチェック
    if (grant.used) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'このクーポンは既に使用済みです',
          usedAt: grant.used_at
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // 検証のみの場合はここで終了
    if (action === 'verify') {
      return new Response(
        JSON.stringify({
          valid: true,
          grant: {
            id: grant.id,
            code: grant.code,
            grantedAt: grant.granted_at,
            userName: grant.user_name,
            coupon: {
              id: grant.coupon.id,
              name: grant.coupon.name,
              description: grant.coupon.description,
              rewardType: grant.coupon.reward_type,
              org: grant.coupon.org
            }
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // 使用処理
    if (action === 'use') {
      const { error: updateError } = await supabase
        .from('coupon_grants')
        .update({
          used: true,
          used_at: new Date().toISOString()
        })
        .eq('id', grant.id)

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({
          success: true,
          message: 'クーポンを使用しました',
          grant: {
            id: grant.id,
            code: grant.code,
            usedAt: new Date().toISOString(),
            coupon: {
              id: grant.coupon.id,
              name: grant.coupon.name,
              description: grant.coupon.description,
              org: grant.coupon.org
            }
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        valid: false,
        error: 'クーポン処理に失敗しました',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})