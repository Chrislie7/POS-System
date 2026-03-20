function LoginPage({ onLogin, submitting, error }) {
  return (
    <div className="login-shell">
      <section className="login-card">
        <p className="eyebrow">Admin Access</p>
        <h1>Masuk ke dashboard POS Porto.</h1>
        <p className="hero-text">Gunakan akun admin sederhana untuk mengelola transaksi, export laporan, dan print struk.</p>

        <form className="login-form" onSubmit={onLogin}>
          <label className="field">
            <span>Username</span>
            <input type="text" name="username" placeholder="admin" autoComplete="username" />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" name="password" placeholder="admin123" autoComplete="current-password" />
          </label>

          {error ? <p className="helper-error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Memproses..." : "Login Admin"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
