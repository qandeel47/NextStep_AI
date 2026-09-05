/* ===== SCHOLARSHIPS ===== */
let _scholSearchCaret = null;

function reloadSchols() {
  apiLoadScholarships().then(render);
}
function scholShell(inner) {
  const wrap = loggedIn() ? '' : '<div class="shell" style="padding:36px 0;">';
  return `${wrap}${inner}${loggedIn() ? '' : '</div>'}`;
}
function onScholSearch(el) {
  state.scholarQuery = el.value;
  _scholSearchCaret = el.selectionStart;
  render();
}
function restoreScholSearchFocus() {
  if (state.page !== 'scholarships' || _scholSearchCaret == null) return;
  const el = document.getElementById('schol-search');
  if (!el) return;
  el.focus();
  const n = Math.min(_scholSearchCaret, el.value.length);
  el.setSelectionRange(n, n);
}
function setScholFilter(key, value) {
  _scholSearchCaret = null;
  state[key] = value;
  render();
}
function clearScholFilters() {
  _scholSearchCaret = null;
  state.scholarQuery = '';
  state.scholarLevel = 'All';
  state.scholarRegion = 'All';
  state.scholarMarks = 'All';
  state.scholarCoverage = 'All';
  state.scholarDeadline = 'All';
  state.scholarSort = 'name';
  persistUiState();
  render();
}
function uniqueSorted(values) {
  return [...new Set(values.map((v) => String(v || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
function scholRegionOf(s) {
  const p = String(s.province || '').trim();
  if (!p) return '';
  if (/all pakistan/i.test(p)) return 'All Pakistan';
  if (/punjab/i.test(p)) return 'Punjab';
  if (/sindh/i.test(p)) return 'Sindh';
  if (/balochistan/i.test(p)) return 'Balochistan';
  if (/khyber|kpk|peshawar/i.test(p)) return 'Khyber Pakhtunkhwa';
  return p;
}
function scholCoverageKind(s) {
  return /full/i.test(s.coverage || '') ? 'Full' : 'Partial';
}
function scholDeadlineKind(s) {
  return /closed/i.test(s.deadline || '') ? 'Closed' : 'Open';
}
function scholBrand(s) {
  const p = `${s.provider || ''} ${s.name || ''}`.toLowerCase();
  if (/ehsaas/.test(p)) return { letters: 'EH', color: '#0B1F4D', img: 'img/schols/ehsaas.png' };
  if (/beef/.test(p)) return { letters: 'BEEF', color: '#0B1F4D', img: 'img/schols/beef.png' };
  if (/honhaar/.test(p)) return { letters: 'HH', color: '#0B1F4D', img: 'img/schols/honhaar.png' };
  if (/seef|government of sindh/.test(p)) return { letters: 'SEEF', color: '#0B1F4D', img: 'img/schols/sindh.png' };
  if (/cmeef|khyber pakhtunkhwa/.test(p)) return { letters: 'KPK', color: '#0B1F4D', img: 'img/schols/kpk.png' };
  if (/fee reimbursement|prime minister/.test(p)) return { letters: 'HEC', color: '#0B1F4D', img: 'img/schols/hec.png' };
  if (/hec/.test(p)) return { letters: 'HEC', color: '#0B1F4D', img: 'img/schols/hec.png' };
  if (/peef/.test(p)) return { letters: 'PEEF', color: '#0B1F4D', img: '' };
  const letters = String(s.provider || 'G').split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
  return { letters: letters || 'G', color: '#0B1F4D', img: '' };
}
function scholLogoHtml(s, extraClass) {
  const b = scholBrand(s);
  if (b.img) {
    return `<div class="schol-logo schol-logo-photo ${extraClass || ''}"><img src="${b.img}" alt=""></div>`;
  }
  return `<div class="schol-logo ${extraClass || ''}" style="background:${b.color}">${esc(b.letters)}</div>`;
}
function isPrimeMinisterScheme(s) {
  const p = `${s.provider || ''} ${s.name || ''}`.toLowerCase();
  return /fee reimbursement|prime minister/.test(p);
}
function scholPartnerLogosHtml(s) {
  if (!isPrimeMinisterScheme(s)) return '';
  const partners = [
    ['img/schols/hec.png', 'HEC'],
    ['img/schols/ehsaas.png', 'Ehsaas'],
    ['img/schols/beef.png', 'BEEF'],
    ['img/schols/sindh.png', 'Sindh'],
    ['img/schols/kpk.png', 'Khyber Pakhtunkhwa'],
    ['img/schols/honhaar.png', 'Honhaar'],
  ];
  return `<div class="schol-partners">
    <p class="schol-partners-label">Official logos</p>
    <div class="schol-partners-row">
      ${partners.map(([src, label]) => `<span class="schol-partner" title="${esc(label)}"><img src="${src}" alt="${esc(label)}"></span>`).join('')}
    </div>
  </div>`;
}
function scholMatch(s) {
  if (!hasGuidanceData()) return null;
  let score = 58;
  const avg = avgMarks();
  if (s.minMarks) {
    if (avg >= s.minMarks) score += 18;
    else if (avg) score -= 12;
  } else if (avg) score += 8;
  const recs = generateRecommendations().slice(0, 3);
  const fields = String(s.fieldOfStudy || '').toLowerCase();
  if (/any|not field/.test(fields)) score += 10;
  else if (recs.some((f) => {
    const blob = `${f.name || ''} ${f.category || ''}`.toLowerCase();
    return fields.includes((f.name || '').toLowerCase()) || /engineer/.test(blob) && /engineer/.test(fields) || /medic/.test(blob) && /medic/.test(fields) || /computer|it/.test(blob) && /it|computer|ai/.test(fields);
  })) score += 16;
  return Math.max(42, Math.min(98, Math.round(score)));
}
function scholFilterChoices() {
  const levels = uniqueSorted(SCHOLS.map((s) => s.level));
  const regions = uniqueSorted(SCHOLS.map(scholRegionOf));
  const markOpts = uniqueSorted(SCHOLS.map((s) => s.minMarks).filter(Boolean).map((n) => String(n)));
  if (state.scholarLevel !== 'All' && !levels.includes(state.scholarLevel)) state.scholarLevel = 'All';
  if (state.scholarRegion !== 'All' && !regions.includes(state.scholarRegion)) state.scholarRegion = 'All';
  return { levels, regions, markOpts };
}
function filteredSchols() {
  const q = (state.scholarQuery || '').toLowerCase().trim();
  let list = SCHOLS.filter((s) => {
    const text = `${s.name} ${s.provider} ${s.eligibility} ${s.fieldOfStudy} ${s.coverage}`.toLowerCase();
    if (q && !text.includes(q)) return false;
    if (state.scholarLevel !== 'All' && s.level !== state.scholarLevel) return false;
    if (state.scholarRegion !== 'All') {
      const region = scholRegionOf(s);
      if (region !== state.scholarRegion && region !== 'All Pakistan') return false;
    }
    if (state.scholarMarks !== 'All') {
      const min = Number(state.scholarMarks);
      if (!s.minMarks || s.minMarks < min) return false;
    }
    if (state.scholarCoverage !== 'All' && scholCoverageKind(s) !== state.scholarCoverage) return false;
    if (state.scholarDeadline !== 'All' && scholDeadlineKind(s) !== state.scholarDeadline) return false;
    return true;
  }).map((s) => ({ ...s, match: scholMatch(s) }));
  if (state.scholarSort === 'match') list.sort((a, b) => (b.match || 0) - (a.match || 0));
  else if (state.scholarSort === 'coverage') list.sort((a, b) => scholCoverageKind(b).localeCompare(scholCoverageKind(a)) || a.name.localeCompare(b.name));
  else list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
function scholFilterSelect(label, key, options) {
  return `<label class="schol-filter">
    <span>${esc(label)}</span>
    <select onchange="setScholFilter('${key}', this.value)">
      ${options.map((opt) => {
        const shown = opt === 'All' && key === 'scholarMarks' ? 'Any' : opt === 'All' ? `All` : (key === 'scholarMarks' ? `${opt}% or above` : opt);
        return `<option value="${esc(opt)}" ${state[key]===String(opt)?'selected':''}>${esc(shown)}</option>`;
      }).join('')}
    </select>
  </label>`;
}
function scholCard(s) {
  const saved = isBm('schol', s.id);
  const official = s.website || s.sourceUrl;
  const closed = scholDeadlineKind(s) === 'Closed';
  return `<article class="card schol-card">
    ${scholLogoHtml(s)}
    <div class="schol-main">
      <h3><button type="button" class="schol-title" onclick="nav('scholDetail',{id:${s.id}})">${esc(s.name)}</button></h3>
      <p class="schol-provider">${esc(s.provider)}</p>
      <p class="schol-desc">${esc((s.eligibility || '').slice(0, 140))}${(s.eligibility || '').length > 140 ? '…' : ''}</p>
      <p class="schol-coverage">${esc(s.coverage || 'See official details')}</p>
    </div>
    <div class="schol-meta">
      ${s.match == null
        ? `<span class="uni-match-empty">Add profile</span>`
        : `<span class="match-pct">${s.match}%</span><span class="schol-match-label">${s.match >= 80 ? 'Great match' : s.match >= 60 ? 'Good match' : 'Possible match'}</span>`}
      <p class="schol-deadline ${closed?'is-closed':''}">${esc(s.deadline || 'See official site')}</p>
      <div class="schol-actions">
        <button type="button" class="btn btn-ghost btn-sm" onclick="toggleBm('schol',${s.id})">${saved ? 'Saved' : 'Save'}</button>
        ${extLink(official, 'Apply Official', true)}
      </div>
    </div>
  </article>`;
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
  const { levels, regions, markOpts } = scholFilterChoices();
  const list = filteredSchols();
  const pct = profileCompletion();
  const saved = SCHOLS.filter((s) => isBm('schol', s.id));
  const timeline = SCHOLS.slice().sort((a, b) => scholDeadlineKind(a).localeCompare(scholDeadlineKind(b)) || a.name.localeCompare(b.name));
  return scholShell(`<div class="schols-page">
    <div class="schols-head">
      <div>
        <h1>Scholarships</h1>
        <p>Find and apply for scholarships that match your profile.</p>
      </div>
    </div>
    <div class="schol-search-row">
      <input id="schol-search" class="search-input uni-search" placeholder="Search scholarships, providers or keywords." value="${esc(state.scholarQuery)}" oninput="onScholSearch(this)">
      <button type="button" class="btn btn-ghost btn-sm" onclick="clearScholFilters()">Clear all</button>
    </div>
    <div class="schol-filters">
      ${scholFilterSelect('Education level', 'scholarLevel', ['All', ...levels])}
      ${scholFilterSelect('Province', 'scholarRegion', ['All', ...regions])}
      ${scholFilterSelect('Min. marks (%)', 'scholarMarks', ['All', ...markOpts])}
      ${scholFilterSelect('Coverage', 'scholarCoverage', ['All', 'Full', 'Partial'])}
      ${scholFilterSelect('Deadline', 'scholarDeadline', ['All', 'Open', 'Closed'])}
    </div>
    <div class="schols-layout">
      <div>
        <div class="uni-toolbar">
          <p>${list.length} scholarship${list.length === 1 ? '' : 's'} found</p>
          <label class="uni-sort">Sort by
            <select onchange="setScholFilter('scholarSort', this.value)">
              <option value="name" ${state.scholarSort==='name'?'selected':''}>Name</option>
              <option value="match" ${state.scholarSort==='match'?'selected':''}>Match</option>
              <option value="coverage" ${state.scholarSort==='coverage'?'selected':''}>Coverage</option>
            </select>
          </label>
        </div>
        <div class="schol-list">${list.map(scholCard).join('') || '<div class="card empty">No scholarships match this filter.</div>'}</div>
      </div>
      <aside class="schol-aside">
        <div class="card">
          <h4>Profile completion</h4>
          <div class="schol-ring">${ring(pct, 88, '')}</div>
          <p class="schol-aside-copy">${pct >= 80 ? 'Your profile is complete.' : 'Add marks and the questionnaire to unlock better matches.'}</p>
          <button type="button" class="btn btn-ghost btn-sm" onclick="nav('academic')">View profile</button>
        </div>
        <div class="card">
          <h4>Deadline timeline</h4>
          <div class="schol-timeline">
            ${timeline.map((s) => `<div class="schol-time-item ${scholDeadlineKind(s)==='Closed'?'is-closed':''}">
              <strong>${esc(s.name)}</strong>
              <span>${esc(s.deadline || 'See official site')}</span>
            </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="recs-list-head">
            <h4>Saved scholarships</h4>
            <button type="button" class="btn btn-ghost btn-sm" onclick="nav('bookmarks')">View all</button>
          </div>
          ${saved.length
            ? saved.map((s) => `<div class="schol-saved" onclick="nav('scholDetail',{id:${s.id}})">
                <strong>${esc(s.name)}</strong>
                <span>${esc(s.deadline || '')}</span>
              </div>`).join('')
            : `<p class="helper">Save a scheme to keep it here.</p>`}
        </div>
      </aside>
    </div>
  </div>`);
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
    ['Deadline', s.deadline],
    ['Contact', s.contact],
  ];
  const official = s.website || s.sourceUrl;
  return `<a class="back" onclick="nav('scholarships')">← Back to scholarships</a>
  <div class="card" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:12px;">
    <div class="uni-detail-hero">
      ${scholLogoHtml(s)}
      <div>
        <span class="badge badge-navy">Government</span>
        <h3 style="margin-top:8px;">${esc(s.name)}</h3>
        <p style="color:var(--muted);margin:0;">${esc(s.provider)} · ${esc(s.province)}</p>
        ${scholPartnerLogosHtml(s)}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      ${loggedIn()?`<button class="btn btn-outline" onclick="toggleBm('schol',${s.id})">${isBm('schol',s.id)?'Saved':'Save'}</button>`:''}
      ${extLink(official, 'Go to official website', true)}
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
