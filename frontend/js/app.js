/* ---------- RENDER ---------- */
function afterAuthHome() {
  const marks = Object.keys(state.academic.marks || {}).length;
  if (!state.academic.level || marks < 2) nav('academic');
  else if (!state.quizComplete) nav('questionnaire');
  else nav('recommendations');
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
  if (!loggedIn() || GUEST_PAGES.includes(state.page)) {
    html = publicNav() + content();
  } else {
    html = `<div class="app-shell">${sidebar()}<div class="app-main">${topbarFor()}<div class="app-content">${content()}</div></div></div>`;
  }
  document.getElementById('root').innerHTML = html;
}

function content() {
  switch(state.page) {
    case 'login': return pageLogin();
    case 'register': return pageRegister();
    case 'dashboard': return pageDashboard();
    case 'academic': return pageAcademic();
    case 'questionnaire': return pageQuiz();
    case 'recommendations': return pageRecs();
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

hydrateSessionFromStorage();
render();
restoreSession()
  .then(() => {
    restoreLastPage();
    return loadAuthenticatedAppData();
  })
  .then(render);
