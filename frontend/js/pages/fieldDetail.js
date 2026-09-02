/* ===== FIELD DETAIL ===== */
function pageField() {
  const recs = generateRecommendations();
  const base = FIELDS.find(x => x.id == state.params.id) || FIELDS[0];
  const f = recs.find(x => x.id == state.params.id) || scoreField(base);
  const tab = state.fieldTab || 'Overview';
  const tabs = ['Overview','Careers','Skills','Universities'];
  let body = '';
  if (tab === 'Overview') {
    body = `<div class="grid g2">
      <div class="card"><h4 style="margin-bottom:8px;">About this field</h4><p style="color:var(--muted);font-size:13.5px;">${esc(f.about)}</p>
        <div class="kv"><span class="k">Required subjects</span><span class="v">${(f.requiredSubjects||[]).join(', ')}</span></div>
        <div class="kv"><span class="k">Min background</span><span class="v">${(f.minBackground||[]).join(' / ')}</span></div>
        <div class="kv"><span class="k">Demand</span><span class="v">${f.demandLabel}</span></div>
      </div>
      <div class="card"><h4 style="margin-bottom:10px;">Your match breakdown</h4>
        ${[['Subject Match',f.scores.subject,'From intermediate marks'],['Interest Match',f.scores.interest,'From questionnaire tags'],['Education Fit',f.scores.education,'Level vs preferred'],['Market & Future',f.scores.market,'Field demand scores']].map(([l,v,h])=>
          `<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;font-size:13px;"><span>${l}</span><b>${v}%</b></div>
           <div class="progress"><div class="progress-fill" style="width:${v}%"></div></div>
           <p style="font-size:11.5px;color:var(--muted);margin:2px 0 0;">${h}</p></div>`).join('')}
      </div>
    </div>`;
  } else if (tab === 'Careers') body = `<div class="card"><h4>Career paths</h4>${f.careers.map(c=>`<p style="font-size:13.5px;">• ${esc(c)}</p>`).join('')}</div>`;
  else if (tab === 'Skills') body = `<div class="card"><h4>Key skills</h4><div>${f.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div></div>`;
  else {
    const related = UNIS.filter(u => (u.fieldIds||[]).includes(f.id));
    body = related.length ? `<div class="grid g2">${related.map(u=>`<div class="card clickable-card" style="cursor:pointer;" onclick="nav('uniDetail',{id:${u.id}})">
      <h4>${esc(u.name)}</h4><p style="font-size:12.5px;color:var(--muted);">${esc(u.city)}</p>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;" onclick="event.stopPropagation()">
        <button class="btn btn-outline btn-sm" onclick="nav('uniDetail',{id:${u.id}})">View details</button>
        ${extLink(u.website, 'Official website', false)}
      </div></div>`).join('')}</div>`
      : `<div class="empty">No universities in the database match this field yet.</div>`;
  }
  return `<a class="back" onclick="nav('recommendations')">← Back to recommendations</a>
  <div class="grid g3" style="margin-bottom:18px;">
    <div class="card col-2">
      <span class="badge badge-navy">${esc(f.category)}</span>
      <h2 style="font-size:24px;margin:8px 0 6px;">${esc(f.name)}</h2>
      <p style="color:var(--muted);max-width:480px;">${esc(f.desc)}</p>
      <span class="badge badge-navy">${f.demandLabel}</span>
      <span class="badge badge-soft" style="margin-left:6px;">${f.duration}</span>
    </div>
    <div class="card" style="text-align:center;">
      ${ring(f.match, 100)}
      <button class="btn btn-outline btn-sm" style="margin-top:12px;" onclick="toggleBm('field',${f.id})">${isBm('field',f.id)?'♥ Saved':'♡ Save'}</button>
    </div>
  </div>
  <div class="tabs">${tabs.map(t=>`<button class="tab ${t===tab?'active':''}" onclick="state.fieldTab='${t}';nav('fieldDetail',{id:${f.id}})">${t}</button>`).join('')}</div>
  ${body}`;
}
