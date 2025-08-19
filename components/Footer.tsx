import Link from 'next/link'
import { Globe, Mail, MessageCircle, Heart, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* ブランド情報 */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2E5D50] to-[#3A9BDC] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  OrgShift Local
                  <span className="block text-sm font-normal text-gray-300">地域ポータル</span>
                </h3>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              日本全国の自治体・地域情報をワンストップ化し、「生活の便利」と「学びの継続」を両立するポータルサイトです。
              <span className="block text-sm text-gray-400 mt-2">
                A one-stop portal that consolidates local government and regional information across Japan, 
                achieving both "convenience in daily life" and "continuous learning."
              </span>
            </p>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Globe className="w-5 h-5 text-gray-300" />
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-gray-300" />
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* 運営情報 */}
          <div>
            <h4 className="font-semibold text-gray-100 mb-4 text-sm uppercase tracking-wide">
              運営情報
              <span className="block text-xs text-gray-400 mt-1">Operations</span>
            </h4>
            <div className="space-y-3">
              <Link href="/about" className="block text-sm text-gray-300 hover:text-white transition-colors">
                このサイトについて
                <span className="block text-xs text-gray-400">About</span>
              </Link>
              <Link href="/accessibility" className="block text-sm text-gray-300 hover:text-white transition-colors">
                アクセシビリティ
                <span className="block text-xs text-gray-400">Accessibility</span>
              </Link>
              <Link href="/sitemap" className="block text-sm text-gray-300 hover:text-white transition-colors">
                サイトマップ
                <span className="block text-xs text-gray-400">Sitemap</span>
              </Link>
            </div>
          </div>

          {/* 利用案内 */}
          <div>
            <h4 className="font-semibold text-gray-100 mb-4 text-sm uppercase tracking-wide">
              利用案内
              <span className="block text-xs text-gray-400 mt-1">Guidelines</span>
            </h4>
            <div className="space-y-3">
              <Link href="/terms" className="block text-sm text-gray-300 hover:text-white transition-colors">
                利用規約
                <span className="block text-xs text-gray-400">Terms of Service</span>
              </Link>
              <Link href="/privacy" className="block text-sm text-gray-300 hover:text-white transition-colors">
                プライバシーポリシー
                <span className="block text-xs text-gray-400">Privacy Policy</span>
              </Link>
              <Link href="/cookies" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Cookieポリシー
                <span className="block text-xs text-gray-400">Cookie Policy</span>
              </Link>
            </div>
          </div>
        </div>

        {/* サポート・関連リンク */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* サポート */}
          <div>
            <h4 className="font-semibold text-gray-100 mb-4 text-sm uppercase tracking-wide">
              サポート
              <span className="block text-xs text-gray-400 mt-1">Support</span>
            </h4>
            <div className="space-y-3">
              <Link href="/faq" className="block text-sm text-gray-300 hover:text-white transition-colors">
                よくある質問
                <span className="block text-xs text-gray-400">FAQ</span>
              </Link>
              <Link href="/contact" className="block text-sm text-gray-300 hover:text-white transition-colors">
                お問い合わせ
                <span className="block text-xs text-gray-400">Contact</span>
              </Link>
              <Link href="/feedback" className="block text-sm text-gray-300 hover:text-white transition-colors">
                フィードバック
                <span className="block text-xs text-gray-400">Feedback</span>
              </Link>
            </div>
          </div>

          {/* 関連リンク */}
          <div>
            <h4 className="font-semibold text-gray-100 mb-4 text-sm uppercase tracking-wide">
              関連リンク
              <span className="block text-xs text-gray-400 mt-1">Related Links</span>
            </h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors group">
                <span className="flex items-center gap-2">
                  市役所ホームページ
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                </span>
                <span className="block text-xs text-gray-400">City Hall</span>
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors group">
                <span className="flex items-center gap-2">
                  観光協会
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                </span>
                <span className="block text-xs text-gray-400">Tourism Association</span>
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors group">
                <span className="flex items-center gap-2">
                  商工会議所
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                </span>
                <span className="block text-xs text-gray-400">Chamber of Commerce</span>
              </a>
            </div>
          </div>

          {/* 空のスペース（レイアウト調整用） */}
          <div className="lg:col-span-2"></div>
        </div>

        {/* ボトムライン */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © 2025 OrgShift Local. 
              <span className="block md:inline md:ml-2 text-xs text-gray-500">
                プロトタイプ版 / Prototype Version
              </span>
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xs">Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span className="text-xs">in Japan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}