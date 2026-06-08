import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Predefined demo credentials matching standard roles
    const users = {
      superadmin: { name: 'Super Admin', role: 'admin', pass: 'superadmin' },
      admin: { name: 'Super Admin', role: 'admin', pass: 'admin' },
      lattas: { name: 'Staf Lattas', role: 'lattas', pass: 'lattas' },
      penta: { name: 'Staf Penta', role: 'penta', pass: 'penta' },
      phi: { name: 'Staf PHI', role: 'phi', pass: 'phi' },
      pejabat: { name: 'Kepala Bidang / Pejabat', role: 'pejabat', pass: 'pejabat' }
    };

    const trimmedUser = username.trim().toLowerCase();
    const userMatch = users[trimmedUser];

    if (userMatch && password === userMatch.pass) {
      // Save session info to localStorage
      const loggedUser = {
        name: userMatch.name,
        username: trimmedUser,
        role: userMatch.role,
        token: 'mock-jwt-token-12345'
      };
      localStorage.setItem('user', JSON.stringify(loggedUser));
      
      // Notify parent app
      onLogin(loggedUser);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Masuk!',
        text: `Selamat datang kembali, ${userMatch.name}!`,
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      setError('Kredensial tidak valid! Gunakan username/password demo: superadmin, lattas, penta, phi, pejabat.');
    }
  };

  return (
    <div className="login-body-wrapper">
      <div className="login-wrapper">
        {/* ── LEFT PANEL ── */}
        <div className="login-left">
          <img src="/logo-pekanbaru.png" className="logo-img" alt="Logo Pekanbaru" />
          <div>
            <div className="app-name">SIP DISNAKER</div>
            <div className="app-sub">Sistem Pelaporan</div>
            <div className="divider-line"></div>
            <p className="app-desc">
              Dinas Tenaga Kerja<br />Kota Pekanbaru<br /><br />
              Sistem Informasi Pelaporan<br />Bidang Penta, PHI &amp; Lattas
            </p>
            <p className="copy">© {new Date().getFullYear()} Disnaker Kota Pekanbaru</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="login-right">
          <h4 className="login-heading">Selamat Datang</h4>
          <p className="login-sub">Masuk ke akun Anda untuk melanjutkan</p>

          {error && (
            <div className="alert-danger">
              <i className="fa fa-circle-exclamation me-1"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group-icon">
              <label htmlFor="username">Username</label>
              <div className="field-wrap">
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  placeholder="Masukkan username (contoh: admin, lattas)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
                <i className="fa fa-user field-icon"></i>
              </div>
            </div>

            <div className="input-group-icon">
              <label htmlFor="password">Password</label>
              <div className="field-wrap">
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <i className="fa fa-lock field-icon"></i>
              </div>
            </div>

            <button type="submit" className="btn-login">
              <i className="fa fa-right-to-bracket me-2"></i> Masuk ke Sistem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
