/* ===== CAREER FIELDS LIST ===== */
let _fieldSearchCaret = null;

function onFieldSearch(el) {
  state.fieldQuery = el.value;
  _fieldSearchCaret = el.selectionStart;
  render();
}

function restoreFieldSearchFocus() {
  if (state.page !== 'fields' || _fieldSearchCaret == null) return;
  const el = document.getElementById('field-search');
  if (!el) return;
  el.focus();
  const n = Math.min(_fieldSearchCaret, el.value.length);
  el.setSelectionRange(n, n);
}

function filteredFields() {
  const recs = generateRecommendations();
  const q = String(state.fieldQuery || '').trim().toLowerCase();
  if (!q) return recs;
  return recs.filter((f) => {
    const hay = [
      f.name, f.category, f.desc, f.about,
      ...(f.skills || []),
      ...(f.careers || []),
    ].join(' ').toLowerCase();
    return hay.includes(q);
  });
}

function pageFields() {
  const ready = hasGuidanceData();
  const list = filteredFields();
  const wrap = loggedIn() ? '' : '<div class="shell" style="padding:36px 0;">';
  return `${wrap}
  <div class="fields-head">
    <div>
      <h2 class="fields-title">${loggedIn() ? 'Career Fields' : 'Explore career fields'}</h2>
      <p class="fields-sub">${loggedIn()
        ? 'Search fields, then open a roadmap tailored to skills, jobs and further study.'
        : 'Log in to save fields and see personalized match percentages.'}</p>
    </div>
    <div class="fields-search-wrap">
      <input id="field-search" class="search-input fields-search" type="search"
        placeholder="Search fields, skills or jobs (e.g. AI, nursing, civil)"
        value="${esc(state.fieldQuery || '')}" oninput="onFieldSearch(this)">
    </div>
  </div>
  <div class="grid g3">${list.length ? list.map(f => `<div class="card clickable-card" onclick="nav('fieldDetail',{id:${f.id}})">
    <span class="badge badge-navy">${esc(f.category)}</span>
    <h4 style="margin:10px 0 6px;">${esc(f.name)}</h4>
    <p style="font-size:13px;color:var(--muted);">${esc((f.desc || '').slice(0, 90))}${(f.desc || '').length > 90 ? '…' : ''}</p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
      ${ready ? matchPct(f.match) : '<span class="match-pct muted">Browse</span>'}
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();nav('fieldDetail',{id:${f.id}})">Details</button>
    </div>
  </div>`).join('') : `<div class="card empty">No career fields match “${esc(state.fieldQuery || '')}”.</div>`}</div>
  ${loggedIn() ? '' : '</div>'}`;
}
