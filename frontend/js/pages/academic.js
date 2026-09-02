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

async function saveAcademic() {
  if (!getToken()) { toast('Please log in first'); nav('login'); return; }
  const level = document.getElementById('ac-level').value;
  const background = document.getElementById('ac-bg').value;
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
    nav('questionnaire');
  } catch (err) {
    toast(err.message || 'Could not save profile');
  }
}

function pageAcademic() {
  const m = state.academic.marks || {};
  return `<div class="card" style="max-width:640px;">
    <h3 style="margin-bottom:4px;">Education details</h3>
    <p style="color:var(--muted);font-size:13.5px;margin-bottom:20px;">
      Sign up is done. Now add your current education, stream, then marks obtained out of total for each subject.
    </p>
    <div class="field"><label>1. Education level</label>
      <select id="ac-level">
        <option value="">Select…</option>
        ${EDUCATION_LEVELS.map(l => `<option ${state.academic.level===l?'selected':''}>${l}</option>`).join('')}
      </select>
    </div>
    <div class="field"><label>2. Background / stream</label>
      <select id="ac-bg">
        <option value="">Select…</option>
        ${BACKGROUNDS.map(b => `<option ${state.academic.background===b?'selected':''}>${b}</option>`).join('')}
      </select>
    </div>
    <h4 style="margin:18px 0 6px;font-size:14px;">3. Subject marks (obtained / total)</h4>
    <p class="helper" style="margin-bottom:12px;">Fill at least 2 subjects. Example: obtained 78, total 100.</p>
    <div class="marks-head"><span></span><span>Obtained</span><span></span><span>Total</span></div>
    ${SUBJECTS.map(s => {
      const key = s.replace(/\s/g,'_');
      return `<div class="marks-grid">
        <label>${s}</label>
        <input type="number" id="obt-${key}" min="0" step="0.01" placeholder="Gained" value="${markObtained(m[s])}">
        <span class="marks-sep">/</span>
        <input type="number" id="tot-${key}" min="1" step="0.01" placeholder="Total" value="${markTotal(m[s])}">
      </div>`;
    }).join('')}
    <button class="btn btn-primary" style="margin-top:16px;" onclick="saveAcademic()">Save &amp; continue to Questionnaire</button>
  </div>`;
}
