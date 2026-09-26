import React from 'react';
import { Cloud, Heart, Globe, Shield, Sparkles, Mail, Lock } from 'lucide-react';
import { useBranding } from '../../context/ThemeAndBrandingContext';
import { PrayerCloudLogo } from './PrayerCloudLogo';

interface FooterProps {
  onNavigate: (page: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { branding } = useBranding();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Scripture Anchor Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-800/80 to-blue-950/60 border border-blue-900/40 text-center max-w-4xl mx-auto">
          <p className="font-serif-spiritual text-base sm:text-lg text-blue-200 font-medium leading-relaxed italic">
            "{branding.footerScripture || 'And this gospel of the kingdom will be preached in the whole world as a testimony to all nations, and then the end will come. — Matthew 24:14'}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0e121b] border border-[#253046] flex items-center justify-center p-1 shadow-md shadow-blue-950/60">
                <PrayerCloudLogo size="sm" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight">
                <span className="text-white">PRAYER</span>
                <span className="text-amber-400">CLOUD</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {branding.tagline || 'A global Christian coordination network uniting missionaries, pastors, evangelists, and prayer warriors to bring Jesus to every unreached nation and tribe.'}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>24/7 Global Prayer Watch Live</span>
              </span>
              <span>·</span>
              <span>195 Nations</span>
            </div>
          </div>

          {/* Missional Explorers */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Missional Data
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('countries')} className="hover:text-white transition-colors">
                  195 Countries Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('unreached-places')} className="hover:text-white transition-colors">
                  7,400+ Unreached Peoples
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-white transition-colors">
                  Interactive Prayer Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('countries')} className="hover:text-white transition-colors">
                  10/40 Window Nations
                </button>
              </li>
            </ul>
          </div>

          {/* Collaboration Hub */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Collaboration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('missionary-hub')} className="hover:text-white transition-colors">
                  Missionary Hub & Strategy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('chat')} className="hover:text-white transition-colors">
                  Encrypted Chat & Voice Notes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calls')} className="hover:text-white transition-colors">
                  Video Conferences & Records
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('prayer-requests')} className="hover:text-white transition-colors">
                  Global Prayer Wall
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reports')} className="hover:text-white transition-colors">
                  Field Testimonies & Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Frontier Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('missionary-hub')} className="hover:text-white transition-colors">
                  Frontier Operations Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-white transition-colors">
                  Global Prayer Events & RSVPs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-white transition-colors">
                  Frontier Heatmap
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-400">
                <a
                  href="https://www.livingtech.name.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>www.livingtech.name.ng</span>
                </a>
              </li>
              <li className="text-[11px] text-slate-500">
                Contact: {branding.contactEmail || 'missions@prayercloud.org'}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} {branding.siteName || 'PRAYERCLOUD'}. For the Glory of the Kingdom of God.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Joshua Project & Operation World Data Model</span>
            <span>·</span>
            <span>End-to-End Great Commission Coordination</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
