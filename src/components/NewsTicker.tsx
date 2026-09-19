import React, { useEffect, useState } from "react";
import { Megaphone, AlertCircle, Calendar, ChevronRight } from "lucide-react";
import { getAnnouncements, AnnouncementItem, DbTemplateStyle } from "../lib/dbService";
import { LanguageCode } from "../lib/translations";

interface NewsTickerProps {
  currentLang: LanguageCode;
  activeStyle: DbTemplateStyle;
  onSelectArticle: (article: AnnouncementItem) => void;
  onNavigate: (section: string, tab?: string) => void;
}

export default function NewsTicker({ currentLang, activeStyle, onSelectArticle, onNavigate }: NewsTickerProps) {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const list = await getAnnouncements();
        // Take up to 5 items for the ticker
        setAnnouncements(list.slice(0, 5));
      } catch (err) {
        console.warn("Failed to load announcements for ticker:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, []);

  // Multi-language labels for the News Ticker title block
  const tickerLabels: Record<LanguageCode, { badge: string; prefix: string; viewAll: string }> = {
    ID: {
      badge: "PENTING",
      prefix: "Pengumuman Kampus & Agenda Akademik:",
      viewAll: "Lihat Semua"
    },
    EN: {
      badge: "ALERT",
      prefix: "Campus Announcements & Academic Agenda:",
      viewAll: "View All"
    },
    JPN: {
      badge: "重要",
      prefix: "キャンパス発表と学術日程:",
      viewAll: "すべて見る"
    },
    Mandarin: {
      badge: "重要公告",
      prefix: "校园重要通知与学术日程:",
      viewAll: "查看全部"
    },
    Arab: {
      badge: "هام جداً",
      prefix: "إعلانات الحرم الجامعي والأجندة الأكاديمية:",
      viewAll: "عرض الكل"
    },
    Jerman: {
      badge: "WICHTIG",
      prefix: "Campus-Ankündigungen & Akademische Agenda:",
      viewAll: "Alle anzeigen"
    },
    Turki: {
      badge: "DUYURU",
      prefix: "Kampüs Duyuruları ve Akademik Takvim:",
      viewAll: "Hepsini Gör"
    },
    Korea: {
      badge: "긴급공지",
      prefix: "캠퍼스 주요 공지 및 학사 일정:",
      viewAll: "전체보기"
    }
  };

  const label = tickerLabels[currentLang] || tickerLabels["ID"];

  // If loading or no announcements, don't show or render a skeleton/fallback
  if (loading || announcements.length === 0) {
    return null;
  }

  // Duplicate items to ensure continuous marquee scrolling
  const tickerItems = [...announcements, ...announcements, ...announcements];

  return (
    <div 
      className="relative w-full border-b flex items-center h-11 overflow-hidden z-25 select-none"
      style={{ 
        backgroundColor: activeStyle.backgroundColor || "#f8fafc",
        borderColor: `${activeStyle.primaryColor}15`
      }}
      id="campus-news-ticker"
    >
      {/* Ticker Fixed Badge Header */}
      <div 
        className="absolute left-0 top-0 bottom-0 px-4 flex items-center gap-2 z-30 shadow-md font-sans text-xs font-black tracking-wider uppercase text-white shrink-0"
        style={{ backgroundColor: activeStyle.primaryColor || "#002f5a" }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeStyle.accentColor || "#FFC46A" }}></span>
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: activeStyle.accentColor || "#FFC46A" }}></span>
        </span>
        <Megaphone size={13} style={{ color: activeStyle.accentColor || "#FFC46A" }} />
        <span>{label.badge}</span>
      </div>

      {/* Marquee Wrapper Container */}
      <div className="flex-grow h-full overflow-hidden flex items-center pl-32 pr-28 relative">
        <style>{`
          @keyframes marquee-horizontal {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.3333%, 0, 0); }
          }
          .ticker-scroll-track {
            display: flex;
            align-items: center;
            width: max-content;
            animation: marquee-horizontal 45s linear infinite;
          }
          .ticker-scroll-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="ticker-scroll-track">
          <span className="text-[11px] font-extrabold uppercase mr-6 tracking-wide shrink-0 flex items-center gap-1.5" style={{ color: activeStyle.primaryColor }}>
            <AlertCircle size={13} className="opacity-80" />
            {label.prefix}
          </span>

          {tickerItems.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => {
                onSelectArticle(item);
                onNavigate("artikel");
              }}
              className="flex items-center gap-2 hover:underline cursor-pointer group text-left pr-12 focus:outline-none shrink-0"
            >
              {/* Category tag */}
              <span 
                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ 
                  backgroundColor: `${activeStyle.primaryColor}12`, 
                  color: activeStyle.primaryColor 
                }}
              >
                {item.category}
              </span>
              
              {/* Announcement Title */}
              <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-900 transition-colors">
                {item.title}
              </span>

              {/* Bullet divider */}
              <span className="text-neutral-300 font-bold">•</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Fixed Navigation "View All" Button */}
      <button
        onClick={() => onNavigate("home")}
        className="absolute right-0 top-0 bottom-0 px-4 bg-white hover:bg-neutral-50 text-[10px] font-bold tracking-wider uppercase border-l flex items-center gap-1 z-30 transition cursor-pointer"
        style={{ 
          borderColor: `${activeStyle.primaryColor}15`,
          color: activeStyle.primaryColor
        }}
      >
        <span>{label.viewAll}</span>
        <ChevronRight size={12} />
      </button>

      {/* Decorative shading elements */}
      <div className="absolute left-[110px] top-0 bottom-0 w-8 bg-gradient-to-r from-white/80 to-transparent pointer-events-none z-20"></div>
      <div className="absolute right-[110px] top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none z-20"></div>
    </div>
  );
}
