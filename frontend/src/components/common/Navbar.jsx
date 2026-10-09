import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, ShieldCheck, HeartPulse } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user, role } = useAuth();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <HeartPulse size={20} color="var(--primary-600)" />
        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--slate-800)' }}>
          {title || 'Smart Hospital Management System'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--slate-500)',
          background: 'var(--slate-100)',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)'
        }}>
          <ShieldCheck size={16} color="var(--primary-600)" />
          <span>Verified Access: <strong>{role}</strong></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
