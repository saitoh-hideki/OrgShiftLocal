import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quiz_id, reporter_name, reason } = body

    if (!quiz_id || !reason) {
      return NextResponse.json(
        { error: 'Quiz ID and reason are required' },
        { status: 400 }
      )
    }

    // 通報を記録
    const { data: report, error } = await supabase
      .from('reports')
      .insert({
        quiz_id,
        reporter_name,
        reason,
        status: 'open'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      report,
      message: '通報を受け付けました。内容を確認いたします。'
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}