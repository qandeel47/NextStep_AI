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
  uniCity: 'All',
  uniProgram: 'All',
  uniEntry: 'All',
  uniSort: 'relevance',
  uniView: 'list',
  uniHow: false,
  scholarQuery: '',
  scholarLevel: 'All',
  scholarRegion: 'All',
  scholarMarks: 'All',
  scholarCoverage: 'All',
  scholarDeadline: 'All',
  scholarSort: 'name',
  compareIds: [],
  bookmarks: { fields: [], unis: [], schols: [] },
  fieldTab: 'Overview',
  apiRecs: [],
  unisStatus: 'idle',
  unisError: '',
  scholsStatus: 'idle',
  scholsError: '',
  questionsStatus: 'idle',
  questionsError: '',
  counselorConversations: [],
  counselorConversationId: '',
  counselorMessages: [],
  counselorStatus: 'idle',
  counselorError: '',
  counselorSending: false,
  sidebarCollapsed: localStorage.getItem('ns_sidebar') === '1',
  mobileMenu: false,
  userMenuOpen: false,
  notifOpen: false,
  passwordModal: false,
  passwordError: '',
  passwordSaving: false,
};

const GUEST_PAGES = ['landing', 'login', 'register'];
const PUBLIC_LAYOUT = ['landing', 'login', 'register'];

function uiStateStorageKey() {
  return state.user && state.user.id ? `ns_ui_${state.user.id}` : '';
}

function hydratePersistentUiState() {
  state.compareIds = [];
  state.bookmarks = { fields: [], unis: [], schols: [] };
  const key = uiStateStorageKey();
  if (!key) return;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    state.compareIds = Array.isArray(saved.compareIds) ? saved.compareIds.slice(0, 3) : [];
    state.bookmarks.fields = Array.isArray(saved.fields) ? saved.fields : [];
    state.bookmarks.unis = Array.isArray(saved.unis) ? saved.unis : [];
    state.bookmarks.schols = Array.isArray(saved.schols) ? saved.schols : [];
    if (saved.uniSearch && typeof saved.uniSearch === 'object') {
      state.uniQuery = saved.uniSearch.query || '';
      state.uniCity = saved.uniSearch.city || 'All';
      state.uniSector = saved.uniSearch.sector || 'All';
      state.uniProgram = saved.uniSearch.program || 'All';
      state.uniEntry = saved.uniSearch.entry || 'All';
      state.uniSort = saved.uniSearch.sort || 'relevance';
    }
    if (saved.scholarSearch && typeof saved.scholarSearch === 'object') {
      state.scholarQuery = saved.scholarSearch.query || '';
      state.scholarLevel = saved.scholarSearch.level || 'All';
      state.scholarRegion = saved.scholarSearch.region || saved.scholarSearch.province || 'All';
      state.scholarMarks = saved.scholarSearch.marks || 'All';
      state.scholarCoverage = saved.scholarSearch.coverage || 'All';
      state.scholarDeadline = saved.scholarSearch.deadline || 'All';
      state.scholarSort = saved.scholarSearch.sort || 'name';
    }
  } catch (e) {
    localStorage.removeItem(key);
  }
}

function persistUiState() {
  const key = uiStateStorageKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify({
    compareIds: state.compareIds,
    fields: state.bookmarks.fields,
    unis: state.bookmarks.unis,
    schols: state.bookmarks.schols,
    uniSearch: {
      query: state.uniQuery,
      city: state.uniCity,
      sector: state.uniSector,
      program: state.uniProgram,
      entry: state.uniEntry,
      sort: state.uniSort,
    },
    scholarSearch: {
      query: state.scholarQuery,
      level: state.scholarLevel,
      region: state.scholarRegion,
      marks: state.scholarMarks,
      coverage: state.scholarCoverage,
      deadline: state.scholarDeadline,
      sort: state.scholarSort,
    },
  }));
}

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
  if (page === 'education') {
    page = 'dashboard';
    params = {};
  }
  state.page = page;
  state.params = params || {};
  state.mobileMenu = false;
  state.userMenuOpen = false;
  state.notifOpen = false;
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
function bookmarkList(type) {
  if (type === 'field') return state.bookmarks.fields;
  if (type === 'schol') return state.bookmarks.schols;
  return state.bookmarks.unis;
}
function isBm(type, id) { return bookmarkList(type).includes(id); }
function toggleBm(type, id) {
  if (!loggedIn()) { toast('Please log in first'); nav('login'); return; }
  const arr = bookmarkList(type);
  const i = arr.indexOf(id);
  if (i > -1) { arr.splice(i,1); toast('Removed'); } else { arr.push(id); toast('Saved', true); }
  persistUiState();
  render();
}
