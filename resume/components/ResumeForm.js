"use client";

function Field({ label, value, onChange, textarea, placeholder }) {
  return (
    <label className="block mb-3">
      <span className="text-[12px] font-medium text-gray-300">{label}</span>
      {textarea ? (
        <textarea
          className="mt-1 w-full rounded-md border border-gray-600 bg-white px-3 py-2 text-sm"
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-md border border-gray-600 bg-white px-3 py-2 text-sm"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function Group({ title, children }) {
  return (
    <div className="mb-6 border-b border-white/10 pb-5">
      <h3 className="text-sm font-bold text-accent2 uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function ResumeForm({ data, setData }) {
  const set = (path, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const setArr = (key, index, field, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      if (field === null) next[key][index] = value;
      else next[key][index][field] = value;
      return next;
    });
  };

  const addItem = (key, item) =>
    setData((prev) => ({ ...prev, [key]: [...prev[key], structuredClone(item)] }));

  const removeItem = (key, index) =>
    setData((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("photo", reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="text-gray-200">
      <Group title="Basic Info">
        <Field label="Full Name" value={data.name} onChange={(v) => set("name", v)} />
        <Field label="Role / Subtitle" value={data.role} onChange={(v) => set("role", v)} />
        <Field label="Header Title" value={data.title} onChange={(v) => set("title", v)} />
        <Field label="Header Summary" textarea value={data.summary} onChange={(v) => set("summary", v)} />
        <Field label="About Me" textarea value={data.about} onChange={(v) => set("about", v)} />
        <label className="flex items-center gap-2 text-[12px] text-gray-300 mt-1 mb-3">
          <input type="checkbox" checked={data.available} onChange={(e) => set("available", e.target.checked)} />
          Show &quot;Available for Work&quot; badge
        </label>
        <label className="block">
          <span className="text-[12px] font-medium text-gray-300">Profile Photo</span>
          <input type="file" accept="image/*" onChange={handlePhoto} className="mt-1 block text-xs text-gray-400" />
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
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input className="flex-1 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              value={s.name} onChange={(e) => setArr("technicalSkills", i, "name", e.target.value)} />
            <input type="number" min="0" max="100" className="w-16 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              value={s.level} onChange={(e) => setArr("technicalSkills", i, "level", Number(e.target.value))} />
            <button onClick={() => removeItem("technicalSkills", i)} className="text-red-400 text-xs px-2">✕</button>
          </div>
        ))}
        <button onClick={() => addItem("technicalSkills", { name: "New Skill", level: 80 })}
          className="text-xs text-accent2 mt-1">+ Add skill</button>
      </Group>

      <Group title="Tech Stack (comma separated)">
        <textarea className="w-full rounded-md border border-gray-600 bg-white px-3 py-2 text-sm" rows={2}
          value={data.techStack.join(", ")}
          onChange={(e) => set("techStack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
      </Group>

      <Group title="Tools (comma separated)">
        <textarea className="w-full rounded-md border border-gray-600 bg-white px-3 py-2 text-sm" rows={2}
          value={data.tools.join(", ")}
          onChange={(e) => set("tools", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
      </Group>

      <Group title="Experience">
        {data.experience.map((e, i) => (
          <div key={i} className="mb-4 rounded-md bg-white/5 p-3">
            <input className="w-full mb-2 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Job Title" value={e.title} onChange={(ev) => setArr("experience", i, "title", ev.target.value)} />
            <input className="w-full mb-2 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Company" value={e.company} onChange={(ev) => setArr("experience", i, "company", ev.target.value)} />
            <input className="w-full mb-2 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Period" value={e.period} onChange={(ev) => setArr("experience", i, "period", ev.target.value)} />
            <textarea className="w-full rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm" rows={3}
              placeholder="One bullet per line" value={e.points.join("\n")}
              onChange={(ev) => setArr("experience", i, "points", ev.target.value.split("\n").filter(Boolean))} />
            <button onClick={() => removeItem("experience", i)} className="text-red-400 text-xs mt-1">Remove</button>
          </div>
        ))}
        <button onClick={() => addItem("experience", { title: "", company: "", period: "", points: [""] })}
          className="text-xs text-accent2">+ Add experience</button>
      </Group>

      <Group title="Projects">
        {data.projects.map((p, i) => (
          <div key={i} className="mb-4 rounded-md bg-white/5 p-3">
            <input className="w-full mb-2 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Project Name" value={p.name} onChange={(ev) => setArr("projects", i, "name", ev.target.value)} />
            <textarea className="w-full mb-2 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm" rows={2}
              placeholder="Description" value={p.description} onChange={(ev) => setArr("projects", i, "description", ev.target.value)} />
            <input className="w-full rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Tags (comma separated)" value={p.tags.join(", ")}
              onChange={(ev) => setArr("projects", i, "tags", ev.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
            <button onClick={() => removeItem("projects", i)} className="text-red-400 text-xs mt-1">Remove</button>
          </div>
        ))}
        <button onClick={() => addItem("projects", { name: "", description: "", tags: [] })}
          className="text-xs text-accent2">+ Add project</button>
      </Group>

      <Group title="Education">
        {data.education.map((ed, i) => (
          <div key={i} className="mb-4 rounded-md bg-white/5 p-3">
            <input className="w-full mb-2 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Degree" value={ed.degree} onChange={(ev) => setArr("education", i, "degree", ev.target.value)} />
            <input className="w-full mb-2 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Institute" value={ed.institute} onChange={(ev) => setArr("education", i, "institute", ev.target.value)} />
            <input className="w-full rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Period" value={ed.period} onChange={(ev) => setArr("education", i, "period", ev.target.value)} />
            <button onClick={() => removeItem("education", i)} className="text-red-400 text-xs mt-1">Remove</button>
          </div>
        ))}
        <button onClick={() => addItem("education", { degree: "", institute: "", period: "" })}
          className="text-xs text-accent2">+ Add education</button>
      </Group>

      <Group title="Certifications (comma separated)">
        <textarea className="w-full rounded-md border border-gray-600 bg-white px-3 py-2 text-sm" rows={2}
          value={data.certifications.join(", ")}
          onChange={(e) => set("certifications", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
      </Group>

      <Group title="Achievements">
        {data.achievements.map((a, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className="w-24 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="25+" value={a.value} onChange={(e) => setArr("achievements", i, "value", e.target.value)} />
            <input className="flex-1 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Label" value={a.label} onChange={(e) => setArr("achievements", i, "label", e.target.value)} />
            <button onClick={() => removeItem("achievements", i)} className="text-red-400 text-xs px-2">✕</button>
          </div>
        ))}
        <button onClick={() => addItem("achievements", { value: "", label: "" })} className="text-xs text-accent2">+ Add achievement</button>
      </Group>

      <Group title="Languages">
        {data.languages.map((l, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input className="flex-1 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Language" value={l.name} onChange={(e) => setArr("languages", i, "name", e.target.value)} />
            <input type="number" min="0" max="100" className="w-16 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              value={l.level} onChange={(e) => setArr("languages", i, "level", Number(e.target.value))} />
            <input className="w-28 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Note" value={l.note} onChange={(e) => setArr("languages", i, "note", e.target.value)} />
            <button onClick={() => removeItem("languages", i)} className="text-red-400 text-xs px-2">✕</button>
          </div>
        ))}
        <button onClick={() => addItem("languages", { name: "", level: 80, note: "" })} className="text-xs text-accent2">+ Add language</button>
      </Group>

      <Group title="Interests (comma separated)">
        <textarea className="w-full rounded-md border border-gray-600 bg-white px-3 py-2 text-sm" rows={2}
          value={data.interests.join(", ")}
          onChange={(e) => set("interests", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
      </Group>

      <Group title="GitHub Statistics">
        {data.githubStats.map((g, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className="w-24 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="50+" value={g.value} onChange={(e) => setArr("githubStats", i, "value", e.target.value)} />
            <input className="flex-1 rounded-md border border-gray-600 bg-white px-2 py-1.5 text-sm"
              placeholder="Label" value={g.label} onChange={(e) => setArr("githubStats", i, "label", e.target.value)} />
            <button onClick={() => removeItem("githubStats", i)} className="text-red-400 text-xs px-2">✕</button>
          </div>
        ))}
        <button onClick={() => addItem("githubStats", { value: "", label: "" })} className="text-xs text-accent2">+ Add stat</button>
      </Group>
    </div>
  );
}
