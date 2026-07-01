'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Type, AlignLeft, Paintbrush, Move } from 'lucide-react';

const COLORS = [
  { name: 'Blue Accent', value: '#2563EB' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Indigo', value: '#4F46E5' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Dark Slate', value: '#1E293B' },
  { name: 'Amber', value: '#D97706' },
];

const FONTS = [
  { name: 'Modern Sans', value: 'sans' },
  { name: 'Classic Serif', value: 'serif' },
  { name: 'Technical Mono', value: 'mono' },
  { name: 'Premium Display', value: 'display' },
];

export function DesignSettingsPanel() {
  const layout = useResumeStore((s) => s.resume.layout) ?? {
    themeColor: '#2563EB',
    fontSize: 'md',
    fontFamily: 'sans',
    lineHeight: 'normal',
    spacing: 'normal',
  };
  const updateLayout = useResumeStore((s) => s.updateLayout);

  return (
    <div className="p-5 space-y-6 bg-white">
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#647A9A] mb-4 flex items-center gap-1.5">
          <Paintbrush className="h-3.5 w-3.5" /> Color Palette
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => updateLayout({ themeColor: c.value })}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                layout.themeColor === c.value
                  ? 'border-primary-DEFAULT bg-blue-50/50 shadow-sm ring-1 ring-primary-DEFAULT'
                  : 'border-slate-100 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-5 h-5 rounded-full mb-1.5 shadow-inner"
                style={{ backgroundColor: c.value }}
              />
              <span className="text-[10px] font-bold text-slate-700">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#647A9A] mb-4 flex items-center gap-1.5">
          <Type className="h-3.5 w-3.5" /> Typography Family
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((f) => (
            <button
              key={f.value}
              onClick={() => updateLayout({ fontFamily: f.value as any })}
              className={`p-3 rounded-xl border text-left transition-all ${
                layout.fontFamily === f.value
                  ? 'border-primary-DEFAULT bg-blue-50/50 shadow-sm ring-1 ring-primary-DEFAULT'
                  : 'border-slate-100 hover:bg-slate-50'
              }`}
            >
              <span
                className={`text-sm font-bold block mb-1 ${
                  f.value === 'serif' ? 'font-serif' : f.value === 'mono' ? 'font-mono' : 'font-sans'
                }`}
              >
                Aa
              </span>
              <span className="text-[10px] font-bold text-slate-700">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#647A9A] mb-4 flex items-center gap-1.5">
          <AlignLeft className="h-3.5 w-3.5" /> Text Size & Spacing
        </h3>
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-500 mb-1.5 block">Font Size</span>
            <div className="flex bg-slate-50 p-1 rounded-xl">
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateLayout({ fontSize: size })}
                  className={`flex-1 py-1.5 text-xs font-bold text-center rounded-[8px] transition-all capitalize ${
                    layout.fontSize === size
                      ? 'bg-white text-primary-DEFAULT shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 mb-1.5 block">Line Spacing</span>
            <div className="flex bg-slate-50 p-1 rounded-xl">
              {(['compact', 'normal', 'loose'] as const).map((lh) => (
                <button
                  key={lh}
                  onClick={() => updateLayout({ lineHeight: lh })}
                  className={`flex-1 py-1.5 text-xs font-bold text-center rounded-[8px] transition-all capitalize ${
                    layout.lineHeight === lh
                      ? 'bg-white text-primary-DEFAULT shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {lh}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#647A9A] mb-4 flex items-center gap-1.5">
          <Move className="h-3.5 w-3.5" /> Margins & Padding
        </h3>
        <div className="flex bg-slate-50 p-1 rounded-xl">
          {(['compact', 'normal', 'loose'] as const).map((sp) => (
            <button
              key={sp}
              onClick={() => updateLayout({ spacing: sp })}
              className={`flex-1 py-1.5 text-xs font-bold text-center rounded-[8px] transition-all capitalize ${
                layout.spacing === sp
                  ? 'bg-white text-primary-DEFAULT shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
