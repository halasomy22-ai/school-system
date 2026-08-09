import React, { useState } from 'react';

const UsersPermissionsSection = ({ 
  selectedUser = null, 
  handlePermissionChange = () => {}, 
  playHover = () => {} 
}) => {
  // قائمة المستخدمين النشطين في النظام
  const [systemUsers, setSystemUsers] = useState([
    { id: 1, name: "عثمان صديق", loginName: "admin", role: "أدمن", pin: "123", permissions: { students: true, classes: true, teachers: true, finance: true, results: true } },
    { id: 2, name: "أستاذ محمد", loginName: "mohamed", role: "معلم", pin: "123456", permissions: { students: true, classes: true, teachers: false, finance: false, results: false } }
  ]);

  // نموذج إضافة مستخدم جديد
  const [newUser, setNewUser] = useState({
    name: '',
    loginName: '',
    pin: '',
    role: 'معلم',
    permissions: { students: false, classes: false, teachers: false, finance: false, results: false }
  });

  const handleCheckboxChange = (permissionKey) => {
    setNewUser(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [permissionKey]: !prev.permissions[permissionKey] }
    }));
  };

  const handleExistingUserPermissionChange = (userId, permissionKey) => {
    setSystemUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const updatedPermissions = { ...user.permissions, [permissionKey]: !user.permissions[permissionKey] };
        handlePermissionChange(userId, updatedPermissions);
        return { ...user, permissions: updatedPermissions };
      }
      return user;
    }));
  };

  const saveNewUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.loginName || !newUser.pin) {
      alert("الرجاء ملء كافة الحقول الأساسية!");
      return;
    }
    
    const createdUser = {
      ...newUser,
      id: Date.now(),
      loginName: newUser.loginName.trim().toLowerCase()
    };

    setSystemUsers(prev => [...prev, createdUser]);
    alert(`تم إضافة ${newUser.role}: ${newUser.name} بنجاح وتعيين الصلاحيات!`);
    
    setNewUser({
      name: '', loginName: '', pin: '', role: 'معلم',
      permissions: { students: false, classes: false, teachers: false, finance: false, results: false }
    });
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%', direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* استمارة إضافة مستخدم وصلاحياته */}
      <div style={{ flex: '1 1 400px', background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e1e8f0' }}>
        <h3 style={{ color: '#1a365d', margin: '0 0 20px 0', borderBottom: '2px solid #f0f4f8', paddingBottom: '10px', fontWeight: '800' }}>➕ إضافة مستخدم وتعيين الصلاحيات</h3>
        
        <form onSubmit={saveNewUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#1a365d', fontWeight: '700', marginBottom: '6px' }}>الاسم الكامل</label>
              <input type="text" placeholder="مثال: أستاذ أحمد علي" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' }} required />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#1a365d', fontWeight: '700', marginBottom: '6px' }}>نوع الحساب (الدور)</label>
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff', boxSizing: 'border-box', outline: 'none' }}>
                <option value="معلم">معلم</option>
                <option value="إداري">إداري</option>
                <option value="محاسب">محاسب</option>
                <option value="أدمن">أدمن</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#1a365d', fontWeight: '700', marginBottom: '6px' }}>اسم تسجيل الدخول</label>
              <input type="text" placeholder="ahmed12" value={newUser.loginName} onChange={e => setNewUser({...newUser, loginName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' }} required />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#1a365d', fontWeight: '700', marginBottom: '6px' }}>كلمة المرور (PIN)</label>
              <input type="password" placeholder="••••••" value={newUser.pin} onChange={e => setNewUser({...newUser, pin: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' }} required />
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <label style={{ display: 'block', fontSize: '15px', color: '#1a365d', fontWeight: '800', marginBottom: '12px' }}>🔒 حدد الأقسام المسموح له بدخولها:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.students} onChange={() => handleCheckboxChange('students')} style={{ width: '18px', height: '18px', accentColor: '#1a365d' }} /> إدارة قسم الطلاب</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.classes} onChange={() => handleCheckboxChange('classes')} style={{ width: '18px', height: '18px', accentColor: '#1a365d' }} /> إدارة قسم الفصول</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.teachers} onChange={() => handleCheckboxChange('teachers')} style={{ width: '18px', height: '18px', accentColor: '#1a365d' }} /> إدارة قسم المعلمين</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.finance} onChange={() => handleCheckboxChange('finance')} style={{ width: '18px', height: '18px', accentColor: '#1a365d' }} /> إدارة قسم الحسابات</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.results} onChange={() => handleCheckboxChange('results')} style={{ width: '18px', height: '18px', accentColor: '#1a365d' }} /> إدارة قسم النتيجة</label>
            </div>
          </div>

          <button type="submit" onMouseEnter={playHover} style={{ background: '#1a365d', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'background-color 0.2s' }}>حفظ حساب المستخدم الجديد</button>
        </form>
      </div>

      {/* جدول عرض وتعديل صلاحيات المستخدمين الحاليين */}
      <div style={{ flex: '2 1 500px', background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e1e8f0', overflowX: 'auto' }}>
        <h3 style={{ color: '#1a365d', margin: '0 0 20px 0', borderBottom: '2px solid #f0f4f8', paddingBottom: '10px', fontWeight: '800' }}>👥 مستخدمي النظام وصلاحياتهم النشطة</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #cbd5e1', background: '#f8fafc' }}>
              <th style={{ padding: '12px 10px', color: '#1a365d', fontWeight: '700' }}>الاسم</th>
              <th style={{ padding: '12px 10px', color: '#1a365d', fontWeight: '700' }}>الدور</th>
              <th style={{ padding: '12px 10px', color: '#1a365d', fontWeight: '700', textAlign: 'center' }}>الطلاب</th>
              <th style={{ padding: '12px 10px', color: '#1a365d', fontWeight: '700', textAlign: 'center' }}>الفصول</th>
              <th style={{ padding: '12px 10px', color: '#1a365d', fontWeight: '700', textAlign: 'center' }}>المعلمين</th>
              <th style={{ padding: '12px 10px', color: '#1a365d', fontWeight: '700', textAlign: 'center' }}>الحسابات</th>
              <th style={{ padding: '12px 10px', color: '#1a365d', fontWeight: '700', textAlign: 'center' }}>النتائج</th>
            </tr>
          </thead>
          <tbody>
            {systemUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', height: '50px' }}>
                <td style={{ padding: '12px 10px', fontWeight: '600', color: '#334155' }}>{user.name}</td>
                <td style={{ padding: '12px 10px' }}><span style={{ background: user.role === 'أدمن' ? '#fef3c7' : '#e0f2fe', color: user.role === 'أدمن' ? '#92400e' : '#0369a1', padding: '4px 8px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>{user.role}</span></td>
