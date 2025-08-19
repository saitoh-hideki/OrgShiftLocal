"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Bot, Wand2, Save, Plus, Trash2, ChevronDown } from 'lucide-react'

interface QuizQuestion {
  type: 'single' | 'multi' | 'boolean' | 'shorttext'
  prompt: string
  choices?: string[]
  answer: any
  explanation?: string
}

export default function NewQuizPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'template' | 'generate' | 'edit'>('template')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // フォームデータ
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    sourceUrl: '',
    authorName: '',
    orgId: ''
  })

  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  // テンプレート選択
  const templates = [
    {
      id: 'bakery',
      name: 'ベーカリー・パン',
      description: 'パンの種類、保存方法、製造工程など',
      category: 'bakery',
      sample: 'パンの保存方法、発酵について'
    },
    {
      id: 'auto',
      name: '自動車・整備',
      description: 'メンテナンス、安全運転、車検など',
      category: 'auto',
      sample: 'タイヤ交換、オイル交換、車検'
    },
    {
      id: 'pharmacy',
      name: '薬局・健康',
      description: '薬の服用方法、健康管理など',
      category: 'pharmacy',
      sample: '薬の飲み合わせ、副作用について'
    },
    {
      id: 'restaurant',
      name: '飲食店・料理',
      description: '食材、調理法、栄養について',
      category: 'restaurant',
      sample: '食材の保存、栄養バランス'
    }
  ]

  const handleTemplateSelect = (template: any) => {
    setFormData({
      ...formData,
      category: template.category
    })
    setCurrentStep('generate')
  }

  const handleGenerateQuiz = async () => {
    if (!formData.title) return
    
    setIsGenerating(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai_assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: 'generate_quiz',
          domain: formData.category,
          inputs: {
            title: formData.title,
            description: formData.description,
            difficulty: formData.difficulty,
            source_url: formData.sourceUrl
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.questions) {
          setQuestions(data.questions)
          setCurrentStep('edit')
        }
      } else {
        // フォールバック：サンプル質問を生成
        const sampleQuestions: QuizQuestion[] = [
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
          }
        ]
        setQuestions(sampleQuestions)
        setCurrentStep('edit')
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveQuiz = async () => {
    if (!formData.title || questions.length === 0) return

    setIsSaving(true)
    try {
      // クイズを保存
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          difficulty: formData.difficulty,
          author_name: formData.authorName,
          source_url: formData.sourceUrl,
          status: 'published' // プロトタイプでは即時公開
        })
        .select()
        .single()

      if (quizError) throw quizError

      // 質問を保存
      const questionsData = questions.map((q, index) => ({
        quiz_id: quizData.id,
        order_index: index,
        type: q.type,
        prompt: q.prompt,
        choices: q.choices || null,
        answer: q.answer,
        explanation: q.explanation
      }))

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsData)

      if (questionsError) throw questionsError

      router.push('/partner/quizzes')
    } catch (error) {
      console.error('Failed to save quiz:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const addQuestion = () => {
    setQuestions([...questions, {
      type: 'single',
      prompt: '',
      choices: ['', '', '', ''],
      answer: 0
    }])
  }

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], ...updates }
    setQuestions(newQuestions)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  if (currentStep === 'template') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">新しいクイズを作成</h1>
            <p className="text-gray-600 mb-8">業種テンプレートを選択してください</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="card text-left hover:shadow-xl transition-all group"
                >
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{template.description}</p>
                  <p className="text-sm text-gray-500">
                    例: {template.sample}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (currentStep === 'generate') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">クイズ情報を入力</h1>
            <p className="text-gray-600 mb-8">AIがクイズの下書きを生成します</p>

            <div className="card space-y-6">
              <div>
                <label className="label">クイズタイトル *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例: パンの保存基礎"
                  className="input"
                />
              </div>

              <div>
                <label className="label">説明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="クイズの内容について簡単に説明してください"
                  className="input min-h-[100px]"
                />
              </div>

              <div>
                <label className="label">難易度</label>
                <div className="relative">
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="input pr-10 appearance-none"
                  >
                    <option value="easy">初級</option>
                    <option value="medium">中級</option>
                    <option value="hard">上級</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label">参考URL（任意）</label>
                <input
                  type="url"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="input"
                />
              </div>

              <div>
                <label className="label">作成者名</label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="あなたの名前"
                  className="input"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep('template')}
                  className="btn btn-outline flex-1"
                >
                  戻る
                </button>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={!formData.title || isGenerating}
                  className="btn btn-accent flex-1 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>生成中...</>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      AI下書き生成
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{formData.title}</h1>
              <p className="text-gray-600">質問を編集・追加してクイズを完成させてください</p>
            </div>
            <button
              onClick={handleSaveQuiz}
              disabled={questions.length === 0 || isSaving}
              className="btn btn-primary flex items-center gap-2"
            >
              {isSaving ? (
                <>保存中...</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  保存・公開
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">問題 {index + 1}</h3>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="p-2 text-gray-400 hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">問題文</label>
                    <textarea
                      value={question.prompt}
                      onChange={(e) => updateQuestion(index, { prompt: e.target.value })}
                      className="input min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="label">問題タイプ</label>
                    <div className="relative">
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(index, { type: e.target.value as any })}
                        className="input pr-10 appearance-none"
                      >
                        <option value="single">単一選択</option>
                        <option value="multi">複数選択</option>
                        <option value="boolean">はい・いいえ</option>
                        <option value="shorttext">短文回答</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {(question.type === 'single' || question.type === 'multi') && (
                    <div>
                      <label className="label">選択肢</label>
                      <div className="space-y-2">
                        {question.choices?.map((choice, choiceIndex) => (
                          <div key={choiceIndex} className="flex items-center gap-2">
                            <input
                              type={question.type === 'single' ? 'radio' : 'checkbox'}
                              name={`question-${index}-answer`}
                              checked={
                                question.type === 'single' 
                                  ? question.answer === choiceIndex
                                  : question.answer?.includes(choiceIndex)
                              }
                              onChange={() => {
                                if (question.type === 'single') {
                                  updateQuestion(index, { answer: choiceIndex })
                                } else {
                                  const currentAnswers = question.answer || []
                                  const newAnswers = currentAnswers.includes(choiceIndex)
                                    ? currentAnswers.filter((a: number) => a !== choiceIndex)
                                    : [...currentAnswers, choiceIndex]
                                  updateQuestion(index, { answer: newAnswers })
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <input
                              type="text"
                              value={choice}
                              onChange={(e) => {
                                const newChoices = [...(question.choices || [])]
                                newChoices[choiceIndex] = e.target.value
                                updateQuestion(index, { choices: newChoices })
                              }}
                              placeholder={`選択肢 ${choiceIndex + 1}`}
                              className="input flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="label">解説（任意）</label>
                    <textarea
                      value={question.explanation || ''}
                      onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                      placeholder="正解の理由や追加情報を入力"
                      className="input min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 flex items-center justify-center gap-2 text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
              問題を追加
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}