import React, { useState, useRef, useEffect } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldAlert, ChevronDown, Check, Sparkles } from "lucide-react";
import { FAQ_DATA, getLocalChatbotResponse } from "../data/apjData";
import { submitContactMessage } from "../lib/dbService";
import { LanguageCode, createTranslator } from "../lib/translations";

interface KontakViewProps {
  currentLang?: LanguageCode;
}

export default function KontakView({ currentLang = "ID" }: KontakViewProps) {
  const t = createTranslator(currentLang);
  // Contact Form States
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // FAQ states
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Chatbot states
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    {
      sender: "bot",
      text: "Halo! Selamat datang di Layanan Konselor Virtual Akademi Pariwisata Jakarta (APJ). Saya siap membantu memberikan informasi tentang Pendaftaran PMB, Kurikulum D3 Perhotelan, D3 Usaha Perjalanan Wisata, Biaya Kuliah, Program Magang, atau Alamat Kampus. Silakan ajukan pertanyaan Anda!",
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat bubbles
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const [msgSubmitting, setMsgSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;
    setMsgSubmitting(true);
    try {
      await submitContactMessage(formName, formEmail, formMsg);
      setFormSuccess(true);
      setTimeout(() => {
        setFormName("");
        setFormEmail("");
        setFormMsg("");
        setFormSuccess(false);
      }, 4000);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirimkan pesan. Silakan coba sesaat lagi.");
    } finally {
      setMsgSubmitting(false);
    }
  };


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    const timeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    
    // Add User Bubble
    setMessages((prev) => [...prev, { sender: "user", text: userText, time: timeStr }]);
    setUserInput("");
    setIsTyping(true);

    // Simulate AI thinking typing loop
    setTimeout(async () => {
      let responseText = "";

      // Try server-side API fetch first, fallback to robust local knowledge response
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userText })
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.text) {
            responseText = data.text;
          }
        }
      } catch (err) {
        // Safe silent swallow - server route not deployed/active, fallback takes over
      }

      if (!responseText) {
        responseText = getLocalChatbotResponse(userText);
      }

      setMessages((prev) => [...prev, { sender: "bot", text: responseText, time: timeStr }]);
      setIsTyping(false);
    }, 1200);
  };

  const titlesDict: Record<LanguageCode, Record<string, string>> = {
    ID: {
      tag: "FAQ, LOKASI & KONSELOR AI",
      title: "Hubungi Kami & Layanan Konseling Virtual",
      desc: "Temukan lokasi kami di Cempaka Putih, hubungi panitia pmb, ajukan pertanyaan umum faq, atau ajukan percakapan ke Konselor AI APJ."
    },
    EN: {
      tag: "FAQ, LOCATION & AI COUNSELING",
      title: "Contact Us & Virtual Counseling Services",
      desc: "Find our physical location in Cempaka Putih, contact PMB admissions, read our FAQs, or converse with our automated APJ AI Counselor."
    },
    JPN: {
      tag: "よくある質問・アクセス・人工知能相談窓口",
      title: "お問い合わせ先 ＆ バーチャルAIキャンパス相談室",
      desc: "チュンパカ・プティ校へのアクセス、入試担当窓口、FAQ確認、およびAI特別カウンセラーとの対話ツール。"
    },
    Mandarin: {
      tag: "常见问题・校园地图工坊・AI智慧接待处",
      title: "联系我们与多语种招生虚拟机器人",
      desc: "查询首都校区核心位置、联系大专招生委员会、查看常见问答或直接与 APJ AI 招生客服在线实时畅聊。"
    },
    Arab: {
      tag: "الأسئلة الشائعة والموقع ومستشار الذكاء الاصطناعي",
      title: "اتصل بنا وخدمات الإرشاد الافتراضية الذكية",
      desc: "اكتشف موقعنا الفعلي في سيمباكا بوتيه، اتصل بلجنة القبول، واقرأ الأسئلة الشائعة، أو تحدث مع مستشار الذكاء الاصطناعي المباشر."
    },
    Jerman: {
      tag: "FAQ, STANDORT & KI-BERATER",
      title: "Kontaktieren Sie uns & Virtuelle KI-Beratungsdienste",
      desc: "Finden Sie unseren Campus in Cempaka Putih, kontaktieren Sie den PMB-Ausschuss, lesen Sie die FAQs oder starten Sie ein Gespräch mit dem APJ KI-Berater."
    },
    Turki: {
      tag: "SSS, HARİTA KONUMU & YAPAY ZEKA ASİSTANI",
      title: "Bizimle İletişime Geçin & Sanal Danışmanlık Hizmetleri",
      desc: "Cempaka Putih kampüs konumumuzu keşfedin, PMB ofisimize ulaşın, sıkça sorulan soruları okuyun veya APJ Yapay Zeka Danışmanı ile sohbet edin."
    },
    Korea: {
      tag: "주요 문의 대개방 • 오시는 길 • AI 가상 카운셀러",
      title: "HUB 연계 서비스센터 & 24H AI 가상 입학 지원실",
      desc: "중심점 캠퍼스 위치 물색, 학적 담당 부처 즉각 안내, 축적된 입시 상식을 확인하거나 원격 기가막힌 AI 상담사와 교신을 수행하세요."
    }
  };

  const getContactText = (fieldKey: string) => {
    const lang = titlesDict[currentLang] || titlesDict["ID"];
    return lang[fieldKey] || titlesDict["ID"][fieldKey] || "";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Page header */}
      <div className="border-b border-neutral-100 pb-6 text-center md:text-left space-y-2">
        <span className="text-xs font-black text-primary tracking-widest uppercase block">
          {getContactText("tag")}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
          {getContactText("title")}
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 font-semibold leading-relaxed">
          {getContactText("desc")}
        </p>
      </div>

      {/* Main Grid: Left is Info/FAQ, Right is the Interactive AI Chatroom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact info & Accordion FAQs */}
        <div className="lg:col-span-6 space-y-10">
          {/* Quick contact card panel */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="block font-black text-xs text-primary uppercase tracking-wider">
                📍 MATRIKS LOKASI KAMPUS
              </span>
              <div className="flex gap-2 text-xs font-semibold text-neutral-600 leading-relaxed">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>
                  Jl. Cempaka Putih Tengah XXXII No. 8, Cempaka Putih, Jakarta Pusat.
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <span className="block font-black text-xs text-primary uppercase tracking-wider">
                📞 CALL-CENTER & LAYANAN
              </span>
              <div className="space-y-2 text-xs font-bold text-neutral-600">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-primary" />
                  <span>Main Line: (021) 8613388</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-primary" />
                  <span>pmb@apj.ac.id</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span>WIB Kerja: Senin-Sabtu 08:00-17:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion list */}
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <span className="text-xs font-black text-neutral-500 uppercase tracking-widest leading-none">
                MENJAWAB KERAGUAN ANDA
              </span>
              <h3 className="text-lg md:text-xl font-bold text-neutral-900 font-heading mt-1">
                Frequently Asked Questions (FAQ)
              </h3>
            </div>

            <div className="space-y-2">
              {FAQ_DATA.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden transition">
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full text-left px-5 py-4 flex justify-between items-center gap-3 font-semibold text-xs md:text-sm text-neutral-800 hover:bg-neutral-50"
                      id={`faq-btn-${idx}`}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown size={16} className={`text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed font-semibold bg-neutral-50/20 border-t border-neutral-50 py-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Contact Form */}
          <div className="bg-[#FFFCEF] border border-accent rounded-2xl p-6 space-y-4">
            <h4 className="font-extrabold text-[#0050A0] text-sm md:text-md uppercase font-heading leading-tight">
              Kirim Formulir Hubungi Kami
            </h4>
            {formSuccess ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg border border-green-200 text-xs font-bold flex items-center gap-2">
                <Check size={16} /> Pesan Anda telah terkirim! Tim Admin APJ akan membalas melalaui email segera.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-[#0050A0] bg-white font-semibold"
                    id="contact-name"
                  />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Alamat Email"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-[#0050A0] bg-white font-semibold"
                    id="contact-email"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  placeholder="Isi Pertanyaan / Pesan Anda ke Admin APJ..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-[#0050A0] bg-white font-semibold"
                  id="contact-msg"
                ></textarea>
                <button
                  type="submit"
                  disabled={msgSubmitting}
                  className={`bg-primary text-white text-xs font-bold py-2 px-5 rounded hover:bg-blue-800 transition shadow cursor-pointer ${msgSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  id="contact-submit"
                >
                  {msgSubmitting ? "Mengirim ke Database..." : "Kirim Pesan"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: APJ virtual Admissions Chatbot room */}
        <div className="lg:col-span-6 bg-white border border-neutral-100 shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[550px]">
          {/* Channel Chat Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center border-b-4 border-accent shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/input_file_1.png" 
                  alt="Counselor APJ Logo" 
                  className="h-10 w-10 object-contain bg-white rounded-full p-1 border border-accent" 
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full animate-pulse"></span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs md:text-sm font-heading leading-tight tracking-wider">KONSELOR VIRTUAL APJ</h4>
                <p className="text-[10px] text-accent font-bold leading-none uppercase">Aktif • Didukung Basis Pengetahuan Kampus</p>
              </div>
            </div>
          </div>

          {/* Bubbles content box scrolling */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => {
              const isBot = msg.sender === "bot";
              return (
                <div key={i} className={`flex gap-3 max-w-[85%] ${isBot ? "mr-auto items-start" : "ml-auto flex-row-reverse items-end"}`}>
                  {isBot && (
                    <img 
                      src="/input_file_1.png" 
                      alt="APJ" 
                      className="h-7 w-7 object-contain bg-white rounded-full border border-neutral-200 shrink-0 mt-1" 
                    />
                  )}
                  <div className="space-y-1">
                    <div className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
                      isBot 
                        ? "bg-white border border-neutral-100 text-neutral-800 rounded-tl-none font-semibold" 
                        : "bg-primary text-white rounded-br-none font-semibold"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="block text-[8px] text-zinc-400 text-right leading-none px-1 font-semibold uppercase">{msg.time}</span>
                  </div>
                </div>
              );
            })}
            
            {/* Thinking simulated delay loader dots */}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto items-start animate-pulse">
                <img 
                  src="/input_file_1.png" 
                  alt="APJ" 
                  className="h-7 w-7 object-contain bg-white rounded-full border border-neutral-200 shrink-0 mt-1" 
                />
                <div className="bg-white border border-neutral-100 p-3.5 rounded-2xl rounded-tl-none text-xs flex gap-1 justify-center items-center">
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            
            <div ref={scrollRef}></div>
          </div>

          {/* Typing entry board sender shrink-0 */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-100 flex gap-2 items-center shrink-0">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Tanyakan prodi, biaya, pmb seleksi atau syarat..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#0050A0] font-semibold bg-neutral-50/50 focus:bg-white transition"
              id="chatbot-input-field"
            />
            <button
              type="submit"
              className="bg-[#0050A0] text-accent p-2.5 rounded-xl hover:bg-blue-800 text-white transition flex items-center justify-center cursor-pointer shadow"
              aria-label="Send Message"
              id="chatbot-send-btn"
            >
              <Send size={16} className="text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
