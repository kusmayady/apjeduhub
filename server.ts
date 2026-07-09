import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "placeholder_key", // Prevent crash if key is undefined
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// === FALLBACK GENERATORS (OFFLINE / OVERLOAD PROTECTION) ===

function getFallbackChatResponse(message: string): string {
  const msg = message.toLowerCase();
  const intro = "Halo! Terima kasih telah menghubungi Layanan Konselor AI Virtual Akademi Pariwisata Jakarta (APJ).\n\n";
  
  if (msg.includes("perhotelan") || msg.includes("hotel") || msg.includes("d3 perhotelan")) {
    return intro + "Program Studi D3 Perhotelan (Hotel Management) di APJ berfokus pada keahlian operasional hotel berstandar internasional. Mahasiswa dilatih langsung di laboratorium praktik simulator hotel bintang 5 terpadu kami yang mencakup Front Office, Housekeeping, Food & Beverage Product (Kitchen/Bakery), dan Food & Beverage Service.\n\nLulusan kami sangat terserap di berbagai hotel berbintang, resor mewah, kapal pesiar internasional, dan sektor pariwisata lainnya.";
  }
  
  if (msg.includes("wisata") || msg.includes("perjalanan") || msg.includes("travel") || msg.includes("bina wisata")) {
    return intro + "Program Studi D3 Usaha Perjalanan Wisata (Bina Wisata) di APJ membekali mahasiswa dengan kemampuan merancang paket wisata, manajemen agen perjalanan (travel agent), pemanduan wisata (tour guiding), serta MICE (Meeting, Incentive, Convention, Exhibition).\n\nKami bekerja sama erat dengan maskapai penerbangan, agen wisata besar, dan badan otorita pariwisata nasional maupun regional untuk penyaluran magang dan kerja.";
  }
  
  if (msg.includes("biaya") || msg.includes("spp") || msg.includes("bayar") || msg.includes("kuliah") || msg.includes("harga")) {
    return intro + "Biaya kuliah di Akademi Pariwisata Jakarta (APJ) dikelola secara transparan tanpa biaya praktik tersembunyi. Sangat terjangkau dan kami menyediakan sistem cicilan bulanan yang fleksibel untuk meringankan beban orang tua mahasiswa.\n\nUntuk informasi detail rincian biaya per semester dan skema angsuran terbaru, silakan tinggalkan kontak Anda atau hubungi bagian Admisi PMB kami.";
  }
  
  if (msg.includes("beasiswa") || msg.includes("prestasi") || msg.includes("kip")) {
    return intro + "APJ berkomitmen mendukung talenta-talenta pariwisata berbakat melalui berbagai jalur Beasiswa:\n1. Beasiswa Prestasi Akademik (berdasarkan nilai rapor SMA/SMK)\n2. Beasiswa Minat & Bakat (olahraga, seni, organisasi)\n3. Kerjasama beasiswa instansi pemerintah dan industri pariwisata.\n\nHubungi tim admisi kami untuk berkonsultasi mengenai beasiswa yang paling cocok bagi Anda.";
  }
  
  if (msg.includes("syarat") || msg.includes("daftar") || msg.includes("pendaftaran") || msg.includes("cara masuk")) {
    return intro + "Pendaftaran Mahasiswa Baru di APJ sangat mudah:\n1. Mengisi Formulir Pendaftaran online atau offline.\n2. Melampirkan fotokopi ijazah SMA/SMK/MA sederajat.\n3. Pas foto terbaru.\n4. Mengikuti tes seleksi/wawancara minat bakat pariwisata.\n\nKami juga membuka Kelas Karyawan/Eksekutif yang fleksibel bagi profesional yang ingin meningkatkan jenjang karir sambil bekerja.";
  }
  
  if (msg.includes("lokasi") || msg.includes("alamat") || msg.includes("dimana") || msg.includes("peta")) {
    return intro + "Kampus Akademi Pariwisata Jakarta berlokasi sangat strategis di pusat kota Jakarta:\n📍 Jl. Cempaka Putih Tengah XVII No. 1, Jakarta Pusat.\n\nKampus kami mudah diakses menggunakan moda transportasi umum (TransJakarta, KRL, ojek online) dan dikelilingi oleh area kuliner, perbelanjaan, serta perkantoran.";
  }
  
  return intro + "Akademi Pariwisata Jakarta (APJ) didirikan pada Juni 1972 oleh Yayasan Pendidikan Jayakarta. Kampus kami menyediakan program D3 Perhotelan dan D3 Usaha Perjalanan Wisata dengan fasilitas simulator bintang 5 terpadu serta jaminan magang internasional bergengsi.\n\nAda hal spesifik yang ingin Anda tanyakan? Misalnya seputar Program Studi, Biaya Kuliah, Pendaftaran PMB, atau Lokasi Kampus kami.";
}

function getFallbackArticleResponse(reqBody: any): { content: string; lead: string } {
  const { 
    topic, 
    tone, 
    title, 
    wWhat, 
    wWhoParty1, 
    wWhoRole1, 
    wWhoParty2, 
    wWhoRole2, 
    wWhere, 
    wWhen, 
    wWhy, 
    wHow 
  } = reqBody;
  
  const whatText = wWhat || topic || "kegiatan pengembangan akademik pariwisata dan perhotelan";
  const whereText = wWhere || "Kampus APJ Jakarta";
  const whenText = wWhen || "baru-baru ini";
  const whoText = wWhoParty1 
    ? `${wWhoParty1} ${wWhoRole1 ? `(${wWhoRole1})` : ""}${wWhoParty2 ? ` bersama dengan ${wWhoParty2} ${wWhoRole2 ? `(${wWhoRole2})` : ""}` : ""}`
    : "seluruh civitas akademika Akademi Pariwisata Jakarta (APJ)";
  const whyText = wWhy || "guna membekali mahasiswa dengan keahlian berskala global dan sertifikasi industri pariwisata bintang lima";
  const howText = wHow || "berlangsung dengan sangat interaktif dan diisi dengan sesi praktik simulator langsung di laboratorium hotel terpadu";

  const lead = `Akademi Pariwisata Jakarta (APJ) sukses melaksanakan ${whatText} yang melibatkan ${whoText} bertempat di ${whereText} pada ${whenText}.`;
  
  const paragraph1 = `JAKARTA - Akademi Pariwisata Jakarta (APJ) kembali menunjukkan komitmennya sebagai salah satu institusi pendidikan tinggi vokasi pariwisata terkemuka dengan menyelenggarakan ${whatText}. Kegiatan yang diselenggarakan pada ${whenText} ini berpusat di ${whereText} dan dihadiri oleh jajaran pimpinan Yayasan Pendidikan Jayakarta, dosen, praktisi industri, serta mahasiswa program studi terkait.`;
  
  const paragraph2 = `Adapun keterlibatan aktif dari ${whoText} memberikan warna tersendiri dalam pelaksanaan agenda penting ini. Pelaksanaan kegiatan didasari oleh latar belakang yang kuat, di mana ${whyText}. Hal ini selaras dengan visi jangka panjang APJ untuk terus mencetak lulusan profesional yang siap bersaing di kancah pariwisata dan perhotelan internasional.`;
  
  const paragraph3 = `Selama acara berlangsung, ${howText}. Partisipasi aktif peserta terlihat dari tingginya antusiasme selama sesi tanya jawab dan uji simulator laboratorium berstandar bintang lima yang dimiliki APJ. Fasilitas praktikum terpadu ini memang dipersiapkan secara maksimal agar mahasiswa terbiasa dengan ekosistem kerja nyata di industri hospitality global.`;
  
  const paragraph4 = `Dengan terlaksananya agenda strategis ini, Akademi Pariwisata Jakarta berharap sinergi antara dunia akademis dan industri pariwisata dapat terjalin semakin kokoh. Upaya berkelanjutan ini merupakan bagian penting dari langkah APJ dalam menyediakan kurikulum vokasional yang adaptif, transparan, dan berorientasi pada kesiapan karir masa depan lulusannya.\n\n#APJSinergi #PendidikanVokasi #HotelManagement #PraktikBintang5`;

  const content = `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}\n\n${paragraph4}`;

  return { lead, content };
}

function getFallbackEduFinResponse(reqBody: any): string {
  const { totalIncome, totalExpenses, cashFlow, pendingFees, expensesBreakdown } = reqBody;
  
  const inc = totalIncome || 150000000;
  const exp = totalExpenses || 120000000;
  const cf = cashFlow || (inc - exp);
  const pf = pendingFees || 30000000;
  
  return `**I. EVALUASI KESEHATAN ARUS KAS**
Kampus saat ini memiliki total pemasukan operasional sebesar Rp ${inc.toLocaleString("id-ID")} dengan total pengeluaran operasional Rp ${exp.toLocaleString("id-ID")}. Hal ini menyisakan saldo kas bersih (Net Cash Flow) sebesar Rp ${cf.toLocaleString("id-ID")}. Secara umum, rasio operasional berada di angka ${(exp / inc * 100).toFixed(1)}%, yang mengindikasikan keuangan dalam kategori sehat namun memerlukan pengawasan ketat terhadap efisiensi biaya overhead agar surplus dapat dimaksimalkan untuk investasi fasilitas praktikum baru.

**II. ANALISIS ANGGARAN OPERASIONAL & PRAKTIK**
Alokasi pengeluaran operasional mencakup bahan baku praktikum kuliner, operasional simulator perhotelan, pemeliharaan lab, serta kompensasi instruktur praktisi. Mengingat standar praktik APJ setara hotel bintang 5, disarankan untuk melakukan sistem pengadaan bahan baku kuliner berskala grosir melalui kontrak kerja sama (MoU) dengan pemasok pangan lokal. Hal ini berpotensi menghemat anggaran praktikum hingga 15% tanpa mengurangi mutu serta kualitas bahan ajar praktis bagi mahasiswa.

**III. STRATEGI REDUKSI TUNGGAKAN SPP/UKT**
Laporan mencatat total tunggakan SPP mahasiswa berada di angka Rp ${pf.toLocaleString("id-ID")}. Untuk menekan angka piutang ini secara persuasif, pihak administrasi keuangan APJ dapat menerapkan langkah berikut:
1. **Sistem Pengingat Otomatis**: Integrasi notifikasi WhatsApp/Email berkala 7 hari sebelum jatuh tempo SPP.
2. **Kelonggaran Cicilan Terstruktur**: Memfasilitasi mahasiswa yang kesulitan melalui program angsuran bulanan tetap tanpa bunga tambahan.
3. **Insentif Pembayaran Awal**: Memberikan diskon atau potongan biaya laboratorium sebesar 2-5% bagi mahasiswa yang melakukan pelunasan biaya kuliah penuh di awal semester.

**IV. REKOMENDASI TAKTIS & ALOKASI SURPLUS**
Manajemen Yayasan Pendidikan Jayakarta direkomendasikan untuk mengalokasikan 30% dari surplus kas bersih (Rp ${(cf * 0.3).toLocaleString("id-ID")}) ke dalam Dana Cadangan Darurat Kampus. Sisa surplus lainnya dapat dialokasikan untuk memperbarui lisensi software manajemen hotel (Property Management System) terbaru di laboratorium simulator Front Office serta membiayai program sertifikasi kompetensi pariwisata nasional bagi dosen pembimbing agar mutu lulusan APJ terus berada di tingkat teratas industri pariwisata nasional.`;
}

function getFallbackAIStudioResponse(prompt: string): any {
  return {
    title: `Halaman Edukasi: ${prompt}`,
    subtitle: "Pusat Transformasi Pendidikan Vokasi Pariwisata Jakarta",
    heroBanner: {
      title: "Membangun Karir Hospitality Global Berstandar Bintang 5",
      subtitle: "Bergabung bersama Akademi Pariwisata Jakarta (APJ) dan mulailah perjalanan karir pariwisata berstandar internasional dengan biaya transparan serta terjangkau.",
      ctaText: "Daftar PMB Sekarang",
      imageConcept: "Foto interaktif mahasiswa APJ mengenakan seragam perhotelan lengkap di area simulator front office modern"
    },
    sections: [
      {
        title: "Mengapa Memilih Kurikulum Unggulan APJ?",
        content: "Sejak didirikan pada tahun 1972 oleh Yayasan Pendidikan Jayakarta, Akademi Pariwisata Jakarta konsisten mencetak talenta unggul di bidang perhotelan dan pariwisata. Dengan kurikulum yang berbasis 70% praktik langsung di laboratorium bintang 5 terpadu dan 30% teori komprehensif, lulusan kami memiliki daya saing tinggi dan terserap cepat di pasar kerja global."
      },
      {
        title: "Program Magang Internasional & Jalur Karir",
        content: "Kami menyediakan jalur kerjasama eksklusif magang industri pariwisata terkemuka baik di dalam negeri maupun luar negeri seperti Malaysia, Singapura, Thailand, dan Timur Tengah. Jaringan alumni APJ yang luas juga mempermudah proses rekrutmen lulusan baru langsung ke industri hospitality internasional."
      }
    ],
    faqs: [
      {
        q: "Apakah biaya praktikum di APJ dikenakan biaya tambahan lagi?",
        a: "Tidak. Seluruh biaya kuliah di APJ bersifat transparan dan sudah mencakup biaya praktik laboratorium terpadu tanpa biaya tersembunyi lainnya."
      },
      {
        q: "Bagaimana cara melakukan angsuran pembayaran kuliah?",
        a: "APJ menyediakan skema cicilan bulanan yang fleksibel. Mahasiswa dapat mengangsur biaya perkuliahan setiap bulannya sesuai kesepakatan tertulis dengan bagian keuangan."
      }
    ],
    seo: {
      metaTitle: `Kuliah Pariwisata Terpercaya - Akademi Pariwisata Jakarta | ${prompt}`,
      metaDescription: "Temukan keunggulan program D3 Perhotelan & Usaha Perjalanan Wisata di Akademi Pariwisata Jakarta. Fasilitas simulator bintang 5 terpadu dan kerja sama karir global.",
      keywords: "akademi pariwisata jakarta, apj, kuliah perhotelan, bina wisata, sekolah pariwisata jakarta, d3 perhotelan, biaya kuliah dicicil",
      schemaMarkup: "{\"@context\":\"https://schema.org\",\"@type\":\"EducationalOrganization\",\"name\":\"Akademi Pariwisata Jakarta\",\"url\":\"https://apj.ac.id\",\"logo\":\"/input_file_1.png\"}"
    },
    colorPalette: {
      primary: "#0050A0",
      secondary: "#002f5a",
      accent: "#D4AF37"
    }
  };
}

// === ROBUST GEMINI CALLER WITH RETRY & FALLBACK MODELS ===

async function generateContentWithRetry(params: {
  contents: any;
  config?: any;
  defaultModel?: string;
}) {
  const prohibitedModels = [
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-2.5-pro",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-2.0-flash",
    "gemini-2.0-pro",
    "gemini-2.0-flash-thinking"
  ];

  const defaultModel = params.defaultModel || "gemini-3.5-flash";
  const modelsToTry = [
    defaultModel,
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ].filter(m => m && !prohibitedModels.includes(m));
  
  const uniqueModels = Array.from(new Set(modelsToTry));
  let lastError: any = null;
  
  for (const modelName of uniqueModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini API] calling ${modelName} (attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini API] model ${modelName} (attempt ${attempt}) failed:`, err.message || err);
        // Wait 300ms before next retry/model fallback
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }
  
  throw lastError;
}

// === API ROUTES ===

// 1. Endpoint for AI Counselor Chat inside KontakView
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    if (!message) {
      return res.status(400).json({ error: "Kolom pesan harus diisi." });
    }

    if (!apiKey) {
      console.warn("Kunci API Gemini tidak dikonfigurasi. Menggunakan chatbot offline fallback.");
      return res.json({ text: getFallbackChatResponse(message) });
    }

    const systemInstruction = 
      "Anda adalah Konselor AI Virtual resmi dari Akademi Pariwisata Jakarta (APJ). " +
      "Berikan informasi yang akurat, ramah, profesional, dan inspiratif tentang APJ.\n\n" +
      "Informasi Utama APJ:\n" +
      "- Didirikan: Juni 1972 oleh Yayasan Pendidikan Jayakarta.\n" +
      "- Lokasi: Jl. Cempaka Putih Tengah XVII No. 1, Jakarta Pusat.\n" +
      "- Program Studi: D3 Perhotelan (Hotel Management) dan D3 Usaha Perjalanan Wisata (Bina Wisata).\n" +
      "- Keunggulan: Fasilitas laboratorium praktik simulator berstandar bintang 5 terpadu, pusat pengembangan karir dan kerjasama magang internasional/nasional bergengsi, beasiswa berprestasi, jalur kelas karyawan fleksibel.\n" +
      "- Biaya: Transparan tanpa biaya praktik tersembunyi, dapat diangsur bulanan.\n\n" +
      "Jawablah seluruh pertanyaan dalam bahasa Indonesia yang ramah, sopan, tulus, dan komunikatif.";

    const response = await generateContentWithRetry({
      defaultModel: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Kesalahan API Chat, mengaktifkan asisten fallback:", error);
    try {
      const fallbackText = getFallbackChatResponse(message || "");
      res.json({ text: fallbackText });
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Terjadi kegagalan komunikasi dengan AI." });
    }
  }
});

// 2. Endpoint for AI Article Generator Inside AdminView
app.post("/api/generate-article", async (req, res) => {
  try {
    const { 
      topic, 
      tone, 
      title, 
      include5W1H, 
      detoxAI,
      wWhat,
      wWhoParty1,
      wWhoRole1,
      wWhoParty2,
      wWhoRole2,
      wWhere,
      wWhen,
      wWhy,
      wHow
    } = req.body;

    if (!topic && !wWhat) {
      return res.status(400).json({ error: "Topik utama atau data kejadian wajib diisi." });
    }

    if (!apiKey) {
      console.warn("Kunci API Gemini tidak dikonfigurasi. Menggunakan pembuat artikel offline fallback.");
      const fallbackResult = getFallbackArticleResponse(req.body);
      return res.json({ 
        text: fallbackResult.content,
        lead: fallbackResult.lead
      });
    }

    let systemInstruction = 
      "Anda adalah penulis artikel dan copywriter edukasi profesional untuk website resmi Akademi Pariwisata Jakarta (APJ). " +
      "Tugas Anda mengarang artikel berita atau blog pariwisata yang sangat menarik, berbobot, mendalam, dan kaya informasi " +
      "untuk dipublikasikan di halaman Kabar Utama kampus APJ.\n\n" +
      "Anda WAJIB memberikan respons dalam format JSON dengan struktur berikut:\n" +
      "{\n" +
      "  \"lead\": \"<Keterangan singkat / lead artikel dengan jumlah kata maksimal sesuai batas (sekitar 25 kata)>\",\n" +
      "  \"content\": \"<Isi lengkap artikel sebanyak 250 - 500 kata dengan pembagian paragraf berjarak double-newline>\"\n" +
      "}\n\n" +
      "Aturan Format Penulisan:\n" +
      "1. Artikel harus ditulis dalam bahasa Indonesia yang sangat baik.\n" +
      "2. Pisahkan antar paragraf dalam properti 'content' dengan dua baris baru kosong (\\n\\n) agar tampilan di web rapi.\n" +
      "3. Berikan pembukaan yang menarik, pembahasan isu/informasi secara detail, dan penutupan yang inovatif.\n" +
      "4. JANGAN gunakan tanda format markdown yang terlalu kompleks (cukup paragraf standar dan pemisahan baris).\n" +
      "5. RINGKASAN HASTAG: Sesuai permintaan pengguna, Anda dilarang keras melampirkan bullet points atau rincian teks analisis 5W+1H atau ringkasan apapun di dalam isi berita/artikel tersebut. Sebagai gantinya, buatkan saja baris berisi 3 hingga 5 hashtag (tagar) pariwisata yang sangat relevan (misalnya: #APJSinergi #HotelManagement #PraktikBintang5) di baris paling akhir artikel (paling bawah properti 'content')..";

    if (detoxAI) {
      systemInstruction += "\n\n6. DETOX AI AKTIF:\n" +
        "- Anda WAJIB membuang segala kata-kata cliché atau kata-kata khas kecerdasan buatan (seperti: 'merupakan', 'menakjubkan', 'dalam rangka', 'revolusioner', 'hadir sebagai solusi', 'penting untuk diingat', 'inovasi modern', 'yuk bergabung', 'sinergi', 'pilar utama', 'tidak hanya itu', 'menatap masa depan').\n" +
        "- Tulislah dengan gaya jurnalistik manusia tulen yang lugas, informatif, jujur, dan berwibawa.\n" +
        "- Properti 'lead' WAJIB dibuat dengan panjang TEPAT ATAU SEKITAR 25 KATA saja (instruksi ketat 25 kata).";
    } else {
      systemInstruction += "\n\n6. Properti 'lead' adalah keterangan singkat atau ringkasan berita dari artikel utama dengan panjang sekitar 20 - 30 kata.";
    }

    // Build rich prompt containing user's inputted 5W + 1H elements
    let structuredInfo = "";
    if (wWhat) structuredInfo += `- WHAT (Apa Kejadiannya/Agendanya): ${wWhat}\n`;
    if (wWhoParty1 || wWhoParty2) {
      structuredInfo += `- WHO (Siapa yang terlibat & perannya):\n`;
      if (wWhoParty1) structuredInfo += `  * Pihak Pertama: ${wWhoParty1} ${wWhoRole1 ? `(sebagai/peran: ${wWhoRole1})` : ""}\n`;
      if (wWhoParty2) structuredInfo += `  * Pihak Kedua: ${wWhoParty2} ${wWhoRole2 ? `(sebagai/peran: ${wWhoRole2})` : ""}\n`;
    }
    if (wWhere) structuredInfo += `- WHERE (M lokasi/Tempat): ${wWhere}\n`;
    if (wWhen) structuredInfo += `- WHEN (Waktu/Hari/Kapan): ${wWhen}\n`;
    if (wWhy) structuredInfo += `- WHY (Mengapa kegiatan ini penting/Tujuan): ${wWhy}\n`;
    if (wHow) structuredInfo += `- HOW (Bagaimana proses/Mekanisme detail): ${wHow}\n`;

    const topicFlipped = topic || wWhat;
    const prompt = `Buatkan artikel mendalam mengenai: "${topicFlipped}" ${title ? `dengan judul "${title}"` : ""}.\n\n` +
      `Gunakan nada penulisan: ${tone || "Professional"}.\n\n` +
      `Sangat penting untuk memanfaatkan informasi kelengkapan fakta 5W + 1H berikut untuk diolah menjadi jalannya cerita artikel secara mengalir:\n${structuredInfo || "Tidak ada detail 5W+1H tambahan."}\n\n` +
      `Artikel ini harus menggambarkan wawasan luas seputar hospitality, pariwisata, kuliner, karir global, atau keunggulan akademik kampus APJ Jakarta. Pastikan di bagian paling bawah isi artikel mencantumkan hashtag yang relevan, dan JANGAN tampilkan teks ringkasan rincian 5W+1H apa pun dalam bentuk daftar/bullet.`;

    const response = await generateContentWithRetry({
      defaultModel: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json"
      }
    });

    let result = { content: "", lead: "" };
    try {
      let rawText = response.text || "{}";
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }
      result = JSON.parse(cleanJson);
    } catch (parseError) {
      console.warn("Gagal mengekstrak JSON terstruktur, menggunakan perata teks fallback:", parseError);
      const text = response.text || "";
      const words = text.split(/\s+/);
      result = {
        content: text,
        lead: words.slice(0, 25).join(" ") + "..."
      };
    }

    res.json({ 
      text: result.content || result.text || "",
      lead: result.lead || ""
    });
  } catch (error: any) {
    console.error("Kesalahan API Artikel, mengaktifkan artikel fallback:", error);
    try {
      const fallbackResult = getFallbackArticleResponse(req.body);
      res.json({ 
        text: fallbackResult.content,
        lead: fallbackResult.lead
      });
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Terjadi kesalahan saat AI membuat artikel." });
    }
  }
});

// 3. Endpoint for EduFin AI Financial Advisor
app.post("/api/edufin-advisor", async (req, res) => {
  try {
    const { totalIncome, totalExpenses, cashFlow, pendingFees, expensesBreakdown } = req.body;

    if (!apiKey) {
      console.warn("Kunci API Gemini tidak dikonfigurasi. Menggunakan analisis finansial offline fallback.");
      return res.json({ analysis: getFallbackEduFinResponse(req.body) });
    }

    const systemInstruction = 
      "Anda adalah Dr. EduFin, Konsultan Analisis Keuangan Akademik Senior khusus perguruan tinggi pariwisata. " +
      "Tugas Anda adalah meninjau laporan arus kas, anggaran operasional, lab kuliner/gastronomi, dan status tunggakan SPP " +
      "dari Akademi Pariwisata Jakarta (APJ) untuk memberikan evaluasi keuangan yang komprehensif, logis, taktis, dan sehat.\n\n" +
      "Aturan Pelaporan:\n" +
      "1. Tulis seluruh laporan dalam Bahasa Indonesia yang formal, profesional, mendalam, dan memotivasi.\n" +
      "2. Buat pembagian segmen laporan yang jelas menggunakan heading tebal:\n" +
      "   - **I. EVALUASI KESEHATAN ARUS KAS**: Analisis rasio pemasukan dibanding pengeluaran kampus.\n" +
      "   - **II. ANALISIS ANGGARAN OPERASIONAL & PRAKTIK**: Soroti alokasi dana untuk praktikum kuliner/perhotelan dan sarankan efisiensi.\n" +
      "   - **III. STRATEGI REDUKSI TUNGGAKAN SPP/UKT**: Berikan ide kebijakan akademis yang persuasif namun efektif untuk mengurangi tunggakan mahasiswa.\n" +
      "   - **IV. REKOMENDASI TAKTIS & ALOKASI SURPLUS**: Langkah nyata berikutnya bagi manajemen Yayasan Pendidikan Jayakarta.\n" +
      "3. Berikan saran-saran spesifik yang relevan dengan industri hospitality (contoh: biaya bahan baku masakan, pemeliharaan lab kamar hotel simulator, atau kerjasama magang berbayar).\n" +
      "4. Hindari kalimat cliché kecerdasan buatan. Berbicaralah dengan nada analis keuangan manusia yang tajam.";

    const prompt = 
      `Lakukan audit keuangan taktis berdasarkan ringkasan data finansial Akademi Pariwisata Jakarta berikut:\n` +
      `- Total Pemasukan Operasional: Rp ${totalIncome?.toLocaleString("id-ID") || "0"}\n` +
      `- Total Pengeluaran Operasional: Rp ${totalExpenses?.toLocaleString("id-ID") || "0"}\n` +
      `- Sisa Saldo Arus Kas (Net Cash Flow): Rp ${cashFlow?.toLocaleString("id-ID") || "0"}\n` +
      `- Total Piutang / Tunggakan SPP Mahasiswa: Rp ${pendingFees?.toLocaleString("id-ID") || "0"}\n` +
      `- Rincian Kategori Pengeluaran saat ini: ${JSON.stringify(expensesBreakdown || [])}\n\n` +
      `Berikan analisis mendalam dan solusi keuangan terbaik bagi kampus kami agar kegiatan akademik tetap berstandar bintang 5 namun tetap menguntungkan secara bisnis.`;

    const response = await generateContentWithRetry({
      defaultModel: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.65,
      }
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Kesalahan API EduFin Advisor, mengaktifkan analisis fallback:", error);
    try {
      res.json({ analysis: getFallbackEduFinResponse(req.body) });
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Gagal melakukan konsultasi keuangan AI." });
    }
  }
});

// 4. Endpoint for AI Studio Generative DXP
app.post("/api/ai-studio", async (req, res) => {
  const { prompt, model } = req.body;
  try {
    if (!prompt) {
      return res.status(400).json({ error: "Prompt harus diisi." });
    }

    if (!apiKey) {
      console.warn("Kunci API Gemini tidak dikonfigurasi. Menggunakan AI Studio offline fallback.");
      return res.json(getFallbackAIStudioResponse(prompt));
    }

    const systemInstruction = 
      "Anda adalah APJ DXP AI Studio, kecerdasan buatan senior yang ahli menyusun struktur halaman, skema warna, copywriting, FAQ, dan metadata SEO " +
      "khusus untuk Akademi Pariwisata Jakarta (APJ). Anda WAJIB memberikan respons dalam format JSON murni terstruktur.\n\n" +
      "JSON Schema yang WAJIB dipatuhi:\n" +
      "{\n" +
      "  \"title\": \"Judul Halaman\",\n" +
      "  \"subtitle\": \"Sub-judul Halaman\",\n" +
      "  \"heroBanner\": {\n" +
      "    \"title\": \"Copywriting Utama Hero Banner\",\n" +
      "    \"subtitle\": \"Copywriting Pendukung Hero Banner\",\n" +
      "    \"ctaText\": \"Teks Tombol Aksi\",\n" +
      "    \"imageConcept\": \"Konsep visual gambar yang direkomendasikan\"\n" +
      "  },\n" +
      "  \"sections\": [\n" +
      "    { \"title\": \"Judul Seksi 1\", \"content\": \"Konten lengkap Seksi 1\" },\n" +
      "    { \"title\": \"Judul Seksi 2\", \"content\": \"Konten lengkap Seksi 2\" }\n" +
      "  ],\n" +
      "  \"faqs\": [\n" +
      "    { \"q\": \"Pertanyaan FAQ 1\", \"a\": \"Jawaban FAQ 1\" },\n" +
      "    { \"q\": \"Pertanyaan FAQ 2\", \"a\": \"Jawaban FAQ 2\" }\n" +
      "  ],\n" +
      "  \"seo\": {\n" +
      "    \"metaTitle\": \"Judul SEO Meta Tag\",\n" +
      "    \"metaDescription\": \"Deskripsi SEO Meta Tag\",\n" +
      "    \"keywords\": \"kata-kunci, seo, pencarian\",\n" +
      "    \"schemaMarkup\": \"JSON-LD Schema Markup String\"\n" +
      "  },\n" +
      "  \"colorPalette\": {\n" +
      "    \"primary\": \"#0050A0\",\n" +
      "    \"secondary\": \"#002f5a\",\n" +
      "    \"accent\": \"#D4AF37\"\n" +
      "  }\n" +
      "}\n\n" +
      "Tulis dalam Bahasa Indonesia dengan gaya bahasa industri perhotelan, pariwisata, kuliner, dan pendidikan vokasi tinggi yang elegan, modern, dan tulus (tanpa cliché kecerdasan buatan).";

    const response = await generateContentWithRetry({
      defaultModel: model || "gemini-3.5-flash",
      contents: `Buat halaman DXP baru berdasarkan instruksi: "${prompt}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.75,
        responseMimeType: "application/json"
      }
    });

    let rawText = response.text || "{}";
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }
    const result = JSON.parse(cleanJson);
    res.json(result);
  } catch (error: any) {
    console.error("Kesalahan API AI Studio, mengaktifkan DXP fallback:", error);
    try {
      res.json(getFallbackAIStudioResponse(prompt || ""));
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Gagal menghasilkan halaman via AI Studio." });
    }
  }
});

// Vite Middleware integration for Full-Stack structure
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server full-stack berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();
