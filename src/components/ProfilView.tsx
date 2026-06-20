import React, { useState, useEffect } from "react";
import { BookOpen, Award, Users, ShieldAlert, Sparkles, Building2, Eye, Compass, Trophy } from "lucide-react";
import { SEJARAH_MILIENSE, BOARD_MEMBERS, LAMBANG_EXPLANATION, VISI_MISI } from "../data/apjData";
import { getDbBoardMembers, DbBoardMember } from "../lib/dbService";
import { LanguageCode, createTranslator } from "../lib/translations";

interface ProfilViewProps {
  activeTab: string;
  currentLang?: LanguageCode;
}

export default function ProfilView({ activeTab, currentLang = "ID" }: ProfilViewProps) {
  const t = createTranslator(currentLang);
  const [selectedLambangPart, setSelectedLambangPart] = useState<number>(0);
  const [boardMembers, setBoardMembers] = useState<DbBoardMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await getDbBoardMembers();
        if (active) {
          setBoardMembers(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading board members in view: ", err);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [activeTab]);

  const titlesDict: Record<LanguageCode, Record<string, string>> = {
    ID: {
      tag: "PROFIL KAMPUS APJ",
      sejarah: "Sejarah Perjalanan Serta Kiprah APJ",
      visimisi: "Visi, Misi & Sasaran Mutu Strategis",
      organisasi: "Struktur Pimpinan & Manajemen",
      lambang: "Makna Lambang Kebanggaan APJ",
      sejarahDesc: "Sejak berdiri pada bulan Juni Tahun 1972, APJ telah menapaki jalan keunggulan mendidik ahli pariwisata.",
      visimisiDesc: "Target strategis kami menyelenggarakan pendidikan tinggi bermutu demi mencapai jangkauan global pada 2030.",
      organisasiDesc: "Susunan Akademisi, Praktisi, dan Manajemen yang bersinergi memajukan visi pendidikan tinggi pariwisata.",
      lambangDesc: "Simbol kebanggaan sebagai wadah menimba kecakapan pariwisata berlandaskan Pancasila di ibukota Jakarta."
    },
    EN: {
      tag: "APJ CAMPUS PROFILE",
      sejarah: "Historic Milestones & Legacy of APJ",
      visimisi: "Vision, Mission & Strategic Quality Goals",
      organisasi: "Executive Board & Academic Management Structure",
      lambang: "Meaning of APJ's Prestigious Crest & Colors",
      sejarahDesc: "Since its founding in June 1972, APJ has forged a path of absolute excellence in vocational tourism.",
      visimisiDesc: "Our strategic targets are to provide premium vocational education for international recognition by 2030.",
      organisasiDesc: "Seamless synergy between scholars, industrial practitioners, and management team to boost our tourism vision.",
      lambangDesc: "The proud symbol of nurturing hospitality talents based on high state ethics in the heart of Jakarta."
    },
    JPN: {
      tag: "APJ 大学プロフィール",
      sejarah: "APJの歩みと半世紀におよぶ歴史",
      visimisi: "大学ビジョン、理念および将来設計と品質目標",
      organisasi: "理事会構成・教職員および経営・管理体制",
      lambang: "誇り高きAPJの学章とシンボルマークの解説",
      sejarahDesc: "1972年6月の創立以来、APJは一貫して観光学術・実務教育のトップリーダーとして先駆的な路を進んでいます。",
      visimisiDesc: "グローバルな視点を根幹に据え、2030年までに世界的教育品質水準の完全達成を大目標としています。",
      organisasiDesc: "各方面の優れた教員、実務エキスパート、大学管理チームが強固なシナジーを生み、学生を支援します。",
      lambangDesc: "インドネシアの建国思想「パンチャシラ」のもと、ジャカルタでホスピタリティ精神を培う誇りのシンボル。"
    },
    Mandarin: {
      tag: "APJ 学院概况",
      sejarah: "雅加达旅游学院的半世纪辉煌历程及历史沿革",
      visimisi: "办学愿景、核心使命与战略发展蓝图",
      organisasi: "高管团队、院系干部及学术组织架构",
      lambang: "雅加达旅游学院官方徽章与色彩释义",
      sejarahDesc: "自1972年6月创立以来，学院始终致力于提供卓越实用型的高端旅游职业教育。",
      visimisiDesc: "我们立志推进卓越质量教学，确保在 2030 年全面实现广泛国际认可的大战略部署。",
      organisasiDesc: "由资深学者、业界领袖及高水平行政队伍深度协作，共同推动旅游高等教育的革新技术。",
      lambangDesc: "彰显以国家伦理基石为依托、在首都雅加达核心地带培育文旅才俊的庄严印记。"
    },
    Arab: {
      tag: "الملف التعريفي للأكاديمية",
      sejarah: "تاريخ مسيرة ومساهمات أكاديمية جاكرتا للسياحة",
      visimisi: "الرؤية، والرسالة، ومؤشرات الجودة الاستراتيجية",
      organisasi: "الهيكل التنظيمي، ومجلس الإدارة والقيادة الأكاديمية",
      lambang: "المعاني الجليلة لشعار وألوان الأكاديمية الرسمية",
      sejarahDesc: "منذ تأسيسها في يونيو ١٩٧٢، شقت الأكاديمية طريق التميز والريادة في رفد وتعليم كوادر السياحة.",
      visimisiDesc: "تهدف خطتها الاستراتيجية لتوفير تعليم ريادي مميز لتحقيق مكانة عالمية بحلول عام ٢٠٣٠.",
      organisasiDesc: "تناغم وتكامل تام بين الأكاديميين والممارسين وفريق الإدارة لتحقيق أهدافنا للتعليم السياحي.",
      lambangDesc: "تجسيد لقيم غرس وبناء طاقات الضيافة الراسخة في قلب العاصمة جاكرتا."
    },
    Jerman: {
      tag: "APJ CAMPUS-PROFIL",
      sejarah: "Die Meilensteine und das Erbe von APJ",
      visimisi: "Vision, Mission und Strategische Qualitätsziele",
      organisasi: "Vorstand und akademische Führungsstruktur",
      lambang: "Bedeutung des stolzen APJ-Wappens & Farben",
      sejarahDesc: "Seit der Gründung im Juni 1972 blickt APJ auf eine erstklassige Ausbildung im Tourismussektor zurück.",
      visimisiDesc: "Unser strategischer Schwerpunkt liegt auf exzellenter Lehre mit globaler Ausrichtung bis 2030.",
      organisasiDesc: "Das Zusammenspiel aus Wissenschaftlern, Managern und Praktikern fördert unseren Ausbildungserfolg.",
      lambangDesc: "Das Symbol für die Entwicklung von Talenten im Dienstleistungswesen im Herzen der Hauptstadt Jakarta."
    },
    Turki: {
      tag: "APJ KAMPÜS PORTRESİ",
      sejarah: "APJ Tarihçesi, Kilometre Taşları ve Mirasımız",
      visimisi: "Vizyon, Misyon ve Stratejik Kalite Hedeflerimiz",
      organisasi: "Mütevelli Heyeti, Yönetim ve Akademik Şema",
      lambang: "APJ Kurumsal Logosu, Amblemi ve Renklerin Anlamı",
      sejarahDesc: "Haziran 1972'deki kuruluşumuzdan beri nitelikli turizm uzmanları yetiştirerek sektöre yön veriyoruz.",
      visimisiDesc: "2030 yılına kadar küresel tanınırlığa ve en yüksek akademik başarı standartlarına ulaşmayı hedefliyoruz.",
      organisasiDesc: "Turizm rüyamızı gerçekleştirmek üzere akademisyenler ile endüstri profesyonelleri ortak paydada buluşuyor.",
      lambangDesc: "Cakarta'nın kalbinde en yüksek etik ve mesleki değerlerle konaklama liderleri yetiştirmenin sembolü."
    },
    Korea: {
      tag: "APJ 대학 소사",
      sejarah: "APJ 아카데미의 50년 궤적과 찬란한 역사",
      visimisi: "대학 비전, 사명 및 핵심 전략적 가치 체계",
      organisasi: "이사회 구성진, 부처 장 및 행정 관리 체계도",
      lambang: "유서 깊은 APJ 대학의 문장 및 곡선 형태 의미",
      sejarahDesc: "1972년 6월 개교한 이래로 국내외 관광 산업의 핵심 리더 조형에 앞장서 왔습니다.",
      visimisiDesc: "2030년까지 아시아 일류 최고 등급의 고등 실무 표준을 구축하는 것을 핵심 골자로 합니다.",
      organisasiDesc: "명문 교수진, 경영 책임자 및 실무 자문단이 유기적으로 협력하여 교육 성과 창출에 기여합니다.",
      lambangDesc: "수도 자카르타 도심 한가운데에서 인도네시아 건국 이념인 판차실라를 기반으로 삼아 실천합니다."
    }
  };

  const getProfileText = (fieldKey: string) => {
    const lang = titlesDict[currentLang] || titlesDict["ID"];
    return lang[fieldKey] || titlesDict["ID"][fieldKey] || "";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      {/* Page Title Header */}
      <div className="border-b border-neutral-100 pb-6 mb-8 text-center md:text-left space-y-2">
        <span className="text-xs font-black text-primary tracking-widest uppercase block">
          {getProfileText("tag")}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
          {getProfileText(activeTab)}
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 font-semibold leading-relaxed">
          {getProfileText(activeTab + "Desc")}
        </p>
      </div>

      {/* Tabs Contents render */}
      <div className="w-full">
        {/* TAB 1: SEJARAH timeline */}
        {activeTab === "sejarah" && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFFCEF] p-6 rounded-2xl border border-[#FFDCA0]">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary tracking-wider uppercase">
                  <Trophy size={14} className="text-primary" />
                  Lebih dari Setengah Abad Kontribusi
                </span>
                <p className="text-neutral-700 font-medium text-xs md:text-sm leading-relaxed">
                  Didirikan pada tanggal 20 Juni 1972 oleh Yayasan Pendidikan Jayakarta, Akademi Pariwisata Jakarta (APJ) tercatat sebagai salah satu institut diploma pariwisata swasta tertua di DKI Jakarta. 
                </p>
                <p className="text-neutral-700 font-medium text-xs md:text-sm leading-relaxed">
                  Lahir di masa awal pesatnya pertumbuhan penerbangan sipil dan perhotelan nasional, APJ secara konsisten menyuplai puluhan ribu sumber daya manusia operasional bersertifikasi yang berkomitmen tinggi. Kampus kami telah bertransformasi dari tempat belajar sederhana menjadi inkubator pariwisata terpadu berlokasi strategis di Jl. Cempaka Putih Tengah XXXII No. 8, Cempaka Putih, Jakarta Pusat.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative p-3 bg-white rounded-2xl shadow-md border border-neutral-100 max-w-xs text-center space-y-2">
                  <span className="text-4xl">🏅</span>
                  <p className="text-[13px] font-black text-primary font-heading">
                    50+ TAHUN EPISODE EMAS
                  </p>
                  <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                    Menyemai bakat pariwisata, melayani industri hospitality dengan sepenuh hati sejak 1972.
                  </p>
                </div>
              </div>
            </div>

            {/* Vertical timeline */}
            <div className="relative pl-6 md:pl-32 border-l-2 border-primary/20 space-y-12 max-w-3xl mx-auto py-4">
              {SEJARAH_MILIENSE.map((milestone, idx) => (
                <div key={idx} className="relative group">
                  {/* Left Year badge for md screens */}
                  <span className="hidden md:flex absolute -left-44 top-1 w-28 text-right font-black text-2xl text-primary leading-none tracking-tight">
                    {milestone.year}
                  </span>
                  
                  {/* Circular node with transition on timeline border */}
                  <div className="absolute -left-10 md:-left-[138px] top-1.5 bg-white border-2 border-primary w-5 h-5 rounded-full z-10 flex items-center justify-center group-hover:bg-accent transition duration-200">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                  </div>

                  {/* Year badge for mobile screen */}
                  <span className="inline-block md:hidden bg-primary text-white text-[10px] font-bold px-2 py-1 rounded mb-2">
                    {milestone.year}
                  </span>

                  <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm group-hover:shadow-md hover:border-[#FFDCA0] transition duration-200 space-y-1">
                    <h3 className="font-extrabold text-neutral-900 text-sm md:text-md">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: VISI & MISI */}
        {activeTab === "visimisi" && (
          <div className="space-y-10">
            {/* Mission Visi Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visi Block */}
              <div className="bg-gradient-to-br from-primary to-blue-900 text-white p-6 md:p-8 rounded-2xl shadow-xl space-y-4 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-accent text-xs font-black tracking-widest uppercase">
                  <Eye size={16} />
                  VISI INSTITUSI
                </div>
                <p className="text-md md:text-lg font-serif italic text-accent leading-relaxed">
                  &ldquo;{VISI_MISI.visi}&rdquo;
                </p>
                <div className="pt-2 border-t border-white/10 text-neutral-300 text-[11px] leading-relaxed font-semibold">
                  * Visi ini memandu seluruh kurikulum, arah penelitian, dan hubungan eksternal APJ menuju akreditasi unggul berkelas asia tenggara.
                </div>
              </div>

              {/* Misi Block */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-neutral-100 space-y-4">
                <div className="inline-flex items-center gap-2 text-primary text-xs font-black tracking-widest uppercase">
                  <Compass size={16} />
                  MISI STRATEGIS
                </div>
                <div className="space-y-3">
                  {VISI_MISI.misi.map((misiStr, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <span className="bg-primary/5 text-primary font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                        {misiStr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Targets */}
            <div className="bg-[#FFFCEF] border border-accent/60 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="text-center md:text-left space-y-1">
                <span className="inline-flex items-center gap-2 text-primary text-xs font-black tracking-widest uppercase">
                  <Trophy size={16} />
                  SASARAN MUTU AKADEMIK APJ
                </span>
                <h3 className="text-lg md:text-xl font-bold text-neutral-900 font-heading">
                  Standardisasi & Tolok Ukur Keberhasilan Proses Belajar
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                {VISI_MISI.sasaran.map((sas, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-100 flex gap-3 items-start">
                    <span className="text-accent text-lg">💡</span>
                    <p className="text-xs text-neutral-700 leading-relaxed font-semibold">
                      {sas}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STRUKTUR ORGANISASI */}
        {activeTab === "organisasi" && (
          <div className="space-y-12">
            {/* Header APJ */}
            <div className="text-center p-3 max-w-xl mx-auto">
              <p className="text-xs text-neutral-500 leading-relaxed font-bold uppercase tracking-widest">
                BOARD OF MANAGEMENT APJ JAKARTA
              </p>
              <h2 className="text-lg md:text-xl font-black text-neutral-900 font-heading mt-1">
                Sinergi Para Akademisi & Praktisi Industri Hospitality
              </h2>
              <div className="w-16 h-1 bg-accent mx-auto mt-2 rounded"></div>
            </div>

            {/* Hierarchy layout style */}
            <div className="space-y-10">
              {/* Render Helpers for Avatar */}
              {(() => {
                const targetMembers = boardMembers.length > 0 ? boardMembers : [
                  { name: "Assoc. Prof. Kusmayadi", role: "Direktur Akademi Pariwisata Jakarta", education: "S3 Pariwisata Universitas Trisakti", avatar: "👨‍🏫", category: "APJ" as const, order: 1 },
                  { name: "Dra. Herlina Ningrum, M.Par.", role: "Pudir I Bidang Akademik", education: "S2 Hospitality Management STP Bandung", avatar: "👩‍🏫", category: "APJ" as const, order: 2 },
                  { name: "Ir. Bambang Wisnu, M.M.", role: "Pudir II Bidang Keuangan & Umum", education: "S2 Magister Manajemen Universitas Indonesia", avatar: "👨‍💻", category: "APJ" as const, order: 3 },
                  { name: "Rudi Hartono, S.ST.Par., M.Par.", role: "Pudir III Bidang Kemahasiswaan & Kemitraan", education: "S2 Pariwisata STP Trisakti", avatar: "👨‍💼", category: "APJ" as const, order: 4 },
                  { name: "Yulia Herawati, S.E., M.MM.", role: "Ketua Program Studi D3 Perhotelan", education: "S2 Manajemen Perhotelan Universitas Pelita Harapan", avatar: "👩‍🍳", category: "APJ" as const, order: 5 },
                  { name: "Andi Saputra, M.Par.", role: "Ketua Program Studi D3 Usaha Perjalanan Wisata", education: "S2 Destinasi Pariwisata Institut Teknologi Bandung", avatar: "👨‍✈️", category: "APJ" as const, order: 6 },
                  { name: "Kusmayadi, M.M.", role: "Ketua Yayasan Pendidikan Jayakarta", education: "S2 Manajemen Universitas Jayakarta", avatar: "🏛️", category: "Yayasan" as const, order: 7 },
                  { name: "Dr. H. Ahmad Fauzi", role: "Dewan Pembina Yayasan", education: "S3 Hukum & Kebijakan Publik Universitas Indonesia", avatar: "⚖️", category: "Yayasan" as const, order: 8 },
                  { name: "Hj. Ratna Sari, S.E.", role: "Bendahara Yayasan", education: "S1 Akuntansi Universitas Jayakarta", avatar: "💼", category: "Yayasan" as const, order: 9 }
                ];

                const apjMembers = targetMembers.filter(m => m.category === "APJ");
                const yayasanMembers = targetMembers.filter(m => m.category === "Yayasan");

                const apjDirektur = apjMembers.filter(m => m.role.toLowerCase().includes("direktur"));
                const activeDirektur = apjDirektur.length > 0 ? apjDirektur : [apjMembers[0]];
                
                const apjPudir = apjMembers.filter(m => m.role.toLowerCase().includes("pudir") || m.role.toLowerCase().includes("pembantu"));
                const apjKaprodi = apjMembers.filter(m => !m.role.toLowerCase().includes("direktur") && !m.role.toLowerCase().includes("pudir") && !m.role.toLowerCase().includes("pembantu"));

                const renderPhoto = (avatar: string, name: string) => {
                  if (avatar && (avatar.startsWith("data:") || avatar.startsWith("http") || avatar.startsWith("/"))) {
                    return (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent mx-auto flex items-center justify-center bg-white shadow-md mb-3">
                        <img 
                          src={avatar} 
                          alt={name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    );
                  }
                  return <span className="text-5xl block text-center mb-3">{avatar || "👤"}</span>;
                };

                return (
                  <>
                    {/* Direktur Card (Centered At Top) */}
                    <div className="flex justify-center">
                      {activeDirektur.map((member, idx) => member && (
                        <div key={idx} className="bg-primary text-white max-w-md w-full rounded-2xl p-6 text-center shadow-xl border-b-8 border-accent hover:scale-102 transition duration-200">
                          {renderPhoto(member.avatar, member.name)}
                          <h3 className="text-md md:text-lg font-black font-heading tracking-tight">{member.name}</h3>
                          <p className="text-accent text-xs font-bold uppercase tracking-widest mt-1">{member.role}</p>
                          <p className="text-[11px] text-blue-200 mt-2 font-medium">{member.education}</p>
                        </div>
                      ))}
                    </div>

                    {/* Pudir Section Row */}
                    {apjPudir.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-100 max-w-5xl mx-auto">
                        {apjPudir.map((member, idx) => (
                          <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-100 shadow-md text-center hover:border-primary/40 hover:-translate-y-1 transition duration-200">
                            {renderPhoto(member.avatar, member.name)}
                            <h4 className="text-xs font-black text-neutral-900 leading-snug line-clamp-1">{member.name}</h4>
                            <span className="text-[10px] font-bold text-primary tracking-wider uppercase block mt-1">{member.role}</span>
                            <span className="text-[9px] text-zinc-500 font-semibold block mt-1.5">{member.education}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Kaprodi Section Row */}
                    {apjKaprodi.length > 0 && (
                      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                        {apjKaprodi.map((member, idx) => (
                          <div key={idx} className="bg-[#FFFCEF] p-5 rounded-xl border border-accent shadow-sm text-center hover:-translate-y-1 transition duration-200">
                            {renderPhoto(member.avatar, member.name)}
                            <h4 className="text-xs font-black text-[#0050A0] leading-snug">{member.name}</h4>
                            <span className="text-[10px] font-bold text-neutral-800 tracking-wider uppercase block mt-1">{member.role}</span>
                            <span className="text-[10px] text-zinc-600 font-semibold block mt-1.5">{member.education}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Yayasan section */}
                    <div className="pt-8 mt-12 border-t-2 border-dashed border-neutral-200">
                      <div className="text-center p-3 max-w-xl mx-auto mb-8">
                        <p className="text-xs text-accent leading-relaxed font-bold uppercase tracking-widest">
                          YAYASAN PENDIDIKAN JAYAKARTA
                        </p>
                        <h2 className="text-lg md:text-xl font-black text-neutral-900 font-heading mt-1">
                          Dewan Pengurus Yayasan Naungan College
                        </h2>
                        <div className="w-16 h-1 bg-primary mx-auto mt-2 rounded"></div>
                      </div>

                      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                        {yayasanMembers.map((member, idx) => (
                          <div key={idx} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 shadow-sm text-center hover:bg-white hover:shadow-md transition duration-200">
                            {renderPhoto(member.avatar, member.name)}
                            <h4 className="text-xs font-black text-neutral-950 leading-snug">{member.name}</h4>
                            <span className="text-[10px] font-extrabold text-accent tracking-wider uppercase block mt-1">{member.role}</span>
                            <span className="text-[10px] text-zinc-600 font-medium block mt-1.5">{member.education}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 4: LAMBANG & IDENTITAS */}
        {activeTab === "lambang" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Logo Emblem Display */}
            <div className="lg:col-span-4 flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 flex items-center justify-center max-w-xs w-full">
                <img 
                  src="/input_file_1.png" 
                  alt="Official Seal APJ" 
                  className="w-48 h-48 md:w-56 md:h-56 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-neutral-500 tracking-wider uppercase text-center block">
                Lambang Resmi Akademi Pariwisata Jakarta
              </span>
            </div>

            {/* Explanation breakdown with interactive selector */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-black text-primary tracking-widest uppercase block">
                  INTERACTIVE BREAKDOWN Makna Lambang
                </span>
                <h3 className="text-lg md:text-xl font-black text-neutral-900 font-heading">
                  Membedah Sisi Filosofis Lambang APJ
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                  Klik bagian elemen lambang di bawah ini untuk melihat interpretasi dan arti resmi:
                </p>
              </div>

              {/* Selector Buttons Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-2">
                {LAMBANG_EXPLANATION.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedLambangPart(idx)}
                    className={`px-3 py-2 text-xs font-extrabold rounded-lg border transition text-center shadow-sm cursor-pointer ${
                      selectedLambangPart === idx
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    }`}
                    id={`lambang-btn-${idx}`}
                  >
                    {item.part}
                  </button>
                ))}
              </div>

              {/* Display Result Panel */}
              <div className="bg-[#FFFCEF] border-2 border-accent p-6 rounded-xl shadow-inner space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-[#0050A0]">
                  <Sparkles size={16} />
                  <span className="font-extrabold text-sm md:text-md uppercase tracking-wide font-heading">
                    {LAMBANG_EXPLANATION[selectedLambangPart].part}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-neutral-700 leading-relaxed font-semibold font-medium">
                  {LAMBANG_EXPLANATION[selectedLambangPart].meaning}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
