"""Study roadmaps: 5-step career path for each field (seeded into CareerField.study_roadmap)."""


def path(select_degree, build_skills, during_degree, jobs, masters):
    """Fixed 5 stages matching the roadmap UI."""
    return [
        {
            'phase': '01',
            'title': 'Select Degree',
            'detail': select_degree,
            'icon': 'degree',
        },
        {
            'phase': '02',
            'title': 'Build Skills',
            'detail': build_skills,
            'icon': 'skills',
        },
        {
            'phase': '03',
            'title': 'During Degree',
            'detail': during_degree,
            'icon': 'study',
        },
        {
            'phase': '04',
            'title': 'Jobs & Careers',
            'detail': jobs,
            'icon': 'jobs',
        },
        {
            'phase': '05',
            'title': 'Masters & Next',
            'detail': masters,
            'icon': 'masters',
        },
    ]


ROADMAPS = {
    'Software Engineering': path(
        'Choose BS Software Engineering / Computer Science at a strong computing university (FAST, NUST, COMSATS, ITU, etc.). Confirm Intermediate subjects (Maths/CS) and entry-test requirements.',
        'Practice programming (Python/Java/JS), data structures, Git, databases and problem-solving on a weekly schedule before and during admission.',
        'Complete core SE courses, ship semester projects, do at least 1–2 internships, and keep a GitHub portfolio of real apps.',
        'Target roles: Software Engineer, Full Stack Developer, DevOps/QA junior. Apply from final year with projects + internship proof.',
        'Optional MS Software Engineering / CS for specialization (AI, security, distributed systems) or grow via industry certifications and senior tracks.',
    ),
    'Data Science': path(
        'Pick BS Data Science / CS / Statistics with strong maths. Shortlist universities with analytics labs and industry links.',
        'Build Python, statistics, SQL, Excel and visualization skills; complete beginner ML courses with hands-on notebooks.',
        'Take ML/data courses seriously, publish Kaggle-style projects, and intern in analytics/BI teams.',
        'Start as Data Analyst / Junior Data Scientist; move toward ML Engineer with stronger modeling portfolios.',
        'Consider MS Data Science / AI, or specialized certs; research track helps for advanced ML roles.',
    ),
    'Artificial Intelligence (AI)': path(
        'Select BS AI / CS / SE with solid maths. Prefer programs teaching ML, Python and research methods.',
        'Strengthen linear algebra intuition, Python, ML basics and experimentation habits before year 2.',
        'Build AI demos (NLP/vision/LLM apps), join research labs if available, and document experiments clearly.',
        'Aim for AI/ML Engineer, Research Intern or SE roles with AI projects. Portfolio quality beats title alone.',
        'MS/MPhil in AI/ML is valuable for research-heavy roles; industry path can continue with deep specialization.',
    ),
    'Cybersecurity': path(
        'Choose BS Cybersecurity / CS / IT. Check networking-focused campuses and lab facilities.',
        'Learn networking, Linux, scripting and security fundamentals; practice on legal labs only.',
        'Take security courses, complete CTF/lab write-ups, and pursue internships in SOC/IT security teams.',
        'Jobs: Security Analyst, SOC Junior, Junior Pentester (with proof). Certs help after core skills.',
        'Masters in Cybersecurity/InfoSec or advanced certs (after experience) for architect/lead paths.',
    ),
    'Web Development': path(
        'Select CS/SE/IT degrees or applied computing programs that include web stacks.',
        'Master HTML/CSS/JS, one frontend framework, APIs and Git; build sites for real users.',
        'Create a freelance/agency-ready portfolio during studies and ship deployed projects every semester.',
        'Roles: Frontend, Backend or Full Stack Developer; strong freelance market for skilled juniors.',
        'Optional MS is less critical than senior portfolio; specialize in product engineering or UX-engineering later.',
    ),
    'Mobile App Development': path(
        'Choose CS/SE with mobile electives, or applied computing programs supporting Flutter/native tracks.',
        'Learn programming + one mobile stack (Flutter/React Native/Kotlin/Swift) and UI basics.',
        'Publish apps to stores, practice API integration, and intern with product teams.',
        'Jobs: Android/iOS/Cross-platform Developer. Store links are your strongest proof.',
        'Masters optional; deepen architecture/product skills or move into tech lead tracks.',
    ),
    'Cloud Computing': path(
        'Pick CS/SE/IT degrees; prioritize campuses with DevOps/cloud exposure.',
        'Build Linux, networking, scripting and cloud fundamentals (AWS/Azure/GCP beginner path).',
        'Deploy projects on cloud, learn containers/CI-CD, and intern in platform/IT ops teams.',
        'Roles: Cloud Engineer, DevOps Junior, SRE trainee. One foundational cloud cert helps.',
        'MS optional; advanced cloud/architecture certs and experience unlock senior paths.',
    ),
    'Game Development': path(
        'Choose CS/SE/Game Design programs; portfolio often matters as much as the exact title.',
        'Learn a game engine, programming and basic art/design collaboration skills.',
        'Release small games every year, join game jams, and document playable demos.',
        'Jobs: Gameplay Programmer, Indie Developer, Technical Designer (competitive market).',
        'Masters rare; specialize via studio experience, engine depth or interactive media programs.',
    ),
    'General Medicine': path(
        'Select MBBS after strong Pre-Medical + MDCAT. Track PMC/UHS merit and college preferences carefully.',
        'Build science mastery, exam discipline, empathy and time management before medical school.',
        'Focus on professional exams, clinical skills, and hospital rotations; protect wellbeing.',
        'Jobs: House Officer → Medical Officer / specialty training. Service years vary by pathway.',
        'Postgraduate (FCPS/MD/MS) is the main “next level” for specialization and stronger careers.',
    ),
    'Surgery': path(
        'Start with MBBS (Pre-Medical + MDCAT), then plan surgical postgraduate competition.',
        'Develop precision mindset, anatomy strength, stamina and team communication early.',
        'Excel in clinical years, seek surgical exposure, and build strong mentor relationships.',
        'Jobs: Surgical trainee/resident pathways after MBBS; long supervised training ahead.',
        'Surgical fellowship/FCPS-style postgraduate training is essential for independent practice.',
    ),
    'Dentistry': path(
        'Choose BDS via Pre-Medical pathway and relevant admissions testing/merit rules.',
        'Build manual dexterity, patient communication and science foundations.',
        'Maximize clinical practice hours, case documentation and professional ethics.',
        'Jobs: Dentist, Dental Surgeon, clinic associate; private practice is common later.',
        'Postgraduate specialties (orthodontics, surgery, etc.) raise expertise and earnings potential.',
    ),
    'Pharmacy': path(
        'Select Pharm-D / Pharmacy at HEC-recognized universities; confirm subject prerequisites.',
        'Strengthen chemistry/biology foundations and counseling communication skills.',
        'Complete industrial/hospital pharmacy exposures and keep drug-knowledge habits strong.',
        'Jobs: Pharmacist, Clinical Pharmacist, Pharma industry QA/sales/regulatory roles.',
        'MPhil/MS Pharmacy or regulatory specialization supports industry and clinical growth.',
    ),
    'Nursing': path(
        'Choose BSN/Nursing at recognized institutions; confirm provincial admission rules.',
        'Build clinical care skills, empathy, teamwork and stress management.',
        'Treat clinical placements seriously; specialize interests (ICU, ER, community) early.',
        'Jobs: Registered Nurse, specialty nurse, community health roles; international paths need licensing.',
        'MSN / specialty diplomas and overseas licensing exams are common next steps.',
    ),
    'Physiotherapy': path(
        'Select DPT / Physiotherapy programs and verify entry criteria for your province.',
        'Strengthen anatomy, movement assessment and patient-coaching skills.',
        'Log supervised practice hours and build case experience across rehab settings.',
        'Jobs: Physiotherapist, sports/rehab specialist, clinic roles.',
        'Postgraduate specialization (sports, neuro, ortho) improves career positioning.',
    ),
    'Radiology': path(
        'Choose imaging technology programs or physician radiology tracks (longer MBBS path). Clarify which route you want.',
        'Learn imaging physics basics, safety protocols and careful observation habits.',
        'Practice modality workflows, documentation and patient care during clinical training.',
        'Jobs: Imaging technologist roles; physician radiologist requires medical postgraduate path.',
        'Advanced modality training / medical postgraduate radiology depending on your track.',
    ),
    'Nutrition & Dietetics': path(
        'Select Nutrition & Dietetics degrees; confirm Biology/Chemistry prerequisites.',
        'Build nutrition science literacy, counseling skills and evidence-based planning habits.',
        'Complete clinical/community nutrition practicals and avoid fad-diet content.',
        'Jobs: Dietitian, Clinical Nutritionist, wellness/public-health nutrition roles.',
        'MS Nutrition / clinical specialty credentials strengthen hospital and research careers.',
    ),
    'Medical Laboratory Technology': path(
        'Choose MLT / allied health lab programs with strong hospital attachments.',
        'Develop lab accuracy, biosafety discipline and instrument handling skills.',
        'Complete rotations across chemistry/micro/hematology and quality-control practice.',
        'Jobs: Medical Lab Technologist, lab supervisor track, diagnostic center roles.',
        'Advanced diplomas/MS in lab sciences support supervisory and specialized testing roles.',
    ),
    'Electrical Engineering': path(
        'Select BE/BSc Electrical Engineering; prepare ECAT/NET-style tests with Pre-Engineering Maths/Physics.',
        'Strengthen circuit intuition, maths modeling and lab discipline before university.',
        'Focus on electronics/power/control courses, labs and industrial internships.',
        'Jobs: Electrical Engineer, power systems, electronics, telecom and industrial roles.',
        'MS EE or specialization (power, embedded, control) plus PEC pathway for senior growth.',
    ),
    'Civil Engineering': path(
        'Choose BE/BSc Civil Engineering at UET/NUST-style campuses; prepare engineering entry tests.',
        'Build maths/physics strength, AutoCAD basics and site-safety awareness.',
        'Take structures/geotech/transport courses seriously; seek construction internships.',
        'Jobs: Site Engineer, Structural/Design junior, project roles in construction firms.',
        'MS Civil / structural specialization and professional licensure support senior careers.',
    ),
    'Mechanical Engineering': path(
        'Select BE/BSc Mechanical Engineering; Pre-Engineering + ECAT/NET preparation is key.',
        'Strengthen maths, physics, CAD basics and mechanical problem-solving.',
        'Focus on thermodynamics/design/manufacturing labs and factory internships.',
        'Jobs: Mechanical Engineer, HVAC, manufacturing, automotive and maintenance roles.',
        'MS Mechanical / mechatronics specialization helps for R&D and advanced design roles.',
    ),
    'Architecture': path(
        'Choose B.Arch programs; prepare portfolio/aptitude requirements used by architecture schools.',
        'Build drawing, design thinking, spatial skills and basic digital design tools.',
        'Develop studio projects, site visits and a strong design portfolio every year.',
        'Jobs: Architectural Assistant, junior architect (after licensing pathway), interior/urban design related roles.',
        'Masters in Architecture/Urban Design and professional registration advance independent practice.',
    ),
    'Biotechnology': path(
        'Select BS Biotechnology / related life-science degrees with lab-heavy curricula.',
        'Strengthen Biology/Chemistry and lab safety; learn scientific writing early.',
        'Maximize lab courses, research assistantships and industry/biotech internships.',
        'Jobs: Lab technologist, research assistant, QA in biotech/pharma, agri-biotech roles.',
        'MS/MPhil Biotechnology is often important for research and advanced industry roles.',
    ),
    'Economics': path(
        'Choose BS Economics / PPE-style programs; strong Maths/English helps.',
        'Build quantitative reasoning, writing and data/Excel skills.',
        'Do research projects, policy clubs and internships in banks/think tanks/NGOs.',
        'Jobs: Economic analyst, research associate, banking/policy junior roles.',
        'MS Economics / development / data-heavy masters strongly improve career ceiling.',
    ),
    'Computer Science': path(
        'Choose BS Computer Science at a strong computing university (FAST, NUST, COMSATS, ITU, LUMS, etc.). Keep Maths/CS strong for entry tests.',
        'Build programming, data structures, algorithms and problem-solving with weekly practice before and after admission.',
        'Cover OS, databases, networks and electives; ship projects every semester and complete internships.',
        'Jobs: Software Developer, Backend Engineer, Systems Analyst; specialize into AI/data/security from a CS base.',
        'MS Computer Science / specialization (AI, systems, security) is optional but useful for research and advanced roles.',
    ),
    'Business Administration': path(
        'Select BBA/BS Management at reputable business schools; prepare aptitude tests where needed.',
        'Build communication, Excel, basic accounting and leadership habits.',
        'Pursue internships, case competitions and a specialization (marketing/finance/HR).',
        'Jobs: Management trainee, operations, sales, analyst roles across industries.',
        'MBA (after 1–2 years experience ideally) is a common accelerator.',
    ),
    'Marketing': path(
        'Choose BBA Marketing / Media-business programs with digital marketing exposure.',
        'Learn copywriting, consumer insight, Canva/analytics basics and campaign thinking.',
        'Run real campaigns for societies/SMEs and keep measurable case studies.',
        'Jobs: Marketing Executive, Digital Marketer, Brand Assistant, agency roles.',
        'MBA Marketing or specialized digital certifications after experience help leadership moves.',
    ),
    'Finance': path(
        'Select BS Finance / BBA Finance / Accounting-finance tracks at strong business schools.',
        'Build accounting, Excel modeling and financial statement reading skills.',
        'Intern in banks/fintech/corporate finance; start professional exam planning if suited.',
        'Jobs: Financial Analyst, banking officer, investment/operations junior roles.',
        'MBA Finance / CFA pathway (multi-year) supports capital-markets and senior finance careers.',
    ),
    'Accounting': path(
        'Choose BS Accounting / Commerce degrees; explore CA/ACCA aligned routes early.',
        'Master bookkeeping, Excel, taxation basics and ethical accuracy.',
        'Articleship/internships in firms accelerate skills faster than theory alone.',
        'Jobs: Accountant, Audit Trainee, Tax Assistant, corporate accounting roles.',
        'Professional qualifications (CA/ACCA) and MS Accounting elevate career ceiling.',
    ),
    'Human Resource Management': path(
        'Select BBA HR / HRM programs; communication-heavy campuses help.',
        'Build interviewing, conflict handling, labor-law awareness and organization skills.',
        'Intern in HR departments; help with recruitment drives and training events.',
        'Jobs: HR Officer, Recruiter, L&D junior, people-ops roles.',
        'MS HRM / MBA HR supports HRBP and leadership tracks.',
    ),
    'Entrepreneurship': path(
        'Any strong base degree can work (Business/CS/domain). Choose based on the problems you want to solve.',
        'Practice customer discovery, sales, basic finance and shipping tiny products.',
        'Launch micro-ventures while studying; join incubators and measure real traction.',
        'Roles: Founder, startup operator, business development—income can be uneven early.',
        'MBA/entrepreneurship programs optional; customer revenue and learning speed matter more.',
    ),
    'Law': path(
        'Select LLB / law programs; check university entry rules and reading load expectations.',
        'Build English writing, logical reasoning and current-affairs reading habits.',
        'Do moot courts, chambers internships and drafting practice throughout the degree.',
        'Jobs: Associate, legal advisor trainee, litigation junior, compliance roles.',
        'LLM / specialized diplomas and bar/practice milestones shape senior legal careers.',
    ),
    'Psychology': path(
        'Choose BS Psychology with research methods; plan further study if clinical practice is the goal.',
        'Develop listening, ethics, statistics basics and scientific reading habits.',
        'Complete research projects and supervised practicals; never practice beyond scope.',
        'Jobs: HR support, research assistant, school support, NGO roles; clinical titles need more training.',
        'MS/MPhil + supervised clinical training is typically required for counseling/clinical careers.',
    ),
    'Fine Arts': path(
        'Select Fine Arts / studio programs; prepare a portfolio for admission interviews.',
        'Practice daily drawing/making; learn critique and art history fundamentals.',
        'Exhibit work, take commissions and document a professional portfolio yearly.',
        'Jobs: Artist, art instructor, gallery/cultural roles, creative commissions.',
        'MFA / specialized studio programs and teaching credentials can stabilize long-term paths.',
    ),
    'Graphic Design': path(
        'Choose Graphic Design / visual communication / related computing-design degrees.',
        'Learn typography, layout, Figma/Adobe tools and brand thinking.',
        'Build client-style projects, freelance case studies and a polished Behance/portfolio.',
        'Jobs: Graphic Designer, Brand Designer, UI/visual designer, agency junior.',
        'Masters optional; UI/UX specialization or art-direction growth often comes from work experience.',
    ),
    'Media & Communication': path(
        'Select Mass Communication / Media Studies programs with production labs.',
        'Write/publish weekly; learn shooting/editing basics and media ethics.',
        'Intern in newsrooms, brands or NGOs; build a public content portfolio.',
        'Jobs: Journalist, content producer, PR officer, digital media roles.',
        'Masters in Media/Journalism helps specialized reporting and academic/media research paths.',
    ),
    'International Relations': path(
        'Choose BS IR / Political Science; strong English and writing samples help.',
        'Build research, analysis and foreign-affairs reading habits; language skills are a plus.',
        'Intern at think tanks/NGOs/media analysis desks; specialize in a region or theme.',
        'Jobs: Research associate, policy junior, development/NGO roles; diplomatic tracks are competitive.',
        'MS IR / public policy and exam pathways (where relevant) improve policy-career odds.',
    ),
    'Education': path(
        'Select Education degrees or subject bachelor + B.Ed route used in your province.',
        'Build subject mastery, lesson planning and classroom communication skills.',
        'Complete teaching practice seriously; collect lesson plans and observation feedback.',
        'Jobs: Teacher, tutor, academic coordinator, edtech content roles.',
        'M.Ed / education leadership degrees support coordination and school leadership careers.',
    ),
}


def roadmap_for(name, category='', learn=None, skills=None, careers=None):
    if name in ROADMAPS:
        return ROADMAPS[name]
    learn = learn or []
    skills = skills or []
    careers = careers or []
    learn_txt = ', '.join(learn[:3]) if learn else 'core degree subjects'
    skills_txt = ', '.join(skills[:3]) if skills else 'communication and problem-solving'
    jobs_txt = ', '.join(careers[:3]) if careers else f'entry roles in {category or "this field"}'
    return path(
        f'Choose a recognized undergraduate degree aligned with {name}. Confirm Intermediate subjects, entry tests and merit rules early.',
        f'Build foundations in {skills_txt}. Practice weekly and track progress.',
        f'During the degree, prioritize {learn_txt}, projects/practicals and at least one internship.',
        f'Target roles such as {jobs_txt}. Use projects, internships and networking in the final year.',
        f'Consider a relevant masters/professional qualification after experience if you want specialization or research roles in {name}.',
    )
