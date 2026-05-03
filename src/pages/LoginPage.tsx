import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { registeredEmail?: string; message?: string } };
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(location.state?.message ?? null);

  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail);
    }

    if (auth.isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [auth.isAuthenticated, location.state, navigate]);

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      await auth.login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="login-brand">LogLens</div>
          <div className="login-subtitle">Log Intelligence Platform</div>
          <h1 style={{ margin: '0.4rem 0 0', color: '#f8fafc', fontSize: '2rem' }}>Sign In</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', lineHeight: 1.5 }}>
            Use your LogLens account to access dashboards and admin tools.
          </p>
        </div>

        {info && (
          <div style={{ color: '#dbeafe', background: 'rgba(30,64,175,0.3)', border: '1px solid rgba(96,165,250,0.25)', padding: '0.8rem 0.9rem', borderRadius: '12px', marginBottom: '1rem' }}>
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.45rem' }}>
            <span style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Email</span>
            <div className="login-input-wrap">
              <Mail size={16} className="login-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={inputStyle}
              />
            </div>
          </label>

          <label style={{ display: 'grid', gap: '0.45rem' }}>
            <span style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Password</span>
            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={inputStyle}
              />
            </div>
          </label>

          {error && (
            <div style={{ color: '#fecaca', background: 'rgba(127,29,29,0.35)', border: '1px solid rgba(248,113,113,0.25)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
            style={{
              opacity: loading ? 0.8 : 1,
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ color: '#94a3b8', fontSize: '0.92rem', textAlign: 'center' }}>
            Need to create the first account? <Link to="/register" style={{ color: '#7dd3fc', textDecoration: 'none' }}>Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 12px 12px 40px',
  borderRadius: '8px',
  border: '1px solid #2a3142',
  background: 'rgba(255,255,255,0.05)',
  color: '#f8fafc',
  outline: 'none',
  fontSize: '1rem'
};

export default LoginPage;