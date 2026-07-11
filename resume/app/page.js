"use client";

import { useState } from "react";
import { themeList } from "@/lib/themes";
import { buildDataFromTheme } from "@/lib/buildData";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

export default function Page() {
  const [themeKey, setThemeKey] = useState("programming");
  const [data, setData] = useState(() => buildDataFromTheme("programming"));
  const [downloading, setDownloading] = useState(false);

  // Switch course theme. Keeps the user's name/contact/photo, refreshes the rest.
  const changeTheme = (key) => {
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
      // Make sure webfonts are ready so text isn't captured mid-swap.
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }
      const el = document.getElementById("resume-sheet");

      // Capture the sheet at its natural 1024px width WITHOUT any parent
      // transform/scale, so html2canvas measures the true layout. We clone the
      // node into an off-screen container to avoid the scaled preview wrapper.
      const clone = el.cloneNode(true);
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

      // Build a PDF whose page width matches A4 (in pt), and scale the image to
      // that width so text renders at a normal, readable size. Page height grows
      // with the content so nothing is cropped or squeezed.
      const pageWidth = 595.28; // A4 width in pt
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

  return (
    <div className="min-h-screen bg-[#060911]">
      <header className="no-print sticky top-0 z-20 border-b border-white/10 bg-[#0a0e1a] px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-white">IFDA Resume Builder</h1>
            <p className="text-xs text-gray-400">Pick a course, fill your details, download your resume.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={themeKey}
              onChange={(e) => changeTheme(e.target.value)}
              className="rounded-md border border-white/15 bg-[#0f1524] px-3 py-2 text-sm text-gray-200"
            >
              {themeList.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
            <button onClick={() => changeTheme(themeKey)}
              className="rounded-md border border-white/15 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
              Reset
            </button>
            <button onClick={downloadPDF} disabled={downloading}
              className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              style={{ background: data._theme.colors.accent }}>
              {downloading ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <div className="no-print w-full lg:w-[420px] shrink-0 border-r border-white/10 bg-[#0a0e1a] p-6 lg:h-[calc(100vh-73px)] lg:overflow-y-auto">
          <ResumeForm data={data} setData={setData} />
        </div>

        <div className="flex-1 overflow-auto p-6 lg:h-[calc(100vh-73px)]">
          <div className="mx-auto w-fit">
            <div style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
              <ResumePreview data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
