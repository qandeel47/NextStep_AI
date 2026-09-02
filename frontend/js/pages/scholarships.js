/* ===== SCHOLARSHIPS ===== */
function setSchFilter(f) { state.scholarFilter = f; render(); }
function reloadSchols() {
  apiLoadScholarships().then(render);
}
function scholShell(inner) {
  const wrap = loggedIn() ? '' : '<div class="shell" style="padding:36px 0;">';
  return `${wrap}${inner}${loggedIn() ? '' : '</div>'}`;
}
function filteredSchols() {
  const avg = avgMarks();
  const q = (state.scholarQuery || '').toLowerCase();
  return SCHOLS.filter(s => {
    const regionOk = state.scholarFilter === 'All' || s.province === state.scholarFilter;
    const text = `${s.name} ${s.provider} ${s.eligibility} ${s.fieldOfStudy}`.toLowerCase();
    return regionOk && text.includes(q);
  }).map(s => ({ ...s, marksOk: !s.minMarks || avg >= s.minMarks || avg === 0 }));
}
function pageSchols() {
  if (state.scholsStatus === 'idle' || state.scholsStatus === 'loading') {
    if (state.scholsStatus === 'idle') reloadSchols();
    return scholShell(`<div class="card" style="text-align:center;padding:40px;">
      <h3>Loading scholarships…</h3>
      <p style="color:var(--muted);margin-top:8px;">Fetching government schemes from the database.</p>
    </div>`);
  }
  if (state.scholsStatus === 'error') {
    return scholShell(`<div class="card" style="text-align:center;padding:40px;">
      <h3>Scholarships could not be loaded</h3>
      <p style="color:var(--muted);margin:12px 0 20px;">${esc(state.scholsError || 'Start the backend and try again.')}</p>
      <button class="btn btn-primary" onclick="reloadSchols()">Retry</button>
    </div>`);
  }
  if (!SCHOLS.length) {
    return scholShell(`<div class="card" style="text-align:center;padding:40px;">
      <h3>No scholarships in the database</h3>
      <p style="color:var(--muted);margin:12px 0 20px;">Run <code>python manage.py seed_scholarships</code>.</p>
      <button class="btn btn-primary" onclick="reloadSchols()">Retry</button>
    </div>`);
  }

  const avg = avgMarks();
  const regions = ['All', ...[...new Set(SCHOLS.map(s => s.province))].sort()];
  const list = filteredSchols();

  return scholShell(`
  <input placeholder="Search scholarships..." value="${esc(state.scholarQuery)}" oninput="state.scholarQuery=this.value;render()"
    style="max-width:380px;width:100%;border:1px solid var(--border);border-radius:8px;padding:11px 14px;margin-bottom:14px;display:block;">
  <div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;">
    ${regions.map(f =>
      `<button class="btn btn-sm ${state.scholarFilter===f?'btn-primary':'btn-outline'}" onclick="setSchFilter('${String(f).replace(/'/g,"\\'")}')">${esc(f)}</button>`).join('')}
  </div>
  <p style="font-size:12.5px;color:var(--muted);margin-bottom:12px;">Showing ${list.length} government schemes from the database · click a card for full details</p>
  ${avg > 0 ? `<p style="font-size:13px;color:var(--muted);margin-bottom:12px;">Your average marks: <strong>${avg}%</strong></p>` : ''}
  ${list.map(s => `<div class="card clickable-card" style="margin-bottom:14px;cursor:pointer;" onclick="nav('scholDetail',{id:${s.id}})">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
      <div style="flex:1;min-width:240px;">
        <span class="badge badge-navy">Government</span>
        <h4 style="font-size:15px;margin-top:8px;">${esc(s.name)}</h4>
        <p style="font-size:12.5px;color:var(--muted);">${esc(s.provider)} · ${esc(s.province)}</p>
      </div>
      <span class="badge badge-soft">${esc(s.level)}</span>
    </div>
    <p style="font-size:13px;margin-top:10px;color:var(--muted);">${esc((s.eligibility || '').slice(0,160))}${(s.eligibility||'').length>160?'…':''}</p>
    <p style="font-size:12.5px;color:var(--navy);font-weight:700;margin-top:8px;">Deadline: ${esc(s.deadline)}</p>
    <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;" onclick="event.stopPropagation()">
      <button class="btn btn-outline btn-sm" onclick="nav('scholDetail',{id:${s.id}})">View details</button>
      ${extLink(s.website || s.sourceUrl, 'Official website', true)}
    </div>
  </div>`).join('') || '<p style="color:var(--muted);">No scholarships match this filter.</p>'}`;
}

function pageScholDetail() {
  const s = SCHOLS.find(x => x.id == state.params.id);
  if (!s) {
    return `<a class="back" onclick="nav('scholarships')">← Back</a>
      <div class="card" style="text-align:center;padding:40px;">
        <h3>Scholarship not found</h3>
        <button class="btn btn-primary" style="margin-top:12px;" onclick="reloadSchols()">Reload from database</button>
      </div>`;
  }
  const rows = [
    ['Provider', s.provider],
    ['Education level', s.level],
    ['Province / region', s.province],
    ['Field of study', s.fieldOfStudy],
    ['Deadline', s.deadline],
    ['Contact', s.contact],
  ];
  const official = s.website || s.sourceUrl;
  return `<a class="back" onclick="nav('scholarships')">← Back to scholarships</a>
  <div class="card" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:12px;">
    <div>
      <span class="badge badge-navy">Government</span>
      <h3 style="margin-top:8px;">${esc(s.name)}</h3>
      <p style="color:var(--muted);margin:0;">${esc(s.provider)} · ${esc(s.province)}</p>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      ${extLink(official, 'Go to official website', true)}
      ${s.sourceUrl && s.sourceUrl !== s.website ? extLink(s.sourceUrl, 'Source page', false) : ''}
    </div>
  </div>
  <div class="grid g3">
    <div class="card col-2">
      <h4>Eligibility</h4>
      <p style="color:var(--muted);">${esc(s.eligibility)}</p>
      <h4 style="margin-top:16px;">Coverage / amount</h4>
      <p style="color:var(--muted);">${esc(s.coverage)}</p>
      ${s.documents ? `<h4 style="margin-top:16px;">Required documents</h4><p style="color:var(--muted);">${esc(s.documents)}</p>` : ''}
      <h4 style="margin-top:16px;">How to apply</h4>
      <p style="color:var(--muted);">${esc(s.process)}</p>
      <div style="margin-top:18px;">${extLink(official, 'Open official website', true)}</div>
    </div>
    <div class="card">
      <h4>Quick info</h4>
      ${rows.map(([l,v])=>`<div class="kv"><span class="k">${l}</span><span class="v">${esc(v || '—')}</span></div>`).join('')}
    </div>
  </div>`;
}
