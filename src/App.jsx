import React, { useState, useEffect } from 'react';
import './App.css';
import DashboardSection from './components/DashboardSection';
import { getAllSystemUsers } from './db';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('school_isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState(() => { const saved = localStorage.getItem('school_currentUser'); return saved ? JSON.parse(saved) : null; });
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('school_activeTab') || 'empty');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usersList, setUsersList] = useState([{ id: 1, name: "عثمان صديق", loginName: "admin", role: "osman", pin: "198234", permissions: { students: true, classes: true, teachers: true, finance: true, results: true } }]);

  useEffect(() => { if (isLoggedIn) localStorage.setItem('school_activeTab', activeTab); }, [activeTab, isLoggedIn]);
  useEffect(() => { const load = async () => { try { const u = await getAllSystemUsers(); if (u && u.length > 0) setUsersList(u); } catch (e) {} }; load(); }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
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

  if (isLoggedIn) return <DashboardSection selectedUser={currentUser} handlePermissionChange={() => {}} playHover={() => {}} handleLogout={() => { setIsLoggedIn(false); localStorage.clear(); }} />;

  return (
    <div className="shorouk-container" style={{ background: 'linear-gradient(135deg, #f4f7f5 0%, #e9efe3 100%)', minHeight: '100vh', width: '100%' }}>
      
      {/* البار العلوي الثابت باللون الأبيض المريح للعين */}
      <div className="shorouk-header" style={{ background: '#ffffff', borderBottom: '1px solid #dee5e0', padding: '15px 5%', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div className="shorouk-logo-zone">
          <div className="shorouk-logo-wrapper" style={{ border: '1px solid #e2e8f0' }}>
            <img src="/logo.png" alt="logo" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '☀️'; }} />
          </div>
          <div className="shorouk-title-wrapper">
            <h1 style={{ color: '#1e4632', margin: 0, fontSize: '18px', fontWeight: '800' }}>مدارس الشروق السودانية</h1>
            <p style={{ color: '#627d6f', margin: '2px 0 0 0', fontSize: '11px' }}>ريادة التعليم وبناء الأجيال</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="shorouk-login-form">
          <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} required style={{ background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1' }} />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} required style={{ background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1' }} />
          {!isSubmitting ? <button type="submit" style={{ background: '#2d6a4f', color: '#ffffff' }}>تسجيل الدخول</button> : <span className="shorouk-checking" style={{ color: '#627d6f' }}>جاري التحقق...</span>}
        </form>
      </div>

      {/* المحتوى الرئيسي للموقع */}
      <div className="shorouk-content" style={{ padding: '30px 5%', display: 'flex', flexDirection: 'column', color: '#2d3748', width: '100%' }}>
        
        {/* قسم من نحن */}
        <div className="shorouk-section">
          <h2 style={{ color: '#2d6a4f', borderRight: '3px solid #2d6a4f', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700', paddingRight: '8px' }}>من نحن؟</h2>
          <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
            صرح تعليمي متميز يسعى لتقديم بيئة تربوية ملهمة تواكب أحدث المعايير الأكاديمية لجميع المراحل (<span className="highlight-text" style={{ color: '#b45309', fontWeight: '600' }}>حضانة - ابتدائي - متوسط - ثانوي</span>)، لتنشئة جيل مبدع ومتمسك بقيمه الأخلاقية.
          </p>
        </div>

        {/* قسم مجلس الإدارة */}
        <div className="shorouk-section">
          <h2 style={{ color: '#2d6a4f', borderRight: '3px solid #2d6a4f', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700', paddingRight: '8px' }}>مجلس الإدارة الموقر</h2>
          <div className="shorouk-grid grid-admin">
            <div className="admin-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ color: '#718096', display: 'block', fontSize: '11px', marginBottom: '2px' }}>المدير العام</span>
              <strong style={{ color: '#1a202c', fontSize: '13px', fontWeight: '700' }}>أستاذ كمال الدين المجذوب</strong>
            </div>
            <div className="admin-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ color: '#718096', display: 'block', fontSize: '11px', marginBottom: '2px' }}>نائب المدير العام</span>
              <strong style={{ color: '#1a202c', fontSize: '13px', fontWeight: '700' }}>ماما هند عبد الرازق</strong>
            </div>
            <div className="admin-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ color: '#718096', display: 'block', fontSize: '11px', marginBottom: '2px' }}>الهيئة الإدارية</span>
              <strong style={{ color: '#2d6a4f', fontSize: '13px', fontWeight: '700' }}>الأستاذة لينا كمال المجذوب</strong>
            </div>
            <div className="admin-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ color: '#718096', display: 'block', fontSize: '11px', marginBottom: '2px' }}>الهيئة الإدارية</span>
              <strong style={{ color: '#2d6a4f', fontSize: '13px', fontWeight: '700' }}>الأستاذ محمد كمال المجذوب</strong>
            </div>
          </div>
        </div>

        {/* قسم الأهداف الاستراتيجية */}
        <div className="shorouk-section">
          <h2 style={{ color: '#2d6a4f', borderRight: '3px solid #2d6a4f', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700', paddingRight: '8px' }}>أهدافنا الإستراتيجية</h2>
          <div className="shorouk-grid grid-goals">
            <div className="goal-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>🎓</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#2d6a4f', fontWeight: '700' }}>التميز الأكاديمي</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#4a5568', lineHeight: '1.4' }}>تقديم مناهج قوية ومطورة تنمي التفكير والابتكار.</p>
            </div>
            <div className="goal-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>🤝</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#2d6a4f', fontWeight: '700' }}>بناء الشخصية</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#4a5568', lineHeight: '1.4' }}>غرس القيم الأخلاقية والاعتماد على الذات لدى الطلاب.</p>
            </div>
            <div className="goal-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>💻</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#2d6a4f', fontWeight: '700' }}>الدمج التقني</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#4a5568', lineHeight: '1.4' }}>بيئة رقمية ذكية تسهل تواصل الإدارة والمعلم والطالب.</p>
            </div>
            <div className="goal-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>🎯</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#2d6a4f', fontWeight: '700' }}>رعاية المواهب</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#4a5568', lineHeight: '1.4' }}>اكتشاف المهارات الفردية وتطويرها بأنشطة مكثفة.</p>
            </div>
          </div>
        </div>
      </div>

      {/* شريط الحقوق السفلي (الفوتر) باللون الرمادي الفاتح الناعم */}
      <div className="shorouk-footer" style={{ background: '#eef2f0', borderTop: '1px solid #dee5e0', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: '#52665a', alignItems: 'center' }}>
