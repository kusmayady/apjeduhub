import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Mail, MapPin, GraduationCap, Settings } from "lucide-react";
import { DbMenuItem, DbTemplateStyle, DEFAULT_MENU_ITEMS } from "../lib/dbService";
import { LANGUAGES, LanguageCode, createTranslator } from "../lib/translations";

interface HeaderProps {
  currentSection: string;
  activeTab: string;
  onNavigate: (section: string, tab: string) => void;
  menuItems?: DbMenuItem[];
  activeStyle?: DbTemplateStyle;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export default function Header({ currentSection, activeTab, onNavigate, menuItems, activeStyle, currentLang, onLanguageChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [img0Failed, setImg0Failed] = useState(false);
  const [img1Failed, setImg1Failed] = useState(false);

  // Reset image error states when logo header/footer is updated
  useEffect(() => {
    setImg0Failed(false);
  }, [activeStyle?.logoHeader]);

  useEffect(() => {
    setImg1Failed(false);
  }, [activeStyle?.logoFooter]);

  const t = createTranslator(currentLang);

  const sectionTabsMap: Record<string, { id: string, label: string }[]> = {
    profil: [
      { id: "sejarah", label: "Sejarah Singkat" },
      { id: "visimisi", label: "Visi & Misi" },
      { id: "organisasi", label: "Struktur Organisasi" },
      { id: "lambang", label: "Arti Lambang" }
    ],
    akademik: [
      { id: "d3perhotelan", label: "D3 Perhotelan" },
      { id: "d3wisata", label: "D3 Usaha Wisata" },
      { id: "fasilitas", label: "Fasilitas Kampus" },
      { id: "kalender", label: "Kalender Akademik" }
    ],
    pmb: [
      { id: "syarat", label: "Jalur & Syarat" },
      { id: "biaya", label: "Estimator Biaya" },
      { id: "daftar", label: "Pendaftaran Online" }
    ],
    kemahasiswaan: [
      { id: "ukm", label: "Kegiatan UKM" },
      { id: "karir", label: "Pusat Karir & Magang" },
      { id: "alumni", label: "Kisah Sukses Alumni" }
    ]
  };

  const activeMenus = menuItems && menuItems.length > 0 ? menuItems : DEFAULT_MENU_ITEMS;

  const navItemsRaw = activeMenus.map(item => ({
    id: item.sectionId,
    label: t(item.sectionId, item.label),
    tabs: (sectionTabsMap[item.sectionId] || []).map(tab => ({
      id: tab.id,
      label: t(tab.id, tab.label)
    }))
  }));

  // Deduplicate by sectionId (id) to avoid duplicate React keys
  const seenSections = new Set<string>();
  const navItems = navItemsRaw.filter(item => {
    if (seenSections.has(item.id)) {
      return false;
    }
    seenSections.add(item.id);
    return true;
  });

  const handleNavItemClick = (sectionId: string, defaultTab: string = "") => {
    onNavigate(sectionId, defaultTab);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // Dynamic header style class construction based on active template settings
  let headerClass = "sticky top-0 z-50 w-full shadow-md transition-all duration-300 ";
  if (activeStyle) {
    if (activeStyle.headerStyle === "glass") {
      headerClass += "bg-white/80 backdrop-blur-md border-b border-neutral-200/50";
    } else if (activeStyle.headerStyle === "minimal") {
      headerClass += "bg-white border-b-2 border-primary";
    } else if (activeStyle.headerStyle === "shadow") {
      headerClass += "bg-white shadow-2xl border-b border-neutral-200";
    } else {
      headerClass += "bg-white border-b border-neutral-100";
    }
  } else {
    headerClass += "bg-white border-b border-neutral-100";
  }

  return (
    <header className={headerClass}>
      {/* Top bar with quick contact info */}
      <div className="hidden md:block w-full bg-primary text-white text-xs py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin size={13} className="text-accent" />
              {t("address", "Jl. Cempaka Putih Tengah XXXII No. 8, Jakarta Pusat")}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Phone size={13} className="text-accent" />
              (021) 8613388
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Mail size={13} className="text-accent" />
              pmb@apj.ac.id
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-accent bg-blue-900/40 px-2 py-0.5 rounded-sm">
              {t("accreditation", "Akreditasi Baik Sekali")}
            </span>
            
            {/* Elegant Custom Language Selector Dropdown */}
            <div className="relative inline-block" id="language-switcher-wrapper">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="bg-blue-950/60 hover:bg-blue-900 border border-white/20 px-2.5 py-1 rounded text-white text-[11.5px] font-bold flex items-center gap-1.5 transition cursor-pointer select-none"
                id="lang-select-trigger"
              >
                <span>{LANGUAGES.find(l => l.code === currentLang)?.flag || "🇮🇩"}</span>
                <span>{LANGUAGES.find(l => l.code === currentLang)?.code}</span>
                <ChevronDown size={11} className={`text-neutral-300 transition-transform ${isLangDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-1.5 w-44 bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 z-50 animate-fade-in text-neutral-800">
                    <div className="px-3 py-1 border-b border-neutral-100 mb-1">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Pilih Bahasa</span>
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-bold transition flex items-center gap-2.5 hover:bg-neutral-50 ${
                          currentLang === lang.code ? "bg-[#e0efff] text-primary border-r-3 border-primary" : "text-neutral-700"
                        }`}
                      >
                        <span className="text-sm shrink-0">{lang.flag}</span>
                        <span className="truncate">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => onNavigate("admin", "")}
              className="bg-blue-950/60 hover:bg-neutral-800 border border-white/20 px-2.5 py-1 rounded text-[#FFDCA0] text-[11px] font-black tracking-wide flex items-center gap-1.5 transition cursor-pointer select-none"
              title="Akses Portal Admin"
              id="topbar-admin-portal"
            >
              <Settings size={12} className="text-[#FFC46A]" />
              <span>{t("admin_portal", "Konsol Admin")}</span>
            </button>

            <button 
              onClick={() => handleNavItemClick("pmb", "daftar")} 
              className="bg-accent text-primary text-xs font-extrabold px-3 py-1 rounded hover:bg-yellow-400 transition cursor-pointer shadow-xs"
              id="top-pmb-btn"
            >
              {t("register_online", "DAFTAR ONLINE 2026/2027")}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Brand Logo with the beautiful new horizontal .png logo */}
        <div 
          onClick={() => handleNavItemClick("home")} 
          className="flex items-center cursor-pointer group"
          id="brand-logo"
        >
          {!img0Failed ? (
            <img 
              src={activeStyle?.logoHeader || "/input_file_0.png"} 
              alt="Akademi Pariwisata Jakarta" 
              className="h-11 md:h-14 object-contain group-hover:scale-105 transition duration-300 animate-fade-in"
              onError={() => setImg0Failed(true)}
            />
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary flex items-center justify-center text-accent border border-accent/20 shadow-sm">
                <GraduationCap size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm sm:text-md md:text-xl font-bold text-primary leading-none tracking-wider">
                  AKADEMI PARIWISATA JAKARTA
                </span>
                <span className="text-[9px] md:text-[10px] font-semibold text-neutral-500 tracking-widest uppercase mt-0.5">
                  {t("est_1972", "Yayasan Pendidikan Jayakarta • Est. 1972")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navbar */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isSelected = currentSection === item.id;
            const hasTabs = item.tabs.length > 0;

            return (
              <div 
                key={item.id}
                className="relative group py-2"
                onMouseEnter={() => hasTabs && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleNavItemClick(item.id, hasTabs ? item.tabs[0].id : "")}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition duration-200 cursor-pointer ${
                    isSelected 
                      ? "text-[#0050A0] bg-neutral-50" 
                      : "text-neutral-700 hover:text-[#0050A0] hover:bg-neutral-50"
                  }`}
                  id={`nav-${item.id}`}
                >
                  {item.label}
                  {hasTabs && <ChevronDown size={14} className="text-neutral-400 group-hover:text-primary transition-transform duration-200 group-hover:rotate-180" />}
                </button>

                {/* Dropdown Menu */}
                {hasTabs && activeDropdown === item.id && (
                  <div className="absolute left-0 mt-1 w-56 bg-white border border-neutral-100 shadow-xl rounded-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="absolute top-0 left-6 -mt-1 w-3 h-3 bg-white border-t border-l border-neutral-100 transform rotate-45"></div>
                    {item.tabs.map((tab) => {
                      const isTabActive = activeTab === tab.id && isSelected;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleNavItemClick(item.id, tab.id)}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold block transition duration-150 border-l-3 cursor-pointer ${
                            isTabActive
                              ? "bg-accent/10 border-primary text-primary"
                              : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-primary hover:border-neutral-200"
                          }`}
                          id={`dropdown-tab-${tab.id}`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile menu and PMB quick action */}
        <div className="flex items-center gap-2">
          {/* Mobile Quick Flag Select Trigger */}
          <div className="relative inline-block lg:hidden">
            <button
              onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
              className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 p-1.5 rounded-lg font-black text-xs text-neutral-800 flex items-center gap-1 cursor-pointer"
              title="Ganti Bahasa"
              id="mobile-lang-trigger"
            >
              <span>{LANGUAGES.find(l => l.code === currentLang)?.flag}</span>
              <span className="font-mono text-[11px]">{currentLang}</span>
            </button>

            {isMobileLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMobileLangOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-40 bg-white border border-neutral-200 rounded-xl shadow-xl py-1 z-50 text-neutral-800">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsMobileLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold transition flex items-center gap-2 hover:bg-neutral-50 ${
                        currentLang === lang.code ? "bg-[#e0efff] text-primary" : "text-neutral-700"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => handleNavItemClick("pmb", "daftar")}
            className="hidden sm:inline-block bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded hover:bg-blue-800 transition shadow cursor-pointer"
            id="mobile-quick-pmb-btn"
          >
            PMB 2026
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-neutral-800 p-1 hover:bg-neutral-100 rounded focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
            id="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-100 py-3 shadow-inner max-h-[85vh] overflow-y-auto w-full transition duration-300">
          <div className="px-4 space-y-3">
            {/* Multi-language bubble list inside drawer */}
            <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/60">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider block mb-2">
                🌐 PILIH BAHASA / CHOOSE LANGUAGE:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      currentLang === lang.code 
                        ? "bg-primary text-white shadow-xs scale-102 font-black" 
                        : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                    }`}
                  >
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <span>{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => {
                const isSelected = currentSection === item.id;
                const hasTabs = item.tabs.length > 0;

                return (
                  <div key={item.id} className="border-b border-neutral-50 py-1 last:border-b-0">
                    <button
                      onClick={() => {
                        if (!hasTabs) {
                          handleNavItemClick(item.id);
                        } else {
                          setActiveDropdown(activeDropdown === item.id ? null : item.id);
                        }
                      }}
                      className={`w-full flex justify-between items-center py-2.5 px-3 rounded-lg text-sm font-bold block ${
                        isSelected 
                          ? "text-primary bg-primary/5" 
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                      id={`mobile-main-${item.id}`}
                    >
                      <span>{item.label}</span>
                      {hasTabs && (
                        <ChevronDown 
                          size={16} 
                          className={`text-neutral-400 transition-transform ${
                            activeDropdown === item.id ? "rotate-180" : ""
                          }`} 
                        />
                      )}
                    </button>

                    {/* Mobile Dropdown Sub-menus */}
                    {hasTabs && activeDropdown === item.id && (
                      <div className="pl-4 pr-2 py-1 bg-neutral-50/50 rounded-lg space-y-0.5 mt-1">
                        {item.tabs.map((tab) => {
                          const isTabActive = activeTab === tab.id && isSelected;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => handleNavItemClick(item.id, tab.id)}
                              className={`w-full text-left py-2 px-3 text-xs block rounded ${
                                isTabActive
                                  ? "font-bold text-primary bg-accent/25"
                                  : "font-medium text-neutral-600 hover:bg-neutral-100"
                              }`}
                              id={`mobile-sub-${tab.id}`}
                            >
                              • {tab.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="py-2 space-y-2">
              <div className="p-3 bg-[#FFF5E6] rounded-lg border border-[#FFDCA0]/60 text-xs text-primary font-semibold">
                📍 Kampus Cempaka Putih: (021) 8613388
              </div>
              <button
                onClick={() => handleNavItemClick("pmb", "daftar")}
                className="w-full bg-primary text-white text-sm font-extrabold py-2.5 rounded-lg text-center hover:bg-blue-800 transition block shadow"
                id="mobile-drawer-pmb-btn"
              >
                Pendaftaran Mahasiswa Baru 2026/2027
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
