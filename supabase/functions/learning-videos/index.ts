import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Supabaseクライアントの作成
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const videoId = pathParts[pathParts.length - 1]

    // 動画詳細の取得
    if (videoId && videoId !== 'learning-videos') {
      const { data: video, error: videoError } = await supabase
        .from('learning_videos')
        .select('*')
        .eq('id', videoId)
        .eq('is_published', true)
        .single()

      if (videoError || !video) {
        return new Response(
          JSON.stringify({ error: '動画が見つかりません' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // 関連動画を取得（同カテゴリ、同じ動画以外）
      const { data: relatedVideos } = await supabase
        .from('learning_videos')
        .select('*')
        .eq('category', video.category)
        .eq('is_published', true)
        .neq('id', video.id)
        .order('popularity', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3)

      return new Response(
        JSON.stringify({
          video,
          related: relatedVideos || []
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 動画一覧の取得
    const searchQuery = url.searchParams.get('q') || ''
    const category = url.searchParams.get('category') || ''
    const year = url.searchParams.get('year') || ''
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)
    const page = parseInt(url.searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    let query = supabase
      .from('learning_videos')
      .select('*', { count: 'exact' })
      .eq('is_published', true)

    // フィルタリング
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }
    if (category && category !== 'すべて') {
      query = query.eq('category', category)
    }
    if (year && year !== 'すべて') {
      query = query.eq('year', parseInt(year))
    }

    // ソートとページネーション
    query = query
      .order('year', { ascending: false })
      .order('popularity', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: videos, count: totalCount, error } = await query

    if (error) {
      return new Response(
        JSON.stringify({ error: 'データの取得に失敗しました' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // レスポンス用のデータを整形
    const responseData = {
      items: videos?.map(video => ({
        id: video.id,
        title: video.title,
        year: video.year,
        category: video.category,
        duration_seconds: video.duration_seconds,
        thumbnail_url: video.thumbnail_url,
        video_url: video.video_url,
        tags: video.tags || [],
        description: video.description,
        speaker: video.speaker
      })) || [],
      page,
      total: totalCount || 0,
      limit
    }

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'サーバーエラーが発生しました' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
