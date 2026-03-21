import AppIcon from "./AppIcon";

function LoginPage({ onLogin, submitting, error }) {
  return (
    <div className="login-shell">
      <section className="login-card">
        <div className="login-visual icon-surface">
          <AppIcon name="receipt" size={40} />
        </div>
        <p className="eyebrow">POS Porto</p>
        <h1>Admin</h1>
        <p className="hero-text">Masuk untuk buka kasir.</p>

        <form className="login-form" onSubmit={onLogin}>
          <label className="field compact-field">
            <span className="field-icon"><AppIcon name="user" size={18} /></span>
            <input type="text" name="username" placeholder="Username" autoComplete="username" />
          </label>

          <label className="field compact-field">
            <span className="field-icon"><AppIcon name="lock" size={18} /></span>
            <input type="password" name="password" placeholder="Password" autoComplete="current-password" />
          </label>

          {error ? <p className="helper-error">{error}</p> : null}

          <button className="primary-button large-button" type="submit" disabled={submitting}>
            {submitting ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
