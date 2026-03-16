import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

/* ─── Fonts ──────────────────────────────────────────────────────────────── */
if (!document.head.querySelector('[data-fc-f]')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Geist+Mono:wght@400;500&display=swap';
  l.dataset.fcF = '1';
  document.head.appendChild(l);
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
if (!document.head.querySelector('[data-fc-s]')) {
  const s = document.createElement('style');
  s.dataset.fcS = '1';
  s.textContent = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --ink:#0E0E0E;
      --ink2:#1A1A1A;
      --paper:#FAFAF8;
      --card:#FFFFFF;
      --section:#F3F2EE;
      --red:#C8211A;
      --red-h:#A81913;
      --red-s:rgba(200,33,26,.1);
      --red-b:rgba(200,33,26,.2);
      --muted:#6B6B6B;
      --light:#A0A0A0;
      --border:#E6E6E3;
      --border2:#EBEBEA;
      --hero-bg:#0B0C0F;
      --hero-card:rgba(255,255,255,.06);
      --hero-border:rgba(255,255,255,.1);
      --hero-muted:rgba(255,255,255,.45);
      --hero-text:#F8F8F6;
      --F:"Bricolage Grotesque",sans-serif;
      --M:"Geist Mono",monospace;
    }
    html{scroll-behavior:smooth}

    /* ── Animations ── */
    @keyframes up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}

    .up{animation:up .6s cubic-bezier(.22,1,.36,1) both}
    .d1{animation-delay:.08s}.d2{animation-delay:.17s}.d3{animation-delay:.26s}.d4{animation-delay:.37s}
    .spin{animation:spin .8s linear infinite}
    .blink{animation:blink 2s ease infinite}
    .float{animation:float 4s ease-in-out infinite}

    /* ── Card hover ── */
    .hcard{transition:border-color .2s,box-shadow .2s,transform .22s cubic-bezier(.34,1.56,.64,1)}
    .hcard:hover{border-color:#D0CFC8!important;box-shadow:0 12px 40px rgba(14,14,14,.09);transform:translateY(-4px)}

    /* ── Search ── */
    .srch{transition:box-shadow .2s,border-color .2s}
    .srch:focus-within{border-color:rgba(255,255,255,.35)!important;box-shadow:0 0 0 3px rgba(200,33,26,.35)}
    input::placeholder{color:var(--hero-muted)}
    input:focus{outline:none}

    /* ── Btn ── */
    .btn-red{background:var(--red);color:#fff;border:none;cursor:pointer;font-family:var(--F);font-size:14px;font-weight:600;border-radius:9px;transition:background .15s,transform .15s,box-shadow .15s}
    .btn-red:hover{background:var(--red-h);box-shadow:0 6px 24px rgba(200,33,26,.35)}
    .btn-ghost{background:transparent;color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.18);cursor:pointer;font-family:var(--F);font-size:14px;font-weight:500;border-radius:9px;transition:background .15s,border-color .15s,color .15s;text-decoration:none;display:inline-flex;align-items:center}
    .btn-ghost:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.35);color:#fff}
    .btn-outline{background:#fff;color:var(--ink);border:1px solid var(--border);cursor:pointer;font-family:var(--F);font-size:14px;font-weight:600;border-radius:9px;transition:border-color .15s,box-shadow .15s;text-decoration:none;display:inline-flex;align-items:center}
    .btn-outline:hover{border-color:#C0BFB8;box-shadow:0 4px 16px rgba(14,14,14,.07)}

    /* ── Nav link ── */
    .nl{color:rgba(255,255,255,.55);font-size:14px;font-weight:500;text-decoration:none;font-family:var(--F);transition:color .15s;position:relative}
    .nl:hover{color:#fff}

    /* ── FAQ ── */
    .faq summary::-webkit-details-marker{display:none}
    .faq[open] .fi{transform:rotate(45deg);background:var(--red);color:#fff;border-color:transparent}
    .fi{transition:transform .25s cubic-bezier(.76,0,.24,1),background .2s}

    /* ── Step ── */
    .step:hover .sn{background:var(--red);color:#fff;border-color:var(--red)}
    .sn{transition:background .2s,color .2s,border-color .2s}

    /* ── Footer link ── */
    .fl{color:rgba(255,255,255,.4);font-size:13px;text-decoration:none;font-family:var(--F);transition:color .15s}
    .fl:hover{color:rgba(255,255,255,.85)}

    /* ── Result card ── */
    .rlink{transition:background .15s,color .15s}
    .rlink:hover{background:var(--section)!important}

    /* ── Stat badge ── */
    @keyframes ring{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.3)}50%{box-shadow:0 0 0 5px rgba(16,185,129,0)}}
    .ring{animation:ring 2.4s ease infinite}
  `;
  document.head.appendChild(s);
}

/* ── Component ──────────────────────────────────────────────────────────────── */
const PublicSearch = () => {
  const [query,   setQuery]   = useState('');
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(''); setResult(null); setLoading(true);
    try {
      const r = await api.get(`/public/search/${query}`);
      setResult(r.data);
      setTimeout(() => document.getElementById('sonuclar')?.scrollIntoView({ behavior:'smooth' }), 200);
    } catch (err) {
      setError(err.response?.data?.message || 'Otel bulunamadı.');
    } finally { setLoading(false); }
  };

  const getBadge = (color) => {
    const m = {
      yesil:   { bg:'#ECFDF5', c:'#065F46', b:'#6EE7B7', dot:'#10B981', label:'Aktif',        ring:true },
      sari:    { bg:'#FFFBEB', c:'#78350F', b:'#FCD34D', dot:'#F59E0B', label:'30 Gün Kaldı', ring:false },
      kirmizi: { bg:'#FEF2F2', c:'#7F1D1D', b:'#FCA5A5', dot:'#EF4444', label:'Süresi Geçti', ring:false },
    };
    const s = m[color]; if (!s) return null;
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', gap:5,
        background:s.bg, color:s.c, border:`1px solid ${s.b}`,
        fontSize:11, fontWeight:600, fontFamily:'var(--M)',
        padding:'4px 10px', borderRadius:20, letterSpacing:'.03em',
        whiteSpace:'nowrap',
      }}>
        <span className={s.ring ? 'ring' : ''} style={{ width:6, height:6, borderRadius:'50%', background:s.dot, flexShrink:0 }}/>
        {s.label}
      </span>
    );
  };

  const W = { maxWidth:1140, margin:'0 auto', padding:'0 28px' };

  /* ── Mock dashboard data for hero ── */
  const mockDocs = [
    { name:'Yangın Tüpü Muayenesi',    status:'yesil',   date:'Ara 2025', org:'İtfaiye Müd.' },
    { name:'Sprinkler Sistem Testi',   status:'sari',    date:'Oca 2026', org:'Teknik Ser.' },
    { name:'Acil Çıkış Aydınlatması',  status:'kirmizi', date:'Kas 2025', org:'EPDK Onaylı' },
    { name:'Yangın Kapısı Kontrolü',   status:'yesil',   date:'Şub 2026', org:'İtfaiye Müd.' },
  ];

  const statusStyle = (s) => ({
    yesil:   { dot:'#10B981', label:'Aktif',       text:'#065F46', bg:'#ECFDF5' },
    sari:    { dot:'#F59E0B', label:'Uyarı',        text:'#78350F', bg:'#FFFBEB' },
    kirmizi: { dot:'#EF4444', label:'Süresi Doldu', text:'#7F1D1D', bg:'#FEF2F2' },
  }[s] || {});

  return (
    <div style={{ minHeight:'100vh', background:'var(--paper)', color:'var(--ink)', fontFamily:'var(--F)', overflowX:'hidden' }}>

      {/* ════════════════════════════ HEADER ════════════════════════════════ */}
      <header style={{
        position:'fixed', top:0, width:'100%', zIndex:50,
        background:'rgba(11,12,15,.88)', backdropFilter:'blur(24px) saturate(180%)',
        borderBottom:'1px solid rgba(255,255,255,.06)',
      }}>
        <div style={{ ...W, height:62, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:32 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:30, height:30, background:'var(--red)', borderRadius:8,
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 2px 10px rgba(200,33,26,.5)',
                flexShrink:0,
              }}>
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                  <path d="M7 1C7 1 9.5 4.5 9.5 7C9.5 8.38 8.94 9.63 8.03 10.55C8.43 9.75 8.67 8.86 8.67 7.92C8.67 5.92 7.42 4.25 7.42 4.25C7.42 4.25 6.17 6.5 6.17 8.08C6.17 9.47 6.89 10.68 7.96 11.42C7.41 11.93 6.67 12.25 5.83 12.25C4.23 12.25 2.92 10.94 2.92 9.33C2.92 8.08 3.75 7 3.75 7C3.75 7 2.17 8.67 2.17 10.83C2.17 14.07 4.61 16 7 16C10.04 16 12.5 13.54 12.5 10.5C12.5 6.5 7 1 7 1Z" fill="white"/>
                </svg>
              </div>
              <span style={{ color:'#fff', fontWeight:700, fontSize:16, letterSpacing:'-.02em' }}>FireCheckup</span>
            </div>
            <nav style={{ display:'flex', gap:22 }}>
              {[['Ürün','#urun'],['Çözüm','#cozum'],['SSS','#sss']].map(([l,h]) => (
                <a key={l} href={h} className="nl">{l}</a>
              ))}
            </nav>
          </div>
          {/* Actions */}
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <Link to="/login" className="btn-ghost" style={{ padding:'8px 18px' }}>Otel Girişi</Link>
            <button className="btn-red" style={{ padding:'9px 20px' }}>Kayıt Sorgula</button>
          </div>
        </div>
      </header>

      <main style={{ paddingTop:62 }}>

        {/* ════════════════════════════ HERO ══════════════════════════════════ */}
        <section id="urun" style={{
          position:'relative', background:'var(--hero-bg)',
          padding:'80px 28px 96px', overflow:'hidden',
          borderBottom:'1px solid rgba(255,255,255,.06)',
        }}>
          {/* Grid texture */}
          <div style={{
            position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
            backgroundImage:'linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)',
            backgroundSize:'48px 48px',
          }}/>
          {/* Radial glow */}
          <div style={{
            position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
            width:800, height:400, pointerEvents:'none', zIndex:0,
            background:'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(200,33,26,.1) 0%, transparent 70%)',
          }}/>

          <div style={{ ...W, position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>

            {/* ── Left ── */}
            <div>
              {/* Tag */}
              <div className="up" style={{
                display:'inline-flex', alignItems:'center', gap:7, marginBottom:24,
                background:'rgba(200,33,26,.12)', border:'1px solid rgba(200,33,26,.25)',
                borderRadius:6, padding:'5px 12px',
              }}>
                <span className="blink" style={{ width:6, height:6, borderRadius:'50%', background:'var(--red)', display:'inline-block' }}/>
                <span style={{ fontSize:11, fontWeight:500, color:'rgba(255,255,255,.75)', fontFamily:'var(--M)', letterSpacing:'.06em', textTransform:'uppercase' }}>
                  Yangın Güvenlik Platformu
                </span>
              </div>

              {/* Headline */}
              <h1 className="up d1" style={{
                fontSize:'clamp(38px,4.2vw,58px)', fontWeight:800, lineHeight:1.05,
                letterSpacing:'-.04em', color:'var(--hero-text)', marginBottom:20,
              }}>
                Denetim<br/>belgeleri,<br/>
                <span style={{
                  color:'transparent',
                  background:'linear-gradient(90deg, #E85A52, #C8211A)',
                  WebkitBackgroundClip:'text', backgroundClip:'text',
                }}>tek yerde.</span>
              </h1>

              <p className="up d2" style={{
                fontSize:16, color:'var(--hero-muted)', lineHeight:1.72,
                fontWeight:400, marginBottom:40, maxWidth:440,
              }}>
                Otel yangın güvenlik belgelerini dijitalleştirin, geçerlilik tarihlerini otomatik takip edin, şeffaf biçimde paylaşın.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="up d3 srch" style={{
                display:'flex', alignItems:'stretch',
                background:'rgba(255,255,255,.06)',
                border:'1px solid var(--hero-border)',
                borderRadius:11, overflow:'hidden', maxWidth:500,
              }}>
                <div style={{ display:'flex', alignItems:'center', paddingLeft:16, color:'rgba(255,255,255,.3)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Otel adı veya kayıt kodu..."
                  required
                  style={{
                    flex:1, background:'transparent', border:'none', color:'var(--hero-text)',
                    fontSize:14, fontWeight:400, fontFamily:'var(--F)',
                    padding:'14px 12px',
                  }}
                />
                <button type="submit" disabled={loading} className="btn-red" style={{
                  borderRadius:0, margin:4, padding:'0 22px', fontSize:13,
                  display:'flex', alignItems:'center', gap:7, borderRadius:8,
                }}>
                  {loading
                    ? <span className="spin" style={{ width:15, height:15, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block' }}/>
                    : <>Sorgula <span style={{ fontSize:16, lineHeight:1 }}>→</span></>}
                </button>
              </form>

              {error && (
                <div className="up" style={{
                  marginTop:14, display:'inline-flex', alignItems:'center', gap:9,
                  background:'rgba(239,68,68,.12)', border:'1px solid rgba(239,68,68,.25)',
                  borderRadius:8, padding:'9px 15px',
                  fontSize:13, color:'#FCA5A5', fontWeight:500,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              {/* Trust row */}
              <div className="up d4" style={{ display:'flex', gap:24, marginTop:36, flexWrap:'wrap' }}>
                {['🔒 SSL Şifreli','📋 KVKK Uyumlu','⚡ Gerçek Zamanlı'].map(t => (
                  <span key={t} style={{ fontSize:12, color:'rgba(255,255,255,.35)', fontWeight:400 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* ── Right — premium dashboard mockup ── */}
            <div className="up d2 float" style={{
              background:'rgba(255,255,255,.05)',
              border:'1px solid rgba(255,255,255,.09)',
              borderRadius:18, overflow:'hidden',
              boxShadow:'0 32px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04)',
            }}>
              {/* Window chrome */}
              <div style={{
                background:'rgba(255,255,255,.04)',
                borderBottom:'1px solid rgba(255,255,255,.07)',
                padding:'13px 18px',
                display:'flex', alignItems:'center', justifyContent:'space-between',
              }}>
                <div style={{ display:'flex', gap:7 }}>
                  {['#FF5F57','#FFBD2E','#28C840'].map((c,i) => (
                    <span key={i} style={{ width:11, height:11, borderRadius:'50%', background:c, opacity:.8 }}/>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)', borderRadius:6, padding:'4px 12px' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#10B981', boxShadow:'0 0 6px #10B981' }}/>
                  <span style={{ fontFamily:'var(--M)', fontSize:11, color:'rgba(255,255,255,.45)', letterSpacing:'.04em' }}>HTL-00128 · Örnek Otel</span>
                </div>
                <span style={{ fontFamily:'var(--M)', fontSize:10, color:'rgba(255,255,255,.25)' }}>firecheckup.tr</span>
              </div>

              {/* Dashboard header */}
              <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontSize:12, fontFamily:'var(--M)', color:'rgba(255,255,255,.3)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:3 }}>Denetim Panosu</p>
                  <p style={{ fontSize:17, fontWeight:700, color:'rgba(255,255,255,.88)', letterSpacing:'-.02em' }}>Örnek Otel İstanbul</p>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  {[{v:'4',l:'Belge'},{v:'2',l:'Aktif'},{v:'1',l:'Uyarı'}].map(s => (
                    <div key={s.l} style={{ textAlign:'center', background:'rgba(255,255,255,.06)', borderRadius:8, padding:'7px 12px' }}>
                      <p style={{ fontSize:17, fontWeight:700, color:'#fff', letterSpacing:'-.02em', lineHeight:1 }}>{s.v}</p>
                      <p style={{ fontSize:10, color:'rgba(255,255,255,.35)', fontFamily:'var(--M)', marginTop:2 }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doc list */}
              <div style={{ padding:'10px 12px 14px' }}>
                {mockDocs.map((d, i) => {
                  const st = statusStyle(d.status);
                  return (
                    <div key={i} style={{
                      display:'flex', alignItems:'center', gap:12, padding:'10px 10px',
                      borderRadius:10, marginBottom:4,
                      borderLeft:`3px solid ${d.status==='yesil'?'#10B981':d.status==='sari'?'#F59E0B':'#EF4444'}`,
                      background:'rgba(255,255,255,.04)',
                    }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.8)', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name}</p>
                        <p style={{ fontSize:10, fontFamily:'var(--M)', color:'rgba(255,255,255,.3)' }}>{d.org} · {d.date}</p>
                      </div>
                      <span style={{
                        display:'inline-flex', alignItems:'center', gap:5,
                        background:st.bg, color:st.text, fontSize:10, fontWeight:600, fontFamily:'var(--M)',
                        padding:'3px 9px', borderRadius:20, flexShrink:0,
                      }}>
                        <span style={{ width:5, height:5, borderRadius:'50%', background:st.dot }}/>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════ STATS BAR ═════════════════════════════ */}
        <section style={{ background:'var(--section)', borderBottom:'1px solid var(--border2)' }}>
          <div style={{ ...W }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderLeft:'1px solid var(--border2)' }}>
              {[
                { v:'500+',    l:'Kayıtlı Otel' },
                { v:'12.000+', l:'Yüklenen Belge' },
                { v:'%99.9',   l:'Sistem Uptime' },
                { v:'<1 Sn',   l:'Sorgulama Süresi' },
              ].map(s => (
                <div key={s.l} style={{
                  padding:'32px 28px', borderRight:'1px solid var(--border2)',
                }}>
                  <p style={{ fontSize:28, fontWeight:800, letterSpacing:'-.03em', color:'var(--ink)', lineHeight:1 }}>{s.v}</p>
                  <p style={{ fontSize:13, color:'var(--muted)', marginTop:5, fontWeight:400 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════ FEATURES ══════════════════════════════ */}
        <section id="cozum" style={{ padding:'88px 28px', background:'var(--card)' }}>
          <div style={{ ...W }}>
            <div style={{ maxWidth:600, marginBottom:56 }}>
              <p style={{ fontSize:12, fontWeight:600, color:'var(--red)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10, fontFamily:'var(--M)' }}>Çözüm</p>
              <h2 style={{ fontSize:'clamp(28px,3.2vw,42px)', fontWeight:800, letterSpacing:'-.04em', color:'var(--ink)', lineHeight:1.1, marginBottom:14 }}>
                İşletmeler neden<br/>FireCheckup'a geçiyor?
              </h2>
              <p style={{ fontSize:16, color:'var(--muted)', lineHeight:1.7 }}>
                Kağıt klasörler değil; canlı dijital sistem. Kaçırılan son tarih yok.
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, border:'1px solid var(--border2)', borderRadius:16, overflow:'hidden' }}>
              {[
                {
                  n:'01', icon:(
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  ),
                  t:'Gerçek Zamanlı Takip',
                  d:'Belge geçerlilik sürelerini otomatik izleyen akıllı altyapı. Manuel kontrol gerektirmez.',
                  dark:false,
                },
                {
                  n:'02', icon:(
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  ),
                  t:'Kurumsal Güvenlik',
                  d:'SSL şifreleme ve rol tabanlı erişim kontrolü. Verileriniz yalnızca yetkili kişilere görünür.',
                  dark:true,
                },
                {
                  n:'03', icon:(
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  ),
                  t:'Şeffaf Paylaşım',
                  d:'Misafirler ve tedarikçiler, şifre gerekmeden otel belgelerini sorgulayabilir.',
                  dark:false,
                },
              ].map((f, i) => (
                <div key={f.n} className="hcard" style={{
                  background: f.dark ? 'var(--ink2)' : 'var(--card)',
                  padding:'44px 36px',
                  cursor:'default',
                  borderRight: i<2 ? '1px solid var(--border2)' : 'none',
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
                    <div style={{
                      width:44, height:44, borderRadius:11,
                      background: f.dark ? 'rgba(255,255,255,.08)' : 'var(--section)',
                      border:`1px solid ${f.dark ? 'rgba(255,255,255,.1)' : 'var(--border2)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color: f.dark ? 'rgba(255,255,255,.7)' : 'var(--ink)',
                    }}>{f.icon}</div>
                    <span style={{ fontFamily:'var(--M)', fontSize:11, color: f.dark ? 'rgba(255,255,255,.2)' : 'var(--light)', letterSpacing:'.04em' }}>{f.n}</span>
                  </div>
                  <h3 style={{ fontSize:19, fontWeight:700, letterSpacing:'-.03em', color: f.dark ? '#fff' : 'var(--ink)', marginBottom:10, lineHeight:1.2 }}>{f.t}</h3>
                  <p style={{ fontSize:14, color: f.dark ? 'rgba(255,255,255,.45)' : 'var(--muted)', lineHeight:1.72, fontWeight:400 }}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════ RESULTS ═══════════════════════════════ */}
        {result && (
          <section id="sonuclar" style={{ padding:'72px 28px', background:'var(--section)', borderTop:'1px solid var(--border2)', scrollMarginTop:80 }}>
            <div style={{ ...W }}>
              <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:16, marginBottom:36, paddingBottom:24, borderBottom:'1px solid var(--border)' }}>
                <div>
                  <p style={{ fontSize:11, fontFamily:'var(--M)', color:'var(--red)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Sorgulama Sonucu</p>
                  <h2 style={{ fontSize:'clamp(22px,3vw,36px)', fontWeight:800, letterSpacing:'-.04em', color:'var(--ink)', lineHeight:1.1 }}>{result.hotelName}</h2>
                  <p style={{ fontSize:12, fontFamily:'var(--M)', color:'var(--muted)', marginTop:5 }}>KOD: {result.hotelCode}</p>
                </div>
                {!result.isActive && (
                  <span style={{ fontSize:12, fontWeight:600, color:'var(--muted)', background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'7px 14px', fontFamily:'var(--M)', letterSpacing:'.04em' }}>
                    Sistem Üyeliği Pasif
                  </span>
                )}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
                {result.reports.map(doc => {
                  const bar = doc.statusColor==='yesil'?'#10B981':doc.statusColor==='sari'?'#F59E0B':'#EF4444';
                  return (
                    <div key={doc._id} className="hcard" style={{
                      background:'var(--card)', border:'1px solid var(--border)',
                      borderRadius:14, overflow:'hidden',
                    }}>
                      <div style={{ height:3, background:bar }}/>
                      <div style={{ padding:'20px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                          <h3 style={{ fontSize:15, fontWeight:700, letterSpacing:'-.02em', color:'var(--ink)', lineHeight:1.3, flex:1, paddingRight:12 }}>{doc.documentCategory}</h3>
                          {getBadge(doc.statusColor)}
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, background:'var(--section)', borderRadius:9, padding:'13px 14px', marginBottom:16 }}>
                          {[
                            {l:'Denetim Kurumu', v:doc.institutionName},
                            {l:'Bitiş Tarihi', v:new Date(doc.expiryDate).toLocaleDateString('tr-TR')},
                          ].map(f => (
                            <div key={f.l}>
                              <p style={{ fontSize:10, fontFamily:'var(--M)', color:'var(--light)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:4 }}>{f.l}</p>
                              <p style={{ fontSize:13, fontWeight:600, color:'var(--ink)' }}>{f.v}</p>
                            </div>
                          ))}
                        </div>
                        <a href={doc.documentUrl} target="_blank" rel="noreferrer" className="rlink" style={{
                          display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                          padding:'10px', borderRadius:9,
                          border:'1px solid var(--border)', background:'transparent',
                          fontSize:13, fontWeight:600, color:'var(--ink)', textDecoration:'none',
                          transition:'background .15s',
                        }}>
                          Belgeyi Görüntüle
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════ HOW IT WORKS ══════════════════════════ */}
        <section id="nasil-calisir" style={{ padding:'88px 28px', background:'var(--section)', borderTop:'1px solid var(--border2)' }}>
          <div style={{ ...W }}>
            <div style={{ textAlign:'center', maxWidth:500, margin:'0 auto 56px' }}>
              <p style={{ fontSize:12, fontWeight:600, color:'var(--red)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10, fontFamily:'var(--M)' }}>Nasıl Çalışır?</p>
              <h2 style={{ fontSize:'clamp(28px,3.2vw,42px)', fontWeight:800, letterSpacing:'-.04em', color:'var(--ink)', lineHeight:1.1 }}>
                3 adımda başlayın
              </h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {[
                { n:'01', t:'Otel Kayıt Yapar', d:'Yetkili personel belgeyi yükler, kurum adını ve bitiş tarihini girer.', tags:['Yükleme','Rol yönetimi'], active:false },
                { n:'02', t:'Sistem Takip Eder', d:'Yaklaşan ve geçen süreler otomatik işaretlenir, e-posta uyarısı gönderilir.', tags:['Otomatik takip','E-posta'], active:true },
                { n:'03', t:'Dışarıdan Görüntülenir', d:'Misafir veya tedarikçi otel adıyla arar, belgeleri inceler.', tags:['Şifresiz arama','Anlık sonuç'], active:false },
              ].map(s => (
                <div key={s.n} className={`hcard step`} style={{
                  background: s.active ? 'var(--ink2)' : 'var(--card)',
                  border:`1px solid ${s.active ? 'transparent' : 'var(--border)'}`,
                  borderRadius:14, padding:'32px 28px',
                  boxShadow: s.active ? '0 20px 60px rgba(14,14,14,.18)' : 'none',
                }}>
                  <div className="sn" style={{
                    width:40, height:40, borderRadius:10, marginBottom:24,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'var(--M)', fontSize:13, fontWeight:500, letterSpacing:'.04em',
                    background: s.active ? 'var(--red)' : 'var(--section)',
                    border:`1px solid ${s.active ? 'transparent' : 'var(--border)'}`,
                    color: s.active ? '#fff' : 'var(--muted)',
                    boxShadow: s.active ? '0 4px 16px rgba(200,33,26,.35)' : 'none',
                  }}>{s.n}</div>
                  <h3 style={{ fontSize:17, fontWeight:700, letterSpacing:'-.03em', color: s.active ? '#fff' : 'var(--ink)', marginBottom:10, lineHeight:1.2 }}>{s.t}</h3>
                  <p style={{ fontSize:13, color: s.active ? 'rgba(255,255,255,.5)' : 'var(--muted)', lineHeight:1.72, marginBottom:20 }}>{s.d}</p>
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap', paddingTop:18, borderTop:`1px solid ${s.active ? 'rgba(255,255,255,.08)' : 'var(--border2)'}` }}>
                    {s.tags.map(t => (
                      <span key={t} style={{
                        fontSize:11, fontFamily:'var(--M)', letterSpacing:'.04em',
                        color: s.active ? 'rgba(255,255,255,.4)' : 'var(--light)',
                        background: s.active ? 'rgba(255,255,255,.07)' : 'var(--section)',
                        border:`1px solid ${s.active ? 'rgba(255,255,255,.1)' : 'var(--border2)'}`,
                        borderRadius:5, padding:'3px 9px',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════ FAQ ════════════════════════════════════ */}
        <section id="sss" style={{ padding:'88px 28px', background:'var(--card)', borderTop:'1px solid var(--border2)' }}>
          <div style={{ maxWidth:720, margin:'0 auto' }}>
            <div style={{ marginBottom:48 }}>
              <p style={{ fontSize:12, fontWeight:600, color:'var(--red)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10, fontFamily:'var(--M)' }}>SSS</p>
              <h2 style={{ fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.04em', color:'var(--ink)', lineHeight:1.1 }}>
                Sık sorulan sorular
              </h2>
            </div>
            <div style={{ borderTop:'1px solid var(--border2)' }}>
              {[
                {q:'Bu platform denetim hizmeti veriyor mu?', a:'Hayır. FireCheckup yalnızca belge yönetimi ve şeffaf takip içindir. Fiziksel denetim sağlamaz.'},
                {q:'Misafir veya tedarikçi şifreyle mi giriş yapar?', a:'Hayır. Dış kullanıcılar yalnızca arama motorunu kullanır. Şifre yalnızca otel yönetimi içindir.'},
                {q:'Otel tarafında kimler yükleme yapabilir?', a:'Yalnızca sistem yöneticisi tarafından tanımlanmış, kullanıcı kodu ve şifreye sahip yetkili otel personeli yükleme yapabilir.'},
              ].map((item, i) => (
                <details key={i} className="faq" style={{ borderBottom:'1px solid var(--border2)' }}>
                  <summary style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'22px 0', cursor:'pointer', listStyle:'none',
                    fontSize:15, fontWeight:700, letterSpacing:'-.02em', color:'var(--ink)', userSelect:'none',
                    gap:16,
                  }}>
                    {item.q}
                    <span className="fi" style={{
                      width:28, height:28, borderRadius:8, flexShrink:0,
                      background:'var(--section)', border:'1px solid var(--border2)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:18, color:'var(--muted)', lineHeight:1, fontWeight:300,
                    }}>+</span>
                  </summary>
                  <div style={{ paddingBottom:22 }}>
                    <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.75 }}>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════ CTA ════════════════════════════════════ */}
        <section style={{
          background:'var(--hero-bg)',
          borderTop:'1px solid rgba(255,255,255,.06)',
          padding:'88px 28px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:600, height:300, pointerEvents:'none',
            background:'radial-gradient(ellipse, rgba(200,33,26,.08) 0%, transparent 70%)',
          }}/>
          <div style={{ ...W, position:'relative', zIndex:1 }}>
            <div style={{ maxWidth:560, margin:'0 auto', textAlign:'center' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:7, marginBottom:20,
                background:'rgba(200,33,26,.12)', border:'1px solid rgba(200,33,26,.25)',
                borderRadius:6, padding:'5px 12px',
              }}>
                <span className="blink" style={{ width:6, height:6, borderRadius:'50%', background:'var(--red)', display:'inline-block' }}/>
                <span style={{ fontSize:11, fontFamily:'var(--M)', color:'rgba(255,255,255,.7)', letterSpacing:'.06em', textTransform:'uppercase' }}>Ücretsiz Başlayın</span>
              </div>
              <h2 style={{ fontSize:'clamp(28px,3.5vw,46px)', fontWeight:800, letterSpacing:'-.04em', color:'var(--hero-text)', lineHeight:1.1, marginBottom:16 }}>
                Otelin belgelerini<br/>hemen sorgulayın
              </h2>
              <p style={{ fontSize:16, color:'var(--hero-muted)', marginBottom:36, lineHeight:1.65 }}>
                Şifre gerektirmez. Anlık sonuç.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <button className="btn-red" style={{ padding:'13px 32px', fontSize:15 }}>Kayıt Sorgula</button>
                <Link to="/login" className="btn-ghost" style={{ padding:'13px 32px', fontSize:15 }}>Otel Girişi</Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════════════ FOOTER ════════════════════════════════ */}
      <footer style={{ background:'#080809', borderTop:'1px solid rgba(255,255,255,.05)', padding:'56px 28px 32px' }}>
        <div style={{ ...W }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:40, marginBottom:48, paddingBottom:40, borderBottom:'1px solid rgba(255,255,255,.06)' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:14 }}>
                <div style={{ width:28, height:28, background:'var(--red)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="12" height="14" viewBox="0 0 14 16" fill="none"><path d="M7 1C7 1 9.5 4.5 9.5 7C9.5 8.38 8.94 9.63 8.03 10.55C8.43 9.75 8.67 8.86 8.67 7.92C8.67 5.92 7.42 4.25 7.42 4.25C7.42 4.25 6.17 6.5 6.17 8.08C6.17 9.47 6.89 10.68 7.96 11.42C7.41 11.93 6.67 12.25 5.83 12.25C4.23 12.25 2.92 10.94 2.92 9.33C2.92 8.08 3.75 7 3.75 7C3.75 7 2.17 8.67 2.17 10.83C2.17 14.07 4.61 16 7 16C10.04 16 12.5 13.54 12.5 10.5C12.5 6.5 7 1 7 1Z" fill="white"/></svg>
                </div>
                <span style={{ fontWeight:700, fontSize:15, color:'rgba(255,255,255,.88)', letterSpacing:'-.01em' }}>FireCheckup</span>
              </div>
              <p style={{ fontSize:13, lineHeight:1.72, color:'rgba(255,255,255,.35)', maxWidth:300, marginBottom:18, fontWeight:400 }}>
                Belgeler tek yerde. Şeffaflık ve düzen aynı anda. Oteller yükler, dış kullanıcı görüntüler.
              </p>
              <div style={{
                display:'inline-flex', alignItems:'flex-start', gap:8,
                background:'rgba(245,158,11,.07)', border:'1px solid rgba(245,158,11,.14)',
                borderRadius:8, padding:'10px 14px', fontSize:12, lineHeight:1.6,
                color:'rgba(255,255,255,.4)', maxWidth:300,
              }}>
                <span style={{ flexShrink:0, fontSize:13 }}>⚠</span>
                <span>Platform yalnızca belge yönetimi içindir. Denetim hizmeti sağlamaz.</span>
              </div>
            </div>
            {[
              { h:'Ürün', links:[['Çözüm','#urun'],['Özellikler','#cozum'],['Otel Girişi','/login']] },
              { h:'Yasal', links:[['Gizlilik Politikası','#'],['Kullanım Koşulları','#'],['KVKK Aydınlatma','#']] },
            ].map(col => (
              <div key={col.h}>
                <p style={{ fontSize:11, fontFamily:'var(--M)', color:'rgba(255,255,255,.25)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:18 }}>{col.h}</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:11 }}>
                  {col.links.map(([lbl,href]) => (
                    <li key={lbl}>
                      {href.startsWith('/')
                        ? <Link to={href} className="fl">{lbl}</Link>
                        : <a href={href} className="fl">{lbl}</a>
                      }
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
            <p style={{ fontSize:12, fontFamily:'var(--M)', color:'rgba(255,255,255,.18)' }}>© 2026 FireCheckup A.Ş. Tüm hakları saklıdır.</p>
            <p style={{ fontSize:12, fontFamily:'var(--M)', color:'rgba(255,255,255,.12)' }}>v2.0</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default PublicSearch;