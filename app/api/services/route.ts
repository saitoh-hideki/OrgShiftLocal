import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const municipality = searchParams.get('municipality')

    if (!category || !municipality) {
      return NextResponse.json(
        { error: 'Category and municipality are required' },
        { status: 400 }
      )
    }

    // URLデコードしてパラメータを取得
    const decodedCategory = decodeURIComponent(category)
    const decodedMunicipality = decodeURIComponent(municipality)

    // カテゴリに応じたサービスデータを返す
    const services = getServicesByCategory(decodedCategory, decodedMunicipality)

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

function getServicesByCategory(category: string, municipality: string): any[] {
  // 長野市の実際のサービスURLを返す
  const servicesByCategory: { [key: string]: any[] } = {
    'life': [
      {
        id: '1',
        title_ja: 'ごみ分別・収集',
        summary_ja: '長野市のごみ分別ルールと収集日を確認',
        icon: '♻️',
        url: 'https://www.city.nagano.nagano.jp/soshiki/kenko/kankyo/gomi/'
      },
      {
        id: '2',
        title_ja: '図書館サービス',
        summary_ja: '長野市立図書館の利用案内と予約',
        icon: '📚',
        url: 'https://www.city.nagano.nagano.jp/soshiki/bunka/toshokan/'
      },
      {
        id: '3',
        title_ja: '公共交通',
        summary_ja: '長野市内のバス・電車の時刻表',
        icon: '🚌',
        url: 'https://www.city.nagano.nagano.jp/soshiki/kotsu/'
      },
      {
        id: '4',
        title_ja: '水道・下水道',
        summary_ja: '水道料金や下水道工事情報',
        icon: '💧',
        url: 'https://www.city.nagano.nagano.jp/soshiki/suidou/'
      }
    ],
    'safety': [
      {
        id: '5',
        title_ja: '防災情報',
        summary_ja: '長野市の防災・避難情報',
        icon: '🛡️',
        url: 'https://www.city.nagano.nagano.jp/soshiki/bousai/'
      },
      {
        id: '6',
        title_ja: '警察・消防',
        summary_ja: '長野市内の警察署・消防署の連絡先',
        icon: '🚨',
        url: 'https://www.city.nagano.nagano.jp/soshiki/keisatsu/'
      }
    ],
    'health': [
      {
        id: '7',
        title_ja: '健康・医療',
        summary_ja: '長野市の健康診断・予防接種',
        icon: '🏥',
        url: 'https://www.city.nagano.nagano.jp/soshiki/kenko/'
      },
      {
        id: '8',
        title_ja: '介護サービス',
        summary_ja: '長野市の介護保険・サービス情報',
        icon: '👴',
        url: 'https://www.city.nagano.nagano.jp/soshiki/kaigo/'
      }
    ],
    'childcare': [
      {
        id: '9',
        title_ja: '子育て支援',
        summary_ja: '長野市の子育て支援制度',
        icon: '👶',
        url: 'https://www.city.nagano.nagano.jp/soshiki/kosodate/'
      },
      {
        id: '10',
        title_ja: '保育園・幼稚園',
        summary_ja: '長野市内の保育施設情報',
        icon: '🏫',
        url: 'https://www.city.nagano.nagano.jp/soshiki/hoiku/'
      }
    ],
    'procedures': [
      {
        id: '11',
        title_ja: '各種証明書',
        summary_ja: '住民票・戸籍謄本の取得',
        icon: '📋',
        url: 'https://www.city.nagano.nagano.jp/soshiki/shimin/'
      },
      {
        id: '12',
        title_ja: '税金・保険',
        summary_ja: '市民税・国民健康保険の手続き',
        icon: '💰',
        url: 'https://www.city.nagano.nagano.jp/soshiki/zeimu/'
      }
    ],
    'future': [
      {
        id: '13',
        title_ja: '教育・学習',
        summary_ja: '長野市の学校・生涯学習',
        icon: '🎓',
        url: 'https://www.city.nagano.nagano.jp/soshiki/kyoiku/'
      },
      {
        id: '14',
        title_ja: '就職・創業',
        summary_ja: '長野市の就職支援・創業支援',
        icon: '💼',
        url: 'https://www.city.nagano.nagano.jp/soshiki/syugyo/'
      }
    ]
  };

  return servicesByCategory[category] || [];
}
