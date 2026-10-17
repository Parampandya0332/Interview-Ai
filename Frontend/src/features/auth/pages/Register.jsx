import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Navbar from '../../../components/Navbar.jsx';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const success = await handleRegister({ username, email, password });
    if (success) {
      navigate('/home');
    } else {
      setErrorMsg('Registration failed. The email address may already be in use.');
    }
  };

  return (
    <div className="auth-layout">
      <Navbar />

      <main className="auth-main-container">
        <div className="auth-box surface-card">
          <div className="auth-intro">
            <h1 className="auth-heading">Create Account</h1>
            <p className="auth-caption">Sign up to analyze your resume and practice technical rounds.</p>
          </div>

          {errorMsg && (
            <div className="auth-alert">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label htmlFor="username">
                <User size={15} /> Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. dev_alex"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={15} /> Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={15} /> Password
              </label>
              <div className="password-field-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg auth-submit-btn"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="auth-subtext">
            <span>Already have an account? </span>
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .auth-main-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.25rem;
        }

        .auth-box {
          width: 100%;
          max-width: 440px;
          padding: 2.5rem 2rem;
          background-color: var(--bg-surface);
          border: var(--border-medium);
        }

        .auth-intro {
          margin-bottom: 1.75rem;
        }

        .auth-heading {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }

        .auth-caption {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .auth-alert {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #F87171;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          margin-bottom: 1.5rem;
        }

        .auth-form-fields {
          display: flex;
          flex-direction: column;
        }

        .password-field-container {
          position: relative;
          width: 100%;
        }

        .password-field-container input {
          padding-right: 2.75rem;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: color 0.15s ease;
        }

        .password-toggle:hover {
          color: var(--text-primary);
        }

        .auth-submit-btn {
          width: 100%;
          margin-top: 0.75rem;
        }

        .auth-subtext {
          margin-top: 1.75rem;
          text-align: center;
          padding-top: 1.25rem;
          border-top: var(--border-subtle);
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        .auth-link {
          color: var(--accent-cyan);
          text-decoration: none;
          font-weight: 600;
        }

        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default Register;
