import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LpkAktif from './pages/LpkAktif';
import LpkNonaktif from './pages/LpkNonaktif';
import Pelatihan from './pages/Pelatihan';
import Users from './pages/Users';
import Placeholder from './pages/Placeholder';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check local storage session on load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRoleSwitch = (newUser) => {
    setUser(newUser);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh', width: '100vw' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
        />

        {/* Protected Routes Wrapper */}
        <Route 
          path="/*" 
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <div className="app-layout">
                {/* Mobile Sidebar Overlay */}
                <div 
                  className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} 
                  id="sidebarOverlay" 
                  onClick={toggleSidebar}
                ></div>

                {/* Sidebar */}
                <Sidebar 
                  role={user.role} 
                  isOpen={sidebarOpen} 
                  toggleSidebar={toggleSidebar} 
                />

                {/* Content Wrapper */}
                <div className="content-wrapper">
                  {/* Top Bar */}
                  <Topbar 
                    role={user.role} 
                    onLogout={handleLogout} 
                    toggleSidebar={toggleSidebar} 
                  />

                  {/* Main Router Content */}
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Dashboard role={user.role} />} />
                      
                      {/* LATTAS Routes */}
                      {['admin', 'lattas'].includes(user.role) && (
                        <>
                          <Route path="/lattas/lpk-aktif" element={<LpkAktif />} />
                          <Route path="/lattas/lpk-nonaktif" element={<LpkNonaktif />} />
                          <Route path="/lattas/pelatihan" element={<Pelatihan />} />
                        </>
                      )}

                      {/* PENTA Routes */}
                      {['admin', 'penta', 'pejabat'].includes(user.role) && (
                        <>
                          <Route path="/penta/lowongan" element={<Placeholder />} />
                          <Route path="/penta/tenaga-kerja" element={<Placeholder />} />
                          <Route path="/penta/rekap" element={<Placeholder />} />
                        </>
                      )}

                      {/* PHI Routes */}
                      {['admin', 'phi', 'pejabat'].includes(user.role) && (
                        <>
                          <Route path="/phi/pkwt" element={<Placeholder />} />
                          <Route path="/phi/pengaduan" element={<Placeholder />} />
                          <Route path="/phi/peraturan" element={<Placeholder />} />
                        </>
                      )}

                      {/* ADMIN ONLY Routes */}
                      {user.role === 'admin' && (
                        <Route path="/users" element={<Users onRoleSwitch={handleRoleSwitch} />} />
                      )}

                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

