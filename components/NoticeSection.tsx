import { Bell, MapPin, ChevronRight, Calendar, Pin, Users, GraduationCap } from 'lucide-react'
import CardBase from './CardBase'
import { useRef } from 'react'

interface Notice {
  id: string
  title: string
  date: string
  type: 'members' | 'school' | 'local'
  description?: string
  priority?: 'high' | 'medium' | 'low'
}

export default function NoticeSection() {
  const membersRef = useRef<HTMLDivElement>(null)
  const schoolRef = useRef<HTMLDivElement>(null)
  const localRef = useRef<HTMLDivElement>(null)

  const notices: Notice[] = [
    // メンバーズクラブのお知らせ（8件）
    { 
      id: '1', 
      title: 'メンバーズ限定セミナー開催', 
      date: '2025/01/15', 
      type: 'members',
      description: 'スマートライフメンバーズ限定の特別セミナーを開催します。健康管理や生活改善について学べます。',
      priority: 'high'
    },
    { 
      id: '2', 
      title: '会員特典の更新について', 
      date: '2025/01/14', 
      type: 'members',
      description: 'メンバーズクラブの会員特典が更新されました。新しいサービスや割引をご利用いただけます。',
      priority: 'medium'
    },
    { 
      id: '3', 
      title: '健康診断の予約受付開始', 
      date: '2025/01/13', 
      type: 'members',
      description: '2025年度の健康診断の予約受付を開始しました。早期予約でお得なプランもご用意しています。',
      priority: 'medium'
    },
    { 
      id: '4', 
      title: '会員限定フィットネスプログラム', 
      date: '2025/01/12', 
      type: 'members',
      description: 'メンバーズ限定のフィットネスプログラムを開始します。専門トレーナーによる指導で効果的に運動できます。',
      priority: 'high'
    },
    { 
      id: '5', 
      title: '会員交流イベントの開催', 
      date: '2025/01/11', 
      type: 'members',
      description: '会員同士の交流を深めるイベントを開催します。新しい友達作りや情報交換の場としてご活用ください。',
      priority: 'medium'
    },
    { 
      id: '6', 
      title: '会員限定商品の販売開始', 
      date: '2025/01/10', 
      type: 'members',
      description: 'メンバーズ限定のオリジナル商品の販売を開始しました。特別価格でご購入いただけます。',
      priority: 'low'
    },
    { 
      id: '7', 
      title: '会員アンケートの実施', 
      date: '2025/01/09', 
      type: 'members',
      description: 'サービス改善のため、会員アンケートを実施します。ご意見・ご要望をお聞かせください。',
      priority: 'medium'
    },
    { 
      id: '8', 
      title: '会員カードの更新について', 
      date: '2025/01/08', 
      type: 'members',
      description: '会員カードの更新時期が近づいています。更新手続きはオンラインで簡単に完了できます。',
      priority: 'low'
    },

    // AO校のお知らせ（10件）
    { 
      id: '9', 
      title: 'AO校特別講座のお知らせ', 
      date: '2025/01/15', 
      type: 'school',
      description: 'スマートライフAO校で特別講座を開催します。専門家による実践的な学習ができます。',
      priority: 'high'
    },
    { 
      id: '10', 
      title: 'オンライン学習システムの利用開始', 
      date: '2025/01/14', 
      type: 'school',
      description: 'AO校のオンライン学習システムが利用開始されました。いつでもどこでも学習できます。',
      priority: 'medium'
    },
    { 
      id: '11', 
      title: '修了証書の発行について', 
      date: '2025/01/13', 
      type: 'school',
      description: 'コース修了者の修了証書発行を開始しました。お申し込みはオンラインで受け付けています。',
      priority: 'low'
    },
    { 
      id: '12', 
      title: '新コースの開講について', 
      date: '2025/01/12', 
      type: 'school',
      description: '新しい学習コースが開講されます。デジタルスキルや健康管理など、実用的な内容を学べます。',
      priority: 'high'
    },
    { 
      id: '13', 
      title: '学習相談会の開催', 
      date: '2025/01/11', 
      type: 'school',
      description: '学習に関する相談会を開催します。個別相談も可能ですので、お気軽にお申し込みください。',
      priority: 'medium'
    },
    { 
      id: '14', 
      title: 'グループ学習の募集開始', 
      date: '2025/01/10', 
      type: 'school',
      description: '仲間と一緒に学べるグループ学習の募集を開始しました。モチベーション向上に効果的です。',
      priority: 'medium'
    },
    { 
      id: '15', 
      title: '学習成果発表会の開催', 
      date: '2025/01/09', 
      type: 'school',
      description: '学習成果を発表する会を開催します。他の学習者の成果も参考にできます。',
      priority: 'low'
    },
    { 
      id: '16', 
      title: '学習教材の貸出開始', 
      date: '2025/01/08', 
      type: 'school',
      description: '学習教材の貸出サービスを開始しました。必要な教材を無料でお借りいただけます。',
      priority: 'medium'
    },
    { 
      id: '17', 
      title: '学習サポートデスクの開設', 
      date: '2025/01/07', 
      type: 'school',
      description: '学習に関する質問や相談を受け付けるサポートデスクを開設しました。',
      priority: 'low'
    },
    { 
      id: '18', 
      title: '学習環境の改善について', 
      date: '2025/01/06', 
      type: 'school',
      description: '学習環境の改善工事が完了しました。より快適な環境で学習いただけます。',
      priority: 'low'
    },

    // 地域のお知らせ（8件）
    { 
      id: '19', 
      title: '商店街イベント開催', 
      date: '2025/01/15', 
      type: 'local',
      description: '春の訪れを祝う商店街イベントを3月1日に開催します。特産品の販売や体験コーナーもあります。',
      priority: 'low'
    },
    { 
      id: '20', 
      title: '地域清掃活動の参加者募集', 
      date: '2025/01/14', 
      type: 'local',
      description: '美しい街づくりのため、地域清掃活動への参加者を募集しています。',
      priority: 'low'
    },
    { 
      id: '21', 
      title: '地域防災訓練の実施', 
      date: '2025/01/13', 
      type: 'local',
      description: '地域防災力向上のため、防災訓練を実施します。多くの方の参加をお待ちしています。',
      priority: 'high'
    },
    { 
      id: '22', 
      title: '地域文化祭の開催', 
      date: '2025/01/12', 
      type: 'local',
      description: '地域の文化を紹介する文化祭を開催します。伝統芸能や郷土料理をお楽しみください。',
      priority: 'medium'
    },
    { 
      id: '23', 
      title: '地域スポーツ大会の開催', 
      date: '2025/01/11', 
      type: 'local',
      description: '地域スポーツ大会を開催します。年齢を問わず参加できる種目も用意しています。',
      priority: 'medium'
    },
    { 
      id: '24', 
      title: '地域ボランティア募集', 
      date: '2025/01/10', 
      type: 'local',
      description: '地域活動を支えるボランティアを募集しています。経験は問いません。',
      priority: 'low'
    },
    { 
      id: '25', 
      title: '地域環境美化活動', 
      date: '2025/01/09', 
      type: 'local',
      description: '地域の環境美化活動を実施します。花壇の整備やごみ拾いを行います。',
      priority: 'low'
    },
    { 
      id: '26', 
      title: '地域交通安全キャンペーン', 
      date: '2025/01/08', 
      type: 'local',
      description: '交通安全キャンペーンを実施します。安全運転の啓発活動を行います。',
      priority: 'medium'
    }
  ]

  const membersNotices = notices.filter(n => n.type === 'members')
  const schoolNotices = notices.filter(n => n.type === 'school')
  const localNotices = notices.filter(n => n.type === 'local')

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      'high': 'bg-red-100 text-red-700 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'low': 'bg-green-100 text-green-700 border-green-200'
    }
    return colorMap[priority] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getPriorityText = (priority: string) => {
    const textMap: { [key: string]: string } = {
      'high': '重要',
      'medium': '通常',
      'low': 'お知らせ'
    }
    return textMap[priority] || 'お知らせ'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-8">
      {/* スマートライフメンバーズクラブからのお知らせ */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-black">スマートライフメンバーズクラブ</h3>
            <p className="text-sm text-black">会員限定の特別情報をお届けします</p>
          </div>
        </div>
        
        <div className="relative">
          <div 
            ref={membersRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {membersNotices.map((notice) => (
              <div key={notice.id} className="flex-shrink-0 w-80 snap-start">
                <CardBase
                  variant="elevated"
                  className="h-full group hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  {/* ヘッダー */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-black" />
                      <span className="text-sm text-black">{formatDate(notice.date)}</span>
                    </div>
                    
                    {/* 優先度バッジ */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority || 'low')}`}>
                      {getPriorityText(notice.priority || 'low')}
                    </span>
                  </div>

                  {/* コンテンツ */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-black text-lg leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                      {notice.title}
                    </h4>
                    
                    {notice.description && (
                      <p className="text-black text-sm leading-relaxed line-clamp-3">
                        {notice.description}
                      </p>
                    )}
                  </div>

                  {/* アクションエリア */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full btn-notice inline-flex items-center justify-center gap-2">
                      <span>詳細を見る</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardBase>
              </div>
            ))}
          </div>
          
          {/* スクロールボタン */}
          <button 
            onClick={() => scrollLeft(membersRef)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
          <button 
            onClick={() => scrollRight(membersRef)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* スマートライフAO校からのお知らせ */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-black">スマートライフAO校</h3>
            <p className="text-sm text-black">学習プログラムと講座情報をお届けします</p>
          </div>
        </div>
        
        <div className="relative">
          <div 
            ref={schoolRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {schoolNotices.map((notice) => (
              <div key={notice.id} className="flex-shrink-0 w-80 snap-start">
                <CardBase
                  variant="elevated"
                  className="h-full group hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  {/* ヘッダー */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-black" />
                      <span className="text-sm text-black">{formatDate(notice.date)}</span>
                    </div>
                    
                    {/* 優先度バッジ */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority || 'low')}`}>
                      {getPriorityText(notice.priority || 'low')}
                    </span>
                  </div>

                  {/* コンテンツ */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-black text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {notice.title}
                    </h4>
                    
                    {notice.description && (
                      <p className="text-black text-sm leading-relaxed line-clamp-3">
                        {notice.description}
                      </p>
                    )}
                  </div>

                  {/* アクションエリア */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full btn-notice inline-flex items-center justify-center gap-2">
                      <span>詳細を見る</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardBase>
              </div>
            ))}
          </div>
          
          {/* スクロールボタン */}
          <button 
            onClick={() => scrollLeft(schoolRef)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
          <button 
            onClick={() => scrollRight(schoolRef)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 地域からのお知らせ */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-black">地域からのお知らせ</h3>
            <p className="text-sm text-black">地域のイベントや活動情報をお届けします</p>
          </div>
        </div>
        
        <div className="relative">
          <div 
            ref={localRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {localNotices.map((notice) => (
              <div key={notice.id} className="flex-shrink-0 w-80 snap-start">
                <CardBase
                  variant="elevated"
                  className="h-full group hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  {/* ヘッダー */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-black" />
                      <span className="text-sm text-black">{formatDate(notice.date)}</span>
                    </div>
                    
                    {/* 地域バッジ */}
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">
                      地域
                    </span>
                  </div>

                  {/* コンテンツ */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-black text-lg leading-tight group-hover:text-green-600 transition-colors line-clamp-2">
                      {notice.title}
                    </h4>
                    
                    {notice.description && (
                      <p className="text-black text-sm leading-relaxed line-clamp-3">
                        {notice.description}
                      </p>
                    )}
                  </div>

                  {/* アクションエリア */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full btn-notice inline-flex items-center justify-center gap-2">
                      <span>詳細を見る</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardBase>
              </div>
            ))}
          </div>
          
          {/* スクロールボタン */}
          <button 
            onClick={() => scrollLeft(localRef)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
          <button 
            onClick={() => scrollRight(localRef)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* もっと見るボタン */}
      <div className="text-center">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-black font-medium rounded-xl hover:bg-gray-200 transition-all duration-200">
          <span>すべてのお知らせを見る</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}