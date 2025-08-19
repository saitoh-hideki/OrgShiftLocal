"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Quiz, QuizQuestion, QuizAttempt } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChevronRight, ChevronLeft, Check, X, Trophy, Clock, Send } from 'lucide-react'

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: any }>({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(new Date())

  useEffect(() => {
    fetchQuizData()
  }, [quizId])

  const fetchQuizData = async () => {
    try {
      // クイズ情報を取得
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*, org:orgs(*)')
        .eq('id', quizId)
        .single()

      if (quizError) throw quizError
      setQuiz(quizData)

      // 質問を取得
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index')

      if (questionsError) throw questionsError
      setQuestions(questionsData || [])
    } catch (error) {
      console.error('Failed to fetch quiz:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (answer: any) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: answer
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      submitQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    let correctCount = 0
    questions.forEach((question) => {
      const userAnswer = answers[question.id]
      const correctAnswer = question.answer

      if (question.type === 'single' || question.type === 'boolean') {
        if (userAnswer === correctAnswer) {
          correctCount++
        }
      } else if (question.type === 'multi') {
        if (JSON.stringify(userAnswer?.sort()) === JSON.stringify(correctAnswer?.sort())) {
          correctCount++
        }
      }
    })
    return correctCount
  }

  const submitQuiz = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const correctCount = calculateScore()
    const totalScore = Math.round((correctCount / questions.length) * 100)
    setScore(totalScore)

    // 受験記録を保存
    try {
      await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          score: totalScore,
          max_score: 100,
          started_at: startTime,
          finished_at: new Date(),
          detail: { answers }
        })
    } catch (error) {
      console.error('Failed to save attempt:', error)
    }

    setShowResult(true)
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container py-8">
          <div className="card max-w-3xl mx-auto animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <p className="text-gray-600">クイズが見つかりませんでした</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (showResult) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container py-8">
          <div className="card max-w-3xl mx-auto">
            <div className="text-center py-8">
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${score >= 80 ? 'text-warning' : score >= 60 ? 'text-gray-400' : 'text-gray-300'}`} />
              <h2 className="text-3xl font-bold mb-2">クイズ完了！</h2>
              <p className="text-5xl font-bold text-primary mb-4">{score}点</p>
              <p className="text-gray-600 mb-8">
                {questions.length}問中{calculateScore()}問正解
              </p>

              {/* 各問題の結果 */}
              <div className="space-y-4 text-left mb-8">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect = 
                    question.type === 'single' || question.type === 'boolean'
                      ? userAnswer === question.answer
                      : JSON.stringify(userAnswer?.sort()) === JSON.stringify(question.answer?.sort())

                  return (
                    <div key={question.id} className="p-4 bg-surface rounded-lg">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-1">
                            問{index + 1}. {question.prompt}
                          </p>
                          {!isCorrect && question.explanation && (
                            <p className="text-sm text-gray-600 mt-2">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/quizzes')}
                  className="btn btn-outline"
                >
                  クイズ一覧へ
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  もう一度挑戦
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
        <div className="max-w-3xl mx-auto">
          {/* クイズヘッダー */}
          <div className="card mb-6">
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-gray-600 mb-4">{quiz.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">
                問題 {currentQuestionIndex + 1} / {questions.length}
              </span>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 問題表示 */}
          <div className="card mb-6">
            <h2 className="text-lg font-bold mb-4">{currentQuestion.prompt}</h2>

            {/* 選択肢 */}
            {currentQuestion.type === 'single' && currentQuestion.choices && (
              <div className="space-y-3">
                {currentQuestion.choices.map((choice, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-4 bg-surface rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={index}
                      checked={answers[currentQuestion.id] === index}
                      onChange={() => handleAnswerChange(index)}
                      className="w-4 h-4 text-primary"
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multi' && currentQuestion.choices && (
              <div className="space-y-3">
                {currentQuestion.choices.map((choice, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-4 bg-surface rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={index}
                      checked={answers[currentQuestion.id]?.includes(index)}
                      onChange={(e) => {
                        const currentAnswers = answers[currentQuestion.id] || []
                        if (e.target.checked) {
                          handleAnswerChange([...currentAnswers, index])
                        } else {
                          handleAnswerChange(currentAnswers.filter((a: number) => a !== index))
                        }
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'boolean' && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswerChange(true)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    answers[currentQuestion.id] === true
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  はい
                </button>
                <button
                  onClick={() => handleAnswerChange(false)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    answers[currentQuestion.id] === false
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  いいえ
                </button>
              </div>
            )}

            {currentQuestion.type === 'shorttext' && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="回答を入力..."
                className="input w-full"
              />
            )}
          </div>

          {/* ナビゲーションボタン */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn btn-outline flex items-center gap-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              前へ
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={submitQuiz}
                disabled={isSubmitting || !answers[currentQuestion.id]}
                className="btn btn-primary flex items-center gap-2"
              >
                {isSubmitting ? '採点中...' : (
                  <>
                    <Send className="w-4 h-4" />
                    提出
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                次へ
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}