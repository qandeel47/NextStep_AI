"""
Recommendation formula:
  Final = Subject 40% + Interest 35% + Education 15% + Market 10%

Marks are stored as {subject: {obtained, total, percent}}.
Interest uses tag frequency so repeated signals (activities + skill + area) weigh more.
Stream mismatch (e.g. Pre-Medical vs Engineering) is penalized so rankings stay honest.
"""
from collections import Counter

LEVEL_READY = {
    'A-Level': 100,
    'Intermediate': 98,
    'O-Level': 74,
    'Matric': 70,
}

RELATED_STREAMS = {
    'Pre-Engineering': {'ICS': 78, 'Pre-Medical': 28, 'Commerce': 22},
    'ICS': {'Pre-Engineering': 80, 'Commerce': 42, 'Pre-Medical': 24},
    'Pre-Medical': {'Pre-Engineering': 30, 'ICS': 24},
    'Commerce': {'ICS': 48, 'Arts / Humanities': 55},
    'Arts / Humanities': {'Commerce': 52},
}

CATEGORY_TAGS = {
    'Computer Science': {'cs-it-ai', 'computers', 'technology'},
    'Engineering': {'engineering', 'physics', 'math'},
    'Medical': {'medicine', 'biology', 'helping-people'},
    'Business': {'business', 'commerce', 'entrepreneur', 'leading'},
    'Social Sciences': {'social-sciences', 'helping-people', 'languages'},
}

SUBJECT_TAGS = {
    'math': 'Mathematics',
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'computers': 'Computer Science',
    'commerce': 'Accounting',
    'languages': 'English',
}


def mark_percent(entry):
    if entry is None or entry == '':
        return None
    if isinstance(entry, dict):
        if entry.get('percent') is not None and entry.get('percent') != '':
            try:
                return max(0.0, min(100.0, float(entry['percent'])))
            except (TypeError, ValueError):
                pass
        total = entry.get('total')
        obtained = entry.get('obtained')
        try:
            total = float(total)
            obtained = float(obtained)
        except (TypeError, ValueError):
            return None
        if total <= 0:
            return None
        return max(0.0, min(100.0, 100.0 * obtained / total))
    try:
        return max(0.0, min(100.0, float(entry)))
    except (TypeError, ValueError):
        return None


def subject_match_score(field, marks, user_tags=None):
    marks = marks or {}
    required = field.required_subjects or []
    percents = []
    missing = 0
    for sub in required:
        value = mark_percent(marks.get(sub))
        if value is None:
            missing += 1
        else:
            percents.append(value)
    if not required:
        all_p = [mark_percent(v) for v in marks.values()]
        all_p = [p for p in all_p if p is not None]
        return round(sum(all_p) / len(all_p)) if all_p else 50, []

    enjoyed = 0
    user_tags = user_tags or {}
    for tag, subject in SUBJECT_TAGS.items():
        if subject in required and user_tags.get(tag):
            enjoyed += 1

    if not percents:
        return 30, []

    avg = sum(percents) / len(percents)
    score = avg - missing * 14
    score += min(8, enjoyed * 4)
    score = max(0, min(100, score))
    details = [f'{sub} {round(mark_percent(marks.get(sub)) or 0)}%' for sub in required if mark_percent(marks.get(sub)) is not None]
    return round(score), details


def interest_match_score(field, user_tag_weights):
    field_tags = [t for t in (field.interest_tags or []) if t]
    weights = user_tag_weights or {}
    if not field_tags:
        return 50, []
    if not weights:
        return 32, []

    hit = 0.0
    matched = []
    for tag in field_tags:
        w = weights.get(tag, 0)
        if w:
            hit += min(1.0, 0.52 + 0.16 * w)
            matched.append(tag)
    raw = 100.0 * hit / len(field_tags)

    category_boost = 0
    for tag in CATEGORY_TAGS.get(field.category, set()):
        if weights.get(tag):
            category_boost = 8
            break
    raw = max(0, min(100, raw + category_boost))
    return round(raw), matched[:5]


def education_level_score(level):
    if not level:
        return 50
    return LEVEL_READY.get(level, 50)


def background_match_score(field, background):
    allowed = [item for item in (field.min_background or []) if item and item != 'Any']
    if not field.min_background or 'Any' in (field.min_background or []):
        return 100 if background else 50
    if not background:
        return 50
    if background in allowed:
        return 100
    related = RELATED_STREAMS.get(background, {})
    best = 18
    for stream in allowed:
        best = max(best, related.get(stream, 18))
    return best


def education_match_score(field, level, background=''):
    level_part = education_level_score(level)
    stream_part = background_match_score(field, background)
    return round(level_part * 0.45 + stream_part * 0.55)


def market_score(field):
    avg = ((field.market or 5) + (field.future or 5)) / 2
    return round(avg * 10)


def stream_penalty(field, background):
    allowed = field.min_background or []
    if not background or not allowed or 'Any' in allowed:
        return 1.0
    if background in allowed:
        return 1.0
    if field.category == 'Medical':
        return 0.58
    if field.category == 'Engineering' and background not in ('Pre-Engineering', 'ICS'):
        return 0.72
    return 0.88


def score_field(field, marks, user_tag_weights, level, background=''):
    subject, subject_bits = subject_match_score(field, marks, user_tag_weights)
    interest, matched_tags = interest_match_score(field, user_tag_weights)
    education = education_match_score(field, level, background)
    market = market_score(field)
    final = subject * 0.40 + interest * 0.35 + education * 0.15 + market * 0.10
    final *= stream_penalty(field, background)
    final = round(max(0, min(99, final)))

    reasons = []
    if subject_bits:
        reasons.append('Marks: ' + ', '.join(subject_bits[:3]))
    if matched_tags:
        reasons.append('Interests: ' + ', '.join(matched_tags[:4]))
    allowed = field.min_background or []
    if background and (background in allowed or 'Any' in allowed):
        reasons.append(f'Stream fit: {background}')
    elif background:
        reasons.append(f'Stream {background} is a weaker fit for this field')
    if level:
        reasons.append(f'Education level: {level}')
    return {
        'subject': subject,
        'interest': interest,
        'education': education,
        'market': market,
        'final': final,
        'reasons': reasons[:4],
    }


def user_tag_weights(user):
    counts = Counter()
    for answer in user.questionnaire_answers.select_related('option'):
        tag = (answer.option.tag or '').strip()
        if tag:
            counts[tag] += 1
    return dict(counts)


def user_interest_tags(user):
    return list(user_tag_weights(user))
