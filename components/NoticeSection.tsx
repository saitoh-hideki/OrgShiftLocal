import { Bell, MapPin } from 'lucide-react'

interface Notice {
  id: string
  title: string
  date: string
  type: 'gov' | 'local'
}

export default function NoticeSection() {
  const notices: Notice[] = [
    { id: '1', title: '市民税の申告期限について', date: '2025/01/15', type: 'gov' },
    { id: '2', title: '図書館の臨時休館のお知らせ', date: '2025/01/14', type: 'gov' },
    { id: '3', title: '防災訓練の実施について', date: '2025/01/13', type: 'gov' },
    { id: '4', title: '商店街イベント開催', date: '2025/01/12', type: 'local' },
    { id: '5', title: '地域清掃活動の参加者募集', date: '2025/01/11', type: 'local' },
  ]

  const govNotices = notices.filter(n => n.type === 'gov')
  const localNotices = notices.filter(n => n.type === 'local')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 行政からのお知らせ */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">行政からのお知らせ</h3>
        </div>
        <div className="space-y-3">
          {govNotices.map((notice) => (
            <a
              key={notice.id}
              href="#"
              className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium hover:text-primary transition-colors">
                  {notice.title}
                </p>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {notice.date}
                </span>
              </div>
            </a>
          ))}
        </div>
        <a href="#" className="block mt-4 text-sm text-primary hover:underline">
          すべて見る →
        </a>
      </div>

      {/* 地域のお知らせ */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-lg">地域のお知らせ</h3>
        </div>
        <div className="space-y-3">
          {localNotices.map((notice) => (
            <a
              key={notice.id}
              href="#"
              className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium hover:text-accent transition-colors">
                  {notice.title}
                </p>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {notice.date}
                </span>
              </div>
            </a>
          ))}
        </div>
        <a href="#" className="block mt-4 text-sm text-accent hover:underline">
          すべて見る →
        </a>
      </div>
    </div>
  )
}