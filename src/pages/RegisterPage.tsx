import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { register } from '../services/authApi';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(email, password, 'Viewer');
      navigate('/login', {
        replace: true,
        state: {
          registeredEmail: email,
          message: 'Account created. Sign in to continue.'
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
          <h1 style={{ margin: '0.4rem 0 0', color: '#f8fafc', fontSize: '2rem' }}>Create Account</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', lineHeight: 1.5 }}>
            Create the first LogLens account, then sign in with your new credentials.
          </p>
        </div>

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
                autoComplete="new-password"
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
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <div style={{ color: '#94a3b8', fontSize: '0.92rem', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: '#7dd3fc', textDecoration: 'none' }}>Sign in</Link>
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

export default RegisterPage;