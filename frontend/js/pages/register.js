/* ===== REGISTER ===== */
async function doRegister(e) {
  e.preventDefault();
  const fullName = document.getElementById('reg-name')?.value || 'Student';
  const email = document.getElementById('reg-email')?.value || '';
  const password = document.getElementById('reg-password')?.value || '';
  try {
    await apiRegister({ fullName, email, password });
    await loadAuthenticatedAppData();
    toast('Account created — complete your academic profile', true);
    nav('academic');
  } catch (err) {
    toast(err.message || 'Registration failed');
  }
  return false;
}
function pageRegister() {
  return `<div class="split">
    <div class="auth-left">
      <div class="brand" style="margin-bottom:28px;" onclick="nav('landing')"><div class="brand-logo">N</div><span class="brand-text">NextStep AI</span></div>
      <h2 style="font-size:24px;margin-bottom:6px;">Create your account</h2>
      <p style="color:var(--muted);margin-bottom:24px;">Start your personalized career journey.</p>
      <form onsubmit="return doRegister(event)">
        <div class="field"><label>Full Name</label><input type="text" id="reg-name" required></div>
        <div class="field"><label>Email Address</label><input type="email" id="reg-email" required></div>
        <div class="field"><label>Password</label><input type="password" id="reg-password" required minlength="8"></div>
        <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
      </form>
      <p style="margin-top:20px;font-size:13.5px;color:var(--muted);text-align:center;">Already have an account? <a onclick="nav('login')" style="color:var(--navy);font-weight:700;cursor:pointer;">Log in</a></p>
    </div>
    <div class="auth-right"><div class="auth-illust">🚀</div><h2>Join thousands of students</h2>
      <p style="margin-top:12px;">Your intermediate marks + interests → field, university and scholarship matches.</p></div>
  </div>`;
}
