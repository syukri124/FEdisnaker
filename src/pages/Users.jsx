import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Users({ onRoleSwitch }) {
  const [users, setUsers] = useState([]);
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('staf');
  const [editingId, setEditingId] = useState(null);

  const defaultUsers = [
    { id: 1, name: 'Administrator', username: 'superadmin', email: 'superadmin@disnaker.go.id', role: 'admin' },
    { id: 2, name: 'Wahyu Hidayat (Lattas)', username: 'lattas', email: 'wahyu@disnaker.go.id', role: 'lattas' },
    { id: 3, name: 'Surya Darma (Penta)', username: 'penta', email: 'surya@disnaker.go.id', role: 'penta' },
    { id: 4, name: 'Staf PHI', username: 'phi', email: 'phi@disnaker.go.id', role: 'phi' },
    { id: 5, name: 'Kepala Dinas Pekanbaru', username: 'pejabat', email: 'kadis@disnaker.go.id', role: 'pejabat' }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('users_list');
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      localStorage.setItem('users_list', JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('users_list', JSON.stringify(data));
    setUsers(data);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (users.some(x => x.username.toLowerCase() === formUsername.trim().toLowerCase())) {
      Swal.fire('Kesalahan', 'Username sudah digunakan oleh akun lain.', 'error');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formName,
      username: formUsername.trim().toLowerCase(),
      email: formEmail,
      role: formRole
    };

    const updated = [...users, newUser];
    saveToLocalStorage(updated);
    setAddModalOpen(false);
    resetForm();
    Swal.fire('Sukses', 'Akun pengguna baru berhasil ditambahkan.', 'success');
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormUsername(item.username);
    setFormEmail(item.email);
    setFormRole(item.role);
    setFormPassword('');
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (users.some(x => x.id !== editingId && x.username.toLowerCase() === formUsername.trim().toLowerCase())) {
      Swal.fire('Kesalahan', 'Username sudah digunakan oleh akun lain.', 'error');
      return;
    }

    const updated = users.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          name: formName,
          username: formUsername.trim().toLowerCase(),
          email: formEmail,
          role: formRole
        };
      }
      return item;
    });

    saveToLocalStorage(updated);
    setEditModalOpen(false);
    resetForm();
    Swal.fire('Sukses', 'Profil pengguna berhasil diperbarui.', 'success');
  };

  const handleDelete = (id) => {
    if (id === 1) {
      Swal.fire('Ditolak', 'Akun Master Administrator tidak dapat dihapus.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Hapus Akun Pengguna?',
      text: 'Akses pengguna ini ke sistem akan diblokir sepenuhnya!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = users.filter(item => item.id !== id);
        saveToLocalStorage(updated);
        Swal.fire('Dihapus!', 'Akun pengguna telah dihapus.', 'success');
      }
    });
  };

  const handleSimulateLogin = (item) => {
    const loggedUser = {
      name: item.name,
      username: item.username,
      role: item.role,
      token: 'mock-jwt-token-12345'
    };
    localStorage.setItem('user', JSON.stringify(loggedUser));
    onRoleSwitch(loggedUser);

    Swal.fire({
      icon: 'success',
      title: 'Simulasi Login Sukses!',
      text: `Sekarang Anda masuk sebagai: ${item.name} (${item.role.toUpperCase()})`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  const resetForm = () => {
    setFormName('');
    setFormUsername('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('staf');
    setEditingId(null);
  };

  return (
    <div>
      <div className="card card-modern shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="m-0 fw-bold"><i className="fa fa-users-cog text-primary me-2"></i>Manajemen Akun Pengguna</h5>
          <button className="btn btn-sm btn-primary" onClick={() => { resetForm(); setAddModalOpen(true); }}>
            <i className="fa fa-plus me-1"></i> Tambah Akun Baru
          </button>
        </div>
        <p className="text-muted small mt-2 mb-0">
          Super Admin dapat menambahkan, mengedit, atau menghapus pengguna. Gunakan tombol <b>Simulasi Login</b> di kolom Aksi untuk berpindah peran dan meninjau dashboard dari sudut pandang hak akses staf bidang lain atau pejabat secara langsung.
        </p>
      </div>

      <div className="card card-modern shadow-sm p-4">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th width="5%" className="text-center">No</th>
                <th width="25%">Nama Lengkap</th>
                <th width="20%">Username</th>
                <th width="25%">Email</th>
                <th width="12%" className="text-center">Hak Akses / Peran</th>
                <th width="13%" className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="fw-bold">{item.name}</td>
                  <td><code>{item.username}</code></td>
                  <td>{item.email}</td>
                  <td className="text-center">
                    <span className="badge bg-primary px-3 py-1 text-uppercase">{item.role}</span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-1">
                      <button className="btn btn-xs btn-outline-info py-1 px-2" onClick={() => openEditModal(item)} title="Edit Akun">
                        <i className="fa fa-pencil"></i>
                      </button>
                      <button className="btn btn-xs btn-outline-success py-1 px-2" onClick={() => handleSimulateLogin(item)} title="Simulasikan Login">
                        <i className="fa fa-right-to-bracket"></i>
                      </button>
                      {item.id !== 1 && (
                        <button className="btn btn-xs btn-outline-danger py-1 px-2" onClick={() => handleDelete(item.id)} title="Hapus Akun">
                          <i className="fa fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL TAMBAH USER ── */}
      {addModalOpen && (
        <>
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabindex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <form onSubmit={handleAddSubmit}>
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title fw-bold"><i className="fa fa-user-plus me-2"></i>Registrasi Akun Baru</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setAddModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Nama Lengkap</label>
                        <input type="text" className="form-control" placeholder="Nama lengkap staf" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Username</label>
                        <input type="text" className="form-control" placeholder="username login" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Hak Akses / Peran</label>
                        <select className="form-select" value={formRole} onChange={(e) => setFormRole(e.target.value)}>
                          <option value="admin">Super Admin (admin)</option>
                          <option value="lattas">Staf Lattas (lattas)</option>
                          <option value="penta">Staf Penta (penta)</option>
                          <option value="phi">Staf PHI (phi)</option>
                          <option value="pejabat">Pejabat (pejabat)</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Alamat Email</label>
                        <input type="email" className="form-control" placeholder="contoh@disnaker.go.id" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Password <span className="text-danger">*</span></label>
                        <input type="password" className="form-control" placeholder="Minimal 6 karakter" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required minLength="6" />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light border-0">
                    <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Batal</button>
                    <button type="submit" className="btn btn-primary">Daftarkan Akun</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
        </>
      )}

      {/* ── MODAL EDIT USER ── */}
      {editModalOpen && (
        <>
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabindex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-header bg-info text-white">
                    <h5 className="modal-title fw-bold"><i className="fa fa-user-pen me-2"></i>Ubah Profil Pengguna</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setEditModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Nama Lengkap</label>
                        <input type="text" className="form-control" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Username</label>
                        <input type="text" className="form-control" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Hak Akses / Peran</label>
                        <select className="form-select" value={formRole} onChange={(e) => setFormRole(e.target.value)}>
                          <option value="admin">Super Admin (admin)</option>
                          <option value="lattas">Staf Lattas (lattas)</option>
                          <option value="penta">Staf Penta (penta)</option>
                          <option value="phi">Staf PHI (phi)</option>
                          <option value="pejabat">Pejabat (pejabat)</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Alamat Email</label>
                        <input type="email" className="form-control" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light border-0">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Batal</button>
                    <button type="submit" className="btn btn-info text-white">Simpan Perubahan</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
        </>
      )}
    </div>
  );
}
