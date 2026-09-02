function markPercent(entry) {
  if (entry == null || entry === '') return null;
  if (typeof entry === 'object') {
    if (entry.percent != null && entry.percent !== '') return Number(entry.percent);
    const total = Number(entry.total);
    const obtained = Number(entry.obtained);
    if (!total) return null;
    return Math.max(0, Math.min(100, 100 * obtained / total));
  }
  const n = Number(entry);
  return Number.isNaN(n) ? null : Math.max(0, Math.min(100, n));
}

function getInterestTagWeights() {
  const weights = {};
  Object.values(state.quizAnswers).forEach((ans) => {
    const tags = Array.isArray(ans) ? ans : [ans];
    tags.forEach((t) => {
      if (!t) return;
      weights[t] = (weights[t] || 0) + 1;
    });
  });
  return weights;
}

function getInterestTags() {
  return Object.keys(getInterestTagWeights());
}

function subjectMatchScore(field) {
  const marks = state.academic.marks || {};
  const required = field.requiredSubjects || [];
  const weights = getInterestTagWeights();
  const SUBJECT_TAGS = {
    math: 'Mathematics', physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology',
    computers: 'Computer Science', commerce: 'Accounting', languages: 'English',
  };
  if (!required.length) {
    const all = Object.values(marks).map(markPercent).filter((p) => p != null);
    return all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : 50;
  }
  const percents = [];
  let missing = 0;
  required.forEach((sub) => {
    const p = markPercent(marks[sub]);
    if (p == null) missing += 1;
    else percents.push(p);
  });
  if (!percents.length) return 30;
  let enjoyed = 0;
  Object.entries(SUBJECT_TAGS).forEach(([tag, subject]) => {
    if (required.includes(subject) && weights[tag]) enjoyed += 1;
  });
  return Math.round(Math.max(0, Math.min(100, (percents.reduce((a, b) => a + b, 0) / percents.length) - missing * 14 + Math.min(8, enjoyed * 4))));
}

function interestMatchScore(field) {
  const weights = getInterestTagWeights();
  const fieldTags = (field.interestTags || []).filter(Boolean);
  if (!fieldTags.length) return 50;
  if (!Object.keys(weights).length) return 32;
  let hit = 0;
  fieldTags.forEach((tag) => {
    const w = weights[tag] || 0;
    if (w) hit += Math.min(1, 0.52 + 0.16 * w);
  });
  let raw = 100 * hit / fieldTags.length;
  const CATEGORY_TAGS = {
    'Computer Science': ['cs-it-ai', 'computers', 'technology'],
    'Engineering': ['engineering', 'physics', 'math'],
    'Medical': ['medicine', 'biology', 'helping-people'],
    'Business': ['business', 'commerce', 'entrepreneur', 'leading'],
    'Social Sciences': ['social-sciences', 'helping-people', 'languages'],
  };
  if ((CATEGORY_TAGS[field.category] || []).some((t) => weights[t])) raw += 8;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

function educationMatchScore(field) {
  const LEVEL_READY = { 'A-Level': 100, Intermediate: 98, 'O-Level': 74, Matric: 70 };
  const levelPart = LEVEL_READY[state.academic.level] || 50;
  const allowed = (field.minBackground || []).filter((x) => x && x !== 'Any');
  const background = state.academic.background;
  let streamPart = 50;
  if (!(field.minBackground || []).length || (field.minBackground || []).includes('Any')) {
    streamPart = background ? 100 : 50;
  } else if (allowed.includes(background)) {
    streamPart = 100;
  } else if (!background) {
    streamPart = 50;
  } else {
    const RELATED = {
      'Pre-Engineering': { ICS: 78, 'Pre-Medical': 28, Commerce: 22 },
      ICS: { 'Pre-Engineering': 80, Commerce: 42, 'Pre-Medical': 24 },
      'Pre-Medical': { 'Pre-Engineering': 30, ICS: 24 },
      Commerce: { ICS: 48, 'Arts / Humanities': 55 },
      'Arts / Humanities': { Commerce: 52 },
    };
    streamPart = Math.max(18, ...allowed.map((s) => (RELATED[background] || {})[s] || 18));
  }
  return Math.round(levelPart * 0.45 + streamPart * 0.55);
}

function marketScore(field) {
  const avg = ((field.market || 5) + (field.future || 5)) / 2;
  return Math.round(avg * 10);
}

function streamPenalty(field) {
  const background = state.academic.background;
  const allowed = field.minBackground || [];
  if (!background || !allowed.length || allowed.includes('Any') || allowed.includes(background)) return 1;
  if (field.category === 'Medical') return 0.58;
  if (field.category === 'Engineering' && background !== 'Pre-Engineering' && background !== 'ICS') return 0.72;
  return 0.88;
}

function scoreField(field) {
  const subject = subjectMatchScore(field);
  const interest = interestMatchScore(field);
  const education = educationMatchScore(field);
  const market = marketScore(field);
  let final = subject * 0.40 + interest * 0.35 + education * 0.15 + market * 0.10;
  final *= streamPenalty(field);
  final = Math.round(Math.max(0, Math.min(99, final)));
  return {
    ...field,
    scores: { subject, interest, education, market, final },
    match: final,
  };
}

function generateRecommendations() {
  if (state.apiRecs && state.apiRecs.length) return state.apiRecs;
  return FIELDS.map(scoreField).sort((a, b) => b.match - a.match);
}

function profileCompletion() {
  let n = 0;
  if (state.academic.level) n += 25;
  if (state.academic.background) n += 15;
  if (Object.keys(state.academic.marks).length >= 2) n += 20;
  if (state.quizComplete) n += 40;
  return n;
}

function recommendedUnis(topFieldIds) {
  return UNIS.map((u) => {
    const overlap = (u.fieldIds || []).filter((id) => topFieldIds.includes(id)).length;
    return { ...u, relevance: overlap };
  }).filter((u) => u.relevance > 0).sort((a, b) => b.relevance - a.relevance);
}

function recommendedSchols(avg, topCategories) {
  return SCHOLS.filter((s) => {
    if (s.minMarks && avg && avg < s.minMarks) return false;
    const cats = s.fieldCategories || [];
    if (!cats.length || cats.includes('All')) return true;
    const blob = `${s.fieldOfStudy} ${cats.join(' ')}`.toLowerCase();
    return topCategories.some((c) => {
      const key = (c || '').toLowerCase();
      if (blob.includes(key)) return true;
      if (key.includes('computer') && /it|ai|computer/.test(blob)) return true;
      if (key.includes('medical') && /medicine|medical|health/.test(blob)) return true;
      if (key.includes('engineer') && blob.includes('engineering')) return true;
      if (key.includes('business') && blob.includes('business')) return true;
      return false;
    });
  });
}

function avgMarks() {
  const vals = Object.values(state.academic.marks || {}).map(markPercent).filter((n) => n != null && !Number.isNaN(n));
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}
