from django.core.management.base import BaseCommand

from careerfields.models import CareerField

FIELDS = [
    {
        'name': 'Software Engineering',
        'category': 'Computer Science',
        'required_subjects': ['Mathematics', 'Computer Science', 'Physics'],
        'preferred_levels': ['Intermediate', "Bachelor's (ongoing)"],
        'interest_tags': ['problem-solving', 'technology', 'computers', 'creating', 'innovation', 'cs-it-ai', 'engineering'],
        'market': 9, 'future': 9, 'demand_label': 'Very High Demand', 'duration': '4 Years',
        'short_desc': 'Design, develop and build software solutions that solve real-world problems.',
        'about': 'Software Engineering applies engineering principles to large-scale software. Strong demand in Pakistan IT export and remote work.',
        'learn': ['Programming & Algorithms', 'Data Structures', 'Databases', 'Software Design', 'Web Technologies'],
        'skills': ['Problem Solving', 'Programming', 'System Design', 'Teamwork'],
        'careers': ['Software Engineer', 'Full Stack Developer', 'DevOps Engineer', 'QA Engineer'],
        'min_background': ['Pre-Engineering', 'ICS'],
    },
    {
        'name': 'Data Science',
        'category': 'Computer Science',
        'required_subjects': ['Mathematics', 'Computer Science', 'Statistics'],
        'preferred_levels': ['Intermediate', "Bachelor's (ongoing)"],
        'interest_tags': ['analyzing-data', 'problem-solving', 'research', 'technology', 'computers', 'cs-it-ai'],
        'market': 9, 'future': 10, 'demand_label': 'Very High Demand', 'duration': '4 Years',
        'short_desc': 'Extract insight and predictive value from data using statistics and programming.',
        'about': 'Growing demand as Pakistani companies adopt data-driven decisions.',
        'learn': ['Statistics', 'Machine Learning', 'Python', 'Data Visualization'],
        'skills': ['Statistics', 'Python', 'Critical Thinking'],
        'careers': ['Data Analyst', 'Data Scientist', 'ML Engineer'],
        'min_background': ['Pre-Engineering', 'ICS'],
    },
    {
        'name': 'Artificial Intelligence',
        'category': 'Computer Science',
        'required_subjects': ['Mathematics', 'Computer Science', 'Physics'],
        'preferred_levels': ['Intermediate', "Bachelor's (ongoing)"],
        'interest_tags': ['technology', 'research', 'innovation', 'problem-solving', 'computers', 'cs-it-ai'],
        'market': 9, 'future': 10, 'demand_label': 'Very High Demand', 'duration': '4 Years',
        'short_desc': 'Build intelligent systems that learn, reason and make decisions.',
        'about': 'Extremely high future demand globally and in Pakistan.',
        'learn': ['Machine Learning', 'Neural Networks', 'Python', 'Mathematics'],
        'skills': ['Python', 'ML', 'Research'],
        'careers': ['AI Engineer', 'ML Researcher'],
        'min_background': ['Pre-Engineering', 'ICS'],
    },
    {
        'name': 'Cyber Security',
        'category': 'Computer Science',
        'required_subjects': ['Mathematics', 'Computer Science'],
        'preferred_levels': ['Intermediate', "Bachelor's (ongoing)"],
        'interest_tags': ['technology', 'problem-solving', 'computers', 'detail', 'cs-it-ai'],
        'market': 8, 'future': 9, 'demand_label': 'High Demand', 'duration': '4 Years',
        'short_desc': 'Protect systems, networks and data from digital attacks.',
        'about': 'Rising demand with digital transformation in Pakistan.',
        'learn': ['Networking', 'Cryptography', 'Ethical Hacking'],
        'skills': ['Networking', 'Security Analysis'],
        'careers': ['Security Analyst', 'Penetration Tester'],
        'min_background': ['Pre-Engineering', 'ICS'],
    },
    {
        'name': 'Business Administration',
        'category': 'Business',
        'required_subjects': ['Accounting', 'English', 'Economics'],
        'preferred_levels': ['Intermediate', "Bachelor's (ongoing)"],
        'interest_tags': ['leading', 'helping-people', 'analyzing-data', 'high-salary', 'office', 'business', 'entrepreneur'],
        'market': 7, 'future': 7, 'demand_label': 'Growing Demand', 'duration': '4 Years',
        'short_desc': 'Management, finance, marketing and operations.',
        'about': 'Broad, stable demand; strong entrepreneurship pathway.',
        'learn': ['Management', 'Marketing', 'Accounting', 'Economics'],
        'skills': ['Leadership', 'Communication', 'Strategic Thinking'],
        'careers': ['Management Trainee', 'Marketing Executive', 'Entrepreneur'],
        'min_background': ['Commerce', 'Any'],
    },
    {
        'name': 'Medicine (MBBS)',
        'category': 'Medical',
        'required_subjects': ['Biology', 'Chemistry', 'Physics'],
        'preferred_levels': ['Intermediate'],
        'interest_tags': ['helping-people', 'research', 'detail', 'long-study', 'medicine'],
        'market': 8, 'future': 8, 'demand_label': 'Stable High Prestige', 'duration': '5+ Years',
        'short_desc': 'Diagnose, treat and prevent disease.',
        'about': 'Requires Pre-Medical and MDCAT. Long study path with strong social impact.',
        'learn': ['Anatomy', 'Physiology', 'Pathology', 'Pharmacology'],
        'skills': ['Empathy', 'Decision-making', 'Stamina'],
        'careers': ['Physician', 'Surgeon', 'Medical Officer'],
        'min_background': ['Pre-Medical'],
    },
    {
        'name': 'Electrical Engineering',
        'category': 'Engineering',
        'required_subjects': ['Mathematics', 'Physics', 'Chemistry'],
        'preferred_levels': ['Intermediate', "Bachelor's (ongoing)"],
        'interest_tags': ['problem-solving', 'technology', 'creating', 'detail', 'engineering'],
        'market': 7, 'future': 7, 'demand_label': 'Steady Demand', 'duration': '4 Years',
        'short_desc': 'Design systems that use electricity and electronics.',
        'about': 'Steady demand across power, telecom and manufacturing.',
        'learn': ['Circuit Analysis', 'Electronics', 'Power Systems'],
        'skills': ['Mathematical Modelling', 'Circuit Design'],
        'careers': ['Electrical Engineer', 'Power Systems Engineer'],
        'min_background': ['Pre-Engineering'],
    },
    {
        'name': 'Psychology',
        'category': 'Social Sciences',
        'required_subjects': ['English', 'Biology'],
        'preferred_levels': ['Intermediate', "Bachelor's (ongoing)"],
        'interest_tags': ['helping-people', 'research', 'analyzing-data', 'social-sciences'],
        'market': 6, 'future': 7, 'demand_label': 'Growing Demand', 'duration': '4 Years',
        'short_desc': 'Scientific study of mind and behaviour.',
        'about': 'Growing awareness of mental health expands demand.',
        'learn': ['Developmental Psychology', 'Cognitive Psychology', 'Research Methods'],
        'skills': ['Active Listening', 'Empathy', 'Research'],
        'careers': ['Clinical Psychologist', 'Counsellor', 'HR Specialist'],
        'min_background': ['Any'],
    },
]


class Command(BaseCommand):
    help = 'Seed career fields used by the recommendation engine'

    def handle(self, *args, **options):
        created = 0
        updated = 0
        for row in FIELDS:
            _, was_created = CareerField.objects.update_or_create(
                name=row['name'],
                defaults=row,
            )
            created += int(was_created)
            updated += int(not was_created)
        self.stdout.write(self.style.SUCCESS(
            f'Seeded career fields: {created} created, {updated} updated, total {CareerField.objects.count()}'
        ))
