import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ChevronRight, 
  GraduationCap, 
  DollarSign, 
  HelpCircle, 
  PhoneCall, 
  FileText, 
  RotateCcw,
  BookOpen,
  Calendar,
  Layers,
  HeartHandshake
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LanguageCode } from "../lib/translations";

interface VirtualCounselorProps {
  currentLang: LanguageCode;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  options?: { label: string; action: string }[];
}

interface CounselorConfig {
  counselorName: string;
  avatarUrl: string;
  welcomeText: string;
  inputPlaceholder: string;
  botTypingText: string;
  options: { label: string; action: string }[];
  responses: Record<string, {
    text: string;
    options?: { label: string; action: string }[];
  }>;
  keywords: {
    keys: string[];
    reply: string;
    options?: { label: string; action: string }[];
  }[];
}

export default function VirtualCounselor({ currentLang }: VirtualCounselorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true); // Pulse badge on start
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Multilingual Configuration for the Virtual Counselor Flow
  const counselorData: Record<LanguageCode, CounselorConfig> = {
    ID: {
      counselorName: "Kak Jaka",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      welcomeText: "Halo Calon Mahasiswa APJ! 👋 Saya Kak Jaka, Konselor Virtual Anda. Saya siap membantu menjawab pertanyaan Anda seputar program studi D3, jalur pendaftaran, rincian biaya kuliah, beasiswa, hingga prospek karir pariwisata. Silakan pilih topik di bawah ini atau ketik pertanyaan Anda langsung!",
      inputPlaceholder: "Tanyakan sesuatu...",
      botTypingText: "Kak Jaka sedang mengetik...",
      options: [
        { label: "🎓 Program Studi D3", action: "prodi" },
        { label: "📝 Syarat & Jalur Daftar", action: "syarat" },
        { label: "💰 Biaya Kuliah & Cicilan", action: "biaya" },
        { label: "🌟 Program Beasiswa", action: "beasiswa" },
        { label: "📞 Hubungi Staf Penerimaan", action: "hubungi" }
      ],
      responses: {
        prodi: {
          text: "Akademi Pariwisata Jakarta (APJ) menyelenggarakan 2 program studi Vokasi (D3) Unggulan yang terakreditasi 'Baik Sekali':\n\n1. **D3 Perhotelan**: Fokus pada keahlian Room Division, Food & Beverage Service, Culinary Arts (Seni Kuliner), Pastry, serta Mixology & Barista.\n2. **D3 Usaha Perjalanan Wisata (UPW)**: Fokus pada manajemen MICE, Travel Ticketing, e-Tourism, Tour Guiding, Cargo, serta Tour & Travel Entrepreneurship.\n\nKedua program memiliki kurikulum 70% praktik langsung dan 30% teori dengan jaminan penempatan magang internasional!",
          options: [
            { label: "Syarat Pendaftaran", action: "syarat" },
            { label: "Estimasi Biaya", action: "biaya" },
            { label: "Kembali ke Menu Utama", action: "menu" }
          ]
        },
        syarat: {
          text: "Pendaftaran Mahasiswa Baru APJ sangat mudah! Jalur pendaftaran meliputi:\n\n• **Jalur Reguler**: Menggunakan nilai rapor semester 1-5 atau tes tertulis.\n• **Jalur Prestasi**: Bebas tes bagi Anda yang memiliki prestasi akademik, olahraga, seni, atau pariwisata.\n\n**Syarat Administrasi**:\n1. Mengisi formulir online\n2. Fotokopi Ijazah / SKL (1 lembar)\n3. Fotokopi Kartu Keluarga & KTP\n4. Pasfoto 3x4 (2 lembar)\n5. Surat Keterangan Sehat & Bebas Buta Warna (khusus Perhotelan).",
          options: [
            { label: "Daftar Online Sekarang", action: "daftar_now" },
            { label: "Tanya Biaya Kuliah", action: "biaya" },
            { label: "Kembali ke Menu Utama", action: "menu" }
          ]
        },
        biaya: {
          text: "Kami berkomitmen menghadirkan pendidikan pariwisata berkualitas dengan biaya terjangkau. Biaya Kuliah APJ dapat **diangsur bulanan** agar meringankan beban orang tua:\n\n• **Uang Pangkal / Pendaftaran**: Mulai dari Rp 1.500.000 (dapat dicicil).\n• **SPP per Semester**: Rata-rata Rp 4.500.000 - Rp 5.500.000 sudah termasuk seragam lengkap pariwisata, bahan praktik di dapur komersial/bar, asuransi, serta modul perkuliahan.\n\nTidak ada biaya tersembunyi untuk ujian maupun sertifikasi praktik!",
          options: [
            { label: "Informasi Beasiswa", action: "beasiswa" },
            { label: "Hubungi Humas (WA)", action: "hubungi" },
            { label: "Kembali ke Menu Utama", action: "menu" }
          ]
        },
        beasiswa: {
          text: "Tentu, APJ menyediakan berbagai program beasiswa menarik untuk meringankan biaya pendidikan Anda:\n\n1. **Beasiswa KIP Kuliah**: Beasiswa penuh dari Kemendikbudristek RI untuk calon mahasiswa dari keluarga kurang mampu yang berprestasi.\n2. **Beasiswa Yayasan Pendidikan Jayakarta**: Potongan uang pangkal hingga 50% bagi pendaftar gelombang pertama.\n3. **Beasiswa Prestasi Akademik/Non-Akademik**: Potongan khusus bagi juara kelas atau pemenang kompetisi olahraga/seni.",
          options: [
            { label: "Syarat Pendaftaran", action: "syarat" },
            { label: "Kembali ke Menu Utama", action: "menu" }
          ]
        },
        hubungi: {
          text: "Anda ingin berdiskusi langsung dengan tim Penerimaan Mahasiswa Baru? Kami siap melayani!\n\n• **WhatsApp Hotline**: +62 861-3388-1234 (Senin - Sabtu, 08.00 - 17.00 WIB)\n• **Telepon Kantor**: (021) 8613388 / 8623344\n• **Email**: pmb@apj.ac.id\n\nAtau kunjungi Kampus Utama kami langsung di Gedung Yayasan Pendidikan Jayakarta, Cempaka Putih Tengah, Jakarta Pusat untuk tur fasilitas laboratorium pariwisata secara gratis!",
          options: [
            { label: "Kembali ke Menu Utama", action: "menu" }
          ]
        },
        daftar_now: {
          text: "Bagus sekali! Langkah Pendaftaran Online:\n1. Buka menu Penerimaan (PMB) di website ini, pilih tab 'Pendaftaran Online'.\n2. Isi formulir pendaftaran dengan data diri lengkap.\n3. Tim Admisi kami akan menghubungi Anda dalam waktu 1x24 jam melalui WhatsApp untuk verifikasi berkas dan jadwal wawancara santai.",
          options: [
            { label: "Hubungi Staf Humas", action: "hubungi" },
            { label: "Kembali ke Menu Utama", action: "menu" }
          ]
        }
      },
      keywords: [
        { keys: ["biaya", "spp", "bayar", "mahal", "angsur", "cicil", "harga"], reply: "Terkait biaya kuliah di APJ sangat fleksibel dan dapat diangsur setiap bulannya. SPP semesteran rata-rata berkisar Rp 4.500.000 hingga Rp 5.500.000 sudah termasuk seragam, alat, serta bahan praktikum komersial dapur dan bar.", options: [{ label: "Detail Biaya", action: "biaya" }] },
        { keys: ["daftar", "registrasi", "masuk", "gabung", "formulir", "pendaftaran"], reply: "Pendaftaran dapat dilakukan secara online melalui portal website kami di tab PMB > Pendaftaran Online, atau langsung menghubungi Staf Humas kami untuk panduan instan.", options: [{ label: "Cara Daftar", action: "daftar_now" }] },
        { keys: ["beasiswa", "kip", "gratis", "bantuan", "prestasi"], reply: "Kami menyediakan Beasiswa KIP Kuliah dari Pemerintah serta beasiswa internal Yayasan Jayakarta berupa potongan biaya pangkal hingga 50% untuk pendaftar gelombang awal.", options: [{ label: "Detail Beasiswa", action: "beasiswa" }] },
        { keys: ["prodi", "jurusan", "kuliah", "hotel", "wisata", "upw"], reply: "APJ menyediakan 2 program studi D3 unggulan: D3 Perhotelan (akreditasi Baik Sekali) dan D3 Usaha Perjalanan Wisata (akreditasi Baik Sekali) dengan porsi 70% praktikum vokasi nyata.", options: [{ label: "Detail Prodi", action: "prodi" }] },
        { keys: ["kontak", "whatsapp", "wa", "telepon", "lokasi", "alamat"], reply: "Layanan Admisi kami aktif via WhatsApp +62 861-3388-1234 atau di Kampus Cempaka Putih Tengah, Jakarta Pusat.", options: [{ label: "Kontak Staf", action: "hubungi" }] }
      ]
    },
    EN: {
      counselorName: "Ms. Tari",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      welcomeText: "Hello Future APJ Student! 👋 I'm Ms. Tari, your Virtual Counselor. I am here to help answer all your inquiries regarding our D3 vocational majors, enrollment requirements, tuition fees, installment plans, and global career opportunities. Choose an option below or type your question!",
      inputPlaceholder: "Ask something...",
      botTypingText: "Ms. Tari is typing...",
      options: [
        { label: "🎓 D3 Study Programs", action: "prodi" },
        { label: "📝 Admission Requirements", action: "syarat" },
        { label: "💰 Tuition & Installments", action: "biaya" },
        { label: "🌟 Scholarship Programs", action: "beasiswa" },
        { label: "📞 Contact Admission Office", action: "hubungi" }
      ],
      responses: {
        prodi: {
          text: "Jakarta Tourism Academy (APJ) hosts 2 elite Vocational (D3) Study Programs with official 'Excellent' accreditation:\n\n1. **D3 Hotel Management**: Focuses on Room Division, Food & Beverage Services, Culinary Arts, Pastry, and Mixology/Barista skills.\n2. **D3 Travel & Tourism Business (UPW)**: Highlights MICE management, flight booking (GDS), digital travel, and tourism entrepreneurship.\n\nBoth paths offer 70% practical hand-on training and guaranteed international industry placements!",
          options: [
            { label: "Requirements", action: "syarat" },
            { label: "Tuition Details", action: "biaya" },
            { label: "Back to Main Menu", action: "menu" }
          ]
        },
        syarat: {
          text: "Enrolling at APJ is simple and straightforward! Admission paths include:\n\n• **Regular Pathway**: Evaluated based on high school grades (Semester 1-5) or a friendly academic test.\n• **Achievement Pathway**: Test exemption for candidates with proven academic, athletic, artistic, or hospitality accolades.\n\n**Required Documents**:\n1. Completed Online Application\n2. Photocopy of High School Diploma / Certificate\n3. ID Card & Family Registration (KK) photocopy\n4. Two recent 3x4 passport-style photos\n5. Health certificate.",
          options: [
            { label: "Register Online Now", action: "daftar_now" },
            { label: "Tuition Details", action: "biaya" },
            { label: "Back to Main Menu", action: "menu" }
          ]
        },
        biaya: {
          text: "We are committed to providing premium tourism education at affordable rates. Parents can choose to pay the tuition fees in **monthly interest-free installments**:\n\n• **Initial Enrollment/Admission fee**: Starts at Rp 1,500,000 (splittable).\n• **Tuition fee per Semester**: Around Rp 4,500,000 - Rp 5,500,000. This is fully inclusive of uniform sets, practical cooking/mixology ingredients, insurance, and academic modules.\n\nNo hidden charges for examinations or practical evaluations!",
          options: [
            { label: "Scholarships", action: "beasiswa" },
            { label: "Contact Us (WhatsApp)", action: "hubungi" },
            { label: "Back to Main Menu", action: "menu" }
          ]
        },
        beasiswa: {
          text: "Yes, APJ offers several scholarship options to support talented individuals:\n\n1. **KIP-Kuliah**: Government-funded full scholarships covering both tuition and monthly living allowances for eligible students.\n2. **Jayakarta Foundation Scholarship**: Up to 50% discount on initial admission fees for early-bird registrants.\n3. **Merit-based Discount**: Special tuition discounts for class valedictorians, sports champions, or art competition winners.",
          options: [
            { label: "Check Requirements", action: "syarat" },
            { label: "Back to Main Menu", action: "menu" }
          ]
        },
        hubungi: {
          text: "Need to speak with a human counselor? We are here to help!\n\n• **WhatsApp Hotline**: +62 861-3388-1234 (Mon - Sat, 08:00 - 17:00 WIB)\n• **Office Phone**: (021) 8613388\n• **Email**: pmb@apj.ac.id\n\nYou are also welcome to visit our Campus at Cempaka Putih Tengah, Central Jakarta for a complimentary guided tour of our kitchen and mock hotel labs!",
          options: [
            { label: "Back to Main Menu", action: "menu" }
          ]
        },
        daftar_now: {
          text: "Excellent choice! To register online:\n1. Go to the Admissions (PMB) menu on this website and open the 'Online Registration' tab.\n2. Complete the simple registration form with your information.\n3. Our admissions counselor will contact you within 24 hours via WhatsApp to verify your credentials.",
          options: [
            { label: "Contact Staff", action: "hubungi" },
            { label: "Back to Main Menu", action: "menu" }
          ]
        }
      },
      keywords: [
        { keys: ["tuition", "cost", "fee", "price", "installment", "pay", "expensive"], reply: "Tuition is affordable and can be paid in flexible monthly installments. The average semester fee ranges from Rp 4,500,000 to Rp 5,500,000, inclusive of uniform, practice ingredients, and module books.", options: [{ label: "Tuition Info", action: "biaya" }] },
        { keys: ["register", "join", "enroll", "apply", "form", "admission"], reply: "You can apply easily on our website under Admissions > Online Registration, or message our WhatsApp team for step-by-step assistance.", options: [{ label: "How to Apply", action: "daftar_now" }] },
        { keys: ["scholarship", "scholarships", "kip", "free", "discount"], reply: "We support KIP-Kuliah government full funding as well as early-bird institutional discounts of up to 50% on initial registration.", options: [{ label: "Scholarship Info", action: "beasiswa" }] },
        { keys: ["major", "majors", "program", "hotel", "tourism", "curriculum"], reply: "APJ offers 2 main accredited D3 programs: Hotel Management and Travel/Tourism Business, with heavy 70% vocational practical training.", options: [{ label: "Majors Info", action: "prodi" }] },
        { keys: ["contact", "whatsapp", "phone", "address", "location"], reply: "Contact us anytime on WhatsApp at +62 861-3388-1234 or visit our Central Jakarta main campus.", options: [{ label: "Get Contacts", action: "hubungi" }] }
      ]
    },
    // The following languages inherit content simplified or carefully translated
    JPN: {
      counselorName: "タリ先生",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      welcomeText: "ジャカルタ観光アカデミー(APJ)のバーチャル相談室へようこそ！🌸 私はタリ先生です。出願、プログラム、学費、奨学金、海外インターンシップなどのご質問にお答えします。",
      inputPlaceholder: "質問を入力してください...",
      botTypingText: "タリ先生が入力中...",
      options: [
        { label: "🎓 D3学科紹介 (ホテル/観光)", action: "prodi" },
        { label: "📝 出願要件・方法", action: "syarat" },
        { label: "💰 学費・分割払い", action: "biaya" },
        { label: "🌟 奨学金制度", action: "beasiswa" },
        { label: "📞 事務局へ問い合わせ", action: "hubungi" }
      ],
      responses: {
        prodi: {
          text: "APJでは、最高レベル評価のD3国家認定学位プログラムを2つ開講しています：\n\n1. **ホテル・マネジメント科**: 宿泊実務、F&B、西洋・インドネシア料理調理、バーテンダー・バリスタ実習。\n2. **旅行・観光ビジネス科**: MICE（会議・イベント）、航空予約システム発券、国際ツアーガイド。\n\n実践トレーニングがカリキュラムの70%を占め、日本などの海外インターンシップも提携しています！",
          options: [{ label: "メニューに戻る", action: "menu" }]
        },
        syarat: {
          text: "留学生および一般の出願は、オンラインフォームの提出と面接で行われます。成績や語学力に応じた優遇制度もございます。",
          options: [{ label: "メニューに戻る", action: "menu" }]
        },
        biaya: {
          text: "学費は月々の分割払いに対応しています。1学期あたりの授業料目安は約450万〜550万ルピアで、制服、製菓・調理実習用食材、テキスト代が含まれます。",
          options: [{ label: "メニューに戻る", action: "menu" }]
        },
        beasiswa: {
          text: "入学金が最大50%減免される早期割引や、学術・スポーツ優秀者向けの奨学金を用意しています。",
          options: [{ label: "メニューに戻る", action: "menu" }]
        },
        hubungi: {
          text: "お気軽にオフィスまでお電話、または公式WhatsApp(+62 861-3388-1234)にて日本語/英語でお問い合わせください。メール: pmb@apj.ac.id",
          options: [{ label: "メニューに戻る", action: "menu" }]
        }
      },
      keywords: []
    },
    Mandarin: {
      counselorName: "林老师",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      welcomeText: "您好，欢迎咨询雅加达旅游学院 (APJ)！我是林老师。我很乐意协助您了解我们的特色大专课程、入学标准、奖学金优惠及就业推荐。请在下方选择主题：",
      inputPlaceholder: "请输入您的疑问...",
      botTypingText: "林老师正在输入中...",
      options: [
        { label: "🎓 D3 大专学科设置", action: "prodi" },
        { label: "📝 申请通道与所需材料", action: "syarat" },
        { label: "💰 学费标准与月付分期", action: "biaya" },
        { label: "🌟 奖学金资助政策", action: "beasiswa" },
        { label: "📞 招生办直线联系", action: "hubungi" }
      ],
      responses: {
        prodi: {
          text: "雅加达旅游学院 (APJ) 设有两项获评优等认证的专业：\n\n1. **D3 酒店管理学**: 包含客房、前厅系统、中西式烹饪技能、咖啡拉花与调酒实训。\n2. **D3 旅游管理与会展**: 会议展览策划、GDS 国际民航出票实务、带团外语导游。\n\n70% 纯实操授课，保障赴日本、迪拜或本土高星级酒店的带薪实习！",
          options: [{ label: "返回主菜单", action: "menu" }]
        },
        syarat: {
          text: "在线申请步骤：\n1. 在网页上提交报名表。\n2. 递交高中毕业证书复印件、身份证复印件及彩色证件照。\n3. 通过轻松的线上或线下常规面试即可录取。",
          options: [{ label: "返回主菜单", action: "menu" }]
        },
        biaya: {
          text: "我们实行普惠性优质职业教育，学费可按月无息分期支付。每学期学费约 450万 - 550万 印尼盾，已全面包含全套职业西装 uniform、厨房大理石操作材料及教科书，无二次隐藏消费。",
          options: [{ label: "返回主菜单", action: "menu" }]
        },
        beasiswa: {
          text: "提供印尼高教部 KIP-Kuliah 全额奖学金，并针对首批报名的同学，由杰雅卡达基金会赞助直接减免 50% 注册建校费。",
          options: [{ label: "返回主菜单", action: "menu" }]
        },
        hubungi: {
          text: "招生咨询室：\n• 电话: (021) 8613388\n• 微信/WhatsApp: +62 861-3388-1234\n• 地址: 雅加达中部 Cempaka Putih Tengah 8号。欢迎预约实地考察！",
          options: [{ label: "返回主菜单", action: "menu" }]
        }
      },
      keywords: []
    },
    Arab: {
      counselorName: "أستاذة تاري",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      welcomeText: "مرحباً بك في أكاديمية جاكرتا للسياحة! 🌟 أنا الأستاذة تاري، مستشارتك الافتراضية. يسعدني مساعدتك في الإجابة على استفساراتك حول برامج الدبلوم، الرسوم الدراسية، والمنح المتاحة.",
      inputPlaceholder: "اكتب سؤالك هنا...",
      botTypingText: "الأستاذة تاري تكتب الآن...",
      options: [
        { label: "🎓 برامج دبلوم السياحة والفنادق", action: "prodi" },
        { label: "📝 شروط وطريقة القبول", action: "syarat" },
        { label: "💰 الرسوم وخيارات التقسيط", action: "biaya" },
        { label: "🌟 المنح الدراسية المتاحة", action: "beasiswa" },
        { label: "📞 التواصل المباشر مع الإدارة", action: "hubungi" }
      ],
      responses: {
        prodi: {
          text: "نقدم في أكاديمية APJ تخصصين مميزين في دبلوم السياحة والضيافة بتركيز 70% على التدريب العملي والتطبيقي:\n\n1. **إدارة الفنادق**: يشمل الاستقبال والمكاتب الأمامية، وفنون الطهي، وإعداد المشروبات الفاخرة.\n2. **السياحة والفعاليات (MICE)**: تنظيم المؤتمرات، وحجز الطيران GDS، وإدارة الرحلات.\n\nنوفر فرص تدريب مميزة في كبرى فنادق 5 نجوم.",
          options: [{ label: "العودة للقائمة", action: "menu" }]
        },
        syarat: {
          text: "التقديم بسيط للغاية عبر نموذج موقعنا الإلكتروني، متبوعاً بإرفاق شهادة الثانوية العامة وصورة الهوية الشخصية ومقابلة ودية قصيرة.",
          options: [{ label: "العودة للقائمة", action: "menu" }]
        },
        biaya: {
          text: "رسوم الدراسة ميسرة للغاية ويمكن تقسيطها شهرياً تيسيراً على أولياء الأمور. تتراوح الرسوم بين 4.5 إلى 5.5 مليون روبية في الفصل، شاملة الزي الرسمي والكتب والمواد العملية.",
          options: [{ label: "العودة للقائمة", action: "menu" }]
        },
        beasiswa: {
          text: "نوفر منحاً دراسية متميزة بالتعاون مع مؤسسة جاياكارتا تشمل خصومات تصل إلى 50% على الدفعات الأولى للمبادرين بالتسجيل.",
          options: [{ label: "العودة للقائمة", action: "menu" }]
        },
        hubungi: {
          text: "يمكنكم الاتصال مباشرة بقسم القبول عبر واتساب: +62 861-3388-1234 أو البريد الإلكتروني: pmb@apj.ac.id",
          options: [{ label: "العودة للقائمة", action: "menu" }]
        }
      },
      keywords: []
    },
    Jerman: {
      counselorName: "Frau Tari",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      welcomeText: "Herzlich willkommen bei der APJ Tourismus-Akademie! 🥨 Ich bin Frau Tari. Gerne beantworte ich Ihre Fragen zu unseren D3-Studiengängen, Zulassungsvoraussetzungen, Ratenzahlungen und Stipendien.",
      inputPlaceholder: "Schreiben Sie eine Nachricht...",
      botTypingText: "Frau Tari schreibt...",
      options: [
        { label: "🎓 D3-Studiengänge (Hotellerie/Tourismus)", action: "prodi" },
        { label: "📝 Zulassung & Bewerbung", action: "syarat" },
        { label: "💰 Studiengebühren & Raten", action: "biaya" },
        { label: "🌟 Stipendienprogramme", action: "beasiswa" },
        { label: "📞 Studienberatung kontaktieren", action: "hubungi" }
      ],
      responses: {
        prodi: {
          text: "Die APJ bietet 2 anerkannte Berufsstudiengänge (D3) mit exzellenter Ausstattung:\n\n1. **Hotelmanagement**: Fokus auf Zimmerservice, Gastronomie, Küchenkunst (Culinary Arts) und Barista-Schulung.\n2. **Tourismus & Eventmanagement (UPW)**: Fokus auf MICE-Events, GDS-Flugbuchungssysteme und Reiseleiterpraxis.\n\nWir bieten 70% Praxisanteil und garantierte Auslandspraktika!",
          options: [{ label: "Zurück zum Hauptmenü", action: "menu" }]
        },
        syarat: {
          text: "Für eine Bewerbung füllen Sie einfach unser Online-Formular aus und laden Sie Ihr Zeugnis sowie Ihren Lichtbildausweis hoch. Es folgt ein kurzes Orientierungsgespräch.",
          options: [{ label: "Zurück zum Hauptmenü", action: "menu" }]
        },
        biaya: {
          text: "Die Kosten belaufen sich auf ca. Rp 4.500.000 bis Rp 5.500.000 pro Semester und können bequem in zinslosen Monatsraten bezahlt werden. Inklusive Uniformen und Lehrmaterial.",
          options: [{ label: "Zurück zum Hauptmenü", action: "menu" }]
        },
        beasiswa: {
          text: "Für Frühbucher gewährt die Jayakarta-Stiftung bis zu 50% Rabatt auf die Anmeldegebühr. Zudem unterstützen wir staatliche Förderungen.",
          options: [{ label: "Zurück zum Hauptmenü", action: "menu" }]
        },
        hubungi: {
          text: "Kontaktieren Sie unsere Admision-Abteilung per WhatsApp unter +62 861-3388-1234 oder per E-Mail an pmb@apj.ac.id.",
          options: [{ label: "Zurück zum Hauptmenü", action: "menu" }]
        }
      },
      keywords: []
    },
    Turki: {
      counselorName: "Tari Öğretmen",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      welcomeText: "Merhaba sevgili öğrenci adayı! 👋 Ben Tari Öğretmen. Cakarta Turizm Akademisi (APJ) hakkında sormak istediğiniz bölümler, kayıt süreci, taksit imkanları ve burslar hakkında size yardımcı olmaktan mutluluk duyarım.",
      inputPlaceholder: "Sorunuzu yazın...",
      botTypingText: "Tari Öğretmen yazıyor...",
      options: [
        { label: "🎓 D3 Turizm ve Otelcilik Bölümleri", action: "prodi" },
        { label: "📝 Kayıt Şartları & Evraklar", action: "syarat" },
        { label: "💰 Eğitim Ücretleri & Taksitler", action: "biaya" },
        { label: "🌟 Burs Seçenekleri", action: "beasiswa" },
        { label: "📞 İletişim & Danışmanlık", action: "hubungi" }
      ],
      responses: {
        prodi: {
          text: "APJ, 2 adet yüksek kaliteli 3 yıllık meslek yüksekokulu (D3) programı sunmaktadır:\n\n1. **Otel Yönetimi**: Odalar yönetimi, Mutfak Sanatları, Barista ve yiyecek-içecek servisi eğitimi.\n2. **Seyahat ve Turizm İşletmeciliği (UPW)**: MICE etkinlik organizasyonu, GDS biletleme platformu eğitimi ve tur rehberliği.\n\nMüfredatımızın %70'i pratik uygulamalardan oluşmaktadır.",
          options: [{ label: "Ana Menüye Dön", action: "menu" }]
        },
        syarat: {
          text: "Kayıt için online başvuru formunu doldurmanız, lise diplomanızın fotokopisini ve kimlik belgenizi yüklemeniz yeterlidir.",
          options: [{ label: "Ana Menüye Dön", action: "menu" }]
        },
        biaya: {
          text: "Velilerimize kolaylık sağlamak amacıyla eğitim harçları aylık taksitlerle ödenebilir. Dönemlik ücret yaklaşık 4.5-5.5 milyon Rupiah olup üniforma ve uygulama malzemelerini kapsar.",
          options: [{ label: "Ana Menüye Dön", action: "menu" }]
        },
        beasiswa: {
          text: "Erken kayıt döneminde Jayakarta Vakfı tarafından kayıt ücretinde %50'ye varan burs indirimi uygulanmaktadır.",
          options: [{ label: "Ana Menüye Dön", action: "menu" }]
        },
        hubungi: {
          text: "Bize resmi WhatsApp hattımızdan (+62 861-3388-1234) veya pmb@apj.ac.id e-posta adresinden ulaşabilirsiniz.",
          options: [{ label: "Ana Menüye Dön", action: "menu" }]
        }
      },
      keywords: []
    },
    Korea: {
      counselorName: "타리 쌤",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      welcomeText: "안녕하세요! 자카르타 관광아카데미(APJ) 입학 전용 챗봇입니다. 🎓 저는 타리 쌤이고, 여러분의 원서 접수, 학과 선택, 등록금 분할 납부, 장학 혜택 및 취업 진로 상담을 기꺼이 도와드릴게요.",
      inputPlaceholder: "메시지를 입력하세요...",
      botTypingText: "타리 쌤이 답변을 준비하고 있습니다...",
      options: [
        { label: "🎓 D3 호텔/관광 경영학과 소개", action: "prodi" },
        { label: "📝 입학 자격요건 및 전형 안내", action: "syarat" },
        { label: "💰 학비 분할 납부 혜택", action: "biaya" },
        { label: "🌟 맞춤형 장학제도 안내", action: "beasiswa" },
        { label: "📞 한국어/영어 상담처 연락망", action: "hubungi" }
      ],
      responses: {
        prodi: {
          text: "자카르타 관광아카데미(APJ)는 우수 교육 인증(Baik Sekali)을 받은 2개의 전문 전문과정을 집중 운영합니다:\n\n1. **D3 호텔 경영학과**: 객실 운영 실무, 파티시에, 정통 동서양 조리, 에스프레소 추출 바리스타 자격증 연계.\n2. **D3 관광 비즈니스학과 (UPW)**: 글로벌 항공권 예약 발권(GDS), 국제 컨벤션 MICE 기획, 에이전시 경영.\n\n70%의 실무 지향 커리큘럼으로 신속한 취업을 지향합니다.",
          options: [{ label: "처음 메뉴로 돌아가기", action: "menu" }]
        },
        syarat: {
          text: "원서 제출 방법:\n1. 본 사이트의 온라인 지원서 작성을 마칩니다.\n2. 고등학교 성적 증명서 혹은 졸업 예정 증명서 사본을 제출합니다.\n3. 편안한 면접 시험을 거쳐 즉시 수시 선발 입학이 확정됩니다.",
          options: [{ label: "처음 메뉴로 돌아가기", action: "menu" }]
        },
        biaya: {
          text: "학부모님의 학비 경감을 위해 무이자 매월 분할 납부가 가능합니다. 학기당 약 450만 ~ 550만 루피아 수준이며 정장 유니폼 세트, 주방 식자재 원료비, 교재비 등이 일절 포함되어 있어 추가비가 전혀 없습니다.",
          options: [{ label: "처음 메뉴로 돌아가기", action: "menu" }]
        },
        beasiswa: {
          text: "조기 입학생 대상 50% 입학금 특별 감면 장학 혜택 및 성적 우수 인재 수석 장학 제도를 운영 중입니다.",
          options: [{ label: "처음 메뉴로 돌아가기", action: "menu" }]
        },
        hubungi: {
          text: "상담 지원처 연락처:\n• 카카오톡/WhatsApp: +62 861-3388-1234\n• 이메일: pmb@apj.ac.id\n• 근무 시간: 월~토 오전 8시 ~ 오후 5시",
          options: [{ label: "처음 메뉴로 돌아가기", action: "menu" }]
        }
      },
      keywords: []
    }
  };

  const currentConfig = counselorData[currentLang] || counselorData["ID"];

  // Initialize bot with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome-msg",
        sender: "bot",
        text: currentConfig.welcomeText,
        timestamp: new Date(),
        options: currentConfig.options
      }
    ]);
  }, [currentLang]);

  // Scroll to bottom whenever messages list grows or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string, actionKey?: string) => {
    if (!text.trim() && !actionKey) return;

    // 1. Add user message
    const userMsgText = actionKey ? currentConfig.options.find(o => o.action === actionKey)?.label || text : text;
    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: userMsgText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // 2. Simulate Natural Typing Delay
    setTimeout(() => {
      let replyText = "";
      let replyOptions = currentConfig.options;

      // Handle predefined action tree
      const act = actionKey || "";
      if (act === "menu" || text.toLowerCase() === "menu") {
        replyText = currentConfig.welcomeText;
        replyOptions = currentConfig.options;
      } else if (currentConfig.responses[act]) {
        replyText = currentConfig.responses[act].text;
        replyOptions = currentConfig.responses[act].options || currentConfig.options;
      } else {
        // Evaluate custom message against keywords (Fallbacks search ID/EN keywords)
        const q = text.toLowerCase();
        let matched = false;

        // Try to match keywords in config
        const searchKeywords = currentConfig.keywords.length > 0 ? currentConfig.keywords : counselorData["ID"].keywords;
        
        for (const kw of searchKeywords) {
          if (kw.keys.some(key => q.includes(key))) {
            replyText = kw.reply;
            replyOptions = kw.options || currentConfig.options;
            matched = true;
            break;
          }
        }

        if (!matched) {
          // General AI Counselor response fallback
          if (currentLang === "ID") {
            replyText = `Terima kasih atas pertanyaannya! Mengenai "${text}", Kak Jaka menyarankan Anda untuk berkonsultasi langsung dengan Humas via WhatsApp agar memperoleh informasi paling ter-update dan brosur PDF terbaru.`;
            replyOptions = [
              { label: "Hubungi Humas (WhatsApp)", action: "hubungi" },
              { label: "Kembali ke Menu Utama", action: "menu" }
            ];
          } else {
            replyText = `Thank you for asking! Regarding "${text}", I highly suggest contacting our admissions team directly on WhatsApp to receive our official catalog and updated details.`;
            replyOptions = [
              { label: "Contact Staff (WhatsApp)", action: "hubungi" },
              { label: "Back to Main Menu", action: "menu" }
            ];
          }
        }
      }

      const botMsgId = `bot-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          sender: "bot",
          text: replyText,
          timestamp: new Date(),
          options: replyOptions
        }
      ]);
      setIsTyping(false);
    }, 1100);
  };

  const resetConversation = () => {
    setMessages([
      {
        id: "welcome-msg",
        sender: "bot",
        text: currentConfig.welcomeText,
        timestamp: new Date(),
        options: currentConfig.options
      }
    ]);
  };

  const handleOpenWidget = () => {
    setIsOpen(true);
    setHasNewMessage(false); // Read
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="virtual-counselor-widget">
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="counselor-fab-button"
            onClick={handleOpenWidget}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-primary hover:bg-opacity-95 text-white shadow-2xl p-4 rounded-full border-2 border-[#FFC46A] cursor-pointer group"
          >
            {/* Pulsating New Message Badge */}
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">1</span>
              </span>
            )}
            <MessageSquare size={24} className="text-[#FFC46A]" />
            <span className="text-xs font-bold font-sans tracking-wide pr-1 max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 whitespace-nowrap">
              {currentLang === "ID" ? "Konselor Virtual" : "Virtual Counselor"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Interface Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="counselor-chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-3xl flex flex-col overflow-hidden border border-neutral-100 mb-2"
          >
            {/* Header Area */}
            <div className="bg-primary text-white px-4 py-3.5 flex items-center justify-between border-b-2 border-[#FFC46A] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={currentConfig.avatarUrl} 
                    alt={currentConfig.counselorName} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#FFC46A] bg-neutral-200"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-wide">{currentConfig.counselorName}</span>
                    <Sparkles size={12} className="text-[#FFC46A] animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Bot size={11} className="text-[#FFC46A]" />
                    <span className="text-[10px] text-neutral-300 font-semibold uppercase tracking-wider">
                      {currentLang === "ID" ? "Admisi APJ" : "APJ Admissions"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={resetConversation}
                  title="Reset Conversation"
                  className="p-1.5 hover:bg-[#003c73] rounded-lg text-neutral-300 hover:text-[#FFC46A] transition cursor-pointer"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-[#003c73] rounded-lg text-neutral-300 hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat History & Dialogue Balloon Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-neutral-50/50" id="chat-messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1.5">
                  <div className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Mini Profile Photo / Logo */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                      msg.sender === "user" 
                        ? "bg-[#002f5a] text-white border-[#FFC46A]" 
                        : "bg-white text-primary border-neutral-200"
                    }`}>
                      {msg.sender === "user" ? <User size={13} /> : <Bot size={13} className="text-[#FFC46A]" />}
                    </div>

                    {/* Balloon Text */}
                    <div className={`max-w-[78%] rounded-2xl p-3 text-[12px] leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white text-neutral-800 border border-neutral-100 rounded-tl-none whitespace-pre-wrap"
                    }`}>
                      {msg.text}
                    </div>
                  </div>

                  {/* Message Option Buttons / Quick Tree */}
                  {msg.sender === "bot" && msg.options && msg.options.length > 0 && (
                    <div className="pl-9 flex flex-wrap gap-1.5 pt-1">
                      {msg.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleSendMessage(opt.label, opt.action)}
                          className="bg-white hover:bg-[#FFC46A] hover:text-[#002f5a] border border-neutral-200 text-neutral-700 font-bold px-3 py-1.5 rounded-full text-[10.5px] transition duration-200 cursor-pointer shadow-sm flex items-center gap-1 active:scale-95"
                        >
                          {opt.label}
                          <ChevronRight size={10} className="opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Simulated Typist Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white text-primary border border-neutral-200 flex items-center justify-center">
                    <Bot size={13} className="text-[#FFC46A]" />
                  </div>
                  <div className="bg-white border border-neutral-100 rounded-2xl rounded-tl-none px-3 py-2 text-xs text-neutral-400 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                    <span className="text-[10px] font-semibold italic">{currentConfig.botTypingText}</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Submission Area */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
              className="p-3 bg-white border-t border-neutral-100 flex gap-2 shrink-0 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentConfig.inputPlaceholder}
                className="flex-grow bg-neutral-50 border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-[12px] outline-none transition"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary hover:bg-[#002547] text-white p-2.5 rounded-xl transition duration-200 cursor-pointer shadow-md disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
