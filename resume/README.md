# IFDA Multi-Course Resume Builder (Next.js)

A resume builder that adapts one polished template to 14 different course fields.
Pick a course from the dropdown and the whole resume re-themes: colors, icons,
section labels, and starter content all change to match the profession. Users
edit any field live and export to PDF.

## Courses supported
Accounting · SAP · HR Executive · Data Analytics & BI · Stock Market & Forex ·
Artificial Intelligence · Programming & Software Development · Cyber Security &
Ethical Hacking · Digital Marketing · Web Design & Development · Mobile App
Development · Multimedia, Design & Animation · Computer Hardware & Networking ·
NIELIT Certified Courses

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Project structure
- `app/page.js`            main app: course selector + form + live preview + PDF
- `components/ResumeForm.js`   the editable form
- `components/ResumePreview.js` the theme-aware template (edit design here)
- `lib/themes.js`          all 14 course themes (colors, icons, labels, sample content)
- `lib/buildData.js`       builds full resume data from a chosen theme
- `lib/defaultData.js`     original single-theme default (kept for reference)

## How theming works
Each course in `lib/themes.js` defines:
- `colors`  – accent, accent2, backgrounds (drives every colored element)
- `icons`   – lucide icon names for header / skills / stack / projects / stats
- `labels`  – section titles (e.g. "Trading Strategies" vs "Featured Projects")
- `sample`  – profession-specific skills, projects, certs, achievements, etc.

To add a new course, add one entry to the `themes` object — no other file changes needed.

## Notes
- Photo upload is stored as base64 (no backend).
- PDF export uses html2canvas + jsPDF, client-side. The resume is cloned to an
  off-screen 1024px container (transform stripped) before capture, then fitted to
  an A4-width page so text stays a normal, readable size with no layout errors.
- To persist a user's resume, save the `data` object to localStorage or your DB.
- Tech-stack/tool badges currently use text abbreviations; swap in real SVG logos
  (or `react-icons`) if you want the colored brand icons.
