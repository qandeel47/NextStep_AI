"""Expanded programs + about / known-for details for university seeding."""

from datetime import date

# Comma-separated program lists should use names that map well to career fields
# where possible (see frontend fieldIdsFromPrograms + aliases).

ENRICHMENT = {
    'Lahore University of Management Sciences (LUMS)': {
        'programs': (
            'Computer Science, Software Engineering, Artificial Intelligence (AI), Data Science, '
            'Business Administration, Accounting, Finance, Economics, Law, '
            'Electrical Engineering, Management Science'
        ),
        'about': (
            'LUMS is one of Pakistan’s most selective private universities, known for rigorous academics, '
            'strong industry links and a competitive campus culture. Students often choose LUMS for business, '
            'computing and social-science pathways with strong graduate outcomes.'
        ),
        'known_for': 'Business management, computer science, entrepreneurship and highly selective admissions.',
        'best_for': 'Business & Computer Science',
    },
    'National University of Sciences and Technology (NUST)': {
        'programs': (
            'Electrical Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering, '
            'Computer Science, Software Engineering, Artificial Intelligence (AI), Data Science, '
            'Cybersecurity, Business Administration, Architecture'
        ),
        'about': (
            'NUST is a leading public STEM university with a strong national reputation in engineering and IT. '
            'Admission is typically through NET, and campuses/schools cover engineering, computing, natural sciences '
            'and selected management programs.'
        ),
        'known_for': 'Engineering, IT and competitive NET-based undergraduate admissions.',
        'best_for': 'Engineering & IT',
    },
    'University of Engineering and Technology (UET) Lahore': {
        'programs': (
            'Electrical Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering, '
            'Computer Science, Software Engineering, Architecture, City & Regional Planning'
        ),
        'about': (
            'UET Lahore is a historic public engineering university and a top choice for Pre-Engineering students. '
            'It is especially known for core engineering disciplines and ECAT-linked admissions.'
        ),
        'known_for': 'Traditional engineering excellence and ECAT-based admissions in Punjab.',
        'best_for': 'Engineering',
    },
    'University of Engineering and Technology (UET) Taxila': {
        'programs': (
            'Electrical Engineering, Mechanical Engineering, Civil Engineering, '
            'Computer Science, Software Engineering, Industrial Engineering'
        ),
        'about': (
            'UET Taxila is a public engineering university serving northern Punjab. It offers core engineering and '
            'computing programs with ECAT-oriented admissions similar to the UET system.'
        ),
        'known_for': 'Engineering programs with a strong regional footprint in northern Punjab.',
        'best_for': 'Engineering',
    },
    'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (GIKI)': {
        'programs': (
            'Electrical Engineering, Mechanical Engineering, Computer Science, Software Engineering, '
            'Artificial Intelligence (AI), Materials Engineering, Engineering Sciences'
        ),
        'about': (
            'GIKI is a selective private engineering institute with a residential campus culture and strong STEM focus. '
            'It is known for engineering and computer science quality and a competitive admission test.'
        ),
        'known_for': 'Elite engineering and computing education in a residential campus setting.',
        'best_for': 'Engineering & Computer Science',
    },
    'NED University of Engineering and Technology': {
        'programs': (
            'Civil Engineering, Mechanical Engineering, Electrical Engineering, '
            'Computer Science, Software Engineering, Biomedical Engineering, Architecture'
        ),
        'about': (
            'NED is one of Sindh’s flagship public engineering universities, especially popular among Karachi students. '
            'It offers a wide range of engineering and computing degrees with its own entry test process.'
        ),
        'known_for': 'Engineering education in Karachi with strong alumni presence in industry.',
        'best_for': 'Engineering',
    },
    'Pakistan Institute of Engineering and Applied Sciences (PIEAS)': {
        'programs': (
            'Electrical Engineering, Mechanical Engineering, Computer Science, '
            'Physics, Chemistry, Medical Physics, Materials Science'
        ),
        'about': (
            'PIEAS is a highly selective public institute known for applied sciences, engineering and research intensity. '
            'It is often chosen by students aiming for rigorous STEM training and specialized scientific careers.'
        ),
        'known_for': 'Applied sciences, nuclear-related STEM strength and selective admissions.',
        'best_for': 'Engineering & Applied Sciences',
    },
    'COMSATS University Islamabad': {
        'programs': (
            'Computer Science, Software Engineering, Artificial Intelligence (AI), Data Science, '
            'Cybersecurity, Electrical Engineering, Business Administration, Accounting, '
            'Biotechnology, Architecture, Mathematics'
        ),
        'about': (
            'COMSATS is a large multi-campus public university with especially strong computing and IT offerings. '
            'Students often pick COMSATS for CS/SE/AI pathways with NTS/NAT-style admissions across campuses.'
        ),
        'known_for': 'Computer science, software engineering and multi-campus IT education.',
        'best_for': 'Computer Science & IT',
    },
    'FAST National University of Computer and Emerging Sciences (FAST-NUCES)': {
        'programs': (
            'Computer Science, Software Engineering, Artificial Intelligence (AI), Data Science, '
            'Cybersecurity, Electrical Engineering, Business Administration, Accounting'
        ),
        'about': (
            'FAST-NUCES is widely regarded as one of Pakistan’s strongest computing universities. '
            'It is a top destination for CS, SE, AI and related tech degrees, with competitive entry testing.'
        ),
        'known_for': 'Computer science and software engineering reputation across major cities.',
        'best_for': 'Computer Science',
    },
    'Air University': {
        'programs': (
            'Computer Science, Software Engineering, Artificial Intelligence (AI), Data Science, '
            'Electrical Engineering, Mechanical Engineering, Business Administration, '
            'Cybersecurity, Aviation Management'
        ),
        'about': (
            'Air University is a public university in Islamabad with strengths in computing, engineering and '
            'aviation-related education. It attracts students seeking Islamabad-based STEM and management options.'
        ),
        'known_for': 'Computing, engineering and aviation-linked academic programs.',
        'best_for': 'Computer Science & Engineering',
    },
    'Information Technology University (ITU) Lahore': {
        'programs': (
            'Computer Science, Software Engineering, Artificial Intelligence (AI), Data Science, '
            'Electrical Engineering, Business Administration, Management & Technology'
        ),
        'about': (
            'ITU Lahore focuses on technology, innovation and interdisciplinary computing/engineering education. '
            'It is a strong option for students who want an IT-centered public university environment in Lahore.'
        ),
        'known_for': 'IT, computing and technology-driven undergraduate programs.',
        'best_for': 'Computer Science & IT',
    },
    'King Edward Medical University (KEMU)': {
        'programs': (
            'General Medicine, Dentistry, Nursing, Physiotherapy, Medical Laboratory Technology, '
            'Radiology, Nutrition & Dietetics, Pharmacy'
        ),
        'about': (
            'KEMU is one of Pakistan’s most historic medical universities, based in Lahore and associated with '
            'Mayo Hospital. It is a premier destination for MBBS and related health-sciences pathways.'
        ),
        'known_for': 'MBBS excellence and historic medical training in Lahore.',
        'best_for': 'Medical',
    },
    'University of Health Sciences (UHS) Lahore': {
        'programs': (
            'General Medicine, Dentistry, Nursing, Pharmacy, Physiotherapy, '
            'Medical Laboratory Technology, Public Health'
        ),
        'about': (
            'UHS is the key health-sciences university and affiliating/examining body for many medical and dental '
            'colleges in Punjab. Students encounter UHS through MDCAT-linked medical admissions and allied programs.'
        ),
        'known_for': 'Medical education regulation and affiliated MBBS/BDS colleges in Punjab.',
        'best_for': 'Medical',
    },
    'Dow University of Health Sciences (DUHS)': {
        'programs': (
            'General Medicine, Dentistry, Nursing, Pharmacy, Physiotherapy, '
            'Medical Laboratory Technology, Radiology, Nutrition & Dietetics'
        ),
        'about': (
            'DUHS is a major public health-sciences university in Karachi offering medicine, dentistry, pharmacy, '
            'nursing and allied health programs. It is a primary medical destination in Sindh.'
        ),
        'known_for': 'Broad health-sciences education in Karachi, including MBBS and allied fields.',
        'best_for': 'Medical & Allied Health',
    },
    'Khyber Medical University (KMU)': {
        'programs': (
            'General Medicine, Dentistry, Nursing, Pharmacy, Physiotherapy, '
            'Public Health, Medical Laboratory Technology'
        ),
        'about': (
            'KMU is the leading public medical university in Khyber Pakhtunkhwa, supporting MBBS/BDS and a growing '
            'set of allied health and public-health programs across the province.'
        ),
        'known_for': 'Medical and allied health education across KPK.',
        'best_for': 'Medical',
    },
    'Allama Iqbal Medical College (AIMC)': {
        'programs': (
            'General Medicine, Nursing, Medical Laboratory Technology, Physiotherapy, Allied Health Sciences'
        ),
        'about': (
            'AIMC is a well-known public medical college in Lahore (Jinnah Hospital complex), popular for MBBS '
            'through the UHS/MDCAT pathway and related clinical training.'
        ),
        'known_for': 'MBBS training attached to a major teaching hospital in Lahore.',
        'best_for': 'Medical',
    },
    'Shifa Tameer-e-Millat University': {
        'programs': (
            'General Medicine, Dentistry, Nursing, Pharmacy, Physiotherapy, '
            'Medical Laboratory Technology, Business Administration'
        ),
        'about': (
            'Shifa Tameer-e-Millat University is a private health-focused university in Islamabad linked with '
            'Shifa International Hospital, offering medicine, dentistry, nursing and allied programs.'
        ),
        'known_for': 'Private-sector medical and health-sciences education in Islamabad.',
        'best_for': 'Medical & Allied Health',
    },
    'Rawalpindi Medical University (RMU)': {
        'programs': (
            'General Medicine, Nursing, Physiotherapy, Medical Laboratory Technology, Allied Health Sciences'
        ),
        'about': (
            'RMU is a public medical university in Rawalpindi offering MBBS and allied health pathways, with '
            'clinical training through major teaching hospitals in the twin cities region.'
        ),
        'known_for': 'MBBS and clinical medical education in Rawalpindi.',
        'best_for': 'Medical',
    },
    'Quaid-i-Azam University (QAU)': {
        'programs': (
            'Computer Science, Software Engineering, Data Science, Biotechnology, Pharmacy, '
            'Psychology, International Relations, Business Administration, Physics, Chemistry, Mathematics'
        ),
        'about': (
            'QAU is a top-ranked public research university in Islamabad, especially strong in natural sciences, '
            'social sciences and selected professional programs. Admissions are often department-based and competitive.'
        ),
        'known_for': 'Research strength in natural and social sciences.',
        'best_for': 'Sciences & Social Sciences',
    },
    'University of the Punjab': {
        'programs': (
            'Computer Science, Software Engineering, Artificial Intelligence (AI), Data Science, '
            'Business Administration, Accounting, Finance, Law, Psychology, '
            'Education, Fine Arts, Graphic Design, Media & Communication, Pharmacy, Electrical Engineering'
        ),
        'about': (
            'Punjab University is one of Pakistan’s largest and oldest public universities, with a huge range of '
            'faculties—from IT and business to law, arts and sciences—mainly concentrated in Lahore.'
        ),
        'known_for': 'Broad affordable public education across almost every major faculty.',
        'best_for': 'Multi-disciplinary (IT, Business, Law, Arts)',
    },
    'University of Karachi': {
        'programs': (
            'Computer Science, Software Engineering, Business Administration, Accounting, Finance, '
            'Pharmacy, Psychology, International Relations, Media & Communication, Fine Arts, '
            'Education, Biotechnology, Chemistry, Physics'
        ),
        'about': (
            'University of Karachi is a major public university serving Sindh with extensive science, social science, '
            'business and arts offerings. It is a common destination for students seeking diverse degree options in Karachi.'
        ),
        'known_for': 'Large multi-faculty public university footprint in Karachi.',
        'best_for': 'Sciences, Business & Social Sciences',
    },
    'Government College University (GCU) Lahore': {
        'programs': (
            'Computer Science, Software Engineering, Physics, Chemistry, Mathematics, '
            'Psychology, Fine Arts, Media & Communication, Business Administration, Law, Education'
        ),
        'about': (
            'GCU Lahore is a historic public university known for strong undergraduate academics, campus culture and '
            'competitive merit in sciences, arts and computing-related programs.'
        ),
        'known_for': 'Historic academic reputation in sciences and arts.',
        'best_for': 'Sciences & Arts',
    },
    'University of Peshawar': {
        'programs': (
            'Computer Science, Software Engineering, Business Administration, Law, '
            'Psychology, International Relations, Education, Pharmacy, Biotechnology, Journalism'
        ),
        'about': (
            'University of Peshawar is a major public university in Khyber Pakhtunkhwa offering sciences, social '
            'sciences, management and professional programs for students across the province.'
        ),
        'known_for': 'Broad public higher education leadership in KPK.',
        'best_for': 'Sciences & Social Sciences',
    },
    'University of Sindh': {
        'programs': (
            'Computer Science, Software Engineering, Business Administration, Law, '
            'Education, Media & Communication, Fine Arts, Pharmacy, Psychology, International Relations'
        ),
        'about': (
            'University of Sindh (Jamshoro) is one of the province’s principal public universities, with a wide set of '
            'arts, sciences, IT and professional degree options.'
        ),
        'known_for': 'Large public multi-disciplinary university serving Sindh.',
        'best_for': 'Multi-disciplinary',
    },
    'University of Agriculture Faisalabad (UAF)': {
        'programs': (
            'Agriculture, Food Science, Veterinary Sciences, Biotechnology, '
            'Computer Science, Software Engineering, Business Administration, '
            'Environmental Sciences, Animal Sciences'
        ),
        'about': (
            'UAF is Pakistan’s flagship agriculture university, known for agri-sciences, food, veterinary and related '
            'applied research. It also offers selected computing and business-linked options.'
        ),
        'known_for': 'Agriculture, food and veterinary sciences leadership.',
        'best_for': 'Agriculture & Life Sciences',
    },
    'Institute of Business Administration (IBA) Karachi': {
        'programs': (
            'Business Administration, Accounting, Finance, Marketing, Computer Science, '
            'Software Engineering, Data Science, Economics, Social Sciences, Mathematics'
        ),
        'about': (
            'IBA Karachi is one of Pakistan’s most respected institutions for business and related analytical programs. '
            'It is also growing in computing and social-science offerings, with aptitude-test based admissions.'
        ),
        'known_for': 'Business administration, finance and highly regarded aptitude-based admissions.',
        'best_for': 'Business',
    },
    'National University of Modern Languages (NUML)': {
        'programs': (
            'Computer Science, Software Engineering, Business Administration, '
            'International Relations, Media & Communication, Education, Psychology, '
            'English, Chinese, Arabic, French, Mass Communication'
        ),
        'about': (
            'NUML is best known for languages and communication, while also offering management, social sciences and '
            'computing programs. It is a strong choice for linguistics, IR and multilingual career pathways.'
        ),
        'known_for': 'Languages, translation and communication studies.',
        'best_for': 'Languages & Social Sciences',
    },
    'University of Central Punjab (UCP)': {
        'programs': (
            'Computer Science, Software Engineering, Artificial Intelligence (AI), Data Science, '
            'Cybersecurity, Electrical Engineering, Business Administration, Accounting, Finance, '
            'Law, Psychology, Media & Communication, Pharmacy'
        ),
        'about': (
            'UCP is a large private university in Lahore with broad faculties spanning computing, engineering, '
            'business, law and social sciences. Students often choose it for private-sector program variety and campus facilities.'
        ),
        'known_for': 'Broad private-university program portfolio in Lahore.',
        'best_for': 'Computer Science, Business & Law',
    },
}


NEW_UNIVERSITIES = [
    {
        'name': 'Superior University',
        'website': 'https://www.superior.edu.pk',
        'sector': 'Private',
        'city': 'Lahore',
        'province': 'Punjab',
        'programs': (
            'Computer Science, Software Engineering, Artificial Intelligence (AI), Data Science, '
            'Cybersecurity, Business Administration, Accounting, Finance, Marketing, '
            'Human Resource Management, Law, Pharmacy, Psychology, Media & Communication, '
            'Graphic Design, Education, Electrical Engineering, Civil Engineering, '
            'Medical Laboratory Technology, Doctor of Physical Therapy, Nursing'
        ),
        'about': (
            'Superior University is a HEC-recognized private university based in Lahore with multiple faculties and '
            'a large undergraduate portfolio. It is known for accessible private higher education across computing, '
            'business, media, pharmacy, law and selected engineering/health-related programs, with an emphasis on '
            'employability and industry-oriented learning.'
        ),
        'known_for': 'Broad private-sector degrees in business, media, computing, pharmacy and professional programs in Lahore.',
        'best_for': 'Business, Media & Computer Science',
        'admission_criteria': (
            'Intermediate / A-Level / equivalent meeting faculty-specific minimums '
            '(typically 45–50%+ depending on program; professional programs may require higher marks and relevant subjects).'
        ),
        'entry_tests': 'Superior University admission test / interview where applicable; program-wise policy',
        'merit_formula': 'Academic record + university admission process (program-wise; confirm current prospectus)',
        'admission_intake': 'Fall / Spring',
        'scholarships': (
            'Merit scholarships, need-based financial aid, sibling / kinship concessions (as announced); '
            'PWWF labour-quota / Talent Scholarship pathway for eligible industrial workers’ children where applicable'
        ),
        'contact': 'info@superior.edu.pk',
        'source_url': 'https://www.superior.edu.pk',
        'collected_by': 'NextStep AI',
        'date_collected': date(2026, 3, 23),
    },
]


def apply_university_enrichment(row):
    extra = ENRICHMENT.get(row['name'], {})
    merged = {**row, **extra}
    merged['scholarships'] = normalize_university_scholarships(merged.get('scholarships', ''))
    return merged


def normalize_university_scholarships(text):
    """Ensure every university lists marks-based merit scholarships clearly."""
    merit = (
        'Merit-based scholarships / fee waivers according to admission and semester marks or CGPA '
        '(higher percentage bands usually receive larger concessions).'
    )
    need = 'Need-based financial aid may also be available for eligible students.'
    existing = ' '.join(str(text or '').split()).strip().rstrip('.')
    lower = existing.lower()

    parts = [merit]
    if 'need-based' not in lower and 'need based' not in lower and 'financial aid' not in lower:
        parts.append(need)
    if existing and merit.lower() not in lower:
        parts.append(existing)

    # Deduplicate while preserving order
    seen = set()
    clean = []
    for part in parts:
        key = part.lower()
        if key in seen:
            continue
        seen.add(key)
        clean.append(part)
    return ' '.join(p if p.endswith('.') else p + '.' for p in clean)
