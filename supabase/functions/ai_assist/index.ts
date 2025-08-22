import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 環境変数の確認
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase環境変数が設定されていません')
    }
    
    console.log('🔧 Edge Function started')
    console.log('📡 Supabase URL:', supabaseUrl)
    console.log('🔑 Service Key available:', !!supabaseServiceKey)
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { task, query, domain, inputs } = await req.json()
    
    console.log('📥 Request received:', { task, query, domain })

    let response = ''

    switch (task) {
      case 'navigate':
        response = await handleNavigateQuery(query, supabase, openaiApiKey)
        break
      case 'generate_quiz':
        response = JSON.stringify(await handleGenerateQuiz(domain, inputs, supabase))
        break
      case 'debug':
        const debugInfo = await getDebugInfo(supabase)
        return new Response(
          JSON.stringify(debugInfo),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      default:
        throw new Error('Unknown task')
    }

    console.log('📤 Response generated:', response.substring(0, 100) + '...')

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('❌ Error in Edge Function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'エラーが発生しました',
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function handleNavigateQuery(query: string, supabase: any, openaiApiKey?: string): Promise<string> {
  try {
    console.log('🔍 Starting query processing for:', query)
    
    // データベースから情報を取得（条件を緩和）
    const allData = await fetchAllDatabaseData(supabase)
    console.log('📊 Data fetched:', {
      learningContents: allData.learningContents?.length || 0,
      learningVideos: allData.learningVideos?.length || 0,
      quizzes: allData.quizzes?.length || 0,
      links: allData.links?.length || 0
    })
    
    // OpenAI APIが利用可能な場合は使用
    if (openaiApiKey) {
      try {
        const systemPrompt = `あなたは地域の行政サービス、学習コンテンツ、クイズ、補助金、デジタルサービスなど、地域に関する全ての情報に詳しい親しみやすいAIアシスタントです。

利用可能な地域情報データベース：
${formatDatabaseDataForPrompt(allData)}

回答の際は以下の点を心がけてください：
1. 親しみやすく自然な口調で
2. データベースに実際の情報がある場合は、それを具体的に紹介する
3. 「今月の学び」や「学習」に関する質問には、実際の講座や動画の情報を具体的に提供する
4. 定型文ではなく、質問の内容に合わせた個別の回答

挨拶には自然に応答し、質問には具体的に答えてください。`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: query }
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ OpenAI API response received')
          return data.choices[0].message.content
        } else {
          console.log('⚠️ OpenAI API failed, using fallback')
        }
      } catch (error) {
        console.log('⚠️ OpenAI API error, using fallback:', error)
      }
    }

    // フォールバック: 具体的で実用的な応答
    return await generateSpecificResponse(query, allData)

  } catch (error) {
    console.error('❌ Error in handleNavigateQuery:', error)
    return '申し訳ございません。一時的にエラーが発生しています。もう一度お試しください。'
  }
}

// データベースから情報を取得（条件を緩和）
async function fetchAllDatabaseData(supabase: any) {
  const allData: any = {}
  
  try {
    console.log('🔍 Fetching database data...')
    
    // 1. 学習コンテンツ（全て取得）
    console.log('📚 Fetching learning_contents...')
    const { data: learningContents, error: learningError } = await supabase
      .from('learning_contents')
      .select('*')
      .eq('is_active', true)
      .order('start_date', { ascending: true })
      .limit(10)
    
    if (!learningError && learningContents) {
      allData.learningContents = learningContents
      console.log('✅ Learning contents:', learningContents.length)
    } else {
      console.log('❌ Learning contents error:', learningError)
    }

    // 2. 学習動画（全て取得）
    console.log('🎥 Fetching learning_videos...')
    const { data: learningVideos, error: videosError } = await supabase
      .from('learning_videos')
      .select('*')
      .eq('is_published', true)
      .order('popularity', { ascending: false })
      .limit(10)
    
    if (!videosError && learningVideos) {
      allData.learningVideos = learningVideos
      console.log('✅ Learning videos:', learningVideos.length)
    } else {
      console.log('❌ Learning videos error:', videosError)
    }

    // 3. クイズ（全て取得）
    console.log('🧩 Fetching quizzes...')
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (!quizzesError && quizzes) {
      allData.quizzes = quizzes
      console.log('✅ Quizzes:', quizzes.length)
    } else {
      console.log('❌ Quizzes error:', quizzesError)
    }

    // 4. リンク（全て取得）
    console.log('📋 Fetching links...')
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(10)
    
    if (!linksError && links) {
      allData.links = links
      console.log('✅ Links:', links.length)
    } else {
      console.log('❌ Links error:', linksError)
    }

    // 5. 長野localニュース（全て取得）
    console.log('📰 Fetching news...')
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(10)
    
    if (!newsError && news) {
      allData.news = news
      console.log('✅ News:', news.length)
    } else {
      console.log('❌ News error:', newsError)
    }

    console.log('📊 Final data summary:', {
      learningContents: allData.learningContents?.length || 0,
      learningVideos: allData.learningVideos?.length || 0,
      quizzes: allData.quizzes?.length || 0,
      links: allData.links?.length || 0,
      news: allData.news?.length || 0
    })

  } catch (error) {
    console.error('❌ Error fetching database data:', error)
  }

  return allData
}

// AIプロンプト用にデータをフォーマット
function formatDatabaseDataForPrompt(allData: any): string {
  let formattedData = ''
  
  if (allData.learningContents && allData.learningContents.length > 0) {
    formattedData += '\n【学習コンテンツ・講座】\n'
    allData.learningContents.forEach((content: any) => {
      formattedData += `- ${content.title}: ${content.description || '説明なし'} (${content.category}, ${content.duration}, ${content.start_date})\n`
    })
  }

  if (allData.learningVideos && allData.learningVideos.length > 0) {
    formattedData += '\n【学習動画】\n'
    allData.learningVideos.forEach((video: any) => {
      formattedData += `- ${video.title}: ${video.description || '説明なし'} (${video.category}, ${Math.floor(video.duration_seconds / 60)}分)\n`
    })
  }

  if (allData.quizzes && allData.quizzes.length > 0) {
    formattedData += '\n【クイズ】\n'
    allData.quizzes.forEach((quiz: any) => {
      formattedData += `- ${quiz.title}: ${quiz.description || '説明なし'} (${quiz.category}, 難易度: ${quiz.difficulty})\n`
    })
  }

  if (allData.links && allData.links.length > 0) {
    formattedData += '\n【行政サービス・リンク】\n'
    allData.links.forEach((link: any) => {
      formattedData += `- ${link.title}: ${link.description || '説明なし'}\n`
    })
  }

  if (allData.news && allData.news.length > 0) {
    formattedData += '\n【長野localニュース】\n'
    allData.news.forEach((newsItem: any) => {
      formattedData += `- ${newsItem.title}: ${newsItem.summary || newsItem.content.substring(0, 100)}... (${newsItem.category}, ${newsItem.location}, ${newsItem.published_at})\n`
    })
  }

  if (!formattedData) {
    formattedData = '（データベースに関連する具体的な情報は見つかりませんでした）'
  }

  return formattedData
}

// 具体的で実用的な応答を生成
async function generateSpecificResponse(query: string, allData: any): Promise<string> {
  const lowercaseQuery = query.toLowerCase()
  
  // 今月の学びに関する質問の処理
  if (lowercaseQuery.includes('今月') && (lowercaseQuery.includes('学び') || lowercaseQuery.includes('講座'))) {
    return generateThisMonthLearningResponse(allData)
  }
  
  // 学習・講座に関する質問の処理
  if (lowercaseQuery.includes('学び') || lowercaseQuery.includes('学習') || lowercaseQuery.includes('講座') || 
      lowercaseQuery.includes('勉強') || lowercaseQuery.includes('教室') || lowercaseQuery.includes('セミナー')) {
    return generateLearningResponse(allData)
  }
  
  // 動画学習に関する質問の処理
  if (lowercaseQuery.includes('動画') || lowercaseQuery.includes('ビデオ') || lowercaseQuery.includes('youtube')) {
    return generateVideoLearningResponse(allData)
  }
  
  // クイズに関する質問の処理
  if (lowercaseQuery.includes('クイズ') || lowercaseQuery.includes('問題') || lowercaseQuery.includes('テスト')) {
    return generateQuizResponse(allData)
  }

  // ニュース・お知らせに関する質問の処理
  if (lowercaseQuery.includes('ニュース') || lowercaseQuery.includes('お知らせ') || lowercaseQuery.includes('情報') ||
      lowercaseQuery.includes('最近') || lowercaseQuery.includes('最新') || lowercaseQuery.includes('話題')) {
    return generateNewsResponse(allData)
  }

  // 長野県・地域に関する質問の処理
  if (lowercaseQuery.includes('長野') || lowercaseQuery.includes('地域') || lowercaseQuery.includes('市') ||
      lowercaseQuery.includes('県') || lowercaseQuery.includes('地元')) {
    return generateLocalNewsResponse(allData)
  }
  
  // 挨拶への自然な応答
  if (lowercaseQuery.includes('こんにちは') || lowercaseQuery.includes('こんばんは') || 
      lowercaseQuery.includes('おはよう') || lowercaseQuery.includes('はじめまして')) {
    return `こんにちは！地域のサービスについて何でもお気軽にお聞きください。

例えば、ごみの分別方法、図書館の利用案内、防災情報、子育て支援制度、学習コンテンツ、クイズ、補助金、長野県の最新ニュースなど、どんなことでもお答えします。

何か具体的に知りたいことはありますか？`
  }

  // データベースに情報がある場合
  if (allData && Object.keys(allData).length > 0) {
    const dataInfo = formatDatabaseDataForDisplay(allData)
    return `「${query}」について、以下の情報が見つかりました：

${dataInfo}

他にも詳しいことを知りたければ、お気軽にお聞きください！`
  }

  // 一般的な応答
  return `「${query}」についてですね。

地域のサービスや制度、学習コンテンツ、クイズ、補助金、長野県の最新ニュースなどについて、できる限りお答えします。もう少し具体的に教えていただけると、より詳しい情報をお伝えできます。

例えば：
• ごみ分別について知りたい
• 図書館の使い方を教えて
• 防災情報が知りたい
• 子育て支援について詳しく
• 学習講座の情報が知りたい
• クイズに挑戦したい
• 補助金について調べたい
• 長野県の最新ニュースが知りたい
• 地域の話題について教えて

どんなことでも、お気軽にお聞きください！`
}

// 今月の学びに関する具体的な応答を生成
function generateThisMonthLearningResponse(allData: any): string {
  let response = '📅 今月の学びについてですね！\n\n'
  
  if (allData.learningContents && allData.learningContents.length > 0) {
    // 今月の講座を抽出
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    
    const thisMonthContents = allData.learningContents.filter((content: any) => {
      const startDate = new Date(content.start_date)
      return startDate.getMonth() + 1 === currentMonth && startDate.getFullYear() === currentYear
    })
    
    if (thisMonthContents.length > 0) {
      response += '【今月開催予定の講座】\n'
      thisMonthContents.forEach((content: any) => {
        const status = content.current_participants < content.max_participants ? '✅ 募集中' : '❌ 定員満杯'
        response += `• ${content.title}\n`
        response += `  📅 ${content.start_date} (${content.duration})\n`
        response += `  👥 ${content.current_participants}/${content.max_participants}人 ${status}\n`
        response += `  📍 ${content.location}\n`
        response += `  👨‍🏫 ${content.instructor}\n\n`
      })
    } else {
      response += '今月開催予定の講座はありませんが、以下の講座が利用可能です：\n\n'
      allData.learningContents.slice(0, 3).forEach((content: any) => {
        const status = content.current_participants < content.max_participants ? '✅ 募集中' : '❌ 定員満杯'
        response += `• ${content.title}\n`
        response += `  📅 ${content.start_date} (${content.duration})\n`
        response += `  👥 ${content.current_participants}/${content.max_participants}人 ${status}\n\n`
      })
    }
  }
  
  if (allData.learningVideos && allData.learningVideos.length > 0) {
    response += '【いつでも視聴可能な学習動画】\n'
    allData.learningVideos.slice(0, 3).forEach((video: any) => {
      response += `• ${video.title}\n`
      response += `  ⏱️ ${Math.floor(video.duration_seconds / 60)}分\n`
      response += `  🏷️ ${video.category}\n\n`
    })
  }
  
  if (!allData.learningContents && !allData.learningVideos) {
    response += '現在、学習コンテンツの情報が見つかりませんでした。\n'
    response += '地域の公民館や図書館で開催されている講座をチェックしてみることをおすすめします！'
  }
  
  return response
}

// 学習・講座に関する具体的な応答を生成
function generateLearningResponse(allData: any): string {
  let response = '📚 学習・講座に関する情報をお探しですね！\n\n'
  
  if (allData.learningContents && allData.learningContents.length > 0) {
    response += '【現在募集中の講座】\n'
    allData.learningContents.forEach((content: any) => {
      const status = content.current_participants < content.max_participants ? '✅ 募集中' : '❌ 定員満杯'
      response += `• ${content.title}\n`
      response += `  📅 ${content.start_date} (${content.duration})\n`
      response += `  👥 ${content.current_participants}/${content.max_participants}人 ${status}\n`
      response += `  📍 ${content.location}\n`
      response += `  👨‍🏫 ${content.instructor}\n\n`
    })
  }
  
  if (allData.learningVideos && allData.learningVideos.length > 0) {
    response += '【学習動画（過去の講座）】\n'
    allData.learningVideos.slice(0, 3).forEach((video: any) => {
      response += `• ${video.title}\n`
      response += `  ⏱️ ${Math.floor(video.duration_seconds / 60)}分\n`
      response += `  🏷️ ${video.category}\n\n`
    })
  }
  
  if (allData.quizzes && allData.quizzes.length > 0) {
    response += '【学習用クイズ】\n'
    allData.quizzes.slice(0, 3).forEach((quiz: any) => {
      response += `• ${quiz.title} (難易度: ${quiz.difficulty})\n`
      response += `  📝 ${quiz.description}\n\n`
    })
  }
  
  if (!allData.learningContents && !allData.learningVideos && !allData.quizzes) {
    response += '現在、学習コンテンツの情報が見つかりませんでした。\n'
    response += '地域の公民館や図書館で開催されている講座をチェックしてみることをおすすめします！'
  }
  
  return response
}

// 動画学習に関する具体的な応答を生成
function generateVideoLearningResponse(allData: any): string {
  let response = '🎥 動画学習についてですね！\n\n'
  
  if (allData.learningVideos && allData.learningVideos.length > 0) {
    response += '【利用可能な学習動画】\n'
    allData.learningVideos.slice(0, 5).forEach((video: any) => {
      response += `• ${video.title}\n`
      response += `  ⏱️ ${Math.floor(video.duration_seconds / 60)}分\n`
      response += `  🏷️ ${video.category}\n`
      response += `  📊 人気度: ${video.popularity}/100\n\n`
    })
    
    if (allData.learningVideos.length > 5) {
      response += `他にも${allData.learningVideos.length - 5}本の動画があります。\n`
    }
  } else {
    response += '現在、学習動画の情報が見つかりませんでした。\n'
    response += '地域の公民館や図書館で開催されている講座をチェックしてみることをおすすめします！'
  }
  
  return response
}

// クイズに関する具体的な応答を生成
function generateQuizResponse(allData: any): string {
  let response = '🧩 クイズについてですね！\n\n'
  
  if (allData.quizzes && allData.quizzes.length > 0) {
    response += '【挑戦できるクイズ】\n'
    allData.quizzes.slice(0, 5).forEach((quiz: any) => {
      response += `• ${quiz.title}\n`
      response += `  📝 ${quiz.description}\n`
      response += `  🏷️ ${quiz.category}\n`
      response += `  ⭐ 難易度: ${quiz.difficulty}\n\n`
    })
    
    if (allData.quizzes.length > 5) {
      response += `他にも${allData.quizzes.length - 5}個のクイズがあります。\n`
    }
  } else {
    response += '現在、クイズの情報が見つかりませんでした。\n'
    response += '地域の公民館や図書館で開催されている講座をチェックしてみることをおすすめします！'
  }
  
  return response
}

// ニュース・お知らせに関する具体的な応答を生成
function generateNewsResponse(allData: any): string {
  let response = '📰 長野県の最新ニュースについてですね！\n\n'
  
  if (allData.news && allData.news.length > 0) {
    response += '【長野県の最新ニュース】\n'
    allData.news.slice(0, 5).forEach((newsItem: any) => {
      response += `• ${newsItem.title}\n`
      response += `  📝 ${newsItem.summary || newsItem.content.substring(0, 100)}...\n`
      response += `  🏷️ ${newsItem.category}\n`
      response += `  📍 ${newsItem.location}\n`
      response += `  📅 ${newsItem.published_at}\n\n`
    })
    
    if (allData.news.length > 5) {
      response += `他にも${allData.news.length - 5}件のニュースがあります。\n`
    }
  } else {
    response += '現在、長野県の最新ニュースの情報が見つかりませんでした。\n'
    response += '長野県の公式サイトや、地域のニュースサイトをチェックしてみることをおすすめします！'
  }
  
  return response
}

// 長野県・地域に関する具体的な応答を生成
function generateLocalNewsResponse(allData: any): string {
  let response = '🏠 長野県の地域についてですね！\n\n'
  
  if (allData.news && allData.news.length > 0) {
    response += '【長野県の地域情報】\n'
    allData.news.slice(0, 5).forEach((newsItem: any) => {
      response += `• ${newsItem.title}\n`
      response += `  📝 ${newsItem.summary || newsItem.content.substring(0, 100)}...\n`
      response += `  🏷️ ${newsItem.category}\n`
      response += `  📍 ${newsItem.location}\n`
      response += `  📅 ${newsItem.published_at}\n\n`
    })
    
    if (allData.news.length > 5) {
      response += `他にも${allData.news.length - 5}件の地域情報があります。\n`
    }
  } else {
    response += '現在、長野県の地域情報の情報が見つかりませんでした。\n'
    response += '長野県の公式サイトや、地域のニュースサイトをチェックしてみることをおすすめします！'
  }
  
  return response
}

// 表示用にデータをフォーマット
function formatDatabaseDataForDisplay(allData: any): string {
  let formattedData = ''
  
  if (allData.learningContents && allData.learningContents.length > 0) {
    formattedData += '📚 学習コンテンツ・講座\n'
    allData.learningContents.forEach((content: any) => {
      formattedData += `• ${content.title}: ${content.description || '説明なし'} (${content.category}, ${content.duration})\n`
    })
    formattedData += '\n'
  }

  if (allData.learningVideos && allData.learningVideos.length > 0) {
    formattedData += '🎥 学習動画\n'
    allData.learningVideos.forEach((video: any) => {
      formattedData += `• ${video.title}: ${video.description || '説明なし'} (${video.category}, ${Math.floor(video.duration_seconds / 60)}分)\n`
    })
    formattedData += '\n'
  }

  if (allData.quizzes && allData.quizzes.length > 0) {
    formattedData += '🧩 クイズ\n'
    allData.quizzes.forEach((quiz: any) => {
      formattedData += `• ${quiz.title}: ${quiz.description || '説明なし'} (${quiz.category}, 難易度: ${quiz.difficulty})\n`
    })
    formattedData += '\n'
  }

  if (allData.links && allData.links.length > 0) {
    formattedData += '📋 行政サービス・リンク\n'
    allData.links.forEach((link: any) => {
      formattedData += `• ${link.title}: ${link.description || '説明なし'}\n`
    })
    formattedData += '\n'
  }

  if (allData.news && allData.news.length > 0) {
    formattedData += '📰 長野localニュース\n'
    allData.news.forEach((newsItem: any) => {
      formattedData += `• ${newsItem.title}: ${newsItem.summary || newsItem.content.substring(0, 100)}... (${newsItem.category}, ${newsItem.location})\n`
    })
    formattedData += '\n'
  }

  return formattedData.trim()
}

// クイズ生成（既存のコードを保持）
async function handleGenerateQuiz(domain: string, inputs: any, supabase: any) {
  try {
    const { data: existingQuizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('category', domain)
      .limit(3)

    if (error) {
      console.error('Database error:', error)
    }

    const sampleQuizzes = {
      bakery: {
        questions: [
          {
            type: 'single',
            prompt: 'パンを最も長く保存できる方法は？',
            choices: ['常温保存', '冷蔵保存', '冷凍保存', '真空パック'],
            answer: 2,
            explanation: '冷凍保存が最も長く保存できます。冷蔵は逆にパンの老化を早めてしまいます。'
          }
        ]
      }
    }

    const domainQuiz = sampleQuizzes[domain as keyof typeof sampleQuizzes]
    
    if (!domainQuiz) {
      return {
        questions: [
          {
            type: 'single',
            prompt: `${inputs.title}に関する問題です。正しいものはどれでしょう？`,
            choices: ['選択肢A', '選択肢B', '選択肢C', '選択肢D'],
            answer: 0,
            explanation: 'こちらは生成されたサンプル問題です。実際の内容に置き換えてください。'
          }
        ],
        notes: ['AIによる下書き生成です。内容を確認・編集してください。']
      }
    }

    return {
      questions: domainQuiz.questions,
      notes: [`${domain}分野の基本的な問題を生成しました。`]
    }
  } catch (error) {
    console.error('Error in handleGenerateQuiz:', error)
    return {
      questions: [],
      notes: ['エラーが発生しました。']
    }
  }
}

// デバッグ用の情報を取得
async function getDebugInfo(supabase: any) {
  try {
    const { data: learningContents, error: learningError } = await supabase
      .from('learning_contents')
      .select('*')
      .limit(5)
    
    const { data: learningVideos, error: videosError } = await supabase
      .from('learning_videos')
      .select('*')
      .limit(5)
    
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('*')
      .limit(5)
    
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .limit(5)

    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*')
      .limit(5)

    return {
      learningContents: learningContents || [],
      learningVideos: learningVideos || [],
      quizzes: quizzes || [],
      links: links || [],
      news: news || [],
      errors: {
        learningContents: learningError,
        learningVideos: videosError,
        quizzes: quizzesError,
        links: linksError,
        news: newsError
      }
    }
  } catch (error) {
    return { error: error.message }
  }
}