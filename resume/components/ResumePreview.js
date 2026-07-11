"use client";

import * as Lucide from "lucide-react";

// Resolve a lucide icon by name string, with a safe fallback.
function Icon({ name, ...props }) {
  const Cmp = Lucide[name] || Lucide.Circle;
  return <Cmp {...props} />;
}

function SectionTitle({ icon, children, accent }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon name={icon} size={18} style={{ color: accent }} />
      <h3 className="text-[15px] font-bold tracking-wide text-white uppercase">{children}</h3>
    </div>
  );
}

function Bar({ level, from, to }) {
  return (
    <div className="w-full" style={{ height: 6, borderRadius: 9999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 9999, width: `${level}%`, background: `linear-gradient(90deg, ${from}, ${to})` }} />
    </div>
  );
}

export default function ResumePreview({ data }) {
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

  const chipStyle = { fontSize: 11, padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" };
  const iconBox = { background: c.panel, border: "1px solid rgba(255,255,255,0.1)" };

  return (
    <div id="resume-sheet" className="resume-sheet w-[1024px] flex shadow-2xl"
      style={{ background: c.bg, color: "#e5e7eb", fontFamily: "Inter, sans-serif" }}>

      {/* ============ LEFT SIDEBAR ============ */}
      <aside className="w-[312px] px-7 py-8" style={{ background: "rgba(0,0,0,0.25)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex justify-center mb-5">
          <div className="w-40 h-40 rounded-full p-[3px]" style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accent2})` }}>
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center" style={{ background: c.panel }}>
              {data.photo ? <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
                : <Icon name="User" size={64} className="text-gray-600" />}
            </div>
          </div>
        </div>

        <h1 className="text-center text-3xl font-extrabold leading-tight">
          {data.name.split(" ").map((w, i) => (
            <span key={i} style={{ color: i % 2 === 1 ? c.accent2 : "#fff" }}>{w} </span>
          ))}
        </h1>
        <p className="text-center font-medium mt-1" style={{ color: c.accent }}>{data.role}</p>

        {data.available && (
          <div className="flex justify-center mt-3">
            <span className="flex items-center gap-2 text-[12px] rounded-full px-3 py-1"
              style={{ color: c.green, border: `1px solid ${c.green}66` }}>
              <span className="w-2 h-2 rounded-full" style={{ background: c.green }} /> AVAILABLE FOR WORK
            </span>
          </div>
        )}

        {/* Contact */}
        <div className="mt-7">
          <SectionTitle icon="Terminal" accent={c.accent}>Contact</SectionTitle>
          <ul className="space-y-2.5 text-[13px] text-gray-300">
            {[["Mail", data.contact.email], ["Phone", data.contact.phone], ["MapPin", data.contact.location],
              ["Globe", data.contact.website], ["Github", data.contact.github], ["Linkedin", data.contact.linkedin]]
              .map(([ic, val], i) => val ? (
                <li key={i} className="flex items-center gap-3">
                  <Icon name={ic} size={15} style={{ color: c.accent }} className="shrink-0" />
                  <span className="break-all">{val}</span>
                </li>) : null)}
          </ul>
        </div>

        {data.about && (
          <div className="mt-7">
            <SectionTitle icon="User" accent={c.accent}>About Me</SectionTitle>
            <p className="text-[13px] leading-relaxed text-gray-400">{data.about}</p>
          </div>
        )}

        {data.techStack.length > 0 && (
          <div className="mt-7">
            <SectionTitle icon={th.icons.stack} accent={c.accent}>{th.labels.stack}</SectionTitle>
            <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
              {data.techStack.map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ ...iconBox, color: c.accent2 }}>
                    {t.replace(/[^A-Za-z0-9]/g, "").slice(0, 3)}
                  </div>
                  <span className="text-[10px] text-gray-400 leading-tight">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.tools.length > 0 && (
          <div className="mt-7">
            <SectionTitle icon="Wrench" accent={c.accent}>Tools</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {data.tools.map((t, i) => <span key={i} style={chipStyle} className="text-gray-300">{t}</span>)}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="mt-7">
            <SectionTitle icon="Languages" accent={c.accent}>Languages</SectionTitle>
            <div className="space-y-3">
              {data.languages.map((l, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-gray-300">{l.name}</span><span className="text-gray-500">{l.note}</span>
                  </div>
                  <Bar level={l.level} from={c.accent2} to={c.accent} />
                </div>
              ))}
            </div>
          </div>
        )}

        {data.interests.length > 0 && (
          <div className="mt-7">
            <SectionTitle icon="Heart" accent={c.accent}>Interests</SectionTitle>
            <div className="grid grid-cols-3 gap-3 text-center">
              {data.interests.map((it, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={iconBox}>
                    <Icon name="Sparkles" size={16} style={{ color: c.accent }} />
                  </div>
                  <span className="text-[10px] text-gray-400">{it}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ============ RIGHT MAIN ============ */}
      <main className="flex-1 px-9 py-8">
        <div className="flex items-start justify-between pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="max-w-[70%]">
            <div className="flex items-center gap-3 mb-2">
              <Icon name={th.icons.header} size={22} style={{ color: c.accent }} />
              <h2 className="text-2xl font-extrabold text-white tracking-wide">{data.title}</h2>
            </div>
            <p className="text-[14px] leading-relaxed text-gray-400">{data.summary}</p>
          </div>
          <Icon name={th.icons.header} size={40} style={{ color: c.accent2 }} className="mt-1" />
        </div>

        {/* Technical Skills */}
        <section className="mt-7">
          <SectionTitle icon={th.icons.skills} accent={c.accent}>Technical Skills</SectionTitle>
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            {[skillsLeft, skillsRight].map((col, ci) => (
              <div key={ci} className="space-y-4">
                {col.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0" style={{ ...iconBox, color: c.accent2 }}>
                      {s.name.slice(0, 2)}
                    </div>
                    <span className="text-[13px] text-gray-300 w-28 shrink-0">{s.name}</span>
                    <Bar level={s.level} from={c.accent2} to={c.accent} />
                    <span className="text-[12px] text-gray-400 w-10 text-right shrink-0">{s.level}%</span>
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
            <div className="relative pl-6">
              <div className="absolute left-[6px] top-2 bottom-2 w-[2px]" style={{ background: `linear-gradient(180deg, ${c.accent}, ${c.accent}22)` }} />
              {data.experience.map((e, i) => (
                <div key={i} className="relative mb-6 last:mb-0">
                  <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full" style={{ background: c.accent, boxShadow: `0 0 0 4px ${c.bg}` }} />
                  <div className="flex justify-between">
                    <h4 className="text-[15px] font-semibold" style={{ color: c.accent }}>{e.title}</h4>
                    <span className="text-[12px] text-gray-500">{e.period}</span>
                  </div>
                  <p className="text-[13px] text-gray-400 mb-1">{e.company}</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[13px] text-gray-400">
                    {e.points.map((p, pi) => <li key={pi}>{p}</li>)}
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
            <div className="grid grid-cols-4 gap-4">
              {data.projects.map((p, i) => (
                <div key={i} className="rounded-xl p-4 flex flex-col" style={{ background: c.card, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon name={th.icons.projects} size={22} style={{ color: c.accent }} className="mb-3" />
                  <h5 className="text-[13px] font-semibold mb-1" style={{ color: c.accent2 }}>{p.name}</h5>
                  <p className="text-[11px] text-gray-400 leading-snug flex-1">{p.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.tags.map((t, ti) => <span key={ti} style={{ ...chipStyle, fontSize: 9 }} className="text-gray-300">{t}</span>)}
                  </div>
                  <div className="flex gap-3 mt-3 text-gray-500">
                    <Icon name="Github" size={15} /><Icon name="ExternalLink" size={15} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education + Certifications */}
        <section className="mt-8 grid grid-cols-2 gap-8">
          {data.education.length > 0 && (
            <div>
              <SectionTitle icon="GraduationCap" accent={c.accent}>Education</SectionTitle>
              <div className="relative pl-6">
                <div className="absolute left-[6px] top-2 bottom-2 w-[2px]" style={{ background: `linear-gradient(180deg, ${c.accent}, ${c.accent}22)` }} />
                {data.education.map((ed, i) => (
                  <div key={i} className="relative mb-4 last:mb-0">
                    <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full" style={{ background: c.accent, boxShadow: `0 0 0 4px ${c.bg}` }} />
                    <h4 className="text-[14px] font-semibold text-white">{ed.degree}</h4>
                    <p className="text-[13px] text-gray-400">{ed.institute}</p>
                    <p className="text-[12px] text-gray-500">{ed.period}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.certifications.length > 0 && (
            <div>
              <SectionTitle icon="Award" accent={c.accent}>Certifications</SectionTitle>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {data.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-gray-300">
                    <Icon name="BadgeCheck" size={15} style={{ color: c.accent2 }} className="shrink-0" />
                    <span>{cert}</span>
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
            <div className="grid grid-cols-4 gap-4">
              {data.achievements.map((a, i) => (
                <div key={i} className="rounded-xl p-4 flex items-center gap-3" style={{ background: c.card, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon name={["Rocket", "Boxes", "Gauge", "Users"][i % 4]} size={26} style={{ color: c.accent }} />
                  <div>
                    <div className="text-xl font-bold" style={{ color: c.accent2 }}>{a.value}</div>
                    <div className="text-[11px] text-gray-400 leading-tight">{a.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stats */}
        {data.githubStats.length > 0 && (
          <section className="mt-8">
            <SectionTitle icon={th.icons.stats} accent={c.accent}>{th.stackTitle}</SectionTitle>
            <div className="flex items-center justify-between rounded-xl p-5" style={{ background: c.card, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="grid grid-cols-4 gap-8 flex-1">
                {data.githubStats.map((g, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold" style={{ color: c.green }}>{g.value}</div>
                    <div className="text-[11px] text-gray-400">{g.label}</div>
                  </div>
                ))}
              </div>
              <div className="ml-6">
                <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
                  {Array.from({ length: 72 }).map((_, i) => {
                    const shades = [`${c.green}22`, `${c.green}55`, `${c.green}99`, c.green, c.accent2];
                    const col = shades[Math.floor(Math.random() * shades.length)];
                    return <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: col }} />;
                  })}
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-right">More activity, more results!</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
