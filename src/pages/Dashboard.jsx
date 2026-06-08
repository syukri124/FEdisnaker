import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Swal from 'sweetalert2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ role }) {
  const [tahun, setTahun] = useState('2026');
  const [chartType, setChartType] = useState('overview'); // overview, key-line, key-doughnut
  const [chartTitle, setChartTitle] = useState('Statistik Bulanan (Ikhtisar)');
  const [activeKey, setActiveKey] = useState('');
  const [activeColor, setActiveColor] = useState('#3b82f6');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Rincian Data');
  const [modalHeaders, setModalHeaders] = useState(['No', 'Nama / Entitas Utama', 'Informasi 1', 'Informasi 2', 'Status']);
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Pre-populated data representing database status fields
  const mockDbDetails = {
    pencariKerja: {
      title: 'Daftar Pencari Kerja Terdaftar',
      headers: ['No', 'Nama Pencari Kerja', 'Email', 'No. Telepon', 'Status Verifikasi'],
      data: [
        { nama: 'Ahmad Fauzi', d1: 'fauzi.ahmad@gmail.com', d2: '08123456789', status: 'DIVERIFIKASI' },
        { nama: 'Siti Rahma', d1: 'siti.rahma@yahoo.com', d2: '08129876543', status: 'DIVERIFIKASI' },
        { nama: 'Budi Santoso', d1: 'budi.santoso@outlook.com', d2: '08561234567', status: 'BELUM DIVERIFIKASI' },
        { nama: 'Dewi Lestari', d1: 'dewi.lestari@gmail.com', d2: '08138765432', status: 'DIVERIFIKASI' },
        { nama: 'Rian Hidayat', d1: 'rian.hid@gmail.com', d2: '08771234567', status: 'BELUM DIVERIFIKASI' }
      ]
    },
    lowongan: {
      title: 'Daftar Lowongan Kerja Aktif',
      headers: ['No', 'Nama Perusahaan', 'Posisi Lowongan', 'Jumlah Kuota', 'Status Lowongan'],
      data: [
        { nama: 'PT. Riau Makmur Jaya', d1: 'Staff Administrasi', d2: '3 Orang', status: 'TERBUKA' },
        { nama: 'CV. Pekanbaru Digital', d1: 'Frontend Developer', d2: '2 Orang', status: 'TERBUKA' },
        { nama: 'Hotel Grand Central', d1: 'Receptionist', d2: '1 Orang', status: 'TERBUKA' },
        { nama: 'PT. PHR Riau', d1: 'Operations Supervisor', d2: '5 Orang', status: 'TERTUTUP' }
      ]
    },
    penempatan: {
      title: 'Daftar Penempatan Tenaga Kerja',
      headers: ['No', 'Nama Pekerja', 'Ditempatkan Di', 'Tanggal Penempatan', 'Status Selesai'],
      data: [
        { nama: 'Siti Rahma', d1: 'PT. Riau Makmur Jaya', d2: '12 Jan 2026', status: 'DITERIMA' },
        { nama: 'Ahmad Fauzi', d1: 'Hotel Grand Central', d2: '18 Feb 2026', status: 'DITERIMA' },
        { nama: 'Dewi Lestari', d1: 'CV. Pekanbaru Digital', d2: '05 Mar 2026', status: 'DITERIMA' }
      ]
    },
    lpkAktif: {
      title: 'Daftar Lembaga Pelatihan Kerja (LPK) Aktif',
      headers: ['No', 'Nama LPK', 'Pimpinan', 'Tahun Berdiri', 'Status'],
      data: [
        { nama: 'LPK Global Computer', d1: 'H. Suherman, M.Kom', d2: '2012', status: 'aktif' },
        { nama: 'LPK Kartini Menjahit', d1: 'Hj. Kartini', d2: '2008', status: 'aktif' },
        { nama: 'LPK Otomotif Riau', d1: 'Ir. M. Yusuf', d2: '2015', status: 'aktif' },
        { nama: 'LPK Bahasa Inggris Lestari', d1: 'Dr. Lestari', d2: '2019', status: 'aktif' }
      ]
    },
    lpkNonaktif: {
      title: 'Daftar Lembaga Pelatihan Kerja (LPK) Tidak Aktif',
      headers: ['No', 'Nama LPK', 'Pimpinan', 'Tahun Berdiri', 'Status'],
      data: [
        { nama: 'LPK Bahtera Bahari', d1: 'Sujatmiko, SE', d2: '2010', status: 'tidak aktif' },
        { nama: 'LPK Cepat Pintar', d1: 'Rudi Wijaya', d2: '2018', status: 'tidak aktif' }
      ]
    },
    pelatihan: {
      title: 'Daftar Program Pelatihan LPK Terlaksana',
      headers: ['No', 'Nama LPK', 'Program Pelatihan', 'Jumlah Peserta', 'Jumlah Paket'],
      data: [
        { nama: 'LPK Global Computer', d1: 'Teknisi Jaringan & IT Support', d2: '25 Peserta', status: '3 Paket' },
        { nama: 'LPK Kartini Menjahit', d1: 'Menjahit & Tata Busana Modis', d2: '16 Peserta', status: '2 Paket' },
        { nama: 'LPK Otomotif Riau', d1: 'Teknisi Sepeda Motor Injeksi', d2: '12 Peserta', status: '1 Paket' }
      ]
    },
    pekerjaKwt: {
      title: 'Daftar Pekerja PKWT Terlindungi',
      headers: ['No', 'Nama Perusahaan', 'Nama Pekerja', 'Nomor PKWT', 'Status'],
      data: [
        { nama: 'PT. Indofood CBP Riau', d1: 'Rudi Hartono', d2: 'PKWT/2026/001', status: 'PROSES' },
        { nama: 'PT. Riau Pulp & Paper', d1: 'Maria Ulfa', d2: 'PKWT/2026/042', status: 'PROSES' },
        { nama: 'Chevron Indo Riau', d1: 'Gerry Kusuma', d2: 'PKWT/2026/099', status: 'PROSES' }
      ]
    },
    perusahaanPP: {
      title: 'Daftar Perusahaan Terdaftar PP (Peraturan Perusahaan)',
      headers: ['No', 'Nama Perusahaan', 'Sektor Usaha', 'No. Pengesahan PP', 'Status PP'],
      data: [
        { nama: 'PT. Riau Power Indo', d1: 'Energi / Kelistrikan', d2: '560/PP/DISNAKER-09', status: 'Perpanjangan' },
        { nama: 'CV. Pekanbaru Digital', d1: 'Teknologi Informasi', d2: '560/PP/DISNAKER-22', status: 'Baru' },
        { nama: 'Hotel Grand Central', d1: 'Perhotelan / Wisata', d2: '560/PP/DISNAKER-45', status: 'Perpanjangan' }
      ]
    },
    kasusPhi: {
      title: 'Daftar Pengaduan Kasus PHI Masuk',
      headers: ['No', 'Pengadu (Pekerja)', 'Tergugat (Perusahaan)', 'Jenis Perselisihan', 'Status Kasus'],
      data: [
        { nama: 'Dony Setiawan', d1: 'PT. Karya Logistik', d2: 'Pemutusan Hubungan Kerja (PHK)', status: 'berjalan' },
        { nama: 'Riana Safitri', d1: 'CV. Selera Bakery', d2: 'Perselisihan Hak (Gaji)', status: 'berjalan' },
        { nama: 'Supriyadi', d1: 'PT. Riau Power Indo', d2: 'Perselisihan Kepentingan', status: 'selesai' }
      ]
    }
  };

  // Mock aggregates
  const rawData = {
    pencariKerja: [120, 150, 180, 190, 220, 240, 210, 230, 250, 280, 290, 310],
    lowongan: [45, 60, 55, 70, 80, 95, 85, 90, 105, 110, 115, 130],
    penempatan: [30, 40, 50, 45, 65, 80, 70, 75, 85, 90, 95, 110],
    pekerjaKwt: [800, 950, 1100, 1250, 1400, 1500, 1450, 1600, 1750, 1900, 2000, 2100],
    perusahaanPP: [12, 15, 18, 20, 22, 25, 27, 30, 32, 35, 38, 40],
    kasusPhi: [8, 12, 15, 10, 14, 18, 11, 13, 16, 20, 17, 19],
    lpkAktif: [35, 35, 36, 37, 37, 38, 38, 38, 39, 40, 40, 41],
    lpkNonaktif: [5, 5, 5, 4, 4, 3, 3, 3, 3, 2, 2, 2],
    pelatihan: [25, 30, 35, 40, 42, 48, 45, 46, 50, 55, 58, 60],
    laporanPkwt: [50, 65, 70, 85, 90, 100, 95, 105, 110, 120, 125, 130]
  };

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

  const getGradient = (ctx, color) => {
    if (!ctx) return color;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, hexToRgbA(color, 0.45));
    gradient.addColorStop(1, hexToRgbA(color, 0.0));
    return gradient;
  };

  const hexToRgbA = (hex, alpha) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    return `rgba(59,130,246,${alpha})`;
  };

  const updateChart = (key, label, color) => {
    setActiveKey(key);
    setActiveColor(color);

    if (key === 'kasusDiselesaikan') {
      setChartType('doughnut');
      setChartTitle('Grafik Proporsi: Jenis Penyelesaian Kasus PHI');
    } else {
      setChartType('single');
      setChartTitle('Tren Bulanan: ' + label);
    }

    // Scroll to chart
    setTimeout(() => {
      document.getElementById('chartContainerArea')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const resetChart = () => {
    setChartType('overview');
    setChartTitle('Statistik Bulanan (Ikhtisar)');
    setActiveKey('');
  };

  const handleExport = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Ekspor Berhasil!',
      text: `Mengekspor rekapitulasi data tahun ${tahun} ke Excel.`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  const showDetailModal = (key) => {
    const detail = mockDbDetails[key];
    if (detail) {
      setModalLoading(true);
      setModalOpen(true);
      
      // Simulate fetch delay
      setTimeout(() => {
        setModalTitle(detail.title);
        setModalHeaders(detail.headers);
        setModalData(detail.data);
        setModalLoading(false);
      }, 500);
    } else {
      Swal.fire('Info', 'Rincian data tidak tersedia untuk item ini.', 'info');
    }
  };

  // Generate chart configurations
  const getChartData = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (chartType === 'overview') {
      const datasets = [];
      if (['admin', 'pejabat', 'penta'].includes(role)) {
        datasets.push({
          label: 'Pencari Kerja (PENTA)',
          data: rawData.pencariKerja,
          borderColor: '#3b82f6',
          backgroundColor: getGradient(ctx, '#3b82f6'),
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6
        });
      }
      if (['admin', 'pejabat', 'phi'].includes(role)) {
        datasets.push({
          label: 'Laporan PKWT (PHI)',
          data: rawData.laporanPkwt,
          borderColor: '#f97316',
          backgroundColor: getGradient(ctx, '#f97316'),
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6
        });
      }
      if (['admin', 'pejabat', 'lattas'].includes(role)) {
        datasets.push({
          label: 'Program Pelatihan (LATTAS)',
          data: rawData.pelatihan,
          borderColor: '#7c3aed',
          backgroundColor: getGradient(ctx, '#7c3aed'),
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6
        });
      }
      return { labels, datasets };
    }

    if (chartType === 'single') {
      return {
        labels,
        datasets: [{
          label: chartTitle.replace('Tren Bulanan: ', ''),
          data: rawData[activeKey] || [],
          borderColor: activeColor,
          backgroundColor: getGradient(ctx, activeColor),
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6
        }]
      };
    }

    if (chartType === 'doughnut') {
      return {
        labels: ['Bipartit', 'Perjanjian Bersama', 'Anjuran', 'Lainnya'],
        datasets: [{
          data: [12, 18, 5, 3],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#64748b'],
          borderWidth: 2,
          hoverOffset: 8
        }]
      };
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: chartType !== 'doughnut' ? {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true }
    } : {}
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div className="d-flex align-items-center">
          <h4 className="m-0 fw-bold me-3">Dashboard Statistik</h4>
          <div className="input-group input-group-sm shadow-sm" style={{ width: '130px' }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="fa fa-calendar-alt text-muted"></i>
            </span>
            <select 
              value={tahun} 
              onChange={(e) => setTahun(e.target.value)} 
              className="form-select border-start-0 ps-0 fw-bold text-primary"
            >
              <option value="2027">2027</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <form onSubmit={handleExport} className="d-flex align-items-center gap-2">
            <select 
              value={tahun} 
              onChange={(e) => setTahun(e.target.value)} 
              className="form-select form-select-sm" 
              style={{ width: '100px' }}
            >
              <option value="2027">2027</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <button type="submit" className="btn btn-success btn-sm shadow-sm">
              <i className="fa fa-file-excel me-1"></i> Cetak Excel
            </button>
          </form>
          <button onClick={() => window.print()} className="btn btn-outline-secondary btn-sm shadow-sm">
            <i className="fa fa-print me-1"></i> Cetak Laporan
          </button>
        </div>
      </div>

      {/* ── BIDANG PENTA ── */}
      {['admin', 'pejabat', 'penta'].includes(role) && (
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <span className="badge rounded-pill me-2 text-white" style={{ background: '#0f172a', fontSize: '13px', padding: '7px 14px' }}>
              <i className="fa fa-users me-1"></i> Bidang Penempatan (Penta)
            </span>
            <hr className="flex-grow-1 m-0" />
          </div>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-4">
              <div 
                className="card card-modern shadow-sm p-4 border-start border-4 border-primary" 
                style={{ cursor: 'pointer' }}
                onClick={() => updateChart('pencariKerja', 'Total Pencari Kerja', '#3b82f6')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Pencari Kerja</h6>
                    <h3 className="fw-bold mb-0">310</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px', background: 'rgba(59,130,246,0.1)' }}>
                    <i className="fa fa-user-check fa-lg text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div 
                className="card card-modern shadow-sm p-4 border-start border-4 border-info" 
                style={{ cursor: 'pointer' }}
                onClick={() => updateChart('lowongan', 'Total Lowongan Kerja', '#06b6d4')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Lowongan Kerja</h6>
                    <h3 className="fw-bold mb-0">130</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px', background: 'rgba(6,182,212,0.1)' }}>
                    <i className="fa fa-briefcase fa-lg text-info"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div 
                className="card card-modern shadow-sm p-4 border-start border-4" 
                style={{ cursor: 'pointer', borderLeftColor: '#6366f1' }}
                onClick={() => updateChart('penempatan', 'Total Penempatan', '#6366f1')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Penempatan</h6>
                    <h3 className="fw-bold mb-0">110</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px', background: 'rgba(99,102,241,0.1)' }}>
                    <i className="fa fa-chart-pie fa-lg" style={{ color: '#6366f1' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BIDANG PHI ── */}
      {['admin', 'pejabat', 'phi'].includes(role) && (
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <span className="badge rounded-pill me-2 text-white" style={{ background: '#b45309', fontSize: '13px', padding: '7px 14px' }}>
              <i className="fa fa-file-contract me-1"></i> Hubungan Industrial (PHI)
            </span>
            <hr className="flex-grow-1 m-0" />
          </div>

          <div className="row g-3">
            <div className="col-sm-6 col-md-3">
              <div 
                className="card card-modern shadow-sm p-3 border-start border-4" 
                style={{ cursor: 'pointer', borderLeftColor: '#f97316' }}
                onClick={() => updateChart('pekerjaKwt', 'Total Pekerja PKWT', '#f97316')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1" style={{ fontSize: '0.82rem' }}>Pekerja PKWT <br /><small>(Terlindungi)</small></h6>
                    <h4 className="fw-bold mb-0 text-dark">2,100</h4>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', background: 'rgba(249,115,22,0.1)' }}>
                    <i className="fa fa-users fa-lg" style={{ color: '#f97316' }}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div 
                className="card card-modern shadow-sm p-3 border-start border-4 border-warning" 
                style={{ cursor: 'pointer' }}
                onClick={() => updateChart('perusahaanPP', 'Perusahaan Tercatat PP', '#eab308')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1" style={{ fontSize: '0.82rem' }}>Perusahaan <br /><small>(Patuh PP)</small></h6>
                    <h4 className="fw-bold mb-0 text-dark">40</h4>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', background: 'rgba(234,179,8,0.1)' }}>
                    <i className="fa fa-building fa-lg text-warning"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div 
                className="card card-modern shadow-sm p-3 border-start border-4 border-danger" 
                style={{ cursor: 'pointer' }}
                onClick={() => updateChart('kasusPhi', 'Total Kasus PHI Masuk', '#ef4444')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1" style={{ fontSize: '0.82rem' }}>Kasus Perselisihan <br /><small>(Masuk)</small></h6>
                    <h4 className="fw-bold mb-0 text-dark">19</h4>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', background: 'rgba(239,68,68,0.1)' }}>
                    <i className="fa fa-gavel fa-lg text-danger"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div 
                className="card card-modern shadow-sm p-3 border-start border-4" 
                style={{ cursor: 'pointer', borderLeftColor: '#10b981' }}
                onClick={() => updateChart('kasusDiselesaikan', 'Penyelesaian Kasus', '#10b981')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1" style={{ fontSize: '0.82rem' }}>Penyelesaian <br /><small>(Keberhasilan)</small></h6>
                    <h4 className="fw-bold mb-0 text-success">84%</h4>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', background: 'rgba(16,185,129,0.1)' }}>
                    <i className="fa fa-handshake fa-lg" style={{ color: '#10b981' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BIDANG LATTAS ── */}
      {['admin', 'pejabat', 'lattas'].includes(role) && (
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <span className="badge rounded-pill me-2 text-white" style={{ background: '#065f46', fontSize: '13px', padding: '7px 14px' }}>
              <i className="fa fa-graduation-cap me-1"></i> Pelatihan & Produktivitas (Lattas)
            </span>
            <hr className="flex-grow-1 m-0" />
          </div>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-4">
              <div 
                className="card card-modern shadow-sm p-4 border-start border-4 border-success" 
                style={{ cursor: 'pointer' }}
                onClick={() => updateChart('lpkAktif', 'Total LPK Aktif', '#22c55e')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total LPK Aktif</h6>
                    <h3 className="fw-bold mb-0">41</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px', background: 'rgba(34,197,94,0.1)' }}>
                    <i className="fa fa-building fa-lg text-success"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div 
                className="card card-modern shadow-sm p-4 border-start border-4" 
                style={{ cursor: 'pointer', borderLeftColor: '#0d9488' }}
                onClick={() => updateChart('lpkNonaktif', 'Total LPK Tidak Aktif', '#0d9488')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total LPK Tidak Aktif</h6>
                    <h3 className="fw-bold mb-0">2</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px', background: 'rgba(13,148,136,0.1)' }}>
                    <i className="fa fa-building fa-lg" style={{ color: '#0d9488' }}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div 
                className="card card-modern shadow-sm p-4 border-start border-4" 
                style={{ cursor: 'pointer', borderLeftColor: '#7c3aed' }}
                onClick={() => updateChart('pelatihan', 'Total Program Pelatihan', '#7c3aed')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Program Pelatihan</h6>
                    <h3 className="fw-bold mb-0">60</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px', background: 'rgba(124,58,237,0.1)' }}>
                    <i className="fa fa-chalkboard-teacher fa-lg" style={{ color: '#7c3aed' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GRAFIK BULANAN ── */}
      <div id="chartContainerArea" className="card card-modern shadow-sm p-4 mb-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div className="d-flex align-items-center gap-3">
            <h6 className="mb-0 fw-bold">{chartTitle}</h6>
            {activeKey && activeKey !== 'kasusDiselesaikan' && (
              <button 
                className="btn btn-sm btn-info text-white shadow-sm"
                onClick={() => showDetailModal(activeKey)}
              >
                <i className="fa fa-list me-1"></i> Rincian Data
              </button>
            )}
          </div>
          <button onClick={resetChart} className="btn btn-sm btn-outline-primary shadow-sm">
            <i className="fa fa-sync-alt me-1"></i> Tampilkan Semua
          </button>
        </div>
        <div style={{ position: 'relative', height: '350px', width: '100%' }}>
          {chartType === 'doughnut' ? (
            <Doughnut data={getChartData()} options={chartOptions} />
          ) : (
            <Line data={getChartData()} options={chartOptions} />
          )}
        </div>
      </div>

      {/* ── MODAL RINCIAN DATA ── */}
      {modalOpen && (
        <>
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabindex="-1">
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-primary text-white border-0 d-flex flex-wrap align-items-center">
                  <h5 className="modal-title fw-bold flex-grow-1">
                    <i className="fa fa-list me-2"></i> {modalTitle} (Tahun {tahun})
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setModalOpen(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body p-0" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {modalLoading ? (
                    <div className="text-center py-5">
                      <i className="fa fa-spinner fa-spin fa-2x text-primary"></i>
                      <p className="mt-2 text-muted">Memuat data...</p>
                    </div>
                  ) : (
                    <div className="table-responsive m-0">
                      <table className="table table-hover table-striped align-middle m-0">
                        <thead className="table-light sticky-top">
                          <tr>
                            {modalHeaders.map((h, i) => (
                              <th key={i} className={i === 0 || i === 3 || i === 4 ? 'text-center' : ''}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {modalData.length === 0 ? (
                            <tr>
                              <td colSpan={modalHeaders.length} className="text-center text-muted py-4">
                                Tidak ada data untuk filter terpilih
                              </td>
                            </tr>
                          ) : (
                            modalData.map((item, index) => {
                              let statusBadge = item.status;
                              if (['aktif', 'tidak aktif', 'DIVERIFIKASI', 'BELUM DIVERIFIKASI', 'TERBUKA', 'TERTUTUP', 'DITERIMA', 'PROSES'].includes(item.status)) {
                                let badgeClass = 'bg-secondary';
                                if (['aktif', 'DIVERIFIKASI', 'DITERIMA'].includes(item.status)) badgeClass = 'bg-success';
                                if (['tidak aktif', 'DITOLAK'].includes(item.status)) badgeClass = 'bg-danger';
                                if (['BELUM DIVERIFIKASI', 'TERBUKA', 'PROSES'].includes(item.status)) badgeClass = 'bg-warning text-dark';
                                statusBadge = <span className={`badge ${badgeClass}`}>{item.status}</span>;
                              }
                              return (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td className="fw-bold">{item.nama}</td>
                                  <td>{item.d1}</td>
                                  <td className="text-center">{item.d2}</td>
                                  <td className="text-center">{statusBadge}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer bg-light border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Tutup</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
        </>
      )}
    </div>
  );
}
