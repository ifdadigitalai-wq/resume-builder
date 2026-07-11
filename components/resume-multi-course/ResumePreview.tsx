'use client';

import React from 'react';
import * as Lucide from 'lucide-react';
import { SpecialtyResumeData } from '@/lib/buildData';

interface IconProps extends Omit<Lucide.LucideProps, 'ref'> {
  name: string;
}

function Icon({ name, ...props }: IconProps) {
  const LucideAny = Lucide as any;
  const Cmp = LucideAny[name] || LucideAny.Circle;
  return <Cmp {...props} />;
}

interface SectionTitleProps {
  icon: string;
  children: React.ReactNode;
  accent: string;
}

function SectionTitle({ icon, children, accent }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <Icon name={icon} size={16} style={{ color: accent }} className="shrink-0" />
      <h3 className="text-[13px] font-black tracking-widest text-white uppercase">{children}</h3>
    </div>
  );
}

interface BarProps {
  level: number;
  from: string;
  to: string;
}

function Bar({ level, from, to }: BarProps) {
  return (
    <div className="w-full bg-white/[0.06] rounded-full overflow-hidden" style={{ height: 6 }}>
      <div 
        className="h-full rounded-full transition-all duration-500 ease-out" 
        style={{ 
          width: `${level}%`, 
          background: `linear-gradient(90deg, ${from}, ${to})` 
        }} 
      />
    </div>
  );
}

interface ResumePreviewProps {
  data: SpecialtyResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const th = data._theme || {
    colors: { bg: "#0a0e1a", card: "#0f1524", panel: "#111827", accent: "#7c5cff", accent2: "#4f8cff", green: "#22c55e" },
    icons: { header: "Terminal", skills: "Code2", stack: "Code2", experience: "Briefcase", projects: "FolderGit2", stats: "Github" },
    labels: { title: data.title, stack: "Tech Stack", projects: "Featured Projects", stats: "Github Statistics" },
    stackTitle: "Github Statistics",
  };
  const c = th.colors;
  const half = Math.ceil(data.technicalSkills.length / 2);
  const skillsLeft = data.technicalSkills.slice(0, half);
  const skillsRight = data.technicalSkills.slice(half);

  const chipStyle = { 
    fontSize: 10, 
    padding: "2px 8px", 
    borderRadius: 6, 
    border: "1px solid rgba(255,255,255,0.06)", 
    background: "rgba(255,255,255,0.02)" 
  };
  const iconBox = { 
    background: c.panel, 
    border: "1px solid rgba(255,255,255,0.06)" 
  };

  return (
    <div 
      id="resume-sheet" 
      className="resume-sheet w-[1024px] flex shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden text-left"
      style={{ background: c.bg, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}
    >
      {/* ============ LEFT SIDEBAR ============ */}
      <aside className="w-[312px] px-7 py-8 shrink-0 bg-black/15 border-r border-white/5">
        <div className="flex justify-center mb-6">
          <div className="w-36 h-36 rounded-full p-[3px]" style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accent2})` }}>
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#070b13]">
              {data.photo ? (
                <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <Icon name="User" size={56} className="text-slate-600" />
              )}
            </div>
          </div>
        </div>

        <h1 className="text-center text-2xl font-black leading-tight tracking-tight text-white mb-2">
          {data.name.split(" ").map((w, i) => (
            <span key={i} style={{ color: i % 2 === 1 ? c.accent2 : "#fff" }}>{w} </span>
          ))}
        </h1>
        <p className="text-center text-xs font-bold uppercase tracking-wider mb-4" style={{ color: c.accent }}>
          {data.role}
        </p>

        {data.available && (
          <div className="flex justify-center mb-6">
            <span className="flex items-center gap-2 text-[9px] font-bold rounded-full px-2.5 py-1"
              style={{ color: c.green, border: `1px solid ${c.green}33`, background: `${c.green}08` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.green }} />
              AVAILABLE FOR WORK
            </span>
          </div>
        )}

        {/* Contact */}
        <div className="mt-8">
          <SectionTitle icon="Mail" accent={c.accent}>Contact</SectionTitle>
          <ul className="space-y-3 text-[12px] text-slate-300">
            {[
              ["Mail", data.contact.email], 
              ["Phone", data.contact.phone], 
              ["MapPin", data.contact.location],
              ["Globe", data.contact.website], 
              ["Github", data.contact.github], 
              ["Linkedin", data.contact.linkedin]
            ].map(([ic, val], i) => val ? (
              <li key={i} className="flex items-center gap-3">
                <Icon name={ic} size={14} style={{ color: c.accent }} className="shrink-0 opacity-85" />
                <span className="break-all font-medium">{val}</span>
              </li>
            ) : null)}
          </ul>
        </div>

        {data.about && (
          <div className="mt-8">
            <SectionTitle icon="User" accent={c.accent}>About Me</SectionTitle>
            <p className="text-[12px] leading-relaxed text-slate-400 font-medium">{data.about}</p>
          </div>
        )}

        {data.techStack.length > 0 && (
          <div className="mt-8">
            <SectionTitle icon={th.icons.stack} accent={c.accent}>{th.labels.stack}</SectionTitle>
            <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
              {data.techStack.map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[9px] font-extrabold" style={{ ...iconBox, color: c.accent2 }}>
                    {t.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase()}
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold leading-tight truncate w-full">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.tools.length > 0 && (
          <div className="mt-8">
            <SectionTitle icon="Wrench" accent={c.accent}>Tools</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {data.tools.map((t, i) => <span key={i} style={chipStyle} className="text-slate-300 font-semibold">{t}</span>)}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="mt-8">
            <SectionTitle icon="Languages" accent={c.accent}>Languages</SectionTitle>
            <div className="space-y-3.5">
              {data.languages.map((l, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold">
                    <span className="text-slate-300">{l.name}</span>
                    <span className="text-slate-500 text-[10px]">{l.note}</span>
                  </div>
                  <Bar level={l.level} from={c.accent2} to={c.accent} />
                </div>
              ))}
            </div>
          </div>
        )}

        {data.interests.length > 0 && (
          <div className="mt-8">
            <SectionTitle icon="Heart" accent={c.accent}>Interests</SectionTitle>
            <div className="grid grid-cols-3 gap-2 text-center">
              {data.interests.map((it, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={iconBox}>
                    <Icon name="Sparkles" size={13} style={{ color: c.accent }} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold truncate w-full">{it}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ============ RIGHT MAIN ============ */}
      <main className="flex-1 px-9 py-8 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between pb-5 border-b border-white/5">
            <div className="max-w-[75%]">
              <div className="flex items-center gap-2.5 mb-2">
                <Icon name={th.icons.header} size={20} style={{ color: c.accent }} className="shrink-0" />
                <h2 className="text-xl font-black text-white tracking-wide uppercase">{data.title}</h2>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-400 font-medium">{data.summary}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 shrink-0">
              <Icon name={th.icons.header} size={32} style={{ color: c.accent2 }} />
            </div>
          </div>

          {/* Technical Skills */}
          <section className="mt-7">
            <SectionTitle icon={th.icons.skills} accent={c.accent}>Technical Skills</SectionTitle>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
              {[skillsLeft, skillsRight].map((col, ci) => (
                <div key={ci} className="space-y-3.5">
                  {col.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-extrabold shrink-0" style={{ ...iconBox, color: c.accent2 }}>
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[12px] text-slate-300 font-bold w-24 shrink-0 truncate">{s.name}</span>
                      <Bar level={s.level} from={c.accent2} to={c.accent} />
                      <span className="text-[11px] text-slate-500 font-bold w-8 text-right shrink-0">{s.level}%</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          {data.experience.length > 0 && (
            <section className="mt-8">
              <SectionTitle icon={th.icons.experience} accent={c.accent}>Experience</SectionTitle>
              <div className="relative pl-5">
                <div className="absolute left-[5px] top-1.5 bottom-1.5 w-[1.5px] bg-white/5 animate-pulse" />
                {data.experience.map((e, i) => (
                  <div key={i} className="relative mb-5 last:mb-0">
                    <div className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full" style={{ background: c.accent, boxShadow: `0 0 0 3px ${c.bg}` }} />
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-[13px] font-bold text-white uppercase tracking-wide">{e.title}</h4>
                      <span className="text-[10px] text-slate-500 font-bold italic">{e.period}</span>
                    </div>
                    <p className="text-[11px] font-extrabold mb-1.5" style={{ color: c.accent2 }}>{e.company}</p>
                    <ul className="list-disc list-inside space-y-1 text-[12px] text-slate-400 pl-1 font-medium">
                      {e.points.map((p, pi) => p && <li key={pi} className="leading-relaxed">{p}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section className="mt-8">
              <SectionTitle icon={th.icons.projects} accent={c.accent}>{th.labels.projects}</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                {data.projects.map((p, i) => (
                  <div key={i} className="rounded-xl p-4 flex flex-col justify-between bg-white/[0.01] border border-white/5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name={th.icons.projects} size={15} style={{ color: c.accent }} className="shrink-0" />
                        <h5 className="text-[12px] font-bold text-white truncate">{p.name}</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{p.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {p.tags.map((t, ti) => (
                        <span key={ti} style={{ ...chipStyle, fontSize: 8, padding: "1px 6px" }} className="text-slate-400 font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education + Certifications */}
          <section className="mt-8 grid grid-cols-2 gap-6">
            {data.education.length > 0 && (
              <div>
                <SectionTitle icon="GraduationCap" accent={c.accent}>Education</SectionTitle>
                <div className="relative pl-5">
                  <div className="absolute left-[5px] top-1.5 bottom-1.5 w-[1.5px] bg-white/5 animate-pulse" />
                  {data.education.map((ed, i) => (
                    <div key={i} className="relative mb-3 last:mb-0">
                      <div className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full" style={{ background: c.accent, boxShadow: `0 0 0 3px ${c.bg}` }} />
                      <h4 className="text-[12px] font-bold text-white">{ed.degree}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{ed.institute}</p>
                      <p className="text-[10px] text-slate-500 font-bold italic mt-0.5">{ed.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.certifications.length > 0 && (
              <div>
                <SectionTitle icon="Award" accent={c.accent}>Certifications</SectionTitle>
                <div className="grid grid-cols-1 gap-2">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300 font-semibold bg-white/[0.01] border border-white/5 rounded-lg px-2.5 py-1.5">
                      <Icon name="BadgeCheck" size={13} style={{ color: c.accent2 }} className="shrink-0" />
                      <span className="truncate">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Achievements */}
          {data.achievements.length > 0 && (
            <section className="mt-8">
              <SectionTitle icon="Trophy" accent={c.accent}>Achievements</SectionTitle>
              <div className="grid grid-cols-4 gap-3">
                {data.achievements.map((a, i) => (
                  <div key={i} className="rounded-xl p-3 flex items-center gap-3 bg-white/[0.01] border border-white/5">
                    <Icon name={["Rocket", "Boxes", "Gauge", "Users"][i % 4]} size={20} style={{ color: c.accent }} className="shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-black tracking-tight" style={{ color: c.accent2 }}>{a.value}</div>
                      <div className="text-[9px] text-slate-500 font-bold leading-tight truncate w-full">{a.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Stats */}
        {data.githubStats.length > 0 && (
          <section className="mt-8 border-t border-white/5 pt-6">
            <SectionTitle icon={th.icons.stats} accent={c.accent}>{th.stackTitle}</SectionTitle>
            <div className="flex items-center justify-between rounded-xl p-4 bg-white/[0.01] border border-white/5">
              <div className="grid grid-cols-4 gap-4 flex-1">
                {data.githubStats.map((g, i) => (
                  <div key={i} className="text-center min-w-0">
                    <div className="text-lg font-black" style={{ color: c.green }}>{g.value}</div>
                    <div className="text-[9px] text-slate-500 font-bold truncate w-full">{g.label}</div>
                  </div>
                ))}
              </div>
              <div className="ml-5 shrink-0">
                <div className="grid gap-[2.5px]" style={{ gridTemplateColumns: "repeat(16, 1fr)" }}>
                  {Array.from({ length: 48 }).map((_, i) => {
                    const shades = [`${c.green}15`, `${c.green}44`, `${c.green}88`, c.green, c.accent2];
                    const col = shades[Math.floor(Math.random() * shades.length)];
                    return <div key={i} style={{ width: 10, height: 10, borderRadius: 1.5, background: col }} />;
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
