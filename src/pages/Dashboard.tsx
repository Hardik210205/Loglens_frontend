import React, { Suspense, useEffect, useState } from 'react';
import { Activity, AlertCircle, Bell, FileText } from 'lucide-react';
import ErrorHeatmap from '../components/ErrorHeatmap';
import SystemRiskPanel from '../components/SystemRiskPanel';
import TopFailingServices from '../components/TopFailingServices';
import PredictionChartPlaceholder from '../components/PredictionChartPlaceholder';
import { fetchDashboardStats } from '../services/api';

const formatKolkataTimestamp = (timestamp: string) => {
  const value = new Date(timestamp);
  if (Number.isNaN(value.getTime())) {
    return '-';
  }

  return value.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{ totalLogs24h: number; activeIncidents: number; pendingAlerts24h: number; systemHealthPercent: number } | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(new Date().toISOString());

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await fetchDashboardStats();
        if (mounted) {
          setStats(data);
          setStatsError(null);
          setLastRefreshedAt(new Date().toISOString());
        }
      } catch (e) {
        if (mounted) setStatsError(e instanceof Error ? e.message : 'Failed to load stats');
      }
    };
    load();
    const timer = setInterval(load, 5000);
    return () => { clearInterval(timer); mounted = false; };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.2rem' }}>
        <h2 style={{ marginBottom: '0.35rem', color: '#f8fafc', fontSize: '1.9rem' }}>Dashboard</h2>
        <div style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
          Last refreshed: {formatKolkataTimestamp(lastRefreshedAt)}
        </div>
      </div>
      <Suspense fallback={<div>Loading system risk...</div>}>
        <SystemRiskPanel />
      </Suspense>
      <Suspense fallback={<div>Loading failing services...</div>}>
        <TopFailingServices />
      </Suspense>
      <Suspense fallback={<div>Loading prediction chart...</div>}>
        <PredictionChartPlaceholder formatTimestamp={formatKolkataTimestamp} />
      </Suspense>
      <Suspense fallback={<div>Loading heatmap...</div>}>
        <ErrorHeatmap />
      </Suspense>
      <div style={{
        padding: '1.15rem',
        background: 'linear-gradient(140deg, rgba(30,41,59,0.86), rgba(15,23,42,0.97))',
        borderRadius: '18px',
        boxShadow: '0 12px 34px rgba(2,6,23,0.42)',
        border: '1px solid rgba(148,163,184,0.2)'
      }}>
        <h3 style={{ marginTop: 0, color: '#f8fafc', letterSpacing: '0.01em' }}>Quick Stats</h3>
        {statsError && (
          <div style={{ color: '#fecaca', marginBottom: '1rem' }}>{statsError}</div>
        )}
        {!statsError && stats == null && (
          <div style={{ color: '#94a3b8', marginBottom: '1rem' }}>No dashboard data available yet.</div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            background: '#1a1f2e',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.85rem' }}>
              <div className="dash-icon-blue"><FileText size={18} /></div>
              <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Total Logs</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff' }}>{stats?.totalLogs24h ?? '-'}</div>
          </div>
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            background: '#1a1f2e',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.85rem' }}>
              <div className="dash-icon-red"><AlertCircle size={18} /></div>
              <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Active Incidents</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff' }}>{stats?.activeIncidents ?? '-'}</div>
          </div>
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            background: '#1a1f2e',
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.85rem' }}>
              <div className="dash-icon-yellow"><Bell size={18} /></div>
              <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Pending Alerts</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff' }}>{stats?.pendingAlerts24h ?? '-'}</div>
          </div>
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            background: '#1a1f2e',
            borderLeft: '4px solid #22c55e'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.85rem' }}>
              <div className="dash-icon-green"><Activity size={18} /></div>
              <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>System Health</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff' }}>{stats != null ? `${stats.systemHealthPercent}%` : '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;