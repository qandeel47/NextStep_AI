from django.core.management.base import BaseCommand

from questionnaire.models import Question, QuestionOption

QUESTIONS = [
    {
        'order': 1,
        'text': 'Which activities do you enjoy the most?',
        'question_type': Question.MULTI,
        'hint': 'Select all that apply',
        'options': [
            ('Solving complex problems / puzzles', 'problem-solving'),
            ('Creating or designing things', 'creating'),
            ('Helping and guiding people', 'helping-people'),
            ('Analyzing data and finding patterns', 'analyzing-data'),
            ('Leading teams and organizing work', 'leading'),
            ('Working with technology and computers', 'technology'),
            ('Researching and discovering new knowledge', 'research'),
        ],
    },
    {
        'order': 2,
        'text': 'What kind of work environment do you prefer?',
        'question_type': Question.SINGLE,
        'hint': '',
        'options': [
            ('Working mostly with technology and computers', 'technology'),
            ('Working closely with people (patients, clients, students)', 'helping-people'),
            ('Working outdoors or in the field', 'outdoors'),
            ('Working in a lab or research environment', 'research'),
            ('Working in an office / corporate setting', 'office'),
        ],
    },
    {
        'order': 3,
        'text': 'How important is a high salary for you?',
        'question_type': Question.SINGLE,
        'hint': '',
        'options': [
            ('Extremely important', 'high-salary'),
            ('Important but not the top priority', 'salary'),
            ('Moderate importance', ''),
            ('Not very important', ''),
        ],
    },
    {
        'order': 4,
        'text': 'Do you prefer working independently or in a team?',
        'question_type': Question.SINGLE,
        'hint': '',
        'options': [
            ('Mostly independently', 'independent'),
            ('Balance of both', ''),
            ('Mostly in a team', 'team'),
        ],
    },
    {
        'order': 5,
        'text': 'Which subjects did you enjoy the most?',
        'question_type': Question.MULTI,
        'hint': 'Select all that apply',
        'options': [
            ('Mathematics', 'math'),
            ('Physics', 'physics'),
            ('Chemistry', 'chemistry'),
            ('Biology', 'biology'),
            ('Computer Science / ICT', 'computers'),
            ('Accounting / Commerce', 'commerce'),
            ('English / Languages', 'languages'),
            ('Arts / Design', 'creating'),
        ],
    },
    {
        'order': 6,
        'text': 'What is your strongest skill?',
        'question_type': Question.SINGLE,
        'hint': '',
        'options': [
            ('Logical thinking & problem solving', 'problem-solving'),
            ('Creativity & innovation', 'innovation'),
            ('Communication & interpersonal skills', 'helping-people'),
            ('Attention to detail & accuracy', 'detail'),
            ('Leadership & decision making', 'leading'),
        ],
    },
    {
        'order': 7,
        'text': 'How do you feel about long years of study (e.g. MBBS is 5+ years)?',
        'question_type': Question.SINGLE,
        'hint': '',
        'options': [
            ('I am ready for long study if the field is good', 'long-study'),
            ('I prefer shorter duration programs', 'short-study'),
            ('Duration does not matter much', ''),
        ],
    },
    {
        'order': 8,
        'text': 'What motivates you the most in a career?',
        'question_type': Question.SINGLE,
        'hint': '',
        'options': [
            ('Making a positive impact on society', 'helping-people'),
            ('High earning potential', 'high-salary'),
            ('Innovation and creating new things', 'innovation'),
            ('Job security and stability', 'security'),
            ('Prestige and recognition', 'prestige'),
        ],
    },
    {
        'order': 9,
        'text': 'Are you interested in research and continuous learning?',
        'question_type': Question.SINGLE,
        'hint': '',
        'options': [
            ('Yes, I love research and learning new things', 'research'),
            ('Moderately interested', ''),
            ('I prefer practical and applied work', 'practical'),
        ],
    },
    {
        'order': 10,
        'text': 'Preferred work style after graduation',
        'question_type': Question.SINGLE,
        'hint': '',
        'options': [
            ('Technical / specialized expert', 'technology'),
            ('Managerial / leadership role', 'leading'),
            ('Entrepreneur / start my own business', 'entrepreneur'),
            ('Helping profession (doctor, teacher, counselor, etc.)', 'helping-people'),
        ],
    },
    {
        'order': 11,
        'text': 'Which broad area interests you the most right now?',
        'question_type': Question.MULTI,
        'hint': 'Select all that apply',
        'options': [
            ('Computer Science / IT / AI', 'cs-it-ai'),
            ('Engineering', 'engineering'),
            ('Medicine / Health Sciences', 'medicine'),
            ('Business / Management / Finance', 'business'),
            ('Natural Sciences / Research', 'natural-sciences'),
            ('Social Sciences / Law / Humanities', 'social-sciences'),
            ('Design / Creative fields', 'design'),
        ],
    },
]


class Command(BaseCommand):
    help = 'Seed the 11 recommendation questionnaire questions'

    def handle(self, *args, **options):
        Question.objects.all().delete()
        created = 0
        for item in QUESTIONS:
            question = Question.objects.create(
                text=item['text'],
                question_type=item['question_type'],
                hint=item['hint'],
                order=item['order'],
                is_active=True,
            )
            for index, (label, tag) in enumerate(item['options'], start=1):
                QuestionOption.objects.create(
                    question=question,
                    label=label,
                    tag=tag,
                    order=index,
                )
            created += 1
        self.stdout.write(self.style.SUCCESS(f'Seeded {created} questions'))
