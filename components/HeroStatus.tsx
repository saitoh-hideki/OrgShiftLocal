"use client"

import { Cloud, Trash2, Shield, Thermometer, Calendar, AlertTriangle } from 'lucide-react'
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
      default: return 'text-gray-400'
    }
  }

  const getDisasterIcon = (level: number) => {
    switch(level) {
      case 1: return '🟢'
      case 2: return '🔵'
      case 3: return '🟡'
      case 4: return '🟠'
      case 5: return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 天気カード */}
      <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">天気 / Weather</h3>
            <p className="text-sm text-white/80">今日と明日の天気予報</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/80">今日</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{status.weather.today}</div>
              <div className="flex items-center gap-1 text-sm text-white/80">
                <Thermometer className="w-3 h-3" />
                {status.weather.temp}°C
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/80">明日</span>
            </div>
            <div className="font-semibold">{status.weather.tomorrow}</div>
          </div>
        </div>
      </div>

      {/* ごみカード */}
      <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">ごみ収集 / Waste Collection</h3>
            <p className="text-sm text-white/80">今日と明日の収集予定</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/80">今日</span>
            </div>
            <div className="font-semibold text-green-200">{status.waste.today}</div>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/80">明日</span>
            </div>
            <div className="font-semibold">{status.waste.tomorrow}</div>
          </div>
        </div>
      </div>

      {/* 防災レベルカード */}
      <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">防災レベル / Disaster Level</h3>
            <p className="text-sm text-white/80">現在の防災状況</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">{getDisasterIcon(status.disaster.level)}</div>
            <div className={`text-2xl font-bold ${getDisasterColor(status.disaster.level)} mb-2`}>
              レベル {status.disaster.level}
            </div>
            <p className="text-sm text-white/80">{status.disaster.message}</p>
          </div>
          {status.disaster.level > 2 && (
            <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-orange-300" />
              <span className="text-sm text-orange-200">注意が必要です</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}