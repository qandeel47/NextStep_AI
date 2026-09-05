function matchGrade(pct) {
  if (pct >= 85) return 'Excellent Match';
  if (pct >= 70) return 'Strong Match';
  if (pct >= 55) return 'Good Match';
  return 'Possible Match';
}

function fieldEmoji(field) {
  const name = `${field.name || ''} ${field.category || ''}`.toLowerCase();
  if (/artificial|ai/.test(name) && !/contain/.test(name)) return '🧠';
  if (/data/.test(name)) return '📊';
  if (/cyber|security/.test(name)) return '🛡️';
  if (/cloud/.test(name)) return '☁️';
  if (/software|computer|it/.test(name)) return '💼';
  if (/medic|health|mbbs|dent/.test(name)) return '🩺';
  if (/engineer/.test(name)) return '⚙️';
  if (/business|financ|account/.test(name)) return '📈';
  if (/law/.test(name)) return '⚖️';
  if (/psych|social/.test(name)) return '🧠';
  if (/design|art/.test(name)) return '🎨';
  return '🎯';
}

function uniInitials(name) {
  return String(name || 'U').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function uniMatchScore(u, topMatch) {
  const rel = Number(u.relevance || 0);
  return Math.max(55, Math.min(99, Math.round((topMatch || 70) - 4 + rel * 6)));
}

function openFieldRoadmap(id) {
  state.fieldTab = 'Careers';
  nav('fieldDetail', { id });
}

function pageRecs() {
  if (!state.quizComplete && Object.keys(state.academic.marks).length === 0) {
    return emptyState(
      'Recommendations are optional',
      'Add your marks and questionnaire answers for match percentages, or browse universities and fields now.',
      `<button class="btn btn-primary" onclick="nav('academic')">Start academic profile</button>
       <button class="btn btn-outline" onclick="nav('universities')">Browse universities</button>
       <button class="btn btn-outline" onclick="nav('fields')">Explore fields</button>`
    );
  }
  const recs = generateRecommendations();
  if (!recs.length) {
    return emptyState(
      'No recommendations available',
      'Career fields have not been loaded yet.',
      `<button class="btn btn-primary" onclick="apiLoadFields().then(render)">Try again</button>`
    );
  }
  const top = recs[0];
  const rest = recs.slice(1, 5);
  const scores = top.scores || { subject: 0, interest: 0, education: 0, market: 0 };
  const topIds = recs.slice(0, 3).map(f => f.id);
  const topCats = [...new Set(recs.slice(0, 3).map(f => f.category))];
  const unis = recommendedUnis(topIds).slice(0, 3);
  const schols = recommendedSchols(avgMarks(), topCats).slice(0, 3);
  const reasons = [
    ['🎓', 'Strong Academic Alignment', scores.subject >= 75 ? 'Your subject marks align closely with this field.' : 'Your academic profile is a workable fit for this field.'],
    ['❤️', 'High Interest Fit', scores.interest >= 75 ? 'Your questionnaire answers strongly match this career.' : 'Your interests overlap with the work this field requires.'],
    ['🎯', 'Great Education Fit', scores.education >= 75 ? 'Your current level and stream support this pathway.' : 'This path is reachable from your education background.'],
    ['📈', 'High Market Demand', scores.market >= 75 ? 'Demand and future outlook for this field are strong.' : 'This field has stable opportunities in the job market.'],
  ];
  const whyExtra = (top.reasons || []).slice(0, 2);

  return `
  <div class="recs-page">
    <div class="recs-head">
      <div>
        <h1>NextStep AI Career Recommendations</h1>
        <p>Personalized recommendations based on your profile, skills, and goals.</p>
      </div>
      <div class="recs-head-actions">
        <button class="btn btn-outline btn-sm" onclick="nav('questionnaire')">Retake questionnaire</button>
        <button class="btn btn-outline btn-sm" onclick="nav('academic')">Update profile</button>
      </div>
    </div>

    <div class="card recs-hero">
      <p class="recs-kicker">Top Career Recommendation</p>
      <div class="recs-hero-grid">
        <div class="recs-hero-main">
          <div class="recs-hero-top">
            <div class="recs-ring">
              ${ring(top.match, 128, 'Overall Match', '#0B1F4D')}
              <span class="badge badge-navy">${matchGrade(top.match)}</span>
            </div>
            <div>
              <div class="recs-field-ic">${fieldEmoji(top)}</div>
              <h2>${esc(top.name)}</h2>
              <p>${esc(top.desc || top.about || 'A strong match from your marks, interests, education and market demand.')}</p>
            </div>
          </div>
          <div class="recs-bars">
            ${[
              ['Subject Match', scores.subject],
              ['Interest Match', scores.interest],
              ['Education Fit', scores.education],
              ['Market Demand', scores.market],
            ].map(([label, value]) => `
              <div class="recs-bar">
                <span>${label}</span>
                <div class="progress"><div class="progress-fill recs-bar-fill" style="width:${value}%"></div></div>
                <b class="match-pct">${value}%</b>
              </div>`).join('')}
          </div>
          <div class="recs-actions">
            <button class="btn btn-primary" onclick="nav('fieldDetail',{id:${top.id}})">Explore Field</button>
            <button class="btn btn-outline" onclick="openFieldRoadmap(${top.id})">View Roadmap</button>
            <button class="btn btn-outline" onclick="nav('counselor')">Ask AI Counselor</button>
            <button class="btn btn-ghost btn-sm" onclick="toggleBm('field',${top.id})">${isBm('field',top.id)?'Saved':'Save'}</button>
          </div>
        </div>
        <aside class="recs-why">
          <h3>Why this is a great match</h3>
          ${reasons.map(([emoji, title, text]) => `
            <div class="recs-why-item">
              <span>${emoji}</span>
              <div><strong>${title}</strong><p>${esc(text)}</p></div>
            </div>`).join('')}
          ${whyExtra.length ? whyExtra.map((r) => `<p class="helper">${esc(r)}</p>`).join('') : ''}
        </aside>
      </div>
    </div>

    <h3 class="recs-section-title">Alternative career recommendations</h3>
    <div class="recs-alts">
      ${rest.map((f) => `<div class="card recs-alt">
        <div class="recs-field-ic">${fieldEmoji(f)}</div>
        <h4>${esc(f.name)}</h4>
        <p>${esc((f.desc || '').slice(0, 90))}${(f.desc || '').length > 90 ? '…' : ''}</p>
        <p class="match-pct recs-alt-pct">${f.match}% Match</p>
        <button class="btn btn-outline btn-block" onclick="nav('fieldDetail',{id:${f.id}})">Explore Field</button>
      </div>`).join('')}
    </div>

    <div class="recs-bottom">
      <section class="card">
        <div class="recs-list-head">
          <h3>Recommended Universities</h3>
          <button class="btn btn-ghost btn-sm" onclick="nav('universities')">View All</button>
        </div>
        ${unis.length ? unis.map((u) => {
          const score = uniMatchScore(u, top.match);
          return `<div class="recs-row clickable-card" onclick="nav('uniDetail',{id:${u.id}})">
            <span class="recs-logo">${uniBrand(u)}</span>
            <div>
              <strong>${esc(u.name)}</strong>
              <p>${esc(u.city || '')}${u.city && u.sector ? ' · ' : ''}${esc(u.sector || '')}</p>
            </div>
            <span class="badge ${score >= 80 ? 'badge-navy' : 'badge-soft'}">${score >= 80 ? 'Strong Match' : 'Good Match'}</span>
            <span class="match-pct">${score}% Match</span>
          </div>`;
        }).join('') : '<p class="helper">Browse all universities while we match programs to your fields.</p>'}
      </section>
      <section class="card">
        <div class="recs-list-head">
          <h3>Recommended Scholarships</h3>
          <button class="btn btn-ghost btn-sm" onclick="nav('scholarships')">View All</button>
        </div>
        ${schols.length ? schols.map((s) => `
          <div class="recs-row clickable-card" onclick="nav('scholDetail',{id:${s.id}})">
            <span class="recs-logo">${typeof scholLogoHtml === 'function' ? scholLogoHtml(s) : esc((s.provider || 'G').slice(0, 1).toUpperCase())}</span>
            <div>
              <strong>${esc(s.name)}</strong>
              <p>${esc((s.eligibility || s.level || '').slice(0, 72))}${(s.eligibility || '').length > 72 ? '…' : ''}</p>
            </div>
            <span class="recs-award">${esc(s.coverage || s.deadline || 'View details')}</span>
          </div>`).join('') : '<p class="helper">No scholarships matched yet. Browse all government schemes.</p>'}
      </section>
    </div>
  </div>`;
}
