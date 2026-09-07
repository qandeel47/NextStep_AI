/* ===== FIELD DETAIL ===== */

function fieldBulletList(items, emptyText) {
  const list = (items || []).filter(Boolean);
  if (!list.length) return `<p class="field-empty">${esc(emptyText || 'Details coming soon.')}</p>`;
  return `<ul class="field-bullets">${list.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
}

function fieldScoreMeter(label, value, max = 10) {
  const n = Number(value);
  const safe = Number.isFinite(n) ? Math.max(0, Math.min(max, n)) : 0;
  const pct = Math.round((safe / max) * 100);
  return `<div class="field-meter">
    <div class="field-meter-top"><span>${esc(label)}</span><strong>${safe}/${max}</strong></div>
    <div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>
  </div>`;
}

function personalizedRoadmapIntro(field) {
  const level = (state.academic && state.academic.level) || '';
  const stream = (state.academic && state.academic.background) || '';
  const name = displayName().split(' ')[0] || 'Student';
  const fieldName = field.name || 'this field';
  if (!level && !stream) {
    return `Complete your Academic Profile so we can tune this ${fieldName} roadmap to your current stage.`;
  }
  const bits = [];
  if (level) bits.push(`you are at <strong>${esc(level)}</strong>`);
  if (stream) bits.push(`stream <strong>${esc(stream)}</strong>`);
  let focus = 'Focus on the first roadmap stage that matches where you are now.';
  if (/matric/i.test(level) || /o-level/i.test(level)) {
    focus = 'Your near-term priority is choosing Intermediate subjects and keeping foundation marks strong.';
  } else if (/intermediate|a-level/i.test(level)) {
    if (/pre-med/i.test(stream) && /medicine|dentistry|pharmacy|nursing|surgery|physio|radiology|nutrition|laboratory/i.test(fieldName)) {
      focus = 'Prioritize MDCAT (or related) prep and protect Biology/Chemistry/Physics marks.';
    } else if (/pre-eng|ics/i.test(stream) && /engineer|computer|software|data|cyber|ai|cloud|web|mobile|game/i.test(fieldName)) {
      focus = 'Prioritize entry-test prep (NET/ECAT/NAT as relevant) and keep Maths/CS strong.';
    } else if (/commerce/i.test(stream)) {
      focus = 'Use Accounting/Economics strength and prepare any aptitude tests for business programs.';
    } else {
      focus = 'Shortlist universities now and map entry tests/merit formulas for this field.';
    }
  }
  return `Hi ${esc(name)} — based on ${bits.join(' and ')}, here is your personalized study roadmap for <strong>${esc(fieldName)}</strong>. ${focus}`;
}

function personalizedRoadmapSteps(field) {
  return Array.isArray(field.studyRoadmap) ? field.studyRoadmap.slice(0, 5) : [];
}

function roadmapIconSvg(icon) {
  const icons = {
    degree: '<path d="M4 9.5 12 5l8 4.5-8 4.5L4 9.5z"/><path d="M7 12.2v4.2c0 .4 2.2 2.4 5 2.4s5-2 5-2.4v-4.2"/>',
    skills: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M4.2 6.2l1.4 1.4M18.4 16.4l1.4 1.4M3 12h2M19 12h2M4.2 17.8l1.4-1.4M18.4 7.6l1.4-1.4"/>',
    study: '<path d="M5 5h14v12H5z"/><path d="M8 9h8M8 12h6"/><path d="M9 17v2h6v-2"/>',
    jobs: '<path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><rect x="4" y="8" width="16" height="11" rx="2"/><path d="M4 13h16"/>',
    masters: '<path d="M12 4 4 8l8 4 8-4-8-4z"/><path d="M6 10.5V15c2 1.5 10 1.5 12 0v-4.5"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[icon] || icons.study}</svg>`;
}

function pageField() {
  const recs = generateRecommendations();
  const base = FIELDS.find(x => x.id == state.params.id) || FIELDS[0];
  if (!base) {
    return emptyState('Field not found', 'Career fields have not loaded yet.', `<button class="btn btn-primary" onclick="apiLoadFields().then(render)">Try again</button>`);
  }
  const f = recs.find(x => x.id == state.params.id) || scoreField(base);
  const scores = f.scores || { subject: 0, interest: 0, education: 0, market: 0 };
  const tab = state.fieldTab || 'Overview';
  const tabs = ['Overview', 'Roadmap', 'Market & Future', 'Careers', 'Skills', 'Risks', 'Universities'];
  let body = '';

  if (tab === 'Overview') {
    body = `<div class="field-detail-grid">
      <div class="card field-section">
        <h4>About this field</h4>
        <p class="field-prose">${esc(f.about || f.desc || 'No overview available yet.')}</p>
        ${f.fieldValue ? `<h4 class="field-subhead">Why this field is valuable</h4><p class="field-prose">${esc(f.fieldValue)}</p>` : ''}
        <div class="kv"><span class="k">Required subjects</span><span class="v">${(f.requiredSubjects || []).join(', ') || '—'}</span></div>
        <div class="kv"><span class="k">Preferred levels</span><span class="v">${(f.preferredLevels || []).join(', ') || '—'}</span></div>
        <div class="kv"><span class="k">Min background</span><span class="v">${(f.minBackground || []).join(' / ') || '—'}</span></div>
        <div class="kv"><span class="k">Typical duration</span><span class="v">${esc(f.duration || '—')}</span></div>
        <div class="kv"><span class="k">Demand label</span><span class="v">${esc(f.demandLabel || '—')}</span></div>
      </div>
      <div class="card field-section">
        <h4>What you typically learn</h4>
        ${fieldBulletList(f.learn, 'Curriculum topics will appear here once loaded from the server.')}
        <h4 class="field-subhead">Your match breakdown</h4>
        ${hasGuidanceData()
          ? [['Subject Match', scores.subject, 'From intermediate marks'], ['Interest Match', scores.interest, 'From questionnaire tags'], ['Education Fit', scores.education, 'Level vs preferred'], ['Market & Future', scores.market, 'Field demand scores']].map(([l, v, h]) =>
            `<div class="field-match-row"><div class="field-match-top"><span>${l}</span>${matchPct(v)}</div>
             <div class="progress"><div class="progress-fill" style="width:${v}%"></div></div>
             <p class="field-match-hint">${h}</p></div>`).join('')
          : `<p class="field-prose">Complete your academic profile and questionnaire to see a match breakdown.</p>
             <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="nav('academic')">Add profile</button>`}
      </div>
    </div>`;
  } else if (tab === 'Roadmap') {
    const roadmap = personalizedRoadmapSteps(f);
    // Colors matched to the design roadmap palette
    const colors = ['#98B0A1', '#8DA7BE', '#6B667C', '#C65D6B', '#F68A73'];
    body = `<div class="roadmap-board">
      <div class="roadmap-hero">
        <p class="roadmap-kicker">Career roadmap</p>
        <h3>${esc(f.name)}</h3>
        <p class="roadmap-hero-copy">${personalizedRoadmapIntro(f)}</p>
        ${!(state.academic && state.academic.level)
          ? `<button class="btn btn-outline btn-sm" style="margin-top:12px;background:#fff;color:#0b6799;border-color:rgba(255,255,255,.55);" onclick="nav('academic')">Complete Academic Profile</button>`
          : ''}
      </div>
      <div class="roadmap-path">
        ${roadmap.length ? roadmap.map((step, i) => {
          const side = i % 2 === 0 ? 'left' : 'right';
          const num = String(i + 1).padStart(2, '0');
          const color = colors[i % colors.length];
          return `<div class="roadmap-node is-${side}" style="--rm:${color}">
            <div class="roadmap-rail">
              <span class="roadmap-num">${num}</span>
              ${i < roadmap.length - 1 ? '<span class="roadmap-arrow" aria-hidden="true">↓</span>' : '<span class="roadmap-done" aria-hidden="true">✓</span>'}
            </div>
            <div class="roadmap-card">
              <div class="roadmap-icon">${roadmapIconSvg(step.icon || 'study')}</div>
              <div>
                <div class="roadmap-phase">${esc(step.title || step.phase || 'Stage')}</div>
                <p class="roadmap-detail">${esc(step.detail || '')}</p>
              </div>
            </div>
          </div>`;
        }).join('') : '<p class="field-empty">Roadmap will appear here once loaded from the backend.</p>'}
      </div>
    </div>`;
  } else if (tab === 'Market & Future') {
    body = `<div class="field-detail-grid">
      <div class="card field-section">
        <h4>Market demand</h4>
        <p class="field-prose">${esc(f.marketOutlook || 'Market demand details will appear here from the backend.')}</p>
        ${fieldScoreMeter('Current market score', f.market)}
      </div>
      <div class="card field-section">
        <h4>Future outlook</h4>
        <p class="field-prose">${esc(f.futureOutlook || 'Future outlook details will appear here from the backend.')}</p>
        ${fieldScoreMeter('Future potential score', f.future)}
      </div>
      <div class="card field-section field-section-wide">
        <h4>Value of this career</h4>
        <p class="field-prose">${esc(f.fieldValue || 'Value summary will appear here from the backend.')}</p>
      </div>
    </div>`;
  } else if (tab === 'Careers') {
    body = `<div class="field-detail-grid">
      <div class="card field-section">
        <h4>Career paths / job titles</h4>
        ${fieldBulletList(f.careers, 'Career titles will appear here from the backend.')}
      </div>
      <div class="card field-section">
        <h4>Where graduates work</h4>
        ${fieldBulletList(f.jobTypes, 'Job settings will appear here from the backend.')}
      </div>
      <div class="card field-section field-section-wide">
        <h4>Career opportunities</h4>
        ${fieldBulletList(f.opportunities, 'Opportunity details will appear here from the backend.')}
      </div>
    </div>`;
  } else if (tab === 'Skills') {
    body = `<div class="card field-section">
      <h4>Required & recommended skills</h4>
      <p class="field-prose">These are the skills employers and degree programs typically expect in this field.</p>
      <div class="field-skill-wrap">${(f.skills || []).length
        ? (f.skills || []).map((s) => `<span class="tag">${esc(s)}</span>`).join('')
        : '<p class="field-empty">Skills will appear here from the backend.</p>'}</div>
      ${(f.learn || []).length ? `<h4 class="field-subhead">Related learning areas</h4>${fieldBulletList(f.learn)}` : ''}
    </div>`;
  } else if (tab === 'Risks') {
    body = `<div class="card field-section">
      <h4>Risks & challenges to consider</h4>
      <p class="field-prose">Every field has trade-offs. Review these before committing so your plan stays realistic.</p>
      ${fieldBulletList(f.risks, 'Risk notes will appear here from the backend.')}
    </div>`;
  } else {
    const related = UNIS.filter(u => (u.fieldIds || []).includes(f.id));
    body = related.length ? `<div class="grid g2">${related.map(u => `<div class="card clickable-card" style="cursor:pointer;" onclick="nav('uniDetail',{id:${u.id}})">
      <div class="uni-detail-hero" style="margin-bottom:8px;"><div class="uni-brand">${uniBrand(u)}</div><div><h4>${esc(uniShortName(u.name))}</h4><p style="font-size:12.5px;color:var(--muted);">${esc(u.city)}</p></div></div>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;" onclick="event.stopPropagation()">
        <button class="btn btn-outline btn-sm" onclick="nav('uniDetail',{id:${u.id}})">View details</button>
        ${extLink(u.website, 'Official website', false)}
      </div></div>`).join('')}</div>`
      : `<div class="empty">No universities in the database match this field yet.</div>`;
  }

  return `<a class="back" onclick="nav('fields')">← Back to fields</a>
  <div class="grid g3" style="margin-bottom:18px;">
    <div class="card col-2">
      <span class="badge badge-navy">${esc(f.category)}</span>
      <h2 style="font-size:24px;margin:8px 0 6px;">${esc(f.name)}</h2>
      <p style="color:var(--muted);max-width:540px;">${esc(f.desc)}</p>
      <span class="badge badge-navy">${esc(f.demandLabel || '')}</span>
      <span class="badge badge-soft" style="margin-left:6px;">${esc(f.duration || '')}</span>
    </div>
    <div class="card" style="text-align:center;">
      ${hasGuidanceData() ? ring(f.match, 100) : '<p style="color:var(--muted);font-size:13px;margin-bottom:12px;">Add your profile to see a match percentage.</p>'}
      <button class="btn btn-outline btn-sm" style="margin-top:12px;" onclick="toggleBm('field',${f.id})">${isBm('field', f.id) ? 'Saved' : 'Save'}</button>
    </div>
  </div>
  <div class="tabs">${tabs.map(t => `<button class="tab ${t === tab ? 'active' : ''}" onclick="state.fieldTab='${t}';nav('fieldDetail',{id:${f.id}})">${t}</button>`).join('')}</div>
  ${body}`;
}
