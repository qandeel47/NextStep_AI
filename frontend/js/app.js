function afterAuthHome() {
  nav('dashboard');
}

function usesPublicLayout() {
  return !loggedIn() || PUBLIC_LAYOUT.includes(state.page);
}

function render() {
  if (!loggedIn() && !GUEST_PAGES.includes(state.page)) {
    state.page = 'login';
    state.params = {};
  }
  if (loggedIn() && (state.page === 'login' || state.page === 'register')) {
    state.page = 'dashboard';
  }
  let html;
  if (usesPublicLayout()) {
    html = publicNav() + content();
  } else {
    const shellClass = [
      'app-shell',
      state.sidebarCollapsed ? 'sidebar-collapsed' : '',
      state.mobileMenu ? 'mobile-open' : '',
    ].filter(Boolean).join(' ');
    html = `<div class="${shellClass}">
      <div class="sidebar-backdrop" onclick="toggleMobileNav(false)"></div>
      ${sidebar()}
      <div class="app-main">${topbarFor()}<div class="app-content${state.page==='academic'?' academic-content':''}${state.page==='questionnaire'?' quiz-content':''}${state.page==='recommendations'?' recs-content':''}${state.page==='universities'?' unis-content':''}${state.page==='scholarships'?' schols-content':''}${state.page==='counselor'?' counselor-content':''}">${pageHeading()}${content()}</div></div>
    </div>`;
    if (state.page !== 'academic' && state.page !== 'counselor') {
      html += `<button class="ai-launcher" type="button" onclick="openAiChat()" title="Chat with AI" aria-label="Open AI chat">
        ${aiChatIcon('ai-launcher-icon')}
      </button>`;
    }
    html += passwordModalHtml();
    html += bottomNav();
  }
  document.getElementById('root').innerHTML = html;
  if (typeof restoreUnisSearchFocus === 'function') restoreUnisSearchFocus();
  if (typeof restoreScholSearchFocus === 'function') restoreScholSearchFocus();
  if (typeof bindLandingMotion === 'function') bindLandingMotion();
  if (state.userMenuOpen || state.notifOpen) {
    setTimeout(() => document.addEventListener('click', closeChromeMenus, { once: true }), 0);
  }
}

function content() {
  switch(state.page) {
    case 'login': return pageLogin();
    case 'register': return pageRegister();
    case 'dashboard': return pageDashboard();
    case 'academic': return pageAcademic();
    case 'questionnaire': return pageQuiz();
    case 'recommendations': return pageRecs();
    case 'counselor': return pageCounselor();
    case 'fieldDetail': return pageField();
    case 'fields': return pageFields();
    case 'universities': return pageUnis();
    case 'uniDetail': return pageUni();
    case 'scholarships': return pageSchols();
    case 'scholDetail': return pageScholDetail();
    case 'compare': return pageCompare();
    case 'bookmarks': return pageBookmarks();
    default: return pageLanding();
  }
}

document.getElementById('root').innerHTML = '<div class="shell" style="padding:48px 0;"><div class="card">Loading NextStep AI…</div></div>';
restoreSession()
  .then(() => {
    restoreLastPage();
    return loadAuthenticatedAppData();
  })
  .then(render)
  .catch(() => {
    clearSession();
    render();
  });
