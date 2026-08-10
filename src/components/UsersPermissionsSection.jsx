import React, { useState } from 'react';

export default function UsersPermissionsSection({ handlePermissionChange = () => {}, playHover = () => {} }) {
  const [systemUsers, setSystemUsers] = useState([
    { id: 1, name: "عثمان صديق", loginName: "admin", role: "أدمن", pin: "123", permissions: { students: true, classes: true, teachers: true, finance: true, results: true } },
    { id: 2, name: "أستاذ محمد", loginName: "mohamed", role: "معلم", pin: "123456", permissions: { students: true, classes: true, teachers: false, finance: false, results: false } }
  ]);

  const [newUser, setNewUser] = useState({
    name: '', loginName: '', pin: '', role: 'معلم',
    permissions: { students: false, classes: false, teachers: false, finance: false, results: false }
  });

  const handleCheckboxChange = (key) => {
    setNewUser(p => ({ ...p, permissions: { ...p.permissions, [key]: !p.permissions[key] } }));
  };

  const handleExistingChange = (userId, key) => {
    setSystemUsers(p => p.map(u => {
      if (u.id === userId) {
        const updated = { ...u.permissions, [key]: !u.permissions[key] };
        handlePermissionChange(userId, updated);
        return { ...u, permissions: updated };
      }
      return u;
    }));
  };

  const saveNewUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.loginName || !newUser.pin) return alert("الرجاء ملء حقول البيانات!");
    setSystemUsers(p => [...p, { ...newUser, id: Date.now(), loginName: newUser.loginName.trim().toLowerCase() }]);
    alert(`تم إضافة ${newUser.role} بنجاح!`);
    setNewUser({ name: '', loginName: '', pin: '', role: 'معلم', permissions: { students: false, classes: false, teachers: false, finance: false, results: false } });
  };

  // دالة حذف المستخدم بعد تأكيد الإجراء
  const handleDeleteUser = (userId, userName) => {
    const confirmDelete = window.confirm(`هل أنت متأكد من رغبتك في حذف المستخدم "${userName}" نهائياً من النظام؟`);
    if (confirmDelete) {
      setSystemUsers(p => p.filter(u => u.id !== userId));
      alert("تم حذف المستخدم بنجاح!");
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      {/* استمارة إضافة مستخدم جديد */}
      <div style={{ flex: '1 1 350px', background: '#ffffff', padding: '25px', borderRadius: '20px', border: '1px solid #e1e8f0', boxShadow: '0 8px 20px rgba(0,0,0,0.02)' }}>
        <h3 style={{ color: '#1a365d', margin: '0 0 15px 0', borderBottom: '2px solid #f0f4f8', paddingBottom: '10px', fontWeight: '800' }}>➕ إضافة مستخدم وتعيين الصلاحيات</h3>
        <form onSubmit={saveNewUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="الاسم الكامل" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} required />
          <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none' }}>
            <option value="معلم">معلم</option><option value="إداري">إداري</option><option value="محاسب">محاسب</option><option value="أدمن">أدمن</option>
          </select>
          <input type="text" placeholder="اسم تسجيل الدخول" value={newUser.loginName} onChange={e => setNewUser({ ...newUser, loginName: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} required />
          <input type="password" placeholder="كلمة المرور (PIN)" value={newUser.pin} onChange={e => setNewUser({ ...newUser, pin: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} required />
          
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#1a365d', fontWeight: '800', marginBottom: '8px' }}>🔒 حدد الأقسام المسموحة:</label>
            {['students', 'classes', 'teachers', 'finance', 'results'].map(key => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', marginBottom: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={newUser.permissions[key]} onChange={() => handleCheckboxChange(key)} style={{ accentColor: '#1a365d' }} /> 
                {key === 'students' ? 'قسم الطلاب' : key === 'classes' ? 'قسم الفصول' : key === 'teachers' ? 'قسم المعلمين' : key === 'finance' ? 'قسم الحسابات' : 'قسم النتيجة'}
              </label>
            ))}
          </div>
          <button type="submit" onMouseEnter={playHover} style={{ background: '#1a365d', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>حفظ المستخدم الجديد</button>
        </form>
      </div>

      {/* جدول عرض وتعديل الصلاحيات للممستخدمين الحاليين */}
      <div style={{ flex: '2 1 450px', background: '#ffffff', padding: '25px', borderRadius: '20px', border: '1px solid #e1e8f0', overflowX: 'auto', boxShadow: '0 8px 20px rgba(0,0,0,0.02)' }}>
        <h3 style={{ color: '#1a365d', margin: '0 0 15px 0', borderBottom: '2px solid #f0f4f8', paddingBottom: '10px', fontWeight: '800' }}>👥 صلاحيات المستخدمين النشطة</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', minWidth: '550px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #cbd5e1', background: '#f8fafc' }}>
              <th style={{ padding: '10px', color: '#1a365d', fontWeight: '700' }}>الاسم</th>
              <th style={{ padding: '10px', color: '#1a365d', fontWeight: '700' }}>الدور</th>
              {['الطلاب', 'الفصول', 'المعلمين', 'الحسابات', 'النتائج'].map(h => <th key={h} style={{ padding: '10px', color: '#1a365d', fontWeight: '700', textAlign: 'center' }}>{h}</th>)}
              <th style={{ padding: '10px', color: '#e74c3c', fontWeight: '700', textAlign: 'center' }}>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {systemUsers.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px', fontWeight: '600', color: '#334155' }}>{u.name}</td>
                <td style={{ padding: '10px' }}><span style={{ background: u.role === 'أدمن' ? '#fef3c7' : '#e0f2fe', color: u.role === 'أدمن' ? '#92400e' : '#0369a1', padding: '3px 6px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{u.role}</span></td>
                {['students', 'classes', 'teachers', 'finance', 'results'].map(k => (
                  <td key={k} style={{ padding: '10px', textAlign: 'center' }}>
                    <input type="checkbox" checked={u.permissions?.[k] || false} onChange={() => handleExistingChange(u.id, k)} style={{ accentColor: '#1a365d' }} />
                  </td>
                ))}
                {/* زر الحذف الفوري المضاف */}
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDeleteUser(u.id, u.name)} 
                    style={{ background: '#fdf2f2', color: '#e74c3c', border: '1px solid #fde8e8', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.target.style.background = '#fde8e8'; playHover(); }}
                    onMouseLeave={(e) => e.target.style.background = '#fdf2f2'}
                  >
                    🗑️ حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
