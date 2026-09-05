function pageLanding() {
  const ctaPrimary = loggedIn()
    ? `<button class="btn btn-primary lp-btn" onclick="nav('dashboard')">Go to Dashboard</button>`
    : `<button class="btn btn-primary lp-btn" onclick="nav('register')">Get Started</button>`;
  const ctaSecondary = loggedIn()
    ? `<button class="btn lp-btn-ghost" onclick="nav('universities')">Explore Universities</button>`
    : `<button class="btn lp-btn-ghost" onclick="nav('login')">Log In</button>`;

  return `<div class="lp">
    <section class="lp-hero">
      <div class="lp-hero-bg" aria-hidden="true"></div>
      <div class="lp-hero-glow" aria-hidden="true"></div>
      <div class="lp-hero-grid shell">
        <div class="lp-hero-copy lp-fade">
          <h1>The right career starts with the right direction.</h1>
          <p>Personalized guidance for Pakistani students — matched to your marks and interests, or browse universities and scholarships on your own.</p>
          <div class="lp-hero-actions">${ctaPrimary}${ctaSecondary}</div>
        </div>
      </div>
    </section>

    <section class="lp-section shell">
      <div class="lp-section-head lp-reveal">
        <h2>How NextStep AI works</h2>
        <p>Start with personalized guidance, or jump straight into browsing. Your choice.</p>
      </div>
      <div class="lp-steps">
        ${[
          ['01', 'Build your profile', 'Add education level, stream and marks when you want ranked career matches.'],
          ['02', 'Share your interests', 'A short questionnaire helps align careers with what you enjoy.'],
          ['03', 'See clear matches', 'Weighted scoring across subjects, interests, education and market demand.'],
          ['04', 'Explore freely', 'Universities, scholarships and career fields stay open either way.'],
        ].map(([n, t, d]) => `
          <article class="lp-step lp-reveal">
            <span>${n}</span>
            <h3>${t}</h3>
            <p>${d}</p>
          </article>`).join('')}
      </div>
    </section>

    <section class="lp-section lp-section-soft">
      <div class="shell">
        <div class="lp-section-head lp-reveal">
          <h2>Choose your starting point</h2>
          <p>Pick what you need right now — guidance, exploration, or both.</p>
        </div>
        <div class="lp-paths lp-paths-visual">
          ${[
            ['questionnaire', 'img/lp-assessment.png', 'Assessment', 'Complete your profile and interests to unlock matches.'],
            ['recommendations', 'img/lp-hero-student.png', 'Recommendation', 'See ranked career paths based on your assessment.'],
            ['fields', 'img/lp-career.png', 'Career Fields', 'Browse fields, skills and pathways across Pakistan.'],
            ['universities', 'img/lp-university.jpg', 'Universities', 'Search, filter and compare programs across Pakistan.'],
            ['scholarships', 'img/lp-scholarship.png', 'Scholarships', 'Government schemes, deadlines and official apply links.'],
          ].map(([page, img, t, d]) => `
            <button type="button" class="lp-path lp-path-img lp-reveal" onclick="nav('${page}')">
              <span class="lp-path-media"><img src="${img}" alt=""></span>
              <span class="lp-path-body">
                <h3>${t}</h3>
                <p>${d}</p>
                <span class="lp-path-go">Open →</span>
              </span>
            </button>`).join('')}
        </div>
      </div>
    </section>

    <section class="lp-cta-band">
      <div class="shell lp-cta-inner lp-reveal">
        <h2>Ready to find your direction?</h2>
        <p>Create an account and start with assessment, universities, or scholarships.</p>
        <div class="lp-hero-actions">
          ${loggedIn()
            ? `<button class="btn btn-primary lp-btn" onclick="nav('dashboard')">Open Dashboard</button>`
            : `<button class="btn btn-primary lp-btn" onclick="nav('register')">Get Started</button>
               <button class="btn lp-btn-ghost" onclick="nav('login')">Log In</button>`}
        </div>
      </div>
    </section>

    <footer class="lp-footer shell">
      <p>Career guidance for students in Pakistan</p>
    </footer>
  </div>`;
}

function bindLandingMotion() {
  if (state.page !== 'landing') return;
  const nodes = document.querySelectorAll('.lp-reveal');
  if (!nodes.length) return;
  if (!('IntersectionObserver' in window)) {
    nodes.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  nodes.forEach((el) => io.observe(el));
}
