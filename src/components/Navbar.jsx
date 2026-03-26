import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Employees', path: '/employees' },
  { label: 'Projects', path: '/projects' },
  { label: 'Tasks', path: '/tasks' },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>📋 PM Dashboard</div>
      <div style={styles.links}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.link,
              ...(location.pathname === item.path ? styles.active : {}),
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
 // Add this to your nav style
nav: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  height: '60px',
  backgroundColor: '#1976d2',
  color: 'white',
  flexWrap: 'wrap',   // ← ADD THIS
  gap: '8px',         // ← ADD THIS
},
links: {
  display: 'flex',
  gap: '8px',          // ← reduce gap
  flexWrap: 'wrap',    // ← ADD THIS
},
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
    padding: '6px 12px',
    borderRadius: '4px',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    fontWeight: 'bold',
  },
};

export default Navbar;