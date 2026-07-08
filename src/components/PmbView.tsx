import React, { useState, useRef } from "react";
import { Check, Edit, User, Mail, GraduationCap, Building, Phone, Calendar, ClipboardCheck, Sparkles, Printer, FileText, Download, CheckSquare } from "lucide-react";
import { submitPmbApplication } from "../lib/dbService";
import { LanguageCode, createTranslator } from "../lib/translations";

interface PmbViewProps {
  activeTab: string;
  currentLang?: LanguageCode;
}

export default function PmbView({ activeTab, currentLang = "ID" }: PmbViewProps) {
  const t = createTranslator(currentLang);
  // Estimator State
  const [selectedJalur, setSelectedJalur] = useState<string>("reguler");
  const [scholarshipTier, setScholarshipTier] = useState<number>(0); // 0%, 25%, 50%, 100%

  // Multi-step Registration Form State
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [registrationCard, setRegistrationCard] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [highSchool, setHighSchool] = useState<string>("");
  const [gradYear, setGradYear] = useState<string>("2026");
  const [prodi, setProdi] = useState<string>("Perhotelan");
  const [major, setMajor] = useState<string>("D3 Perhotelan");
  const [classType, setClassType] = useState<string>("Reguler Pagi");

  // Drag and Drop mockup state
  const [filesUploaded, setFilesUploaded] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Financial Pricing calculations
  const baseSPM = selectedJalur === "karyawan" ? 4800000 : 4500000;
  const baseSPP = selectedJalur === "karyawan" ? 6800000 : 6200000;
  const baseUniform = 3200000;

  const appliedSPM = Math.round(baseSPM * (1 - scholarshipTier / 100));
  const appliedSPP = Math.round(baseSPP * (1 - scholarshipTier / 100));
  const totalCost = appliedSPM + (appliedSPP * 6) + baseUniform;

  const formatIDR = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !highSchool) {
      alert("Harap lengkapi semua isian formulir terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    const registrationId = "APJ-" + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    try {
      // Save directly to the Firestore collection
      await submitPmbApplication({
        applicationId: registrationId,
        name,
        email,
        phone,
        highSchool,
        gradYear,
        major,
        classType
      });
      
      setRegistrationCard({
        id: registrationId,
        date: currentDate,
        name,
        email,
        phone,
        highSchool,
        gradYear,
        major,
        classType,
        examDate: "Sabtu, 11 Juli 2026 pukul 09:00 WIB"
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Pendaftaran gagal terkirim ke server database kami. Harap cek sambungan internet Anda.");
    } finally {
      setSubmitting(false);
    }
  };


  // Reset Form
  const handleResetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setHighSchool("");
    setProdi("Perhotelan");
    setMajor("D3 Perhotelan");
    setStep(1);
    setIsSubmitted(false);
    setRegistrationCard(null);
    setFilesUploaded(false);
  };

  const titlesDict: Record<LanguageCode, Record<string, string>> = {
    ID: {
      tag: "PENERIMAAN MAHASISWA BARU (PMB)",
      syarat: "Jalur Seleksi & Persyaratan Utama",
      biaya: "Kalkulator Estimasi Biaya Kuliah APJ",
      daftar: "Formulir Pendaftaran Online Calon Mahasiswa",
      syaratDesc: "Kami menyediakan berbagai akses jalur pendaftaran beasiswa dan kelas karyawan fleksibel.",
      biayaDesc: "Transparansi penganggaran pendidikan tinggi pariwisata terpadu, tanpa biaya praktik tersembunyi.",
      daftarDesc: "Daftarkan diri Anda dalam waktu 3 menit untuk mengunci kuota dan mendapatkan Kartu Ujian Masuk instan!"
    },
    EN: {
      tag: "NEW STUDENT ADMISSIONS (PMB)",
      syarat: "Admission Paths & Key Requirements",
      biaya: "APJ College Tuition Fees Estimator",
      daftar: "Candidate Student Online Registration Form",
      syaratDesc: "We provide scholarship enrollment paths and flexible professional working classes.",
      biayaDesc: "Completely transparent educational budgeting packages with absolute zero hidden lab fees.",
      daftarDesc: "Submit your basic details in 3 minutes to secure a seat and download your temporary exam ticket!"
    },
    JPN: {
      tag: "新規学生募集・出願案内 (PMB)",
      syarat: "募集選考方法・主要な出願応募条件",
      biaya: "学術授業料・教育費用かんたん見積計算ツール",
      daftar: "2026年度 新入学オンライン出願ステーション",
      syaratDesc: "各種奨学金特典ルートや、働きながら学べる夜間・土曜クラスなどを設けています。",
      biayaDesc: "すべての実習費用が含まれた、後からの追加徴収のない安心・透明な学費提示システム。",
      daftarDesc: "わずか3分の入力で合格枠を事前確保し、即時に受験用仮カードを自動生成します。"
    },
    Mandarin: {
      tag: "新生入学招生办 (PMB)",
      syarat: "招生录取通道分类及核心申请条件",
      biaya: "APJ 学费及实践开销在线预估器",
      daftar: "大专预备方向新生在线快捷入学申请表",
      syaratDesc: "提供多元化的特惠学术助学金通道以及授课时间更灵活的在职专业提升班。",
      biayaDesc: "全流程透明的文旅实践高等职业教育预算，承诺中途不含有任何隐性实践耗材收费。",
      daftarDesc: "仅需 3 分钟在线填写，即可优先抢占录取指标并秒级生成入学会考准考证！"
    },
    Arab: {
      tag: "بوابة القبول والتسجيل للطلبة الجدد (PMB)",
      syarat: "خطوط القبول والمسارات مع الشروط الأساسية",
      biaya: "حاسبة تكاليف ومصروفات الدراسة الفندقية بالأكاديمية",
      daftar: "استمارة التسجيل الفوري الإلكترونية للطلبة الجدد",
      syaratDesc: "نقدم خططاً دراسية ميسرة للحصول على المنح ومسارات مرنة تلائم الموظفين والعاملين.",
      biayaDesc: "نهج شفاف لإدارة ورصد ميزانية التعليم العالي التخصصي دون رسوم عملية خفية.",
      daftarDesc: "سجل بياناتك الأساسية خلال ٣ دقائق لحجز مقعدك والحصول على بطاقة الامتحان فوراً!"
    },
    Jerman: {
      tag: "NEUE STUDENTENZULASSUNGEN (PMB)",
      syarat: "Zulassungspfade & Grundvoraussetzungen",
      biaya: "APJ Studiengebühren-Tarifrechner",
      daftar: "Online-Bewerbungsformular für angehende Studenten",
      syaratDesc: "Wir bieten vielfältige Bewerbungswege über Stipendien und flexible berufsbegleitende Klassen.",
      biayaDesc: "Volle Transparenz bei Studiengebühren ohne versteckte Kosten für Praxiskurse im Labor.",
      daftarDesc: "Bewerben Sie sich in nur 3 Minuten, um Ihren Platz zu sichern und Ihre Einladung zu generieren!"
    },
    Turki: {
      tag: "YENİ ÖĞRENCİ KABÜLLERİ (PMB)",
      syarat: "Giriş Yolları ve Temel Başvuru Şartları",
      biaya: "APJ Kolej Harç ve Öğretim Ücreti Hesaplayıcı",
      daftar: "Aday Öğrenciler İçin Çevrimiçi Kayıt Başvurusu",
      syaratDesc: "Çeşitli burs olanakları, dikey geçiş yolları ve esnek çalışma saatleri olan sınıflar sunuyoruz.",
      biayaDesc: "Gizli laboratuvar ve uygulama masrafları barındırmayan şeffaf eğitim bütçesi paketleri.",
      daftarDesc: "Kotanızı kilitlemek ve anında geçici giriş kartı almak için sadece 3 dakikada başvurun!"
    },
    Korea: {
      tag: "신입생 수시 및 정시 모집 안내 (PMB)",
      syarat: "주요 입학 전형 구분론 및 심사 구비 서류",
      biaya: "APJ 한 학기 등록금 및 보육 실무 비용 계산기",
      daftar: "입학 지원자 3분 초간편 온라인 원서 접수처",
      syaratDesc: "우수 고교 내신 전형, 대외 수상 장학생 패थ, 야간 위탁 직장인 특별 과정 운영.",
      biayaDesc: "모든 기자재 식재료 실습비 전액이 포함된 정액 투명 회계, 수수료 불투명 중대 입금 제외.",
      daftarDesc: "단 3분 만에 기본 양식을 기입하여 최종 승인 정원을 안착시키고 임시 수험표를 출력하세요!"
    }
  };

  const getPmbText = (fieldKey: string) => {
    const lang = titlesDict[currentLang] || titlesDict["ID"];
    return lang[fieldKey] || titlesDict["ID"][fieldKey] || "";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="border-b border-neutral-100 pb-6 mb-8 text-center md:text-left space-y-2">
        <span className="text-xs font-black text-primary tracking-widest uppercase block">
          {getPmbText("tag")}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
          {getPmbText(activeTab)}
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 font-semibold leading-relaxed">
          {getPmbText(activeTab + "Desc")}
        </p>
      </div>

      <div className="w-full">
        {/* TAB 1: SYARAT PERSYARATAN */}
        {activeTab === "syarat" && (
          <div className="space-y-10">
            {/* Paths Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Path 1: Reguler */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-md space-y-4 hover:-translate-y-1 transition duration-200">
                <div className="bg-primary/5 text-primary p-3 rounded-xl w-12 h-12 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="text-sm md:text-md font-extrabold text-neutral-900 font-heading">JALUR SELEKSI REGULER</h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                  Jalur masuk standar bagi lulusan SMA/SMK/MA sederajat untuk mengikuti perkuliahan reguler pagi. Penilaian didasarkan pada tes kecap sains psikotes umum serta sesi wawancara (interview) kepribadian ringan.
                </p>
              </div>

              {/* Path 2: Beasiswa Prestasi */}
              <div className="bg-[#FFFCEF] p-6 rounded-2xl border border-accent shadow-sm space-y-4 hover:-translate-y-1 transition duration-200">
                <div className="bg-[#0050A0] text-accent p-3 rounded-xl w-12 h-12 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="text-sm md:text-md font-extrabold text-primary font-heading">JALUR BEASISWA PRESTASI RAPOR</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                  Bebas biaya seleksi masuk dan mendapat potongan biaya kuliah sebesar 25% hingga 100% dari SPM/SPP. Syaratnya cukup melampirkan transkip nilai rapor kelas 10-12 dengan rata-rata nilai minimal 80.
                </p>
              </div>

              {/* Path 3: Kelas Karyawan */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-md space-y-4 hover:-translate-y-1 transition duration-200">
                <div className="bg-primary/5 text-primary p-3 rounded-xl w-12 h-12 flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="text-sm md:text-md font-extrabold text-neutral-900 font-heading">KELAS KARYAWAN & EKSEKUTIF</h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                  Sangat cocok bagi profesional, staf hotel, atau pekerja pariwisata aktif yang ingin meng-upgrade kualifikasi pendidikan ke jenjang D3 diploma tanpa mengorbankan waktu kerja produktif. Kuliah tatap muka berlangsung malam hari atau hari Sabtu.
                </p>
              </div>
            </div>

            {/* General Requirement Checklists */}
            <div className="bg-neutral-50 rounded-2xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
              <div className="text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-primary tracking-widest uppercase">
                  <CheckSquare size={16} />
                  PERSYARATAN ADMINISTRASI CALON MAHASISWA
                </span>
                <h4 className="text-md md:text-lg font-black text-neutral-900 font-heading mt-1">
                  Berkas Kelayakan yang Wajib Dipersiapkan
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3 items-start text-xs font-semibold text-neutral-600 leading-relaxed">
                  <span className="text-primary text-md">✔</span>
                  <span>Mengisi formulir pendaftaran secara online di portal PMB APJ.</span>
                </div>
                <div className="flex gap-3 items-start text-xs font-semibold text-neutral-600 leading-relaxed">
                  <span className="text-primary text-md">✔</span>
                  <span>Fotokopi ijazah legalkan SMA/SMK/MA sederajat (atau Surat Keterangan Lulus / SKL bagi lulusan 2026).</span>
                </div>
                <div className="flex gap-3 items-start text-xs font-semibold text-neutral-600 leading-relaxed">
                  <span className="text-primary text-md">✔</span>
                  <span>Fotokopi Kartu Tanda Penduduk (KTP) / Kartu Pelajar aktif dan Kartu Keluarga (KK).</span>
                </div>
                <div className="flex gap-3 items-start text-xs font-semibold text-neutral-600 leading-relaxed">
                  <span className="text-primary text-md">✔</span>
                  <span>Pasfoto berwarna ukuran 3x4 sebanyak 2 lembar (latar belakang biru/merah bebas).</span>
                </div>
                <div className="col-span-1 sm:col-span-2 flex gap-3 items-start text-xs font-semibold text-neutral-600 leading-relaxed p-3 bg-[#FFF5E6] rounded-lg border border-[#FFDCA0]">
                  <span className="text-red-500 text-md">⚠</span>
                  <span className="text-primary">
                    **Syarat Khusus**: Calon mahasiswa wajib menyerahkan surat keterangan sehat dan bebas buta warna dari puskesmas / klinik resmi sebagai prasyarat praktik aman di dapur & pemanduan pariwisata.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ESTIMATOR BIAYA KULIAH */}
        {activeTab === "biaya" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Planner Inputs Panel */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-100 shadow-md space-y-6">
              <div>
                <span className="text-xs font-black text-slate-400 tracking-wider uppercase block mb-1">
                  PENGATURAN SIMULASI BIAYA
                </span>
                <h3 className="text-md md:text-lg font-black text-[#0050A0] font-heading leading-tight">
                  Kalkulasi Finansial Mandiri Anda
                </h3>
              </div>

              {/* Jalur selection input button */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-neutral-800 uppercase">
                  Pilih Jalur Masuk Kelas:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedJalur("reguler")}
                    className={`p-3 rounded-lg border text-xs font-black transition cursor-pointer text-center ${
                      selectedJalur === "reguler"
                        ? "bg-primary text-white border-primary"
                        : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                    }`}
                    id="jalur-reg-btn"
                  >
                    REGULER PAGI
                  </button>
                  <button
                    onClick={() => setSelectedJalur("karyawan")}
                    className={`p-3 rounded-lg border text-xs font-black transition cursor-pointer text-center ${
                      selectedJalur === "karyawan"
                        ? "bg-primary text-white border-primary"
                        : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                    }`}
                    id="jalur-kary-btn"
                  >
                    KELAS KARYAWAN
                  </button>
                </div>
              </div>

              {/* Scholarship level range selection */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-neutral-800 uppercase">
                  Potongan Beasiswa Nilai / Rapor:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 25, 50, 100].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setScholarshipTier(tier)}
                      className={`py-2 px-1 rounded border text-[11px] font-extrabold tracking-tighter transition cursor-pointer text-center ${
                        scholarshipTier === tier
                          ? "bg-accent text-primary border-accent"
                          : "bg-neutral-50 border-neutral-200 text-zinc-500 hover:bg-neutral-100"
                      }`}
                      id={`sch-tier-btn-${tier}`}
                    >
                      {tier === 0 ? "Non-Beasiswa" : `Diskon ${tier}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost notice memo */}
              <div className="p-3 bg-[#FFF5E6] rounded-xl border border-accent/60 text-[10px] leading-relaxed text-zinc-500 font-medium">
                * Keterangan: Seluruh biaya di APJ sudah mencakup sarana praktikum laboran, pengadaan bahan masakan praktik dapur perhotelan, pemakaian internet giganet, KRS, dan administrasi pustaka. **Tidak ada biaya pungutan praktik tambahan berkala.**
              </div>
            </div>

            {/* Display Calculator Outcome Output Panel */}
            <div className="lg:col-span-7 bg-[#FFFCEF] border border-accent/60 shadow-xl rounded-2xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-accent/30 pb-4">
                <span className="bg-primary text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-sm">
                  RINCIAN SIMULASI BIAYA KULIAH APJ
                </span>
                <h4 className="text-xl font-extrabold text-primary font-heading mt-2.5">
                  Estimasi Rekap Anggaran Studi
                </h4>
              </div>

              <div className="space-y-4 text-xs font-bold text-neutral-700">
                <div className="flex justify-between items-center py-2 border-b border-accent/20">
                  <span className="text-neutral-500 leading-none">1. Dana Pembangunan (SPM - sekali bayar):</span>
                  <span className="text-primary font-heading text-right">{formatIDR(appliedSPM)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-accent/20">
                  <span className="text-neutral-500 leading-none">2. Biaya Kuliah (SPP) per Semester:</span>
                  <span className="text-primary font-heading text-right">{formatIDR(appliedSPP)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#ffdca0]/40">
                  <span className="text-neutral-500 leading-none">3. Atribut Seragam & Atribut Praktek (sekali beli):</span>
                  <span className="text-primary font-heading text-right">{formatIDR(baseUniform)}</span>
                </div>
                
                {/* Total sum calculations */}
                <div className="bg-primary text-white rounded-xl p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 shadow gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-accent leading-none tracking-widest uppercase block">
                      TOTAL ESTIMASI STUDY JENJANG D3
                    </span>
                    <span className="text-[11px] font-normal leading-relaxed text-blue-200 block">
                      Perkiraan akumulasi total biaya untuk 3 tahun kuliah (6 semester)
                    </span>
                  </div>
                  <span className="text-xl font-black font-heading text-accent min-w-[130px] text-right">
                    {formatIDR(totalCost)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleFormSubmit} // Mock redirection to register tab
                  className="w-full bg-[#0050A0] text-white hover:bg-blue-800 transition font-bold text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  id="calc-cta-register-btn"
                >
                  Daftarkan Diri & Kunci Kuota Gelombang Ini ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ONLINE REGISTER FORM WITH CARD PREVIEW */}
        {activeTab === "daftar" && (
          <div className="max-w-3xl mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-neutral-100 shadow-xl p-6 md:p-8 space-y-6">
                <div className="border-b border-neutral-100 pb-4 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-primary font-black uppercase tracking-wider">
                      <Sparkles size={14} />
                      PMB ONLINE PORTAL REGISTRASI
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 font-heading">
                      Evaluasi Formulir Masuk Secara Virtual
                    </h3>
                  </div>
                  <span className="bg-primary/5 text-primary text-xs font-extrabold px-3 py-1 rounded">
                    Tahapan {step} dari 2
                  </span>
                </div>

                {/* Multisteps fields Render */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold text-neutral-800 uppercase flex items-center gap-1.5">
                        <User size={14} className="text-neutral-400" />
                        Nama Lengkap Calon Mahasiswa (Sesuai Ijazah)*:
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Muhammad Faisal Syah"
                        className="w-full px-4 py-2.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-primary font-semibold bg-neutral-50/50 focus:bg-white transition"
                        id="form-name-input"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-neutral-800 uppercase flex items-center gap-1.5">
                          <Mail size={14} className="text-neutral-400" />
                          Alamat Email Aktif*:
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="faisal@example.com"
                          className="w-full px-4 py-2.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-primary font-semibold bg-neutral-50/50 focus:bg-white transition"
                          id="form-email-input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-neutral-800 uppercase flex items-center gap-1.5">
                          <Phone size={14} className="text-neutral-400" />
                          Nomer WhatsApp Aktif*:
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0812XXXXXXXX"
                          className="w-full px-4 py-2.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-primary font-semibold bg-neutral-50/50 focus:bg-white transition"
                          id="form-phone-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-neutral-800 uppercase flex items-center gap-1.5">
                          <Building size={14} className="text-neutral-400" />
                          Asal Sekolah (SMA/SMK/MA)*:
                        </label>
                        <input
                          type="text"
                          required
                          value={highSchool}
                          onChange={(e) => setHighSchool(e.target.value)}
                          placeholder="Contoh: SMKN 57 Jakarta"
                          className="w-full px-4 py-2.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-primary font-semibold bg-neutral-50/50 focus:bg-white transition"
                          id="form-school-input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-neutral-800 uppercase flex items-center gap-1.5">
                          Tahun Kelulusan*:
                        </label>
                        <select
                          value={gradYear}
                          onChange={(e) => setGradYear(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-primary font-semibold bg-neutral-50/50 focus:bg-white transition"
                          id="form-year-select"
                        >
                          <option value="2026">Lulusan Tahun 2026</option>
                          <option value="2025">Lulusan Tahun 2025</option>
                          <option value="2024">Lulusan Tahun 2024</option>
                          <option value="Sebelumnya">Lulusan Tahun Sebelumnya</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (name && email && phone && highSchool) setStep(2);
                          else alert("Harap isi semua kolom bertanda bintang (*) dahulu.");
                        }}
                        className="w-full bg-[#0050A0] text-white font-bold text-xs py-3 rounded-lg hover:bg-blue-800 transition cursor-pointer flex items-center justify-center gap-2 shadow"
                        id="form-next-btn"
                      >
                        Tahapan Lanjut: Pilihan Studi & Berkas ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* Tahap 2 detail pendaftaran choice and drag-drop files upload */}
                {step === 2 && (
                  <div className="space-y-5 animate-in slide-in-from-right-3 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-extrabold text-neutral-800 uppercase">
                            Jenjang Studi*:
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {["D1", "D2", "D3", "D4"].map((j) => {
                              const isD3 = j === "D3";
                              return (
                                <div
                                  key={j}
                                  className={`py-1.5 px-1 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${
                                    isD3
                                      ? "bg-blue-50 text-blue-800 border-blue-400 ring-2 ring-blue-400/20 shadow-sm"
                                      : "bg-neutral-100 text-neutral-400 border-neutral-200/60 opacity-60"
                                  }`}
                                >
                                  <span className="text-[11px] font-bold">{j}</span>
                                  <span className="text-[7px] font-black uppercase tracking-wider scale-90 mt-0.5 opacity-80">
                                    {isD3 ? "ON" : "OFF"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-extrabold text-neutral-800 uppercase">
                            Program Studi*:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "Perhotelan", label: "Perhotelan" },
                              { id: "Usaha Pariwisata", label: "Usaha Pariwisata" }
                            ].map((p) => {
                              const isSelected = prodi === p.id;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => {
                                    setProdi(p.id);
                                    setMajor(`D3 ${p.id}`);
                                  }}
                                  className={`py-2 px-2 text-[11px] font-bold rounded-lg border text-center transition duration-150 cursor-pointer flex items-center justify-center gap-1 flex-grow ${
                                    isSelected
                                      ? "bg-[#0050A0] text-white border-[#0050A0] shadow-md ring-2 ring-blue-500/20"
                                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900"
                                  }`}
                                >
                                  {isSelected && <span className="text-[10px]">✨</span>}
                                  <span>{p.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-neutral-800 uppercase">
                          Jenis Kelas Perkuliahan*:
                        </label>
                        <select
                          value={classType}
                          onChange={(e) => setClassType(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-primary font-semibold bg-neutral-50/50 transition"
                          id="form-classtype-select"
                        >
                          <option value="Reguler Pagi">Kelas Reguler Pagi (Aktif Senin-Jumat)</option>
                          <option value="Karyawan Sabtu">Kelas Karyawan Eksekutif (Sabtu & Malam)</option>
                        </select>
                      </div>
                    </div>

                    {/* Drag and Drop Mockup Upload Box */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold text-neutral-800 uppercase">
                        Unggah Scan Rapor / SKL (SIMULASI)*:
                      </label>
                      <div 
                        onClick={() => setFilesUploaded(true)}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                          filesUploaded 
                            ? "bg-green-50/50 border-green-400 text-green-800" 
                            : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-500"
                        }`}
                        id="form-upload-area"
                      >
                        {filesUploaded ? (
                          <div className="space-y-1">
                            <span className="text-2xl block">🎉</span>
                            <span className="block text-xs font-bold font-medium leading-none">BERKAS SCAN_BAHAN_MASUK.PDF BERHASIL DIUNGGAH!</span>
                            <span className="block text-[10px] text-green-600 leading-relaxed">Sistem seleksi digital telah memverifikasi ukuran dokumen Anda.</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-3xl block">📁</span>
                            <span className="block text-xs font-bold leading-none">Drag & Drop atau Klik untuk Mengunggah Berkas</span>
                            <span className="block text-[10px] text-zinc-400 leading-relaxed">Mendukung format PDF, JPG, PNG (Maks 5 MB)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form navigation controls buttons */}
                    <div className="flex gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs py-3 rounded-lg transition cursor-pointer text-center"
                        id="form-back-btn"
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-2/3 ${submitting ? "bg-neutral-400 cursor-not-allowed" : "bg-[#0a559e] hover:bg-blue-800"} text-white font-black text-xs py-3 rounded-lg transition cursor-pointer text-center shadow`}
                        id="form-submit-btn"
                      >
                        {submitting ? "Menyimpan ke Secure Database..." : "Kirim Pendaftaran & Cetak Tiket Ujian Masuk"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              /* CARD PREVIEW OUTPUT (Printable Admissions examination ticket) */
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="bg-green-100 border border-green-200 text-green-800 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-lg">🎉</span>
                  <div className="text-xs">
                    <span className="block font-black uppercase tracking-wider">REGISTRASI AWAL ONLINE DISAPROVE SUCCESS!</span>
                    <span className="block font-medium leading-relaxed mt-0.5">Berkas dan formulir Anda telah direkam di pangkalan data virtual PMB APJ. Silakan simpan / cetak Kartu Ujian Saringan Masuk resmi di bawah ini:</span>
                  </div>
                </div>

                {/* Printable Exam Ticket Card */}
                <div 
                  ref={cardRef} 
                  className="bg-white border-2 border-primary rounded-3xl overflow-hidden shadow-2xl relative"
                  id="print-examination-card"
                >
                  {/* Card Header styling */}
                  <div className="bg-primary text-white p-5 flex justify-between items-center border-b-4 border-accent">
                    <div className="flex items-center gap-3">
                      <img 
                        src="/input_file_1.png" 
                        alt="APJ Emblem" 
                        className="h-12 w-12 object-contain bg-white rounded-full p-1 border-2 border-accent" 
                      />
                      <div>
                        <h4 className="font-extrabold text-sm font-heading leading-tight tracking-wider">AKADEMI PARIWISATA JAKARTA</h4>
                        <span className="text-[9px] font-bold tracking-widest text-accent uppercase">KARTU UJIAN SARINGAN MASUK TA 2026/2027</span>
                      </div>
                    </div>
                    <span className="text-xs font-black bg-blue-900 border border-blue-800 text-accent px-3 py-1.5 rounded uppercase tracking-widest">
                      {registrationCard?.id}
                    </span>
                  </div>

                  {/* Card Content body */}
                  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8 space-y-4">
                      {/* Grid lists with exact variables */}
                      <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">Nama Pendaftar:</span>
                        <span className="text-xs text-neutral-800 font-black col-span-2 select-all">{registrationCard?.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">Asal Sekolah:</span>
                        <span className="text-xs text-neutral-700 font-bold col-span-2">{registrationCard?.highSchool} ({registrationCard?.gradYear})</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">Pilihan Jurusan:</span>
                        <span className="text-xs text-primary font-black col-span-2">{registrationCard?.major}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">Format Kelas:</span>
                        <span className="text-xs text-neutral-700 font-bold col-span-2">{registrationCard?.classType}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1.5 bg-[#FFFCEF] border border-accent p-3 rounded-xl">
                        <span className="text-[10px] text-primary font-extrabold uppercase leading-tight">Waktu Seleksi / Tes Terjadwal:</span>
                        <span className="text-[11px] text-red-500 font-black col-span-2 leading-tight">{registrationCard?.examDate}</span>
                      </div>
                    </div>

                    {/* QR Code generator box representation */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                      <div className="w-28 h-28 bg-white border border-neutral-200 rounded flex flex-col items-center justify-center p-2 relative shadow-inner select-none">
                        {/* Simulated QR Code via block segments */}
                        <div className="w-full h-full flex flex-wrap gap-0.5 opacity-90">
                          {Array.from({ length: 64 }).map((_, idx) => {
                            const isFilled = (idx * 7 + 13) % 4 === 0 || idx % 9 === 0 || (idx > 12 && idx < 28) || idx === 0 || idx === 7 || idx === 56 || idx === 63;
                            return (
                              <div key={idx} className={`w-[11px] h-[11px] ${isFilled ? "bg-neutral-800" : "bg-transparent"}`}></div>
                            );
                          })}
                        </div>
                        <div className="absolute inset-0 m-auto w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center font-bold text-[9px] text-primary">
                          APJ
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                        VERIFIED SEAL DIGITAL APJ
                      </span>
                    </div>
                  </div>

                  {/* Card footer advice list */}
                  <div className="bg-neutral-50 p-4 border-t border-neutral-100 text-[10px] text-neutral-500 font-semibold leading-relaxed px-6">
                    * Harap bawa cetak Kertas Kartu Ujian ini dan pensil 2B saat pelaksanaan seleksi online/offline. Panitia pmb akan memvalidasi nomer pendaftaran **{registrationCard?.id}** di lobby utama Kampus Cempaka Putih atau ruang seleksi wawancara virtual.
                  </div>
                </div>

                {/* Final controls buttons */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="bg-primary text-white hover:bg-blue-800 transition font-bold text-xs py-3 px-6 rounded-lg flex items-center gap-2 cursor-pointer shadow"
                    id="btn-print-card"
                  >
                    <Printer size={15} />
                    Cetak Kartu Ujian (PDF)
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 font-bold text-xs py-3 px-6 rounded-lg cursor-pointer"
                    id="btn-register-again"
                  >
                    Daftar Kembali
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
