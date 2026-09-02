const API_BASE = 'http://127.0.0.1:8000';

function mapApiQuestions(rows) {
  return rows.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.question_type,
    hint: q.hint || '',
    min: q.min_select != null ? q.min_select : (q.question_type === 'multi' ? 2 : 1),
    max: q.max_select != null ? q.max_select : (q.question_type === 'multi' ? 3 : 1),
    options: (q.options || []).map((o) => ({ id: o.id, l: o.label, t: o.tag || '' })),
  }));
}

function apiErrorMessage(data) {
  if (!data) return 'Request failed.';
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) return data.non_field_errors[0];
  const firstKey = Object.keys(data)[0];
  if (!firstKey) return 'Request failed.';
  const val = data[firstKey];
  if (Array.isArray(val)) return val[0];
  if (typeof val === 'string') return val;
  return 'Request failed.';
}

function getToken() {
  return state.access || localStorage.getItem('ns_access') || '';
}

function authHeaders(json = true) {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function setSession(payload) {
  if (payload.access) {
    state.access = payload.access;
    localStorage.setItem('ns_access', payload.access);
  }
  if (payload.refresh) {
    state.refresh = payload.refresh;
    localStorage.setItem('ns_refresh', payload.refresh);
  }
  if (payload.user) {
    state.user = {
      ...payload.user,
      name: payload.user.name || payload.user.full_name || payload.user.username || 'Student',
    };
    localStorage.setItem('ns_user', JSON.stringify(state.user));
  }
}

function hydrateSessionFromStorage() {
  const access = localStorage.getItem('ns_access');
  const refresh = localStorage.getItem('ns_refresh');
  const userRaw = localStorage.getItem('ns_user');
  if (access) state.access = access;
  if (refresh) state.refresh = refresh;
  if (userRaw) {
    try { state.user = JSON.parse(userRaw); } catch (e) { state.user = null; }
  }
}

function restoreLastPage() {
  if (!loggedIn()) return;
  const saved = localStorage.getItem('ns_page');
  if (!saved || ['login', 'register', 'landing'].includes(saved)) {
    state.page = 'dashboard';
    return;
  }
  state.page = saved;
  try { state.params = JSON.parse(localStorage.getItem('ns_params') || '{}'); } catch (e) { state.params = {}; }
}

async function refreshAccessToken() {
  const refresh = state.refresh || localStorage.getItem('ns_refresh');
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.access) return false;
    setSession({ access: data.access, refresh: data.refresh || refresh });
    return true;
  } catch (e) {
    return false;
  }
}

function clearSession() {
  state.access = '';
  state.refresh = '';
  state.user = null;
  state.academic = { level: '', background: '', marks: {} };
  state.quizStep = 0;
  state.quizAnswers = {};
  state.quizOptionIds = {};
  state.quizComplete = false;
  state.apiRecs = [];
  UNIS = [];
  SCHOLS = [];
  state.unisStatus = 'idle';
  state.scholsStatus = 'idle';
  if (typeof GUEST_PAGES !== 'undefined' && !GUEST_PAGES.includes(state.page)) {
    state.page = 'landing';
    state.params = {};
  }
  localStorage.removeItem('ns_access');
  localStorage.removeItem('ns_refresh');
  localStorage.removeItem('ns_user');
  localStorage.removeItem('ns_page');
  localStorage.removeItem('ns_params');
}

async function loadAuthenticatedAppData() {
  if (!getToken()) return;
  await loadQuestionsFromApi();
  await apiLoadFields();
  await apiLoadUniversities();
  await apiLoadScholarships();
}

async function apiRequest(path, options = {}, retried = false) {
  const res = await fetch(`${API_BASE}${path}`, options);
  let data = {};
  try { data = await res.json(); } catch (e) { data = {}; }
  if (res.status === 401 && !retried && !path.includes('/api/login') && !path.includes('/api/register') && !path.includes('/api/token/')) {
    const ok = await refreshAccessToken();
    if (ok) {
      const headers = { ...(options.headers || {}), ...authHeaders(!!(options.headers && options.headers['Content-Type'])) };
      return apiRequest(path, { ...options, headers }, true);
    }
  }
  if (res.status === 401 && getToken() && !path.includes('/api/login') && !path.includes('/api/register') && !path.includes('/api/token/')) {
    clearSession();
  }
  if (!res.ok) {
    const err = new Error(apiErrorMessage(data));
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function asList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

async function loadQuestionsFromApi() {
  try {
    const data = await apiRequest('/api/questions/');
    const mapped = mapApiQuestions(asList(data));
    if (mapped.length) QUESTIONS = mapped;
  } catch (err) {
    /* Keep local questions if the API is unavailable */
  }
}

function mapApiField(f) {
  return {
    id: f.id,
    name: f.name,
    category: f.category,
    requiredSubjects: f.requiredSubjects || [],
    preferredLevels: f.preferredLevels || [],
    interestTags: f.interestTags || [],
    market: f.market,
    future: f.future,
    demandLabel: f.demandLabel,
    duration: f.duration,
    desc: f.desc,
    about: f.about,
    learn: f.learn || [],
    skills: f.skills || [],
    careers: f.careers || [],
    minBackground: f.minBackground || [],
    scores: f.scores,
    match: f.match,
    reasons: (f.scores && f.scores.reasons) || f.reasons || [],
  };
}

async function apiLoadFields() {
  try {
    const rows = asList(await apiRequest('/api/fields/'));
    if (rows.length) {
      FIELDS = rows.map(mapApiField);
    }
  } catch (err) {
    /* Keep local fields if the API is unavailable */
  }
}

function mapSector(sector) {
  if (sector === 'Public') return 'Government';
  return sector || '';
}

function fieldIdsFromPrograms(programsText) {
  const text = String(programsText || '').toLowerCase();
  if (!text) return [];
  return FIELDS.filter((f) => {
    const name = (f.name || '').toLowerCase();
    const cat = (f.category || '').toLowerCase();
    return (name && text.includes(name)) || (cat && text.includes(cat));
  }).map((f) => f.id);
}

function mapApiUniversity(u) {
  const programsText = u.programs || '';
  const programNames = programsText.split(',').map((p) => p.trim()).filter(Boolean);
  const website = u.website || '';
  return {
    id: u.id,
    name: u.name,
    city: [u.city, u.province].filter(Boolean).join(', '),
    sector: mapSector(u.sector),
    entry: u.entry_tests || '—',
    ranking: u.province || '—',
    students: '—',
    website,
    about: u.admission_criteria || u.merit_formula || '',
    programs: programNames.map((name) => ({ name, fieldIds: fieldIdsFromPrograms(name) })),
    fieldIds: fieldIdsFromPrograms(programsText),
    scholarships: u.scholarships || '',
    contact: u.contact || '',
    intake: u.admission_intake || '',
  };
}

async function fetchAllPages(path) {
  const first = await apiRequest(path);
  if (Array.isArray(first)) return first;
  const rows = asList(first);
  let next = first && first.next;
  while (next) {
    const url = String(next);
    const res = await fetch(url.startsWith('http') ? url : `${API_BASE}${url}`, { headers: authHeaders(false) });
    const data = await res.json();
    if (!res.ok) break;
    rows.push(...asList(data));
    next = data.next;
  }
  return rows;
}

async function apiLoadUniversities() {
  state.unisStatus = 'loading';
  state.unisError = '';
  UNIS = [];
  try {
    const rows = await fetchAllPages('/api/universities/');
    UNIS = rows.map(mapApiUniversity);
    state.unisStatus = UNIS.length ? 'ok' : 'empty';
  } catch (err) {
    UNIS = [];
    state.unisStatus = 'error';
    state.unisError = err.message || 'Could not load universities from the server.';
  }
}

function mapApiScholarship(s) {
  const fieldText = s.field_of_study || '';
  const openField = /any|not field restricted/i.test(fieldText);
  return {
    id: s.id,
    name: s.name,
    type: 'Government',
    provider: s.provider || '',
    website: s.website || '',
    level: s.education_level || '',
    province: s.province || '',
    fieldOfStudy: fieldText,
    eligibility: s.eligibility || '',
    coverage: s.coverage || '',
    documents: s.required_documents || '',
    deadline: s.application_deadline || '—',
    process: s.application_process || '',
    contact: s.contact || '',
    sourceUrl: s.source_url || '',
    minMarks: s.min_marks || 0,
    fieldCategories: openField ? ['All'] : fieldText.split(',').map((x) => x.trim()).filter(Boolean),
  };
}

async function apiLoadScholarships() {
  state.scholsStatus = 'loading';
  state.scholsError = '';
  SCHOLS = [];
  try {
    const rows = await fetchAllPages('/api/scholarships/');
    SCHOLS = rows.map(mapApiScholarship);
    state.scholsStatus = SCHOLS.length ? 'ok' : 'empty';
  } catch (err) {
    SCHOLS = [];
    state.scholsStatus = 'error';
    state.scholsError = err.message || 'Could not load scholarships from the server.';
  }
}

async function apiLoadRecommendations() {
  if (!getToken()) {
    state.apiRecs = [];
    return;
  }
  try {
    const data = await apiRequest('/api/recommendations/', { headers: authHeaders(false) });
    state.apiRecs = (data.results || []).map(mapApiField);
  } catch (err) {
    state.apiRecs = [];
  }
}

async function apiRegister({ fullName, email, password }) {
  const data = await apiRequest('/api/register/', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      full_name: fullName,
      email,
      password,
      confirm_password: password,
    }),
  });
  setSession(data);
  return data;
}

async function apiLogin({ email, password }) {
  const data = await apiRequest('/api/login/', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  setSession(data);
  return data;
}

async function apiLogout() {
  const refresh = state.refresh || localStorage.getItem('ns_refresh');
  if (refresh) {
    try {
      await apiRequest('/api/logout/', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ refresh }),
      });
    } catch (e) { /* still clear local session */ }
  }
  clearSession();
}

async function apiSaveProfile(payload) {
  return apiRequest('/api/profile/', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

async function apiLoadProfile() {
  const data = await apiRequest('/api/profile/', { headers: authHeaders(false) });
  state.academic = {
    level: data.level || '',
    background: data.background || '',
    marks: data.marks || {},
  };
}

async function apiSaveAnswers() {
  const answers = QUESTIONS.map((q) => {
    const ids = state.quizOptionIds[q.id];
    const optionIds = Array.isArray(ids) ? ids.filter(Boolean) : (ids ? [ids] : []);
    return { question: q.id, option_ids: optionIds };
  }).filter((item) => item.option_ids.length);
  if (!answers.length || answers.length !== QUESTIONS.length) {
    throw new Error('Every question is compulsory. Complete all 10 questions.');
  }
  await apiRequest('/api/questionnaire/answers/', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ answers }),
  });
}

async function apiLoadAnswers() {
  const data = await apiRequest('/api/questionnaire/answers/', { headers: authHeaders(false) });
  state.quizAnswers = {};
  state.quizOptionIds = {};
  (data.answers || []).forEach((item) => {
    const tags = (item.options || []).map((o) => o.tag || o.label).filter(Boolean);
    const ids = (item.options || []).map((o) => o.id);
    const question = QUESTIONS.find((q) => q.id === item.question);
    if (question && question.type === 'multi') {
      state.quizAnswers[item.question] = tags;
      state.quizOptionIds[item.question] = ids;
    } else {
      state.quizAnswers[item.question] = tags[0] || '';
      state.quizOptionIds[item.question] = ids[0] || null;
    }
  });
  state.quizComplete = !!data.is_complete;
}

async function restoreSession() {
  hydrateSessionFromStorage();
  if (!getToken()) return;
  try {
    const me = await apiRequest('/api/me/', { headers: authHeaders(false) });
    setSession({ user: me });
    await apiLoadProfile();
    await apiLoadAnswers();
    await apiLoadRecommendations();
  } catch (e) {
    if (e.status === 401) {
      const ok = await refreshAccessToken();
      if (ok) {
        try {
          const me = await apiRequest('/api/me/', { headers: authHeaders(false) });
          setSession({ user: me });
          await apiLoadProfile();
          await apiLoadAnswers();
          await apiLoadRecommendations();
          return;
        } catch (err) { /* fall through */ }
      }
      clearSession();
    }
  }
}
