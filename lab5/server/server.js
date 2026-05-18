const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  try {
    // 1. Створюємо таблицю користувачів
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT DEFAULT '',
        skills TEXT DEFAULT '',
        experience TEXT DEFAULT ''
      );
    `);

    // 2. Створюємо таблицю вакансій
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vacancies (
        id SERIAL PRIMARY KEY,
        title TEXT,
        company TEXT,
        requirements TEXT,
        salary_str TEXT,
        salary_val INT,
        category TEXT,
        city TEXT,
        date TEXT
      );
    `);

    // 3. Створюємо таблицю заявок
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_email TEXT,
        vacancy_id INT REFERENCES vacancies(id) ON DELETE CASCADE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_email, vacancy_id)
      );
    `);

    // Перевіряємо кількість вакансій
    const res = await pool.query('SELECT COUNT(*) FROM vacancies');
    
    // Якщо вакансій менше 50, очищаємо та перезаписуємо велику базу (100 штук)
    if (parseInt(res.rows[0].count) < 50) {
      console.log('Оновлюємо та розширюємо базу вакансій до 100 штук...');
      await pool.query('TRUNCATE TABLE vacancies CASCADE');

      const bigVacanciesList = [
        // IT & Розробка
        ["Frontend Developer (React)", "WebTech Solutions", "React, JS, CSS", "65 000", 65000, "IT", "Київ", "2026-05-10"],
        ["Java Backend Engineer", "FinCore Systems", "Java 17, Spring Boot", "80 000", 80000, "IT", "Львів", "2026-05-09"],
        ["Python Data Scientist", "DataMind", "Python, Machine Learning, SQL", "95 000", 95000, "IT", "Дистанційно", "2026-05-07"],
        ["C++ Game Developer", "Lviv Games", "C++, Unreal Engine", "75 000", 75000, "IT", "Львів", "2026-05-05"],
        ["Vue.js Developer", "TechStack", "Vue 3, JS, HTML5", "55 000", 55000, "IT", "Київ", "2026-05-04"],
        ["DevOps Engineer", "CloudNet", "Docker, Kubernetes, AWS", "100 000", 100000, "IT", "Київ", "2026-05-01"],
        ["Junior QA Engineer", "BugHunters", "Manual Testing, Postman, Jira", "25 000", 25000, "IT", "Львів", "2026-04-30"],
        ["Fullstack Developer", "WebTech Solutions", "Node.js, React, MongoDB", "85 000", 85000, "IT", "Одеса", "2026-04-27"],
        ["Android Developer", "MobileSoft", "Kotlin, Android SDK", "75 000", 75000, "IT", "Київ", "2026-04-25"],
        ["iOS Developer", "MobileSoft", "Swift, Xcode, iOS SDK", "78 000", 78000, "IT", "Харків", "2026-04-24"],
        ["PHP Developer (Laravel)", "OldSchool Web", "PHP 8, Laravel, MySQL", "50 000", 50000, "IT", "Дистанційно", "2026-04-18"],
        ["Ruby on Rails Developer", "RubyTech", "Ruby, RoR, PostgreSQL", "80 000", 80000, "IT", "Київ", "2026-04-12"],
        ["Cybersecurity Analyst", "SafeNet", "Security Audits, Network, Linux", "95 000", 95000, "IT", "Київ", "2026-04-09"],
        ["Blockchain Developer", "CryptoCore", "Solidity, Web3, Ethereum", "120 000", 120000, "IT", "Дистанційно", "2026-04-03"],
        ["System Administrator", "TechStack", "Linux, Bash, Active Directory", "40 000", 40000, "IT", "Одеса", "2026-04-15"],
        ["Node.js Developer", "BackendPro", "Node.js, Express, PostgreSQL", "70 000", 70000, "IT", "Дніпро", "2026-05-12"],
        ["Golang Engineer", "FastStream", "Go, Microservices, Docker", "110 000", 110000, "IT", "Дистанційно", "2026-05-11"],
        ["Data Engineer", "BigData Corp", "Python, Spark, Hadoop", "90 000", 90000, "IT", "Київ", "2026-05-09"],
        ["Embedded C Developer", "MicroTech", "C, Microcontrollers, RTOS", "65 000", 65000, "IT", "Харків", "2026-05-06"],
        ["TypeScript Engineer", "NextGen", "TypeScript, Next.js, GraphQL", "85 000", 85000, "IT", "Львів", "2026-05-05"],
        ["Flutter Developer", "AppFactory", "Flutter, Dart, Bloc", "60 000", 60000, "IT", "Дніпро", "2026-05-02"],
        ["Scrum Master", "AgileWay", "Scrum, Kanban, Facilitation", "55 000", 55000, "IT", "Київ", "2026-04-28"],

        // Маркетинг, СММ & Реклама
        ["SMM Specialist", "PromoGroup", "SMM, Copywriting, Canva", "30 000", 30000, "Marketing", "Одеса", "2026-05-06"],
        ["SEO Specialist", "TopRank", "SEO, Ahrefs, Google Analytics", "35 000", 35000, "Marketing", "Дистанційно", "2026-05-03"],
        ["Marketing Manager", "BrandBoost", "Marketing Strategy, B2B, PR", "60 000", 60000, "Marketing", "Київ", "2026-04-29"],
        ["Copywriter", "TextPro", "Writing, Content Plan, SEO", "22 000", 22000, "Marketing", "Львів", "2026-04-26"],
        ["Email Marketer", "MailSense", "Mailchimp, CRM, HTML", "30 000", 30000, "Marketing", "Дистанційно", "2026-04-23"],
        ["Targetologist", "AdStars", "FB Ads, Google Ads, Analytics", "45 000", 45000, "Marketing", "Одеса", "2026-04-20"],
        ["PR Manager", "Publica", "PR Strategy, Media relations, Events", "55 000", 55000, "Marketing", "Київ", "2026-04-17"],
        ["Content Manager", "PromoGroup", "CMS, Copywriting, Admin", "25 000", 25000, "Marketing", "Львів", "2026-04-14"],
        ["PPC Specialist", "TopRank", "Google Ads, GA4, Tag Manager", "40 000", 40000, "Marketing", "Одеса", "2026-04-11"],
        ["Brand Manager", "BrandBoost", "Branding, Market analysis", "65 000", 65000, "Marketing", "Дистанційно", "2026-04-08"],
        ["Affiliate Manager", "AdStars", "CPA networks, English, Sales", "50 000", 50000, "Marketing", "Львів", "2026-04-02"],
        ["Digital Marketing Lead", "GlobalCommerce", "Strategy, Team Management, ROI", "90 000", 90000, "Marketing", "Київ", "2026-05-14"],
        ["Influencer Marketing Specialist", "FameAgency", "Bloggers, Negotiations", "32 000", 32000, "Marketing", "Харків", "2026-05-13"],
        ["Contextual Advertising Specialist", "LeadGen", "Google Shopping, Remarketing", "38 000", 38000, "Marketing", "Дніпро", "2026-05-08"],
        ["Link Builder", "SEO-Power", "Outreach, Ahrefs, Guest posting", "20 000", 20000, "Marketing", "Дистанційно", "2026-05-04"],

        // Дизайн & Креатив
        ["UI/UX Designer", "Creative Flow", "Figma, UX Research, Wireframes", "45 000", 45000, "Design", "Київ", "2026-05-08"],
        ["Graphic Designer", "ArtVision", "Photoshop, Illustrator, InDesign", "40 000", 40000, "Design", "Одеса", "2026-05-02"],
        ["Product Designer", "InnovateApp", "Figma, Prototyping, Design Systems", "70 000", 70000, "Design", "Дистанційно", "2026-04-28"],
        ["Motion Designer", "VideoArt", "After Effects, Premiere, 2D animation", "50 000", 50000, "Design", "Львів", "2026-04-22"],
        ["3D Artist", "Lviv Games", "Blender, Maya, Texturing", "65 000", 65000, "Design", "Львів", "2026-04-19"],
        ["UX Writer", "Creative Flow", "Microcopy, UX, English", "40 000", 40000, "Design", "Київ", "2026-04-16"],
        ["Web Designer", "ArtVision", "Figma, Tilda, Webflow", "35 000", 35000, "Design", "Дистанційно", "2026-04-13"],
        ["Illustrator", "DesignHub", "Digital Art, Photoshop, Vector", "30 000", 30000, "Design", "Львів", "2026-04-10"],
        ["Art Director", "Creative Flow", "Leadership, Design Vision, B2B", "110 000", 110000, "Design", "Київ", "2026-04-07"],
        ["Sound Designer", "VideoArt", "Audio editing, Foley, ProTools", "45 000", 45000, "Design", "Дистанційно", "2026-04-04"],
        ["Animator", "DesignHub", "Spine 2D, After Effects", "55 000", 55000, "Design", "Київ", "2026-04-01"],
        ["Interior Designer", "LoftStudio", "AutoCAD, 3ds Max, Corona", "42 000", 42000, "Design", "Харків", "2026-05-13"],
        ["2D Concept Artist", "GameDev Horizon", "Photoshop, Characters, Environment", "60 000", 60000, "Design", "Дніпро", "2026-05-11"],

        // Менеджмент & Продажі (Management & Sales)
        ["Project Manager", "TechCorp", "Agile, Jira, English, Gantt", "50 000", 50000, "Management", "Київ", "2026-05-15"],
        ["Product Manager", "FinTech Solutions", "Roadmap, Analytics, Product Vision", "85 000", 85000, "Management", "Львів", "2026-05-14"],
        ["Sales Manager", "B2B Connect", "Cold calls, CRM, Negotiations", "35 000", 35000, "Sales", "Харків", "2026-05-12"],
        ["Account Manager", "ClientFirst", "Retention, Upselling, Communication", "40 000", 40000, "Management", "Дніпро", "2026-05-10"],
        ["Business Development Manager", "GlobalMarket", "Lead generation, B2B sales", "60 000", 60000, "Management", "Київ", "2026-05-09"],
        ["Customer Success Specialist", "SaaS Enterprise", "Zendesk, Intercom, English", "30 000", 30000, "Management", "Дистанційно", "2026-05-07"],
        ["Sales Director", "RetailGiant", "Strategy, Team KPI, Forecasting", "120 000", 120000, "Sales", "Київ", "2026-05-05"],
        ["Team Lead Sales", "CallCenter Pro", "Coaching, Sales scripts, Analytics", "45 000", 45000, "Sales", "Одеса", "2026-05-03"],
        ["Support Team Lead", "HelpDesk International", "SLA, Team Management, English", "50 000", 50000, "Management", "Дистанційно", "2026-04-29"],
        ["Real Estate Agent", "ComfortHousing", "Sales, Real estate, Driving license", "55 000", 55000, "Sales", "Львів", "2026-04-25"],

        // HR, Фінанси & Інші
        ["HR Generalist", "PeopleFirst", "Recruitment, Onboarding, HR Admin", "40 000", 40000, "HR", "Київ", "2026-05-15"],
        ["IT Recruiter", "TalentScout", "Sourcing, LinkedIn, Tech stack", "35 000", 35000, "HR", "Дистанційно", "2026-05-14"],
        ["HR Director", "MegaHolding", "HR Strategy, C-level, Budgeting", "100 000", 100000, "HR", "Київ", "2026-05-11"],
        ["Financial Analyst", "AuditStandard", "Excel, P&L, Cash Flow, Forecasting", "45 000", 45000, "Finance", "Харків", "2026-05-09"],
        ["Chief Accountant", "TradeLine", "Taxation, 1C:Enterprise, Reporting", "55 000", 55000, "Finance", "Дніпро", "2026-05-07"],
        ["Office Manager", "SoftCity", "Organization, Supplies, English", "20 000", 20000, "Other", "Львів", "2026-05-05"],
        ["Legal Advisor", "Law&Order", "Corporate law, Contracts, Compliance", "48 000", 48000, "Other", "Київ", "2026-05-03"],
        ["Talent Acquisition Specialist", "ScaleUp IT", "Headhunting, Boolean search", "38 000", 38000, "HR", "Львів", "2026-04-27"],
        ["Business Analyst", "FinCore Systems", "BPMN, UML, SQL, Requirements", "65 000", 65000, "Finance", "Київ", "2026-04-22"],
        ["Junior Accountant", "AgroTrade", "Primary documentation, 1C", "22 000", 22000, "Finance", "Одеса", "2026-04-18"],

        // Додаткові для масовості (Різні категорії)
        ["Node.js Architect", "CloudScale", "Microservices, AWS, System Architecture", "140 000", 140000, "IT", "Дистанційно", "2026-05-16"],
        ["QA Automation (Python)", "AutoTest Pro", "Selenium, PyTest, CI/CD", "75 000", 75000, "IT", "Київ", "2026-05-16"],
        ["Data Scientist (NLP)", "AI-Bots", "PyTorch, Transformers, Python", "110 000", 110000, "IT", "Харків", "2026-05-15"],
        ["Game Designer", "Lviv Games", "Game Balance, Monetization, GDD", "60 000", 60000, "IT", "Львів", "2026-05-15"],
        ["Technical Writer", "DocuTech", "API documentation, Markdown, Git", "40 000", 40000, "IT", "Дистанційно", "2026-05-14"],
        ["Media Buyer", "TrafficGen", "Facebook Ads, Crypto/Nutra vertical", "70 000", 70000, "Marketing", "Київ", "2026-05-14"],
        ["Growth Hacker", "StartupLab", "A/B testing, Funnel optimization", "65 000", 65000, "Marketing", "Дніпро", "2026-05-14"],
        ["Brand Illustrator", "FintechApp", "Vector, Character style, Figma", "45 000", 45000, "Design", "Дистанційно", "2026-05-13"],
        ["Video Editor", "YoutubeStudio", "Premiere Pro, DaVinci, Sound design", "38 000", 38000, "Design", "Одеса", "2026-05-13"],
        ["HR Business Partner (HRBP)", "FastTech", "Conflict resolution, Metrics", "70 000", 70000, "HR", "Київ", "2026-05-12"],
        ["Compensation & Benefits (C&B)", "CorpGroup", "Salary surveys, KPI structure", "50 000", 50000, "HR", "Харків", "2026-05-11"],
        ["Investment Analyst", "CapitalVenture", "Financial modeling, Pitch decks", "75 000", 75000, "Finance", "Київ", "2026-05-11"],
        ["Risk Manager", "SafeBank", "Credit risks, Scoring models, SQL", "60 000", 60000, "Finance", "Дніпро", "2026-05-10"],
        ["B2B Sales Representative", "LogisticsUA", "Logistics, Cold outreach", "32 000", 32000, "Sales", "Одеса", "2026-05-10"],
        ["Lead Generator", "OutsourceTeam", "LinkedIn Helper, Snov.io, Email", "18 000", 18000, "Sales", "Дистанційно", "2026-05-09"],
        ["Sales Operations Manager", "SaaS Enterprise", "HubSpot CRM, Dashboards", "48 000", 48000, "Sales", "Київ", "2026-05-09"],
        ["System Analyst", "E-Commerce Group", "API, JSON, REST, Postman", "58 000", 58000, "IT", "Львів", "2026-05-08"],
        ["Support Specialist (Night shift)", "CryptoExchange", "Chat support, English C1", "28 000", 28000, "Management", "Дистанційно", "2026-05-08"],
        ["Content Writer (English)", "SEO-Agency", "Copywriting, Native English", "35 000", 35000, "Marketing", "Харків", "2026-05-07"],
        ["Creative Copywriter", "BBDO-仿", "Ad concepts, Slogans, Creative", "42 000", 42000, "Marketing", "Київ", "2026-05-07"],
        ["3D Rigging Artist", "AnimaStudio", "Maya, Bone structures, Python", "70 000", 70000, "Design", "Львів", "2026-05-06"],
        ["UI Designer (Mobile)", "AppConcept", "iOS/Android design guidelines", "48 000", 48000, "Design", "Дніпро", "2026-05-06"],
        ["Recruitment Team Lead", "GlobalRecruit", "KPIs, Management, Reporting", "60 000", 60000, "HR", "Київ", "2026-05-05"],
        ["People Partner", "ProductHouse", "Onboarding, Mental health support", "45 000", 45000, "HR", "Одеса", "2026-05-05"],
        ["Internal Auditor", "RetailChain", "Fraud detection, Compliance", "50 000", 50000, "Finance", "Харків", "2026-05-04"],
        ["Scrum Product Owner", "DeliveryService", "Backlog, User Stories, Agile", "80 000", 80000, "Management", "Київ", "2026-05-04"],
        ["Key Account Manager", "DistriCompany", "FMCG, Key clients, Retail", "52 000", 52000, "Management", "Дніпро", "2026-05-03"],
        ["Customer Care Specialist", "TaxiPark System", "Phone calls, Problem solving", "18 000", 18000, "Management", "Львів", "2025-12-15"],
        ["Independent Partner Representative", "NutritionUkraine", "Formula 1 shakes, Wellness consulting", "25 000", 25000, "Sales", "Львів", "2025-08-20"],
        ["Network Engineer (Cisco)", "ISP Network", "Packet Tracer, SSH, Routers, IP", "45 000", 45000, "IT", "Львів", "2026-05-01"]
      ];

      for (const job of bigVacanciesList) {
        await pool.query(
          'INSERT INTO vacancies (title, company, requirements, salary_str, salary_val, category, city, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          job
        );
      }
      console.log('База даних успішно наповнена 100 різноманітними вакансіями!');
    } else {
      console.log('База даних вже містить велику вибірку вакансій.');
    }
  } catch (err) {
    console.error('Помилка ініціалізації БД:', err);
  }
}
initDB();

// МАРШРУТ РЕЄСТРАЦІЇ (JWT)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Заповніть усі поля' });

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) return res.status(400).json({ message: 'Користувач вже існує' });

    const hashedPassword = await bcrypt.hash(password, 12);
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// МАРШРУТ ВХОДУ (JWT)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) return res.status(400).json({ message: 'Неправильний email або password' });

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Неправильний email або password' });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// МАРШРУТ ОТРИМАННЯ ДАНИХ ПРОФІЛЮ З БАЗИ
app.get('/api/profile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email обовʼязковий' });

    const userRes = await pool.query('SELECT name, skills, experience FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) return res.status(404).json({ message: 'Користувача не знайдено' });

    res.json(userRes.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// МАРШРУТ ЗБЕРЕЖЕННЯ/ОНОВЛЕННЯ ПРОФІЛЮ В БАЗІ
app.post('/api/profile', async (req, res) => {
  try {
    const { email, name, skills, experience } = req.body;
    if (!email) return res.status(400).json({ message: 'Email обовʼязковий' });

    await pool.query(
      'UPDATE users SET name = $1, skills = $2, experience = $3 WHERE email = $4',
      [name, skills, experience, email]
    );

    res.json({ message: 'Профіль успішно оновлено в базі даних!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// МАРШРУТ ДЛЯ ОТРИМАННЯ ВСІХ ВАКАНСІЙ
app.get('/api/vacancies', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, company, requirements, salary_str AS "salaryStr", salary_val AS "salaryVal", category, city, date FROM vacancies ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// МАРШРУТ ДЛЯ ОТРИМАННЯ ЗАЯВОК КОРИСТУВАЧА (Варіант 11)
app.get('/api/applications', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email обовʼязковий' });
    const result = await pool.query('SELECT a.id, a.user_email AS "userEmail", a.applied_at AS "appliedAt", v.title, v.company, v.city FROM applications a JOIN vacancies v ON a.vacancy_id = v.id WHERE a.user_email = $1 ORDER BY a.applied_at DESC', [email]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// МАРШРУТ ДЛЯ ПОДАЧІ ЗАЯВКИ З ВАЛІДАЦІЄЮ (Варіант 11)
app.post('/api/applications', async (req, res) => {
  try {
    const { userEmail, vacancyId } = req.body;
    const checkDup = await pool.query('SELECT * FROM applications WHERE user_email = $1 AND vacancy_id = $2', [userEmail, parseInt(vacancyId)]);
    if (checkDup.rows.length > 0) return res.status(400).json({ message: 'Ви вже подавали заявку на цю вакансію!' });

    const newApp = await pool.query('INSERT INTO applications (user_email, vacancy_id) VALUES ($1, $2) RETURNING *', [userEmail, parseInt(vacancyId)]);
    res.status(201).json({ message: 'Заявку успішно подано!', data: newApp.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));