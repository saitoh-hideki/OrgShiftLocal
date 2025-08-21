import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const district = searchParams.get('district')
    const isActive = searchParams.get('isActive')

    let query = supabase
      .from('learning_contents')
      .select('*')
      .order('start_date', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    if (district) {
      query = query.eq('district', district)
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching learning contents:', error)
      return NextResponse.json(
        { error: 'Failed to fetch learning contents' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('learning_contents')
      .insert([body])
      .select()

    if (error) {
      console.error('Error creating learning content:', error)
      return NextResponse.json(
        { error: 'Failed to create learning content' },
        { status: 500 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
