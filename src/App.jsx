import React, { useState, useEffect } from 'react';
import './App.css';

import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import ResultsSection from './components/ResultsSection';
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
  
  const [usersList, setUsersList] = useState([
    { id: 1, name: "عثمان صديق", loginName: "admin", role: "أدمن", pin: "123", permissions: { students: true, classes: true, teachers: true, finance: true, results: true } },
    { id: 2, name: "أستاذ محمد", loginName: "mohamed", role: "معلم", pin: "123456", permissions: { students: true, classes: true, teachers: false, finance: false, results: false } }
  ]);

  const playHover = () => { try { const snd = new Audio('https://mixkit.co'); snd.volume = 0.15; snd.play().catch(() => {}); } catch(e){} };
  const playClick = () => { try { const snd = new Audio('https://mixkit.co'); snd.volume = 0.35; snd.play().catch(() => {}); } catch(e){} };

  useEffect(() => {
    if (isLoggedIn) localStorage.setItem('school_activeTab', activeTab);
  }, [activeTab, isLoggedIn]);

  // جلب المستخدمين فورياً ومباشرة للتأكد من التعرف على الحساب الجديد المرفوع لـ Supabase
  const loadUsersFromCloud = async () => {
    try {
      const cloudUsers = await getAllSystemUsers();
      if (cloudUsers && cloudUsers.length > 0) {
        setUsersList(cloudUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsersFromCloud();
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    playClick();

    // تحديث القائمة قبل فحص كلمة السر لضمان قراءة المستخدم الجديد مباشرة من السحابة
    try {
      const cloudUsers = await getAllSystemUsers();
      const currentPool = (cloudUsers && cloudUsers.length > 0) ? cloudUsers : usersList;
      
      const inputUser = username.trim().toLowerCase();
      const inputPass = password.trim();
      
      const foundUser = currentPool.find(u => u && String(u.loginName || '').trim().toLowerCase() === inputUser && String(u.pin || '').trim() === inputPass);

      if (foundUser) {
        setCurrentUser(foundUser);
        setIsLoggedIn(true);
        setActiveTab('empty');
        localStorage.setItem('school_isLoggedIn', 'true');
        localStorage.setItem('school_currentUser', JSON.stringify(foundUser));
        localStorage.setItem('school_activeTab', 'empty');
      } else {
        alert("بيانات الدخول غير صحيحة، أو لم يكتمل رفع الحساب للسحابة بعد!");
      }
    } catch (err) {
      alert("خطأ في الاتصال بقاعدة البيانات السحابية!");
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

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #0e1e38 0%, #1a365d 60%, #2b4c7e 100%)', padding: '15px', direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '40px 30px', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.12)', width: '100%', maxWidth: '380px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
          
          <div style={{ width: '90px', height: '90px', background: '#ffffff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)', border: '2px solid #f6c23e', overflow: 'hidden' }}>
            <img 
              src="/logo.png" 
              alt="شعار مدارس الشروق" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { 
                e.target.style.display = 'none'; 
                e.target.parentNode.innerHTML = '<span style="font-size:38px">☀️</span>'; 
              }} 
            />
          </div>
          
          <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '8px', fontWeight: '800', fontSize: '23px' }}>مدارس الشروق السودانية</h2>
          <p style={{ textAlign: 'center', color: '#f6c23e', fontSize: '13px', marginTop: 0, marginBottom: '30px', fontWeight: '600', letterSpacing: '0.5px' }}>حضانة - ابتدائي - متوسط - ثانوي</p>
          
          <div style={{ marginBottom: '20px', textAlign: 'right' }}>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px', display: 'block', fontWeight: '500' }}>اسم المستخدم</label>
            <input type="text" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.06)', color: '#fff', boxSizing: 'border-box', textAlign: 'right', outline: 'none', fontSize: '14px' }} required />
          </div>
          
          <div style={{ marginBottom: '28px', textAlign: 'right' }}>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px', display: 'block', fontWeight: '500' }}>كلمة المرور</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.06)', color: '#fff', boxSizing: 'border-box', textAlign: 'right', outline: 'none', fontSize: '14px' }} required />
          </div>
          
          <button type="submit" style={{ width: '100%', padding: '14px', background: '#f6c23e', color: '#1a365d', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', fontSize: '16px', boxShadow: '0 8px 25px rgba(246, 194, 62, 0.2)', transition: 'all 0.2s' }}>دخول النظام</button>
          
          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px', marginTop: '25px', marginBottom: 0 }}>جميع الحقوق محفوظة © مدارس الشروق</p>
        </form>
      </div>
    );
  }

  return (
    <DashboardSection 
      selectedUser={currentUser} 
      handlePermissionChange={() => {}} 
      playHover={playHover} 
      handleLogout={handleLogout} 
    />
  );
}
