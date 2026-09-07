/* ===== UNIVERSITY DETAIL ===== */
function pageUni() {
  const u = UNIS.find(x => x.id == state.params.id);
  if (!u) {
    return `<a class="back" onclick="nav('universities')">← Back</a>
      <div class="card" style="text-align:center;padding:40px;">
        <h3>University not found</h3>
        <p style="color:var(--muted);margin:12px 0 20px;">This record is not in the loaded database list.</p>
        <button class="btn btn-primary" onclick="reloadUnis()">Reload from database</button>
      </div>`;
  }
  const rows = [
    ['Location', u.city],
    ['Sector', u.sector],
    ['Best for', u.bestFor || '—'],
    ['Entry Test', u.entry],
    ['Intake', u.intake],
    ['Contact', u.contact],
    ['Official website', u.website || '—'],
  ];
  const programChips = (u.programs || []).map((p) =>
    `<span class="tag uni-program-tag">${esc(p.name)}</span>`).join('');

  return `<a class="back" onclick="nav('universities')">← Back to universities</a>
  <div class="card" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:12px;">
    <div class="uni-detail-hero">
      <div class="uni-brand">${uniBrand(u)}</div>
      <div>
        <h3>${esc(u.name)}</h3>
        <p style="color:var(--muted);margin:0;">${esc(u.city)} · ${esc(uniSectorLabel(u.sector)[0])}</p>
        ${u.bestFor ? `<span class="badge badge-navy" style="margin-top:8px;display:inline-block;">Best for: ${esc(u.bestFor)}</span>` : ''}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      ${loggedIn()?`<button class="btn btn-outline" onclick="toggleBm('uni',${u.id})">${isBm('uni',u.id)?'Saved':'Save'}</button>`:''}
      ${extLink(u.website, 'Visit official website', true)}
      <button class="btn btn-outline btn-sm" onclick="addCompare(${u.id})">Compare</button>
    </div>
  </div>
  <div class="grid g3">
    <div class="card col-2">
      <h4>About this university</h4>
      <p style="color:var(--muted);line-height:1.55;">${esc(u.about) || 'No university overview saved yet.'}</p>
      ${u.knownFor ? `<h4 style="margin-top:16px;">Known for</h4><p style="color:var(--muted);line-height:1.55;">${esc(u.knownFor)}</p>` : ''}
      <h4 style="margin-top:16px;">Degrees & programs</h4>
      <div class="uni-program-wrap">${programChips || '<p style="color:var(--muted);">No program list saved.</p>'}</div>
      ${u.admissionCriteria ? `<h4 style="margin-top:16px;">Admission criteria</h4><p style="color:var(--muted);line-height:1.55;">${esc(u.admissionCriteria)}</p>` : ''}
      ${u.meritFormula ? `<h4 style="margin-top:16px;">Merit formula</h4><p style="color:var(--muted);line-height:1.55;">${esc(u.meritFormula)}</p>` : ''}
      ${u.scholarships ? `<h4 style="margin-top:16px;">University scholarships</h4>
        <p style="color:var(--muted);line-height:1.55;">${esc(u.scholarships)}</p>
        <p class="helper" style="margin-top:8px;">Merit awards usually depend on your marks / CGPA. Confirm current brackets on the university website.</p>
        <button class="btn btn-outline btn-sm" style="margin-top:10px;" onclick="nav('scholarships')">Browse government scholarships</button>` : ''}
    </div>
    <div class="card">
      <h4>Quick info</h4>
      ${rows.map(([l,v])=>`<div class="kv"><span class="k">${l}</span><span class="v">${esc(v || '—')}</span></div>`).join('')}
      <div style="margin-top:14px;">${extLink(u.website, 'Open official website', true)}</div>
    </div>
  </div>`;
}
