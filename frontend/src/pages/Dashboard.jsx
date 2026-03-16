import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
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
if (!document.head.querySelector('[data-fc-dash]')) {
  const s = document.createElement('style');
  s.dataset.fcDash = '1';
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --red:    #C8211A;
      --red-h:  #A81913;
      --red-s:  rgba(200,33,26,.08);
      --red-b:  rgba(200,33,26,.18);
      --ink:    #0E0E0E;
      --ink2:   #1A1A1A;
      --paper:  #FAFAF8;
      --card:   #FFFFFF;
      --sec:    #F3F2EE;
      --border: #E6E6E3;
      --brd2:   #EBEBEA;
      --muted:  #6B6B6B;
      --light:  #A0A0A0;
      --F: "Bricolage Grotesque", sans-serif;
      --M: "Geist Mono", monospace;
    }
    html { scroll-behavior: smooth; }

    /* Spinner */
    @keyframes fc-spin  { to { transform: rotate(360deg); } }
    @keyframes fc-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
    @keyframes fc-up    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
    .fc-spin  { animation: fc-spin .8s linear infinite; }
    .fc-blink { animation: fc-blink 2s ease infinite; }
    .fc-up    { animation: fc-up .5s cubic-bezier(.22,1,.36,1) both; }

    /* Shared input */
    .fc-input, .fc-select {
      width: 100%; border: 1.5px solid var(--border);
      border-radius: 9px; padding: 11px 14px;
      font-size: 13px; font-weight: 500;
      font-family: var(--F); color: var(--ink);
      background: var(--paper); outline: none;
      transition: border-color .2s, box-shadow .2s;
      appearance: none;
    }
    .fc-input::placeholder { color: var(--light); font-weight: 400; }
    .fc-input:focus, .fc-select:focus {
      border-color: var(--red);
      box-shadow: 0 0 0 3px rgba(200,33,26,.1);
      background: #fff;
    }
    .fc-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A0A0A0' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; cursor: pointer; }

    /* Label */
    .fc-label {
      display: block; font-size: 10px; font-weight: 500;
      font-family: var(--M); color: var(--muted);
      letter-spacing: .08em; text-transform: uppercase; margin-bottom: 7px;
    }

    /* File input */
    .fc-file-wrap { position: relative; }
    .fc-file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
    .fc-file-face {
      display: flex; align-items: center; gap: 10px;
      border: 1.5px dashed var(--border); border-radius: 9px;
      padding: 14px; background: var(--paper);
      transition: border-color .2s, background .2s;
      cursor: pointer;
    }
    .fc-file-wrap:hover .fc-file-face { border-color: var(--red); background: #fff; }

    /* Btn variants */
    .btn-red {
      background: var(--red); color: #fff; border: none; cursor: pointer;
      font-family: var(--F); font-size: 13px; font-weight: 700;
      border-radius: 9px; padding: 11px 18px;
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      transition: background .15s, box-shadow .15s, transform .15s;
      box-shadow: 0 4px 16px rgba(200,33,26,.25);
    }
    .btn-red:hover:not(:disabled) { background: var(--red-h); box-shadow: 0 6px 22px rgba(200,33,26,.35); transform: translateY(-1px); }
    .btn-red:disabled { opacity:.65; cursor:not-allowed; }

    .btn-dark {
      background: var(--ink2); color: #fff; border: none; cursor: pointer;
      font-family: var(--F); font-size: 13px; font-weight: 700;
      border-radius: 9px; padding: 11px 18px;
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      transition: background .15s, box-shadow .15s;
      box-shadow: 0 4px 14px rgba(14,14,14,.18);
    }
    .btn-dark:hover { background: #2a2a2a; box-shadow: 0 6px 20px rgba(14,14,14,.25); }

    .btn-outline {
      background: var(--card); color: var(--ink); border: 1.5px solid var(--border); cursor: pointer;
      font-family: var(--F); font-size: 13px; font-weight: 600;
      border-radius: 9px; padding: 11px 18px;
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      transition: border-color .15s, box-shadow .15s;
    }
    .btn-outline:hover { border-color: #C0BFB8; box-shadow: 0 3px 12px rgba(14,14,14,.07); }

    /* Tab */
    .fc-tab {
      padding: 10px 4px 12px; font-size: 13px; font-weight: 600;
      font-family: var(--F); background: none; border: none; cursor: pointer;
      border-bottom: 2px solid transparent; color: var(--muted);
      transition: color .15s, border-color .15s;
    }
    .fc-tab:hover  { color: var(--ink); }
    .fc-tab.active { color: var(--red); border-bottom-color: var(--red); }

    /* Table row */
    .trow:hover { background: var(--sec); }

    /* Card */
    .fc-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 14px; overflow: hidden;
    }

    /* Logout btn */
    .btn-logout {
      background: transparent; border: 1px solid var(--border); cursor: pointer;
      font-family: var(--F); font-size: 13px; font-weight: 600; color: var(--muted);
      border-radius: 8px; padding: 8px 16px;
      transition: border-color .15s, color .15s, background .15s;
    }
    .btn-logout:hover { border-color: rgba(200,33,26,.35); color: var(--red); background: var(--red-s); }

    /* Stat card */
    .stat-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 12px; padding: 18px 20px;
      transition: box-shadow .2s;
    }

    /* Info box */
    .fc-info {
      background: #EFF6FF; border: 1px solid #BFDBFE;
      border-radius: 8px; padding: 11px 14px;
      font-size: 12px; color: #1E40AF; line-height: 1.6;
    }
  `;
  document.head.appendChild(s);
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const Badge = ({ color }) => {
  const map = {
    yesil:   { bg:'#ECFDF5', c:'#065F46', b:'#6EE7B7', dot:'#10B981', label:'Aktif' },
    sari:    { bg:'#FFFBEB', c:'#78350F', b:'#FCD34D', dot:'#F59E0B', label:'30 Gün' },
    kirmizi: { bg:'#FEF2F2', c:'#7F1D1D', b:'#FCA5A5', dot:'#EF4444', label:'Geçersiz' },
  };
  const s = map[color]; if (!s) return null;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      background:s.bg, color:s.c, border:`1px solid ${s.b}`,
      fontSize:10, fontWeight:600, fontFamily:'var(--M)',
      padding:'3px 9px', borderRadius:20, letterSpacing:'.03em', whiteSpace:'nowrap',
    }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:s.dot, flexShrink:0 }}/>
      {s.label}
    </span>
  );
};

const getStatusColor = (expiryDate) => {
  const now  = new Date();
  const exp  = new Date(expiryDate);
  const diff = (exp - now) / (1000 * 60 * 60 * 24);
  if (diff < 0)  return 'kirmizi';
  if (diff < 30) return 'sari';
  return 'yesil';
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('belgeler');
  const [reports,   setReports]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [fileName,  setFileName]  = useState('');
  const [formData,  setFormData]  = useState({
    documentCategory: 'Yangın Tüpü Kontrol Raporu',
    issueDate: '', expiryDate: '', institutionName: '', document: null,
  });

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch { setError('Raporlar yüklenirken hata oluştu.'); }
    finally   { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, document: file });
    setFileName(file ? file.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!formData.document) { setError('Lütfen taratılmış bir belge yükleyin.'); return; }
    const data = new FormData();
    ['documentCategory','issueDate','expiryDate','institutionName'].forEach(k => data.append(k, formData[k]));
    data.append('document', formData.document);
    try {
      await api.post('/reports', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Belge başarıyla sisteme kaydedildi.');
      setFormData({ documentCategory:'Yangın Tüpü Kontrol Raporu', issueDate:'', expiryDate:'', institutionName:'', document:null });
      setFileName('');
      fetchReports();
    } catch (err) { setError(err.response?.data?.message || 'Belge yüklenemedi.'); }
  };

  /* ── Stat summary ── */
  const stats = {
    total:   reports.length,
    active:  reports.filter(r => getStatusColor(r.expiryDate) === 'yesil').length,
    warning: reports.filter(r => getStatusColor(r.expiryDate) === 'sari').length,
    expired: reports.filter(r => getStatusColor(r.expiryDate) === 'kirmizi').length,
  };

  const W = { maxWidth: 1160, margin: '0 auto', padding: '0 28px' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--paper)', fontFamily:'var(--F)', color:'var(--ink)' }}>

      {/* ── HEADER ── */}
      <header style={{
        position:'sticky', top:0, zIndex:40,
        background:'rgba(250,250,248,.92)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid var(--brd2)',
      }}>
        <div style={{ ...W, height:60, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          {/* Left */}
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <div style={{ width:28, height:28, background:'var(--red)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 10px rgba(200,33,26,.4)' }}>
                <svg width="12" height="14" viewBox="0 0 14 16" fill="none">
                  <path d="M7 1C7 1 9.5 4.5 9.5 7C9.5 8.38 8.94 9.63 8.03 10.55C8.43 9.75 8.67 8.86 8.67 7.92C8.67 5.92 7.42 4.25 7.42 4.25C7.42 4.25 6.17 6.5 6.17 8.08C6.17 9.47 6.89 10.68 7.96 11.42C7.41 11.93 6.67 12.25 5.83 12.25C4.23 12.25 2.92 10.94 2.92 9.33C2.92 8.08 3.75 7 3.75 7C3.75 7 2.17 8.67 2.17 10.83C2.17 14.07 4.61 16 7 16C10.04 16 12.5 13.54 12.5 10.5C12.5 6.5 7 1 7 1Z" fill="white"/>
                </svg>
              </div>
              <span style={{ fontWeight:700, fontSize:15, letterSpacing:'-.02em' }}>FireCheckup</span>
            </div>
            <div style={{ width:1, height:20, background:'var(--brd2)' }}/>
            <span style={{ fontSize:12, fontFamily:'var(--M)', color:'var(--muted)', letterSpacing:'.04em' }}>
              Yönetim Paneli
            </span>
            {user?.hotelName && (
              <>
                <div style={{ width:1, height:20, background:'var(--brd2)' }}/>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--ink)' }}>{user.hotelName}</span>
              </>
            )}
          </div>
          {/* Right */}
          <button onClick={logout} className="btn-logout" style={{ display:'flex', alignItems:'center', gap:7 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Çıkış Yap
          </button>
        </div>
      </header>

      <div style={{ ...W, paddingTop:32, paddingBottom:64 }}>

        {/* ── STATS ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
          {[
            { label:'Toplam Belge',  value:stats.total,   dot:null },
            { label:'Aktif',         value:stats.active,  dot:'#10B981' },
            { label:'Uyarı',         value:stats.warning, dot:'#F59E0B' },
            { label:'Geçersiz',      value:stats.expired, dot:'#EF4444' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontSize:10, fontFamily:'var(--M)', color:'var(--muted)', letterSpacing:'.07em', textTransform:'uppercase' }}>{s.label}</span>
                {s.dot && <span style={{ width:7, height:7, borderRadius:'50%', background:s.dot }}/>}
              </div>
              <span style={{ fontSize:28, fontWeight:800, letterSpacing:'-.04em', color:'var(--ink)', lineHeight:1 }}>{loading ? '—' : s.value}</span>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display:'flex', gap:4, borderBottom:'1px solid var(--brd2)', marginBottom:28 }}>
          {[['belgeler','Denetim Belgeleri'],['uyelik','Üyelik & Mali Veriler']].map(([id, label]) => (
            <button key={id} className={`fc-tab${activeTab===id?' active':''}`} style={{ marginRight:12 }} onClick={() => setActiveTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ BELGELER TAB ══ */}
        {activeTab === 'belgeler' && (
          <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:20, alignItems:'start' }}>

            {/* ── Form panel ── */}
            <div className="fc-card fc-up" style={{ padding:'24px' }}>
              <div style={{ marginBottom:20, paddingBottom:16, borderBottom:'1px solid var(--brd2)' }}>
                <p style={{ fontSize:10, fontFamily:'var(--M)', color:'var(--red)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>Yeni Belge</p>
                <h2 style={{ fontSize:17, fontWeight:800, letterSpacing:'-.03em', color:'var(--ink)' }}>Belge Yükle</h2>
              </div>

              {/* Alerts */}
              {error && (
                <div style={{ display:'flex', gap:9, alignItems:'flex-start', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:9, padding:'11px 14px', marginBottom:16, fontSize:12, fontWeight:500, color:'#7F1D1D', lineHeight:1.5 }}>
                  <svg style={{ flexShrink:0, marginTop:1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ display:'flex', gap:9, alignItems:'flex-start', background:'#ECFDF5', border:'1px solid #6EE7B7', borderRadius:9, padding:'11px 14px', marginBottom:16, fontSize:12, fontWeight:500, color:'#065F46', lineHeight:1.5 }}>
                  <svg style={{ flexShrink:0, marginTop:1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {/* Belge türü */}
                <div>
                  <label className="fc-label">Belge Türü</label>
                  <select name="documentCategory" value={formData.documentCategory} onChange={handleInputChange} className="fc-select">
                    <option>Yangın Tüpü Kontrol Raporu</option>
                    <option>Sprinkler Kontrol Formu</option>
                    <option>Acil Aydınlatma Testi</option>
                    <option>Diğer Denetim Belgesi</option>
                  </select>
                </div>
                {/* Kurum */}
                <div>
                  <label className="fc-label">Denetçi Kurum / Firma</label>
                  <input className="fc-input" type="text" name="institutionName" value={formData.institutionName} onChange={handleInputChange} placeholder="Kurum Adı" required/>
                </div>
                {/* Tarihler */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <div>
                    <label className="fc-label">Veriliş T.</label>
                    <input className="fc-input" type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} required/>
                  </div>
                  <div>
                    <label className="fc-label">Bitiş T.</label>
                    <input className="fc-input" type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required/>
                  </div>
                </div>
                {/* Dosya */}
                <div>
                  <label className="fc-label">Taranmış Dosya (PDF / JPG)</label>
                  <div className="fc-file-wrap">
                    <input type="file" name="document" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="fc-file-input" required/>
                    <div className="fc-file-face">
                      <div style={{ width:32, height:32, borderRadius:7, background:'var(--sec)', border:'1px solid var(--brd2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <div>
                        <p style={{ fontSize:12, fontWeight:600, color: fileName ? 'var(--ink)' : 'var(--muted)' }}>
                          {fileName || 'Dosya seçin veya sürükleyin'}
                        </p>
                        <p style={{ fontSize:11, color:'var(--light)', marginTop:2 }}>PDF, JPG, PNG — maks. 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Submit */}
                <button type="submit" className="btn-red" style={{ width:'100%', padding:'12px', marginTop:4, fontSize:14 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Belgeyi Arşive Ekle
                </button>
              </form>
            </div>

            {/* ── Tablo panel ── */}
            <div className="fc-card fc-up" style={{ padding:'24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, paddingBottom:16, borderBottom:'1px solid var(--brd2)' }}>
                <div>
                  <p style={{ fontSize:10, fontFamily:'var(--M)', color:'var(--red)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>Arşiv</p>
                  <h2 style={{ fontSize:17, fontWeight:800, letterSpacing:'-.03em', color:'var(--ink)' }}>Geçmiş Belgeler</h2>
                </div>
                <span style={{ fontSize:11, fontFamily:'var(--M)', color:'var(--muted)', background:'var(--sec)', border:'1px solid var(--brd2)', borderRadius:6, padding:'4px 10px' }}>
                  {reports.length} belge
                </span>
              </div>

              {loading ? (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'32px 0', color:'var(--muted)', fontSize:13 }}>
                  <span className="fc-spin" style={{ width:16, height:16, border:'2px solid var(--brd2)', borderTopColor:'var(--red)', borderRadius:'50%', display:'inline-block' }}/>
                  Yükleniyor...
                </div>
              ) : reports.length > 0 ? (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                    <thead>
                      <tr style={{ borderBottom:'1px solid var(--brd2)' }}>
                        {['Belge Türü','Kurum','Bitiş Tarihi','Durum',''].map(h => (
                          <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:10, fontFamily:'var(--M)', fontWeight:500, color:'var(--light)', letterSpacing:'.07em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map(r => {
                        const color = getStatusColor(r.expiryDate);
                        const bar   = color==='yesil'?'#10B981':color==='sari'?'#F59E0B':'#EF4444';
                        return (
                          <tr key={r._id} className="trow" style={{ borderBottom:'1px solid var(--brd2)', transition:'background .12s' }}>
                            <td style={{ padding:'13px 12px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:3, height:32, borderRadius:2, background:bar, flexShrink:0 }}/>
                                <span style={{ fontWeight:700, color:'var(--ink)', lineHeight:1.3 }}>{r.documentCategory}</span>
                              </div>
                            </td>
                            <td style={{ padding:'13px 12px', color:'var(--muted)', fontWeight:500 }}>{r.institutionName}</td>
                            <td style={{ padding:'13px 12px', fontFamily:'var(--M)', fontSize:12, color:'var(--ink)', fontWeight:500 }}>
                              {new Date(r.expiryDate).toLocaleDateString('tr-TR')}
                            </td>
                            <td style={{ padding:'13px 12px' }}>
                              <Badge color={color}/>
                            </td>
                            <td style={{ padding:'13px 12px' }}>
                              <a href={r.documentUrl} target="_blank" rel="noreferrer" style={{
                                display:'inline-flex', alignItems:'center', gap:5,
                                fontSize:12, fontWeight:600, color:'var(--ink)',
                                background:'var(--sec)', border:'1px solid var(--brd2)',
                                borderRadius:7, padding:'6px 12px', textDecoration:'none',
                                transition:'border-color .15s',
                              }}
                                onMouseEnter={e=>e.currentTarget.style.borderColor='#C0BFB8'}
                                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--brd2)'}>
                                Görüntüle
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'48px 24px', background:'var(--paper)', borderRadius:10, border:'1.5px dashed var(--brd2)' }}>
                  <div style={{ width:44, height:44, borderRadius:11, background:'var(--sec)', border:'1px solid var(--brd2)', margin:'0 auto 14px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--light)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <p style={{ fontWeight:700, fontSize:14, color:'var(--muted)' }}>Henüz belge yüklenmedi</p>
                  <p style={{ fontSize:12, color:'var(--light)', marginTop:5 }}>Sol formu kullanarak ilk belgeyi ekleyin.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ══ ÜYELİK TAB ══ */}
        {activeTab === 'uyelik' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'start' }}>

            {/* Mali veriler */}
            <div className="fc-card fc-up" style={{ padding:'24px' }}>
              <div style={{ marginBottom:20, paddingBottom:16, borderBottom:'1px solid var(--brd2)' }}>
                <p style={{ fontSize:10, fontFamily:'var(--M)', color:'var(--red)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>Kurumsal</p>
                <h2 style={{ fontSize:17, fontWeight:800, letterSpacing:'-.03em', color:'var(--ink)' }}>Mali & Şirket Verileri</h2>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
                {[
                  { l:'Vergi Dairesi',   v:'Karşıyaka V.D.' },
                  { l:'Vergi Numarası',  v:'1234567890' },
                  { l:'Fatura Adresi',   v:'Örnek Mah. 123 Sok. No:4 İzmir/Türkiye' },
                ].map(f => (
                  <div key={f.l} style={{ background:'var(--paper)', border:'1px solid var(--brd2)', borderRadius:9, padding:'13px 16px' }}>
                    <p style={{ fontSize:10, fontFamily:'var(--M)', color:'var(--light)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:5 }}>{f.l}</p>
                    <p style={{ fontSize:14, fontWeight:700, color:'var(--ink)', lineHeight:1.4 }}>{f.v}</p>
                  </div>
                ))}
              </div>
              <div className="fc-info" style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
                <svg style={{ flexShrink:0, marginTop:1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Fatura bilgilerinizde değişiklik için sistem yöneticisi ile iletişime geçiniz.
              </div>
            </div>

            {/* Üyelik & ödeme */}
            <div className="fc-card fc-up" style={{ padding:'24px', display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ paddingBottom:16, borderBottom:'1px solid var(--brd2)' }}>
                <p style={{ fontSize:10, fontFamily:'var(--M)', color:'var(--red)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>Üyelik</p>
                <h2 style={{ fontSize:17, fontWeight:800, letterSpacing:'-.03em', color:'var(--ink)' }}>Yıllık Kayıt Ücreti</h2>
              </div>

              {/* Üyelik durumu */}
              <div style={{ background:'var(--paper)', border:'1px solid var(--brd2)', borderRadius:10, padding:'18px 20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:10 }}>
                  <div>
                    <p style={{ fontSize:10, fontFamily:'var(--M)', color:'var(--light)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:5 }}>Sistem Üyeliği Bitiş</p>
                    <p style={{ fontSize:22, fontWeight:800, letterSpacing:'-.04em', color:'var(--ink)' }}>31 Aralık 2026</p>
                  </div>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:6,
                    background:'#ECFDF5', color:'#065F46', border:'1px solid #6EE7B7',
                    fontSize:11, fontWeight:700, fontFamily:'var(--M)',
                    padding:'5px 12px', borderRadius:20, letterSpacing:'.04em',
                  }}>
                    <span className="fc-blink" style={{ width:6, height:6, borderRadius:'50%', background:'#10B981', display:'inline-block' }}/>
                    Aktif Üye
                  </span>
                </div>
                <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, paddingTop:14, borderTop:'1px solid var(--brd2)' }}>
                  Kaydınızın devam etmesi ve belgelerinizin dışarıya açık kalması için yıllık kayıt ücretini ödemeniz gerekmektedir.
                </p>
              </div>

              {/* Ödeme butonları */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <button className="btn-dark" style={{ padding:'13px', fontSize:14 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Kredi Kartı
                </button>
                <button className="btn-outline" style={{ padding:'13px', fontSize:14 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  Havale
                </button>
              </div>

              {/* Fatura geçmişi placeholder */}
              <div style={{ background:'var(--paper)', border:'1.5px dashed var(--brd2)', borderRadius:10, padding:'20px', textAlign:'center' }}>
                <p style={{ fontSize:13, fontWeight:600, color:'var(--muted)' }}>Fatura geçmişi</p>
                <p style={{ fontSize:12, color:'var(--light)', marginTop:4 }}>Önceki ödemeleriniz burada görünecek.</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;