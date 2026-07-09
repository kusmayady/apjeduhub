import { 
  db, 
  auth,
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  query,
  orderBy,
  serverTimestamp
} from "./firebase";

// --- Error Handler Helper ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Collection Names ---
const COL_PMB = "pmb_applications";
const COL_CONTACT = "contact_messages";
const COL_ANNOUNCEMENTS = "announcements";
const COL_SETTINGS = "website_settings";
const COL_BOARD = "board_members";
export const COL_MENU_ITEMS = "joomla_menu_items";
export const COL_TEMPLATE_STYLES = "joomla_template_styles";
export const COL_SLIDES = "joomla_slides";

// --- Deleted IDs Tracking for robust client persistence ---
function getLocalDeletedIds(collectionName: string): string[] {
  try {
    const data = localStorage.getItem(`deleted_ids_${collectionName}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addLocalDeletedId(collectionName: string, id: string) {
  if (!id) return;
  try {
    const ids = getLocalDeletedIds(collectionName);
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(`deleted_ids_${collectionName}`, JSON.stringify(ids));
    }
  } catch (e) {
    console.warn(e);
  }
}

// --- Interfaces ---
export interface PmbApplication {
  id?: string;
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  highSchool: string;
  gradYear: string;
  major: string;
  classType: string;
  status: "Pending" | "Verified" | "Lulus Seleksi" | "Tidak Lulus";
  notes?: string;
  createdAt?: any;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  replyNote?: string;
  createdAt?: any;
}

export interface AnnouncementItem {
  id?: string;
  category: string;
  date: string;
  title: string;
  desc: string;
  image: string;
  content?: string;
  createdAt?: any;
}

export interface DbTemplateStyle {
  id?: string;
  name: string;
  primaryColor: string; // Hex code, e.g. "#002f5a"
  secondaryColor: string; // Hex, e.g. "#1e3a8a"
  accentColor: string; // Hex, e.g. "#FFC46A"
  backgroundColor: string; // Hex, e.g. "#f8fafc"
  fontFamily: "font-sans" | "font-serif" | "font-mono";
  headingFontName: string; // Font display name like "Space Grotesk" or "Playfair Display"
  cardRadius: "rounded-none" | "rounded-md" | "rounded-xl" | "rounded-3xl" | "rounded-full";
  headerStyle: "sticky" | "glass" | "minimal" | "shadow";
  showHeroBackground: boolean;
  badgeStyle: "pill" | "sharp" | "outline";
  isSystem?: boolean;

  // New APJ branding & typography fields
  logoHeader?: string;
  logoFooter?: string;
  favicon?: string;

  titleFontFamily?: string;
  titleFontColor?: string;
  titleFontSize?: string;

  subtitleFontFamily?: string;
  subtitleFontColor?: string;
  subtitleFontSize?: string;

  h1FontFamily?: string;
  h1FontColor?: string;
  h1FontSize?: string;

  h2FontFamily?: string;
  h2FontColor?: string;
  h2FontSize?: string;

  h3FontFamily?: string;
  h3FontColor?: string;
  h3FontSize?: string;

  h4FontFamily?: string;
  h4FontColor?: string;
  h4FontSize?: string;

  h5FontFamily?: string;
  h5FontColor?: string;
  h5FontSize?: string;

  h6FontFamily?: string;
  h6FontColor?: string;
  h6FontSize?: string;

  textFontFamily?: string;
  textFontColor?: string;
  textFontSize?: string;

  paragraphFontFamily?: string;
  paragraphFontColor?: string;
  paragraphFontSize?: string;
  menuFontFamily?: string;

  titleFontWeight?: string;
  subtitleFontWeight?: string;
  h1FontWeight?: string;
  h2FontWeight?: string;
  h3FontWeight?: string;
  h4FontWeight?: string;
  h5FontWeight?: string;
  h6FontWeight?: string;
  textFontWeight?: string;
  paragraphFontWeight?: string;
  menuFontWeight?: string;
}

export interface DbMenuItem {
  id?: string;
  label: string;
  sectionId: string; // maps to currentSection (home, profil, akademik, pmb, kemahasiswaan, kontak, admin, etc.)
  tabId: string; // maps to activeTab (e.g. sejarah, visimisi, d3perhotelan, d3wisata, syarat, ukm, etc.)
  parentId?: string | null;
  order: number;
  templateStyleId: string; // associated DbTemplateStyle ID
}

export interface WebsiteSettings {
  directorName: string;
  directorTitle: string;
  establishedYear: string;
  foundationName: string;
  address: string;
  phoneLines: string;
  pmbEmail: string;
  consultationHours: string;
}

export interface DbBoardMember {
  id?: string;
  name: string;
  role: string;
  education: string;
  avatar: string;
  category: "APJ" | "Yayasan";
  order: number;
}

// --- Default Data for Seeding ---
const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    category: "Prestasi Mahasiswa",
    date: "14 Mei 2026",
    title: "APJ Sabet Juara Umum Culinary Cup dan Barista Guild Competition DKI Jakarta 2026",
    desc: "Tim mahasiswa D3 Perhotelan APJ membawa pulang piala utama dalam kategori Classic Cocktail Mixology dan Nusantara Main Course Presentation.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500",
    content: "Pencapaian luar biasa diraih oleh Unit Kegiatan Mahasiswa (UKM) Culinary & Hospitality Club Akademi Pariwisata Jakarta (APJ) setelah dinobatkan sebagai Juara Umum dalam perhelatan akbar 'Culinary Cup dan Barista Guild Competition DKI Jakarta 2026' yang diselenggarakan oleh Asosiasi Hotel dan Restoran Jakarta Barat pada tanggal 12 hingga 14 Mei 2026 di Hall Utama JIExpo Kemayoran.\n\nDalam kompetisi berstandar nasional ini, kontingen APJ menurunkan 8 mahasiswa terbaik di bawah asuhan Mentor Senior Chef Handoyo Prasetyo. APJ menyapu bersih medali emas dalam kategori prestisius, yaitu Classic Cocktail Mixology yang diraih oleh Aldy Pradana (mahasiswa D3 Perhotelan semester 4) dan Nusantara Main Course Presentation yang diraih oleh tim kolaboratif Syafira Nurul dan Kevin Wijaya.\n\nSyafira menyajikan hidangan kreasi orisinal bertajuk 'Smoked Duck with Rendang reduction & Lemongrass Infused Cassava Mash' yang memukau dewan juri asing karena kebersihan metode memasak, keindahan estetika penyajian (plating), serta keseimbangan rasa bumbu Nusantara asli yang autentik namun disajikan modern.\n\nDirektur APJ Assoc. Prof. Kusmayadi menyatakan rasa bangganya terhadap prestasi gemilang ini. 'Kemenangan ini membuktikan standar pembelajaran praktik vokasional perhotelan APJ sangat presisi dan sinkron dengan standar tuntutan industri luxury hotel saat ini,' tuturnya saat penyambutan resmi piala bergilir di Aula Jayakarta, Jakarta Timur."
  },
  {
    category: "Kerjasama Kemitraan",
    date: "28 April 2026",
    title: "Dua Belas Lulusan APJ Diterima Kontrak Kerja di Luxury Hotel Arab Saudi & Dubai",
    desc: "Program penempatan langsung Job Placement Center APJ berhasil menyalurkan alumni ke Ritz-Carlton Jeddah dan JW Marriott Dubai Marina melalui jalur prioritas.",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500",
    content: "Kabar membanggakan kembali datang dari kancah penempatan kerja internasional. Melalui program penempatan kerja khusus terpadu yang dipimpin oleh Job Placement Center (JPC) Akademi Pariwisata Jakarta (APJ), sebanyak 12 alumni lulusan program studi D3 Perhotelan angkatan tahun 2025 secara resmi menandatangani kontrak kerja profesional eksklusif bersama manajemen resort dan luxury hotel bintang 5 di kawasan Timur Tengah.\n\nDari total 12 alumni tersebut, 5 alumni ditempatkan di The Ritz-Carlton Jeddah, Arab Saudi, mengisi posisi Banquet Service Specialist dan Guest Relations Officer. Sementara itu, 7 alumni lainnya bergabung dengan JW Marriott Dubai Marina, Uni Emirat Arab, pada departemen Food & Beverage Culinary Artisans dan Front Office Representative.\n\nProses rekrutmen ini berlangsung ketat sejak awal Januari 2026 yang mencakup tes keahlian kompetensi hospitality standar international, verifikasi kepemilikan sertifikat uji kompetensi berlisensi Badan Nasional Sertifikasi Profesi (BNSP) Indonesia, serta wawancara langsung yang digelar secara daring dan luring oleh perwakilan Human Resources Director hotel terkait di Jakarta.\n\nKepala Hubungan Industri & Kerja Sama APJ, Ibu Dra. Sri Wahyuni, M.M., MM.Par, menyampaikan bahwa keterterimaan alumni APJ di jejaring hotel elit global ini disebabkan oleh fondasi keterampilan (hands-on skills) yang sangat kuat serta kedisiplinan berkarakter mulia yang tertanam sejak masa perkuliahan rutin kampus."
  },
  {
    category: "Kegiatan Akademik",
    date: "10 April 2026",
    title: "MoU Terbaru APJ dengan Tokyo Hospitality College Jepang",
    desc: "Kerjasama strategis ini memfasilitasi mahasiswa D3 Usaha Perjalanan Wisata dan Perhotelan untuk mengikuti magang bersubsidi magang selama 1 tahun di Tokyo.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500",
    content: "Dalam rangka akselerasi digitalisasi internasional serta peningkatan mutu magang global mahasiswa Indonesia, Akademi Pariwisata Jakarta (APJ) resmi melakukan penandatanganan Memorandum of Understanding (MoU) kemitraan tripartit strategis bersama Tokyo Hospitality College dan jaringan akomodasi Ryokan tradisional Shizuoka Prefecture di Tokyo, Jepang.\n\nKemitraan internasional yang ditandatangani langsung oleh Executive Director APJ dan President Tokyo Hospitality College, Prof. Dr. Shigetaka Yamamoto, membuka peluang emas bagi 25 mahasiswa terpilih dari Program Studi D3 Usaha Perjalanan Wisata dan D3 Perhotelan APJ setiap tahunnya untuk dapat mengikuti program 'Paid Internship Program' bersubsidi selama 12 bulan di Jepang.\n\nSelama masa magang satu tahun tersebut, mahasiswa akan ditempatkan di hotel modern ternama di kota Tokyo serta penginapan legendaris (Ryokan tradisional berpemandangan Gunung Fuji) untuk menyerap etos kerja legendaris Jepang, 'Omotenashi'—filosofi pelayanan sepenuh hati khas Negeri Sakura. Hebatnya, program ini didanai penuh oleh kompensasi beasiswa praktisi bulanan, penyediaan akomodasi asrama gratis, asuransi kesehatan internasional, serta kursus persiapan bahasa Jepang intensif level N4 secara bersertifikasi.\n\nKurikulum magang ini juga secara otomatis dikonversi setara dengan beban 20 SKS sesuai dengan implementasi program Merdeka Belajar Kampus Merdeka (MBKM)."
  }
];

const DEFAULT_SETTINGS: WebsiteSettings = {
  directorName: "Assoc. Prof. Kusmayadi",
  directorTitle: "Direktur Akademi Pariwisata Jakarta",
  establishedYear: "1972",
  foundationName: "Yayasan Pendidikan Jayakarta",
  address: "Jl. Cempaka Putih Tengah XXXII No. 8, Cempaka Putih, Jakarta Pusat.",
  phoneLines: "(021) 8613388, 8623344",
  pmbEmail: "pmb@apj.ac.id",
  consultationHours: "Senin-Sabtu pukul 08:00 - 17:00 WIB"
};

const DEFAULT_BOARD_MEMBERS: DbBoardMember[] = [
  {
    name: "Assoc. Prof. Kusmayadi",
    role: "Direktur Akademi Pariwisata Jakarta",
    education: "S3 Pariwisata Universitas Trisakti",
    avatar: "👨‍🏫",
    category: "APJ",
    order: 1
  },
  {
    name: "Dra. Herlina Ningrum, M.Par.",
    role: "Pudir I Bidang Akademik",
    education: "S2 Hospitality Management STP Bandung",
    avatar: "👩‍🏫",
    category: "APJ",
    order: 2
  },
  {
    name: "Ir. Bambang Wisnu, M.M.",
    role: "Pudir II Bidang Keuangan & Umum",
    education: "S2 Magister Manajemen Universitas Indonesia",
    avatar: "👨‍💻",
    category: "APJ",
    order: 3
  },
  {
    name: "Rudi Hartono, S.ST.Par., M.Par.",
    role: "Pudir III Bidang Kemahasiswaan & Kemitraan",
    education: "S2 Pariwisata STP Trisakti",
    avatar: "👨‍💼",
    category: "APJ",
    order: 4
  },
  {
    name: "Yulia Herawati, S.E., M.MM.",
    role: "Ketua Program Studi D3 Perhotelan",
    education: "S2 Manajemen Perhotelan Universitas Pelita Harapan",
    avatar: "👩‍🍳",
    category: "APJ",
    order: 5
  },
  {
    name: "Andi Saputra, M.Par.",
    role: "Ketua Program Studi D3 Usaha Perjalanan Wisata",
    education: "S2 Destinasi Pariwisata Institut Teknologi Bandung",
    avatar: "👨‍✈️",
    category: "APJ",
    order: 6
  },
  {
    name: "Kusmayadi, M.M.",
    role: "Ketua Yayasan Pendidikan Jayakarta",
    education: "S2 Manajemen Universitas Jayakarta",
    avatar: "🏛️",
    category: "Yayasan",
    order: 7
  },
  {
    name: "Dr. H. Ahmad Fauzi",
    role: "Dewan Pembina Yayasan",
    education: "S3 Hukum & Kebijakan Publik Universitas Indonesia",
    avatar: "⚖️",
    category: "Yayasan",
    order: 8
  },
  {
    name: "Hj. Ratna Sari, S.E.",
    role: "Bendahara Yayasan",
    education: "S1 Akuntansi Universitas Jayakarta",
    avatar: "💼",
    category: "Yayasan",
    order: 9
  }
];

// --- Seed Database Function ---
export async function seedDatabaseIfEmpty() {
  const settingsDocRef = doc(db, COL_SETTINGS, "general");
  try {
    // Check if website settings exist
    const settingsSnap = await getDoc(settingsDocRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsDocRef, DEFAULT_SETTINGS);
      console.log("Website settings seeded successfully!");
    }
  } catch (error) {
    console.error("Error seeding settings: ", error);
    // Ignore seeding read-write errors on initial guest load to allow offline graceful fallback
  }

  try {
    // Check if announcements exist
    const announcementsQuery = query(collection(db, COL_ANNOUNCEMENTS));
    const querySnapshot = await getDocs(announcementsQuery);
    if (querySnapshot.empty) {
      for (const ann of DEFAULT_ANNOUNCEMENTS) {
        await addDoc(collection(db, COL_ANNOUNCEMENTS), {
          ...ann,
          createdAt: new Date().toISOString()
        });
      }
      console.log("Default announcements seeded successfully!");
    }
  } catch (error) {
    console.error("Error seeding announcements: ", error);
    // Ignore seeding read-write errors on initial guest load to allow offline graceful fallback
  }

  try {
    // Check if board members exist
    const boardQuery = query(collection(db, COL_BOARD));
    const querySnapshot = await getDocs(boardQuery);
    if (querySnapshot.empty) {
      for (const member of DEFAULT_BOARD_MEMBERS) {
        await addDoc(collection(db, COL_BOARD), member);
      }
      console.log("Default board members seeded successfully!");
    }
  } catch (error) {
    console.error("Error seeding board members: ", error);
  }

  // --- Seed EduHub default template styles ---
  try {
    const templatesQuery = query(collection(db, COL_TEMPLATE_STYLES));
    const querySnapshot = await getDocs(templatesQuery);
    if (querySnapshot.empty) {
      for (const tpl of DEFAULT_TEMPLATE_STYLES) {
        const { id, ...styleData } = tpl;
        await setDoc(doc(db, COL_TEMPLATE_STYLES, id!), styleData);
      }
      console.log("Default template styles seeded successfully!");
    }
  } catch (e) {
    console.warn("Seeding Firestore template styles failed:", e);
  }

  // --- Seed EduHub default menu items ---
  try {
    const menusQuery = query(collection(db, COL_MENU_ITEMS));
    const querySnapshot = await getDocs(menusQuery);
    if (querySnapshot.empty) {
      for (const m of DEFAULT_MENU_ITEMS) {
        const { id, ...menuData } = m;
        await setDoc(doc(db, COL_MENU_ITEMS, id!), menuData);
      }
      console.log("Default menu items seeded successfully!");
    }
  } catch (e) {
    console.warn("Seeding Firestore menu items failed:", e);
  }
}

export const DEFAULT_TEMPLATE_STYLES: DbTemplateStyle[] = [
  {
    id: "tpl-default",
    name: "APJ Royal Navy (Default)",
    primaryColor: "#002f5a",
    secondaryColor: "#1e3a8a",
    accentColor: "#FFC46A",
    backgroundColor: "#f8fafc",
    fontFamily: "font-sans",
    headingFontName: "Inter",
    cardRadius: "rounded-xl",
    headerStyle: "sticky",
    showHeroBackground: true,
    badgeStyle: "pill",
    isSystem: true,
    logoHeader: "/input_file_0.png",
    logoFooter: "/input_file_1.png",
    favicon: "/input_file_1.png",
    titleFontFamily: "Montserrat",
    titleFontColor: "#002f5a",
    titleFontSize: "2.5rem",
    subtitleFontFamily: "Plus Jakarta Sans",
    subtitleFontColor: "#475569",
    subtitleFontSize: "1.25rem",
    h1FontFamily: "Poppins",
    h1FontColor: "#002f5a",
    h1FontSize: "2.25rem",
    h2FontFamily: "Poppins",
    h2FontColor: "#002f5a",
    h2FontSize: "1.875rem",
    h3FontFamily: "Poppins",
    h3FontColor: "#002f5a",
    h3FontSize: "1.5rem",
    h4FontFamily: "Poppins",
    h4FontColor: "#002f5a",
    h4FontSize: "1.25rem",
    h5FontFamily: "Poppins",
    h5FontColor: "#1e3a8a",
    h5FontSize: "1.125rem",
    h6FontFamily: "Poppins",
    h6FontColor: "#1e3a8a",
    h6FontSize: "1rem",
    textFontFamily: "Plus Jakarta Sans",
    textFontColor: "#1e293b",
    textFontSize: "0.875rem",
    paragraphFontFamily: "Plus Jakarta Sans",
    paragraphFontColor: "#334155",
    paragraphFontSize: "0.875rem"
  },
  {
    id: "tpl-sand",
    name: "EduHub Terracotta Sand",
    primaryColor: "#7c2d12",
    secondaryColor: "#ea580c",
    accentColor: "#fbbf24",
    backgroundColor: "#fff1e6",
    fontFamily: "font-sans",
    headingFontName: "Playfair Display",
    cardRadius: "rounded-3xl",
    headerStyle: "glass",
    showHeroBackground: true,
    badgeStyle: "pill",
    isSystem: true,
    logoHeader: "/input_file_0.png",
    logoFooter: "/input_file_1.png",
    favicon: "/input_file_1.png",
    titleFontFamily: "Playfair Display",
    titleFontColor: "#7c2d12",
    titleFontSize: "2.75rem",
    subtitleFontFamily: "Merriweather",
    subtitleFontColor: "#7c2d12",
    subtitleFontSize: "1.125rem",
    h1FontFamily: "Playfair Display",
    h1FontColor: "#7c2d12",
    h1FontSize: "2.5rem",
    h2FontFamily: "Playfair Display",
    h2FontColor: "#7c2d12",
    h2FontSize: "2rem",
    h3FontFamily: "Playfair Display",
    h3FontColor: "#ea580c",
    h3FontSize: "1.5rem",
    h4FontFamily: "Merriweather",
    h4FontColor: "#7c2d12",
    h4FontSize: "1.25rem",
    h5FontFamily: "Merriweather",
    h5FontColor: "#7c2d12",
    h5FontSize: "1.125rem",
    h6FontFamily: "Merriweather",
    h6FontColor: "#7c2d12",
    h6FontSize: "1rem",
    textFontFamily: "Plus Jakarta Sans",
    textFontColor: "#27272a",
    textFontSize: "0.875rem",
    paragraphFontFamily: "Plus Jakarta Sans",
    paragraphFontColor: "#3f3f46",
    paragraphFontSize: "0.875rem"
  },
  {
    id: "tpl-midnight",
    name: "Midnight Anthracite",
    primaryColor: "#0f172a",
    secondaryColor: "#475569",
    accentColor: "#10b981",
    backgroundColor: "#f1f5f9",
    fontFamily: "font-mono",
    headingFontName: "Space Grotesk",
    cardRadius: "rounded-md",
    headerStyle: "minimal",
    showHeroBackground: false,
    badgeStyle: "sharp",
    isSystem: true,
    logoHeader: "/input_file_0.png",
    logoFooter: "/input_file_1.png",
    favicon: "/input_file_1.png",
    titleFontFamily: "Space Grotesk",
    titleFontColor: "#0f172a",
    titleFontSize: "2.25rem",
    subtitleFontFamily: "JetBrains Mono",
    subtitleFontColor: "#475569",
    subtitleFontSize: "1rem",
    h1FontFamily: "Space Grotesk",
    h1FontColor: "#0f172a",
    h1FontSize: "2rem",
    h2FontFamily: "Space Grotesk",
    h2FontColor: "#0f172a",
    h2FontSize: "1.75rem",
    h3FontFamily: "Space Grotesk",
    h3FontColor: "#475569",
    h3FontSize: "1.5rem",
    h4FontFamily: "JetBrains Mono",
    h4FontColor: "#0f172a",
    h4FontSize: "1.125rem",
    h5FontFamily: "JetBrains Mono",
    h5FontColor: "#0f172a",
    h5FontSize: "1rem",
    h6FontFamily: "JetBrains Mono",
    h6FontColor: "#475569",
    h6FontSize: "0.875rem",
    textFontFamily: "JetBrains Mono",
    textFontColor: "#0f172a",
    textFontSize: "0.875rem",
    paragraphFontFamily: "JetBrains Mono",
    paragraphFontColor: "#334155",
    paragraphFontSize: "0.825rem"
  },
  {
    id: "tpl-forest",
    name: "Forest Eco Sage",
    primaryColor: "#064e3b",
    secondaryColor: "#047857",
    accentColor: "#facc15",
    backgroundColor: "#f0fdf4",
    fontFamily: "font-sans",
    headingFontName: "Inter",
    cardRadius: "rounded-xl",
    headerStyle: "sticky",
    showHeroBackground: true,
    badgeStyle: "pill",
    isSystem: true,
    logoHeader: "/input_file_0.png",
    logoFooter: "/input_file_1.png",
    favicon: "/input_file_1.png",
    titleFontFamily: "Inter",
    titleFontColor: "#064e3b",
    titleFontSize: "2.5rem",
    subtitleFontFamily: "Plus Jakarta Sans",
    subtitleFontColor: "#047857",
    subtitleFontSize: "1.25rem",
    h1FontFamily: "Inter",
    h1FontColor: "#064e3b",
    h1FontSize: "2.25rem",
    h2FontFamily: "Inter",
    h2FontColor: "#064e3b",
    h2FontSize: "1.875rem",
    h3FontFamily: "Inter",
    h3FontColor: "#047857",
    h3FontSize: "1.5rem",
    h4FontFamily: "Plus Jakarta Sans",
    h4FontColor: "#064e3b",
    h4FontSize: "1.25rem",
    h5FontFamily: "Plus Jakarta Sans",
    h5FontColor: "#064e3b",
    h5FontSize: "1.125rem",
    h6FontFamily: "Plus Jakarta Sans",
    h6FontColor: "#047857",
    h6FontSize: "1rem",
    textFontFamily: "Plus Jakarta Sans",
    textFontColor: "#0f172a",
    textFontSize: "0.875rem",
    paragraphFontFamily: "Plus Jakarta Sans",
    paragraphFontColor: "#334155",
    paragraphFontSize: "0.875rem"
  },
  {
    id: "tpl-wine",
    name: "Luxury Wine Accent",
    primaryColor: "#4c0519",
    secondaryColor: "#9d174d",
    accentColor: "#fda4af",
    backgroundColor: "#fff1f2",
    fontFamily: "font-serif",
    headingFontName: "Playfair Display",
    cardRadius: "rounded-3xl",
    headerStyle: "glass",
    showHeroBackground: true,
    badgeStyle: "outline",
    isSystem: true,
    logoHeader: "/input_file_0.png",
    logoFooter: "/input_file_1.png",
    favicon: "/input_file_1.png",
    titleFontFamily: "Playfair Display",
    titleFontColor: "#4c0519",
    titleFontSize: "2.75rem",
    subtitleFontFamily: "Merriweather",
    subtitleFontColor: "#9d174d",
    subtitleFontSize: "1.125rem",
    h1FontFamily: "Playfair Display",
    h1FontColor: "#4c0519",
    h1FontSize: "2.5rem",
    h2FontFamily: "Playfair Display",
    h2FontColor: "#4c0519",
    h2FontSize: "2rem",
    h3FontFamily: "Playfair Display",
    h3FontColor: "#9d174d",
    h3FontSize: "1.5rem",
    h4FontFamily: "Merriweather",
    h4FontColor: "#4c0519",
    h4FontSize: "1.25rem",
    h5FontFamily: "Merriweather",
    h5FontColor: "#4c0519",
    h5FontSize: "1.125rem",
    h6FontFamily: "Merriweather",
    h6FontColor: "#9d174d",
    h6FontSize: "1rem",
    textFontFamily: "Plus Jakarta Sans",
    textFontColor: "#1e293b",
    textFontSize: "0.875rem",
    paragraphFontFamily: "Plus Jakarta Sans",
    paragraphFontColor: "#334155",
    paragraphFontSize: "0.875rem"
  }
];

export const DEFAULT_MENU_ITEMS: DbMenuItem[] = [
  {
    id: "menu-home",
    label: "Beranda",
    sectionId: "home",
    tabId: "",
    order: 1,
    templateStyleId: "tpl-default"
  },
  {
    id: "menu-profil",
    label: "Profil Kampus",
    sectionId: "profil",
    tabId: "sejarah",
    order: 2,
    templateStyleId: "tpl-default"
  },
  {
    id: "menu-akademik",
    label: "Akademik",
    sectionId: "akademik",
    tabId: "d3perhotelan",
    order: 3,
    templateStyleId: "tpl-default"
  },
  {
    id: "menu-pmb",
    label: "Penerimaan (PMB)",
    sectionId: "pmb",
    tabId: "syarat",
    order: 4,
    templateStyleId: "tpl-default"
  },
  {
    id: "menu-kemahasiswaan",
    label: "Kemahasiswaan",
    sectionId: "kemahasiswaan",
    tabId: "ukm",
    order: 5,
    templateStyleId: "tpl-default"
  },
  {
    id: "menu-kontak",
    label: "Hubungi & Chatbot",
    sectionId: "kontak",
    tabId: "",
    order: 6,
    templateStyleId: "tpl-default"
  },
  {
    id: "menu-admin",
    label: "Kelola Website ⚙️",
    sectionId: "admin",
    tabId: "",
    order: 7,
    templateStyleId: "tpl-default"
  }
];

// --- Local helper functions for LocalStorage fallbacks ---
function getLocalPmbApps(): PmbApplication[] {
  const deletedIds = getLocalDeletedIds(COL_PMB);
  const filterDeleted = (list: PmbApplication[]) => list.filter(m => !deletedIds.includes(m.id!));
  try {
    const data = localStorage.getItem("local_pmb_apps");
    if (!data) {
      const defaultApps: PmbApplication[] = [
        {
          id: "local-app-1",
          applicationId: "APJ-2026-0001",
          name: "Budi Santoso",
          email: "budi.santoso@gmail.com",
          phone: "081234567890",
          highSchool: "SMK Pariwisata Jakarta",
          gradYear: "2025",
          major: "D3 Perhotelan",
          classType: "Reguler",
          status: "Verified",
          createdAt: "2026-06-18T10:00:00.000Z"
        },
        {
          id: "local-app-2",
          applicationId: "APJ-2026-0002",
          name: "Siti Rahma",
          email: "siti.rahma@yahoo.com",
          phone: "082145678901",
          highSchool: "SMA Negeri 8 Jakarta",
          gradYear: "2026",
          major: "D3 Usaha Penyelenggaraan Kegiatan (MICE)",
          classType: "Reguler",
          status: "Pending",
          createdAt: "2026-06-19T14:30:00.000Z"
        },
        {
          id: "local-app-3",
          applicationId: "APJ-2026-0003",
          name: "Aditya Wijaya",
          email: "aditya.w@outlook.com",
          phone: "085734561234",
          highSchool: "SMK Negeri 57 Jakarta",
          gradYear: "2025",
          major: "D3 Perhotelan",
          classType: "Karyawan",
          status: "Lulus Seleksi",
          createdAt: "2026-06-15T09:15:00.000Z"
        }
      ];
      localStorage.setItem("local_pmb_apps", JSON.stringify(defaultApps));
      return filterDeleted(defaultApps);
    }
    return filterDeleted(JSON.parse(data));
  } catch (e) {
    return [];
  }
}

function saveLocalPmbApps(apps: PmbApplication[]) {
  try {
    localStorage.setItem("local_pmb_apps", JSON.stringify(apps));
  } catch (e) {
    console.warn("localStorage save failed", e);
  }
}

function getLocalContactMsgs(): ContactMessage[] {
  const deletedIds = getLocalDeletedIds(COL_CONTACT);
  const filterDeleted = (list: ContactMessage[]) => list.filter(m => !deletedIds.includes(m.id!));
  try {
    const data = localStorage.getItem("local_contact_msgs");
    if (!data) {
      const defaultMsgs: ContactMessage[] = [
        {
          id: "local-msg-1",
          name: "Rahmat Hidayat",
          email: "rahmat.h@gmail.com",
          message: "Halo admin, apakah pendaftaran gelombang kedua masih dibuka? Syarat pendaftarannya apa saja ya?",
          isRead: false,
          createdAt: "2026-06-19T08:00:00.000Z"
        },
        {
          id: "local-msg-2",
          name: "Dewi Lestari",
          email: "dewi.l@gmail.com",
          message: "Bagaimana proses konfirmasi pembayaran formulir pendaftaran PMB?",
          isRead: true,
          replyNote: "Konfirmasi pembayaran dapat dikirimkan langsung melalui WhatsApp helpdesk di nomor +62-21-4288-4648.",
          createdAt: "2026-06-17T11:24:00.000Z"
        }
      ];
      localStorage.setItem("local_contact_msgs", JSON.stringify(defaultMsgs));
      return filterDeleted(defaultMsgs);
    }
    return filterDeleted(JSON.parse(data));
  } catch (e) {
    return [];
  }
}

function saveLocalContactMsgs(msgs: ContactMessage[]) {
  try {
    localStorage.setItem("local_contact_msgs", JSON.stringify(msgs));
  } catch (e) {
    console.warn("localStorage save failed", e);
  }
}

function getLocalBoardMembers(): DbBoardMember[] {
  const deletedIds = getLocalDeletedIds(COL_BOARD);
  const filterDeleted = (list: DbBoardMember[]) => list.filter(m => !deletedIds.includes(m.id!));
  try {
    const data = localStorage.getItem("local_board_members");
    if (!data) {
      const withIds = DEFAULT_BOARD_MEMBERS.map((m, idx) => ({
        id: `local-board-${idx + 1}`,
        ...m
      }));
      localStorage.setItem("local_board_members", JSON.stringify(withIds));
      return filterDeleted(withIds);
    }
    const parsed = JSON.parse(data) as DbBoardMember[];
    let hasMissingId = false;
    const withIds = parsed.map((m, idx) => {
      if (!m.id) {
        hasMissingId = true;
        return {
          id: `local-board-${idx + 1}-${Math.random().toString(36).substr(2, 5)}`,
          ...m
        };
      }
      return m;
    });
    if (hasMissingId) {
      localStorage.setItem("local_board_members", JSON.stringify(withIds));
    }
    return filterDeleted(withIds);
  } catch (e) {
    const fallback = DEFAULT_BOARD_MEMBERS.map((m, idx) => ({
      id: `local-board-${idx + 1}`,
      ...m
    }));
    return filterDeleted(fallback);
  }
}

function saveLocalBoardMembers(members: DbBoardMember[]) {
  try {
    localStorage.setItem("local_board_members", JSON.stringify(members));
  } catch (e) {
    console.warn("localStorage save failed", e);
  }
}

function getLocalWebsiteSettings(): WebsiteSettings {
  try {
    const data = localStorage.getItem("local_website_settings");
    if (!data) {
      localStorage.setItem("local_website_settings", JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

function saveLocalWebsiteSettings(settings: WebsiteSettings) {
  try {
    localStorage.setItem("local_website_settings", JSON.stringify(settings));
  } catch (e) {
    console.warn("localStorage save failed", e);
  }
}

function getLocalAnnouncements(): AnnouncementItem[] {
  const deletedIds = getLocalDeletedIds(COL_ANNOUNCEMENTS);
  const filterDeleted = (list: AnnouncementItem[]) => list.filter(m => !deletedIds.includes(m.id!));
  try {
    const data = localStorage.getItem("local_announcements");
    if (!data) {
      const withIds = DEFAULT_ANNOUNCEMENTS.map((ann, idx) => ({
        id: `local-ann-${idx + 1}`,
        ...ann
      }));
      localStorage.setItem("local_announcements", JSON.stringify(withIds));
      return filterDeleted(withIds);
    }
    return filterDeleted(JSON.parse(data));
  } catch (e) {
    const withIds = DEFAULT_ANNOUNCEMENTS.map((ann, idx) => ({
      id: `local-ann-${idx + 1}`,
      ...ann
    }));
    return filterDeleted(withIds);
  }
}

function saveLocalAnnouncements(anns: AnnouncementItem[]) {
  try {
    localStorage.setItem("local_announcements", JSON.stringify(anns));
  } catch (e) {
    console.warn("localStorage save failed", e);
  }
}

// --- PMB Operations ---
export async function submitPmbApplication(appData: Omit<PmbApplication, "status">): Promise<string> {
  const fullApp: PmbApplication = {
    ...appData,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  const tempId = "local-" + Math.random().toString(36).substr(2, 9);
  try {
    const localApps = getLocalPmbApps();
    localApps.unshift({ id: tempId, ...fullApp });
    saveLocalPmbApps(localApps);
  } catch (e) {
    console.warn("local sync error", e);
  }

  try {
    const docRef = await addDoc(collection(db, COL_PMB), fullApp);
    return docRef.id;
  } catch (error) {
    console.warn("submitPmbApplication to Firestore failed, using fallback:", error);
    return tempId;
  }
}

export async function getPmbApplications(): Promise<PmbApplication[]> {
  const deletedIds = getLocalDeletedIds(COL_PMB);
  try {
    const querySnap = await getDocs(query(collection(db, COL_PMB), orderBy("createdAt", "desc")));
    const dbs = querySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PmbApplication));
    const filtered = dbs.filter(m => !deletedIds.includes(m.id!));
    saveLocalPmbApps(filtered);
    return filtered;
  } catch (error) {
    console.warn("getPmbApplications Firestore list allowed only for real backend authenticated admins, falling back to local simulation data:", error);
    return getLocalPmbApps();
  }
}

export async function updatePmbApplicationStatus(id: string, status: PmbApplication["status"], notes?: string): Promise<void> {
  try {
    const localApps = getLocalPmbApps();
    const updated = localApps.map(app => {
      if (app.id === id) {
        return { ...app, status, ...(notes !== undefined ? { notes } : {}) };
      }
      return app;
    });
    saveLocalPmbApps(updated);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local")) {
      const docRef = doc(db, COL_PMB, id);
      await updateDoc(docRef, { status, ...(notes !== undefined ? { notes } : {}) });
    }
  } catch (error) {
    console.warn("Firestore updatePmbApplicationStatus failed:", error);
  }
}

export async function deletePmbApplication(id: string): Promise<void> {
  if (!id) return;
  addLocalDeletedId(COL_PMB, id);
  try {
    const localApps = getLocalPmbApps();
    const filtered = localApps.filter(app => app.id !== id);
    saveLocalPmbApps(filtered);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local")) {
      const docRef = doc(db, COL_PMB, id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn("Firestore deletePmbApplication failed:", error);
  }
}

// --- Contact Form Operations ---
export async function submitContactMessage(name: string, email: string, message: string): Promise<string> {
  const newMsg: ContactMessage = {
    name,
    email,
    message,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  const tempId = "local-" + Math.random().toString(36).substr(2, 9);
  try {
    const localMsgs = getLocalContactMsgs();
    localMsgs.unshift({ id: tempId, ...newMsg });
    saveLocalContactMsgs(localMsgs);
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = await addDoc(collection(db, COL_CONTACT), newMsg);
    return docRef.id;
  } catch (error) {
    console.warn("submitContactMessage to Firestore failed, fallback to local:", error);
    return tempId;
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const deletedIds = getLocalDeletedIds(COL_CONTACT);
  try {
    const querySnap = await getDocs(query(collection(db, COL_CONTACT), orderBy("createdAt", "desc")));
    const dbs = querySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ContactMessage));
    const filtered = dbs.filter(m => !deletedIds.includes(m.id!));
    saveLocalContactMsgs(filtered);
    return filtered;
  } catch (error) {
    console.warn("getContactMessages Firestore list failed, using local storage fallback:", error);
    return getLocalContactMsgs();
  }
}

export async function updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<void> {
  try {
    const localMsgs = getLocalContactMsgs();
    const updated = localMsgs.map(msg => {
      if (msg.id === id) {
        return { ...msg, ...updates };
      }
      return msg;
    });
    saveLocalContactMsgs(updated);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local")) {
      const docRef = doc(db, COL_CONTACT, id);
      await updateDoc(docRef, updates);
    }
  } catch (error) {
    console.warn("Firestore updateContactMessage failed:", error);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  if (!id) return;
  addLocalDeletedId(COL_CONTACT, id);
  try {
    const localMsgs = getLocalContactMsgs();
    const filtered = localMsgs.filter(msg => msg.id !== id);
    saveLocalContactMsgs(filtered);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local")) {
      const docRef = doc(db, COL_CONTACT, id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn("Firestore deleteContactMessage failed:", error);
  }
}

// --- Announcement / Highlights Operations ---
export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  const deletedIds = getLocalDeletedIds(COL_ANNOUNCEMENTS);
  try {
    const querySnap = await getDocs(query(collection(db, COL_ANNOUNCEMENTS), orderBy("createdAt", "desc")));
    const dbs = querySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AnnouncementItem));
    if (dbs.length > 0) {
      const filtered = dbs.filter(m => !deletedIds.includes(m.id!));
      saveLocalAnnouncements(filtered);
      return filtered;
    }
    return getLocalAnnouncements();
  } catch (error) {
    console.warn("Could not load dynamic announcements from Firestore, using LocalStorage fallback:", error);
    return getLocalAnnouncements();
  }
}

export async function createAnnouncement(ann: Omit<AnnouncementItem, "id">): Promise<string> {
  const tempId = "local-ann-" + Math.random().toString(36).substr(2, 9);
  try {
    const localAnns = getLocalAnnouncements();
    localAnns.unshift({ id: tempId, ...ann });
    saveLocalAnnouncements(localAnns);
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = await addDoc(collection(db, COL_ANNOUNCEMENTS), {
      ...ann,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.warn("createAnnouncement to Firestore failed, using local fallback:", error);
    return tempId;
  }
}

export async function updateAnnouncement(id: string, updates: Partial<AnnouncementItem>): Promise<void> {
  try {
    const localAnns = getLocalAnnouncements();
    const updated = localAnns.map(ann => {
      if (ann.id === id) {
        return { ...ann, ...updates };
      }
      return ann;
    });
    saveLocalAnnouncements(updated);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local")) {
      const docRef = doc(db, COL_ANNOUNCEMENTS, id);
      await updateDoc(docRef, updates);
    }
  } catch (error) {
    console.warn("Firestore updateAnnouncement failed:", error);
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  if (!id) return;
  addLocalDeletedId(COL_ANNOUNCEMENTS, id);
  try {
    const localAnns = getLocalAnnouncements();
    const filtered = localAnns.filter(ann => ann.id !== id);
    saveLocalAnnouncements(filtered);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local")) {
      const docRef = doc(db, COL_ANNOUNCEMENTS, id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn("Firestore deleteAnnouncement failed:", error);
  }
}

// --- News / Announcement Categories Operations ---
const DEFAULT_NEWS_CATEGORIES = [
  "Kegiatan Akademik",
  "Prestasi Mahasiswa",
  "Kerjasama Kemitraan",
  "Pengumuman Penting"
];

export async function getNewsCategories(): Promise<string[]> {
  try {
    const docRef = doc(db, COL_SETTINGS, "news_categories");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.categories)) {
        localStorage.setItem("local_news_categories", JSON.stringify(data.categories));
        return data.categories;
      }
    }
  } catch (error) {
    console.warn("Could not get news categories from Firestore:", error);
  }

  // Local storage fallback
  try {
    const localCats = localStorage.getItem("local_news_categories");
    if (localCats) {
      return JSON.parse(localCats);
    }
  } catch (e) {
    console.warn(e);
  }

  return DEFAULT_NEWS_CATEGORIES;
}

export async function saveNewsCategories(categories: string[]): Promise<void> {
  try {
    localStorage.setItem("local_news_categories", JSON.stringify(categories));
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = doc(db, COL_SETTINGS, "news_categories");
    await setDoc(docRef, { categories }, { merge: true });
  } catch (error) {
    console.warn("Firestore saveNewsCategories failed:", error);
  }
}

// --- Website General Settings Operations ---
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const docRef = doc(db, COL_SETTINGS, "general");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as WebsiteSettings;
      saveLocalWebsiteSettings(data);
      return data;
    }
    return getLocalWebsiteSettings();
  } catch (error) {
    console.warn("Could not get website settings from Firestore, fallback to local:", error);
    return getLocalWebsiteSettings();
  }
}

export async function saveWebsiteSettings(settings: WebsiteSettings): Promise<void> {
  try {
    saveLocalWebsiteSettings(settings);
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = doc(db, COL_SETTINGS, "general");
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    console.warn("Firestore saveWebsiteSettings failed:", error);
  }
}

// --- Board Members Operations ---
export async function getDbBoardMembers(): Promise<DbBoardMember[]> {
  const deletedIds = getLocalDeletedIds(COL_BOARD);
  try {
    const querySnap = await getDocs(query(collection(db, COL_BOARD), orderBy("order", "asc")));
    const dbs = querySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DbBoardMember));
    if (dbs.length > 0) {
      const filtered = dbs.filter(m => !deletedIds.includes(m.id!));
      saveLocalBoardMembers(filtered);
      return filtered;
    }
    return getLocalBoardMembers();
  } catch (error) {
    console.warn("Could not load board members from Firestore, using LocalStorage fallback:", error);
    return getLocalBoardMembers();
  }
}

export async function createDbBoardMember(member: Omit<DbBoardMember, "id">): Promise<string> {
  const tempId = "local-board-" + Math.random().toString(36).substr(2, 9);
  try {
    const localMembers = getLocalBoardMembers();
    localMembers.push({ id: tempId, ...member });
    localMembers.sort((a, b) => a.order - b.order);
    saveLocalBoardMembers(localMembers);
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = await addDoc(collection(db, COL_BOARD), member);
    return docRef.id;
  } catch (error) {
    console.warn("createDbBoardMember to Firestore failed, using local fallback:", error);
    return tempId;
  }
}

export async function updateDbBoardMember(id: string, updates: Partial<DbBoardMember>): Promise<void> {
  try {
    const localMembers = getLocalBoardMembers();
    const updated = localMembers.map(member => {
      if (member.id === id) {
        return { ...member, ...updates };
      }
      return member;
    });
    updated.sort((a, b) => a.order - b.order);
    saveLocalBoardMembers(updated);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local")) {
      const docRef = doc(db, COL_BOARD, id);
      await updateDoc(docRef, updates);
    }
  } catch (error) {
    console.warn("Firestore updateDbBoardMember failed:", error);
  }
}

export async function deleteDbBoardMember(id: string): Promise<void> {
  if (!id) return;
  addLocalDeletedId(COL_BOARD, id);
  try {
    const localMembers = getLocalBoardMembers();
    const filtered = localMembers.filter(member => member.id !== id);
    saveLocalBoardMembers(filtered);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local")) {
      const docRef = doc(db, COL_BOARD, id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn("Firestore deleteDbBoardMember failed:", error);
  }
}

// --- Joomla Template Styles Services ---
export function getLocalTemplateStyles(): DbTemplateStyle[] {
  const deletedIds = getLocalDeletedIds(COL_TEMPLATE_STYLES);
  const filterDeleted = (list: DbTemplateStyle[]) => list.filter(t => !deletedIds.includes(t.id!));
  try {
    const data = localStorage.getItem("local_template_styles");
    if (!data) {
      localStorage.setItem("local_template_styles", JSON.stringify(DEFAULT_TEMPLATE_STYLES));
      return DEFAULT_TEMPLATE_STYLES;
    }
    const list: DbTemplateStyle[] = JSON.parse(data);
    return filterDeleted(list);
  } catch (e) {
    return DEFAULT_TEMPLATE_STYLES;
  }
}

export function saveLocalTemplateStyles(styles: DbTemplateStyle[]) {
  try {
    localStorage.setItem("local_template_styles", JSON.stringify(styles));
  } catch (e) {
    console.warn(e);
  }
}

export async function getTemplateStyles(): Promise<DbTemplateStyle[]> {
  try {
    const q = query(collection(db, COL_TEMPLATE_STYLES));
    const snap = await getDocs(q);
    if (snap.empty) {
      return getLocalTemplateStyles();
    }
    const firestoreList: DbTemplateStyle[] = [];
    snap.forEach(doc => {
      firestoreList.push({ id: doc.id, ...doc.data() } as DbTemplateStyle);
    });
    // Deduplicate/merge with local unsaved ones
    const local = getLocalTemplateStyles();
    const merged = [...firestoreList];
    local.forEach(loc => {
      if (!merged.find(m => m.id === loc.id)) {
        merged.push(loc);
      }
    });
    return merged;
  } catch (e) {
    return getLocalTemplateStyles();
  }
}

export async function createDbTemplateStyle(style: Omit<DbTemplateStyle, "id">): Promise<string> {
  const tempId = "local-tpl-" + Date.now();
  try {
    const local = getLocalTemplateStyles();
    const newStyle = { id: tempId, ...style };
    local.push(newStyle);
    saveLocalTemplateStyles(local);
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = await addDoc(collection(db, COL_TEMPLATE_STYLES), style);
    return docRef.id;
  } catch (error) {
    console.warn("createDbTemplateStyle fail:", error);
    return tempId;
  }
}

export async function updateDbTemplateStyle(id: string, updates: Partial<DbTemplateStyle>): Promise<void> {
  try {
    const local = getLocalTemplateStyles();
    const updated = local.map(s => s.id === id ? { ...s, ...updates } : s);
    saveLocalTemplateStyles(updated);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local") && !id.startsWith("tpl-")) {
      const docRef = doc(db, COL_TEMPLATE_STYLES, id);
      await updateDoc(docRef, updates);
    }
  } catch (error) {
    console.warn("updateDbTemplateStyle fail:", error);
  }
}

export async function deleteDbTemplateStyle(id: string): Promise<void> {
  if (!id) return;
  addLocalDeletedId(COL_TEMPLATE_STYLES, id);
  try {
    const local = getLocalTemplateStyles();
    const filtered = local.filter(s => s.id !== id);
    saveLocalTemplateStyles(filtered);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local") && !id.startsWith("tpl-")) {
      const docRef = doc(db, COL_TEMPLATE_STYLES, id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn("deleteDbTemplateStyle fail:", error);
  }
}


// --- Joomla Menu Items Services ---
export function getLocalMenuItems(): DbMenuItem[] {
  const deletedIds = getLocalDeletedIds(COL_MENU_ITEMS);
  const filterDeleted = (list: DbMenuItem[]) => list.filter(m => !deletedIds.includes(m.id!));
  try {
    const data = localStorage.getItem("local_menu_items");
    if (!data) {
      localStorage.setItem("local_menu_items", JSON.stringify(DEFAULT_MENU_ITEMS));
      return DEFAULT_MENU_ITEMS;
    }
    const list: DbMenuItem[] = JSON.parse(data);
    return filterDeleted(list.sort((a, b) => a.order - b.order));
  } catch (e) {
    return DEFAULT_MENU_ITEMS;
  }
}

export function saveLocalMenuItems(items: DbMenuItem[]) {
  try {
    localStorage.setItem("local_menu_items", JSON.stringify(items));
  } catch (e) {
    console.warn(e);
  }
}

export async function getMenuItems(): Promise<DbMenuItem[]> {
  try {
    const q = query(collection(db, COL_MENU_ITEMS));
    const snap = await getDocs(q);
    if (snap.empty) {
      return getLocalMenuItems();
    }
    const firestoreList: DbMenuItem[] = [];
    snap.forEach(doc => {
      firestoreList.push({ id: doc.id, ...doc.data() } as DbMenuItem);
    });
    const local = getLocalMenuItems();
    const merged = [...firestoreList];
    local.forEach(loc => {
      if (!merged.find(m => m.id === loc.id)) {
        merged.push(loc);
      }
    });
    return merged.sort((a, b) => a.order - b.order);
  } catch (e) {
    return getLocalMenuItems();
  }
}

export async function createDbMenuItem(item: Omit<DbMenuItem, "id">): Promise<string> {
  const tempId = "local-menu-" + Date.now();
  try {
    const local = getLocalMenuItems();
    const newItem = { id: tempId, ...item };
    local.push(newItem);
    local.sort((a, b) => a.order - b.order);
    saveLocalMenuItems(local);
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = await addDoc(collection(db, COL_MENU_ITEMS), item);
    return docRef.id;
  } catch (error) {
    console.warn("createDbMenuItem fail:", error);
    return tempId;
  }
}

export async function updateDbMenuItem(id: string, updates: Partial<DbMenuItem>): Promise<void> {
  try {
    const local = getLocalMenuItems();
    const updated = local.map(m => m.id === id ? { ...m, ...updates } : m);
    updated.sort((a, b) => a.order - b.order);
    saveLocalMenuItems(updated);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local") && !id.startsWith("menu-")) {
      const docRef = doc(db, COL_MENU_ITEMS, id);
      await updateDoc(docRef, updates);
    }
  } catch (error) {
    console.warn("updateDbMenuItem fail:", error);
  }
}

export async function deleteDbMenuItem(id: string): Promise<void> {
  if (!id) return;
  addLocalDeletedId(COL_MENU_ITEMS, id);
  try {
    const local = getLocalMenuItems();
    const filtered = local.filter(m => m.id !== id);
    saveLocalMenuItems(filtered);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local") && !id.startsWith("menu-")) {
      const docRef = doc(db, COL_MENU_ITEMS, id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn("deleteDbMenuItem fail:", error);
  }
}

export interface JoomlaSlide {
  id?: string;
  title: string;
  subtitle: string;
  desc: string;
  ctaText: string;
  imageUrl?: string;
  order: number;
  published: boolean;
}

const DEFAULT_SLIDES: JoomlaSlide[] = [
  {
    id: "slide-1",
    title: "Penerimaan Mahasiswa Baru TA 2026/2027",
    subtitle: "Saatnya Menjadi Profesional & Pemimpin Industri Pariwisata Dunia",
    desc: "APJ membuka pendaftaran Jalur Reguler, Prestasi Rapor, Beasiswa Unggulan, dan Kelas Praktisi Karyawan. Pendaftaran gelombang kedua sedang berlangsung!",
    ctaText: "Daftar PMB Sekarang",
    imageUrl: "",
    order: 1,
    published: true
  },
  {
    id: "slide-2",
    title: "Program Studi D3 Perhotelan & Usaha Wisata",
    subtitle: "Kurikulum Praktis Internasional Berlisensi BNSP",
    desc: "Menyediakan pendidikan vokasional terbaik berbasis kompetensi kerja nyata. Siap kerja, siap bersaing di hotel bintang 5 nasional dan mancanegara.",
    ctaText: "Eksplor Program Studi",
    imageUrl: "",
    order: 2,
    published: true
  },
  {
    id: "slide-3",
    title: "Peluang Karir & Jaringan Global",
    subtitle: "Magang Kerja Terarah Selama 6 Bulan",
    desc: "Disalurkan langsung ke The Ritz-Carlton, JW Marriott, Grand Hyatt, kapal pesiar internasional, serta agen perjalanan pariwisata terkemuka.",
    ctaText: "Hubungan Kerjasama Karir",
    imageUrl: "",
    order: 3,
    published: true
  }
];

function getLocalSlides(): JoomlaSlide[] {
  try {
    const data = localStorage.getItem("local_slides");
    if (!data) {
      localStorage.setItem("local_slides", JSON.stringify(DEFAULT_SLIDES));
      return DEFAULT_SLIDES;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_SLIDES;
  }
}

function saveLocalSlides(slides: JoomlaSlide[]) {
  try {
    localStorage.setItem("local_slides", JSON.stringify(slides));
  } catch (e) {
    console.warn(e);
  }
}

export async function getJoomlaSlides(): Promise<JoomlaSlide[]> {
  const deletedIds = getLocalDeletedIds(COL_SLIDES);
  try {
    const q = query(collection(db, COL_SLIDES));
    const snap = await getDocs(q);
    if (snap.empty) {
      const local = getLocalSlides();
      return local.filter(s => !deletedIds.includes(s.id!));
    }
    const firestoreList: JoomlaSlide[] = [];
    snap.forEach(doc => {
      firestoreList.push({ id: doc.id, ...doc.data() } as JoomlaSlide);
    });
    const local = getLocalSlides();
    const merged = [...firestoreList];
    local.forEach(loc => {
      if (!merged.find(m => m.id === loc.id) && !deletedIds.includes(loc.id!)) {
        merged.push(loc);
      }
    });
    const finalFiltered = merged.filter(s => !deletedIds.includes(s.id!));
    saveLocalSlides(finalFiltered);
    return finalFiltered.sort((a, b) => a.order - b.order);
  } catch (e) {
    return getLocalSlides().filter(s => !deletedIds.includes(s.id!)).sort((a, b) => a.order - b.order);
  }
}

export async function createJoomlaSlide(slide: Omit<JoomlaSlide, "id">): Promise<string> {
  const tempId = "local-slide-" + Date.now();
  try {
    const local = getLocalSlides();
    const newSlide = { id: tempId, ...slide };
    local.push(newSlide);
    local.sort((a, b) => a.order - b.order);
    saveLocalSlides(local);
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = await addDoc(collection(db, COL_SLIDES), slide);
    return docRef.id;
  } catch (error) {
    console.warn("createJoomlaSlide fail:", error);
    return tempId;
  }
}

export async function updateJoomlaSlide(id: string, updates: Partial<JoomlaSlide>): Promise<void> {
  try {
    const local = getLocalSlides();
    const updated = local.map(s => s.id === id ? { ...s, ...updates } : s);
    updated.sort((a, b) => a.order - b.order);
    saveLocalSlides(updated);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local") && !id.startsWith("slide-")) {
      const docRef = doc(db, COL_SLIDES, id);
      await updateDoc(docRef, updates);
    }
  } catch (error) {
    console.warn("updateJoomlaSlide fail:", error);
  }
}

export async function deleteJoomlaSlide(id: string): Promise<void> {
  if (!id) return;
  addLocalDeletedId(COL_SLIDES, id);
  try {
    const local = getLocalSlides();
    const filtered = local.filter(s => s.id !== id);
    saveLocalSlides(filtered);
  } catch (e) {
    console.warn(e);
  }

  try {
    if (!id.startsWith("local") && !id.startsWith("slide-")) {
      const docRef = doc(db, COL_SLIDES, id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn("deleteJoomlaSlide fail:", error);
  }
}
