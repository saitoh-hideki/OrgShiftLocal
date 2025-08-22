"use client"

import { Bot, Send, Sparkles, MessageCircle, Lightbulb, User, ArrowUp } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function AiNavigator() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'こんにちは！地域のサービスや制度について、何でもお気軽にお聞きください。\n\n例：\n• 今月の学びは？\n• 学習講座の情報\n• 動画で学べる内容\n• クイズに挑戦したい\n• ごみの分別方法\n• 図書館の開館時間\n• 防災訓練の日程\n• 子育て支援制度',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [typingContent, setTypingContent] = useState('')
  const [typingIndex, setTypingIndex] = useState(0)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    '今月の学びは？',
    '学習講座の情報',
    '動画で学べる内容',
    'クイズに挑戦したい',
    '補助金・支援制度',
    'デジタルサービス',
    'ごみの分別方法',
    '図書館の開館時間',
    '防災訓練の日程',
    '子育て支援制度',
    '健康診断の予約',
    '公共交通の時刻表',
  ]

  // 自動スクロール
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // チャット送信後のスクロール制御
  const scrollToBottomAfterMessage = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // ユーザーのスクロール動作を検知
  const handleUserScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  useEffect(() => {
    // 初期表示時のみスクロール
    if (messages.length === 1) {
      scrollToBottom()
    }
  }, [messages.length])

  // 新しいメッセージが追加された時のみスクロール
  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottomAfterMessage()
    }
  }, [messages])

  // タイピングアニメーション中もスクロールを追いかける
  useEffect(() => {
    if (typingMessageId && typingIndex > 0) {
      // タイピング中は少し遅延を入れてからスクロール
      const timer = setTimeout(() => {
        if (chatContainerRef.current) {
          // より正確なスクロール位置を計算
          const container = chatContainerRef.current
          const scrollHeight = container.scrollHeight
          const clientHeight = container.clientHeight
          const maxScrollTop = scrollHeight - clientHeight
          
          container.scrollTop = maxScrollTop
        }
      }, 30) // より短い遅延で追従
      
      return () => clearTimeout(timer)
    }
  }, [typingIndex, typingMessageId])

  // スクロールイベントの伝播を防ぐ
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  // ホイールイベントの伝播を防ぐ
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }

  // キーボードイベントの伝播を防ぐ
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      handleSubmit(e as any)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setQuery('')
    setIsLoading(true)

    try {
      // 環境変数の確認
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl) {
        throw new Error('SUPABASE_URLが設定されていません')
      }
      
      if (!supabaseAnonKey) {
        throw new Error('SUPABASE_ANON_KEYが設定されていません')
      }

      console.log('Sending request to:', `${supabaseUrl}/functions/v1/ai_assist`)
      console.log('Request body:', { task: 'navigate', query: userMessage.content })

      // Supabaseクライアントからセッション情報を取得
      const { data: { session } } = await supabase.auth.getSession()
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      }

      // セッションがある場合は認証ヘッダーを追加
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
        console.log('Adding auth header with token')
      } else {
        // anon keyを使用して認証
        headers['Authorization'] = `Bearer ${supabaseAnonKey}`
        console.log('No session found, using anon key for auth')
      }

      const res = await fetch(`${supabaseUrl}/functions/v1/ai_assist`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          task: 'navigate',
          query: userMessage.content,
        }),
      })

      console.log('Response status:', res.status)
      console.log('Response headers:', Object.fromEntries(res.headers.entries()))

      if (res.ok) {
        const data = await res.json()
        console.log('Response data:', data)
        console.log('Raw response content:', data.response)
        console.log('Response length:', data.response?.length || 0)
        
        let responseContent = data.response || '申し訳ございません。回答を生成できませんでした。'
        
        // Edge Functionからの応答をそのまま使用（定型文への置き換えを削除）
        
        console.log('Final response content:', responseContent)
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: responseContent,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, aiMessage])
        
        // タイピングアニメーションを開始
        startTypingAnimation(aiMessage.id, responseContent)
        
        setIsLoading(false)
      } else {
        const errorText = await res.text()
        console.error('API Error:', res.status, errorText)
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `エラーが発生しました（${res.status}）: ${errorText}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Fetch error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `接続エラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // タイピングアニメーション
  const startTypingAnimation = (messageId: string, fullContent: string) => {
    setTypingMessageId(messageId)
    setTypingContent(fullContent)
    setTypingIndex(0)
  }

  // タイピングアニメーションの進行
  useEffect(() => {
    if (typingMessageId && typingIndex < typingContent.length) {
      // 文字の種類に応じて速度を調整
      const currentChar = typingContent[typingIndex]
      let delay = 25 // デフォルト速度を少し早く
      
      // 句読点や改行は少し長めに
      if (['。', '、', '！', '？', '\n'].includes(currentChar)) {
        delay = 60
      }
      // 英数字は少し早めに
      else if (/[a-zA-Z0-9]/.test(currentChar)) {
        delay = 15
      }
      
      const timer = setTimeout(() => {
        setTypingIndex(prev => prev + 1)
      }, delay)

      return () => clearTimeout(timer)
    } else if (typingMessageId && typingIndex >= typingContent.length) {
      // タイピング完了
      setTypingMessageId(null)
      setTypingContent('')
      setTypingIndex(0)
      
      // 完了時に最終スクロール
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
      }, 100)
    }
  }, [typingMessageId, typingIndex, typingContent.length])

  // 現在表示中のテキストを取得
  const getDisplayContent = (message: Message) => {
    if (typingMessageId === message.id) {
      return typingContent.slice(0, typingIndex)
    }
    return message.content
  }

  return (
    <div 
      className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-white h-[600px] flex flex-col"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onScroll={(e) => e.stopPropagation()}
      style={{ 
        overscrollBehavior: 'none',
        touchAction: 'none',
        scrollBehavior: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AIナビゲーター</h2>
          <p className="text-xs text-white/80">AI Assistant</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1 text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>AI Powered</span>
          </div>
        </div>
      </div>

      {/* チャットエリア */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        onScroll={handleUserScroll}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{
          overscrollBehavior: 'contain',
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          position: 'relative'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' 
                  : 'bg-white/10 border border-white/20 text-white/90'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {getDisplayContent(message)}
                  {typingMessageId === message.id && typingIndex < typingContent.length && (
                    <span className="inline-block w-2 h-5 bg-blue-400 ml-1 animate-pulse"></span>
                  )}
                </p>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-white/70' : 'text-white/50'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
      </div>

      {/* 入力エリア */}
      <div className="flex-shrink-0 space-y-4">
        {/* サジェストボタン */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-300" />
            <span className="text-xs text-white/80">よくある質問</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 text-white/90 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="質問を入力してください..."
              className="w-full min-h-[44px] max-h-[120px] p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all text-sm"
              disabled={isLoading}
              onKeyDown={handleKeyDown}
              onWheel={(e) => e.stopPropagation()}
              style={{ overscrollBehavior: 'contain' }}
            />
            <div className="absolute bottom-2 right-2">
              <MessageCircle className="w-4 h-4 text-white/40" />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-12 h-11 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-500/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            onWheel={(e) => e.stopPropagation()}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* スクロールトップボタン */}
        {messages.length > 3 && (
          <div className="flex gap-2">
            <button
              onClick={() => chatContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' })}
              className="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 text-white/80 hover:text-white text-sm flex items-center justify-center gap-2"
            >
              <ArrowUp className="w-4 h-4" />
              最初に戻る
            </button>
            
            <button
              onClick={() => scrollToBottom()}
              className="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 text-white/80 hover:text-white text-sm flex items-center justify-center gap-2"
            >
              ↓
              最新に戻る
            </button>
          </div>
        )}
      </div>
    </div>
  )
}