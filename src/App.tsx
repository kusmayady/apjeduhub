/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import ProfilView from "./components/ProfilView";
import AkademikView from "./components/AkademikView";
import PmbView from "./components/PmbView";
import KemahasiswaanView from "./components/KemahasiswaanView";
import KontakView from "./components/KontakView";
import AdminView from "./components/AdminView";
import { seedDatabaseIfEmpty, getWebsiteSettings, WebsiteSettings, AnnouncementItem, DbMenuItem, DbTemplateStyle } from "./lib/dbService";
import ArtikelDetailView from "./components/ArtikelDetailView";
import { GraduationCap, Award, Compass, Building, MapPin, Phone, Mail, Clock } from "lucide-react";
import { LanguageCode, createTranslator } from "./lib/translations";


export default function App() {
  const [currentSection, setCurrentSection] = useState<string>("home");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedArticle, setSelectedArticle] = useState<AnnouncementItem | null>(null);
  const [dbSettings, setDbSettings] = useState<WebsiteSettings | null>(null);

  // Internationalization state persisting to localStorage
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("local_language") as LanguageCode;
    return saved && ["ID", "EN", "JPN", "Mandarin", "Arab", "Jerman", "Turki", "Korea"].includes(saved) ? saved : "ID";
  });

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    localStorage.setItem("local_language", lang);
  };

  const t = createTranslator(currentLang);

  // Load Joomla Menu Items and Template Styles
  const [menuItems, setMenuItems] = useState<DbMenuItem[]>([]);
  const [templates, setTemplates] = useState<DbTemplateStyle[]>([]);
  const [refreshMenuTrigger, setRefreshMenuTrigger] = useState(0);

  useEffect(() => {
    async function fetchJoomlaData() {
      try {
        const { getMenuItems, getTemplateStyles } = await import("./lib/dbService");
        const items = await getMenuItems();
        const styles = await getTemplateStyles();
        setMenuItems(items);
        setTemplates(styles);
      } catch (err) {
        console.warn("Gagal mengambil data menu/template Joomla:", err);
      }
    }
    fetchJoomlaData();
  }, [refreshMenuTrigger, currentSection]);

  // Find currently active Menu Item style configuration from templates list
  const activeMenuItem = menuItems.find(item => 
    item.sectionId === currentSection && 
    (item.tabId === "" || item.tabId === activeTab)
  ) || menuItems.find(item => item.sectionId === currentSection) || menuItems[0];

  const activeStyle = activeMenuItem && templates.find(t => t.id === activeMenuItem.templateStyleId) || templates[0] || {
    id: "tpl-default",
    name: "APJ Royal Navy (Default)",
    primaryColor: "#002f5a",
    secondaryColor: "#1e3a8a",
    accentColor: "#FFC46A",
    backgroundColor: "#f8fafc",
    fontFamily: "font-sans",
    headingFontName: "Inter",
    cardRadius: "rounded-xl",
    headerStyle: "sticky",
    showHeroBackground: true,
    badgeStyle: "pill"
  };

  // Load article from URL query params on mount
  useEffect(() => {
    async function loadArticleFromUrl() {
      try {
        const params = new URLSearchParams(window.location.search);
        const articleTitle = params.get("article");
        if (articleTitle) {
          const { getAnnouncements } = await import("./lib/dbService");
          const list = await getAnnouncements();
          const found = list.find(item => item.title.toLowerCase() === articleTitle.toLowerCase());
          if (found) {
            setSelectedArticle(found);
            setCurrentSection("artikel");
          }
        }
      } catch (e) {
        console.warn("Gagal mengekstrak artikel dari URL:", e);
      }
    }
    loadArticleFromUrl();
  }, []);

  useEffect(() => {
    // Scroll smoothly to top on every tab routing transition
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSection, activeTab]);

  useEffect(() => {
    async function initDb() {
      await seedDatabaseIfEmpty();
      try {
        const liveSettings = await getWebsiteSettings();
        setDbSettings(liveSettings);
      } catch (err) {
        console.warn("Could not load dynamic settings: ", err);
      }
    }
    initDb();
  }, [currentSection]);

  const handleNavigate = (section: string, tab: string = "") => {
    setCurrentSection(section);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-neutral-800 font-body antialiased transition-colors duration-300" id="main-body-container">
      {/* Joomla dynamic template stylesheet injection */}
      <style>{`
        :root {
          --color-primary: ${activeStyle.primaryColor} !important;
          --color-accent: ${activeStyle.accentColor} !important;
          --color-accent-light: ${activeStyle.backgroundColor} !important;
          --font-heading: "${activeStyle.headingFontName}", ${activeStyle.fontFamily === 'font-serif' ? 'serif' : 'sans-serif'} !important;
        }

        /* Dynamically repaint primary color classes throughout all UI components */
        .bg-primary {
          background-color: ${activeStyle.primaryColor} !important;
        }
        .text-primary {
          color: ${activeStyle.primaryColor} !important;
        }
        .border-primary {
          border-color: ${activeStyle.primaryColor} !important;
        }
        .hover\\:bg-blue-800:hover, .hover\\:bg-primary-dark:hover {
          background-color: ${activeStyle.secondaryColor} !important;
          opacity: 0.9 !important;
        }

        #main-body-container {
          background-color: ${activeStyle.backgroundColor} !important;
          font-family: ${
            activeStyle.fontFamily === 'font-serif' ? 'Georgia, "Playfair Display", serif' : 
            activeStyle.fontFamily === 'font-mono' ? '"JetBrains Mono", monospace' : 
            '"Plus Jakarta Sans", sans-serif'
          } !important;
        }

        /* Apply custom border radius dynamically to card classes */
        .rounded-xl, .rounded-lg {
          border-radius: ${
            activeStyle.cardRadius === 'rounded-none' ? '0px' :
            activeStyle.cardRadius === 'rounded-md' ? '6px' :
            activeStyle.cardRadius === 'rounded-xl' ? '12px' :
            activeStyle.cardRadius === 'rounded-3xl' ? '24px' : '9999px'
          } !important;
        }
        .rounded-2xl {
          border-radius: ${
            activeStyle.cardRadius === 'rounded-none' ? '0px' :
            activeStyle.cardRadius === 'rounded-md' ? '8px' :
            activeStyle.cardRadius === 'rounded-xl' ? '16px' :
            activeStyle.cardRadius === 'rounded-3xl' ? '32px' : '9999px'
          } !important;
        }
        .rounded-3xl {
          border-radius: ${
            activeStyle.cardRadius === 'rounded-none' ? '0px' :
            activeStyle.cardRadius === 'rounded-md' ? '12px' :
            activeStyle.cardRadius === 'rounded-xl' ? '20px' :
            activeStyle.cardRadius === 'rounded-3xl' ? '40px' : '9999px'
          } !important;
        }
      `}</style>

      {/* Official Sticky Top Navigation Header */}
      <Header 
        currentSection={currentSection} 
        activeTab={activeTab} 
        onNavigate={handleNavigate} 
        menuItems={menuItems}
        activeStyle={activeStyle}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Dynamic Viewport Frame */}
      <main className="flex-grow">
        {currentSection === "home" && (
          <HomeView 
            onNavigate={handleNavigate} 
            onSelectArticle={(art) => {
              setSelectedArticle(art);
              setCurrentSection("artikel");
            }}
            currentLang={currentLang}
          />
        )}
        {currentSection === "artikel" && selectedArticle && (
          <ArtikelDetailView 
            article={selectedArticle} 
            onBack={() => {
              setCurrentSection("home");
              setSelectedArticle(null);
              // Clean query params on back
              window.history.pushState({}, document.title, window.location.pathname);
            }}
            onNavigateToArticle={(rel) => setSelectedArticle(rel)}
          />
        )}
        {currentSection === "profil" && (
          <ProfilView activeTab={activeTab} currentLang={currentLang} />
        )}
        {currentSection === "akademik" && (
          <AkademikView activeTab={activeTab} currentLang={currentLang} />
        )}
        {currentSection === "pmb" && (
          <PmbView activeTab={activeTab} currentLang={currentLang} />
        )}
        {currentSection === "kemahasiswaan" && (
          <KemahasiswaanView activeTab={activeTab} currentLang={currentLang} />
        )}
        {currentSection === "kontak" && (
          <KontakView currentLang={currentLang} />
        )}
        {currentSection === "admin" && (
          <AdminView onRefreshMenus={() => setRefreshMenuTrigger(p => p + 1)} />
        )}
      </main>

      {/* Customized Corporate Educational Footer */}
      <footer className="bg-primary text-white border-t-4 border-accent mt-16 pt-12 pb-6 z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/input_file_1.png" 
                alt="APJ Emblem Seal" 
                className="h-10 w-10 object-contain bg-white rounded-full p-0.5 border border-accent" 
              />
              <span className="font-serif font-black text-xs md:text-sm tracking-widest text-[#FFDCA0]">
                AKADEMI PARIWISATA JAKARTA
              </span>
            </div>
            <p className="text-neutral-300 text-[11px] leading-relaxed font-semibold animate-fade-in">
              {currentLang === "ID" && "Kampus perintis pendidikan tinggi vokasional perhotelan dan usaha parjalanan wisata tepercaya di Jakarta Timur sejak Juni 1972. Mengasuh lulusan handal berkarakter, mandiri, dan berkesinambungan global."}
              {currentLang === "EN" && "The pioneer campus of trusted hospitality and tourism vocational higher education in Jakarta since June 1972. Nurturing capable graduates with character, independence, and global sustainability."}
              {currentLang === "JPN" && "1972年6月以来、ジャカルタで信頼されている観光高度職業教育のパイオニアキャンパス。人格、独立性、グローバルな持続可能性を備えた優秀な卒業生を育成します。"}
              {currentLang === "Mandarin" && "自1972年6月以来雅加达值得信赖的酒店与旅游职业高等教育先锋校园。培养具有品格、独立性和全球可持续发展能力的优秀毕业生。"}
              {currentLang === "Arab" && "الحرم الجامعي الرائد للتعليم العالي المهني الموثوق في الضيافة والسياحة في جاكرتا منذ يونيو 1972. رعاية خريجين قادرين يتمتعون بالشخصية والاستقلال والاستدامة العالمية."}
              {currentLang === "Jerman" && "Der Pioniercampus für anerkannte Berufsausbildung in Hotellerie und Tourismus in Jakarta seit Juni 1972. Förderung fähiger Absolventen mit Charakter, Unabhängigkeit und globaler Nachhaltigkeit."}
              {currentLang === "Turki" && "Haziran 1972'den beri Cakarta'da güvenilir otelcilik ve turizm mesleki yükseköğreniminin öncü kampüsü. Karakterli, bağımsız ve küresel vizyona sahip mezunlar yetiştiriyoruz."}
              {currentLang === "Korea" && "1972년 6월 이후 자카르타에서 신뢰받는 호텔 및 관광 직업 고등 교육의 선구자 캠퍼스. 품격과 자립심, 글로벌 지속 가능성을 갖춘 유능한 인재를 양성합니다."}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] font-bold text-accent bg-[#00366d] border border-[#ffca7c]/10 px-2.5 py-1 rounded">
                YAYASAN PENDIDIKAN JAYAKARTA
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="block font-black text-xs text-accent tracking-wider uppercase border-b border-white/10 pb-1.5 font-heading">
              {t("explore_portal", "Eksplorasi Portal")}
            </span>
            <ul className="text-[11px] font-bold text-neutral-300 space-y-2 pl-1">
              <li>
                <button onClick={() => handleNavigate("profil", "sejarah")} className="hover:text-accent transition cursor-pointer text-left">
                  • {t("sejarah", "Sejarah Singkat")} APJ
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("akademik", "d3perhotelan")} className="hover:text-accent transition cursor-pointer text-left">
                  • {t("d3perhotelan", "D3 Perhotelan")}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("akademik", "d3wisata")} className="hover:text-accent transition cursor-pointer text-left">
                  • {t("d3wisata", "D3 Usaha Wisata")}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("pmb", "syarat")} className="hover:text-accent transition cursor-pointer text-left">
                  • {t("syarat", "Jalur & Syarat")} PMB
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("kemahasiswaan", "karir")} className="hover:text-accent transition cursor-pointer text-left">
                  • {t("karir", "Pusat Karir & Magang")}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="md:col-span-5 space-y-3">
            <span className="block font-black text-xs text-accent tracking-wider uppercase border-b border-white/10 pb-1.5 font-heading">
              {t("contact_service", "Layanan Kampus Utama")}
            </span>
            <div className="space-y-2 text-[11px] font-semibold text-neutral-300">
              <div className="flex gap-2 items-start">
                <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
                <span>{dbSettings?.address || t("address", "Jl. Cempaka Putih Tengah XXXII No. 8, Cempaka Putih, Jakarta Pusat.")}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone size={14} className="text-accent shrink-0" />
                <span>{t("hotline", "Hotline")}: {dbSettings?.phoneLines || "(021) 8613388, 8623344"}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Mail size={14} className="text-accent shrink-0" />
                <span>{t("admission", "Penerimaan Mahasiswa Baru")}: {dbSettings?.pmbEmail || "pmb@apj.ac.id"}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Clock size={14} className="text-accent shrink-0" />
                <span>{t("consultation_fo", "Konsultasi FO")}: {dbSettings?.consultationHours || "Senin-Sabtu pukul 08:00 - 17:00 WIB"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Boundary bottom credit section */}
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-white/10 text-center flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-400 gap-3">
          <p className="font-bold">
            {t("all_rights", "© 2026 Akademi Pariwisata Jakarta (Yayasan Pendidikan Jayakarta). Hak Cipta Terlindungi.")}
          </p>
          <div className="flex gap-4">
            <span className="hover:text-white transition">{t("pddikti", "PDDIKTI Terdata")}</span>
            <span className="hover:text-white transition">{t("banpt", "BAN-PT Accredited")}</span>
            <span className="hover:text-white transition">{t("kemendikbud", "Kemendikbudristek RI")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

