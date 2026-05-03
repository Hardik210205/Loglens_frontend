import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { LogLevel } from '../types';

interface LogFiltersProps {
  onFiltersChange: (filters: LogFilters) => void;
}

export interface LogFilters {
  searchText: string;
  logLevel: LogLevel | 'All';
  startDate: string;
  endDate: string;
}

const LogSearchFilters: React.FC<LogFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<LogFilters>({
    searchText: '',
    logLevel: 'All',
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (key: keyof LogFilters, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <div style={{
      padding: '1rem',
      background: '#1a1f2e',
      borderRadius: '16px',
      border: '1px solid rgba(148,163,184,0.22)',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ marginTop: 0, color: '#f8fafc' }}>Search & Filters</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#bfdbfe' }}>
            Search Message
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.searchText}
              onChange={(e) => handleChange('searchText', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 38px',
                border: '1px solid #2a3142',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                backgroundColor: '#1a1f2e',
                color: '#e2e8f0'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#bfdbfe' }}>
            Log Level
          </label>
          <select
            value={filters.logLevel}
            onChange={(e) => handleChange('logLevel', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid rgba(125, 211, 252, 0.3)',
              borderRadius: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              color: '#e2e8f0'
            }}
          >
            <option>All</option>
            <option>Trace</option>
            <option>Debug</option>
            <option>Information</option>
            <option>Warning</option>
            <option>Error</option>
            <option>Critical</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#bfdbfe' }}>
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #2a3142',
              borderRadius: '8px',
              backgroundColor: '#1a1f2e',
              color: '#e2e8f0'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#bfdbfe' }}>
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #2a3142',
              borderRadius: '8px',
              backgroundColor: '#1a1f2e',
              color: '#e2e8f0'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LogSearchFilters;
