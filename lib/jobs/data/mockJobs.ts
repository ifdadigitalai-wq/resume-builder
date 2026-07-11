import { Job } from '../types';

export const MOCK_JOBS: Job[] = [
  {
    id: 'linkedin-1',
    title: 'Frontend Software Engineer',
    company: 'Google',
    location: 'Bangalore, Karnataka',
    description: `Google is hiring a Frontend Software Engineer to join our core applications team. In this role, you will build responsive, high-performance web applications using modern technologies.

Key Responsibilities:
- Design, develop, and maintain clean and reusable user interfaces.
- Collaborate with product designers and backend engineers to integrate APIs.
- Optimize web applications for maximum speed and compatibility.
- Write unit and integration tests to ensure code quality.

Requirements:
- Strong experience in React, TypeScript, and CSS.
- Familiarity with Next.js, tailwindcss, and modern bundlers.
- Experience with state management (Redux, Zustand).
- 2+ years of professional web development experience.`,
    skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'TailwindCSS', 'Zustand', 'Git', 'JavaScript'],
    experience: '1-3 years',
    salary: '₹18,0,000 - ₹24,0,000 / year',
    postedAt: '2026-07-10T10:00:00.000Z',
    applyUrl: 'https://careers.google.com/jobs',
    source: 'linkedin'
  },
  {
    id: 'naukri-2',
    title: 'Full Stack Developer (MERN)',
    company: 'Razorpay',
    location: 'Remote',
    description: `Razorpay is seeking an enthusiastic MERN Full Stack Developer to build next-generation payment and fintech products.

Responsibilities:
- Build API endpoints, database structures, and responsive pages.
- Integrate third-party tools and APIs.
- Debug and optimize database queries in MongoDB and PostgreSQL.
- Maintain high-quality documentation.

Required Skills:
- Node.js, Express, React, and MongoDB are core requirements.
- Familiarity with TypeScript and Next.js is a strong plus.
- Good knowledge of Docker and REST APIs.
- 3-5 years of full-stack engineering experience.`,
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'TypeScript', 'Docker', 'REST API', 'JavaScript'],
    experience: '3-5 years',
    salary: '₹14,0,000 - ₹20,0,000 / year',
    postedAt: '2026-07-09T08:30:00.000Z',
    applyUrl: 'https://razorpay.com/jobs',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-3',
    title: 'Backend Engineer (Python)',
    company: 'Meta',
    location: 'Remote',
    description: `We are looking for a Python Backend Engineer to scale our content delivery and recommendations engine.

Requirements:
- Advanced knowledge of Python and frameworks like Django or FastAPI.
- Excellent understanding of PostgreSQL, database indexes, and Redis caching.
- Experience building scalable microservices and background task runners (Celery).
- Understanding of AWS cloud computing (EC2, S3, RDS).
- 5+ years of experience in backend development.`,
    skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'AWS', 'Docker', 'Microservices'],
    experience: '5+ years',
    salary: '₹35,0,000 - ₹45,0,000 / year',
    postedAt: '2026-07-11T09:00:00.000Z',
    applyUrl: 'https://careers.meta.com/jobs',
    source: 'linkedin'
  },
  {
    id: 'naukri-4',
    title: 'Associate Data Analyst',
    company: 'TCS',
    location: 'Noida, Uttar Pradesh',
    description: `TCS is hiring an Associate Data Analyst for our client analytics division.

Key Responsibilities:
- Extract, clean, and analyze client data sets.
- Build interactive dashboards for tracking operational metrics.
- Translate business requirements into technical database queries.

Skills & Qualifications:
- Expert-level SQL querying skills.
- Proficiency in Python, Excel, and dashboarding tools like Tableau or Power BI.
- Strong analytical and problem-solving skills.
- 0-2 years of experience (Freshers are welcome to apply!).`,
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'Data Analysis', 'Data Cleaning'],
    experience: 'Freshers',
    salary: '₹4,50,000 - ₹6,00,000 / year',
    postedAt: '2026-07-08T11:20:00.000Z',
    applyUrl: 'https://tcs.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-5',
    title: 'Junior React Developer',
    company: 'Wipro',
    location: 'Gurgaon, Haryana',
    description: `Join Wipro's development center as a Junior React Developer. You will work on modernization projects for client dashboards.

Requirements:
- Solid foundations in HTML, CSS, JavaScript (ES6+).
- Good understanding of React, component states, and hooks.
- Familiarity with TailwindCSS and Git for version control.
- 0-1 years of experience. Freshers with internship experience or solid personal projects in React are encouraged.`,
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TailwindCSS', 'Git'],
    experience: 'Freshers',
    salary: '₹3,50,000 - ₹5,00,000 / year',
    postedAt: '2026-07-10T14:45:00.000Z',
    applyUrl: 'https://wipro.com/careers',
    source: 'linkedin'
  },
  {
    id: 'linkedin-6',
    title: 'UI/UX Designer',
    company: 'Adobe',
    location: 'Noida, Uttar Pradesh',
    description: `Adobe is seeking a passionate UI/UX Designer to craft beautiful and intuitive user experiences for our web platforms.

Responsibilities:
- Create wireframes, user flows, and prototypes.
- Design responsive layouts and user interface components.
- Conduct user research and translate insights into design solutions.

Requirements:
- Proficient in Figma, Adobe XD, or Creative Cloud.
- Strong portfolio showing design process, typography, and color theory.
- Basic understanding of HTML/CSS is a plus.
- 1-3 years of UI/UX design experience.`,
    skills: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'Typography', 'Adobe XD', 'HTML', 'CSS'],
    experience: '1-3 years',
    salary: '₹8,00,000 - ₹12,00,000 / year',
    postedAt: '2026-07-10T15:30:00.000Z',
    applyUrl: 'https://adobe.com/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-7',
    title: 'Cyber Security Associate',
    company: 'Infosys',
    location: 'Bangalore, Karnataka',
    description: `Infosys is looking for a Cyber Security Associate to monitor network security events and implement defense tools.

Requirements:
- Knowledge of network security protocols, firewalls, and vulnerability assessments.
- Familiarity with Linux systems and scripting (Bash, Python).
- Relevant certifications (CEH, CompTIA Security+) are a plus.
- 1-3 years of experience.`,
    skills: ['Cyber Security', 'Network Security', 'Firewalls', 'Linux', 'Bash', 'Python', 'Vulnerability Assessment'],
    experience: '1-3 years',
    salary: '₹6,00,000 - ₹9,00,000 / year',
    postedAt: '2026-07-07T12:00:00.000Z',
    applyUrl: 'https://infosys.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-8',
    title: 'DevOps Engineer',
    company: 'Amazon Web Services',
    location: 'Remote',
    description: `AWS is seeking a DevOps Engineer to improve our CI/CD pipelines, container orchestration platforms, and cloud monitoring tools.

Requirements:
- Extensive knowledge of AWS (IAM, VPC, ECS, EKS, CloudFormation).
- Experience with Docker, Kubernetes, and Terraform.
- Solid experience writing CI/CD pipelines (Jenkins, GitHub Actions, GitLab CI).
- Strong scripting skills in Bash or Python.
- 3-5 years of DevOps experience.`,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions', 'Bash', 'Python', 'Linux'],
    experience: '3-5 years',
    salary: '₹22,0,000 - ₹30,0,000 / year',
    postedAt: '2026-07-10T08:15:00.000Z',
    applyUrl: 'https://amazon.jobs',
    source: 'linkedin'
  },
  {
    id: 'naukri-9',
    title: 'Java Developer',
    company: 'Cognizant',
    location: 'Gurgaon, Haryana',
    description: `Cognizant is hiring Java Software Engineers to maintain high-traffic enterprise applications.

Requirements:
- Strong core Java knowledge (Java 11/17).
- Deep experience with Spring Boot, Spring MVC, and Hibernate.
- Solid database experience with SQL Server, Oracle, or MySQL.
- 3-5 years of backend experience.`,
    skills: ['Java', 'Spring Boot', 'Hibernate', 'SQL', 'MySQL', 'REST API', 'Git'],
    experience: '3-5 years',
    salary: '₹8,00,000 - ₹12,0,000 / year',
    postedAt: '2026-07-06T10:40:00.000Z',
    applyUrl: 'https://cognizant.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-10',
    title: 'Machine Learning Engineer',
    company: 'Microsoft',
    location: 'Bangalore, Karnataka',
    description: `Microsoft is looking for a Machine Learning Engineer to design, deploy, and monitor scalable ML systems and LLM integrations.

Qualifications:
- Strong programming in Python, PyTorch, or TensorFlow.
- Experience with training/finetuning LLMs, prompt engineering, or RAG systems.
- Familiarity with Docker, Kubernetes, and cloud pipelines (Azure ML).
- 3-5 years of industry experience.`,
    skills: ['Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'LLMs', 'Docker', 'Azure', 'Git'],
    experience: '3-5 years',
    salary: '₹28,0,000 - ₹38,0,000 / year',
    postedAt: '2026-07-11T11:00:00.000Z',
    applyUrl: 'https://careers.microsoft.com',
    source: 'linkedin'
  },
  {
    id: 'linkedin-11',
    title: 'React Native Developer',
    company: 'Zomato',
    location: 'Gurgaon, Haryana',
    description: `Zomato is hiring a React Native Mobile App Developer to enhance the consumer food ordering experience.

Requirements:
- Strong experience with React Native, TypeScript, and React hooks.
- Familiarity with Redux, context API, and offline caching.
- Understanding of iOS and Android native builds.
- 1-3 years of mobile application experience.`,
    skills: ['React Native', 'TypeScript', 'React', 'Redux', 'iOS', 'Android', 'Git', 'JavaScript'],
    experience: '1-3 years',
    salary: '₹12,0,000 - ₹16,0,000 / year',
    postedAt: '2026-07-09T09:10:00.000Z',
    applyUrl: 'https://zomato.com/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-12',
    title: 'Node.js Developer',
    company: 'Paytm',
    location: 'Noida, Uttar Pradesh',
    description: `Paytm is seeking a Node.js Backend Engineer for our API scaling and services team.

Key Requirements:
- In-depth mastery of Node.js and Express/NestJS frameworks.
- Expert-level database optimization (MongoDB, Redis, SQL).
- Strong understanding of microservices, webhooks, and pub/sub patterns.
- 3-5 years of backend programming.`,
    skills: ['Node.js', 'Express', 'NestJS', 'MongoDB', 'Redis', 'SQL', 'Microservices', 'REST API'],
    experience: '3-5 years',
    salary: '₹15,0,000 - ₹21,0,000 / year',
    postedAt: '2026-07-05T07:45:00.000Z',
    applyUrl: 'https://paytm.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-13',
    title: 'Junior QA Engineer',
    company: 'HCLTech',
    location: 'Noida, Uttar Pradesh',
    description: `HCLTech is looking for a Junior Quality Assurance Engineer to perform manual and automated testing of web pages.

Requirements:
- Good knowledge of software testing concepts and test cases.
- Experience with Selenium, Playwright, or Cypress is a plus.
- Familiarity with JavaScript, HTML, and browser dev tools.
- 0-2 years of experience. Freshers are welcome.`,
    skills: ['QA Testing', 'HTML', 'CSS', 'JavaScript', 'Selenium', 'Test Automation'],
    experience: 'Freshers',
    salary: '₹3,20,000 - ₹4,50,000 / year',
    postedAt: '2026-07-08T09:30:00.000Z',
    applyUrl: 'https://hcltech.com/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-14',
    title: 'Data Analyst (SQL & Python)',
    company: 'Flipkart',
    location: 'Bangalore, Karnataka',
    description: `Flipkart is hiring a Data Analyst to extract business intelligence from transaction databases.

Requirements:
- Master-level SQL querying.
- Good Python scripting (pandas, numpy) and data storytelling.
- Building reports on Tableau, Excel, and Power BI.
- 1-3 years of data analysis experience.`,
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'Data Analysis'],
    experience: '1-3 years',
    salary: '₹7,0,000 - ₹10,50,000 / year',
    postedAt: '2026-07-09T13:20:00.000Z',
    applyUrl: 'https://flipkart.careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-15',
    title: 'Backend Software Developer (Go)',
    company: 'Uber',
    location: 'Bangalore, Karnataka',
    description: `Uber is looking for a Go Backend Software Developer for our real-time matching and dispatch systems.

Requirements:
- Experience building highly concurrent, distributed services in Go (Golang).
- Strong understanding of Kafka, Cassandra, and Redis.
- Excellent command over system design and RPC architectures.
- 5+ years of experience.`,
    skills: ['Go', 'Kafka', 'Cassandra', 'Redis', 'System Design', 'Microservices', 'Git'],
    experience: '5+ years',
    salary: '₹40,0,000 - ₹55,0,000 / year',
    postedAt: '2026-07-11T12:00:00.000Z',
    applyUrl: 'https://uber.com/careers',
    source: 'linkedin'
  },
  
  // STARTUPS & SMALL-CAP COMPANIES
  {
    id: 'linkedin-16',
    title: 'Backend Developer (NodeJS)',
    company: 'Zepto',
    location: 'Mumbai, Maharashtra',
    description: `Zepto is hiring a Node.js Backend Developer to build and optimize checkout and delivery matching microservices.
    
Key Duties:
- Write optimized Node.js code and manage Redis caching schemas.
- Improve system throughput for quick commerce delivery dispatchers.
- Write robust Unit tests and monitor server metrics on AWS.

Requirements:
- Excellent mastery of Node.js, Express, and Redis.
- Solid experience with PostgreSQL or MySQL.
- 1-3 years of core experience in high-growth startups.`,
    skills: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'AWS', 'Git', 'REST API', 'JavaScript'],
    experience: '1-3 years',
    salary: '₹14,0,000 - ₹19,0,000 / year',
    postedAt: '2026-07-11T09:30:00.000Z',
    applyUrl: 'https://www.zepto.com/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-17',
    title: 'Frontend Engineer (React)',
    company: 'Meesho',
    location: 'Bangalore, Karnataka',
    description: `Meesho is hiring a Frontend Web Developer to work on our merchant dashboard and growth landing sites.
    
Key Responsibilities:
- Build highly responsive catalog pages with React.js and TailwindCSS.
- Work closely with UX designers to code pixel-perfect interfaces.
- Enhance page load times and mobile web compliance.

Required Skills:
- Proficient in React, JavaScript, HTML, and CSS.
- Familiarity with TailwindCSS and Vite.
- 1-3 years of frontend experience.`,
    skills: ['React', 'JavaScript', 'TailwindCSS', 'CSS', 'HTML', 'Vite', 'Git'],
    experience: '1-3 years',
    salary: '₹10,0,000 - ₹15,0,000 / year',
    postedAt: '2026-07-10T11:40:00.000Z',
    applyUrl: 'https://www.meesho.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-18',
    title: 'Android App Developer',
    company: 'Groww',
    location: 'Bangalore, Karnataka',
    description: `Groww is seeking an Android Developer to build safe, responsive investment and banking mobile applications.
    
Requirements:
- Advanced knowledge of Kotlin, Android SDK, and Jetpack Compose.
- Experience with REST API integration and local storage architectures (Room/SQLite).
- 3-5 years of native Android application development experience.`,
    skills: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'REST API', 'SQL', 'Git', 'Java'],
    experience: '3-5 years',
    salary: '₹16,0,000 - ₹22,0,000 / year',
    postedAt: '2026-07-10T07:50:00.000Z',
    applyUrl: 'https://groww.in/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-19',
    title: 'Data Engineer',
    company: 'Sigmoid',
    location: 'Gurgaon, Haryana',
    description: `Sigmoid is seeking a Data Engineer to construct large-scale analytics ingestion systems.
    
Responsibilities:
- Build PySpark and SQL pipelines to process big data tables.
- Integrate ingestion logs with Snowflake or AWS Redshift warehouses.
- Optimize database structures for real-time reporting.

Qualifications:
- Solid skills in SQL and Python.
- Good knowledge of Apache Spark (PySpark) or Hadoop.
- 1-3 years of data engineering experience.`,
    skills: ['SQL', 'Python', 'Apache Spark', 'PySpark', 'Snowflake', 'AWS', 'Data Engineering'],
    experience: '1-3 years',
    salary: '₹8,50,000 - ₹13,0,000 / year',
    postedAt: '2026-07-09T14:10:00.000Z',
    applyUrl: 'https://www.sigmoid.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-20',
    title: 'GraphQL Developer',
    company: 'Hasura',
    location: 'Remote',
    description: `Hasura is seeking a GraphQL Backend Developer to improve metadata engines and database integrations.
    
Requirements:
- Strong experience with Node.js/TypeScript or Haskell.
- Expertise in PostgreSQL databases and writing complex GraphQL schemas.
- 3-5 years of backend engineering experience.`,
    skills: ['Node.js', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Git', 'Docker'],
    experience: '3-5 years',
    salary: '₹20,0,000 - ₹28,0,000 / year',
    postedAt: '2026-07-11T08:00:00.000Z',
    applyUrl: 'https://hasura.io/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-21',
    title: 'Junior Web Developer',
    company: 'WebCraft Solutions',
    location: 'Noida, Uttar Pradesh',
    description: `WebCraft Solutions is a small-cap creative agency hiring a Junior Frontend Web Developer for client websites.
    
Role & Duties:
- Write clean semantic HTML, custom CSS, and responsive layouts.
- Implement UI features with vanilla JavaScript.
- Maintain and update existing client websites.

Requirements:
- Good knowledge of HTML, CSS, JavaScript.
- Basic familiarity with Git and TailwindCSS.
- Freshers are highly welcome! (No commercial experience required).`,
    skills: ['HTML', 'CSS', 'JavaScript', 'TailwindCSS', 'Git'],
    experience: 'Freshers',
    salary: '₹3,00,000 - ₹4,20,000 / year',
    postedAt: '2026-07-09T10:00:00.000Z',
    applyUrl: 'https://webcraft.example.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-22',
    title: 'QA Automation Tester',
    company: 'Birlasoft',
    location: 'Noida, Uttar Pradesh',
    description: `Birlasoft is hiring a QA Automation Engineer to write tests for corporate banking products.
    
Required Qualifications:
- Expert-level automated testing with Java and Selenium.
- Good knowledge of TestNG, Maven, and Jenkins CI.
- Writing structured bug logs and testing APIs.
- 1-3 years of test automation experience.`,
    skills: ['Java', 'Selenium', 'QA Testing', 'Test Automation', 'Jenkins', 'Git'],
    experience: '1-3 years',
    salary: '₹5,50,000 - ₹8,00,000 / year',
    postedAt: '2026-07-08T15:20:00.000Z',
    applyUrl: 'https://www.birlasoft.com/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-23',
    title: 'Junior SQL Developer',
    company: 'Firstsource',
    location: 'Mumbai, Maharashtra',
    description: `Firstsource is a small-cap service provider seeking a Junior SQL Developer.
    
Responsibilities:
- Write and optimize SQL stored procedures and database triggers.
- Create automated reports for operations teams.
- Debug database queries.

Requirements:
- Excellent command over SQL Server or Oracle SQL.
- Basic understanding of database normalization.
- 0-2 years of experience. Freshers with good SQL knowledge can apply.`,
    skills: ['SQL', 'SQL Server', 'Database Design', 'Excel'],
    experience: 'Freshers',
    salary: '₹3,60,000 - ₹5,00,000 / year',
    postedAt: '2026-07-07T11:00:00.000Z',
    applyUrl: 'https://www.firstsource.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-24',
    title: 'Product Analyst',
    company: 'InMobi',
    location: 'Bangalore, Karnataka',
    description: `InMobi is hiring a Product Analyst to extract trends from advertisement delivery logs.
    
Duties:
- Build Excel and Tableau sheets to track product conversions.
- Write complex SQL aggregation queries.
- Collaborate with product managers on user metrics.

Requirements:
- In-depth SQL skills and Tableau.
- Good Python scripting skills.
- 1-3 years of analytical experience.`,
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Data Analysis'],
    experience: '1-3 years',
    salary: '₹7,50,000 - ₹11,0,000 / year',
    postedAt: '2026-07-10T12:00:00.000Z',
    applyUrl: 'https://www.inmobi.com/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-25',
    title: 'Software Engineer in Test',
    company: 'BrowserStack',
    location: 'Remote',
    description: `BrowserStack is seeking an Engineer in Test to automate web testing frameworks.
    
Key Duties:
- Write automated UI tests using Cypress, Playwright, or Cypress.io.
- Run tests in Docker container environments.
- Integrate regression runs in GitHub Actions.

Requirements:
- JavaScript or TypeScript scripting skills.
- 1-3 years of QA Automation experience.`,
    skills: ['JavaScript', 'TypeScript', 'QA Testing', 'Test Automation', 'Cypress', 'Docker', 'GitHub Actions'],
    experience: '1-3 years',
    salary: '₹9,00,000 - ₹14,0,000 / year',
    postedAt: '2026-07-09T09:00:00.000Z',
    applyUrl: 'https://www.browserstack.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-26',
    title: 'API Developer',
    company: 'Postman',
    location: 'Remote',
    description: `Postman is hiring an API integration engineer to build connectors and documentation samples.
    
Requirements:
- In-depth command over Node.js and TypeScript.
- Strong knowledge of REST APIs, GraphQL, and OAuth protocols.
- 2+ years of backend programming.`,
    skills: ['Node.js', 'TypeScript', 'REST API', 'GraphQL', 'Git', 'JavaScript'],
    experience: '1-3 years',
    salary: '₹15,0,000 - ₹22,0,000 / year',
    postedAt: '2026-07-10T16:00:00.000Z',
    applyUrl: 'https://www.postman.com/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-27',
    title: 'Full Stack Engineer',
    company: 'Khatabook',
    location: 'Remote',
    description: `Khatabook is hiring a Full Stack Engineer to support merchant accounts ledger systems.
    
Responsibilities:
- Write frontend React features and connect them to Python backend services.
- Help scale Django API endpoints.
- Monitor PostgreSQL database connections.

Requirements:
- Strong experience with React, JavaScript, and Python.
- 1-3 years of full-stack product building.`,
    skills: ['React', 'Python', 'Django', 'PostgreSQL', 'JavaScript', 'Git'],
    experience: '1-3 years',
    salary: '₹11,0,000 - ₹16,0,000 / year',
    postedAt: '2026-07-08T10:15:00.000Z',
    applyUrl: 'https://khatabook.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-28',
    title: 'Support Engineer',
    company: 'Freshworks',
    location: 'Chennai, Tamil Nadu',
    description: `Freshworks is seeking a Technical Support Engineer to support enterprise SaaS clients.
    
Key Duties:
- Diagnose front-end JavaScript and database log errors.
- Coordinate bug tracking with developer teams.
- Write SQL check queries.

Qualifications:
- Basic skills in HTML, CSS, JavaScript, and SQL.
- Excellent communication.
- 0-2 years of experience (Freshers are welcome!).`,
    skills: ['HTML', 'CSS', 'JavaScript', 'SQL', 'Customer Support'],
    experience: 'Freshers',
    salary: '₹4,00,000 - ₹6,00,000 / year',
    postedAt: '2026-07-10T09:40:00.000Z',
    applyUrl: 'https://www.freshworks.com/careers',
    source: 'linkedin'
  },
  {
    id: 'naukri-29',
    title: 'React Native Developer',
    company: 'Unacademy',
    location: 'Bangalore, Karnataka',
    description: `Unacademy is hiring a React Native Developer for our mobile learning application.
    
Requirements:
- Solid experience with React Native and Redux.
- Understanding of mobile layouts and video streaming integration.
- 1-3 years of experience.`,
    skills: ['React Native', 'React', 'Redux', 'JavaScript', 'Android', 'iOS', 'Git'],
    experience: '1-3 years',
    salary: '₹10,0,000 - ₹14,0,000 / year',
    postedAt: '2026-07-09T15:00:00.000Z',
    applyUrl: 'https://unacademy.com/careers',
    source: 'naukri.com'
  },
  {
    id: 'linkedin-30',
    title: 'Junior NodeJS Backend Developer',
    company: 'FinTech Pulse',
    location: 'Remote',
    description: `FinTech Pulse is an early-stage fintech startup hiring a Junior Backend Developer.
    
Role:
- Write REST APIs using Node.js and Express.
- Hook collections in MongoDB databases.
- Commit clean commits in Git.

Requirements:
- Experience writing Express APIs.
- Familiarity with MongoDB and Git.
- Freshers with solid projects or coding certifications are welcome.`,
    skills: ['Node.js', 'Express', 'MongoDB', 'Git', 'JavaScript', 'REST API'],
    experience: 'Freshers',
    salary: '₹4,00,000 - ₹6,00,000 / year',
    postedAt: '2026-07-11T10:45:00.000Z',
    applyUrl: 'https://fintechpulse.example.com/careers',
    source: 'linkedin'
  }
];
