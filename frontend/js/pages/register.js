async function doRegister(e) {
  e.preventDefault();
  const fullName = document.getElementById('reg-name')?.value || 'Student';
  const email = document.getElementById('reg-email')?.value || '';
  const password = document.getElementById('reg-password')?.value || '';
  try {
    await apiRegister({ fullName, email, password });
    try { await loadAuthenticatedAppData(); } catch (e) { /* non-blocking */ }
    toast('Account created — choose what you want to do next', true);
    nav('dashboard');
  } catch (err) {
    toast(err.message || 'Registration failed');
  }
  return false;
}
function pageRegister() {
  return `<div class="auth-page" style="background-image:linear-gradient(180deg,rgba(7,21,54,.35),rgba(11,31,77,.45)),url('img/auth-bg.png');background-size:cover;background-position:center;background-repeat:no-repeat;">
    <div class="auth-card">
      <h2>Create your account</h2>
      <p class="auth-sub">Start with guidance, or explore universities and scholarships first.</p>
      <form onsubmit="return doRegister(event)">
        <div class="field"><label>Full Name</label><input type="text" id="reg-name" required placeholder="Your name"></div>
        <div class="field"><label>Email Address</label><input type="email" id="reg-email" required placeholder="you@student.com"></div>
        <div class="field"><label>Password</label><input type="password" id="reg-password" required minlength="8" placeholder="At least 8 characters"></div>
        <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
      </form>
      <p class="auth-switch">Already have an account? <a onclick="nav('login')">Log in</a></p>
    </div>
  </div>`;
}
