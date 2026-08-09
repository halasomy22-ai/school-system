import React, { useState } from 'react';

const DashboardSection = ({ selectedUser, handlePermissionChange, playHover, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { key: 'students', label: 'الطلاب' },
    { key: 'classes', label: 'الفصول' },
    { key: 'teachers', label: 'المعلمين' },
    { key: 'finance', label: 'الحسابات' },
    { key: 'results', label: 'النتيجة' },
    { key: 'dashboard', label: 'لوحة التحكم' },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f8f9fa', fontFamily: 'sans-serif', direction: 'rtl', display: 'flex', flexDirection: 'column' }}>
      
      {/* محتوى الصفحة الرئيسي */}
      <div style={{ flex: '1 0 auto' }}>
        
        {/* الهيدر العلوي المطور والمعدل للأزرار */}
        <div style={{ 
          background: 'linear-gradient(135deg, #3d145a 0%, #5c2483 100%)', 
          padding: '28px 20px', 
          borderRadius: '0 0 36px 36px',
          boxShadow: '0 10px 30px rgba(92, 36, 131, 0.18)'
        }}>
          
          {/* معلومات المستخدم وزر الخروج */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', letterSpacing: '0.5px' }}>جمهورية السودان - وزارة التربية والتعليم</div>
                <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', marginTop: '2px' }}>مرحباً: عثمان صديق</div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              onMouseEnter={playHover}
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                color: '#ffffff', 
                border: '1px solid rgba(255, 255, 255, 0.25)', 
                padding: '12px 28px', 
                borderRadius: '16px', 
                cursor: 'pointer', 
                fontWeight: '700',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                marginRight: 'auto'
              }}
              onMouseOver={(e) => { e.target.style.background = '#e63946'; e.target.style.borderColor = '#e63946'; }}
              onMouseOut={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)'; }}
            >
              خروج
            </button>
          </div>

          {/* أزرار التحكم - عصرية، بارزة، وكبيرة ومتوافقة مع الجوال */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '14px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onMouseEnter={playHover}
                  onClick={() => setActiveTab(item.key)}
                  style={{
                    flex: '1 1 150px',
                    maxWidth: '200px',
                    minWidth: '130px',
                    padding: '16px 22px',
                    borderRadius: '18px',
                    border: 'none',
                    fontSize: '18px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isActive ? '0 10px 25px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.05)',
                    background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.07)',
                    color: isActive ? '#5c2483' : '#ffffff',
                    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.18)'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.18)';
                      e.target.style.transform = 'translateY(-3px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.07)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* تصميم واجهة لوحة الترحيب الخاصة بالمدرسة */}
        <div style={{ 
          maxWidth: '1100px', 
          margin: '40px auto 20px auto', 
          padding: '0 20px',
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            width: '100%', 
            borderRadius: '32px', 
            background: 'linear-gradient(135deg, #2b0b42 0%, #3d145a 100%)',
            padding: '60px 40px',
            boxSizing: 'border-box',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(92, 36, 131, 0.2)', filter: 'blur(80px)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(40, 167, 69, 0.15)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

            <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.06)', padding: '20px', borderRadius: '24px', display: 'inline-block' }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffca28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
            </div>

            <h1 style={{ 
              color: '#ffca28', 
              fontSize: 'clamp(28px, 5vw, 46px)', 
              fontWeight: '900', 
              margin: '0 0 16px 0',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              letterSpacing: '1px'
            }}>
              مدرسة الشروق السودانية - اسوان
            </h1>

            <p style={{ 
              color: '#2ecc71', 
              fontSize: 'clamp(18px, 3vw, 26px)', 
              fontWeight: '700', 
              margin: '0',
              background: 'rgba(46, 204, 113, 0.1)',
              padding: '10px 32px',
              borderRadius: '50px',
              border: '1px solid rgba(46, 204, 113, 0.2)',
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              ( ابتدائي - متوسط - ثانوي )
            </p>

            <div style={{ marginTop: '40px', color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '500' }}>
              أهلاً بكم في المنصة الإلكترونية الرسمية لإدارة شؤون الطلاب والعملية التعليمية
            </div>

          </div>
        </div>

      </div>

      {/* التذييل الثابت (Footer) - لحفظ حقوق التصميم والتطوير للأستاذ عثمان صديق */}
      <footer style={{ 
        flexShrink: '0',
        width: '100%', 
        background: '#ffffff', 
        borderTop: '1px solid #eaddf2', 
        padding: '16px 20px', 
        boxSizing: 'border-box',
        textAlign: 'center',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.02)'
      }}>
        <p style={{ margin: 0, color: '#3d145a', fontSize: '15px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>تم التصميم والتطوير بواسطة:</span>
          <span style={{ color: '#5c2483', background: '#f4f0f8', padding: '4px 12px', borderRadius: '10px' }}>أستاذ عثمان صديق ( أبو حلا )</span>
          <span style={{ color: '#7a6687', direction: 'ltr' }}>📞 01149169346</span>
        </p>
      </footer>

    </div>
  );
};

export default DashboardSection;
