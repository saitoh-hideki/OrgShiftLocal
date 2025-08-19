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
    // Supabaseクライアントを作成（シークレットを使用）
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { task, query, domain, inputs } = await req.json()

    let response = ''

    switch (task) {
      case 'navigate':
        response = await handleNavigateQuery(query, supabase)
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

async function handleNavigateQuery(query: string, supabase: any): Promise<string> {
  try {
    // データベースから関連情報を取得
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(3)

    if (error) {
      console.error('Database error:', error)
    }

    // プロトタイプ用：簡単なルールベース応答
    const lowercaseQuery = query.toLowerCase()

    if (lowercaseQuery.includes('ごみ') || lowercaseQuery.includes('分別')) {
      return `ごみの分別に関するお問い合わせですね。

**可燃ごみ**: 生ごみ、紙くず、プラスチック類
**不燃ごみ**: 金属類、ガラス類、陶器類
**資源ごみ**: ペットボトル、缶、びん、新聞紙

詳しくは市のホームページでご確認いただけます。また、ごみ分別クイズで楽しく学ぶこともできます！`
    }

    if (lowercaseQuery.includes('図書館')) {
      return `図書館に関するお問い合わせですね。

**開館時間**: 平日 9:00-20:00、土日祝 9:00-17:00
**休館日**: 月曜日（祝日の場合は翌日）、年末年始
**貸出期間**: 図書・雑誌 2週間、DVD 1週間

オンライン予約システムもご利用いただけます。`
    }

    if (lowercaseQuery.includes('防災')) {
      return `防災に関するお問い合わせですね。

**避難所**: 最寄りの小学校・中学校
**非常持出袋**: 水、食料、懐中電灯、ラジオ、薬等
**緊急連絡先**: 119（消防）、110（警察）

防災マップで避難経路をご確認ください。防災クイズで知識を深めることもおすすめです。`
    }

    if (lowercaseQuery.includes('子育て')) {
      return `子育て支援に関するお問い合わせですね。

**子育て支援センター**: 相談・一時預かりサービス
**児童手当**: 申請手続きについて
**予防接種**: スケジュールと接種会場

詳しくは子育て支援課（TEL: 123-4567）までお問い合わせください。`
    }

    // デフォルト応答
    return `お問い合わせありがとうございます。

以下のサービスをご利用いただけます：
- ごみ分別・収集日の確認
- 図書館の利用案内・予約
- 防災情報・避難所マップ  
- 子育て支援制度の案内
- 健康診断・予防接種の予約

より詳しい情報は各担当課までお問い合わせください。`
  } catch (error) {
    console.error('Error in handleNavigateQuery:', error)
    return '申し訳ございません。一時的にエラーが発生しています。'
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