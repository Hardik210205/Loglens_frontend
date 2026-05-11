import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Server,
  Users
} from 'lucide-react';

type SidebarProps = {
  expanded: boolean;
  onToggle: () => void;
  onLogout: () => void;
  userEmail?: string | null;
  userRole?: string | null;
  isAdmin: boolean;
  tenantId?: string | null;
};

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ expanded, onToggle, onLogout, userEmail, userRole, isAdmin, tenantId }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const avatarButtonRef = useRef<HTMLButtonElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        profileOpen &&
        panelRef.current &&
        !panelRef.current.contains(target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [profileOpen]);

  const initials = useMemo(() => {
    if (!userEmail) {
      return 'L';
    }

    const firstChar = userEmail.trim().charAt(0);
    return firstChar ? firstChar.toUpperCase() : 'L';
  }, [userEmail]);

  const navItems: NavItem[] = [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Live Logs', to: '/', icon: <Activity size={18} /> },
    { label: 'Incidents', to: '/incidents', icon: <AlertTriangle size={18} /> },
    { label: 'Services', to: '/admin/services', icon: <Server size={18} />, adminOnly: true },
    { label: 'Users', to: '/admin/users', icon: <Users size={18} />, adminOnly: true }
  ];

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      style={{
        position: 'fixed',
        inset: '0 auto 0 0',
        width: expanded ? 240 : 64,
        height: '100vh',
        background: '#0f1117',
        borderRight: '1px solid #2a3142',
        transition: 'width 300ms ease',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          gap: '0.75rem',
          padding: expanded ? '1.05rem 0.95rem 0.85rem' : '1.05rem 0 0.85rem',
          minHeight: 76
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: expanded ? 'flex-start' : 'center',
            gap: 2,
            minWidth: 0,
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'opacity 200ms ease, transform 200ms ease',
            pointerEvents: expanded ? 'auto' : 'none',
            position: expanded ? 'relative' : 'absolute',
            visibility: expanded ? 'visible' : 'hidden'
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em'
            }}
          >
            LogLens
          </div>
          <div style={{ color: '#94a3b8', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Log Intelligence
          </div>
        </div>

        {!expanded && (
          <div
            title="LogLens"
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.22))',
              color: '#93c5fd',
              flexShrink: 0
            }}
          >
            <Activity size={18} />
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            position: 'absolute',
            top: 24,
            right: -14,
            width: 28,
            height: 28,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 999,
            border: '1px solid #2a3142',
            background: '#171b26',
            color: '#cbd5e1',
            cursor: 'pointer',
            transition: 'background 200ms ease, color 200ms ease, transform 200ms ease',
            zIndex: 50
          }}
        >
          {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: expanded ? '0.4rem 0.55rem 0.75rem' : '0.4rem 0.45rem 0.75rem'
        }}
      >
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={!expanded ? item.label : undefined}
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 12,
              minHeight: 44,
              padding: expanded ? '0 0.95rem' : '0 0.45rem',
              borderRadius: 12,
              borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
              background: isActive ? 'rgba(30,41,59,0.95)' : 'transparent',
              color: isActive ? '#93c5fd' : '#64748b',
              textDecoration: 'none',
              transition: 'background 200ms ease, color 200ms ease, transform 200ms ease, border-color 200ms ease',
              whiteSpace: 'nowrap'
            })}
          >
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 20,
                height: 20,
                flexShrink: 0,
                color: 'inherit',
                marginLeft: expanded ? 0 : 4
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                opacity: expanded ? 1 : 0,
                transform: expanded ? 'translateX(0)' : 'translateX(-8px)',
                width: expanded ? 'auto' : 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'opacity 200ms ease, transform 200ms ease, width 300ms ease'
              }}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: expanded ? '0.75rem 0.75rem 1rem' : '0.75rem 0.45rem 1rem' }}>
        <div
          style={{
            height: 1,
            background: '#2a3142',
            marginBottom: 12,
            opacity: expanded ? 1 : 0.55
          }}
        />
        <div style={{ position: 'relative' }}>
          <button
            ref={avatarButtonRef}
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            title={userEmail ?? 'Account'}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 12,
              background: 'transparent',
              border: 'none',
              padding: expanded ? '0.25rem 0.4rem' : '0.25rem 0',
              cursor: 'pointer',
              color: '#e2e8f0',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 14,
                flexShrink: 0,
                marginLeft: expanded ? 0 : 4
              }}
            >
              {initials}
            </div>

            <div
              style={{
                minWidth: 0,
                flex: 1,
                opacity: expanded ? 1 : 0,
                transform: expanded ? 'translateX(0)' : 'translateX(-8px)',
                width: expanded ? 'auto' : 0,
                overflow: 'hidden',
                transition: 'opacity 200ms ease, transform 200ms ease, width 300ms ease'
              }}
            >
              <div
                style={{
                  color: '#f8fafc',
                  fontSize: 13,
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {userEmail ?? 'Account'}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 6,
                  padding: '0.18rem 0.55rem',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  color: userRole === 'Admin' ? '#93c5fd' : '#9ca3af',
                  background: userRole === 'Admin' ? 'rgba(30,58,95,0.95)' : 'rgba(55,65,81,0.95)'
                }}
              >
                {userRole ?? 'Viewer'}
              </div>
            </div>
          </button>

          {profileOpen && (
            <div
              ref={panelRef}
              style={{
                position: 'absolute',
                bottom: expanded ? 54 : 52,
                left: expanded ? 0 : 48,
                width: expanded ? 208 : 220,
                padding: 12,
                borderRadius: 12,
                background: '#121625',
                border: '1px solid #2a3142',
                color: '#e2e8f0',
                zIndex: 50
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userEmail ?? 'Account'}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  color: userRole === 'Admin' ? '#93c5fd' : '#9ca3af',
                  background: userRole === 'Admin' ? 'rgba(30,58,95,0.95)' : 'rgba(55,65,81,0.95)',
                  marginBottom: 10
                }}
              >
                {userRole ?? 'Viewer'}
              </div>

              {tenantId && (
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10, wordBreak: 'break-all' }}>
                  <strong style={{ color: '#94a3b8' }}>Org ID:</strong><br />
                  {tenantId}
                </div>
              )}

              <div style={{ height: 1, background: '#2a3142', margin: '10px 0' }} />

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0.55rem 0.35rem',
                  border: 'none',
                  background: 'transparent',
                  color: '#fca5a5',
                  cursor: 'pointer',
                  borderRadius: 10,
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;