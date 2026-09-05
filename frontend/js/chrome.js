function brandMark(size) {
  const s = size || 32;
  return `<img class="brand-mark" src="img/logo.png" alt="NextStep AI" width="${s}" height="${s}">`;
}

function navIcon(name) {
  const icons = {
    home: '<path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/>',
    academic: '<path d="M4 8.5 12 4l8 4.5-8 4.5L4 8.5z"/><path d="M7 12.2v4.3c0 .3 2.2 2.5 5 2.5s5-2.2 5-2.5v-4.3"/>',
    quiz: '<circle cx="12" cy="12" r="8"/><path d="M12 8v5"/><circle cx="12" cy="16.2" r=".8" fill="currentColor"/>',
    recs: '<path d="M12 3.5 14.2 9H20l-4.6 3.4L17.6 18 12 14.7 6.4 18l2.2-5.6L4 9h5.8z"/>',
    fields: '<path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z"/>',
    unis: '<path d="M4 10 12 5l8 5v9H4z"/><path d="M12 10v9"/>',
    education: '<path d="M4 17V8l8-4 8 4v9"/><path d="M8 12v5c2 1.6 8 1.6 8 0v-5"/>',
    scholarships: '<path d="M12 3.8 20 8v3c0 4.6-3.4 7.6-8 8.7C7.4 18.6 4 15.6 4 11V8z"/>',
    compare: '<path d="M7 5v14M17 5v14M4 9h6M14 15h6"/>',
    saved: '<path d="M12 19.4 5.2 13A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 18.8 13z"/>',
    logout: '<path d="M10 12h10"/><path d="M16 8l4 4-4 4"/><path d="M13 5H6v14h7"/>',
    menu: '<path d="M5 7h14M5 12h14M5 17h14"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>',
    bell: '<path d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 0 0-9.6 0v3.8z"/><path d="M10 18a2 2 0 0 0 4 0"/>',
    collapse: '<path d="M14 6 8 12l6 6"/>',
    chevron: '<path d="M7 10l5 5 5-5"/>',
    lock: '<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>',
  };
  return `<svg class="nav-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;
}

function openAiChat() {
  nav('counselor');
}

function aiChatIcon(cls) {
  return `<img class="${cls || ''}" src="img/ai-chat.png" alt="" width="48" height="44">`;
}

function hasGuidanceData() {
  return !!(state.quizComplete || Object.keys(state.academic.marks || {}).length);
}

function matchPct(value) {
  if (value == null || value === '') return '<span class="match-pct muted">—</span>';
  return `<span class="match-pct">${Number(value)}%</span>`;
}

function publicNav() {
  const links = [
    ['recommendations', 'Assessment Recommendations'],
    ['fields', 'Career Fields'],
    ['universities', 'Universities'],
    ['scholarships', 'Scholarships'],
  ];
  return `<div class="topnav"><div class="topnav-inner">
    <div class="brand" onclick="nav('landing')">${brandMark(32)}<span class="brand-text">NextStep AI</span></div>
    <div class="nav-links">
      ${links.map(([p, l]) => `<button class="nav-link ${state.page===p?'active':''}" onclick="nav('${p}')">${l}</button>`).join('')}
    </div>
    <div class="nav-actions">
      ${loggedIn()
        ? `<button class="btn btn-outline btn-sm" onclick="nav('dashboard')">Dashboard</button>
           <button class="btn btn-primary btn-sm" onclick="logout()">Log Out</button>`
        : `<button class="btn btn-outline btn-sm" onclick="nav('login')">Log In</button>
           <button class="btn btn-primary btn-sm" onclick="nav('register')">Get Started</button>`}
    </div>
  </div></div>`;
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  try { localStorage.setItem('ns_sidebar', state.sidebarCollapsed ? '1' : '0'); } catch (e) {}
  render();
}

function toggleMobileNav(force) {
  state.mobileMenu = force == null ? !state.mobileMenu : !!force;
  render();
}

function isSidebarPageActive(page) {
  if (state.page === page) return true;
  if (page === 'fields' && state.page === 'fieldDetail') return true;
  if (page === 'universities' && state.page === 'uniDetail') return true;
  if (page === 'scholarships' && state.page === 'scholDetail') return true;
  return false;
}

function sidebar() {
  const items = [
    ['dashboard', 'home', 'Home'],
    ['academic', 'academic', 'Academic Profile'],
    ['questionnaire', 'quiz', 'Questionnaire'],
    ['recommendations', 'recs', 'Recommendations'],
    ['fields', 'fields', 'Career Fields'],
    ['universities', 'unis', 'Universities'],
    ['scholarships', 'scholarships', 'Scholarships'],
    ['compare', 'compare', 'Compare'],
    ['bookmarks', 'saved', 'Saved'],
  ];
  const pct = profileCompletion();
  return `<aside class="sidebar">
    <div class="sidebar-brand">
      <span onclick="nav('dashboard')" class="sidebar-logo">
        ${brandMark(32)}<span class="sidebar-name">NextStep AI</span>
      </span>
      <button class="sidebar-toggle" onclick="toggleSidebar()" aria-label="Collapse sidebar">${navIcon('collapse')}</button>
    </div>
    <nav>${items.map(([p, ic, l]) =>
      `<button class="side-link ${isSidebarPageActive(p)?'active':''}" onclick="nav('${p}')">${navIcon(ic)}<span class="lbl">${l}</span></button>`).join('')}
    </nav>
    <div class="side-footer">
      <div class="profile-complete">
        <div class="label">Profile Completion</div>
        <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
        <div class="pct">${pct}% Complete</div>
      </div>
      <button class="side-link" onclick="logout()">${navIcon('logout')}<span class="lbl">Sign out</span></button>
    </div>
  </aside>`;
}

function mobileTopbar() {
  return '';
}

function bottomNav() {
  const items = [
    ['dashboard', 'home', 'Home'],
    ['fields', 'fields', 'Explore'],
    ['bookmarks', 'saved', 'Saved'],
    ['academic', 'academic', 'Profile'],
  ];
  return `<nav class="bottom-nav">${items.map(([p, ic, l]) =>
    `<button class="${state.page===p?'active':''}" onclick="nav('${p}')">${navIcon(ic)}${l}</button>`).join('')}</nav>`;
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

function userInitials() {
  return displayName().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
}

function topbar() {
  return chromeTopbar();
}

function topbarFor() {
  return chromeTopbar();
}

function chromeTopbar() {
  return `<header class="chrome-topbar">
    <div class="chrome-topbar-right">
      <div class="chrome-pop">
        <button class="icon-btn" type="button" onclick="event.stopPropagation(); toggleNotifMenu()" aria-label="Notifications" aria-expanded="${state.notifOpen ? 'true' : 'false'}">${navIcon('bell')}</button>
        ${state.notifOpen ? `<div class="chrome-dropdown notif-dropdown" onclick="event.stopPropagation()">
          <p class="chrome-dropdown-empty">No notifications yet.</p>
        </div>` : ''}
      </div>
      <div class="chrome-pop">
        <button class="user-menu-btn" type="button" onclick="event.stopPropagation(); toggleUserMenu()" aria-expanded="${state.userMenuOpen ? 'true' : 'false'}">
          <span class="avatar">${userInitials()}</span>
          <span class="user-menu-meta">
            <span class="user-menu-name">${esc(displayName())}</span>
          </span>
          <span class="user-chevron ${state.userMenuOpen ? 'open' : ''}">${navIcon('chevron')}</span>
        </button>
        ${state.userMenuOpen ? `<div class="chrome-dropdown user-dropdown" onclick="event.stopPropagation()">
          <button type="button" onclick="openPasswordModal()">${navIcon('lock')}<span>Change Password</span></button>
        </div>` : ''}
      </div>
    </div>
  </header>`;
}

function pageHeading() {
  if (state.page === 'dashboard') return '';
  const map = {
    counselor: ['AI Career Counselor', 'Ask personalized questions about careers, education and next steps.'],
    fields: ['Explore Fields', 'Browse career fields. Match % appears after your profile and questionnaire.'],
    compare: ['Compare Universities', 'Side-by-side comparison of up to 3 universities.'],
    bookmarks: ['Saved Items', 'Fields, universities and scholarships you bookmarked.'],
  };
  const item = map[state.page];
  if (!item) return '';
  return `<div class="page-head"><h1>${esc(item[0])}</h1>${item[1] ? `<p>${esc(item[1])}</p>` : ''}</div>`;
}

function closeChromeMenus() {
  if (!state.userMenuOpen && !state.notifOpen) return;
  state.userMenuOpen = false;
  state.notifOpen = false;
  render();
}

function toggleUserMenu() {
  state.userMenuOpen = !state.userMenuOpen;
  state.notifOpen = false;
  render();
}

function toggleNotifMenu() {
  state.notifOpen = !state.notifOpen;
  state.userMenuOpen = false;
  render();
}

function openPasswordModal() {
  state.userMenuOpen = false;
  state.passwordModal = true;
  state.passwordError = '';
  state.passwordSaving = false;
  render();
}

function closePasswordModal() {
  if (state.passwordSaving) return;
  state.passwordModal = false;
  state.passwordError = '';
  render();
}

async function submitChangePassword(event) {
  event.preventDefault();
  if (state.passwordSaving) return;
  const oldPassword = document.getElementById('pw-old')?.value || '';
  const newPassword = document.getElementById('pw-new')?.value || '';
  const confirmPassword = document.getElementById('pw-confirm')?.value || '';
  state.passwordSaving = true;
  state.passwordError = '';
  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  const errEl = document.getElementById('pw-error');
  if (errEl) errEl.textContent = '';
  try {
    await apiChangePassword({ oldPassword, newPassword, confirmPassword });
    state.passwordSaving = false;
    state.passwordModal = false;
    toast('Password changed', true);
    render();
  } catch (err) {
    state.passwordSaving = false;
    state.passwordError = err.message || 'Could not change password.';
    if (errEl) errEl.textContent = state.passwordError;
    if (submitBtn) submitBtn.disabled = false;
  }
}

function passwordModalHtml() {
  if (!state.passwordModal) return '';
  return `<div class="modal-backdrop" onclick="closePasswordModal()">
    <div class="modal-card" onclick="event.stopPropagation()">
      <h3>Change Password</h3>
      <p class="helper">Enter your current password, then choose a new one.</p>
      <form onsubmit="submitChangePassword(event)">
        <div class="field"><label>Current password</label><input type="password" id="pw-old" required minlength="8" autocomplete="current-password"></div>
        <div class="field"><label>New password</label><input type="password" id="pw-new" required minlength="8" autocomplete="new-password"></div>
        <div class="field"><label>Confirm new password</label><input type="password" id="pw-confirm" required minlength="8" autocomplete="new-password"></div>
        <p class="error" id="pw-error">${esc(state.passwordError)}</p>
        <div class="modal-actions">
          <button class="btn btn-outline" type="button" onclick="closePasswordModal()">Cancel</button>
          <button class="btn btn-primary" type="submit">Update password</button>
        </div>
      </form>
    </div>
  </div>`;
}

function ring(pct, size=96, label='Match', color='#0B1F4D') {
  const r = size/2 - 8, c = 2*Math.PI*r, off = c - (pct/100)*c;
  return `<div class="ring-wrap" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#E5E7EB" stroke-width="8"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="8" stroke-dasharray="${c}" stroke-dashoffset="${off}" stroke-linecap="round"/></svg>
    <div class="ring-center"><div class="n">${pct}%</div>${label?`<div class="l">${esc(label)}</div>`:''}</div></div>`;
}

function uniBrand(u) {
  const name = (u && u.name) || '';
  const logos = [
    [/iba/i, 'img/unis/iba.png'],
    [/agriculture|uaf/i, 'img/unis/uaf.png'],
    [/central punjab|\bucp\b/i, 'img/unis/ucp.png'],
    [/fast/i, 'img/unis/fast.png'],
    [/nust/i, 'img/unis/nust.png'],
    [/giki/i, 'img/unis/giki.png'],
    [/pieas/i, 'img/unis/pieas.png'],
    [/numl|modern languages/i, 'img/unis/numl.png'],
    [/rawalpindi medical|\brmu\b/i, 'img/unis/rmu.png'],
    [/uet.*taxila|taxila/i, 'img/unis/uet-taxila.png'],
    [/uet/i, 'img/unis/uet-lahore.png'],
    [/comsats/i, 'img/unis/comsats.png'],
    [/air university/i, 'img/unis/air.png'],
    [/\bitu\b|information technology university/i, 'img/unis/itu.png'],
    [/university of karachi/i, 'img/unis/karachi.png'],
    [/\bned\b/i, 'img/unis/ned.png'],
    [/gcu.*faisalabad|government college university.*faisalabad|gc university faisalabad/i, 'img/unis/gcu-faisalabad.png'],
    [/\bgcu\b|government college university/i, 'img/unis/gcu.png'],
    [/quaid/i, 'img/unis/qau.png'],
    [/shifa/i, 'img/unis/shifa.png'],
    [/allama iqbal medical|aimc/i, 'img/unis/aimc.png'],
    [/university of the punjab/i, 'img/unis/punjab.png'],
    [/lums/i, 'img/unis/lums.png'],
    [/islamia university|bahawalpur|\biub\b/i, 'img/unis/iub.png'],
    [/iqra/i, 'img/unis/iqra.png'],
    [/open university|aiou/i, 'img/unis/aiou.png'],
    [/gujrat|\buog\b/i, 'img/unis/uog.png'],
    [/king edward|kemu/i, 'img/unis/kemu.png'],
    [/dow|duhs/i, 'img/unis/duhs.png'],
    [/university of health sciences|\buhs\b/i, 'img/unis/uhs.png'],
    [/khyber medical|\bkmu\b/i, 'img/unis/kmu.png'],
    [/university of sindh/i, 'img/unis/sindh.png'],
    [/university of peshawar/i, 'img/unis/peshawar.png'],
  ];
  const hit = logos.find(([re]) => re.test(name));
  if (hit) return `<img class="uni-logo-img" src="${hit[1]}" alt="">`;
  const emoji = '🏛️';
  return `<span class="uni-logo-emoji">${emoji}</span>`;
}

function uniShortName(name) {
  const s = String(name || '');
  const aliases = [
    [/comsats/i, 'COMSATS'],
    [/^ned /i, 'NED'],
    [/university of the punjab/i, 'Punjab'],
    [/university of karachi/i, 'Karachi'],
    [/university of peshawar/i, 'Peshawar'],
    [/university of sindh/i, 'Sindh'],
    [/air university/i, 'Air University'],
    [/shifa/i, 'Shifa'],
  ];
  const alias = aliases.find(([re]) => re.test(s));
  if (alias) return alias[1];
  const m = s.match(/\(([^)]+)\)/);
  if (m) {
    const rest = s.slice(m.index + m[0].length).trim();
    return rest ? `${m[1]} ${rest}` : m[1];
  }
  return s.split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
}

function emptyState(title, body, actions) {
  return `<div class="card empty">
    <h3 style="color:var(--text);margin-bottom:8px;">${esc(title)}</h3>
    <p style="margin-bottom:18px;">${esc(body)}</p>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">${actions || ''}</div>
  </div>`;
}
