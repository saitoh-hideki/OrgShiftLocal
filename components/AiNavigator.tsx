"use client"

import { Bot, Send } from 'lucide-react'
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
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold">AIナビゲーター</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="お困りごとをお聞かせください..."
            className="input min-h-[100px] resize-none"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 text-sm bg-surface hover:bg-gray-200 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="btn btn-accent w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>処理中...</>
          ) : (
            <>
              <Send className="w-4 h-4" />
              質問する
            </>
          )}
        </button>
      </form>

      {response && (
        <div className="mt-6 p-4 bg-surface rounded-lg">
          <p className="text-sm whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  )
}