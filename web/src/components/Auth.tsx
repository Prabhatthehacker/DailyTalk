import { useState, type FormEvent } from 'react';
import { authMessage, login, logout, register, resetPassword } from '../lib/api';
import { Logo } from './Logo';

export function AuthScreen() {
  const [mode, setMode] = useState<'in' | 'up' | 'reset'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    try {
      if (mode === 'up') {
        if (!name.trim()) throw new Error('Enter your name.');
        await register(name, email, password);
      } else if (mode === 'in') {
        await login(email, password);
      } else {
        await resetPassword(email);
        setInfo('If an account exists for this email, a reset link is on its way.');
      }
    } catch (err) {
      setError(err instanceof Error && !(err as { code?: string }).code ? err.message : authMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const heading = mode === 'in' ? 'Welcome Back!' : mode === 'up' ? 'Create account' : 'Reset password';
  const subheading = mode === 'in' ? 'Sign in to continue to Daily Talk' : mode === 'up' ? 'Create your Daily Talk account' : 'We will email you a reset link';

  return (
    <main className="auth auth-split">
      <section className="auth-brand" aria-label="Branding panel">
        <Logo size={220} className="auth-logo" />
        <div className="auth-wordmark" aria-label="Daily Talk">
          <span className="word-main">Daily</span>
          <span className="word-accent">Talk</span>
        </div>
        <p className="tagline">Small messages. Big connections.</p>
      </section>

      <section className="auth-panel" aria-label="Authentication panel">
        <form className="auth-card" onSubmit={submit} noValidate>
          <h2>{heading}</h2>
          <p className="auth-subtitle">{subheading}</p>

          {mode === 'up' && (
            <label className="input-shell">
              <span className="sr-only">Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={60} placeholder="Your name" required />
            </label>
          )}

          <label className="input-shell icon-shell email-shell">
            <span className="sr-only">Email address or phone number</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="Email address or phone number" required />
          </label>

          {mode !== 'reset' && (
            <label className="input-shell icon-shell password-shell">
              <span className="sr-only">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} placeholder="Password" required />
            </label>
          )}

          {error && <p className="error" role="alert">{error}</p>}
          {info && <p className="ok" role="status">{info}</p>}

          <button className="btn auth-submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'in' ? 'Sign In' : mode === 'up' ? 'Create account' : 'Send reset link'}
            <span aria-hidden="true">→</span>
          </button>

          {mode === 'in' && (
            <div className="auth-divider"><span>or</span></div>
          )}

          {mode === 'in' && (
            <button type="button" className="btn outline google-btn" onClick={() => void logout()}>
              <span className="g-icon" aria-hidden="true">G</span>
              Continue with Google
            </button>
          )}

          <div className="auth-links">
            {mode !== 'in' && (
              <button type="button" className="link" onClick={() => { setMode('in'); setError(''); setInfo(''); }}>
                Back to sign in
              </button>
            )}
            {mode === 'in' && (
              <button type="button" className="link" onClick={() => { setMode('reset'); setError(''); setInfo(''); }}>
                Forgot password?
              </button>
            )}
          </div>

          {mode === 'in' && (
            <p className="signup-cta">
              Don&apos;t have an account? <button type="button" className="link inline-link" onClick={() => { setMode('up'); setError(''); setInfo(''); }}>Sign Up</button>
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export function SetupNeeded() {
  return (
    <main className="auth"><div className="auth-card">
      <Logo size={72} /><h1>Almost there</h1>
      <p className="muted">This build has no Firebase settings. Copy <code>.env.example</code> to <code>web/.env.local</code>, fill in your project values, and restart. See the README for the Firebase instructions.</p>
    </div></main>
  );
}
