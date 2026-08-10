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

  if (isLoggedIn) return <DashboardSection selectedUser={currentUser} handlePermissionChange={() => {}} playHover={() => {}} handleLogout={handleLogout} />;

  return (
    <div className="shorouk-container">
      <div className="shorouk-header">
        <div className="shorouk-logo-zone">
          <div className="shorouk-logo-wrapper">
            <img src="/logo.png" alt="logo" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '☀️'; }} />
          </div>
          <div className="shorouk-title-wrapper">
            <h1>مدارس الشروق السودانية</h1>
            <p>ريادة التعليم وبناء الأجيال</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="shorouk-login-form">
          <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} required />
          {!isSubmitting ? <button type="submit">تسجيل الدخول</button> : <span className="shorouk-checking">جاري التحقق...</span>}
        </form>
      </div>

      <div className="shorouk-content">
        <div className="shorouk-section">
          <h2>من نحن؟</h2>
          <p>صرح تعليمي متميز يسعى لتقديم بيئة تربوية ملهمة تواكب أحدث المعايير الأكاديمية لجميع المراحل <span className="highlight-text">(حضانة - ابتدائي - متوسط - ثانوي)</span>، لتنشئة جيل مبدع ومتمسك بقيمه الأخلاقية.</p>
        </div>

        <div className="shorouk-section">
          <h2>مجلس الإدارة الموقر</h2>
          <div className="shorouk-grid grid-admin">
            <div className="admin-card"><span>المدير العام</span><strong>أستاذ كمال الدين المجذوب</strong></div>
            <div className="admin-card"><span>نائب المدير العام</span><strong>ماما هند عبد الرازق</strong></div>
            <div className="admin-card"><span>الهيئة الإدارية</span><strong>الأستاذة لينا كمال المجذوب</strong></div>
            <div className="admin-card"><span>الهيئة الإدارية</span><strong>الأستاذ محمد كمال المجذوب</strong></div>
          </div>
        </div>

        <div className="shorouk-section">
          <h2>أهدافنا الإستراتيجية</h2>
          <div className="shorouk-grid grid-goals">
            <div className="goal-card"><div>🎓</div><h3>التميز الأكاديمي</h3><p>تقديم مناهج قوية ومطورة تنمي التفكير والابتكار.</p></div>
            <div className="goal-card"><div>🤝</div><h3>بناء الشخصية</h3><p>غرس القيم الأخلاقية والاعتماد على الذات لدى الطلاب.</p></div>
            <div className="goal-card"><div>💻</div><h3>الدمج التقني</h3><p>بيئة رقمية ذكية تسهل تواصل الإدارة والمعلم والطالب.</p></div>
            <div className="goal-card"><div>🎯</div><h3>رعاية المواهب</h3><p>اكتشاف المهارات الفردية وتطويرها بأنشطة مكثفة.</p></div>
          </div>
        </div>
      </div>

      <div className="shorouk-footer">
        <div className="footer-contacts">
          <span>📞 <strong>الهاتف:</strong> 01116874770</span>
          <span>✉️ <strong>البريد:</strong> lumyaa@cush.digital</span>
        </div>
        <div className="footer-rights">
          <span>جميع الحقوق محفوظة © مدرسة الشروق (أبو حلا) 01149169346</span>
        </div>
      </div>
    </div>
  );
}
