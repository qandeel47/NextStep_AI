function dashToday() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
function dashProfileLabel(pct) {
  if (pct >= 100) return 'Profile complete';
  if (pct >= 70) return 'Almost there!';
  if (pct >= 30) return 'Keep going';
  if (pct > 0) return 'Just started';
  return 'No data yet';
}
function dashSavedCityHint(unis) {
  if (!unis.length) return 'Save universities to shortlist';
  const counts = {};
  unis.forEach((u) => {
    const city = String(u.cityName || u.city || 'Pakistan').trim() || 'Pakistan';
    counts[city] = (counts[city] || 0) + 1;
  });
  return Object.entries(counts).slice(0, 2).map(([city, n]) => `${n} in ${city}`).join(' · ');
}
function dashMatchLabel(score) {
  if (score >= 80) return 'High match';
  if (score >= 60) return 'Good match';
  return 'Possible match';
}
function dashSparkline(field) {
  const scores = field.scores || {};
  const pts = [
    Number(scores.subject),
    Number(scores.interest),
    Number(scores.education),
    Number(scores.market),
    Number(field.match),
  ].map((n) => (Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : Number(field.match) || 0));
  const w = 220;
  const h = 40;
  const pad = 4;
  const step = (w - pad * 2) / Math.max(1, pts.length - 1);
  const coords = pts.map((n, i) => {
    const x = pad + i * step;
    const y = h - pad - (n / 100) * (h - pad * 2);
    return [x.toFixed(1), y.toFixed(1)];
  });
  const line = coords.map((p) => p.join(',')).join(' ');
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
  const dots = coords.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#0B1F4D"></circle>`).join('');
  return `<svg class="dash-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <polygon points="${area}" fill="rgba(11,31,77,.10)"></polygon>
    <polyline points="${line}" fill="none" stroke="#0B1F4D" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></polyline>
    ${dots}
  </svg>`;
}

function pageDashboard() {
  const recs = generateRecommendations().slice(0, 4);
  const top = recs[0];
  const pct = profileCompletion();
  const ready = hasGuidanceData();
  const first = displayName().split(' ')[0];
  const savedUnis = (typeof UNIS !== 'undefined' ? UNIS : []).filter((u) => state.bookmarks.unis.includes(u.id));
  const savedSchols = (typeof SCHOLS !== 'undefined' ? SCHOLS : []).filter((s) => (state.bookmarks.schols || []).includes(s.id));
  const recUnis = ready
    ? recommendedUnis(recs.slice(0, 3).map((f) => f.id)).slice(0, 4)
    : [];
  const openSchols = (typeof SCHOLS !== 'undefined' ? SCHOLS : []).filter((s) => !/closed/i.test(s.deadline || ''));
  const featuredSchol = openSchols[0] || (typeof SCHOLS !== 'undefined' ? SCHOLS[0] : null);
  const nextSteps = [
    ['academic', 'academic', 'Complete academic profile', 'Add level, background and marks for better matches.', state.academic.level && filledMarksCount() >= 2, 'Continue', 'Review'],
    ['questionnaire', 'quiz', 'Finish the questionnaire', 'Your interests power career match scores.', state.quizComplete, 'Continue', 'Review'],
    ['universities', 'unis', 'Explore universities', 'Search, filter and save programs you like.', savedUnis.length > 0, 'Browse', 'Check'],
    ['scholarships', 'scholarships', 'Check scholarships', 'See government schemes that fit your profile.', savedSchols.length > 0, 'Browse', 'Check'],
  ];
  const activity = [];
  if (state.academic.level || filledMarksCount()) activity.push(['Academic profile updated', 'From your saved profile']);
  if (state.quizComplete) activity.push(['Questionnaire completed', 'Used for career matching']);
  if (savedUnis.length) activity.push([`${savedUnis.length} universit${savedUnis.length === 1 ? 'y' : 'ies'} saved`, 'In your shortlist']);
  if (savedSchols.length) activity.push([`${savedSchols.length} scholarship${savedSchols.length === 1 ? '' : 's'} saved`, 'In your saved list']);

  return `<div class="dash">
    <div class="dash-welcome">
      <div>
        <h1>Welcome back, ${esc(first)}</h1>
        <p>Choose guidance or explore independently.</p>
      </div>
      <p class="dash-date">${esc(dashToday())}</p>
    </div>

    <div class="dash-metrics">
      <div class="card dash-metric">
        <div class="dash-metric-copy">
          <div class="k">Profile completion</div>
          <strong>${dashProfileLabel(pct)}</strong>
          <button type="button" class="dash-link" onclick="nav('academic')">${pct >= 100 ? 'View profile →' : 'Complete now →'}</button>
        </div>
        ${ring(pct, 76, '')}
      </div>
      <div class="card dash-metric">
        <div class="dash-metric-copy">
          <div class="k">Top recommendation</div>
          <strong>${ready && top ? esc(top.name) : 'Not yet'}</strong>
          <span class="hint">${ready && top ? `${Number(top.match)}% match` : 'Add profile data to unlock'}</span>
          <button type="button" class="dash-link" onclick="nav('${ready && top ? 'recommendations' : 'academic'}')">${ready && top ? 'View match →' : 'Start profile →'}</button>
        </div>
        ${ready && top ? ring(Number(top.match) || 0, 76, '') : ring(0, 76, '')}
      </div>
      <div class="card dash-metric">
        <div class="dash-metric-ic">${navIcon('unis')}</div>
        <div class="dash-metric-copy">
          <div class="k">Universities shortlisted</div>
          <div class="dash-metric-num">${savedUnis.length}</div>
          <span class="hint">${esc(dashSavedCityHint(savedUnis))}</span>
        </div>
      </div>
      <div class="card dash-metric">
        <div class="dash-metric-ic">${navIcon('scholarships')}</div>
        <div class="dash-metric-copy">
          <div class="k">Scholarships found</div>
          <div class="dash-metric-num">${typeof SCHOLS !== 'undefined' ? SCHOLS.length : 0}</div>
          <span class="hint">Government schemes in the database</span>
        </div>
      </div>
    </div>

    <div class="card dash-matches">
      <div class="dash-card-head">
        <h3>Top career matches</h3>
        <button type="button" class="dash-link" onclick="nav('${ready ? 'recommendations' : 'fields'}')">View all careers →</button>
      </div>
      ${ready
        ? recs.slice(0, 3).map((f, i) => `
          <button type="button" class="dash-match" onclick="nav('fieldDetail',{id:${f.id}})">
            <span class="dash-match-rank">${i + 1}</span>
            <div class="dash-match-copy">
              <strong>${esc(f.name)}</strong>
              <span>${dashMatchLabel(f.match)}</span>
            </div>
            ${dashSparkline(f)}
            ${ring(Number(f.match) || 0, 56, '')}
          </button>`).join('')
        : `<p class="helper">Complete your academic profile and questionnaire to see ranked career matches.</p>
           <button type="button" class="btn btn-primary btn-sm" onclick="nav('academic')">Start academic profile</button>`}
    </div>

    <div class="card">
      <div class="dash-card-head">
        <h3>Your next steps</h3>
        <button type="button" class="dash-link" onclick="nav('academic')">View all tasks →</button>
      </div>
      ${nextSteps.map(([page, ic, title, desc, done, go, doneLabel]) => `
        <div class="dash-task">
          <span class="dash-task-ic">${navIcon(ic)}</span>
          <div>
            <strong>${title}</strong>
            <p>${desc}</p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="nav('${page}')">${done ? doneLabel : go}</button>
        </div>`).join('')}
    </div>

    <div class="dash-bottom">
      <div class="card">
        <div class="dash-card-head">
          <h3>Recommended universities</h3>
          <button type="button" class="dash-link" onclick="nav('universities')">View all →</button>
        </div>
        ${recUnis.length
          ? recUnis.map((u) => `
            <div class="dash-uni" onclick="nav('uniDetail',{id:${u.id}})">
              <span class="recs-logo">${uniBrand(u)}</span>
              <div>
                <strong>${esc(uniShortName(u.name))}</strong>
                <p>${esc(u.city || '')}${u.city && u.sector ? ' · ' : ''}${esc(u.sector || '')}</p>
              </div>
              <button type="button" class="uni-save ${isBm('uni', u.id) ? 'is-on' : ''}" onclick="event.stopPropagation(); toggleBm('uni', ${u.id})" aria-label="Save">${navIcon('saved')}</button>
            </div>`).join('')
          : `<p class="helper">${ready ? 'No linked universities yet. Browse the full list.' : 'Add your profile to see recommended universities, or browse now.'}</p>
             <button type="button" class="btn btn-outline btn-sm" onclick="nav('universities')">Browse universities</button>`}
      </div>
      <div class="card">
        <div class="dash-card-head">
          <h3>Upcoming scholarship</h3>
          <button type="button" class="dash-link" onclick="nav('scholarships')">View all →</button>
        </div>
        ${featuredSchol
          ? `<div class="dash-schol" onclick="nav('scholDetail',{id:${featuredSchol.id}})">
              ${typeof scholLogoHtml === 'function' ? scholLogoHtml(featuredSchol) : ''}
              <div>
                <strong>${esc(featuredSchol.name)}</strong>
                <p>${esc(featuredSchol.provider)}</p>
                <span class="dash-deadline">${esc(featuredSchol.deadline || 'See official site')}</span>
              </div>
            </div>`
          : `<p class="helper">Scholarships will appear here after they load from the database.</p>`}
      </div>
      <div class="card">
        <div class="dash-card-head">
          <h3>Activity</h3>
        </div>
        ${activity.length
          ? activity.map(([title, sub]) => `
            <div class="dash-activity">
              <span class="dash-dot"></span>
              <div>
                <strong>${esc(title)}</strong>
                <p>${esc(sub)}</p>
              </div>
            </div>`).join('')
          : `<p class="helper">Your profile updates and saved items will show up here.</p>`}
      </div>
    </div>
  </div>`;
}
