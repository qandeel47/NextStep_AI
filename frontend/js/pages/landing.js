/* ===== LANDING ===== */
function pageLanding() {
  return `<div class="shell">
    <div class="hero-grid">
      <div class="hero">
        <h1>Find the Right<br>Career Path.<br>Build Your Future.</h1>
        <p>AI-powered recommendations using your intermediate marks and interests — plus universities and scholarships for students in Pakistan.</p>
        <div class="hero-actions">
          ${loggedIn()
            ? `<button class="btn btn-primary" onclick="nav('dashboard')">Go to Dashboard</button>
               <button class="btn btn-outline" onclick="logout()">Log Out</button>`
            : `<button class="btn btn-primary" onclick="nav('register')">Get Started</button>
               <button class="btn btn-outline" onclick="nav('login')">Log In</button>`}
        </div>
      </div>
      <div style="display:flex;justify-content:center;align-items:center;gap:20px;flex-wrap:wrap;">
        <div style="width:180px;height:180px;border-radius:50%;background:linear-gradient(145deg,#DBEAFE,#EFF6FF);display:flex;align-items:center;justify-content:center;font-size:72px;border:4px solid #fff;box-shadow:var(--shadow-md);">👩‍🎓</div>
        <div class="hero-card">
          <p style="font-size:11.5px;color:var(--muted);">Example top match</p>
          <h3 style="font-size:16px;">Software Engineering</h3>
          <p style="color:var(--navy);font-weight:800;">92% Match</p>
          <div style="font-size:13px;line-height:1.7;margin-top:8px;">✓ Subject marks aligned<br>✓ Interest tags matched<br>✓ High market demand</div>
        </div>
      </div>
    </div>
    <div class="stats-row">
      ${[['50+','Academic Fields'],['200+','Universities'],['100+','Scholarships'],['AI','Weighted Matching']].map(([n,l])=>
        `<div class="stat-box"><div class="num">${n}</div><div class="lbl">${l}</div></div>`).join('')}
    </div>
    <h2 style="text-align:center;margin-bottom:24px;font-size:22px;">How NextStep AI Works</h2>
    <div class="steps">
      ${[
        ['01','Create Profile','Education (Matric / Inter / O / A Level), stream and obtained/total marks.'],
        ['02','Answer 10 Questions','Every question is compulsory. Some allow 2–3 choices.'],
        ['03','Get Recommendations','Subject 40% + Interest 35% + Education 15% + Market 10%.'],
        ['04','Explore Opportunities','Universities and scholarships ranked for your top fields.']
      ].map(([n,t,d])=>`<div class="step-card"><div class="step-num">${n}</div><h4 style="font-size:14.5px;margin-bottom:6px;">${t}</h4><p style="font-size:12.5px;color:var(--muted);margin:0;">${d}</p></div>`).join('')}
    </div>
  </div>`;
}
