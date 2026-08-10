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
  const [isSubmitting, setIsSubmitting] = useState(false); // حالة لإخفاء الزر أثناء المعالجة
  
  const [usersList, setUsersList] = useState([
    { id: 1, name: "عثمان صديق", loginName: "admin", role: "osman", pin: "198234", permissions: { students: true, classes: true, teachers: true, finance: true, results: true } }
  ]);

  const playClick = () => { try { const snd = new Audio('https://mixkit.co'); snd.volume = 0.35; snd.play().catch(() => {}); } catch(e){} };

  useEffect(() => {
    if (isLoggedIn) localStorage.setItem('school_activeTab', activeTab);
  }, [activeTab, isLoggedIn]);

  const loadUsersFromCloud = async () => {
    try {
      const cloudUsers = await getAllSystemUsers();
      if (cloudUsers && cloudUsers.length > 0) setUsersList(cloudUsers);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadUsersFromCloud(); }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    playClick();
    setIsSubmitting(true); // إخفاء الزر فوراً عند الضغط وبدء المعالجة

    try {
      const cloudUsers = await getAllSystemUsers();
      const currentPool = (cloudUsers && cloudUsers.length > 0) ? cloudUsers : usersList;
      const foundUser = currentPool.find(u => u && String(u.loginName || '').trim().toLowerCase() === username.trim().toLowerCase() && String(u.pin || '').trim() === password.trim());
      
      if (foundUser) {
        setCurrentUser(foundUser);
        setIsLoggedIn(true);
        setActiveTab('empty');
        localStorage.setItem('school_isLoggedIn', 'true');
        localStorage.setItem('school_currentUser', JSON.stringify(foundUser));
        localStorage.setItem('school_activeTab', 'empty');
      } else { 
        alert("بيانات الدخول غير صحيحة!"); 
        setIsSubmitting(false); // إعادة إظهار الزر إذا كانت البيانات خاطئة لمحاولة أخرى
      }
    } catch (err) { 
      alert("خطأ في الاتصال بقاعدة البيانات السحابية!"); 
      setIsSubmitting(false); // إعادة إظهار الزر في حال حدوث خطأ شبكة
    }
  };

  const handleLogout = () => {
    playClick();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setActiveTab('empty');
    localStorage.removeItem('school_isLoggedIn');
    localStorage.removeItem('school_currentUser');
    localStorage.removeItem('school_activeTab');
  };

  if (isLoggedIn) {
    return <DashboardSection selectedUser={currentUser} handlePermissionChange={() => {}} playHover={() => {}} handleLogout={handleLogout} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', background: '#1a365d', direction: 'rtl', fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0, boxSizing: 'border-box' }}>
      
      {/* الشريط العلوي المشترك: الشعار على اليمين ونموذج تسجيل الدخول على الشمال */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', background: '#112240', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* الشعار والاسم على اليمين */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '65px', height: '65px', background: '#ffffff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', padding: '5px', overflow: 'hidden', boxSizing: 'border-box' }}>
            <img src="/logo.png" alt="شعار مدارس الشروق" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '☀️'; }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#f6c23e' }}>مدارس الشروق السودانية</h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#a0aec0' }}>ريادة التعليم وبناء الأجيال</p>
          </div>
        </div>

        {/* نموذج تسجيل الدخول مدمج ومختصر على الشمال بدون إضافات */}
        <form onSubmit={handleLogin} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="اسم المستخدم" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', outline: 'none', fontSize: '13px', width: '140px', textAlign: 'right' }} 
            required 
          />
          <input 
            type="password" 
            placeholder="كلمة المرور" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', outline: 'none', fontSize: '13px', width: '140px', textAlign: 'right' }} 
            required 
          />
          
          {/* يختفي الزر تماماً أثناء المعالجة ويظهر بدلاً منه نص الانتظار */}
          {!isSubmitting ? (
            <button type="submit" style={{ padding: '10px 20px', background: '#f6c23e', color: '#0e1e38', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(246, 194, 62, 0.2)' }}>
              تسجيل الدخول
            </button>
          ) : (
            <span style={{ fontSize: '13px', color: '#a0aec0', fontWeight: '600', padding: '10px' }}>
              جاري التحقق...
            </span>
          )}
        </form>

      </div>

      {/* المحتوى الرئيسي للتعريف والأهداف بالخلفية الجديدة الزرقاء المتناسقة */}
      <div style={{ flex: 1, padding: '50px 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, #162a45 0%, #1a365d 100%)', color: '#ffffff', boxSizing: 'border-box' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <div>
            <h2 style={{ fontSize: '22px', color: '#4caf50', margin: '0 0 12px 0', fontWeight: '700' }}>من نحن؟</h2>
            <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.8', fontSize: '16px' }}>
              صرح تعليمي متميز يسعى لتقديم بيئة تربوية ملهمة تواكب أحدث المعايير الأكاديمية لجميع المراحل 
              <span style={{ color: '#f6c23e', fontWeight: '600' }}> (حضانة - ابتدائي - متوسط - ثانوي)</span>، لتنشئة جيل مبدع ومتمسك بقيمه الأخلاقية.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '22px', color: '#4caf50', margin: '0 0 20px 0', fontWeight: '700' }}>أهدافنا الإستراتيجية</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎓</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#f6c23e', fontWeight: '700' }}>التميز الأكاديمي</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e0', lineHeight: '1.5' }}>تقديم مناهج قوية ومطورة تنمي التفكير والابتكار.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤝</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#f6c23e', fontWeight: '700' }}>بناء الشخصية</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e0', lineHeight: '1.5' }}>غرس القيم الأخلاقية والاعتماد على الذات لدى الطلاب.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>💻</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#f6c23e', fontWeight: '700' }}>الدمج التقني</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e0', lineHeight: '1.5' }}>بيئة رقمية ذكية تسهل تواصل الإدارة والمعلم والطالب.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#f6c23e', fontWeight: '700' }}>رعاية المواهب</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e0', lineHeight: '1.5' }}>اكتشاف المهارات الفردية وتطويرها بأنشطة مكثفة.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* الفوتر السفلي المتكامل لمعلومات التواصل والإدارة */}
