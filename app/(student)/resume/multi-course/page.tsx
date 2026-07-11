'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Download, RefreshCw, Sparkles } from 'lucide-react';
import { themeList } from '@/lib/themes';
import { buildDataFromTheme, SpecialtyResumeData } from '@/lib/buildData';
import ResumeForm from '@/components/resume-multi-course/ResumeForm';
import ResumePreview from '@/components/resume-multi-course/ResumePreview';

export default function MultiCoursePage() {
  const [themeKey, setThemeKey] = useState("programming");
  const [data, setData] = useState<SpecialtyResumeData>(() => buildDataFromTheme("programming"));
  const [downloading, setDownloading] = useState(false);
  const [scale, setScale] = useState(0.85);

  const changeTheme = (key: string) => {
    setThemeKey(key);
    setData((prev) =>
      buildDataFromTheme(key, {
        name: prev.name,
        contact: prev.contact,
        photo: prev.photo,
        available: prev.available,
      })
    );
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }
      
      const el = document.getElementById("resume-sheet");
      if (!el) throw new Error("Resume sheet element not found");

      const clone = el.cloneNode(true) as HTMLElement;
      const holder = document.createElement("div");
      holder.style.position = "fixed";
      holder.style.left = "-10000px";
      holder.style.top = "0";
      holder.style.width = "1024px";
      holder.style.background = data._theme.colors.bg;
      clone.style.transform = "none";
      holder.appendChild(clone);
      document.body.appendChild(holder);

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: data._theme.colors.bg,
        useCORS: true,
        windowWidth: 1024,
        width: 1024,
        height: clone.scrollHeight,
      });
      document.body.removeChild(holder);

      const img = canvas.toDataURL("image/png");

      const pageWidth = 595.28;
      const ratio = canvas.height / canvas.width;
      const pageHeight = pageWidth * ratio;
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [pageWidth, pageHeight],
      });
      
      pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      pdf.save(`${data.name.replace(/\s+/g, "_")}_${themeKey}_Resume.pdf`);
    } catch (err) {
      alert("PDF export failed. Try again.");
      console.error(err);
    }
    setDownloading(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const parent = document.getElementById('preview-viewport');
      if (parent) {
        const parentWidth = parent.clientWidth;
        const newScale = Math.min((parentWidth - 32) / 1024, 0.85);
        setScale(Math.max(newScale, 0.3));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col text-slate-100 antialiased selection:bg-blue-500/35">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0f1d]/85 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 border border-white/10 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all shadow-sm shrink-0"
            title="Go to Dashboard"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-sm font-extrabold text-white flex items-center gap-1.5 leading-none">
              <Sparkles className="h-4 w-4 text-blue-400" /> Specialty Course Themes
            </h1>
            <p className="text-[10px] text-slate-400 mt-1">Select a course theme, fill details, and export to PDF.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Theme:</span>
            <select
              value={themeKey}
              onChange={(e) => changeTheme(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              {themeList.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => changeTheme(themeKey)}
            className="flex items-center justify-center p-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition shadow-sm"
            title="Reset to Theme Defaults"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button 
            onClick={downloadPDF} 
            disabled={downloading}
            style={{ backgroundColor: data._theme.colors.accent }}
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-bold text-white hover:opacity-95 disabled:opacity-50 transition shadow-[0_4px_12px_rgba(59,73,223,0.25)]"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Exporting..." : "Download PDF"}
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <aside className="w-full lg:w-[420px] shrink-0 border-r border-white/5 bg-[#0a0f1d] p-6 lg:h-[calc(100vh-66px)] lg:overflow-y-auto shadow-inner">
          <ResumeForm data={data} setData={setData} />
        </aside>

        <main 
          id="preview-viewport"
          className="flex-1 overflow-auto p-6 bg-[#04060b] flex items-start justify-center lg:h-[calc(100vh-66px)] transition-all duration-300"
        >
          <div 
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: "top center",
              width: "1024px"
            }} 
            className="shrink-0 transition-transform duration-150"
          >
            <ResumePreview data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}
