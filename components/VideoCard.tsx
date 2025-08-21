import React from 'react';
import { Play, Clock, Target } from 'lucide-react';
import Chip from './Chip';

interface VideoCardProps {
  id: string;
  title: string;
  description?: string;
  year: number;
  category: string;
  durationSeconds: number;
  thumbnailUrl?: string;
  target?: string;
  onClick: () => void;
  className?: string;
}

export default function VideoCard({
  id,
  title,
  description,
  year,
  category,
  durationSeconds,
  thumbnailUrl,
  target,
  onClick,
  className = ""
}: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  return (
    <div 
      className={`card-base p-0 overflow-hidden cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* サムネイル */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* 再生オーバーレイ */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <Play className="w-8 h-8 text-gray-700 ml-1" />
          </div>
        </div>
        
        {/* 左上：年度バッジ */}
        <div className="absolute top-3 left-3">
          <Chip variant="blue" size="sm">
            {year}
          </Chip>
        </div>
        
        {/* 右上：カテゴリバッジ */}
        <div className="absolute top-3 right-3">
          <Chip variant="gray" size="sm">
            {category}
          </Chip>
        </div>
      </div>
      
      {/* コンテンツ */}
      <div className="p-4">
        {/* タイトル */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        {/* 説明（任意） */}
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* メタ情報 */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(durationSeconds)}</span>
          </div>
          
          {target && (
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{target}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
