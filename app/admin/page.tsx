import React from 'react';
import { createClient } from '@/lib/supabase/server';
import CardBase from '@/components/CardBase';
import { 
  Video, 
  Newspaper, 
  Calendar, 
  HelpCircle, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

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
  is_published: boolean;
  updated_at: string;
}

export default async function AdminDashboard() {
  const supabase = createClient();
  
  // 統計データを取得
  const { count: videoCount } = await supabase
    .from('learning_videos')
    .select('*', { count: 'exact', head: true });
  
  const { count: publishedVideoCount } = await supabase
    .from('learning_videos')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);
  
  const { count: draftVideoCount } = await supabase
    .from('learning_videos')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', false);

  // 最近の更新履歴
  const { data: recentVideos } = await supabase
    .from('learning_videos')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">システムの概要と最近の活動</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardBase className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-4">
            <Video className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{videoCount || 0}</h3>
          <p className="text-gray-600">総動画数</p>
        </CardBase>

        <CardBase className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{publishedVideoCount || 0}</h3>
          <p className="text-gray-600">公開済み</p>
        </CardBase>

        <CardBase className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mx-auto mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{draftVideoCount || 0}</h3>
          <p className="text-gray-600">下書き</p>
        </CardBase>

        <CardBase className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">0</h3>
          <p className="text-gray-600">予約公開</p>
        </CardBase>
      </div>

      {/* 最近の更新 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CardBase>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近の動画更新</h3>
          {recentVideos && recentVideos.length > 0 ? (
            <div className="space-y-3">
              {recentVideos.map((video: Video) => (
                <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{video.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(video.updated_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    video.is_published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {video.is_published ? '公開' : '下書き'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">まだ動画がありません</p>
          )}
        </CardBase>

        <CardBase>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
          <div className="space-y-3">
            <a 
              href="/admin/videos/new" 
              className="block w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              新しい動画を追加
            </a>
            <a 
              href="/admin/videos" 
              className="block w-full p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              動画一覧を表示
            </a>
            <a 
              href="/admin/videos/import" 
              className="block w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              CSVインポート
            </a>
          </div>
        </CardBase>
      </div>

      {/* システム情報 */}
      <CardBase>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">システム情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">環境:</span>
            <span className="ml-2 font-medium">開発環境</span>
          </div>
          <div>
            <span className="text-gray-500">データベース:</span>
            <span className="ml-2 font-medium">Supabase</span>
          </div>
          <div>
            <span className="text-gray-500">最終更新:</span>
            <span className="ml-2 font-medium">
              {new Date().toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>
      </CardBase>
    </div>
  );
}
