'use client';

import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { cleanBullet } from '@/lib/resumeUtils';

import type { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  resumeData?: ResumeData;
}

export function ResumePreview({ resumeData }: ResumePreviewProps = {}) {
  const storeResume = useResumeStore((s) => s.resume);
  const resume = resumeData ?? storeResume;
  const { personal, education, skills, projects, experience, certifications, summary, layout } = resume;

  const p = personal ?? { fullName: '', email: '', phone: '', location: '' };

  const style = layout ?? {
    themeColor: '#2563EB',
    fontSize: 'md',
    fontFamily: 'sans',
    lineHeight: 'normal',
    spacing: 'normal',
  };

  // Scaled container refs and state
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(1120);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          const parentWidth = parent.clientWidth;
          const availableWidth = parentWidth - 24; // 12px margin on sides
          const newScale = Math.min(availableWidth / 794, 1);
          setScale(newScale);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Defer for layouts to stabilize
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const measureHeight = () => {
      if (previewRef.current) {
        setContentHeight(previewRef.current.scrollHeight);
      }
    };
    measureHeight();
    const timer = setTimeout(measureHeight, 200);
    return () => clearTimeout(timer);
  }, [resume, scale]);

  // Font family mappings
  const fontStyles = {
    sans: "font-sans style-sans",
    serif: "font-serif style-serif",
    mono: "font-mono style-mono",
    display: "font-sans tracking-wide style-display",
  };
  const fontClass = fontStyles[style.fontFamily] ?? 'font-sans';

  // Font size config mapped to standard A4 printing sizes
  const sizeStyles = {
    sm: { body: 'text-[11px]', sub: 'text-[10px]', head: 'text-[11px]', title: 'text-xl', label: 'text-[10px]' },
    md: { body: 'text-xs', sub: 'text-[11px]', head: 'text-xs', title: 'text-2xl', label: 'text-[11px]' },
    lg: { body: 'text-sm', sub: 'text-xs', head: 'text-sm', title: 'text-3xl', label: 'text-xs' }
  };
  const size = sizeStyles[style.fontSize] ?? sizeStyles.md;

  // Line height config
  const lhStyles = {
    compact: 'leading-tight',
    normal: 'leading-normal',
    loose: 'leading-relaxed',
  };
  const lhClass = lhStyles[style.lineHeight] ?? 'leading-normal';

  // Margin/spacing config
  const spacingStyles = {
    compact: { mb: 'mb-2', space: 'space-y-1.5', gap: 'gap-y-1' },
    normal: { mb: 'mb-3', space: 'space-y-2.5', gap: 'gap-y-2' },
    loose: { mb: 'mb-4', space: 'space-y-3.5', gap: 'gap-y-2.5' },
  };
  const spacing = spacingStyles[style.spacing] ?? spacingStyles.normal;

  // Real margin padding for the printable element
  const spacingPaddings = {
    compact: '32px',
    normal: '48px',
    loose: '64px',
  };
  const paddingVal = spacingPaddings[style.spacing] ?? spacingPaddings.normal;

  const canvasHeight = Math.max(contentHeight, 1120);

  return (
    <div 
      ref={containerRef}
      className="w-full flex justify-center py-4 select-none"
    >
      {/* Google Fonts Link */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inconsolata:wght@400;700&family=Outfit:wght@400;500;700&display=swap"
        rel="stylesheet"
      />

      <div 
        style={{
          width: `${794 * scale}px`,
          height: `${canvasHeight * scale}px`,
          position: 'relative',
          transition: 'all 0.15s ease-out-in',
        }}
        className="rounded-lg shadow-md border border-slate-200 overflow-hidden bg-white"
      >
        {/* Printable Area */}
        <div
          id="resume-preview-content"
          ref={previewRef}
          className={`bg-white text-[#0F172A] ${fontClass} ${lhClass} absolute left-0 top-0 origin-top-left`}
          style={{
            width: '794px',
            minHeight: '1120px',
            padding: paddingVal,
            transform: `scale(${scale})`,
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div className={`text-center pb-3 border-b border-slate-200 ${spacing.mb}`}>
            <h1 className={`${size.title} font-bold tracking-tight text-slate-900`}>
              {p.fullName || 'Your Name'}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[10px] mt-2 text-slate-500 font-medium">
              {p.email && <span>{p.email}</span>}
              {p.phone && <><span>•</span><span>{p.phone}</span></>}
              {p.location && <><span>•</span><span>{p.location}</span></>}
              {(p.socials?.linkedIn || (p as any).linkedIn) && (
                <><span>•</span><span>{p.socials?.linkedIn || (p as any).linkedIn}</span></>
              )}
              {(p.socials?.github || (p as any).github) && (
                <><span>•</span><span>{p.socials?.github || (p as any).github}</span></>
              )}
              {(p.socials?.portfolio || (p as any).portfolio) && (
                <><span>•</span><span>{p.socials?.portfolio || (p as any).portfolio}</span></>
              )}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <section className={spacing.mb}>
              <h2 
                className={`${size.label} font-bold uppercase tracking-widest border-b pb-0.5 mb-2`}
                style={{ color: style.themeColor, borderColor: `${style.themeColor}55` }}
              >
                Professional Summary
              </h2>
              <p className={`${size.body} text-slate-700 leading-relaxed`}>{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section className={spacing.mb}>
              <h2 
                className={`${size.label} font-bold uppercase tracking-widest border-b pb-0.5 mb-2`}
                style={{ color: style.themeColor, borderColor: `${style.themeColor}55` }}
              >
                Experience
              </h2>
              <div className={spacing.space}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`${size.head} font-bold text-slate-800`}>{exp.role}</h3>
                      <span className="text-[10px] text-slate-500 italic font-medium whitespace-nowrap ml-4">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className={`${size.body} font-bold mb-1.5`} style={{ color: style.themeColor }}>{exp.company}</p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className={`${size.body} text-slate-700 list-disc pl-5 space-y-1`}>
                        {exp.bullets.map((b, i) => b && <li key={i} className="pl-0.5">{cleanBullet(b)}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className={spacing.mb}>
              <h2 
                className={`${size.label} font-bold uppercase tracking-widest border-b pb-0.5 mb-2`}
                style={{ color: style.themeColor, borderColor: `${style.themeColor}55` }}
              >
                Education
              </h2>
              <div className={spacing.gap}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className={`${size.head} font-bold text-slate-800`}>{edu.institution}</h3>
                      <span className="text-[10px] text-slate-500 italic font-medium whitespace-nowrap ml-4">
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>
                    <p className={`${size.body} text-slate-600 font-medium`}>
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                      {edu.cgpa && ` • Grade/CGPA: ${edu.cgpa}`}
                    </p>
                    {edu.highlights && (
                      <p className={`${size.body} text-slate-600 mt-1 pl-2.5 border-l border-slate-200 leading-relaxed whitespace-pre-wrap`}>
                        {edu.highlights}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className={spacing.mb}>
              <h2 
                className={`${size.label} font-bold uppercase tracking-widest border-b pb-0.5 mb-2`}
                style={{ color: style.themeColor, borderColor: `${style.themeColor}55` }}
              >
                Technical Skills
              </h2>
              <div className={`${size.body} text-slate-700`}>
                {Array.isArray(skills) && typeof skills[0] === 'string' ? (
                  skills.join(', ')
                ) : (
                  <div className="grid grid-cols-1 gap-1.5">
                    {(skills as any[]).map((g, idx) => (
                      <div key={idx} className="flex items-baseline">
                        <span className="font-bold text-slate-800 w-[140px] shrink-0 text-[11px] uppercase tracking-wider">{g.category || 'Skills'}:</span>
                        <span className={`${size.body} text-slate-700`}>{(g.skills || []).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section className={spacing.mb}>
              <h2 
                className={`${size.label} font-bold uppercase tracking-widest border-b pb-0.5 mb-2`}
                style={{ color: style.themeColor, borderColor: `${style.themeColor}55` }}
              >
                Projects
              </h2>
              <div className={spacing.space}>
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`${size.head} font-bold text-slate-800`}>
                        {proj.name}
                        {proj.link && (
                          <a 
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-500 hover:underline font-normal normal-case ml-2"
                          >
                            ({proj.link})
                          </a>
                        )}
                      </h3>
                    </div>
                    <p className="text-[10px] font-bold mb-1" style={{ color: style.themeColor }}>
                      {proj.techStack?.join(', ') || ''}
                    </p>
                    <p className={`${size.body} text-slate-700 leading-relaxed`}>{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section className="mb-2">
              <h2 
                className={`${size.label} font-bold uppercase tracking-widest border-b pb-0.5 mb-2`}
                style={{ color: style.themeColor, borderColor: `${style.themeColor}55` }}
              >
                Certifications
              </h2>
              <div className="space-y-1.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-baseline">
                    <span className={`${size.body} font-bold text-slate-800`}>
                      {cert.name}
                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-500 hover:underline font-normal ml-1"
                        >
                          ({cert.credentialUrl})
                        </a>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {cert.issuer} • {cert.date}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Font Family Helper Styles */}
      <style jsx global>{`
        .style-sans {
          font-family: 'Inter', sans-serif !important;
        }
        .style-serif {
          font-family: 'Playfair Display', Georgia, serif !important;
        }
        .style-mono {
          font-family: 'Inconsolata', monospace !important;
        }
        .style-display {
          font-family: 'Outfit', sans-serif !important;
        }
      `}</style>
    </div>
  );
}

