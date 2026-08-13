import React, { useState } from 'react';
import StudentsSection from './StudentsSection';
import ClassesSection from './ClassesSection';
import TeachersSection from './TeachersSection';
import FinancialDashboard from './FinancialDashboard'; 
import ResultsSection from './ResultsSection';
import UsersPermissionsSection from './UsersPermissionsSection';

const DashboardSection = ({ 
  selectedUser = null, 
  handlePermissionChange = () => {}, 
  handleUserDelete = () => {},
  playHover = () => {}, 
  handleLogout = () => {} 
}) => {
  // يبدأ التطبيق بتبويب 'empty' لتكون الصفحة فارغة تماماً من البيانات عند الدخول ما عدا الأزرار
  const [activeTab, setActiveTab] = useState('empty');

  // جلب الصلاحيات الفعلية للمستخدم الحالي
  const userPermissions = selectedUser?.permissions || { students: true, classes: true, teachers: true, finance: true, results: true };

  // بناء أزرار التنقل وتصفيتها برمجياً بناءً على صلاحيات المستخدم الممررة
  const allNavItems = [
    // ✅ تم الإصلاح: الزر يظهر الآن حصرياً إذا كان الـ role هو admin أو الـ loginName هو osman (حسابك الشخصي)
    { key: 'home', label: 'لوحة التحكم', permission: selectedUser?.role === 'admin' || selectedUser?.loginName === 'osman' }, 
    { key: 'students', label: 'الطلاب', permission: userPermissions.students },
    { key: 'classes', label: 'الفصول', permission: userPermissions.classes },
    { key: 'teachers', label: 'المعلمين', permission: userPermissions.teachers },
    { key: 'finance', label: 'الحسابات', permission: userPermissions.finance },
    { key: 'results', label: 'النتيجة', permission: userPermissions.results }
  ];

  // تصفية المصفوفة لتعرض فقط الأقسام المسموح بها للمستخدم الحالي
  const allowedNavItems = allNavItems.filter(item => item.permission === true);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f8f9fa', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', display: 'flex', flexDirection: 'column' }}>
      
      {/* الخلفية العلوية والأزرار المتناسقة مع ألوان المدرسة (الأزرق الداكن والأصفر الذهبي) */}
      <div style={{ background: 'linear-gradient(135deg, #0e1e38 0%, #15345d 100%)', padding: '25px 20px', borderRadius: '0 0 36px 36px', boxShadow: '0 10px 30px rgba(21, 52, 93, 0.15)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div>
              <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', marginTop: '2px' }}>
                مرحباً: {selectedUser?.name || "عثمان صديق"}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '12px 28px', borderRadius: '16px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
            خروج
          </button>
        </div>

        {/* عرض القائمة المفلترة المسموح بدخولها وتنسيقها بشكل متجاوب للشاشات والهواتف */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '14px', maxWidth: '1000px', margin: '0 auto' }}>
          {allowedNavItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  flex: '1 1 130px',
                  maxWidth: '200px',
                  minWidth: '120px',
                  padding: '16px 22px',
                  borderRadius: '18px',
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textAlign: 'center',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.18)',
                  background: isActive ? '#f6c23e' : 'rgba(255, 255, 255, 0.07)',
                  color: isActive ? '#1a365d' : '#ffffff',
                  boxShadow: isActive ? '0 5px 15px rgba(246, 194, 62, 0.3)' : 'none',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* منطقة المحتوى الرئيسي المتغير أسفل القائمة */}
      <div style={{ flex: '1 0 auto', maxWidth: '1100px', width: '100%', margin: '40px auto 20px auto', padding: '0 20px', boxSizing: 'border-box' }}>
        
        {/* الحالة الافتراضية عند الدخول: صفحة فارغة وأنيقة للتوجيه */}
        {activeTab === 'empty' && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>✨</div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1a365d', margin: '0 0 10px 0' }}>نظام مدرسة الشروق الإلكتروني</h3>
            <p style={{ fontSize: '15px', margin: 0 }}>تم تسجيل الدخول بنجاح. الرجاء الضغط على أحد الأزرار المتاحة في القائمة العلوية لاستعراض وإدارة النظام.</p>
          </div>
        )}

        {/* ✅ تم الإصلاح: زر لوحة التحكم يفتح الآن حصرياً للأدمن الأساسي بعد تصحيح الشروط المعكوسة */}
        {activeTab === 'home' && (selectedUser?.role === 'admin' || selectedUser?.loginName === 'osman') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
            <div style={{ width: '100%', borderRadius: '32px', background: 'linear-gradient(135deg, #0b192e 0%, #15345d 100%)', padding: '40px', boxSizing: 'border-box', textAlign: 'center', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}>
              <h1 style={{ color: '#f6c23e', fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>مدارس الشروق السودانية - أسوان</h1>
              <p style={{ color: '#f6c23e', fontSize: '18px', fontWeight: '700', margin: '0', background: 'rgba(246, 194, 62, 0.1)', padding: '6px 24px', borderRadius: '50px', display: 'inline-block' }}>( حضانة - ابتدائي - متوسط - ثانوي )</p>
            </div>
            
            {/* استدعاء قسم الصلاحيات لإضافة وحذف المستخدمين */}
            <UsersPermissionsSection 
              selectedUser={selectedUser} 
              handlePermissionChange={handlePermissionChange} 
              handleUserDelete={handleUserDelete}
              playHover={playHover} 
            />
          </div>
        )}
        
        {/* فحص حماية إضافي عند استدعاء الأقسام الفردية لمنع أي تحايل برمجي */}
        {activeTab === 'students' && userPermissions.students && <StudentsSection playHover={playHover} selectedUser={selectedUser} handlePermissionChange={handlePermissionChange} />}
        {activeTab === 'classes' && userPermissions.classes && <ClassesSection playHover={playHover} selectedUser={selectedUser} handlePermissionChange={handlePermissionChange} />}
        {activeTab === 'teachers' && userPermissions.teachers && <TeachersSection playHover={playHover} selectedUser={selectedUser} handlePermissionChange={handlePermissionChange} />}
        {activeTab === 'finance' && userPermissions.finance && <FinancialDashboard playHover={playHover} selectedUser={selectedUser} handlePermissionChange={handlePermissionChange} />}
        {activeTab === 'results' && userPermissions.results && <ResultsSection playHover={playHover} selectedUser={selectedUser} handlePermissionChange={handlePermissionChange} />}
      </div>

      {/* شريط التذييل الخاص بأبو حلا */}
      <footer style={{ flexShrink: '0', width: '100%', background: '#ffffff', borderTop: '1px solid #e1e8f0', padding: '16px 20px', boxSizing: 'border-box', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#1a365d', fontSize: '15px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>تم التصميم والتطوير بواسطة:</span>
          <span style={{ color: '#1a365d', background: '#f0f4f8', padding: '4px 12px', borderRadius: '10px' }}>أستاذ عثمان صديق ( أبو حلا )</span>
          <span style={{ color: '#64748b', direction: 'ltr' }}>📞 01149169346</span>
        </p>
      </footer>

    </div>
  );
};

export default DashboardSection;
