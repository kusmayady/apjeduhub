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
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// 1. Endpoint for AI Counselor Chat inside KontakView
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Kolom pesan harus diisi." });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "Kunci API Gemini tidak dikonfigurasi. Silakan tambahkan GEMINI_API_KEY di Settings > Secrets." 
      });
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Kesalahan API Chat:", error);
    res.status(500).json({ error: error.message || "Terjadi kegagalan komunikasi dengan AI." });
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
      return res.status(500).json({ 
        error: "Kunci API Gemini belum dikonfigurasi. Silakan tambahkan GEMINI_API_KEY di Settings > Secrets." 
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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
      // Sanitize JSON fence wrappers if any
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }
      result = JSON.parse(cleanJson);
    } catch (parseError) {
      console.warn("Gagal mengekstrak JSON terstruktur, menggunakan perata teks fallback:", parseError);
      // Fallback in case JSON isn't returned properly
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
    console.error("Kesalahan API Artikel:", error);
    res.status(500).json({ error: error.message || "Terjadi kesalahan saat AI membuat artikel." });
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
