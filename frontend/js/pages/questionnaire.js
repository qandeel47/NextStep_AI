function quizLimits(q) {
  const isMulti = q.type === 'multi';
  return {
    min: q.min != null ? q.min : (isMulti ? 2 : 1),
    max: q.max != null ? q.max : (isMulti ? 3 : 1),
  };
}

function selectedCount(qid, multi) {
  if (multi) return (state.quizAnswers[qid] || []).length;
  return state.quizAnswers[qid] ? 1 : 0;
}

function setAnswer(qid, value, optionId, multi) {
  const q = QUESTIONS.find((item) => item.id === qid);
  const { max } = quizLimits(q || { type: multi ? 'multi' : 'single' });
  if (multi) {
    const cur = state.quizAnswers[qid] || [];
    const ids = state.quizOptionIds[qid] || [];
    const i = cur.indexOf(value);
    if (i > -1) {
      cur.splice(i, 1);
      ids.splice(i, 1);
    } else {
      if (cur.length >= max) {
        toast(`Select at most ${max} options`);
        return;
      }
      cur.push(value);
      ids.push(optionId);
    }
    state.quizAnswers[qid] = cur;
    state.quizOptionIds[qid] = ids;
  } else {
    state.quizAnswers[qid] = value;
    state.quizOptionIds[qid] = optionId;
  }
  render();
}

function setAnswerByIndex(qid, optionIndex, multi) {
  const question = QUESTIONS.find((item) => item.id === qid);
  const option = question && question.options[optionIndex];
  if (!option) return;
  setAnswer(qid, option.t || option.l, option.id || null, multi);
}

async function retryQuestions() {
  await loadQuestionsFromApi();
  render();
}

async function quizNav(dir) {
  const flow = quizFlow();
  const q = flow[state.quizStep];
  const { min, max } = quizLimits(q);
  const multi = q.type === 'multi';
  if (dir > 0) {
    const count = selectedCount(q.id, multi);
    if (count < min || count > max) {
      toast(multi ? `Select ${min} to ${max} options` : 'Please select an answer');
      return;
    }
  }
  const next = state.quizStep + dir;
  if (next < 0) { nav('academic'); return; }
  if (next >= flow.length) {
    for (const item of flow) {
      const lim = quizLimits(item);
      const n = selectedCount(item.id, item.type === 'multi');
      if (n < lim.min || n > lim.max) {
        toast('Every question is compulsory. Go back and complete all answers.');
        return;
      }
    }
    try {
      if (!getToken()) { toast('Please log in first'); nav('login'); return; }
      await apiSaveAnswers();
      state.quizComplete = true;
      await apiLoadRecommendations();
      toast('Questionnaire complete — generating recommendations', true);
      nav('recommendations');
    } catch (err) {
      toast(err.message || 'Could not save answers');
    }
    return;
  }
  state.quizStep = next;
  render();
}

const ASSESSMENT_SECTIONS = [
  { id: 'interests', name: 'Interests', emoji: '❤️', blurb: 'What you enjoy, which subjects you like, and which fields pull you in.' },
  { id: 'aptitude', name: 'Aptitude', emoji: '💎', blurb: 'Your strongest skills and whether you prefer research or practical work.' },
  { id: 'work-style', name: 'Work Style', emoji: '💼', blurb: 'Environment, teamwork, and the kind of role you want after graduation.' },
  { id: 'values', name: 'Values', emoji: '⭐', blurb: 'Salary, impact, security and what motivates you in a career.' },
];

function questionSection(q) {
  if (!q) return 'interests';
  const order = q.order != null ? q.order : q.id;
  const byOrder = {
    1: 'interests',
    2: 'work-style',
    3: 'values',
    4: 'work-style',
    5: 'interests',
    6: 'aptitude',
    7: 'values',
    8: 'aptitude',
    9: 'work-style',
    10: 'interests',
  };
  if (byOrder[order]) return byOrder[order];
  const t = String(q.text || '').toLowerCase();
  if (/environment|independently|team|work style|graduation/.test(t)) return 'work-style';
  if (/salary|motivate|prestige|security/.test(t)) return 'values';
  if (/strongest skill|research and continuous|aptitude/.test(t)) return 'aptitude';
  return 'interests';
}

function quizFlow() {
  const order = ASSESSMENT_SECTIONS.map((s) => s.id);
  return QUESTIONS.slice().sort((a, b) => {
    const sa = order.indexOf(questionSection(a));
    const sb = order.indexOf(questionSection(b));
    if (sa !== sb) return sa - sb;
    return (a.order || a.id) - (b.order || b.id);
  });
}

function currentQuizSection() {
  const flow = quizFlow();
  const q = flow[state.quizStep] || flow[0];
  if (!q) return ASSESSMENT_SECTIONS[0];
  return ASSESSMENT_SECTIONS.find((s) => s.id === questionSection(q)) || ASSESSMENT_SECTIONS[0];
}

function sectionQuestions(sectionId) {
  return quizFlow().filter((q) => questionSection(q) === sectionId);
}

function isSectionComplete(sectionId) {
  return sectionQuestions(sectionId).every((q) => {
    const lim = quizLimits(q);
    return selectedCount(q.id, q.type === 'multi') >= lim.min;
  });
}

function isSectionUnlocked(sectionId) {
  const ids = ASSESSMENT_SECTIONS.map((s) => s.id);
  const index = ids.indexOf(sectionId);
  if (index <= 0) return true;
  return ids.slice(0, index).every(isSectionComplete);
}

function openQuizSection(sectionId) {
  if (!isSectionUnlocked(sectionId)) {
    toast('Complete the previous section first');
    return;
  }
  const flow = quizFlow();
  const unanswered = flow.findIndex((q) => questionSection(q) === sectionId && selectedCount(q.id, q.type === 'multi') < quizLimits(q).min);
  const first = flow.findIndex((q) => questionSection(q) === sectionId);
  state.quizStep = unanswered >= 0 ? unanswered : Math.max(0, first);
  render();
}

function quizOptionEmoji(option, index) {
  const tag = String(option.t || '').toLowerCase();
  const label = String(option.l || '').toLowerCase();
  const byTag = {
    'problem-solving': '🧩',
    creating: '🎨',
    'helping-people': '🤝',
    'analyzing-data': '📊',
    leading: '📋',
    technology: '💻',
    research: '🔬',
    outdoors: '🌿',
    office: '🏢',
    'high-salary': '💰',
    salary: '💵',
    'balanced-life': '⚖️',
    'impact-first': '🌱',
    independent: '🧑‍💻',
    'balanced-team': '🤝',
    team: '👥',
    math: '➗',
    physics: '⚛️',
    chemistry: '🧪',
    biology: '🧬',
    computers: '💻',
    commerce: '📈',
    languages: '📚',
    innovation: '💡',
    detail: '🔍',
    practical: '🛠️',
    security: '🛡️',
    prestige: '🏆',
    entrepreneur: '🚀',
    'cs-it-ai': '🤖',
    engineering: '⚙️',
    medicine: '🩺',
    business: '💼',
    'natural-sciences': '🔭',
    'social-sciences': '⚖️',
    design: '🎨',
  };
  if (byTag[tag]) return byTag[tag];
  if (/math/.test(label)) return '➗';
  if (/office|corporate/.test(label)) return '🏢';
  if (/remote|home/.test(label)) return '🏠';
  if (/team/.test(label)) return '👥';
  return ['💡', '🔬', '📊', '🌍', '✏️', '🎯', '⚡', '📌'][index % 8];
}

function quizOptionParts(label) {
  const text = String(label || '');
  const slash = text.indexOf(' / ');
  if (slash > 12) return [text.slice(0, slash), text.slice(slash + 3)];
  return [text, ''];
}

function pageQuiz() {
  if (!QUESTIONS.length) {
    if (state.questionsStatus === 'error') {
      return `<div class="card" style="text-align:center;padding:40px;">
        <h3>Questionnaire unavailable</h3>
        <p style="color:var(--muted);margin:12px 0 20px;">${esc(state.questionsError)}</p>
        <button class="btn btn-primary" onclick="retryQuestions()">Try again</button>
      </div>`;
    }
    return `<div class="card"><p>Loading questions…</p></div>`;
  }
  const flow = quizFlow();
  if (state.quizStep >= flow.length) state.quizStep = 0;
  const q = flow[state.quizStep];
  const section = currentQuizSection();
  const sectionQs = sectionQuestions(section.id);
  const localIndex = Math.max(0, sectionQs.findIndex((item) => item.id === q.id));
  const { min, max } = quizLimits(q);
  const overallPct = Math.round(((state.quizStep + 1) / flow.length) * 100);
  const sectionPct = Math.round(((localIndex + 1) / sectionQs.length) * 100);
  const ans = state.quizAnswers[q.id];
  const multi = q.type === 'multi';
  const count = selectedCount(q.id, multi);
  const last = state.quizStep === flow.length - 1;
  const hint = q.hint || (multi ? `Select ${min} to ${max} options` : 'Choose the option that best describes you.');
  const why = {
    interests: 'These answers show which activities, subjects and fields you enjoy — the core of Interest Match (35%).',
    aptitude: 'Skills and learning style help rank careers you can grow into.',
    'work-style': 'Environment and teamwork decide how a career will feel day to day.',
    values: 'Salary, impact and security keep recommendations aligned with what matters to you.',
  };

  return `
  <div class="quiz-page">
    <aside class="quiz-sections">
      <h4>Assessment Sections</h4>
      ${ASSESSMENT_SECTIONS.map((item) => {
        const countQs = sectionQuestions(item.id).length;
        const unlocked = isSectionUnlocked(item.id);
        const done = unlocked && isSectionComplete(item.id);
        const active = item.id === section.id;
        const status = !unlocked ? 'locked' : (active ? 'in-progress' : (done ? 'done' : 'ready'));
        const statusLabel = !unlocked ? 'Locked' : (done && !active ? 'Done' : (active ? 'In Progress' : 'Up next'));
        return `<button type="button" class="quiz-section-card ${status}" onclick="openQuizSection('${item.id}')">
          <span class="quiz-section-ic">${item.emoji}</span>
          <span>
            <strong>${item.name}</strong>
            <em>${countQs} Question${countQs===1?'':'s'}</em>
          </span>
          <span class="quiz-section-status">${statusLabel}</span>
        </button>`;
      }).join('')}
    </aside>

    <section class="card quiz-main">
      <h1>${section.emoji} ${esc(section.name)}</h1>
      <p class="quiz-lead">${esc(section.blurb)}</p>
      <div class="quiz-progress-row">
        <span>Question ${localIndex + 1} of ${sectionQs.length}</span>
        <span class="match-pct">${sectionPct}%</span>
      </div>
      <div class="progress quiz-progress"><div class="progress-fill" style="width:${sectionPct}%"></div></div>
      <p class="helper" style="margin:-12px 0 16px;">Overall ${state.quizStep + 1} of ${flow.length} · ${overallPct}%</p>

      <h2>${esc(q.text)}</h2>
      <p class="quiz-hint">${esc(hint)}${multi ? ` · ${count}/${max} selected` : ''}</p>

      <div class="quiz-options ${multi ? 'is-multi' : ''}">
        ${q.options.map((o, i) => {
          const val = o.t || o.l;
          const active = multi ? (ans || []).includes(val) : ans === val;
          const [title, sub] = quizOptionParts(o.l);
          return `<button type="button" class="quiz-option ${active?'active':''}" onclick="setAnswerByIndex(${q.id}, ${i}, ${multi})">
            <span class="quiz-radio" aria-hidden="true"></span>
            <span class="quiz-option-ic">${quizOptionEmoji(o, i)}</span>
            <span class="quiz-option-copy">
              <strong>${esc(title)}</strong>
              ${sub ? `<em>${esc(sub)}</em>` : ''}
            </span>
          </button>`;
        }).join('')}
      </div>

      <div class="quiz-nav">
        <button class="btn btn-outline" onclick="quizNav(-1)">← Back</button>
        <button class="btn btn-primary" onclick="quizNav(1)">${last ? 'Finish &amp; See Results' : 'Continue →'}</button>
      </div>
    </section>

    <aside class="quiz-info">
      <div class="card">
        <div class="quiz-info-head">Why this matters</div>
        <p>${esc(why[section.id] || why.interests)} ${multi ? `This question needs ${min} to ${max} selections.` : 'Pick the option that feels most like you.'}</p>
      </div>
      <div class="card">
        <div class="quiz-info-head">How to choose</div>
        <ul class="quiz-tips">
          <li>Think about where you feel energized.</li>
          <li>There is no right or wrong answer.</li>
          <li>You can go back and change answers.</li>
        </ul>
      </div>
      <div class="card quiz-privacy">Your responses are private and used only to personalize your recommendations.</div>
    </aside>
  </div>`;
}
