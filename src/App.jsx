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
    { id: 1, name: "عثمان صديق", loginName: "admin", role: "أدمن", pin: "123", permissions: { students: true, classes: true, teachers: true, finance: true, admin: true } },
    { id: 2, name: "أستاذ محمد", loginName: "محمد", role: "معلم", pin: "123456", permissions: { students: true, classes: true, teachers: false, finance: false, admin: false } }
  ]);

  const playHover = () => { try { const snd = new Audio('https://mixkit.co'); snd.volume = 0.15; snd.play().catch(() => {}); } catch(e){} };
  const playClick = () => { try { const snd = new Audio('https://mixkit.co'); snd.volume = 0.35; snd.play().catch(() => {}); } catch(e){} };

  useEffect(() => {
    if (isLoggedIn) localStorage.setItem('school_activeTab', activeTab);
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const cloudUsers = await getAllSystemUsers();
        if (cloudUsers && cloudUsers.length > 0) {
          setUsersList(prev => {
            const combined = [...prev];
            cloudUsers.forEach(cu => {
              if (cu) {
                const loginName = cu.loginName || cu.data?.loginName;
                if (loginName && !combined.some(u => String(u.loginName).trim().toLowerCase() === String(loginName).trim().toLowerCase())) {
                  combined.push({
                    id: cu.id,
                    name: cu.name || cu.data?.name || "مستخدم سحابي",
                    loginName: loginName,
                    pin: cu.pin || cu.data?.pin ? String(cu.pin || cu.data?.pin) : "",
                    role: cu.role || cu.data?.role || "موظف",
                    permissions: cu.permissions || cu.data?.permissions || { students: false, classes: false, teachers: false, finance: false, admin: false }
                  });
                }
              }
            });
            return combined;
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    playClick();
    const inputUser = username.trim().toLowerCase();
    const inputPass = password.trim();
    const foundUser = usersList.find(u => u && String(u.loginName || '').trim().toLowerCase() === inputUser && String(u.pin || '').trim() === inputPass);

    if (foundUser) {
      setCurrentUser(foundUser);
      setIsLoggedIn(true);
      setActiveTab('empty');
      localStorage.setItem('school_isLoggedIn', 'true');
      localStorage.setItem('school_currentUser', JSON.stringify(foundUser));
      localStorage.setItem('school_activeTab', 'empty');
    } else {
      alert("بيانات الدخول غير صحيحة!");
    }
  };

  const handleLogout = () => {
    playClick();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setActiveTab('empty');
    localStorage.clear();
  };

  // واجهة صفحة تسجيل الدخول إذا لم يكن المستخدم مسجلاً
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(180deg, #3d145a 0%, #5c2483 100%)', padding: '15px', direction: 'rtl', fontFamily: 'system-ui' }}>
        <form onSubmit={handleLogin} style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '35px 25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', maxWidth: '360px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
          <div style={{ width: '60px', height: '60px', background: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px auto', fontSize: '26px', color: '#5c2483' }}>👤</div>
          <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '5px', fontWeight: '700' }}>مدرسة الشروق السودانية</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: 0, marginBottom: '25px' }}>بوابة إدارة النظام الإلكتروني المتكامل</p>
          <div style={{ marginBottom: '18px', textAlign: 'right' }}>
            <label style={{ fontSize: '13px', color: '#fff', marginBottom: '5px', display: 'block' }}>اسم الدخول</label>
            <input type="text" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', boxSizing: 'border-box', textAlign: 'right', outline: 'none' }} required />
          </div>
          <div style={{ marginBottom: '22px', textAlign: 'right' }}>
            <label style={{ fontSize: '13px', color: '#fff', marginBottom: '5px', display: 'block' }}>كلمة المرور</label>
            <input type="password" placeholder="•••••" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', boxSizing: 'border-box', textAlign: 'right', outline: 'none' }} required />
          </div>
          <button type="submit" onMouseEnter={playHover} style={{ width: '100%', padding: '14px', background: '#fff', color: '#5c2483', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>دخول النظام</button>
        </form>
      </div>
    );
  }

  // التوجيه المباشر والنظيف إلى لوحة التحكم المطورة بعد تسجيل الدخول الناجح
  return (
    <DashboardSection 
      selectedUser={currentUser} 
      handlePermissionChange={() => {}} 
      playHover={playHover} 
      handleLogout={handleLogout} 
    />
  );
}
