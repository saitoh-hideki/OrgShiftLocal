import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-border mt-16">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 運営情報 */}
          <div>
            <h3 className="font-bold text-sm mb-3">運営情報</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-gray-600 hover:text-primary">
                このサイトについて
              </Link>
              <Link href="/accessibility" className="block text-sm text-gray-600 hover:text-primary">
                アクセシビリティ
              </Link>
              <Link href="/sitemap" className="block text-sm text-gray-600 hover:text-primary">
                サイトマップ
              </Link>
            </div>
          </div>

          {/* 利用案内 */}
          <div>
            <h3 className="font-bold text-sm mb-3">利用案内</h3>
            <div className="space-y-2">
              <Link href="/terms" className="block text-sm text-gray-600 hover:text-primary">
                利用規約
              </Link>
              <Link href="/privacy" className="block text-sm text-gray-600 hover:text-primary">
                プライバシーポリシー
              </Link>
              <Link href="/cookies" className="block text-sm text-gray-600 hover:text-primary">
                Cookieポリシー
              </Link>
            </div>
          </div>

          {/* サポート */}
          <div>
            <h3 className="font-bold text-sm mb-3">サポート</h3>
            <div className="space-y-2">
              <Link href="/faq" className="block text-sm text-gray-600 hover:text-primary">
                よくある質問
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 hover:text-primary">
                お問い合わせ
              </Link>
              <Link href="/feedback" className="block text-sm text-gray-600 hover:text-primary">
                フィードバック
              </Link>
            </div>
          </div>

          {/* 関連リンク */}
          <div>
            <h3 className="font-bold text-sm mb-3">関連リンク</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-gray-600 hover:text-primary">
                市役所ホームページ
              </a>
              <a href="#" className="block text-sm text-gray-600 hover:text-primary">
                観光協会
              </a>
              <a href="#" className="block text-sm text-gray-600 hover:text-primary">
                商工会議所
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-gray-500 text-center">
            © 2025 OrgShift Local. プロトタイプ版
          </p>
        </div>
      </div>
    </footer>
  )
}