import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin, Send, Mail, Copyright } from "lucide-react"

const socialLinks = [
  { name: "Twitter", icon: <Twitter className="h-5 w-5" />, href: "#" },
  { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "#" },
  { name: "Telegram", icon: <Send className="h-5 w-5" />, href: "#" },
]

const footerNavLinks = {
  navigate: [
    { name: "Home", href: "/" },
    { name: "Invest", href: "/marketplace" },
    { name: "Learn", href: "/academy" },
    { name: "Onboarding", href: "/onboarding" },
  ],
  resources: [
    { name: "Learning Modules", href: "/academy/modules" },
    { name: "FAQs", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Help Center", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 text-gray-700 pt-12 pb-8 border-t">
      {" "}
      {/* Light gray background */}
      <div className="container mx-auto px-4">
        <div className="mb-10 pb-8 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <Link href="/" className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image
                src="/flow-passport-logo.png"
                alt="Flow Passport Logo"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <span className="text-2xl font-bold text-gray-800">FLOW PASSPORT</span>
            </Link>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-metallic-green transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6 max-w-md">
            Your Gateway to Onchain Identity, Investment & Education. Explore our platform through the links below.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold text-metallic-green mb-3">Navigate</h5>
              <ul className="space-y-2">
                {footerNavLinks.navigate.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-metallic-green transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-metallic-green mb-3">Resources</h5>
              <ul className="space-y-2">
                {footerNavLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-metallic-green transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-metallic-green mb-3">Legal</h5>
              <ul className="space-y-2">
                {footerNavLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-metallic-green transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-metallic-green mb-3">Contact</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:support@flowpassport.com"
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-metallic-green transition-colors"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>support@flowpassport.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 mb-8">
          <p className="flex items-center justify-center">
            <Copyright className="h-4 w-4 mr-1" /> {currentYear} FLOW PASSPORT. All rights reserved.
          </p>
        </div>

        <div className="text-xs text-gray-500 text-center max-w-4xl mx-auto leading-relaxed">
          <p className="mb-4">
            Flow Passport is an educational and informational platform that provides access to tokenized real-world
            assets and investment education. We do not conduct any independent diligence on or substantive review of any
            blockchain asset, digital currency, cryptocurrency, tokenized asset, or associated investment opportunities.
            You are fully and solely responsible for evaluating your investments, for determining whether you will
            invest in or exchange any assets based on your own research and judgment, and for all your investment
            decisions.
          </p>
          <p>
            Please bear in mind that past performance is not indicative of future results. Any investment in blockchain
            assets, tokenized real-world assets, or digital currencies involves the risk of loss of part or all of your
            investment. Be aware that the value of the assets you invest in or exchange is subject to market volatility
            and other investment risks. We strongly recommend consulting with qualified financial and legal advisors
            before making any investment decisions.
          </p>
        </div>
      </div>
    </footer>
  )
}
