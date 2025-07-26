import { Link } from "wouter";
import { Sprout, Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
                <Sprout className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Rural Minds</h3>
            </div>
            <p className="text-slate-300 mb-4">
              Empowering rural communities through digital literacy and access to government schemes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/modules" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.modules')}
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.forum')}
                </Link>
              </li>
              <li>
                <Link href="/live-data" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.liveData')}
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.feedback')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Download PDF Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Video Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Government Schemes
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@ruralminds.gov.in</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Ministry of Rural Development, New Delhi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © 2024 Rural Minds. A Government of India Initiative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
