/* ---------- STATE ---------- */
const state = {
  page: 'landing',
  params: {},
  user: null,
  // Academic profile — INCLUDES intermediate marks
  academic: {
    level: '',
    background: '',
    marks: {}, // { Mathematics: 85, Physics: 78, ... }
  },
  // Questionnaire
  quizStep: 0, // 0..9
  quizAnswers: {}, // qid -> tag or [tags]
  quizOptionIds: {},
  quizComplete: false,
  access: '',
  refresh: '',
  // UI helpers
  uniSector: 'All',
  uniQuery: '',
  scholarFilter: 'All',
  scholarQuery: '',
  compareIds: [],
  bookmarks: { fields: [], unis: [] },
  fieldTab: 'Overview',
  apiRecs: [],
  unisStatus: 'idle',
  unisError: '',
  scholsStatus: 'idle',
  scholsError: '',
};

const GUEST_PAGES = ['landing', 'login', 'register'];

function nav(page, params) {
  if (!loggedIn() && !GUEST_PAGES.includes(page)) {
    toast('Please log in or sign up first');
    page = 'login';
    params = {};
  }
  if (loggedIn() && (page === 'login' || page === 'register')) {
    page = 'dashboard';
    params = {};
  }
  state.page = page;
  state.params = params || {};
  if (loggedIn() && !GUEST_PAGES.includes(page)) {
    localStorage.setItem('ns_page', page);
    localStorage.setItem('ns_params', JSON.stringify(params || {}));
  }
  window.scrollTo(0,0);
  render();
}
function toast(msg, ok) {
  const el = document.createElement('div');
  el.className = 'toast' + (ok ? ' ok' : '');
  el.textContent = msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 2800);
}
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function loggedIn() { return !!(state.user && getToken()); }
function isBm(type, id) { return (type==='field' ? state.bookmarks.fields : state.bookmarks.unis).includes(id); }
function toggleBm(type, id) {
  if (!loggedIn()) { toast('Please log in first'); nav('login'); return; }
  const arr = type==='field' ? state.bookmarks.fields : state.bookmarks.unis;
  const i = arr.indexOf(id);
  if (i > -1) { arr.splice(i,1); toast('Removed'); } else { arr.push(id); toast('Saved', true); }
  render();
}
