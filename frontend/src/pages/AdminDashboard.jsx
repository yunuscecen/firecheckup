import { useState, useEffect } from 'react';
import api from '../services/api';

/* ─── Fonts ──────────────────────────────────────────────────────────────── */
if (!document.head.querySelector('[data-fc-f]')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Geist+Mono:wght@400;500;600&display=swap';
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
      --red:   #D92D20;
      --red-h: #B42318;
      --ink:   #101828;
      --ink2:  #1D2939;
      --paper: #F9FAFB;
      --card:  #FFFFFF;
      --sec:   #F2F4F7;
      --brd:   #EAECF0;
      --brd2:  #F2F4F7;
      --muted: #475467;
      --light: #98A2B3;
      --F: "Bricolage Grotesque", sans-serif;
      --M: "Geist Mono", monospace;
    }
    html { scroll-behavior: smooth; }

    @keyframes fc-spin { to { transform: rotate(360deg); } }
    @keyframes fc-up   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
    @keyframes fc-blink{ 0%,100%{opacity:1} 50%{opacity:.4} }
    .fc-spin  { animation: fc-spin .8s linear infinite; }
    .fc-up    { animation: fc-up .6s cubic-bezier(.16, 1, .3, 1) both; }
    .fc-blink { animation: fc-blink 2s ease infinite; }

    /* Input / Textarea */
    .fc-input, .fc-textarea {
      width: 100%; border: 1px solid var(--brd);
      border-radius: 10px; padding: 12px 16px;
      font-size: 14px; font-weight: 500;
      font-family: var(--F); color: var(--ink);
      background: var(--card); outline: none;
      transition: all .2s ease;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }
    .fc-input::placeholder, .fc-textarea::placeholder { color: var(--light); font-weight: 400; }
    .fc-input:hover, .fc-textarea:hover { border-color: #D0D5DD; }
    .fc-input:focus, .fc-textarea:focus {
      border-color: var(--red);
      box-shadow: 0 0 0 4px rgba(217, 45, 32, 0.12);
      background: #fff;
    }
    .fc-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

    /* Label */
    .fc-label {
      display: block; font-size: 12px; font-weight: 600;
      font-family: var(--F); color: var(--ink2);
      margin-bottom: 8px;
    }

    /* Buttons */
    .btn-dark {
      background: var(--ink); color: #fff; border: 1px solid var(--ink); cursor: pointer;
      font-family: var(--F); font-size: 14px; font-weight: 600;
      border-radius: 10px; padding: 12px 20px;
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      transition: all .2s ease;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
      width: 100%;
    }
    .btn-dark:hover { background: var(--ink2); border-color: var(--ink2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(16, 24, 40, 0.12); }
    .btn-dark:active { transform: translateY(0); }

    /* Card */
    .fc-card {
      background: var(--card); border: 1px solid var(--brd);
      border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 24px -4px rgba(16, 24, 40, 0.02);
    }

    /* Table */
    .fc-table-container { overflow-x: auto; border-radius: 12px; border: 1px solid var(--brd); }
    .trow { transition: all .15s ease; cursor: default; }
    .trow:hover { background: var(--paper); }
    
    /* Stat card */
    .stat-card {
      background: var(--card); border: 1px solid var(--brd);
      border-radius: 16px; padding: 20px 24px;
      box-shadow: 0 2px 8px -2px rgba(16, 24, 40, 0.03);
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px -4px rgba(16, 24, 40, 0.08); }

    /* Search */
    .fc-search-bar {
      display: flex; align-items: center; gap: 10px;
      background: var(--card); border: 1px solid var(--brd);
      border-radius: 10px; padding: 0 14px;
      transition: all .2s ease;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }
    .fc-search-bar:focus-within {
      border-color: var(--red);
      box-shadow: 0 0 0 4px rgba(217, 45, 32, 0.12);
    }
    .fc-search-bar input {
      flex: 1; border: none; outline: none; background: transparent;
      font-family: var(--F); font-size: 14px; font-weight: 500; color: var(--ink);
      padding: 12px 0;
    }
    .fc-search-bar input::placeholder { color: var(--light); font-weight: 400; }
  `;
  document.head.appendChild(s);
}

/* ─── Helper badge ───────────────────────────────────────────────────────── */
const StatusBadge = ({ active }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: active ? '#ECFDF3' : '#FEF3F2',
    color:      active ? '#027A48' : '#B42318',
    border:    `1px solid ${active ? '#ABEFC6' : '#FECDCA'}`,
    fontSize: 12, fontWeight: 600, fontFamily: 'var(--F)',
    padding: '4px 10px', borderRadius: 24, whiteSpace: 'nowrap',
  }}>
    <span className={active ? 'fc-blink' : ''} style={{
      width: 6, height: 6, borderRadius: '50%',
      background: active ? '#12B76A' : '#F04438', flexShrink: 0,
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

  const W = { maxWidth: 1280, margin: '0 auto', padding: '0 32px' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--F)', color: 'var(--ink)' }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: '#0C111D',
        borderBottom: '1px solid #1F242F',
      }}>
        <div style={{ ...W, height: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, background: 'var(--red)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(217, 45, 32, 0.4)' }}>
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                  <path d="M7 1C7 1 9.5 4.5 9.5 7C9.5 8.38 8.94 9.63 8.03 10.55C8.43 9.75 8.67 8.86 8.67 7.92C8.67 5.92 7.42 4.25 7.42 4.25C7.42 4.25 6.17 6.5 6.17 8.08C6.17 9.47 6.89 10.68 7.96 11.42C7.41 11.93 6.67 12.25 5.83 12.25C4.23 12.25 2.92 10.94 2.92 9.33C2.92 8.08 3.75 7 3.75 7C3.75 7 2.17 8.67 2.17 10.83C2.17 14.07 4.61 16 7 16C10.04 16 12.5 13.54 12.5 10.5C12.5 6.5 7 1 7 1Z" fill="white"/>
                </svg>
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-.02em' }}>FireCheckup</span>
            </div>
            <div style={{ width: 1, height: 24, background: '#344054' }}/>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(217, 45, 32, 0.1)', border: '1px solid rgba(217, 45, 32, 0.2)',
              borderRadius: 6, padding: '4px 12px',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize: 11, fontFamily: 'var(--F)', fontWeight: 600, color: '#FEE4E2', letterSpacing: '.05em', textTransform: 'uppercase' }}>Sistem Yöneticisi</span>
            </div>
          </div>
          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontFamily: 'var(--F)', fontWeight: 500, color: '#98A2B3' }}>
              {new Date().toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' })}
            </span>
          </div>
        </div>
      </header>

      <div style={{ ...W, paddingTop: 40, paddingBottom: 80 }}>

        {/* ── PAGE TITLE ── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontFamily: 'var(--F)', fontWeight: 600, color: 'var(--red)', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 8 }}>Admin Paneli</p>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', color: 'var(--ink)', lineHeight: 1.2 }}>Otel Yönetimi</h1>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 40 }}>
          {[
            { label: 'Toplam Otel',  value: stats.total,   dot: null },
            { label: 'Aktif Kullanıcı',  value: stats.active,  dot: '#12B76A' },
            { label: 'Pasif Kullanıcı',  value: stats.passive, dot: '#F04438' },
          ].map((s, i) => (
            <div key={s.label} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontFamily: 'var(--F)', fontWeight: 600, color: 'var(--muted)', letterSpacing: '.02em' }}>{s.label}</span>
                {s.dot && <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, boxShadow: `0 0 0 4px ${s.dot}20` }}/>}
              </div>
              <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.03em', color: 'var(--ink)', lineHeight: 1 }}>
                {loading ? '—' : s.value}
              </span>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 32, alignItems: 'start' }}>

          {/* ── FORM ── */}
          <div className="fc-card fc-up" style={{ padding: '28px', position: 'sticky', top: '100px' }}>
            <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--brd)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>Yeni Otel Ekle</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Sisteme yeni bir otel tanımlamak için aşağıdaki formu eksiksiz doldurun.</p>
            </div>

            {/* Alerts */}
            {error && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#FEF3F2', border: '1px solid #FECDCA', borderRadius: 12, padding: '14px 16px', marginBottom: 20, fontSize: 13, fontWeight: 500, color: '#B42318', lineHeight: 1.5 }}>
                <svg style={{ flexShrink: 0, marginTop: 2 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}
            {success && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#ECFDF3', border: '1px solid #ABEFC6', borderRadius: 12, padding: '14px 16px', marginBottom: 20, fontSize: 13, fontWeight: 500, color: '#027A48', lineHeight: 1.5 }}>
                <svg style={{ flexShrink: 0, marginTop: 2 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Satır 1: Kod + Otel Adı */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                <input className="fc-input" type="text" name="password" placeholder="Geçici şifre belirleyin" value={formData.password} onChange={handleInputChange} required/>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--brd)', margin: '8px 0' }}/>

              {/* Vergi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="fc-label">Vergi Dairesi</label>
                  <input className="fc-input" type="text" name="taxOffice" placeholder="Örn: Karşıyaka" value={formData.taxOffice} onChange={handleInputChange} required/>
                </div>
                <div>
                  <label className="fc-label">Vergi No</label>
                  <input className="fc-input" type="text" name="taxNumber" placeholder="10 Haneli No" value={formData.taxNumber} onChange={handleInputChange} required/>
                </div>
              </div>

              {/* Adres */}
              <div>
                <label className="fc-label">Açık Adres</label>
                <textarea className="fc-textarea" name="address" placeholder="Mahalle, sokak, ilçe, şehir..." value={formData.address} onChange={handleInputChange} required/>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--brd)', margin: '8px 0' }}/>

              {/* Tarihler */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
              <button type="submit" className="btn-dark" style={{ marginTop: 12 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
                Oteli Sisteme Kaydet
              </button>
            </form>
          </div>

          {/* ── TABLO ── */}
          <div className="fc-card fc-up" style={{ padding: '28px', animationDelay: '0.1s' }}>
            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--brd)', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>Sistemdeki Oteller</h2>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Kayıtlı otellerin durumunu ve detaylarını yönetin.</p>
              </div>
              {/* Search */}
              <div className="fc-search-bar" style={{ width: 280 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--light)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  type="text"
                  placeholder="Otel adı, kodu veya email ara..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light)', padding: '4px', display: 'flex', alignItems: 'center', borderRadius: '50%' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '64px 0', color: 'var(--muted)', fontSize: 14, fontWeight: 500 }}>
                <span className="fc-spin" style={{ width: 20, height: 20, border: '2.5px solid var(--brd)', borderTopColor: 'var(--red)', borderRadius: '50%', display: 'inline-block' }}/>
                Veriler yükleniyor...
              </div>
            ) : filtered.length > 0 ? (
              <div className="fc-table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: 'var(--paper)', borderBottom: '1px solid var(--brd)' }}>
                      {['Otel Bilgileri','İletişim','Mali Veriler','Üyelik Bitiş','Durum'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontFamily: 'var(--F)', fontWeight: 600, color: 'var(--muted)', letterSpacing: '.02em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((hotel, index) => (
                      <tr key={hotel._id} className="trow" style={{ borderBottom: index === filtered.length - 1 ? 'none' : '1px solid var(--brd)' }}>
                        {/* Otel adı + kod */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                              background: '#F2F4F7', border: '1px solid #E4E7EC',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: 'var(--F)', fontSize: 13, fontWeight: 600, color: 'var(--muted)',
                            }}>
                              {hotel.hotelName?.slice(0,2).toUpperCase() || '??'}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{hotel.hotelName}</p>
                              <p style={{ fontSize: 12, fontFamily: 'var(--M)', color: 'var(--muted)', marginTop: 4 }}>#{hotel.hotelCode}</p>
                            </div>
                          </div>
                        </td>
                        {/* Email */}
                        <td style={{ padding: '16px 20px', color: 'var(--muted)', fontWeight: 500 }}>{hotel.email}</td>
                        {/* Mali */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <p style={{ fontSize: 12, fontFamily: 'var(--F)', color: 'var(--ink)', fontWeight: 500 }}>
                              <span style={{ color: 'var(--light)', marginRight: 6 }}>VD</span>{hotel.taxOffice}
                            </p>
                            <p style={{ fontSize: 12, fontFamily: 'var(--M)', color: 'var(--muted)' }}>
                              <span style={{ color: 'var(--light)', marginRight: 6, fontFamily: 'var(--F)' }}>VN</span>{hotel.taxNumber}
                            </p>
                          </div>
                        </td>
                        {/* Bitiş tarihi */}
                        <td style={{ padding: '16px 20px', fontFamily: 'var(--M)', fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>
                          {new Date(hotel.membershipEndDate).toLocaleDateString('tr-TR')}
                        </td>
                        {/* Durum */}
                        <td style={{ padding: '16px 20px' }}>
                          <StatusBadge active={hotel.isActive}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--paper)', borderRadius: 12, border: '1px dashed #D0D5DD' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FFFFFF', border: '1px solid var(--brd)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--light)" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
                  {search ? 'Arama sonucu bulunamadı' : 'Henüz otel eklenmedi'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
                  {search ? `"${search}" kriterine uygun bir otel kaydı görünmüyor.` : 'Sisteme yeni bir otel tanımlamak için sol taraftaki formu kullanabilirsiniz.'}
                </p>
              </div>
            )}

            {/* Tablo footer */}
            {!loading && filtered.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--brd)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontFamily: 'var(--F)', fontWeight: 500, color: 'var(--muted)' }}>
                  {search ? `Toplam ${hotels.length} otel içinden ${filtered.length} sonuç gösteriliyor` : `Toplam ${hotels.length} otel listeleniyor`}
                </span>
                {search && (
                  <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--F)', fontWeight: 600, color: 'var(--red)' }}>
                    Filtreyi Temizle
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