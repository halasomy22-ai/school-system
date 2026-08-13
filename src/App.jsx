import React, { useState, useEffect } from 'react';
import './App.css';
import DashboardSection from './components/DashboardSection';
import { getAllSystemUsers, addSystemUser, deleteSystemUser } from './db';

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
  const [isLoading, setIsLoading] = useState(true);
  
  // الحساب الرئيسي الافتراضي لك لتشغيل النظام لأول مرة
  const adminProfile = { 
    name: "عثمان صديق", 
    loginName: "osman", 
    role: "admin", 
    pin: "198234", 
    permissions: { students: true, classes: true, teachers: true, finance: true, results: true } 
  };

  const [usersList, setUsersList] = useState([]);

  useEffect(() => { 
    if (isLoggedIn) localStorage.setItem('school_activeTab', activeTab); 
  }, [activeTab, isLoggedIn]);

  // جلب المستخدمين من Firebase عند تشغيل التطبيق
  const loadSystemUsers = async () => {
    try {
      setIsLoading(true);
      const u = await getAllSystemUsers();
      // إذا كانت قاعدة البيانات فارغة تماماً، يتم زرع حسابك كأدمن تلقائياً لتتمكن من الدخول دائماً
      if (!u || u.length === 0) {
        await addSystemUser(adminProfile);
        setUsersList([{ ...adminProfile, id: 'admin' }]);
      } else {
        setUsersList(u);
      }
    } catch (e) {
      console.error("خطأ في جلب بيانات المستخدمين:", e);
      alert('خطأ في الاتصال بقاعدة البيانات. تأكد من اتصالك بالإنترنت.');
    } finally {
      setIsLoading(false);
    }
  };

  // تحميل المستخدمين عند بدء التطبيق
  useEffect(() => { 
    loadSystemUsers(); 
  }, []);

  // دالة تحديث وحفظ صلاحيات المستخدمين دائمياً عند التعديل داخل لوحة التحكم
  const handlePermissionChange = async (updatedUser) => {
    try {
      await addSystemUser(updatedUser); 
      await loadSystemUsers(); 
      alert("تم تحديث وحفظ صلاحيات المستخدم بنجاح 💾");
    } catch (error) {
      console.error('خطأ في حفظ التعديلات:', error);
      alert("تعذر حفظ التعديلات");
    }
  };

  // دالة حذف مستخدم نهائياً من اللوحة وقاعدة البيانات
  const handleUserDelete = async (userId) => {
    try {
      await deleteSystemUser(userId);
      await loadSystemUsers();
      alert("تم حذف المستخدم بنجاح من النظام 🗑️");
    } catch (error) {
      console.error('خطأ في حذف المستخدم:', error);
      alert("تعذر حذف المستخدم");
    }
  };

  // دالة تسجيل الدخول الرسمية والوحيدة عبر الحقول العلوية
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    try {
      // جلب أحدث بيانات من Firebase
      const pool = await getAllSystemUsers();
      const currentPool = (pool && pool.length > 0) ? pool : usersList;
      
      const found = currentPool.find(u => 
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
        setUsername('');
        setPassword('');
      } else { 
        alert("بيانات الدخول غير صحيحة!"); 
      }
    } catch (error) {
      console.error('خطأ في التحقق:', error);
      alert("حدث خطأ أثناء التحقق من البيانات!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="shorouk-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <h2 style={{ color: '#0e1e38' }}>جاري التحميل...</h2>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <DashboardSection 
        selectedUser={currentUser} 
        handlePermissionChange={handlePermissionChange} 
        handleUserDelete={handleUserDelete}
        playHover={() => {}} 
        handleLogout={() => { setIsLoggedIn(false); localStorage.clear(); }} 
      />
    );
  }

  return (
    <div className="shorouk-container">
      
      {/* البار العلوي الثابت وتفاصيل تسجيل الدخول */}
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
          <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} required disabled={isSubmitting} />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} required disabled={isSubmitting} />
          {!isSubmitting ? (
            <button type="submit">تسجيل الدخول</button>
          ) : (
            <span className="shorouk-checking">جاري التحقق...</span>
          )}
        </form>
      </div>

      {/* المحتوى الرئيسي للواجهة */}
      <div className="shorouk-content">
        
        <div className="shorouk-section">
          <h2>من نحن؟</h2>
          <p>
            صرح تعليمي متميز يسعى لتقديم بيئة تربوية ملهمة تواكب أحدث المعايير الأكاديمية لجميع المراحل
          </p>
        </div>

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

      </div>

      <footer className="shorouk-footer">
        <p>جميع الحقوق محفوظة مدرسة الشروق ( أبو حلا ) 📞 01149169346</p>
      </footer>

    </div>
  );
}