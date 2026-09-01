"""
Match formula: Subject×0.40 + Interest×0.35 + Education×0.15 + Market×0.10
"""


def subject_match_score(field, marks):
    marks = marks or {}
    required = field.required_subjects or []
    if not required:
        return 50
    total = 0
    count = 0
    for sub in required:
        value = marks.get(sub)
        if value is not None and value != '':
            total += min(100, max(0, (float(value) - 40) * 1.67))
            count += 1
    if count == 0:
        return 45
    return round(total / count)


def interest_match_score(field, user_tags):
    field_tags = field.interest_tags or []
    if not field_tags:
        return 50
    if not user_tags:
        return 40
    common = len([tag for tag in field_tags if tag in user_tags])
    return round((common / len(field_tags)) * 100)


def education_match_score(field, level):
    preferred = field.preferred_levels or []
    if not level:
        return 50
    if level in preferred:
        return 100
    if any('Bachelor' in item and 'Bachelor' in level for item in preferred):
        return 70
    if 'Intermediate' in preferred and level == 'Intermediate':
        return 100
    return 40


def market_score(field):
    avg = ((field.market or 5) + (field.future or 5)) / 2
    return round(avg * 10)


def score_field(field, marks, user_tags, level):
    subject = subject_match_score(field, marks)
    interest = interest_match_score(field, user_tags)
    education = education_match_score(field, level)
    market = market_score(field)
    final = round(subject * 0.40 + interest * 0.35 + education * 0.15 + market * 0.10)
    final = min(98, final)
    return {
        'subject': subject,
        'interest': interest,
        'education': education,
        'market': market,
        'final': final,
    }


def user_interest_tags(user):
    tags = set()
    for answer in user.questionnaire_answers.select_related('option'):
        tag = (answer.option.tag or '').strip()
        if tag:
            tags.add(tag)
    return list(tags)
