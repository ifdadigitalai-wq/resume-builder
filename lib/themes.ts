// Theme + content presets for each course/field.
// Each theme controls: accent colors, lucide icon names, section labels,
// and starter sample data so the resume feels native to that profession.

export interface ThemeColors {
  bg: string;
  card: string;
  panel: string;
  accent: string;
  accent2: string;
  green: string;
}

export interface ThemeIcons {
  header: string;
  skills: string;
  stack: string;
  experience: string;
  projects: string;
  stats: string;
}

export interface ThemeLabels {
  title: string;
  stack: string;
  projects: string;
  stats: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface ProjectItem {
  name: string;
  description: string;
  tags: string[];
}

export interface AchievementItem {
  value: string;
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface LanguageItem {
  name: string;
  level: number;
  note: string;
}

export interface ThemeSample {
  role: string;
  title: string;
  summary: string;
  about: string;
  skills: SkillItem[];
  stack: string[];
  tools: string[];
  projects: ProjectItem[];
  certs: string[];
  achievements: AchievementItem[];
  interests: string[];
  stats: StatItem[];
  stackTitle: string;
}

export interface ThemeConfig {
  key: string;
  label: string;
  colors: ThemeColors;
  icons: ThemeIcons;
  labels: ThemeLabels;
  sample: ThemeSample;
}

export const themes: Record<string, ThemeConfig> = {
  accounting: {
    key: "accounting",
    label: "Accounting",
    colors: { bg: "#0a1410", card: "#0f1a14", panel: "#12231b", accent: "#10b981", accent2: "#34d399", green: "#22c55e" },
    icons: { header: "Calculator", skills: "Calculator", stack: "Landmark", experience: "Briefcase", projects: "FileSpreadsheet", stats: "TrendingUp" },
    labels: { title: "SENIOR ACCOUNTANT", stack: "Software & Standards", projects: "Key Engagements", stats: "Career Numbers" },
    sample: {
      role: "Chartered / Financial Accountant",
      title: "SENIOR ACCOUNTANT",
      summary: "Detail-driven accountant experienced in financial reporting, statutory compliance, and month-end close under Indian GAAP and GST regulations.",
      about: "Accounting professional skilled in bookkeeping, reconciliation, taxation, and audit support. I turn raw transactions into accurate, decision-ready financial statements.",
      skills: [
        { name: "Tally Prime", level: 95 }, { name: "GST & TDS", level: 92 }, { name: "Excel / MIS", level: 90 },
        { name: "Financial Reporting", level: 88 }, { name: "Auditing", level: 85 }, { name: "SAP FICO", level: 78 },
      ],
      stack: ["Tally", "Zoho Books", "QuickBooks", "SAP", "Excel", "GST Portal", "TDS", "MS Word", "PowerBI", "Busy", "Marg", "Payroll"],
      tools: ["Tally Prime", "Excel", "Zoho", "QuickBooks", "SAP FICO", "GST Portal", "TDS Software", "PowerBI"],
      projects: [
        { name: "GST Filing System", description: "Monthly GSTR-1 & 3B filing for 40+ clients with reconciliation.", tags: ["GST", "Tally", "Excel"] },
        { name: "Financial Dashboard", description: "Automated P&L and balance-sheet MIS for management review.", tags: ["Excel", "PowerBI"] },
        { name: "Audit Support", description: "Prepared schedules and vouchers for statutory audit.", tags: ["Audit", "Tally"] },
        { name: "Payroll Processing", description: "End-to-end payroll with PF, ESI and TDS compliance.", tags: ["Payroll", "Compliance"] },
      ],
      certs: ["Tally Prime with GST", "Advanced Excel for Accounts", "Income Tax & TDS", "SAP FICO", "GST Practitioner", "Financial Modelling"],
      achievements: [ { value: "500+", label: "Returns Filed" }, { value: "40+", label: "Clients Handled" }, { value: "99%", label: "Accuracy Rate" }, { value: "0", label: "Audit Objections" } ],
      interests: ["Finance", "Taxation", "Auditing", "Excel", "Compliance"],
      stats: [ { value: "500+", label: "Vouchers" }, { value: "40+", label: "Clients" }, { value: "12+", label: "Audits" }, { value: "99%", label: "Accuracy" } ],
      stackTitle: "Financial Activity",
    },
  },

  sap: {
    key: "sap",
    label: "SAP",
    colors: { bg: "#0a0f1a", card: "#0f1626", panel: "#121c30", accent: "#0ea5e9", accent2: "#38bdf8", green: "#22c55e" },
    icons: { header: "Boxes", skills: "Boxes", stack: "Database", experience: "Briefcase", projects: "Workflow", stats: "TrendingUp" },
    labels: { title: "SAP CONSULTANT", stack: "SAP Modules", projects: "Implementations", stats: "Project Metrics" },
    sample: {
      role: "SAP Functional Consultant",
      title: "SAP CONSULTANT",
      summary: "SAP consultant experienced in end-to-end implementation, configuration, and support across FICO, MM and SD modules for enterprise clients.",
      about: "SAP professional focused on business-process mapping, configuration and user training. I bridge finance/operations teams with clean, scalable SAP solutions.",
      skills: [
        { name: "SAP FICO", level: 93 }, { name: "SAP MM", level: 88 }, { name: "SAP SD", level: 85 },
        { name: "S/4HANA", level: 82 }, { name: "ABAP Basics", level: 70 }, { name: "Business Process", level: 90 },
      ],
      stack: ["FICO", "MM", "SD", "S/4HANA", "Fiori", "ABAP", "SAP GUI", "Solution Mgr", "LSMW", "IDoc", "BAPI", "Excel"],
      tools: ["SAP GUI", "S/4HANA", "Fiori", "Solution Manager", "LSMW", "Excel", "Jira", "ServiceNow"],
      projects: [
        { name: "S/4HANA Migration", description: "Migrated legacy ECC to S/4HANA for a manufacturing client.", tags: ["S/4HANA", "FICO"] },
        { name: "Procure-to-Pay", description: "Configured MM procurement cycle with approval workflows.", tags: ["MM", "Workflow"] },
        { name: "Order-to-Cash", description: "Implemented SD order and billing processes.", tags: ["SD", "Billing"] },
        { name: "Fiori Rollout", description: "Deployed Fiori apps for finance self-service.", tags: ["Fiori", "UX"] },
      ],
      certs: ["SAP FICO Certification", "SAP MM", "SAP SD", "S/4HANA Finance", "SAP Activate", "Business Process"],
      achievements: [ { value: "8+", label: "Implementations" }, { value: "300+", label: "Users Trained" }, { value: "5", label: "Modules" }, { value: "98%", label: "Uptime" } ],
      interests: ["ERP", "Automation", "Finance", "Consulting", "Process"],
      stats: [ { value: "8+", label: "Go-Lives" }, { value: "300+", label: "Users" }, { value: "20+", label: "RICEFW" }, { value: "5", label: "Modules" } ],
      stackTitle: "Module Activity",
    },
  },

  hr: {
    key: "hr",
    label: "HR Executive",
    colors: { bg: "#150a14", card: "#1c0f1a", panel: "#251221", accent: "#ec4899", accent2: "#f472b6", green: "#22c55e" },
    icons: { header: "Users", skills: "Users", stack: "ClipboardList", experience: "Briefcase", projects: "UserPlus", stats: "TrendingUp" },
    labels: { title: "HR EXECUTIVE", stack: "HR Tools & Systems", projects: "HR Initiatives", stats: "People Metrics" },
    sample: {
      role: "Human Resources Executive",
      title: "HR EXECUTIVE",
      summary: "People-focused HR executive experienced in recruitment, onboarding, payroll and employee engagement across fast-growing teams.",
      about: "HR professional passionate about building great workplaces. I handle the full employee lifecycle, from hiring to retention, with empathy and structure.",
      skills: [
        { name: "Recruitment", level: 93 }, { name: "Payroll & Compliance", level: 88 }, { name: "Employee Relations", level: 90 },
        { name: "HRMS", level: 85 }, { name: "Onboarding", level: 87 }, { name: "L&D", level: 80 },
      ],
      stack: ["Recruitment", "Payroll", "HRMS", "Onboarding", "PF/ESI", "Engagement", "L&D", "Appraisal", "Excel", "LinkedIn", "Naukri", "Zoho"],
      tools: ["Zoho People", "Keka", "Excel", "LinkedIn Recruiter", "Naukri", "GreytHR", "Slack", "MS Office"],
      projects: [
        { name: "Hiring Drive", description: "Closed 50+ positions across tech and ops in one quarter.", tags: ["Recruitment", "Sourcing"] },
        { name: "Onboarding Program", description: "Built a structured 30-60-90 day onboarding journey.", tags: ["Onboarding", "L&D"] },
        { name: "Engagement Survey", description: "Ran org-wide survey and improved eNPS by 20 points.", tags: ["Engagement", "Analytics"] },
        { name: "Payroll Automation", description: "Streamlined monthly payroll and statutory filings.", tags: ["Payroll", "Compliance"] },
      ],
      certs: ["HR Generalist", "Payroll Management", "Labour Law Compliance", "HR Analytics", "Talent Acquisition", "POSH Certified"],
      achievements: [ { value: "200+", label: "Hires Made" }, { value: "95%", label: "Retention" }, { value: "30d", label: "Avg. Time-to-Hire" }, { value: "20+", label: "eNPS Gain" } ],
      interests: ["People", "Culture", "Hiring", "Wellness", "Training"],
      stats: [ { value: "200+", label: "Hires" }, { value: "95%", label: "Retention" }, { value: "12+", label: "Programs" }, { value: "500+", label: "Employees" } ],
      stackTitle: "HR Activity",
    },
  },

  dataAnalytics: {
    key: "dataAnalytics",
    label: "Data Analytics & BI",
    colors: { bg: "#0a0e1a", card: "#0f1524", panel: "#111827", accent: "#f59e0b", accent2: "#fbbf24", green: "#22c55e" },
    icons: { header: "BarChart3", skills: "BarChart3", stack: "Database", experience: "Briefcase", projects: "PieChart", stats: "TrendingUp" },
    labels: { title: "DATA ANALYST", stack: "Data Stack", projects: "Analytics Projects", stats: "Impact Metrics" },
    sample: {
      role: "Data Analyst & BI Developer",
      title: "DATA ANALYST",
      summary: "Analytical problem-solver turning messy data into clear dashboards and insights that drive business decisions.",
      about: "Data analyst skilled in SQL, Python, and BI tools. I love finding the story hidden in data and communicating it through clean visualisations.",
      skills: [
        { name: "SQL", level: 93 }, { name: "Power BI", level: 90 }, { name: "Python", level: 88 },
        { name: "Excel", level: 92 }, { name: "Tableau", level: 82 }, { name: "Statistics", level: 80 },
      ],
      stack: ["SQL", "Python", "PowerBI", "Tableau", "Excel", "Pandas", "NumPy", "MySQL", "BigQuery", "DAX", "Looker", "Jupyter"],
      tools: ["Power BI", "Tableau", "SQL Server", "Excel", "Python", "Jupyter", "Looker", "BigQuery"],
      projects: [
        { name: "Sales Dashboard", description: "Interactive Power BI dashboard tracking KPIs across regions.", tags: ["PowerBI", "DAX", "SQL"] },
        { name: "Churn Analysis", description: "Predicted customer churn and reduced it by 15%.", tags: ["Python", "ML"] },
        { name: "Revenue Forecast", description: "Time-series forecasting of monthly revenue.", tags: ["Python", "Stats"] },
        { name: "Data Pipeline", description: "Automated ETL from multiple sources into a warehouse.", tags: ["SQL", "ETL"] },
      ],
      certs: ["Power BI Data Analyst", "SQL for Data Analytics", "Python for Data Science", "Tableau Desktop", "Google Data Analytics", "Statistics"],
      achievements: [ { value: "30+", label: "Dashboards Built" }, { value: "1M+", label: "Rows Analyzed" }, { value: "15%", label: "Churn Reduced" }, { value: "10+", label: "Reports Automated" } ],
      interests: ["Data", "Visualization", "Statistics", "ML", "Storytelling"],
      stats: [ { value: "30+", label: "Dashboards" }, { value: "1M+", label: "Rows" }, { value: "50+", label: "Queries" }, { value: "12+", label: "Reports" } ],
      stackTitle: "Data Activity",
    },
  },

  stockMarket: {
    key: "stockMarket",
    label: "Stock Market & Forex",
    colors: { bg: "#0f0d08", card: "#1a1710", panel: "#231e14", accent: "#eab308", accent2: "#facc15", green: "#22c55e" },
    icons: { header: "CandlestickChart", skills: "CandlestickChart", stack: "LineChart", experience: "Briefcase", projects: "TrendingUp", stats: "DollarSign" },
    labels: { title: "MARKET ANALYST", stack: "Trading Toolkit", projects: "Trading Strategies", stats: "Trading Metrics" },
    sample: {
      role: "Stock Market & Forex Analyst",
      title: "MARKET ANALYST",
      summary: "Market analyst skilled in technical and fundamental analysis across equities, forex and derivatives with disciplined risk management.",
      about: "Trader and analyst focused on price action, chart patterns and macro trends. I combine data and discipline to build repeatable strategies.",
      skills: [
        { name: "Technical Analysis", level: 92 }, { name: "Fundamental Analysis", level: 88 }, { name: "Risk Management", level: 90 },
        { name: "Options & Futures", level: 84 }, { name: "Forex", level: 82 }, { name: "Algo Trading", level: 72 },
      ],
      stack: ["TradingView", "NSE", "BSE", "MetaTrader", "Zerodha", "Options", "Futures", "Forex", "Python", "Excel", "Charting", "Screener"],
      tools: ["TradingView", "Zerodha Kite", "MetaTrader", "Screener.in", "Excel", "Python", "Sensibull", "Chartink"],
      projects: [
        { name: "Swing Strategy", description: "Backtested a swing-trading strategy with 1.8 risk-reward.", tags: ["Technical", "Backtest"] },
        { name: "Options Model", description: "Built an options-selling model with defined risk.", tags: ["Options", "Excel"] },
        { name: "Forex System", description: "Trend-following forex system on major pairs.", tags: ["Forex", "Algo"] },
        { name: "Stock Screener", description: "Automated screener for fundamentally strong stocks.", tags: ["Python", "Screening"] },
      ],
      certs: ["NISM Equity Derivatives", "Technical Analysis", "NISM Research Analyst", "Options Trading", "Forex Trading", "Risk Management"],
      achievements: [ { value: "1.8", label: "Risk-Reward" }, { value: "500+", label: "Trades Logged" }, { value: "65%", label: "Win Rate" }, { value: "3+", label: "Strategies" } ],
      interests: ["Markets", "Charts", "Macro", "Options", "Trading"],
      stats: [ { value: "500+", label: "Trades" }, { value: "65%", label: "Win Rate" }, { value: "3+", label: "Systems" }, { value: "50+", label: "Backtests" } ],
      stackTitle: "Trading Activity",
    },
  },

  ai: {
    key: "ai",
    label: "Artificial Intelligence",
    colors: { bg: "#0d0a1a", card: "#140f26", panel: "#1a1235", accent: "#8b5cf6", accent2: "#a78bfa", green: "#22c55e" },
    icons: { header: "BrainCircuit", skills: "BrainCircuit", stack: "Cpu", experience: "Briefcase", projects: "Bot", stats: "TrendingUp" },
    labels: { title: "AI / ML ENGINEER", stack: "AI Stack", projects: "AI Projects", stats: "Model Metrics" },
    sample: {
      role: "AI / Machine Learning Engineer",
      title: "AI / ML ENGINEER",
      summary: "AI engineer building intelligent systems with machine learning, deep learning and LLMs, from data to deployed models.",
      about: "AI/ML practitioner who loves turning research into real products. I work across NLP, computer vision and generative AI to solve practical problems.",
      skills: [
        { name: "Python", level: 94 }, { name: "Machine Learning", level: 90 }, { name: "Deep Learning", level: 87 },
        { name: "NLP / LLMs", level: 88 }, { name: "TensorFlow", level: 84 }, { name: "PyTorch", level: 82 },
      ],
      stack: ["Python", "TensorFlow", "PyTorch", "Scikit", "Pandas", "NumPy", "OpenAI", "LangChain", "HuggingFace", "OpenCV", "Docker", "FastAPI"],
      tools: ["Jupyter", "VS Code", "Colab", "Docker", "Git", "HuggingFace", "OpenAI API", "Weights & Biases"],
      projects: [
        { name: "Chatbot with LLM", description: "RAG chatbot over company docs using LangChain & OpenAI.", tags: ["LLM", "RAG", "Python"] },
        { name: "Image Classifier", description: "CNN model classifying products with 96% accuracy.", tags: ["CV", "PyTorch"] },
        { name: "Sentiment Engine", description: "NLP pipeline scoring customer reviews in real time.", tags: ["NLP", "ML"] },
        { name: "Recommender", description: "Collaborative-filtering recommendation system.", tags: ["ML", "Python"] },
      ],
      certs: ["Machine Learning", "Deep Learning Specialization", "NLP with Transformers", "TensorFlow Developer", "Generative AI", "MLOps"],
      achievements: [ { value: "96%", label: "Model Accuracy" }, { value: "15+", label: "Models Deployed" }, { value: "5+", label: "AI Products" }, { value: "1M+", label: "Predictions" } ],
      interests: ["AI", "Deep Learning", "NLP", "Robotics", "Research"],
      stats: [ { value: "15+", label: "Models" }, { value: "5+", label: "Products" }, { value: "40+", label: "Experiments" }, { value: "96%", label: "Best Acc." } ],
      stackTitle: "Model Activity",
    },
  },

  programming: {
    key: "programming",
    label: "Programming & Software Dev",
    colors: { bg: "#0a0e1a", card: "#0f1524", panel: "#111827", accent: "#7c5cff", accent2: "#4f8cff", green: "#22c55e" },
    icons: { header: "Terminal", skills: "Code2", stack: "Code2", experience: "Briefcase", projects: "FolderGit2", stats: "Github" },
    labels: { title: "SOFTWARE DEVELOPER", stack: "Tech Stack", projects: "Featured Projects", stats: "Github Statistics" },
    sample: {
      role: "Software Developer",
      title: "SOFTWARE DEVELOPER",
      summary: "Software developer building reliable, scalable applications with clean, maintainable code across the stack.",
      about: "Passionate developer with strong fundamentals in DSA and OOP. I enjoy solving problems and shipping well-tested software.",
      skills: [
        { name: "Java", level: 92 }, { name: "Python", level: 90 }, { name: "C++", level: 85 },
        { name: "DSA", level: 88 }, { name: "SQL", level: 84 }, { name: "Git", level: 86 },
      ],
      stack: ["Java", "Python", "C++", "JavaScript", "Spring", "SQL", "Git", "GitHub", "Docker", "REST", "Linux", "DSA"],
      tools: ["VS Code", "IntelliJ", "Git", "GitHub", "Postman", "Docker", "Linux", "Jira"],
      projects: [
        { name: "Library System", description: "OOP-based library management app in Java + MySQL.", tags: ["Java", "MySQL"] },
        { name: "REST API", description: "Scalable REST API with Spring Boot and JWT auth.", tags: ["Spring", "REST"] },
        { name: "CLI Tool", description: "Python command-line automation tool.", tags: ["Python", "CLI"] },
        { name: "Algo Visualizer", description: "Web app visualising sorting & pathfinding.", tags: ["JS", "DSA"] },
      ],
      certs: ["Data Structures & Algorithms", "Java Programming", "Python Development", "OOP Concepts", "Git & GitHub", "SQL Databases"],
      achievements: [ { value: "500+", label: "DSA Problems" }, { value: "25+", label: "Projects" }, { value: "10+", label: "Repos" }, { value: "3+", label: "Languages" } ],
      interests: ["Coding", "DSA", "Open Source", "System Design", "Gaming"],
      stats: [ { value: "50+", label: "Repositories" }, { value: "500+", label: "Commits" }, { value: "20+", label: "Projects" }, { value: "35+", label: "Contributions" } ],
      stackTitle: "Github Statistics",
    },
  },

  cyberSecurity: {
    key: "cyberSecurity",
    label: "Cyber Security & Ethical Hacking",
    colors: { bg: "#060c08", card: "#0a1410", panel: "#0d1c14", accent: "#22c55e", accent2: "#4ade80", green: "#22c55e" },
    icons: { header: "ShieldCheck", skills: "ShieldCheck", stack: "Lock", experience: "Briefcase", projects: "Bug", stats: "TrendingUp" },
    labels: { title: "SECURITY ANALYST", stack: "Security Toolkit", projects: "Security Work", stats: "Security Metrics" },
    sample: {
      role: "Cyber Security & Ethical Hacker",
      title: "SECURITY ANALYST",
      summary: "Security analyst skilled in penetration testing, vulnerability assessment and network defense to keep systems safe.",
      about: "Ethical hacker driven to find weaknesses before attackers do. I combine offensive testing with strong defensive practices.",
      skills: [
        { name: "Penetration Testing", level: 90 }, { name: "Network Security", level: 88 }, { name: "Linux", level: 90 },
        { name: "Cryptography", level: 80 }, { name: "OWASP Top 10", level: 87 }, { name: "SIEM", level: 78 },
      ],
      stack: ["Kali", "Nmap", "Burp", "Metasploit", "Wireshark", "Linux", "Python", "OWASP", "Nessus", "SIEM", "Firewall", "VPN"],
      tools: ["Kali Linux", "Burp Suite", "Nmap", "Metasploit", "Wireshark", "Nessus", "Splunk", "John the Ripper"],
      projects: [
        { name: "Web Pentest", description: "Full pentest of a web app; found and reported 12 vulns.", tags: ["Pentest", "OWASP"] },
        { name: "Network Audit", description: "Assessed network security and hardened firewall rules.", tags: ["Network", "Firewall"] },
        { name: "Phishing Sim", description: "Ran awareness phishing campaign for staff training.", tags: ["SocEng", "Awareness"] },
        { name: "SIEM Setup", description: "Deployed log monitoring and alerting with Splunk.", tags: ["SIEM", "Splunk"] },
      ],
      certs: ["CEH (Ethical Hacking)", "CompTIA Security+", "Network Security", "Penetration Testing", "OWASP", "Cyber Forensics"],
      achievements: [ { value: "50+", label: "Vulns Found" }, { value: "20+", label: "Pentests" }, { value: "0", label: "Breaches" }, { value: "12+", label: "Reports" } ],
      interests: ["Security", "Hacking", "Networking", "CTF", "Privacy"],
      stats: [ { value: "50+", label: "Vulns" }, { value: "20+", label: "Pentests" }, { value: "15+", label: "CTFs" }, { value: "12+", label: "Reports" } ],
      stackTitle: "Security Activity",
    },
  },

  digitalMarketing: {
    key: "digitalMarketing",
    label: "Digital Marketing",
    colors: { bg: "#140a10", card: "#1c0f18", panel: "#251221", accent: "#f97316", accent2: "#fb923c", green: "#22c55e" },
    icons: { header: "Megaphone", skills: "Megaphone", stack: "Share2", experience: "Briefcase", projects: "Target", stats: "TrendingUp" },
    labels: { title: "DIGITAL MARKETER", stack: "Marketing Stack", projects: "Campaigns", stats: "Growth Metrics" },
    sample: {
      role: "Digital Marketing Specialist",
      title: "DIGITAL MARKETER",
      summary: "Growth-focused digital marketer driving traffic, leads and conversions through SEO, ads and social media.",
      about: "Data-driven marketer who blends creativity with analytics. I build campaigns that grow brands and deliver measurable ROI.",
      skills: [
        { name: "SEO", level: 92 }, { name: "Google Ads", level: 90 }, { name: "Social Media", level: 88 },
        { name: "Content Marketing", level: 86 }, { name: "Email Marketing", level: 82 }, { name: "Analytics", level: 84 },
      ],
      stack: ["SEO", "Google Ads", "Meta Ads", "Analytics", "SEMrush", "Canva", "Mailchimp", "WordPress", "Hootsuite", "Ahrefs", "GA4", "GTM"],
      tools: ["Google Analytics", "SEMrush", "Meta Ads", "Canva", "Mailchimp", "Ahrefs", "WordPress", "Hootsuite"],
      projects: [
        { name: "SEO Campaign", description: "Grew organic traffic 3x in 6 months for a brand.", tags: ["SEO", "Content"] },
        { name: "Ad Campaign", description: "Google & Meta ads with 4x ROAS.", tags: ["Ads", "PPC"] },
        { name: "Social Growth", description: "Grew Instagram from 2k to 50k followers.", tags: ["Social", "Content"] },
        { name: "Email Funnel", description: "Automated email funnel converting at 8%.", tags: ["Email", "Funnel"] },
      ],
      certs: ["Google Ads Certified", "Google Analytics (GA4)", "Meta Blueprint", "SEO Specialist", "Content Marketing", "Email Marketing"],
      achievements: [ { value: "3x", label: "Traffic Growth" }, { value: "4x", label: "Ad ROAS" }, { value: "50k+", label: "Followers Gained" }, { value: "30+", label: "Campaigns" } ],
      interests: ["Marketing", "SEO", "Branding", "Content", "Analytics"],
      stats: [ { value: "30+", label: "Campaigns" }, { value: "4x", label: "ROAS" }, { value: "3x", label: "Traffic" }, { value: "100+", label: "Keywords" } ],
      stackTitle: "Campaign Activity",
    },
  },

  webDev: {
    key: "webDev",
    label: "Web Design & Development",
    colors: { bg: "#0a0e1a", card: "#0f1524", panel: "#111827", accent: "#06b6d4", accent2: "#22d3ee", green: "#22c55e" },
    icons: { header: "Code2", skills: "Code2", stack: "Layout", experience: "Briefcase", projects: "FolderGit2", stats: "Github" },
    labels: { title: "WEB DEVELOPER", stack: "Tech Stack", projects: "Featured Projects", stats: "Github Statistics" },
    sample: {
      role: "Full Stack Web Developer",
      title: "WEB DEVELOPER",
      summary: "Web developer crafting responsive, fast and accessible websites and web apps with modern frameworks.",
      about: "Passionate web developer who cares about clean UI and solid code. I build pixel-perfect, performant experiences end to end.",
      skills: [
        { name: "HTML / CSS", level: 95 }, { name: "JavaScript", level: 92 }, { name: "React", level: 90 },
        { name: "Node.js", level: 84 }, { name: "Tailwind", level: 90 }, { name: "MongoDB", level: 80 },
      ],
      stack: ["HTML5", "CSS3", "JavaScript", "React", "Next.js", "Tailwind", "Node.js", "Express", "MongoDB", "Git", "Figma", "Vercel"],
      tools: ["VS Code", "Figma", "Git", "GitHub", "Chrome DevTools", "Vercel", "Netlify", "Postman"],
      projects: [
        { name: "Portfolio Site", description: "Animated personal portfolio with dark mode.", tags: ["React", "Tailwind"] },
        { name: "E-Commerce", description: "Full-stack store with cart and payments.", tags: ["Next.js", "MongoDB"] },
        { name: "Landing Pages", description: "High-converting responsive landing pages.", tags: ["HTML", "CSS"] },
        { name: "Blog CMS", description: "Headless CMS blog with markdown support.", tags: ["Next.js", "CMS"] },
      ],
      certs: ["Responsive Web Design", "JavaScript Advanced", "React Development", "Node.js", "UI/UX Basics", "Git & GitHub"],
      achievements: [ { value: "40+", label: "Websites Built" }, { value: "95+", label: "Lighthouse Score" }, { value: "100%", label: "Responsive" }, { value: "25+", label: "Clients" } ],
      interests: ["Coding", "UI Design", "Open Source", "Web3", "Gaming"],
      stats: [ { value: "50+", label: "Repositories" }, { value: "500+", label: "Commits" }, { value: "40+", label: "Websites" }, { value: "35+", label: "Contributions" } ],
      stackTitle: "Github Statistics",
    },
  },

  mobileDev: {
    key: "mobileDev",
    label: "Mobile App Development",
    colors: { bg: "#0a0f14", card: "#0f1620", panel: "#121c28", accent: "#14b8a6", accent2: "#2dd4bf", green: "#22c55e" },
    icons: { header: "Smartphone", skills: "Smartphone", stack: "TabletSmartphone", experience: "Briefcase", projects: "AppWindow", stats: "TrendingUp" },
    labels: { title: "MOBILE DEVELOPER", stack: "Mobile Stack", projects: "Published Apps", stats: "App Metrics" },
    sample: {
      role: "Mobile App Developer",
      title: "MOBILE DEVELOPER",
      summary: "Mobile developer building smooth, native-quality apps for Android and iOS with Flutter and React Native.",
      about: "App developer focused on delightful mobile UX. I ship cross-platform apps that are fast, beautiful and reliable.",
      skills: [
        { name: "Flutter", level: 92 }, { name: "React Native", level: 86 }, { name: "Dart", level: 90 },
        { name: "Kotlin", level: 78 }, { name: "Firebase", level: 85 }, { name: "REST APIs", level: 84 },
      ],
      stack: ["Flutter", "Dart", "React Native", "Kotlin", "Swift", "Firebase", "SQLite", "REST", "Redux", "Provider", "Git", "Figma"],
      tools: ["Android Studio", "VS Code", "Xcode", "Figma", "Firebase", "Git", "Postman", "Play Console"],
      projects: [
        { name: "Food Delivery App", description: "Cross-platform delivery app with live tracking.", tags: ["Flutter", "Firebase"] },
        { name: "Fitness Tracker", description: "Workout & step tracker with charts.", tags: ["React Native", "API"] },
        { name: "Chat App", description: "Real-time chat with push notifications.", tags: ["Flutter", "Firebase"] },
        { name: "E-Commerce App", description: "Shopping app with cart and payments.", tags: ["Flutter", "REST"] },
      ],
      certs: ["Flutter Development", "React Native", "Android Development", "Firebase", "Dart Programming", "Mobile UI/UX"],
      achievements: [ { value: "15+", label: "Apps Built" }, { value: "50k+", label: "Downloads" }, { value: "4.6", label: "Avg. Rating" }, { value: "2", label: "Platforms" } ],
      interests: ["Mobile", "UI Design", "Flutter", "Gaming", "Tech"],
      stats: [ { value: "15+", label: "Apps" }, { value: "50k+", label: "Downloads" }, { value: "4.6", label: "Rating" }, { value: "30+", label: "Screens" } ],
      stackTitle: "App Activity",
    },
  },

  multimedia: {
    key: "multimedia",
    label: "Multimedia, Design & Animation",
    colors: { bg: "#140a14", card: "#1c0f1c", panel: "#251225", accent: "#d946ef", accent2: "#e879f9", green: "#22c55e" },
    icons: { header: "Palette", skills: "Palette", stack: "Brush", experience: "Briefcase", projects: "Film", stats: "TrendingUp" },
    labels: { title: "MULTIMEDIA DESIGNER", stack: "Creative Suite", projects: "Creative Work", stats: "Creative Metrics" },
    sample: {
      role: "Multimedia & Motion Designer",
      title: "MULTIMEDIA DESIGNER",
      summary: "Creative designer producing graphics, motion and video that tell stories and elevate brands.",
      about: "Visual storyteller skilled in design, animation and editing. I turn ideas into eye-catching visuals across print, web and video.",
      skills: [
        { name: "Photoshop", level: 93 }, { name: "Illustrator", level: 90 }, { name: "After Effects", level: 85 },
        { name: "Premiere Pro", level: 84 }, { name: "3D / Blender", level: 75 }, { name: "UI Design", level: 80 },
      ],
      stack: ["Photoshop", "Illustrator", "After Effects", "Premiere", "Blender", "InDesign", "Figma", "CorelDraw", "Animate", "Audition", "Lightroom", "XD"],
      tools: ["Photoshop", "Illustrator", "After Effects", "Premiere Pro", "Blender", "Figma", "CorelDraw", "InDesign"],
      projects: [
        { name: "Brand Identity", description: "Logo, palette and full brand kit for a startup.", tags: ["Branding", "Illustrator"] },
        { name: "Motion Reel", description: "Animated explainer video with kinetic typography.", tags: ["After Effects", "Motion"] },
        { name: "Social Creatives", description: "Design system for social media posts.", tags: ["Photoshop", "Social"] },
        { name: "3D Product", description: "3D product render and animation in Blender.", tags: ["Blender", "3D"] },
      ],
      certs: ["Graphic Design", "Motion Graphics", "Video Editing", "3D Animation", "UI/UX Design", "Adobe Creative Suite"],
      achievements: [ { value: "200+", label: "Designs Made" }, { value: "50+", label: "Videos Edited" }, { value: "30+", label: "Brands" }, { value: "10+", label: "Animations" } ],
      interests: ["Design", "Animation", "Photography", "Film", "Art"],
      stats: [ { value: "200+", label: "Designs" }, { value: "50+", label: "Videos" }, { value: "30+", label: "Brands" }, { value: "10+", label: "3D Works" } ],
      stackTitle: "Creative Activity",
    },
  },

  hardwareNetworking: {
    key: "hardwareNetworking",
    label: "Computer Hardware & Networking",
    colors: { bg: "#0a0f14", card: "#0f1620", panel: "#121c28", accent: "#3b82f6", accent2: "#60a5fa", green: "#22c55e" },
    icons: { header: "Network", skills: "Network", stack: "Server", experience: "Briefcase", projects: "Router", stats: "TrendingUp" },
    labels: { title: "NETWORK ENGINEER", stack: "Networking Kit", projects: "Infrastructure Work", stats: "Ops Metrics" },
    sample: {
      role: "Hardware & Network Engineer",
      title: "NETWORK ENGINEER",
      summary: "Network engineer skilled in configuring, securing and maintaining hardware, servers and enterprise networks.",
      about: "Hands-on engineer who keeps infrastructure running. I set up, troubleshoot and optimize networks and systems for reliability.",
      skills: [
        { name: "Networking (CCNA)", level: 90 }, { name: "Hardware Repair", level: 92 }, { name: "Windows Server", level: 85 },
        { name: "Linux", level: 82 }, { name: "Firewalls", level: 80 }, { name: "Troubleshooting", level: 93 },
      ],
      stack: ["Routing", "Switching", "TCP/IP", "DNS", "DHCP", "VLAN", "Firewall", "Windows Server", "Linux", "Cisco", "VPN", "Active Directory"],
      tools: ["Cisco Packet Tracer", "Wireshark", "Windows Server", "Linux", "PuTTY", "VMware", "Nagios", "Multimeter"],
      projects: [
        { name: "Office LAN Setup", description: "Designed and deployed a 100-node office network.", tags: ["LAN", "Cisco"] },
        { name: "Server Deployment", description: "Configured AD, DNS and file server.", tags: ["Windows", "AD"] },
        { name: "Network Security", description: "Set up firewall, VLANs and VPN access.", tags: ["Firewall", "VPN"] },
        { name: "PC Assembly Lab", description: "Built and maintained a 30-system computer lab.", tags: ["Hardware", "Support"] },
      ],
      certs: ["CCNA (Networking)", "CompTIA A+", "Hardware & Networking", "Windows Server", "Network Security", "CompTIA Network+"],
      achievements: [ { value: "100+", label: "Systems Managed" }, { value: "99%", label: "Uptime" }, { value: "50+", label: "Issues Resolved" }, { value: "10+", label: "Networks Built" } ],
      interests: ["Networking", "Hardware", "Servers", "Security", "Tech"],
      stats: [ { value: "100+", label: "Systems" }, { value: "99%", label: "Uptime" }, { value: "10+", label: "Networks" }, { value: "500+", label: "Tickets" } ],
      stackTitle: "Ops Activity",
    },
  },

  nielit: {
    key: "nielit",
    label: "NIELIT Certified Courses",
    colors: { bg: "#0a0e18", card: "#0f1522", panel: "#121a2b", accent: "#2563eb", accent2: "#3b82f6", green: "#22c55e" },
    icons: { header: "GraduationCap", skills: "MonitorSmartphone", stack: "Cpu", experience: "Briefcase", projects: "FileText", stats: "TrendingUp" },
    labels: { title: "IT PROFESSIONAL", stack: "IT Skills", projects: "Practical Work", stats: "Course Metrics" },
    sample: {
      role: "NIELIT Certified IT Professional",
      title: "IT PROFESSIONAL",
      summary: "Government-certified IT professional with strong foundations in computing, office productivity and digital skills.",
      about: "NIELIT-certified learner with practical command of IT fundamentals, office tools and programming basics for the modern workplace.",
      skills: [
        { name: "MS Office", level: 92 }, { name: "Computer Fundamentals", level: 95 }, { name: "Internet & Email", level: 90 },
        { name: "Programming Basics", level: 80 }, { name: "Tally", level: 78 }, { name: "Typing", level: 85 },
      ],
      stack: ["MS Word", "Excel", "PowerPoint", "Internet", "Email", "Tally", "HTML", "Python", "Windows", "Linux", "Typing", "IT Tools"],
      tools: ["MS Office", "Tally", "Windows", "Web Browser", "Email Clients", "Python", "VS Code", "PDF Tools"],
      projects: [
        { name: "Office Project", description: "Created reports and presentations using MS Office suite.", tags: ["Word", "Excel", "PPT"] },
        { name: "Web Page", description: "Built a basic informational website in HTML/CSS.", tags: ["HTML", "CSS"] },
        { name: "Data Entry", description: "Managed records and data entry in Excel & Tally.", tags: ["Excel", "Tally"] },
        { name: "Digital Literacy", description: "Assisted in a community digital-literacy drive.", tags: ["Training", "IT"] },
      ],
      certs: ["NIELIT CCC", "NIELIT O Level", "MS Office", "Digital Literacy", "Tally", "Computer Fundamentals"],
      achievements: [ { value: "CCC", label: "Certified" }, { value: "O-Level", label: "Qualified" }, { value: "5+", label: "IT Modules" }, { value: "40wpm", label: "Typing Speed" } ],
      interests: ["Computers", "Office Tools", "Internet", "Learning", "Tech"],
      stats: [ { value: "5+", label: "Modules" }, { value: "100%", label: "Attendance" }, { value: "10+", label: "Assignments" }, { value: "2", label: "Certificates" } ],
      stackTitle: "Learning Activity",
    },
  },
};

export const themeList = Object.values(themes).map((t) => ({ key: t.key, label: t.label }));
