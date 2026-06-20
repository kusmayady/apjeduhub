import React, { useState } from "react";
import { BookOpen, MapPin, School, ClipboardList, Clock, Sparkles, Database, CheckSquare, GraduationCap, Compass, Calendar, Plane } from "lucide-react";
import { CURRICULUM_HOTEL, CURRICULUM_TOURISM, FACILITIES, Facility } from "../data/apjData";
import { LanguageCode, createTranslator } from "../lib/translations";

interface AkademikViewProps {
  activeTab: string;
  currentLang?: LanguageCode;
}

export default function AkademikView({ activeTab, currentLang = "ID" }: AkademikViewProps) {
  const t = createTranslator(currentLang);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedLabId, setSelectedLabId] = useState<string>("kitchen");

  const activeLab = FACILITIES.find(f => f.id === selectedLabId) || FACILITIES[0];

  const titlesDict: Record<LanguageCode, Record<string, string>> = {
    ID: {
      tag: "PROGRAM AKADEMIK APJ",
      d3perhotelan: "Kurikulum D3 Perhotelan (Hotel Management)",
      d3wisata: "Kurikulum D3 Usaha Perjalanan Wisata (Bina Wisata)",
      fasilitas: "Eksplorasi Laboratorium Praktik Kampus",
      kalender: "Informasi Kalender Akademik TA 2026/2027",
      d3perhotelanDesc: "Mempersiapkan tenaga operasional perhotelan yang handal, mahir kuliner, tulus, dan disiplin tinggi.",
      d3wisataDesc: "Mencetak pelaku industri perjalanan digital, pemandu rute eksotis, & kreator acara MICE andal.",
      fasilitasDesc: "Laboratorium simulator berstandar bintang 5 terpadu guna menjamin kematangan praktik psikomotorik mahasiswa.",
      kalenderDesc: "Timeline agenda kegiatan belajar mengajar, pendaftaran krs, ujian tengah, akhir semester, dan wisuda."
    },
    EN: {
      tag: "APJ ACADEMIC PROGRAMS",
      d3perhotelan: "D3 Hotel Management Curriculum",
      d3wisata: "D3 Tourism Business Curriculum",
      fasilitas: "Campus Practice Laboratories Exploration",
      kalender: "Academic Calendar Schedule 2026/2027",
      d3perhotelanDesc: "Preparing reliable, culinary-proficient, hospitable hospitality operatives with high service discipline.",
      d3wisataDesc: "Developing professional travel technicians, exotic route guides, and expert MICE organizers.",
      fasilitasDesc: "Fully integrated 5-star standard simulator labs ensuring direct psychomotor practical maturity.",
      kalenderDesc: "Timeline of core learning activities, registration dates, midterms, finals, and graduation."
    },
    JPN: {
      tag: "APJ 学術部・カリキュラム",
      d3perhotelan: "D3 ホテル・マネジメント学科 専攻プログラム",
      d3wisata: "D3 観光ビジネス・旅行学科 専攻プログラム",
      fasilitas: "最新式実習レッスンルーム・学내スタジオ案内",
      kalender: "2026/2027年度 年間学事カレンダー予定表",
      d3perhotelanDesc: "一流ホテルで即戦力となるよう、高度な調理技術、サービス精神、自己管理能力を培います。",
      d3wisataDesc: "デジタル旅行ビジネス、魅力的なツアー企画、大規模イベント（MICE）企画能力を磨きます。",
      fasilitasDesc: "5つ星ホテル適合のシミュレーション設備を揃え、高度な実技・操作能力を保証します。",
      kalenderDesc: "講義・期末テスト・インターン申請期日、ならびに学位授与式・卒業式の全日程。"
    },
    Mandarin: {
      tag: "APJ 学术院系",
      d3perhotelan: "D3 酒店管理大专专业课程表",
      d3wisata: "D3 旅游及旅行社实务大专专业课程表",
      fasilitas: "现代化实训中心及模拟操作实验室巡礼",
      kalender: "2026/2027 学年度官方教学行事历汇总",
      d3perhotelanDesc: "旨在培养技能出众、精通烹饪餐饮、诚实守信、高效严谨的酒店运营人才。",
      d3wisataDesc: "致力打造数字在线OTA运营、特约精品路线开发及高端 MICE 特约策划经理人。",
      fasilitasDesc: "依照五星级饭店奢华标准配设的综合模拟实操中心，支撑学生实践技术深度锤炼。",
      kalenderDesc: "包含每学期开课、KRS 选课、期中与期末考核、以及毕业典礼等各项校务时间安排。"
    },
    Arab: {
      tag: "البرامج الأكاديمية بالأكاديمية",
      d3perhotelan: "منهج دبلوم إدارة الفنادق (D3)",
      d3wisata: "منهج دبلوم إدارة السياحة والرحلات (D3)",
      fasilitas: "استعراض مختبرات التدريب العملي المباشر",
      kalender: "تفاصيل التقويم الأكاديمي للعام الدراسي ٢٠٢٦/٢٠٢٧",
      d3perhotelanDesc: "تأهيل كوادر عمليات فندقية متمكنة، بارعة في الطهي والخدمة الراسخة والالتزام الفردي.",
      d3wisataDesc: "تأسيس كوادر السفر الرقمي، ومرافقي المسارات الخلابة، وصانعي المؤتمرات والمعارض (MICE) المرموقين.",
      fasilitasDesc: "مختبرات محاكاة متكاملة بمواصفات خمس نجوم لضمان أعلى مستويات الجاهزية العملية للطلبة.",
      kalenderDesc: "جدولة مواعيد الدراسة، تسجيل المواد الأكاديمية (KRS)، الاختبارات الفصلية وحفل التخرج."
    },
    Jerman: {
      tag: "APJ AKADEMISCHE PROGRAMME",
      d3perhotelan: "D3-Lehrplan Hotelmanagement",
      d3wisata: "D3-Lehrplan Tourismus und Eventmanagement",
      fasilitas: "Erkundung der Praxis- und Laborräume auf dem Campus",
      kalender: "Akademischer Kalender & Meilensteine 2026/2027",
      d3perhotelanDesc: "Ausbildung fähiger, leidenschaftlicher und disziplinierter Fachkräfte für exzellente Hotellerie.",
      d3wisataDesc: "Ausbildung von Digitalexperten der Reisebranche, Reiseleitern und MICE-Projektmanagern.",
      fasilitasDesc: "Integrierte Schulungslabs im 5-Sterne-Standard zur Festigung praktischer Handlungskompetenzen.",
      kalenderDesc: "Übersicht aller Semestertermine, Vorlesungszeiten, Prüfungsphasen und der Graduiertenfeier."
    },
    Turki: {
      tag: "APJ AKADEMİK PROGRAMLAR",
      d3perhotelan: "D3 Otel Yönetimi Müfredat Planları",
      d3wisata: "D3 Turizm Planlama Müfredat Planları",
      fasilitas: "Üst Düzey Kampüs Uygulama Laboratuvarları",
      kalender: "2026/2027 Akademik Takvim Bilgilendirmesi",
      d3perhotelanDesc: "5 yıldızlı tesislerin mutfaktan servise her biriminde çalışacak disiplinli uzmanlar yetiştiriyoruz.",
      d3wisataDesc: "Dijital turizm acentecileri, özel gezi profesyonelleri ve MICE organizasyon liderleri geliştiriyoruz.",
      fasilitasDesc: "Öğrencilerin pratik teorik beceri olgunluğunu garanti eden 5 yıldızlı simülatör mutfak ve barlar.",
      kalenderDesc: "Kurs kayıtları, ders ekleme-bırakma süreçleri, ara sınavlar, finaller ve mezuniyet takvimi."
    },
    Korea: {
      tag: "APJ 단과 대학 학사 과정",
      d3perhotelan: "D3 호텔경영 전공 표준 트랙 안내",
      d3wisata: "D3 관광비즈니스 전공 표준 트랙 안내",
      fasilitas: "학내 첨단 인프라 및 부속 실습실 탐방",
      kalender: "2026/2027 대학 정규 주요일정 및 학사력",
      d3perhotelanDesc: "탁월한 요리 기교, 정중하고 신뢰받는 호스피탈리티 소양과 도덕 품성을 양성합니다.",
      d3wisataDesc: "스마트 여행 대리점 전문가, 특수 목적 투어 설계사, 하이브리드 MICE 서비스 총괄자를 육성합니다.",
      fasilitasDesc: "5성급 스위트룸, 레스토랑 주방 인프라를 본떠 만든 직업훈련실 구비로 완벽한 손맛 보장.",
      kalenderDesc: "신학기 개강일, 수강신청 기간, 중간고사 및 기말고사 일정, 연례 학위 수여 행사 기록."
    }
  };

  const getAcademicText = (fieldKey: string) => {
    const lang = titlesDict[currentLang] || titlesDict["ID"];
    return lang[fieldKey] || titlesDict["ID"][fieldKey] || "";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      {/* Dynamic Header */}
      <div className="border-b border-neutral-100 pb-6 mb-8 text-center md:text-left space-y-2">
        <span className="text-xs font-black text-primary tracking-widest uppercase block">
          {getAcademicText("tag")}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
          {getAcademicText(activeTab)}
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 font-semibold leading-relaxed">
          {getAcademicText(activeTab + "Desc")}
        </p>
      </div>

      <div className="w-full">
        {/* TAB 1: D3 PERHOTELAN */}
        {activeTab === "d3perhotelan" && (
          <div className="space-y-10">
            {/* Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-neutral-100 shadow-md space-y-4">
                <div className="inline-flex items-center gap-1.5 text-[#0050A0] text-xs font-black tracking-widest uppercase">
                  <GraduationCap size={16} />
                  KOMPETENSI LULUSAN PERHOTELAN
                </div>
                <div className="text-xs md:text-sm text-neutral-600 leading-relaxed font-semibold space-y-2">
                  <p>
                    Program Studi **D3 Perhotelan Akademi Pariwisata Jakarta (APJ)** mendedikasikan perkuliahan praktis yang melatih keterampilan operasional hospitality hotel bintang lima secara komprehensif. Mahasiswa melatih olah psikomotorik lewat kombinasi porsi praktik 70% dan teori 30%.
                  </p>
                  <p>
                    Kami menyusun kurikulum berbasis Standar Kompetensi Kerja Nasional Indonesia (SKKNI) dan standar ASEAN MRA-TP (Mutual Recognition Arrangement on Tourism Professionals). Seluruh lulusan diuji kelayakan lewat LSP (Lembaga Sertifikasi Profesi) berlisensi resmi BNSP sebelum diwisuda.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-neutral-50 rounded-lg border-l-4 border-primary">
                    <span className="block font-bold text-xs text-primary leading-tight">Room Division Skill</span>
                    <span className="text-[11px] font-semibold text-neutral-500 leading-relaxed block mt-0.5">Tata kelola Front Office Desk & optimalisasi Housekeeping.</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border-l-4 border-[#0050A0]">
                    <span className="block font-bold text-xs text-primary leading-tight">Food & Beverage division</span>
                    <span className="text-[11px] font-semibold text-neutral-500 leading-relaxed block mt-0.5">Memasak masakan Nusantara/Barat, membuat roti & pastry patiseri, serta Bartending.</span>
                  </div>
                </div>
              </div>

              {/* Career opportunities */}
              <div className="lg:col-span-4 bg-[#FFFCEF] p-6 rounded-2xl border border-accent space-y-4 shadow-sm">
                <span className="block font-black text-xs text-primary tracking-wider uppercase font-heading">PROSPEK KARIR</span>
                <div className="space-y-2 text-xs font-bold text-neutral-700">
                  <div className="flex gap-2">🔹 <span>Executive Chef / Sous Chef</span></div>
                  <div className="flex gap-2">🔹 <span>F&B Outlets Manager</span></div>
                  <div className="flex gap-2">🔹 <span>Front Desk Supervisor</span></div>
                  <div className="flex gap-2">🔹 <span>Professional Barista / Mixologist</span></div>
                  <div className="flex gap-2">🔹 <span>Executive Housekeeper</span></div>
                  <div className="flex gap-2">🔹 <span>Staf Kapal Pesiar (Cruise Director Team)</span></div>
                </div>
              </div>
            </div>

            {/* Interactive Curriculum Table (Semester 1 to 6 switcher) */}
            <div className="space-y-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-neutral-900 font-heading">
                  Peta Mata Kuliah Perkuliahan (Semester 1 - 6)
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                  Pilih semester di bawah ini untuk melihat daftar mata kuliah yang terstruktur:
                </p>
              </div>

              {/* Semester Switcher Row */}
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-4 py-2.5 text-xs font-extrabold rounded-lg border transition shadow-sm cursor-pointer ${
                      selectedSemester === sem
                        ? "bg-[#0050A0] text-white border-[#0050A0]"
                        : "bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200"
                    }`}
                    id={`sem-hotel-btn-${sem}`}
                  >
                    Semester {sem}
                  </button>
                ))}
              </div>

              {/* Course Render Panel */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-100 p-5 md:p-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-primary border-b border-neutral-100 pb-3 mb-4">
                  <BookOpen size={18} />
                  <span className="font-extrabold text-sm uppercase tracking-wider font-heading">
                    MATA KULIAH UNGGULAN SEMESTER {selectedSemester}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CURRICULUM_HOTEL.find(c => c.semester === selectedSemester)?.courses.map((course, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100 hover:bg-yellow-50/40 transition">
                      <span className="w-5 h-5 bg-primary/10 text-primary font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-neutral-700 leading-tight">
                        {course}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: D3 USAHA WISATA */}
        {activeTab === "d3wisata" && (
          <div className="space-y-10">
            {/* Overview UPW Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-neutral-100 shadow-md space-y-4">
                <div className="inline-flex items-center gap-1.5 text-[#0050A0] text-xs font-black tracking-widest uppercase">
                  <Plane size={16} />
                  KOMPETENSI LULUSAN USAHA PASARAN WISATA
                </div>
                <div className="text-xs md:text-sm text-neutral-600 leading-relaxed font-semibold space-y-2">
                  <p>
                    Program Studi **D3 Usaha Perjalanan Wisata (Bina Wisata) APJ** mempersiapkan mahasiswa untuk merancang, mengemas, mempromosikan, serta mengoperasikan aneka industri perjalanan wisata.
                  </p>
                  <p>
                    Fokus utama kami berada pada tiga pilar kemahiran mutakhir: penguasaan Reservasi Penerbangan Maskapai Global (Sabre & Amadeus Database), Teknik Kepanduan Terintegrasi (Tour Guiding), serta Perencanaan Event Berskala Nasional/Regional (MICE Planner). Mahasiswa dibimbing langsung oleh pengurus ASITA (Association of the Indonesian Tours and Travel Agencies) Indonesia.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-neutral-50 rounded-lg border-l-4 border-primary">
                    <span className="block font-bold text-xs text-primary leading-tight">Sabre & Amadeus Ticketing</span>
                    <span className="text-[11px] font-semibold text-neutral-500 block mt-0.5">Sertifikasi kemahiran input reservasi tiket maskapai global.</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border-l-4 border-[#0050A0]">
                    <span className="block font-bold text-xs text-primary leading-tight">MICE & Event Planner</span>
                    <span className="text-[11px] font-semibold text-neutral-500 block mt-0.5">Membuat rancangan pameran, festival, expo, serta konser secara praktis.</span>
                  </div>
                </div>
              </div>

              {/* Career paths */}
              <div className="lg:col-span-4 bg-[#FFFCEF] p-6 rounded-2xl border border-accent space-y-4 shadow-sm">
                <span className="block font-black text-xs text-primary tracking-wider uppercase font-heading">PROSPEK KARIR</span>
                <div className="space-y-2 text-xs font-bold text-neutral-700">
                  <div className="flex gap-2">🔹 <span>Tour Planner & Designer</span></div>
                  <div className="flex gap-2">🔹 <span>International Tour Leader (ITL)</span></div>
                  <div className="flex gap-2">🔹 <span>MICE Specialist & Event Organizer</span></div>
                  <div className="flex gap-2">🔹 <span>Airlines Ground Staff & Ticketing</span></div>
                  <div className="flex gap-2">🔹 <span>Travel Content Creator</span></div>
                  <div className="flex gap-2">🔹 <span>PNS di Kementerian Pariwisata / DISPAR</span></div>
                </div>
              </div>
            </div>

            {/* Interactive Curriculum Table (Semester 1 to 6 switcher) */}
            <div className="space-y-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-neutral-900 font-heading">
                  Peta Mata Kuliah UPW (Semester 1 - 6)
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                  Pilih semester di bawah ini untuk melihat daftar mata kuliah yang terstruktur:
                </p>
              </div>

              {/* Semester Switcher Row */}
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-4 py-2.5 text-xs font-extrabold rounded-lg border transition shadow-sm cursor-pointer ${
                      selectedSemester === sem
                        ? "bg-[#0050A0] text-white border-[#0050A0]"
                        : "bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200"
                    }`}
                    id={`sem-tourism-btn-${sem}`}
                  >
                    Semester {sem}
                  </button>
                ))}
              </div>

              {/* Course Render Panel */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-100 p-5 md:p-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-primary border-b border-neutral-100 pb-3 mb-4">
                  <BookOpen size={18} />
                  <span className="font-extrabold text-sm uppercase tracking-wider font-heading">
                    MATA KULIAH UNGGULAN SEMESTER {selectedSemester}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CURRICULUM_TOURISM.find(c => c.semester === selectedSemester)?.courses.map((course, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100 hover:bg-yellow-50/40 transition">
                      <span className="w-5 h-5 bg-primary/10 text-primary font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-neutral-700 leading-tight">
                        {course}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FASILITAS KAMPUS */}
        {activeTab === "fasilitas" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* List side selectors */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-black text-slate-400 tracking-wider block uppercase mb-2">
                PILIH RUANG LABORATORIUM
              </span>
              <div className="flex flex-col gap-1.5 md:gap-2">
                {FACILITIES.map((fac) => (
                  <button
                    key={fac.id}
                    onClick={() => setSelectedLabId(fac.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border font-bold text-xs md:text-sm transition flex justify-between items-center cursor-pointer shadow-sm ${
                      selectedLabId === fac.id
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    }`}
                    id={`lab-btn-${fac.id}`}
                  >
                    <span>{fac.name.split(" (")[0]}</span>
                    <span className="text-xs">➔</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Simulator Frame Panel */}
            <div className="lg:col-span-8 bg-white border border-neutral-100 shadow-xl rounded-2xl overflow-hidden flex flex-col justify-between animate-in fade-in duration-300">
              <div className="h-56 relative w-full overflow-hidden">
                <img
                  src={activeLab.imageUrl}
                  alt={activeLab.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-accent text-primary text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow-sm">
                    SIMULATOR LAB AKTIF
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold mt-1.5 font-heading text-shadow-sm select-none">
                    {activeLab.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-semibold">
                  {activeLab.description}
                </p>

                <div className="pt-3 border-t border-neutral-100">
                  <span className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-2">
                    ALAT-ALAT PRAKTIK & FITUR UTAMA:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeLab.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                        <span className="text-accent text-sm">✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KALENDER AKADEMIK */}
        {activeTab === "kalender" && (
          <div className="space-y-8 max-w-4xl mx-auto bg-white p-6 rounded-2xl border border-neutral-100 shadow-md">
            <div className="text-center space-y-1">
              <Calendar className="text-primary mx-auto" size={32} />
              <h3 className="text-md md:text-lg font-black text-neutral-900 font-heading">
                Agenda Utama Kalender Akademik TA 2026/2027
              </h3>
              <p className="text-[11px] text-neutral-500 font-semibold">
                Silakan catat tanggal penting perkuliahan aktif Semester Ganjil & Genap berikut ini:
              </p>
            </div>

            {/* Timetable table layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-normal border-collapse">
                <thead>
                  <tr className="bg-primary text-white font-extrabold text-left border-b border-primary/20">
                    <th className="p-3 rounded-l-lg">Agenda Kegiatan</th>
                    <th className="p-3">Semester Ganjil </th>
                    <th className="p-3 rounded-r-lg">Semester Genap </th>
                  </tr>
                </thead>
                <tbody className="text-neutral-700 font-bold divide-y divide-neutral-100">
                  <tr className="hover:bg-neutral-50 transition">
                    <td className="p-3 text-primary">Pendaftaran & Daftar Ulang Mahasiswa Baru</td>
                    <td className="p-3">Juli - Agustus 2026</td>
                    <td className="p-3">Januari - Februari 2027</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 transition">
                    <td className="p-3 text-primary">Orientasi Kampus (PKKMB)</td>
                    <td className="p-3">01 - 04 September 2026</td>
                    <td className="p-3">-</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 transition">
                    <td className="p-3 text-primary">Pengisian KRS & Pembayaran SPP Tahap I</td>
                    <td className="p-3">07 - 11 September 2026</td>
                    <td className="p-3">15 - 19 Februari 2027</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 transition">
                    <td className="p-3 text-primary">Perkuliahan Aktif Kelas & Praktik Dapur</td>
                    <td className="p-3">14 Sep - 18 Des 2026</td>
                    <td className="p-3">22 Feb - 11 Juni 2027</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 transition">
                    <td className="p-3 text-primary">Ujian Tengah Semester (UTS)</td>
                    <td className="p-3">26 - 30 Oktober 2026</td>
                    <td className="p-3">12 - 16 April 2027</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 transition">
                    <td className="p-3 text-primary">Ujian Akhir Semester (UAS) / Uji Kompetensi</td>
                    <td className="p-3">21 - 24 Desember 2026</td>
                    <td className="p-3">14 - 18 Juni 2027</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 transition text-red-500 font-bold bg-[#FFF5E6]">
                    <td className="p-3">Prosesi Wisuda Akbar & BNSP Certification</td>
                    <td className="p-3" colSpan={2}>Oktober 2026 (Sekali Setahun)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-[11px] leading-relaxed text-zinc-500 font-medium">
              * Perubahan jadwal opsional dapat dipicu oleh kebijakan dinamis kementerian terkait. Mahasiswa diimbau untuk memantau papan pengumuman virtual atau berkonsultasi langsung ke Bidang Akademik di Kampus Cempaka Putih.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
