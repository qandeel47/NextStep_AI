/* ===== COMPARE ===== */
function removeCompare(id) { state.compareIds = state.compareIds.filter(x=>x!==id); render(); }
function pageCompare() {
  const list = UNIS.filter(u => state.compareIds.includes(u.id));
  const rows = [['Sector',u=>u.sector],['Location',u=>u.city],['Entry Test',u=>u.entry],['Ranking',u=>u.ranking],['Students',u=>u.students]];
  return `<div class="card" style="margin-bottom:18px;">
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${list.map(u=>`<span class="badge badge-navy" style="padding:6px 12px;display:inline-flex;gap:6px;align-items:center;">
        ${esc(u.name)} <span style="cursor:pointer;font-weight:800;" onclick="removeCompare(${u.id})">×</span></span>`).join('')}
      <span class="badge" style="border:1.5px dashed var(--navy);color:var(--navy);cursor:pointer;padding:6px 12px;" onclick="nav('universities')">+ Add</span>
    </div>
  </div>
  ${list.length < 2 ? `<div class="empty">Select at least 2 universities. <button class="btn btn-outline btn-sm" onclick="nav('universities')">Browse</button></div>`
    : `<div class="card" style="overflow-x:auto;"><table><thead><tr><th>Feature</th>${list.map(u=>`<th>${esc(u.name)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(([l,fn])=>`<tr><td style="color:var(--muted);">${l}</td>${list.map(u=>`<td>${esc(fn(u))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}`;
}
