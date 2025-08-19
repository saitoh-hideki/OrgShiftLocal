"use client"

import { Cloud, Trash2, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatusData {
  weather: {
    today: string
    tomorrow: string
    temp: number
  }
  waste: {
    today: string
    tomorrow: string
  }
  disaster: {
    level: number
    message: string
  }
}

export default function HeroStatus() {
  const [status, setStatus] = useState<StatusData>({
    weather: { today: '晴れ', tomorrow: '曇り', temp: 22 },
    waste: { today: '可燃ごみ', tomorrow: '資源ごみ' },
    disaster: { level: 1, message: '平常' }
  })

  useEffect(() => {
    // 実際のAPIから取得する場合はここで実装
  }, [])

  const getDisasterColor = (level: number) => {
    switch(level) {
      case 1: return 'text-success'
      case 2: return 'text-blue-500'
      case 3: return 'text-warning'
      case 4: return 'text-orange-600'
      case 5: return 'text-danger'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 天気カード */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <Cloud className="w-5 h-5 text-accent" />
          <h3 className="font-bold">天気</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">今日</span>
            <span className="text-sm font-medium">{status.weather.today} {status.weather.temp}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">明日</span>
            <span className="text-sm font-medium">{status.weather.tomorrow}</span>
          </div>
        </div>
      </div>

      {/* ごみカード */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <Trash2 className="w-5 h-5 text-primary" />
          <h3 className="font-bold">ごみ収集</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">今日</span>
            <span className="text-sm font-medium text-primary">{status.waste.today}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">明日</span>
            <span className="text-sm font-medium">{status.waste.tomorrow}</span>
          </div>
        </div>
      </div>

      {/* 防災レベルカード */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-success" />
          <h3 className="font-bold">防災レベル</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getDisasterColor(status.disaster.level)}`}>
              レベル {status.disaster.level}
            </span>
          </div>
          <p className="text-sm text-gray-600">{status.disaster.message}</p>
        </div>
      </div>
    </div>
  )
}