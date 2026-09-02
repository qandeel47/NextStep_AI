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

async function quizNav(dir) {
  const q = QUESTIONS[state.quizStep];
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
  if (next >= QUESTIONS.length) {
    for (const item of QUESTIONS) {
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

function pageQuiz() {
  if (!QUESTIONS.length) {
    return `<div class="card"><p>Loading questions…</p></div>`;
  }
  const q = QUESTIONS[state.quizStep];
  const { min, max } = quizLimits(q);
  const pct = Math.round(((state.quizStep + 1) / QUESTIONS.length) * 100);
  const ans = state.quizAnswers[q.id];
  const count = selectedCount(q.id, q.type === 'multi');
  return `<div class="grid g3">
    <div class="card col-2">
      <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--muted);margin-bottom:6px;">
        <span>Question ${state.quizStep + 1} of ${QUESTIONS.length}</span><span>${pct}%</span>
      </div>
      <div class="progress" style="margin-bottom:22px;"><div class="progress-fill" style="width:${pct}%"></div></div>
      <h3 style="font-size:18px;margin-bottom:4px;">${esc(q.text)}</h3>
      <p style="font-size:12.5px;color:var(--muted);margin-bottom:16px;">
        ${esc(q.hint || (q.type === 'multi' ? `Select ${min} to ${max} options` : 'Select one option'))}
        ${q.type === 'multi' ? ` · ${count}/${max} selected` : ''}
      </p>
      ${q.type === 'multi'
        ? `<div class="grid g3" style="margin-bottom:24px;">
            ${q.options.map(o => {
              const active = (ans || []).includes(o.t || o.l);
              return `<div class="checkable ${active?'active':''}" onclick="setAnswer(${q.id}, '${(o.t||o.l).replace(/'/g,"\\'")}', ${o.id || 'null'}, true)">
                <span class="emoji">${['🧩','🎨','🤝','📊','👥','💻','🔬','✏️'][q.options.indexOf(o)] || '•'}</span>${esc(o.l)}
              </div>`;
            }).join('')}
          </div>`
        : `<div style="margin-bottom:24px;">
            ${q.options.map(o => {
              const val = o.t || o.l;
              const active = ans === val;
              return `<div class="radio-opt ${active?'active':''}" onclick="setAnswer(${q.id}, '${val.replace(/'/g,"\\'")}', ${o.id || 'null'}, false)">${esc(o.l)}</div>`;
            }).join('')}
          </div>`
      }
      <div style="display:flex;justify-content:space-between;">
        <button class="btn btn-outline" onclick="quizNav(-1)">← Back</button>
        <button class="btn btn-primary" onclick="quizNav(1)">${state.quizStep === QUESTIONS.length - 1 ? 'Finish &amp; See Results' : 'Continue →'}</button>
      </div>
    </div>
    <div class="card">
      <h4 style="margin-bottom:8px;">Why this matters</h4>
      <p style="color:var(--muted);font-size:13.5px;">All 10 answers are compulsory. Multiple-choice questions need 2 or 3 selections. Tags feed the Interest Match (35%).</p>
      <p style="font-size:12.5px;color:var(--muted);margin-top:14px;">Tags collected so far: <strong>${getInterestTags().length}</strong></p>
      <p style="font-size:12px;color:var(--muted);margin-top:8px;">${getInterestTags().slice(0,6).map(t=>`<span class="tag">${t}</span>`).join('') || '—'}</p>
    </div>
  </div>`;
}
