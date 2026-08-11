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
  
  const [usersList, setUsersList] = useState([
    { 
      id: 1, 
      name: "عثمان صديق", 
      loginName: "admin", 
      role: "osman", 
      pin: "198234", 
      permissions: { students: true, classes: true, teachers: true, finance: true, results: true } 
    }
  ]);

  useEffect(() => { 
    if (isLoggedIn) localStorage.setItem('school_activeTab', activeTab); 
  }, [activeTab, isLoggedIn]);

  useEffect(() => { 
    const load = async () => { 
      try { 
        const u = await getAllSystemUsers(); 
        if (u && u.length > 0) setUsersList(u); 
      } catch (e) {
        console.error("خطأ في جلب البيانات:", e);
      } 
    }; 
    load(); 
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    try {
      const cloudUsers = await getAllSystemUsers();
      const pool = (cloudUsers && cloudUsers.length > 0) ? cloudUsers : usersList;
      
      const found = pool.find(u => 
        u && 
        String(u.loginName || '').trim().toLowerCase() === username.trim().toLowerCase() && 
        String(u.pin || '').trim() === password.trim()
      );

      if (found) {
        setCurrentUser(found); 
        setIsLoggedIn(true); 
        setActiveTab('empty');
        localStorage.setItem('school_isLoggedIn', 'true'); 
        localStorage.setItem('school_currentUser', JSON.stringify(found)); 
        localStorage.setItem('school_activeTab', 'empty');
      } else { 
        alert("بيانات الدخول غير صحيحة!"); 
      }
    } catch (error) {
      alert("حدث خطأ في الاتصال!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn) {
    return (
      <DashboardSection 
        selectedUser={currentUser} 
        handlePermissionChange={() => {}} 
        playHover={() => {}} 
        handleLogout={() => { setIsLoggedIn(false); localStorage.clear(); }} 
      />
    );
  }

  return (
    <div className="shorouk-container">
      
      {/* البار العلوي الثابت */}
      <div className="shorouk-header">
        <div className="shorouk-logo-zone">
          <div className="shorouk-logo-wrapper">
            <img 
              src="/logo.png" 
              alt="logo" 
              onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '☀️'; }} 
            />
          </div>
          <div className="shorouk-title-wrapper">
            <h1>مدارس الشروق السودانية</h1>
            <p>ريادة التعليم وبناء الأجيال</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="shorouk-login-form">
          <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} required />
          {!isSubmitting ? (
            <button type="submit">تسجيل الدخول</button>
          ) : (
            <span className="shorouk-checking">جاري التحقق...</span>
          )}
        </form>
      </div>

      {/* المحتوى الرئيسي للموقع */}
      <div className="shorouk-content">
        
        {/* قسم من نحن */}
        <div className="shorouk-section">
          <h2>من نحن؟</h2>
          <p>
            صرح تعليمي متميز يسعى لتقديم بيئة تربوية ملهمة تواكب أحدث المعايير الأكاديمية لجميع المراحل (<span className="highlight-text">حضانة - ابتدائي - متوسط - ثانوي</span>)، لتنشئة جيل مبدع ومتمسك بقيمه الأخلاقية.
          </p>
        </div>

        {/* قسم مجلس الإدارة */}
        <div className="shorouk-section">
          <h2>مجلس الإدارة الموقر</h2>
          <div className="shorouk-grid grid-admin">
            <div className="admin-card">
              <span>المدير العام</span>
              <strong>أستاذ كمال الدين المجذوب</strong>
            </div>
            <div className="admin-card">
              <span>نائب المدير العام</span>
              <strong>ماما هند عبد الرازق</strong>
            </div>
            <div className="admin-card">
              <span>الهيئة الإدارية</span>
              <strong className="highlight-name">الأستاذة لينا كمال المجذوب</strong>
            </div>
            <div className="admin-card">
              <span>الهيئة الإدارية</span>
              <strong className="highlight-name">الأستاذ محمد كمال المجذوب</strong>
            </div>
          </div>
        </div>

        {/* قسم الأهداف الاستراتيجية */}
        <div className="shorouk-section">
          <h2>أهدافنا الإستراتيجية</h2>
          <div className="shorouk-grid grid-goals">
            <div className="goal-card">
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>🎓</div>
              <h3>التميز الأكاديمي</h3>
              <p>تقديم مناهج قوية ومطورة تنمي التفكير والابتكار.</p>
            </div>
            <div className="goal-card">
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>🤝</div>
              <h3>القيم والأخلاق</h3>
              <p>بناء بيئة تربوية تعزز التعاون والاحترام المتبادل بين الطلاب.</p>
            </div>
          </div>
        </div>

      </div>

      {/* شريط الحقوق السفلي العصري الأزرق والأسود */}
      <footer className="shorouk-footer">
        <p>جميع الحقوق محفوظة مدرسة الشروق ( أبو حلا ) 📞 01149169346</p>
      </footer>

    </div>
  );
}
