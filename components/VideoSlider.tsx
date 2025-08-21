'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Clock, Users, Calendar, Star } from 'lucide-react';
import CardBase from './CardBase';

interface Video {
  id: string;
  title: string;
  description?: string;
  year: number;
  category: string;
  durationSeconds: number;
  thumbnailUrl?: string;
  target?: string;
}

interface VideoSliderProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
  className?: string;
}

const CATEGORIES = ['すべて', '安全', 'IT', 'AI', '環境', '文化', '健康', '子育て', 'その他'];
const YEARS = ['すべて', '2025', '2024', '2023', '2022'];

export default function VideoSlider({ videos, onVideoClick, className = "" }: VideoSliderProps) {
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [selectedYear, setSelectedYear] = useState('すべて');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // フィルタリングされた動画
  const filteredVideos = videos.filter(video => {
    const categoryMatch = selectedCategory === 'すべて' || video.category === selectedCategory;
    const yearMatch = selectedYear === 'すべて' || video.year.toString() === selectedYear;
    const searchMatch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && yearMatch && searchMatch;
  });

  // 横スクロール機能
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // 時間のフォーマット
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes > 0 ? `${minutes}分` : ''}`;
    }
    return `${minutes}分`;
  };

  if (filteredVideos.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">該当する動画が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* セクションヘッダー */}
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          過去の学び動画
          <span className="block text-lg font-normal text-gray-600 mt-2">
            Past Learning Videos
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          地域の知識やスキルを学べる動画コンテンツをご紹介します
        </p>
      </div>

      {/* フィルター */}
      <div className="mb-8">
        {/* 検索 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="動画を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md mx-auto px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>
        
        {/* カテゴリ・年フィルター */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* カテゴリフィルター */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">カテゴリ:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* 年フィルター */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">年:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
            >
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 横スクロールカルーセル */}
      <div className="relative group">
        {/* 左スクロールボタン */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[#3A9BDC] hover:border-[#3A9BDC]/30 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 右スクロールボタン */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[#3A9BDC] hover:border-[#3A9BDC]/30 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* スクロールコンテナ */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="flex-shrink-0 w-80 snap-start"
            >
              <CardBase className="h-full group hover:scale-105 transition-transform duration-300">
                <div className="space-y-4">
                  {/* サムネイルと再生ボタン */}
                  <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* 再生ボタンオーバーレイ */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-8 h-8 text-[#3A9BDC] ml-1" />
                      </div>
                    </div>

                    {/* カテゴリチップ */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200">
                        {video.category}
                      </span>
                    </div>

                    {/* 年度バッジ */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3A9BDC] text-white">
                        {video.year}
                      </span>
                    </div>
                  </div>

                  {/* タイトル */}
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-[#3A9BDC] transition-colors">
                    {video.title}
                  </h3>

                  {/* 説明 */}
                  {video.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}

                  {/* メタ情報 */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(video.durationSeconds)}</span>
                    </div>
                    
                    {video.target && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{video.target}</span>
                      </div>
                    )}
                  </div>

                  {/* CTAボタン */}
                  <div className="pt-4">
                    <button 
                      onClick={() => onVideoClick(video)}
                      className="w-full bg-gradient-to-r from-[#3A9BDC] to-[#2E5D50] hover:from-[#2E5D50] hover:to-[#3A9BDC] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      動画を見る
                    </button>
                  </div>
                </div>
              </CardBase>
            </div>
          ))}
        </div>

        {/* グラデーションフェード（右端） */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* すべての動画を見るボタン */}
      <div className="text-center mt-8">
        <button className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#3A9BDC]/30 rounded-xl text-gray-700 hover:text-[#3A9BDC] font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
          すべての動画を見る
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
