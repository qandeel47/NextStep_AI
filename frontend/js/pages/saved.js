/* ===== SAVED ===== */
function pageBookmarks() {
  const fields = FIELDS.filter(f => state.bookmarks.fields.includes(f.id));
  const unis = UNIS.filter(u => state.bookmarks.unis.includes(u.id));
  return `<h4 style="margin-bottom:12px;">Saved fields</h4>
  ${fields.length===0?`<div class="empty">None yet.</div>`:`<div class="grid g3" style="margin-bottom:24px;">${fields.map(f=>`<div class="card"><h4>${esc(f.name)}</h4>
    <button class="btn btn-outline btn-sm" onclick="nav('fieldDetail',{id:${f.id}})">Open</button></div>`).join('')}</div>`}
  <h4 style="margin-bottom:12px;">Saved universities</h4>
  ${unis.length===0?`<div class="empty">None yet.</div>`:`<div class="grid g2">${unis.map(u=>`<div class="card clickable-card" style="cursor:pointer;" onclick="nav('uniDetail',{id:${u.id}})"><h4>${esc(u.name)}</h4>
    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;" onclick="event.stopPropagation()">
      <button class="btn btn-outline btn-sm" onclick="nav('uniDetail',{id:${u.id}})">View details</button>
      ${extLink(u.website, 'Official website', false)}
    </div></div>`).join('')}</div>`}`;
}
