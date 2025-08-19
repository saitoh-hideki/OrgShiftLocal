"use client"

import { Bot, Send, Sparkles, MessageCircle, Lightbulb } from 'lucide-react'
import { useState } from 'react'

export default function AiNavigator() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const suggestions = [
    'ごみの分別方法',
    '図書館の開館時間',
    '防災訓練の日程',
    '子育て支援制度',
    '健康診断の予約',
    '公共交通の時刻表',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setResponse('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai_assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: 'navigate',
          query: query,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setResponse(data.response || '申し訳ございません。回答を生成できませんでした。')
      } else {
        setResponse('エラーが発生しました。しばらくしてからお試しください。')
      }
    } catch (error) {
      setResponse('接続エラーが発生しました。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
  }

  return (
    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-white">
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-[#3A9BDC] to-[#2E5D50] rounded-2xl flex items-center justify-center">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AIナビゲーター</h2>
          <p className="text-sm text-white/80">AI Assistant</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1 text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>AI Powered</span>
          </div>
        </div>
      </div>

      {/* 説明 */}
      <p className="text-white/90 mb-6 leading-relaxed">
        地域のサービスや制度について、自然な言葉で質問してください。
        <span className="block text-sm text-white/70 mt-1">
          Ask about local services and systems in natural language.
        </span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 入力フィールド */}
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例：ごみの分別方法を教えて..."
            className="w-full min-h-[120px] p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3">
            <MessageCircle className="w-5 h-5 text-white/40" />
          </div>
        </div>

        {/* サジェストボタン */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white/80">よくある質問 / Common Questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 text-white/90 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="w-full bg-gradient-to-r from-[#3A9BDC] to-[#2E5D50] hover:from-[#3A9BDC]/90 hover:to-[#2E5D50]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              処理中...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              質問する / Ask Question
            </>
          )}
        </button>
      </form>

      {/* レスポンス表示 */}
      {response && (
        <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-[#3A9BDC]" />
            <span className="text-sm font-medium text-white/80">AI回答 / AI Response</span>
          </div>
          <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  )
}