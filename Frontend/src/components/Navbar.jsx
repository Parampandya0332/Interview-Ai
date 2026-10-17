import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Terminal, LogOut, User, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  const username = user?.username || user?.email?.split('@')[0] || 'User';

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to={user ? "/home" : "/login"} className="brand-link">
          <div className="brand-icon-box">
            <Terminal size={19} className="brand-icon" />
          </div>
          <div className="brand-text-col">
            <span className="brand-name">Interview<span className="brand-highlight">AI</span></span>
          </div>
        </Link>

        {/* Right Navigation */}
        <nav className="nav-controls">
          {user ? (
            <div className="authenticated-group">
              <div className="user-profile-badge">
                <div className="avatar-circle">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="username-text">{username}</span>
              </div>
              <button onClick={onLogout} className="btn btn-secondary btn-sm logout-btn" title="Sign Out">
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="guest-group">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>

      <style>{`
        .app-navbar {
          width: 100%;
          background-color: rgba(11, 13, 19, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0.85rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
        }

        .brand-icon-box {
          width: 34px;
          height: 34px;
          background-color: var(--accent-cyan-dim);
          border: 1px solid var(--accent-cyan-border);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-icon {
          color: var(--accent-cyan);
        }

        .brand-name {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .brand-highlight {
          color: var(--accent-cyan);
        }

        .nav-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .authenticated-group, .guest-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.75rem;
          background-color: var(--bg-surface);
          border: var(--border-subtle);
          border-radius: var(--radius-pill);
        }

        .avatar-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: var(--accent-cyan);
          color: #000000;
          font-weight: 700;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .username-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .logout-btn {
          font-size: 0.82rem;
        }

        @media (max-width: 640px) {
          .username-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
