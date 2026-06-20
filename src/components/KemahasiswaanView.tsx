import React from "react";
import { Award, School, Users, Briefcase, GraduationCap, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data/apjData";
import { LanguageCode, createTranslator } from "../lib/translations";

interface KemahasiswaanViewProps {
  activeTab: string;
  currentLang?: LanguageCode;
}

export default function KemahasiswaanView({ activeTab, currentLang = "ID" }: KemahasiswaanViewProps) {
  const t = createTranslator(currentLang);
  const ukmActivities = [
    {
      name: "APJ Barista & Mixology Club",
      desc: "Wadah mahasiswa melatih kemahiran meracik kopi (espresso manual/automatic, manual brew, latte art) serta mengolah cocktail & mocktail kreatif standar hotel.",
      avatar: "☕",
      award: "Sabet Juara 1 Tingkat Nasional Latte Art Championship 2025"
    },
    {
      name: "Jayakarta Pastry & Culinary Team",
      desc: "Komunitas pencinta dunia kuliner yang berfokus mendalami teknik-teknik memasak modern (molecular gastronomy), dekorasi kue pengantin, dan penataan piring saji (plating art).",
      avatar: "🧁",
      award: "Sertifikasi Emas dari Persatuan Chef Indonesia (PCI) DKI Jakarta"
    },
    {
      name: "Tourism Ambassador Club (Abnon)",
      desc: "Membekali bakat komunikasi publik, tata rias diri (grooming), wawasan destinasi sejarah budaya nasional serta keprotokolan sebagai representasi ambassador dki jakarta.",
      avatar: "👑",
      award: "Mewakili Kontingen DKI Jakarta dalam Pameran Pariwisata Indonesia"
    },
    {
      name: "English & Foreign Language Society",
      desc: "Mengasah kelipatan kemahiran berkomunikasi lisan formal (speech, debate, storytelling, guiding presentation) menggunakan bahasa asing global (Inggris, Mandarin, Jepang).",
      avatar: "🗣",
      award: "Juara Harapan Utama English Debate Tournament Kategori Mahasiswa Vokasi"
    }
  ];

  const titlesDict: Record<LanguageCode, Record<string, string>> = {
    ID: {
      tag: "KEMAHASISWAAN & JALUR KARIR APJ",
      ukm: "Unit Kegiatan Mahasiswa & Kreativitas",
      karir: "Pusat Pengembangan Karir & Kerjasama Internasional",
      alumni: "Kisah Inspiratif Alumni Sukses Global APJ",
      ukmDesc: "Asah keseimbangan hobi, bakat kepemimpinan, dan kecakapan berorganisasi di lingkungan kampus kondusif.",
      karirDesc: "Pintu gerbang emas menuju penyaluran karir instan, magang bergengsi, dan pemetaan profesi pariwisata.",
      alumniDesc: "Melihat jejak kesuksesan ribuan wisudawan APJ yang memimpin bidang hospitality di berbagai benua."
    },
    EN: {
      tag: "STUDENT AFFAIRS & CAREER PATHS",
      ukm: "Student Activity Units & Creative Clubs",
      karir: "Career Development Center & International Cooperation",
      alumni: "Inspirational Success Stories of Global APJ Alumni",
      ukmDesc: "Hone the perfect balance of hobbies, leadership talents, and organizational skills in a highly supportive campus environment.",
      karirDesc: "The prime golden gateway to rapid recruitment, prestigious global internships, and professional hospitality mappings.",
      alumniDesc: "Discover the spectacular footprints of thousands of APJ graduates leading hospitality operations across multiple continents."
    },
    JPN: {
      tag: "キャンパスライフ＆就職・キャリア支援",
      ukm: "サークル活動・学生自治会・クリエイティブクラブ",
      karir: "キャリアディベロップメント＆グローバル就職対策室",
      alumni: "世界に羽ばたくAPJ卒業生のサクセスストーリー",
      ukmDesc: "熱中できる趣味、リーダーシップ、そして協調性を育む素晴らしいキャンパス・コミュニティ。",
      karirDesc: "5つ星ホテルへの最速就職推薦、有給・短期長期の海外インターンシップを全面的に保証します。",
      alumniDesc: "世界各国の第一線でホスピタリティ産業を牽引する、何千人ものAPJ誇りの卒業生たちの歩み。"
    },
    Mandarin: {
      tag: "学生工作处与职业发展部",
      ukm: "校内社团活动、学生自治及创意联合会",
      karir: "校企合作就业指导中心与跨国实习基地",
      alumni: "APJ 优秀校友环球行业楷模访谈实录",
      ukmDesc: "在极佳的校园互助氛围中，打磨个人兴趣、领导艺术与社会服务组织协调能力的最佳土壤。",
      karirDesc: "对接世界名企的专属快捷内推大门，提供含金量十足的海外实习与专业职业生涯成长路线。",
      alumniDesc: "追寻数以万计雅加达旅游学院模范毕业生、在五大洲豪华酒店出任大区总裁等高级行政职务的足迹。"
    },
    Arab: {
      tag: "شؤون الطلاب والمسارات المهنية",
      ukm: "الأنشطة الطلابية والنوادي الإبداعية التفاعلية",
      karir: "مركز التطوير المهني والعلاقات والاتفاقيات الدولية",
      alumni: "قصص نجاح ملهمة لرواد الكلية وخريجينا حول العالم",
      ukmDesc: "تطوير الهوايات وبناء طاقات القيادة والعمل الجماعي بأسلوب ترفيهي إيجابي داخل حرم الأكاديمية.",
      karirDesc: "بوابتك الذهبية للتوظيف الفوري وتأمين فترات التدريب المرموقة وتطوير مسارك السياحي.",
      alumniDesc: "متابعة لمسارات النجاح لآلاف من خريجي الأكاديمية والذين يقودون كبرى قطاعات الضيافة العالمية."
    },
    Jerman: {
      tag: "STUDENTENANGELEGENHEITEN & CAREER SERVICE",
      ukm: "Studentische Initiativen & Kreative Clubs",
      karir: "Zentrum für Karriereentwicklung & Internationale Beziehungen",
      alumni: "Erfolgsgeschichten unserer weltweiten APJ-Alumni",
      ukmDesc: "Finden Sie die perfekte Balance aus Freizeit, Führungsqualitäten und Organisationstalent auf unserem Campus.",
      karirDesc: "Ihr goldenes Tor zu schnellem Berufseinstieg, hochkarätigen Praktika und weltweiter Karriereplanung.",
      alumniDesc: "Erfahren Sie mehr über das Erbe und den Erfolg unserer Spitzenabsolventen in der globalen Hotellerie."
    },
    Turki: {
      tag: "ÖĞRENCİ İŞLERİ VEYA KARİYER MERKEZİ",
      ukm: "Öğrenci Kulüpleri, Toplulukları ve Yaratıcılık",
      karir: "Kariyer Geliştirme Koordinatörlüğü ve Dış İlişkiler",
      alumni: "Küresel Sektör Lideri APJ Mezunlarının Hikayeleri",
      ukmDesc: "Destekleyici bir kampüs ortamında liderlik yeteneklerinizi geliştirin ve organizasyon becerileri kazanın.",
      karirDesc: "Lüks otellere hızlı geçiş, prestijli küresel stajlar ve mesleki haritalama süreçlerine açılan altın portal.",
      alumniDesc: "Çeşitli kıtalarda konaklama sektörünü yöneten binlerce seçkin APJ mezununun başarı izlerini sürün."
    },
    Korea: {
      tag: "학생 자치 위원회 및 취업 경력 설계실",
      ukm: "동아리 활동 연합회 및 창의적 자율 소모임",
      karir: "종합 취업 경력 지원실 및 글로벌 인턴십 협약국",
      alumni: "전 세계를 누비는 APJ 명예 자랑스런 동문 일화",
      ukmDesc: "동아리 교류, 자율적 리더쉽 훈련 및 상생 협동 정신을 만끽할 수 있는 다정한 교정 문화를 선물합니다.",
      karirDesc: "해위 브랜드 지망생을 위한 멘토링 연계 정책, 특수 어학 대비 교육 프로그램을 공급합니다.",
      alumniDesc: "여러 대륙에 걸쳐 글로벌 체인 지점장, 시니어 호텔리어 등으로 왕성하게 활약하는 선배들을 조명합니다."
    }
  };

  const getStudentText = (fieldKey: string) => {
    const lang = titlesDict[currentLang] || titlesDict["ID"];
    return lang[fieldKey] || titlesDict["ID"][fieldKey] || "";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      {/* Title Header */}
      <div className="border-b border-neutral-100 pb-6 mb-8 text-center md:text-left space-y-2">
        <span className="text-xs font-black text-primary tracking-widest uppercase block">
          {getStudentText("tag")}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
          {getStudentText(activeTab)}
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 font-semibold leading-relaxed">
          {getStudentText(activeTab + "Desc")}
        </p>
      </div>

      <div className="w-full">
        {/* TAB 1: KEGIATAN UKM */}
        {activeTab === "ukm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ukmActivities.map((ukm, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-neutral-100 hover:shadow-lg hover:border-accent transition duration-200 space-y-4">
                <div className="flex gap-4 items-center">
                  <span className="text-4xl bg-primary/5 p-3 rounded-xl w-14 h-14 flex items-center justify-center shrink-0">
                    {ukm.avatar}
                  </span>
                  <h3 className="text-sm md:text-md font-black text-[#0050A0] leading-tight font-heading">
                    {ukm.name}
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                  {ukm.desc}
                </p>
                <div className="p-3 bg-neutral-50 rounded-lg border-l-4 border-accent text-[10px] text-primary font-bold">
                  🏆 Prestasi Utama: {ukm.award}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PUSAT KARIR */}
        {activeTab === "karir" && (
          <div className="space-y-10">
            {/* Compulsory program description */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFFCEF] p-6 rounded-2xl border border-accent">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-flex items-center gap-2 text-xs font-black text-primary tracking-widest uppercase">
                  <Briefcase size={16} />
                  MAGANG WAJIB 6 BULAN (INTERNSHIP PROGRAM)
                </span>
                <div className="text-xs md:text-sm text-neutral-700 leading-relaxed space-y-2 font-semibold">
                  <p>
                    Setiap mahasiswa Akademi Pariwisata Jakarta (APJ) wajib menjalani **Program Praktik Kerja Lapangan (PKL)** atau magang industri penuh selama 6 bulan penuh di semester 5 perkuliahan.
                  </p>
                  <p>
                    Program magang wajib ini dirancang sebagai jembatan adaptasi psikologis dan teknik kerja nyata di dunia luar. Jaringan kerjasama kami meliputi puluhan manajemen hotel bintang lima, perusahaan logistik boga penerbangan komersil, serta biro ekowisata perencana pameran terpandu.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-center">
                <div className="bg-white p-4 rounded-xl border border-neutral-100 text-center shadow-md max-w-xs space-y-1">
                  <span className="text-accent text-3xl">🤝</span>
                  <span className="block font-black text-xs text-primary leading-tight">60+ REKANAN INDUSTRI</span>
                  <span className="block text-[10px] text-zinc-500 font-semibold leading-relaxed">Penyaluran magang berkualitas terstruktur dengan status prioritas lulusan APJ.</span>
                </div>
              </div>
            </div>

            {/* Partner Details */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-neutral-900 font-heading">
                  Mitra Strategis Penyaluran Kerja & Magang APJ
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Peta pembagian klasifikasi mitra hotel, airlines, dan travel agency dalam negeri dan internasional:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow space-y-3">
                  <span className="block font-extrabold text-xs text-primary uppercase border-b border-neutral-100 pb-2">
                    🌟 LUXURY HOTELS (DKI JAKARTA)
                  </span>
                  <ul className="text-xs font-bold text-neutral-600 space-y-2 pl-1">
                    <li>• JW Marriott Mega Kuningan</li>
                    <li>• The Ritz-Carlton Pacific Place</li>
                    <li>• Grand Hyatt Jakarta</li>
                    <li>• Fairmont Hotel Senayan</li>
                    <li>• Hotel Mulia Senayan</li>
                    <li>• Shangri-La Hotel Jakarta</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow space-y-3">
                  <span className="block font-extrabold text-xs text-primary uppercase border-b border-neutral-100 pb-2">
                    🌍 OUTSIDE INDONESIA NETWORKS
                  </span>
                  <ul className="text-xs font-bold text-neutral-600 space-y-2 pl-1">
                    <li>• Ritz-Carlton Jeddah (Arab Saudi)</li>
                    <li>• Westin Hotel Dubai Marina (UAE)</li>
                    <li>• Genting Highlands Grand (Malaysia)</li>
                    <li>• Tokyo Hospitality College (Jepang)</li>
                    <li>• Staf Kapal Pesiar Royal Caribbean</li>
                    <li>• Hotel & Resorts California (USA)</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow space-y-3">
                  <span className="block font-extrabold text-xs text-primary uppercase border-b border-neutral-100 pb-2">
                    ✈ TOURS, TRAVELS & MICE
                  </span>
                  <ul className="text-xs font-bold text-neutral-600 space-y-2 pl-1">
                    <li>• Panorama Destination Travel</li>
                    <li>• Garuda Indonesia Crew Center</li>
                    <li>• Golden Rama Tours & Travel</li>
                    <li>• Dwidaya Tour Digital</li>
                    <li>• Jakarta International Expo Kemayoran</li>
                    <li>• ASITA DKI Jakarta Members</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KISAH SUKSES ALUMNI */}
        {activeTab === "alumni" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testi) => (
              <div key={testi.id} className="bg-white rounded-3xl p-6 shadow-xl border border-neutral-100 flex flex-col justify-between hover:border-accent transition duration-200">
                <div className="space-y-4">
                  {/* Decorative quote icon */}
                  <Quote size={28} className="text-accent/60 shrink-0" />
                  <p className="text-xs text-neutral-600 leading-relaxed italic font-semibold">
                    &ldquo;{testi.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-3">
                  <span className="text-3xl bg-neutral-100 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                    {testi.avatar}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-xs text-neutral-900 leading-tight">
                      {testi.name}
                    </h4>
                    <p className="text-[10px] font-bold text-primary tracking-wide uppercase">
                      {testi.role}
                    </p>
                    <p className="text-[9px] text-[#0050A0] leading-none mt-0.5">
                      {testi.company} • <span className="text-[9px] text-zinc-500 font-semibold">{testi.major} ({testi.year})</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
