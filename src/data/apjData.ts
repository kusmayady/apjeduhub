export interface MajorCurriculum {
  semester: number;
  courses: string[];
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  education: string;
  avatar: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  features: string[];
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  major: string;
  year: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const VISI_MISI = {
  visi: "Menjadi Akademi Pariwisata terkemuka dan berstandar internasional yang menghasilkan sumber daya manusia profesional, unggul, berjiwa wirausaha, serta berdaya saing di industri pariwisata global pada tahun 2030.",
  misi: [
    "Menyelenggarakan pendidikan tinggi vokasional bidang pariwisata dan perhotelan yang relevan dengan perkembangan industri global.",
    "Mengembangkan iklim akademik yang kondusif untuk memicu penelitian terapan dan inovasi di sektor hospitality dan bina wisata.",
    "Melaksanakan pengabdian publik nyata guna mendukung kemandirian ekonomi masyarakat berbasis kearifan lokal pariwisata.",
    "Membangun jejaring kemitraan strategis (partnership) yang kuat dengan pemangku kepentingan industri nasional maupun internasional."
  ],
  sasaran: [
    "Memperoleh akreditasi BAN-PT dengan predikat Unggul.",
    "Tingkat keterserapan lulusan dalam dunia kerja internasional mencapai lebih dari 95% dalam waktu 6 bulan setelah kelulusan.",
    "Sertifikasi kompetensi lulusan berlisensi resmi pariwisata dari BNSP (Badan Nasional Sertifikasi Profesi).",
    "Peningkatan kerja sama magang tingkat global di hotel bintang 5 global, resort, maupun kapal pesiar luar negeri."
  ]
};

export const SEJARAH_MILIENSE: { year: string; title: string; description: string }[] = [
  {
    year: "1972",
    title: "Pendirian LPLIP DKI Jakarta",
    description: "Berdiri sebagai Lembaga Pendidikan dan Latihan Industri Pariwisata (LPLIP) DKI Jakarta atas inisiatif Gubernur Letjen TNI Marinir Ali Sadikin untuk menyiapkan tenaga kerja terampil pariwisata menghadapi Konferensi PATA 1974."
  },
  {
    year: "1977",
    title: "UPT Dinas Pariwisata & Program D3",
    description: "Berdasarkan Keputusan Gubernur No. 80 Tahun 1977, menjadi Unit Pelaksana Teknis Daerah (UPT) menyelenggarakan pendidikan formal Diploma Tiga (D3) bidang Perhotelan dan Usaha Perjalanan Wisata (LPLIP Tour & Travel)."
  },
  {
    year: "1998",
    title: "Era Yayasan Promos Pariwisata",
    description: "Di bawah pengelolaan Yayasan Promos Pariwisata Jakarta, status LPLIP berubah sebagai Perguruan Tinggi berdasarkan Keputusan Menteri Pendidikan."
  },
  {
    year: "2009",
    title: "Sinergi Yayasan Pendidikan Jayakarta",
    description: "Menyesuaikan PP No. 25/2000 & PP No. 38/2007, pengelolaan resmi dialihkan dari Pemda DKI kepada Yayasan Pendidikan Jayakarta berdasarkan Keputusan Gubernur DKI Jakarta No. 1295/2009."
  }
];

export const BOARD_MEMBERS: BoardMember[] = [
  {
    id: "dir",
    name: "Assoc. Prof. Kusmayadi",
    role: "Direktur Akademi Pariwisata Jakarta",
    education: "S3 Pariwisata Universitas Trisakti",
    avatar: "👨‍🏫"
  },
  {
    id: "pudir1",
    name: "Dra. Herlina Ningrum, M.Par.",
    role: "Pudir I Bidang Akademik",
    education: "S2 Hospitality Management STP Bandung",
    avatar: "👩‍🏫"
  },
  {
    id: "pudir2",
    name: "Ir. Bambang Wisnu, M.M.",
    role: "Pudir II Bidang Keuangan & Umum",
    education: "S2 Magister Manajemen Universitas Indonesia",
    avatar: "👨‍💻"
  },
  {
    id: "pudir3",
    name: "Rudi Hartono, S.ST.Par., M.Par.",
    role: "Pudir III Bidang Kemahasiswaan & Kemitraan",
    education: "S2 Pariwisata STP Trisakti",
    avatar: "👨‍💼"
  },
  {
    id: "kaprodi_hot",
    name: "Yulia Herawati, S.E., M.MM.",
    role: "Ketua Program Studi D3 Perhotelan",
    education: "S2 Manajemen Perhotelan Universitas Pelita Harapan",
    avatar: "👩‍🍳"
  },
  {
    id: "kaprodi_wis",
    name: "Andi Saputra, M.Par.",
    role: "Ketua Program Studi D3 Usaha Perjalanan Wisata",
    education: "S2 Destinasi Pariwisata Institut Teknologi Bandung",
    avatar: "👨‍✈️"
  }
];

export const LAMBANG_EXPLANATION = [
  {
    part: "Bingkai Segi Lima",
    meaning: "Melambangkan Pancasila sebagai asas falsafah kehidupan akademik dan pengabdian seluruh civitas akademika APJ kepada bangsa Indonesia."
  },
  {
    part: "Tugu Monas (Monumen Nasional)",
    meaning: "Mewakili identitas kebanggaan Kota Jakarta, tempat lahirnya Akademi Pariwisata Jakarta, sekaligus lambang cita-cita setinggi langit."
  },
  {
    part: "Buku Terbuka & Pena Monas",
    meaning: "Menandakan proses belajar-mengajar ilmiah, kebebasan akademik yang progresif, serta penulisan tinta prestasi yang berkelanjutan."
  },
  {
    part: "Api Menyala Menjulang",
    meaning: "Melambangkan gelora semangat, dedikasi tanpa padam, kreativitas, dan motivasi tinggi untuk melayani industri hospitality dengan ketulusan hati."
  },
  {
    part: "Dua Bintang Kembar",
    meaning: "Mempresentasikan keseimbangan antara ilmu teoretis dan keahlian praktis kerja nyata sebagai landasan profesionalisme pariwisata."
  },
  {
    part: "Warna Biru dan Krem",
    meaning: "Biru melambangkan kedalaman ilmu, profesionalitas, kejujuran, dan kepercayaan. Krem melambangkan kehangatan, hospitality (ramah tamah), estetika tinggi, serta kenyamanan pelayanan."
  }
];

export const CURRICULUM_HOTEL: MajorCurriculum[] = [
  {
    semester: 1,
    courses: [
      "Pengantar Pariwisata & Perhotelan",
      "Sanitasi, Higiene & Keselamatan Kerja (K3)",
      "Bahasa Inggris Pariwisata I",
      "Pendidikan Agama & Pancasila",
      "Dasar-Dasar Kantor Depan (Front Office)",
      "Dasar-Dasar Tata Graha (Housekeeping)",
      "Pengantar Operasional Dapur Kampus"
    ]
  },
  {
    semester: 2,
    courses: [
      "Bahasa Inggris Perhotelan II",
      "Tata Hidangan Makanan & Minuman I",
      "Keterampilan Dasar Dapur (Food Production)",
      "Operasional Tata Graha Praktik",
      "Operasional Kantor Depan Praktik",
      "Analisis Layanan Tamu (Guest Relations)",
      "Bahasa Asing Pilihan I (Mandarin / Jepang)"
    ]
  },
  {
    semester: 3,
    courses: [
      "Manajemen Tata Hidangan Makanan & Minuman II",
      "Kuliner Nusantara & Internasional Studio",
      "Tata Operasional Bar & Bartending",
      "Pengawasan Kebersihan & Binatu (Laundry)",
      "Sistem Informasi Perhotelan (Property Management System)",
      "Bahasa Inggris Bisnis Perhotelan",
      "Sosiologi Industri Hospitality"
    ]
  },
  {
    semester: 4,
    courses: [
      "Kewirausahaan Perhotelan (Hotelpreneurship)",
      "Patisserie & Bakery Studio",
      "Manajemen Keuangan Akuntansi Hotel",
      "Pemasaran Hotel & Digital Marketing",
      "Metodologi Penelitian Laporan Akhir",
      "Pengendalian Biaya F&B (Cost Control)",
      "Bahasa Asing Pilihan II (Mandarin / Jepang)"
    ]
  },
  {
    semester: 5,
    courses: [
      "Praktik Kerja Nyata / Magang Industri (Compulsory 6-Month Internship)",
      "Laporan Praktik Kerja Lapangan",
      "Evaluasi Kompetensi Bidang Vokasional"
    ]
  },
  {
    semester: 6,
    courses: [
      "Kepemimpinan & Etika Profesi Hotel",
      "Manajemen Acara & Banquet",
      "Proyek Akhir Karya Tulis Ilmiah",
      "Ujian Kompetensi Lembaga BNSP",
      "Seminar Tren Industri Hospitality Baru"
    ]
  }
];

export const CURRICULUM_TOURISM: MajorCurriculum[] = [
  {
    semester: 1,
    courses: [
      "Pengantar Pariwisata Nusantara & Global",
      "Geografi Pariwisata Indonesia & Dunia",
      "Pendidikan Agama & Kewarganegaraan",
      "Bahasa Inggris Pariwisata Dasar",
      "Tata Ruang Destinasi Wisata",
      "Sosiologi & Psikologi Pelayanan"
    ]
  },
  {
    semester: 2,
    courses: [
      "Teknik Pemanduan Wisata (Tour Guiding I)",
      "Perencanaan Perjalanan Wisata Dasar",
      "Bahasa Inggris Pemanduan Perjalanan",
      "Operasional Kantor Depan Travel Agency",
      "Pengantar MICE & Manajemen Event",
      "Bahasa Asing Pilihan (Mandarin / Jepang)"
    ]
  },
  {
    semester: 3,
    courses: [
      "Pemanduan Wisata Praktik Lapangan (Tour Guiding II)",
      "Penyusunan Paket Wisata (Tour Planning)",
      "Sistem Reservasi Penerbangan Global (Sabre/Amadeus)",
      "Kalkulasi Tarif Tiket Penerbangan (Air Fares & Ticketing)",
      "Pengelolaan Usaha Agen Perjalanan Wisata",
      "Sosial-Budaya Pariwisata & Ekologi"
    ]
  },
  {
    semester: 4,
    courses: [
      "Kewirausahaan Perjalanan Wisata (Tourismpreneurship)",
      "Manajemen Wisata Bahari & Ekowisata",
      "Pemasaran Destinasi & Media Sosial Kampanye",
      "Manajemen Event MICE Praktik Studio",
      "Metodologi Penelitian & Teknik Penulisan",
      "Dokumen Perjalanan, Imigrasi & Kargo"
    ]
  },
  {
    semester: 5,
    courses: [
      "Praktik Magang Industri Biro/Paket Perjalanan (Travel Agency Compulsory Internship)",
      "Laporan PKL & Presentasi Industri",
      "Uji Kemahiran Lapangan Pariwisata"
    ]
  },
  {
    semester: 6,
    courses: [
      "Etika Bisnis & Hukum Pariwisata",
      "Pengembangan Destinasi Pariwisata Berkelanjutan",
      "Karya Tulis Akhir Ilmiah",
      "Sertifikasi Kompetensi BNSP Pemanduan / Ticketing",
      "Tren Pariwisata Digital & Kecerdasan Buatan sektor Wisata"
    ]
  }
];

export const FACILITIES: Facility[] = [
  {
    id: "kitchen",
    name: "Laboratorium Dapur (Culinary Studio & Lab)",
    description: "Laboratorium dapur standar industri hotel berbintang yang dilengkapi dengan commercial heavy duty burners, oven konveksi besar, stainless steel tables, prep areas, dan peralatan pisau serta pengolahan profesional untuk mencetak chef andal.",
    features: ["Kompor Komersial Stainless Steel", "Peralatan Memasak & Pisau Standar Chef", "Sistem Exhaust Hood Sentral", "Ruang Persiapan Khusus Bahan Basah/Kering"],
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "bar",
    name: "Laboratorium Bar & Mixology (Mock Restaurant)",
    description: "Simulator restoran dan kafe yang lengkap dengan bar lurus, dispenser minuman dingin, mesin espresso manual komersial, shaker set berkualitas tinggi, gelas beraneka jenis, serta meja layout makan formal untuk simulasi Waiter dan Bartender.",
    features: ["Mesin Espresso Manual 2 Group", "Alat Shaking & Garnish Lengkap", "Penataan Meja Fine Dining (Table Setup)", "Simulator Pembayaran Point of Sales (POS)"],
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "hotel",
    name: "Laboratorium Kamar Suite (Housekeeping Mockup Room)",
    description: "Simulator kamar tidur hotel tipe Suite yang dirancang dengan kasur ukuran King, sofa lounge, nakas kayu, set linen lengkap, kamar mandi en-suite, lemari baju, serta trolley housekeeping untuk simulasi making-bed secara presisi dan cepat.",
    features: ["Linen Hotel Bintang 5 Mewah", "Trolley Housekeeping Lengkap", "Simulasi Pembersihan Kamar & Turn-Down Service", "Penataan Handuk Seni Visual (Towel Art)"],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "fo",
    name: "Simulasi Meja Front Desk (Front Office Lab)",
    description: "Simulator area lobby dan front desk lengkap dengan komputer, pencetak kunci kartu elektronik magnetik, rak kunci, map folder reservasi tamu, mesin EDC pembayaran, telepon, serta software sistem manajemen hotel terpadu.",
    features: ["Aplikasi Manajemen Hotel Ringan", "Mesin EDC & Formulir Check-In Terstandarisasi", "Area Telepon Call-Center & Layanan Bel", "Pemanduan Penanganan Keluhan Tamu (Complaint Handling)"],
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "comp",
    name: "Laboratorium Komputer & Sistem Global (Ticketing Center)",
    description: "Kamar laboratorium komputer canggih ber-AC yang sudah terinstalasi software perencana perjalanan, terminal Amadeus dan Sabre asli untuk melatih kemahiran reservasi tiket maskapai penerbangan, hotel, dan kapal pesiar.",
    features: ["Sistem Reservasi Maskapai Amadeus/Sabre", "Koneksi Akses Internet Cepat Giganet", "Spesifikasi PC Modern", "Modular Pembelajaran E-Business Pariwisata"],
    imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lib",
    name: "Perpustakaan Akademik & Reading Lounge",
    description: "Pusat rujukan buku referensi pariwisata terlengkap di Jakarta Timur. Memiliki ribuan pustaka cetak, majalah industri kuliner & traveling global, jurnal riset kepariwisataan dari PBB (UN Tourism), serta ruang baca ber-AC yang tenang.",
    features: ["Koleksi Buku Referensi Perhotelan & Wisata Lengkap", "Sudut Komputer E-Library Akses Jurnal", "Sofa & Meja Diskusi Kelompok", "Layanan Peminjaman Digital Cepat"],
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Faisal Azhar",
    major: "D3 Perhotelan",
    year: "Lulus 2018",
    role: "F&B Supervisor",
    company: "JW Marriott Hotel, Dubai Marina",
    avatar: "🧑‍🍳",
    quote: "Belajar di APJ memberikan pondasi keterampilan dapur dan pelayanan yang sangat teliti. Berkat program magang yang disalurkan kampus, saya langsung mendapatkan kontrak kerja di JW Marriott Dubai setahun pasca lulus. APJ mantap!"
  },
  {
    id: "t2",
    name: "Siti Rahmawati",
    major: "D3 Usaha Perjalanan Wisata",
    year: "Lulus 2020",
    role: "Lead Tour Planner & MICE Specialist",
    company: "Panorama Destination, Jakarta",
    avatar: "👩‍💼",
    quote: "Praktik reservasi menggunakan Amadeus di kampus sangat membantu ketika masuk ke industri nyata. Dosen di APJ adalah praktisi berpengalaman yang menuntun kami menyusun paket wisata unik dan menangani pameran skala multinasional."
  },
  {
    id: "t3",
    name: "Kevin Jonathan",
    major: "D3 Perhotelan",
    year: "Lulus 2017",
    role: "Assistant Front Office Manager",
    company: "The Ritz-Carlton Mega Kuningan, Jakarta",
    avatar: "👨‍💼",
    quote: "Kedisiplinan penampilan (grooming) dan kemampuan berkomunikasi yang ditanamkan selama perkuliahan di APJ membentuk karakter profesional saya. Fasilitas lab front-desk kampus luar biasa menggambarkan situasi asli front desk hotel bintang lima."
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    category: "Pendaftaran",
    question: "Apakah lulusan SMK non-Pariwisata atau lulusan IPA/IPS bisa mendaftar?",
    answer: "Tentu saja! Akademi Pariwisata Jakarta (APJ) terbuka untuk seluruh lulusan SMA/SMK/MA dari semua rumpun jurusan. Kami merancang materi pembelajaran perkuliahan dari tingkat paling dasar (0), sehingga siapa pun dapat mengikuti proses belajar perhotelan dan wisata hingga mahir."
  },
  {
    category: "Akreditasi",
    question: "Bagaimana status akreditasi Akademi Pariwisata Jakarta (APJ)?",
    answer: "Akdemi Pariwisata Jakarta telah terakreditasi resmi oleh BAN-PT (Badan Akreditasi Nasional Perguruan Tinggi) dengan predikat 'Baik Sekali' serta seluruh Program Studi D3 Perhotelan dan D3 Usaha Perjalanan Wisata memiliki izin sah operasi dari Kementerian Pendidikan."
  },
  {
    category: "Magang",
    question: "Di mana mahasiswa APJ melaksanakan program magang (PKL)?",
    answer: "Mahasiswa wajib melaksanakan magang selama 6 bulan di semester 5. Kami menyalurkan ke jaringan hotel bintang 5 ternama (The Ritz-Carlton, JW Marriott, Grand Hyatt, Fairmont) serta agen biro perjalanan wisata terkemuka di dalam negeri. Tersedia juga program magang luar negeri terpandu demi karir internasional (seperti Malaysia, Jepang, Dubai, dan Arab Saudi)."
  },
  {
    category: "Biaya",
    question: "Apakah biaya kuliah di APJ bisa diangsur?",
    answer: "Ya, demi mendukung kemudahan pendidikan tinggi, APJ menyediakan skema pembayaran biaya kuliah (SPP) yang fleksibel dan dapat diangsur beberapa kali per semesternya. Kami juga menyediakan potongan biaya pengembangan melalui Jalur Prestasi dan Beasiswa Nilai UN/Rapor."
  },
  {
    category: "Layanan Lulusan",
    question: "Apakah APJ menjamin kerja setelah lulus perkuliahan?",
    answer: "Kami memiliki Career Development & Job Placement Center (Pusat Pengembangan Karir) milik internal yang bekerjasama dengan puluhan manajemen hotel bintang 5 dan instansi pariwisata. Kerja sama ini menjamin lulusan diserap industri secara cepat. Mayoritas mahasiswa bahkan telah direkrut sebelum prosesi wisuda selesai."
  }
];

// Indonesian QA system for local chatbot search
export const getLocalChatbotResponse = (query: string): string => {
  const q = query.toLowerCase();
  
  if (q.includes("halo") || q.includes("hai") || q.includes("pagi") || q.includes("siang") || q.includes("sore") || q.includes("malam")) {
    return "Halo! Selamat datang di Layanan Konselor Virtual Akademi Pariwisata Jakarta (APJ). Saya siap membantu Anda mengenai informasi pendaftaran, jurusan, biaya kuliah, fasilitas kampus, atau program magang. Ada yang bisa saya bantu hari ini?";
  }
  
  if (q.includes("prodi") || q.includes("jurusan") || q.includes("belajar") || q.includes("kuliah apa")) {
    return "Akademi Pariwisata Jakarta (APJ) mengoperasikan dua Program Studi unggulan Jenjang Diploma 3 (D3):\n\n1. **D3 Perhotelan**: Mempelajari tata kelola hotel bintang 5 meliputi Kantor Depan (Front Office), Tata Graha (Housekeeping), Tata Hidang (F&B Service), dan Dapur Kuliner (F&B Product/Chef).\n2. **D3 Usaha Perjalanan Wisata (Bina Wisata)**: Mempelajari manajemen MICE (Event) skala besar, perencanaan tour (Tour Planning), pemanduan wisata (Tour Guiding), serta sistem reservasi penerbangan internasional Amadeus/Sabre.\n\nMau tahu informasi rinci mengenai kurikulum salah satu jurusan ini?";
  }
  
  if (q.includes("hotel") || q.includes("perhotelan")) {
    return "Program Studi **D3 Perhotelan APJ** melatih keterampilan operasional hospitality hotel bintang lima global. Mahasiswa dibimbing langsung oleh GM & Executive Chef aktif. Lulusan diproyeksikan berkarir sebagai Chef, Food & Beverage Manager, Front Office Manager, Executive Housekeeper, atau Executive Cruiser. Tersedia Laboratorium Dapur, Bar, Restoran, dan Kamar Suite Simulator lengkap.";
  }
  
  if (q.includes("wisata") || q.includes("perjalanan") || q.includes("bina wisata") || q.includes("upw")) {
    return "Program Swasta **D3 Usaha Perjalanan Wisata APJ** memfokuskan mahasiswa pada sektor bernilai ekonomi tinggi seperti agen perjalanan digital (OTA), Tour Leader internasional, pemandu wisata bersertifikat, staf maskapai penerbangan, dan perencana acara pameran (MICE Planner). Anda dibekali pemahaman mendalam reservasi penerbangan Amadeus / Sabre terakreditasi.";
  }
  
  if (q.includes("daftar") || q.includes("pmb") || q.includes("pendaftaran") || q.includes("syarat") || q.includes("masuk")) {
    return "Penerimaan Mahasiswa Baru (PMB) TA 2026/2027 telah dibuka! \n\n**Syarat Pendaftaran Utama**:\n1. Mengisi Form Pendaftaran Online.\n2. Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SMA/SMK/MA sederajat.\n3. Pasfoto berwarna ukuran 3x4 (2 lembar).\n4. Tidak buta warna.\n\n**Jalur Tersedia**:\n- *Jalur Reguler* (Ujian saringan ringan)\n- *Jalur Prestasi* (Potongan biaya dengan melampirkan rapor di atas rata-rata 80)\n- *Kelas Karyawan* (Sabtu/Malam untuk pekerja aktif).\n\nIngin mencoba mendaftar sekarang di menu registrasi pendaftaran online?";
  }
  
  if (q.includes("biaya") || q.includes("harga") || q.includes("bayar") || q.includes("spp") || q.includes("angsur")) {
    return "Biaya kuliah di APJ sangat terjangkau dibanding kampus pariwisata swasta lain, serta **bebas biaya praktikum tambahan**. \n\nRincian Biaya Dasar Perkuliahan:\n- **SPP Per Semester**: Mulai dari Rp 6.200.000 (Jalur Reguler) hingga Rp 6.800.000 (Kelas Praktisi).\n- **Dana Pembangunan (SPM)**: Rp 4.500.000 (sekali bayar saat pertama masuk).\n- **Biaya Atribut & Seragam Kerja**: Rp 3.200.000 (sekali beli untuk seluruh set jas kuliner, front office, pin, pemanduan, dll).\n\nAPJ membuka fasilitas mengangsur SPP hingga 3-4 tahap per semester demi menjamin kelancaran studi mahasiswa.";
  }
  
  if (q.includes("alamat") || q.includes("lokasi") || q.includes("dimana") || q.includes("peta") || q.includes("telepon") || q.includes("kontak")) {
    return "Kampus Utama Akademi Pariwisata Jakarta (APJ) beralamat di:\n📍 **Jl. Cempaka Putih Tengah XXXII No. 8, Cempaka Putih, Jakarta Pusat**.\n\n📞 No. Telepon: (021) 8613388 / 8623344\n📱 WhatsApp PMB: +62 812-3456-7890 (Simulasi)\n✉️ Email Layanan: info@apj.ac.id / pmb@apj.ac.id\n\nLokasi sangat strategis di Cempaka Putih, Jakarta Pusat, mudah diakses menggunakan angkutan umum atau kendaraan pribadi.";
  }
  
  if (q.includes("magang") || q.includes("internship") || q.includes("pkl") || q.includes("kerja")) {
    return "APJ berkomitmen membekali mahasiswa dengan keahlian praktis tinggi melalui **Magang Wajib 6 Bulan di Semester 5**.\n\nKami bekerja sama erat dengan hotel bintang 5 global seperti:\n🏨 JW Marriott Hotel Jakarta\n🏨 The Ritz-Carlton Mega Kuningan / Pacific Place\n🏨 Grand Hyatt Jakarta\n🏨 Fairmont Jakarta\n🏨 Hotel Mulia Senayan\n\nTersedia juga opsi penyaluran magang internasional ke Dubai, Malaysia, Jepang, dan kapal pesiar mewah internasional. Mayoritas mahasiswa purnamutu langsung ditawari kerja kontan setelah selesai magang.";
  }
  
  if (q.includes("fasilitas") || q.includes("lab") || q.includes("perpustakaan") || q.includes("kelas")) {
    return "Kampus APJ menyediakan fasilitas laboratorium praktik berstandar bintang 5 terpadu:\n1. **Culinary Kitchen Lab**: Peralatan masak komersil lengkap.\n2. **Pastry & Bakery Lab**: Oven panggang canggih untuk pembuatan kue dan roti.\n3. **Bar & Beverage Lounge**: Untuk meracik mocktail, barista club, dan fine dining service.\n4. **Housekeeping Suite Room**: Mockup kamar mewah penanganan kamar.\n5. **Front Office Desk Desk**: Simulator resepsionis hotel.\n6. **Amadeus Ticketing Computer Lab**: Ruang berkomputer khusus pariwisata.\n7. **Perpustakaan & Reading Room**: AC sejuk dengan ribuan koleksi pariwisata.";
  }
  
  if (q.includes("terima kasih") || q.includes("syukron") || q.includes("makasih") || q.includes("nuhun") || q.includes("thank")) {
    return "Sama-sama! Senang sekali bisa membantu Anda. Jika ada hal lain yang ingin Anda ketahui seputar Akademi Pariwisata Jakarta (APJ), jangan ragu untuk bertanya kembali. Semoga kami segera menyongsong Anda bergabung sebagai keluarga besar mahasiswa APJ!";
  }
  
  return "Terima kasih atas pertanyaannya. Menarik sekali! Informasi tersebut bisa Anda dapatkan secara terperinci. Akademi Pariwisata Jakarta (APJ) menyediakan program D3 Perhotelan, D3 Usaha Perjalanan Wisata, biaya perkuliahan berbayar berkala, magang di hotel bintang 5, serta berada di Jl. Cempaka Putih Tengah XXXII No. 8, Cempaka Putih, Jakarta Pusat. \n\nBila Anda memerlukan informasi lebih spesifik, silakan tanyakan perihal: 'Pendaftaran PMB', 'D3 Perhotelan', 'D3 Perjalanan Wisata', 'Biaya Kuliah', atau 'Fasilitas Kampus'.";
};
