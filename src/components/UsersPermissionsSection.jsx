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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%', direction: 'rtl', fontFamily: 'sans-serif' }}>
      
      {/* استمارة إضافة مستخدم وصلاحياته */}
      <div style={{ flex: '1 1 400px', background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #eaddf2' }}>
        <h3 style={{ color: '#3d145a', margin: '0 0 20px 0', borderBottom: '2px solid #f4f0f8', paddingBottom: '10px', fontWeight: '800' }}>➕ إضافة مستخدم وتعيين الصلاحيات</h3>
        
        <form onSubmit={saveNewUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#5c2483', fontWeight: '700', marginBottom: '6px' }}>الاسم الكامل</label>
              <input type="text" placeholder="مثال: أستاذ أحمد علي" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #dcd3e6', boxSizing: 'border-box', outline: 'none' }} required />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#5c2483', fontWeight: '700', marginBottom: '6px' }}>نوع الحساب (الدور)</label>
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #dcd3e6', background: '#fff', boxSizing: 'border-box', outline: 'none' }}>
                <option value="معلم">معلم</option>
                <option value="إداري">إداري</option>
                <option value="محاسب">محاسب</option>
                <option value="أدمن">أدمن</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#5c2483', fontWeight: '700', marginBottom: '6px' }}>اسم تسجيل الدخول</label>
              <input type="text" placeholder="ahmed12" value={newUser.loginName} onChange={e => setNewUser({...newUser, loginName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #dcd3e6', boxSizing: 'border-box', outline: 'none' }} required />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#5c2483', fontWeight: '700', marginBottom: '6px' }}>كلمة المرور (PIN)</label>
              <input type="password" placeholder="••••••" value={newUser.pin} onChange={e => setNewUser({...newUser, pin: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #dcd3e6', boxSizing: 'border-box', outline: 'none' }} required />
            </div>
          </div>

          <div style={{ background: '#fcfaff', padding: '16px', borderRadius: '16px', border: '1px dashed #dcd3e6' }}>
            <label style={{ display: 'block', fontSize: '15px', color: '#3d145a', fontWeight: '800', marginBottom: '12px' }}>🔒 حدد الأقسام المسموح له بدخولها:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.students} onChange={() => handleCheckboxChange('students')} style={{ width: '18px', height: '18px', accentColor: '#5c2483' }} /> إدارة قسم الطلاب</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.classes} onChange={() => handleCheckboxChange('classes')} style={{ width: '18px', height: '18px', accentColor: '#5c2483' }} /> إدارة قسم الفصول</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.teachers} onChange={() => handleCheckboxChange('teachers')} style={{ width: '18px', height: '18px', accentColor: '#5c2483' }} /> إدارة قسم المعلمين</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.finance} onChange={() => handleCheckboxChange('finance')} style={{ width: '18px', height: '18px', accentColor: '#5c2483' }} /> إدارة قسم الحسابات</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={newUser.permissions.results} onChange={() => handleCheckboxChange('results')} style={{ width: '18px', height: '18px', accentColor: '#5c2483' }} /> إدارة قسم النتيجة</label>
            </div>
          </div>

          <button type="submit" style={{ background: '#5c2483', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>حفظ حساب المستخدم الجديد</button>
        </form>
      </div>

      {/* جدول عرض وتعديل صلاحيات المستخدمين الحاليين */}
      <div style={{ flex: '2 1 500px', background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #eaddf2', overflowX: 'auto' }}>
        <h3 style={{ color: '#3d145a', margin: '0 0 20px 0', borderBottom: '2px solid #f4f0f8', paddingBottom: '10px', fontWeight: '800' }}>👥 مستخدمي النظام وصلاحياتهم النشطة</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ background: '#f4f0f8', color: '#3d145a' }}>
              <th style={{ padding: '12px 10px' }}>المستخدم</th>
              <th style={{ padding: '12px 10px' }}>الدور</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>الطلاب</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>الفصول</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>المعلمين</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>الحسابات</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>النتيجة</th>
            </tr>
          </thead>
          <tbody>
            {systemUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f4f0f8' }}>
                <td style={{ padding: '14px 10px', fontWeight: '700', color: '#333' }}>
                  {user.name}
                  <div style={{ fontSize: '12px', color: '#7a6687', fontWeight: 'normal' }}>اسم الدخول: {user.loginName}</div>
                </td>
                <td style={{ padding: '14px 10px' }}>
                  <span style={{ background: user.role === 'أدمن' ? '#fff3cd' : '#e2f0d9', color: user.role === 'أدمن' ? '#856404' : '#385723', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '14px 10px', textAlign: 'center' }}><input type="checkbox" checked={user.permissions?.students || false} onChange={() => handleExistingUserPermissionChange(user.id, 'students')} style={{ accentColor: '#2ecc71', width: '16px', height: '16px' }} /></td>
