import React, { useState, useMemo } from "react";
import { 
  Map, 
  Layers, 
  Search, 
  Sparkles, 
  Info, 
  X, 
  Compass, 
  Building2, 
  Coffee, 
  Utensils, 
  BookOpen, 
  Plane, 
  Users, 
  Check, 
  Maximize2,
  ChevronRight,
  Monitor,
  Tv,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LanguageCode } from "../lib/translations";

interface CampusMapProps {
  currentLang: LanguageCode;
}

type FloorId = "ground" | "second" | "third";
type ViewMode = "schematic" | "isometric";

interface Hotspot {
  id: string;
  floor: FloorId;
  coords: { x: number; y: number }; // percentage coords (0-100)
  icon: any;
  category: "hospitality" | "culinary" | "tourism" | "common";
  image: string;
  gallery: string[];
  titles: Record<LanguageCode, string>;
  descs: Record<LanguageCode, string>;
  equipments: Record<LanguageCode, string[]>;
  capacity: string;
}

export default function CampusMap({ currentLang }: CampusMapProps) {
  const [activeFloor, setActiveFloor] = useState<FloorId>("ground");
  const [viewMode, setViewMode] = useState<ViewMode>("schematic");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<Hotspot | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "equipments" | "simulation">("details");
  
  // Interactive Simulation Mini-Game State
  const [simStep, setSimStep] = useState(0);
  const [simCompleted, setSimCompleted] = useState(false);
  const [simAnswers, setSimAnswers] = useState<string[]>([]);

  // Detailed Hotspots Data (Fully translated across all 8 languages)
  const hotspots: Hotspot[] = useMemo(() => [
    {
      id: "frontoffice",
      floor: "ground",
      coords: { x: 32, y: 48 },
      icon: Building2,
      category: "hospitality",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600"
      ],
      titles: {
        ID: "Lobi & Simulator Front Office",
        EN: "Lobby & Front Office Simulator",
        JPN: "ロビー＆フロントオフィス実習室",
        Mandarin: "大堂与前厅接待模拟中心",
        Arab: "محاكاة الاستقبال والمكاتب الأمامية",
        Jerman: "Lobby & Rezeption Simulator",
        Turki: "Lobi & Ön Ofis Simülatörü",
        Korea: "로비 및 프론트 오피스 실습장"
      },
      descs: {
        ID: "Ruang simulasi berstandar bintang 5 untuk melatih keterampilan operasional Front Office, reservasi, dan manajemen hubungan tamu (guest relations) menggunakan sistem PMS terkini.",
        EN: "A 5-star standard simulation suite designed to train front office operations, guest reservations, and customer relationship management using modern Property Management Systems.",
        JPN: "5つ星ホテル基準のレセプション空間。最新のホテル管理システム（PMS）を使い、チェックインから予約管理、VIP対応までの実務を体得します。",
        Mandarin: "五星级标准的模拟大堂，训练学生熟练使用主流物业管理系统（PMS）进行入住登记、预订管理及高端客诉处理技巧。",
        Arab: "جناح محاكاة متكامل بمعايير 5 نجوم لتدريب الطلاب على عمليات المكاتب الأمامية وحجز الغرف وإدارة علاقات العملاء باستخدام الأنظمة الحديثة.",
        Jerman: "Ein 5-Sterne-Simulationsbereich für das Training von Rezeptionsabläufen, Buchungssystemen und Gästebetreuung mit moderner PMS-Software.",
        Turki: "Modern Mülk Yönetim Sistemleri (PMS) kullanarak ön ofis operasyonları, rezervasyonlar ve müşteri ilişkileri yönetimini eğitmek için tasarlanmış 5 yıldızlı simülasyon odası.",
        Korea: "5성급 호텔 수준의 리셉션 실습장으로, 실제 호텔 전산 시스템(PMS)을 활용한 객실 예약, 체크인/아웃, 컨시어지 서비스를 철저히 배웁니다."
      },
      equipments: {
        ID: ["Sistem PMS Perhotelan Real-time", "Meja Resepsionis Marmer Mewah", "Mesin EDC & Pembayaran Kartu", "Papan Kunci Hotel & Keycard Encoder", "Katalog Guest Information & Map"],
        EN: ["Real-time Hotel PMS Software", "Luxury Marble Reception Counter", "Card EDC Payment Terminals", "Hotel Keycard Encoder & Rack", "Guest Information Catalog & Map"],
        JPN: ["リアルタイムホテル管理ソフト(PMS)", "豪華大理石レセプションカウンター", "決済用EDC端末装置", "ホテルキーカードエンコーダー＆ラック", "案内インフォメーションカタログ"],
        Mandarin: ["实时酒店物业管理软件 (PMS)", "奢华大理石前台接待台", "刷卡机与支付终端 (EDC)", "房卡读写机与存放架", "住客资讯目录与地图"],
        Arab: ["برنامج إدارة الفنادق المباشر (PMS)", "منصة استقبال فاخرة من الرخام", "أجهزة الدفع الإلكتروني (EDC)", "جهاز برمجة بطاقات الغرف", "كتالوج معلومات وزوار الفندق"],
        Jerman: ["Echtzeit Hotel-PMS-Software", "Luxus-Marmor-Rezeptionstresen", "EDC-Zahlungsterminals", "Zimmerschlüssel-Encoder & Rack", "Gästeinformationskatalog & Karte"],
        Turki: ["Gerçek Zamanlı Otel PMS Yazılımı", "Lüks Mermer Resepsiyon Bankosu", "Kartlı Ödeme Terminali (EDC)", "Otel Anahtar Kart Kodlayıcı", "Konuk Bilgilendirme Kataloğu & Haritası"],
        Korea: ["실시간 호텔 PMS 예약 솔루션", "대리석 리셉션 카운터 데스크", "카드 간편 결제 EDC 단말기", "객실 키카드 인코더 장비", "투숙객 안내 매뉴얼 및 지도"]
      },
      capacity: "25 Students"
    },
    {
      id: "courtyard",
      floor: "ground",
      coords: { x: 74, y: 55 },
      icon: Users,
      category: "common",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600"
      ],
      titles: {
        ID: "Pekarangan Tengah Jayakarta",
        EN: "Jayakarta Central Courtyard",
        JPN: "ジャヤカルタ・中央中庭",
        Mandarin: "杰雅卡达中心绿地庭院",
        Arab: "ساحة جاياكارتا المركزية",
        Jerman: "Jayakarta Innenhof",
        Turki: "Jayakarta Merkez Avlusu",
        Korea: "자야카르타 중앙 대정원"
      },
      descs: {
        ID: "Area terbuka hijau yang asri sebagai pusat kegiatan luar ruangan mahasiswa, pameran kuliner, pertunjukan budaya, dan tempat berkumpul santai antar sesi perkuliahan.",
        EN: "A vibrant outdoor green space serving as the hub for extracurricular club (UKM) activities, outdoor catering exhibitions, cultural events, and social relaxation.",
        JPN: "キャンパス中央の緑豊かなオープンスペース。学生の部活動（UKM）、フードフェス、各種屋外イベント、そして休み時間の憩いの場として親しまれています。",
        Mandarin: "生机勃勃的户外绿化区域，是学生活动社团、户外配餐实践、文化演出及课间休憩交流的核心社交中心。",
        Arab: "مساحة خضراء نابضة بالحياة تستخدم للأنشطة الطلابية، ومعارض الطهي الخارجية، والفعاليات الثقافية، والاسترخاء بين المحاضرات.",
        Jerman: "Ein lebendiger grüner Außenbereich, der als Treffpunkt für Studentenclubs, Catering-Ausstellungen, kulturelle Events und Freizeit dient.",
        Turki: "Öğrenci kulübü faaliyetleri, açık hava yemek sergileri, kültürel etkinlikler ve sosyal dinlenme için kullanılan canlı yeşil açık alan.",
        Korea: "교내 동아리 문화 행사, 야외 푸드 엑스포, 예술 공연 등 활발한 소통이 이뤄지는 쾌적한 야외 자연 친화 쉼터입니다."
      },
      equipments: {
        ID: ["Amfiteater Terbuka Mini", "Kursi & Meja Taman Kayu Jati", "Area Panggung Portable", "Sistem Pencahayaan Taman LED", "Akses Wi-Fi Kecepatan Tinggi"],
        EN: ["Mini Outdoor Amphitheater", "Teak Wood Garden Benches", "Portable Stage Riser", "LED Garden Ambient Lighting", "High-speed Campus Wi-Fi Access"],
        JPN: ["ミニ屋外アムフィシアター", "チーク材の木製ガーデンベンチ", "移動式ステージユニット", "LED景観照明システム", "超高速キャンパスWi-Fi接続"],
        Mandarin: ["小型露天剧场", "柚木防雨园林桌椅", "便携式组合舞台", "LED景观亮化照明", "校园高速无线 Wi-Fi 覆盖"],
        Arab: ["مدرج خارجي صغير", "مقاعد خشبية فاخرة للحديقة", "منصة مسرح قابلة للنقل", "نظام إضاءة LED للحديقة", "شبكة واي فاي عالية السرعة"],
        Jerman: ["Mini-Open-Air-Amphitheater", "Gartenbänke aus Teakholz", "Mobile Bühnenelemente", "LED-Gartenbeleuchtung", "Highspeed-Campus-WLAN"],
        Turki: ["Mini Açık Hava Amfitiyatrosu", "Teka Ağacı Bahçe Bankları", "Taşınabilir Sahne Platformu", "LED Bahçe Aydınlatma Sistemi", "Yüksek Hızlı Kampüs Wi-Fi Erişimi"],
        Korea: ["야외 소형 원형 스탠드", "티크 원목 정원 벤치 세트", "이동식 가설 무대 장치", "친환경 LED 조명 조경 설비", "초고속 캠퍼스 전용 Wi-Fi"]
      },
      capacity: "150 People"
    },
    {
      id: "culinarylab",
      floor: "second",
      coords: { x: 28, y: 38 },
      icon: Utensils,
      category: "culinary",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1595272572257-451742a46137?auto=format&fit=crop&q=80&w=600"
      ],
      titles: {
        ID: "Dapur Utama & Kuliner Nusantara",
        EN: "Main Culinary & Nusantara Kitchen",
        JPN: "メイン調理＆インドネシア伝統料理実習室",
        Mandarin: "主烹饪实训室与印尼传统美馔研发中心",
        Arab: "مطبخ الطهي الرئيسي والأكلات المحلية",
        Jerman: "Hauptküche & Nusantara Culinary Lab",
        Turki: "Ana Gastronomi & Nusantara Mutfağı Laboratuvarı",
        Korea: "메인 조리 실습실 및 아시안 요리 연구소"
      },
      descs: {
        ID: "Laboratorium dapur komersial berskala industri. Mahasiswa berlatih teknik pisau profesional, metode memasak dasar dan lanjutan, masakan Nusantara, serta hidangan internasional.",
        EN: "An industrial-scale commercial hot kitchen. Students practice professional knife skills, advanced cooking techniques, traditional Nusantara cuisine, and international gastromony.",
        JPN: "最先端の業務用熱調理設備。プロ仕様のナイフワークから、煮る・焼く・蒸す等の各種基本技術、本格インドネシア料理、世界各国の西洋料理を極めます。",
        Mandarin: "工业级高规格热厨房实训场地。学生在此苦练刀工、掌握煎炒烹炸等基础与高级火功，深入研习印尼各省传统佳肴及国际高级西餐。",
        Arab: "مطبخ ساخن تجاري بمقاييس صناعية، يتدرب فيه الطلاب على مهارات السكاكين، وتقنيات الطهي المتقدمة، وتحضير الأطباق المحلية والعالمية.",
        Jerman: "Eine Großküche im Industriemaßstab. Studenten trainieren professionelle Messerführung, grundlegende und fortgeschrittene Kochtechniken sowie lokale und internationale Gerichte.",
        Turki: "Endüstriyel ölçekli ticari sıcak mutfak. Öğrenciler profesyonel bıçak becerileri, ileri düzey pişirme teknikleri, geleneksel Nusantara mutfağı ve uluslararası gastronomi uygulamaları yaparlar.",
        Korea: "대형 호텔 상업용 규격의 메인 키친입니다. 식재료 전처리, 전문 칼 다루기 기술, 정통 인도네시아 왕실 요리 및 하이엔드 양식 조리법을 통달합니다."
      },
      equipments: {
        ID: ["Kompor High-Pressure Gas Range", "Oven Konveksi Industri", "Blast Chiller & Cold Storage", "Set Pisau Chef Stainless Profesional", "Meja Persiapan Stainless Steel"],
        EN: ["High-Pressure Gas Range Cooker", "Industrial Convection Oven", "Blast Chiller & Cold Storage Rooms", "Professional Stainless Steel Chef Knives", "Heavy-duty Stainless Steel Prep Tables"],
        JPN: ["ハイパワー高圧ガスレンジ", "業務用コンベクションオーブン", "ブラストチラー＆急速冷凍庫", "プロ用ステンレス製ナイフセット", "頑丈なステンレス製作業台"],
        Mandarin: ["高压猛火燃气灶组", "工业级多功能风炉烤箱", "速冻机与不锈钢冷库", "专业高碳钢厨刀套组", "重型不锈钢不沾污操作台"],
        Arab: ["موقد غاز عالي الضغط", "فرن حراري صناعي متكامل", "مبرد سريع وغرف تجميد", "مجموعة سكاكين طهاة فولاذية", "طاولات تجهيز ثقيلة من الفولاذ"],
        Jerman: ["Hochdruck-Gasherde", "Industrieller Konvektionsofen", "Schockfroster & Kühlhäuser", "Professionelle Edelstahl-Kochmesser", "Robuste Edelstahl-Arbeitstische"],
        Turki: ["Yüksek Basınçlı Gazlı Ocak Grubu", "Endüstriyel Konveksiyonlu Fırın", "Hızlı Soğutucu & Soğuk Depo", "Profesyonel Paslanmaz Çelik Şef Bıçakları", "Ağır Hizmet Tipi Paslanmaz Çelik Hazırlık Tezgahları"],
        Korea: ["고화력 가스 레인지 설비", "다기능 상업용 컨벡션 오븐", "급속 냉동 블래스트 칠러", "전문가용 고탄소강 셰프 나이프 세트", "인체공학적 불소수지 스테인리스 가공대"]
      },
      capacity: "30 Students"
    },
    {
      id: "mixologystudio",
      floor: "second",
      coords: { x: 78, y: 42 },
      icon: Coffee,
      category: "culinary",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600"
      ],
      titles: {
        ID: "Studio Mixology & Barista",
        EN: "Barista & Mixology Lab",
        JPN: "バリスタ＆ミクソロジー実習室",
        Mandarin: "咖啡与调酒饮品研发实验室",
        Arab: "مختبر باريستا وعلم المشروبات",
        Jerman: "Barista & Getränkemix-Studio",
        Turki: "Barista & Miksoloji Laboratuvarı",
        Korea: "바리스타 및 식음료 믹솔로지 랩"
      },
      descs: {
        ID: "Fasilitas mutakhir untuk melatih seni penyajian minuman hangat dan dingin. Mahasiswa diajarkan teknik roasting kopi, frothing susu, latte art, serta pembuatan mocktail artisan.",
        EN: "A cutting-edge facility for hot and cold beverage crafting. Students master espresso extraction, milk frothing, latte art, and the preparation of complex artisan mocktails.",
        JPN: "温かい・冷たい飲料の調合・提供技術を学ぶ最新の設備。コーヒーの焙煎、ミルクの泡立て、ラテアート、職人技が光るノンアルコール・モクテルの技術を修得します。",
        Mandarin: "研学冷热饮品调制的尖端设备。学生在此操作精品咖啡烘焙、牛奶打泡、花式咖啡拉花以及研发特调手作无酒精鸡尾酒。",
        Arab: "مرفق متطور لابتكار وتجهيز المشروبات الباردة والساخنة. يتدرب الطلاب على استخلاص إسبريسو، ورسم اللاتيه، وابتكار المشروبات الإبداعية.",
        Jerman: "Eine moderne Einrichtung für die Zubereitung von Heiß- und Kaltgetränken. Studenten erlernen Espresso-Extraktion, Milchaufschäumung, Latte Art und kreative Mocktails.",
        Turki: "Sıcak ve soğuk içecek yapımı için son teknoloji laboratuvar. Öğrenciler espresso ekstraksiyonu, süt köpürtme, latte sanatı ve özel alkolsüz kokteyl hazırlama tekniklerini öğrenirler.",
        Korea: "트렌디한 식음료 제조 및 서비스를 위한 교육 공간입니다. 에스프레소 정밀 추출, 밀크 스팀 폼 메이킹, 라테 아트 및 창작 목테일 레시피를 연구합니다."
      },
      equipments: {
        ID: ["Mesin Espresso Multi-boiler Premium", "Coffee Grinder Conical Burr Elektrik", "Set Shaker & Peralatan Bar", "Blender Komersial Kedap Suara", "Kulkas Penyimpan Bahan Segar"],
        EN: ["Premium Multi-boiler Espresso Machine", "Electric Conical Burr Coffee Grinder", "Professional Cocktail/Mocktail Shaker Sets", "Sound-insulated Commercial Blender", "Fresh Ingredient Counter Fridge"],
        JPN: ["高級マルチボイラーエスプレッソマシン", "電動コニカルコーン式グラインダー", "プロ用カクテル・シェーカーセット", "静音防音型業務用ブレンダー", "生鮮食材用カウンタ冷蔵庫"],
        Mandarin: ["双锅炉全控电调意式咖啡机", "专业级锥磨盘电动磨豆机", "专业调酒雪克壶与吧台工具套包", "静音隔音罩商业级破壁机", "不锈钢工作台冷藏保鲜柜"],
        Arab: ["آلة إسبريسو فاخرة متعددة الغلايات", "مطحنة قهوة كهربائية احترافية", "مجموعات خلط المشروبات وشيكر", "خلاط تجاري عازل للصوت", "ثلاجة لحفظ المكونات الطازجة"],
        Jerman: ["Premium Multi-Boiler-Espressomaschine", "Elektrische Kegelmahlwerk-Kaffeemühle", "Professionelle Cocktail-Shaker-Sets", "Schallgedämmter Standmixer", "Zutaten-Kühlschrank"],
        Turki: ["Premium Çoklu Boylerli Espresso Makinesi", "Elektrikli Konik Dişli Kahve Öğütücü", "Profesyonel Shaker & Bar Ekipmanları Seti", "Ses Yalıtımlı Ticari Blender", "Malzeme Saklama Tipi Tezgah Altı Buzdolabı"],
        Korea: ["최고급 멀티 보일러 에스프레소 머신", "전동식 코니컬 버 커피 그라인더", "프로페셔널 스테인리스 셰이커 툴셋", "저소음 방음 패드 상업용 믹서기", "식자재 및 냉장 테이블 쇼케이스"]
      },
      capacity: "18 Students"
    },
    {
      id: "micelab",
      floor: "third",
      coords: { x: 34, y: 44 },
      icon: Plane,
      category: "tourism",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600"
      ],
      titles: {
        ID: "Laboratorium MICE & Ticketing",
        EN: "MICE & Travel Ticketing Lab",
        JPN: "MICE＆航空チケット予約実習室",
        Mandarin: "MICE 与航空旅游票务实训中心",
        Arab: "مختبر حجز الطيران والسياحة والمؤتمرات",
        Jerman: "MICE & Reisebuchungs-Lab",
        Turki: "MICE & Seyahat Rezervasyon Laboratuvarı",
        Korea: "MICE 및 항공 발권 여행사 실습장"
      },
      descs: {
        ID: "Fasilitas simulasi agen perjalanan dan manajemen MICE. Dilengkapi sistem reservasi penerbangan real-time (GDS Amadeus/Sabre) dan ruang koordinasi event planner.",
        EN: "A high-fidelity travel agency and event planning suite. Features active Global Distribution System (GDS) ticketing platforms (Amadeus and Sabre) alongside designated event management areas.",
        JPN: "旅行会社およびMICE企画の実践施設。実稼働する国際航空予約システム（GDS Amadeus/Sabre）端末を多数設置し、ツアーコンダクターや添乗実務を本格学習します。",
        Mandarin: "高度仿真的旅行社运营与会展策划实训中心。配备国际实时 GDS 航空分销系统（阿玛迪斯 Amadeus 与 沙宾 Sabre）及大型赛事会展项目方案协调区。",
        Arab: "جناح يحاكي مكاتب تنظيم السفر وإدارة الفعاليات والمؤتمرات. يتميز بأنظمة حجز تذاكر الطيران العالمية المباشرة (GDS Amadeus / Sabre).",
        Jerman: "Ein realistischer Reisebüro- und Eventmanagementbereich. Bietet Zugriff auf die GDS-Systeme Amadeus und Sabre zur Flugbuchung.",
        Turki: "Seyahat acentesi ve etkinlik planlama alanı. Etkin Global Dağıtım Sistemi (GDS) biletleme platformlarını (Amadeus ve Sabre) ve özel etkinlik yönetim masalarını içerir.",
        Korea: "여행사 창업 및 국제회의 기획(MICE) 프로세스를 배우는 실무형 실습실입니다. 글로벌 실시간 항공 예약 솔루션(GDS Amadeus/Sabre) 교육을 위주로 진행합니다."
      },
      equipments: {
        ID: ["Komputer Klien GDS Amadeus/Sabre", "Akses Portal Tiket Penerbangan Aktif", "Simulator Ruang Boardroom MICE", "Proyektor Laser Interaktif", "Sistem Tiket GDS Handal"],
        EN: ["Amadeus/Sabre GDS Client Terminals", "Live Flight Ticketing Portal Access", "MICE Executive Boardroom Simulator", "Interactive Laser Short-throw Projector", "Robust Passenger Name Record (PNR) System"],
        JPN: ["Amadeus/Sabre GDS 接続端末群", "リアルタイム発券システムアクセス", "MICE 役員エグゼクティブ会議シミュレータ", "インタラクティブ超短焦点レーザープロジェクター", "PNR予約管理レコードシステム"],
        Mandarin: ["Amadeus/Sabre GDS 航空客运操作端电脑", "实时航空票务出票管理系统接入", "MICE 董事会行政协调会议区", "互动激光超短焦投影仪", "PNR 旅客乘机信息系统操作台"],
        Arab: ["أجهزة حاسوب متصلة بنظام Amadeus/Sabre GDS", "بوابة حجز طيران مباشرة ونشطة", "قاعة اجتماعات ومؤتمرات للمحاكاة", "جهاز عرض تفاعلي ليزر", "نظام إدارة حجوزات الركاب العال"],
        Jerman: ["Amadeus/Sabre GDS Client-Terminals", "Echtzeit-Flugticketing-Portalzugang", "MICE Executive Boardroom Simulator", "Interaktiver Ultrakurzdistanz-Projektor", "Passagier-Buchungssystem (PNR)"],
        Turki: ["Amadeus/Sabre GDS İstemci Terminalleri", "Canlı Uçak Bileti Rezervasyon Sistemi", "MICE Yönetim Kurulu Toplantı Masası", "İnteraktif Lazer Projeksiyon Cihazı", "PNR Yolcu Kayıt ve Biletleme Altyapısı"],
        Korea: ["Amadeus 및 Sabre GDS 발권 터미널 PC", "실시간 항공 발권 시스템 모듈", "MICE 보드룸 기획가 전용 회의실", "인터랙티브 레이저 빔프로젝터", "PNR 여객 운송 정보 조회 관리국"]
      },
      capacity: "24 Students"
    },
    {
      id: "libraryhub",
      floor: "third",
      coords: { x: 70, y: 52 },
      icon: BookOpen,
      category: "common",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=600"
      ],
      titles: {
        ID: "Perpustakaan Digital APJ",
        EN: "APJ Digital Library Hub",
        JPN: "APJ デジタル図書センター",
        Mandarin: "雅加达旅游学院数字化阅览中心",
        Arab: "مكتبة APJ الرقمية التفاعلية",
        Jerman: "APJ Digitale Bibliothek",
        Turki: "APJ Dijital Kütüphane Araştırma Hubı",
        Korea: "APJ 최첨단 디지털 연구 도서관"
      },
      descs: {
        ID: "Ruang literasi modern ber-AC dengan koleksi buku fisik pariwisata yang lengkap, ribuan e-book, akses jurnal ilmiah ProQuest, serta pod belajar mandiri.",
        EN: "A modern, climate-controlled study hub with comprehensive hospitality literature, thousands of specialized e-books, ProQuest scientific journal access, and private study pods.",
        JPN: "エアコン完備の静かな知的探求スペース。ホスピタリティ関連書籍、数千冊のe-book、ProQuest国際学術データベース、個別集中スタディブースを備えています。",
        Mandarin: "全冷气覆盖的高端学习空间。藏有全面深度的酒店与旅游业专业文献，数千册电子书，提供全球知名的 ProQuest 学术期刊数据库及独立式隔音自习舱。",
        Arab: "مركز دراسة حديث ومكيف يحتوي على مؤلفات الضيافة الشاملة، وآلاف الكتب الإلكترونية، والوصول إلى المجلات الأكاديمية العالمية ProQuest، ومقاعد دراسة مستقلة.",
        Jerman: "Eine klimatisierte Bibliothek mit umfangreicher Hotellerieliteratur, Tausenden E-Books, Zugang zu wissenschaftlichen ProQuest-Zeitschriften und Einzellernkabinen.",
        Turki: "Konaklama ve turizm literatürünü içeren, binlerce e-kitap, ProQuest akademik dergilerine erişim ve özel çalışma kabinleri sunan modern, klimalı çalışma ortamı.",
        Korea: "정숙하고 쾌적한 에어컨 가동 학업 지원 센터입니다. 수만 권의 호스피탈리티 전문 도서, 원격 ProQuest 논문 탐색 서비스, 개인 학습 전용 스마트 부스를 보유합니다."
      },
      equipments: {
        ID: ["Komputer Katalog OPAC", "Tablet Pembaca E-Book", "Akses ProQuest & ScienceDirect", "Sofa & Pod Belajar Mandiri", "Sistem Sirkulasi Otomatis"],
        EN: ["OPAC Catalog Terminal PC", "Touchscreen E-Reader Tablets", "ProQuest & ScienceDirect Institutional License", "Ergonomic Study Pods & Sofas", "Automated RFID Book Checkout System"],
        JPN: ["図書OPAC検索専用PC端末", "電子書籍リーダー専用タブレット", "ProQuest/ScienceDirectデータベース接続", "人間工学に基づく学習ブース＆ソファ", "RFID自動書籍貸出返却システム"],
        Mandarin: ["OPAC 图书自助检索一体机", "触控电子书阅读平板", "ProQuest 与 ScienceDirect 全文数据库授权", "符合人体工学的自习舱与舒适沙发", "基于 RFID 技术的自助借还书系统"],
        Arab: ["أجهزة بحث الكتالوج الآلي OPAC", "أجهزة لوحية ذكية لقراءة الكتب الإلكترونية", "اشتراك مؤسسي في ProQuest & ScienceDirect", "مقاعد دراسة مريحة وأرائك", "نظام الاستعارة الذكي القائم على RFID"],
        Jerman: ["OPAC-Katalog-Terminal", "E-Book-Reader-Tablets", "ProQuest & ScienceDirect Hochschullizenzen", "Ergonomische Lernkabinen & Sofas", "Automatisiertes RFID-Buchausleihsystem"],
        Turki: ["OPAC Kitap Katalog Tarama Terminali", "E-Kitap Okuyucu Tabletler", "ProQuest & ScienceDirect Kurumsal Veri Tabanı", "Ergonomik Çalışma Kabinleri & Oturma Grupları", "Otomatik RFID Kitap Ödünç Verme Altyapısı"],
        Korea: ["OPAC 도서 간편 검색용 PC", "태블릿 이북 리더 디바이스", "ProQuest 및 ScienceDirect 라이선스", "스마트 소음 방지 학습 부스 및 소파", "RFID 무인 전산 대출 반납 자동기"]
      },
      capacity: "60 Study Seats"
    }
  ], []);

  // Filtered hotspots based on search
  const filteredHotspots = useMemo(() => {
    return hotspots.filter(spot => {
      if (searchQuery.trim() === "") return spot.floor === activeFloor;
      
      const q = searchQuery.toLowerCase();
      const titleMatch = Object.values(spot.titles).some(t => t.toLowerCase().includes(q));
      const descMatch = Object.values(spot.descs).some(d => d.toLowerCase().includes(q));
      return (titleMatch || descMatch) && spot.floor === activeFloor;
    });
  }, [hotspots, activeFloor, searchQuery]);

  // Handle Hotspot Select
  const handleSelectSpot = (spot: Hotspot) => {
    setSelectedSpot(spot);
    setActiveTab("details");
    setSimStep(0);
    setSimCompleted(false);
    setSimAnswers([]);
  };

  // Autocomplete suggestions based on search
  const suggestions = useMemo(() => {
    if (searchQuery.trim() === "") return [];
    const q = searchQuery.toLowerCase();
    return hotspots.filter(spot => {
      const titleMatch = spot.titles[currentLang].toLowerCase().includes(q);
      return titleMatch;
    }).slice(0, 3);
  }, [hotspots, searchQuery, currentLang]);

  // Multilingual labels for Map UI
  const mapDict: Record<LanguageCode, Record<string, string>> = {
    ID: {
      title: "Peta Kampus Interaktif APJ",
      subtitle: "Eksplorasi Lab Praktik & Fasilitas Akademik",
      desc: "Gunakan peta multi-lantai interaktif ini untuk menjelajahi laboratorium bersertifikasi internasional dan infrastruktur fisik Akademi Pariwisata Jakarta.",
      groundFloor: "Lantai 1 - Ground",
      secondFloor: "Lantai 2 - Kuliner & F&B",
      thirdFloor: "Lantai 3 - Wisata & Perpustakaan",
      searchPlaceholder: "Cari laboratorium atau fasilitas...",
      legendTitle: "Kategori Fasilitas",
      hospitality: "Perhotelan & Front Office",
      culinary: "Seni Kuliner & Barista",
      tourism: "Usaha Perjalanan Wisata",
      common: "Fasilitas Umum & Ruang Terbuka",
      floorText: "Lantai",
      capacityText: "Kapasitas Maksimal",
      equipmentTitle: "Peralatan Simulasi Utama",
      simulationTitle: "Mulai Simulasi Pelatihan",
      activeModeSchematic: "Skema Cetak Biru",
      activeModeIsometric: "Konsep Isometrik 3D",
      noResults: "Fasilitas tidak ditemukan pada lantai ini.",
      clickPrompt: "Ketuk pin berkedip pada peta untuk melihat detail spesifikasi laboratorium.",
      detailTab: "Ikhtisar",
      equipTab: "Daftar Alat",
      simTab: "Simulasi Cepat",
      viewCampusGallery: "Lihat Galeri Foto",
      equipmentIntro: "Peralatan penunjang vokasi berstandar industri kelas dunia:",
      simIntro: "Coba tantangan keputusan operasional di lab ini:",
      resetSim: "Ulangi Simulasi",
      simSucceed: "Hebat! Pilihan Anda menunjukkan pemahaman standar operasional hotel bintang 5 yang luar biasa.",
      simSucceedCulinary: "Luar biasa! Keputusan Anda menunjukkan standar keamanan pangan (HACCP) dan kreativitas kuliner terbaik.",
      simSucceedTourism: "Sempurna! Anda berhasil mengeluarkan tiket dan melayani tamu MICE dengan efisiensi tinggi.",
      nextStep: "Selanjutnya",
      submitAnswers: "Kirim Evaluasi",
    },
    EN: {
      title: "APJ Interactive Campus Map",
      subtitle: "Explore Advanced Training Labs & Academic Spaces",
      desc: "Navigate through our multi-floor interactive map to discover world-class certified hospitality laboratories and student spaces.",
      groundFloor: "Floor 1 - Ground Level",
      secondFloor: "Floor 2 - Culinary & Barista",
      thirdFloor: "Floor 3 - Tourism & Library",
      searchPlaceholder: "Search labs or facilities...",
      legendTitle: "Facility Categories",
      hospitality: "Hospitality & Front Office",
      culinary: "Culinary Arts & Mixology",
      tourism: "Tourism & Travel Business",
      common: "Common Areas & Garden",
      floorText: "Floor",
      capacityText: "Maximum Capacity",
      equipmentTitle: "Key Professional Equipment",
      simulationTitle: "Launch Training Simulation",
      activeModeSchematic: "Blueprint Schematic",
      activeModeIsometric: "3D Isometric Render",
      noResults: "No facilities found on this floor.",
      clickPrompt: "Click any flashing hotspot pin on the map to inspect laboratory details.",
      detailTab: "Overview",
      equipTab: "Equipment",
      simTab: "Quick Sim",
      viewCampusGallery: "View Photo Gallery",
      equipmentIntro: "Professional vocational tools aligned with world-class industry standards:",
      simIntro: "Solve real-life operational challenges for this lab:",
      resetSim: "Restart Simulation",
      simSucceed: "Fantastic! Your choices reflect a strong grasp of 5-star standard hotel operating procedures.",
      simSucceedCulinary: "Excellent! Your decisions align with high-standard food safety (HACCP) and kitchen management.",
      simSucceedTourism: "Perfect! You successfully managed GDS flight booking & MICE guest coordination efficiently.",
      nextStep: "Next Step",
      submitAnswers: "Evaluate Choices",
    },
    JPN: {
      title: "APJ インタラクティブキャンパスマップ",
      subtitle: "最先端実習室＆アカデミック施設の探訪",
      desc: "階層ごとのインテリジェントなマップを使用して、国際認定を取得した各種実習室や学生スペースをご覧いただけます。",
      groundFloor: "1階 - ロビー・オフィス",
      secondFloor: "2階 - 調理・バリスタ",
      thirdFloor: "3階 - 観光ビジネス・図書室",
      searchPlaceholder: "実習設備や施設を検索...",
      legendTitle: "施設カテゴリ",
      hospitality: "ホテル＆フロント実務",
      culinary: "調理芸術＆飲料調整",
      tourism: "旅行観光ビジネス",
      common: "共用スペース＆屋外庭園",
      floorText: "階",
      capacityText: "最大収容人数",
      equipmentTitle: "主要プロ仕様実習機材",
      simulationTitle: "ミニトレーニングシミュレータ",
      activeModeSchematic: "青写真レイアウト",
      activeModeIsometric: "3D立体イメージ",
      noResults: "この階に該当する施設はありません。",
      clickPrompt: "マップ上で点滅するピンをクリックして、各実習室の詳細情報を確認してください。",
      detailTab: "概要",
      equipTab: "実習機材",
      simTab: "お試し体験",
      viewCampusGallery: "フォトギャラリーを見る",
      equipmentIntro: "世界トップクラスの業界基準を満たした、質の高いプロ用実務学習用機材:",
      simIntro: "この実習室で発生する現場の課題を、適切な判断で解決しましょう:",
      resetSim: "もう一度挑戦",
      simSucceed: "素晴らしい！あなたの選択は、5つ星ホテルが求める一級の業務手順を正確に理解しています。",
      simSucceedCulinary: "見事です！食品安全管理基準(HACCP)を遵守し、かつクリエイティブな厨房指揮ができています。",
      simSucceedTourism: "完璧です！予約システムを正確に操作し、会展MICEのお客様をスムーズに案内できました。",
      nextStep: "次へ",
      submitAnswers: "結果を判定する",
    },
    Mandarin: {
      title: "APJ 互动式数字校园地图",
      subtitle: "深度探索高端实训室与学术物理硬件",
      desc: "通过多楼层三维交互地图，深度浏览雅加达旅游学院达到国际高水准的教学实训室及校园多维学习空间。",
      groundFloor: "1楼 - 前厅大堂与行政",
      secondFloor: "2楼 - 烹饪与咖啡吧台",
      thirdFloor: "3楼 - 旅游会展与数字图书馆",
      searchPlaceholder: "搜索实训基地或公共设施...",
      legendTitle: "教学区划分",
      hospitality: "酒店管理与前台接待",
      culinary: "烹饪艺术与特调饮品",
      tourism: "旅游与国际会展项目",
      common: "校园绿化与公共休憩区",
      floorText: "楼层",
      capacityText: "最大容纳量",
      equipmentTitle: "核心高规实训设备",
      simulationTitle: "启动虚拟实操测试",
      activeModeSchematic: "平面布局蓝图",
      activeModeIsometric: "3D 三维概念展示",
      noResults: "在此楼层未找到符合条件的设施。",
      clickPrompt: "轻触地图上高亮闪烁的定位销，即可调阅该实训室的设备配备与特色亮点。",
      detailTab: "教学大纲",
      equipTab: "专业配置",
      simTab: "情景实操",
      viewCampusGallery: "查看实景照片墙",
      equipmentIntro: "符合国际产业标准、对标一线品牌的教学实物设备清单：",
      simIntro: "挑战此实训场景下的真实业务决策：",
      resetSim: "重新测评",
      simSucceed: "棒极了！您的决策表明您对五星级酒店的标准运营程序 (SOP) 有着极其优秀的把握。",
      simSucceedCulinary: "超凡水准！您的决定完全符合严苛的食品安全保障(HACCP)以及现代商业后厨管理思维。",
      simSucceedTourism: "完美通过！您顺利、高效地操作了机票分销预订系统，并完成了 MICE 贵宾的接待协调工作。",
      nextStep: "下一题",
      submitAnswers: "评价答案并分析",
    },
    Arab: {
      title: "خارطة حرم APJ التفاعلية",
      subtitle: "استكشاف مختبرات التدريب والمرافق الأكاديمية",
      desc: "استخدم هذه الخارطة التفاعلية متعددة الطوابق لتصفح مختبرات الضيافة المعتمدة دولياً ومساحات الطلاب.",
      groundFloor: "الطابق الأول - الاستقبال",
      secondFloor: "الطابق الثاني - المطبخ ومعدي القهوة",
      thirdFloor: "الطابق الثالث - السياحة والمكتبة",
      searchPlaceholder: "البحث عن مختبر أو مرفق...",
      legendTitle: "فئات المرافق",
      hospitality: "إدارة الفنادق والاستقبال",
      culinary: "فنون الطهي والمشروبات",
      tourism: "السياحة وإدارة الفعاليات",
      common: "المناطق العامة والحديقة",
      floorText: "طابق",
      capacityText: "السعة القصوى",
      equipmentTitle: "الأجهزة المهنية الرئيسية",
      simulationTitle: "بدء محاكاة التدريب الممتعة",
      activeModeSchematic: "مخطط البصمة الهندسية",
      activeModeIsometric: "رسم ثلاثي الأبعاد 3D",
      noResults: "لم يتم العثور على مرافق في هذا الطابق.",
      clickPrompt: "انقر فوق دبوس الموقع الوامض على الخارطة للاطلاع على تفاصيل المختبر.",
      detailTab: "نظرة عامة",
      equipTab: "المعدات والآلات",
      simTab: "المحاكاة السريعة",
      viewCampusGallery: "عرض معرض الصور",
      equipmentIntro: "أدوات التدريب المهني المتطابقة مع أرقى المعايير الصناعية العالمية:",
      simIntro: "حل تحدي القرارات التشغيلية الواقعية في هذا المختبر:",
      resetSim: "إعادة المحاكاة",
      simSucceed: "رائع! خياراتك تظهر فهماً ممتازاً لإجراءات التشغيل القياسية في الفنادق الفاخرة.",
      simSucceedCulinary: "ممتاز! قراراتك تتوافق تماماً مع أعلى معايير سلامة الأغذية (HACCP) وإدارة المطبخ.",
      simSucceedTourism: "مثالي! لقد تمكنت بنجاح من إدارة حجز الطيران وتنسيق حضور المؤتمر بكفاءة بالغة.",
      nextStep: "التالي",
      submitAnswers: "إرسال التقييم",
    },
    Jerman: {
      title: "Interaktiver APJ Campus-Plan",
      subtitle: "Entdecke moderne Praxislabore & Studienbereiche",
      desc: "Navigieren Sie durch unseren interaktiven Campus-Plan, um erstklassige Hospitality-Labore und Einrichtungen der Jakarta Tourism Academy zu erkunden.",
      groundFloor: "Etage 1 - Rezeption & Foyer",
      secondFloor: "Etage 2 - Gastronomie & Bar",
      thirdFloor: "Etage 3 - Tourismus & Bibliothek",
      searchPlaceholder: "Labor oder Einrichtung suchen...",
      legendTitle: "Kategorien",
      hospitality: "Hotellerie & Front Office",
      culinary: "Kulinarik & Mixologie",
      tourism: "Tourismus & Eventmanagement",
      common: "Gemeinschaftsbereiche",
      floorText: "Etage",
      capacityText: "Maximale Kapazität",
      equipmentTitle: "Professionelle Ausstattung",
      simulationTitle: "Trainingssimulation starten",
      activeModeSchematic: "Konstruktionsplan",
      activeModeIsometric: "3D-Isometrie",
      noResults: "Keine Einrichtungen auf dieser Etage gefunden.",
      clickPrompt: "Klicken Sie auf einen blinkenden Pin, um detaillierte Informationen zu erhalten.",
      detailTab: "Übersicht",
      equipTab: "Ausstattung",
      simTab: "Simulation",
      viewCampusGallery: "Fotogalerie öffnen",
      equipmentIntro: "Professionelle Werkzeuge gemäß weltweiten Industriestandards:",
      simIntro: "Meistern Sie reale betriebliche Herausforderungen:",
      resetSim: "Simulation neu starten",
      simSucceed: "Fantastisch! Ihre Entscheidungen zeigen ein tiefes Verständnis von 5-Sterne-Hotelstandards.",
      simSucceedCulinary: "Hervorragend! Ihre Auswahlen stimmen perfekt mit den Standards für Lebensmittelsicherheit (HACCP) überein.",
      simSucceedTourism: "Perfekt! Sie haben die GDS-Flugbuchung und Event-MICE-Gäste-Koordination fehlerfrei absolviert.",
      nextStep: "Weiter",
      submitAnswers: "Auswertung anzeigen",
    },
    Turki: {
      title: "APJ İnteraktif Kampüs Haritası",
      subtitle: "Uygulama Laboratuvarlarını ve Akademik Tesisleri Keşfedin",
      desc: "Cakarta Turizm Akademisi'nin uluslararası düzeyde onaylanmış eğitim laboratuvarlarını ve sosyal alanlarını çok katlı interaktif haritamızla keşfedin.",
      groundFloor: "1. Kat - Giriş & Ön Ofis",
      secondFloor: "2. Kat - Mutfak & Barista",
      thirdFloor: "3. Kat - Turizm & Kütüphane",
      searchPlaceholder: "Laboratuvar veya tesis ara...",
      legendTitle: "Tesis Kategorileri",
      hospitality: "Otelcilik & Ön Ofis",
      culinary: "Mutfak Sanatları & Miksoloji",
      tourism: "Turizm & Seyahat İşletmeciliği",
      common: "Ortak Alanlar & Bahçe",
      floorText: "Kat",
      capacityText: "Maksimum Kapasite",
      equipmentTitle: "Temel Profesyonel Ekipmanlar",
      simulationTitle: "Uygulamalı Eğitimi Başlat",
      activeModeSchematic: "Mavi Plan Çizimi",
      activeModeIsometric: "3D İzometrik Görünüm",
      noResults: "Bu katta hiçbir tesis bulunamadı.",
      clickPrompt: "Laboratuvar teknik özelliklerini görmek için haritada yanıp sönen konumlara tıklayın.",
      detailTab: "Özet",
      equipTab: "Ekipman",
      simTab: "Pratik Sim",
      viewCampusGallery: "Fotoğraf Galerisini Gör",
      equipmentIntro: "Dünya standartlarında profesyonel mesleki eğitim araç gereçleri:",
      simIntro: "Bu laboratuvardaki gerçek operasyonel kararları çözün:",
      resetSim: "Yeniden Başlat",
      simSucceed: "Harika! Seçimleriniz 5 yıldızlı otel operasyon standartlarını mükemmel kavradığınızı gösteriyor.",
      simSucceedCulinary: "Mükemmel! Kararlarınız gıda güvenliği (HACCP) standartları ve mutfak yönetimiyle birebir uyumlu.",
      simSucceedTourism: "Kusursuz! GDS uçuş rezervasyonunu ve MICE konuk organizasyonunu çok başarılı yönettiniz.",
      nextStep: "Sonraki",
      submitAnswers: "Seçimleri Değerlendir",
    },
    Korea: {
      title: "APJ 인택티브 하이브리드 캠퍼스 맵",
      subtitle: "최첨단 실무 교육실 및 복합 공간 둘러보기",
      desc: "멀티 층 지도를 조작하여 자카르타 관광아카데미가 자랑하는 세계적 수준의 전문인 실습 베이스와 주요 시설을 탐방할 수 있습니다.",
      groundFloor: "1층 - 로비 & 행정실",
      secondFloor: "2층 - 조리 및 바리스타 바",
      thirdFloor: "3층 - 관광 비즈니스 및 도서관",
      searchPlaceholder: "원하는 실습실 또는 편의시설 검색...",
      legendTitle: "공간 카테고리",
      hospitality: "호텔 경영 및 프론트 업무",
      culinary: "조리 기술 및 조주 믹솔로지",
      tourism: "항공 운송 및 여행 산업",
      common: "공용 자치 인프라 및 정원",
      floorText: "층",
      capacityText: "적정 수용 인원",
      equipmentTitle: "전공 필수 핵심 전산 장비",
      simulationTitle: "가상 시나리오 트레이닝 시작",
      activeModeSchematic: "설계 도면 도안",
      activeModeIsometric: "3D 입체 투시도",
      noResults: "이 층에서 해당 명칭의 공간을 찾을 수 없습니다.",
      clickPrompt: "지도에 깜빡이는 주요 핵심 포인트 핀을 클릭해 현업 사양의 상세 스펙을 살펴보세요.",
      detailTab: "전공 개요",
      equipTab: "장비 현황",
      simTab: "업무 모의",
      viewCampusGallery: "캠퍼스 사진첩 바로가기",
      equipmentIntro: "글로벌 호텔 관광 산업체 현업 사양과 호환되는 프로페셔널 기자재 목록:",
      simIntro: "각 실습 파트에서 빈번히 마주하는 실제 돌발 직무 미션:",
      resetSim: "시뮬레이션 리셋",
      simSucceed: "대단합니다! 당신의 판단은 실제 5성급 호텔 지배인 수준의 최고 수준 고객 대응 표준 절차를 따르고 있습니다.",
      simSucceedCulinary: "정말 우수합니다! 엄격한 식품 안전 규범(HACCP) 준수 및 신속한 셰프 주방 통제 능력을 입증했습니다.",
      simSucceedTourism: "완벽해요! 고객이 요청한 GDS 예약 발권 및 MICE 학술 행사 접수 과업을 신속하고 정확하게 달성했습니다.",
      nextStep: "다음 단계로",
      submitAnswers: "최종 평점 채점",
    }
  };

  const gt = (key: string) => {
    const lang = mapDict[currentLang] || mapDict["ID"];
    return lang[key] || mapDict["ID"][key] || key;
  };

  // Helper to get category colors
  const getCatColor = (category: "hospitality" | "culinary" | "tourism" | "common") => {
    switch (category) {
      case "hospitality": return "bg-blue-600 border-blue-400 text-blue-600";
      case "culinary": return "bg-amber-500 border-amber-300 text-amber-500";
      case "tourism": return "bg-emerald-600 border-emerald-400 text-emerald-600";
      case "common": return "bg-neutral-600 border-neutral-400 text-neutral-600";
    }
  };

  // Helper for category label
  const getCatLabel = (category: "hospitality" | "culinary" | "tourism" | "common") => {
    return gt(category);
  };

  // Mini-simulation scenario questions based on active hotspot
  const simScenarios: Record<string, {
    question: string;
    options: { text: string; correct: boolean }[];
  }[]> = {
    frontoffice: [
      {
        question: "Tamu VIP mengeluhkan kamarnya belum dibersihkan padahal sudah waktunya check-in. Tindakan pertama Anda?",
        options: [
          { text: "Meminta maaf tulus, menyajikan welcome drink gratis di lounge, lalu segera berkoordinasi dengan Housekeeping supervisor.", correct: true },
          { text: "Meminta tamu menunggu dengan sabar di sofa lobi karena hotel sedang sangat sibuk hari ini.", correct: false }
        ]
      },
      {
        question: "Saat menginput reservasi ke sistem PMS, informasi apakah yang paling krusial dicatat demi keamanan tamu?",
        options: [
          { text: "Nomor kartu identitas resmi (KTP/Paspor), metode pembayaran terkonfirmasi, dan detail durasi masa tinggal.", correct: true },
          { text: "Pilihan hobi tamu, akun media sosial, dan jenis kendaraan pribadi yang digunakan.", correct: false }
        ]
      }
    ],
    culinarylab: [
      {
        question: "Anda hendak menyiapkan pemotongan daging mentah dan sayuran salad segar. Bagaimana penempatan talenan (cutting board)?",
        options: [
          { text: "Menggunakan talenan merah khusus untuk daging mentah, dan talenan hijau steril untuk sayuran/makanan siap santap demi cegah kontaminasi silang.", correct: true },
          { text: "Menggunakan satu talenan kayu besar tebal yang sama agar proses pemotongan efisien dan hemat sabun pencuci.", correct: false }
        ]
      },
      {
        question: "Kompor high-pressure di dapur utama menyala terlalu besar dan minyak dalam wajan terbakar. Cara pemadaman tercepat dan aman?",
        options: [
          { text: "Matikan katup gas utama, tutup wajan rapat dengan lap kain basah tebal atau gunakan APAR jenis CO2/wet chemical.", correct: true },
          { text: "Menyiramkan air bersih bervolume besar secara langsung ke atas wajan berisi minyak panas yang sedang berkobar.", correct: false }
        ]
      }
    ],
    mixologystudio: [
      {
        question: "Pelanggan meminta sajian cappuccino tetapi menginginkan tekstur foam susu yang sangat mengkilap (glossy) dan halus (microfoam). Suhu maksimal frothing?",
        options: [
          { text: "Lakukan frothing susu hingga suhu maksimal 60°C - 65°C untuk menjaga rasa manis alami protein laktosa.", correct: true },
          { text: "Lakukan pemanasan susu hingga mendidih di atas 90°C agar busa awet tegak sepanjang hari.", correct: false }
        ]
      }
    ],
    micelab: [
      {
        question: "Seorang klien korporat ingin memesan ruang pertemuan MICE lengkap dengan sistem multimedia hibrida. Berapa lama PNR tiket udara delegasi asing harus ditahan (hold) sebelum terbit?",
        options: [
          { text: "Cek aturan fare basis penerbangan pada sistem Amadeus, set limit hold sesuai time-limit maskapai demi menghindari auto-cancel.", correct: true },
          { text: "Melakukan issued tiket secara acak terlebih dahulu tanpa konfirmasi deposit jaminan finansial.", correct: false }
        ]
      }
    ]
  };

  const activeScenarios = selectedSpot ? simScenarios[selectedSpot.id] || [] : [];

  const handleSelectSimAnswer = (optText: string, isCorrect: boolean) => {
    const updatedAnswers = [...simAnswers, optText];
    setSimAnswers(updatedAnswers);
    
    if (simStep + 1 < activeScenarios.length) {
      setSimStep(simStep + 1);
    } else {
      setSimCompleted(true);
    }
  };

  const handleResetSim = () => {
    setSimStep(0);
    setSimCompleted(false);
    setSimAnswers([]);
  };

  return (
    <section className="bg-white py-16 md:py-20 border-b border-neutral-100" id="interactive-campus-map-section">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Header Title Grid */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#0050A0]/10 text-[#0050A0] text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#0050A0]/20 shadow-xs">
              <Compass size={11} className="animate-spin-slow" />
              <span>Campus Digital Blueprint</span>
            </div>
            <h2 className="text-2xl md:text-3.5xl font-black text-neutral-900 tracking-tight font-heading leading-tight">
              {gt("title")}
            </h2>
            <p className="text-sm font-bold text-[#0050A0] tracking-wide uppercase">
              {gt("subtitle")}
            </p>
            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-semibold">
              {gt("desc")}
            </p>
          </div>

          {/* View Mode Toggle / Floor quick guides */}
          <div className="flex flex-wrap items-center gap-3 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/80 w-fit">
            <button
              onClick={() => setViewMode("schematic")}
              className={`px-3.5 py-2 text-[11px] font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "schematic"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Monitor size={12} />
              {gt("activeModeSchematic")}
            </button>
            <button
              onClick={() => setViewMode("isometric")}
              className={`px-3.5 py-2 text-[11px] font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "isometric"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Tv size={12} />
              {gt("activeModeIsometric")}
            </button>
          </div>
        </div>

        {/* Dynamic Search & Navigation Container */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-150/80">
          
          {/* Search Input Box */}
          <div className="relative w-full md:w-96" id="map-search-container">
            <Search size={15} className="absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={gt("searchPlaceholder")}
              className="w-full pl-10 pr-10 py-3 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0050A0] focus:ring-1 focus:ring-[#0050A0]/20 shadow-inner"
              id="map-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
            
            {/* Search Suggestions dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl z-30 overflow-hidden divide-y divide-neutral-100"
                >
                  {suggestions.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => {
                        setActiveFloor(spot.floor);
                        handleSelectSpot(spot);
                        setSearchQuery("");
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center gap-3 transition cursor-pointer"
                    >
                      <div className={`p-1.5 rounded-lg text-white ${getCatColor(spot.category).split(" ")[0]}`}>
                        <spot.icon size={12} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-neutral-900">{spot.titles[currentLang]}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          {gt("floorText")} {spot.floor === "ground" ? "1" : spot.floor === "second" ? "2" : "3"}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floor Selection Tab Buttons */}
          <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl border border-neutral-200 w-full md:w-auto overflow-x-auto scrollbar-none" id="map-floor-selector">
            {(["ground", "second", "third"] as FloorId[]).map((flId) => (
              <button
                key={flId}
                onClick={() => {
                  setActiveFloor(flId);
                  // Auto-close open detail if not on same floor
                  if (selectedSpot && selectedSpot.floor !== flId) {
                    setSelectedSpot(null);
                  }
                }}
                className={`flex-1 md:flex-none text-center px-4 py-2.5 text-[11px] font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeFloor === flId
                    ? "bg-[#0050A0] text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {flId === "ground" ? gt("groundFloor") : flId === "second" ? gt("secondFloor") : gt("thirdFloor")}
              </button>
            ))}
          </div>
        </div>

        {/* Map Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAP CANVAS PANEL (Takes up 7 columns on large screens) */}
          <div className="lg:col-span-7 bg-neutral-950 rounded-3xl p-4 md:p-6 border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px] md:min-h-[520px]">
            
            {/* Legend Indicators overlay */}
            <div className="absolute top-4 left-4 z-10 hidden sm:flex flex-col gap-1.5 bg-neutral-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-neutral-800 shadow-md">
              <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">
                {gt("legendTitle")}
              </h4>
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-blue-600 block"></span>
                <span>{gt("hospitality")}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 block"></span>
                <span>{gt("culinary")}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 block"></span>
                <span>{gt("tourism")}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-neutral-500 block"></span>
                <span>{gt("common")}</span>
              </div>
            </div>

            {/* Main Interactive Map Stage */}
            <div className="relative w-full aspect-[4/3] bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden flex items-center justify-center my-auto shadow-inner select-none">
              
              {/* Dynamic Map Visual Overlay (using layered SVG blueprints for clean responsive layout) */}
              <div className="absolute inset-0 z-0">
                {viewMode === "schematic" ? (
                  /* SCHEMATIC BLUEPRINT VIEW */
                  <svg className="w-full h-full opacity-80" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222" strokeWidth="0.5"/>
                      </pattern>
                      <radialGradient id="blueprint-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
                      </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="#0a0f1d"/>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <rect width="100%" height="100%" fill="url(#blueprint-glow)" />

                    {/* Floor Structural Outlines depending on active floor */}
                    {activeFloor === "ground" && (
                      <g stroke="#0050A0" strokeWidth="1.5" fill="none" opacity="0.65" strokeDasharray="2 2" className="animate-pulse">
                        {/* Main Corridor */}
                        <rect x="150" y="200" width="500" height="200" rx="20" strokeWidth="2" stroke="#0050A0" />
                        {/* Front Office Simulator Area */}
                        <rect x="180" y="230" width="200" height="140" rx="10" />
                        <line x1="280" y1="230" x2="280" y2="370" />
                        {/* Courtyard Zone */}
                        <path d="M 430,230 C 500,180 580,230 610,300 C 630,350 580,370 430,370 Z" stroke="#10b981" strokeWidth="2" />
                        <circle cx="520" cy="280" r="45" stroke="#10b981" />
                        {/* Entrance lobby */}
                        <path d="M 150,300 L 80,300" />
                      </g>
                    )}

                    {activeFloor === "second" && (
                      <g stroke="#b45309" strokeWidth="1.5" fill="none" opacity="0.65" strokeDasharray="2 2" className="animate-pulse">
                        {/* Culinary Main block */}
                        <rect x="150" y="180" width="500" height="240" rx="20" strokeWidth="2" stroke="#b45309" />
                        {/* Hot Kitchen Lab Room */}
                        <rect x="180" y="210" width="220" height="180" rx="10" />
                        {/* Barista & Mixology Suite */}
                        <rect x="430" y="210" width="190" height="180" rx="10" />
                        <circle cx="525" cy="300" r="30" />
                        {/* Ventilation Shaft & storage */}
                        <line x1="400" y1="180" x2="400" y2="420" />
                      </g>
                    )}

                    {activeFloor === "third" && (
                      <g stroke="#059669" strokeWidth="1.5" fill="none" opacity="0.65" strokeDasharray="2 2" className="animate-pulse">
                        {/* MICE and Library block */}
                        <rect x="150" y="180" width="500" height="240" rx="20" strokeWidth="2" stroke="#059669" />
                        {/* Travel Ticketing Lab */}
                        <rect x="180" y="210" width="220" height="180" rx="10" />
                        <line x1="290" y1="210" x2="290" y2="390" />
                        {/* Digital Library suite */}
                        <rect x="420" y="210" width="210" height="180" rx="10" />
                        <rect x="450" y="240" width="50" height="50" rx="5" />
                        <rect x="540" y="240" width="50" height="50" rx="5" />
                      </g>
                    )}

                    {/* Technical HUD Text Overlay */}
                    <text x="30" y="560" fill="#0050A0" fontSize="10" fontFamily="monospace" fontWeight="bold">SYS_FLOOR_ACTIVE: {activeFloor.toUpperCase()}</text>
                    <text x="30" y="575" fill="#0050A0" fontSize="10" fontFamily="monospace" fontWeight="bold">SYS_SIGNAL_STATUS: ONLINE_SECURE</text>
                    <text x="590" y="560" fill="#0050A0" fontSize="10" fontFamily="monospace" fontWeight="bold">JAYAKARTA_VIRTUAL_BLUEPRINT_V1.12</text>
                  </svg>
                ) : (
                  /* 3D CONCEPT ISOMETRIC VIEW BACKGROUND */
                  <div className="w-full h-full relative bg-neutral-900 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-neutral-900 to-black"></div>
                    
                    {/* Isometric vector block */}
                    <div className="relative transform rotate-x-60 -rotate-z-45 scale-75 border-3 border-[#0050A0]/30 w-96 h-96 bg-[#0050A0]/5 rounded-3xl flex items-center justify-center shadow-2xl">
                      <div className="absolute top-2 left-2 border-l-2 border-t-2 border-emerald-500 w-12 h-12"></div>
                      <div className="absolute bottom-2 right-2 border-r-2 border-b-2 border-emerald-500 w-12 h-12"></div>
                      
                      {/* Interactive block levels simulating architectural structure */}
                      <div className="space-y-4 text-center">
                        <div className={`border-2 p-4 rounded-2xl transition duration-500 ${activeFloor === "third" ? "bg-[#059669]/20 border-emerald-500 text-white scale-110 shadow-lg" : "border-neutral-700 text-neutral-500"}`}>
                          <div className="text-xs font-black">LEVEL 03 - TOURISM & LIBRARY</div>
                        </div>
                        <div className={`border-2 p-4 rounded-2xl transition duration-500 ${activeFloor === "second" ? "bg-amber-500/20 border-amber-500 text-white scale-110 shadow-lg" : "border-neutral-700 text-neutral-500"}`}>
                          <div className="text-xs font-black">LEVEL 02 - CULINARY ARTS LABS</div>
                        </div>
                        <div className={`border-2 p-4 rounded-2xl transition duration-500 ${activeFloor === "ground" ? "bg-blue-600/20 border-blue-500 text-white scale-110 shadow-lg" : "border-neutral-700 text-neutral-500"}`}>
                          <div className="text-xs font-black">LEVEL 01 - FRONT OFFICE & LOBBY</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC HOTSPOT PINS LAYER */}
              <AnimatePresence mode="popLayout">
                {filteredHotspots.map((spot) => {
                  const SpotIcon = spot.icon;
                  const isSelected = selectedSpot?.id === spot.id;
                  
                  return (
                    <motion.button
                      key={spot.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => handleSelectSpot(spot)}
                      style={{ left: `${spot.coords.x}%`, top: `${spot.coords.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none"
                      id={`map-pin-${spot.id}`}
                    >
                      {/* Outer Pulseing rings */}
                      <span className={`absolute -inset-4 rounded-full animate-ping opacity-65 ${isSelected ? "bg-[#0050A0] scale-150" : getCatColor(spot.category).split(" ")[0]}`}></span>
                      <span className={`absolute -inset-2.5 rounded-full animate-pulse opacity-40 ${isSelected ? "bg-neutral-100" : "bg-transparent"}`}></span>

                      {/* Main Icon Button Pin */}
                      <div className={`relative p-3 rounded-full border-2 text-white shadow-xl flex items-center justify-center transition-all duration-300 ${
                        isSelected 
                          ? "bg-neutral-900 border-white scale-125 z-30" 
                          : `${getCatColor(spot.category).split(" ")[0]} ${getCatColor(spot.category).split(" ")[1]} hover:scale-115`
                      }`}>
                        <SpotIcon size={16} className={isSelected ? "text-amber-400 animate-pulse" : "text-white"} />
                        
                        {/* Mini tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-neutral-950 text-white text-[10px] font-black tracking-wide whitespace-nowrap px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl border border-neutral-800 flex items-center gap-1">
                          <Sparkles size={9} className="text-amber-400" />
                          {spot.titles[currentLang]}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {/* No hotspots state */}
              {filteredHotspots.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs text-center p-6 z-10">
                  <div className="space-y-2 max-w-xs">
                    <Info className="mx-auto text-[#0050A0]" size={32} />
                    <p className="text-xs font-bold text-neutral-300">{gt("noResults")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Instruction bottom caption bar */}
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-2 text-[11px] font-black text-neutral-400 tracking-wide">
              <Sparkles size={13} className="text-amber-400 animate-pulse" />
              <span>{gt("clickPrompt")}</span>
            </div>
          </div>

          {/* DETAIL SPECIFICATION PANEL (Takes up 5 columns on large screens) */}
          <div className="lg:col-span-5 h-full">
            <AnimatePresence mode="wait">
              {selectedSpot ? (
                <motion.div
                  key={selectedSpot.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-neutral-50 rounded-3xl border border-neutral-150/80 shadow-xl overflow-hidden flex flex-col justify-between"
                  id={`map-detail-panel-${selectedSpot.id}`}
                >
                  {/* Top Image banner section */}
                  <div className="h-44 relative bg-neutral-200 overflow-hidden">
                    <img
                      src={selectedSpot.image}
                      alt={selectedSpot.titles[currentLang]}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Close panel button */}
                    <button
                      onClick={() => setSelectedSpot(null)}
                      className="absolute top-3.5 right-3.5 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition cursor-pointer"
                      title="Close Panel"
                    >
                      <X size={15} />
                    </button>

                    {/* Interactive Sub-tab Selector */}
                    <div className="absolute bottom-3 left-4 right-4 bg-black/60 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 border border-white/10 z-10">
                      <button
                        onClick={() => setActiveTab("details")}
                        className={`flex-1 text-center py-1.5 text-[9px] font-black rounded-lg uppercase tracking-wider transition ${
                          activeTab === "details" ? "bg-white text-neutral-900 font-bold" : "text-white/80 hover:text-white"
                        }`}
                      >
                        {gt("detailTab")}
                      </button>
                      <button
                        onClick={() => setActiveTab("equipments")}
                        className={`flex-1 text-center py-1.5 text-[9px] font-black rounded-lg uppercase tracking-wider transition ${
                          activeTab === "equipments" ? "bg-white text-neutral-900 font-bold" : "text-white/80 hover:text-white"
                        }`}
                      >
                        {gt("equipTab")}
                      </button>
                      {activeScenarios.length > 0 && (
                        <button
                          onClick={() => {
                            setActiveTab("simulation");
                            handleResetSim();
                          }}
                          className={`flex-1 text-center py-1.5 text-[9px] font-black rounded-lg uppercase tracking-wider transition ${
                            activeTab === "simulation" ? "bg-[#0050A0] text-white font-bold" : "text-white/80 hover:text-white"
                          }`}
                        >
                          {gt("simTab")}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scrollable specs body */}
                  <div className="p-6 md:p-8 space-y-6 max-h-[360px] md:max-h-[420px] overflow-y-auto scrollbar-thin">
                    
                    <AnimatePresence mode="wait">
                      
                      {/* TAB 1: GENERAL OVERVIEW DETAILS */}
                      {activeTab === "details" && (
                        <motion.div
                          key="tab-details"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center gap-2">
                            <span className="bg-[#0050A0]/10 text-[#0050A0] px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider">
                              {getCatLabel(selectedSpot.category)}
                            </span>
                            <span className="bg-neutral-100 text-neutral-500 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider">
                              Level 0{selectedSpot.floor === "ground" ? "1" : selectedSpot.floor === "second" ? "2" : "3"}
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-snug">
                            {selectedSpot.titles[currentLang]}
                          </h3>

                          <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                            {selectedSpot.descs[currentLang]}
                          </p>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200/60">
                            <div>
                              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">
                                {gt("capacityText")}
                              </span>
                              <span className="text-xs font-bold text-neutral-800">
                                {selectedSpot.capacity}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">
                                Status Operasional
                              </span>
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <Check size={12} strokeWidth={3} />
                                Siap Simulasi
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* TAB 2: EQUIPMENT SPECIFICATIONS */}
                      {activeTab === "equipments" && (
                        <motion.div
                          key="tab-equipments"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <h4 className="text-sm font-black text-neutral-900 tracking-tight">
                            {gt("equipmentTitle")}
                          </h4>
                          <p className="text-[11px] font-semibold text-neutral-500">
                            {gt("equipmentIntro")}
                          </p>

                          {/* Equipment checklist items */}
                          <div className="space-y-2.5 pt-1">
                            {selectedSpot.equipments[currentLang]?.map((eq, i) => (
                              <div key={i} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-neutral-150">
                                <div className="p-1 rounded-md bg-[#0050A0]/10 text-[#0050A0] mt-0.5">
                                  <Check size={10} strokeWidth={3} />
                                </div>
                                <span className="text-xs font-extrabold text-neutral-700 leading-normal">
                                  {eq}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* TAB 3: INTERACTIVE MINI SIMULATION GAME */}
                      {activeTab === "simulation" && (
                        <motion.div
                          key="tab-simulation"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-neutral-900 tracking-tight">
                              {gt("simulationTitle")}
                            </h4>
                            <span className="text-[10px] font-bold text-[#0050A0] uppercase tracking-wider bg-[#0050A0]/10 px-2 py-1 rounded">
                              Scenario {simStep + 1}/{activeScenarios.length}
                            </span>
                          </div>

                          {/* Completion state card */}
                          {simCompleted ? (
                            <div className="space-y-4 text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
                              <div className="p-3 bg-emerald-500 text-white rounded-full w-fit mx-auto animate-bounce">
                                <Check size={20} strokeWidth={3} />
                              </div>
                              <p className="text-xs font-extrabold text-emerald-800 leading-relaxed px-2">
                                {selectedSpot.category === "hospitality" && gt("simSucceed")}
                                {selectedSpot.category === "culinary" && gt("simSucceedCulinary")}
                                {selectedSpot.category !== "hospitality" && selectedSpot.category !== "culinary" && gt("simSucceedTourism")}
                              </p>
                              
                              <button
                                onClick={handleResetSim}
                                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black rounded-xl tracking-wider uppercase transition flex items-center gap-1.5 mx-auto cursor-pointer"
                              >
                                <RotateCcw size={11} />
                                {gt("resetSim")}
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <p className="text-xs font-extrabold text-neutral-700 leading-relaxed bg-white p-3.5 rounded-xl border border-neutral-150">
                                {activeScenarios[simStep]?.question}
                              </p>

                              <div className="space-y-2.5">
                                {activeScenarios[simStep]?.options.map((opt, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleSelectSimAnswer(opt.text, opt.correct)}
                                    className="w-full text-left p-3.5 text-xs font-bold bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 rounded-xl border border-neutral-200 transition duration-200 flex items-start gap-2.5 cursor-pointer hover:border-[#0050A0] hover:ring-1 hover:ring-[#0050A0]/20"
                                  >
                                    <span className="bg-neutral-100 text-neutral-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-black">
                                      {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="leading-relaxed">{opt.text}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                    </AnimatePresence>

                  </div>

                  {/* Panel footer */}
                  <div className="bg-neutral-100/60 p-4 border-t border-neutral-150 flex items-center justify-between">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                      APJ ACADEMY VIRTUAL
                    </span>
                    <button
                      onClick={() => {
                        const gallerySection = document.getElementById("campus-gallery-section");
                        if (gallerySection) {
                          gallerySection.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="text-[#0050A0] hover:text-blue-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition cursor-pointer"
                    >
                      {gt("viewCampusGallery")}
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* INACTIVE STATE DEFAULT FALLBACK */
                <div className="bg-neutral-50 rounded-3xl border border-neutral-150/80 p-8 text-center h-full flex flex-col items-center justify-center space-y-4 py-16 md:py-24 border-dashed">
                  <div className="p-4 bg-[#0050A0]/10 text-[#0050A0] rounded-full animate-pulse">
                    <Compass size={28} />
                  </div>
                  <div className="space-y-1.5 max-w-xs">
                    <h4 className="text-sm font-black text-neutral-800 tracking-tight">
                      Mulai Eksplorasi Peta
                    </h4>
                    <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
                      Ketuk salah satu ikon berkedip pada blueprint lantai kampus untuk membedah data spesifikasi sarana praktik vokasi kami secara real-time.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
