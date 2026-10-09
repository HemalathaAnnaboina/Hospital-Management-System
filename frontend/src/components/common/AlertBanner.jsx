import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const AlertBanner = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
