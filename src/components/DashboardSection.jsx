import React, { useState } from 'react';
import { addSystemUser, supabase } from '../db';

export default function DashboardSection({ users, setUsers, onBack }) {
  const [newName, setNewName] = useState('');
  const [newLoginName, setNewLoginName] = useState(''); 
  const [newPin, setNewPin] = useState('');             
  const [newRole, setNewRole] = useState('معلم');
  const [selectedUser, setSelectedUser] = useState(null);

  const playHover = () => {
    try {
      const snd = new Audio('https://mixkit.co');
      snd.volume = 0.15; snd.play().catch(() => {});
    } catch(e){}
  };

  const playClick = () => {
    try {
      const snd = new Audio('https://mixkit.co');
      snd.volume = 0.35; snd.play().catch(() => {});
    } catch(e){}
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    playClick();
    if (!newName.trim() || !newLoginName.trim() || !newPin.trim()) {
      alert("الرجاء ملء كافة خانات البيانات");
      return;
    }
    
    const newUser = {
      name: newName, loginName: newLoginName, role: newRole, pin: newPin, 
      permissions: { students: newRole === 'إداري', classes: newRole === 'إداري', teachers: false, finance: newRole === 'محاسب', admin: false }
    };

    try {
      await addSystemUser(newUser);
      const { data } = await supabase.from('users').select('*');
      if (data && data.length > 0) {
        const cloudUsers = data.map(item => ({ id: item.id, ...item.data }));
        const combined = [
          { id: 1, name: "الأستاذ عثمان صديق", loginName: "admin", role: "أدمن", pin: "123", permissions: { students: true, classes: true, teachers: true, finance: true, admin: true } },
          { id: 2, name: "أستاذ محمد", loginName: "محمد", role: "معلم", pin: "123456", permissions: { students: true, classes: true, teachers: false, finance: false, admin: false } }
        ];
        cloudUsers.forEach(cu => {
          if (!combined.some(u => String(u.loginName).toLowerCase() === String(cu.loginName).toLowerCase())) {
            combined.push(cu);
          }
        });
        setUsers(combined);
      }
      setNewName(''); setNewLoginName(''); setNewPin('');
      alert("تمت الإضافة بنجاح");
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDeleteUser = async (userId) => {
    playClick();
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      try {
        await supabase.from('users').delete().eq('id', userId);
        const updated = users.filter(u => u.id !== userId);
        setUsers(updated);
        if (selectedUser?.id === userId) setSelectedUser(null);
        alert("تم الحذف بنجاح");
      } catch (err) {
        alert("فشل الحذف");
      }
    }
  };

  const handlePermissionChange = (perm) => {
    playClick();
    if (!selectedUser) return;
    const updatedUsers = users.map(u => {
      if (u.id === selectedUser.id) {
        const currentPerms = u.permissions || {};
        const updated = { ...u, permissions: { ...currentPerms, [perm]: !currentPerms[perm] } };
        setSelectedUser(updated);
        return updated;
      }
      return u;
    });
    setUsers(updatedUsers);
  };

  const handleSaveChangesAndClose = async () => {
    playClick();
    try {
      alert("جاري المزامنة...");
      for (const u of users) {
        if (u.id !== 1 && u.id !== 2) {
          await supabase.from('users').update({ data: {
            name: u.name, loginName: u.loginName, role: u.role, pin: u.pin, permissions: u.permissions
          }}).eq('id', u.id);
        }
      }
      alert("تم الحفظ بنجاح");
      if(onBack) onBack();
    } catch (err) {
      alert("حدث خطأ أثناء المزامنة");
    }
  };

  const weButtonStyle = {
    padding: '12px 24px', background: 'transparent', color: '#ffffff',
    border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: '25px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s',
    outline: 'none', width: '100%', maxWidth: '220px', textAlign: 'center'
  };

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eaddf2' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #eaddf2', paddingBottom: '15px' }}>
        <h3 style={{ color: '#3d145a', margin: 0, fontWeight: '700' }}>لوحة الإدارة وصلاحيات المستخدمين</h3>
        <button onClick={handleSaveChangesAndClose} onMouseEnter={playHover} style={{ ...weButtonStyle, color: '#5c2483', borderColor: '#5c2483', fontWeight: 'bold' }}>حفظ وإغلاق السجل</button>
      </div>

      <div style={{ background: 'linear-gradient(180deg, #5c2483 0%, #3d145a 100%)', padding: '30px 20px', borderRadius: '24px', marginBottom: '30px', color: '#fff' }}>
        <h4 style={{ marginTop: 0, marginBottom: '20px', fontWeight: '600', fontSize: '15px' }}>تعيين وإضافة موظف جديد</h4>
        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="اسم الموظف" value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: '12px 18px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', flex: '1 1 200px', textAlign: 'right', outline: 'none' }} required />
          <input type="text" placeholder="اسم الدخول" value={newLoginName} onChange={e => setNewLoginName(e.target.value)} style={{ padding: '12px 18px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', flex: '1 1 150px', textAlign: 'right', outline: 'none' }} required />
          <input type="password" placeholder="كلمة المرور" value={newPin} onChange={e => setNewPin(e.target.value)} style={{ padding: '12px 18px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', flex: '1 1 150px', textAlign: 'right', outline: 'none' }} required />
          <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ padding: '12px 18px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.3)', background: '#5c2483', color: '#fff', outline: 'none', cursor: 'pointer' }}>
            <option value="معلم">معلم</option>
            <option value="محاسب">محاسب</option>
            <option value="إداري">إداري</option>
          </select>
          <button type="submit" onMouseEnter={playHover} style={weButtonStyle}>إضافة مستخدم</button>
        </form>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
        <div style={{ background: '#f4f0f8', padding: '20px', borderRadius: '24px', flex: '1 1 300px', border: '1px solid #eaddf2' }}>
          <h4 style={{ marginTop: 0, color: '#3d145a', borderBottom: '1px solid #eaddf2', paddingBottom: '10px', fontWeight: '700' }}>الموظفون المسجلون</h4>
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {users.map(u => (
              <div key={u.id} onClick={() => { playClick(); setSelectedUser(u); }} onMouseEnter={playHover} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #eaddf2', borderRadius: '20px', margin: '10px 0', cursor: 'pointer', backgroundColor: selectedUser?.id === u.id ? '#ffffff' : 'transparent', transition: 'all 0.2s' }}>
                <div>
                  <strong style={{ color: '#3d145a' }}>{u.name}</strong>
                  <span style={{ fontSize: '11px', color: '#7a6687', marginRight: '8px', background: '#eaddf2', padding: '2px 8px', borderRadius: '12px' }}>{u.role}</span>
                </div>
                {String(u.loginName) !== 'admin' && String(u.loginName) !== 'محمد' && (
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id); }} onMouseEnter={playHover} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px 14px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>حذف</button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '24px', flex: '1 1 300px', border: '1px solid #eaddf2' }}>
          <h4 style={{ marginTop: 0, color: '#3d145a', borderBottom: '1px solid #eaddf2', paddingBottom: '10px', fontWeight: '700' }}>لوحة الصلاحيات والبيانات</h4>
          {selectedUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: 'linear-gradient(90deg, #f4f0f8 0%, #ffffff 100%)', padding: '14px', borderRadius: '16px', borderRight: '4px solid #5c2483' }}>
                <h5 style={{ margin: 0, color: '#5c2483', fontSize: '14px' }}>المستخدم النشط: {selectedUser.name}</h5>
                <p style={{ direction: 'ltr', textAlign: 'right', margin: '5px 0 0 0', fontSize: '12px', color: '#7a6687' }}>User: {selectedUser.loginName} | Pin: {selectedUser.pin}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { key: 'students', label: 'دخول وإدارة قسم الطلاب' },
                  { key: 'classes', label: 'دخول وإدارة قسم الفصول' },
                  { key: 'teachers', label: 'دخول وإدارة قسم المعلمين' },
                  { key: 'finance', label: 'دخول الأقسام المالية والحسابات' },
                  { key: 'admin', label: 'صلاحية الأدمن والإدارة العليا' }
                ].map(item => (
                  <label key={item.key} onMouseEnter={playHover} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px 16px', background: '#f4f0f8', borderRadius: '20px' }}>
                    <input 
                      type="checkbox" 
                      checked={!!selectedUser.permissions?.[item.key]} 
                      onChange={(e) => handlePermissionChange(item.key, e.target.checked)}
                      style={{ accentColor: '#5c2483', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#3d145a', fontWeight: '500' }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#7a6687', fontSize: '14px', margin: '20px 0' }}>برجاء اختيار مستخدم لعرض صلاحياته</p>
          )}
        </div>

              
