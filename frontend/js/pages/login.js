async function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email')?.value || '';
  const password = document.getElementById('login-password')?.value || '';
  try {
    await apiLogin({ email, password });
    try {
      await loadAuthenticatedAppData();
      await apiLoadProfile();
      await apiLoadAnswers();
      await apiLoadRecommendations();
    } catch (e) { /* non-blocking */ }
    toast('Welcome back, ' + displayName() + '!', true);
    afterAuthHome();
  } catch (err) {
    toast(err.message || 'Login failed');
  }
  return false;
}
function pageLogin() {
  return `<div class="auth-page" style="background-image:linear-gradient(180deg,rgba(7,21,54,.35),rgba(11,31,77,.45)),url('img/auth-bg.png');background-size:cover;background-position:center;background-repeat:no-repeat;">
    <div class="auth-card">
      <h2>Welcome back</h2>
      <p class="auth-sub">Log in to continue your career journey.</p>
      <form onsubmit="return doLogin(event)">
        <div class="field"><label>Email Address</label><input type="email" id="login-email" required placeholder="you@student.com"></div>
        <div class="field"><label>Password</label><input type="password" id="login-password" required minlength="8"></div>
        <button type="submit" class="btn btn-primary btn-block">Log In</button>
      </form>
      <p class="auth-switch">Don't have an account? <a onclick="nav('register')">Create one now</a></p>
    </div>
  </div>`;
}
