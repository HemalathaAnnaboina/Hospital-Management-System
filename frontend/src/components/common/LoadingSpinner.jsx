import React from 'react';

const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      gap: '1rem',
      color: 'var(--slate-500)'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid var(--slate-200)',
        borderTopColor: 'var(--primary-600)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</span>
    </div>
  );
};

export default LoadingSpinner;
