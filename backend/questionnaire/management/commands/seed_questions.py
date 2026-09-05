from django.core.management.base import BaseCommand

from questionnaire.models import Question, QuestionOption

# 10 compulsory questions. Multi = pick 2 or 3. Single = pick exactly 1.
# Long-study question removed by product requirement.
QUESTIONS = [
    {
        'order': 1,
        'text': 'Which activities do you enjoy the most?',
        'question_type': Question.MULTI,
        'min_select': 2,
        'max_select': 3,
        'hint': 'Select 2 or 3 options',
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
        'min_select': 1,
        'max_select': 1,
        'hint': 'Select one option',
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
        'min_select': 1,
        'max_select': 1,
        'hint': 'Select one option',
        'options': [
            ('Extremely important', 'high-salary'),
            ('Important but not the top priority', 'salary'),
            ('Moderate importance', 'balanced-life'),
            ('Not very important', 'impact-first'),
        ],
    },
    {
        'order': 4,
        'text': 'Do you prefer working independently or in a team?',
        'question_type': Question.SINGLE,
        'min_select': 1,
        'max_select': 1,
        'hint': 'Select one option',
        'options': [
            ('Mostly independently', 'independent'),
            ('Balance of both', 'balanced-team'),
            ('Mostly in a team', 'team'),
        ],
    },
    {
        'order': 5,
        'text': 'Which subjects did you enjoy the most?',
        'question_type': Question.MULTI,
        'min_select': 2,
        'max_select': 3,
        'hint': 'Select 2 or 3 subjects',
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
        'min_select': 1,
        'max_select': 1,
        'hint': 'Select one option',
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
        'text': 'What motivates you the most in a career?',
        'question_type': Question.SINGLE,
        'min_select': 1,
        'max_select': 1,
        'hint': 'Select one option',
        'options': [
            ('Making a positive impact on society', 'helping-people'),
            ('High earning potential', 'high-salary'),
            ('Innovation and creating new things', 'innovation'),
            ('Job security and stability', 'security'),
            ('Prestige and recognition', 'prestige'),
        ],
    },
    {
        'order': 8,
        'text': 'Are you interested in research and continuous learning?',
        'question_type': Question.SINGLE,
        'min_select': 1,
        'max_select': 1,
        'hint': 'Select one option',
        'options': [
            ('Yes, I love research and learning new things', 'research'),
            ('Moderately interested', 'practical'),
            ('I prefer practical and applied work', 'practical'),
        ],
    },
    {
        'order': 9,
        'text': 'Preferred work style after graduation',
        'question_type': Question.SINGLE,
        'min_select': 1,
        'max_select': 1,
        'hint': 'Select one option',
        'options': [
            ('Technical / specialized expert', 'technology'),
            ('Managerial / leadership role', 'leading'),
            ('Entrepreneur / start my own business', 'entrepreneur'),
            ('Helping profession (doctor, teacher, counselor, etc.)', 'helping-people'),
        ],
    },
    {
        'order': 10,
        'text': 'Which broad area interests you the most right now?',
        'question_type': Question.MULTI,
        'min_select': 2,
        'max_select': 3,
        'hint': 'Select 2 or 3 areas',
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
    help = 'Seed the 10 recommendation questionnaire questions'

    def handle(self, *args, **options):
        seeded = 0
        active_orders = []
        for item in QUESTIONS:
            active_orders.append(item['order'])
            question, _ = Question.objects.update_or_create(
                order=item['order'],
                defaults={
                    'text': item['text'],
                    'question_type': item['question_type'],
                    'hint': item['hint'],
                    'min_select': item['min_select'],
                    'max_select': item['max_select'],
                    'is_active': True,
                },
            )
            for index, (label, tag) in enumerate(item['options'], start=1):
                QuestionOption.objects.update_or_create(
                    question=question,
                    order=index,
                    defaults={'label': label, 'tag': tag},
                )
            seeded += 1

        Question.objects.exclude(order__in=active_orders).update(is_active=False)
        self.stdout.write(self.style.SUCCESS(f'Seeded {seeded} questions'))
