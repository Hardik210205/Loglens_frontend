import React from 'react';
import { LogEntry } from '../types';

interface Props {
  logs: LogEntry[];
  formatTimestamp: (timestamp: string) => string;
}

const resolveLevelLabel = (level: string | number | null | undefined) => {
  if (typeof level === 'number') {
    // Matches backend LogLevel enum numeric values.
    const labels: Record<number, string> = {
      0: 'Trace',
      1: 'Debug',
      2: 'Information',
      3: 'Warning',
      4: 'Error',
      5: 'Critical'
    };

    return labels[level] ?? `Level-${level}`;
  }

  if (typeof level === 'string' && level.trim().length > 0) {
    return level;
  }

  return 'Unknown';
};

const getSeverityColor = (level: string | number | null | undefined) => {
  const normalized = resolveLevelLabel(level).toLowerCase();

  if (normalized === 'error' || normalized === 'critical') {
    return {
      text: normalized === 'critical' ? '#fca5a5' : '#f87171',
      chipBg: normalized === 'critical' ? '#450a0a' : '#7f1d1d',
      border: normalized === 'critical' ? '#7f1d1d' : '#ef4444',
      leftBorder: normalized === 'critical' ? '#f87171' : '#ef4444'
    };
  }

  if (normalized === 'warning') {
    return {
      text: '#fbbf24',
      chipBg: '#92400e',
      border: '#f59e0b',
      leftBorder: '#f59e0b'
    };
  }

  return {
    text: '#ffffff',
    chipBg: '#1d4ed8',
    border: '#1d4ed8',
    leftBorder: '#1d4ed8'
  };
};

const LogTable: React.FC<Props> = ({ logs, formatTimestamp }) => {
  return (
    <div style={{
      display: 'grid',
      gap: '0.85rem',
    }}>
      {logs.map((log, idx) => {
        const tone = getSeverityColor(log.level);
        const levelLabel = resolveLevelLabel(log.level);

        return (
          <article
            key={log.id || idx}
            style={{
              background: '#1a1f2e',
              border: '1px solid rgba(42, 49, 66, 0.9)',
              borderLeft: `4px solid ${tone.leftBorder}`,
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '0.7rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.22rem 0.62rem',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: tone.text,
                backgroundColor: tone.chipBg,
                border: `1px solid ${tone.border}`,
                textTransform: 'uppercase'
              }}>
                {levelLabel}
              </span>
              <span style={{ color: '#cbd5e1', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                {formatTimestamp(log.timestamp)}
              </span>
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '0.45rem' }}>
              {log.message || '-'}
            </div>
            {log.metadata && (
              <div style={{
                color: '#94a3b8',
                fontSize: '0.82rem',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                padding: '0.45rem 0.55rem',
                borderRadius: '10px',
                overflowX: 'auto'
              }}>
                {log.metadata}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default LogTable;