'use client';

import React, { ChangeEvent } from 'react';
import { SpecialtyResumeData } from '@/lib/buildData';

interface FieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  textarea?: boolean;
  placeholder?: string;
}

function Field({ label, value, onChange, textarea, placeholder }: FieldProps) {
  return (
    <label className="block mb-3.5">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      {textarea ? (
        <textarea
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

interface GroupProps {
  title: string;
  children: React.ReactNode;
}

function Group({ title, children }: GroupProps) {
  return (
    <div className="mb-8 border-b border-white/5 pb-6">
      <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">{title}</h3>
      {children}
    </div>
  );
}

interface ResumeFormProps {
  data: SpecialtyResumeData;
  setData: React.Dispatch<React.SetStateAction<SpecialtyResumeData>>;
}

export default function ResumeForm({ data, setData }: ResumeFormProps) {
  const set = (path: string, value: any) => {
    setData((prev) => {
      const next = structuredClone(prev) as any;
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const setArr = (key: string, index: number, field: string | null, value: any) => {
    setData((prev) => {
      const next = structuredClone(prev) as any;
      if (field === null) {
        next[key][index] = value;
      } else {
        if (!next[key][index]) next[key][index] = {};
        next[key][index][field] = value;
      }
      return next;
    });
  };

  const addItem = (key: string, item: any) =>
    setData((prev: any) => ({ ...prev, [key]: [...prev[key], structuredClone(item)] }));

  const removeItem = (key: string, index: number) =>
    setData((prev: any) => ({ ...prev, [key]: prev[key].filter((_: any, i: number) => i !== index) }));

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        set("photo", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="text-slate-200">
      <Group title="Basic Info">
        <Field label="Full Name" value={data.name} onChange={(v) => set("name", v)} />
        <Field label="Role / Subtitle" value={data.role} onChange={(v) => set("role", v)} />
        <Field label="Header Title" value={data.title} onChange={(v) => set("title", v)} />
        <Field label="Header Summary" textarea value={data.summary} onChange={(v) => set("summary", v)} />
        <Field label="About Me" textarea value={data.about} onChange={(v) => set("about", v)} />
        <label className="flex items-center gap-2.5 text-xs text-slate-300 mt-2 mb-4 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={data.available} 
            onChange={(e) => set("available", e.target.checked)} 
            className="rounded border-white/10 bg-[#0f1524] text-blue-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
          />
          <span>Show &quot;Available for Work&quot; badge</span>
        </label>
        <label className="block">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Profile Photo</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handlePhoto} 
            className="mt-1.5 block w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 file:cursor-pointer" 
          />
        </label>
      </Group>

      <Group title="Contact">
        <Field label="Email" value={data.contact.email} onChange={(v) => set("contact.email", v)} />
        <Field label="Phone" value={data.contact.phone} onChange={(v) => set("contact.phone", v)} />
        <Field label="Location" value={data.contact.location} onChange={(v) => set("contact.location", v)} />
        <Field label="Website" value={data.contact.website} onChange={(v) => set("contact.website", v)} />
        <Field label="GitHub" value={data.contact.github} onChange={(v) => set("contact.github", v)} />
        <Field label="LinkedIn" value={data.contact.linkedin} onChange={(v) => set("contact.linkedin", v)} />
      </Group>

      <Group title="Technical Skills">
        {data.technicalSkills.map((s, i) => (
          <div key={i} className="flex gap-2.5 mb-2.5 items-center">
            <input 
              className="flex-1 rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              value={s.name} 
              onChange={(e) => setArr("technicalSkills", i, "name", e.target.value)} 
              placeholder="Skill Name"
            />
            <input 
              type="number" 
              min="0" 
              max="100" 
              className="w-16 rounded-lg border border-white/10 bg-[#0f1524] px-2.5 py-2 text-xs text-white text-center placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              value={s.level} 
              onChange={(e) => setArr("technicalSkills", i, "level", Number(e.target.value))} 
            />
            <button 
              onClick={() => removeItem("technicalSkills", i)} 
              className="text-red-400 hover:text-red-300 text-xs px-2 transition"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          onClick={() => addItem("technicalSkills", { name: "New Skill", level: 80 })}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition mt-1.5"
        >
          + Add skill
        </button>
      </Group>

      <Group title="Tech Stack (comma separated)">
        <textarea 
          className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
          rows={2}
          value={data.techStack.join(", ")}
          onChange={(e) => set("techStack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} 
        />
      </Group>

      <Group title="Tools (comma separated)">
        <textarea 
          className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
          rows={2}
          value={data.tools.join(", ")}
          onChange={(e) => set("tools", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} 
        />
      </Group>

      <Group title="Experience">
        {data.experience.map((e, i) => (
          <div key={i} className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
            <input 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Job Title" 
              value={e.title} 
              onChange={(ev) => setArr("experience", i, "title", ev.target.value)} 
            />
            <input 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Company" 
              value={e.company} 
              onChange={(ev) => setArr("experience", i, "company", ev.target.value)} 
            />
            <input 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Period (e.g. Jan 2025 - Present)" 
              value={e.period} 
              onChange={(ev) => setArr("experience", i, "period", ev.target.value)} 
            />
            <textarea 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
              rows={3}
              placeholder="One bullet point per line" 
              value={e.points.join("\n")}
              onChange={(ev) => setArr("experience", i, "points", ev.target.value.split("\n").filter(Boolean))} 
            />
            <button 
              onClick={() => removeItem("experience", i)} 
              className="text-red-400 hover:text-red-300 text-xs font-semibold mt-1 transition"
            >
              Remove Experience
            </button>
          </div>
        ))}
        <button 
          onClick={() => addItem("experience", { title: "", company: "", period: "", points: [""] })}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition mt-1"
        >
          + Add experience
        </button>
      </Group>

      <Group title="Projects">
        {data.projects.map((p, i) => (
          <div key={i} className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
            <input 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Project Name" 
              value={p.name} 
              onChange={(ev) => setArr("projects", i, "name", ev.target.value)} 
            />
            <textarea 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
              rows={2}
              placeholder="Description" 
              value={p.description} 
              onChange={(ev) => setArr("projects", i, "description", ev.target.value)} 
            />
            <input 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Tags (comma separated)" 
              value={p.tags.join(", ")}
              onChange={(ev) => setArr("projects", i, "tags", ev.target.value.split(",").map((s) => s.trim()).filter(Boolean))} 
            />
            <button 
              onClick={() => removeItem("projects", i)} 
              className="text-red-400 hover:text-red-300 text-xs font-semibold mt-1 transition"
            >
              Remove Project
            </button>
          </div>
        ))}
        <button 
          onClick={() => addItem("projects", { name: "", description: "", tags: [] })}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition mt-1"
        >
          + Add project
        </button>
      </Group>

      <Group title="Education">
        {data.education.map((ed, i) => (
          <div key={i} className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
            <input 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Degree" 
              value={ed.degree} 
              onChange={(ev) => setArr("education", i, "degree", ev.target.value)} 
            />
            <input 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Institute" 
              value={ed.institute} 
              onChange={(ev) => setArr("education", i, "institute", ev.target.value)} 
            />
            <input 
              className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Period (e.g. 2024 - 2025)" 
              value={ed.period} 
              onChange={(ev) => setArr("education", i, "period", ev.target.value)} 
            />
            <button 
              onClick={() => removeItem("education", i)} 
              className="text-red-400 hover:text-red-300 text-xs font-semibold mt-1 transition"
            >
              Remove Education
            </button>
          </div>
        ))}
        <button 
          onClick={() => addItem("education", { degree: "", institute: "", period: "" })}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition mt-1"
        >
          + Add education
        </button>
      </Group>

      <Group title="Certifications (comma separated)">
        <textarea 
          className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
          rows={2}
          value={data.certifications.join(", ")}
          onChange={(e) => set("certifications", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} 
        />
      </Group>

      <Group title="Achievements">
        {data.achievements.map((a, i) => (
          <div key={i} className="flex gap-2.5 mb-2.5">
            <input 
              className="w-24 rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="e.g. 25+" 
              value={a.value} 
              onChange={(e) => setArr("achievements", i, "value", e.target.value)} 
            />
            <input 
              className="flex-1 rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Label (e.g. Hires Made)" 
              value={a.label} 
              onChange={(e) => setArr("achievements", i, "label", e.target.value)} 
            />
            <button 
              onClick={() => removeItem("achievements", i)} 
              className="text-red-400 hover:text-red-300 text-xs px-2 transition"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          onClick={() => addItem("achievements", { value: "", label: "" })} 
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition mt-1.5"
        >
          + Add achievement
        </button>
      </Group>

      <Group title="Languages">
        {data.languages.map((l, i) => (
          <div key={i} className="flex gap-2.5 mb-2.5 items-center">
            <input 
              className="flex-1 rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Language" 
              value={l.name} 
              onChange={(e) => setArr("languages", i, "name", e.target.value)} 
            />
            <input 
              type="number" 
              min="0" 
              max="100" 
              className="w-16 rounded-lg border border-white/10 bg-[#0f1524] px-2.5 py-2 text-xs text-white text-center placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              value={l.level} 
              onChange={(e) => setArr("languages", i, "level", Number(e.target.value))} 
            />
            <input 
              className="w-28 rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Note (e.g. Native)" 
              value={l.note} 
              onChange={(e) => setArr("languages", i, "note", e.target.value)} 
            />
            <button 
              onClick={() => removeItem("languages", i)} 
              className="text-red-400 hover:text-red-300 text-xs px-2 transition"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          onClick={() => addItem("languages", { name: "", level: 80, note: "" })} 
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition mt-1.5"
        >
          + Add language
        </button>
      </Group>

      <Group title="Interests (comma separated)">
        <textarea 
          className="w-full rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
          rows={2}
          value={data.interests.join(", ")}
          onChange={(e) => set("interests", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} 
        />
      </Group>

      <Group title="GitHub Statistics">
        {data.githubStats.map((g, i) => (
          <div key={i} className="flex gap-2.5 mb-2.5">
            <input 
              className="w-24 rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="e.g. 50+" 
              value={g.value} 
              onChange={(e) => setArr("githubStats", i, "value", e.target.value)} 
            />
            <input 
              className="flex-1 rounded-lg border border-white/10 bg-[#0f1524] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Label (e.g. Commits)" 
              value={g.label} 
              onChange={(e) => setArr("githubStats", i, "label", e.target.value)} 
            />
            <button 
              onClick={() => removeItem("githubStats", i)} 
              className="text-red-400 hover:text-red-300 text-xs px-2 transition"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          onClick={() => addItem("githubStats", { value: "", label: "" })} 
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition mt-1.5"
        >
          + Add stat
        </button>
      </Group>
    </div>
  );
}
