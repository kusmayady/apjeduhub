import React, { useState, useMemo } from "react";
import { Sparkles, Maximize2, ChevronLeft, ChevronRight, X, Building2, Coffee, GraduationCap, Plane } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LanguageCode } from "../lib/translations";

interface CampusGalleryProps {
  currentLang: LanguageCode;
}

interface GalleryItem {
  id: number;
  category: "facilities" | "labs" | "student";
  image: string;
  titles: Record<LanguageCode, string>;
  descs: Record<LanguageCode, string>;
}

export default function CampusGallery({ currentLang }: CampusGalleryProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "facilities" | "labs" | "student">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Gallery Data representing real facilities using premium high-resolution images
  const galleryItems: GalleryItem[] = useMemo(() => [
    {
      id: 1,
      category: "facilities",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      titles: {
        ID: "Front Office & Lobby Simulator",
        EN: "Front Office & Lobby Simulator",
        JPN: "フロントオフィス＆ロビー実習室",
        Mandarin: "前厅与大堂实训中心",
        Arab: "محاكاة المكاتب الأمامية والاستقبال",
        Jerman: "Front Office & Lobby Simulator",
        Turki: "Ön Ofis & Resepsiyon Simülatörü",
        Korea: "프론트 오피스 및 로비 실습실",
      },
      descs: {
        ID: "Laboratorium simulasi resepsionis hotel bintang 5 terlengkap untuk melatih keterampilan check-in, penanganan reservasi, butler service, dan komunikasi tamu VIP.",
        EN: "State-of-the-art 5-star hotel lobby simulator to train reception check-in, reservation management, butler service, and VIP guest relations.",
        JPN: "5つ星ホテルのフロントおよびロビーを完全に再現した実習設備。チェックイン、予約管理、バトラーサービス、VIP対応実務を習得します。",
        Mandarin: "全套五星级酒店前台与大堂模拟系统，用于培训前台入住登记、预订处理、专属管家服务及VIP贵宾接待标准。",
        Arab: "مختبر محاكاة متكامل لاستقبال الفنادق ذات الـ 5 نجوم لتدريب الطلاب على مهارات تسجيل الوصول وإدارة الحجوزات وخدمة الكبار.",
        Jerman: "Hochmoderner 5-Sterne-Hotel-Rezeptionssimulator für das Training von Check-in, Reservierungsverwaltung und VIP-Gästebetreuung.",
        Turki: "Giriş işlemleri, rezervasyon yönetimi ve VIP konuk ilişkilerini eğitmek üzere tasarlanmış 5 yıldızlı otel lobi simülatörü.",
        Korea: "5성급 호텔의 실제 환경을 그대로 재현한 리셉션 데스크 실습 공간으로 예약 처리 및 VIP 귀빈 의전 실무 능력을 배양합니다.",
      }
    },
    {
      id: 2,
      category: "labs",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800",
      titles: {
        ID: "Main Culinary Lab",
        EN: "Main Culinary Lab",
        JPN: "メイン・調理実習室",
        Mandarin: "烹饪艺术核心实验室",
        Arab: "مطبخ فنون الطهي الرئيسي",
        Jerman: "Haupt-Kulinarik-Lab",
        Turki: "Ana Gastronomi Laboratuvarı",
        Korea: "메인 조리 및 제과제빵 실습실",
      },
      descs: {
        ID: "Dapur komersial berskala industri tempat mahasiswa D3 Perhotelan menguasai hidangan Nusantara, masakan Barat, pastry mewah, dan teknik sanitasi internasional.",
        EN: "Industrial-grade commercial kitchen where Hotel Management students master Nusantara dishes, Western cuisine, fine pastry, and hygiene standards.",
        JPN: "本格的な業務用厨房設備。インドネシア伝統料理、西洋料理、高級ペストリー、ならびに国際衛生基準に即した実務訓練を行います。",
        Mandarin: "工业级商业后厨实训场地，大专酒店管理学生可在此掌握印尼传统美馔、西方料理、法式甜点及严苛的国际卫生标准。",
        Arab: "مطبخ تجاري متكامل بمعايير صناعية حيث يتدرب الطلاب على تحضير الأطباق المحلية والعالمية وصناعة الحلويات الفاخرة.",
        Jerman: "Großküche mit Industriestandard, in der Studenten der Hotellerie die Zubereitung lokaler und westlicher Gerichte sowie Hygiene-Zertifizierungen erlernen.",
        Turki: "Otelcilik öğrencilerinin yerel ve Batı mutfağı, lüks pastacılık ve hijyen standartlarında uzmanlaştığı endüstriyel mutfak.",
        Korea: "최첨단 상업용 주방 인프라를 구축하여 인도네시아 전통식, 서양 요리 및 명품 파티시에 실전 기술과 엄격한 위생 교육을 실시합니다.",
      }
    },
    {
      id: 3,
      category: "labs",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800",
      titles: {
        ID: "Bar & Mixology Studio",
        EN: "Bar & Mixology Studio",
        JPN: "バー＆ミクソロジースタジオ",
        Mandarin: "吧台与调酒咖啡实训室",
        Arab: "استوديو المشروبات والقهوة المختصة",
        Jerman: "Bar & Mixology Studio",
        Turki: "Bar & Miksoloji Stüdyosu",
        Korea: "식음료 및 바리스타 믹솔로지 실습장",
      },
      descs: {
        ID: "Pusat pelatihan barista dan mixology komprehensif. Dilengkapi dengan mesin espresso premium untuk mempelajari seni meracik minuman kopi dan mocktail modern.",
        EN: "Comprehensive barista and mixology center. Equipped with premium espresso setups to master beverage crafting and modern mocktail creation.",
        JPN: "バリスタおよび飲料調合の特化スタジオ。高級エスプレッソマシンを完備し、本格コーヒー抽出やカクテル・モクテルの技術を磨きます。",
        Mandarin: "全功能的咖啡师与调酒技能训练中心。配备高端意式咖啡机，训练高难度拉花、精品饮料调制及现代特调无酒精鸡尾酒。",
        Arab: "مركز شامل لتدريب باريستا ومزج المشروبات، مجهز بأحدث مكائن إسبريسو لابتكار أفضل أنواع العصائر والموكتيلات.",
        Jerman: "Zentrum für Baristas und Getränkekunst. Ausgestattet mit Kaffeemaschinen der Oberklasse für die Zubereitung von Kaffeespezialitäten und Mocktails.",
        Turki: "Kahve hazırlama ve modern alkolsüz kokteyl yaratma sanatını öğrenmek için profesyonel espresso makineleriyle donatılmış bar stüdyosu.",
        Korea: "종합 음료 및 바리스타 양성을 위한 공간으로, 최고급 에스프레소 추출 기기 및 스페셜티 음료, 현대적인 칵테일 제조법을 수련합니다.",
      }
    },
    {
      id: 4,
      category: "labs",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800",
      titles: {
        ID: "MICE & Air Ticketing Laboratory",
        EN: "MICE & Air Ticketing Laboratory",
        JPN: "MICE・航空発券実習室",
        Mandarin: "航空票务与 MICE 实训中心",
        Arab: "مختبر حجز الطيران والسياحة",
        Jerman: "MICE & Ticket-Reservierungs-Lab",
        Turki: "MICE & Uçak Bileti Rezervasyon Labı",
        Korea: "항공 운송 발권 및 MICE 실습실",
      },
      descs: {
        ID: "Laboratorium untuk mahasiswa D3 Usaha Perjalanan Wisata. Mempraktikkan sistem reservasi penerbangan real-time Amadeus/Sabre serta teknik pemanduan wisata.",
        EN: "Dedicated terminal laboratory for Tourism Business students. Employs real-time Amadeus/Sabre GDS ticketing platforms and tour planning.",
        JPN: "観光ビジネス科専用の発券ターミナルラボ。リアルタイムのAmadeus/Sabre予約システム操作やパッケージツアーの旅行企画を実践します。",
        Mandarin: "专属于旅游管理专业的实训实验室。采用实时 Amadeus 与 Sabre 全球分销机票预订系统，练习专业导游编排与大型会展组织。",
        Arab: "مختبر مخصص لطلاب سياحة السفر لتطبيق أنظمة حجز تذاكر الطيران المباشرة Amadeus/Sabre وتخطيط الرحلات.",
        Jerman: "Terminal-Labor für Tourismusstudenten. Training der Echtzeit-Flugbuchungssysteme Amadeus/Sabre sowie der Tourenplanung.",
        Turki: "Seyahat İşletmeciliği öğrencileri için özel terminal labı. Gerçek zamanlı Amadeus/Sabre GDS bilet platformlarını ve tur planlama tekniklerini uygulamalı öğrenme.",
        Korea: "관광 비즈니스 전공생을 위한 전용 랩으로 실시간 Amadeus 및 Sabre GDS 발권 엔진 시스템 운용법과 단체 기획 및 행사 관리를 배웁니다.",
      }
    },
    {
      id: 5,
      category: "facilities",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
      titles: {
        ID: "Pekarangan Utama Jayakarta",
        EN: "Jayakarta Central Courtyard",
        JPN: "ジャヤカルタ・中央中庭",
        Mandarin: "杰雅卡达中心绿地庭院",
        Arab: "ساحة جاياكارتا الخضراء",
        Jerman: "Jayakarta Innenhof",
        Turki: "Jayakarta Merkez Avlusu",
        Korea: "자야카르타 중앙 정원 및 야외 쉼터",
      },
      descs: {
        ID: "Area hijau terbuka yang asri dan sejuk. Berfungsi sebagai paru-paru kampus dan pusat berkumpulnya mahasiswa untuk kegiatan UKM, diskusi santai, dan pameran luar ruangan.",
        EN: "A beautiful green sanctuary at the heart of our campus. Provides lush spaces for student gatherings, outdoor events, student activity clubs (UKM), and scenic relaxation.",
        JPN: "キャンパス中央に広がる美しい緑地帯。サークル活動（UKM）の集まり、屋外イベント展示、 excavation、そして学生たちの憩いの広場として賑わいます。",
        Mandarin: "校园中央优美的绿色港湾。这里绿草茵茵，是学生进行社团活动（UKM）、露天小型会展、日常休闲与学业讨论的热门聚集点。",
        Arab: "ساحة جاياكارتا الخضراء، تمثل مكاناً لتجمع الطلاب وممارسة الأنشطة الطلابية والمعارض الخارجية والترفيه الهادئ.",
        Jerman: "Eine grüne Oase im Herzen unseres Campus. Bietet Raum für Studentenversammlungen, Campus-Veranstaltungen im Freien und entspanntes Beisammensein.",
        Turki: "Kampüsümüzün kalbinde yer alan yeşil sığınak. Kulüp faaliyetleri, açık hava etkinlikleri ve dinlenme alanları sunan yemyeşil bir bahçe.",
        Korea: "캠퍼스 심장부에 위치한 아름답고 쾌적한 야외 녹지 휴식 공간입니다. 동아리 연합 활동(UKM), 야외 상설전 등 학생 소통을 위한 메카입니다.",
      }
    },
    {
      id: 6,
      category: "student",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
      titles: {
        ID: "Interactive Library Hub",
        EN: "Interactive Library Hub",
        JPN: "インタラクティブ・ライブラリーハブ",
        Mandarin: "互动式学术阅览中心",
        Arab: "المكتبة الرقمية التفاعلية",
        Jerman: "Interaktives Bibliotheks-Zentrum",
        Turki: "İnteraktif Kütüphane & Araştırma Hubı",
        Korea: "디지털 라이브러리 및 하이브리드 미팅룸",
      },
      descs: {
        ID: "Perpustakaan digital modern dengan koleksi referensi hospitality terlengkap, akses jurnal internasional, serta ruang diskusi multimedia ber-AC yang nyaman.",
        EN: "Modern digital library hosting extensive hospitality collections, international academic journal access, and high-comfort multimedia group study rooms.",
        JPN: "ホスピタリティ関連書籍を豊富に備えた最新の電子図書館。国際学術ジャーナルへのアクセス、ならびに快適なマルチメディア討議室が利用可能です。",
        Mandarin: "现代化的数字化图书馆，拥有极丰富的酒店与旅游服务业文献资源。提供多媒体冷气讨论室和全球权威学术期刊数据库访问。",
        Arab: "مكتبة حديثة توفر أحدث الكتب والمراجع الأكاديمية وصناعة الضيافة، مجهزة بغرف مكيفة للدراسة والمناقشة الجماعية.",
        Jerman: "Eine moderne digitale Bibliothek mit umfangreicher Reiseliteratur, internationalem Zeitschriftenzugang und komfortablen Gruppenarbeitsräumen.",
        Turki: "Turizm ve konaklama kaynakları, uluslararası yayınlar ve konforlu multimedya grup çalışma odaları sunan modern kütüphane.",
        Korea: "호텔 관광 최고 권위의 학술 서적 및 멀티미디어 인프라를 보유한 디지털 학습 공간으로 팀 프로젝트용 최신 냉방 스터디룸을 지원합니다.",
      }
    }
  ], []);

  // Filtered Items
  const filteredItems = useMemo(() => {
    if (selectedFilter === "all") return galleryItems;
    return galleryItems.filter((item) => item.category === selectedFilter);
  }, [selectedFilter, galleryItems]);

  // Multilingual UI Translations
  const transDict: Record<LanguageCode, Record<string, string>> = {
    ID: {
      secTitle: "Galeri Kampus APJ",
      secSubtitle: "Visualisasi Fasilitas Unggulan & Aktivitas Mahasiswa",
      tagline: "Representasi digital berkualitas tinggi dari laboratorium, prasarana fisik, dan kehidupan mahasiswa di Akademi Pariwisata Jakarta.",
      filterAll: "Semua Foto",
      filterFacilities: "Sarana Fisik",
      filterLabs: "Laboratorium Praktik",
      filterStudent: "Aktivitas Mahasiswa",
      tapToZoom: "Klik untuk Memperbesar",
      close: "Tutup",
      prev: "Sebelumnya",
      next: "Berikutnya",
      aiIndicator: "AI Visual Render",
    },
    EN: {
      secTitle: "APJ Campus Gallery",
      secSubtitle: "Visualizations of Premier Facilities & Student Activities",
      tagline: "High-quality digital representations showcasing laboratories, physical infrastructure, and student life at Jakarta Tourism Academy.",
      filterAll: "All Photos",
      filterFacilities: "Campus Grounds",
      filterLabs: "Practical Labs",
      filterStudent: "Student Life",
      tapToZoom: "Click to Zoom",
      close: "Close",
      prev: "Previous",
      next: "Next",
      aiIndicator: "AI Visual Render",
    },
    JPN: {
      secTitle: "APJ キャンパスギャラリー",
      secSubtitle: "主要施設と活気ある学生生活のビジュアル紹介",
      tagline: "ジャカルタ観光アカデミーの最新実習室、快適な施設、そして豊かな学生生活を描く高品質なデジタルビジュアルです。",
      filterAll: "すべて表示",
      filterFacilities: "キャンパス施設",
      filterLabs: "実習ラボ",
      filterStudent: "学生の活動",
      tapToZoom: "クリックで拡大表示",
      close: "閉じる",
      prev: "前へ",
      next: "次へ",
      aiIndicator: "AI ビジュアル描画",
    },
    Mandarin: {
      secTitle: "APJ 校园视觉画廊",
      secSubtitle: "核心实训教学设施与学生风采展示",
      tagline: "高质量数字化代表模型，展现雅加达旅游学院的一流实训场地、校区景观以及多彩的学术日常。",
      filterAll: "全部照片",
      filterFacilities: "实训硬件",
      filterLabs: "实践实验室",
      filterStudent: "学生日常",
      tapToZoom: "点击查看清晰大图",
      close: "关闭",
      prev: "上一张",
      next: "下一张",
      aiIndicator: "AI 智能模型生成",
    },
    Arab: {
      secTitle: "معرض حرم APJ",
      secSubtitle: "استعراض المرافق المتميزة والأنشطة الطلابية",
      tagline: "تمثيل رقمي عالي الجودة يعرض المختبرات والبنية التحتية المتميزة وحياة الطلاب في أكاديمية جاكرتا للسياحة.",
      filterAll: "كل الصور",
      filterFacilities: "مرافق الحرم",
      filterLabs: "مختبرات التدريب",
      filterStudent: "حياة الطلاب",
      tapToZoom: "انقر للتكبير",
      close: "إغلاق",
      prev: "السابق",
      next: "التالي",
      aiIndicator: "رسم بصري ذكي AI",
    },
    Jerman: {
      secTitle: "APJ Campus-Galerie",
      secSubtitle: "Visualisierungen erstklassiger Einrichtungen & Aktivitäten",
      tagline: "Hochwertige digitale Rekonstruktionen von Laboren, physischen Infrastrukturen und dem bunten Studentenleben der Jakarta Tourism Academy.",
      filterAll: "Alle Bilder",
      filterFacilities: "Infrastruktur",
      filterLabs: "Praxislabore",
      filterStudent: "Studentenleben",
      tapToZoom: "Zum Vergrößern klicken",
      close: "Schließen",
      prev: "Zurück",
      next: "Weiter",
      aiIndicator: "AI Visualisierung",
    },
    Turki: {
      secTitle: "APJ Kampüs Galerisi",
      secSubtitle: "Öncü Tesislerin ve Öğrenci Faaliyetlerinin Görsel Sunumu",
      tagline: "Cakarta Turizm Akademisi bünyesindeki laboratuvarların, altyapının ve öğrenci hayatının yüksek çözünürlüklü dijital canlandırmaları.",
      filterAll: "Tüm Görseller",
      filterFacilities: "Yerleşke Tesisleri",
      filterLabs: "Uygulama Labları",
      filterStudent: "Öğrenci Yaşamı",
      tapToZoom: "Büyütmek için Tıklayın",
      close: "Kapat",
      prev: "Önceki",
      next: "Sonraki",
      aiIndicator: "Yapay Zeka Canlandırma",
    },
    Korea: {
      secTitle: "APJ 캠퍼스 비주얼 갤러리",
      secSubtitle: "첨단 학습 인프라 및 다채로운 학생 자치 활동",
      tagline: "자카르타 관광아카데미의 최신 실습 실험실, 대학 인프라 및 열정 가득한 일상을 보여주는 고화질 디지털 구현관입니다.",
      filterAll: "전체 목록",
      filterFacilities: "학습 시설",
      filterLabs: "실무 실습장",
      filterStudent: "대학 생활",
      tapToZoom: "클릭하여 원본 보기",
      close: "닫기",
      prev: "이전 사진",
      next: "다음 사진",
      aiIndicator: "AI 스마트 구현",
    }
  };

  const gt = (key: string) => {
    const lang = transDict[currentLang] || transDict["ID"];
    return lang[key] || transDict["ID"][key] || key;
  };

  // Navigate lightbox inside the filtered array
  const handlePrev = () => {
    if (lightboxIndex === null) return;
    const currentItem = filteredItems[lightboxIndex];
    const prevIndexInFiltered = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxIndex(prevIndexInFiltered);
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    const nextIndexInFiltered = (lightboxIndex + 1) % filteredItems.length;
    setLightboxIndex(nextIndexInFiltered);
  };

  // Helper to render category icon
  const renderCatIcon = (category: "facilities" | "labs" | "student") => {
    switch (category) {
      case "facilities":
        return <Building2 size={14} className="text-blue-500" />;
      case "labs":
        return <Coffee size={14} className="text-amber-500" />;
      case "student":
        return <GraduationCap size={14} className="text-emerald-500" />;
    }
  };

  return (
    <section className="bg-neutral-50/50 py-16 md:py-20 border-t border-b border-neutral-100" id="campus-gallery-section">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0050A0] text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border border-blue-100/60 shadow-xs">
            <Sparkles size={11} className="animate-pulse" />
            <span>Interactive Campus Virtualization</span>
          </div>
          <h2 className="text-2xl md:text-3.5xl font-black text-neutral-900 tracking-tight font-heading leading-tight">
            {gt("secTitle")}
          </h2>
          <p className="text-sm font-bold text-[#0050A0] tracking-wide uppercase">
            {gt("secSubtitle")}
          </p>
          <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-semibold">
            {gt("tagline")}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2" id="gallery-filters-container">
          <button
            onClick={() => { setSelectedFilter("all"); setLightboxIndex(null); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              selectedFilter === "all"
                ? "bg-[#0050A0] text-white border-[#0050A0] shadow-md shadow-blue-900/10"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-[#0050A0] hover:text-[#0050A0]"
            }`}
            id="gallery-filter-all"
          >
            {gt("filterAll")}
          </button>
          <button
            onClick={() => { setSelectedFilter("facilities"); setLightboxIndex(null); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === "facilities"
                ? "bg-[#0050A0] text-white border-[#0050A0] shadow-md shadow-blue-900/10"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-[#0050A0] hover:text-[#0050A0]"
            }`}
            id="gallery-filter-facilities"
          >
            <Building2 size={13} />
            {gt("filterFacilities")}
          </button>
          <button
            onClick={() => { setSelectedFilter("labs"); setLightboxIndex(null); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === "labs"
                ? "bg-[#0050A0] text-white border-[#0050A0] shadow-md shadow-blue-900/10"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-[#0050A0] hover:text-[#0050A0]"
            }`}
            id="gallery-filter-labs"
          >
            <Coffee size={13} />
            {gt("filterLabs")}
          </button>
          <button
            onClick={() => { setSelectedFilter("student"); setLightboxIndex(null); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === "student"
                ? "bg-[#0050A0] text-white border-[#0050A0] shadow-md shadow-blue-900/10"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-[#0050A0] hover:text-[#0050A0]"
            }`}
            id="gallery-filter-student"
          >
            <GraduationCap size={13} />
            {gt("filterStudent")}
          </button>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-4"
          id="gallery-items-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              // find absolute index in main array for display or just keep layout index
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className="bg-white rounded-2xl border border-neutral-150/80 shadow-xs overflow-hidden group cursor-pointer hover:shadow-xl hover:border-neutral-200 transition-all duration-300 flex flex-col justify-between"
                  id={`gallery-item-card-${item.id}`}
                >
                  <div>
                    {/* Image Area with Overlay */}
                    <div className="h-52 relative overflow-hidden bg-neutral-100">
                      <img
                        src={item.image}
                        alt={item.titles[currentLang] || item.titles["ID"]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* AI Generated Tag */}
                      <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm flex items-center gap-1 border border-white/10 uppercase tracking-wider">
                        <Sparkles size={9} className="text-amber-400" />
                        <span>{gt("aiIndicator")}</span>
                      </div>

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-neutral-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white/95 backdrop-blur-xs text-[#0050A0] font-bold text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <Maximize2 size={13} />
                          {gt("tapToZoom")}
                        </span>
                      </div>
                    </div>

                    {/* Text Area */}
                    <div className="p-6 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-neutral-100 px-2.5 py-1 rounded-md text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                          {renderCatIcon(item.category)}
                          {gt(`filter${item.category.charAt(0).toUpperCase() + item.category.slice(1)}`)}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-neutral-900 leading-snug text-base group-hover:text-[#0050A0] transition duration-200">
                        {item.titles[currentLang] || item.titles["ID"]}
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed font-semibold line-clamp-3">
                        {item.descs[currentLang] || item.descs["ID"]}
                      </p>
                    </div>
                  </div>

                  {/* Footer Interactive Card */}
                  <div className="px-6 pb-6 pt-0 border-t border-neutral-50 flex justify-end">
                    <span className="text-[11px] font-bold text-[#0050A0] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      {gt("tapToZoom")} &rarr;
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox / Immersive Detail View */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 md:p-6"
              id="gallery-lightbox"
            >
              {/* Close Header button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition cursor-pointer"
                title={gt("close")}
                id="gallery-lightbox-close"
              >
                <X size={20} />
              </button>

              {/* Prev / Next controls Desktop */}
              <button
                onClick={handlePrev}
                className="hidden md:flex absolute left-6 bg-white/10 hover:bg-white/20 text-white p-3.5 rounded-full transition cursor-pointer select-none"
                title={gt("prev")}
                id="gallery-lightbox-prev-desktop"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={handleNext}
                className="hidden md:flex absolute right-6 bg-white/10 hover:bg-white/20 text-white p-3.5 rounded-full transition cursor-pointer select-none"
                title={gt("next")}
                id="gallery-lightbox-next-desktop"
              >
                <ChevronRight size={24} />
              </button>

              {/* Main Dialog Panel */}
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] md:max-h-[85vh] shadow-2xl flex flex-col md:flex-row border border-neutral-200"
                onClick={(e) => e.stopPropagation()}
                id="gallery-lightbox-card"
              >
                {/* Photo half */}
                <div className="md:w-3/5 h-64 md:h-auto relative bg-neutral-950 flex items-center justify-center">
                  <img
                    src={filteredItems[lightboxIndex].image}
                    alt={filteredItems[lightboxIndex].titles[currentLang] || filteredItems[lightboxIndex].titles["ID"]}
                    className="w-full h-full object-cover md:object-contain max-h-[60vh]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/65 backdrop-blur-xs text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase border border-white/10">
                    <Sparkles size={11} className="text-amber-400" />
                    <span>{gt("aiIndicator")}</span>
                  </div>
                </div>

                {/* Detail half */}
                <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-neutral-100 px-3 py-1 rounded-md text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        {renderCatIcon(filteredItems[lightboxIndex].category)}
                        {gt(`filter${filteredItems[lightboxIndex].category.charAt(0).toUpperCase() + filteredItems[lightboxIndex].category.slice(1)}`)}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-neutral-900 leading-snug font-heading">
                      {filteredItems[lightboxIndex].titles[currentLang] || filteredItems[lightboxIndex].titles["ID"]}
                    </h3>
                    
                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                      {filteredItems[lightboxIndex].descs[currentLang] || filteredItems[lightboxIndex].descs["ID"]}
                    </p>
                  </div>

                  {/* Mobile Controls & Indicator footer */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Item {lightboxIndex + 1} / {filteredItems.length}
                    </div>
                    
                    {/* Mobile control buttons */}
                    <div className="flex md:hidden items-center gap-2">
                      <button
                        onClick={handlePrev}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 p-2.5 rounded-xl transition cursor-pointer"
                        id="gallery-lightbox-prev-mobile"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 p-2.5 rounded-xl transition cursor-pointer"
                        id="gallery-lightbox-next-mobile"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
