import React, { useState, useEffect } from "react";
import { 
  Layers, FileText, GraduationCap, Sparkles, BookOpen, Globe, ShieldCheck, 
  Users, BarChart2, Cpu, Sliders, Settings, HardDrive, Key, HelpCircle, 
  Search, Bot, Check, Play, Edit3, Trash, Plus, File, Calendar, Briefcase, 
  TrendingUp, Award, Link, Zap, Layout, Monitor, Shield, MessageSquare, 
  Code, Eye, Copy, RefreshCw, CheckCircle, Clock, Database, ChevronRight, AlertTriangle, ArrowRight, Share2, Compass, MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ApjCmsWorkspacesProps {
  tab: string;
  announcements: any[];
  setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>;
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  pmbApplicants: any[];
  messages: any[];
}

export default function ApjCmsWorkspaces({
  tab,
  announcements,
  setAnnouncements,
  settings,
  setSettings,
  pmbApplicants,
  messages
}: ApjCmsWorkspacesProps) {
  // Roles list
  const [selectedRole, setSelectedRole] = useState<string>("Super Admin");
  
  // 1. Dashboard State
  const [dashboardWidgets, setDashboardWidgets] = useState([
    { id: "health", title: "🖥️ Website Health Status", visible: true, size: "col-span-1" },
    { id: "visitors", title: "📊 Live Visitor Traffic", visible: true, size: "col-span-2" },
    { id: "seo", title: "🔍 SEO Score Card", visible: true, size: "col-span-1" },
    { id: "articles", title: "📄 Top Viewed Articles", visible: true, size: "col-span-2" },
    { id: "logs", title: "🛡️ Real-time Audit logs", visible: true, size: "col-span-2" },
  ]);

  // 2. Content & Pages States
  const [activeContentTab, setActiveContentTab] = useState<"articles" | "pages" | "categories" | "trash">("articles");
  const [contentSearch, setContentSearch] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [aiWorking, setAiWorking] = useState(false);
  const [tempArtTitle, setTempArtTitle] = useState("");
  const [tempArtContent, setTempArtContent] = useState("");
  const [tempArtType, setTempArtType] = useState("News");

  // 3. Academic States
  const [selectedProdi, setSelectedProdi] = useState("D3 Perhotelan");
  const [academicCalendar, setAcademicCalendar] = useState([
    { date: "2026-07-15", event: "Pengenalan Kehidupan Kampus (PKKMB)" },
    { date: "2026-08-01", event: "Awal Perkuliahan Semester Ganjil TA 2026/2027" },
    { date: "2026-09-10", event: "Ujian Tengah Semester (UTS) Teori & Praktik" }
  ]);

  // 4. PMB States
  const [selectedCampaign, setSelectedCampaign] = useState("Gelombang 2 - Early Bird");
  const [leads, setLeads] = useState([
    { name: "Rina Kartika", email: "rina.k@gmail.com", phone: "081234567890", status: "Hot Prospect" },
    { name: "Adit Nugraha", email: "adit_n@yahoo.com", phone: "089876543210", status: "Registered" },
    { name: "Fandi Ahmad", email: "fandi.ahmad@gmail.com", phone: "085566778899", status: "Inquiry" }
  ]);
  const [pmbCountdownDate, setPmbCountdownDate] = useState("2026-08-31");

  // 5. Research States
  const [researchProjects, setResearchProjects] = useState([
    { title: "Analisis Potensi Sustainable Gastronomy Tourism di Kepulauan Seribu", leader: "Dr. Bambang Setiadi", year: "2026", status: "In Progress" },
    { title: "Strategi Pemulihan Industri MICE Pasca Era Digitalisasi", leader: "Prof. Maria Natalia", year: "2025", status: "Completed" }
  ]);

  // 6. Community Service States
  const [pkmList, setPkmList] = useState([
    { title: "Pendampingan Sertifikasi Halal & Higienitas Kuliner Desa Wisata Cikole", village: "Desa Cikole", status: "Selesai" },
    { title: "Digital Marketing Homestay Berbasis AI di Geopark Ciletuh", village: "Ciletuh", status: "Berjalan" }
  ]);

  // 7. Accreditation States
  const [selectedBorang, setSelectedBorang] = useState("Kriteria 1 - Visi Misi");
  const [accredProgress, setAccredProgress] = useState({
    "Kriteria 1 - Visi Misi": 90,
    "Kriteria 2 - Tata Pamong": 75,
    "Kriteria 3 - Mahasiswa": 85,
    "Kriteria 4 - Sumber Daya Manusia": 60,
    "Kriteria 5 - Keuangan & Sarana": 80,
  });

  // 8. SPMI States
  const [spmiStandards, setSpmiStandards] = useState([
    { code: "STD-01-AKD", title: "Standar Kompetensi Lulusan (SKL) APJ Vokasional", auditStatus: "Compliance" },
    { code: "STD-02-PRK", title: "Standar Sarana Praktikum Hotel Simulator & Kuliner", auditStatus: "Observation Needed" }
  ]);

  // 9. International Office States
  const [selectedPartnerUni, setSelectedPartnerUni] = useState("Swiss Hotel Management School");
  const [internAbroadList, setInternAbroadList] = useState([
    { name: "Rizky Fauzi", hotel: "Marina Bay Sands Singapore", duration: "6 Bulan" },
    { name: "Siti Rahma", hotel: "Ritz Carlton Dubai", duration: "12 Bulan" }
  ]);

  // 10. Partnership States
  const [mouList, setMouList] = useState([
    { partner: "PT. Hotel Indonesia Natour (Persero)", type: "MoU & Magang Kerja", expiry: "2028-12-31", alert: false },
    { partner: "Marriott International Group Bali Office", type: "Penyaluran Lulusan", expiry: "2026-09-30", alert: true }
  ]);

  // 11. Career Center States
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobVacancies, setJobVacancies] = useState([
    { id: "job-1", title: "Assistant F&B Manager", hotel: "Grand Hyatt Jakarta", expiry: "2026-08-15" },
    { id: "job-2", title: "Front Office Supervisor", hotel: "The Ritz-Carlton Mega Kuningan", expiry: "2026-07-31" }
  ]);

  // 12. Directory States
  const [selectedDept, setSelectedDept] = useState("Dosen Tetap D3 Perhotelan");
  const [facultyDirectory, setFacultyDirectory] = useState([
    { name: "Dr. Irwan Kusmayadi, M.M.", nip: "197206101999031001", role: "Lektor Kepala" },
    { name: "Andi Wijaya, S.ST.Par., M.Par.", nip: "198511202010041002", role: "Lektor" }
  ]);

  // 13. Events States
  const [eventsList, setEventsList] = useState([
    { title: "National Hospitality Innovation Summit 2026", date: "2026-08-20", tickets: 250, sold: 182 },
    { title: "Grand Cooking Competition APJ Cup", date: "2026-09-05", tickets: 100, sold: 94 }
  ]);

  // 14. Download Center States
  const [selectedCategoryDownload, setSelectedCategoryDownload] = useState("Academic");
  const [downloadFiles, setDownloadFiles] = useState([
    { name: "Formulir_Rencana_Studi_FRS.pdf", size: "235 KB", downloads: 1420, category: "Academic" },
    { name: "Buku_Panduan_PKKMB_2026.pdf", size: "1.4 MB", downloads: 580, category: "Admissions" },
    { name: "Regulasi_Kerja_Praktik_Magang.pdf", size: "540 KB", downloads: 910, category: "Regulations" }
  ]);

  // 15. Workflow Engine States
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState("Draft");
  const [workflowLogs, setWorkflowLogs] = useState([
    { time: "18:24:10", user: "Editor Roni", action: "Membuat Draft Artikel 'APJ Star Chef 2026'" },
    { time: "18:32:00", user: "Reviewer Sinta", action: "Menyetujui revisi tata bahasa (Proofread)" },
    { time: "18:40:15", user: "Kaprodi Vokasi", action: "Digital Signature Tersemat secara Terenkripsi" }
  ]);

  // 16. AI Studio (Fitur Unggulan)
  const [aiPrompt, setAiPrompt] = useState("Buat Landing Page PMB 2027");
  const [aiSelectedModel, setAiSelectedModel] = useState("gemini-3.5-flash");
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [aiLog, setAiLog] = useState<string[]>([]);

  // 17. Analytics States
  const [analyticsDateRange, setAnalyticsDateRange] = useState("7 Hari Terakhir");
  const [seoScore, setSeoScore] = useState(94);
  const [heatmapActive, setHeatmapActive] = useState(false);

  // 18. Integration States
  const [integrationsList, setIntegrationsList] = useState([
    { id: "ga", name: "Google Analytics 4 Tracking (GA4)", active: true, keyName: "VITE_GA_ID" },
    { id: "wa", name: "WhatsApp Gateway API (Pemberitahuan Kelulusan)", active: true, keyName: "WA_GATEWAY_TOKEN" },
    { id: "smtp", name: "SMTP Server Mailer (Notifikasi PMB & KRS)", active: true, keyName: "SMTP_PASSWORD" },
    { id: "sso", name: "Single Sign-On (SSO) Portal Akademik", active: false, keyName: "SSO_CLIENT_SECRET" }
  ]);

  // 19. Digital Asset Manager (DAM) States
  const [damSearch, setDamSearch] = useState("");
  const [damAssets, setDamAssets] = useState([
    { id: "asset-1", name: "gedung_kampus_utama_front.png", tag: "Campus Architecture", size: "3.2 MB", aiAlt: "Foto tampak depan gedung kampus utama Akademi Pariwisata Jakarta berarsitektur modern." },
    { id: "asset-2", name: "praktik_barista_vokasi.jpg", tag: "Culinary Lab", size: "1.8 MB", aiAlt: "Mahasiswa pariwisata sedang berlatih meracik kopi dengan mesin espresso di laboratorium simulator barista." }
  ]);

  // 20. Brand Center
  const [primaryBrandColor, setPrimaryBrandColor] = useState("#0050A0");
  const [secondaryBrandColor, setSecondaryBrandColor] = useState("#002f5a");
  const [accentBrandColor, setAccentBrandColor] = useState("#D4AF37");

  // 21. Component Marketplace (Manifest Package list)
  const [marketplaceApps, setMarketplaceApps] = useState([
    { id: "com_research", name: "Pusat Riset & Publikasi Ilmiah", state: "Active", desc: "Integrasi database SINTA, DOAJ, serta repositori tesis mahasiswa." },
    { id: "com_pkm", name: "Portal Pengabdian Masyarakat", state: "Active", desc: "Sistem koordinasi desa wisata binaan dan pendanaan hibah." },
    { id: "com_career", name: "APJ Career Hub & Tracer Study", state: "Active", desc: "Pencocokan karir berbasis AI dengan hotel bintang 5 mitra APJ." },
    { id: "com_lms", name: "LMS Edufin Virtual Classroom", state: "Inactive", desc: "Sistem e-learning terpadu berbasis Moodle & video conference." }
  ]);

  // 22. Automation Center
  const [automationRules, setAutomationRules] = useState([
    { trigger: "Ketika Artikel Berita Dipublikasikan", action: "Kirim Notifikasi via WhatsApp Gateway & Posting Facebook", active: true },
    { trigger: "Ketika Masa Berlaku MoU Tersisa < 30 Hari", action: "Kirim Email Pengingat Otomatis ke Unit Kerjasama", active: true }
  ]);

  // 23. Multi-Site Manager
  const [selectedSite, setSelectedSite] = useState("apj.ac.id");
  const [multiSites, setMultiSites] = useState([
    { domain: "apj.ac.id", label: "Website Corporate APJ (Utama)" },
    { domain: "hotel.apj.ac.id", label: "Teaching Hotel Simulator Booking Portal" },
    { domain: "journal.apj.ac.id", label: "APJ Hospitality Scientific Journal" },
    { domain: "admission.apj.ac.id", label: "Situs Pendaftaran Khusus Mahasiswa Baru" }
  ]);

  // 24. Experience Personalization Engine
  const [selectedPersonalizationPersona, setSelectedPersonalizationPersona] = useState("Calon Mahasiswa");
  const [experienceRules, setExperienceRules] = useState([
    { persona: "Calon Mahasiswa", action: "Tampilkan Hero Banner Pendaftaran PMB & Chatbot Dr. EduFin AI", enabled: true },
    { persona: "Alumni APJ", action: "Tampilkan Tracer Study Banner & Informasi Reuni Akbar", enabled: true },
    { persona: "Mitra Industri", action: "Tampilkan Menu Pengajuan MoU & Form Kerja Sama Strategis", enabled: true }
  ]);

  const runAiStudioGenerator = async () => {
    if (!aiPrompt) return;
    setAiWorking(true);
    setAiLog(["Menginisialisasi DXP AI Engine...", "Menganalisis domain: apj.ac.id...", "Mengonfigurasi copywriting bernada Vokasi & Hospitality..."]);
    
    try {
      const response = await fetch("/api/ai-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, model: aiSelectedModel })
      });
      const data = await response.json();
      
      setAiLog(prev => [...prev, "Menyusun struktur landing page...", "Menerapkan visual palette ramah disabilitas...", "Menghasilkan Meta-tags & Schema.org...", "Selesai!"]);
      setAiOutput(data);
    } catch (e: any) {
      setAiLog(prev => [...prev, "Terjadi kesalahan fallback: menggunakan generator lokal APJ Engine..."]);
      // Fallback response with beautiful, rich data
      setTimeout(() => {
        setAiOutput({
          title: `Halaman Unggulan: ${aiPrompt}`,
          subtitle: "Digital Experience Platform Generated Page",
          heroBanner: {
            title: `Bergabunglah di Akademi Pariwisata Jakarta - ${aiPrompt}`,
            subtitle: "Menembus Karir Global Hospitality Bintang 5 Berlisensi BNSP",
            ctaText: "Daftar Sekarang",
            imageConcept: "Modern Luxury Kitchen and Star-rated Hotel Receptionist Simulator"
          },
          sections: [
            { title: "Mengapa Memilih Kami?", content: "APJ menyediakan program studi terakreditasi BAN-PT dengan jaminan penempatan magang terarah selama 6 bulan di mancanegara (Singapore, Dubai, Tokyo)." },
            { title: "Kurikulum Praktis", content: "70% dari perkuliahan dilakukan langsung di simulator laboratorium bintang 5 modern untuk mencetak praktisi kompeten siap tempur di industri." }
          ],
          faqs: [
            { q: "Kapan pendaftaran gelombang ini ditutup?", a: "Pendaftaran gelombang ini ditutup akhir bulan depan. Kuota beasiswa terbatas." },
            { q: "Apakah biaya kuliah bisa diangsur?", a: "Ya, biaya kuliah APJ bersifat transparan tanpa biaya praktik tersembunyi dan dapat dicicil bulanan." }
          ],
          seo: {
            metaTitle: `${aiPrompt} | Akademi Pariwisata Jakarta`,
            metaDescription: `Informasi lengkap mengenai ${aiPrompt}. Daftar sekarang dan rintis karir pariwisata profesional Anda bersama APJ.`,
            keywords: "hospitality, pmb pariwisata, kuliah perhotelan, apj jakarta",
            schemaMarkup: "{\"@context\":\"https://schema.org\",\"@type\":\"CollegeOrUniversity\",\"name\":\"APJ\"}"
          },
          colorPalette: {
            primary: "#0050A0",
            secondary: "#002f5a",
            accent: "#D4AF37"
          }
        });
      }, 1500);
    } finally {
      setAiWorking(false);
    }
  };

  const applyAiGeneratedStylesAndContent = () => {
    if (!aiOutput) return;
    // Set custom generated colors in state
    if (aiOutput.colorPalette) {
      setPrimaryBrandColor(aiOutput.colorPalette.primary);
      setSecondaryBrandColor(aiOutput.colorPalette.secondary);
      setAccentBrandColor(aiOutput.colorPalette.accent);
    }
    // Pre-populate article form
    setTempArtTitle(aiOutput.heroBanner.title || aiOutput.title);
    setTempArtContent(aiOutput.sections.map((s: any) => `**${s.title}**\n${s.content}`).join("\n\n") + `\n\n**FAQ:**\n` + aiOutput.faqs.map((f: any) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n"));
    setActiveContentTab("articles");
    alert("Layout, skema warna brand, dan naskah copywriting berhasil disinkronkan ke Content Management APJ CMS secara dinamis!");
  };

  return (
    <div className="bg-[#f8fafc] rounded-2xl border border-slate-200/80 shadow-xs min-h-[500px]">
      {/* Top Controller Bar - Persona & Website selector */}
      <div className="bg-white border-b border-slate-200 p-4 rounded-t-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl font-black text-xs font-mono">
            {selectedRole.toUpperCase()}
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Aktif Sebagai</span>
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-xs font-extrabold text-neutral-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
            >
              <option value="Super Admin">Super Admin (Akses Penuh)</option>
              <option value="Administrator">Administrator (Sistem & Brand)</option>
              <option value="Editor">Editor (Konten & Media)</option>
              <option value="Reviewer">Reviewer (Kurikulum & SPMI)</option>
              <option value="Author">Author (Riset & Publikasi)</option>
              <option value="Guest">Guest (Peninjau Eksternal)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 text-amber-600 p-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            APJ DXP Live Mode
          </div>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="text-xs font-extrabold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {multiSites.map(s => (
              <option key={s.domain} value={s.domain}>{s.domain} ({s.label.split(" ")[0]})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="p-6">
        
        {/* TAB 1: DASHBOARD */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary to-[#002f5a] p-6 rounded-2xl text-white space-y-3 relative overflow-hidden shadow-xs">
              <div className="absolute top-0 right-0 p-8 opacity-10 shrink-0">
                <Compass size={180} />
              </div>
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent font-heading">Digital Experience Platform (DXP)</span>
                <h2 className="text-xl font-bold font-heading">Konsol Administrasi APJ CMS Enterprise</h2>
                <p className="text-[11px] text-blue-100 max-w-xl leading-relaxed">
                  Selamat bekerja, **{selectedRole}**. Kelola semua ekosistem informasi, rekrutmen mahasiswa baru (PMB), jurnal riset, borang akreditasi, dan pengaturan brand visual di bawah satu platform terpusat.
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-[10px] font-mono text-blue-200">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="block text-slate-400">STATUS SERVERS</span>
                  <span className="text-emerald-400 font-bold">🟢 ONLINE (Ingress 3000)</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="block text-slate-400">AKREDITASI UTAMA</span>
                  <span className="text-accent font-bold">⭐ UNGGUL (BAN-PT)</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="block text-slate-400">DATABASE INTEGRATION</span>
                  <span className="text-blue-300 font-bold">Cloud Firestore API</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="block text-slate-400">AI MODEL ENGINE</span>
                  <span className="text-emerald-300 font-bold">Gemini 3.5 Active</span>
                </div>
              </div>
            </div>

            {/* Personalized widgets with drag/hide simulation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Widget 1: Website Health */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider font-heading">Kesehatan Website</h4>
                  <span className="p-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold px-2">99.8% SLA</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Kapasitas Penyimpanan</span>
                    <span className="font-bold">14.2 GB / 100 GB</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[14%]"></div>
                  </div>
                  <p className="text-[10px] text-slate-400">Pembaruan sistem terakhir: 2 jam yang lalu otomatis.</p>
                </div>
              </div>

              {/* Widget 2: Visitor Traffic */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider font-heading">Live Visitors Today</h4>
                  <TrendingUp className="text-emerald-500" size={16} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-slate-800">4,812</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+18.5% dari kemarin</span>
                </div>
                <div className="flex gap-1.5 text-[9px] font-mono text-slate-400">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded">Desktop 64%</span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded">Mobile 32%</span>
                </div>
              </div>

              {/* Widget 3: SEO Rank */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider font-heading">Kualitas SEO Score</h4>
                  <Award className="text-amber-500" size={16} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-slate-800">{seoScore}/100</span>
                  <span className="text-[10px] text-slate-400 font-bold">Excellent</span>
                </div>
                <div className="text-[10px] text-slate-500">Tidak ditemukan tautan rusak (0 Broken Links).</div>
              </div>
            </div>

            {/* Audit Logs & Action list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2 space-y-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider font-heading">Log Aktivitas Sistem Terkini</h4>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                  <div className="flex gap-3 text-xs items-start border-b border-slate-100 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">17:34</span>
                    <div>
                      <p className="font-extrabold text-slate-800">{selectedRole} mengubah visual warna primer brand.</p>
                      <span className="text-[10px] text-slate-400">Situs apj.ac.id langsung termutakhirkan tanpa compile ulang.</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs items-start border-b border-slate-100 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">15:10</span>
                    <div>
                      <p className="font-semibold text-slate-800">Calon Mahasiswa baru "Rina Kartika" mendaftar via PMB.</p>
                      <span className="text-[10px] text-slate-400">Automasi pengiriman notifikasi WhatsApp Gateway terpicu.</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs items-start pb-1">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">12:00</span>
                    <div>
                      <p className="font-semibold text-slate-800">AI Studio meluncurkan sitemap & robots.txt baru otomatis.</p>
                      <span className="text-[10px] text-slate-400">Indeksasi mesin pencarian Google diperbarui secara real-time.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Real-time Advisor recommendations */}
              <div className="bg-indigo-950 p-5 rounded-2xl text-white space-y-4">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-indigo-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300 font-heading">AI DXP Suggestions</h4>
                </div>
                <div className="bg-indigo-900/60 p-3.5 rounded-xl border border-indigo-800 text-[11px] leading-relaxed space-y-3">
                  <p>
                    "Data menunjukkan kenaikan kunjungan 45% di halaman <strong>Program Studi D3 Perhotelan</strong> dari wilayah Jawa Barat."
                  </p>
                  <button 
                    onClick={() => alert("Saran AI: Menargetkan kampanye khusus PMB gelombang 3 untuk wilayah Jawa Barat.")}
                    className="w-full bg-accent hover:bg-amber-600 text-[#002f5a] font-extrabold py-2 rounded-lg text-[10px] uppercase transition cursor-pointer"
                  >
                    Aktifkan Kampanye Regional Jabar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTENT & PAGES */}
        {tab === "content" && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveContentTab("articles")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeContentTab === "articles" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  📄 Berita & Artikel ({announcements.length})
                </button>
                <button 
                  onClick={() => setActiveContentTab("pages")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeContentTab === "pages" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  🔗 Landing Pages (7)
                </button>
                <button 
                  onClick={() => setActiveContentTab("categories")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeContentTab === "categories" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  📂 Kategori & Tag
                </button>
              </div>

              <div className="flex gap-2 shrink-0">
                <input 
                  type="text" 
                  value={contentSearch} 
                  onChange={(e) => setContentSearch(e.target.value)} 
                  placeholder="Cari artikel..." 
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <button 
                  onClick={() => {
                    setSelectedArticleId("new");
                    setTempArtTitle("");
                    setTempArtContent("");
                    setTempArtType("News");
                  }}
                  className="bg-accent hover:bg-amber-500 text-[#002f5a] font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={14} /> Buat Baru
                </button>
              </div>
            </div>

            {/* List and editor layout */}
            {selectedArticleId ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider font-heading text-primary">
                    {selectedArticleId === "new" ? "Tambah Konten Baru" : "Edit Konten"}
                  </h4>
                  <button onClick={() => setSelectedArticleId(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">X Tutup</button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400">Judul Artikel</label>
                    <input 
                      type="text" 
                      value={tempArtTitle} 
                      onChange={(e) => setTempArtTitle(e.target.value)}
                      placeholder="Contoh: Kerja Sama Magang Internasional Terbaru APJ"
                      className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs font-bold focus:bg-white text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400">Kategori Kampus</label>
                      <select 
                        value={tempArtType} 
                        onChange={(e) => setTempArtType(e.target.value)}
                        className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs font-bold"
                      >
                        <option value="News">Berita & Kabar Utama</option>
                        <option value="Announcement">Pengumuman Resmi</option>
                        <option value="Event">Agenda Kegiatan</option>
                        <option value="Press">Press Release</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400">Metode Publikasi</label>
                      <div className="text-xs py-2 px-1 text-slate-500 font-semibold">
                        Sistem Workflow Publikasi (Diteruskan ke Editor & Publisher)
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Isi Naskah Lengkap</label>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            if (!tempArtTitle) return alert("Ketik judul terlebih dahulu.");
                            alert("AI sedang meringkas isi artikel...");
                            setTempArtContent(prev => prev + "\n\n**Ringkasan AI:** Artikel ini membahas penguatan kerja sama strategis global di pariwisata.");
                          }}
                          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase transition cursor-pointer"
                        >
                          🪄 AI Auto Ringkas
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            alert("Mengubah gaya bahasa ke gaya jurnalistik manusia non-cliché...");
                            setTempArtContent(prev => prev.replace(/merupakan/g, "adalah").replace(/menakjubkan/g, "unggul"));
                          }}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase transition cursor-pointer"
                        >
                          🧼 AI Anti-Slop (Detox)
                        </button>
                      </div>
                    </div>
                    <textarea 
                      rows={8}
                      value={tempArtContent} 
                      onChange={(e) => setTempArtContent(e.target.value)}
                      placeholder="Tulis naskah lengkap atau gunakan generator AI di tab AI Studio..."
                      className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs font-semibold focus:bg-white text-slate-800 font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={() => setSelectedArticleId(null)}
                      className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={() => {
                        if (!tempArtTitle || !tempArtContent) return alert("Judul dan isi artikel harus diisi.");
                        const newItem = {
                          id: selectedArticleId === "new" ? "art-" + Date.now() : selectedArticleId,
                          title: tempArtTitle,
                          content: tempArtContent,
                          type: tempArtType,
                          createdAt: new Date().toISOString(),
                          views: selectedArticleId === "new" ? 0 : 230
                        };
                        
                        if (selectedArticleId === "new") {
                          setAnnouncements([newItem, ...announcements]);
                        } else {
                          setAnnouncements(announcements.map(a => a.id === selectedArticleId ? newItem : a));
                        }
                        setSelectedArticleId(null);
                        alert("Artikel berhasil disimpan ke draft!");
                      }}
                      className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Simpan Draft Konten
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200/50">
                    <tr>
                      <th className="p-4">Judul Konten</th>
                      <th className="p-4">Tipe</th>
                      <th className="p-4">Tanggal Rilis</th>
                      <th className="p-4">Jumlah Pembaca</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {announcements
                      .filter(a => a.title.toLowerCase().includes(contentSearch.toLowerCase()))
                      .map((art) => (
                        <tr key={art.id} className="hover:bg-slate-50/60 transition">
                          <td className="p-4 font-bold text-slate-800">{art.title}</td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              {art.type || "Berita"}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[10px] text-slate-400">
                            {new Date(art.createdAt || Date.now()).toLocaleDateString("id-ID")}
                          </td>
                          <td className="p-4 font-semibold text-slate-700">{art.views || 0} hits</td>
                          <td className="p-4 text-right space-x-1">
                            <button 
                              onClick={() => {
                                setSelectedArticleId(art.id!);
                                setTempArtTitle(art.title);
                                setTempArtContent(art.content);
                                setTempArtType(art.type || "News");
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-primary transition"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm("Apakah Anda yakin menghapus artikel ini?")) {
                                  setAnnouncements(announcements.filter(a => a.id !== art.id));
                                }
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 transition"
                              title="Hapus"
                            >
                              <Trash size={14} />
                            </button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACADEMICS */}
        {tab === "academics" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Akademik APJ Program Studi & Kurikulum</h4>
                  <p className="text-[11px] text-slate-400">Atur silabus, dosen pengampu, kalender akademik, dan buku regulasi kampus.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedProdi("D3 Perhotelan")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${selectedProdi === "D3 Perhotelan" ? "bg-primary text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                  >
                    🏨 D3 Perhotelan
                  </button>
                  <button 
                    onClick={() => setSelectedProdi("D3 Usaha Wisata")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${selectedProdi === "D3 Usaha Wisata" ? "bg-primary text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                  >
                    ✈️ D3 Usaha Perjalanan Wisata
                  </button>
                </div>
              </div>

              {/* Curriculum Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-heading">Struktur Mata Kuliah Utama ({selectedProdi})</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <span className="font-bold text-slate-800">Manajemen Operasional Kantor Depan</span>
                        <span className="block text-[10px] text-slate-400 font-mono">Front Office • SKS: 4 • Praktikum</span>
                      </div>
                      <span className="font-bold text-primary">Semester I</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <span className="font-bold text-slate-800">Tata Boga & Seni Kulinari Nusantara</span>
                        <span className="block text-[10px] text-slate-400 font-mono">F&B Product • SKS: 6 • Praktikum</span>
                      </div>
                      <span className="font-bold text-primary">Semester II</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <span className="font-bold text-slate-800">Aplikasi Komputer Reservasi Penerbangan (Sabre/Amadeus)</span>
                        <span className="block text-[10px] text-slate-400 font-mono">Travel ticketing • SKS: 4 • Praktikum</span>
                      </div>
                      <span className="font-bold text-primary">Semester III</span>
                    </div>
                  </div>
                  <button onClick={() => alert("Tambah Kurikulum Baru")} className="text-[10px] font-bold text-primary hover:underline">
                    + Tambah Mata Kuliah Baru
                  </button>
                </div>

                {/* Laboratories */}
                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-heading">Fasilitas Laboratorium Praktik Simulator</h5>
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-3 items-start">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1"></div>
                      <div>
                        <p className="font-bold text-slate-800">Simulator Room Suite Bintang 5</p>
                        <span className="text-[10px] text-slate-400">Tersertifikasi LSP Pariwisata Nasional & BNSP untuk ujian kompetensi kerja.</span>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1"></div>
                      <div>
                        <p className="font-bold text-slate-800">Lab Dapur Komersial & Pastry</p>
                        <span className="text-[10px] text-slate-400">Lengkap dengan oven konveksi profesional dan workstation higienis.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PMB MANAGER */}
        {tab === "pmb" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Campaign stats */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Kampanye Aktif</span>
                <h4 className="text-sm font-bold text-slate-800">{selectedCampaign}</h4>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Pendaftaran Ditutup:</span>
                  <span className="font-bold text-red-500 font-mono">{pmbCountdownDate}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Pendaftar Terverifikasi (Firestore)</span>
                <h4 className="text-2xl font-bold text-primary">{pmbApplicants.length} Calon Mahasiswa</h4>
                <p className="text-[10px] text-slate-400">Terintegrasi otomatis dengan sistem penyeleksian berkas akademik.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Konversi Leads</span>
                <h4 className="text-2xl font-bold text-emerald-600">88.4% Conversion</h4>
                <p className="text-[10px] text-slate-400">Total click formulir pendaftaran dibanding rilis leads.</p>
              </div>
            </div>

            {/* Leads collected */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider font-heading">Lead & Prospek Calon Mahasiswa Baru (Inquiry Inbox)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200/50">
                    <tr>
                      <th className="p-3 text-[10px] font-black text-slate-400 uppercase">Nama Lengkap</th>
                      <th className="p-3 text-[10px] font-black text-slate-400 uppercase">Email</th>
                      <th className="p-3 text-[10px] font-black text-slate-400 uppercase">No. Handphone</th>
                      <th className="p-3 text-[10px] font-black text-slate-400 uppercase">Status</th>
                      <th className="p-3 text-[10px] font-black text-slate-400 uppercase text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((l, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{l.name}</td>
                        <td className="p-3 font-mono text-slate-600">{l.email}</td>
                        <td className="p-3 font-mono text-slate-600">{l.phone}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            l.status === 'Hot Prospect' ? 'bg-amber-100 text-amber-800' :
                            l.status === 'Registered' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => {
                              alert(`Notifikasi kelulusan / panduan PMB berhasil dikirim ke WhatsApp ${l.name}`);
                            }}
                            className="bg-primary hover:bg-primary-dark text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase transition"
                          >
                            Hubungi WA
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RESEARCH CENTER */}
        {tab === "research" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Pusat Penelitian Ilmiah & Jurnal Hospitality</h4>
                <button 
                  onClick={() => alert("Tambah Agenda Riset")}
                  className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
                >
                  + Riset Baru
                </button>
              </div>

              <div className="space-y-3">
                {researchProjects.map((rp, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4 hover:bg-slate-50 transition">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Tahun {rp.year} • Status: {rp.status}</span>
                      <p className="font-extrabold text-slate-800 text-xs">{rp.title}</p>
                      <span className="text-[11px] text-slate-500">Ketua Peneliti: {rp.leader}</span>
                    </div>
                    <button onClick={() => alert("Lihat Jurnal")} className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold">
                      Buka Dokumen Riset
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: COMMUNITY SERVICE */}
        {tab === "community_service" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Pengabdian Kepada Masyarakat (PkM)</h4>
              <div className="space-y-3">
                {pkmList.map((pkm, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition">
                    <div>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{pkm.village}</span>
                      <p className="font-bold text-slate-800 text-xs mt-1.5">{pkm.title}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-600">{pkm.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ACCREDITATION */}
        {tab === "accreditation" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Accreditation Manager (Borang BAN-PT & LAM)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400">Progress Kriteria Akreditasi</span>
                  {Object.entries(accredProgress).map(([kriteria, progress]) => (
                    <div 
                      key={kriteria} 
                      onClick={() => setSelectedBorang(kriteria)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition ${selectedBorang === kriteria ? 'border-primary bg-primary/5 font-bold' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                      <div className="flex justify-between mb-1.5">
                        <span className="text-slate-700">{kriteria}</span>
                        <span className="font-bold text-slate-900">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-heading">Dokumen Eviden & Bukti Fisik</h5>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800 block">Surat_Keputusan_Visi_Misi.pdf</span>
                        <span className="text-[10px] text-slate-400">Ukuran: 1.2 MB • Diupload oleh Kaprodi</span>
                      </div>
                      <span className="text-emerald-500 font-bold">Terverifikasi</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800 block">Laporan_Keuangan_Audit_KAP.pdf</span>
                        <span className="text-[10px] text-slate-400">Ukuran: 5.4 MB • Status draft</span>
                      </div>
                      <span className="text-amber-500 font-bold">Review</span>
                    </div>
                  </div>
                  <button onClick={() => alert("Upload Eviden Baru")} className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-2 rounded-xl text-[10px] uppercase transition">
                    + Upload Dokumen Eviden Baru
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SPMI */}
        {tab === "spmi" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Sistem Penjaminan Mutu Internal (SPMI)</h4>
              <div className="space-y-2">
                {spmiStandards.map((std, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{std.code}</span>
                      <p className="font-bold text-slate-800 mt-1">{std.title}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${std.auditStatus === "Compliance" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {std.auditStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: INTERNATIONAL OFFICE */}
        {tab === "international_office" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Hubungan Internasional & Visa Center</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-100 p-4 rounded-xl space-y-3">
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-heading">Universitas Mitra Pertukaran Mahasiswa</h5>
                  <div className="space-y-2 text-xs">
                    {["Swiss Hotel Management School", "Taylor's University Malaysia", "Glion Institute of Higher Education"].map(u => (
                      <div 
                        key={u} 
                        onClick={() => setSelectedPartnerUni(u)}
                        className={`p-2.5 rounded-lg border cursor-pointer ${selectedPartnerUni === u ? 'border-primary bg-primary/5 font-bold' : 'border-slate-50'}`}
                      >
                        {u}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-xs">
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-heading">Data Mahasiswa Magang di Luar Negeri</h5>
                  <div className="space-y-2">
                    {internAbroadList.map((ia, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-800 block">{ia.name}</span>
                        <span className="text-[10px] text-slate-400">{ia.hotel} • Durasi: {ia.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: PARTNERSHIP */}
        {tab === "partnership" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Partnership Manager (MoU, MoA & PKS)</h4>
              <div className="space-y-3">
                {mouList.map((mou, idx) => (
                  <div key={idx} className={`border p-4 rounded-xl flex flex-wrap justify-between items-center gap-4 transition ${mou.alert ? 'border-red-200 bg-red-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <div>
                      <p className="font-extrabold text-slate-800 text-xs">{mou.partner}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block">{mou.type} • Berakhir: {mou.expiry}</span>
                    </div>
                    {mou.alert && (
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">Masa Berlaku Kritis</span>
                        <button 
                          onClick={() => alert("Email pengingat perpanjangan kerjasama dikirim ke Marriot Group Bali.")}
                          className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded transition"
                        >
                          Kirim Pengingat
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: CAREER CENTER */}
        {tab === "career_center" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">APJ Career Hub & Lowongan Kerja Alumni</h4>
                <button onClick={() => alert("Buat Lowongan Kerja")} className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                  + Buat Loker Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobVacancies.map(job => (
                  <div key={job.id} className="border border-slate-100 p-4 rounded-xl hover:bg-slate-50 transition flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{job.hotel}</span>
                      <p className="font-extrabold text-slate-800 text-xs mt-0.5">{job.title}</p>
                      <span className="text-[10px] text-slate-500">Batas Lamaran: {job.expiry}</span>
                    </div>
                    <button 
                      onClick={() => alert(`Review pelamar untuk ${job.title}`)}
                      className="border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold px-2.5 py-1.5 rounded"
                    >
                      Pelamar (14)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: DIRECTORY */}
        {tab === "directory" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Direktori Dosen & Staf Akademik</h4>
                  <p className="text-[11px] text-slate-400">Kelola profil publik, NIDN, jabatan fungsional dosen APJ.</p>
                </div>
                <select 
                  value={selectedDept} 
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="text-xs font-extrabold border border-slate-200 rounded-lg p-2 bg-white"
                >
                  <option value="Dosen Tetap D3 Perhotelan">Dosen Tetap D3 Perhotelan</option>
                  <option value="Dosen Tetap D3 UPW">Dosen Tetap D3 UPW</option>
                </select>
              </div>

              <div className="space-y-2">
                {facultyDirectory.map((f, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{f.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">NIDN/NIP: {f.nip}</span>
                    </div>
                    <span className="text-slate-500 font-semibold">{f.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: EVENTS */}
        {tab === "events" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Agenda & Kegiatan Kampus</h4>
              <div className="space-y-3">
                {eventsList.map((e, idx) => (
                  <div key={idx} className="border border-slate-100 p-4 rounded-xl flex justify-between items-center hover:bg-slate-50 transition">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{e.title}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Tanggal: {e.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-primary block">{e.sold} / {e.tickets} Tiket</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Hampir Habis</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 14: DOWNLOAD CENTER */}
        {tab === "download_center" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Download Center (Repositori Formulir & Dokumen)</h4>
                <div className="flex gap-1.5">
                  {["Academic", "Admissions", "Regulations"].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setSelectedCategoryDownload(cat)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${selectedCategoryDownload === cat ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {downloadFiles
                  .filter(f => f.category === selectedCategoryDownload)
                  .map((f, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{f.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Ukuran: {f.size}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold font-mono">{f.downloads} Unduhan</span>
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 15: WORKFLOW ENGINE */}
        {tab === "workflow" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Workflow Engine & SLA Persetujuan</h4>
              
              {/* Process line layout */}
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {["Draft", "Editor Review", "Reviewer Approval", "Head of Unit Sign", "Publisher", "Published"].map((step, idx) => (
                  <React.Fragment key={step}>
                    <div 
                      onClick={() => setSelectedWorkflowStep(step)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${selectedWorkflowStep === step ? 'bg-primary text-white shadow-xs' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}
                    >
                      {idx + 1}. {step}
                    </div>
                    {idx < 5 && <ChevronRight className="text-slate-300 shrink-0" size={14} />}
                  </React.Fragment>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-xs space-y-3">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>SLA Pengingat & Ekskalasi</span>
                  <span className="text-emerald-600">Aktif (24 Jam)</span>
                </div>
                <p className="text-slate-500">Sistem otomatis mengingatkan pengelola jika dokumen mengendap lebih dari 24 jam di satu tahap workflow.</p>
                
                <div className="border-t border-slate-200/80 pt-3 space-y-2">
                  <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">Jejak Audit Trail (Digital Signature)</span>
                  {workflowLogs.map((wl, idx) => (
                    <div key={idx} className="flex gap-2 text-[10px] font-mono text-slate-500">
                      <span>[{wl.time}]</span>
                      <span className="font-bold text-slate-700">{wl.user}:</span>
                      <span>{wl.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 16: AI STUDIO (Fitur Unggulan) */}
        {tab === "ai_studio" && (
          <div className="space-y-6">
            <div className="bg-indigo-950 p-6 rounded-2xl text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-md font-bold font-heading">AI Studio Generative DXP</h3>
                  <p className="text-[11px] text-indigo-200">Tulis perintah bahasa alami untuk menghasilkan struktur landing page, salinan copywriting, setelan warna brand, FAQ, dan skema SEO instan.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-indigo-300">Prompt Perintah</label>
                    <input 
                      type="text" 
                      value={aiPrompt} 
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Contoh: Buat Landing Page PMB 2027 atau Buat halaman D3 Perhotelan"
                      className="w-full bg-indigo-900/60 border border-indigo-700 p-3 rounded-xl text-xs font-bold text-white focus:bg-indigo-900 focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-indigo-300">Model AI</label>
                    <select 
                      value={aiSelectedModel}
                      onChange={(e) => setAiSelectedModel(e.target.value)}
                      className="w-full bg-indigo-900/60 border border-indigo-700 p-3 rounded-xl text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash (Sangat Cepat)</option>
                      <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Advanced)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={runAiStudioGenerator}
                    disabled={aiWorking}
                    className="bg-accent hover:bg-amber-500 text-[#002f5a] font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    {aiWorking ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Menghasilkan...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Generate Halaman DXP
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Generator Log */}
            {aiLog.length > 0 && (
              <div className="bg-slate-900 p-4 rounded-xl font-mono text-[10px] text-slate-300 space-y-1">
                <div className="text-emerald-400 font-bold mb-1">// DXP AI Engine Logs:</div>
                {aiLog.map((log, idx) => (
                  <div key={idx}>&gt; {log}</div>
                ))}
              </div>
            )}

            {/* AI Generated Output Display */}
            {aiOutput && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider font-heading">Hasil Rekomendasi Generative AI</h4>
                  <button 
                    onClick={applyAiGeneratedStylesAndContent}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Terapkan Ke Website Live (Simpan & Sinkron)
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] text-slate-400 font-bold block">HERO BANNER COPYWRITING</span>
                    <h5 className="font-black text-slate-800 text-sm mt-1">{aiOutput.heroBanner?.title}</h5>
                    <p className="text-slate-600 mt-1">{aiOutput.heroBanner?.subtitle}</p>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded inline-block mt-2 font-bold">
                      Tombol CTA: {aiOutput.heroBanner?.ctaText} • Konsep Gambar: {aiOutput.heroBanner?.imageConcept}
                    </span>
                  </div>

                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] text-slate-400 font-bold block">STRUKTUR BAGIAN DETAIL</span>
                    <div className="space-y-3 mt-1.5">
                      {aiOutput.sections?.map((s: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-lg">
                          <span className="font-extrabold text-slate-800 block">{s.title}</span>
                          <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{s.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] text-slate-400 font-bold block">SEO METADATA & SCHEMA.ORG</span>
                    <div className="bg-slate-950 p-3 rounded-xl font-mono text-[10px] text-slate-300 space-y-1.5 mt-1.5">
                      <div><span className="text-slate-500">Meta Title:</span> <span className="text-white font-bold">{aiOutput.seo?.metaTitle}</span></div>
                      <div><span className="text-slate-500">Meta Description:</span> <span className="text-slate-400">{aiOutput.seo?.metaDescription}</span></div>
                      <div><span className="text-slate-500">Keywords:</span> <span className="text-amber-300">{aiOutput.seo?.keywords}</span></div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">PALET WARNA BRAND TEMA REKOMENDASI</span>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: aiOutput.colorPalette?.primary }}></div>
                        <span className="font-mono text-[10px] text-slate-600">Primary ({aiOutput.colorPalette?.primary})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: aiOutput.colorPalette?.secondary }}></div>
                        <span className="font-mono text-[10px] text-slate-600">Secondary ({aiOutput.colorPalette?.secondary})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: aiOutput.colorPalette?.accent }}></div>
                        <span className="font-mono text-[10px] text-slate-600">Accent ({aiOutput.colorPalette?.accent})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 17: ANALYTICS CENTER */}
        {tab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Analytics & Visitor Heatmap Simulation</h4>
                <button 
                  onClick={() => setHeatmapActive(!heatmapActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${heatmapActive ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {heatmapActive ? "🔥 Matikan Heatmap Mode" : "🔍 Aktifkan Heatmap Mode"}
                </button>
              </div>

              {heatmapActive ? (
                <div className="relative border-4 border-dashed border-red-400/80 p-6 rounded-2xl bg-slate-900 text-white min-h-[220px] flex items-center justify-center overflow-hidden">
                  <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-amber-500 rounded-full blur-2xl opacity-50"></div>
                  <div className="relative z-10 text-center space-y-2">
                    <span className="text-xs bg-red-600 px-2.5 py-1 rounded-full font-black animate-bounce inline-block">HOT SPOT DETECTED</span>
                    <p className="text-[11px] text-slate-300 max-w-sm">
                      "Tombol <strong>'Daftar PMB Sekarang'</strong> di Hero Carousel memiliki rasio klik tertinggi yaitu 72% dari total interaksi pengunjung."
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase font-heading">Rasio Sumber Kunjungan</span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span>Pencarian Organik (Google)</span><span className="font-bold">54%</span></div>
                      <div className="flex justify-between"><span>Media Sosial (Instagram/TikTok)</span><span className="font-bold">28%</span></div>
                      <div className="flex justify-between"><span>Tautan Langsung / Referal</span><span className="font-bold">18%</span></div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase font-heading">Top Keywords Terpopuler</span>
                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold">
                      <span className="bg-white px-2.5 py-1 rounded border">"kuliah vokasi perhotelan terbaik jakarta"</span>
                      <span className="bg-white px-2.5 py-1 rounded border">"apj pmb pariwisata 2026"</span>
                      <span className="bg-white px-2.5 py-1 rounded border">"biaya kuliah apj dapat dicicil"</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 18: INTEGRATION CENTER */}
        {tab === "integrations" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Integration Center (Konfigurasi API Pihak Ketiga)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrationsList.map((int, idx) => (
                  <div key={int.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-xs block">{int.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Var: {int.keyName}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = [...integrationsList];
                        updated[idx].active = !updated[idx].active;
                        setIntegrationsList(updated);
                      }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition ${int.active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                    >
                      {int.active ? "ON" : "OFF"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 19: DIGITAL ASSET MANAGER */}
        {tab === "media_library" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Digital Asset Manager (DAM) & Repositori Aset Kampus</h4>
                  <p className="text-[11px] text-slate-400">Penyimpanan cerdas yang mendukung OCR dokumen, kompresi gambar instan, dan AI Auto Alt-text.</p>
                </div>
                <button 
                  onClick={() => alert("Upload file")}
                  className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
                >
                  + Unggah File Baru
                </button>
              </div>

              <div className="space-y-3">
                {damAssets.map(asset => (
                  <div key={asset.id} className="border border-slate-100 p-4 rounded-xl flex flex-wrap justify-between items-start gap-4 hover:bg-slate-50 transition">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-xs">{asset.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">Ukuran: {asset.size} • Tag: {asset.tag}</span>
                      <span className="text-[11px] text-indigo-700 italic block mt-1.5">🪄 AI Auto-Generated Alt Text: "{asset.aiAlt}"</span>
                    </div>
                    <div className="space-x-1.5">
                      <button 
                        onClick={() => alert("Mulai memotong gambar cerdas...")}
                        className="text-[10px] font-bold text-slate-600 border border-slate-200 px-2 py-1 rounded"
                      >
                        Crop Image
                      </button>
                      <button 
                        onClick={() => alert("Mengompresi aset...")}
                        className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded"
                      >
                        Compress (WebP)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 20: BRAND CENTER */}
        {tab === "brand_center" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Brand Center & Identitas Visual APJ</h4>
              <p className="text-[11px] text-slate-400">Atur semua aspek logo variasi dan palet warna primer website. Perubahan di panel ini akan langsung tersinkronisasi ke seluruh halaman pengunjung secara dinamis.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block font-heading">Logo Kampus (.png/.ico)</span>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="block text-slate-500 mb-1">Logo Header Utama</span>
                      <input type="text" value={settings?.logoHeader || "/input_file_1.png"} onChange={(e) => setSettings({ ...settings, logoHeader: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-lg text-[11px] font-semibold" />
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">Logo Footer</span>
                      <input type="text" value={settings?.logoFooter || "/input_file_1.png"} onChange={(e) => setSettings({ ...settings, logoFooter: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-lg text-[11px] font-semibold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block font-heading">Palet Warna Utama (Color Picker)</span>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-slate-600">Primary Color (Navigasi)</span>
                      <input type="color" value={primaryBrandColor} onChange={(e) => setPrimaryBrandColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-slate-600">Secondary Color (Footer)</span>
                      <input type="color" value={secondaryBrandColor} onChange={(e) => setSecondaryBrandColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-slate-600">Accent Color (Tombol/CTA)</span>
                      <input type="color" value={accentBrandColor} onChange={(e) => setAccentBrandColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block font-heading">Typography Setup</span>
                  <div className="text-xs p-3.5 bg-slate-50 rounded-xl space-y-1.5">
                    <div className="flex justify-between"><span>Display Heading Font</span><span className="font-bold">Inter</span></div>
                    <div className="flex justify-between"><span>Body & Paragraph Font</span><span className="font-bold">Plus Jakarta Sans</span></div>
                    <div className="flex justify-between"><span>Menu Navigation Font</span><span className="font-bold">Arial Nova</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 21: COMPONENT MARKETPLACE */}
        {tab === "marketplace" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Component Marketplace (Manifest Package Controller)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketplaceApps.map((app, idx) => (
                  <div key={app.id} className="border border-slate-100 p-4 rounded-xl space-y-2 flex flex-col justify-between hover:bg-slate-50 transition">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-xs">{app.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${app.state === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>{app.state}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{app.desc}</p>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = [...marketplaceApps];
                        updated[idx].state = updated[idx].state === "Active" ? "Inactive" : "Active";
                        setMarketplaceApps(updated);
                      }}
                      className={`w-full py-2 rounded-lg text-[10px] font-black uppercase transition ${app.state === 'Active' ? 'bg-slate-200 text-slate-700' : 'bg-primary text-white'}`}
                    >
                      {app.state === 'Active' ? "Nonaktifkan Komponen" : "Instal & Aktifkan"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 22: AUTOMATION CENTER */}
        {tab === "automation" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">No-Code Automation Rules</h4>
              <div className="space-y-3">
                {automationRules.map((rule, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl flex justify-between items-start text-xs gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-indigo-700 font-bold uppercase block">Picu (Trigger)</span>
                      <p className="font-extrabold text-slate-800">{rule.trigger}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block pt-1.5">Tindakan (Action)</span>
                      <p className="text-slate-600">{rule.action}</p>
                    </div>
                    <span className="text-emerald-600 font-black uppercase text-[10px]">Aktif</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 23: MULTI-SITE MANAGER */}
        {tab === "multisite" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Multi-Site Manager (Satu Konsol Banyak Domain)</h4>
              <div className="space-y-2">
                {multiSites.map(site => (
                  <div key={site.domain} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-800 block text-xs">{site.domain}</span>
                      <span className="text-[10px] text-slate-400">{site.label}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedSite(site.domain);
                        alert(`Berhasil berpindah ke basis data konfigurasi domain: ${site.domain}`);
                      }}
                      className="border border-slate-200 hover:bg-slate-100 text-[10px] font-black uppercase px-2.5 py-1.5 rounded"
                    >
                      Kelola Domain
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 24: EXPERIENCE BUILDER */}
        {tab === "experience_builder" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black uppercase text-primary tracking-widest font-heading">Experience Builder (Aturan Personalisasi Kunjungan)</h4>
                  <p className="text-[11px] text-slate-400">Tentukan konten, pop-up, dan widget yang muncul berdasarkan persona pengunjung web.</p>
                </div>
              </div>

              <div className="space-y-3">
                {experienceRules.map((rule, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center text-xs gap-4">
                    <div>
                      <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black px-2 py-0.5 rounded uppercase">{rule.persona}</span>
                      <p className="font-bold text-slate-800 mt-1">{rule.action}</p>
                    </div>
                    <span className="text-emerald-600 font-bold text-[10px]">Aktif</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FALLBACK INFO / PLUGINS NOT SEPARATELY DECLARED */}
        {!["dashboard", "content", "academics", "pmb", "research", "community_service", "accreditation", "spmi", "international_office", "partnership", "career_center", "directory", "events", "download_center", "workflow", "ai_studio", "analytics", "integrations", "media_library", "brand_center", "marketplace", "automation", "multisite", "experience_builder"].includes(tab) && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center py-12 space-y-3">
            <Settings className="mx-auto text-slate-400 shrink-0" size={48} />
            <h4 className="font-bold text-slate-700">Fitur "{tab.toUpperCase()}" Aktif & Terlindungi</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Pengaturan tersinkronisasi langsung ke database Cloud Firestore. Semua role matrix dan enkripsi keamanan tetap berjalan di latar belakang.</p>
          </div>
        )}

      </div>
    </div>
  );
}
