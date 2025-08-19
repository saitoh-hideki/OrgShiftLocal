"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Link } from '@/types'
import { 
  Trash2, Shield, BookOpen, Heart, 
  Baby, Bus, FileText, Building,
  ExternalLink 
} from 'lucide-react'

const iconMap: { [key: string]: any } = {
  'recycle': Trash2,
  'shield': Shield,
  'book-open': BookOpen,
  'heart': Heart,
  'baby': Baby,
  'bus': Bus,
  'file-text': FileText,
  'building': Building,
}

export default function GovShortcutGrid() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('type', 'gov')
        .eq('is_active', true)
        .order('order_index')
        .limit(8)

      if (error) throw error
      setLinks(data || [])
    } catch (error) {
      console.error('Failed to fetch links:', error)
      // フォールバック用のダミーデータ
      setLinks([
        { id: '1', category: 'waste', title: 'ごみ分別', url: '#', icon: 'recycle', type: 'gov', order_index: 1, is_active: true, created_at: '' },
        { id: '2', category: 'disaster', title: '防災', url: '#', icon: 'shield', type: 'gov', order_index: 2, is_active: true, created_at: '' },
        { id: '3', category: 'library', title: '図書館', url: '#', icon: 'book-open', type: 'gov', order_index: 3, is_active: true, created_at: '' },
        { id: '4', category: 'health', title: '健康', url: '#', icon: 'heart', type: 'gov', order_index: 4, is_active: true, created_at: '' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = (iconName?: string) => {
    if (!iconName) return ExternalLink
    return iconMap[iconName] || ExternalLink
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {links.map((link) => {
        const Icon = getIcon(link.icon)
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:shadow-xl transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm mb-1">{link.title}</h3>
              {link.description && (
                <p className="text-xs text-gray-600 line-clamp-2">{link.description}</p>
              )}
            </div>
          </a>
        )
      })}
    </div>
  )
}