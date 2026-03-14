import { useState, useEffect } from 'react';
import api from '../services/api';

/* ─── Fonts ──────────────────────────────────────────────────────────────── */
if (!document.head.querySelector('[data-fc-f]')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Geist+Mono:wght@400;500&display=swap';
  l.dataset.fcF = '1';
  document.head.appendChild(l);
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
if (!document.head.querySelector('[data-fc-admin]')) {
  const s = document.createElement('style');
  s.dataset.fcAdmin = '1';
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --red:   #C8211A;
      --red-h: #A81913;
      --ink:   #0E0E0E;
      --ink2:  #1A1A1A;
      --paper: #FAFAF8;
      --card:  #FFFFFF;
      --sec:   #F3F2EE;
      --brd:   #E6E6E3;
      --brd2:  #EBEBEA;
      --muted: #6B6B6B;
      --light: #A0A0A0;
      --F: "Bricolage Grotesque", sans-serif;
      --M: "Geist Mono", monospace;
    }
    html { scroll-behavior: smooth; }

    @keyframes fc-spin { to { transform: rotate(360deg); } }
    @keyframes fc-up   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
    @keyframes fc-blink{ 0%,100%{opacity:1} 50%{opacity:.3} }
    .fc-spin  { animation: fc-spin .8s linear infinite; }
    .fc-up    { animation: fc-up .5s cubic-bezier(.22,1,.36,1) both; }
    .fc-blink { animation: fc-blink 2s ease infinite; }

    /* Input / Textarea */
    .fc-input, .fc-textarea {
      width: 100%; border: 1.5px solid var(--brd);
      border-radius: 9px; padding: 11px 14px;
      font-size: 13px; font-weight: 500;
      font-family: var(--F); color: var(--ink);
      background: var(--paper); outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .fc-input::placeholder, .fc-textarea::placeholder { color: var(--light); font-weight: 400; }
    .fc-input:focus, .fc-textarea:focus {
      border-color: var(--red);
      box-shadow: 0 0 0 3px rgba(200,33,26,.1);
      background: #fff;
    }
    .fc-textarea { resize: vertical; min-height: 80px; line-height: 1.55; }

    /* Label */
    .fc-label {
      display: block; font-size: 10px; font-weight: 500;
      font-family: var(--M); color: var(--muted);
      letter-spacing: .08em; text-transform: uppercase; margin-bottom: 7px;
    }

    /* Buttons */
    .btn-dark {
      background: var(--ink2); color: #fff; border: none; cursor: pointer;
      font-family: var(--F); font-size: 13px; font-weight: 700;
      border-radius: 9px; padding: 11px 18px;
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      transition: background .15s, box-shadow .15s, transform .15s;
      box-shadow: 0 4px 14px rgba(14,14,14,.2);
      width: 100%;
    }
    .btn-dark:hover { background: #2a2a2a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(14,14,14,.28); }

    /* Card */
    .fc-card {
      background: var(--card); border: 1px solid var(--brd);
      border-radius: 14px; overflow: hidden;
    }

    /* Table row */
    .trow { transition: background .12s; }
    .trow:hover { background: var(--sec); }

    /* Stat card */
    .stat-card {
      background: var(--card); border: 1px solid var(--brd);
      border-radius: 12px; padding: 18px 20px;
    }

    /* Logout */
    .btn-logout {
      background: transparent; border: 1px solid rgba(255,255,255,.15); cursor: pointer;
      font-family: var(--F); font-size: 13px; font-weight: 600; color: rgba(255,255,255,.6);
      border-radius: 8px; padding: 8px 16px;
      display: inline-flex; align-items: center; gap: 7px;
      transition: border-color .15s, color .15s, background .15s;
    }
    .btn-logout:hover { border-color: rgba(255,255,255,.4); color: #fff; background: rgba(255,255,255,.07); }

    /* Search */
    .fc-search-bar {
      display: flex; align-items: center; gap: 10px;
      background: var(--paper); border: 1.5px solid var(--brd);
      border-radius: 9px; padding: 0 14px;
      transition: border-color .2s, box-shadow .2s;
    }
    .fc-search-bar:focus-within {
      border-color: var(--red);
      box-shadow: 0 0 0 3px rgba(200,33,26,.1);
      background: #fff;
    }
    .fc-search-bar input {
      flex: 1; border: none; outline: none; background: transparent;
      font-family: var(--F); font-size: 13px; font-weight: 500; color: var(--ink);
      padding: 11px 0;
    }
    .fc-search-bar input::placeholder { color: var(--light); font-weight: 400; }
  `;
  document.head.appendChild(s);
}

/* ─── Helper badge ───────────────────────────────────────────────────────── */
const StatusBadge = ({ active }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: active ? '#ECFDF5' : '#FEF2F2',
    color:      active ? '#065F46' : '#7F1D1D',
    border:    `1px solid ${active ? '#6EE7B7' : '#FCA5A5'}`,
    fontSize: 10, fontWeight: 600, fontFamily: 'var(--M)',
    padding: '3px 9px', borderRadius: 20, letterSpacing: '.03em', whiteSpace: 'nowrap',
  }}>
    <span className={active ? 'fc-blink' : ''} style={{
      width: 5, height: 5, borderRadius: '50%',
      background: active ? '#10B981' : '#EF4444', flexShrink: 0,
    }}/>
    {active ? 'Aktif' : 'Pasif'}
  </span>
);

const EMPTY_FORM = {
  hotelCode: '', email: '', password: '', hotelName: '',
  taxOffice: '', taxNumber: '', address: '',
  membershipStartDate: '', membershipEndDate: '',
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const [hotels,  setHotels]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [search,  setSearch]  = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchHotels = async () => {
    try {
      const res = await api.get('/hotels');
      setHotels(res.data);
    } catch { setError('Oteller yüklenirken hata oluştu.'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchHotels(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await api.post('/hotels', formData);
      setSuccess('Otel başarıyla sisteme eklendi.');
      setFormData(EMPTY_FORM);
      fetchHotels();
    } catch (err) { setError(err.response?.data?.message || 'Otel eklenemedi.'); }
  };

  /* Stats */
  const stats = {
    total:  hotels.length,
    active: hotels.filter(h => h.isActive).length,
    passive:hotels.filter(h => !h.isActive).length,
  };

  /* Filtered */
  const filtered = hotels.filter(h =>
    !search ||
    h.hotelName?.toLowerCase().includes(search.toLowerCase()) ||
    h.hotelCode?.toLowerCase().includes(search.toLowerCase()) ||
    h.email?.toLowerCase().includes(search.toLowerCase())
  );

  const W = { maxWidth: 1200, margin: '0 auto', padding: '0 28px' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--F)', color: 'var(--ink)' }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: '#0B0C0F',
        borderBottom: '1px solid rgba(255,255,255,.07)',
      }}>
        <div style={{ ...W, height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 28, height: 28, background: 'var(--red)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(200,33,26,.45)' }}>
                <svg width="12" height="14" viewBox="0 0 14 16" fill="none">
                  <path d="M7 1C7 1 9.5 4.5 9.5 7C9.5 8.38 8.94 9.63 8.03 10.55C8.43 9.75 8.67 8.86 8.67 7.92C8.67 5.92 7.42 4.25 7.42 4.25C7.42 4.25 6.17 6.5 6.17 8.08C6.17 9.47 6.89 10.68 7.96 11.42C7.41 11.93 6.67 12.25 5.83 12.25C4.23 12.25 2.92 10.94 2.92 9.33C2.92 8.08 3.75 7 3.75 7C3.75 7 2.17 8.67 2.17 10.83C2.17 14.07 4.61 16 7 16C10.04 16 12.5 13.54 12.5 10.5C12.5 6.5 7 1 7 1Z" fill="white"/>
                </svg>
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-.02em' }}>FireCheckup</span>
            </div>
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.12)' }}/>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(200,33,26,.12)', border: '1px solid rgba(200,33,26,.25)',
              borderRadius: 5, padding: '3px 10px',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize: 10, fontFamily: 'var(--M)', color: 'rgba(255,255,255,.7)', letterSpacing: '.07em', textTransform: 'uppercase' }}>Sistem Yöneticisi</span>
            </div>
          </div>
          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontFamily: 'var(--M)', color: 'rgba(255,255,255,.3)', letterSpacing: '.04em' }}>
              {new Date().toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' })}
            </span>
          </div>
        </div>
      </header>

      <div style={{ ...W, paddingTop: 32, paddingBottom: 64 }}>

        {/* ── PAGE TITLE ── */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontFamily: 'var(--M)', color: 'var(--red)', letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 6 }}>Admin Paneli</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.04em', color: 'var(--ink)', lineHeight: 1.1 }}>Otel Yönetimi</h1>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Toplam Otel',  value: stats.total,   dot: null },
            { label: 'Aktif',        value: stats.active,  dot: '#10B981' },
            { label: 'Pasif',        value: stats.passive, dot: '#EF4444' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontFamily: 'var(--M)', color: 'var(--muted)', letterSpacing: '.07em', textTransform: 'uppercase' }}>{s.label}</span>
                {s.dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot }}/>}
              </div>
              <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.04em', color: 'var(--ink)', lineHeight: 1 }}>
                {loading ? '—' : s.value}
              </span>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>

          {/* ── FORM ── */}
          <div className="fc-card fc-up" style={{ padding: '24px' }}>
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--brd2)' }}>
              <p style={{ fontSize: 10, fontFamily: 'var(--M)', color: 'var(--red)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Yeni Kayıt</p>
              <h2 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-.03em', color: 'var(--ink)' }}>Otel Ekle</h2>
            </div>

            {/* Alerts */}
            {error && (
              <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 9, padding: '11px 14px', marginBottom: 16, fontSize: 12, fontWeight: 500, color: '#7F1D1D', lineHeight: 1.5 }}>
                <svg style={{ flexShrink: 0, marginTop: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}
            {success && (
              <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 9, padding: '11px 14px', marginBottom: 16, fontSize: 12, fontWeight: 500, color: '#065F46', lineHeight: 1.5 }}>
                <svg style={{ flexShrink: 0, marginTop: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Satır 1: Kod + Otel Adı */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="fc-label">Otel Kodu</label>
                  <input className="fc-input" type="text" name="hotelCode" placeholder="HTL-1024" value={formData.hotelCode} onChange={handleInputChange} required/>
                </div>
                <div>
                  <label className="fc-label">Otel Adı</label>
                  <input className="fc-input" type="text" name="hotelName" placeholder="Grand Hotel" value={formData.hotelName} onChange={handleInputChange} required/>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="fc-label">Email Adresi</label>
                <input className="fc-input" type="email" name="email" placeholder="info@hotel.com" value={formData.email} onChange={handleInputChange} required/>
              </div>

              {/* Şifre */}
              <div>
                <label className="fc-label">Geçici Şifre</label>
                <input className="fc-input" type="text" name="password" placeholder="Geçici şifre girin" value={formData.password} onChange={handleInputChange} required/>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--brd2)', margin: '4px 0' }}/>

              {/* Vergi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="fc-label">Vergi Dairesi</label>
                  <input className="fc-input" type="text" name="taxOffice" placeholder="Karşıyaka V.D." value={formData.taxOffice} onChange={handleInputChange} required/>
                </div>
                <div>
                  <label className="fc-label">Vergi No</label>
                  <input className="fc-input" type="text" name="taxNumber" placeholder="1234567890" value={formData.taxNumber} onChange={handleInputChange} required/>
                </div>
              </div>

              {/* Adres */}
              <div>
                <label className="fc-label">Açık Adres</label>
                <textarea className="fc-textarea" name="address" placeholder="Mahalle, sokak, şehir..." value={formData.address} onChange={handleInputChange} required/>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--brd2)', margin: '4px 0' }}/>

              {/* Tarihler */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="fc-label">Üyelik Başlangıç</label>
                  <input className="fc-input" type="date" name="membershipStartDate" value={formData.membershipStartDate} onChange={handleInputChange} required/>
                </div>
                <div>
                  <label className="fc-label">Üyelik Bitiş</label>
                  <input className="fc-input" type="date" name="membershipEndDate" value={formData.membershipEndDate} onChange={handleInputChange} required/>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-dark" style={{ marginTop: 6, fontSize: 14, padding: '13px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
                Oteli Sisteme Kaydet
              </button>
            </form>
          </div>

          {/* ── TABLO ── */}
          <div className="fc-card fc-up" style={{ padding: '24px' }}>
            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--brd2)', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 10, fontFamily: 'var(--M)', color: 'var(--red)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Kayıtlı</p>
                <h2 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-.03em', color: 'var(--ink)' }}>Sistemdeki Oteller</h2>
              </div>
              {/* Search */}
              <div className="fc-search-bar" style={{ width: 260 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--light)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  type="text"
                  placeholder="Otel ara..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light)', padding: '2px', display: 'flex', alignItems: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '32px 0', color: 'var(--muted)', fontSize: 13 }}>
                <span className="fc-spin" style={{ width: 16, height: 16, border: '2px solid var(--brd2)', borderTopColor: 'var(--red)', borderRadius: '50%', display: 'inline-block' }}/>
                Yükleniyor...
              </div>
            ) : filtered.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--brd2)' }}>
                      {['Otel','Email','Mali Veriler','Üyelik Bitiş','Durum'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontFamily: 'var(--M)', fontWeight: 500, color: 'var(--light)', letterSpacing: '.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(hotel => (
                      <tr key={hotel._id} className="trow" style={{ borderBottom: '1px solid var(--brd2)' }}>
                        {/* Otel adı + kod */}
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                              background: 'var(--sec)', border: '1px solid var(--brd2)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: 'var(--M)', fontSize: 11, fontWeight: 500, color: 'var(--muted)',
                            }}>
                              {hotel.hotelName?.slice(0,2).toUpperCase() || '??'}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{hotel.hotelName}</p>
                              <p style={{ fontSize: 11, fontFamily: 'var(--M)', color: 'var(--light)', marginTop: 2, letterSpacing: '.03em' }}>#{hotel.hotelCode}</p>
                            </div>
                          </div>
                        </td>
                        {/* Email */}
                        <td style={{ padding: '14px 12px', color: 'var(--muted)', fontWeight: 500 }}>{hotel.email}</td>
                        {/* Mali */}
                        <td style={{ padding: '14px 12px' }}>
                          <p style={{ fontSize: 12, fontFamily: 'var(--M)', color: 'var(--muted)', lineHeight: 1.6 }}>
                            <span style={{ color: 'var(--light)', marginRight: 4 }}>VD</span>{hotel.taxOffice}
                          </p>
                          <p style={{ fontSize: 12, fontFamily: 'var(--M)', color: 'var(--muted)' }}>
                            <span style={{ color: 'var(--light)', marginRight: 4 }}>VN</span>{hotel.taxNumber}
                          </p>
                        </td>
                        {/* Bitiş tarihi */}
                        <td style={{ padding: '14px 12px', fontFamily: 'var(--M)', fontSize: 12, color: 'var(--ink)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {new Date(hotel.membershipEndDate).toLocaleDateString('tr-TR')}
                        </td>
                        {/* Durum */}
                        <td style={{ padding: '14px 12px' }}>
                          <StatusBadge active={hotel.isActive}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--paper)', borderRadius: 10, border: '1.5px dashed var(--brd2)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--sec)', border: '1px solid var(--brd2)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--light)" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--muted)' }}>
                  {search ? 'Arama sonucu bulunamadı.' : 'Henüz otel eklenmedi.'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--light)', marginTop: 5 }}>
                  {search ? `"${search}" için sonuç yok.` : 'Sol formu kullanarak ilk oteli ekleyin.'}
                </p>
              </div>
            )}

            {/* Tablo footer */}
            {!loading && filtered.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--brd2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--M)', color: 'var(--light)' }}>
                  {search ? `${filtered.length} / ${hotels.length} otel` : `${hotels.length} otel`}
                </span>
                {search && (
                  <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--M)', color: 'var(--red)', letterSpacing: '.04em' }}>
                    Filtreyi temizle ×
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;