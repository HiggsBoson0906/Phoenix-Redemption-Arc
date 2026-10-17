import React, { useState, useRef } from 'react';
import { Download, Upload, CheckCircle2, AlertCircle, X, HardDrive } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';

export function BackupModal({ isOpen, onClose }) {
  const { exportBackup, importBackup, checkedState, starredState } = useProgress();
  const [importStatus, setImportStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const solvedCount = Object.values(checkedState || {}).filter(Boolean).length;
  const starredCount = Object.values(starredState || {}).filter(Boolean).length;

  const handleExport = () => {
    exportBackup();
    setImportStatus({
      type: 'success',
      message: `Exported backup with ${solvedCount} solved and ${starredCount} starred problems!`,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result;
        const res = await importBackup(text);
        if (res.success) {
          setImportStatus({
            type: 'success',
            message: `Successfully imported backup! Restored progress with ${res.count} problems.`,
          });
        } else {
          setImportStatus({
            type: 'error',
            message: res.error || 'Failed to import backup file.',
          });
        }
      } catch (err) {
        setImportStatus({
          type: 'error',
          message: err.message || 'Invalid backup file format.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', width: '92%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={20} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: 'var(--text)' }}>
              Backup & Restore Progress
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="star-btn"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 20px 0' }}>
          Save your complete problem-solving progress, starred questions, and activity streaks to an offline JSON file, or restore them anytime.
        </p>

        {importStatus && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem',
              background: importStatus.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${importStatus.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: importStatus.type === 'success' ? '#10b981' : '#ef4444',
            }}
          >
            {importStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Export Box */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid var(--line)',
              background: 'var(--bg-elev)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.95rem' }}>
                Export Progress to JSON
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {solvedCount} solved · {starredCount} starred
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleExport}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>

          {/* Import Box */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid var(--line)',
              background: 'var(--bg-elev)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.95rem' }}>
                Import Progress from JSON
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Restore or merge from a previous backup
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <Upload size={14} />
              <span>Import</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            type="button"
            className="chip"
            onClick={onClose}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackupModal;
