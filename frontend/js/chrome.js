/* ---------- CHROME ---------- */
function publicNav() {
  return `<div class="topnav"><div class="topnav-inner">
    <div class="brand" onclick="nav('landing')"><div class="brand-logo">N</div><span class="brand-text">NextStep AI</span></div>
    <div class="nav-links"></div>
    <div class="nav-actions">
      ${loggedIn()
        ? `<button class="btn btn-outline btn-sm" onclick="nav('dashboard')">Dashboard</button>
           <button class="btn btn-primary btn-sm" onclick="logout()">Log Out</button>`
        : `<button class="btn btn-outline btn-sm" onclick="nav('login')">Log In</button>
           <button class="btn btn-primary btn-sm" onclick="nav('register')">Sign Up</button>`}
    </div>
  </div></div>`;
}

function sidebar() {
  const items = [
    ['dashboard','▣','Dashboard'],
    ['academic','✎','Academic Profile'],
    ['questionnaire','◎','Questionnaire'],
    ['recommendations','✦','Recommendations'],
    ['fields','▤','Fields'],
    ['universities','🏛','Universities'],
    ['scholarships','🎓','Scholarships'],
    ['compare','⇄','Compare'],
    ['bookmarks','♡','Saved'],
  ];
  const pct = profileCompletion();
  return `<aside class="sidebar">
    <div class="sidebar-brand" onclick="nav('dashboard')"><div class="sidebar-logo">N</div><span class="sidebar-name">NextStep AI</span></div>
    <nav>${items.map(([p,ic,l]) =>
      `<button class="side-link ${state.page===p?'active':''}" onclick="nav('${p}')"><span class="ic">${ic}</span><span class="lbl">${l}</span></button>`).join('')}
    </nav>
    <div class="side-footer">
      <div class="profile-complete">
        <div class="label">Profile Completion</div>
        <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
        <div class="pct">${pct}% Complete</div>
      </div>
      <button class="side-link" onclick="logout()"><span class="ic">↩</span><span class="lbl">Logout</span></button>
    </div>
  </aside>`;
}
function logout() {
  apiLogout().finally(() => {
    toast('Logged out');
    state.page = 'landing';
    state.params = {};
    render();
  });
}

function absUrl(url) {
  const w = String(url || '').trim();
  if (!w || w === '#') return '';
  if (/^https?:\/\//i.test(w)) return w;
  return 'https://' + w.replace(/^\/+/, '');
}
function extLink(url, label, primary) {
  const href = absUrl(url);
  if (!href) return '';
  const cls = primary ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
  return `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
}

function displayName() {
  const u = state.user || {};
  return u.name || u.full_name || u.username || u.email || 'Student';
}

function topbar(title, sub) {
  const init = displayName().split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || 'U';
  return `<div class="app-topbar"><div><h1>${esc(title)}</h1>${sub?`<p class="sub">${esc(sub)}</p>`:''}</div>
    <div class="topbar-right"><button class="icon-btn">⌕</button><button class="icon-btn">🔔</button><div class="avatar">${init}</div></div></div>`;
}
function topbarFor() {
  const map = {
    dashboard: ['Welcome back, '+displayName().split(' ')[0]+'! 👋', "Here's your personalized guidance overview."],
    academic: ['Academic Profile', 'Education level, stream, then obtained / total marks per subject.'],
    questionnaire: ['Interest Questionnaire', '10 compulsory questions — single choice or 2–3 selections.'],
    recommendations: ['Your Career Recommendations', 'Weighted scores: Subject 40% · Interest 35% · Education 15% · Market 10%'],
    fieldDetail: [(FIELDS.find(f=>f.id==state.params.id)||FIELDS[0]).name, ''],
    fields: ['Explore Fields', 'Browse all fields.'],
    universities: ['Universities', 'Filtered and ranked by your top fields.'],
    uniDetail: [(UNIS.find(u=>u.id==state.params.id)||{}).name || 'University details', ''],
    scholarships: ['Scholarships', 'Government schemes loaded from the database.'],
    scholDetail: [(SCHOLS.find(s=>s.id==state.params.id)||{}).name || 'Scholarship details', ''],
    compare: ['Compare Universities', 'Side-by-side comparison.'],
    bookmarks: ['Saved Items', 'Fields and universities you bookmarked.'],
  };
  const [t,s] = map[state.page] || ['NextStep AI',''];
  return topbar(t,s);
}

function ring(pct, size=96) {
  const r = size/2 - 8, c = 2*Math.PI*r, off = c - (pct/100)*c;
  return `<div class="ring-wrap" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="8"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--navy)" stroke-width="8" stroke-dasharray="${c}" stroke-dashoffset="${off}" stroke-linecap="round"/></svg>
    <div class="ring-center"><div class="n">${pct}%</div><div class="l">Match</div></div></div>`;
}
