/* ===== UNIVERSITIES ===== */
let _uniSearchCaret = null;

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
    persistUiState();
  }
  nav('compare');
}
function toggleCompareSelect(id, event) {
  if (event) event.stopPropagation();
  _uniSearchCaret = null;
  const i = state.compareIds.indexOf(id);
  if (i > -1) state.compareIds.splice(i, 1);
  else {
    if (state.compareIds.length >= 3) {
      toast('Compare up to 3 universities');
      return;
    }
    state.compareIds.push(id);
  }
  persistUiState();
  render();
}
function goCompareSelected() {
  if (state.compareIds.length < 2) {
    toast('Select at least 2 universities to compare');
    return;
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
function onUniSearch(el) {
  state.uniQuery = el.value;
  _uniSearchCaret = el.selectionStart;
  render();
}
function restoreUnisSearchFocus() {
  if (state.page !== 'universities' || _uniSearchCaret == null) return;
  const el = document.getElementById('uni-search');
  if (!el) return;
  el.focus();
  const n = Math.min(_uniSearchCaret, el.value.length);
  el.setSelectionRange(n, n);
}
function setUniFilter(key, value) {
  _uniSearchCaret = null;
  state[key] = value;
  render();
}
function clearUniFilters() {
  _uniSearchCaret = null;
  state.uniQuery = '';
  state.uniCity = 'All';
  state.uniSector = 'All';
  state.uniProgram = 'All';
  state.uniEntry = 'All';
  state.uniSort = 'relevance';
  persistUiState();
  render();
}
function applyUniFilters() {
  persistUiState();
  toast('Filters applied', true);
}
function saveUniSearch() {
  persistUiState();
  toast('Search saved', true);
}
function toggleUniHow() {
  state.uniHow = !state.uniHow;
  render();
}
const UNI_PROGRAM_CATS = ['Engineering', 'Medical', 'IT', 'Other'];
const UNI_ENTRY_RULES = [
  [/mdcat/i, 'MDCAT'],
  [/ecat/i, 'ECAT'],
  [/\bnts\b/i, 'NTS'],
  [/\bnet\b|nust entry test/i, 'NET'],
  [/\bnu entry test\b/i, 'NU Test'],
  [/\blcat\b/i, 'LCAT'],
  [/\bsat\b/i, 'SAT'],
  [/giki/i, 'GIKI Test'],
  [/ned entry/i, 'NED Test'],
  [/pieas/i, 'PIEAS Test'],
  [/itu admission/i, 'ITU Test'],
  [/iba aptitude/i, 'IBA Test'],
  [/numl/i, 'NUML Test'],
  [/ucp admission/i, 'UCP Test'],
  [/air university/i, 'Air University Test'],
  [/\bqau\b/i, 'QAU Test'],
];

function uniqueSorted(values) {
  return [...new Set(values.map((v) => String(v || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
function uniSectorLabel(sector) {
  if (sector === 'Government' || sector === 'Public') return ['Public Sector', 'public'];
  if (sector === 'Private') return ['Private Sector', 'private'];
  return [sector || 'Other', 'other'];
}
function uniEntryTests(u) {
  const text = String((u && u.entry) || '');
  return UNI_ENTRY_RULES.filter(([re]) => re.test(text)).map(([, label]) => label);
}
function uniProgramCategories(u) {
  const text = (u.programs || []).map((p) => p.name).join(' ').toLowerCase();
  const stripped = text.replace(/software engineering/g, 'software');
  const cats = [];
  if (/engineering|mechanical|electrical|\bcivil\b|chemical/.test(stripped)) cats.push('Engineering');
  if (/mbbs|bds|nursing|allied health|pharmacy|medic|health science|veterinary/.test(text)) cats.push('Medical');
  if (/computer science|software|data science|artificial intelligence|\bit\b|information technology|computing/.test(text)) cats.push('IT');
  if (/business|bba|law|arts|social|language|agriculture|management|economics|food science/.test(text) || !cats.length) cats.push('Other');
  return cats;
}
function uniCityOf(u) {
  const name = String((u && (u.cityName || u.city)) || '').trim();
  if (!name || name === '—') return '';
  return name.split(',')[0].trim();
}
function uniFilterChoices() {
  const cities = uniqueSorted(UNIS.map(uniCityOf).filter(Boolean));
  const sectors = uniqueSorted(UNIS.map((u) => u.sector).filter(Boolean));
  if (state.uniCity !== 'All' && !cities.includes(state.uniCity)) state.uniCity = 'All';
  if (state.uniSector !== 'All' && !sectors.includes(state.uniSector)) state.uniSector = 'All';
  if (state.uniProgram !== 'All' && !UNI_PROGRAM_CATS.includes(state.uniProgram)) state.uniProgram = 'All';
  return { cities, sectors };
}
function uniDiscoveryMatch(u, recs) {
  if (!hasGuidanceData() || !recs.length) return null;
  const topIds = recs.slice(0, 3).map((f) => f.id);
  const relevance = (u.fieldIds || []).filter((id) => topIds.includes(id)).length;
  return uniMatchScore({ ...u, relevance }, recs[0].match);
}
function uniMatchesQuery(u, q) {
  if (!q) return true;
  const hay = [
    u.name,
    u.city,
    u.cityName,
    u.province,
    u.entry,
    ...(u.programs || []).map((p) => p.name),
  ].join(' ').toLowerCase();
  return hay.includes(q);
}
function filteredUnis(recs) {
  const q = (state.uniQuery || '').trim().toLowerCase();
  let list = UNIS.filter((u) => {
    if (!uniMatchesQuery(u, q)) return false;
    if (state.uniCity !== 'All' && uniCityOf(u) !== state.uniCity) return false;
    if (state.uniSector !== 'All' && u.sector !== state.uniSector) return false;
    if (state.uniProgram !== 'All' && !uniProgramCategories(u).includes(state.uniProgram)) return false;
    return true;
  }).map((u) => ({ ...u, match: uniDiscoveryMatch(u, recs) }));
  if (state.uniSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (state.uniSort === 'city') list.sort((a, b) => (a.cityName || a.city || '').localeCompare(b.cityName || b.city || ''));
  else {
    list.sort((a, b) => {
      const am = a.match == null ? -1 : a.match;
      const bm = b.match == null ? -1 : b.match;
      if (bm !== am) return bm - am;
      return a.name.localeCompare(b.name);
    });
  }
  return list;
}
function uniFilterSelect(label, key, options) {
  return `<label class="uni-filter">
    <span>${esc(label)}</span>
    <select onchange="setUniFilter('${key}', this.value)">
      ${options.map((opt) => `<option value="${esc(opt)}" ${state[key]===opt?'selected':''}>${esc(opt === 'Government' ? 'Public' : opt)}</option>`).join('')}
    </select>
  </label>`;
}
function uniCard(u) {
  const selected = state.compareIds.includes(u.id);
  const [sectorLabel, sectorClass] = uniSectorLabel(u.sector);
  const city = u.cityName || (u.city || '').split(',')[0] || '—';
  const match = u.match;
  const saved = isBm('uni', u.id);
  const tests = uniEntryTests(u);
  return `<article class="card uni-card ${selected?'is-selected':''}">
    <div class="uni-card-top">
      <label class="uni-check">
        <input type="checkbox" ${selected?'checked':''} onchange="toggleCompareSelect(${u.id}, event)">
      </label>
      <button type="button" class="uni-save ${saved?'is-on':''}" onclick="toggleBm('uni',${u.id})" aria-label="${saved?'Remove bookmark':'Save university'}">
        <svg viewBox="0 0 24 24" fill="${saved?'currentColor':'none'}" stroke="currentColor" stroke-width="1.8"><path d="M7 4h10v16l-5-3.2L7 20z"/></svg>
      </button>
    </div>
    <div class="uni-card-body">
      <div class="uni-brand">${uniBrand(u)}</div>
      <div class="uni-id">
        <h3>${esc(uniShortName(u.name))}</h3>
        <p class="uni-loc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>${esc(city)}</p>
        <span class="uni-sector ${sectorClass}">${esc(sectorLabel)}</span>
      </div>
      <div class="uni-match">
        ${match == null
          ? `<span class="uni-match-empty">Add profile</span>`
          : `<span class="match-pct">${match}%</span>`}
      </div>
    </div>
    ${tests.length ? `<p class="uni-tests">${esc(tests.join(' · '))}</p>` : ''}
    <div class="uni-card-foot">
      <button type="button" class="btn btn-outline btn-sm" onclick="nav('uniDetail',{id:${u.id}})">More details</button>
    </div>
  </article>`;
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
  const { cities, sectors } = uniFilterChoices();
  const list = filteredUnis(recs);
  const compareN = state.compareIds.length;
  return uniShell(`<div class="unis-page">
    <div class="unis-head">
      <div>
        <h1>Universities</h1>
        <p>Discover and compare universities that match your goals.</p>
      </div>
      <button class="btn btn-outline" type="button" onclick="toggleUniHow()">How it works</button>
    </div>
    ${state.uniHow ? `<div class="card unis-how">
      <strong>How university discovery works</strong>
      <ol>
        <li>Search by university, city or program.</li>
        <li>Narrow results with city, sector and program.</li>
        <li>Select up to 3 cards, then use Compare Selected.</li>
      </ol>
      <p>Match % appears after you add academic marks and complete the questionnaire. Official logos are shown where we have them; others use an emoji until more logos are added.</p>
    </div>` : ''}
    <div class="uni-search-wrap">
      <input id="uni-search" class="search-input uni-search" placeholder="Search by university, city or program (e.g., NUST, Lahore, Computer Science)" value="${esc(state.uniQuery)}" oninput="onUniSearch(this)">
    </div>
    <div class="uni-layout">
      <aside class="card uni-filters">
        <div class="uni-filters-head">
          <h4>Filters</h4>
          <button type="button" class="btn btn-ghost btn-sm" onclick="clearUniFilters()">Clear all</button>
        </div>
        ${uniFilterSelect('City', 'uniCity', ['All', ...cities])}
        ${uniFilterSelect('Sector', 'uniSector', ['All', ...sectors])}
        ${uniFilterSelect('Program', 'uniProgram', ['All', ...UNI_PROGRAM_CATS])}
        <button class="btn btn-outline btn-block" type="button" onclick="applyUniFilters()">Apply Filters</button>
        <button class="uni-save-search" type="button" onclick="saveUniSearch()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 4h10v16l-5-3.2L7 20z"/></svg>
          Save this search
        </button>
      </aside>
      <div>
        <div class="uni-toolbar">
          <p>${list.length} universit${list.length === 1 ? 'y' : 'ies'} found</p>
          <div class="uni-toolbar-right">
            <label class="uni-sort">Sort by
              <select onchange="setUniFilter('uniSort', this.value)">
                <option value="relevance" ${state.uniSort==='relevance'?'selected':''}>Relevance</option>
                <option value="name" ${state.uniSort==='name'?'selected':''}>Name</option>
                <option value="city" ${state.uniSort==='city'?'selected':''}>City</option>
              </select>
            </label>
            <button class="btn btn-compare" type="button" onclick="goCompareSelected()">Compare Selected (${compareN})</button>
          </div>
        </div>
        <div class="uni-cards">${list.map(uniCard).join('') || '<div class="card empty">No universities match this search.</div>'}</div>
      </div>
    </div>
  </div>`);
}
