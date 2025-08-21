import Link from 'next/link'
import { Globe, Mail, MessageCircle, Heart, ExternalLink, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* メインコンテンツ - 2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* 左側：ブランド情報 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3A9BDC] to-[#2E5D50] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  OrgShift Local
                  <span className="block text-sm font-normal text-gray-300">地域ポータル</span>
                </h3>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md">
              日本全国の自治体・地域情報をワンストップ化し、「生活の便利」と「学びの継続」を両立するポータルサイトです。
              <span className="block text-sm text-gray-400 mt-2">
                A one-stop portal that consolidates local government and regional information across Japan, 
                achieving both "convenience in daily life" and "continuous learning."
              </span>
            </p>
            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 backdrop-blur-sm">
                <Globe className="w-4 h-4 text-gray-300 hover:text-white transition-colors" />
              </button>
              <button className="p-2.5 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 backdrop-blur-sm">
                <Mail className="w-4 h-4 text-gray-300 hover:text-white transition-colors" />
              </button>
              <button className="p-2.5 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 backdrop-blur-sm">
                <MessageCircle className="w-4 h-4 text-gray-300 hover:text-white transition-colors" />
              </button>
              <button className="p-2.5 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 backdrop-blur-sm">
                <Github className="w-4 h-4 text-gray-300 hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* 右側：リンク集 */}
          <div className="grid grid-cols-2 gap-8">
            {/* 運営情報 */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                運営情報
                <span className="block text-xs text-gray-400 mt-1 font-normal">Operations</span>
              </h4>
              <div className="space-y-3">
                <Link href="/about" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                  このサイトについて
                  <span className="block text-xs text-gray-500">About</span>
                </Link>
                <Link href="/accessibility" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                  アクセシビリティ
                  <span className="block text-xs text-gray-500">Accessibility</span>
                </Link>
                <Link href="/sitemap" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                  サイトマップ
                  <span className="block text-xs text-gray-500">Sitemap</span>
                </Link>
              </div>
            </div>

            {/* 利用案内 */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                利用案内
                <span className="block text-xs text-gray-400 mt-1 font-normal">Guidelines</span>
              </h4>
              <div className="space-y-3">
                <Link href="/terms" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                  利用規約
                  <span className="block text-xs text-gray-500">Terms of Service</span>
                </Link>
                <Link href="/privacy" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                  プライバシーポリシー
                  <span className="block text-xs text-gray-500">Privacy Policy</span>
                </Link>
                <Link href="/cookies" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                  Cookieポリシー
                  <span className="block text-xs text-gray-500">Cookie Policy</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* サポート・関連リンク */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* サポート */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              サポート
              <span className="block text-xs text-gray-400 mt-1 font-normal">Support</span>
            </h4>
            <div className="space-y-3">
              <Link href="/help" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                ヘルプセンター
                <span className="block text-xs text-gray-500">Help Center</span>
              </Link>
              <Link href="/contact" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                お問い合わせ
                <span className="block text-xs text-gray-500">Contact</span>
              </Link>
              <Link href="/feedback" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                フィードバック
                <span className="block text-xs text-gray-500">Feedback</span>
              </Link>
            </div>
          </div>

          {/* 関連リンク */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              関連リンク
              <span className="block text-xs text-gray-400 mt-1 font-normal">Related Links</span>
            </h4>
            <div className="space-y-3">
              <Link href="/partners" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                パートナー
                <span className="block text-xs text-gray-500">Partners</span>
              </Link>
              <Link href="/developers" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                開発者向け
                <span className="block text-xs text-gray-500">For Developers</span>
              </Link>
              <Link href="/api" className="block text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
                API
                <span className="block text-xs text-gray-500">API Documentation</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 地域別リンク */}
        <div className="mb-12">
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
            地域別情報
            <span className="block text-xs text-gray-400 mt-1 font-normal">Regional Information</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/region/hokkaido" className="text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
              北海道
              <span className="block text-xs text-gray-500">Hokkaido</span>
            </Link>
            <Link href="/region/tohoku" className="text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
              東北
              <span className="block text-xs text-gray-500">Tohoku</span>
            </Link>
            <Link href="/region/kanto" className="text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
              関東
              <span className="block text-xs text-gray-500">Kanto</span>
            </Link>
            <Link href="/region/chubu" className="text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
              中部
              <span className="block text-xs text-gray-500">Chubu</span>
            </Link>
            <Link href="/region/kansai" className="text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
              関西
              <span className="block text-xs text-gray-500">Kansai</span>
            </Link>
            <Link href="/region/chugoku" className="text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
              中国
              <span className="block text-xs text-gray-500">Chugoku</span>
            </Link>
            <Link href="/region/shikoku" className="text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
              四国
              <span className="block text-xs text-gray-500">Shikoku</span>
            </Link>
            <Link href="/region/kyushu" className="text-sm text-gray-300 hover:text-[#3A9BDC] transition-colors">
              九州
              <span className="block text-xs text-gray-500">Kyushu</span>
            </Link>
          </div>
        </div>

        {/* ボトムライン */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* コピーライト */}
            <div className="text-sm text-gray-400">
              <p>&copy; 2024 OrgShift Local. All rights reserved.</p>
              <p className="text-xs mt-1">地域ポータルサービス</p>
            </div>

            {/* SNSリンク */}
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:info@orgshift.local" className="text-gray-400 hover:text-[#3A9BDC] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}