import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort') || 'newest'
    const q = searchParams.get('q')

    let query = supabase
      .from('quizzes')
      .select('*, org:orgs(*)')
      .eq('status', 'published')

    // タグフィルター
    if (tag && tag !== 'all') {
      query = query.eq('category', tag)
    }

    // 検索クエリ
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    // ソート
    switch (sort) {
      case 'popular':
        query = query.order('trust_score', { ascending: false })
        break
      case 'easiest':
        query = query.order('difficulty', { ascending: true })
        break
      default: // newest
        query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query.limit(50)

    if (error) throw error

    return NextResponse.json({ quizzes: data || [] })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}