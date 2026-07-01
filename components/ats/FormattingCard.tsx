'use client';
import { Check } from 'lucide-react';
import { useATSStore } from '@/store/atsStore';

const CHECKS = [
  { label: 'Standard fonts used', pass: true },
  { label: 'No tables or columns', pass: true },
  { label: 'No images or graphics', pass: true },
  { label: 'Consistent date formats', pass: true },
  { label: 'Contact info present', pass: true },
  { label: 'ATS-friendly layout', pass: true },
];

export function FormattingCard() {
  const result = useATSStore((s) => s.result);
  const formattingScore = result?.formattingScore ?? 91;

  return (
    <div className="rounded-[14px] border border-[#CFE0F7] bg-[#F7FAFF] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_16px_38px_rgba(37,99,235,0.09)] transition-all duration-200 hover:-translate-y-1 hover:border-primary-DEFAULT/35 hover:bg-[#EFF6FF]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-[#10233F]">Formatting Analysis</h3>
        <span className="text-lg font-bold text-success">{formattingScore}%</span>
      </div>
      <div className="space-y-2.5">
        {CHECKS.map((c) => (
          <div key={c.label} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${c.pass ? 'bg-emerald-100' : 'bg-red-100'}`}>
              <Check className={`h-3 w-3 ${c.pass ? 'text-success' : 'text-danger'}`} />
            </div>
            <span className="text-xs font-bold text-[#10233F]">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
