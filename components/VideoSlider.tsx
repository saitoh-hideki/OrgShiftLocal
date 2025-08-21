'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';
import Chip from './Chip';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [selectedYear, setSelectedYear] = useState('すべて');
  const [searchQuery, setSearchQuery] = useState('');
  const trackRef = useRef<HTMLDivElement>(null);
  
  // フィルタリングされた動画
  const filteredVideos = videos.filter(video => {
    const categoryMatch = selectedCategory === 'すべて' || video.category === selectedCategory;
    const yearMatch = selectedYear === 'すべて' || video.year.toString() === selectedYear;
    const searchMatch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && yearMatch && searchMatch;
  });

  // レスポンシブ設定
  const getSlidesPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2;  // md
    return 1; // sm
  };

  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
      setCurrentSlide(0); // リセット
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlides = Math.max(0, filteredVideos.length - slidesPerView);
  const totalSlides = Math.ceil(filteredVideos.length / slidesPerView);

  const goToSlide = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxSlides));
    setCurrentSlide(clampedIndex);
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const goToPage = (page: number) => {
    setCurrentSlide(page * slidesPerView);
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
      {/* フィルター */}
      <div className="mb-8">
        {/* 検索 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="動画を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input max-w-md mx-auto"
          />
        </div>
        
        {/* カテゴリフィルター */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {CATEGORIES.map(category => (
            <Chip
              key={category}
              variant={selectedCategory === category ? 'blue' : 'gray'}
              onClick={() => setSelectedCategory(category)}
              className="cursor-pointer"
            >
              {category}
            </Chip>
          ))}
        </div>
        
        {/* 年度フィルター */}
        <div className="flex flex-wrap justify-center gap-2">
          {YEARS.map(year => (
            <Chip
              key={year}
              variant={selectedYear === year ? 'blue' : 'gray'}
              onClick={() => setSelectedYear(year)}
              className="cursor-pointer"
            >
              {year}
            </Chip>
          ))}
        </div>
      </div>

      {/* スライダー */}
      <div className="slider-container">
        {/* ナビゲーションボタン */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="slider-nav left-4"
          aria-label="前の動画"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={nextSlide}
          disabled={currentSlide >= maxSlides}
          className="slider-nav right-4"
          aria-label="次の動画"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* スライドトラック */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="slider-track"
            style={{
              transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`
            }}
          >
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className="slider-slide"
                style={{ width: `${100 / slidesPerView}%` }}
              >
                <div className="px-2">
                  <VideoCard
                    {...video}
                    onClick={() => onVideoClick(video)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ページドット */}
        {totalSlides > 1 && (
          <div className="slider-dots">
            {Array.from({ length: totalSlides }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`slider-dot ${Math.floor(currentSlide / slidesPerView) === i ? 'active' : ''}`}
                aria-label={`ページ ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 動画数表示 */}
      <div className="text-center mt-4 text-sm text-gray-500">
        {filteredVideos.length}件の動画
      </div>
    </div>
  );
}
