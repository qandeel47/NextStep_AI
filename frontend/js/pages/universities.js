/* ===== UNIVERSITIES ===== */
function setSector(s) { state.uniSector = s; render(); }
function uniWebsiteUrl(u) {
  const w = (u && u.website) || '';
  if (!w) return '#';
  if (/^https?:\/\//i.test(w)) return w;
  return 'https://' + w.replace(/^\/+/, '');
}
function addCompare(id) {
  if (!state.compareIds.includes(id)) {
    if (state.compareIds.length >= 3) state.compareIds.shift();
    state.compareIds.push(id);
  }
  nav('compare');
}
function reloadUnis() {
  apiLoadUniversities().then(render);
}
function uniShell(inner) {
  const wrap = loggedIn() ? '' : '<div class="shell" style="padding:36px 0;">';
  return `${wrap}${inner}${loggedIn() ? '' : '</div>'}`;
}
function pageUnis() {
  if (state.unisStatus === 'idle' || state.unisStatus === 'loading') {
    if (state.unisStatus === 'idle') reloadUnis();
    return uniShell(`<div class="card" style="text-align:center;padding:40px;">
      <h3>Loading universities…</h3>
      <p style="color:var(--muted);margin-top:8px;">Fetching records from the database.</p>
    </div>`);
  }
  if (state.unisStatus === 'error') {
    return uniShell(`<div class="card" style="text-align:center;padding:40px;">
      <h3>Universities could not be loaded</h3>
      <p style="color:var(--muted);margin:12px 0 20px;">${esc(state.unisError || 'Start the backend server and try again.')}</p>
      <button class="btn btn-primary" onclick="reloadUnis()">Retry</button>
    </div>`);
  }
  if (!UNIS.length) {
    return uniShell(`<div class="card" style="text-align:center;padding:40px;">
      <h3>No universities in the database</h3>
      <p style="color:var(--muted);margin:12px 0 20px;">Run <code>python manage.py seed_universities</code> on the backend.</p>
      <button class="btn btn-primary" onclick="reloadUnis()">Retry</button>
    </div>`);
  }
  const recs = generateRecommendations();
  const topIds = recs.slice(0, 3).map(f => f.id);
  let list = UNIS.filter(u => (state.uniSector==='All'||u.sector===state.uniSector) &&
    u.name.toLowerCase().includes((state.uniQuery||'').toLowerCase()));
  if (state.quizComplete || Object.keys(state.academic.marks).length) {
    list = list.map(u => ({...u, relevance: (u.fieldIds||[]).filter(id => topIds.includes(id)).length}))
      .sort((a,b) => b.relevance - a.relevance);
  }
  return uniShell(`<div class="grid" style="grid-template-columns:220px 1fr;gap:20px;">
    <div class="card"><h4 style="margin-bottom:12px;">Filters</h4>
      <p style="font-size:12px;color:var(--muted);font-weight:700;margin-bottom:8px;">Sector</p>
      ${['All','Private','Government','Other'].map(s=>`<div class="filter-radio" onclick="setSector('${s}')"><input type="radio" ${state.uniSector===s?'checked':''}> ${s}</div>`).join('')}
      <button class="btn btn-outline btn-sm" style="margin-top:12px;" onclick="setSector('All')">Clear</button>
    </div>
    <div>
      <input placeholder="Search universities..." value="${esc(state.uniQuery)}" oninput="state.uniQuery=this.value;render()"
        style="width:100%;border:1px solid var(--border);border-radius:8px;padding:11px 14px;margin-bottom:12px;">
      <p style="font-size:12.5px;color:var(--muted);margin-bottom:12px;">Showing ${list.length} from database</p>
      <div class="grid g2">${list.map(u=>`<div class="card clickable-card" onclick="nav('uniDetail',{id:${u.id}})" style="cursor:pointer;">
        <h4 style="font-size:15px;">${esc(u.name)}</h4>
        <p style="font-size:12.5px;color:var(--muted);">${esc(u.city)} · ${esc(u.sector)}</p>
        ${u.relevance ? `<span class="badge badge-navy">Matches ${u.relevance} top field(s)</span>` : ''}
        <p style="font-size:12.5px;color:var(--muted);margin:8px 0;">Entry: ${esc(u.entry)}</p>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;" onclick="event.stopPropagation()">
          <button class="btn btn-primary btn-sm" onclick="nav('uniDetail',{id:${u.id}})">View details</button>
          ${extLink(u.website, 'Official website', false)}
          <button class="btn btn-outline btn-sm" onclick="addCompare(${u.id})">Compare</button>
        </div>
      </div>`).join('') || '<p style="color:var(--muted);">No universities match this filter.</p>'}</div>
    </div>
  </div>`);
}
