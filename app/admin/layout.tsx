import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証チェック（簡易版）
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // 管理者権限チェック（簡易版）
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (profile?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* サイドバー */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">管理画面</h1>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a 
                  href="/admin" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ダッシュボード
                </a>
              </li>
              <li>
                <a 
                  href="/admin/videos" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  動画管理
                </a>
              </li>
              <li>
                <a 
                  href="/admin/news" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ニュース管理
                </a>
              </li>
              <li>
                <a 
                  href="/admin/learning-events" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  学習イベント管理
                </a>
              </li>
              <li>
                <a 
                  href="/admin/quizzes" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  クイズ管理
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
