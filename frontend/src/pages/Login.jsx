import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

/* ─── Fonts (aynı design system) ────────────────────────────────────────── */
if (!document.head.querySelector('[data-fc-f]')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Geist+Mono:wght@400;500&display=swap';
  l.dataset.fcF = '1';
  document.head.appendChild(l);
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
if (!document.head.querySelector('[data-fc-login]')) {
  const s = document.createElement('style');
  s.dataset.fcLogin = '1';
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --red:   #C8211A;
      --red-h: #A81913;
      --F: "Bricolage Grotesque", sans-serif;
      --M: "Geist Mono", monospace;
    }

    @keyframes fc-up   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
    @keyframes fc-spin { to   { transform: rotate(360deg); } }
    @keyframes fc-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

    .fc-up    { animation: fc-up   .55s cubic-bezier(.22,1,.36,1) both; }
    .fc-d1    { animation-delay: .07s; }
    .fc-d2    { animation-delay: .14s; }
    .fc-d3    { animation-delay: .21s; }
    .fc-spin  { animation: fc-spin .8s linear infinite; }
    .fc-blink { animation: fc-blink 2s ease infinite; }

    /* Input */
    .fc-input {
      width: 100%; border: 1.5px solid #E6E6E3;
      border-radius: 10px; padding: 13px 16px;
      font-size: 14px; font-weight: 500;
      font-family: var(--F); color: #0E0E0E;
      background: #FAFAF8;
      transition: border-color .2s, box-shadow .2s;
      outline: none;
    }
    .fc-input::placeholder { color: #A0A0A0; font-weight: 400; }
    .fc-input:focus {
      border-color: var(--red);
      box-shadow: 0 0 0 3px rgba(200,33,26,.12);
      background: #fff;
    }

    /* Password toggle */
    .fc-pw-wrap { position: relative; }
    .fc-pw-toggle {
      position: absolute; right: 14px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: #A0A0A0; padding: 4px;
      transition: color .15s;
      display: flex; align-items: center;
    }
    .fc-pw-toggle:hover { color: #6B6B6B; }

    /* Submit btn */
    .fc-submit {
      width: 100%; background: var(--red); color: #fff;
      border: none; border-radius: 10px;
      padding: 14px; font-size: 15px; font-weight: 700;
      font-family: var(--F); cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: background .15s, transform .15s, box-shadow .15s;
      box-shadow: 0 4px 20px rgba(200,33,26,.3);
    }
    .fc-submit:hover:not(:disabled) {
      background: var(--red-h);
      box-shadow: 0 8px 28px rgba(200,33,26,.38);
      transform: translateY(-1px);
    }
    .fc-submit:active:not(:disabled) { transform: scale(.985); }
    .fc-submit:disabled { opacity: .7; cursor: not-allowed; }

    /* Back link */
    .fc-back {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 500; color: #A0A0A0;
      text-decoration: none; font-family: var(--F);
      transition: color .15s;
    }
    .fc-back:hover { color: #0E0E0E; }
    .fc-back svg { transition: transform .2s; }
    .fc-back:hover svg { transform: translateX(-3px); }
  `;
  document.head.appendChild(s);
}

const Login = () => {
  const [loginId,  setLoginId]  = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/hotels/login', { loginId, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: 'var(--F)',
    }}>

      {/* ── Sol panel — koyu hero ── */}
      <div style={{
        background: '#0B0C0F',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 48px',
        overflow: 'hidden',
      }}>
        {/* Grid doku */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}/>
        {/* Kırmızı glow */}
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%',
          width: 500, height: 500, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(200,33,26,.12) 0%, transparent 65%)',
        }}/>

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, background: 'var(--red)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(200,33,26,.5)',
            }}>
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M7 1C7 1 9.5 4.5 9.5 7C9.5 8.38 8.94 9.63 8.03 10.55C8.43 9.75 8.67 8.86 8.67 7.92C8.67 5.92 7.42 4.25 7.42 4.25C7.42 4.25 6.17 6.5 6.17 8.08C6.17 9.47 6.89 10.68 7.96 11.42C7.41 11.93 6.67 12.25 5.83 12.25C4.23 12.25 2.92 10.94 2.92 9.33C2.92 8.08 3.75 7 3.75 7C3.75 7 2.17 8.67 2.17 10.83C2.17 14.07 4.61 16 7 16C10.04 16 12.5 13.54 12.5 10.5C12.5 6.5 7 1 7 1Z" fill="white"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '-.02em' }}>FireCheckup</span>
          </Link>
        </div>

        {/* Orta içerik */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 20,
            background: 'rgba(200,33,26,.12)', border: '1px solid rgba(200,33,26,.25)',
            borderRadius: 6, padding: '5px 12px',
          }}>
            <span className="fc-blink" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }}/>
            <span style={{ fontSize: 11, fontFamily: 'var(--M)', color: 'rgba(255,255,255,.7)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Güvenli Oturum
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px,3vw,46px)', fontWeight: 800,
            letterSpacing: '-.04em', lineHeight: 1.08,
            color: '#F8F8F6', marginBottom: 16,
          }}>
            Yönetim<br/>Paneline<br/>
            <span style={{
              color: 'transparent',
              background: 'linear-gradient(90deg,#E85A52,#C8211A)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
            }}>Hoş Geldiniz.</span>
          </h1>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', lineHeight: 1.72, maxWidth: 320, fontWeight: 400 }}>
            Yangın güvenlik belgelerinizi yönetin, takip edin ve şeffaf biçimde paylaşın.
          </p>

          {/* Feature özeti */}
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '⚡', t: 'Gerçek Zamanlı Takip',  d: 'Belge sürelerini otomatik izle' },
              { icon: '🔒', t: 'Kurumsal Güvenlik',      d: 'SSL şifreli, rol tabanlı erişim' },
              { icon: '🌐', t: 'Şeffaf Paylaşım',        d: 'Misafirler şifresiz sorgulayabilir' },
            ].map(f => (
              <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.09)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>{f.icon}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.8)', lineHeight: 1 }}>{f.t}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 3 }}>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sol alt */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, fontFamily: 'var(--M)', color: 'rgba(255,255,255,.2)', letterSpacing: '.04em' }}>
            © 2026 FireCheckup A.Ş.
          </p>
        </div>
      </div>

      {/* ── Sağ panel — form ── */}
      <div style={{
        background: '#FAFAF8',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 40px',
      }}>
        <div className="fc-up" style={{ width: '100%', maxWidth: 400 }}>

          {/* Form başlık */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, marginBottom: 20,
              background: 'rgba(200,33,26,.08)',
              border: '1px solid rgba(200,33,26,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.04em', color: '#0E0E0E', marginBottom: 6 }}>
              Otel Girişi
            </h2>
            <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.6 }}>
              Yönetici tarafından verilen bilgilerle giriş yapın.
            </p>
          </div>

          {/* Hata */}
          {error && (
            <div className="fc-up" style={{
              marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 10, padding: '12px 16px',
              fontSize: 13, fontWeight: 500, color: '#7F1D1D',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Login ID */}
            <div className="fc-d1 fc-up">
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                fontFamily: 'var(--M)', color: '#6B6B6B',
                letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 8,
              }}>
                Otel Kodu veya Email
              </label>
              <input
                className="fc-input"
                type="text"
                placeholder="Örn: HTL-1024"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                required
              />
            </div>

            {/* Şifre */}
            <div className="fc-d2 fc-up">
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                fontFamily: 'var(--M)', color: '#6B6B6B',
                letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 8,
              }}>
                Şifre
              </label>
              <div className="fc-pw-wrap">
                <input
                  className="fc-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  className="fc-pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  tabIndex={-1}
                >
                  {showPw ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="fc-d3 fc-up" style={{ marginTop: 4 }}>
              <button type="submit" disabled={loading} className="fc-submit">
                {loading ? (
                  <>
                    <span className="fc-spin" style={{
                      width: 16, height: 16,
                      border: '2px solid rgba(255,255,255,.35)',
                      borderTopColor: '#fff',
                      borderRadius: '50%', display: 'inline-block',
                    }}/>
                    Giriş Yapılıyor...
                  </>
                ) : (
                  <>
                    Sisteme Giriş Yap
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Alt link */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #E6E6E3', textAlign: 'center' }}>
            <Link to="/" className="fc-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Ana Sayfaya Dön
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;