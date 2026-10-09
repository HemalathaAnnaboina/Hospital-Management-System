import React from 'react';

const StatCard = ({ title, value, icon: Icon, variant = 'primary', subtitle }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${variant}`}>
        {Icon && <Icon size={26} />}
      </div>
      <div className="stat-details">
        <h3>{value ?? 0}</h3>
        <p>{title}</p>
        {subtitle && <small style={{ color: 'var(--slate-400)', fontSize: '0.75rem' }}>{subtitle}</small>}
      </div>
    </div>
  );
};

export default StatCard;
