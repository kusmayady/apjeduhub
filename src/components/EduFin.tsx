import React, { useState, useEffect } from "react";
import { 
  db, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp 
} from "../lib/firebase";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle, 
  Plus, 
  Trash, 
  Check, 
  Clock, 
  Filter, 
  Sparkles, 
  GraduationCap, 
  PieChart as PieIcon, 
  Layers, 
  Search, 
  RefreshCw,
  UserPlus,
  Send,
  Download,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from "recharts";
import { PmbApplication } from "../lib/dbService";

interface EduFinProps {
  pmbApplicants: PmbApplication[];
}

export interface StudentPayment {
  id?: string;
  name: string;
  nim: string;
  major: "D3 Perhotelan" | "D3 Usaha Perjalanan Wisata";
  classType: "Reguler" | "Kelas Karyawan";
  amount: number;
  status: "Lunas" | "Menunggu" | "Tunggakan";
  lastPaid: string;
}

export interface CampusExpense {
  id?: string;
  category: "Bahan Lab Praktik" | "Utilitas Kampus" | "Perbaikan Lab Hotel" | "Gaji & Staf" | "Promosi & PMB" | "Lain-lain";
  amount: number;
  date: string;
  description: string;
}

export function EduFin({ pmbApplicants }: EduFinProps) {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "spp" | "expenses" | "ai_advisor">("overview");
  
  // Data lists
  const [studentPayments, setStudentPayments] = useState<StudentPayment[]>([]);
  const [expenses, setExpenses] = useState<CampusExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // New Student Payment Form state
  const [showAddSppModal, setShowAddSppModal] = useState(false);
  const [sppName, setSppName] = useState("");
  const [sppNim, setSppNim] = useState("");
  const [sppMajor, setSppMajor] = useState<"D3 Perhotelan" | "D3 Usaha Perjalanan Wisata">("D3 Perhotelan");
  const [sppClassType, setSppClassType] = useState<"Reguler" | "Kelas Karyawan">("Reguler");
  const [sppAmount, setSppAmount] = useState(4500000);
  const [sppStatus, setSppStatus] = useState<"Lunas" | "Menunggu" | "Tunggakan">("Menunggu");
  
  // New Expense Form state
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expCategory, setExpCategory] = useState<"Bahan Lab Praktik" | "Utilitas Kampus" | "Perbaikan Lab Hotel" | "Gaji & Staf" | "Promosi & PMB" | "Lain-lain">("Bahan Lab Praktik");
  const [expAmount, setExpAmount] = useState("");
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0]);
  const [expDesc, setExpDesc] = useState("");

  // Filters & Search
  const [sppSearch, setSppSearch] = useState("");
  const [sppFilterMajor, setSppFilterMajor] = useState<"Semua" | "D3 Perhotelan" | "D3 Usaha Perjalanan Wisata">("Semua");
  const [sppFilterStatus, setSppFilterStatus] = useState<"Semua" | "Lunas" | "Menunggu" | "Tunggakan">("Semua");
  const [expFilterCategory, setExpFilterCategory] = useState<"Semua" | "Bahan Lab Praktik" | "Utilitas Kampus" | "Perbaikan Lab Hotel" | "Gaji & Staf" | "Promosi & PMB" | "Lain-lain">("Semua");

  // AI Advisor state
  const [aiReport, setAiReport] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load standard initial mock datasets in case collections are empty
  const defaultSppData: StudentPayment[] = [
    { name: "Alfonso Septiawan", nim: "APJ20260401", major: "D3 Perhotelan", classType: "Reguler", amount: 4800000, status: "Lunas", lastPaid: "2026-06-15" },
    { name: "Siti Rahmawati", nim: "APJ20260402", major: "D3 Perhotelan", classType: "Kelas Karyawan", amount: 5200000, status: "Lunas", lastPaid: "2026-06-18" },
    { name: "Budi Kusuma", nim: "APJ20260403", major: "D3 Usaha Perjalanan Wisata", classType: "Reguler", amount: 4500000, status: "Tunggakan", lastPaid: "" },
    { name: "Cindy Clarissa", nim: "APJ20260404", major: "D3 Perhotelan", classType: "Reguler", amount: 4800000, status: "Menunggu", lastPaid: "" },
    { name: "Deni Prasetyo", nim: "APJ20260405", major: "D3 Usaha Perjalanan Wisata", classType: "Kelas Karyawan", amount: 5200000, status: "Lunas", lastPaid: "2026-06-20" },
    { name: "Eka Wahyuni", nim: "APJ20260406", major: "D3 Perhotelan", classType: "Reguler", amount: 4800000, status: "Tunggakan", lastPaid: "" }
  ];

  const defaultExpenseData: CampusExpense[] = [
    { category: "Bahan Lab Praktik", amount: 12500000, date: "2026-06-10", description: "Bahan segar masakan kontinental & pastry Lab Gastronomi" },
    { category: "Utilitas Kampus", amount: 4200000, date: "2026-06-12", description: "Tagihan Listrik & Internet Kecepatan Tinggi Kampus" },
    { category: "Perbaikan Lab Hotel", amount: 8500000, date: "2026-06-14", description: "Penggantian linen premium & toiletries kamar hotel simulator" },
    { category: "Gaji & Staf", amount: 24000000, date: "2026-06-25", description: "Honorarium Dosen Praktisi & Instruktur Perhotelan APJ" },
    { category: "Promosi & PMB", amount: 3500000, date: "2026-06-05", description: "Iklan Brosur cetak dan ads media sosial PMB APJ 2026" }
  ];

  // Fetch from Firestore
  useEffect(() => {
    async function loadEduFinData() {
      setLoading(true);
      try {
        // 1. Load Expenses
        const expSnapshot = await getDocs(collection(db, "edufin_expenses"));
        let expList: CampusExpense[] = [];
        expSnapshot.forEach((doc) => {
          expList.push({ id: doc.id, ...doc.data() } as CampusExpense);
        });

        // 2. Load SPP Payments
        const sppSnapshot = await getDocs(collection(db, "edufin_spp"));
        let sppList: StudentPayment[] = [];
        sppSnapshot.forEach((doc) => {
          sppList.push({ id: doc.id, ...doc.data() } as StudentPayment);
        });

        // If firestore collections are empty, seed them and set state
        if (expList.length === 0) {
          for (const item of defaultExpenseData) {
            const added = await addDoc(collection(db, "edufin_expenses"), item);
            expList.push({ id: added.id, ...item });
          }
        }
        if (sppList.length === 0) {
          for (const item of defaultSppData) {
            const added = await addDoc(collection(db, "edufin_spp"), item);
            sppList.push({ id: added.id, ...item });
          }
        }

        setExpenses(expList);
        setStudentPayments(sppList);
      } catch (err) {
        console.error("Gagal memuat data keuangan dari Firestore:", err);
        // Fallback to local state if offline/permission issue
        setExpenses(defaultExpenseData);
        setStudentPayments(defaultSppData);
      } finally {
        setLoading(false);
      }
    }

    loadEduFinData();
  }, [refreshKey]);

  // Calculations
  const totalIncomeFromSpp = studentPayments
    .filter(s => s.status === "Lunas")
    .reduce((sum, s) => sum + s.amount, 0);
  
  const totalCustomIncome = 28500000; // Simulated income from boarding house, hotel simulator rent, state grants
  const totalPemasukan = totalIncomeFromSpp + totalCustomIncome;

  const totalPengeluaran = expenses.reduce((sum, e) => sum + e.amount, 0);
  const sisaSaldo = totalPemasukan - totalPengeluaran;

  const totalTunggakanSpp = studentPayments
    .filter(s => s.status === "Tunggakan")
    .reduce((sum, s) => sum + s.amount, 0);

  const totalMenungguSpp = studentPayments
    .filter(s => s.status === "Menunggu")
    .reduce((sum, s) => sum + s.amount, 0);

  // Expense categories aggregate
  const getExpensesByCategory = () => {
    const categories: Record<string, number> = {};
    expenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });
    return Object.keys(categories).map(cat => ({
      name: cat,
      value: categories[cat]
    }));
  };

  const expenseChartData = getExpensesByCategory();

  // Monthly trends simulation
  const monthlyFlowData = [
    { bulan: "Jan", Pemasukan: 32000000, Pengeluaran: 28000000 },
    { bulan: "Feb", Pemasukan: 35000000, Pengeluaran: 29000000 },
    { bulan: "Mar", Pemasukan: 41000000, Pengeluaran: 34000000 },
    { bulan: "Apr", Pemasukan: 48000000, Pengeluaran: 40000000 },
    { bulan: "Mei", Pemasukan: 52000000, Pengeluaran: 45000000 },
    { bulan: "Jun", Pemasukan: totalPemasukan, Pengeluaran: totalPengeluaran }
  ];

  // Actions
  const handleAddStudentPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sppName || !sppNim) {
      alert("Harap isi Nama dan NIM mahasiswa.");
      return;
    }

    const newSpp: StudentPayment = {
      name: sppName,
      nim: sppNim,
      major: sppMajor,
      classType: sppClassType,
      amount: sppAmount,
      status: sppStatus,
      lastPaid: sppStatus === "Lunas" ? new Date().toISOString().split("T")[0] : ""
    };

    try {
      const docRef = await addDoc(collection(db, "edufin_spp"), newSpp);
      setStudentPayments(prev => [...prev, { id: docRef.id, ...newSpp }]);
      setShowAddSppModal(false);
      // Reset
      setSppName("");
      setSppNim("");
      setSppAmount(4500000);
      setSppStatus("Menunggu");
    } catch (err) {
      console.error("Gagal menyimpan SPP:", err);
      alert("Error menyimpan data SPP ke awan.");
    }
  };

  const handleImportFromPmb = async (applicant: PmbApplication) => {
    const defaultFee = applicant.major?.includes("Hotel") ? 4800000 : 4500000;
    const isEmpClass = applicant.classType?.toLowerCase().includes("karyawan") || false;
    
    // Generate Random Nim
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedNim = `APJ20260${randomSuffix}`;

    const newSpp: StudentPayment = {
      name: applicant.name || "Nama Mahasiswa",
      nim: generatedNim,
      major: applicant.major?.includes("Hotel") ? "D3 Perhotelan" : "D3 Usaha Perjalanan Wisata",
      classType: isEmpClass ? "Kelas Karyawan" : "Reguler",
      amount: defaultFee + (isEmpClass ? 400000 : 0),
      status: "Menunggu",
      lastPaid: ""
    };

    try {
      const docRef = await addDoc(collection(db, "edufin_spp"), newSpp);
      setStudentPayments(prev => [...prev, { id: docRef.id, ...newSpp }]);
      alert(`Berhasil mengimpor pendaftar ${applicant.name} sebagai calon mahasiswa terdaftar dengan NIM sementara: ${generatedNim}`);
    } catch (err) {
      console.error(err);
      alert("Gagal mengimpor pendaftar.");
    }
  };

  const handleUpdateSppStatus = async (id: string, newStatus: "Lunas" | "Menunggu" | "Tunggakan") => {
    try {
      const docRef = doc(db, "edufin_spp", id);
      const today = newStatus === "Lunas" ? new Date().toISOString().split("T")[0] : "";
      await updateDoc(docRef, { 
        status: newStatus,
        lastPaid: today
      });
      setStudentPayments(prev => prev.map(s => s.id === id ? { ...s, status: newStatus, lastPaid: today } : s));
    } catch (err) {
      console.error("Gagal update status SPP:", err);
    }
  };

  const handleDeleteSpp = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan tagihan mahasiswa ini?")) return;
    try {
      await deleteDoc(doc(db, "edufin_spp", id));
      setStudentPayments(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(expAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert("Jumlah pengeluaran tidak valid.");
      return;
    }

    const newExp: CampusExpense = {
      category: expCategory,
      amount: amountVal,
      date: expDate,
      description: expDesc || `Pembelian operasional kategori ${expCategory}`
    };

    try {
      const docRef = await addDoc(collection(db, "edufin_expenses"), newExp);
      setExpenses(prev => [...prev, { id: docRef.id, ...newExp }]);
      setShowAddExpenseModal(false);
      setExpAmount("");
      setExpDesc("");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan pengeluaran.");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan pengeluaran ini?")) return;
    try {
      await deleteDoc(doc(db, "edufin_expenses", id));
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Gemini AI Consultant API Call
  const handleConsultAiAdvisor = async () => {
    setIsAiLoading(true);
    setAiReport("");
    try {
      const res = await fetch("/api/edufin-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalIncome: totalPemasukan,
          totalExpenses: totalPengeluaran,
          cashFlow: sisaSaldo,
          pendingFees: totalTunggakanSpp,
          expensesBreakdown: expenses.map(e => ({ kategori: e.category, nominal: e.amount, tgl: e.date }))
        })
      });
      const data = await res.json();
      if (data.analysis) {
        setAiReport(data.analysis);
      } else {
        setAiReport("Gagal memanggil konsultan AI. Silakan pastikan kunci API terpasang.");
      }
    } catch (err: any) {
      console.error(err);
      setAiReport(`Kesalahan komunikasi dengan Dr. EduFin: ${err.message || "Pastikan server backend Anda online."}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filter lists
  const filteredStudents = studentPayments.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(sppSearch.toLowerCase()) || s.nim.toLowerCase().includes(sppSearch.toLowerCase());
    const matchesMajor = sppFilterMajor === "Semua" || s.major === sppFilterMajor;
    const matchesStatus = sppFilterStatus === "Semua" || s.status === sppFilterStatus;
    return matchesSearch && matchesMajor && matchesStatus;
  });

  const filteredExpenses = expenses.filter(e => {
    return expFilterCategory === "Semua" || e.category === expFilterCategory;
  });

  // Colors for chart slices
  const COLORS = ["#0284c7", "#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#6366f1"];

  return (
    <div className="space-y-6 text-neutral-800 font-sans">
      
      {/* Top Banner & Mode Picker */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-neutral-900 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              Sistem Keuangan Kampus
            </span>
            <span className="text-[10px] text-neutral-300 font-bold font-mono">v1.2.0 (Stable)</span>
          </div>
          <div className="text-xl font-black font-heading mt-1 flex items-center gap-2 text-white">
            📊 EduFin APJ Dashboard
          </div>
          <div className="text-xs text-neutral-100 mt-1 max-w-xl leading-relaxed opacity-95">
            Kelola piutang SPP, biaya praktikum laboratorium perhotelan, pengeluaran kuliner mahasiswa, serta lakukan audit anggaran otomatis berbasis Gemini AI.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer text-white flex items-center gap-1.5 text-xs font-bold border border-white/5"
            title="Muat Ulang Data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sinkron
          </button>
        </div>
      </div>

      {/* Quick Metrics Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pemasukan */}
        <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <TrendingUp size={24} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black block">Total Pemasukan</span>
            <span className="text-base font-black font-heading text-neutral-900 block">
              Rp {totalPemasukan.toLocaleString("id-ID")}
            </span>
            <span className="text-[8px] text-neutral-500 font-semibold block">
              SPP: Rp {totalIncomeFromSpp.toLocaleString("id-ID")} + Hibah/Lainnya
            </span>
          </div>
        </div>

        {/* Pengeluaran */}
        <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            <TrendingDown size={24} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black block">Total Pengeluaran</span>
            <span className="text-base font-black font-heading text-neutral-900 block">
              Rp {totalPengeluaran.toLocaleString("id-ID")}
            </span>
            <span className="text-[8px] text-neutral-500 font-semibold block">
              {expenses.length} Transaksi Operasional Aktif
            </span>
          </div>
        </div>

        {/* Bersih Cash Flow */}
        <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <DollarSign size={24} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black block">Net Cash Flow</span>
            <span className={`text-base font-black font-heading block ${sisaSaldo >= 0 ? "text-blue-700" : "text-red-600"}`}>
              Rp {sisaSaldo.toLocaleString("id-ID")}
            </span>
            <span className="text-[8px] text-neutral-500 font-semibold block">
              {sisaSaldo >= 0 ? "Arus kas sehat / surplus" : "Defisit anggaran operasional"}
            </span>
          </div>
        </div>

        {/* Piutang Tunggakan */}
        <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black block">Tunggakan SPP</span>
            <span className="text-base font-black font-heading text-neutral-900 block">
              Rp {totalTunggakanSpp.toLocaleString("id-ID")}
            </span>
            <span className="text-[8px] text-neutral-500 font-semibold block">
              Menunggu Konfirmasi: Rp {totalMenungguSpp.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-neutral-200 gap-1 bg-white p-1 rounded-xl border max-w-2xl">
        <button 
          onClick={() => setActiveSubTab("overview")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "overview" ? "bg-primary text-white shadow-xs" : "text-neutral-600 hover:text-black hover:bg-neutral-50"
          }`}
        >
          <Layers size={13} />
          Dashboard & Grafik
        </button>
        <button 
          onClick={() => setActiveSubTab("spp")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "spp" ? "bg-primary text-white shadow-xs" : "text-neutral-600 hover:text-black hover:bg-neutral-50"
          }`}
        >
          <GraduationCap size={13} />
          UKT / SPP Mahasiswa
        </button>
        <button 
          onClick={() => setActiveSubTab("expenses")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "expenses" ? "bg-primary text-white shadow-xs" : "text-neutral-600 hover:text-black hover:bg-neutral-50"
          }`}
        >
          <TrendingDown size={13} />
          Pengeluaran Kampus
        </button>
        <button 
          onClick={() => setActiveSubTab("ai_advisor")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "ai_advisor" ? "bg-amber-100 hover:bg-amber-200 text-amber-800 shadow-xs border border-amber-200" : "text-amber-700 hover:bg-amber-50"
          }`}
        >
          <Sparkles size={13} />
          Audit & Rekomendasi AI
        </button>
      </div>

      {/* Main Container by Tab */}
      
      {/* 1. OVERVIEW GRAPHICS TAB */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Cashflow Trend Recharts (Line / Area) */}
          <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">Grafik Arus Kas Bulanan APJ</h3>
              <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Analisis tren komparatif pemasukan dan alokasi operasional semester ini.</p>
            </div>
            
            <div className="h-[250px] w-full bg-neutral-50/40 p-1 rounded-xl border border-neutral-150">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 9, fontWeight: "bold" }} />
                  <YAxis tick={{ fontSize: 9, fontWeight: "bold" }} />
                  <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString("id-ID")}`} />
                  <Legend wrapperStyle={{ fontSize: 9, fontWeight: "bold" }} />
                  <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIn)" name="Pemasukan" />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOut)" name="Pengeluaran" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Operational Expenses Distribution (Pie) */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">Alokasi Anggaran</h3>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                Persentase pengeluaran berdasarkan kategori operasional semester ini.
              </p>
            </div>

            <div className="h-[180px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {expenseChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString("id-ID")}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Total Biaya</span>
                <span className="text-xs font-black text-neutral-900">Rp {(totalPengeluaran/1000000).toFixed(1)}jt</span>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-neutral-100 pt-3">
              {expenseChartData.slice(0, 3).map((item, idx) => (
                <div key={item.name} className="flex justify-between items-center text-[10px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-neutral-600 truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="text-neutral-950">
                    Rp {item.value.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Import from Admissions Board */}
          <div className="lg:col-span-3 bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1">
                  <UserPlus size={14} className="text-primary" />
                  Impor Mahasiswa dari Pendaftar PMB Online
                </h3>
                <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                  Mudahkan pencatatan administrasi SPP dengan mengimpor langsung berkas calon mahasiswa yang sudah lulus evaluasi PMB.
                </p>
              </div>
              <span className="text-[9px] bg-blue-50 text-blue-700 font-black px-2 py-1 rounded-full border border-blue-150">
                {pmbApplicants.length} Pendaftar Terdeteksi
              </span>
            </div>

            {pmbApplicants.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
                <p className="text-xs text-neutral-400 font-semibold">Tidak ada pendaftar PMB online saat ini untuk diimpor.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-neutral-100 rounded-xl">
                <table className="w-full text-left border-collapse text-[11px] font-bold">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[8px]">
                      <th className="px-4 py-3">Nama Lengkap</th>
                      <th className="px-4 py-3">Pilihan Program Studi</th>
                      <th className="px-4 py-3">Kelas</th>
                      <th className="px-4 py-3">Status PMB</th>
                      <th className="px-4 py-3 text-right">Aksi Administrasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {pmbApplicants.slice(0, 4).map((app, i) => {
                      // Check if already in the list
                      const alreadyImported = studentPayments.some(s => s.name.toLowerCase() === app.name.toLowerCase());
                      return (
                        <tr key={app.id || i} className="hover:bg-neutral-50/50">
                          <td className="px-4 py-3 text-neutral-900 font-extrabold">{app.name}</td>
                          <td className="px-4 py-3 text-neutral-600">{app.major || "D3 Perhotelan"}</td>
                          <td className="px-4 py-3 text-neutral-600">{app.classType || "Reguler"}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                              app.status === "Lulus Seleksi" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-neutral-100 text-neutral-500"
                            }`}>
                              {app.status || "Baru"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {alreadyImported ? (
                              <span className="text-[9px] text-emerald-600 flex items-center justify-end gap-1 font-bold">
                                <Check size={12} /> Sudah Terdaftar
                              </span>
                            ) : (
                              <button
                                onClick={() => handleImportFromPmb(app)}
                                className="px-2.5 py-1 bg-primary hover:bg-opacity-90 text-white rounded-lg text-[9px] font-black cursor-pointer transition flex items-center gap-1 ml-auto"
                              >
                                <Plus size={10} /> Impor ke SPP
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. TUITION FEES / SPP LIST TAB */}
      {activeSubTab === "spp" && (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-6 animate-fade-in">
          
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">Daftar Tagihan UKT / SPP Mahasiswa</h3>
              <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Kelola status pelunasan uang kuliah tunggal mahasiswa APJ.</p>
            </div>
            
            <button 
              onClick={() => setShowAddSppModal(true)}
              className="px-4 py-2 bg-primary hover:bg-opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-stretch md:self-auto justify-center"
            >
              <Plus size={14} /> Tambah Tagihan Baru
            </button>
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px] font-bold text-neutral-600">
            {/* Search */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[9px] text-neutral-400 uppercase tracking-wider block">Cari Nama atau NIM</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text"
                  value={sppSearch}
                  onChange={(e) => setSppSearch(e.target.value)}
                  placeholder="Ketik nama mahasiswa atau NIM..."
                  className="w-full bg-white border border-neutral-200 pl-8 pr-3 py-1.5 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Major Filter */}
            <div className="space-y-1">
              <label className="text-[9px] text-neutral-400 uppercase tracking-wider block">Program Studi</label>
              <select 
                value={sppFilterMajor} 
                onChange={(e) => setSppFilterMajor(e.target.value as any)}
                className="w-full bg-white border border-neutral-200 p-1.5 rounded-lg text-xs"
              >
                <option value="Semua">Semua Program Studi</option>
                <option value="D3 Perhotelan">D3 Perhotelan</option>
                <option value="D3 Usaha Perjalanan Wisata">D3 Usaha Perjalanan Wisata</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-[9px] text-neutral-400 uppercase tracking-wider block">Status Pelunasan</label>
              <select 
                value={sppFilterStatus} 
                onChange={(e) => setSppFilterStatus(e.target.value as any)}
                className="w-full bg-white border border-neutral-200 p-1.5 rounded-lg text-xs"
              >
                <option value="Semua">Semua Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Menunggu">Menunggu Konfirmasi</option>
                <option value="Tunggakan">Tunggakan</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto border border-neutral-150 rounded-xl">
            <table className="w-full text-left border-collapse text-[11px] font-bold">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[8px]">
                  <th className="px-4 py-3">Nama Mahasiswa</th>
                  <th className="px-4 py-3">NIM</th>
                  <th className="px-4 py-3">Program Studi</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Nominal SPP</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Terakhir Bayar</th>
                  <th className="px-4 py-3 text-right">Manajemen Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-neutral-400 italic">
                      Tidak ditemukan data tagihan mahasiswa yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stud, idx) => (
                    <tr key={stud.id || idx} className="hover:bg-neutral-50/50">
                      <td className="px-4 py-3 text-neutral-900 font-extrabold">{stud.name}</td>
                      <td className="px-4 py-3 text-neutral-500 font-mono text-[10px]">{stud.nim}</td>
                      <td className="px-4 py-3 text-neutral-600">{stud.major}</td>
                      <td className="px-4 py-3 text-neutral-600">{stud.classType}</td>
                      <td className="px-4 py-3 text-neutral-900">Rp {stud.amount.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide border ${
                          stud.status === "Lunas" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          stud.status === "Menunggu" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {stud.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-400 font-semibold">{stud.lastPaid || "-"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {stud.status !== "Lunas" && (
                            <button
                              onClick={() => handleUpdateSppStatus(stud.id!, "Lunas")}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black rounded cursor-pointer transition flex items-center gap-0.5"
                              title="Setel Lunas"
                            >
                              <Check size={10} /> Lunas
                            </button>
                          )}
                          {stud.status === "Lunas" && (
                            <button
                              onClick={() => handleUpdateSppStatus(stud.id!, "Tunggakan")}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[9px] font-black rounded border border-amber-200 cursor-pointer transition"
                              title="Setel Menunggak"
                            >
                              Batal
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSpp(stud.id!)}
                            className="p-1 hover:text-red-600 text-neutral-300 transition cursor-pointer"
                            title="Hapus"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. CAMPUS EXPENSES TAB */}
      {activeSubTab === "expenses" && (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">Catatan Pengeluaran & Anggaran Kampus</h3>
              <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Catat seluruh pengeluaran untuk bahan baku, lab praktik, dan operasional lainnya.</p>
            </div>
            
            <button 
              onClick={() => setShowAddExpenseModal(true)}
              className="px-4 py-2 bg-primary hover:bg-opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-stretch sm:self-auto justify-center"
            >
              <Plus size={14} /> Catat Pengeluaran Baru
            </button>
          </div>

          {/* Table List of Expenses */}
          <div className="overflow-x-auto border border-neutral-150 rounded-xl">
            <table className="w-full text-left border-collapse text-[11px] font-bold">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[8px]">
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Kategori Anggaran</th>
                  <th className="px-4 py-3">Deskripsi / Kegunaan</th>
                  <th className="px-4 py-3">Nominal Biaya</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-neutral-400 italic">
                      Belum ada pengeluaran operasional yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp, idx) => (
                    <tr key={exp.id || idx} className="hover:bg-neutral-50/50">
                      <td className="px-4 py-3 text-neutral-500 font-mono text-[10px]">{exp.date}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 text-[8px] font-extrabold uppercase rounded-full border border-neutral-200">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 font-semibold max-w-xs truncate" title={exp.description}>
                        {exp.description}
                      </td>
                      <td className="px-4 py-3 text-red-600 font-black">
                        Rp {exp.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteExpense(exp.id!)}
                          className="text-neutral-300 hover:text-red-600 transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 4. AI FINANCIAL ADVISOR TAB */}
      {activeSubTab === "ai_advisor" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Input details panel */}
          <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">Dr. EduFin AI Advisor</h3>
                <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Audit anggaran otomatis berbasis Gemini 3.5 Flash.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
              Dr. EduFin AI akan secara dinamis menganalisis total perputaran kas Akademi Pariwisata Jakarta (Pemasukan, Biaya Bahan Baku Lab Kuliner, Promosi PMB, dan Tunggakan Uang Kuliah).
            </p>

            <div className="space-y-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200/50 text-[11px] font-bold text-neutral-600">
              <div className="flex justify-between border-b border-amber-100 pb-1.5">
                <span>Rasio Pemasukan / Pengeluaran:</span>
                <span className="text-neutral-900">{(totalPemasukan / Math.max(1, totalPengeluaran)).toFixed(2)}x</span>
              </div>
              <div className="flex justify-between border-b border-amber-100 pb-1.5">
                <span>Rasio Piutang SPP / Kas Bersih:</span>
                <span className="text-neutral-900">{(totalTunggakanSpp / Math.max(1, sisaSaldo) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Anggaran Lab Praktik:</span>
                <span className="text-neutral-900">
                  Rp {expenses.filter(e => e.category === "Bahan Lab Praktik").reduce((sum, e) => sum + e.amount, 0).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={handleConsultAiAdvisor}
              disabled={isAiLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-neutral-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow border-b-2 border-amber-700"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Mengevaluasi Arus Kas...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Mulai Audit Anggaran Otomatis
                </>
              )}
            </button>
          </div>

          {/* AI Report presentation */}
          <div className="lg:col-span-2 bg-neutral-950 text-neutral-100 p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <span className="text-[10px] bg-amber-400 text-neutral-950 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Hasil Audit Dr. EduFin
                </span>
                <span className="text-[9px] text-neutral-500 font-mono font-bold">Model: Gemini-3.5-Flash</span>
              </div>

              {isAiLoading ? (
                <div className="space-y-4 py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></div>
                  <div className="space-y-1">
                    <div className="text-xs text-neutral-300 font-extrabold animate-pulse">Menghitung rasio finansial APJ...</div>
                    <div className="text-[10px] text-neutral-500">Mengkoneksikan data transaksi ke Gemini AI</div>
                  </div>
                </div>
              ) : aiReport ? (
                <div className="text-xs leading-relaxed font-bold space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin text-neutral-300">
                  {aiReport.split("\n").map((line, idx) => {
                    if (line.startsWith("## ") || line.startsWith("**")) {
                      return <div key={idx} className="text-neutral-100 font-black text-sm pt-2 text-amber-300">{line.replace("##", "").replace(/\*\*/g, "")}</div>;
                    }
                    if (line.startsWith("- ")) {
                      return <div key={idx} className="pl-4 border-l border-amber-400/50 py-0.5 text-neutral-300">{line}</div>;
                    }
                    return <div key={idx} className="text-neutral-300">{line}</div>;
                  })}
                </div>
              ) : (
                <div className="py-16 text-center text-neutral-500 space-y-2">
                  <span className="text-4xl block">🧠</span>
                  <div className="text-xs font-bold text-neutral-400">Silakan klik tombol "Mulai Audit Anggaran Otomatis" untuk meminta rekomendasi keuangan kampus dari AI.</div>
                </div>
              )}
            </div>

            {aiReport && (
              <div className="border-t border-neutral-800 pt-3 mt-4 flex justify-between items-center text-[10px] text-neutral-500 font-semibold">
                <span>Yayasan Pendidikan Jayakarta - EduFin AI Advisor</span>
                <button 
                  onClick={() => {
                    const blob = new Blob([aiReport], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `Audit_Keuangan_APJ_${new Date().toISOString().split("T")[0]}.txt`;
                    a.click();
                  }}
                  className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Download size={12} /> Unduh Laporan (.txt)
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODAL: ADD STUDENT PAYMENT */}
      {showAddSppModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs font-sans text-neutral-800">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative border border-neutral-100">
            <div>
              <h4 className="text-sm font-black text-neutral-900 font-heading uppercase tracking-wider">
                Buat Tagihan SPP Mahasiswa Baru
              </h4>
              <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">
                Masukkan rincian mahasiswa dan nominal tagihan SPP untuk semester ini.
              </p>
            </div>

            <form onSubmit={handleAddStudentPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Nama Lengkap Mahasiswa</label>
                <input 
                  type="text"
                  required
                  value={sppName}
                  onChange={(e) => setSppName(e.target.value)}
                  placeholder="Contoh: Rian Hidayat"
                  className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">NIM Mahasiswa</label>
                  <input 
                    type="text"
                    required
                    value={sppNim}
                    onChange={(e) => setSppNim(e.target.value)}
                    placeholder="Contoh: APJ20260012"
                    className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Kelas</label>
                  <select 
                    value={sppClassType}
                    onChange={(e) => setSppClassType(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold text-xs"
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="Kelas Karyawan">Kelas Karyawan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Program Studi</label>
                <select 
                  value={sppMajor}
                  onChange={(e) => setSppMajor(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold text-xs"
                >
                  <option value="D3 Perhotelan">D3 Perhotelan</option>
                  <option value="D3 Usaha Perjalanan Wisata">D3 Usaha Perjalanan Wisata</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Nominal SPP (Rp)</label>
                  <input 
                    type="number"
                    required
                    value={sppAmount}
                    onChange={(e) => setSppAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Status Awal</label>
                  <select 
                    value={sppStatus}
                    onChange={(e) => setSppStatus(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold text-xs"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Tunggakan">Tunggakan</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end font-bold">
                <button 
                  type="button"
                  onClick={() => setShowAddSppModal(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 rounded-xl cursor-pointer transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-primary text-white hover:bg-opacity-90 rounded-xl cursor-pointer transition flex items-center gap-1"
                >
                  <Check size={14} /> Buat Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CAMPUS EXPENSE */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs font-sans text-neutral-800">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative border border-neutral-100">
            <div>
              <h4 className="text-sm font-black text-neutral-900 font-heading uppercase tracking-wider">
                Catat Pengeluaran Operasional Baru
              </h4>
              <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">
                Masukkan detail pengeluaran kampus untuk memotong saldo kas utama APJ.
              </p>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Kategori Pengeluaran</label>
                  <select 
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold text-xs"
                  >
                    <option value="Bahan Lab Praktik">Bahan Lab Praktik</option>
                    <option value="Utilitas Kampus">Utilitas Kampus</option>
                    <option value="Perbaikan Lab Hotel">Perbaikan Lab Hotel</option>
                    <option value="Gaji & Staf">Gaji & Staf</option>
                    <option value="Promosi & PMB">Promosi & PMB</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Tanggal Transaksi</label>
                  <input 
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Nominal Pengeluaran (Rp)</label>
                <input 
                  type="number"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder="Contoh: 3500000"
                  className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Deskripsi Kegiatan / Belanja</label>
                <textarea 
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Pembelian bahan mentah bumbu dapur dan buah segar untuk ujian praktikum kuliner mahasiswa"
                  className="w-full bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl font-semibold text-xs resize-none"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end font-bold">
                <button 
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 rounded-xl cursor-pointer transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-primary text-white hover:bg-opacity-90 rounded-xl cursor-pointer transition flex items-center gap-1"
                >
                  <Check size={14} /> Catat Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
