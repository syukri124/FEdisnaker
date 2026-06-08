import React, { useEffect, useState } from 'react';

export default function Topbar({ role, onLogout, toggleSidebar }) {
  const [indonesianDate, setIndonesianDate] = useState('');

  useEffect(() => {
    // Generate live date in Indonesian format
    const dateStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setIndonesianDate(dateStr);
  }, []);

  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-3">
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <i className="fa fa-bars"></i>
        </button>
        <div>
          <p className="topbar-title mb-0">Sistem Pelaporan Disnaker Kota Pekanbaru</p>
          <p className="topbar-date mb-0">{indonesianDate}</p>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        {role && (
          <span className="role-badge">{role.toUpperCase()}</span>
        )}
        <button onClick={onLogout} className="btn-logout">
          <i className="fa fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </header>
  );
}
