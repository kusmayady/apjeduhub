import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Tag, Share2, Sparkles, BookOpen, Clock, Check } from "lucide-react";
import { AnnouncementItem, getAnnouncements } from "../lib/dbService";

interface ArtikelDetailViewProps {
  article: AnnouncementItem;
  onBack: () => void;
  onNavigateToArticle: (article: AnnouncementItem) => void;
}

export default function ArtikelDetailView({ article, onBack, onNavigateToArticle }: ArtikelDetailViewProps) {
  const [relatedArticles, setRelatedArticles] = useState<AnnouncementItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    async function fetchRelated() {
      try {
        const list = await getAnnouncements();
        // Filter out the current article
        const filtered = list.filter(item => item.id !== article.id && item.title !== article.title);
        setRelatedArticles(filtered.slice(0, 3));
      } catch (e) {
        console.error("Gagal memuat artikel terkait:", e);
      }
    }
    fetchRelated();
  }, [article]);

  const handleShare = () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(article.title)}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Gagal menyalin tautan:", e);
    }
  };

  // Convert the description or content text to readable paragraphs
  const rawParagraphs = article.content && article.content.trim()
    ? article.content.split(/\r?\n/).map(p => p.trim()).filter(p => p.length > 0)
    : [article.desc || ""];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 text-neutral-800" id="artikel-detail-container">
      {/* Back Button & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-primary transition cursor-pointer"
          id="back-to-list-btn"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </button>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-400">
          <span>Beranda</span>
          <span>/</span>
          <span className="text-primary">{article.category}</span>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-[#002f5a]/10 text-primary text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded">
            {article.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <Calendar size={13} className="text-neutral-400" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <Clock size={13} className="text-neutral-400" />
            <span>3 mnt baca</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight font-heading" id="article-main-title">
          {article.title}
        </h1>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 border border-neutral-200 flex items-center justify-center text-primary text-xs font-bold font-serif">
              APJ
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-800">Humas APJ</p>
              <p className="text-[10px] text-neutral-500 font-medium">Official Publisher</p>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-primary border border-neutral-200 hover:border-neutral-300 rounded-lg px-2.5 py-1.5 transition cursor-pointer bg-white shadow-sm"
            title="Salin tautan artikel"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-600">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Bagikan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sampul Gambar / Cover Image Layout */}
      <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-md h-[260px] md:h-[450px]">
        <img
          src={article.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200"}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Article text content */}
        <article className="lg:col-span-8 space-y-6 text-sm md:text-base leading-relaxed text-neutral-700 font-medium" id="article-body-text">
          {rawParagraphs.map((paragraph, index) => (
            <p key={index} className="indent-0 md:indent-4 text-justify">
              {paragraph.trim()}
            </p>
          ))}
          
          <div className="bg-[#FFFCEF] border border-accent/40 rounded-xl p-5 mt-8 space-y-2">
            <span className="text-[10px] font-black text-primary tracking-widest uppercase flex items-center gap-1 font-heading">
              <Sparkles size={13} className="text-accent" />
              Sertifikasi BNSP & Penempatan Kerja
            </span>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Seluruh rekrutmen kerja dan program internasional di APJ (Akademi Pariwisata Jakarta) selalu didampingi bimbingan intensif serta pembekalan kompetensi industri secara autentik, demi mencetak praktisi hebat yang relevan di tingkat global.
            </p>
          </div>
        </article>

        {/* Sidebar info */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-extrabold text-xs text-neutral-900 uppercase tracking-wider font-heading border-b border-neutral-100 pb-2">
              Keterangan Publikasi
            </h4>
            <div className="space-y-3 text-xs font-semibold text-neutral-600">
              <div className="flex justify-between">
                <span className="text-neutral-400">Kategori:</span>
                <span className="text-primary font-bold">{article.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Tanggal:</span>
                <span>{article.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Verifikasi:</span>
                <span className="text-emerald-600">Terverifikasi Kampus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Penerbit:</span>
                <span>Pusat Humas APJ</span>
              </div>
            </div>
          </div>

          <div className="bg-primary text-white rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10 text-white">
              <BookOpen size={120} />
            </div>
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-black tracking-widest text-[#FFC46A] uppercase font-heading">
                PMB TA 2026/2027
              </span>
              <h4 className="font-serif font-black text-base md:text-lg leading-snug">
                Pendaftaran Telah Dibuka!
              </h4>
              <p className="text-[11px] leading-relaxed text-neutral-200">
                Pilih dan amankan kursi karir masa depanmu di D3 Perhotelan & D3 Usaha Wisata Akademi Pariwisata Jakarta sekarang!
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => window.location.reload()} // Actually simple reload or pass callback to register
                  className="w-full bg-[#FFB53D] text-[#002B52] hover:bg-yellow-400 text-xs font-black py-2 px-4 rounded-xl transition cursor-pointer"
                >
                  Daftar Online PMB
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related articles grid at the bottom */}
      {relatedArticles.length > 0 && (
        <div className="pt-8 border-t border-neutral-200" id="related-articles-section">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-1 bg-accent rounded"></div>
            <h3 className="font-black text-lg md:text-xl text-neutral-900 tracking-tight font-heading">
              Kabar & Berita Kampus Lainnya
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedArticles.map((rel, idx) => (
              <div 
                key={idx} 
                onClick={() => onNavigateToArticle(rel)}
                className="bg-white border border-neutral-200/70 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="h-32 overflow-hidden relative">
                    <img
                      src={rel.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400"}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-white text-primary text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded shadow-sm">
                      {rel.category}
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-400 block">{rel.date}</span>
                    <h4 className="font-bold text-neutral-900 leading-snug text-xs line-clamp-2 group-hover:text-primary transition">
                      {rel.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-semibold line-clamp-2 leading-relaxed">
                      {rel.desc}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-1">
                  <span className="text-[10px] font-bold text-primary group-hover:underline inline-flex items-center gap-0.5">
                    Baca Selanjutnya &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
