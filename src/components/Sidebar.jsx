import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ role, isOpen, toggleSidebar }) {
  const location = useLocation();
  const activePath = location.pathname;

  // React state for collapsible submenus
  const [openMenus, setOpenMenus] = useState({
    penta: activePath.startsWith('/penta'),
    phi: activePath.startsWith('/phi'),
    lattas: activePath.startsWith('/lattas'),
    lpk: activePath.startsWith('/lattas/lpk')
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Helper to check active status
  const isActive = (path) => activePath === path ? 'active' : '';

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'show' : ''}`} id="sidebar">
        {/* Brand */}
        <div className="sidebar-brand d-flex align-items-center gap-3">
          <img 
            src="/logo-pekanbaru.png" 
            width="42" 
            height="42" 
            className="bg-white p-1 rounded-2 shadow-sm flex-shrink-0" 
            alt="Logo Pekanbaru" 
          />
          <div>
            <div className="fw-bold text-white" style={{ fontSize: '13.5px', lineHeight: '1.2' }}>
              SIP DISNAKER
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(148,163,184,.55)', letterSpacing: '.2px' }}>
              Disnaker Kota Pekanbaru
            </div>
          </div>
        </div>

        {/* Scrollable nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-label">Menu Utama</div>
          <Link to="/" className={isActive('/')} onClick={() => isOpen && toggleSidebar()}>
            <i className="fa fa-chart-line"></i> Dashboard
          </Link>

          {/* ── PENTA ── */}
          {['admin', 'penta'].includes(role) && (
            <>
              <div className="sidebar-label">Bidang Penempatan</div>
              <button 
                className={`sidebar-toggle-btn ${activePath.startsWith('/penta') ? 'active' : ''}`}
                onClick={() => toggleMenu('penta')}
                aria-expanded={openMenus.penta}
              >
                <i className="fa fa-users"></i> Bidang Penta
              </button>
              {openMenus.penta && (
                <div className="submenu">
                  <Link to="/penta/lowongan" className={isActive('/penta/lowongan')} onClick={() => isOpen && toggleSidebar()}>
                    <i className="fa fa-briefcase"></i> Lowongan
                  </Link>
                  <Link to="/penta/tenaga-kerja" className={isActive('/penta/tenaga-kerja')} onClick={() => isOpen && toggleSidebar()}>
                    <i className="fa fa-user-check"></i> Tenaga Kerja
                  </Link>
                  <Link to="/penta/rekap" className={isActive('/penta/rekap')} onClick={() => isOpen && toggleSidebar()}>
                    <i className="fa fa-chart-pie"></i> Rekap Pendaftaran
                  </Link>
                </div>
              )}
            </>
          )}

          {/* ── PHI ── */}
          {['admin', 'phi'].includes(role) && (
            <>
              <div className="sidebar-label">Hubungan Industrial</div>
              <button 
                className={`sidebar-toggle-btn ${activePath.startsWith('/phi') ? 'active' : ''}`}
                onClick={() => toggleMenu('phi')}
                aria-expanded={openMenus.phi}
              >
                <i className="fa fa-file-contract"></i> Bidang PHI
              </button>
              {openMenus.phi && (
                <div className="submenu">
                  <Link to="/phi/pkwt" className={isActive('/phi/pkwt')} onClick={() => isOpen && toggleSidebar()}>
                    <i className="fa fa-file-signature"></i> Rekap PKWT
                  </Link>
                  <Link to="/phi/pengaduan" className={isActive('/phi/pengaduan')} onClick={() => isOpen && toggleSidebar()}>
                    <i className="fa fa-gavel"></i> Rekap Pengaduan Kasus
                  </Link>
                  <Link to="/phi/peraturan" className={isActive('/phi/peraturan')} onClick={() => isOpen && toggleSidebar()}>
                    <i className="fa fa-book"></i> Rekap Peraturan Perusahaan
                  </Link>
                </div>
              )}
            </>
          )}

          {/* ── LATTAS ── */}
          {['admin', 'lattas'].includes(role) && (
            <>
              <div className="sidebar-label">Pelatihan & LPK</div>
              <button 
                className={`sidebar-toggle-btn ${activePath.startsWith('/lattas') ? 'active' : ''}`}
                onClick={() => toggleMenu('lattas')}
                aria-expanded={openMenus.lattas}
              >
                <i className="fa fa-graduation-cap"></i> Bidang Lattas
              </button>
              {openMenus.lattas && (
                <div className="submenu">
                  <button 
                    className={`sidebar-toggle-btn ${activePath.startsWith('/lattas/lpk') ? 'active' : ''}`}
                    onClick={() => toggleMenu('lpk')}
                    style={{ paddingLeft: '30px' }}
                    aria-expanded={openMenus.lpk}
                  >
                    <i className="fa fa-building"></i> Lembaga Pelatihan Kerja
                  </button>
                  {openMenus.lpk && (
                    <div style={{ background: 'rgba(0,0,0,.08)' }}>
                      <Link 
                        to="/lattas/lpk-aktif" 
                        className={isActive('/lattas/lpk-aktif')} 
                        style={{ paddingLeft: '55px', fontSize: '11.5px' }}
                        onClick={() => isOpen && toggleSidebar()}
                      >
                        <i className="fa fa-circle-check"></i> LPK Aktif
                      </Link>
                      <Link 
                        to="/lattas/lpk-nonaktif" 
                        className={isActive('/lattas/lpk-nonaktif')} 
                        style={{ paddingLeft: '55px', fontSize: '11.5px' }}
                        onClick={() => isOpen && toggleSidebar()}
                      >
                        <i className="fa fa-circle-xmark"></i> LPK Tidak Aktif
                      </Link>
                    </div>
                  )}
                  <Link to="/lattas/pelatihan" className={isActive('/lattas/pelatihan')} onClick={() => isOpen && toggleSidebar()}>
                    <i className="fa fa-chalkboard-teacher"></i> Data Pelatihan
                  </Link>
                </div>
              )}
            </>
          )}

          {/* ── KELOLA PENGGUNA (ADMIN ONLY) ── */}
          {role === 'admin' && (
            <>
              <div className="sidebar-label" style={{ marginTop: '15px' }}>Pengaturan</div>
              <Link to="/users" className={isActive('/users')} onClick={() => isOpen && toggleSidebar()}>
                <i className="fa fa-users-cog"></i> Kelola Pengguna
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">© {new Date().getFullYear()} Disnaker Kota Pekanbaru</div>
      </aside>
    </>
  );
}
