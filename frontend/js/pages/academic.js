const EDUCATION_LEVELS = ['Matric', 'O-Level', 'Intermediate', 'A-Level'];
const BACKGROUNDS = ['Pre-Engineering', 'Pre-Medical', 'ICS', 'Commerce', 'Arts / Humanities', 'Other'];

function markObtained(entry) {
  if (entry && typeof entry === 'object') return entry.obtained ?? '';
  return entry ?? '';
}
function markTotal(entry) {
  if (entry && typeof entry === 'object') return entry.total ?? '';
  if (entry === '' || entry == null) return '';
  return 100;
}

function subjectPercentLabel(subject, marks) {
  const obtVal = markObtained(marks[subject]);
  const totVal = markTotal(marks[subject]);
  if (obtVal === '' || totVal === '' || Number(totVal) <= 0) return '—';
  const pct = Math.max(0, Math.min(100, 100 * Number(obtVal) / Number(totVal)));
  return pct.toFixed(2) + '%';
}

function captureAcademicDraft() {
  const bg = document.getElementById('ac-bg');
  if (bg) state.academic.background = bg.value;
  const level = document.getElementById('ac-level');
  if (level && level.value) state.academic.level = level.value;
  const marks = { ...(state.academic.marks || {}) };
  for (const s of SUBJECTS) {
    const key = s.replace(/\s/g, '_');
    const obtEl = document.getElementById('obt-' + key);
    const totEl = document.getElementById('tot-' + key);
    if (!obtEl && !totEl) continue;
    const obtVal = obtEl && obtEl.value !== '' ? obtEl.value : '';
    const totVal = totEl && totEl.value !== '' ? totEl.value : '';
    if (obtVal === '' && totVal === '') {
      delete marks[s];
      continue;
    }
    marks[s] = {
      obtained: obtVal === '' ? '' : Number(obtVal),
      total: totVal === '' ? '' : Number(totVal),
    };
  }
  state.academic.marks = marks;
}

function setEducationLevel(level) {
  captureAcademicDraft();
  state.academic.level = level;
  render();
}

function setAcademicStream(value) {
  captureAcademicDraft();
  state.academic.background = value;
  render();
}

function updateMarkPercent(subject) {
  const key = subject.replace(/\s/g, '_');
  const obtEl = document.getElementById('obt-' + key);
  const totEl = document.getElementById('tot-' + key);
  const pctEl = document.getElementById('pct-' + key);
  if (!pctEl) return;
  const obtVal = obtEl ? obtEl.value : '';
  const totVal = totEl ? totEl.value : '';
  if (obtVal === '' || totVal === '' || Number(totVal) <= 0) {
    pctEl.textContent = '—';
    return;
  }
  const pct = Math.max(0, Math.min(100, 100 * Number(obtVal) / Number(totVal)));
  pctEl.textContent = pct.toFixed(2) + '%';
}

async function saveAcademic(nextPage) {
  if (!getToken()) { toast('Please log in first'); nav('login'); return; }
  captureAcademicDraft();
  const level = (document.getElementById('ac-level')?.value || state.academic.level || '').trim();
  const background = (document.getElementById('ac-bg')?.value || state.academic.background || '').trim();
  if (!level) { toast('Please select your education level'); return; }
  if (!background) { toast('Please select your background / stream'); return; }
  const marks = {};
  for (const s of SUBJECTS) {
    const key = s.replace(/\s/g, '_');
    const obtEl = document.getElementById('obt-' + key);
    const totEl = document.getElementById('tot-' + key);
    const obtVal = obtEl && obtEl.value !== '' ? obtEl.value : '';
    const totVal = totEl && totEl.value !== '' ? totEl.value : '';
    if (obtVal === '' && totVal === '') continue;
    if (obtVal === '' || totVal === '') {
      toast(`Enter both obtained and total marks for ${s}`);
      return;
    }
    const obtained = Number(obtVal);
    const total = Number(totVal);
    if (total <= 0) { toast(`${s}: total must be greater than 0`); return; }
    if (obtained < 0 || obtained > total) { toast(`${s}: obtained cannot exceed total`); return; }
    marks[s] = { obtained, total };
  }
  if (Object.keys(marks).length < 2) { toast('Enter obtained and total marks for at least 2 subjects'); return; }
  state.academic = { level, background, marks };
  try {
    await apiSaveProfile({ level, background, marks });
    await apiLoadRecommendations();
    toast('Academic profile saved', true);
    if (nextPage === 'stay') {
      render();
      return;
    }
    nav(nextPage || 'dashboard');
  } catch (err) {
    toast(err.message || 'Could not save profile');
  }
}

function levelCardIcon(level) {
  return { Matric: '📘', 'O-Level': '🌍', Intermediate: '🏫', 'A-Level': '🎓' }[level] || '📚';
}

function strengthLabel(pct) {
  if (pct >= 80) return 'Excellent';
  if (pct >= 60) return 'Good';
  if (pct >= 30) return 'Fair';
  return 'Get started';
}

function pageAcademic() {
  const m = state.academic.marks || {};
  const pct = profileCompletion();
  const filled = Object.keys(m).length;
  const checks = [
    ['Education level', !!state.academic.level],
    ['Academic stream', !!state.academic.background],
    ['Subject marks (at least 2)', filled >= 2],
    ['Interest questionnaire', !!state.quizComplete],
  ];
  return `
  <div class="academic-page">
    <div class="academic-head">
      <div>
        <h1>Academic Profile</h1>
        <p>Enter your current education details to get personalized career recommendations.</p>
      </div>
      <div class="academic-complete">
        <div class="academic-complete-label">Profile completion <span class="match-pct">${pct}%</span></div>
        <div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
    </div>

    <div class="academic-layout">
      <div class="academic-main">
        <input type="hidden" id="ac-level" value="${esc(state.academic.level || '')}">

        <section class="card academic-section">
          <div class="academic-section-label">01</div>
          <h3>Current Education Level</h3>
          <p class="helper">Select the qualification you are currently studying or have completed.</p>
          <div class="level-cards">
            ${EDUCATION_LEVELS.map((level) => `
              <button type="button" class="level-card ${state.academic.level===level?'active':''}" onclick="setEducationLevel('${level}')">
                <span class="level-check" aria-hidden="true"></span>
                <span class="level-ic">${levelCardIcon(level)}</span>
                <strong>${level}</strong>
              </button>`).join('')}
          </div>
        </section>

        <section class="card academic-section">
          <div class="academic-section-label">02</div>
          <h3>Academic Stream</h3>
          <p class="helper">Choose the stream that matches your subjects.</p>
          <div class="stream-field">
            <span class="stream-ic" aria-hidden="true">${navIcon('academic')}</span>
            <select id="ac-bg" onchange="setAcademicStream(this.value)">
              <option value="">Select academic stream</option>
              ${BACKGROUNDS.map(b => `<option ${state.academic.background===b?'selected':''}>${b}</option>`).join('')}
            </select>
          </div>
        </section>

        <section class="card academic-section">
          <div class="academic-section-label">03</div>
          <h3>Subject Marks</h3>
          <p class="helper">Enter obtained and total marks. Percentages update automatically in blue.</p>
          <div class="marks-table-wrap">
            <table class="marks-table">
              <thead>
                <tr><th>Subject</th><th>Obtained Marks</th><th>Total Marks</th><th>Percentage</th></tr>
              </thead>
              <tbody>
                ${SUBJECTS.map((s) => {
                  const key = s.replace(/\s/g,'_');
                  return `<tr>
                    <td class="marks-subject">${esc(s)}</td>
                    <td><input type="number" id="obt-${key}" min="0" step="0.01" placeholder="0" value="${markObtained(m[s])}" oninput="updateMarkPercent('${s.replace(/'/g, "\\'")}')"></td>
                    <td><input type="number" id="tot-${key}" min="1" step="0.01" placeholder="100" value="${markTotal(m[s])}" oninput="updateMarkPercent('${s.replace(/'/g, "\\'")}')"></td>
                    <td><span class="match-pct marks-pct" id="pct-${key}">${subjectPercentLabel(s, m)}</span></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <aside class="academic-aside">
        <div class="card strength-card">
          ${ring(pct, 84, '')}
          <div>
            <p class="strength-kicker">Profile strength</p>
            <h4>${strengthLabel(pct)}</h4>
            <p>${pct >= 60 ? 'Your profile is strong enough for accurate career matches.' : 'Add your level, stream and marks to improve match accuracy.'}</p>
          </div>
        </div>

        <div class="card">
          <h4>Missing Information</h4>
          <ul class="missing-list">
            ${checks.map(([label, done]) => `<li class="${done?'done':''}"><span class="miss-dot"></span>${esc(label)}</li>`).join('')}
          </ul>
        </div>

        <div class="card">
          <h4>How Your Marks Affect Recommendations</h4>
          <ul class="impact-list">
            <li><span>Better match accuracy</span> Subject scores are 40% of your career match.</li>
            <li><span>Eligibility check</span> Streams help filter realistic degree options.</li>
            <li><span>Scholarship opportunities</span> Marks are used to surface relevant schemes.</li>
          </ul>
        </div>
      </aside>
    </div>

    <div class="academic-footer">
      <p class="academic-secure">Your information is secure and will only be used to improve your recommendations.</p>
      <div class="academic-footer-actions">
        <button type="button" class="btn btn-ghost btn-sm" onclick="saveAcademic('questionnaire')">Continue to questionnaire</button>
        <button type="button" class="btn btn-primary" onclick="saveAcademic('stay')">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5h11l3 3v11H5z"/><path d="M8 5v5h8V5"/><path d="M8 19v-5h8v5"/></svg>
          Save Profile
        </button>
        <span class="helper">All changes are saved securely.</span>
      </div>
    </div>
  </div>`;
}
