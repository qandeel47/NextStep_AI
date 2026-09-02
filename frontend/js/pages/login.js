/* ===== LOGIN ===== */
async function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email')?.value || '';
  const password = document.getElementById('login-password')?.value || '';
  try {
    await apiLogin({ email, password });
    await loadAuthenticatedAppData();
    await apiLoadProfile();
    await apiLoadAnswers();
    await apiLoadRecommendations();
    toast('Welcome back, ' + displayName() + '!', true);
    afterAuthHome();
  } catch (err) {
    toast(err.message || 'Login failed');
  }
  return false;
}
function pageLogin() {
  return `<div class="split">
    <div class="auth-left">
      <div class="brand" style="margin-bottom:28px;" onclick="nav('landing')"><div class="brand-logo">N</div><span class="brand-text">NextStep AI</span></div>
      <h2 style="font-size:24px;margin-bottom:6px;">Welcome back! 👋</h2>
      <p style="color:var(--muted);margin-bottom:24px;">Log in to continue your journey.</p>
      <form onsubmit="return doLogin(event)">
        <div class="field"><label>Email Address</label><input type="email" id="login-email" required placeholder="you@student.com"></div>
        <div class="field"><label>Password</label><input type="password" id="login-password" required minlength="8"></div>
        <button type="submit" class="btn btn-primary btn-block">Log In</button>
      </form>
      <p style="margin-top:20px;font-size:13.5px;color:var(--muted);text-align:center;">Don't have an account? <a onclick="nav('register')" style="color:var(--navy);font-weight:700;cursor:pointer;">Create one now</a></p>
    </div>
    <div class="auth-right">
      <div class="auth-illust">🎓</div>
      <h2>Smart Guidance.<br>Better Decisions.</h2>
      <p style="margin-top:12px;">✓ Personalized Recommendations<br>✓ University &amp; Program Guidance<br>✓ Scholarship Opportunities</p>
    </div>
  </div>`;
}
