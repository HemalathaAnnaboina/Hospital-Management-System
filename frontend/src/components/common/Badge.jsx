import React from 'react';

const Badge = ({ status }) => {
  if (!status) return null;

  const normalized = String(status).toUpperCase();
  let badgeClass = 'badge-pending';

  switch (normalized) {
    case 'BOOKED':
    case 'PENDING':
      badgeClass = 'badge-booked';
      break;
    case 'CONFIRMED':
    case 'PAID':
      badgeClass = 'badge-confirmed';
      break;
    case 'COMPLETED':
      badgeClass = 'badge-completed';
      break;
    case 'CANCELLED':
      badgeClass = 'badge-cancelled';
      break;
    case 'ACTIVE':
    case 'TRUE':
      badgeClass = 'badge-active';
      break;
    default:
      badgeClass = 'badge-pending';
  }

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default Badge;
