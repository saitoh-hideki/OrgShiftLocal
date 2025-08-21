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
    // 認証チェックを完全に無効化（開発用）
    // 本番環境では適切な認証を実装してください
    
    // Supabaseクライアントを作成（シークレットを使用）
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { task, query, domain, inputs } = await req.json()

    let response = ''

    switch (task) {
      case 'navigate':
        response = await handleNavigateQuery(query, supabase, openaiApiKey)
        break
      case 'generate_quiz':
        return new Response(
          JSON.stringify(await handleGenerateQuiz(domain, inputs, supabase)),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        )
      default:
        throw new Error('Unknown task')
    }

    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'エラーが発生しました',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function handleNavigateQuery(query: string, supabase: any, openaiApiKey?: string): Promise<string> {
  try {
    // データベースから関連情報を取得
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5)

    if (error) {
      console.error('Database error:', error)
    }

    // OpenAI APIが利用可能な場合は、本格的なAI応答を生成
    if (openaiApiKey) {
      try {
        console.log('Using OpenAI API for query:', query)
        
        const systemPrompt = `あなたは地域の行政サービスに詳しい親しみやすいAIアシスタントです。
ユーザーの質問に対して、自然で親しみやすい口調で、具体的で役立つ情報を提供してください。

利用可能な地域サービス情報：
${links && links.length > 0 ? links.map(link => `- ${link.title}: ${link.description}`).join('\n') : '（データベースに関連する具体的な情報は見つかりませんでした）'}

回答の際は以下の点を心がけてください：
1. 親しみやすく自然な口調で（硬い敬語は避ける）
2. 具体的で実用的な情報を提供
3. 必要に応じて次のアクションを提案
4. 定型文ではなく、質問の内容に合わせた個別の回答
5. 地域の行政サービス、ごみ分別、図書館、防災、子育て支援などの情報を中心に

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
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: query
              }
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('OpenAI API response received')
          return data.choices[0].message.content
        } else {
          const errorText = await response.text()
          console.error('OpenAI API error:', response.status, errorText)
        }
      } catch (error) {
        console.error('OpenAI API call failed:', error)
      }
    } else {
      console.log('OpenAI API key not available, using fallback')
    }

    // フォールバック: シンプルだが自然な応答
    const lowercaseQuery = query.toLowerCase()

    // 挨拶への自然な応答
    if (lowercaseQuery.includes('こんにちは') || lowercaseQuery.includes('こんばんは') || lowercaseQuery.includes('おはよう') || lowercaseQuery.includes('はじめまして')) {
      return `こんにちは！地域のサービスについて何でもお聞きください。

例えば、ごみの分別方法、図書館の利用案内、防災情報、子育て支援制度など、どんなことでもお答えします。

何か具体的に知りたいことはありますか？`
    }

    // データベースに情報がある場合
    if (links && links.length > 0) {
      const linkInfo = links.map(link => `• ${link.title}: ${link.description}`).join('\n')
      return `「${query}」について、以下の情報が見つかりました：

${linkInfo}

他にも詳しいことを知りたければ、お気軽にお聞きください！`
    }

    // 一般的な応答
    return `「${query}」についてですね。

地域のサービスや制度について、できる限りお答えします。もう少し具体的に教えていただけると、より詳しい情報をお伝えできます。

例えば：
• ごみ分別について知りたい
• 図書館の使い方を教えて
• 防災情報が知りたい
• 子育て支援について詳しく

どんなことでも、お気軽にお聞きください！`

  } catch (error) {
    console.error('Error in handleNavigateQuery:', error)
    return '申し訳ございません。一時的にエラーが発生しています。もう一度お試しください。'
  }
}

async function handleGenerateQuiz(domain: string, inputs: any, supabase: any) {
  try {
    // データベースから既存のクイズを参考に取得
    const { data: existingQuizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('category', domain)
      .limit(3)

    if (error) {
      console.error('Database error:', error)
    }

    // プロトタイプ用：ドメインに応じたサンプルクイズを生成
    
    const sampleQuizzes = {
      bakery: {
        questions: [
          {
            type: 'single',
            prompt: 'パンを最も長く保存できる方法は？',
            choices: ['常温保存', '冷蔵保存', '冷凍保存', '真空パック'],
            answer: 2,
            explanation: '冷凍保存が最も長く保存できます。冷蔵は逆にパンの老化を早めてしまいます。'
          },
          {
            type: 'boolean',
            prompt: '冷蔵庫での保存はパンの劣化を遅らせる',
            answer: false,
            explanation: '冷蔵庫の温度（0-5℃）はパンのでんぷんの老化を最も進めやすい温度帯です。'
          },
          {
            type: 'single',
            prompt: 'フランスパンの正しい保存方法は？',
            choices: ['ビニール袋に密閉', '紙袋に入れて常温', 'アルミホイルで包む', 'そのまま冷蔵庫'],
            answer: 1,
            explanation: 'フランスパンは紙袋に入れて常温保存が基本。表面のパリッと感を保てます。'
          }
        ]
      },
      auto: {
        questions: [
          {
            type: 'single',
            prompt: 'タイヤの溝の深さが何mm以下になったら交換が必要？',
            choices: ['1.0mm', '1.6mm', '2.0mm', '3.0mm'],
            answer: 1,
            explanation: '法定最低溝深度は1.6mmです。これ以下になると車検に通りません。'
          },
          {
            type: 'boolean',
            prompt: 'タイヤの空気圧は月に1回チェックするのが理想的',
            answer: true,
            explanation: 'タイヤは自然に空気が抜けるため、月1回のチェックが推奨されています。'
          },
          {
            type: 'multi',
            prompt: 'タイヤ交換時に確認すべき項目は？（複数選択）',
            choices: ['溝の深さ', 'ひび割れ', '空気圧', '製造年月'],
            answer: [0, 1, 2, 3],
            explanation: 'すべて重要な確認項目です。安全運転のため定期的にチェックしましょう。'
          }
        ]
      },
      pharmacy: {
        questions: [
          {
            type: 'single',
            prompt: '薬を飲み忘れた場合の対処法は？',
            choices: ['次回分と一緒に飲む', '思い出した時にすぐ飲む', '薬剤師に相談する', '飲まずにスキップ'],
            answer: 2,
            explanation: '薬の種類や時間によって対処法が異なるため、薬剤師に相談するのが最も安全です。'
          },
          {
            type: 'boolean',
            prompt: 'お薬手帳は複数の薬局で共有して使用する',
            answer: true,
            explanation: 'お薬手帳は薬の重複や相互作用を防ぐため、すべての薬局で共有使用してください。'
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