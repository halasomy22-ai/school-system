import React, { useState, useEffect } from 'react';
import './App.css';
import DashboardSection from './components/DashboardSection';
import { getAllSystemUsers } from './db';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('school_isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('school_currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('school_activeTab') || 'empty');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usersList, setUsersList] = useState([{ id: 1, name: "عثمان صديق", loginName: "admin", role: "osman", pin: "198234", permissions: { students: true, classes: true, teachers: true, finance: true, results: true } }]);

  useEffect(() => { if (isLoggedIn) localStorage.setItem('school_activeTab', activeTab); }, [activeTab, isLoggedIn]);
  useEffect(() => { const load = async () => { try { const u = await getAllSystemUsers(); if (u && u.length > 0) setUsersList(u); } catch (e) {} }; load(); }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cloudUsers = await getAllSystemUsers();
      const pool = (cloudUsers && cloudUsers.length > 0) ? cloudUsers : usersList;
      const found = pool.find(u => u && String(u.loginName || '').trim().toLowerCase() === username.trim().toLowerCase() && String(u.pin || '').trim() === password.trim());
      if (found) {
        setCurrentUser(found); setIsLoggedIn(true); setActiveTab('empty');
        localStorage.setItem('school_isLoggedIn', 'true'); localStorage.setItem('school_currentUser', JSON.stringify(found)); localStorage.setItem('school_activeTab', 'empty');
      } else { alert("بيانات الدخول غير صحيحة!"); setIsSubmitting(false); }
    } catch (err) { alert("خطأ في الاتصال!"); setIsSubmitting(false); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); setCurrentUser(null); setUsername(''); setPassword(''); setActiveTab('empty');
    localStorage.removeItem('school_isLoggedIn'); localStorage.removeItem('school_currentUser'); localStorage.removeItem('school_activeTab');
  };

  if (isLoggedIn) return <DashboardSection selectedUser={currentUser} handlePermissionChange={() => {}} playHover={() => {}} handleLogout={handleLogout} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', background: '#1a365d', direction: 'rtl', fontFamily: 'sans-serif', margin: 0, padding: 0, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: '#112240', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '60px', height: '60px', background: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px', overflow: 'hidden', boxSizing: 'border-box' }}>
            <img src="/logo.png" alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '☀️'; }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#f6c23e' }}>مدارس الشروق السودانية</h1>
            <p style={{ margin: 0, fontSize: '11px', color: '#a0aec0' }}>ريادة التعليم وبناء الأجيال</p>
          </div>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', outline: 'none', fontSize: '13px', width: '130px', textAlign: 'right' }} required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', outline: 'none', fontSize: '13px', width: '130px', textAlign: 'right' }} required />
          {!isSubmitting ? <button type="submit" style={{ padding: '8px 16px', background: '#f6c23e', color: '#0e1e38', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>تسجيل الدخول</button> : <span style={{ fontSize: '13px', color: '#a0aec0', padding: '8px' }}>جاري التحقق...</span>}
        </form>
      </div>
      <div style={{ flex: 1, padding: '40px 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, #162a45 0%, #1a365d 100%)', color: '#fff', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
          <div>
            <h2 style={{ fontSize: '20px', color: '#4caf50', margin: '0 0 8px 0' }}>من نحن؟</h2>
            <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.7', fontSize: '15px' }}>صرح تعليمي متميز يسعى لتقديم بيئة تربوية ملهمة تواكب أحدث المعايير الأكاديمية لجميع المراحل <span style={{ color: '#f6c23e', fontWeight: '600' }}>(حضانة - ابتدائي - متوسط - ثانوي)</span>.</p>
          </div>
          <div>
            <h2 style={{ fontSize: '20px', color: '#4caf50', margin: '0 0 15px 0' }}>أهدافنا الإستراتيجية</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>🎓</div><h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f6c23e' }}>التميز الأكاديمي</h3><p style={{ margin: 0, fontSize: '12px', color: '#cbd5e0' }}>تقديم مناهج قوية ومطورة تنمي التفكير والابتكار.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>🤝</div><h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f6c23e' }}>بناء الشخصية</h3><p style={{ margin: 0, fontSize: '12px', color: '#cbd5e0' }}>غرس القيم الأخلاقية والاعتماد على الذات لدى الطلاب.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>💻</div><h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f6c23e' }}>الدمج التقني</h3><p style={{ margin: 0, fontSize: '12px', color: '#cbd5e0' }}>بيئة رقمية ذكية تسهل تواصل الإدارة والمعلم والطالب.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>🎯</div><h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f6c23e' }}>رعاية المواهب</h3><p style={{ margin: 0, fontSize: '12px', color: '#cbd5e0' }}>اكتشاف المهارات الفردية وتطويرها بأنشطة مكثفة.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: '#112240', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', fontSize: '12px', color: '#a0aec0' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <span>📞 <strong>الهاتف:</strong> 01116874770</span><span>✉️ <strong>البريد:</strong> lumyaa@cush.digital</span>
        </div>
        <div><span>جميع الحقوق محفوظة © مدارس الشروق السودانية</span></div>
      </div>
    </div>
  );
}
