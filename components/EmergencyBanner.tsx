'use client';

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

interface EmergencyBannerProps {
  message?: string
  link?: string
}

export default function EmergencyBanner({ message, link }: EmergencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  
  if (!message || !isVisible) return null
  
  return (
    <div className="bg-danger text-white">
      <div className="container">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{message}</p>
            {link && (
              <a
                href={link}
                className="text-sm underline hover:no-underline ml-auto mr-4"
              >
                詳しく見る
              </a>
            )}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}