function pageFields() {
  const recs = generateRecommendations();
  const ready = hasGuidanceData();
  const wrap = loggedIn() ? '' : '<div class="shell" style="padding:36px 0;">';
  return `${wrap}${loggedIn()?'':`<h2 style="margin-bottom:6px;color:var(--navy);">Explore career fields</h2>
  <p style="color:var(--muted);margin-bottom:22px;">Log in to save fields and see personalized match percentages.</p>`}
  <div class="grid g3">${recs.map(f=>`<div class="card clickable-card" onclick="nav('fieldDetail',{id:${f.id}})">
    <span class="badge badge-navy">${esc(f.category)}</span>
    <h4 style="margin:10px 0 6px;">${esc(f.name)}</h4>
    <p style="font-size:13px;color:var(--muted);">${esc((f.desc||'').slice(0,90))}${(f.desc||'').length>90?'…':''}</p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
      ${ready ? matchPct(f.match) : '<span class="match-pct muted">Browse</span>'}
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();nav('fieldDetail',{id:${f.id}})">Details</button>
    </div>
  </div>`).join('')}</div>${loggedIn()?'':'</div>'}`;
}
