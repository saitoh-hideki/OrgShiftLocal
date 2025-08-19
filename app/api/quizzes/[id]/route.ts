import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // クイズ情報を取得
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*, org:orgs(*)')
      .eq('id', id)
      .single()

    if (quizError) throw quizError

    // 質問を取得
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', id)
      .order('order_index')

    if (questionsError) throw questionsError

    return NextResponse.json({
      quiz,
      questions: questions || []
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}