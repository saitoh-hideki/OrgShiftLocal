import Link from 'next/link'
import { Quiz } from '@/types'
import { Trophy, Clock, Tag, CheckCircle } from 'lucide-react'

interface QuizCardProps {
  quiz: Quiz
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success'
      case 'medium': return 'text-warning'
      case 'hard': return 'text-danger'
      default: return 'text-gray-500'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '初級'
      case 'medium': return '中級'
      case 'hard': return '上級'
      default: return difficulty
    }
  }

  return (
    <Link href={`/quiz/${quiz.id}`} className="card block hover:shadow-xl transition-all group">
      <div className="space-y-3">
        {/* ヘッダー */}
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
            {quiz.title}
          </h3>
          {quiz.org?.verified && (
            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
          )}
        </div>

        {/* 説明 */}
        {quiz.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{quiz.description}</p>
        )}

        {/* メタ情報 */}
        <div className="flex items-center gap-4 text-xs">
          <span className={`flex items-center gap-1 font-medium ${getDifficultyColor(quiz.difficulty)}`}>
            <Trophy className="w-3 h-3" />
            {getDifficultyLabel(quiz.difficulty)}
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            約5分
          </span>
        </div>

        {/* タグ */}
        {quiz.tags && quiz.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {quiz.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-surface text-xs rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 作成者 */}
        {quiz.org && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-gray-500">
              提供: {quiz.org.name}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}