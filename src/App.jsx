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

  const getTabStyle = (tabName) => ({
    padding: '12px 24px',
    borderRadius: '25px',
    border: activeTab === tabName ? 'none' : '1.5px solid rgba(255,255,255,0.7)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    backgroundColor: activeTab === tabName ? '#ffffff' : 'rgba(255,255,255,0.1)',
    color: activeTab === tabName ? '#3d145a' : '#ffffff',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  });

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f0f8', direction: 'rtl', fontFamily: 'system-ui' }}>
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #3d145a 0%, #5c2483 100%)', padding: '30px 20px 70px 20px', borderRadius: '0 0 40px 40px', boxShadow: '0 10px 25px rgba(92, 36, 131, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto 30px auto', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(5px)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>👤</div>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>مدرسة الشروق السودانية</div>
              <div style={{ fontSize: '17px', fontWeight: '700' }}>مرحباً: {currentUser?.name}</div>
            </div>
          </div>
          <button onClick={handleLogout} onMouseEnter={playHover} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>خروج</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          {currentUser?.permissions?.students && <button style={getTabStyle('students')} onMouseEnter={playHover} onClick={() => { playClick(); setActiveTab('students'); }}>الطلاب</button>}
          {currentUser?.permissions?.classes && <button style={getTabStyle('classes')} onMouseEnter={playHover} onClick={() => { playClick(); setActiveTab('classes'); }}>الفصل</button>}
          {currentUser?.permissions?.teachers && <button style={getTabStyle('teachers')} onMouseEnter={playHover} onClick={() => { playClick(); setActiveTab('teachers'); }}>المعلمين</button>}
          {currentUser?.permissions?.finance && <button style={getTabStyle('accounts')} onMouseEnter={playHover} onClick={() => { playClick(); setActiveTab('accounts'); }}>الحسابات</button>}
          {currentUser?.permissions?.admin && <button style={getTabStyle('results')} onMouseEnter={playHover} onClick={() => { playClick(); setActiveTab('results'); }}>النتيجة</button>}
          {currentUser?.permissions?.admin && <button style={getTabStyle('dashboard')} onMouseEnter={playHover} onClick={() => { playClick(); setActiveTab('dashboard'); }}>لوحة التحكم</button>}
        </div>
      </div>
      <div style={{ padding: '20px', flex: '1', maxWidth: '1200px', width: '100%', margin: '-40px auto 0 auto', boxSizing: 'border-box' }}>
        {activeTab === 'empty' && (
