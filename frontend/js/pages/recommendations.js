/* ===== RECOMMENDATIONS ===== */
function pageRecs() {
  if (!state.quizComplete && Object.keys(state.academic.marks).length === 0) {
    return `<div class="card" style="text-align:center;padding:40px;">
      <h3>Complete your profile first</h3>
      <p style="color:var(--muted);margin:12px 0 20px;">We need intermediate marks and questionnaire answers to calculate match percentages.</p>
      <button class="btn btn-primary" onclick="nav('academic')">Go to Academic Profile</button>
    </div>`;
  }
  const recs = generateRecommendations();
  const top = recs[0], rest = recs.slice(1, 6);
  const topIds = recs.slice(0, 3).map(f => f.id);
  const topCats = [...new Set(recs.slice(0, 3).map(f => f.category))];
  const unis = recommendedUnis(topIds).slice(0, 3);
  const schols = recommendedSchols(avgMarks(), topCats).slice(0, 3);

  return `
  <div style="display:flex;justify-content:flex-end;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
    <button class="btn btn-outline btn-sm" onclick="nav('questionnaire')">Retake Questionnaire</button>
    <button class="btn btn-primary btn-sm" onclick="nav('academic')">Update Marks / Profile</button>
  </div>
  <div class="card card-highlight" style="margin-bottom:22px;">
    <p style="font-size:12px;color:var(--muted);">✦ Your Top Match</p>
    <h2 style="font-size:22px;">${esc(top.name)}</h2>
    <p style="color:var(--navy);font-weight:800;font-size:18px;">${top.match}% Match</p>
    <p style="color:var(--muted);font-size:13.5px;max-width:560px;margin-bottom:14px;">
      ${esc((top.reasons && top.reasons[0]) || 'Ranked from your marks (40%), interests (35%), education/stream (15%) and market demand (10%).')}
    </p>
    ${(top.reasons || []).length ? `<ul style="margin:0 0 14px 18px;color:var(--muted);font-size:13px;">${top.reasons.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>` : ''}
    <div class="grid g4" style="margin-bottom:16px;">
      ${[
        ['Subject Match (40%)', top.scores.subject],
        ['Interest Match (35%)', top.scores.interest],
        ['Education Fit (15%)', top.scores.education],
        ['Market & Future (10%)', top.scores.market],
      ].map(([l,v]) => `<div><p style="font-size:11.5px;color:var(--muted);">${l}</p><p style="font-weight:800;font-size:15px;">${v}%</p></div>`).join('')}
    </div>
    <button class="btn btn-primary" onclick="nav('fieldDetail',{id:${top.id}})">Explore Field</button>
    <button class="btn btn-outline" style="margin-left:8px;" onclick="toggleBm('field',${top.id})">${isBm('field',top.id)?'♥ Saved':'♡ Save'}</button>
  </div>

  <h4 style="margin-bottom:12px;">Other strong matches</h4>
  <div class="grid g3" style="margin-bottom:28px;">
    ${rest.map(f => `<div class="card">
      <h4 style="font-size:15px;">${esc(f.name)}</h4>
      <p style="color:var(--navy);font-weight:800;font-size:14px;">${f.match}% Match</p>
      <p style="font-size:12px;color:var(--muted);margin:6px 0 10px;">Subject ${f.scores.subject}% · Interest ${f.scores.interest}%</p>
      <div class="progress" style="margin-bottom:12px;"><div class="progress-fill" style="width:${f.match}%"></div></div>
      <button class="btn btn-outline btn-sm" onclick="nav('fieldDetail',{id:${f.id}})">Explore</button>
    </div>`).join('')}
  </div>

  <h4 style="margin-bottom:12px;">Universities for your top fields</h4>
  <div class="grid g3" style="margin-bottom:28px;">
    ${unis.length ? unis.map(u => `<div class="card clickable-card" style="cursor:pointer;" onclick="nav('uniDetail',{id:${u.id}})">
      <h4 style="font-size:15px;">${esc(u.name)}</h4>
      <p style="font-size:12.5px;color:var(--muted);">${esc(u.city)} · ${esc(u.sector)}</p>
      <span class="badge badge-navy">Offers ${u.relevance} of your top fields</span>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;" onclick="event.stopPropagation()">
        <button class="btn btn-outline btn-sm" onclick="nav('uniDetail',{id:${u.id}})">View details</button>
        ${extLink(u.website, 'Official website', false)}
      </div>
    </div>`).join('') : `<p style="color:var(--muted);">Complete profile to see university matches.</p>`}
  </div>

  <h4 style="margin-bottom:12px;">Scholarships that fit your marks &amp; fields</h4>
  <div class="grid g2">
    ${schols.length ? schols.map(s => `<div class="card clickable-card" style="cursor:pointer;" onclick="nav('scholDetail',{id:${s.id}})">
      <span class="badge badge-soft">${esc(s.type || 'Government')}</span>
      <h4 style="font-size:15px;margin-top:6px;">${esc(s.name)}</h4>
      <p style="font-size:12.5px;color:var(--muted);">${esc((s.eligibility || '').slice(0,100))}${(s.eligibility||'').length>100?'…':''}</p>
      <p style="font-size:12.5px;color:var(--navy);font-weight:700;">Deadline: ${esc(s.deadline)}</p>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;" onclick="event.stopPropagation()">
        <button class="btn btn-outline btn-sm" onclick="nav('scholDetail',{id:${s.id}})">View details</button>
        ${extLink(s.website || s.sourceUrl, 'Official website', true)}
      </div>
    </div>`).join('') : `<p style="color:var(--muted);">No scholarships from the database matched your current profile. Browse all schemes below.</p>`}
  </div>
  <p style="margin-top:16px;"><a onclick="nav('scholarships')" style="color:var(--navy);font-weight:700;cursor:pointer;">Browse all scholarships →</a></p>`;
}
