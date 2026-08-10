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
    { id: 1, name: "عثمان صديق", loginName: "admin", role: "osman", pin: "198234", permissions: { students: true, classes: true, teachers: true, finance: true, results: true } },
    { id: 2, name: "أستاذ محمد", loginName: "mohamed", role: "معلم", pin: "123456", permissions: { students: true, classes: true, teachers: false, finance: false, results: false } }
  ]);

  const playHover = () => { try { const snd = new Audio('https://mixkit.co'); snd.volume = 0.15; snd.play().catch(() => {}); } catch(e){} };
  const playClick = () => { try { const snd = new Audio('https://mixkit.co'); snd.volume = 0.35; snd.play().catch(() => {}); } catch(e){} };

  useEffect(() => {
    if (isLoggedIn) localStorage.setItem('school_activeTab', activeTab);
  }, [activeTab, isLoggedIn]);

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
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#0e1e38', direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif', flexWrap: 'wrap', margin: 0, padding: 0, boxSizing: 'border-box' }}>
        
        {/* الجانب الأيمن: اللوحة التعريفية بالمدرسة وأهدافها */}
        <div style={{ flex: '1 1 55%', padding: '40px 5%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, #09152a 0%, #0e1e38 100%)', color: '#ffffff', boxSizing: 'border-box', minWidth: '320px' }}>
          
          {/* الهيدر العلوي */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <div style={{ width: '80px', height: '80px', background: '#ffffff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.3)', padding: '5px', overflow: 'hidden', flexShrink: 0, boxSizing: 'border-box' }}>
              <img 
                src="/logo.png" 
                alt="شعار مدارس الشروق" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  e.target.parentNode.innerHTML = '<span style="font-size:35px">☀️</span>'; 
                }} 
              />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#f6c23e' }}>مدارس الشروق السودانية</h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#a0aec0' }}>ريادة التعليم وبناء الأجيال</p>
            </div>
          </div>

          {/* محتوى من نحن والرسالة والأهداف */}
          <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '650px' }}>
            <div>
              <h2 style={{ fontSize: '20px', color: '#4caf50', margin: '0 0 10px 0', fontWeight: '700' }}>من نحن؟</h2>
              <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.7', fontSize: '15px' }}>
                صرح تعليمي متميز يسعى لتقديم بيئة تربوية ملهمة تواكب أحدث المعايير الأكاديمية لجميع المراحل 
                <span style={{ color: '#f6c23e', fontWeight: '600' }}> (حضانة - ابتدائي - متوسط - ثانوي)</span>، لتنشئة جيل مبدع ومتمسك بقيمه الأخلاقية.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', color: '#4caf50', margin: '0 0 15px 0', fontWeight: '700' }}>أهدافنا الإستراتيجية</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '22px', marginBottom: '5px' }}>🎓</div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f6c23e', fontWeight: '700' }}>التميز الأكاديمي</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0', lineHeight: '1.5' }}>تقديم مناهج قوية ومطورة تنمي التفكير والابتكار.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '22px', marginBottom: '5px' }}>🤝</div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f6c23e', fontWeight: '700' }}>بناء الشخصية</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0', lineHeight: '1.5' }}>غرس القيم الأخلاقية والاعتماد على الذات لدى الطلاب.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '22px', marginBottom: '5px' }}>💻</div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f6c23e', fontWeight: '700' }}>الدمج التقني</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0', lineHeight: '1.5' }}>بيئة رقمية ذكية تسهل تواصل الإدارة والمعلم والطالب.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '22px', marginBottom: '5px' }}>🎯</div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f6c23e', fontWeight: '700' }}>رعاية المواهب</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0', lineHeight: '1.5' }}>اكتشاف المهارات الفردية وتطويرها بأنشطة مكثفة.</p>
                </div>
              </div>
            </div>
          </div>

          {/* الفوتر السفلي المتكامل لمعلومات التواصل والإدارة */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', fontSize: '12px', color: '#a0aec0' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span>📞 <strong style={{ color: '#fff' }}>الهاتف:</strong> 01116874770</span>
              <span>✉️ <strong style={{ color: '#fff' }}>البريد:</strong> lumyaa@cush.digital</span>
            </div>
            <div>
              <span>جميع الحقوق محفوظة © مدارس الشروق السودانية</span>
            </div>
          </div>

        </div>

        {/* الجانب الأيسر: صندوق ونموذج تسجيل الدخول النظيف والعصري */}
        <div style={{ flex: '1 1 45%', background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', boxSizing: 'border-box', minWidth: '320px', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '380px' }}>
            
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ color: '#0e1e38', margin: '0 0 6px 0', fontWeight: '800', fontSize: '24px' }}>بوابة تسجيل الدخول</h2>
              <p style={{ color: '#718096', margin: 0, fontSize: '13px' }}>مرحباً بك مجدداً في نظام المدرسة الإلكتروني</p>
            </div>
            
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
