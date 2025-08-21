'use client';

import React, { useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';
import VideoCard from './VideoCard';

interface Video {
  id: string;
  title: string;
  description?: string;
  year: number;
  category: string;
  durationSeconds: number;
  thumbnailUrl?: string;
  target?: string;
  videoUrl: string;
  materialsUrl?: string;
  speaker?: string;
}

interface ModalPlayerProps {
  video: Video | null;
  relatedVideos: Video[];
  isOpen: boolean;
  onClose: () => void;
  onVideoClick: (video: Video) => void;
}

export default function ModalPlayer({ 
  video, 
  relatedVideos, 
  isOpen, 
  onClose, 
  onVideoClick 
}: ModalPlayerProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 外側クリックで閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !video) return null;

  // YouTube URLを埋め込みURLに変換
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.match(/v=([^&]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    return url;
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div ref={modalRef} className="modal-content">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{video.title}</h2>
            {video.speaker && (
              <p className="text-sm text-gray-600 mt-1">講師: {video.speaker}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* メインコンテンツ */}
          <div className="flex-1 p-6">
            {/* 動画プレイヤー */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
              <iframe
                src={getEmbedUrl(video.videoUrl)}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* 動画情報 */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">説明</h3>
                <p className="text-gray-600">
                  {video.description || '説明はありません。'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">
                  カテゴリ: {video.category}
                </span>
                <span className="text-sm text-gray-500">
                  年度: {video.year}
                </span>
                <span className="text-sm text-gray-500">
                  再生時間: {Math.floor(video.durationSeconds / 60)}分
                </span>
              </div>

              {/* 資料ダウンロード */}
              {video.materialsUrl && (
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={video.materialsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    資料をダウンロード
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 右サイドバー（関連動画） */}
          {relatedVideos.length > 0 && (
            <div className="w-full lg:w-80 p-6 border-l border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">関連動画</h3>
              <div className="space-y-4">
                {relatedVideos.slice(0, 3).map((relatedVideo) => (
                  <div key={relatedVideo.id} className="cursor-pointer">
                    <VideoCard
                      {...relatedVideo}
                      onClick={() => onVideoClick(relatedVideo)}
                      className="!p-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
