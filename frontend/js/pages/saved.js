function pageBookmarks() {
  const fields = FIELDS.filter(f => state.bookmarks.fields.includes(f.id));
  const unis = UNIS.filter(u => state.bookmarks.unis.includes(u.id));
  const schols = SCHOLS.filter(s => (state.bookmarks.schols || []).includes(s.id));
  return `<div class="grid g3">
    <div>
      <h4 style="margin-bottom:12px;">Saved fields</h4>
      ${fields.length===0
        ? `<div class="card empty">None yet. <button class="btn btn-outline btn-sm" onclick="nav('fields')">Browse fields</button></div>`
        : `<div class="grid">${fields.map(f=>`<div class="card"><h4>${esc(f.name)}</h4>
            <button class="btn btn-outline btn-sm" style="margin-top:10px;" onclick="nav('fieldDetail',{id:${f.id}})">Open</button></div>`).join('')}</div>`}
    </div>
    <div>
      <h4 style="margin-bottom:12px;">Saved universities</h4>
      ${unis.length===0
        ? `<div class="card empty">None yet. <button class="btn btn-outline btn-sm" onclick="nav('universities')">Browse universities</button></div>`
        : `<div class="grid">${unis.map(u=>`<div class="card clickable-card" onclick="nav('uniDetail',{id:${u.id}})">
            <div class="uni-detail-hero" style="margin-bottom:8px;"><div class="uni-brand">${uniBrand(u)}</div><div><h4>${esc(uniShortName(u.name))}</h4></div></div>
            <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;" onclick="event.stopPropagation()">
              <button class="btn btn-outline btn-sm" onclick="nav('uniDetail',{id:${u.id}})">View details</button>
              ${extLink(u.website, 'Official website', false)}
            </div></div>`).join('')}</div>`}
    </div>
    <div>
      <h4 style="margin-bottom:12px;">Saved scholarships</h4>
      ${schols.length===0
        ? `<div class="card empty">None yet. <button class="btn btn-outline btn-sm" onclick="nav('scholarships')">Browse scholarships</button></div>`
        : `<div class="grid">${schols.map(s=>`<div class="card clickable-card" onclick="nav('scholDetail',{id:${s.id}})">
            <h4>${esc(s.name)}</h4>
            <p style="font-size:12.5px;color:var(--muted);margin-top:4px;">${esc(s.provider)}</p>
            <button class="btn btn-outline btn-sm" style="margin-top:10px;" onclick="nav('scholDetail',{id:${s.id}})">Open</button>
          </div>`).join('')}</div>`}
    </div>
  </div>`;
}
