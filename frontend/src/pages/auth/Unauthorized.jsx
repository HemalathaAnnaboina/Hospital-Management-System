import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const { getDashboardPath } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--slate-50)'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--slate-200)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 1.5rem',
          backgroundColor: 'var(--danger-bg)',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--danger-solid)'
        }}>
          <ShieldAlert size={36} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>403 - Access Denied</h2>
        <p style={{ color: 'var(--slate-600)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
          Your security role does not have permission to view this section of the hospital system.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <Link to={getDashboardPath()} className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Your Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
