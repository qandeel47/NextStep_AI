/* ===== DASHBOARD ===== */
function pageDashboard() {
  const recs = generateRecommendations().slice(0, 4);
  const top = recs[0];
  const pct = profileCompletion();
  const hasData = state.quizComplete || Object.keys(state.academic.marks).length > 0;
  return `
  <div class="grid g4" style="margin-bottom:20px;">
    <div class="card">
      <p style="font-size:11.5px;color:var(--muted);">Top Match</p>
      <h4 style="font-size:15px;">${top ? esc(top.name) : '—'}</h4>
      <p style="color:var(--navy);font-weight:800;font-size:14px;">${top ? top.match+'% Match' : 'Complete profile'}</p>
      ${top ? `<a onclick="nav('fieldDetail',{id:${top.id}})" style="font-size:12.5px;color:var(--navy);font-weight:700;cursor:pointer;">View Details →</a>` : ''}
    </div>
    <div class="card" style="text-align:center;"><div style="font-size:26px;">🎓</div><div class="stat-val">${hasData ? recs.length : '—'}</div><p style="font-size:12px;color:var(--muted);margin:0;">Recommended Fields</p></div>
    <div class="card" style="text-align:center;"><div style="font-size:26px;">🏛</div><div class="stat-val">${state.bookmarks.unis.length}</div><p style="font-size:12px;color:var(--muted);margin:0;">Saved Universities</p></div>
    <div class="card" style="text-align:center;"><div style="font-size:26px;">♡</div><div class="stat-val">${state.bookmarks.fields.length}</div><p style="font-size:12px;color:var(--muted);margin:0;">Saved Fields</p></div>
  </div>
  <div class="grid g3" style="margin-bottom:20px;">
    <div class="card col-2">
      <div style="display:flex;justify-content:space-between;margin-bottom:14px;"><h4>Your Top Recommendations</h4>
        <a onclick="nav('recommendations')" style="font-size:12.5px;color:var(--navy);font-weight:700;cursor:pointer;">View All</a></div>
      ${hasData ? recs.map((f,i) => `
        <div style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:5px;">
            <span>${i+1}. ${esc(f.name)}</span><b style="color:var(--navy);">${f.match}%</b>
          </div>
          <div class="progress"><div class="progress-fill" style="width:${f.match}%"></div></div>
        </div>`).join('')
        : `<p style="color:var(--muted);font-size:13.5px;">Add your education, marks (obtained / total) and complete the 10-question questionnaire to see match percentages.</p>
           <button class="btn btn-primary btn-sm" style="margin-top:10px;" onclick="nav('academic')">Start Academic Profile</button>`}
    </div>
    <div class="card">
      <h4 style="margin-bottom:10px;">Next steps</h4>
      ${[
        ['academic', '1. Academic profile + marks', state.academic.level && Object.keys(state.academic.marks).length>=2],
        ['questionnaire', '2. Interest questionnaire (10 Qs)', state.quizComplete],
        ['recommendations', '3. View recommendations', hasData],
      ].map(([p,l,done]) => `<div onclick="nav('${p}')" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:13.5px;cursor:pointer;">
        <span>${l}</span><span style="color:${done?'var(--navy)':'var(--muted)'}">${done?'✓':'→'}</span>
      </div>`).join('')}
      <p style="font-size:12px;color:var(--muted);margin-top:12px;">Profile ${pct}% complete</p>
    </div>
  </div>`;
}
