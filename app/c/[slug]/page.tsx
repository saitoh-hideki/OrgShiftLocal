'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const CATEGORY_NAMES: { [key: string]: string } = {
  'safety': '防災・安心',
  'life': '生活サポート',
  'health': '健康・医療',
  'childcare': '子育て・教育',
  'procedures': '行政手続き',
  'future': '未来・学び'
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log('Loading services for category:', slug);
        const response = await fetch(`/api/services?category=${slug}&municipality=長野市`);
        console.log('API response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API response data:', data);
        setServices(data.services || []);
      } catch (error) {
        console.error('Failed to load services:', error);
        // フォールバックデータ
        setServices([
          {
            id: '1',
            title_ja: 'サンプルサービス',
            summary_ja: 'このカテゴリのサービスがここに表示されます',
            icon: '📋'
          }
        ]);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    loadServices();
  }, [slug]);

  const handleServiceClick = (service: any) => {
    if (service.url) {
      window.open(service.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* 戻るボタン */}
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          ダッシュボードに戻る
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {CATEGORY_NAMES[slug] || 'カテゴリ'}
        </h1>
        <p className="text-gray-600">
          長野市の{CATEGORY_NAMES[slug] || 'カテゴリ'}に関するサービスと情報
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                {service.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{service.title_ja}</h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{service.summary_ja}</p>
            <button 
              onClick={() => handleServiceClick(service)}
              className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              {service.url ? '詳細を見る' : '準備中'}
            </button>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">このカテゴリにはまだサービスがありません</p>
        </div>
      )}
    </main>
  );
}
