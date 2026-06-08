import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function LpkAktif() {
  const [lpks, setLpks] = useState([]);
  const [filterBulan, setFilterBulan] = useState('all');
  const [filterTahun, setFilterTahun] = useState('2026');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  
  // Form fields
  const [formNama, setFormNama] = useState('');
  const [formPimpinan, setFormPimpinan] = useState('');
  const [formTahunBerdiri, setFormTahunBerdiri] = useState('');
  const [formAlamat, setFormAlamat] = useState('');
  const [formBulan, setFormBulan] = useState(new Date().getMonth() + 1);
  const [formTahun, setFormTahun] = useState('2026');
  const [editingId, setEditingId] = useState(null);

  // Import fields
  const [importFile, setImportFile] = useState(null);
  const [importBulan, setImportBulan] = useState(new Date().getMonth() + 1);
  const [importTahun, setImportTahun] = useState('2026');

  // Initial Data
  const defaultLpks = [
    { id: 1, nama_lpk: 'LPK Global Computer', nama_pimpinan: 'H. Suherman, M.Kom', tahun_berdiri: 2012, alamat: 'Jl. Jenderal Sudirman No. 125, Pekanbaru', status: 'aktif', bulan: 5, tahun: 2026 },
    { id: 2, nama_lpk: 'LPK Kartini Menjahit', nama_pimpinan: 'Hj. Kartini', tahun_berdiri: 2008, alamat: 'Jl. HR. Subrantas Km. 10, Pekanbaru', status: 'aktif', bulan: 5, tahun: 2026 },
    { id: 3, nama_lpk: 'LPK Otomotif Riau', nama_pimpinan: 'Ir. M. Yusuf', tahun_berdiri: 2015, alamat: 'Jl. Soekarno Hatta No. 88, Pekanbaru', status: 'aktif', bulan: 5, tahun: 2026 },
    { id: 4, nama_lpk: 'LPK Bahtera Bahari', nama_pimpinan: 'Sujatmiko, SE', tahun_berdiri: 2010, alamat: 'Jl. Riau No. 45, Pekanbaru', status: 'tidak aktif', bulan: 5, tahun: 2026 },
    { id: 5, nama_lpk: 'LPK Cepat Pintar', nama_pimpinan: 'Rudi Wijaya', tahun_berdiri: 2018, alamat: 'Jl. Tuanku Tambusai No. 12, Pekanbaru', status: 'tidak aktif', bulan: 5, tahun: 2026 }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('lpks');
    if (stored) {
      setLpks(JSON.parse(stored));
    } else {
      localStorage.setItem('lpks', JSON.stringify(defaultLpks));
      setLpks(defaultLpks);
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('lpks', JSON.stringify(data));
    setLpks(data);
  };

  // Filter & Search Logic
  const filteredLpks = lpks.filter(item => {
    if (item.status !== 'aktif') return false;
    if (filterBulan !== 'all' && item.bulan !== parseInt(filterBulan)) return false;
    if (filterTahun !== 'all' && item.tahun !== parseInt(filterTahun)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.nama_lpk.toLowerCase().includes(q) ||
        (item.nama_pimpinan && item.nama_pimpinan.toLowerCase().includes(q)) ||
        (item.alamat && item.alamat.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Checkbox functions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredLpks.map(x => x.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Add LPK
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newLpk = {
      id: Date.now(),
      nama_lpk: formNama,
      nama_pimpinan: formPimpinan || '-',
      tahun_berdiri: parseInt(formTahunBerdiri) || '-',
      alamat: formAlamat || '-',
      status: 'aktif',
      bulan: parseInt(formBulan),
      tahun: parseInt(formTahun)
    };
    const updated = [newLpk, ...lpks];
    saveToLocalStorage(updated);
    setAddModalOpen(false);
    resetForm();
    Swal.fire('Sukses', 'LPK Aktif berhasil ditambahkan secara manual.', 'success');
  };

  // Edit LPK
  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormNama(item.nama_lpk);
    setFormPimpinan(item.nama_pimpinan);
    setFormTahunBerdiri(item.tahun_berdiri);
    setFormAlamat(item.alamat);
    setFormBulan(item.bulan);
    setFormTahun(item.tahun);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updated = lpks.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          nama_lpk: formNama,
          nama_pimpinan: formPimpinan || '-',
          tahun_berdiri: parseInt(formTahunBerdiri) || '-',
          alamat: formAlamat || '-',
          bulan: parseInt(formBulan),
          tahun: parseInt(formTahun)
        };
      }
      return item;
    });
    saveToLocalStorage(updated);
    setEditModalOpen(false);
    resetForm();
    Swal.fire('Sukses', 'Data LPK berhasil diperbarui.', 'success');
  };

  // Change status to inactive
  const handleDeactivate = (id) => {
    Swal.fire({
      title: 'Ubah Status LPK?',
      text: 'LPK ini akan dipindahkan ke daftar LPK Tidak Aktif.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Nonaktifkan!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = lpks.map(item => {
          if (item.id === id) {
            return { ...item, status: 'tidak aktif' };
          }
          return item;
        });
        saveToLocalStorage(updated);
        Swal.fire('Dinonaktifkan!', 'Status LPK berhasil diubah menjadi tidak aktif.', 'success');
      }
    });
  };

  // Delete LPK
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Data LPK?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = lpks.filter(item => item.id !== id);
        saveToLocalStorage(updated);
        setSelectedIds(prev => prev.filter(x => x !== id));
        Swal.fire('Dihapus!', 'Data LPK telah dihapus dari sistem.', 'success');
      }
    });
  };

  // Bulk delete
  const handleBulkDelete = () => {
    Swal.fire({
      title: `Hapus ${selectedIds.length} Data Terpilih?`,
      text: 'Semua data LPK terpilih akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus Semua!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = lpks.filter(item => !selectedIds.includes(item.id));
        saveToLocalStorage(updated);
        setSelectedIds([]);
        Swal.fire('Dihapus!', 'Data LPK terpilih berhasil dihapus.', 'success');
      }
    });
  };

  // Simulate Excel Export
  const handleExportExcel = () => {
    // Generate CSV mockup
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No,Nama LPK,Pimpinan,Tahun Berdiri,Alamat,Status,Bulan,Tahun\n";
    filteredLpks.forEach((item, index) => {
      csvContent += `${index + 1},"${item.nama_lpk}","${item.nama_pimpinan}",${item.tahun_berdiri},"${item.alamat}",${item.status},${item.bulan},${item.tahun}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_LPK_Aktif_${filterBulan}_${filterTahun}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire('Export Sukses', 'Berkas rekap LPK Aktif (.csv) berhasil diunduh.', 'success');
  };

  // Simulate Excel Import
  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importFile) {
      Swal.fire('Peringatan', 'Pilih berkas Excel terlebih dahulu.', 'warning');
      return;
    }

    // Mock parsing rows
    const mockRows = [
      { nama_lpk: 'LPK Mandiri Jaya IT', pimpinan: 'Suprapto, M.T', berdiri: 2020, alamat: 'Jl. Riau No. 104' },
      { nama_lpk: 'LPK Cendana Hospitality', pimpinan: 'Indah Lestari, MM', berdiri: 2017, alamat: 'Jl. Sudirman Gg. Melati' },
      { nama_lpk: 'LPK Menjahit Melati', pimpinan: 'Siti Hajar', berdiri: 2021, alamat: 'Jl. Kaharuddin Nasution' }
    ];

    const newRecords = mockRows.map((row, i) => ({
      id: Date.now() + i,
      nama_lpk: row.nama_lpk,
      nama_pimpinan: row.pimpinan,
      tahun_berdiri: row.berdiri,
      alamat: row.alamat,
      status: 'aktif',
      bulan: parseInt(importBulan),
      tahun: parseInt(importTahun)
    }));

    const updated = [...newRecords, ...lpks];
    saveToLocalStorage(updated);
    setImportModalOpen(false);
    setImportFile(null);
    Swal.fire('Import Sukses', `3 data LPK baru berhasil diimpor ke bulan ${importBulan} tahun ${importTahun}.`, 'success');
  };

  const resetForm = () => {
    setFormNama('');
    setFormPimpinan('');
    setFormTahunBerdiri('');
    setFormAlamat('');
    setFormBulan(new Date().getMonth() + 1);
    setFormTahun('2026');
    setEditingId(null);
  };

  return (
    <div>
      {/* Page header and filter */}
      <div className="card card-modern shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <h5 className="m-0 fw-bold"><i className="fa fa-circle-check text-success me-2"></i>Rekapitulasi LPK Aktif</h5>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-success" onClick={handleExportExcel}>
              <i className="fa fa-file-excel me-1"></i> Export Excel
            </button>
            <button className="btn btn-sm btn-outline-success" onClick={() => setImportModalOpen(true)}>
              <i className="fa fa-file-import me-1"></i> Impor Excel
            </button>
            <button className="btn btn-sm btn-primary" onClick={() => { resetForm(); setAddModalOpen(true); }}>
              <i className="fa fa-plus me-1"></i> Tambah Manual
            </button>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-sm-6 col-md-3">
            <label className="form-label font-bold text-muted small">Filter Bulan</label>
            <select className="form-select form-select-sm" value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)}>
              <option value="all">Semua Bulan</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
          <div className="col-sm-6 col-md-3">
            <label className="form-label font-bold text-muted small">Filter Tahun</label>
            <select className="form-select form-select-sm" value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)}>
              <option value="all">Semua Tahun</option>
              <option value="2027">2027</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label font-bold text-muted small">Cari LPK</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Cari berdasarkan nama LPK, pimpinan, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card card-modern shadow-sm p-4">
        {selectedIds.length > 0 && (
          <div className="d-flex align-items-center justify-content-between alert alert-danger py-2 px-3 mb-3 border-0">
            <span className="small fw-semibold"><i className="fa fa-info-circle me-2"></i>{selectedIds.length} data terpilih</span>
            <button className="btn btn-sm btn-danger py-1" onClick={handleBulkDelete}>
              <i className="fa fa-trash-can me-1"></i> Hapus Terpilih
            </button>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th width="3%" className="text-center">
                  <input
                    type="checkbox"
                    checked={filteredLpks.length > 0 && selectedIds.length === filteredLpks.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th width="4%" className="text-center">No</th>
                <th width="25%">Nama LPK</th>
                <th width="20%">Pimpinan</th>
                <th width="10%" className="text-center">Tahun Berdiri</th>
                <th width="20%">Alamat</th>
                <th width="8%" className="text-center">Status</th>
                <th width="10%" className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLpks.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">Tidak ada data LPK aktif ditemukan.</td>
                </tr>
              ) : (
                filteredLpks.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />
                    </td>
                    <td className="text-center">{index + 1}</td>
                    <td className="fw-bold">{item.nama_lpk}</td>
                    <td>{item.nama_pimpinan}</td>
                    <td className="text-center">{item.tahun_berdiri}</td>
                    <td className="small text-muted">{item.alamat}</td>
                    <td className="text-center">
                      <span className="badge bg-success">Aktif</span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <button className="btn btn-sm btn-outline-info" onClick={() => openEditModal(item)} title="Edit LPK">
                          <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleDeactivate(item.id)} title="Set Tidak Aktif">
                          <i className="fa fa-circle-xmark"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)} title="Hapus LPK">
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL TAMBAH MANUAL ── */}
      {addModalOpen && (
        <>
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabindex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <form onSubmit={handleAddSubmit}>
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title fw-bold"><i className="fa fa-plus me-2"></i>Tambah Data LPK Baru</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setAddModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">Bulan Pencatatan</label>
                        <select className="form-select" value={formBulan} onChange={(e) => setFormBulan(e.target.value)}>
                          <option value="1">Januari</option>
                          <option value="2">Februari</option>
                          <option value="3">Maret</option>
                          <option value="4">April</option>
                          <option value="5">Mei</option>
                          <option value="6">Juni</option>
                          <option value="7">Juli</option>
                          <option value="8">Agustus</option>
                          <option value="9">September</option>
                          <option value="10">Oktober</option>
                          <option value="11">November</option>
                          <option value="12">Desember</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Tahun Pencatatan</label>
                        <select className="form-select" value={formTahun} onChange={(e) => setFormTahun(e.target.value)}>
                          <option value="2027">2027</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Nama LPK <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="Nama lembaga pelatihan" value={formNama} onChange={(e) => setFormNama(e.target.value)} required />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Nama Pimpinan</label>
                        <input type="text" className="form-control" placeholder="Nama pimpinan lembaga" value={formPimpinan} onChange={(e) => setFormPimpinan(e.target.value)} />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Tahun Berdiri</label>
                        <input type="number" className="form-control" placeholder="Tahun berdiri" value={formTahunBerdiri} onChange={(e) => setFormTahunBerdiri(e.target.value)} />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Status Keaktifan</label>
                        <input type="text" className="form-control bg-light" value="Aktif" readOnly />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Alamat Lembaga</label>
                        <textarea className="form-control" rows="3" placeholder="Alamat lengkap LPK" value={formAlamat} onChange={(e) => setFormAlamat(e.target.value)}></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light border-0">
                    <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Batal</button>
                    <button type="submit" className="btn btn-primary">Simpan LPK</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
        </>
      )}

      {/* ── MODAL EDIT MANUAL ── */}
      {editModalOpen && (
        <>
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabindex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-header bg-info text-white">
                    <h5 className="modal-title fw-bold"><i className="fa fa-pencil me-2"></i>Ubah Data LPK</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setEditModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">Bulan Pencatatan</label>
                        <select className="form-select" value={formBulan} onChange={(e) => setFormBulan(e.target.value)}>
                          <option value="1">Januari</option>
                          <option value="2">Februari</option>
                          <option value="3">Maret</option>
                          <option value="4">April</option>
                          <option value="5">Mei</option>
                          <option value="6">Juni</option>
                          <option value="7">Juli</option>
                          <option value="8">Agustus</option>
                          <option value="9">September</option>
                          <option value="10">Oktober</option>
                          <option value="11">November</option>
                          <option value="12">Desember</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Tahun Pencatatan</label>
                        <select className="form-select" value={formTahun} onChange={(e) => setFormTahun(e.target.value)}>
                          <option value="2027">2027</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Nama LPK <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formNama} onChange={(e) => setFormNama(e.target.value)} required />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Nama Pimpinan</label>
                        <input type="text" className="form-control" value={formPimpinan} onChange={(e) => setFormPimpinan(e.target.value)} />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Tahun Berdiri</label>
                        <input type="number" className="form-control" value={formTahunBerdiri} onChange={(e) => setFormTahunBerdiri(e.target.value)} />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Status Keaktifan</label>
                        <input type="text" className="form-control bg-light" value="Aktif" readOnly />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Alamat Lembaga</label>
                        <textarea className="form-control" rows="3" value={formAlamat} onChange={(e) => setFormAlamat(e.target.value)}></textarea>
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

      {/* ── MODAL IMPOR EXCEL ── */}
      {importModalOpen && (
        <>
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabindex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <form onSubmit={handleImportSubmit}>
                  <div className="modal-header bg-success text-white">
                    <h5 className="modal-title fw-bold"><i className="fa fa-file-import me-2"></i>Impor Data LPK via Excel</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setImportModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="alert alert-info py-2 px-3 mb-3">
                      <p className="mb-1 small fw-semibold">Panduan Impor Data LPK:</p>
                      <ul className="mb-0 small" style={{ paddingLeft: '1.2rem' }}>
                        <li>Gunakan template Excel resmi LPK.</li>
                        <li>Header kolom wajib: <code>Nama LPK</code>, <code>Pimpinan</code>, <code>Tahun Berdiri</code>, <code>Alamat</code>.</li>
                      </ul>
                      <a href="#" className="small mt-2 d-inline-block fw-bold" onClick={(e) => { e.preventDefault(); Swal.fire('Download', 'Template excel_lpk.xlsx berhasil diunduh.', 'success'); }}>
                        <i className="fa fa-download me-1"></i>Unduh Template Impor LPK
                      </a>
                    </div>

                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">Bulan Target</label>
                        <select className="form-select form-select-sm" value={importBulan} onChange={(e) => setImportBulan(e.target.value)}>
                          <option value="1">Januari</option>
                          <option value="2">Februari</option>
                          <option value="3">Maret</option>
                          <option value="4">April</option>
                          <option value="5">Mei</option>
                          <option value="6">Juni</option>
                          <option value="7">Juli</option>
                          <option value="8">Agustus</option>
                          <option value="9">September</option>
                          <option value="10">Oktober</option>
                          <option value="11">November</option>
                          <option value="12">Desember</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Tahun Target</label>
                        <select className="form-select form-select-sm" value={importTahun} onChange={(e) => setImportTahun(e.target.value)}>
                          <option value="2027">2027</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Unggah File Excel</label>
                        <input
                          type="file"
                          className="form-control"
                          accept=".xlsx, .xls, .csv"
                          onChange={(e) => setImportFile(e.target.files[0])}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light border-0">
                    <button type="button" className="btn btn-secondary" onClick={() => setImportModalOpen(false)}>Batal</button>
                    <button type="submit" className="btn btn-success">Mulai Impor</button>
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
