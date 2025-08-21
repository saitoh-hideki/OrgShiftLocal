import React from 'react';
import { createClient } from '@/lib/supabase/server';
import CardBase from '@/components/CardBase';
import Chip from '@/components/Chip';
import { Plus, Search, Filter, Edit, Copy, Eye, EyeOff, MoreVertical } from 'lucide-react';
import Link from 'next/link';

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

export default async function VideosPage({
  searchParams,
}: {
  searchParams?: Promise<{ 
    q?: string; 
    category?: string; 
    status?: string; 
    year?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = createClient();
  
  // クエリパラメータ
  const search = params?.q || '';
  const category = params?.category || '';
  const status = params?.status || '';
  const year = params?.year || '';
  const page = parseInt(params?.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  // 動画一覧を取得
  let query = supabase
    .from('learning_videos')
    .select('*', { count: 'exact' });

  // フィルタリング
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (category && category !== 'すべて') {
    query = query.eq('category', category);
  }
  if (status && status !== 'すべて') {
    if (status === 'published') {
      query = query.eq('is_published', true);
    } else if (status === 'draft') {
      query = query.eq('is_published', false);
    }
  }
  if (year && year !== 'すべて') {
    query = query.eq('year', parseInt(year));
  }

  // ページネーション
  query = query.range(offset, offset + limit - 1);
  query = query.order('created_at', { ascending: false });

  const { data: videos, count: totalCount } = await query;

  const totalPages = Math.ceil((totalCount || 0) / limit);

  // カテゴリと年度のオプション
  const categories = ['すべて', '安全', 'IT', 'AI', '環境', '文化', '健康', '子育て', 'その他'];
  const years = ['すべて', '2025', '2024', '2023', '2022'];
  const statuses = ['すべて', 'published', 'draft'];

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">動画管理</h1>
          <p className="text-gray-600 mt-2">学習動画の作成・編集・管理</p>
        </div>
        <Link
          href="/admin/videos/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新しい動画
        </Link>
      </div>

      {/* フィルター */}
      <CardBase>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="タイトル・説明"
                defaultValue={search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* カテゴリ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
            <select
              defaultValue={category}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'すべて' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 公開状態 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状態</label>
            <select
              defaultValue={status}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(s => (
                <option key={s} value={s === 'すべて' ? '' : s}>
                  {s === 'published' ? '公開' : s === 'draft' ? '下書き' : s}
                </option>
              ))}
            </select>
          </div>

          {/* 年度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">年度</label>
            <select
              defaultValue={year}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {years.map(y => (
                <option key={y} value={y === 'すべて' ? '' : y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* フィルター適用 */}
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4 inline mr-2" />
              適用
            </button>
          </div>
        </div>
      </CardBase>

      {/* 動画一覧 */}
      <CardBase>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">タイトル</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">年度</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">カテゴリ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">状態</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">更新日</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">操作</th>
              </tr>
            </thead>
            <tbody>
              {videos && videos.length > 0 ? (
                videos.map((video: Video) => (
                  <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{video.title}</p>
                        {video.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Chip variant="blue" size="sm">{video.year}</Chip>
                    </td>
                    <td className="py-3 px-4">
                      <Chip variant="gray" size="sm">{video.category}</Chip>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        video.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {video.is_published ? '公開' : '下書き'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(video.updated_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/videos/${video.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="複製"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title={video.is_published ? '非公開にする' : '公開する'}
                        >
                          {video.is_published ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    動画が見つかりませんでした
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              {offset + 1} - {Math.min(offset + limit, totalCount || 0)} / {totalCount}件
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i + 1}
                  href={`/admin/videos?page=${i + 1}`}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    page === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardBase>
    </div>
  );
}
