import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Placeholder() {
  const location = useLocation();
  const path = location.pathname;

  // Determine page title, icon, color, and headers/data based on path
  let title = 'Halaman Bidang';
  let icon = 'fa-file-contract';
  let badgeColor = '#64748b';
  let headers = ['No', 'Kolom 1', 'Kolom 2', 'Kolom 3', 'Status'];
  let data = [];

  if (path === '/penta/lowongan') {
    title = 'Daftar Lowongan Pekerjaan (Penta)';
    icon = 'fa-briefcase';
    badgeColor = '#06b6d4';
    headers = ['No', 'Nama Perusahaan', 'Posisi Lowongan', 'Jumlah Kuota', 'Status'];
    data = [
      { c1: 'PT. Riau Makmur Jaya', c2: 'Staff Administrasi', c3: '3 Orang', status: 'TERBUKA' },
      { c1: 'CV. Pekanbaru Digital', c2: 'Frontend Developer', c3: '2 Orang', status: 'TERBUKA' },
      { c1: 'Hotel Grand Central', c2: 'Receptionist', c3: '1 Orang', status: 'TERBUKA' },
      { c1: 'PT. PHR Riau', c2: 'Operations Supervisor', c3: '5 Orang', status: 'TERTUTUP' }
    ];
  } else if (path === '/penta/tenaga-kerja') {
    title = 'Daftar Pencari Kerja (Penta)';
    icon = 'fa-user-check';
    badgeColor = '#3b82f6';
    headers = ['No', 'Nama Pencari Kerja', 'Email', 'No. Telepon', 'Status Verifikasi'];
    data = [
      { c1: 'Ahmad Fauzi', c2: 'fauzi.ahmad@gmail.com', c3: '08123456789', status: 'DIVERIFIKASI' },
      { c1: 'Siti Rahma', c2: 'siti.rahma@yahoo.com', c3: '08129876543', status: 'DIVERIFIKASI' },
      { c1: 'Budi Santoso', c2: 'budi.santoso@outlook.com', c3: '08561234567', status: 'BELUM DIVERIFIKASI' },
      { c1: 'Dewi Lestari', c2: 'dewi.lestari@gmail.com', c3: '08138765432', status: 'DIVERIFIKASI' }
    ];
  } else if (path === '/penta/rekap') {
    title = 'Rekapitulasi Pendaftaran (Penta)';
    icon = 'fa-chart-pie';
    badgeColor = '#6366f1';
    headers = ['No', 'Periode Pelaporan', 'Total Pencari Kerja', 'Total Lowongan', 'Penempatan Selesai'];
    data = [
      { c1: 'Mei 2026', c2: '250 Orang', c3: '105 Posisi', status: '95 Orang' },
      { c1: 'April 2026', c2: '220 Orang', c3: '90 Posisi', status: '85 Orang' },
      { c1: 'Maret 2026', c2: '190 Orang', c3: '80 Posisi', status: '70 Orang' }
    ];
  } else if (path === '/phi/pkwt') {
    title = 'Rekapitulasi Laporan PKWT (PHI)';
    icon = 'fa-file-signature';
    badgeColor = '#f97316';
    headers = ['No', 'Nama Perusahaan', 'Nama Pekerja', 'Nomor Kontrak PKWT', 'Status Laporan'];
    data = [
      { c1: 'PT. Indofood CBP Riau', c2: 'Rudi Hartono', c3: 'PKWT/2026/001', status: 'Tercatat' },
      { c1: 'PT. Riau Pulp & Paper', c2: 'Maria Ulfa', c3: 'PKWT/2026/042', status: 'Tercatat' },
      { c1: 'Chevron Indo Riau', c2: 'Gerry Kusuma', c3: 'PKWT/2026/099', status: 'Tercatat' }
    ];
  } else if (path === '/phi/pengaduan') {
    title = 'Rekapitulasi Pengaduan Kasus (PHI)';
    icon = 'fa-gavel';
    badgeColor = '#ef4444';
    headers = ['No', 'Nama Pengadu (Pekerja)', 'Nama Tergugat (Perusahaan)', 'Kasus Perselisihan', 'Status Kasus'];
    data = [
      { c1: 'Dony Setiawan', c2: 'PT. Karya Logistik', c3: 'Pemutusan Hubungan Kerja (PHK)', status: 'PROSES' },
      { c1: 'Riana Safitri', c2: 'CV. Selera Bakery', c3: 'Perselisihan Hak (Gaji)', status: 'PROSES' },
      { c1: 'Supriyadi', c2: 'PT. Riau Power Indo', c3: 'Perselisihan Kepentingan', status: 'SELESAI' }
    ];
  } else if (path === '/phi/peraturan') {
    title = 'Rekapitulasi Peraturan Perusahaan (PHI)';
    icon = 'fa-book';
    badgeColor = '#eab308';
    headers = ['No', 'Nama Perusahaan', 'Nomor Pengesahan PP', 'Sektor Usaha', 'Status PP'];
    data = [
      { c1: 'PT. Riau Power Indo', c2: '560/PP/DISNAKER-09', c3: 'Energi / Kelistrikan', status: 'Perpanjangan' },
      { c1: 'CV. Pekanbaru Digital', c2: '560/PP/DISNAKER-22', c3: 'Teknologi Informasi', status: 'Baru' },
      { c1: 'Hotel Grand Central', c2: '560/PP/DISNAKER-45', c3: 'Perhotelan / Wisata', status: 'Perpanjangan' }
    ];
  }

  return (
    <div>
      <div className="card card-modern shadow-sm p-4 mb-4">
        <div className="d-flex align-items-center mb-2">
          <span className="badge rounded-pill me-2 text-white" style={{ background: badgeColor, fontSize: '13px', padding: '7px 14px' }}>
            <i className={`fa ${icon} me-1`}></i> {title}
          </span>
        </div>
        <p className="text-muted small mb-0">
          Halaman ini menampilkan data rekapitulasi simulasi untuk keperluan visualisasi frontend. Seluruh manipulasi data dinonaktifkan karena bidang ini dikembangkan oleh rekan tim Anda.
        </p>
      </div>

      <div className="card card-modern shadow-sm p-4">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-light">
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} className={idx === 0 || idx === 3 || idx === 4 ? 'text-center' : ''}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => {
                let statusBadge = item.status;
                if (['TERBUKA', 'DIVERIFIKASI', 'Tercatat', 'SELESAI'].includes(item.status)) {
                  statusBadge = <span className="badge bg-success">{item.status}</span>;
                } else if (['TERTUTUP', 'tidak aktif'].includes(item.status)) {
                  statusBadge = <span className="badge bg-danger">{item.status}</span>;
                } else if (['BELUM DIVERIFIKASI', 'PROSES', 'Baru'].includes(item.status)) {
                  statusBadge = <span className="badge bg-warning text-dark">{item.status}</span>;
                } else if (['Perpanjangan'].includes(item.status)) {
                  statusBadge = <span className="badge bg-primary">{item.status}</span>;
                }

                return (
                  <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td className="fw-bold">{item.c1}</td>
                    <td>{item.c2}</td>
                    <td className="text-center">{item.c3}</td>
                    <td className="text-center">{statusBadge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
