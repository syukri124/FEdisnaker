import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Pelatihan() {
  const [trainings, setTrainings] = useState([]);
  const [lpkOptions, setLpkOptions] = useState([]);
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
  const [formLpk, setFormLpk] = useState('');
  const [formProgram, setFormProgram] = useState('');
  const [formPeserta, setFormPeserta] = useState('');
  const [formPaket, setFormPaket] = useState('');
  const [formBulan, setFormBulan] = useState(new Date().getMonth() + 1);
  const [formTahun, setFormTahun] = useState('2026');
  const [editingId, setEditingId] = useState(null);

  // Import fields
  const [importFile, setImportFile] = useState(null);
  const [importBulan, setImportBulan] = useState(new Date().getMonth() + 1);
  const [importTahun, setImportTahun] = useState('2026');

  // Initial Data
  const defaultTrainings = [
    { id: 1, nama_lpk: 'LPK Global Computer', program_pelatihan: 'Teknisi Jaringan & IT Support', jumlah_peserta: 25, jumlah_paket: 3, bulan: 5, tahun: 2026 },
    { id: 2, nama_lpk: 'LPK Kartini Menjahit', program_pelatihan: 'Menjahit & Tata Busana Modis', jumlah_peserta: 16, jumlah_paket: 2, bulan: 5, tahun: 2026 },
    { id: 3, nama_lpk: 'LPK Otomotif Riau', program_pelatihan: 'Teknisi Sepeda Motor Injeksi', jumlah_peserta: 12, jumlah_paket: 1, bulan: 5, tahun: 2026 }
  ];

  useEffect(() => {
    // Load trainings
    const storedTrainings = localStorage.getItem('lpk_trainings');
    if (storedTrainings) {
      setTrainings(JSON.parse(storedTrainings));
    } else {
      localStorage.setItem('lpk_trainings', JSON.stringify(defaultTrainings));
      setTrainings(defaultTrainings);
    }

    // Load LPK Options from 'lpks' state
    const storedLpks = localStorage.getItem('lpks');
    if (storedLpks) {
      const activeLpks = JSON.parse(storedLpks).filter(x => x.status === 'aktif');
      setLpkOptions(activeLpks.map(x => x.nama_lpk));
      if (activeLpks.length > 0) setFormLpk(activeLpks[0].nama_lpk);
    } else {
      setLpkOptions(['LPK Global Computer', 'LPK Kartini Menjahit', 'LPK Otomotif Riau']);
      setFormLpk('LPK Global Computer');
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('lpk_trainings', JSON.stringify(data));
    setTrainings(data);
  };

  // Filter & Search Logic
  const filteredTrainings = trainings.filter(item => {
    if (filterBulan !== 'all' && item.bulan !== parseInt(filterBulan)) return false;
    if (filterTahun !== 'all' && item.tahun !== parseInt(filterTahun)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.nama_lpk.toLowerCase().includes(q) ||
        item.program_pelatihan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Checkbox functions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredTrainings.map(x => x.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Add Training
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newTraining = {
      id: Date.now(),
      nama_lpk: formLpk,
      program_pelatihan: formProgram,
      jumlah_peserta: parseInt(formPeserta) || 0,
      jumlah_paket: parseInt(formPaket) || 0,
      bulan: parseInt(formBulan),
      tahun: parseInt(formTahun)
    };
    const updated = [newTraining, ...trainings];
    saveToLocalStorage(updated);
    setAddModalOpen(false);
    resetForm();
    Swal.fire('Sukses', 'Program pelatihan baru berhasil ditambahkan.', 'success');
  };

  // Edit Training
  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormLpk(item.nama_lpk);
    setFormProgram(item.program_pelatihan);
    setFormPeserta(item.jumlah_peserta);
    setFormPaket(item.jumlah_paket);
    setFormBulan(item.bulan);
    setFormTahun(item.tahun);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updated = trainings.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          nama_lpk: formLpk,
          program_pelatihan: formProgram,
          jumlah_peserta: parseInt(formPeserta) || 0,
          jumlah_paket: parseInt(formPaket) || 0,
          bulan: parseInt(formBulan),
          tahun: parseInt(formTahun)
        };
      }
      return item;
    });
    saveToLocalStorage(updated);
    setEditModalOpen(false);
    resetForm();
    Swal.fire('Sukses', 'Data pelatihan berhasil diperbarui.', 'success');
  };

  // Delete Training
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Data Pelatihan?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = trainings.filter(item => item.id !== id);
        saveToLocalStorage(updated);
        setSelectedIds(prev => prev.filter(x => x !== id));
        Swal.fire('Dihapus!', 'Data pelatihan telah dihapus dari sistem.', 'success');
      }
    });
  };

  // Bulk delete
  const handleBulkDelete = () => {
    Swal.fire({
      title: `Hapus ${selectedIds.length} Data Terpilih?`,
      text: 'Semua data pelatihan terpilih akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus Semua!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = trainings.filter(item => !selectedIds.includes(item.id));
        saveToLocalStorage(updated);
        setSelectedIds([]);
        Swal.fire('Dihapus!', 'Data pelatihan terpilih berhasil dihapus.', 'success');
      }
    });
  };

  // Simulate Excel Export
  const handleExportExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No,Nama LPK,Program Pelatihan,Jumlah Peserta,Jumlah Paket,Bulan,Tahun\n";
    filteredTrainings.forEach((item, index) => {
      csvContent += `${index + 1},"${item.nama_lpk}","${item.program_pelatihan}",${item.jumlah_peserta},${item.jumlah_paket},${item.bulan},${item.tahun}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Pelatihan_LPK_${filterBulan}_${filterTahun}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire('Export Sukses', 'Berkas rekap Pelatihan (.csv) berhasil diunduh.', 'success');
  };

  // Simulate Excel Import
  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importFile) {
      Swal.fire('Peringatan', 'Pilih berkas Excel terlebih dahulu.', 'warning');
      return;
    }

    const mockRows = [
      { lpk: 'LPK Global Computer', program: 'Desain Grafis & Multimedia', peserta: 18, paket: 2 },
      { lpk: 'LPK Kartini Menjahit', program: 'Sulam Pita & Bordir Komputer', peserta: 10, paket: 1 }
    ];

    const newRecords = mockRows.map((row, i) => ({
      id: Date.now() + i,
      nama_lpk: row.lpk,
      program_pelatihan: row.program,
      jumlah_peserta: row.peserta,
      jumlah_paket: row.paket,
      bulan: parseInt(importBulan),
      tahun: parseInt(importTahun)
    }));

    const updated = [...newRecords, ...trainings];
    saveToLocalStorage(updated);
    setImportModalOpen(false);
    setImportFile(null);
    Swal.fire('Import Sukses', `2 data Pelatihan baru berhasil diimpor.`, 'success');
  };

  const resetForm = () => {
    if (lpkOptions.length > 0) setFormLpk(lpkOptions[0]);
    setFormProgram('');
    setFormPeserta('');
    setFormPaket('');
    setFormBulan(new Date().getMonth() + 1);
    setFormTahun('2026');
    setEditingId(null);
  };

  return (
    <div>
      {/* Page header and filter */}
      <div className="card card-modern shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <h5 className="m-0 fw-bold"><i className="fa fa-chalkboard-teacher text-primary me-2"></i>Rekapitulasi Pelatihan Kerja</h5>
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
            <label className="form-label font-bold text-muted small">Cari Program Pelatihan</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Cari berdasarkan nama LPK atau nama program..."
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
                    checked={filteredTrainings.length > 0 && selectedIds.length === filteredTrainings.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th width="4%" className="text-center">No</th>
                <th width="25%">Nama Lembaga (LPK)</th>
                <th width="30%">Program Pelatihan</th>
                <th width="13%" className="text-center">Jumlah Peserta</th>
                <th width="12%" className="text-center">Jumlah Paket</th>
                <th width="13%" className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">Tidak ada data pelatihan ditemukan.</td>
                </tr>
              ) : (
                filteredTrainings.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />
                    </td>
                    <td className="text-center">{index + 1}</td>
                    <td className="fw-bold text-dark">{item.nama_lpk}</td>
                    <td>{item.program_pelatihan}</td>
                    <td className="text-center fw-semibold">{item.jumlah_peserta} Orang</td>
                    <td className="text-center">{item.jumlah_paket} Paket</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <button className="btn btn-sm btn-outline-info" onClick={() => openEditModal(item)} title="Edit Pelatihan">
                          <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)} title="Hapus Pelatihan">
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
                    <h5 className="modal-title fw-bold"><i className="fa fa-plus me-2"></i>Tambah Rekap Pelatihan</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setAddModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">Bulan Pelaporan</label>
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
                        <label className="form-label fw-semibold">Tahun Pelaporan</label>
                        <select className="form-select" value={formTahun} onChange={(e) => setFormTahun(e.target.value)}>
                          <option value="2027">2027</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Pilih Lembaga Pelatihan (LPK)</label>
                        <select className="form-select" value={formLpk} onChange={(e) => setFormLpk(e.target.value)} required>
                          {lpkOptions.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Program Pelatihan <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="Nama program (misal: Las, Operator Komputer)" value={formProgram} onChange={(e) => setFormProgram(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Jumlah Peserta (Orang) <span className="text-danger">*</span></label>
                        <input type="number" className="form-control" placeholder="Jumlah peserta" value={formPeserta} onChange={(e) => setFormPeserta(e.target.value)} required min="0" />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Jumlah Paket <span className="text-danger">*</span></label>
                        <input type="number" className="form-control" placeholder="Jumlah paket pelatihan" value={formPaket} onChange={(e) => setFormPaket(e.target.value)} required min="0" />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light border-0">
                    <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Batal</button>
                    <button type="submit" className="btn btn-primary">Simpan Data</button>
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
                    <h5 className="modal-title fw-bold"><i className="fa fa-pencil me-2"></i>Ubah Data Pelatihan</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setEditModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">Bulan Pelaporan</label>
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
                        <label className="form-label fw-semibold">Tahun Pelaporan</label>
                        <select className="form-select" value={formTahun} onChange={(e) => setFormTahun(e.target.value)}>
                          <option value="2027">2027</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Lembaga Pelatihan (LPK)</label>
                        <select className="form-select" value={formLpk} onChange={(e) => setFormLpk(e.target.value)} required>
                          {lpkOptions.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Program Pelatihan <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formProgram} onChange={(e) => setFormProgram(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Jumlah Peserta (Orang) <span className="text-danger">*</span></label>
                        <input type="number" className="form-control" value={formPeserta} onChange={(e) => setFormPeserta(e.target.value)} required min="0" />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Jumlah Paket <span className="text-danger">*</span></label>
                        <input type="number" className="form-control" value={formPaket} onChange={(e) => setFormPaket(e.target.value)} required min="0" />
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
                    <h5 className="modal-title fw-bold"><i className="fa fa-file-import me-2"></i>Impor Data Pelatihan via Excel</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setImportModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="alert alert-info py-2 px-3 mb-3">
                      <p className="mb-1 small fw-semibold">Panduan Impor Data Pelatihan:</p>
                      <ul className="mb-0 small" style={{ paddingLeft: '1.2rem' }}>
                        <li>Header kolom wajib: <code>Nama LPK</code>, <code>Program Pelatihan</code>, <code>Jumlah Peserta</code>, <code>Jumlah Paket</code>.</li>
                      </ul>
                      <a href="#" className="small mt-2 d-inline-block fw-bold" onClick={(e) => { e.preventDefault(); Swal.fire('Download', 'Template excel_pelatihan.xlsx berhasil diunduh.', 'success'); }}>
                        <i className="fa fa-download me-1"></i>Unduh Template Impor Pelatihan
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
