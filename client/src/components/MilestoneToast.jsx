import React from 'react';
import { Trophy, CheckCircle, X, Sparkles } from 'lucide-react';

export function MilestoneToast({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div
      className="milestone-toast"
      onClick={onClose}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        background: 'var(--panel)',
        border: '1px solid var(--accent)',
        borderRadius: '12px',
        padding: '14px 20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px var(--accent-glow)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        maxWidth: '420px',
        animation: 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#ffffff',
          boxShadow: '0 0 12px var(--accent-glow)',
        }}
      >
        {notification.icon === 'trophy' ? <Trophy size={20} /> : <Sparkles size={20} />}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text)' }}>
          {notification.title}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
          {notification.message}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-faint)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default MilestoneToast;
