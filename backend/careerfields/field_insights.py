"""Rich career-field explanations used by seed_fields."""

from careerfields.field_roadmaps import roadmap_for

INSIGHTS = {
    'Software Engineering': {
        'about': (
            'Software Engineering is about designing, building, testing and maintaining reliable software systems. '
            'Students learn how to turn real problems into products used by people and businesses—apps, websites, '
            'enterprise systems and cloud services. In Pakistan it is one of the strongest pathways into IT exports, '
            'startups and remote international work.'
        ),
        'market_outlook': (
            'Demand is very high across product companies, software houses, banks, telecoms and freelancing platforms. '
            'Employers look for developers who can ship features, work in teams and use modern tools (Git, APIs, cloud). '
            'Entry roles are comparatively accessible if you build a strong portfolio.'
        ),
        'future_outlook': (
            'Long-term outlook is excellent. Automation and AI will change how software is written, but people who can '
            'design systems, understand users and integrate AI tools will stay valuable. Remote and hybrid work continues '
            'to expand earning potential beyond local salaries.'
        ),
        'field_value': (
            'High employability, scalable income (local + remote), and clear skill progression. It also opens doors to '
            'related fields such as AI, data, cybersecurity and product management.'
        ),
        'job_types': [
            'Product / SaaS companies',
            'Software houses & outsourcing firms',
            'Banks, fintech and telecom IT teams',
            'Freelance / contract development',
            'Startups and entrepreneurship',
        ],
        'opportunities': [
            'Junior to senior engineering career ladder with clear promotions',
            'Specialize in backend, frontend, mobile, DevOps or full-stack',
            'Move into tech lead, architect or engineering manager roles',
            'Build independent products or freelance for global clients',
        ],
        'risks': [
            'Rapid technology change requires continuous learning',
            'Competition is high—portfolio and projects matter as much as degrees',
            'Some low-quality bootcamps/courses oversell “easy” jobs',
            'Sedentary work and long screen hours without healthy habits',
        ],
        'skills': [
            'Programming (Python/JavaScript/Java/C++)',
            'Data structures & algorithms',
            'Databases & APIs',
            'Version control (Git)',
            'Problem solving & debugging',
            'Team communication',
        ],
    },
    'Data Science': {
        'about': (
            'Data Science combines statistics, programming and domain knowledge to turn raw data into decisions. '
            'Practitioners clean data, find patterns, build predictive models and communicate insights to leaders. '
            'It sits between computer science, maths and business analytics.'
        ),
        'market_outlook': (
            'Growing quickly in Pakistan as banks, e-commerce, telecoms and public-sector projects adopt analytics. '
            'Roles often start as data analyst and grow into data scientist / ML roles. Demand is strongest in cities '
            'with large enterprises and for remote analytics contracts.'
        ),
        'future_outlook': (
            'Future value is very high because every industry is becoming data-driven. AI increases demand for people '
            'who can prepare data, evaluate models and apply them responsibly—not only “train a model.”'
        ),
        'field_value': (
            'Strong salaries where skills are proven, transferable across industries, and closely linked to AI careers. '
            'Useful even if you later move into product, research or business strategy.'
        ),
        'job_types': [
            'Corporate analytics & BI teams',
            'Fintech / banking risk & marketing analytics',
            'E-commerce and marketplace insights',
            'Research labs and AI startups',
            'Consulting and freelance analytics',
        ],
        'opportunities': [
            'Progress from analyst → scientist → ML engineer',
            'Specialize in NLP, computer vision, forecasting or business intelligence',
            'Combine with domain expertise (health, finance, agriculture)',
            'Publish projects / Kaggle-style portfolios to stand out',
        ],
        'risks': [
            'Requires solid maths/statistics—weak foundations slow progress',
            'Job titles vary; some “data science” roles are mostly Excel/reporting',
            'Tools and frameworks change quickly',
            'Messy real-world data can be more frustrating than textbook ML',
        ],
        'skills': [
            'Statistics & probability',
            'Python (pandas, scikit-learn)',
            'SQL & data wrangling',
            'Data visualization',
            'Critical thinking',
            'Storytelling with data',
        ],
    },
    'Artificial Intelligence (AI)': {
        'about': (
            'Artificial Intelligence focuses on building systems that learn from data, recognize patterns and support '
            'or automate decisions—machine learning, deep learning, NLP, computer vision and intelligent agents. '
            'It is both a research field and a practical engineering discipline used across industries.'
        ),
        'market_outlook': (
            'Global and Pakistani demand is rising fast: chatbots, recommendation systems, document automation, '
            'fraud detection and generative AI products. Employers prize strong maths, Python and project experience. '
            'Entry can be competitive; many start via software/data roles then specialize.'
        ),
        'future_outlook': (
            'Among the strongest long-term fields. AI will reshape healthcare, education, agriculture, finance and '
            'creative work. Specialists who can build, evaluate and govern AI systems responsibly will remain scarce '
            'and valuable.'
        ),
        'field_value': (
            'High future relevance, strong international mobility, and overlap with software engineering and data science. '
            'Also creates entrepreneurship opportunities in AI-powered products.'
        ),
        'job_types': [
            'AI / ML engineer in product companies',
            'Research engineer in labs or universities',
            'Applied AI in banks, healthtech, agritech',
            'Generative AI / LLM application teams',
            'AI consulting and startups',
        ],
        'opportunities': [
            'Specialize in ML engineering, NLP, vision or MLOps',
            'Contribute to open-source and research communities',
            'Build AI features inside existing software products',
            'Launch niche AI tools for Pakistani or global markets',
        ],
        'risks': [
            'Steep learning curve (maths + coding + experiments)',
            'Hype vs real skills—employers test practical ability',
            'Ethics, bias and data privacy responsibilities',
            'Some roles need postgraduate study or strong portfolios',
        ],
        'skills': [
            'Python & ML libraries',
            'Linear algebra & calculus basics',
            'Machine learning & neural networks',
            'Data pipelines',
            'Experimentation & evaluation',
            'Research mindset',
        ],
    },
    'Cybersecurity': {
        'about': (
            'Cybersecurity protects networks, applications and data from attacks. Professionals identify weaknesses, '
            'monitor threats, respond to incidents and design secure systems. It blends networking, programming, '
            'risk management and ethical hacking practices.'
        ),
        'market_outlook': (
            'Demand is high as banks, government, telecoms and enterprises digitize. Pakistan faces a shortage of '
            'skilled security professionals. Certifications plus labs (TryHackMe/HackTheBox style practice) help hiring.'
        ),
        'future_outlook': (
            'Outlook remains strong: more devices, cloud services and cybercrime mean ongoing need for defenders. '
            'Cloud security, application security and privacy compliance are especially future-facing niches.'
        ),
        'field_value': (
            'Mission-critical work with good pay potential, clear specialization paths and international remote options. '
            'Skills transfer well into IT, networking and compliance roles.'
        ),
        'job_types': [
            'SOC / security operations centers',
            'Penetration testing & red teaming',
            'Application / cloud security',
            'Governance, risk & compliance (GRC)',
            'Managed security service providers',
        ],
        'opportunities': [
            'Grow from analyst to specialist to security architect',
            'Earn industry certifications (CompTIA Security+, CEH, OSCP path)',
            'Work with banks, telecoms or global remote clients',
            'Move into consulting or founding a security services firm',
        ],
        'risks': [
            'Always-on threat landscape—continuous learning is mandatory',
            'Shift work possible in SOC roles',
            'Legal/ethical boundaries must be respected (no illegal hacking)',
            'Burnout risk under incident pressure',
        ],
        'skills': [
            'Networking fundamentals',
            'Operating systems (Linux/Windows)',
            'Security analysis & threat modeling',
            'Scripting (Python/Bash)',
            'Cryptography basics',
            'Incident response',
        ],
    },
    'Web Development': {
        'about': (
            'Web Development focuses on building websites and web applications that users access through browsers. '
            'It covers frontend interfaces, backend servers, databases and deployment. It is one of the fastest ways '
            'to start earning with practical projects.'
        ),
        'market_outlook': (
            'Very high demand from agencies, startups, SMEs and freelancing marketplaces. Local businesses constantly '
            'need websites, e-commerce stores and admin dashboards. Strong portfolio often beats weak grades.'
        ),
        'future_outlook': (
            'Web remains the default delivery channel for software. Frameworks change, but fundamentals (HTTP, HTML/CSS/JS, '
            'APIs, databases) stay valuable. Full-stack and product-minded developers have the best long-term prospects.'
        ),
        'field_value': (
            'Quick path to freelancing income, flexible remote work, and a foundation for product, mobile and AI-app careers.'
        ),
        'job_types': [
            'Frontend / backend / full-stack roles',
            'Digital agencies',
            'Startup product teams',
            'Freelance client work',
            'E-commerce & SaaS companies',
        ],
        'opportunities': [
            'Specialize in React/Next.js, Node, Django or similar stacks',
            'Build a freelance brand with case studies',
            'Progress to tech lead or indie product founder',
            'Combine with UI/UX or SEO for higher-value offers',
        ],
        'risks': [
            'Crowded junior market without differentiated projects',
            'Framework churn can feel overwhelming',
            'Low-paying freelance gigs if you underprice',
            'Client management skills needed for freelancing success',
        ],
        'skills': [
            'HTML, CSS, JavaScript',
            'Frontend framework (e.g. React)',
            'Backend & databases',
            'APIs & authentication',
            'Deployment basics',
            'Problem solving',
        ],
    },
    'Mobile App Development': {
        'about': (
            'Mobile App Development creates applications for Android, iOS and cross-platform tools. Developers design '
            'user experiences, connect to APIs, handle offline data and publish apps to stores.'
        ),
        'market_outlook': (
            'Strong demand as businesses move services into apps—fintech, delivery, education and health. Cross-platform '
            'skills (Flutter/React Native) are especially hireable in Pakistan software houses.'
        ),
        'future_outlook': (
            'Mobile remains central to how people use digital services. Future growth includes AI features in apps, '
            'super-apps and industry-specific mobile products.'
        ),
        'field_value': (
            'Creative + technical mix, good freelance potential, and products that can reach millions of users.'
        ),
        'job_types': [
            'Android / iOS native teams',
            'Cross-platform app companies',
            'Product startups',
            'Agency mobile units',
            'Independent app publishers',
        ],
        'opportunities': [
            'Ship apps to Play Store / App Store as portfolio proof',
            'Specialize in Flutter, Kotlin, Swift or React Native',
            'Move into mobile architecture or product roles',
            'Launch your own consumer or niche business app',
        ],
        'risks': [
            'Store policies and update requirements add overhead',
            'Device fragmentation and testing complexity',
            'Need strong UI/UX sense beyond coding',
            'Competition from templates and low-cost app builders',
        ],
        'skills': [
            'Mobile programming',
            'UI implementation',
            'API integration',
            'App architecture',
            'Testing & debugging',
            'Product thinking',
        ],
    },
    'Cloud Computing': {
        'about': (
            'Cloud Computing is about designing and running applications on platforms like AWS, Azure and Google Cloud. '
            'It includes servers, networking, storage, containers, automation and reliability (DevOps/SRE practices).'
        ),
        'market_outlook': (
            'High demand as companies migrate from on-premise servers to cloud. Banks, startups and IT exporters need '
            'engineers who can deploy securely and cost-effectively. Cloud certifications improve visibility to employers.'
        ),
        'future_outlook': (
            'Excellent long-term outlook—almost all modern software runs on cloud infrastructure. Skills remain relevant '
            'as AI workloads and global SaaS products expand.'
        ),
        'field_value': (
            'High salaries for proven skills, strong remote opportunities, and a bridge between software development and IT operations.'
        ),
        'job_types': [
            'Cloud engineer / architect',
            'DevOps / platform engineering',
            'SRE / reliability teams',
            'Managed cloud service providers',
            'Enterprise IT transformation projects',
        ],
        'opportunities': [
            'Certify on AWS/Azure/GCP learning paths',
            'Specialize in Kubernetes, security or cost optimization',
            'Combine with software engineering for full-stack cloud roles',
            'Consult for companies migrating to cloud',
        ],
        'risks': [
            'Broad skill surface—easy to feel “jack of all trades”',
            'On-call / incident pressure in some roles',
            'Vendor lock-in and rapid service changes',
            'Mistakes can cause costly outages or bills',
        ],
        'skills': [
            'Linux & networking',
            'Cloud platforms (AWS/Azure/GCP)',
            'Containers & CI/CD',
            'Infrastructure as code',
            'Monitoring & security',
            'Automation scripting',
        ],
    },
    'Game Development': {
        'about': (
            'Game Development combines programming, design, art direction and storytelling to create interactive games '
            'for mobile, PC and consoles. Teams may include gameplay programmers, artists, designers and producers.'
        ),
        'market_outlook': (
            'Growing in Pakistan’s mobile and indie scenes, with global remote opportunities. Local studio jobs are fewer '
            'than mainstream software roles, so freelancing, indie releases and remote studio work matter.'
        ),
        'future_outlook': (
            'Entertainment and interactive media keep expanding. AR/VR and mobile gaming create new niches, though '
            'success often depends on portfolio quality and teamwork.'
        ),
        'field_value': (
            'Highly creative technical career. Strong portfolios can unlock international remote roles and indie entrepreneurship.'
        ),
        'job_types': [
            'Gameplay / engine programming',
            'Mobile game studios',
            'Indie / freelance game teams',
            'Technical design roles',
            'QA and live-ops for games',
        ],
        'opportunities': [
            'Publish small games as portfolio pieces',
            'Specialize in Unity/Unreal programming or design',
            'Join global remote indie collaborations',
            'Move into interactive media, simulation or XR',
        ],
        'risks': [
            'Fewer stable local openings than software engineering',
            'Crunch culture in some studios',
            'Income can be irregular for indie creators',
            'Requires both creative and technical excellence',
        ],
        'skills': [
            'Game engines (Unity/Unreal)',
            'Programming',
            'Game design fundamentals',
            '3D / math intuition',
            'Creativity & iteration',
            'Team collaboration',
        ],
    },
    'Business Administration': {
        'about': (
            'Business Administration develops broad skills in management, marketing, finance, operations and leadership. '
            'Graduates can enter many industries or start their own ventures. It is a flexible degree rather than a single job track.'
        ),
        'market_outlook': (
            'Steady demand across corporations, SMEs, banks and NGOs. Competition is high because many graduates choose BBA/MBA, '
            'so internships, communication skills and domain focus (marketing, finance, HR) improve outcomes.'
        ),
        'future_outlook': (
            'Management skills remain relevant, especially when combined with digital literacy, data awareness and entrepreneurship. '
            'Specialized tracks outperform generic “any office job” paths.'
        ),
        'field_value': (
            'Wide career options, useful business language for any industry, and a solid base for entrepreneurship or MBA later.'
        ),
        'job_types': [
            'Management trainee programs',
            'Operations & administration',
            'Sales and business development',
            'Corporate functional roles (marketing/HR/finance)',
            'Family business / startup leadership',
        ],
        'opportunities': [
            'Rotate through departments via trainee programs',
            'Specialize early (finance, marketing, supply chain)',
            'Build toward MBA or professional certifications',
            'Launch or grow a small business',
        ],
        'risks': [
            'Degree alone is not enough in a crowded market',
            'Entry salaries can be modest without skills/experience',
            'Risk of staying in generic roles without specialization',
            'Office politics and soft-skill demands are high',
        ],
        'skills': [
            'Leadership & teamwork',
            'Communication',
            'Basic accounting & Excel',
            'Strategic thinking',
            'Customer focus',
            'Time management',
        ],
    },
    'Marketing': {
        'about': (
            'Marketing is about understanding customers and growing demand for products or services—branding, advertising, '
            'digital campaigns, content and market research. Modern marketing is heavily digital and data-informed.'
        ),
        'market_outlook': (
            'Strong demand in agencies, e-commerce, FMCG, startups and freelancing (social media, SEO, performance ads). '
            'Practical campaign results often matter more than theory alone.'
        ),
        'future_outlook': (
            'Digital marketing, content and analytics keep expanding. AI tools will change execution, but strategy, creativity '
            'and customer insight remain human strengths.'
        ),
        'field_value': (
            'Creative commercial career with freelance flexibility and clear paths into brand, growth or entrepreneurship.'
        ),
        'job_types': [
            'Digital marketing & performance ads',
            'Brand management',
            'Content / social media roles',
            'Market research',
            'Agency account & strategy roles',
        ],
        'opportunities': [
            'Build a portfolio of campaigns and case studies',
            'Specialize in SEO, paid ads, content or brand',
            'Freelance for local SMEs and online brands',
            'Move into growth product or startup founding roles',
        ],
        'risks': [
            'Metrics pressure and fast-changing platforms',
            'Entry roles can be stressful / target-driven',
            'Easy to chase trends without strategic depth',
            'Income variability in pure freelance work',
        ],
        'skills': [
            'Communication & copywriting',
            'Digital platforms & analytics',
            'Creativity',
            'Consumer insight',
            'Campaign planning',
            'Basic data literacy',
        ],
    },
    'Finance': {
        'about': (
            'Finance focuses on how money is raised, invested and managed—corporate finance, banking, markets, risk and '
            'financial analysis. It suits students who like numbers, markets and structured decision-making.'
        ),
        'market_outlook': (
            'Consistent demand in banks, investment firms, corporate finance teams and fintech. Professional exams '
            '(ACCA pathways, CFA interest, banking exams) strengthen profiles.'
        ),
        'future_outlook': (
            'Stable long-term field. Fintech, Islamic finance and data-driven investing create new niches while core banking '
            'and corporate roles remain.'
        ),
        'field_value': (
            'Strong earning potential, prestigious pathways and transferable analytical skills across industries.'
        ),
        'job_types': [
            'Commercial / investment banking',
            'Financial analysis & FP&A',
            'Asset management / brokerage',
            'Fintech & payments',
            'Risk and credit analysis',
        ],
        'opportunities': [
            'Join bank trainee or analyst programs',
            'Pursue CFA/FRM or related credentials over time',
            'Specialize in corporate finance, markets or risk',
            'Move into fintech product or entrepreneurship',
        ],
        'risks': [
            'Competitive entry and exam-heavy progression',
            'Market cycles can affect hiring in some segments',
            'High responsibility and compliance pressure',
            'Long hours in certain banking/markets roles',
        ],
        'skills': [
            'Financial analysis',
            'Numeracy & Excel modeling',
            'Economics fundamentals',
            'Risk awareness',
            'Attention to detail',
            'Ethical judgment',
        ],
    },
    'Accounting': {
        'about': (
            'Accounting records, audits and interprets financial information so organizations stay compliant and make '
            'informed decisions. It includes financial reporting, taxation, audit and management accounting.'
        ),
        'market_outlook': (
            'Reliable demand in firms, companies and practice offices. ACCA/CA pathways are well recognized in Pakistan. '
            'Every serious business needs accounting capability.'
        ),
        'future_outlook': (
            'Automation will reduce routine bookkeeping, but advisory, audit judgment, tax strategy and systems skills '
            'remain valuable. Accountants who use software and analytics stay ahead.'
        ),
        'field_value': (
            'Stable career, global mobility via professional qualifications, and a foundation for finance leadership or entrepreneurship.'
        ),
        'job_types': [
            'Audit & assurance',
            'Tax consultancy',
            'Corporate accounting',
            'Management accounting',
            'Accounting practice / freelancing for SMEs',
        ],
        'opportunities': [
            'Pursue CA/ACCA/CPA-aligned routes',
            'Specialize in tax, audit or ERP systems',
            'Grow into finance manager / controller roles',
            'Start an accounting practice for SMEs',
        ],
        'risks': [
            'Deadline pressure around closings and filings',
            'Repetitive work early in career',
            'Must keep up with tax and reporting rule changes',
            'Professional exams require multi-year commitment',
        ],
        'skills': [
            'Financial accounting',
            'Accuracy & ethics',
            'Taxation basics',
            'Excel / accounting software',
            'Audit mindset',
            'Business communication',
        ],
    },
    'Human Resource Management': {
        'about': (
            'HR Management covers hiring, employee development, performance, compensation and workplace culture. '
            'HR professionals help organizations find talent and keep people productive and compliant with labor rules.'
        ),
        'market_outlook': (
            'Steady demand across medium and large organizations. Digital HR, talent acquisition and L&D roles are growing. '
            'Soft skills plus labor-law awareness matter.'
        ),
        'future_outlook': (
            'People strategy becomes more important as companies compete for skilled talent. HR analytics and employee '
            'experience roles are rising.'
        ),
        'field_value': (
            'People-centered career with influence on culture and growth; transferable across industries.'
        ),
        'job_types': [
            'Talent acquisition / recruiting',
            'HR generalist / business partner',
            'Learning & development',
            'Compensation & HR operations',
            'People analytics',
        ],
        'opportunities': [
            'Start in recruiting then broaden to HRBP',
            'Specialize in L&D, OD or compensation',
            'Move into organizational leadership roles',
            'Consult for growing SMEs on HR systems',
        ],
        'risks': [
            'Emotional labor in conflict and layoff situations',
            'Can be seen as “support only” without strategic skill',
            'Needs confidentiality and fairness under pressure',
            'Entry roles may be admin-heavy',
        ],
        'skills': [
            'Communication & empathy',
            'Recruitment interviewing',
            'Conflict resolution',
            'Labor law basics',
            'Organization skills',
            'Data privacy awareness',
        ],
    },
    'Entrepreneurship': {
        'about': (
            'Entrepreneurship is about creating and growing businesses—finding problems worth solving, building offers, '
            'selling, managing cash and leading teams. It can be studied formally but is proven through action.'
        ),
        'market_outlook': (
            'Pakistan’s startup and SME ecosystem is active but uneven. Opportunities exist in digital services, commerce, '
            'education and local problem-solving. Funding is competitive; bootstrapping is common.'
        ),
        'future_outlook': (
            'High upside long-term for those who learn sales, product and resilience. Digital tools lower the cost of starting, '
            'while competition and economic cycles raise the bar.'
        ),
        'field_value': (
            'Ownership, unlimited upside and skill stacking (sales, finance, leadership). Even failed ventures teach rare experience.'
        ),
        'job_types': [
            'Founder / co-founder',
            'Small business owner',
            'Business development roles',
            'Startup operator roles',
            'Family business succession',
        ],
        'opportunities': [
            'Launch micro-products while studying',
            'Join early-stage startups to learn fast',
            'Use incubators and university entrepreneurship cells',
            'Pivot skills into sales or product careers if needed',
        ],
        'risks': [
            'Income instability and high failure rate',
            'Personal financial and mental stress',
            'Requires sales grit many students underestimate',
            'Family/social pressure if results are slow',
        ],
        'skills': [
            'Customer discovery & sales',
            'Financial basics',
            'Resilience',
            'Leadership',
            'Marketing',
            'Decision making under uncertainty',
        ],
    },
    'General Medicine': {
        'about': (
            'General Medicine (MBBS pathway) trains doctors to diagnose, treat and prevent illness. It is a long, rigorous '
            'program involving clinical rotations, licensing requirements and often postgraduate specialization.'
        ),
        'market_outlook': (
            'Stable high social demand for physicians in Pakistan. Public and private hospitals hire continuously, though '
            'training seats, house jobs and specialization pathways are competitive.'
        ),
        'future_outlook': (
            'Medicine remains essential. Future practice will use more diagnostics technology and digital health, but clinical '
            'judgment and patient care stay central. Specialists often have stronger earning paths.'
        ),
        'field_value': (
            'High social impact, respect and long-term employability. Global mobility possible after licensing exams and experience.'
        ),
        'job_types': [
            'Medical officer / physician roles',
            'Hospital clinical practice',
            'Specialization (medicine, surgery, etc.)',
            'Public health & community medicine',
            'Medical education / research',
        ],
        'opportunities': [
            'House job → postgraduate FCPS/MD pathways',
            'Work in public or private healthcare systems',
            'Serve underserved communities with high impact',
            'Combine clinical work with research or healthtech',
        ],
        'risks': [
            'Very long training timeline and high academic pressure',
            'MDCAT and admission competitiveness',
            'Burnout, night duties and emotional load',
            'Specialization seats and location constraints',
        ],
        'skills': [
            'Scientific foundations (bio/chem/physics)',
            'Empathy & communication',
            'Clinical decision-making',
            'Stamina & discipline',
            'Ethical responsibility',
            'Continuous learning',
        ],
    },
    'Surgery': {
        'about': (
            'Surgery focuses on treating disease and injury through operative procedures. Surgeons need deep anatomy knowledge, '
            'precision, teamwork in operating rooms and the ability to make high-stakes decisions.'
        ),
        'market_outlook': (
            'Strong demand in hospitals for surgical services, but the path is long: MBBS plus competitive postgraduate surgical training.'
        ),
        'future_outlook': (
            'Surgical need remains high. Minimally invasive techniques, imaging guidance and robotics will shape future practice, '
            'increasing the value of tech-comfortable surgeons.'
        ),
        'field_value': (
            'High-impact clinical career with specialized prestige and the ability to dramatically improve patient outcomes.'
        ),
        'job_types': [
            'General surgery',
            'Surgical specialties',
            'Hospital consultant pathways',
            'Trauma / emergency surgical teams',
            'Academic surgery & teaching',
        ],
        'opportunities': [
            'Pursue specialty fellowships over time',
            'Work in major tertiary hospitals',
            'Contribute to surgical education and research',
            'Combine with medical device / health innovation interests',
        ],
        'risks': [
            'Extremely demanding training and on-call lifestyle',
            'High responsibility for patient outcomes',
            'Physical and mental fatigue',
            'Long delay before independent practice',
        ],
        'skills': [
            'Precision & fine motor skill',
            'Anatomy mastery',
            'Crisis decision-making',
            'Team leadership in OR',
            'Stamina',
            'Patient communication',
        ],
    },
    'Dentistry': {
        'about': (
            'Dentistry prevents, diagnoses and treats oral disease—from routine care to surgery and orthodontics. '
            'It blends clinical science with hand skills and patient communication.'
        ),
        'market_outlook': (
            'Good demand in private clinics and hospitals. Many dentists build private practices. Urban markets are '
            'competitive; quality, location and patient trust drive success.'
        ),
        'future_outlook': (
            'Oral health awareness is rising. Cosmetic dentistry, implants and digital dentistry tools expand services, '
            'while preventive care remains foundational.'
        ),
        'field_value': (
            'Professional independence potential, strong private-practice pathway and meaningful patient impact.'
        ),
        'job_types': [
            'General dental practice',
            'Hospital dental departments',
            'Orthodontics / specialty tracks',
            'Dental surgery',
            'Academic dentistry',
        ],
        'opportunities': [
            'Open or join a private clinic',
            'Specialize after BDS (orthodontics, surgery, etc.)',
            'Combine clinical work with dental product businesses',
            'Serve community oral-health programs',
        ],
        'risks': [
            'Clinic setup costs for private practice',
            'Competitive urban markets',
            'Requires excellent manual dexterity and patient manner',
            'Continuous investment in equipment and skills',
        ],
        'skills': [
            'Manual dexterity',
            'Clinical precision',
            'Patient communication',
            'Diagnostic judgment',
            'Business basics (for private practice)',
            'Infection control',
        ],
    },
    'Pharmacy': {
        'about': (
            'Pharmacy studies how medicines are developed, prepared, dispensed and used safely. Pharmacists work in '
            'community pharmacies, hospitals, industry and regulatory settings.'
        ),
        'market_outlook': (
            'Solid demand in retail pharmacy, hospitals and pharma companies. Industrial and clinical roles can be more '
            'competitive and may favor strong academics or further training.'
        ),
        'future_outlook': (
            'Pharmaceutical industry growth, clinical pharmacy and regulatory affairs support long-term relevance. '
            'Automation may change dispensing workflows but counseling and specialist roles remain.'
        ),
        'field_value': (
            'Science-based healthcare career with industry options beyond the counter—research, QA, medical sales and regulation.'
        ),
        'job_types': [
            'Community / retail pharmacist',
            'Hospital clinical pharmacy',
            'Pharmaceutical industry (QA/production)',
            'Regulatory affairs',
            'Medical / pharmaceutical sales',
        ],
        'opportunities': [
            'Move into industry quality or R&D support roles',
            'Specialize in clinical pharmacy',
            'Own or manage a pharmacy business',
            'Work in drug regulation and compliance',
        ],
        'risks': [
            'Retail roles can be shift-based and repetitive',
            'Responsibility for dispensing errors',
            'Industry roles may need extra credentials/experience',
            'Must stay current with drug information',
        ],
        'skills': [
            'Chemistry & pharmacology foundations',
            'Accuracy',
            'Patient counseling',
            'Regulatory awareness',
            'Scientific analysis',
            'Ethics',
        ],
    },
    'Nursing': {
        'about': (
            'Nursing provides direct patient care, supports treatment plans and educates patients and families. '
            'Nurses are essential to hospital and community health systems.'
        ),
        'market_outlook': (
            'Very high demand in Pakistan and abroad. Hospitals continually need nurses; international placement pathways '
            'exist after licensing and language requirements are met.'
        ),
        'future_outlook': (
            'Long-term demand is excellent due to healthcare workforce shortages. Specializations (ICU, ER, community health) '
            'increase value.'
        ),
        'field_value': (
            'Strong employability, meaningful service and international mobility potential with the right credentials.'
        ),
        'job_types': [
            'Hospital staff nursing',
            'Critical care / specialty nursing',
            'Community & public health nursing',
            'Clinic and home-care roles',
            'Nursing education',
        ],
        'opportunities': [
            'Specialize in ICU, pediatrics, surgical or ER nursing',
            'Pursue international licensing pathways',
            'Grow into nurse educator or management roles',
            'Work in public health programs',
        ],
        'risks': [
            'Physically and emotionally demanding shifts',
            'Exposure to infection and workplace stress',
            'Variable pay depending on employer and country',
            'Need resilience and strong support systems',
        ],
        'skills': [
            'Clinical care skills',
            'Empathy',
            'Communication',
            'Teamwork',
            'Observation & judgment',
            'Stress management',
        ],
    },
    'Physiotherapy': {
        'about': (
            'Physiotherapy helps people restore movement and function after injury, surgery or illness through exercise, '
            'manual therapy and rehabilitation planning.'
        ),
        'market_outlook': (
            'Growing demand with sports culture, aging populations and post-surgical rehab needs. Private clinics and '
            'hospital rehab units hire; many physiotherapists also practice independently.'
        ),
        'future_outlook': (
            'Positive outlook as preventive health and sports rehab expand. Tele-rehab and specialized clinics create new models.'
        ),
        'field_value': (
            'Hands-on healthcare career with visible patient progress and flexible clinic or sports settings.'
        ),
        'job_types': [
            'Hospital physiotherapy',
            'Private rehab clinics',
            'Sports physiotherapy',
            'Community rehab',
            'Specialized orthopedic / neuro rehab',
        ],
        'opportunities': [
            'Build a private practice over time',
            'Specialize in sports, neuro or pediatric rehab',
            'Collaborate with orthopedic and sports teams',
            'Teach fitness/rehab education content',
        ],
        'risks': [
            'Physical strain from manual therapy work',
            'Income depends on caseload in private practice',
            'Requires strong anatomy and patient motivation skills',
            'Recognition/scope varies by workplace',
        ],
        'skills': [
            'Anatomy & movement science',
            'Assessment skills',
            'Patient coaching',
            'Exercise prescription',
            'Empathy',
            'Record keeping',
        ],
    },
    'Radiology': {
        'about': (
            'Radiology uses imaging (X-ray, CT, MRI, ultrasound) to diagnose and sometimes guide treatment. '
            'The field includes physicians (radiologists) and technologists who operate equipment safely.'
        ),
        'market_outlook': (
            'High demand in diagnostic centers and hospitals as imaging becomes central to modern care. Technology skills '
            'and accuracy are prized.'
        ),
        'future_outlook': (
            'Strong future with advancing imaging tech and AI-assisted reading. Human oversight, protocol design and '
            'interventional skills remain critical.'
        ),
        'field_value': (
            'Technology-rich medical career with central diagnostic impact across almost every specialty.'
        ),
        'job_types': [
            'Diagnostic radiology',
            'Radiologic / imaging technology',
            'Interventional radiology pathways',
            'Hospital imaging departments',
            'Private diagnostic centers',
        ],
        'opportunities': [
            'Specialize in modalities (MRI/CT/US)',
            'Work in high-volume diagnostic networks',
            'Combine with AI imaging tools as they mature',
            'Pursue advanced clinical radiology training where applicable',
        ],
        'risks': [
            'Radiation safety responsibilities',
            'Shift work in some centers',
            'Physician pathway is long and competitive',
            'Must continually learn new machines/protocols',
        ],
        'skills': [
            'Imaging physics basics',
            'Attention to detail',
            'Patient positioning & care',
            'Safety protocols',
            'Pattern recognition',
            'Technical troubleshooting',
        ],
    },
    'Nutrition & Dietetics': {
        'about': (
            'Nutrition and Dietetics applies food and nutrition science to health—clinical diets, public health nutrition '
            'and lifestyle counseling for individuals and communities.'
        ),
        'market_outlook': (
            'Growing demand with lifestyle disease awareness, fitness culture and hospital dietetics. Private counseling '
            'and content/education niches are expanding.'
        ),
        'future_outlook': (
            'Positive as preventive healthcare grows. Personalized nutrition and digital coaching create new opportunities.'
        ),
        'field_value': (
            'Meaningful preventive-health impact with flexible clinical, community and entrepreneurial paths.'
        ),
        'job_types': [
            'Clinical dietitian',
            'Hospital nutrition departments',
            'Public health nutrition',
            'Sports nutrition',
            'Private nutrition counseling',
        ],
        'opportunities': [
            'Counsel in clinics or telehealth',
            'Work with sports teams or wellness brands',
            'Create evidence-based education content/businesses',
            'Join NGO / public health nutrition programs',
        ],
        'risks': [
            'Must fight misinformation and fad diets',
            'Private practice needs marketing skills',
            'Scope can be misunderstood by clients',
            'Evidence standards must stay high',
        ],
        'skills': [
            'Nutrition science',
            'Counseling',
            'Meal planning',
            'Behavior change support',
            'Scientific literacy',
            'Communication',
        ],
    },
    'Medical Laboratory Technology': {
        'about': (
            'Medical Laboratory Technology performs lab tests on blood, tissues and other samples that doctors use for '
            'diagnosis and treatment monitoring. Accuracy and lab safety are central.'
        ),
        'market_outlook': (
            'Strong demand in diagnostic labs and hospitals. The testing market in Pakistan continues to expand with private lab networks.'
        ),
        'future_outlook': (
            'Stable to strong outlook. Automation changes workflows, but skilled technologists are still needed for quality control, '
            'complex testing and lab management.'
        ),
        'field_value': (
            'Essential behind-the-scenes healthcare role with clear technical career paths and solid employability.'
        ),
        'job_types': [
            'Hospital laboratories',
            'Private diagnostic labs',
            'Microbiology / hematology units',
            'Lab quality & supervision',
            'Research support labs',
        ],
        'opportunities': [
            'Specialize in microbiology, hematology or molecular diagnostics',
            'Grow into lab supervisor / quality manager',
            'Work with large diagnostic chains',
            'Support research or public health testing',
        ],
        'risks': [
            'Exposure risks if safety protocols slip',
            'Repetitive high-volume testing pressure',
            'Shift work in 24/7 labs',
            'Must maintain extreme accuracy under time pressure',
        ],
        'skills': [
            'Lab techniques',
            'Attention to detail',
            'Biosafety',
            'Instrument handling',
            'Data recording',
            'Quality control',
        ],
    },
    'Electrical Engineering': {
        'about': (
            'Electrical Engineering designs and maintains systems that generate, distribute and use electrical power and '
            'electronics—from power grids and industrial controls to embedded devices and telecom infrastructure.'
        ),
        'market_outlook': (
            'Steady demand in power companies, manufacturing, telecom and construction projects. Government and industrial '
            'projects create hiring cycles; internships help a lot.'
        ),
        'future_outlook': (
            'Remains core as electrification, renewable energy and electronics grow. Embedded systems, power electronics '
            'and smart-grid skills increase future value.'
        ),
        'field_value': (
            'Foundational engineering discipline with infrastructure impact and pathways into energy, electronics and automation.'
        ),
        'job_types': [
            'Power & utilities',
            'Industrial / plant engineering',
            'Electronics & embedded systems',
            'Telecom infrastructure',
            'Project & maintenance engineering',
        ],
        'opportunities': [
            'Join WAPDA/DISCO or private power projects',
            'Specialize in electronics, control or renewable energy',
            'Move into project management',
            'Combine with software for embedded/IoT careers',
        ],
        'risks': [
            'Some roles are site-based with safety hazards',
            'Hiring can follow project/economic cycles',
            'May need additional certifications for certain jobs',
            'Strong maths/physics foundation required',
        ],
        'skills': [
            'Circuit analysis',
            'Power systems basics',
            'Electronics',
            'Mathematical modeling',
            'Safety awareness',
            'Problem solving',
        ],
    },
    'Psychology': {
        'about': (
            'Psychology is the scientific study of mind and behavior. Careers range from counseling and clinical paths to '
            'HR, research, education and user research—depending on further training and licensing.'
        ),
        'market_outlook': (
            'Growing as mental-health awareness rises in Pakistan. Clinical practice usually needs advanced degrees and '
            'supervised training; bachelor-level grads often enter HR, support or research-assistant roles first.'
        ),
        'future_outlook': (
            'Positive long-term due to mental health needs, school counseling demand and digital mental-health services. '
            'Evidence-based practice will matter more than informal advising.'
        ),
        'field_value': (
            'Deep human-impact career with flexible applications in health, education, business and research.'
        ),
        'job_types': [
            'Counseling / clinical pathways (with further study)',
            'School / educational support roles',
            'HR and people operations',
            'Research assistant / behavioral research',
            'UX / user research (with added skills)',
        ],
        'opportunities': [
            'Pursue MS/MPhil and supervised clinical training',
            'Work in NGOs and community mental-health programs',
            'Apply psychology in HR, L&D or UX research',
            'Create psychoeducation content ethically',
        ],
        'risks': [
            'Clinical titles require proper qualifications—don’t practice beyond scope',
            'Emotional burnout risk in helping roles',
            'Bachelor-only job market can be unclear',
            'Stigma and low awareness still affect some settings',
        ],
        'skills': [
            'Active listening',
            'Empathy',
            'Research methods',
            'Ethics & confidentiality',
            'Written communication',
            'Observation',
        ],
    },
    'Law': {
        'about': (
            'Law trains students to understand legal systems, advise clients and represent interests in disputes or '
            'compliance matters. Pathways include litigation, corporate counsel, public service and policy.'
        ),
        'market_outlook': (
            'Steady demand for lawyers in litigation, corporate work and public roles. Early years can be apprenticeship-heavy; '
            'reputation, writing skill and networks strongly affect success.'
        ),
        'future_outlook': (
            'Legal needs persist with business growth, regulation and digital rights issues. Tech-law, corporate compliance '
            'and ADR create modern niches.'
        ),
        'field_value': (
            'Influential profession with civic impact, intellectual challenge and diverse practice areas.'
        ),
        'job_types': [
            'Litigation practice',
            'Corporate / commercial counsel',
            'Public prosecutor / government legal roles',
            'Legal advisory & compliance',
            'Policy and research roles',
        ],
        'opportunities': [
            'Apprentice with chambers / firms',
            'Specialize in corporate, criminal, family or cyber law',
            'Move into compliance for banks and companies',
            'Public service and advocacy organizations',
        ],
        'risks': [
            'Long ramp-up before stable income for many litigators',
            'High reading/writing workload',
            'Adversarial stress in courtroom practice',
            'Ethics and reputation risks if shortcuts are taken',
        ],
        'skills': [
            'Legal reasoning',
            'Research & writing',
            'Oral advocacy',
            'Attention to detail',
            'Negotiation',
            'Ethics',
        ],
    },
    'Fine Arts': {
        'about': (
            'Fine Arts develops creative practice in drawing, painting, sculpture and related visual forms. Students build '
            'a personal artistic voice, technical craft and understanding of art history and critique.'
        ),
        'market_outlook': (
            'Market is passion-driven and competitive. Income often mixes studio sales, commissions, teaching and related '
            'creative work. Strong portfolios and networks matter.'
        ),
        'future_outlook': (
            'Creative industries and digital distribution expand reach, but financial stability usually requires multiple '
            'income streams or adjacent design skills.'
        ),
        'field_value': (
            'Deep creative fulfillment, cultural contribution and transferable visual thinking for design careers.'
        ),
        'job_types': [
            'Studio artist',
            'Art education / instruction',
            'Gallery and cultural institutions',
            'Commissions & illustration-adjacent work',
            'Creative direction support roles',
        ],
        'opportunities': [
            'Exhibit and sell through galleries or online',
            'Teach art in schools/academies',
            'Bridge into graphic design or illustration',
            'Collaborate on cultural and media projects',
        ],
        'risks': [
            'Irregular income especially early on',
            'Limited formal job openings versus applied design',
            'Requires self-marketing discipline',
            'Family/social pressure about “stable careers”',
        ],
        'skills': [
            'Drawing & visual fundamentals',
            'Creative ideation',
            'Craftsmanship',
            'Critique & iteration',
            'Portfolio building',
            'Self-discipline',
        ],
    },
    'Graphic Design': {
        'about': (
            'Graphic Design communicates ideas visually through branding, typography, layouts and digital interfaces. '
            'Designers work for agencies, companies and freelance clients across print and digital media.'
        ),
        'market_outlook': (
            'High practical demand for branding, social creatives, packaging and UI assets. Freelance marketplaces and '
            'local agencies hire continuously; portfolio quality is decisive.'
        ),
        'future_outlook': (
            'Strong as brands stay digital-first. UI/UX overlap increases value. AI speeds production, so concept, taste '
            'and strategy become the differentiators.'
        ),
        'field_value': (
            'Creative career with clear commercial demand, freelance flexibility and pathways into product design.'
        ),
        'job_types': [
            'Brand / graphic designer',
            'Agency creative roles',
            'UI / visual design',
            'Motion/social design',
            'Freelance design studio',
        ],
        'opportunities': [
            'Build a niche (brands, UI, packaging, social)',
            'Freelance for startups and SMEs',
            'Grow into art director / design lead',
            'Transition toward UX product design',
        ],
        'risks': [
            'Client revisions and tight deadlines',
            'Tool and trend churn',
            'Race-to-bottom pricing on freelance platforms',
            'Need business skills for sustainable freelancing',
        ],
        'skills': [
            'Typography & layout',
            'Design software (Adobe/Figma)',
            'Visual communication',
            'Brand thinking',
            'Feedback handling',
            'Basic UX awareness',
        ],
    },
    'Media & Communication': {
        'about': (
            'Media and Communication covers journalism, broadcasting, digital content, public relations and media analysis. '
            'Students learn to research, write, produce and distribute stories and messages across platforms.'
        ),
        'market_outlook': (
            'Shifted heavily toward digital content, social media and brand communication. Traditional newsroom jobs are '
            'limited; creators, producers and PR roles are more available.'
        ),
        'future_outlook': (
            'Content demand continues, but formats change quickly. Multimedia skills, verification ethics and audience '
            'understanding define future success.'
        ),
        'field_value': (
            'Influential storytelling career with options in journalism, brands, production and entrepreneurship.'
        ),
        'job_types': [
            'Journalism / reporting',
            'Content production',
            'Public relations',
            'Social media & brand communication',
            'Broadcast / digital media teams',
        ],
        'opportunities': [
            'Build a public portfolio (articles, video, podcasts)',
            'Specialize in investigative, tech or business media',
            'Move into corporate communications',
            'Launch an independent media brand',
        ],
        'risks': [
            'Unstable early freelancing income',
            'Misinformation pressures and ethical challenges',
            'Public scrutiny and deadline stress',
            'AI tools increase competition for basic content',
        ],
        'skills': [
            'Writing & editing',
            'Interviewing',
            'Storytelling',
            'Digital production basics',
            'Media ethics',
            'Presentation',
        ],
    },
    'International Relations': {
        'about': (
            'International Relations studies diplomacy, global politics, security and cooperation between states and '
            'organizations. Graduates often pursue policy, development, research or public service paths.'
        ),
        'market_outlook': (
            'Selective demand in foreign service, think tanks, NGOs, media analysis and international organizations. '
            'Entry is competitive; language skills, research quality and internships matter greatly.'
        ),
        'future_outlook': (
            'Geopolitics, climate, trade and security issues keep IR relevant. Data literacy and regional expertise improve employability.'
        ),
        'field_value': (
            'Intellectually rich field with civic impact and pathways into policy, diplomacy and development work.'
        ),
        'job_types': [
            'Diplomatic / foreign service tracks',
            'Policy research & think tanks',
            'International development / NGOs',
            'Political risk analysis',
            'Media & public affairs analysis',
        ],
        'opportunities': [
            'Prepare for CSS / foreign service exams where relevant',
            'Intern with NGOs, embassies or research centers',
            'Specialize in a region or theme (security, trade, climate)',
            'Combine with languages or data skills',
        ],
        'risks': [
            'Fewer direct “IR job” openings than business/IT fields',
            'May need postgraduate study for research roles',
            'Exam and network barriers for prestigious tracks',
            'Progress can be slow without targeted skill stacking',
        ],
        'skills': [
            'Research & analysis',
            'Academic writing',
            'Presentation',
            'Critical thinking',
            'Foreign language advantage',
            'Policy awareness',
        ],
    },
    'Education': {
        'about': (
            'Education prepares people to teach, design learning experiences and lead schools or learning programs. '
            'It includes classroom teaching, curriculum work, educational management and edtech roles.'
        ),
        'market_outlook': (
            'Consistent demand for teachers across public and private schools. Subject specialists (STEM, English) and '
            'strong communicators are preferred. Edtech and tutoring markets add extra options.'
        ),
        'future_outlook': (
            'Teaching remains essential. Blended learning, assessment reform and education technology create new roles beyond '
            'the traditional classroom.'
        ),
        'field_value': (
            'High social impact, relatively stable demand and the chance to shape the next generation’s opportunities.'
        ),
        'job_types': [
            'School teaching',
            'Tuition / academic coaching',
            'Curriculum & academic coordination',
            'Education management',
            'Edtech content / instructional design',
        ],
        'opportunities': [
            'Specialize in a subject and grade band',
            'Move into coordination or school leadership',
            'Create educational content or tutoring businesses',
            'Join NGOs focused on learning access',
        ],
        'risks': [
            'Pay varies widely by school system',
            'Classroom management and emotional labor',
            'Administrative load outside teaching hours',
            'Need continuous pedagogy updates',
        ],
        'skills': [
            'Subject mastery',
            'Communication',
            'Lesson planning',
            'Empathy & classroom management',
            'Assessment design',
            'Patience',
        ],
    },
    'Civil Engineering': {
        'about': (
            'Civil Engineering focuses on planning, designing and supervising infrastructure—buildings, roads, bridges, '
            'water systems and urban works. It combines maths, physics, materials knowledge and site management.'
        ),
        'market_outlook': (
            'Steady demand linked to construction, housing, transport and public works across Pakistan. Hiring often '
            'follows project cycles in contractors, consultancies and government departments.'
        ),
        'future_outlook': (
            'Long-term need remains as cities expand and infrastructure ages. Skills in sustainable design, BIM/CAD and '
            'project controls increase future value.'
        ),
        'field_value': (
            'Visible societal impact, clear professional pathway and roles across public and private construction ecosystems.'
        ),
        'job_types': [
            'Construction contractors',
            'Consulting design firms',
            'Public works / development projects',
            'Real-estate developers',
            'Infrastructure & water projects',
        ],
        'opportunities': [
            'Grow from site engineer to project lead',
            'Specialize in structures, geotech, transport or water',
            'Move into project management',
            'Pursue professional licensure over time',
        ],
        'risks': [
            'Site work can be physically demanding and schedule-driven',
            'Project delays and economic cycles affect hiring',
            'Safety responsibility on construction sites',
            'Requires strong maths/physics foundations',
        ],
        'skills': [
            'Structural & technical fundamentals',
            'CAD / drawing',
            'Site coordination',
            'Safety awareness',
            'Problem solving',
            'Team communication',
        ],
    },
    'Mechanical Engineering': {
        'about': (
            'Mechanical Engineering designs and improves machines and thermal/mechanical systems used in manufacturing, '
            'energy, HVAC, automotive and industrial plants.'
        ),
        'market_outlook': (
            'Broad industrial demand in manufacturing, energy and maintenance roles. Opportunities exist in factories, '
            'consultancies and plant engineering teams.'
        ),
        'future_outlook': (
            'Remains core as industry automates. Mechatronics, CAD/CAM and energy-efficient design raise long-term value.'
        ),
        'field_value': (
            'Versatile engineering base with pathways into design, production, energy and technical management.'
        ),
        'job_types': [
            'Manufacturing & production plants',
            'HVAC and building services',
            'Automotive / industrial maintenance',
            'Energy and utilities',
            'Design consultancies',
        ],
        'opportunities': [
            'Specialize in design, manufacturing or HVAC',
            'Move into plant/maintenance leadership',
            'Combine with mechatronics or industrial automation',
            'Grow into project engineering roles',
        ],
        'risks': [
            'Some roles are plant/site based with shift patterns',
            'Hiring can follow industrial investment cycles',
            'Needs strong maths and practical workshop aptitude',
            'Continuous tools/software upskilling required',
        ],
        'skills': [
            'CAD & design fundamentals',
            'Thermodynamics basics',
            'Analytical thinking',
            'Workshop / practical sense',
            'Teamwork',
            'Problem solving',
        ],
    },
    'Architecture': {
        'about': (
            'Architecture is the design of buildings and spaces—balancing aesthetics, function, structure, regulations '
            'and human experience through studio-based learning.'
        ),
        'market_outlook': (
            'Demand follows real-estate and construction activity. Portfolio quality strongly influences hiring in studios '
            'and design firms, especially in major cities.'
        ),
        'future_outlook': (
            'Sustainable design, digital modeling and urban development keep the field relevant. Hybrid design-tech skills help.'
        ),
        'field_value': (
            'Creative professional career with cultural impact and a pathway to licensed independent practice.'
        ),
        'job_types': [
            'Architectural design studios',
            'Real-estate developers',
            'Interior / urban design teams',
            'Conservation and cultural projects',
            'Freelance design practice',
        ],
        'opportunities': [
            'Build a signature portfolio through studio work',
            'Specialize in residential, commercial or urban design',
            'Move toward licensure and independent practice',
            'Combine with interior or sustainable design niches',
        ],
        'risks': [
            'Long studio hours and critique-heavy culture',
            'Income can be uneven early in freelance paths',
            'Licensing timelines vary',
            'Market sensitive to construction slowdowns',
        ],
        'skills': [
            'Design thinking',
            'Drawing & visualization',
            'Spatial reasoning',
            'Software (CAD/BIM/visualization)',
            'Client communication',
            'Project documentation',
        ],
    },
    'Biotechnology': {
        'about': (
            'Biotechnology applies biology and lab science to develop products and processes in health, agriculture and '
            'industry—from diagnostics to bioprocessing and research.'
        ),
        'market_outlook': (
            'Growing in pharma, diagnostics, agri-biotech and research labs. Advanced roles often prefer strong lab experience '
            'or postgraduate study.'
        ),
        'future_outlook': (
            'Positive long-term outlook with health innovation and agri-tech needs. Molecular and data skills increase value.'
        ),
        'field_value': (
            'Science-driven career with research and industry options at the intersection of biology and technology.'
        ),
        'job_types': [
            'Pharma / biotech labs',
            'Diagnostic and research labs',
            'Agri-biotech organizations',
            'Quality assurance units',
            'Academic research groups',
        ],
        'opportunities': [
            'Start in lab/QA roles then specialize',
            'Move into research with MS/MPhil',
            'Work across health and agriculture applications',
            'Combine wet-lab skills with bioinformatics later',
        ],
        'risks': [
            'Bachelor-only research roles can be limited',
            'Lab work requires precision and safety discipline',
            'Some positions prefer postgraduate credentials',
            'Industry hiring concentrated in specific cities/sectors',
        ],
        'skills': [
            'Laboratory technique',
            'Biology & chemistry foundations',
            'Data recording',
            'Scientific writing',
            'Attention to detail',
            'Biosafety',
        ],
    },
    'Economics': {
        'about': (
            'Economics studies how people, firms and governments make choices about resources. Students learn theory, '
            'data analysis and policy applications across markets and development.'
        ),
        'market_outlook': (
            'Demand in banks, research, policy, consulting and development organizations. Quantitative and writing skills '
            'improve employability significantly.'
        ),
        'future_outlook': (
            'Strong where paired with data skills. Policy, fintech analytics and development economics remain relevant.'
        ),
        'field_value': (
            'Analytical career with flexible movement into finance, policy, research and business strategy.'
        ),
        'job_types': [
            'Banks and financial institutions',
            'Think tanks and research centers',
            'Government / policy units',
            'Development organizations',
            'Consulting and analytics teams',
        ],
        'opportunities': [
            'Specialize in development, finance or data economics',
            'Use internships to enter analyst tracks',
            'Combine with coding/statistics for higher-value roles',
            'Prepare for competitive exams or graduate study',
        ],
        'risks': [
            'Generic economics degrees without skills can struggle',
            'Top research/policy roles are competitive',
            'Masters often needed for advanced analyst positions',
            'Requires comfort with maths and writing',
        ],
        'skills': [
            'Quantitative reasoning',
            'Economic theory',
            'Data analysis',
            'Writing & communication',
            'Critical thinking',
            'Excel / statistics basics',
        ],
    },
    'Computer Science': {
        'about': (
            'Computer Science is the foundation of modern computing—programming, algorithms, systems, networks and '
            'software design. It opens paths into software engineering, AI, data, cybersecurity and research.'
        ),
        'market_outlook': (
            'Very high demand across software houses, product companies, banks, telecoms and remote freelancing. '
            'Strong fundamentals plus projects usually outperform degree title alone.'
        ),
        'future_outlook': (
            'Excellent long-term outlook. CS skills stay central as AI, cloud and digital products expand; continuous '
            'learning keeps graduates competitive.'
        ),
        'field_value': (
            'High employability, flexible specializations (SE, AI, data, security) and strong local plus remote income potential.'
        ),
        'job_types': [
            'Software product companies',
            'IT services / software houses',
            'Banks and fintech technology teams',
            'Startups and remote contract work',
            'Research and academic computing roles',
        ],
        'opportunities': [
            'Specialize after year 2 into AI, web, mobile, data or security',
            'Build a portfolio that unlocks internships early',
            'Move into tech lead / architect tracks over time',
            'Pivot into related fields without restarting from zero',
        ],
        'risks': [
            'Crowded junior market without projects or internships',
            'Rapid technology change requires continuous upskilling',
            'Some programs are theory-heavy—seek practical exposure',
            'Sitting-heavy work needs healthy habits',
        ],
        'skills': [
            'Programming',
            'Data structures & algorithms',
            'Problem solving',
            'Databases & systems basics',
            'Version control (Git)',
            'Analytical thinking',
        ],
    },
}


def apply_insights(row):
    """Merge rich explanations into a seed row (in place) and return it."""
    insight = INSIGHTS.get(row['name'])
    if insight:
        for key, value in insight.items():
            row[key] = value
    row['study_roadmap'] = roadmap_for(
        row['name'],
        category=row.get('category', ''),
        learn=row.get('learn') or [],
        skills=row.get('skills') or [],
        careers=row.get('careers') or [],
    )
    return row
