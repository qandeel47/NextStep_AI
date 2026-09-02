/* ===== FIELDS ===== */
function pageFields() {
  const recs = generateRecommendations();
  const wrap = loggedIn() ? '' : '<div class="shell" style="padding:36px 0;">';
  return `${wrap}<h2 style="margin-bottom:6px;">Explore career fields</h2>
  <p style="color:var(--muted);margin-bottom:22px;">Match % uses your saved marks and questionnaire when available.</p>
  <div class="grid g3">${recs.map(f=>`<div class="card">
    <span class="badge badge-navy">${esc(f.category)}</span>
    <h4 style="margin:10px 0 6px;">${esc(f.name)}</h4>
    <p style="font-size:13px;color:var(--muted);">${esc(f.desc.slice(0,90))}…</p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
      <span style="color:var(--navy);font-weight:700;">${f.match}%</span>
      <button class="btn btn-outline btn-sm" onclick="nav('fieldDetail',{id:${f.id}})">Details</button>
    </div>
  </div>`).join('')}</div>${loggedIn()?'':'</div>'}`;
}
