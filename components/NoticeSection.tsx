import { Bell, MapPin, ChevronRight, Calendar, Pin } from 'lucide-react'
import CardBase from './CardBase'

interface Notice {
  id: string
  title: string
  date: string
  type: 'gov' | 'local'
  description?: string
  priority?: 'high' | 'medium' | 'low'
}

export default function NoticeSection() {
  const notices: Notice[] = [
    { 
      id: '1', 
      title: '市民税の申告期限について', 
      date: '2025/01/15', 
      type: 'gov',
      description: '2024年度分の市民税の確定申告期限が近づいています。期限内の申告をお願いします。',
      priority: 'high'
    },
    { 
      id: '2', 
      title: '図書館の臨時休館のお知らせ', 
      date: '2025/01/14', 
      type: 'gov',
      description: 'システムメンテナンスのため、1月20日から22日まで臨時休館いたします。',
      priority: 'medium'
    },
    { 
      id: '3', 
      title: '防災訓練の実施について', 
      date: '2025/01/13', 
      type: 'gov',
      description: '地域防災力向上のため、2月15日に防災訓練を実施します。多くの方の参加をお待ちしています。',
      priority: 'medium'
    },
    { 
      id: '4', 
      title: '商店街イベント開催', 
      date: '2025/01/12', 
      type: 'local',
      description: '春の訪れを祝う商店街イベントを3月1日に開催します。特産品の販売や体験コーナーもあります。',
      priority: 'low'
    },
    { 
      id: '5', 
      title: '地域清掃活動の参加者募集', 
      date: '2025/01/11', 
      type: 'local',
      description: '美しい街づくりのため、地域清掃活動への参加者を募集しています。',
      priority: 'low'
    },
    { 
      id: '6', 
      title: '新型コロナウイルス感染症対策について', 
      date: '2025/01/10', 
      type: 'gov',
      description: '感染症の拡大防止のため、基本的な感染症対策の徹底をお願いします。',
      priority: 'high'
    }
  ]

  const govNotices = notices.filter(n => n.type === 'gov').slice(0, 3)
  const localNotices = notices.filter(n => n.type === 'local').slice(0, 3)

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

  return (
    <div className="space-y-8">
      {/* 行政からのお知らせ */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-sm">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-black">行政からのお知らせ</h3>
            <p className="text-sm text-black">重要な行政情報をお届けします</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {govNotices.map((notice) => (
            <CardBase
              key={notice.id}
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
                <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl group-hover:bg-blue-700 transition-all duration-200 shadow-sm group-hover:shadow-md">
                  <span>詳細を見る</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </CardBase>
          ))}
        </div>
      </div>

      {/* 地域のお知らせ */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-black">地域のお知らせ</h3>
            <p className="text-sm text-black">地域のイベントや活動情報をお届けします</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localNotices.map((notice) => (
            <CardBase
              key={notice.id}
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
                <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl group-hover:bg-green-700 transition-all duration-200 shadow-sm group-hover:shadow-md">
                  <span>詳細を見る</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </CardBase>
          ))}
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