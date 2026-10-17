import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: 'var(--bg-app)'
      }}>
        <div className="surface-card" style={{
          textAlign: 'center',
          maxWidth: 340,
          padding: '2rem',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <div style={{
            width: 32,
            height: 32,
            border: '2.5px solid var(--accent-cyan)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 1.25rem',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
            Authenticating Session
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Verifying your workspace access...
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;