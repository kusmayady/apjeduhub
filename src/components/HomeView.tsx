import React, { useState, useEffect } from "react";
import { BookOpen, Award, Users, ChevronRight, ChevronLeft, GraduationCap, Building2, MapPin, Sparkles, Phone, ArrowRight } from "lucide-react";
import { getAnnouncements, AnnouncementItem } from "../lib/dbService";
import { LanguageCode } from "../lib/translations";
import CampusGallery from "./CampusGallery";
import CampusMap from "./CampusMap";

interface HomeViewProps {
  onNavigate: (section: string, tab: string) => void;
  onSelectArticle: (article: AnnouncementItem) => void;
  currentLang: LanguageCode;
}

export default function HomeView({ onNavigate, onSelectArticle, currentLang }: HomeViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Multilingual Slides translates
  const slidesDict: Record<LanguageCode, Array<{ title: string; subtitle: string; desc: string; ctaText: string }>> = {
    ID: [
      {
        title: "Penerimaan Mahasiswa Baru TA 2026/2027",
        subtitle: "Saatnya Menjadi Profesional & Pemimpin Industri Pariwisata Dunia",
        desc: "APJ membuka pendaftaran Jalur Reguler, Prestasi Rapor, Beasiswa Unggulan, dan Kelas Praktisi Karyawan. Pendaftaran gelombang kedua sedang berlangsung!",
        ctaText: "Daftar PMB Sekarang"
      },
      {
        title: "Program Studi D3 Perhotelan & Usaha Wisata",
        subtitle: "Kurikulum Praktis Internasional Berlisensi BNSP",
        desc: "Menyediakan pendidikan vokasional terbaik berbasis kompetensi kerja nyata. Siap kerja, siap bersaing di hotel bintang 5 nasional dan mancanegara.",
        ctaText: "Eksplor Program Studi"
      },
      {
        title: "Peluang Karir & Jaringan Global",
        subtitle: "Magang Kerja Terarah Selama 6 Bulan",
        desc: "Disalurkan langsung ke The Ritz-Carlton, JW Marriott, Grand Hyatt, kapal pesiar internasional, serta agen perjalanan pariwisata terkemuka.",
        ctaText: "Hubungan Kerjasama Karir"
      }
    ],
    EN: [
      {
        title: "New Student Admission Academic Year 2026/2027",
        subtitle: "Time to Become a Professional & Worldwide Tourism Industry Leader",
        desc: "APJ opens registration for Regular, Report Academic Achievement, Outstanding Scholarships, and Career Professional Classes. Wave 2 enrollment open now!",
        ctaText: "Register for PMB Now"
      },
      {
        title: "D3 Hotel Management & Tourism Business Programs",
        subtitle: "Practical International Curriculum with BNSP Licensing",
        desc: "Providing the finest competency-based vocational education. Job-ready, ready to compete in local and global 5-star hotels.",
        ctaText: "Explore Study Programs"
      },
      {
        title: "Career Prospects & Worldwide Networks",
        subtitle: "Fully Structured 6-Month Real Internship Programs",
        desc: "Dispatched directly to The Ritz-Carlton, JW Marriott, Grand Hyatt, luxury global cruise ships, and leading tourism agencies.",
        ctaText: "Career Partnerships"
      }
    ],
    JPN: [
      {
        title: "2026/2027学年度 新入学生募集受付中",
        subtitle: "世界の観光業界をリードするプロフェッショナルを目指す時",
        desc: "APJはレギュラー、成績優秀特典、特待生奨学金、社会人実務クラスを公募しています。第2回募集受付中！",
        ctaText: "今すぐ出願登録する"
      },
      {
        title: "D3 ホテル経営科・観光ビジネス科",
        subtitle: "BNSP（国家職業資格基準局）ライセンス付与の国際実務型カリキュラム",
        desc: "実能力主義に基づく観光職業専門教育。5つ星ハイエンドホテルや国内外で即戦力として自信を持って働けます。",
        ctaText: "専攻課程を調べる"
      },
      {
        title: "キャリア展開とグローバルネットワーク",
        subtitle: "戦略的な6ヶ月間にわたる有給有資格インターンシップ",
        desc: "リッツカールトン、マリオット、グランドハイアット、世界中を航行する豪華客船や大手代理店への派遣実績多数。",
        ctaText: "キャリア協力のご案内"
      }
    ],
    Mandarin: [
      {
        title: "2026/2027 学年度新生入学报名中",
        subtitle: "成为全球旅游与酒店服务行业领军人物的绝佳时机",
        desc: "雅加达旅游学院开放常规通道、成绩优异生、优秀奖学金及在职实用班报名。第二阶段正在热烈招募中！",
        ctaText: "立即在线提交报名"
      },
      {
        title: "D3 酒店管理与旅游商务专业课程",
        subtitle: "获得国家 BNSP 官方认证的高国际标准实践教学课程",
        desc: "提供最先进的高等职业教育。培养具备出众职业技能的毕业生，毕业直接入职五星级高端酒店。",
        ctaText: "立即探索核心课程"
      },
      {
        title: "职业发展机遇与全球领军校友网",
        subtitle: "大三阶段 6 个月定向专业岗位带薪实习计划",
        desc: "直接向丽思卡尔顿、万豪、君悦酒店、顶级奢华国际邮轮和行业知名旅游局提供定向推荐就业。",
        ctaText: "了解就业合作协议"
      }
    ],
    Arab: [
      {
        title: "قبول الطلاب الجدد للعام الدراسي 2026/2027",
        subtitle: "الوقت المناسب لتصبح رائداً محترفاً في صناعة السياحة العالمية",
        desc: "تفتح الأكاديمية باب القبول للمسارات العامة والمميزة، والمنح الدراسية والصفوف المهنية للموظفين. جولة القبول الثانية جارية حالياً!",
        ctaText: "سجل في مكتب القبول الآن"
      },
      {
        title: "سلك الدبلوم لـ إدارة الفنادق وإرشاد السياحة والأسفار",
        subtitle: "منهج عملي دولي متكامل مرخص ومعتمد من الهيئة الوطنية للتأهيل المهني",
        desc: "توفير أفضل تعليم فني مهني يعتمد على المهارات العملية الحقيقية. الخريجون مؤهلون للمنافسة في فنادق 5 نجوم.",
        ctaText: "تصفح الخيارات الأكاديمية"
      },
      {
        title: "فرص العمل الواعدة والشبكة المهنية الدولية",
        subtitle: "برنامج تدريب ميداني شامل وموجه لمدة 6 أشهر كاملة",
        desc: "إرسال الطلاب للتدريب مباشرة في فندق ريتز كارلتون، جي دبليو ماريوت، جراند حياة، واليخوت السياحية ووكالات السياحة الرائدة.",
        ctaText: "شؤون التوظيف والشركاء"
      }
    ],
    Jerman: [
      {
        title: "Zulassung neuer Studenten für das Studienjahr 2026/2027",
        subtitle: "Zeit, ein professioneller Anführer der globalen Tourismusbranche zu werden",
        desc: "Die APJ öffnet die Bewerbungsrunden für reguläre Studiengänge, Leistungsstipendien und berufsbegleitende Abendkurse. Jetzt bewerben!",
        ctaText: "Jetzt Online Bewerben"
      },
      {
        title: "D3 Hotelmanagement & Tourismuswirtschaft Studiengang",
        subtitle: "Praxisorientierter Lehrplan mit staatlich anerkannter Lizenz",
        desc: "Optimale praktische Vokabelausbildung basierend auf realen Industriestandards. Erstklassig vorbereitet für die Top-Hotellerie.",
        ctaText: "Studiengänge Erkunden"
      },
      {
        title: "Karrierechancen & Globales Hotel-Netzwerk",
        subtitle: "Zielgerichtetes, betreutes 6-monatiges Fachpraktikum",
        desc: "Direktvermittlung zu The Ritz-Carlton, JW Marriott, Grand Hyatt, internationalen Kreuzfahrtschiffen sowie führenden Agenturen.",
        ctaText: "Praktikumspartner Einsehen"
      }
    ],
    Turki: [
      {
        title: "2026/2027 Yeni Akademik Yıl Öğrenci Kayıtları Başladı",
        subtitle: "Uluslararası Turizm Sektörünün Lider Profesyoneli Olma Zamanı",
        desc: "APJ; Düzenli Kayıt, Başarı Bursu ve Çalışanlar İçin Hibrit Sınıflar kapsamında öğrenci kabul ediyor. İkinci kayıt dalgası açık!",
        ctaText: "Kayıt Başvurusunu Başlat"
      },
      {
        title: "D3 Otel Yönetimi & Turizm İşletmeciliği Eğitimi",
        subtitle: "BNSP Lisans ve Akreditasyonlu Küresel Uygulamalı Müfredat",
        desc: "Gerçek iş hayatına dayalı en iyi mesleki eğitimi veriyoruz. Beş yıldızlı küresel zincir otellerde liderlik için tam hazırlık.",
        ctaText: "Program Detaylarını İncele"
      },
      {
        title: "Kariyer Ağı & Küresel Mezun Havuzu",
        subtitle: "6 Aylık Profesyonel ve Yönlendirmeli Staj Fırsatı",
        desc: "The Ritz-Carlton, JW Marriott, Grand Hyatt otellerine, lüks yolcu gemilerine ve önde gelen acentelere doğrudan yönlendirme.",
        ctaText: "Kariyer İşbirliklerimiz"
      }
    ],
    Korea: [
      {
        title: "2026/2027 신입생 특별 모집 모집 요강 및 원서 접수",
        subtitle: "세계 호텔 및 관광 산업을 주도하고 글로벌 리더로 도약할 준비",
        desc: "APJ 아카데미는 정시 일반 전형, 학생부 성적 우수자, 특별 장학생 전형, 직장인 실무 야간반을 모집합니다. 2차 모집 중!",
        ctaText: "온라인 원서 접수하기"
      },
      {
        title: "D3 호텔 경영학과 & 관광 비즈니스 마케팅 학과",
        subtitle: "인도네시아 국가직업기준(BNSP) 공인 라이센스 취득 전문 교육과정",
        desc: "현장 직무 적합형 역량 중심의 직업 전문 교육 인프라 완비. 졸업 후 글로벌 5성급 특급 호텔 즉시 취업 가능.",
        ctaText: "상세 교육과정 둘러보기"
      },
      {
        title: "체계적인 글로벌 커리어 네트워크 인프라 구축",
        subtitle: "5성급 호텔 및 크루즈 6개월 필수 실무 현장 인턴십 이수",
        desc: "리츠칼튼, JW 메리어트, 그랜드 하얏트 및 럭셔리 대형 국제 크루즈선과 선도적인 여행전문기관 맞춤형 매칭 및 추천 채용.",
        ctaText: "산학협력처 채용정보"
      }
    ]
  };

  const slides = slidesDict[currentLang] || slidesDict["ID"];

  // Mapping states slides references background
  const slideBgs = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200"
  ];

  const slideActionRoutes = [
    () => onNavigate("pmb", "daftar"),
    () => onNavigate("akademik", "d3perhotelan"),
    () => onNavigate("kemahasiswaan", "karir")
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Multilingual Stats Translates
  const statsDict: Record<LanguageCode, Array<{ value: string; label: string; desc: string }>> = {
    ID: [
      { value: "50+", label: "Tahun Mengabdi", desc: "Melahirkan profesional pariwisata sejak 1972" },
      { value: "95%", label: "Keterserapan Kerja", desc: "Lulusan langsung diserap industri dan kapal pesiar" },
      { value: "5.000+", label: "Alumni Sukses", desc: "Tersebar di Dubai, Qatar, USA, hingga Eropa" },
      { value: "Baik Sekali", label: "Akreditasi BAN-PT", desc: "Standar mutu institusi pendidikan tinggi tepercaya" }
    ],
    EN: [
      { value: "50+", label: "Years of Service", desc: "Forging tourism and hotel managers since 1972" },
      { value: "95%", label: "Employment Rate", desc: "Graduates instantly hired by luxury hotels & cruise fleets" },
      { value: "5,000+", label: "Successful Alumni", desc: "Distributed across Dubai, Qatar, USA, and Europe" },
      { value: "Excellent", label: "BAN-PT Accredited", desc: "Highly trusted higher education quality standards" }
    ],
    JPN: [
      { value: "50年以上", label: "教育実績", desc: "1972年創立以来、観光・サービス業のプロを多数創出" },
      { value: "95%", label: "高い就職率", desc: "5つ星ホテルや大手豪華客船に業界トップクラスの就職" },
      { value: "5,000人超", label: "優秀な同窓生", desc: "ドバイ、カタール、米国、ヨーロッパ全域で活躍中" },
      { value: "最高評価", label: "国から公式評価", desc: "インドネシア国家大学評価委員会（BAN-PT）認定校" }
    ],
    Mandarin: [
      { value: "50余载", label: "办学深厚底蕴", desc: "自1972年起潜心培育优秀文旅英才" },
      { value: "95%", label: "毕业生签约率", desc: "毕业生一毕业即被各大高端豪华酒店或邮轮录用" },
      { value: "5000+", label: "成功校友网络", desc: "足迹遍布迪拜、卡塔尔、美国及欧洲各大都市" },
      { value: "卓越优秀", label: "国家级评估办学", desc: "拥有高标准的国家高等教育评估（BAN-PT）极好评级" }
    ],
    Arab: [
      { value: "+٥٠", label: "عاماً من التعليم", desc: "تخريج قادة السياحة والفنادق المؤهلين منذ عام ١٩٧٢" },
      { value: "٩٥٪", label: "معدل التوظيف", desc: "توظيف مباشر في الفنادق الفاخرة وسفن الملاحة الدولية" },
      { value: "+٥٠٠٠", label: "خريجاً ناجحاً", desc: "يعملون وينتشرون في دبي، قطر، أمريكا، وأوروبا" },
      { value: "ممتاز", label: "اعتماد BAN-PT", desc: "أعلى معايير جودة التعليم للمؤسسات الحكومية والأهلية" }
    ],
    Jerman: [
      { value: "50+", label: "Jahre Kompetenz", desc: "Ausbildung von Hospitality-Führungskräften seit 1972" },
      { value: "95%", label: "Direkteinstellung", desc: "Einstellung direkt nach Studienabschluss bei Top-Arbeitgebern" },
      { value: "5.000+", label: "Erfolgreiche Alumni", desc: "Etabliert in Dubai, Katar, den USA und ganz Europa" },
      { value: "Hervorragend", label: "Akkreditierung", desc: "Unabhängig geprüfte Bildungsgesamtqualität der BAN-PT" }
    ],
    Turki: [
      { value: "50+ Yıl", label: "Akademik Geçmiş", desc: "1972'den beri seçkin turizm uzmanları yetiştiriyoruz" },
      { value: "95%", label: "İşe Yerleşme", desc: "Lüks otel zincirlerinde ve kruvaziyer gemilerinde doğrudan istihdam" },
      { value: "5.000+", label: "Başarılı Mezun", desc: "Dubai, Katar, ABD ve Avrupa'nın her yerine yayılmış mezunlar" },
      { value: "Çok İyi", label: "BAN-PT Akreditasyonu", desc: "Güvenilir, yüksek düzeyde devlet onaylı kalite standardı" }
    ],
    Korea: [
      { value: "50년 이상", label: "반세기 역사", desc: "1972년 이래로 관광 산업 인재를 양성해 온 정통 기관" },
      { value: "95%", label: "높은 취업률 자랑", desc: "국내외 호텔 브랜드 및 크루즈 선사 다수 매칭 채용 정책" },
      { value: "5,000+", label: "성공적인 동문회", desc: "두바이, 카타르, 미국, 유럽 등 전 세계 각지 진출" },
      { value: "우수 공인", label: "정식 등급 획득", desc: "국립고등교육평가원(BAN-PT) 지정 최고 수준 대학" }
    ]
  };

  const currentStats = statsDict[currentLang] || statsDict["ID"];

  // Language Dictionary for Landing Interface Text
  const uiText: Record<LanguageCode, Record<string, string>> = {
    ID: {
      detailsButton: "Kenal APJ Lebih Dekat",
      sambutanDirektur: "Sambutan Direktur Akademi",
      sambutanHeading: "Membangun Masa Depan Gemilang di Industri Hospitality Selaras Standar Global",
      sambutanPara1: "Selamat datang di Akademi Pariwisata Jakarta (APJ). Selama lebih dari 50 tahun (Sejak 1972), kami teguh berkomitmen sebagai lembaga pendidikan tinggi vokasi pariwisata swasta perintis di Jakarta Timur yang mendidik insan-insan andal, terampil, dan berkarakter ramah tamah.",
      sambutanPara2: "Industri perhotelan (hotel management) dan perjalanan wisata berkembang pesat pasca disrupsi digital. Oleh karena itu, kurikulum di APJ dirancang fleksibel menyesuaikan kebutuhan riil pasar internasional, melatih mahasiswa tidak hanya keahlian teknis (hard-skills) melainkan komunikasi dan penjiwaan pelayanan profesional (soft-skills). Selamat bergabung mengukir sukses bersama APJ!",
      sambutanCta: "Pelajari Visi Misi & Strategi Kampus",
      prodiTitle: "Program Studi Unggulan (D3 Vokasi)",
      prodiSubtitle: "Pilihan Masa Depan untuk Karir Internasional",
      prodiDesc: "Dua peminatan spesifik dengan prospek kerja melimpah baik domestik, kapal pesiar mewah, maupun ekspansi global.",
      vokasiAcc: "D3 VOKASI • AKREDITASI",
      hotelTitle: "D3 Perhotelan (Hotel Management)",
      hotelDesc: "Mempelajari manajemen operasional hotel bintang 5 secara mendalam. Mencakup keahlian Food & Beverage Division (Culinary/Dapur, Pastry, Mixology, Bar), Room Division (Front Office, Housekeeping, Butler Service) serta perencanaan Banquet Event.",
      hotelB1: "✔ Praktik langsung di Laboratorium Kuliner Komersial",
      hotelB2: "✔ Kurikulum Berstandar Standar ASEAN Hospitality",
      hotelB3: "✔ Sertifikasi BNSP Resmi Pariwisata",
      hotelBtn: "Syllabus & Detail Kurikulum Perhotelan",
      wisataTitle: "D3 Usaha Perjalanan Wisata (Bina Wisata)",
      wisataDesc: "Berfokus melatih perencanaan perjalanan, operasional biro travel digital (OTA), pemanduan rute ekowisata secara etis (Guiding), penanganan dokumen negara migrasi, serta manajemen pameran konferensi berskala internasional (MICE).",
      wisataB1: "✔ Praktik Tiket Sabre & Amadeus Airlines Terminal",
      wisataB2: "✔ Lisensi BNSP Pemandu & Perencana Perjalanan",
      wisataB3: "✔ Simulasi Pengorganisasian Event / MICE asli",
      wisataBtn: "Syllabus & Detail Kurikulum Usaha Wisata",
      newsSubtitle: "Berita Kampus & Artikel Terkini",
      newsTitle: "Aktivitas Terkini & Kebanggaan APJ",
      newsCta: "Lihat Milestone Sejarah Kampus",
      readBtn: "Baca Selengkapnya",
      partnerSubtitle: "JARINGAN KEMITRAAN APJ",
      partnerTitle: "Bekerja Sama dengan Manajemen Luxury Hotel & Institusi Ternama",
      establishedLabel: "Established 1972",
      yoyLabel: "Yayasan Pendidikan Jayakarta"
    },
    EN: {
      detailsButton: "Get to Know APJ Better",
      sambutanDirektur: "Academic Director's Greetings",
      sambutanHeading: "Building a Bright Future in the Hospitality Industry Aligned with Global Standards",
      sambutanPara1: "Welcome to the Jakarta Tourism Academy (APJ). For over 50 years (since 1972), we have been thoroughly committed as a pioneering private vocational tourism campus in East Jakarta, educating competent, skilled, hospitable leaders.",
      sambutanPara2: "The hotel management and travel industry is evolving tremendously fast post-digital disruption. Therefore, our academic curriculum is tailored to address the authentic requirements of international hotel chains, focusing not only on hard-skills but also service mindset communications (soft-skills). Welcome to the family!",
      sambutanCta: "Explore Vision, Mission & Main Strategies",
      prodiTitle: "Featured Study Programs (D3 Vocational)",
      prodiSubtitle: "Your Pathway to a Prestigious International Career",
      prodiDesc: "Two highly specific specializations with massive occupational availability locally, in luxury liner fleets, and globally.",
      vokasiAcc: "D3 VOCATIONAL • ACCREDITED",
      hotelTitle: "D3 Hotel Management (Hotels & Resorts)",
      hotelDesc: "Study the standard operatives of 5-star properties down to details. Encompasses F&B Division (Culinary Arts, Pastry, Mixology, Bar), Room Division (Front Desk, Housekeeping, Guest Services) and banquet event architecture.",
      hotelB1: "✔ Advanced Practice in Commercial Culinary Laboratories",
      hotelB2: "✔ Grounded in Common ASEAN Tourism Curriculum Framework",
      hotelB3: "✔ Official BNSP Professional Competence Credentials",
      hotelBtn: "Syllabus & Hotel Management Curriculum Details",
      wisataTitle: "D3 Tourism Business & Travel Planners",
      wisataDesc: "Focused on travel layout building, digital booking terminals (OTA operations), ethical eco-guiding, passport and visa documents handle, and international scale events management (MICE).",
      wisataB1: "✔ Hands-On Sabre & Amadeus GDS Booking Practices",
      wisataB2: "✔ Certified BNSP Tour Guiding & Itinerary Architect licenses",
      wisataB3: "✔ Original Event Organizing / MICE simulators",
      wisataBtn: "Syllabus & Tourism Business Curriculum Details",
      newsSubtitle: "Campus News & Current Publications",
      newsTitle: "Latest Highlights & Triumphs of APJ",
      newsCta: "View Historic Milestones History",
      readBtn: "Read More Detailed Core",
      partnerSubtitle: "OFFICIAL PARTNERSHIPS",
      partnerTitle: "Closely Joined with Brand Hotels and Global Operations",
      establishedLabel: "Established 1972",
      yoyLabel: "Jayakarta Educational Foundation"
    },
    JPN: {
      detailsButton: "APJを詳しく知る",
      sambutanDirektur: "学長・アカデミックディレクター挨拶",
      sambutanHeading: "国際基準に準拠した最高峰ホスピタリティ・サービス人材の育成",
      sambutanPara1: "ジャカルタ観光アカデミー（APJ）の公式ポータルへようこそ。1972年の創立以来、50年以上にわたり、ジャカルタ東部地域における観光職業専門教育の草分けとして、優秀でホスピタリティの心豊かな人材の輩出に努めてまいりました。",
      sambutanPara2: "デジタル変革期における最新のホテル管理、サービス業をターゲットに、実務に必要な高いハードスキル、そして接客に必須のコミュニケーション能力（ソフトスキル）を高次元で統合した特別なカリキュラムを提供しています。皆さんの挑戦をお待ちしています。",
      sambutanCta: "大学のビジョン、理念、戦略を見る",
      prodiTitle: "核心的なプログラム（D3 専門学士課程）",
      prodiSubtitle: "アジア、そして世界に羽ばたく就職パスポート",
      prodiDesc: "5つ星ホテルチェーン、国際ラグジュアリー観光ツアー、豪華定期客船への就職に直結する2つの強力な専門コースを設置。",
      vokasiAcc: "D3・国家品質認定プログラム",
      hotelTitle: "D3 ホテル・マネジメント（ホテル経営専攻）",
      hotelDesc: "高級5つ星ホテルの現場実務を基礎から応用までシミュレートして習得。調理・製菓・製パン、料飲サービス（カクテル・パブ）、フロント実務、ルーム管理（ハウスキーピング）を徹底マスター。",
      hotelB1: "✔ 学内プロ仕様の業務用キッチン設備にて即戦力向けの調理技術訓練",
      hotelB2: "✔ 共通ASEAN加盟国標準の観光カリキュラム適合",
      hotelB3: "✔ 国家BNSP認定資格に対応する高いスキルを保証",
      hotelBtn: "シラバスとカリキュラムの詳細（ホテル管理）",
      wisataTitle: "D3 観光ビジネス・旅行プ養成専攻",
      wisataDesc: "ツアー企画、旅行代理店オンライン端末操作（GDS実務）、国家的なビザ・パスポート等の出入国管理、コンファレンス・展示会プラン（MICE）の実践実務をマスターします。",
      wisataB1: "✔ セイバー・アマデウス航空券予約システム実習設備完備",
      wisataB2: "✔ BNSP公認のツアーガイドおよびツアープランナー資格取得可能",
      wisataB3: "✔ 実際の大型MICEイベントの企画・運営シミュレーション",
      wisataBtn: "シラバスとカリキュラムの詳細（観光実務）",
      newsSubtitle: "キャンパスニュース＆トピックス",
      newsTitle: "私たちの活動レポートと受賞記録",
      newsCta: "歴史的なマイルストーンをたどる",
      readBtn: "詳細はこちら",
      partnerSubtitle: "公式協賛・インターンシップ企業実績",
      partnerTitle: "5つ星ホテルグループおよび大手航空旅行代理店、海外就職ネットワーク",
      establishedLabel: "1972年 創立",
      yoyLabel: "ジャヤカルタ教育財団"
    },
    Mandarin: {
      detailsButton: "更深入地了解我们的学校",
      sambutanDirektur: "院长致辞",
      sambutanHeading: "构筑与国际接轨的高端文旅服务行业未来",
      sambutanPara1: "欢迎来到雅加达旅游学院（APJ）。在过去半个世纪中，我们作为雅加达东区最具声誉的多语种文旅实践高等职业院校，始终致力于为世界高端旅游及酒店管理行业造就具有高尚人格和娴熟服务本领的高级应用型人才。",
      sambutanPara2: "为适应现代智慧文旅及国际高端酒店管理模式的需求，我们的课程专为解决当代真实岗位诉求而策划，将全面的管理学硬实力和优质服务沟通等软实力相融合。祝愿大家在这里能创造自己的辉煌！",
      sambutanCta: "研究我们的办学理念、发展规划和学术策略",
      prodiTitle: "高素质热门专业（D3 大专阶段）",
      prodiSubtitle: "迈向高品质跨国就业的卓越黄金轨道",
      prodiDesc: "设立两套特色对口专业。毕业生受到国内外豪华五星级品牌、超豪华大型皇家邮轮以及高端会务会展集团等一致青睐。",
      vokasiAcc: "D3大专 • 官方质量评估优秀",
      hotelTitle: "D3 酒店管理方向（全方位国际星级标准）",
      hotelDesc: "深度剖析五星级豪华饭店与度假村的操作及行政管控。涉及食品与饮料规划（烹饪实训、烘焙、花式调酒）、客房管理（前厅前台接单、房务内管、管家定制服务）等关键版块。",
      hotelB1: "✔ 学生可直接在校园现代化商业模拟后厨和实训中心内进行练习",
      hotelB2: "✔ 秉承符合国际普遍认可的 Asean 旅游学术框架标准教学",
      hotelB3: "✔ 符合国家行业认可的 BNSP 文凭资质考核和职业规范",
      hotelBtn: "查看酒店管理专业的教学大纲与实习课程细则",
      wisataTitle: "D3 旅游及旅行社实务方向（定制化路线定制师）",
      wisataDesc: "专注于创意路线编排、各大全球分销分销机票票证终端系统（OTA民航预定系统）、国际会展与多功能大型博览会（MICE）运营流程等核心职业能力的培训。",
      wisataB1: "✔ 掌握主流 Sabre、Amadeus 民航操作及国际海关系统实习",
      wisataB2: "✔ 获取官方专业导游、资深线路策划师等行业证书资质",
      wisataB3: "✔ 参与实体创意文化博览活动的商业级操盘演练",
      wisataBtn: "查看旅游线路规划专业的教学大纲与大类技能表",
      newsSubtitle: "学院最新动态和学术研讨通报",
      newsTitle: "雅加达旅游职业教育的新名片与校优荣誉",
      newsCta: "阅读半个世纪的辉煌历史坐标",
      readBtn: "点击阅读核心",
      partnerSubtitle: "校企联合机制",
      partnerTitle: "携手国际一流顶级酒店和泛大文旅行业战略盟友",
      establishedLabel: "创立于 1972 年",
      yoyLabel: "杰雅卡达教育基金会"
    },
    Arab: {
      detailsButton: "تعرف على الأكاديمية عن قرب",
      sambutanDirektur: "كلمة عميد الأكاديمية",
      sambutanHeading: "تأسيس مستقبل مرموق في صناعة الضيافة بما يتماشى مع المستويات العالمية",
      sambutanPara1: "أهلاً ومرحباً بكم في أكاديمية جاكرتا للسياحة (APJ). على مدى أكثر من ٥٠ عاماً (منذ ١٩٧٢)، التزمنا بتقديم تعليم عالي الجودة لرفد قطاع الفندقة والسياحة بالكوادر المؤهلة والمدربة والمتحلية بأعلى قيم الضيافة وسلوك الخدمة الراقي.",
      sambutanPara2: "في ظل التطور الرقمي والذكاء الذي يشهده قطاع الضيافة الحديث، صُممت برامجنا الأكاديمية والعملية لتلبي بكل كفاءة الاحتياجات والمؤهلات الحقيقة المطلوبة للتوظيف في كبرى السلاسل الدولية والمحلية، وذلك بالتركيز على التميز التقني الفني والمهارات الاتصالية السلوكية. يسعدنا أن نرحب بكم في أسرتنا.",
      sambutanCta: "عرض أهدافنا ورسالتنا وخططنا المستقبلية",
      prodiTitle: "البرامج والمسارات الأكاديمية الممتازة (درجة الدبلوم D3)",
      prodiSubtitle: "خيارك الأسمى للمنافسة والتميز محلياً ودولياً",
      prodiDesc: "تأهيل نوعي متميز في مسارين رئيسيين مع توفر هائل لفرص التوظيف المخصصة في سلاسل الفنادق الفاخرة وسفن الملاحة والرحلات الدولية الكبرى.",
      vokasiAcc: "تعليم فني مهني معتمد رسمياً",
      hotelTitle: "إدارة الفنادق والمنتجعات بمسار الضيافة (ثنائي التخصص)",
      hotelDesc: "دراسة شاملة وعميقة لإدارة فروع الفنادق والمنتجعات العالمية، تشتمل على قسم الأغذية والمشروبات (المطبخ المهني، المخبوزات والحلويات، الكوكتيلات)، الإشراف الفندقي وإدارة المكاتب الأمامية والمظهر العام.",
      hotelB1: "✔ تدريب وتطبيق مكثف ومباشر لمهارات الطبخ والتقديم داخل المطعم التعليمي والحلوانية",
      hotelB2: "✔ منهج يتطابق بالكامل مع مواصفات وإطار عمل سياحة الآسيان المعترف بها دورياً",
      hotelB3: "✔ شهادات مهارة وكفاءة مهنية صادرة عن هيئة BNSP الوطنية",
      hotelBtn: "تحميل خطة ومنهاج تخصص إدارة الفنادق والمنتجعات بالتفصيل",
      wisataTitle: "تنظيم الرحلات وحجوزات الطيران وعمليات المعارض (الدبلوماسية السياحية)",
      wisataDesc: "يرتكز على تنمية وتأهيل مهارات إعداد خطوط ومسارات الرحلات الإلغائية، بيع وحجوزات تذاكر شركات الطيران من خلال الأنظمة الخاصة، مع برامج تنظيم المعارض والقمم والمؤتمرات الكبرى بأسلوب حديث.",
      wisataB1: "✔ محاكاة عملية مستمرة لأنظمة حجز تذاكر الطيران وتجارة السفر (سابر وأماديوس)",
      wisataB2: "✔ ترخيص ومستندات موثقة لمزاولة مهنة مرشد سياحي ومنسق رحلات معتمد من BNSP",
      wisataB3: "✔ مختبر محاكاة تأسيس المشاريع وتنظيم الفعاليات السياحة الفاخرة",
      wisataBtn: "تحميل خطة ومنهاج تخصص تنظيم برامج الطيران والسياحة بالتفصيل",
      newsSubtitle: "أخبار الكلية والتغطية الصحفية الحالية",
      newsTitle: "شواهد النجاح والتفوق الأكاديمي لطلابنا وأعضاء الكلية",
      newsCta: "استعراض المراحل التاريخية الفضية للأكاديمية",
      readBtn: "قراءة النص الكامل للخبر",
      partnerSubtitle: "الشركات والاتفاقيات الدولية للتدريب والتوظيف",
      partnerTitle: "شراكة متميزة ومستدامة مع السلاسل السكنية الفائزة بجوائز الفندقة وأعرق الهيئات",
      establishedLabel: "تأسست في عام ١٩٧٢",
      yoyLabel: "مؤسسة جاياكارتا التعليمية"
    },
    Jerman: {
      detailsButton: "Lernen Sie APJ besser kennen",
      sambutanDirektur: "Schulleiter's Begrüßung",
      sambutanHeading: "Aufbau einer erfolgreichen Karriere in der Hospitality-Branche nach globalen Bildungsmaßstäben",
      sambutanPara1: "Willkommen an der Tourismusakademie Jakarta (APJ). Seit mehr als 50 Jahren (seit 1972) setzen wir uns unermüdlich als wegweisende private Berufshochschule in Ost-Jakarta dafür ein, fähige, handlungskompetente und kundenorientierte Fachkräfte mit exzellentem Auftreten auszubilden.",
      sambutanPara2: "Dank der schnellen Digitalisierung entwickeln sich Hotellerie und Reisemanagement rasant fort. Unser interdisziplinäres Praxisprogramm trainiert gezielt Hard-Skills (Technisches Fachwissen) als auch Soft-Skills (Kundenansprache, emotionale Intelligenz). Beginnen Sie Ihre Zukunft mit uns!",
      sambutanCta: "Erfahren Sie mehr über unsere Vision, Mission und Strategien",
      prodiTitle: "Herausragende Studiengänge (Praxisdiplom D3)",
      prodiSubtitle: "Ihre Entscheidung für Spitzenkarrieren auf Weltebene",
      prodiDesc: "Zwei gezielte Spezialisierungen mit besten Vermittlungsquoten in erstklassige Beschäftigung im In- und Ausland sowie auf First-Class-Kreuzfahrtschiffen.",
      vokasiAcc: "D3 DIPLOM • STAATLICH AKKREDITIERT",
      hotelTitle: "D3 Hotel Management & Gastgewerbe (5-Sterne Standard)",
      hotelDesc: "Ausbildung in jedem Zweig der 5-Sterne-Hotellerie. Umfasst Service und Küche (Kulinarik, Konditorei, innovative Menügestaltung, Baristas), Zimmerverwaltung (Rezeption, Housekeeping, VIP-Gästebetreuung) sowie Veranstaltungsplanung (Banquetting).",
      hotelB1: "✔ Umfassendes Praxis-Training in professionell ausgestatteten Schulungsküchen",
      hotelB2: "✔ Lehrplan orientiert sich streng am ASEAN Hospitality Curriculum Standard",
      hotelB3: "✔ Offizielle Zertifikatszertifikate und Lizenzen der Nationalen Agentur BNSP",
      hotelBtn: "Studienplan & Lehrplandetails Hotel Management einsehen",
      wisataTitle: "D3 Tourismus, Eventmanagement & Transportwirtschaft",
      wisataDesc: "Ausbildung für gehobenes Travelplannung, digitale Systeme, Reiseveranstalter, Visum- und Zollpraxis sowie Konferenz- und Ausstellungsleitung auf globalem Parkett (MICE).",
      wisataB1: "✔ Reale PC-Praxis der Buchungssysteme Sabre und Amadeus",
      wisataB2: "✔ Staatliche Guide- und Expedientenlizenzen nach BNSP-Muster",
      wisataB3: "✔ Live-Simulationen exklusiver Events der Eventbranche",
      wisataBtn: "Studienplan & Lehrplandetails Tourismus einsehen",
      newsSubtitle: "Fachnachrichten & Universitätsberichte",
      newsTitle: "Aktuelle Erfolge des Campus",
      newsCta: "Betrachten Sie die Meilensteine unserer Geschichte",
      readBtn: "Sämtliche Einzelheiten aufrufen",
      partnerSubtitle: "ZERTIFIZIERTE KOMETENZ-KOMPANIONS",
      partnerTitle: "Erstklassige Partnerschaften mit Hotelkonzernen & Reiseveranstaltern",
      establishedLabel: "Gegründet 1972",
      yoyLabel: "Jayakarta Educational Foundation"
    },
    Turki: {
      detailsButton: "APJ'yi Daha Yakından Tanıyın",
      sambutanDirektur: "Akademi Rektörü'nün Mesajı",
      sambutanHeading: "Küresel Standartlarda Konaklama ve Turizm Sektöründe Parlak Bir Gelecek İnşa Etmek",
      sambutanPara1: "Cakarta Turizm Akademisi'ne (APJ) hoş geldiniz. 1972'den bu yana 50 yılı aşkın süredir, Doğu Cakarta'da üstün yetenekli, misafirperver, nitelikli turizm yöneticileri yetiştiren köklü bir özel mesleki yükseköğretim kurumu olarak gururla hizmet veriyoruz.",
      sambutanPara2: "Dijitalleşme sonrası otelcilik ve turizm iş dünyası hızla evriliyor. Bu doğrultuda hazırlanan güncel ve yenilikçi eğitim derslerimiz sayesinde, öğrencilerimize sadece teknik operasyonel becerileri (sert sertifikalar) değil, aynı zamanda üst düzey kurumsal misafir iletişimi (yumuşak pratikler) de kazandırıyoruz.",
      sambutanCta: "Vizyon, Misyon ve Stratejik Planlarımızı Keşfedin",
      prodiTitle: "Öncü Eğitim Programları (D3 Ön Lisans)",
      prodiSubtitle: "Uluslararası Kariyer İçin En Doğru Başlangıç",
      prodiDesc: "Lüks otel zincirleri, uluslararası gemi seyahati firmaları ve küresel acentelerde doğrudan istihdam imkânı sunan uzmanlık alanları.",
      vokasiAcc: "D3 VOKAL • YÜKSEK DEVLET ONAYLI",
      hotelTitle: "D3 Otel Yönetimi ve Turizm İşletmeciliği",
      hotelDesc: "Beş yıldızlı otellerin operasyon ve yönetim mekanizmasını detaylıca inceleyin. Yiyecek ve İçecek Bölümü (Mutfak Sanatları, Pastacılık, Bar), Oda Hizmetleri Bölümü (Resepsiyon, Kat Hizmetleri, VIP Hizmetler) ve ziyafet yönetimi dahildir.",
      hotelB1: "✔ Profesyonel tasarımlı endüstriyel mutfaklarda birebir yemek üretim uygulamaları",
      hotelB2: "✔ ASEAN Turizm Kalifikasyon Standartlarına bütünüyle uyumlu ders planları",
      hotelB3: "✔ Resmi Ulusal Komisyon (BNSP) Onaylı Mesleki Yeterlilik sertifikasyonu",
      hotelBtn: "Müfredat ve Otel Yönetimi Ders Planı Detayları",
      wisataTitle: "D3 Turizm Planlama ve Acente İşletmeciliği",
      wisataDesc: "Kapsamlı seyahat düzenleme, dijital bilet ve rezervasyon terminali araçları (Sabre-Amadeus terminal), özel yabancı evrak uygulamaları, uluslararası kongre ve konferans idaresi konularını işler.",
      wisataB1: "✔ Canlı havayolu rezervasyon altyapı terminallerinde uygulamalı çalışmalar",
      wisataB2: "✔ BNSP Akreditasyonlu Seyahat Planlayıcısı ve Rehber Yetki Belgesi",
      wisataB3: "✔ Orijinal ölçekli uluslararası kurumsal kongre (MICE) simülasyonları",
      wisataBtn: "Müfredat ve Turizm Planlama Ders Planı Detayları",
      newsSubtitle: "Kampüsten Gelişmeler & Bilimsel Haberler",
      newsTitle: "Öğrencilerimizin Kazandığı Ulusal Ödüller ve Akademik Başarılar",
      newsCta: "Tarihi Dönüm Noktalarımızı İnceleyin",
      readBtn: "Detayları Oku",
      partnerSubtitle: "SANAYİ DESTEKLİ İŞBİRLİKLERİ",
      partnerTitle: "Beş Yıldızlı Dünya Markası Oteller ve Lider Turizm Şirketleri ile Ortaklık",
      establishedLabel: "Eski Kuruluş 1972",
      yoyLabel: "Jayakarta Eğitim Vakfı"
    },
    Korea: {
      detailsButton: "APJ 대학에 대해 자세히 알아보기",
      sambutanDirektur: "아카데미 총장 인사말",
      sambutanHeading: "글로벌 표준에 걸맞춘 명품 호텔 관광 전문가 육성의 산실",
      sambutanPara1: "자카르타 관광아카데미(APJ)에 오신 것을 진심으로 환영합니다. 지난 반세기(1972년 설립) 동안 저희 전문대학은 자카르타 동부 지역의 문도형 직업 학교 리더로서 풍부한 인성 교육과 기술 훈련을 조화롭게 이끌어왔습니다.",
      sambutanPara2: "최첨단 정보화 시대를 마주하여 학사 과정은 5성급 호텔 체인, 복합 MICE 산업의 요구 사항에 딱 알맞게 고안되었습니다. 단순히 행정적 테크닉(Hard Skills)을 넘어서 고객 감동을 이끄는 전문 서비스 마인드 구축(Soft Skills)에 집중합니다. 여러분의 찬란한 앞날을 격려합니다.",
      sambutanCta: "대학의 장기적 발전 모형 및 주요 5대 전략 보기",
      prodiTitle: "최우수 추천 전형 (D3 정규 전문학사)",
      prodiSubtitle: "성공적인 글로벌 브랜드 커리어의 확실한 지름길",
      prodiDesc: "국내외 호텔 산업, 대형 다국적 여행 선사 등 취업에 특화되고 가장 유망한 두 가지 핵심 전문 과정 개방.",
      vokasiAcc: "D3 고등 직업 제도 • 대학인증 완료",
      hotelTitle: "D3 호텔 경영 및 복합 객실 서비스 총괄 과정",
      hotelDesc: "특급 호텔의 세부 실무 및 지휘 기법 습득. 식음료 부문(메인 키친실습, 베이커리 조리, 바 음료 기획), 객실 부문(프론트 하드웨어, 전문 가사 및 룸 관리, 버틀러 서비스) 등 실질적 트랙으로 교육.",
      hotelB1: "✔ 프로페셔널 상업 주방 환경인 아카데미 전문 조리실습장 활용 실전 트레이닝",
      hotelB2: "✔ 아세안 가입국 연합 관광 품질 교육 협약 공통 표준 교재 적용",
      hotelB3: "✔ 인도네시아 노동부 공인 국가직업능력평가국(BNSP) 자격시험 지정",
      hotelBtn: "호텔경영학과 상세 커리큘럼 및 일람표 안내",
      wisataTitle: "D3 투어 컨설팅, 항공 발권 및 대형 마이스 전략 과정",
      wisataDesc: "창의적 고부가가치 루트 기획, 민간 항공 발권 관리(Sabre, Amadeus 실습), 외교 출입국 관련 비자 업무 실무, 국제 규모 하이브리드 세미나(MICE) 기획 및 행정 실무 교육.",
      wisataB1: "✔ 글로벌 메이저 GDS 예약 엔진 단말기 시스템 교육 및 라이센스 실전 이수",
      wisataB2: "✔ 국가공인 투어 오거나이저 및 관광 기획 지도사 등급 자격 취득",
      wisataB3: "✔ 자치적 성격의 상업 MICE 아이디어 구상 및 시뮬레이션 추진",
      wisataBtn: "관광비즈니스학과 상세 커리큘럼 및 일람표 안내",
      newsSubtitle: "학내 최근 뉴스보도 및 학술 성과 발표",
      newsTitle: "우수 교육 수상 경력과 공인을 빛낸 APJ 활약상",
      newsCta: "대학의 역사적 마일스톤 변천사 한눈에 보기",
      readBtn: "더 알아보기",
      partnerSubtitle: "우수 취업 및 산학 협약 기업 명단",
      partnerTitle: "다국적 리조트 체인 및 항공 여행 운송 협회 소속 럭셔리 패밀리",
      establishedLabel: "1972년 창립",
      yoyLabel: "자야카르타 교육재단"
    }
  };

  const t = (key: string) => {
    const lang = uiText[currentLang] || uiText["ID"];
    return lang[key] || uiText["ID"][key] || key;
  };

  const staticHighlightsDict: Record<LanguageCode, Array<{ category: string; date: string; title: string; desc: string; image: string }>> = {
    ID: [
      {
        category: "Prestasi Mahasiswa",
        date: "14 Mei 2026",
        title: "APJ Sabet Juara Umum Culinary Cup dan Barista Guild Competition DKI Jakarta 2026",
        desc: "Tim mahasiswa D3 Perhotelan APJ membawa pulang piala utama dalam kategori Classic Cocktail Mixology dan Nusantara Main Course Presentation.",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "Kerjasama Kemitraan",
        date: "28 April 2026",
        title: "Dua Belas Lulusan APJ Diterima Kontrak Kerja di Luxury Hotel Arab Saudi & Dubai",
        desc: "Program penempatan langsung Job Placement Center APJ berhasil menyalurkan alumni ke Ritz-Carlton Jeddah dan JW Marriott Dubai Marina melalui jalur prioritas.",
        image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "Kegiatan Akademik",
        date: "10 April 2026",
        title: "MoU Terbaru APJ dengan Tokyo Hospitality College Jepang",
        desc: "Kerjasama strategis ini memfasilitasi mahasiswa D3 Usaha Perjalanan Wisata dan Perhotelan untuk mengikuti magang bersubsidi magang selama 1 tahun di Tokyo.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500"
      }
    ],
    EN: [
      {
        category: "Student Achievement",
        date: "May 14, 2026",
        title: "APJ Wins Overall Champion in Culinary Cup & Barista Guild DKI Jakarta 2026",
        desc: "Our D3 Hotel Management student delegates bagged top honors in Classic Cocktail Mixology and Nusantara Main Course Presentation.",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "Corporate Partnership",
        date: "April 28, 2026",
        title: "Twelve APJ Graduates Bag Employment Contracts in Luxury Hotels of Saudi Arabia & Dubai",
        desc: "The direct placement program of APJ's Career Center deployed alumni directly to Ritz-Carlton Jeddah and JW Marriott Dubai Marina.",
        image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "Academic Activities",
        date: "April 10, 2026",
        title: "Exclusive MoU Inked Between APJ & Tokyo Hospitality College Japan",
        desc: "This strategic agreement enables D3 Tourism and Hotel Management students to absolute paid internships in metropolitan Tokyo.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500"
      }
    ],
    JPN: [
      {
        category: "学生受賞実績",
        date: "2026年5月14日",
        title: "APJ、25年度首都圏カリナリーカップおよびバリスタギルド大会にて総合優勝",
        desc: "D3ホテル経営科の代表チームが、クラシックカクテル調合法部門、ならびにインドネシア宮廷料理部門で優勝しました。",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "企業・国際連携",
        date: "2026年4月28日",
        title: "APJ卒業生12名、サウジアラビアおよびドバイの超高級5つ星ホテルへの内定発表",
        desc: "本学のキャリア支援部門の紹介枠により、リッツカールトン・ジェッダおよびJWマリオット・ドバイでの正式契約が決定。",
        image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "大学アカデミック活動",
        date: "2026年4月10日",
        title: "日本の東京ホテル専門学校と戦略的二国間教育協定（MoU）を締結",
        desc: "本提携の本格始動に伴い、観光・ホテル科をターゲットとした東京23区区内での1年間の有給インターン制度が解禁されました。",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500"
      }
    ],
    Mandarin: [
      {
        category: "优秀学生风采",
        date: "2026 年 5 月 14 日",
        title: "APJ 勇夺 2026 雅加达国际烹饪金杯赛与咖啡拉花大赛主赛区总冠军",
        desc: "酒店管理专业的精英代表队在经典鸡尾酒调制和印尼风味主菜创意呈现组别中以全场最高分摘得桂冠。",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "校企战略网络",
        date: "2026 年 4 月 28 日",
        title: "十二名优秀毕业生喜获沙特阿拉伯和迪拜顶级奢华酒店全职录用合同",
        desc: "得益于雅加达校友就业保障特约推荐机制，该批次校友已分批赴吉达丽思卡尔顿和迪拜万豪酒店按计划到岗。",
        image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "教学研讨前沿",
        date: "2026 年 4 月 10 日",
        title: "雅加达旅游学院与日本东京高级款待学院正式签署姊妹校卓越合作备忘录 (MoU)",
        desc: "该校际交换项目可确保旅游和酒店管理专业的二年级优秀学生前往东京知名都市涉外酒店带薪深造一年。",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500"
      }
    ],
    Arab: [
      {
        category: "إنجازات الطلاب",
        date: "١٤ مايو ٢٠٢٦",
        title: "الأكاديمية تكتسح الكأس الكبرى للطهي ومسابقة باريستا جاكرتا ٢٠٢٦",
        desc: "حصد وفد طلاب إدارة الفنادق والمنتجعات المركز الأول في مجالي خلط المشروبات الكلاسيكية وتقديم الأطباق التراثية.",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "التعاون والشراكات",
        date: "٢٨ أبريل ٢٠٢٦",
        title: "توظيف اثني عشر خريجاً من الأكاديمية في فنادق فاخرة بجدة ودبي",
        desc: "بشكل موجه وتكاملي، نجح مركز التوظيف في تسهيل عقود العمل الرسمية للخريجين في فندق ريتز كارلتون جدة وجي دبليو ماريوت دبي.",
        image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "الأنشطة الأكاديمية",
        date: "١٠ أبريل ٢٠٢٦",
        title: "توقيع اتفاقية تعاون أكاديمي وتدريبي جديدة مع كلية طوكيو للضيافة باليابان",
        desc: "تمكن هذه الاتفاقية طلاب السياحة وإدارة الفنادق من الانضمام لبرنامج التدريب المدفوع بالكامل في العاصمة طوكيو لمدة عام.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500"
      }
    ],
    Jerman: [
      {
        category: "Studentische Erfolge",
        date: "14. Mai 2026",
        title: "APJ gewinnt den Gesamtsieg beim Culinary Cup und der Barista Guild DKI Jakarta 2026",
        desc: "Unser Team aus dem Studiengang Hotelmanagement belegte Spitzenplätze in Classic Mixology und Modern Indonesian Menüpräsentation.",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "Unternehmenskooperation",
        date: "28. April 2026",
        title: "Zwölf APJ-Absolventen erhalten Verträge in 5-Sterne-Luxushotels in Saudi-Arabien & Dubai",
        desc: "Durch das bevorzugte Vermittlungsverfahren unseres Jobcenters unterschrieben Absolventen Arbeitsverträge für das Ritz-Carlton Jeddah und JW Marriott Dubai.",
        image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "Akademische Aktivitäten",
        date: "10. April 2026",
        title: "Kooperationsvertrag zwischen APJ und der renommierten Tokyo Hospitality College unterzeichnet",
        desc: "Das Austauschprogramm ermöglicht Studenten aus Hotel- und Tourismuszweigen ein einjähriges, voll vergütetes Praxisjahr im Großraum Tokio.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500"
      }
    ],
    Turki: [
      {
        category: "Öğrenci Başarıları",
        date: "14 Mayıs 2026",
        title: "APJ, 2026 Cakarta Kuliner Kupası ve Barista Guild Yarışmalarında Şampiyon Oldu",
        desc: "Otelcilik Bölümü öğrencilerimiz, Klasik Kokteyl Karışımı ve Nusantara Ana Yemek Sunumu kulvarlarında birincilik kupalarını evine getirdi.",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "Endüstriyel Ortaklık",
        date: "28 Nisan 2026",
        title: "12 Mezunumuz Suudi Arabistan ve Dubai'deki Lüks Otellerde İşe Başlıyor",
        desc: "Kariyer Merkezimizin doğrudan istihdam ağı ile mezunlarımız Ritz-Carlton Jeddah ve JW Marriott Dubai Marina kadrolarına katıldı.",
        image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "Akademik Faaliyetler",
        date: "10 Nisan 2026",
        title: "APJ ile Japonya Tokyo Otelcilik ve Hizmet Akademisi Arasında Eğitim Protokolü Kapsamı",
        desc: "Bu stratejik mutabakat, turizm ve konaklama bölümü öğrencilerimize Tokyo metropolünde 1 yıl süreli maaşlı staj hakkı sağlamaktadır.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500"
      }
    ],
    Korea: [
      {
        category: "재학생 수상 소식",
        date: "2026년 5月 14日",
        title: "APJ 아카데미, 2026 자카르타 바리스타 협회 및 요리 장인 구프 대선 대회 석권",
        desc: "호텔경영학과 파견 팀이 시그니처 칵테일 제조 믹솔로지 분야와 왕실 코스요리 테이블 세팅 부문 대상 수상 쾌거.",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "글로벌 산학 결연",
        date: "2026년 4月 28日",
        title: "졸업 동문 12명 사우디아라비아 제다 및 두바이 마리나 특급 호텔 해외 파견 확정",
        desc: "산학일체형 일자리 지원 연계망 전략을 통해 리츠칼튼 제다 지점 및 JW 메리어트 두바이 소속 정규 발령 발탁.",
        image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500"
      },
      {
        category: "학술 연구 교류",
        date: "2026년 4月 10日",
        title: "일본 도쿄 호스피탈리티 전문 서비스 대학간 학점 선 상호 인정 교류 활성화",
        desc: "본 MOU 개정을 통해 자율 등록 관광학과 학생들은 매년 일본 도쿄 내 브랜드 사업장에서 한화 환산 연봉을 보장받는 인턴십 가능.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500"
      }
    ]
  };

  const defaultHighlights = staticHighlightsDict[currentLang] || staticHighlightsDict["ID"];
  const [highlights, setHighlights] = useState<any[]>(defaultHighlights);

  // Pagination / Paging Settings
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(6);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset page when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const resolvedItemsPerPage = itemsPerPage === "All" ? highlights.length : itemsPerPage;
  const totalPages = Math.ceil(highlights.length / (typeof resolvedItemsPerPage === "number" ? resolvedItemsPerPage : highlights.length)) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * (typeof resolvedItemsPerPage === "number" ? resolvedItemsPerPage : highlights.length);
  const visibleHighlights = highlights.slice(startIndex, startIndex + (typeof resolvedItemsPerPage === "number" ? resolvedItemsPerPage : highlights.length));

  useEffect(() => {
    // Sync current lang fallback
    setHighlights(staticHighlightsDict[currentLang] || staticHighlightsDict["ID"]);
    
    async function loadHighlights() {
      try {
        const liveAnnouncements = await getAnnouncements();
        if (liveAnnouncements && liveAnnouncements.length > 0) {
          // If live items exist, update them. We could localize titles if desired, 
          // but defaults will be the beautifully translated static items in high fidelity.
          setHighlights(liveAnnouncements);
        }
      } catch (err) {
        console.warn("Could not find dynamic announcements, falling back to cached highlights:", err);
      }
    }
    loadHighlights();
  }, [currentLang]);

  return (
    <div className="w-full">
      {/* Hero Header Carousel Section */}
      <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden bg-primary">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `linear-gradient(to right, rgba(0, 40, 90, 0.9) 30%, rgba(0, 40, 90, 0.4) 100%), url(${slideBgs[index]})` }}
              ></div>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-12 text-white">
                  <div className="max-w-2xl space-y-4 md:space-y-6">
                    <span className="inline-block bg-accent/20 border-l-4 border-accent text-accent font-semibold text-xs md:text-sm tracking-wide uppercase px-3 py-1.5 rounded-sm">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-sm font-heading select-none">
                      {slide.title}
                    </h1>
                    <p className="text-sm md:text-md text-neutral-200 font-medium leading-relaxed drop-shadow-sm select-none">
                      {slide.desc}
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={slideActionRoutes[index]}
                        className="bg-accent hover:bg-yellow-400 text-primary font-bold text-xs md:text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                        id={`hero-cta-primary-${index}`}
                      >
                        {slide.ctaText}
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => onNavigate("profil", "sejarah")}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs md:text-sm px-5 py-3 rounded-lg transition duration-200 cursor-pointer"
                        id={`hero-cta-secondary-${index}`}
                      >
                        {t("detailsButton")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                index === currentSlide ? "bg-accent scale-125 w-8" : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Slide ${index + 1}`}
              id={`slide-ind-${index}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Statistics Section (Structured Quick Facts) */}
      <section className="relative -mt-10 max-w-7xl mx-auto px-6 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentStats.map((stat, idx) => {
            const icons = [
              <Award key="a" className="text-accent" size={28} />,
              <GraduationCap key="g" className="text-accent" size={28} />,
              <Users key="u" className="text-accent" size={28} />,
              <Building2 key="b" className="text-accent" size={28} />
            ];
            return (
              <div key={idx} className="bg-white rounded-xl shadow-xl p-5 border-t-4 border-primary flex items-start gap-4 hover:-translate-y-1 transition duration-300">
                <div className="bg-primary/5 p-3 rounded-lg flex items-center justify-center">
                  {icons[idx]}
                </div>
                <div className="space-y-1">
                  <span className="block text-2xl md:text-3xl font-extrabold text-primary font-heading tracking-tight leading-none">
                    {stat.value}
                  </span>
                  <span className="block text-xs font-bold text-neutral-800 tracking-wide uppercase leading-tight">
                    {stat.label}
                  </span>
                  <span className="block text-slate-500 text-[11px] leading-relaxed">
                    {stat.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Welcome Address from Direktur */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 relative group">
          <div className="absolute inset-0 bg-primary/10 rounded-2xl -rotate-3 group-hover:rotate-0 transition duration-300"></div>
          <div className="absolute -bottom-3 -right-3 w-32 h-32 bg-accent/40 rounded-full blur-2xl z-0"></div>
          <div className="relative bg-[#FFF5E6] rounded-2xl border-2 border-accent p-6 text-center shadow-lg z-10">
            <span className="block text-6xl mb-4">👨‍🏫</span>
            <h3 className="font-bold text-md text-primary leading-tight font-heading">
              Assoc. Prof. Kusmayadi
            </h3>
            <p className="text-[11px] font-bold text-neutral-500 tracking-wider uppercase mt-1">
              {currentLang === "ID" ? "Direktur APJ Jakarta" : "Director of APJ Jakarta"}
            </p>
            <div className="mt-4 pt-4 border-t border-accent/40 flex justify-center gap-5">
              <span className="text-[10px] font-bold text-neutral-600">{t("establishedLabel")}</span>
              <span className="text-[10px] font-bold text-primary">{t("yoyLabel")}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary tracking-widest uppercase">
            <Sparkles size={14} className="text-primary" />
            {t("sambutanDirektur")}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight font-heading">
            {t("sambutanHeading")}
          </h2>
          <div className="w-20 h-1.5 bg-accent rounded"></div>
          <div className="text-xs md:text-sm text-neutral-600 leading-relaxed space-y-3 font-medium">
            <p>&ldquo;{t("sambutanPara1")}&rdquo;</p>
            <p>&ldquo;{t("sambutanPara2")}&rdquo;</p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate("profil", "visimisi")}
              className="inline-flex items-center gap-2 text-primary font-bold text-xs hover:text-blue-800 transition"
              id="direktur-welcome-link"
            >
              {t("sambutanCta")}
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Majors Teaser Section */}
      <section className="bg-[#FFFCEF] py-12 md:py-16 border-y border-accent/20">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-primary tracking-widest uppercase">
              {t("prodiTitle")}
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
              {t("prodiSubtitle")}
            </h2>
            <p className="max-w-xl mx-auto text-xs md:text-sm text-neutral-500 leading-relaxed font-semibold">
              {t("prodiDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* D3 Perhotelan Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden flex flex-col hover:-translate-y-1.5 transition duration-300">
              <div className="h-48 relative">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=500"
                  alt="D3 Perhotelan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-sm">
                  {t("vokasiAcc")}
                </div>
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-black text-[#0050A0] leading-tight font-heading">
                    {t("hotelTitle")}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                    {t("hotelDesc")}
                  </p>
                  <ul className="text-xs text-neutral-600 font-bold space-y-1.5 pl-1 col-span-1 border-l-2 border-accent pl-2.5">
                    <li className="flex items-center gap-2">{t("hotelB1")}</li>
                    <li className="flex items-center gap-2">{t("hotelB2")}</li>
                    <li className="flex items-center gap-2">{t("hotelB3")}</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate("akademik", "d3perhotelan")}
                    className="w-full bg-primary hover:bg-blue-800 text-white font-bold text-xs py-3 rounded-lg shadow transition cursor-pointer flex items-center justify-center gap-2"
                    id="teaser-primary-btn-hotel"
                  >
                    {t("hotelBtn")}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* D3 Usaha Perjalanan Wisata */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden flex flex-col hover:-translate-y-1.5 transition duration-300">
              <div className="h-48 relative">
                <img
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=500"
                  alt="Usaha Perjalanan Wisata"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-sm">
                  {t("vokasiAcc")}
                </div>
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-black text-[#0050A0] leading-tight font-heading">
                    {t("wisataTitle")}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                    {t("wisataDesc")}
                  </p>
                  <ul className="text-xs text-neutral-600 font-bold space-y-1.5 pl-1 border-l-2 border-accent pl-2.5">
                    <li className="flex items-center gap-2">{t("wisataB1")}</li>
                    <li className="flex items-center gap-2">{t("wisataB2")}</li>
                    <li className="flex items-center gap-2">{t("wisataB3")}</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate("akademik", "d3wisata")}
                    className="w-full bg-primary hover:bg-blue-800 text-white font-bold text-xs py-3 rounded-lg shadow transition cursor-pointer flex items-center justify-center gap-2"
                    id="teaser-primary-btn-tourism"
                  >
                    {t("wisataBtn")}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Gallery Section */}
      <CampusGallery currentLang={currentLang} />

      {/* Campus Interactive Map Section */}
      <CampusMap currentLang={currentLang} />

      {/* Latest News & Events */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 border-b border-neutral-100 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase block">
              {t("newsSubtitle")}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight font-heading">
              {t("newsTitle")}
            </h2>
          </div>
          <button
            onClick={() => onNavigate("profil", "sejarah")}
            className="text-primary hover:text-blue-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            id="view-all-news-btn"
          >
            {t("newsCta")}
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleHighlights.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelectArticle(item)}
              className="bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden flex flex-col justify-between group cursor-pointer hover:shadow-lg transition animate-fade-in"
            >
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white text-primary text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded shadow-sm">
                    {item.category}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block">{item.date}</span>
                  <h3 className="font-bold text-neutral-900 leading-snug text-sm group-hover:text-primary transition line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-600 leading-relaxed font-medium line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <span className="text-xs font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                  {t("readBtn")} <ChevronRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Paging controls & page numbers navigation as requested */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-6 mt-4 border-t border-neutral-100" id="paging-controls-container">
          {/* Left section: Items count setup buttons */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider block">
              Jumlah Tampil:
            </span>
            <div className="inline-flex overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100/50 p-1 shadow-xs">
              {[3, 6, 9, "All"].map((option) => (
                <button
                  key={option}
                  onClick={() => setItemsPerPage(option as number | "All")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${
                    itemsPerPage === option
                      ? "bg-[#0050A0] text-white shadow-xs"
                      : "text-neutral-600 hover:text-[#0050A0] hover:bg-white/80"
                  }`}
                  id={`paging-size-btn-${option}`}
                >
                  {option === "All" ? "Semua" : option}
                </button>
              ))}
            </div>
          </div>

          {/* Right section: Numeric Page Buttons with Next/Prev icons */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className={`p-2 rounded-xl border transition ${
                  safeCurrentPage === 1
                    ? "border-neutral-100 text-neutral-300 bg-neutral-50/50 cursor-not-allowed"
                    : "border-neutral-200 text-neutral-600 hover:border-[#0050A0] hover:text-[#0050A0] bg-white cursor-pointer"
                }`}
                title="Sebelumnya"
                id="paging-prev-btn"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5 px-0.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                      pg === safeCurrentPage
                        ? "bg-[#0050A0] text-white font-black shadow-xs"
                        : "border border-neutral-205 text-neutral-600 bg-white hover:border-[#0050A0] hover:text-[#0050A0]"
                    }`}
                    id={`paging-page-btn-${pg}`}
                  >
                    {pg}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className={`p-2 rounded-xl border transition ${
                  safeCurrentPage === totalPages
                    ? "border-neutral-100 text-neutral-300 bg-neutral-50/50 cursor-not-allowed"
                    : "border-neutral-200 text-neutral-600 hover:border-[#0050A0] hover:text-[#0050A0] bg-white cursor-pointer"
                }`}
                title="Berikutnya"
                id="paging-next-btn"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Partnership Networks Grid */}
      <section className="bg-neutral-50 py-12 md:py-16 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
              {t("partnerSubtitle")}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-[#0050A0] font-heading px-4">
              {t("partnerTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-75">
            <div className="h-12 bg-white rounded-lg p-3 w-full shadow-sm flex items-center justify-center font-bold text-xs text-neutral-400 border border-neutral-100">
              THE RITZ-CARLTON
            </div>
            <div className="h-12 bg-white rounded-lg p-3 w-full shadow-sm flex items-center justify-center font-bold text-xs text-neutral-400 border border-neutral-100">
              JW MARRIOTT
            </div>
            <div className="h-12 bg-white rounded-lg p-3 w-full shadow-sm flex items-center justify-center font-bold text-xs text-neutral-400 border border-neutral-100">
              GRAND HYATT
            </div>
            <div className="h-12 bg-white rounded-lg p-3 w-full shadow-sm flex items-center justify-center font-bold text-xs text-neutral-400 border border-neutral-100">
              FAIRMONT HOTELS
            </div>
            <div className="h-12 bg-white rounded-lg p-3 w-full shadow-sm flex items-center justify-center font-bold text-xs text-neutral-400 border border-neutral-100">
              GARUDA INDONESIA
            </div>
            <div className="h-12 bg-white rounded-lg p-3 w-full shadow-sm flex items-center justify-center font-bold text-xs text-neutral-400 border border-neutral-100">
              PANORAMA TOUR
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
